from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class OptimizationRequest(BaseModel):
    section_id: str = "SEC-NDLS-AGC-01"
    start_time_window: str = "2026-09-07T01:00:00Z"
    end_time_window: str = "2026-09-07T05:00:00Z"
    max_bundling_distance_km: float = 5.0
    solver_time_limit_seconds: int = 10


class CandidateBlock(BaseModel):
    block_id: str
    start_time: str
    end_time: str
    duration_minutes: int
    start_km: float
    end_km: float
    tasks_bundled: int
    task_ids: List[str]
    departments: List[str]
    affected_trains: int
    risk_score: float
    optimization_score: float
    status: str = "RECOMMENDED"


class OptimizationResponse(BaseModel):
    success: bool = True
    section_id: str
    solver_status: str
    optimal_block: CandidateBlock
    alternative_blocks: List[CandidateBlock] = []
    execution_time_ms: float
