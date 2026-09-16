import uuid
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from app.db.queries import get_tdms_feed, get_tdms_defect_by_id, add_tdms_defect, update_tdms_defect_status, _MOCK_MAINTENANCE_REQUESTS
from app.services.normalization_service import normalization_service

logger = logging.getLogger("retrack.tdms")


class TDMSService:
    """Service layer for Track Defect Management System (TDMS) feed ingestion and pipeline normalization."""

    def list_feed(
        self,
        severity: Optional[str] = None,
        status_filter: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        defects = get_tdms_feed()
        if severity:
            defects = [d for d in defects if d.get("severity") == severity]
        if status_filter:
            defects = [d for d in defects if d.get("status") == status_filter]
        if search:
            q = search.lower()
            defects = [
                d for d in defects
                if q in str(d.get("message_id", "")).lower()
                or q in str(d.get("track_id", "")).lower()
                or q in str(d.get("defect_type", "")).lower()
                or q in str(d.get("location", "")).lower()
            ]
        return defects

    def get_defect(self, message_id: str) -> Optional[Dict[str, Any]]:
        return get_tdms_defect_by_id(message_id)

    def ingest_defect(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        msg_id = payload.get("message_id")
        if not msg_id:
            feed = get_tdms_feed()
            msg_id = f"TDMS-{len(feed) + 1:03d}"

        new_uuid = str(uuid.uuid4())
        timestamp = datetime.now(timezone.utc).isoformat()
        
        loc_str = str(payload.get("location", "KM 122.0"))
        try:
            loc_km = float(payload.get("location_km") or loc_str.replace("KM", "").strip())
        except Exception:
            loc_km = 122.0

        risk_score = float(payload.get("risk_score", 75.0))

        tdms_record = {
            "id": new_uuid,
            "message_id": msg_id,
            "source": "TDMS",
            "timestamp": timestamp,
            "track_id": payload.get("track_id", "TRK-102"),
            "location": f"KM {loc_km:.1f}" if not loc_str.startswith("KM") else loc_str,
            "location_km": loc_km,
            "defect_type": payload.get("defect_type", "Rail Crack"),
            "severity": payload.get("severity", "CRITICAL"),
            "risk_score": risk_score,
            "status": payload.get("status", "OPEN"),
            "created_at": timestamp
        }

        saved = add_tdms_defect(tdms_record)

        # UNIFIED INGESTION/NORMALIZATION PIPELINE SYNC
        norm_item = normalization_service.normalize_request({
            "id": new_uuid,
            "request_id": msg_id,
            "source_system": "TDMS",
            "department_id": "CIVIL",
            "asset_id": payload.get("track_id", "TRK-102"),
            "task_type": f"Defect Repair ({payload.get('defect_type', 'Rail Crack')})",
            "section_id": "SEC-NDLS-AGC-01",
            "location_km": loc_km,
            "priority": "HIGH" if payload.get("severity") in ["HIGH", "CRITICAL"] else "MEDIUM",
            "severity": int(risk_score),
            "estimated_duration_minutes": 40,
            "required_block_type": "TRAFFIC_BLOCK",
            "safety_requirements": ["SPEED_RESTRICTION_20KMH", "TRACK_CAUTION"],
            "status": "PENDING"
        })

        if not any(r.get("request_id") == msg_id for r in _MOCK_MAINTENANCE_REQUESTS):
            _MOCK_MAINTENANCE_REQUESTS.insert(0, norm_item)
            logger.info(f"TDMS defect '{msg_id}' normalized and ingested into unified maintenance pipeline.")

        return saved

    def update_status(self, message_id: str, new_status: str, severity: Optional[str] = None) -> Optional[Dict[str, Any]]:
        updated = update_tdms_defect_status(message_id, new_status)
        if updated and severity:
            updated["severity"] = severity
        return updated


tdms_service = TDMSService()
