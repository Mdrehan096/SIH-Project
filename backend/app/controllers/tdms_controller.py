from typing import List, Dict, Any, Optional
from app.services.tdms_service import tdms_service


class TDMSController:
    """Controller handling TDMS track defect feed actions (MVC Pattern)."""

    def get_tdms_feed(
        self,
        severity: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        return tdms_service.list_feed(severity=severity, status_filter=status, search=search)

    def get_tdms_defect(self, message_id: str) -> Optional[Dict[str, Any]]:
        return tdms_service.get_defect(message_id)

    def process_tdms_ingestion(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return tdms_service.ingest_defect(payload)

    def update_tdms_defect(self, message_id: str, new_status: str, severity: Optional[str] = None) -> Optional[Dict[str, Any]]:
        return tdms_service.update_status(message_id, new_status, severity)


tdms_controller = TDMSController()
