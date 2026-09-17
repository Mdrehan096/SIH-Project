from pydantic import BaseModel
from typing import Optional


class AssetResponse(BaseModel):
    id: str
    asset_code: str
    name: str
    asset_type: str
    department_id: str
    section_id: str
    location_km: float
    installation_year: Optional[int] = None
    health_score: float
    status: str
    active_requests_count: Optional[int] = 0
    latest_request_id: Optional[str] = None
    latest_task_type: Optional[str] = None
    latest_severity: Optional[int] = None
