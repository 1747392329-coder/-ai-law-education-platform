"""
Supabase 客户端模块
统一管理 Supabase 连接，供所有服务层使用
- supabase: 普通客户端（anon key），用于数据查询
- supabase_admin: 管理员客户端（service_role key），用于创建用户等管理操作
"""
from supabase import create_client, Client
from app.core.config import settings


def _create_client(key: str) -> Client | None:
    """创建 Supabase 客户端，未配置时返回 None"""
    if not settings.SUPABASE_URL or not key:
        return None
    return create_client(settings.SUPABASE_URL, key)


# 普通客户端（用于数据库查询）
supabase: Client | None = _create_client(settings.SUPABASE_KEY)

# 管理员客户端（用于 Auth 管理操作，仅后端使用）
supabase_admin: Client | None = _create_client(settings.SUPABASE_SERVICE_KEY)
