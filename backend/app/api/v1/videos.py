"""
视频接口
视频列表、视频详情
"""
from fastapi import APIRouter, Query, Depends
from app.schemas.common import ResponseBase, PaginatedResponse
from app.services.video_service import video_service
from app.api.deps import pagination_params

router = APIRouter()


@router.get("", response_model=PaginatedResponse)
async def get_videos(
    category: str | None = Query(None, description="分类 slug"),
    sort: str = Query("latest", description="排序: latest / popular / oldest"),
    pagination: dict = Depends(pagination_params),
):
    """
    获取视频列表
    ---
    - 支持按分类筛选
    - 支持排序（最新/最热/最旧）
    - 分页返回
    """
    result = video_service.get_video_list(
        page=pagination["page"],
        page_size=pagination["page_size"],
        category_slug=category,
        sort=sort,
    )
    return PaginatedResponse(
        code=200,
        message="success",
        data=result["data"],
        total=result["total"],
        page=result["page"],
        page_size=result["page_size"],
        total_pages=result["total_pages"],
    )


@router.get("/{video_id}", response_model=ResponseBase)
async def get_video_detail(video_id: str):
    """
    获取视频详情
    ---
    包含完整的视频信息和关联分类
    """
    detail = video_service.get_video_detail(video_id)
    return ResponseBase(code=200, message="success", data=detail)
