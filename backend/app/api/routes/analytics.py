from fastapi import APIRouter, Depends
from app.schemas.analytics import AnalyticsDashboardResponse
from app.services.analytics_service import analytics_service
from app.core.security import get_current_user

router = APIRouter(prefix="/analytics", tags=["Operational Analytics"])


@router.get("/dashboard", response_model=AnalyticsDashboardResponse)
async def get_analytics_dashboard(current_user: dict = Depends(get_current_user)):
    return analytics_service.get_dashboard_analytics()
