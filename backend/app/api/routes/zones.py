from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from app.core.security import get_current_user

router = APIRouter(prefix="/zones", tags=["Zones Analytics"])

ZONES_MASTER_DATA = [
    {
        "id": "ZONE-NR",
        "code": "NR",
        "name": "Northern Railway",
        "headquarters": "New Delhi",
        "total_route_km": 6968.0,
        "divisions_count": 5,
        "active_blocks": 9,
        "train_traffic_index": 92.5,
        "risk_level": "MODERATE",
        "maintenance_workload": 84,
    },
    {
        "id": "ZONE-NCR",
        "code": "NCR",
        "name": "North Central Railway",
        "headquarters": "Prayagraj",
        "total_route_km": 3151.0,
        "divisions_count": 3,
        "active_blocks": 5,
        "train_traffic_index": 88.0,
        "risk_level": "HIGH",
        "maintenance_workload": 76,
    },
    {
        "id": "ZONE-WR",
        "code": "WR",
        "name": "Western Railway",
        "headquarters": "Mumbai (Churchgate)",
        "total_route_km": 6182.0,
        "divisions_count": 6,
        "active_blocks": 7,
        "train_traffic_index": 95.0,
        "risk_level": "LOW",
        "maintenance_workload": 68,
    },
]


@router.get("", response_model=List[Dict[str, Any]])
async def list_zones(current_user: dict = Depends(get_current_user)):
    return ZONES_MASTER_DATA


@router.get("/{zone_code}", response_model=Dict[str, Any])
async def get_zone(zone_code: str, current_user: dict = Depends(get_current_user)):
    for z in ZONES_MASTER_DATA:
        if z["code"] == zone_code.upper() or z["id"] == zone_code:
            return z
    return ZONES_MASTER_DATA[0]
