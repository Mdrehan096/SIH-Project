import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.maintenance import MaintenanceRequestCreate, MaintenanceRequestUpdate, MaintenanceRequestResponse
from app.db.queries import get_all_maintenance_requests, get_maintenance_request_by_id, update_maintenance_request_status, _MOCK_MAINTENANCE_REQUESTS
from app.core.security import get_current_user
from datetime import datetime, timezone

router = APIRouter(prefix="/maintenance", tags=["Maintenance Requests"])


@router.get("", response_model=List[MaintenanceRequestResponse])
async def list_maintenance_requests(
    department: Optional[str] = None,
    status_filter: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    requests = get_all_maintenance_requests()
    if department:
        requests = [r for r in requests if r.get("department_id") == department or r.get("department") == department]
    if status_filter:
        requests = [r for r in requests if r.get("status") == status_filter]
    return requests


@router.post("", response_model=MaintenanceRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_maintenance_request(
    payload: MaintenanceRequestCreate,
    current_user: dict = Depends(get_current_user)
):
    new_id = str(uuid.uuid4())
    req_num = f"REQ-{len(_MOCK_MAINTENANCE_REQUESTS) + 1:03d}"
    new_req = {
        "id": new_id,
        "request_id": req_num,
        "source_system": payload.source_system,
        "department_id": payload.department_id,
        "department": payload.department_id,
        "asset_id": payload.asset_id,
        "task_type": payload.task_type,
        "section_id": payload.section_id,
        "location_km": payload.location_km,
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        "priority": payload.priority,
        "severity": payload.severity,
        "estimated_duration_minutes": payload.estimated_duration_minutes,
        "required_block_type": payload.required_block_type,
        "safety_requirements": payload.safety_requirements,
        "status": "PENDING",
        "risk_score": float(payload.severity),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    _MOCK_MAINTENANCE_REQUESTS.insert(0, new_req)
    return new_req


@router.get("/{request_id}", response_model=MaintenanceRequestResponse)
async def get_maintenance_request(request_id: str, current_user: dict = Depends(get_current_user)):
    req = get_maintenance_request_by_id(request_id)
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Maintenance request '{request_id}' not found.")
    return req


@router.patch("/{request_id}", response_model=MaintenanceRequestResponse)
async def update_maintenance_request(
    request_id: str,
    payload: MaintenanceRequestUpdate,
    current_user: dict = Depends(get_current_user)
):
    req = get_maintenance_request_by_id(request_id)
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Maintenance request '{request_id}' not found.")
    
    new_status = payload.status or req.get("status", "PENDING")
    new_priority = payload.priority or req.get("priority")
    
    updated = update_maintenance_request_status(request_id, new_status, new_priority)
    if updated:
        return updated
    
    req["status"] = new_status
    if payload.priority:
        req["priority"] = payload.priority
    if payload.estimated_duration_minutes:
        req["estimated_duration_minutes"] = payload.estimated_duration_minutes
    if payload.location_km:
        req["location_km"] = payload.location_km
    return req


@router.delete("/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_maintenance_request(request_id: str, current_user: dict = Depends(get_current_user)):
    req = get_maintenance_request_by_id(request_id)
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Maintenance request '{request_id}' not found.")
    if req in _MOCK_MAINTENANCE_REQUESTS:
        _MOCK_MAINTENANCE_REQUESTS.remove(req)
    return None
