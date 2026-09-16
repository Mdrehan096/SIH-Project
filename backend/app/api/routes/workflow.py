from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from app.core.security import get_current_user

router = APIRouter(prefix="/workflow", tags=["Digital Workflow & Approval Engine"])


class WorkflowTransitionRequest(BaseModel):
    block_id: str
    target_status: str
    review_notes: Optional[str] = None


FULL_WORKFLOW_STAGES = [
    "ASSET_OPERATIONAL",
    "INSPECTION_PENDING",
    "INSPECTION_COMPLETED",
    "DEFECT_DETECTED",
    "AI_RISK_EVALUATED",
    "RISK_CLASSIFIED",
    "MAINTENANCE_TASK_CREATED",
    "DEPARTMENT_ASSIGNED",
    "MAINTENANCE_PLANNED",
    "BLOCK_REQUESTED",
    "TRAIN_SCHEDULE_ANALYZED",
    "TRAIN_IMPACT_CALCULATED",
    "AI_WINDOW_RECOMMENDED",
    "PLANNER_REVIEWED",
    "OFFICER_APPROVED",
    "MAINTENANCE_SCHEDULED",
    "MAINTENANCE_EXECUTED",
    "COMPLETED",
    "ASSET_RECALCULATED",
    "AUDIT_RECORDED",
    "DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "SCHEDULED", "ACTIVE", "REJECTED", "CANCELLED", "RESCHEDULED"
]

WORKFLOW_HISTORY_STORE: Dict[str, List[Dict[str, Any]]] = {
    "BLK-2026-081": [
        {"status": "DRAFT", "timestamp": "2026-09-15 08:00:00 IST", "user": "Senior Track Engineer", "role": "ENGINEER", "notes": "Initial maintenance block draft created."},
        {"status": "SUBMITTED", "timestamp": "2026-09-15 09:15:00 IST", "user": "Senior Track Engineer", "role": "ENGINEER", "notes": "Submitted for divisional conflict review."},
        {"status": "UNDER_REVIEW", "timestamp": "2026-09-15 10:30:00 IST", "user": "Divisional Operations Manager", "role": "DIVISION_ADMIN", "notes": "Evaluating COA train path conflicts for 02:00-03:00 window."},
        {"status": "APPROVED", "timestamp": "2026-09-15 11:00:00 IST", "user": "Divisional Operations Manager", "role": "DIVISION_ADMIN", "notes": "CP-SAT optimization score 94.5 approved."},
        {"status": "SCHEDULED", "timestamp": "2026-09-15 11:30:00 IST", "user": "Zonal Principal Engineer", "role": "ZONE_ADMIN", "notes": "Block scheduled for 2026-09-16 02:00 AM possession."},
    ]
}


@router.get("/stages", response_model=List[str])
async def list_workflow_stages():
    return FULL_WORKFLOW_STAGES


@router.get("/history/{block_id}", response_model=List[Dict[str, Any]])
async def get_workflow_history(block_id: str, current_user: dict = Depends(get_current_user)):
    return WORKFLOW_HISTORY_STORE.get(block_id, [
        {"status": "DRAFT", "timestamp": "2026-09-15 08:00:00 IST", "user": current_user.get("full_name", "Planner"), "role": current_user.get("role", "PLANNER"), "notes": "Block draft initialized."}
    ])


@router.post("/transition", response_model=Dict[str, Any])
async def transition_workflow_status(
    payload: WorkflowTransitionRequest,
    current_user: dict = Depends(get_current_user)
):
    if payload.target_status not in FULL_WORKFLOW_STAGES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid target status '{payload.target_status}'.",
        )

    # Permission check for officer approval steps
    approval_steps = ["APPROVED", "OFFICER_APPROVED", "SCHEDULED", "MAINTENANCE_SCHEDULED", "ACTIVE", "COMPLETED"]
    if payload.target_status in approval_steps:
        allowed_roles = ["SUPER_ADMIN", "ADMIN", "ZONE_ADMIN", "DIVISION_ADMIN", "CONTROLLER", "RAILWAY_OFFICER", "PLANNER", "MAINTENANCE_MANAGER", "ENGINEER"]
        if current_user.get("role") not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Officer role '{current_user.get('role')}' is not authorized to execute workflow status '{payload.target_status}'.",
            )

    event_record = {
        "status": payload.target_status,
        "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S IST"),
        "user": current_user.get("full_name", "Railway Officer"),
        "role": current_user.get("role", "OFFICER"),
        "notes": payload.review_notes or f"Workflow state transitioned to {payload.target_status}.",
    }

    if payload.block_id not in WORKFLOW_HISTORY_STORE:
        WORKFLOW_HISTORY_STORE[payload.block_id] = []
    WORKFLOW_HISTORY_STORE[payload.block_id].append(event_record)

    return {
        "success": True,
        "block_id": payload.block_id,
        "current_status": payload.target_status,
        "updated_by": current_user.get("full_name"),
        "workflow_history": WORKFLOW_HISTORY_STORE[payload.block_id],
    }
