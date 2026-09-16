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
            if res.data and len(res.data) > 0:
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
            if res.data and len(res.data) > 0:
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


# ====================================================================
# SEPARATE FEED DATASETS & QUERY FUNCTIONS (TMS, TDMS, SMMS, COA)
# ====================================================================

_MOCK_TMS_MESSAGES = [
    {
        "id": "tms-uuid-001",
        "message_id": "TMS-001",
        "source": "TMS",
        "timestamp": "2026-09-16T10:30:00Z",
        "section": "NDLS-AGC",
        "section_id": "SEC-NDLS-AGC-01",
        "track_id": "TRK-102",
        "location": "KM 142.5",
        "location_km": 142.5,
        "maintenance_type": "Track Inspection",
        "priority": "HIGH",
        "status": "NEW",
        "created_at": "2026-09-16T10:30:00Z"
    },
    {
        "id": "tms-uuid-002",
        "message_id": "TMS-002",
        "source": "TMS",
        "timestamp": "2026-09-16T09:15:00Z",
        "section": "NDLS-AGC",
        "section_id": "SEC-NDLS-AGC-01",
        "track_id": "TRK-120",
        "location": "KM 120.0",
        "maintenance_type": "Track Rail Replacement",
        "priority": "CRITICAL",
        "status": "PENDING",
        "created_at": "2026-09-16T09:15:00Z"
    },
    {
        "id": "tms-uuid-003",
        "message_id": "TMS-003",
        "source": "TMS",
        "timestamp": "2026-09-16T08:45:00Z",
        "section": "NDLS-AGC",
        "section_id": "SEC-NDLS-AGC-01",
        "track_id": "TRK-124",
        "location": "KM 124.5",
        "maintenance_type": "Deep Ballast Tamping",
        "priority": "MEDIUM",
        "status": "NEW",
        "created_at": "2026-09-16T08:45:00Z"
    },
    {
        "id": "tms-uuid-004",
        "message_id": "TMS-004",
        "source": "TMS",
        "timestamp": "2026-09-16T07:20:00Z",
        "section": "NDLS-AGC",
        "section_id": "SEC-NDLS-AGC-01",
        "track_id": "TRK-126",
        "location": "KM 126.0",
        "maintenance_type": "Sleeper Fastening Check",
        "priority": "LOW",
        "status": "PROCESSED",
        "created_at": "2026-09-16T07:20:00Z"
    }
]

_MOCK_TDMS_DEFECTS = [
    {
        "id": "tdms-uuid-001",
        "message_id": "TDMS-001",
        "source": "TDMS",
        "timestamp": "2026-09-16T10:42:00Z",
        "track_id": "TRK-102",
        "location": "KM 143.2",
        "location_km": 143.2,
        "defect_type": "Rail Crack",
        "severity": "CRITICAL",
        "risk_score": 91.0,
        "status": "OPEN",
        "created_at": "2026-09-16T10:42:00Z"
    },
    {
        "id": "tdms-uuid-002",
        "message_id": "TDMS-002",
        "source": "TDMS",
        "timestamp": "2026-09-16T09:50:00Z",
        "track_id": "TRK-122",
        "location": "KM 122.0",
        "location_km": 122.0,
        "defect_type": "Ultrasonic Flaw Micro-Crack",
        "severity": "HIGH",
        "risk_score": 78.5,
        "status": "OPEN",
        "created_at": "2026-09-16T09:50:00Z"
    },
    {
        "id": "tdms-uuid-003",
        "message_id": "TDMS-003",
        "source": "TDMS",
        "timestamp": "2026-09-16T08:30:00Z",
        "track_id": "TRK-128",
        "location": "KM 128.5",
        "location_km": 128.5,
        "defect_type": "Alumino-Thermic Weld Defect",
        "severity": "MEDIUM",
        "risk_score": 64.0,
        "status": "IN_PROGRESS",
        "created_at": "2026-09-16T08:30:00Z"
    },
    {
        "id": "tdms-uuid-004",
        "message_id": "TDMS-004",
        "source": "TDMS",
        "timestamp": "2026-09-15T18:10:00Z",
        "track_id": "TRK-110",
        "location": "KM 110.4",
        "location_km": 110.4,
        "defect_type": "Squat Flaw on Rail Head",
        "severity": "LOW",
        "risk_score": 32.0,
        "status": "RESOLVED",
        "created_at": "2026-09-15T18:10:00Z"
    }
]

