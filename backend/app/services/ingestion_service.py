import os
import logging
from typing import Any, Dict, List
import pandas as pd

logger = logging.getLogger("retrack.ingestion")

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data"))


class BaseAdapter:
    """Base class for source system adapters."""
    def normalize(self, raw_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        raise NotImplementedError


class TMSAdapter(BaseAdapter):
    """Adapter for Track Maintenance System (TMS) - Civil Track Work."""
    def normalize(self, raw_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for item in raw_data:
            normalized.append({
                "source_system": "TMS",
                "request_id": str(item.get("request_id", "")),
                "department_id": "CIVIL",
                "department": "CIVIL",
                "asset_id": str(item.get("asset_id", "")),
                "task_type": str(item.get("task_type", "Track Maintenance")),
                "section_id": str(item.get("section_id", "SEC-NDLS-AGC-01")),
                "location_km": float(item.get("location_km", 0.0)),
                "latitude": float(item.get("latitude")) if item.get("latitude") else None,
                "longitude": float(item.get("longitude")) if item.get("longitude") else None,
                "priority": str(item.get("priority", "MEDIUM")),
                "severity": int(item.get("severity", 50)),
                "estimated_duration_minutes": int(item.get("estimated_duration_minutes", 30)),
                "required_block_type": str(item.get("required_block_type", "TRAFFIC_BLOCK")),
                "safety_requirements": str(item.get("safety_requirements", "")).split(","),
                "status": str(item.get("status", "PENDING")),
                "created_at": str(item.get("created_at", ""))
            })
        return normalized


class TDMSAdapter(BaseAdapter):
    """Adapter for Track Defect Management System (TDMS) - Flaw Detection & Machine Maintenance."""
    def normalize(self, raw_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for item in raw_data:
            normalized.append({
                "source_system": "TDMS",
                "request_id": str(item.get("request_id", "")),
                "department_id": "CIVIL",
                "department": "CIVIL",
                "asset_id": str(item.get("asset_id", "")),
                "task_type": str(item.get("task_type", "Track Defect Repair")),
                "section_id": str(item.get("section_id", "SEC-NDLS-AGC-01")),
                "location_km": float(item.get("location_km", 0.0)),
                "latitude": float(item.get("latitude")) if item.get("latitude") else None,
                "longitude": float(item.get("longitude")) if item.get("longitude") else None,
                "priority": str(item.get("priority", "HIGH")),
                "severity": int(item.get("severity", 65)),
                "estimated_duration_minutes": int(item.get("estimated_duration_minutes", 40)),
                "required_block_type": str(item.get("required_block_type", "TRAFFIC_BLOCK")),
                "safety_requirements": str(item.get("safety_requirements", "")).split(","),
                "status": str(item.get("status", "PENDING")),
                "created_at": str(item.get("created_at", ""))
            })
        return normalized


class SMMSAdapter(BaseAdapter):
    """Adapter for Signal & Material Management System (SMMS) - Electrical OHE & S&T."""
    def normalize(self, raw_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for item in raw_data:
            dept = str(item.get("department_id", "SIGNAL_TELECOM"))
            normalized.append({
                "source_system": "SMMS",
                "request_id": str(item.get("request_id", "")),
                "department_id": dept,
                "department": dept,
                "asset_id": str(item.get("asset_id", "")),
                "task_type": str(item.get("task_type", "OHE/Signal Maintenance")),
                "section_id": str(item.get("section_id", "SEC-NDLS-AGC-01")),
                "location_km": float(item.get("location_km", 0.0)),
                "latitude": float(item.get("latitude")) if item.get("latitude") else None,
                "longitude": float(item.get("longitude")) if item.get("longitude") else None,
                "priority": str(item.get("priority", "MEDIUM")),
                "severity": int(item.get("severity", 55)),
                "estimated_duration_minutes": int(item.get("estimated_duration_minutes", 30)),
                "required_block_type": str(item.get("required_block_type", "POWER_BLOCK")),
                "safety_requirements": str(item.get("safety_requirements", "")).split(","),
                "status": str(item.get("status", "PENDING")),
                "created_at": str(item.get("created_at", ""))
            })
        return normalized


class COAAdapter(BaseAdapter):
    """Adapter for Control Office Application (COA) - Train Movements & Paths."""
    def normalize(self, raw_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for item in raw_data:
            normalized.append({
                "id": str(item.get("id", "")),
                "train_id": str(item.get("train_id", "")),
                "train_number": str(item.get("train_number", "")),
                "section_id": str(item.get("section_id", "SEC-NDLS-AGC-01")),
                "start_km": float(item.get("start_km", 0.0)),
                "end_km": float(item.get("end_km", 200.0)),
                "scheduled_arrival": str(item.get("scheduled_arrival", "")),
                "scheduled_departure": str(item.get("scheduled_departure", "")),
                "delay_minutes": int(item.get("delay_minutes", 0))
            })
        return normalized


class MultiSourceIngestionService:
    """Service to aggregate, normalize, and ingest data from TMS, TDMS, SMMS, and COA."""
    def __init__(self):
        self.tms_adapter = TMSAdapter()
        self.tdms_adapter = TDMSAdapter()
        self.smms_adapter = SMMSAdapter()
        self.coa_adapter = COAAdapter()

    def ingest_all_maintenance_requests(self) -> List[Dict[str, Any]]:
        file_path = os.path.join(DATA_DIR, "maintenance.csv")
        if not os.path.exists(file_path):
            logger.warning(f"Maintenance CSV file not found at {file_path}")
            return []
        
        df = pd.read_csv(file_path)
        records = df.to_dict(orient="records")

        tms_raw = [r for r in records if r.get("source_system") == "TMS"]
        tdms_raw = [r for r in records if r.get("source_system") == "TDMS"]
        smms_raw = [r for r in records if r.get("source_system") == "SMMS"]

        tms_norm = TMSAdapter().normalize(tms_raw)
        tdms_norm = TDMSAdapter().normalize(tdms_raw)
        smms_norm = SMMSAdapter().normalize(smms_raw)

        all_normalized = tms_norm + tdms_norm + smms_norm
        logger.info(f"Ingested {len(all_normalized)} maintenance requests (TMS: {len(tms_norm)}, TDMS: {len(tdms_norm)}, SMMS: {len(smms_norm)})")
        return all_normalized

    def ingest_coa_train_paths(self) -> List[Dict[str, Any]]:
        file_path = os.path.join(DATA_DIR, "train_paths.csv")
        if not os.path.exists(file_path):
            logger.warning(f"Train paths CSV file not found at {file_path}")
            return []
        
        df = pd.read_csv(file_path)
        records = df.to_dict(orient="records")
        return self.coa_adapter.normalize(records)


ingestion_service = MultiSourceIngestionService()
