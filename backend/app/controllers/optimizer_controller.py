"""
RETRACK – RailSync-AI Optimizer Controller (MVC: Controller Layer)
Orchestrates CP-SAT constraint optimization and multi-department corridor bundling.
"""

from typing import Dict, Any
from app.services.optimization_service import optimization_service
from app.services.bundling_service import bundling_engine


class OptimizerController:
    """Controller handling block possession optimization logic."""

    def run_optimization(self, request_payload: Dict[str, Any]) -> Dict[str, Any]:
        return optimization_service.solve(request_payload)

    def bundle_corridor_requests(self, section_id: str, distance_km: float = 5.0) -> Dict[str, Any]:
        return bundling_engine.generate_spatial_bundles(section_id=section_id, max_dist_km=distance_km)


optimizer_controller = OptimizerController()
