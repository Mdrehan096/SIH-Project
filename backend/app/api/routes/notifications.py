from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from app.core.security import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notification Center"])

MOCK_NOTIFICATIONS = [
    {
        "id": "NOTIF-001",
        "category": "CRITICAL_RISK",
        "title": "Critical Asset Risk Warning",
        "message": "Asset TRK-124 (KM 124.5) exceeded 75.0 risk score threshold. Joint possession recommended.",
        "timestamp": "10 mins ago",
        "read": False,
        "severity": "CRITICAL",
    },
    {
        "id": "NOTIF-002",
        "category": "BLOCK_APPROVAL",
        "title": "Block Approval Requested",
        "message": "Block BLK-2026-081 (02:00-03:00 AM) requires Divisional Operations Manager signoff.",
        "timestamp": "25 mins ago",
        "read": False,
        "severity": "WARNING",
    },
    {
        "id": "NOTIF-003",
        "category": "TRAIN_DELAY",
        "title": "Express Train Delay Notification",
        "message": "Train 12424 (Dibrugarh Rajdhani) delayed by +12 mins due to signal testing.",
        "timestamp": "45 mins ago",
        "read": True,
        "severity": "INFO",
    },
    {
        "id": "NOTIF-004",
        "category": "SYSTEM_SECURITY",
        "title": "Digital PN Verification Completed",
        "message": "PN-847291 successfully verified by Station Master (NDLS). Block Active.",
        "timestamp": "1 hour ago",
        "read": True,
        "severity": "SUCCESS",
    },
]


@router.get("", response_model=List[Dict[str, Any]])
async def get_notifications(current_user: dict = Depends(get_current_user)):
    return MOCK_NOTIFICATIONS
