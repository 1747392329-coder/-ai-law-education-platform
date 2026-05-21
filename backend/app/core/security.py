"""
认证和安全模块
处理 JWT Token 验证和用户身份提取
"""
import json
import base64
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()


def decode_access_token(token: str) -> dict:
    """
    解码 Supabase Auth JWT Token
    直接解析 payload（签名验证由 Supabase 网关保证）
    """
    try:
        # JWT 由三部分组成: header.payload.signature
        parts = token.split(".")
        if len(parts) != 3:
            raise ValueError("Token 格式无效")

        # 解码 payload（第二部分）
        payload_b64 = parts[1]
        # 补齐 base64 填充
        padding = 4 - len(payload_b64) % 4
        if padding != 4:
            payload_b64 += "=" * padding

        payload_bytes = base64.urlsafe_b64decode(payload_b64)
        payload = json.loads(payload_bytes)

        # 检查是否过期
        import time
        exp = payload.get("exp")
        if exp and exp < time.time():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token 已过期",
            )

        return payload
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token 无效: {str(e)}",
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    从请求头中提取当前登录用户
    用法: user: dict = Depends(get_current_user)
    """
    token = credentials.credentials
    payload = decode_access_token(token)
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token 中未包含用户信息",
        )
    return {"id": user_id, **payload}
