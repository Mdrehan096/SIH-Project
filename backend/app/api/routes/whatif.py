from fastapi import APIRouter, Depends
from app.schemas.whatif import WhatIfSimulationRequest, WhatIfSimulationResponse
from app.services.whatif_service import whatif_service
from app.core.security import get_current_user

router = APIRouter(prefix="/whatif", tags=["What-If Simulation Engine"])


@router.post("/simulate", response_model=WhatIfSimulationResponse)
async def simulate_scenario(payload: WhatIfSimulationRequest, current_user: dict = Depends(get_current_user)):
    res = whatif_service.run_simulation(
        train_delay_minutes=payload.train_delay_minutes,
        train_number=payload.train_number,
        maintenance_duration_delta=payload.maintenance_duration_delta
    )
    return res
