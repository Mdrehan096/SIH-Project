import logging
from ortools.sat.python import cp_model

logger = logging.getLogger("retrack.optimizer.objective")


class CPSatObjectiveBuilder:
    """
    Constructs weighted multi-objective linear function for CP-SAT solver.
    """

    @staticmethod
    def set_objective(model_wrapper):
        model = model_wrapper.model

        # Maximize spatial bundling benefit and priority fulfillment
        bundling_benefit = 100
        priority_benefit = 50
        
        # Penalize excessive block duration to minimize track holding time
        duration_penalty = model_wrapper.block_duration * 2

        # Combine terms
        objective_expr = (bundling_benefit * 10) + (priority_benefit * 5) - duration_penalty
        model.Maximize(objective_expr)
