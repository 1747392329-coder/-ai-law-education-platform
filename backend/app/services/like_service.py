"""
点赞服务层
"""
from fastapi import HTTPException, status
from app.core.supabase import supabase_admin
from app.services.points_service import points_service


class LikeService:

    @staticmethod
    def toggle_like(user_id: str, video_id: str) -> dict:
        """
        切换点赞状态（点赞/取消点赞）
        返回: {"liked": True/False, "like_count": int}
        """
        if supabase_admin is None:
            raise HTTPException(status_code=500, detail="服务未配置")

        # 检查是否已点赞
        existing = (
            supabase_admin.table("video_likes")
            .select("id")
            .eq("user_id", user_id)
            .eq("video_id", video_id)
            .execute()
        )

        if existing.data:
            # 已点赞 → 取消
            supabase_admin.table("video_likes").delete().eq("id", existing.data[0]["id"]).execute()
            liked = False
        else:
            # 未点赞 → 点赞
            supabase_admin.table("video_likes").insert({
                "user_id": user_id,
                "video_id": video_id,
            }).execute()
            liked = True
            # 自动奖励积分
            try:
                points_service.add_points(user_id, "like_video")
            except Exception:
                pass  # 积分奖励失败不影响点赞

        # 更新视频点赞计数
        count_result = (
            supabase_admin.table("video_likes")
            .select("id", count="exact")
            .eq("video_id", video_id)
            .execute()
        )
        like_count = count_result.count or 0
        supabase_admin.table("videos").update({"like_count": like_count}).eq("id", video_id).execute()

        return {"liked": liked, "like_count": like_count}

    @staticmethod
    def check_liked(user_id: str, video_id: str) -> bool:
        """检查用户是否已点赞某个视频"""
        if supabase_admin is None:
            return False

        result = (
            supabase_admin.table("video_likes")
            .select("id")
            .eq("user_id", user_id)
            .eq("video_id", video_id)
            .execute()
        )
        return len(result.data or []) > 0


like_service = LikeService()
