"""
视频服务层
"""
from fastapi import HTTPException, status
from app.core.supabase import supabase_admin


class VideoService:

    @staticmethod
    def get_video_list(
        page: int = 1, page_size: int = 12,
        category_slug: str | None = None, sort: str = "latest",
    ) -> dict:
        if supabase_admin is None:
            return {"data": [], "total": 0, "page": page, "page_size": page_size, "total_pages": 0}

        try:
            query = (
                supabase_admin.table("videos")
                .select("*, categories(*)", count="exact")
                .eq("is_published", True)
            )

            if category_slug:
                cat = supabase_admin.table("categories").select("id").eq("slug", category_slug).execute()
                if cat.data:
                    query = query.eq("category_id", cat.data[0]["id"])

            if sort == "popular":
                query = query.order("view_count", desc=True)
            elif sort == "oldest":
                query = query.order("created_at", asc=True)
            else:
                query = query.order("created_at", desc=True)

            offset = (page - 1) * page_size
            result = query.range(offset, offset + page_size - 1).execute()

            total = result.count or 0

            videos = []
            for row in (result.data or []):
                cat_data = row.pop("categories", None)
                videos.append({**row, "category": cat_data})

            return {
                "data": videos, "total": total,
                "page": page, "page_size": page_size,
                "total_pages": max(1, (total + page_size - 1) // page_size),
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"查询失败: {str(e)}")

    @staticmethod
    def get_video_detail(video_id: str) -> dict:
        if supabase_admin is None:
            raise HTTPException(status_code=500, detail="服务未配置")

        try:
            result = (
                supabase_admin.table("videos")
                .select("*, categories(*)")
                .eq("id", video_id)
                .single()
                .execute()
            )

            if not result.data:
                raise HTTPException(status_code=404, detail="视频不存在")

            row = result.data
            cat_data = row.pop("categories", None)
            row["category"] = cat_data

            supabase_admin.table("videos").update(
                {"view_count": (row.get("view_count", 0) + 1)}
            ).eq("id", video_id).execute()

            return row
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"查询失败: {str(e)}")

    @staticmethod
    def get_categories() -> list:
        if supabase_admin is None:
            return []

        try:
            result = (
                supabase_admin.table("categories")
                .select("*")
                .order("sort_order", asc=True)
                .execute()
            )
            return result.data or []
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"查询失败: {str(e)}")


video_service = VideoService()
