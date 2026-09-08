import logging
from typing import Any, Dict
from ai.feature_engineering import extract_risk_features, FEATURE_COLUMNS
from ai.model_loader import model_loader

logger = logging.getLogger("retrack.risk_model")


def predict_risk_score(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Predicts asset risk score (0-100), category, failure probability,
    and feature importances using Scikit-Learn Random Forest model.
    """
    features_df = extract_risk_features(data)
    model = model_loader.get_model()

    if model is not None:
        try:
            score_pred = float(model.predict(features_df)[0])
            score = min(max(round(score_pred, 2), 0.0), 100.0)
            
            # Extract feature importances from fitted model
            importances = dict(zip(FEATURE_COLUMNS, [round(float(imp), 4) for imp in model.feature_importances_]))
        except Exception as e:
            logger.error(f"Inference error with joblib model: {e}. Using fallback formula.")
            score = _fallback_heuristic_score(data)
            importances = _default_importances()
    else:
        score = _fallback_heuristic_score(data)
        importances = _default_importances()

    # Determine risk category
    if score <= 25.0:
        category = "LOW"
    elif score <= 50.0:
        category = "MEDIUM"
    elif score <= 75.0:
        category = "HIGH"
    else:
        category = "CRITICAL"

    prob = min(round(score / 100.0, 4), 0.99)

    return {
        "risk_score": score,
        "risk_category": category,
        "failure_probability": prob,
        "feature_importance": importances,
        "recommendation": f"Risk category is {category}. Priority block possession scheduling advised."
        if category in ["HIGH", "CRITICAL"] else "Routine periodic inspection recommended."
    }


def _fallback_heuristic_score(data: Dict[str, Any]) -> float:
    sev = float(data.get("defect_severity", 50))
    freq = float(data.get("defect_frequency", 2))
    fail = float(data.get("previous_failures", 1))
    insp = float(data.get("inspection_score", 70))
    env = float(data.get("environmental_factor", 1.0))
    
    score = ((sev * 0.35) + (freq * 8.0) + (fail * 12.0) + ((100 - insp) * 0.25)) * env
    return min(max(round(score, 2), 0.0), 100.0)


def _default_importances() -> Dict[str, float]:
    return {
        "defect_severity": 0.35,
        "previous_failures": 0.25,
        "defect_frequency": 0.20,
        "inspection_score": 0.12,
        "asset_age": 0.08,
    }
