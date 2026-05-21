"""
认证服务层
处理用户注册、登录、Token 刷新等业务逻辑
注册使用 service_role（跳过邮件确认），登录使用普通客户端
"""
from fastapi import HTTPException, status
from app.core.supabase import supabase, supabase_admin
from app.core.config import settings


class AuthService:

    @staticmethod
    def register(email: str, password: str, nickname: str | None = None) -> dict:
        """
        用户注册
        使用 service_role 客户端，跳过邮件确认直接激活用户
        """
        if supabase_admin is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="服务未配置",
            )

        try:
            # 使用 service_role 创建用户，email_confirm: true 跳过邮箱验证
            auth_response = supabase_admin.auth.admin.create_user({
                "email": email,
                "password": password,
                "email_confirm": True,  # 跳过邮箱验证
                "user_metadata": {"nickname": nickname or email.split("@")[0]},
            })

            user = auth_response.user
            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="注册失败，请稍后再试",
                )

            # 创建用户资料
            supabase_admin.table("user_profiles").upsert({
                "id": user.id,
                "nickname": nickname or email.split("@")[0],
                "role": "user",
            }).execute()

            return {
                "access_token": "",  # admin.create_user 不返回 session
                "refresh_token": "",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "nickname": nickname or email.split("@")[0],
                    "avatar_url": None,
                    "role": "user",
                    "phone": None,
                },
            }

        except HTTPException:
            raise
        except Exception as e:
            error_msg = str(e)
            if "already been registered" in error_msg or "already exists" in error_msg:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="该邮箱已被注册",
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"注册失败: {error_msg}",
            )

    @staticmethod
    def login(email: str, password: str) -> dict:
        """
        用户登录
        使用普通客户端，返回 session token
        """
        if supabase is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="服务未配置",
            )

        try:
            # 登录用普通客户端（anon key），获取 session
            auth_response = supabase.auth.sign_in_with_password({
                "email": email,
                "password": password,
            })

            user = auth_response.user
            session = auth_response.session

            if user is None or session is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="邮箱或密码错误",
                )

            # 查询/补建 profile 用 admin 客户端（绕过 RLS）
            profile = (
                supabase_admin.table("user_profiles")
                .select("*")
                .eq("id", user.id)
                .execute()
            )

            if not profile.data:
                supabase_admin.table("user_profiles").upsert({
                    "id": user.id,
                    "nickname": user.user_metadata.get("nickname", email.split("@")[0]),
                    "role": "user",
                }).execute()
                profile_data = {}
            else:
                profile_data = profile.data[0]

            return {
                "access_token": session.access_token,
                "refresh_token": session.refresh_token,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "nickname": profile_data.get("nickname"),
                    "avatar_url": profile_data.get("avatar_url"),
                    "role": profile_data.get("role", "user"),
                    "phone": profile_data.get("phone"),
                },
            }

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"登录失败: {str(e)}",
            )

    @staticmethod
    def get_user_profile(user_id: str) -> dict:
        """获取用户个人信息（使用 admin 客户端绕过 RLS）"""
        if supabase_admin is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="服务未配置",
            )

        profile = (
            supabase_admin.table("user_profiles")
            .select("*")
            .eq("id", user_id)
            .execute()
        )

        if not profile.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用户不存在",
            )

        return profile.data[0]


auth_service = AuthService()
