from pydantic import BaseModel
from typing import List, Optional


class MaintenanceBlockResponse(BaseModel):
    id: str
    block_id: str
    section_id: str
    start_km: float
    end_km: float
    scheduled_start_time: str
    scheduled_end_time: str
    tasks_bundled_count: int
    departments: List[str]
    affected_trains_count: int
    risk_score: float
    optimization_score: float
    status: str
    pn_code: Optional[str] = None


class BlockApprovalRequest(BaseModel):
    block_id: str
    approved: bool
    remarks: Optional[str] = None
