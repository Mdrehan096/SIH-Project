from pydantic import BaseModel, Field
from typing import Optional, List


class COAStationInfo(BaseModel):
    station_code: str
    station_name: str
    sequence_order: int
    distance_from_origin_km: float


class COARouteResponse(BaseModel):
    id: str
    route_code: str
    name: str
    origin_station: str
    destination_station: str
    total_distance_km: float
    stations: List[COAStationInfo] = []


class COATrainUpdatePayload(BaseModel):
    train_id: Optional[str] = None
    train_number: Optional[str] = None
    train_name: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    current_station: Optional[str] = None
    next_station: Optional[str] = None
    status: Optional[str] = None  # SCHEDULED, RUNNING, DELAYED, ARRIVED, CANCELLED
    scheduled_departure: Optional[str] = None
    estimated_arrival: Optional[str] = None
    delay_minutes: Optional[int] = 0


class COATrainResponse(BaseModel):
    id: str
    train_id: str
    train_number: str
    train_name: str
    origin: str
    destination: str
    current_station: str
    next_station: str
    status: str
    scheduled_departure: Optional[str] = None
    estimated_arrival: Optional[str] = None
    delay_minutes: int = 0
    route_id: Optional[str] = "ROUTE-NDLS-AGC"
    updated_at: Optional[str] = None
