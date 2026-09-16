from pydantic import BaseModel, Field
from typing import Optional, List


class TMSMessageCreate(BaseModel):
    message_id: Optional[str] = Field(None, json_schema_extra={"example": "TMS-101"})
    source: str = Field("TMS", json_schema_extra={"example": "TMS"})
    section: str = Field("NDLS-AGC", json_schema_extra={"example": "NDLS-AGC"})
    section_id: str = Field("SEC-NDLS-AGC-01", json_schema_extra={"example": "SEC-NDLS-AGC-01"})
    track_id: str = Field(..., json_schema_extra={"example": "TRK-102"})
    location: str = Field(..., json_schema_extra={"example": "KM 142.5"})
    location_km: Optional[float] = Field(None, json_schema_extra={"example": 142.5})
    maintenance_type: str = Field(..., json_schema_extra={"example": "Track Inspection"})
    priority: str = Field("HIGH", json_schema_extra={"example": "HIGH"})
    status: str = Field("NEW", json_schema_extra={"example": "NEW"})


class TMSMessageUpdate(BaseModel):
    priority: Optional[str] = None
    status: Optional[str] = None
    maintenance_type: Optional[str] = None


class TMSMessageResponse(BaseModel):
    id: str
    message_id: str
    source: str
    timestamp: str
    section: str
    section_id: Optional[str] = "SEC-NDLS-AGC-01"
    track_id: str
    location: str
    location_km: Optional[float] = None
    maintenance_type: str
    priority: str
    status: str
    created_at: Optional[str] = None
