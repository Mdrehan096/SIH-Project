import uuid
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from app.db.queries import get_tms_feed, get_tms_message_by_id, add_tms_message, update_tms_message_status, _MOCK_MAINTENANCE_REQUESTS
from app.services.normalization_service import normalization_service

logger = logging.getLogger("retrack.tms")


class TMSService:
    """Service layer for Track Management System (TMS) feed ingestion and pipeline normalization."""

    def list_feed(
        self,
        priority: Optional[str] = None,
        status_filter: Optional[str] = None,
        section: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        messages = get_tms_feed()
        if priority:
            messages = [m for m in messages if m.get("priority") == priority]
        if status_filter:
            messages = [m for m in messages if m.get("status") == status_filter]
        if section:
            messages = [m for m in messages if section.lower() in str(m.get("section", "")).lower()]
        if search:
            q = search.lower()
            messages = [
                m for m in messages
                if q in str(m.get("message_id", "")).lower()
                or q in str(m.get("track_id", "")).lower()
                or q in str(m.get("maintenance_type", "")).lower()
                or q in str(m.get("location", "")).lower()
            ]
        return messages

    def get_message(self, message_id: str) -> Optional[Dict[str, Any]]:
        return get_tms_message_by_id(message_id)

    def ingest_message(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        msg_id = payload.get("message_id")
        if not msg_id:
            feed = get_tms_feed()
            msg_id = f"TMS-{len(feed) + 1:03d}"

        new_uuid = str(uuid.uuid4())
        timestamp = datetime.now(timezone.utc).isoformat()
        
        # Parse location km float if string like "KM 142.5"
        loc_str = str(payload.get("location", "KM 120.0"))
        try:
            loc_km = float(payload.get("location_km") or loc_str.replace("KM", "").strip())
        except Exception:
            loc_km = 120.0

        tms_record = {
            "id": new_uuid,
            "message_id": msg_id,
            "source": "TMS",
            "timestamp": timestamp,
            "section": payload.get("section", "NDLS-AGC"),
            "section_id": payload.get("section_id", "SEC-NDLS-AGC-01"),
            "track_id": payload.get("track_id", "TRK-102"),
            "location": f"KM {loc_km:.1f}" if not loc_str.startswith("KM") else loc_str,
            "location_km": loc_km,
            "maintenance_type": payload.get("maintenance_type", "Track Inspection"),
            "priority": payload.get("priority", "HIGH"),
            "status": payload.get("status", "NEW"),
            "created_at": timestamp
        }

        saved = add_tms_message(tms_record)

        # UNIFIED INGESTION/NORMALIZATION PIPELINE SYNC
        norm_item = normalization_service.normalize_request({
            "id": new_uuid,
            "request_id": msg_id,
            "source_system": "TMS",
            "department_id": "CIVIL",
            "asset_id": payload.get("track_id", "TRK-102"),
            "task_type": payload.get("maintenance_type", "Track Inspection"),
            "section_id": payload.get("section_id", "SEC-NDLS-AGC-01"),
            "location_km": loc_km,
            "priority": payload.get("priority", "HIGH"),
            "severity": 80 if payload.get("priority") == "CRITICAL" else 65 if payload.get("priority") == "HIGH" else 45,
            "estimated_duration_minutes": 45,
            "required_block_type": "TRAFFIC_BLOCK",
            "safety_requirements": ["SPEED_RESTRICTION_30KMH", "LOOKOUT_MAN"],
            "status": "PENDING"
        })

        # Add to unified maintenance requests pool if not already present
        if not any(r.get("request_id") == msg_id for r in _MOCK_MAINTENANCE_REQUESTS):
            _MOCK_MAINTENANCE_REQUESTS.insert(0, norm_item)
            logger.info(f"TMS message '{msg_id}' normalized and ingested into unified maintenance pipeline.")

        return saved

    def update_status(self, message_id: str, new_status: str, priority: Optional[str] = None) -> Optional[Dict[str, Any]]:
        updated = update_tms_message_status(message_id, new_status)
        if updated and priority:
            updated["priority"] = priority
        return updated


tms_service = TMSService()
