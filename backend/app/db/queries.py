import logging
from typing import Any, Dict, List, Optional
from datetime import datetime, timezone
from app.db.connection import db_manager

logger = logging.getLogger("retrack.queries")

# In-memory storage for standalone fallback mode
_MOCK_MAINTENANCE_REQUESTS = [
    {
        "id": "10000000-0000-0000-0000-000000000001",
        "request_id": "TMS-001",
        "source_system": "TMS",
        "department_id": "CIVIL",
        "department": "CIVIL",
        "asset_id": "TRK-120",
        "task_type": "Track Rail Replacement",
        "section_id": "SEC-NDLS-AGC-01",
        "location_km": 120.0,
        "latitude": 28.6139,
        "longitude": 77.2090,
        "priority": "HIGH",
        "severity": 78,
        "estimated_duration_minutes": 45,
        "required_block_type": "TRAFFIC_BLOCK",
        "safety_requirements": ["SPEED_RESTRICTION_30KMH", "LOOKOUT_MAN"],
        "status": "PENDING",
        "created_at": "2026-09-06T10:00:00Z"
    },
    {
        "id": "10000000-0000-0000-0000-000000000002",
        "request_id": "TDMS-002",
        "source_system": "TDMS",
        "department_id": "CIVIL",
        "department": "CIVIL",
        "asset_id": "TRK-122",
        "task_type": "Ultrasonic Rail Flaw Detection Repair",
        "section_id": "SEC-NDLS-AGC-01",
        "location_km": 122.0,
        "latitude": 28.5900,
        "longitude": 77.2200,
        "priority": "MEDIUM",
        "severity": 62,
        "estimated_duration_minutes": 30,
        "required_block_type": "TRAFFIC_BLOCK",
        "safety_requirements": ["TRACK_CAUTION"],
        "status": "PENDING",
        "created_at": "2026-09-06T10:05:00Z"
    },
    {
        "id": "10000000-0000-0000-0000-000000000003",
        "request_id": "SMMS-003",
        "source_system": "SMMS",
        "department_id": "ELECTRICAL",
        "department": "ELECTRICAL",
        "asset_id": "OHE-124",
        "task_type": "OHE Catenary Wire Inspection & Tensioning",
        "section_id": "SEC-NDLS-AGC-01",
        "location_km": 124.2,
        "latitude": 28.5700,
        "longitude": 77.2300,
        "priority": "HIGH",
        "severity": 82,
        "estimated_duration_minutes": 40,
        "required_block_type": "POWER_BLOCK",
        "safety_requirements": ["OHE_DISCONNECT", "EARTH_ROD_PLACEMENT"],
        "status": "PENDING",
        "created_at": "2026-09-06T10:10:00Z"
    },
    {
        "id": "10000000-0000-0000-0000-000000000004",
        "request_id": "TMS-004",
        "source_system": "TMS",
        "department_id": "CIVIL",
        "department": "CIVIL",
        "asset_id": "TRK-124",
        "task_type": "Deep Ballast Tamp & Rail Grinding",
        "section_id": "SEC-NDLS-AGC-01",
        "location_km": 124.5,
        "latitude": 28.5650,
        "longitude": 77.2350,
        "priority": "CRITICAL",
        "severity": 90,
        "estimated_duration_minutes": 60,
        "required_block_type": "JOINT_POSSESSION",
        "safety_requirements": ["TRAFFIC_BLOCK", "POWER_BLOCK"],
        "status": "PENDING",
        "created_at": "2026-09-06T10:15:00Z"
    },
    {
        "id": "10000000-0000-0000-0000-000000000005",
        "request_id": "SMMS-005",
        "source_system": "SMMS",
        "department_id": "SIGNAL_TELECOM",
        "department": "SIGNAL_TELECOM",
        "asset_id": "SIG-125",
        "task_type": "Signal Relay Box & Track Circuit Testing",
        "section_id": "SEC-NDLS-AGC-01",
        "location_km": 125.0,
        "latitude": 28.5600,
        "longitude": 77.2400,
        "priority": "MEDIUM",
        "severity": 55,
        "estimated_duration_minutes": 30,
        "required_block_type": "CAUTION",
        "safety_requirements": ["SIGNAL_DISCONNECT_MEMO"],
        "status": "PENDING",
        "created_at": "2026-09-06T10:20:00Z"
    },
    {
        "id": "10000000-0000-0000-0000-000000000006",
        "request_id": "TMS-006",
        "source_system": "TMS",
        "department_id": "CIVIL",
        "department": "CIVIL",
        "asset_id": "TRK-126",
        "task_type": "Sleeper Fastening & Bolt Tightening",
        "section_id": "SEC-NDLS-AGC-01",
        "location_km": 126.0,
        "latitude": 28.5500,
        "longitude": 77.2500,
        "priority": "LOW",
        "severity": 35,
        "estimated_duration_minutes": 25,
        "required_block_type": "CAUTION",
        "safety_requirements": ["LOOKOUT_MAN"],
        "status": "PENDING",
        "created_at": "2026-09-06T10:25:00Z"
    },
    {
        "id": "10000000-0000-0000-0000-000000000007",
        "request_id": "TDMS-007",
        "source_system": "TDMS",
        "department_id": "CIVIL",
        "department": "CIVIL",
        "asset_id": "TRK-128",
        "task_type": "Weld Defect Rectification",
        "section_id": "SEC-NDLS-AGC-01",
        "location_km": 128.5,
        "latitude": 28.5300,
        "longitude": 77.2700,
        "priority": "HIGH",
        "severity": 74,
        "estimated_duration_minutes": 35,
        "required_block_type": "TRAFFIC_BLOCK",
        "safety_requirements": ["SPEED_RESTRICTION_20KMH"],
        "status": "PENDING",
        "created_at": "2026-09-06T10:30:00Z"
    },
    {
        "id": "10000000-0000-0000-0000-000000000008",
        "request_id": "TMS-008",
        "source_system": "TMS",
        "department_id": "CIVIL",
        "department": "CIVIL",
        "asset_id": "TRK-045",
        "task_type": "Routine Track Geometry Inspection",
        "section_id": "SEC-NDLS-AGC-01",
        "location_km": 45.0,
        "latitude": 28.3000,
        "longitude": 77.4000,
        "priority": "LOW",
        "severity": 25,
        "estimated_duration_minutes": 30,
        "required_block_type": "CAUTION",
        "safety_requirements": ["LOOKOUT_MAN"],
        "status": "PENDING",
        "created_at": "2026-09-06T10:35:00Z"
    },
    {
        "id": "10000000-0000-0000-0000-000000000009",
        "request_id": "SMMS-009",
        "source_system": "SMMS",
        "department_id": "ELECTRICAL",
        "department": "ELECTRICAL",
        "asset_id": "OHE-046",
        "task_type": "OHE Insulator Cleaning",
        "section_id": "SEC-NDLS-AGC-01",
        "location_km": 46.0,
        "latitude": 28.2900,
        "longitude": 77.4100,
        "priority": "LOW",
        "severity": 30,
        "estimated_duration_minutes": 30,
        "required_block_type": "POWER_BLOCK",
        "safety_requirements": ["OHE_DISCONNECT"],
        "status": "PENDING",
        "created_at": "2026-09-06T10:40:00Z"
    },
    {
        "id": "10000000-0000-0000-0000-000000000010",
        "request_id": "SMMS-010",
        "source_system": "SMMS",
        "department_id": "SIGNAL_TELECOM",
        "department": "SIGNAL_TELECOM",
        "asset_id": "SIG-180",
        "task_type": "Point Machine Calibration",
        "section_id": "SEC-NDLS-AGC-01",
        "location_km": 180.0,
        "latitude": 27.1800,
        "longitude": 78.0100,
        "priority": "HIGH",
        "severity": 80,
        "estimated_duration_minutes": 45,
        "required_block_type": "TRAFFIC_BLOCK",
        "safety_requirements": ["SIGNAL_MEMO"],
        "status": "PENDING",
        "created_at": "2026-09-06T10:45:00Z"
    }
]

