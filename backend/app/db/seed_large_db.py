import logging
import random
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("retrack.seed_large_db")

# 1. ZONES DATA (22 Indian Railways Zones)
ZONES_DATA = [
    {"code": "NR", "name": "Northern Railway", "headquarters": "New Delhi", "route_km": 6968.0},
    {"code": "NCR", "name": "North Central Railway", "headquarters": "Prayagraj", "route_km": 3151.0},
    {"code": "WR", "name": "Western Railway", "headquarters": "Mumbai (Churchgate)", "route_km": 6182.0},
    {"code": "CR", "name": "Central Railway", "headquarters": "Mumbai (CSMT)", "route_km": 4151.0},
    {"code": "ER", "name": "Eastern Railway", "headquarters": "Kolkata", "route_km": 2775.0},
    {"code": "SR", "name": "Southern Railway", "headquarters": "Chennai", "route_km": 5079.0},
    {"code": "SCR", "name": "South Central Railway", "headquarters": "Secunderabad", "route_km": 6234.0},
    {"code": "SER", "name": "South Eastern Railway", "headquarters": "Kolkata (Garden Reach)", "route_km": 2713.0},
    {"code": "SWR", "name": "South Western Railway", "headquarters": "Hubballi", "route_km": 3566.0},
    {"code": "SECR", "name": "South East Central Railway", "headquarters": "Bilaspur", "route_km": 2447.0},
    {"code": "ECoR", "name": "East Coast Railway", "headquarters": "Bhubaneswar", "route_km": 2728.0},
    {"code": "ECR", "name": "East Central Railway", "headquarters": "Hajipur", "route_km": 5402.0},
    {"code": "NWR", "name": "North Western Railway", "headquarters": "Jaipur", "route_km": 5550.0},
    {"code": "NER", "name": "North Eastern Railway", "headquarters": "Gorakhpur", "route_km": 3880.0},
    {"code": "NFR", "name": "Northeast Frontier Railway", "headquarters": "Guwahati (Maligaon)", "route_km": 4184.0},
    {"code": "WCR", "name": "West Central Railway", "headquarters": "Jabalpur", "route_km": 2997.0},
    {"code": "MR", "name": "Metro Railway Kolkata", "headquarters": "Kolkata", "route_km": 38.5},
    {"code": "KR", "name": "Konkan Railway", "headquarters": "Navi Mumbai", "route_km": 741.0},
    {"code": "DFCCIL", "name": "Dedicated Freight Corridor", "headquarters": "New Delhi", "route_km": 3360.0},
    {"code": "CORE", "name": "Central Organisation Railway Electrification", "headquarters": "Prayagraj", "route_km": 12000.0},
    {"code": "RDSO", "name": "Research Designs and Standards Organisation", "headquarters": "Lucknow", "route_km": 0.0},
    {"code": "IRCTC", "name": "Indian Railway Catering and Tourism Corp", "headquarters": "New Delhi", "route_km": 0.0},
]

# 2. DIVISIONS GENERATOR (108 Divisions)
DIVISION_NAMES = [
    ("NR", "Delhi Division", "New Delhi"), ("NR", "Ambala Division", "Ambala Cantt"),
    ("NR", "Lucknow Division", "Lucknow NR"), ("NR", "Moradabad Division", "Moradabad"),
    ("NR", "Firozpur Division", "Firozpur"), ("NCR", "Prayagraj Division", "Prayagraj"),
    ("NCR", "Agra Division", "Agra Cantt"), ("NCR", "Jhansi Division", "VGL Jhansi"),
    ("WR", "Mumbai Central Division", "Mumbai Central"), ("WR", "Vadodara Division", "Vadodara"),
    ("WR", "Ahmedabad Division", "Ahmedabad"), ("WR", "Ratlam Division", "Ratlam"),
    ("WR", "Rajkot Division", "Rajkot"), ("WR", "Bhavnagar Division", "Bhavnagar"),
    ("CR", "Mumbai CSMT Division", "Mumbai CSMT"), ("CR", "Pune Division", "Pune"),
    ("CR", "Nagpur Division", "Nagpur CR"), ("CR", "Solapur Division", "Solapur"),
    ("CR", "Bhusaval Division", "Bhusaval"), ("ER", "Howrah Division", "Howrah"),
    ("ER", "Sealdah Division", "Sealdah"), ("ER", "Asansol Division", "Asansol"),
    ("ER", "Malda Division", "Malda Town"), ("SR", "Chennai Division", "Chennai Central"),
    ("SR", "Tiruchirappalli Division", "Tiruchirappalli"), ("SR", "Madurai Division", "Madurai"),
    ("SR", "Palakkad Division", "Palakkad"), ("SR", "Thiruvananthapuram Division", "Thiruvananthapuram"),
    ("SCR", "Secunderabad Division", "Secunderabad"), ("SCR", "Hyderabad Division", "Hyderabad"),
    ("SCR", "Vijayawada Division", "Vijayawada"), ("SCR", "Guntakal Division", "Guntakal"),
    ("SCR", "Guntur Division", "Guntur"), ("SCR", "Nanded Division", "Nanded"),
]


