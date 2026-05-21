"""
FastAPI 应用入口
创建应用实例、注册中间件、挂载路由
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router

# ========== 创建 FastAPI 应用实例 ==========
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI法律法规教育视频平台 - 后端API",
    docs_url="/docs",          # Swagger 文档地址
    redoc_url="/redoc",        # ReDoc 文档地址
)

# ========== CORS 跨域配置 ==========
# 生产环境通过 FRONTEND_URL 环境变量设置，开发时允许 localhost
cors_origins = [settings.FRONTEND_URL] if settings.FRONTEND_URL else []
cors_origins.append("http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== 注册 API 路由 ==========
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    """根路径 - 健康检查"""
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


@app.get("/health")
async def health_check():
    """健康检查接口 - 供部署平台检测服务状态"""
    return {"status": "healthy"}
