from pydantic import BaseModel, Field
from typing import Optional, List


class MaintenanceRequestCreate(BaseModel):
    source_system: str = Field(..., json_schema_extra={"example": "TMS"})
    department_id: str = Field(..., json_schema_extra={"example": "CIVIL"})
    asset_id: Optional[str] = Field("TRK-124", json_schema_extra={"example": "TRK-124"})
    task_type: str = Field(..., json_schema_extra={"example": "Track Repair"})
    section_id: str = Field("SEC-NDLS-AGC-01", json_schema_extra={"example": "SEC-NDLS-AGC-01"})
    location_km: float = Field(..., json_schema_extra={"example": 124.5})
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    priority: str = Field("HIGH", json_schema_extra={"example": "HIGH"})
    severity: int = Field(50, ge=0, le=100)
    estimated_duration_minutes: int = Field(30, gt=0)
    required_block_type: str = Field("TRAFFIC_BLOCK", json_schema_extra={"example": "TRAFFIC_BLOCK"})
    safety_requirements: List[str] = []


class MaintenanceRequestUpdate(BaseModel):
    priority: Optional[str] = None
    status: Optional[str] = None
    estimated_duration_minutes: Optional[int] = None
    location_km: Optional[float] = None


class MaintenanceRequestResponse(BaseModel):
    id: str
    request_id: str
    source_system: str
    department_id: str
    department: Optional[str] = None
    asset_id: Optional[str] = None
    task_type: str
    section_id: str
    location_km: float
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    priority: str
    severity: int
    estimated_duration_minutes: int
    required_block_type: str
    safety_requirements: Optional[List[str]] = []
    status: str
    risk_score: Optional[float] = None
    created_at: str
