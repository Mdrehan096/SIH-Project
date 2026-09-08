from pydantic import BaseModel, Field
from typing import List, Dict, Any


class BundlingRequest(BaseModel):
    section_id: str = "SEC-NDLS-AGC-01"
    max_distance_km: float = Field(5.0, gt=0)
    request_ids: List[str] = []


class BundleItem(BaseModel):
    bundle_id: str
    start_km: float
    end_km: float
    span_km: float
    task_ids: List[str]
    departments: List[str]
    estimated_duration_minutes: int
    required_block_type: str
    compatible: bool = True
    compatibility_reason: str = "All tasks compatible for spatial bundling"


class BundlingResponse(BaseModel):
    success: bool = True
    section_id: str
    total_requests_analyzed: int
    bundles_created: int
    bundles: List[BundleItem]
