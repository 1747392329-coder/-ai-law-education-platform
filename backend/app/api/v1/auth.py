"""
认证接口
处理用户的注册、登录、Token 刷新、获取个人信息
"""
from fastapi import APIRouter, Depends
from app.schemas.user import RegisterRequest, LoginRequest, AuthResponse, UserProfileResponse
from app.schemas.common import ResponseBase
from app.services.auth_service import auth_service
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/register", response_model=ResponseBase)
async def register(req: RegisterRequest):
    """
    用户注册
    ---
    使用邮箱 + 密码注册新账号
    """
    # 基础验证
    if len(req.password) < 6:
        return ResponseBase(code=400, message="密码至少需要6位")

    result = auth_service.register(req.email, req.password, req.nickname)
    return ResponseBase(code=200, message="注册成功", data=result)


@router.post("/login", response_model=ResponseBase)
async def login(req: LoginRequest):
    """
    用户登录
    ---
    使用邮箱 + 密码登录，返回 JWT Token
    """
    if not req.email or not req.password:
        return ResponseBase(code=400, message="邮箱和密码不能为空")

    result = auth_service.login(req.email, req.password)
    return ResponseBase(code=200, message="登录成功", data=result)


@router.get("/me", response_model=ResponseBase)
async def get_me(current_user: dict = Depends(get_current_user)):
    """
    获取当前用户信息
    ---
    需要携带有效的 JWT Token（Authorization: Bearer xxx）
    """
    user_id = current_user.get("id")
    profile = auth_service.get_user_profile(user_id)
    return ResponseBase(code=200, message="success", data=profile)
