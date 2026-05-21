"""
用户相关请求/响应 Schema
"""
from typing import Optional
from pydantic import BaseModel, EmailStr


# ========== 请求 Schema ==========

class RegisterRequest(BaseModel):
    """注册请求"""
    email: str
    password: str
    nickname: Optional[str] = None


class LoginRequest(BaseModel):
    """登录请求"""
    email: str
    password: str


# ========== 响应 Schema ==========

class UserProfileResponse(BaseModel):
    """用户信息响应"""
    id: str
    email: str
    nickname: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str = "user"
    phone: Optional[str] = None


class AuthResponse(BaseModel):
    """认证响应（登录/注册成功后返回）"""
    access_token: str
    refresh_token: str
    user: UserProfileResponse
