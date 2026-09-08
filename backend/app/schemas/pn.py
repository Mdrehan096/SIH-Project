from pydantic import BaseModel
from typing import Optional


class PNGenerateRequest(BaseModel):
    block_id: str


class PNVerifyRequest(BaseModel):
    block_id: str
    pn_code: str
    station_code: str = "NDLS"


class PNResponse(BaseModel):
    success: bool = True
    block_id: str
    pn_code: str
    generated_by: str
    generated_at: str
    status: str
    verified_by: Optional[str] = None
    verified_at: Optional[str] = None