_MOCK_TRAINS = [
    {
        "id": "20000000-0000-0000-0000-000000000001",
        "train_number": "12301",
        "train_name": "Howrah Rajdhani Express",
        "train_type": "EXPRESS",
        "priority": 10,
        "origin": "NDLS",
        "destination": "HWH",
        "status": "ON_TIME",
        "delay_minutes": 0,
        "scheduled_arrival": "01:15",
        "scheduled_departure": "01:25",
        "start_km": 115.0,
        "end_km": 130.0
    },
    {
        "id": "20000000-0000-0000-0000-000000000002",
        "train_number": "12951",
        "train_name": "Mumbai Rajdhani Express",
        "train_type": "EXPRESS",
        "priority": 10,
        "origin": "NDLS",
        "destination": "MMCT",
        "status": "ON_TIME",
        "delay_minutes": 0,
        "scheduled_arrival": "02:40",
        "scheduled_departure": "02:50",
        "start_km": 115.0,
        "end_km": 130.0
    },
    {
        "id": "20000000-0000-0000-0000-000000000003",
        "train_number": "20171",
        "train_name": "Rani Kamlapati Vande Bharat",
        "train_type": "EXPRESS",
        "priority": 9,
        "origin": "NDLS",
        "destination": "RKMP",
        "status": "ON_TIME",
        "delay_minutes": 0,
        "scheduled_arrival": "03:25",
        "scheduled_departure": "03:35",
        "start_km": 115.0,
        "end_km": 130.0
    },
    {
        "id": "20000000-0000-0000-0000-000000000004",
        "train_number": "12002",
        "train_name": "Bhopal Shatabdi Express",
        "train_type": "EXPRESS",
        "priority": 9,
        "origin": "NDLS",
        "destination": "VGLJ",
        "status": "ON_TIME",
        "delay_minutes": 0,
        "scheduled_arrival": "04:10",
        "scheduled_departure": "04:20",
        "start_km": 115.0,
        "end_km": 130.0
    }
]


