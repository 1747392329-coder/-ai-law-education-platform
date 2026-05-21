"""
通用响应 Schema
定义统一的 API 响应格式
"""
from typing import Optional, Any
from pydantic import BaseModel


class ResponseBase(BaseModel):
    """通用响应格式 - 所有 API 返回此结构"""
    code: int = 200           # 状态码
    message: str = "success"  # 提示消息
    data: Optional[Any] = None  # 响应数据


class PaginatedResponse(BaseModel):
    """分页响应格式"""
    code: int = 200
    message: str = "success"
    data: list = []            # 数据列表
    total: int = 0             # 总记录数
    page: int = 1              # 当前页码
    page_size: int = 12        # 每页数量
    total_pages: int = 0       # 总页数
