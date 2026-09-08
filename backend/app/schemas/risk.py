from pydantic import BaseModel, Field
from typing import Optional, Dict


class RiskScoreRequest(BaseModel):
    asset_id: str = Field(..., json_schema_extra={"example": "TRK-124"})
    asset_age: int = Field(10, ge=0)
    defect_severity: int = Field(75, ge=0, le=100)
    defect_frequency: int = Field(3, ge=0)
    previous_failures: int = Field(1, ge=0)
    traffic_density: float = Field(85.0, ge=0)
    maintenance_delay: int = Field(5, ge=0)
    inspection_score: float = Field(65.0, ge=0, le=100)
    environmental_factor: float = Field(1.2, ge=0)


class RiskScoreResponse(BaseModel):
    success: bool = True
    asset_id: str
    risk_score: float
    risk_category: str  # LOW, MEDIUM, HIGH, CRITICAL
    failure_probability: float
    feature_importance: Dict[str, float] = {}
    recommendation: str
