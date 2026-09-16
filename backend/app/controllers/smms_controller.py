from typing import List, Dict, Any, Optional
from app.services.smms_service import smms_service


class SMMSController:
    """Controller handling SMMS Electrical OHE & Signal/Telecom feed actions (MVC Pattern)."""

    def get_smms_feed(
        self,
        department: Optional[str] = None,
        severity: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        return smms_service.list_feed(department=department, severity=severity, status_filter=status, search=search)

    def get_smms_message(self, message_id: str) -> Optional[Dict[str, Any]]:
        return smms_service.get_message(message_id)

    def process_smms_ingestion(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return smms_service.ingest_message(payload)

    def update_smms_message(self, message_id: str, new_status: str, severity: Optional[str] = None) -> Optional[Dict[str, Any]]:
        return smms_service.update_status(message_id, new_status, severity)


smms_controller = SMMSController()