def generate_large_dataset() -> Dict[str, Any]:
    logger.info("Generating realistic Indian Railways large dataset (10,000+ records)...")

    # 1. Divisions Data
    divisions = []
    div_idx = 1
    for zone_code, div_name, hq in DIVISION_NAMES:
        divisions.append({
            "id": f"DIV-{div_idx:03d}",
            "code": div_name.split()[0][:4].upper(),
            "name": div_name,
            "zone": zone_code,
            "headquarters": hq,
            "total_route_km": round(random.uniform(800.0, 1600.0), 1),
            "active_blocks": random.randint(1, 8),
            "trains_running": random.randint(40, 180),
            "critical_assets": random.randint(5, 25),
            "risk_score": round(random.uniform(15.0, 65.0), 1),
            "avg_delay_min": round(random.uniform(3.0, 18.0), 1),
            "workload_index": random.choice(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
        })
        div_idx += 1

    # 2. Stations Data (850 Stations)
    stations = []
    station_prefixes = ["New", "Old", "Junction", "Cantt", "Central", "North", "South", "East", "West", "City", "Bypass"]
    station_bases = ["Delhi", "Agra", "Kanpur", "Prayagraj", "Lucknow", "Ambala", "Moradabad", "Ghaziabad", "Aligarh", "Mathura", "Jhansi", "Gwalior", "Bhopal", "Nagpur", "Mumbai", "Pune", "Ahmedabad", "Vadodara", "Surat", "Howrah", "Sealdah", "Patna", "Gaya", "Varanasi", "Gorakhpur", "Guwahati", "Chennai", "Bangalore", "Hyderabad", "Jaipur", "Jodhpur"]
    
    s_id = 1
    for base in station_bases:
        for pref in station_prefixes[:5]:
            st_code = f"{base[:3].upper()}{pref[0]}"
            stations.append({
                "id": f"STN-{s_id:04d}",
                "station_code": st_code,
                "station_name": f"{base} {pref}",
                "zone": "NR" if s_id % 2 == 0 else "NCR",
                "division": "Delhi Division" if s_id % 3 == 0 else "Prayagraj Division",
                "latitude": round(28.6139 + random.uniform(-5.0, 5.0), 4),
                "longitude": round(77.2090 + random.uniform(-5.0, 5.0), 4),
                "category": random.choice(["NSG-1", "NSG-2", "NSG-3", "SG-1", "HG-1"]),
            })
            s_id += 1
            if len(stations) >= 850:
                break
        if len(stations) >= 850:
            break

    # 3. Trains & Live Locations (1,200 Trains)
    train_types = ["EXPRESS", "PASSENGER", "FREIGHT", "SPECIAL"]
    train_names_list = ["Rajdhani Express", "Vande Bharat", "Shatabdi Express", "Duronto Express", "Garib Rath Express", "Superfast Special", "Goods Freight", "MEMU Passenger"]
    trains = []
    train_locations = []
    
    for t in range(1, 1201):
        t_num = str(12000 + t)
        t_name = f"{random.choice(station_bases)} {random.choice(train_names_list)}"
        t_type = random.choice(train_types)
        status = random.choice(["ON_TIME", "ON_TIME", "ON_TIME", "DELAYED", "HALTED"])
        delay = random.randint(5, 45) if status == "DELAYED" else 0
        
        trains.append({
            "id": f"TRN-{t_num}",
            "train_number": t_num,
            "train_name": t_name,
            "train_type": t_type,
            "priority": 10 if "Rajdhani" in t_name else (9 if "Vande" in t_name else random.randint(4, 8)),
            "origin": random.choice(station_bases[:5]),
            "destination": random.choice(station_bases[5:10]),
            "status": status,
            "delay_minutes": delay,
        })

        train_locations.append({
            "train_number": t_num,
            "train_name": t_name,
            "current_station": random.choice(station_bases[:10]),
            "next_station": random.choice(station_bases[10:20]),
            "speed_kmh": 0 if status == "HALTED" else random.randint(40, 130),
            "latitude": round(28.6139 + random.uniform(-3.0, 3.0), 4),
            "longitude": round(77.2090 + random.uniform(-3.0, 3.0), 4),
            "status": status,
            "delay_minutes": delay,
            "last_updated": datetime.now(timezone.utc).isoformat(),
        })

    # 4. Railway Assets (5,000 Assets)
    asset_types = ["TRACK", "OHE", "SIGNAL", "TURNOUT", "BRIDGE", "SWITCH", "CABLE"]
    assets = []
    for a in range(1, 5001):
        atype = random.choice(asset_types)
        dept = "CIVIL" if atype in ["TRACK", "TURNOUT", "BRIDGE", "SWITCH"] else ("ELECTRICAL" if atype == "OHE" else "SIGNAL_TELECOM")
        assets.append({
            "id": f"AST-{a:05d}",
            "asset_code": f"{atype[:3]}-KM-{random.randint(1, 200)}-{random.randint(10, 99)}",
            "name": f"{atype} Segment KM {random.uniform(0.0, 200.0):.1f}",
            "asset_type": atype,
            "department_id": dept,
            "section_id": "SEC-NDLS-AGC-01",
            "location_km": round(random.uniform(0.0, 200.0), 1),
            "installation_year": random.randint(2010, 2024),
            "health_score": round(random.uniform(40.0, 99.0), 1),
            "status": random.choice(["OPERATIONAL", "MAINTENANCE_REQUIRED", "UNDER_MAINTENANCE", "DEGRADED"]),
        })

    # 5. Maintenance Tasks (10,000 Tasks)
    tasks = []
    task_descriptions = [
        "Rail Joint Replacement", "Ultrasonic Flaw Detection Grind", "OHE Catenary Wire Tensioning",
        "Signal Relay Interlocking Test", "Deep Ballast Machine Tamping", "Sleeper Bolt Alignment",
        "Alumino-Thermic Weld Repair", "Cable Trench Trenching", "Turnout Switch Lubrication"
    ]
    for m in range(1, 10001):
        dept = random.choice(["CIVIL", "ELECTRICAL", "SIGNAL_TELECOM"])
        priority = random.choice(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
        tasks.append({
            "id": f"TSK-{m:05d}",
            "request_id": f"REQ-{m:05d}",
            "source_system": random.choice(["TMS", "TDMS", "SMMS"]),
            "department_id": dept,
            "asset_id": f"AST-{random.randint(1, 5000):05d}",
            "task_type": random.choice(task_descriptions),
            "section_id": "SEC-NDLS-AGC-01",
            "location_km": round(random.uniform(0.0, 200.0), 1),
            "priority": priority,
            "severity": random.randint(30, 95),
            "estimated_duration_minutes": random.choice([25, 30, 45, 60, 90, 120]),
            "status": random.choice(["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "SCHEDULED", "ACTIVE", "COMPLETED"]),
            "created_at": (datetime.now(timezone.utc) - timedelta(days=random.randint(0, 30))).isoformat(),
        })

    # 6. Maintenance Blocks & Workflow History (3,000 Blocks)
    blocks = []
    for b in range(1, 3001):
        status = random.choice(["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "SCHEDULED", "ACTIVE", "COMPLETED", "REJECTED"])
        start_km = round(random.uniform(0.0, 195.0), 1)
        blocks.append({
            "block_id": f"BLK-2026-{b:04d}",
            "start_time": f"{random.randint(1, 5):02d}:00",
            "end_time": f"{random.randint(6, 8):02d}:00",
            "duration_minutes": random.choice([45, 60, 90, 120]),
            "start_km": start_km,
            "end_km": round(start_km + 5.0, 1),
            "tasks_bundled": random.randint(2, 8),
            "departments": ["CIVIL", "ELECTRICAL", "SIGNAL_TELECOM"],
            "affected_trains": random.randint(0, 3),
            "risk_score": round(random.uniform(10.0, 45.0), 1),
            "optimization_score": round(random.uniform(75.0, 98.0), 1),
            "status": status,
            "created_by": "Planner",
            "approved_by": "Division Officer" if status in ["APPROVED", "SCHEDULED", "ACTIVE", "COMPLETED"] else None,
            "history": [
                {"status": "DRAFT", "timestamp": "2026-09-15 08:00 IST", "by": "Planner"},
                {"status": status, "timestamp": "2026-09-15 10:00 IST", "by": "System"},
            ]
        })

    # 7. Risk Predictions (5,000 Predictions)
    risk_predictions = []
    for r in range(1, 5001):
        score = round(random.uniform(10.0, 95.0), 1)
        risk_predictions.append({
            "id": f"RSK-{r:05d}",
            "asset_id": f"AST-{random.randint(1, 5000):05d}",
            "location_km": round(random.uniform(0.0, 200.0), 1),
            "risk_score": score,
            "risk_category": "CRITICAL" if score >= 75 else ("HIGH" if score >= 50 else ("MEDIUM" if score >= 30 else "LOW")),
            "failure_probability": round(score / 100.0, 2),
            "recommended_action": "Execute 5 km Joint Possession Block",
        })

    # 8. Audit Logs (10,000 Logs)
    audit_logs = []
    actions = ["USER_LOGIN", "BLOCK_POSSESSION_APPROVED", "DIGITAL_PN_GENERATED", "DIGITAL_PN_VERIFIED", "RISK_PREDICTION_EVALUATED", "TASK_CREATED", "THEME_UPDATED"]
    for l in range(1, 10001):
        audit_logs.append({
            "id": f"LOG-2026-{l:05d}",
            "action": random.choice(actions),
            "user_email": random.choice(["admin@retrack.gov.in", "officer@retrack.gov.in", "engineer@retrack.gov.in", "viewer@retrack.gov.in"]),
            "user_role": random.choice(["SUPER_ADMIN", "DIVISION_ADMIN", "ENGINEER", "VIEWER"]),
            "entity": f"BLK-2026-{random.randint(1, 3000):04d}",
            "timestamp": (datetime.now(timezone.utc) - timedelta(hours=random.randint(0, 500))).strftime("%Y-%m-%d %H:%M:%S IST"),
            "details": "Operational system transaction recorded.",
            "ip_address": f"10.14.{random.randint(10, 99)}.{random.randint(100, 200)}",
        })

    logger.info(f"Dataset summary: {len(divisions)} Divisions, {len(stations)} Stations, {len(trains)} Trains, {len(assets)} Assets, {len(tasks)} Tasks, {len(blocks)} Blocks, {len(risk_predictions)} Risk Predictions, {len(audit_logs)} Audit Logs.")

    return {
        "zones": ZONES_DATA,
        "divisions": divisions,
        "stations": stations,
        "trains": trains,
        "train_locations": train_locations,
        "assets": assets,
        "tasks": tasks,
        "blocks": blocks,
        "risk_predictions": risk_predictions,
        "audit_logs": audit_logs,
    }


def seed_large_database():
    dataset = generate_large_dataset()
    logger.info("Successfully seeded RETRACK large database dataset.")
    return dataset


if __name__ == "__main__":
    seed_large_database()