_MOCK_SMMS_MESSAGES = [
    {
        "id": "smms-uuid-001",
        "message_id": "SMMS-001",
        "source": "SMMS",
        "timestamp": "2026-09-16T10:50:00Z",
        "department": "OHE",
        "department_id": "ELECTRICAL",
        "asset_id": "OHE-442",
        "location": "KM 145.1",
        "location_km": 145.1,
        "issue_type": "Insulator Fault",
        "severity": "HIGH",
        "maintenance_required": True,
        "status": "NEW",
        "created_at": "2026-09-16T10:50:00Z"
    },
    {
        "id": "smms-uuid-002",
        "message_id": "SMMS-002",
        "source": "SMMS",
        "timestamp": "2026-09-16T09:30:00Z",
        "department": "SIGNAL",
        "department_id": "SIGNAL_TELECOM",
        "asset_id": "SIG-125",
        "location": "KM 125.0",
        "location_km": 125.0,
        "issue_type": "Track Circuit Intermittent Drop",
        "severity": "CRITICAL",
        "maintenance_required": True,
        "status": "PENDING",
        "created_at": "2026-09-16T09:30:00Z"
    },
    {
        "id": "smms-uuid-003",
        "message_id": "SMMS-003",
        "source": "SMMS",
        "timestamp": "2026-09-16T08:15:00Z",
        "department": "TELECOM",
        "department_id": "SIGNAL_TELECOM",
        "asset_id": "TEL-108",
        "location": "KM 108.2",
        "location_km": 108.2,
        "issue_type": "OFC Cable Attenuation Alert",
        "severity": "MEDIUM",
        "maintenance_required": True,
        "status": "NEW",
        "created_at": "2026-09-16T08:15:00Z"
    },
    {
        "id": "smms-uuid-004",
        "message_id": "SMMS-004",
        "source": "SMMS",
        "timestamp": "2026-09-15T22:00:00Z",
        "department": "OHE",
        "department_id": "ELECTRICAL",
        "asset_id": "OHE-124",
        "location": "KM 124.2",
        "location_km": 124.2,
        "issue_type": "Cantilever Bracket Droop",
        "severity": "HIGH",
        "maintenance_required": True,
        "status": "PROCESSED",
        "created_at": "2026-09-15T22:00:00Z"
    }
]

_MOCK_COA_ROUTES = [
    {
        "id": "ROUTE-NDLS-AGC",
        "route_code": "NDLS-AGC-MAIN",
        "name": "New Delhi - Agra Cantt Main Line",
        "origin_station": "NDLS",
        "destination_station": "AGC",
        "total_distance_km": 195.0,
        "stations": [
            {"station_code": "NDLS", "station_name": "New Delhi", "sequence_order": 1, "distance_from_origin_km": 0.0},
            {"station_code": "NZM", "station_name": "Hazrat Nizamuddin", "sequence_order": 2, "distance_from_origin_km": 7.0},
            {"station_code": "TKD", "station_name": "Tuglakabad", "sequence_order": 3, "distance_from_origin_km": 17.5},
            {"station_code": "GZB", "station_name": "Ghaziabad Junction", "sequence_order": 4, "distance_from_origin_km": 25.0},
            {"station_code": "MTJ", "station_name": "Mathura Junction", "sequence_order": 5, "distance_from_origin_km": 141.0},
            {"station_code": "AGC", "station_name": "Agra Cantt", "sequence_order": 6, "distance_from_origin_km": 195.0}
        ]
    }
]

