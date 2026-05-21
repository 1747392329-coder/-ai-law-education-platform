"""
点赞接口
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.schemas.common import ResponseBase
from app.services.like_service import like_service
from app.api.deps import get_current_user

router = APIRouter()


class ToggleLikeRequest(BaseModel):
    video_id: str


@router.post("/toggle", response_model=ResponseBase)
async def toggle_like(req: ToggleLikeRequest, user: dict = Depends(get_current_user)):
    """点赞/取消点赞"""
    result = like_service.toggle_like(user["id"], req.video_id)
    return ResponseBase(code=200, message="success", data=result)
