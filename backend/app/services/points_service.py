"""
积分服务层
管理用户积分余额、积分记录、自动赚取积分
"""
from fastapi import HTTPException, status
from app.core.supabase import supabase_admin


class PointsService:

    # 积分规则
    RULES = {
        "watch_video": 5,     # 观看视频
        "like_video": 2,      # 点赞
        "daily_login": 3,     # 每日登录
        "favorite": 1,        # 收藏
    }

    @staticmethod
    def get_balance(user_id: str) -> dict:
        """获取用户积分余额"""
        if supabase_admin is None:
            return {"balance": 0, "total_earned": 0}

        records = (
            supabase_admin.table("point_records")
            .select("points")
            .eq("user_id", user_id)
            .execute()
        )

        balance = sum(r.get("points", 0) for r in (records.data or []))
        earned = sum(r.get("points", 0) for r in (records.data or []) if r.get("points", 0) > 0)

        return {"balance": balance, "total_earned": earned}

    @staticmethod
    def get_records(user_id: str, page: int = 1, page_size: int = 20) -> dict:
        """获取积分记录列表"""
        if supabase_admin is None:
            return {"data": [], "total": 0, "page": page, "page_size": page_size, "total_pages": 0}

        result = (
            supabase_admin.table("point_records")
            .select("*", count="exact")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .range((page - 1) * page_size, page * page_size - 1)
            .execute()
        )

        total = result.count or 0
        return {
            "data": result.data or [],
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": max(1, (total + page_size - 1) // page_size),
        }

    @staticmethod
    def add_points(user_id: str, reason: str, description: str = "") -> dict:
        """增加积分（赚取）"""
        if supabase_admin is None:
            raise HTTPException(status_code=500, detail="服务未配置")

        points = PointsService.RULES.get(reason, 0)
        if points <= 0:
            return {"points": 0, "balance": 0}

        supabase_admin.table("point_records").insert({
            "user_id": user_id,
            "points": points,
            "reason": reason,
            "description": description or PointsService._get_description(reason),
        }).execute()

        balance_data = PointsService.get_balance(user_id)
        return {"points": points, "balance": balance_data["balance"]}

    @staticmethod
    def _get_description(reason: str) -> str:
        descriptions = {
            "watch_video": "观看视频",
            "like_video": "点赞视频",
            "daily_login": "每日登录",
            "favorite": "收藏视频",
        }
        return descriptions.get(reason, reason)


points_service = PointsService()
