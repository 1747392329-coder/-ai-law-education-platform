"""
收藏服务层
"""
from fastapi import HTTPException, status
from app.core.supabase import supabase_admin
from app.services.points_service import points_service


class FavoriteService:

    @staticmethod
    def toggle_favorite(user_id: str, video_id: str) -> dict:
        """
        切换收藏状态
        返回: {"favorited": True/False}
        """
        if supabase_admin is None:
            raise HTTPException(status_code=500, detail="服务未配置")

        existing = (
            supabase_admin.table("favorites")
            .select("id")
            .eq("user_id", user_id)
            .eq("video_id", video_id)
            .execute()
        )

        if existing.data:
            supabase_admin.table("favorites").delete().eq("id", existing.data[0]["id"]).execute()
            favorited = False
        else:
            supabase_admin.table("favorites").insert({
                "user_id": user_id,
                "video_id": video_id,
            }).execute()
            favorited = True
            try:
                points_service.add_points(user_id, "favorite")
            except Exception:
                pass

        return {"favorited": favorited}

    @staticmethod
    def get_user_favorites(user_id: str, page: int = 1, page_size: int = 12) -> dict:
        """获取用户收藏列表"""
        if supabase_admin is None:
            return {"data": [], "total": 0, "page": page, "page_size": page_size, "total_pages": 0}

        result = (
            supabase_admin.table("favorites")
            .select("video_id, videos(*, categories(*))", count="exact")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .range((page - 1) * page_size, page * page_size - 1)
            .execute()
        )

        total = result.count or 0
        total_pages = max(1, (total + page_size - 1) // page_size)

        videos = []
        for row in (result.data or []):
            video_data = row.get("videos")
            if video_data:
                cat = video_data.pop("categories", None)
                video_data["category"] = cat
                videos.append(video_data)

        return {
            "data": videos,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
        }

    @staticmethod
    def check_favorited(user_id: str, video_id: str) -> bool:
        """检查用户是否已收藏"""
        if supabase_admin is None:
            return False

        result = (
            supabase_admin.table("favorites")
            .select("id")
            .eq("user_id", user_id)
            .eq("video_id", video_id)
            .execute()
        )
        return len(result.data or []) > 0


favorite_service = FavoriteService()
