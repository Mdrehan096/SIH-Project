from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from app.core.security import get_current_user

router = APIRouter(prefix="/divisions", tags=["Divisions & Distance Analysis"])

DIVISIONS_MASTER_DATA = [
    {
        "id": "DIV-NDLS",
        "code": "DLI",
        "name": "Delhi Division",
        "zone": "Northern Railway (NR)",
        "headquarters": "New Delhi",
        "total_route_km": 1420.5,
        "active_blocks": 4,
        "trains_running": 128,
        "critical_assets": 12,
        "risk_score": 38.4,
        "avg_delay_min": 8.2,
        "workload_index": "HIGH",
    },
    {
        "id": "DIV-PRYJ",
        "code": "PRYJ",
        "name": "Prayagraj Division",
        "zone": "North Central Railway (NCR)",
        "headquarters": "Prayagraj",
        "total_route_km": 1280.0,
        "active_blocks": 3,
        "trains_running": 94,
        "critical_assets": 8,
        "risk_score": 42.1,
        "avg_delay_min": 11.5,
        "workload_index": "MEDIUM",
    },
    {
        "id": "DIV-LKO",
        "code": "LKO",
        "name": "Lucknow Division",
        "zone": "Northern Railway (NR)",
        "headquarters": "Lucknow",
        "total_route_km": 1155.2,
        "active_blocks": 2,
        "trains_running": 76,
        "critical_assets": 5,
        "risk_score": 29.8,
        "avg_delay_min": 6.0,
        "workload_index": "MEDIUM",
    },
    {
        "id": "DIV-UMB",
        "code": "UMB",
        "name": "Ambala Division",
        "zone": "Northern Railway (NR)",
        "headquarters": "Ambala Cantt",
        "total_route_km": 1040.8,
        "active_blocks": 1,
        "trains_running": 62,
        "critical_assets": 4,
        "risk_score": 21.5,
        "avg_delay_min": 4.5,
        "workload_index": "LOW",
    },
    {
        "id": "DIV-MB",
        "code": "MB",
        "name": "Moradabad Division",
        "zone": "Northern Railway (NR)",
        "headquarters": "Moradabad",
        "total_route_km": 980.4,
        "active_blocks": 2,
        "trains_running": 54,
        "critical_assets": 6,
        "risk_score": 34.0,
        "avg_delay_min": 9.1,
        "workload_index": "MEDIUM",
    },
]


@router.get("", response_model=List[Dict[str, Any]])
async def list_divisions(current_user: dict = Depends(get_current_user)):
    return DIVISIONS_MASTER_DATA


@router.get("/{division_id}", response_model=Dict[str, Any])
async def get_division(division_id: str, current_user: dict = Depends(get_current_user)):
    for d in DIVISIONS_MASTER_DATA:
        if d["id"] == division_id or d["code"] == division_id.upper():
            return d
    return DIVISIONS_MASTER_DATA[0]
