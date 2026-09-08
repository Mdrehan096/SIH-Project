import logging
from typing import Any, Dict, List
from datetime import datetime, timezone

logger = logging.getLogger("retrack.normalization")


class DataNormalizationService:
    """
    Standardizes and normalizes multi-source payloads from TMS, TDMS, SMMS, and COA
    into clean, unified database entities.
    """

    PRIORITY_WEIGHTS = {
        "LOW": 1,
        "MEDIUM": 2,
        "HIGH": 3,
        "CRITICAL": 4,
    }

    def normalize_request(self, raw_item: Dict[str, Any]) -> Dict[str, Any]:
        source = str(raw_item.get("source_system", "TMS")).upper()
        dept = str(raw_item.get("department_id", raw_item.get("department", "CIVIL"))).upper()
        
        priority = str(raw_item.get("priority", "MEDIUM")).upper()
        if priority not in self.PRIORITY_WEIGHTS:
            priority = "MEDIUM"

        severity = int(raw_item.get("severity", 50))
        severity = min(max(severity, 0), 100)

        duration = int(raw_item.get("estimated_duration_minutes", raw_item.get("duration_minutes", 30)))
        duration = max(duration, 15)

        location_km = float(raw_item.get("location_km", 0.0))

        safety_reqs = raw_item.get("safety_requirements", [])
        if isinstance(safety_reqs, str):
            safety_reqs = [s.strip() for s in safety_reqs.split(",") if s.strip()]

        block_type = str(raw_item.get("required_block_type", "TRAFFIC_BLOCK")).upper()

        return {
            "id": str(raw_item.get("id", f"uuid-{raw_item.get('request_id', '000')}")),
            "request_id": str(raw_item.get("request_id", "REQ-000")),
            "source_system": source,
            "department_id": dept,
            "department": dept,
            "asset_id": str(raw_item.get("asset_id", "TRK-000")),
            "task_type": str(raw_item.get("task_type", "Routine Maintenance")),
            "section_id": str(raw_item.get("section_id", "SEC-NDLS-AGC-01")),
            "location_km": location_km,
            "latitude": float(raw_item["latitude"]) if raw_item.get("latitude") is not None else None,
            "longitude": float(raw_item["longitude"]) if raw_item.get("longitude") is not None else None,
            "priority": priority,
            "priority_weight": self.PRIORITY_WEIGHTS[priority],
            "severity": severity,
            "estimated_duration_minutes": duration,
            "required_block_type": block_type,
            "safety_requirements": safety_reqs,
            "status": str(raw_item.get("status", "PENDING")).upper(),
            "created_at": str(raw_item.get("created_at", datetime.now(timezone.utc).isoformat()))
        }

    def normalize_request_list(self, raw_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        return [self.normalize_request(item) for item in raw_list]


normalization_service = DataNormalizationService()
