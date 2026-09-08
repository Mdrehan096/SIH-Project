from fastapi import APIRouter, Depends
from app.schemas.safety import SafetyValidationRequest, SafetyValidationResponse
from app.services.safety_service import safety_engine
from app.core.security import get_current_user

router = APIRouter(prefix="/safety", tags=["Safety Constraint Engine"])


@router.post("/validate", response_model=SafetyValidationResponse)
async def validate_safety_rules(payload: SafetyValidationRequest, current_user: dict = Depends(get_current_user)):
    res = safety_engine.validate_safety(
        section_id=payload.section_id,
        start_km=payload.start_km,
        end_km=payload.end_km,
        scheduled_start_time=payload.scheduled_start_time,
        scheduled_end_time=payload.scheduled_end_time,
        activities=payload.activities,
        affected_departments=payload.affected_departments
    )
    return res
