from pydantic import BaseModel
from typing import List, Dict, Any


class AnalyticsDashboardResponse(BaseModel):
    success: bool = True
    active_trains: int
    delayed_trains: int
    pending_maintenance: int
    critical_maintenance: int
    active_blocks: int
    completed_blocks: int
    avg_block_duration_minutes: float
    tasks_bundled_count: int
    train_delays_avoided_minutes: int
    asset_availability_index: float
    department_distribution: Dict[str, int]
    risk_distribution: Dict[str, int]
