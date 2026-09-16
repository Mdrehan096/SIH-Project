from typing import List, Dict, Any, Optional
from app.services.coa_service import coa_service


class COAController:
    """Controller handling COA Train Operations & Route Feed actions (MVC Pattern)."""

    def get_routes(self) -> List[Dict[str, Any]]:
        return coa_service.list_routes()

    def get_trains(
        self,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        return coa_service.list_trains(status_filter=status, search=search)

    def get_train_details(self, train_id: str) -> Optional[Dict[str, Any]]:
        return coa_service.get_train_details(train_id)

    def process_coa_feed_update(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return coa_service.update_train_feed(payload)


coa_controller = COAController()
