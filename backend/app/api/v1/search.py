"""
搜索接口
"""
from fastapi import APIRouter, Query, Depends
from app.schemas.common import PaginatedResponse
from app.services.search_service import search_service
from app.api.deps import pagination_params

router = APIRouter()


@router.get("", response_model=PaginatedResponse)
async def search(
    q: str = Query("", description="搜索关键词"),
    pagination: dict = Depends(pagination_params),
):
    """
    视频搜索
    ---
    在视频标题和描述中模糊搜索
    """
    result = search_service.search_videos(
        query=q,
        page=pagination["page"],
        page_size=pagination["page_size"],
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
