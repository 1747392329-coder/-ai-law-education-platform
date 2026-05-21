"""
API v1 路由聚合
将所有子路由统一注册到这里
"""
from fastapi import APIRouter
from app.api.v1 import auth, videos, categories, search, favorites, likes, points, admin

api_router = APIRouter()

# 注册各模块路由（添加路径前缀和标签）
api_router.include_router(auth.router, prefix="/auth", tags=["认证"])
api_router.include_router(videos.router, prefix="/videos", tags=["视频"])
api_router.include_router(categories.router, prefix="/categories", tags=["分类"])
api_router.include_router(search.router, prefix="/search", tags=["搜索"])
api_router.include_router(favorites.router, prefix="/favorites", tags=["收藏"])
api_router.include_router(likes.router, prefix="/likes", tags=["点赞"])
api_router.include_router(points.router, prefix="/points", tags=["积分"])
api_router.include_router(admin.router, prefix="/admin", tags=["管理后台"])
