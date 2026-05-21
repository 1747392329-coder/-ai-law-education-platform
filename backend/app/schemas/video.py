"""
视频相关请求/响应 Schema
"""
from typing import Optional, List
from pydantic import BaseModel


class CategoryResponse(BaseModel):
    """分类信息"""
    id: int
    name: str
    slug: str
    icon: Optional[str] = None
    description: Optional[str] = None
    sort_order: int = 0


class VideoResponse(BaseModel):
    """视频信息响应"""
    id: str
    title: str
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    video_url: str
    duration: int = 0
    category_id: Optional[int] = None
    tags: List[str] = []
    view_count: int = 0
    like_count: int = 0
    is_published: bool = False
    created_at: Optional[str] = None
    # 关联数据
    category: Optional[CategoryResponse] = None


class VideoDetailResponse(VideoResponse):
    """视频详情（比列表多关联信息）"""
    is_liked: bool = False
    is_favorited: bool = False
