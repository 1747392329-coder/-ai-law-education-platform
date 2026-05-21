"""
收藏接口
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.schemas.common import ResponseBase, PaginatedResponse
from app.services.favorite_service import favorite_service
from app.api.deps import get_current_user, pagination_params

router = APIRouter()


class ToggleFavoriteRequest(BaseModel):
    video_id: str


@router.post("/toggle", response_model=ResponseBase)
async def toggle_favorite(req: ToggleFavoriteRequest, user: dict = Depends(get_current_user)):
    """收藏/取消收藏"""
    result = favorite_service.toggle_favorite(user["id"], req.video_id)
    return ResponseBase(code=200, message="success", data=result)


@router.get("", response_model=PaginatedResponse)
async def get_favorites(
    user: dict = Depends(get_current_user),
    pagination: dict = Depends(pagination_params),
):
    """获取我的收藏列表"""
    result = favorite_service.get_user_favorites(
        user_id=user["id"],
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
