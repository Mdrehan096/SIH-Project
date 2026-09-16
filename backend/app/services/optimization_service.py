import logging
from typing import Dict, Any
from optimizer.scheduler import block_scheduler

logger = logging.getLogger("retrack.optimization_service")


class OptimizationService:
    """Service wrapper for CP-SAT block optimizer."""
    
    def run_optimization(
        self,
        section_id: str = "SEC-NDLS-AGC-01",
        time_limit_seconds: float = 10.0,
        max_bundling_distance_km: float = 5.0,
        max_block_duration_minutes: int = 60,
        department_filters: Any = None
    ) -> Dict[str, Any]:
        return block_scheduler.generate_optimal_block_schedule(
            section_id=section_id,
            time_limit_seconds=time_limit_seconds,
            max_bundling_distance_km=max_bundling_distance_km,
            max_block_duration_minutes=max_block_duration_minutes,
            department_filters=department_filters
        )


optimization_service = OptimizationService()
