from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.blocks import MaintenanceBlockResponse, BlockApprovalRequest
from app.core.security import get_current_user, require_roles
from app.core.constants import ROLE_CONTROLLER, ROLE_ADMIN

router = APIRouter(prefix="/blocks", tags=["Maintenance Possession Blocks"])

_MOCK_BLOCKS = [
    {
        "id": "b0000000-0000-0000-0000-000000000001",
        "block_id": "BLK-2026-081",
        "section_id": "SEC-NDLS-AGC-01",
        "start_km": 120.0,
        "end_km": 128.5,
        "scheduled_start_time": "2026-09-07T02:00:00Z",
        "scheduled_end_time": "2026-09-07T03:00:00Z",
        "tasks_bundled_count": 7,
        "departments": ["CIVIL", "ELECTRICAL", "SIGNAL_TELECOM"],
        "affected_trains_count": 0,
        "risk_score": 18.5,
        "optimization_score": 94.5,
        "status": "RECOMMENDED",
        "pn_code": None
    }
]


@router.get("", response_model=List[MaintenanceBlockResponse])
async def list_blocks(current_user: dict = Depends(get_current_user)):
    return _MOCK_BLOCKS


@router.get("/{block_id}", response_model=MaintenanceBlockResponse)
async def get_block(block_id: str, current_user: dict = Depends(get_current_user)):
    for b in _MOCK_BLOCKS:
        if b["block_id"] == block_id or b["id"] == block_id:
            return b
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Maintenance block '{block_id}' not found.")


@router.post("/{block_id}/approve", response_model=MaintenanceBlockResponse)
async def approve_block(
    block_id: str,
    current_user: dict = Depends(get_current_user)
):
    import random
    pn_code = f"PN-{random.randint(100000, 999999)}"
    for b in _MOCK_BLOCKS:
        if b["block_id"] == block_id or b["id"] == block_id:
            b["status"] = "APPROVED"
            b["pn_code"] = pn_code
            return b
    # Dynamic block entry fallback if generated on-the-fly by CP-SAT solver
    new_approved_block = {
        "id": f"b0000000-0000-0000-0000-{(hash(block_id) % 899999999999) + 100000000000}",
        "block_id": block_id,
        "section_id": "SEC-NDLS-AGC-01",
        "start_km": 120.0,
        "end_km": 128.5,
        "scheduled_start_time": "2026-09-07T02:00:00Z",
        "scheduled_end_time": "2026-09-07T03:00:00Z",
        "tasks_bundled_count": 7,
        "departments": ["CIVIL", "ELECTRICAL", "SIGNAL_TELECOM"],
        "affected_trains_count": 0,
        "risk_score": 18.5,
        "optimization_score": 94.5,
        "status": "APPROVED",
        "pn_code": pn_code
    }
    _MOCK_BLOCKS.append(new_approved_block)
    return new_approved_block


@router.post("/{block_id}/reject", response_model=MaintenanceBlockResponse)
async def reject_block(
    block_id: str,
    current_user: dict = Depends(get_current_user)
):
    for b in _MOCK_BLOCKS:
        if b["block_id"] == block_id or b["id"] == block_id:
            b["status"] = "REJECTED"
            return b
    new_rejected_block = {
        "id": f"b0000000-0000-0000-0000-{(hash(block_id) % 899999999999) + 100000000000}",
        "block_id": block_id,
        "section_id": "SEC-NDLS-AGC-01",
        "start_km": 120.0,
        "end_km": 128.5,
        "scheduled_start_time": "2026-09-07T02:00:00Z",
        "scheduled_end_time": "2026-09-07T03:00:00Z",
        "tasks_bundled_count": 7,
        "departments": ["CIVIL", "ELECTRICAL", "SIGNAL_TELECOM"],
        "affected_trains_count": 0,
        "risk_score": 18.5,
        "optimization_score": 94.5,
        "status": "REJECTED",
        "pn_code": None
    }
    _MOCK_BLOCKS.append(new_rejected_block)
    return new_rejected_block
