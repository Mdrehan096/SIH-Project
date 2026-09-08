import os
import pandas as pd
from app.services.ingestion_service import ingestion_service, TMSAdapter, TDMSAdapter, SMMSAdapter, COAAdapter

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data"))


def test_synthetic_csv_files_exist():
    expected_files = [
        "departments.csv",
        "assets.csv",
        "maintenance.csv",
        "trains.csv",
        "train_paths.csv",
        "historical_defects.csv",
        "constraints.csv",
    ]
    for filename in expected_files:
        filepath = os.path.join(DATA_DIR, filename)
        assert os.path.exists(filepath), f"File {filename} does not exist."
        df = pd.read_csv(filepath)
        assert len(df) > 0, f"File {filename} is empty."


def test_synthetic_datasets_volume():
    assets_df = pd.read_csv(os.path.join(DATA_DIR, "assets.csv"))
    assert len(assets_df) >= 50

    maint_df = pd.read_csv(os.path.join(DATA_DIR, "maintenance.csv"))
    assert len(maint_df) >= 100

    trains_df = pd.read_csv(os.path.join(DATA_DIR, "trains.csv"))
    assert len(trains_df) >= 50

    paths_df = pd.read_csv(os.path.join(DATA_DIR, "train_paths.csv"))
    assert len(paths_df) >= 500

    defects_df = pd.read_csv(os.path.join(DATA_DIR, "historical_defects.csv"))
    assert len(defects_df) >= 200

    constraints_df = pd.read_csv(os.path.join(DATA_DIR, "constraints.csv"))
    assert len(constraints_df) >= 20


def test_tms_adapter():
    adapter = TMSAdapter()
    raw = [{"request_id": "TMS-001", "asset_id": "TRK-120", "location_km": "120.0", "priority": "HIGH"}]
    norm = adapter.normalize(raw)
    assert len(norm) == 1
    assert norm[0]["source_system"] == "TMS"
    assert norm[0]["department_id"] == "CIVIL"
    assert norm[0]["location_km"] == 120.0


def test_multi_source_ingestion_service():
    maint_requests = ingestion_service.ingest_all_maintenance_requests()
    assert isinstance(maint_requests, list)
    assert len(maint_requests) >= 100

    coa_paths = ingestion_service.ingest_coa_train_paths()
    assert isinstance(coa_paths, list)
    assert len(coa_paths) >= 500
