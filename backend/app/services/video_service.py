"""
视频服务层
处理视频列表、详情、分类查询
"""
from fastapi import HTTPException, status
from app.core.supabase import supabase_admin


class VideoService:

    @staticmethod
    def get_video_list(
        page: int = 1,
        page_size: int = 12,
        category_slug: str | None = None,
        sort: str = "latest",
    ) -> dict:
        """
        获取视频列表（分页 + 可选分类筛选 + 排序）
        sort: latest / popular / oldest
        """
        if supabase_admin is None:
            return {"data": [], "total": 0, "page": page, "page_size": page_size, "total_pages": 0}

        # 构建查询
        query = (
            supabase_admin.table("videos")
            .select("*, categories(*)", count="exact")
            .eq("is_published", True)
        )

        # 分类筛选
        if category_slug:
            # 先查分类 ID
            cat = (
                supabase_admin.table("categories")
                .select("id")
                .eq("slug", category_slug)
                .execute()
            )
            if cat.data:
                query = query.eq("category_id", cat.data[0]["id"])

        # 排序
        if sort == "popular":
            query = query.order("view_count", desc=True)
        elif sort == "oldest":
            query = query.order("created_at", asc=True)
        else:  # latest
            query = query.order("created_at", desc=True)

        # 分页
        offset = (page - 1) * page_size
        result = query.range(offset, offset + page_size - 1).execute()

        total = result.count or 0
        total_pages = max(1, (total + page_size - 1) // page_size)

        # 格式化数据
        videos = []
        for row in (result.data or []):
            cat_data = row.pop("categories", None)
            videos.append({
                **row,
                "category": cat_data,
            })

        return {
            "data": videos,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
        }

    @staticmethod
    def get_video_detail(video_id: str) -> dict:
        """获取视频详情"""
        if supabase_admin is None:
            raise HTTPException(status_code=500, detail="服务未配置")

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

        # 增加播放量（简单实现，忽略并发问题）
        supabase_admin.table("videos").update(
            {"view_count": (row.get("view_count", 0) + 1)}
        ).eq("id", video_id).execute()

        return row

    @staticmethod
    def get_categories() -> list:
        """获取所有分类"""
        if supabase_admin is None:
            return []

        result = (
            supabase_admin.table("categories")
            .select("*")
            .order("sort_order", asc=True)
            .execute()
        )

        return result.data or []


video_service = VideoService()
