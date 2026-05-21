"""
分类接口
获取所有视频分类
"""
from fastapi import APIRouter
from app.schemas.common import ResponseBase
from app.services.video_service import video_service

router = APIRouter()


@router.get("", response_model=ResponseBase)
async def get_categories():
    """
    获取所有视频分类
    ---
    返回所有启用的分类列表，按 sort_order 排序
    """
    categories = video_service.get_categories()
    return ResponseBase(code=200, message="success", data=categories)
