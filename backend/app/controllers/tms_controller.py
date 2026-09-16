from typing import List, Dict, Any, Optional
from app.services.tms_service import tms_service


class TMSController:
    """Controller handling TMS operational feed actions (MVC Pattern)."""

    def get_tms_feed(
        self,
        priority: Optional[str] = None,
        status: Optional[str] = None,
        section: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        return tms_service.list_feed(priority=priority, status_filter=status, section=section, search=search)

    def get_tms_message(self, message_id: str) -> Optional[Dict[str, Any]]:
        return tms_service.get_message(message_id)

    def process_tms_ingestion(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return tms_service.ingest_message(payload)

    def update_tms_message(self, message_id: str, new_status: str, priority: Optional[str] = None) -> Optional[Dict[str, Any]]:
        return tms_service.update_status(message_id, new_status, priority)


tms_controller = TMSController()
