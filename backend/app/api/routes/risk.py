from fastapi import APIRouter, Depends
from app.schemas.risk import RiskScoreRequest, RiskScoreResponse
from app.services.risk_service import risk_service
from app.core.security import get_current_user

router = APIRouter(prefix="/risk", tags=["Predictive Risk Engine"])


@router.post("/score", response_model=RiskScoreResponse)
async def calculate_risk_score(payload: RiskScoreRequest, current_user: dict = Depends(get_current_user)):
    data = payload.model_dump()
    result = risk_service.evaluate_request_risk(data)
    return result
