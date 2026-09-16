from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from datetime import datetime, timezone
from app.core.security import get_current_user

router = APIRouter(prefix="/audit", tags=["Audit Trail & Compliance Logs"])

MOCK_AUDIT_LOGS = [
    {
        "id": "LOG-2026-001",
        "action": "USER_LOGIN",
        "user_email": "admin@retrack.gov.in",
        "user_role": "SUPER_ADMIN",
        "entity": "SYSTEM_AUTH",
        "timestamp": "2026-09-15 18:30:00 IST",
        "details": "User Chief Operations Admin (IRHQ) successfully authenticated.",
        "ip_address": "10.14.22.105",
    },
    {
        "id": "LOG-2026-002",
        "action": "BLOCK_POSSESSION_APPROVED",
        "user_email": "controller@railsync.ir",
        "user_role": "CONTROLLER",
        "entity": "BLK-2026-081",
        "timestamp": "2026-09-15 18:35:10 IST",
        "details": "Approved recommended 5 km joint possession block window (02:00-03:00 AM, KM 120.0-128.5).",
        "ip_address": "10.14.22.112",
    },
    {
        "id": "LOG-2026-003",
        "action": "DIGITAL_PN_GENERATED",
        "user_email": "controller@railsync.ir",
        "user_role": "CONTROLLER",
        "entity": "PN-847291",
        "timestamp": "2026-09-15 18:35:12 IST",
        "details": "Generated cryptographic Private Number (PN-847291) for Block BLK-2026-081.",
        "ip_address": "10.14.22.112",
    },
    {
        "id": "LOG-2026-004",
        "action": "DIGITAL_PN_VERIFIED",
        "user_email": "officer@retrack.gov.in",
        "user_role": "DIVISION_ADMIN",
        "entity": "PN-847291",
        "timestamp": "2026-09-15 18:35:45 IST",
        "details": "Station Master verified PN Code. Block possession authorized ACTIVE for Section NDLS-AGC.",
        "ip_address": "10.14.22.140",
    },
    {
        "id": "LOG-2026-005",
        "action": "RISK_PREDICTION_EVALUATED",
        "user_email": "system@retrack.gov.in",
        "user_role": "SYSTEM",
        "entity": "TRK-124",
        "timestamp": "2026-09-15 18:49:31 IST",
        "details": "Random Forest Risk Engine evaluated score 78.5 (HIGH risk category) on asset TRK-124.",
        "ip_address": "127.0.0.1",
    },
]


@router.get("", response_model=List[Dict[str, Any]])
async def get_audit_logs(current_user: dict = Depends(get_current_user)):
    return MOCK_AUDIT_LOGS