_MOCK_COA_TRAINS = [
    {
        "id": "coa-trn-12001",
        "train_id": "12001",
        "train_number": "12001",
        "train_name": "NDLS Shatabdi Express",
        "origin": "NDLS",
        "destination": "AGC",
        "current_station": "NZM",
        "next_station": "TKD",
        "status": "RUNNING",
        "scheduled_departure": "10:30",
        "estimated_arrival": "13:45",
        "delay_minutes": 0,
        "route_id": "ROUTE-NDLS-AGC",
        "updated_at": "2026-09-16T10:45:00Z"
    },
    {
        "id": "coa-trn-12301",
        "train_id": "12301",
        "train_number": "12301",
        "train_name": "Howrah Rajdhani Express",
        "origin": "NDLS",
        "destination": "HWH",
        "current_station": "TKD",
        "next_station": "MTJ",
        "status": "RUNNING",
        "scheduled_departure": "16:55",
        "estimated_arrival": "09:55",
        "delay_minutes": 5,
        "route_id": "ROUTE-NDLS-AGC",
        "updated_at": "2026-09-16T10:40:00Z"
    },
    {
        "id": "coa-trn-20171",
        "train_id": "20171",
        "train_number": "20171",
        "train_name": "Rani Kamlapati Vande Bharat",
        "origin": "NDLS",
        "destination": "RKMP",
        "current_station": "NDLS",
        "next_station": "NZM",
        "status": "SCHEDULED",
        "scheduled_departure": "06:00",
        "estimated_arrival": "14:10",
        "delay_minutes": 0,
        "route_id": "ROUTE-NDLS-AGC",
        "updated_at": "2026-09-16T10:30:00Z"
    },
    {
        "id": "coa-trn-12951",
        "train_id": "12951",
        "train_number": "12951",
        "train_name": "Mumbai Rajdhani Express",
        "origin": "NDLS",
        "destination": "MMCT",
        "current_station": "MTJ",
        "next_station": "AGC",
        "status": "DELAYED",
        "scheduled_departure": "16:30",
        "estimated_arrival": "08:35",
        "delay_minutes": 18,
        "route_id": "ROUTE-NDLS-AGC",
        "updated_at": "2026-09-16T10:20:00Z"
    },
    {
        "id": "coa-trn-04418",
        "train_id": "04418",
        "train_number": "04418",
        "train_name": "NDLS-AGC Passenger Special",
        "origin": "NDLS",
        "destination": "AGC",
        "current_station": "AGC",
        "next_station": "TERMINAL",
        "status": "ARRIVED",
        "scheduled_departure": "08:00",
        "estimated_arrival": "12:15",
        "delay_minutes": 0,
        "route_id": "ROUTE-NDLS-AGC",
        "updated_at": "2026-09-16T10:00:00Z"
    }
]


# TMS Query Handlers
def get_tms_feed() -> List[Dict[str, Any]]:
    if db_manager.supabase_client:
        try:
            res = db_manager.supabase_client.table("tms_feed_messages").select("*").order("timestamp", desc=True).execute()
            if res.data:
                return res.data
        except Exception as e:
            logger.error(f"Error fetching TMS feed from Supabase: {e}")
    return _MOCK_TMS_MESSAGES


def get_tms_message_by_id(message_id: str) -> Optional[Dict[str, Any]]:
    feed = get_tms_feed()
    for msg in feed:
        if msg.get("message_id") == message_id or msg.get("id") == message_id:
            return msg
    return None


def add_tms_message(msg_data: Dict[str, Any]) -> Dict[str, Any]:
    _MOCK_TMS_MESSAGES.insert(0, msg_data)
    if db_manager.supabase_client:
        try:
            db_manager.supabase_client.table("tms_feed_messages").insert(msg_data).execute()
        except Exception as e:
            logger.error(f"Error inserting TMS message into Supabase: {e}")
    return msg_data


