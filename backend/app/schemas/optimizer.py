from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class OptimizationRequest(BaseModel):
    section_id: str = "SEC-NDLS-AGC-01"
    start_time_window: str = "2026-09-07T00:00:00Z"
    end_time_window: str = "2026-09-07T08:00:00Z"
    max_bundling_distance_km: float = 5.0
    max_block_duration_minutes: int = 60
    solver_time_limit_seconds: int = 10
    department_filters: Optional[List[str]] = Field(default_factory=lambda: ["CIVIL", "ELECTRICAL", "SIGNAL_TELECOM"])


class TaskDetail(BaseModel):
    task_id: str
    department: str
    task_type: str
    location_km: float
    severity: int
    duration_minutes: int


class CandidateBlock(BaseModel):
    block_id: str
    section_id: Optional[str] = "SEC-NDLS-AGC-01"
    section_name: Optional[str] = "NDLS - AGC (New Delhi - Agra Cantt)"
    start_time: str
    end_time: str
    duration_minutes: int
    start_km: float
    end_km: float
    tasks_bundled: int
    task_ids: List[str]
    task_details: Optional[List[Dict[str, Any]]] = []
    departments: List[str]
    affected_trains: int
    risk_score: float
    optimization_score: float
    status: str = "RECOMMENDED"
    pn_code: Optional[str] = None


class OptimizationResponse(BaseModel):
    success: bool = True
    section_id: str
    solver_status: str
    optimal_block: CandidateBlock
    alternative_blocks: List[CandidateBlock] = []
    execution_time_ms: float
