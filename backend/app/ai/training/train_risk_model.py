import os
import logging
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("train_risk_model")

DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data/historical_defects.csv"))
MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../saved_models"))
os.makedirs(MODEL_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODEL_DIR, "risk_model.joblib")

FEATURE_COLUMNS = [
    "asset_age",
    "defect_severity",
    "defect_frequency",
    "previous_failures",
    "traffic_density",
    "maintenance_delay",
    "inspection_score",
    "environmental_factor",
]
TARGET_COLUMN = "risk_score"


def train_model():
    logger.info(f"Loading historical defect training data from: {DATA_PATH}")
    df = pd.read_csv(DATA_PATH)
    
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    logger.info(f"Training Scikit-Learn RandomForestRegressor on {len(X_train)} samples...")
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    logger.info(f"Model Evaluation Results:")
    logger.info(f"  - MAE: {mae:.4f}")
    logger.info(f"  - RMSE: {rmse:.4f}")
    logger.info(f"  - R² Score: {r2:.4f}")

    joblib.dump(model, MODEL_PATH)
    logger.info(f"Successfully saved trained Random Forest model artifact to: {MODEL_PATH}")


if __name__ == "__main__":
    train_model()
