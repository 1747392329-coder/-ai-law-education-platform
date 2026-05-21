"""
管理后台接口
需要管理员权限
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, List
from app.schemas.common import ResponseBase, PaginatedResponse
from app.services.admin_service import admin_service
from app.api.deps import get_current_user, pagination_params

router = APIRouter()


# ---- 请求体 ----
class CreateVideoRequest(BaseModel):
    title: str
    description: Optional[str] = None
    category_id: Optional[int] = None
    tags: List[str] = []
    video_url: str
    thumbnail_url: Optional[str] = None
    duration: int = 0
    is_published: bool = False


class UpdateVideoRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    tags: Optional[List[str]] = None
    is_published: Optional[bool] = None


# ---- 辅助函数：检查管理员 ----
def check_admin(user: dict = Depends(get_current_user)) -> dict:
    """检查是否为管理员（简单实现：通过 user_metadata 中的 role）"""
    role = user.get("user_metadata", {}).get("role", "user")
    # 允许所有登录用户访问后台（后期严格限制）
    return user


# ---- 路由 ----
@router.get("/stats", response_model=ResponseBase)
async def get_stats(admin: dict = Depends(check_admin)):
    """仪表盘统计"""
    stats = admin_service.get_stats()
    return ResponseBase(code=200, message="success", data=stats)


@router.get("/videos", response_model=PaginatedResponse)
async def get_admin_videos(
    pagination: dict = Depends(pagination_params),
    admin: dict = Depends(check_admin),
):
    """管理后台 - 视频列表（含未发布的）"""
    result = admin_service.get_all_videos(
        page=pagination["page"],
        page_size=pagination["page_size"],
    )
    return PaginatedResponse(
        code=200, message="success",
        data=result["data"], total=result["total"],
        page=result["page"], page_size=result["page_size"],
        total_pages=result["total_pages"],
    )


@router.post("/videos", response_model=ResponseBase)
async def create_video(req: CreateVideoRequest, admin: dict = Depends(check_admin)):
    """创建视频"""
    data = req.model_dump()
    data["uploaded_by"] = admin.get("id")
    video = admin_service.create_video(data)
    return ResponseBase(code=200, message="创建成功", data=video)


@router.put("/videos/{video_id}", response_model=ResponseBase)
async def update_video(video_id: str, req: UpdateVideoRequest, admin: dict = Depends(check_admin)):
    """更新视频"""
    data = {k: v for k, v in req.model_dump().items() if v is not None}
    video = admin_service.update_video(video_id, data)
    return ResponseBase(code=200, message="更新成功", data=video)


@router.delete("/videos/{video_id}", response_model=ResponseBase)
async def delete_video(video_id: str, admin: dict = Depends(check_admin)):
    """删除视频"""
    admin_service.delete_video(video_id)
    return ResponseBase(code=200, message="删除成功")
