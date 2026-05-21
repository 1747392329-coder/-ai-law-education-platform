# 法规AI课堂 - AI法律法规教育视频平台

AI驱动的法律法规与安全教育视频平台，将枯燥的法律条文转化为生动有趣的动画视频。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 16 + TypeScript + TailwindCSS v4 |
| 后端 | FastAPI + Python |
| 数据库 | Supabase (PostgreSQL) |
| 存储 | Supabase Storage |
| 认证 | Supabase Auth (JWT) |
| 部署 | Vercel (前端) + Railway (后端) |

## 项目结构

```
ai-law-education-platform/
├── frontend/          # Next.js 前端
│   └── src/
│       ├── app/       # 页面路由 (App Router)
│       ├── components/ # 组件库 (ui/layout/video/common)
│       ├── hooks/     # 自定义 Hooks
│       ├── lib/       # 工具库 (Supabase/API)
│       ├── types/     # TypeScript 类型
│       └── store/     # Zustand 状态管理
├── backend/           # FastAPI 后端
│   └── app/
│       ├── api/v1/    # API 路由
│       ├── core/      # 核心配置
│       ├── models/    # 数据模型
│       ├── schemas/   # 请求/响应 Schema
│       └── services/  # 业务逻辑层
└── docs/              # 项目文档
```

## 快速开始

### 前置要求

- Node.js 18+
- Python 3.10+
- Supabase 账号

### 1. 配置 Supabase

1. 在 [supabase.com](https://supabase.com) 创建项目
2. 在 SQL Editor 中执行数据库建表语句
3. 获取 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY`

### 2. 启动前端

```bash
cd frontend
cp .env.example .env.local
# 编辑 .env.local，填入 Supabase 配置
npm install
npm run dev
```

前端运行在 http://localhost:3000

### 3. 启动后端

```bash
cd backend
cp .env.example .env
# 编辑 .env，填入 Supabase 配置
python -m venv venv
source venv/Scripts/activate  # Windows
# source venv/bin/activate    # Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

后端运行在 http://localhost:8000
API 文档: http://localhost:8000/docs

## 开发阶段

| 阶段 | 内容 | 状态 |
|------|------|------|
| Phase 0 | 项目脚手架 | ✅ 完成 |
| Phase 1 | 认证系统（登录/注册） | 🔜 待开发 |
| Phase 2 | 首页 + 视频列表 | 🔜 待开发 |
| Phase 3 | 视频播放 + 分类筛选 | 🔜 待开发 |
| Phase 4 | 搜索功能 | 🔜 待开发 |
| Phase 5 | 点赞 + 收藏 | 🔜 待开发 |
| Phase 6 | 管理后台 | 🔜 待开发 |
| Phase 7 | 积分系统 | 🔜 待开发 |
| Phase 8 | 部署上线 | 🔜 待开发 |

## License

MIT
