from pydantic import BaseModel, Field
from typing import Optional


class TDMSDefectCreate(BaseModel):
    message_id: Optional[str] = Field(None, json_schema_extra={"example": "TDMS-101"})
    source: str = Field("TDMS", json_schema_extra={"example": "TDMS"})
    track_id: str = Field(..., json_schema_extra={"example": "TRK-102"})
    location: str = Field(..., json_schema_extra={"example": "KM 143.2"})
    location_km: Optional[float] = Field(None, json_schema_extra={"example": 143.2})
    defect_type: str = Field(..., json_schema_extra={"example": "Rail Crack"})
    severity: str = Field("CRITICAL", json_schema_extra={"example": "CRITICAL"})
    risk_score: float = Field(91.0, ge=0, le=100, json_schema_extra={"example": 91.0})
    status: str = Field("OPEN", json_schema_extra={"example": "OPEN"})


class TDMSDefectUpdate(BaseModel):
    severity: Optional[str] = None
    risk_score: Optional[float] = None
    status: Optional[str] = None


class TDMSDefectResponse(BaseModel):
    id: str
    message_id: str
    source: str
    timestamp: str
    track_id: str
    location: str
    location_km: Optional[float] = None
    defect_type: str
    severity: str
    risk_score: float
    status: str
    created_at: Optional[str] = None
