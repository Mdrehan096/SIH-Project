from pydantic import BaseModel
from typing import Optional, List


class TrainResponse(BaseModel):
    id: str
    train_number: str
    train_name: str
    train_type: str
    priority: int
    origin: str
    destination: str
    status: str
    delay_minutes: int = 0


class TrainPathResponse(BaseModel):
    id: str
    train_id: str
    train_number: str
    section_id: str
    start_km: float
    end_km: float
    scheduled_arrival: str
    scheduled_departure: str
    delay_minutes: int = 0
