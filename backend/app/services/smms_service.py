import uuid
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from app.db.queries import get_smms_feed, get_smms_message_by_id, add_smms_message, update_smms_message_status, _MOCK_MAINTENANCE_REQUESTS
from app.services.normalization_service import normalization_service

logger = logging.getLogger("retrack.smms")


class SMMSService:
    """Service layer for Electrical (OHE) and Signal/Telecom System (SMMS) feed ingestion."""

    def list_feed(
        self,
        department: Optional[str] = None,
        severity: Optional[str] = None,
        status_filter: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        messages = get_smms_feed()
        if department:
            dept_q = department.upper()
            messages = [m for m in messages if m.get("department") == dept_q or dept_q in str(m.get("department_id", "")).upper()]
        if severity:
            messages = [m for m in messages if m.get("severity") == severity]
        if status_filter:
            messages = [m for m in messages if m.get("status") == status_filter]
        if search:
            q = search.lower()
            messages = [
                m for m in messages
                if q in str(m.get("message_id", "")).lower()
                or q in str(m.get("asset_id", "")).lower()
                or q in str(m.get("issue_type", "")).lower()
                or q in str(m.get("location", "")).lower()
            ]
        return messages

    def get_message(self, message_id: str) -> Optional[Dict[str, Any]]:
        return get_smms_message_by_id(message_id)

    def ingest_message(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        msg_id = payload.get("message_id")
        if not msg_id:
            feed = get_smms_feed()
            msg_id = f"SMMS-{len(feed) + 1:03d}"

        new_uuid = str(uuid.uuid4())
        timestamp = datetime.now(timezone.utc).isoformat()
        
        loc_str = str(payload.get("location", "KM 145.1"))
        try:
            loc_km = float(payload.get("location_km") or loc_str.replace("KM", "").strip())
        except Exception:
            loc_km = 145.1

        dept = str(payload.get("department", "OHE")).upper()
        dept_id = "ELECTRICAL" if dept == "OHE" else "SIGNAL_TELECOM"

        smms_record = {
            "id": new_uuid,
            "message_id": msg_id,
            "source": "SMMS",
            "timestamp": timestamp,
            "department": dept,
            "department_id": dept_id,
            "asset_id": payload.get("asset_id", "OHE-442"),
            "location": f"KM {loc_km:.1f}" if not loc_str.startswith("KM") else loc_str,
            "location_km": loc_km,
            "issue_type": payload.get("issue_type", "Insulator Fault"),
            "severity": payload.get("severity", "HIGH"),
            "maintenance_required": payload.get("maintenance_required", True),
            "status": payload.get("status", "NEW"),
            "created_at": timestamp
        }

        saved = add_smms_message(smms_record)

        # UNIFIED INGESTION/NORMALIZATION PIPELINE SYNC
        norm_item = normalization_service.normalize_request({
            "id": new_uuid,
            "request_id": msg_id,
            "source_system": "SMMS",
            "department_id": dept_id,
            "asset_id": payload.get("asset_id", "OHE-442"),
            "task_type": f"{dept} {payload.get('issue_type', 'Maintenance')}",
            "section_id": "SEC-NDLS-AGC-01",
            "location_km": loc_km,
            "priority": payload.get("severity", "HIGH"),
            "severity": 82 if payload.get("severity") == "CRITICAL" else 68 if payload.get("severity") == "HIGH" else 45,
            "estimated_duration_minutes": 35,
            "required_block_type": "POWER_BLOCK" if dept == "OHE" else "CAUTION",
            "safety_requirements": ["OHE_DISCONNECT", "EARTH_ROD_PLACEMENT"] if dept == "OHE" else ["SIGNAL_MEMO"],
            "status": "PENDING"
        })

        if not any(r.get("request_id") == msg_id for r in _MOCK_MAINTENANCE_REQUESTS):
            _MOCK_MAINTENANCE_REQUESTS.insert(0, norm_item)
            logger.info(f"SMMS message '{msg_id}' normalized and ingested into unified maintenance pipeline.")

        return saved

    def update_status(self, message_id: str, new_status: str, severity: Optional[str] = None) -> Optional[Dict[str, Any]]:
        updated = update_smms_message_status(message_id, new_status)
        if updated and severity:
            updated["severity"] = severity
        return updated


smms_service = SMMSService()
