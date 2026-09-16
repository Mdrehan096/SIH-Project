"""
RETRACK – RailSync-AI Data Models (MVC Pattern: Model Layer)
Defines domain entity models representing Railway Assets, Maintenance Requests,
Train Timetables, Block Possessions, Digital Private Numbers (PN), and Notifications.
"""

from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime


@dataclass
class MaintenanceRequestModel:
    id: str
    request_id: str
    source_system: str  # TMS, TDMS, SMMS
    department_id: str  # CIVIL, ELECTRICAL, SIGNAL_TELECOM
    asset_id: str
    task_type: str
    section_id: str
    location_km: float
    priority: str
    severity: int
    estimated_duration_minutes: int
    required_block_type: str
    status: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    safety_requirements: List[str] = field(default_factory=list)
    risk_score: Optional[float] = None
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())


@dataclass
class TrainModel:
    id: str
    train_number: str
    train_name: str
    train_type: str
    origin_station: str
    destination_station: str
    priority_level: int
    scheduled_departure: str
    scheduled_arrival: str


@dataclass
class BlockPossessionModel:
    id: str
    block_id: str
    section_id: str
    start_time: str
    end_time: str
    duration_minutes: int
    status: str
    request_ids: List[str] = field(default_factory=list)
    pn_code: Optional[str] = None


@dataclass
class DigitalPNModel:
    pn_code: str
    block_id: str
    generated_by: str
    generated_at: str
    status: str  # PENDING_VERIFICATION, VERIFIED
    station_code: Optional[str] = None
    verified_by: Optional[str] = None
    verified_at: Optional[str] = None


@dataclass
class NotificationModel:
    id: str
    category: str
    title: str
    message: str
    timestamp: str
    read: bool
    severity: str  # CRITICAL, WARNING, INFO, SUCCESS
    department: Optional[str] = None
