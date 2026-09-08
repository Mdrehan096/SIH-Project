import os
import logging
import joblib
from typing import Optional

logger = logging.getLogger("retrack.model_loader")

MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "saved_models/risk_model.joblib"))


class RiskModelLoader:
    """Singleton model loader for instant inference."""
    _instance: Optional["RiskModelLoader"] = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RiskModelLoader, cls).__new__(cls)
            cls._instance._load_model()
        return cls._instance

    def _load_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                self._model = joblib.load(MODEL_PATH)
                logger.info(f"Loaded Scikit-Learn Random Forest risk model from {MODEL_PATH}")
            except Exception as e:
                logger.error(f"Error loading joblib model: {e}")
                self._model = None
        else:
            logger.warning(f"Model file not found at {MODEL_PATH}. Will fallback to heuristic scoring.")

    def get_model(self):
        return self._model


model_loader = RiskModelLoader()
