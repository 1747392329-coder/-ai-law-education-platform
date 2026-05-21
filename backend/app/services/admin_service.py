"""
管理后台服务层
视频上传、管理、数据统计
"""
from fastapi import HTTPException, status
from app.core.supabase import supabase_admin


class AdminService:

    @staticmethod
    def create_video(data: dict) -> dict:
        """创建视频记录"""
        if supabase_admin is None:
            raise HTTPException(status_code=500, detail="服务未配置")

        result = supabase_admin.table("videos").insert(data).execute()
        if not result.data:
            raise HTTPException(status_code=400, detail="创建失败")
        return result.data[0]

    @staticmethod
    def update_video(video_id: str, data: dict) -> dict:
        """更新视频信息"""
        if supabase_admin is None:
            raise HTTPException(status_code=500, detail="服务未配置")

        result = (
            supabase_admin.table("videos")
            .update(data)
            .eq("id", video_id)
            .execute()
        )
        if not result.data:
            raise HTTPException(status_code=404, detail="视频不存在")
        return result.data[0]

    @staticmethod
    def delete_video(video_id: str) -> None:
        """删除视频"""
        if supabase_admin is None:
            raise HTTPException(status_code=500, detail="服务未配置")

        supabase_admin.table("videos").delete().eq("id", video_id).execute()

    @staticmethod
    def get_all_videos(page: int = 1, page_size: int = 20) -> dict:
        """获取所有视频（含未发布的）- 管理员视图"""
        if supabase_admin is None:
            return {"data": [], "total": 0, "page": page, "page_size": page_size, "total_pages": 0}

        result = (
            supabase_admin.table("videos")
            .select("*, categories(*)", count="exact")
            .order("created_at", desc=True)
            .range((page - 1) * page_size, page * page_size - 1)
            .execute()
        )

        total = result.count or 0

        videos = []
        for row in (result.data or []):
            cat = row.pop("categories", None)
            videos.append({**row, "category": cat})

        return {
            "data": videos,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": max(1, (total + page_size - 1) // page_size),
        }

    @staticmethod
    def get_stats() -> dict:
        """获取仪表盘统计数据"""
        if supabase_admin is None:
            return {}

        # 各表计数
        video_count = supabase_admin.table("videos").select("id", count="exact").eq("is_published", True).execute()
        user_count = supabase_admin.table("user_profiles").select("id", count="exact").execute()
        total_views = supabase_admin.table("videos").select("view_count").execute()

        total = sum(v.get("view_count", 0) for v in (total_views.data or []))

        return {
            "total_videos": video_count.count or 0,
            "total_users": user_count.count or 0,
            "total_views": total,
        }


admin_service = AdminService()
