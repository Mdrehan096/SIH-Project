from fastapi import APIRouter, Depends
from app.schemas.optimizer import OptimizationRequest, OptimizationResponse
from app.services.optimization_service import optimization_service
from app.core.security import get_current_user

router = APIRouter(prefix="/optimizer", tags=["OR-Tools CP-SAT Block Optimizer"])


@router.post("/optimize", response_model=OptimizationResponse)
async def run_optimizer(payload: OptimizationRequest, current_user: dict = Depends(get_current_user)):
    res = optimization_service.run_optimization(
        section_id=payload.section_id,
        time_limit_seconds=float(payload.solver_time_limit_seconds),
        max_bundling_distance_km=float(payload.max_bundling_distance_km),
        max_block_duration_minutes=int(payload.max_block_duration_minutes),
        department_filters=payload.department_filters
    )
    return res
