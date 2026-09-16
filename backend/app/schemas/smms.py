from pydantic import BaseModel, Field
from typing import Optional


class SMMSMessageCreate(BaseModel):
    message_id: Optional[str] = Field(None, json_schema_extra={"example": "SMMS-101"})
    source: str = Field("SMMS", json_schema_extra={"example": "SMMS"})
    department: str = Field(..., json_schema_extra={"example": "OHE"})  # OHE, SIGNAL, TELECOM
    asset_id: str = Field(..., json_schema_extra={"example": "OHE-442"})
    location: str = Field(..., json_schema_extra={"example": "KM 145.1"})
    location_km: Optional[float] = Field(None, json_schema_extra={"example": 145.1})
    issue_type: str = Field(..., json_schema_extra={"example": "Insulator Fault"})
    severity: str = Field("HIGH", json_schema_extra={"example": "HIGH"})
    maintenance_required: bool = Field(True, json_schema_extra={"example": True})
    status: str = Field("NEW", json_schema_extra={"example": "NEW"})


class SMMSMessageUpdate(BaseModel):
    severity: Optional[str] = None
    maintenance_required: Optional[bool] = None
    status: Optional[str] = None


class SMMSMessageResponse(BaseModel):
    id: str
    message_id: str
    source: str
    timestamp: str
    department: str
    asset_id: str
    location: str
    location_km: Optional[float] = None
    issue_type: str
    severity: str
    maintenance_required: bool
    status: str
    created_at: Optional[str] = None
