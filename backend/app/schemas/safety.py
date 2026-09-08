from pydantic import BaseModel
from typing import List, Dict, Any


class SafetyValidationRequest(BaseModel):
    section_id: str = "SEC-NDLS-AGC-01"
    start_km: float
    end_km: float
    scheduled_start_time: str
    scheduled_end_time: str
    activities: List[str]
    affected_departments: List[str]


class SafetyConflict(BaseModel):
    rule_code: str
    severity: str
    message: str
    primary_activity: str
    conflicting_activity: str


class SafetyValidationResponse(BaseModel):
    success: bool = True
    safe: bool
    conflicts_count: int
    conflicts: List[SafetyConflict] = []
