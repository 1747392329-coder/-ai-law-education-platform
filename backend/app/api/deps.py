"""
API 依赖项模块
提供路由中使用的可复用依赖（权限检查、分页参数等）
"""
from typing import Optional
from fastapi import Query, Depends, HTTPException, status
from app.core.security import get_current_user


# ========== 分页参数 ==========
async def pagination_params(
    page: int = Query(1, ge=1, description="页码，从1开始"),
    page_size: int = Query(12, ge=1, le=50, description="每页数量"),
) -> dict:
    """分页参数依赖 - 自动计算 offset"""
    return {
        "page": page,
        "page_size": page_size,
        "offset": (page - 1) * page_size,
        "limit": page_size,
    }


# ========== 管理员权限检查 ==========
async def get_admin_user(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    验证当前用户是否为管理员
    必须在 get_current_user 之后使用
    """
    # TODO: 实际项目中从数据库查询用户角色
    # 当前通过 Supabase Auth 的 user_metadata 判断
    role = current_user.get("user_metadata", {}).get("role", "user")
    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="需要管理员权限",
        )
    return current_user
