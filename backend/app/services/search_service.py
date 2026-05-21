"""
搜索服务层
基于 PostgreSQL 的 ILIKE 模糊搜索（后期可升级为全文搜索）
"""
from app.core.supabase import supabase_admin


class SearchService:

    @staticmethod
    def search_videos(
        query: str,
        page: int = 1,
        page_size: int = 12,
    ) -> dict:
        """搜索视频（标题 + 描述模糊匹配）"""
        if supabase_admin is None or not query.strip():
            return {"data": [], "total": 0, "page": page, "page_size": page_size, "total_pages": 0}

        search_term = f"%{query.strip()}%"

        # 使用 PostgreSQL 的 ILIKE 进行模糊搜索
        result = (
            supabase_admin.table("videos")
            .select("*, categories(*)", count="exact")
            .eq("is_published", True)
            .or_(f"title.ilike.{search_term},description.ilike.{search_term}")
            .order("created_at", desc=True)
            .range((page - 1) * page_size, page * page_size - 1)
            .execute()
        )

        total = result.count or 0
        total_pages = max(1, (total + page_size - 1) // page_size)

        videos = []
        for row in (result.data or []):
            cat_data = row.pop("categories", None)
            videos.append({**row, "category": cat_data})

        return {
            "data": videos,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
        }


search_service = SearchService()
