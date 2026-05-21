"""
应用配置模块
从环境变量读取所有配置项，提供统一的配置入口
"""
import os
from dotenv import load_dotenv

# 加载 .env 文件中的环境变量
load_dotenv()


class Settings:
    """应用配置类 - 所有配置通过环境变量注入"""

    # ========== 应用基础配置 ==========
    APP_NAME: str = "AI法律法规教育视频平台"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    # ========== Supabase 配置 ==========
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")  # anon key（前端可用）
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")  # service_role key（仅后端）
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")  # JWT 签名密钥

    # ========== 前端地址（CORS 白名单） ==========
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # ========== 分页默认值 ==========
    DEFAULT_PAGE_SIZE: int = 12
    MAX_PAGE_SIZE: int = 50

    # ========== 积分规则配置 ==========
    POINTS_WATCH_VIDEO: int = 5       # 观看视频获得积分
    POINTS_LIKE_VIDEO: int = 2        # 点赞获得积分
    POINTS_DAILY_LOGIN: int = 3       # 每日登录积分
    POINTS_FAVORITE: int = 1          # 收藏获得积分


# 全局单例配置
settings = Settings()
