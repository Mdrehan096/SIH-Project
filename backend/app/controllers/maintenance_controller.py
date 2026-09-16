"""
RETRACK – RailSync-AI Maintenance Controller (MVC: Controller Layer)
Manages maintenance request ingestion, updates, filtering, and Supabase synchronization.
"""

from typing import List, Dict, Any, Optional
from app.db.queries import query_manager


class MaintenanceController:
    """Controller handling business logic for maintenance jobs."""

    def get_all_requests(self, department: Optional[str] = None) -> List[Dict[str, Any]]:
        return query_manager.get_maintenance_requests(department=department)

    def get_request_by_id(self, request_id: str) -> Optional[Dict[str, Any]]:
        reqs = query_manager.get_maintenance_requests()
        for r in reqs:
            if r.get("id") == request_id or r.get("request_id") == request_id:
                return r
        return None

    def create_request(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return query_manager.create_maintenance_request(payload)

    def update_request(self, request_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        return query_manager.update_maintenance_request(request_id, updates)


maintenance_controller = MaintenanceController()
