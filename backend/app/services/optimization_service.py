import logging
from typing import Dict, Any
from optimizer.scheduler import block_scheduler

logger = logging.getLogger("retrack.optimization_service")


class OptimizationService:
    """Service wrapper for CP-SAT block optimizer."""
    
    def run_optimization(self, section_id: str = "SEC-NDLS-AGC-01", time_limit_seconds: float = 10.0) -> Dict[str, Any]:
        return block_scheduler.generate_optimal_block_schedule(
            section_id=section_id,
            time_limit_seconds=time_limit_seconds
        )


optimization_service = OptimizationService()