def get_all_maintenance_requests() -> List[Dict[str, Any]]:
    if db_manager.supabase_client:
        try:
            res = db_manager.supabase_client.table("maintenance_requests").select("*").execute()
            return res.data
        except Exception as e:
            logger.error(f"Error fetching maintenance requests from Supabase: {e}")
    return _MOCK_MAINTENANCE_REQUESTS


def get_maintenance_request_by_id(request_id: str) -> Optional[Dict[str, Any]]:
    requests = get_all_maintenance_requests()
    for req in requests:
        if req.get("request_id") == request_id or req.get("id") == request_id:
            return req
    return None


def update_maintenance_request_status(request_id: str, new_status: str, priority: Optional[str] = None) -> Optional[Dict[str, Any]]:
    # 1. Update in-memory list
    found = None
    for req in _MOCK_MAINTENANCE_REQUESTS:
        if req.get("request_id") == request_id or req.get("id") == request_id:
            req["status"] = new_status
            if priority:
                req["priority"] = priority
            found = req
            break

    # 2. Update Supabase if active
    if db_manager.supabase_client:
        try:
            update_data = {"status": new_status}
            if priority:
                update_data["priority"] = priority

            res = db_manager.supabase_client.table("maintenance_requests").update(update_data).eq("request_id", request_id).execute()
            if not res.data:
                res = db_manager.supabase_client.table("maintenance_requests").update(update_data).eq("id", request_id).execute()
            if res.data and len(res.data) > 0:
                found = res.data[0]
        except Exception as e:
            logger.error(f"Error updating maintenance request status in Supabase: {e}")

    return found


def get_all_trains() -> List[Dict[str, Any]]:
    if db_manager.supabase_client:
        try:
            res = db_manager.supabase_client.table("trains").select("*").execute()
            return res.data
        except Exception as e:
            logger.error(f"Error fetching trains from Supabase: {e}")
    return _MOCK_TRAINS


def get_safety_constraints() -> List[Dict[str, Any]]:
    if db_manager.supabase_client:
        try:
            res = db_manager.supabase_client.table("constraints").select("*").execute()
            if res.data and len(res.data) > 0:
                return res.data
        except Exception as e:
            logger.error(f"Error fetching safety constraints from Supabase: {e}")

    return [
        {
            "rule_code": "RULE-01",
            "rule_name": "Track Repair vs Train Movement",
            "primary_activity": "TRACK_REPAIR",
            "conflicting_activity": "TRAIN_MOVEMENT",
            "severity": "CRITICAL",
            "min_safety_buffer_minutes": 30
        },
        {
            "rule_code": "RULE-02",
            "rule_name": "OHE Power Isolation vs Electric Locomotives",
            "primary_activity": "OHE_POWER_OFF",
            "conflicting_activity": "ELECTRIC_TRAIN_MOVEMENT",
            "severity": "CRITICAL",
            "min_safety_buffer_minutes": 20
        },
        {
            "rule_code": "RULE-03",
            "rule_name": "Dust Grinding vs Signal Relays",
            "primary_activity": "BALLAST_GRINDING",
            "conflicting_activity": "SIGNAL_RELAY_INSPECTION",
            "severity": "HIGH",
            "min_safety_buffer_minutes": 15
        }
    ]
