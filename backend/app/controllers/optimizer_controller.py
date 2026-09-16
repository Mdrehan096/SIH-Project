"""
RETRACK – RailSync-AI Optimizer Controller (MVC: Controller Layer)
Orchestrates CP-SAT constraint optimization and multi-department corridor bundling.
"""

from typing import Dict, Any
from app.services.optimization_service import optimization_service
from app.services.bundling_service import bundling_service


class OptimizerController:
    """Controller handling block possession optimization logic."""

    def run_optimization(self, request_payload: Dict[str, Any]) -> Dict[str, Any]:
        return optimization_service.solve(request_payload)

    def bundle_corridor_requests(self, section_id: str, distance_km: float = 5.0) -> Dict[str, Any]:
        return bundling_service.bundle_by_corridor(section_id=section_id, max_distance_km=distance_km)


optimizer_controller = OptimizerController()
