from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class WhatIfSimulationRequest(BaseModel):
    train_delay_minutes: int = Field(20, ge=0)
    train_number: str = "12951"
    maintenance_duration_delta: int = 0
    new_task_priority: Optional[str] = None


class WhatIfSimulationResponse(BaseModel):
    success: bool = True
    original_plan: Dict[str, Any]
    new_plan: Dict[str, Any]
    tasks_preserved: int
    additional_train_delay: int
    safety_status: str
    impact_summary: str
