"""
积分接口
"""
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from app.schemas.common import ResponseBase, PaginatedResponse
from app.services.points_service import points_service
from app.api.deps import get_current_user, pagination_params

router = APIRouter()


class EarnPointsRequest(BaseModel):
    reason: str  # watch_video / like_video / daily_login / favorite


@router.get("/balance", response_model=ResponseBase)
async def get_balance(user: dict = Depends(get_current_user)):
    """获取积分余额"""
    balance = points_service.get_balance(user["id"])
    return ResponseBase(code=200, message="success", data=balance)


@router.get("/records", response_model=PaginatedResponse)
async def get_records(
    user: dict = Depends(get_current_user),
    pagination: dict = Depends(pagination_params),
):
    """获取积分记录"""
    result = points_service.get_records(
        user_id=user["id"],
        page=pagination["page"],
        page_size=pagination["page_size"],
    )
    return PaginatedResponse(
        code=200, message="success",
        data=result["data"], total=result["total"],
        page=result["page"], page_size=result["page_size"],
        total_pages=result["total_pages"],
    )


@router.post("/earn", response_model=ResponseBase)
async def earn_points(req: EarnPointsRequest, user: dict = Depends(get_current_user)):
    """赚取积分"""
    result = points_service.add_points(user["id"], req.reason)
    return ResponseBase(code=200, message="积分+1", data=result)
