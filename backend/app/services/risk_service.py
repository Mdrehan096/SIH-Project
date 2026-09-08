import logging
from typing import Any, Dict
from ai.risk_model import predict_risk_score
from app.db.queries import get_maintenance_request_by_id

logger = logging.getLogger("retrack.risk_service")


class RiskScoringService:
    """Service wrapper linking risk predictions with database entities."""
    
    def evaluate_request_risk(self, data: Dict[str, Any]) -> Dict[str, Any]:
        result = predict_risk_score(data)
        return {
            "success": True,
            "asset_id": data.get("asset_id", "TRK-124"),
            "risk_score": result["risk_score"],
            "risk_category": result["risk_category"],
            "failure_probability": result["failure_probability"],
            "feature_importance": result["feature_importance"],
            "recommendation": result["recommendation"],
        }


risk_service = RiskScoringService()
