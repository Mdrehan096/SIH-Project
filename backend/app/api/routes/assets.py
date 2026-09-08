from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.assets import AssetResponse
from app.core.security import get_current_user

router = APIRouter(prefix="/assets", tags=["Railway Assets"])

_MOCK_ASSETS = [
    {"id": "TRK-120", "asset_code": "TRK-KM-120-DN", "name": "Down Main Track Segment KM 120.0", "asset_type": "TRACK", "department_id": "CIVIL", "section_id": "SEC-NDLS-AGC-01", "location_km": 120.0, "installation_year": 2018, "health_score": 72.5, "status": "MAINTENANCE_REQUIRED"},
    {"id": "TRK-122", "asset_code": "TRK-KM-122-DN", "name": "Down Main Track Segment KM 122.0", "asset_type": "TRACK", "department_id": "CIVIL", "section_id": "SEC-NDLS-AGC-01", "location_km": 122.0, "installation_year": 2017, "health_score": 68.0, "status": "MAINTENANCE_REQUIRED"},
    {"id": "TRK-124", "asset_code": "TRK-KM-124-DN", "name": "Down Main Track Segment KM 124.5", "asset_type": "TRACK", "department_id": "CIVIL", "section_id": "SEC-NDLS-AGC-01", "location_km": 124.5, "installation_year": 2015, "health_score": 54.0, "status": "DEGRADED"},
    {"id": "OHE-124", "asset_code": "OHE-KM-124-MAIN", "name": "OHE Portal Line KM 124.2", "asset_type": "OHE", "department_id": "ELECTRICAL", "section_id": "SEC-NDLS-AGC-01", "location_km": 124.2, "installation_year": 2016, "health_score": 81.0, "status": "MAINTENANCE_REQUIRED"},
    {"id": "SIG-125", "asset_code": "SIG-KM-125-INT", "name": "Signal Interlocking Box 125-B", "asset_type": "SIGNAL", "department_id": "SIGNAL_TELECOM", "section_id": "SEC-NDLS-AGC-01", "location_km": 125.0, "installation_year": 2019, "health_score": 88.0, "status": "MAINTENANCE_REQUIRED"},
]


@router.get("", response_model=List[AssetResponse])
async def list_assets(current_user: dict = Depends(get_current_user)):
    return _MOCK_ASSETS


@router.get("/{asset_id}", response_model=AssetResponse)
async def get_asset(asset_id: str, current_user: dict = Depends(get_current_user)):
    for a in _MOCK_ASSETS:
        if a["id"] == asset_id or a["asset_code"] == asset_id:
            return a
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Asset '{asset_id}' not found.")