def update_tms_message_status(message_id: str, new_status: str) -> Optional[Dict[str, Any]]:
    found = None
    for msg in _MOCK_TMS_MESSAGES:
        if msg.get("message_id") == message_id or msg.get("id") == message_id:
            msg["status"] = new_status
            found = msg
            break
    if db_manager.supabase_client:
        try:
            res = db_manager.supabase_client.table("tms_feed_messages").update({"status": new_status}).eq("message_id", message_id).execute()
            if res.data:
                found = res.data[0]
        except Exception as e:
            logger.error(f"Error updating TMS message in Supabase: {e}")
    return found


# TDMS Query Handlers
def get_tdms_feed() -> List[Dict[str, Any]]:
    if db_manager.supabase_client:
        try:
            res = db_manager.supabase_client.table("tdms_feed_messages").select("*").order("timestamp", desc=True).execute()
            if res.data:
                return res.data
        except Exception as e:
            logger.error(f"Error fetching TDMS feed from Supabase: {e}")
    return _MOCK_TDMS_DEFECTS


def get_tdms_defect_by_id(message_id: str) -> Optional[Dict[str, Any]]:
    feed = get_tdms_feed()
    for d in feed:
        if d.get("message_id") == message_id or d.get("id") == message_id:
            return d
    return None


def add_tdms_defect(defect_data: Dict[str, Any]) -> Dict[str, Any]:
    _MOCK_TDMS_DEFECTS.insert(0, defect_data)
    if db_manager.supabase_client:
        try:
            db_manager.supabase_client.table("tdms_feed_messages").insert(defect_data).execute()
        except Exception as e:
            logger.error(f"Error inserting TDMS defect into Supabase: {e}")
    return defect_data


def update_tdms_defect_status(message_id: str, new_status: str) -> Optional[Dict[str, Any]]:
    found = None
    for d in _MOCK_TDMS_DEFECTS:
        if d.get("message_id") == message_id or d.get("id") == message_id:
            d["status"] = new_status
            found = d
            break
    if db_manager.supabase_client:
        try:
            res = db_manager.supabase_client.table("tdms_feed_messages").update({"status": new_status}).eq("message_id", message_id).execute()
            if res.data:
                found = res.data[0]
        except Exception as e:
            logger.error(f"Error updating TDMS defect in Supabase: {e}")
    return found


# SMMS Query Handlers
def get_smms_feed() -> List[Dict[str, Any]]:
    if db_manager.supabase_client:
        try:
            res = db_manager.supabase_client.table("smms_feed_messages").select("*").order("timestamp", desc=True).execute()
            if res.data:
                return res.data
        except Exception as e:
            logger.error(f"Error fetching SMMS feed from Supabase: {e}")
    return _MOCK_SMMS_MESSAGES


def get_smms_message_by_id(message_id: str) -> Optional[Dict[str, Any]]:
    feed = get_smms_feed()
    for msg in feed:
        if msg.get("message_id") == message_id or msg.get("id") == message_id:
            return msg
    return None


def add_smms_message(msg_data: Dict[str, Any]) -> Dict[str, Any]:
    _MOCK_SMMS_MESSAGES.insert(0, msg_data)
    if db_manager.supabase_client:
        try:
            db_manager.supabase_client.table("smms_feed_messages").insert(msg_data).execute()
        except Exception as e:
            logger.error(f"Error inserting SMMS message into Supabase: {e}")
    return msg_data


def update_smms_message_status(message_id: str, new_status: str) -> Optional[Dict[str, Any]]:
    found = None
    for msg in _MOCK_SMMS_MESSAGES:
        if msg.get("message_id") == message_id or msg.get("id") == message_id:
            msg["status"] = new_status
            found = msg
            break
    if db_manager.supabase_client:
        try:
            res = db_manager.supabase_client.table("smms_feed_messages").update({"status": new_status}).eq("message_id", message_id).execute()
            if res.data:
                found = res.data[0]
        except Exception as e:
            logger.error(f"Error updating SMMS message in Supabase: {e}")
    return found


