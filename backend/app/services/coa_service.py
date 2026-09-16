import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from app.db.queries import get_coa_routes, get_coa_trains, get_coa_train_by_id, update_coa_train_status, _MOCK_TRAINS

logger = logging.getLogger("retrack.coa")


class COAService:
    """Service layer for Control Office Application (COA) Train Operations & Route Feed."""

    def list_routes() -> List[Dict[str, Any]]:
        return get_coa_routes()

    def list_trains(
        self,
        status_filter: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        trains = get_coa_trains()
        if status_filter:
            trains = [t for t in trains if t.get("status") == status_filter]
        if search:
            q = search.lower()
            trains = [
                t for t in trains
                if q in str(t.get("train_number", "")).lower()
                or q in str(t.get("train_name", "")).lower()
                or q in str(t.get("origin", "")).lower()
                or q in str(t.get("destination", "")).lower()
                or q in str(t.get("current_station", "")).lower()
            ]
        return trains

    def get_train_details(self, train_id: str) -> Optional[Dict[str, Any]]:
        train = get_coa_train_by_id(train_id)
        if not train:
            return None
        
        routes = get_coa_routes()
        route_data = routes[0] if routes else None
        
        return {
            "train": train,
            "route": route_data
        }

    def update_train_feed(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        train_id = str(payload.get("train_id") or payload.get("train_number") or "12001")
        
        updated = update_coa_train_status(train_id, payload)
        
        # UNIFIED TRAIN TIMETABLE CONSTRAINTS SYNC
        # Synchronize with core trains store for safety validation engine
        for trn in _MOCK_TRAINS:
            if trn.get("train_number") == train_id or trn.get("id") == train_id:
                if payload.get("status"):
                    trn["status"] = payload["status"]
                if payload.get("delay_minutes") is not None:
                    trn["delay_minutes"] = payload["delay_minutes"]
                break

        logger.info(f"COA train update received for Train '{train_id}': Location {payload.get('current_station')}, Status {payload.get('status')}")
        return updated


coa_service = COAService()