# COA Query Handlers
def get_coa_routes() -> List[Dict[str, Any]]:
    if db_manager.supabase_client:
        try:
            res = db_manager.supabase_client.table("coa_routes").select("*, coa_route_stations(*)").execute()
            if res.data:
                return res.data
        except Exception as e:
            logger.error(f"Error fetching COA routes from Supabase: {e}")
    return _MOCK_COA_ROUTES


def get_coa_trains() -> List[Dict[str, Any]]:
    if db_manager.supabase_client:
        try:
            res = db_manager.supabase_client.table("coa_trains").select("*").execute()
            if res.data:
                return res.data
        except Exception as e:
            logger.error(f"Error fetching COA trains from Supabase: {e}")
    return _MOCK_COA_TRAINS


def get_coa_train_by_id(train_id: str) -> Optional[Dict[str, Any]]:
    trains = get_coa_trains()
    for t in trains:
        if t.get("train_id") == train_id or t.get("train_number") == train_id or t.get("id") == train_id:
            return t
    return None


def update_coa_train_status(train_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    found = get_coa_train_by_id(train_id)
    if not found:
        # Create new coa train entry
        found = {
            "id": f"coa-trn-{train_id}",
            "train_id": train_id,
            "train_number": payload.get("train_number", train_id),
            "train_name": payload.get("train_name", f"Train {train_id}"),
            "origin": payload.get("origin", "NDLS"),
            "destination": payload.get("destination", "AGC"),
            "current_station": payload.get("current_station", "NDLS"),
            "next_station": payload.get("next_station", "NZM"),
            "status": payload.get("status", "RUNNING"),
            "scheduled_departure": payload.get("scheduled_departure", "10:00"),
            "estimated_arrival": payload.get("estimated_arrival", "14:00"),
            "delay_minutes": payload.get("delay_minutes", 0),
            "route_id": "ROUTE-NDLS-AGC",
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        _MOCK_COA_TRAINS.insert(0, found)
    else:
        for k, v in payload.items():
            if v is not None:
                found[k] = v
        found["updated_at"] = datetime.now(timezone.utc).isoformat()

    if db_manager.supabase_client:
        try:
            db_manager.supabase_client.table("coa_trains").upsert(found).execute()
        except Exception as e:
            logger.error(f"Error updating COA train in Supabase: {e}")
    return found


# ====================================================================
# RETRACKAI CONVERSATIONS & CHAT HISTORY STORE
# ====================================================================

_MOCK_CONVERSATIONS: List[Dict[str, Any]] = [
    {
        "id": "conv-demo-01",
        "user_id": "demo-user",
        "title": "Explain CP-SAT Block Planning",
        "created_at": "2026-09-16T18:00:00Z",
        "updated_at": "2026-09-16T18:00:00Z"
    },
    {
        "id": "conv-demo-02",
        "user_id": "demo-user",
        "title": "TMS vs TDMS vs SMMS Feeds",
        "created_at": "2026-09-16T19:30:00Z",
        "updated_at": "2026-09-16T19:30:00Z"
    }
]

_MOCK_MESSAGES: List[Dict[str, Any]] = [
    {
        "id": "msg-01",
        "conversation_id": "conv-demo-01",
        "role": "USER",
        "content": "Why do we use CP-SAT for block planning?",
        "created_at": "2026-09-16T18:00:00Z"
    },
    {
        "id": "msg-02",
        "conversation_id": "conv-demo-01",
        "role": "ASSISTANT",
        "content": "Google OR-Tools CP-SAT is a Constraint Programming solver that computes optimal maintenance block windows while maintaining a +15 min safety buffer around passing trains.",
        "created_at": "2026-09-16T18:00:05Z"
    }
]


def get_retrackai_conversations(user_id: str = "demo-user") -> List[Dict[str, Any]]:
    if db_manager.supabase_client:
        try:
            res = db_manager.supabase_client.table("retrackai_conversations").select("*").order("updated_at", desc=True).execute()
            if res.data:
                return res.data
        except Exception as e:
            logger.error(f"Error fetching retrackai_conversations from Supabase: {e}")
    return _MOCK_CONVERSATIONS


def save_retrackai_message(
    conversation_id: str,
    user_id: str,
    user_msg: str,
    assistant_msg: str,
    data_type: Optional[str] = None,
    data_obj: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    # 1. Update or create conversation title
    conv = next((c for c in _MOCK_CONVERSATIONS if c["id"] == conversation_id), None)
    if not conv:
        title = user_msg[:40] + "..." if len(user_msg) > 40 else user_msg
        conv = {
            "id": conversation_id,
            "user_id": user_id,
            "title": title,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        _MOCK_CONVERSATIONS.insert(0, conv)

    # 2. Add User & Assistant Messages
    u_msg = {
        "id": f"msg-u-{uuid.uuid4().hex[:6]}",
        "conversation_id": conversation_id,
        "role": "USER",
        "content": user_msg,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    a_msg = {
        "id": f"msg-a-{uuid.uuid4().hex[:6]}",
        "conversation_id": conversation_id,
        "role": "ASSISTANT",
        "content": assistant_msg,
        "data_type": data_type,
        "data": data_obj,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    _MOCK_MESSAGES.extend([u_msg, a_msg])

    # 3. Supabase persistence if connected
    if db_manager.supabase_client:
        try:
            db_manager.supabase_client.table("retrackai_conversations").upsert(conv).execute()
            db_manager.supabase_client.table("retrackai_messages").insert([u_msg, a_msg]).execute()
        except Exception as e:
            logger.error(f"Error persisting retrackai messages to Supabase: {e}")

    return a_msg


def get_retrackai_messages(conversation_id: str) -> List[Dict[str, Any]]:
    if db_manager.supabase_client:
        try:
            res = db_manager.supabase_client.table("retrackai_messages").select("*").eq("conversation_id", conversation_id).order("created_at", desc=False).execute()
            if res.data:
                return res.data
        except Exception as e:
            logger.error(f"Error fetching retrackai messages from Supabase: {e}")
    return [m for m in _MOCK_MESSAGES if m.get("conversation_id") == conversation_id]


def search_retrackai_conversations(user_id: str, query: str) -> List[Dict[str, Any]]:
    q = query.lower().strip()
    matching_convs = []
    for c in _MOCK_CONVERSATIONS:
        if q in c.get("title", "").lower():
            matching_convs.append(c)
            continue
        c_msgs = [m for m in _MOCK_MESSAGES if m.get("conversation_id") == c["id"]]
        if any(q in m.get("content", "").lower() for m in c_msgs):
            matching_convs.append(c)
    return matching_convs


def rename_retrackai_conversation(conversation_id: str, new_title: str) -> bool:
    global _MOCK_CONVERSATIONS
    for c in _MOCK_CONVERSATIONS:
        if c["id"] == conversation_id:
            c["title"] = new_title
            c["updated_at"] = datetime.now(timezone.utc).isoformat()
            break
    if db_manager.supabase_client:
        try:
            db_manager.supabase_client.table("retrackai_conversations").update({"title": new_title}).eq("id", conversation_id).execute()
        except Exception as e:
            logger.error(f"Error renaming retrackai conversation in Supabase: {e}")
    return True


def delete_retrackai_conversation(conversation_id: str) -> bool:
    global _MOCK_CONVERSATIONS, _MOCK_MESSAGES
    _MOCK_CONVERSATIONS = [c for c in _MOCK_CONVERSATIONS if c["id"] != conversation_id]
    _MOCK_MESSAGES = [m for m in _MOCK_MESSAGES if m.get("conversation_id") != conversation_id]
    if db_manager.supabase_client:
        try:
            db_manager.supabase_client.table("retrackai_messages").delete().eq("conversation_id", conversation_id).execute()
            db_manager.supabase_client.table("retrackai_conversations").delete().eq("id", conversation_id).execute()
        except Exception as e:
            logger.error(f"Error deleting retrackai conversation from Supabase: {e}")
    return True

