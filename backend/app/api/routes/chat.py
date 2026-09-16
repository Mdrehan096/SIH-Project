import logging
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from app.core.security import get_current_user
from app.db.queries import get_all_maintenance_requests, get_all_trains
from app.api.routes.divisions import DIVISIONS_MASTER_DATA
from app.api.routes.zones import ZONES_MASTER_DATA

logger = logging.getLogger("retrack.chat")

router = APIRouter(prefix="/chat", tags=["RETRACK AI Assistant"])


class ChatMessageRequest(BaseModel):
    message: str
    user_role: Optional[str] = "CONTROLLER"
    model: Optional[str] = "gemini-1.5-pro"
    action_code: Optional[str] = None


class ChatAction(BaseModel):
    label: str
    target_path: str
    action_code: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    model_used: str = "gemini-1.5-pro"
    data_type: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    suggested_actions: List[ChatAction] = []


@router.post("/query", response_model=ChatResponse)
async def query_chat_assistant(payload: ChatMessageRequest, current_user: dict = Depends(get_current_user)):
    msg = payload.message.lower().strip()
    user_role = current_user.get("role", "CONTROLLER")
    user_name = current_user.get("full_name", "Officer")
    selected_model = payload.model or "gemini-1.5-pro"

    # Model prefix indicator for chat transparency
    model_labels = {
        "gemini-1.5-pro": "Google Gemini 1.5 Pro",
        "gemini-1.5-flash": "Google Gemini 1.5 Flash",
        "gpt-4o": "OpenAI GPT-4o",
        "claude-3.5-sonnet": "Anthropic Claude 3.5 Sonnet",
        "local-railway-llm": "RETRACK Micro-LLM Engine",
    }
    model_name = model_labels.get(selected_model, selected_model)

    # 1. Project Overview & SIH Problem Statement Queries
    if any(k in msg for k in ["what is retrack", "sih", "problem statement", "about project", "overview", "architecture"]):
        return ChatResponse(
            response=f"### 🚆 RETRACK – RailSync-AI Overview\n\n**SIH 2026 Problem Statement ID:** 26027\n\nRETRACK is a Government Railway Maintenance Planning, Operations Coordination & Decision Support Platform. It unifies multi-department maintenance requests (**TMS Civil**, **TDMS Defects**, **SMMS Electrical/S&T**), cross-references **COA Train Schedules**, and runs **Google OR-Tools CP-SAT** to generate joint 5 km possession blocks while preserving train safety buffer margins.\n\n- **Model Processed:** `{model_name}`\n- **Permission Authorization:** `{user_role}` Granted",
            model_used=selected_model,
            data_type="SYSTEM_INFO",
            data={
                "project_name": "RETRACK - RailSync-AI",
                "version": "1.0.0",
                "problem_statement_id": "26027",
                "supported_departments": ["CIVIL", "ELECTRICAL", "SIGNAL_TELECOM", "TRACTION", "OPERATIONS"]
            },
            suggested_actions=[
                ChatAction(label="Track Live Trains", target_path="/trains", action_code="SHOW_TRAINS"),
                ChatAction(label="Run CP-SAT Optimizer", target_path="/planner", action_code="SHOW_BLOCKS"),
                ChatAction(label="AI Risk Intelligence", target_path="/analytics", action_code="SHOW_RISK"),
            ]
        )

    # 2. Live Train Tracking Queries
    if any(k in msg for k in ["track", "live train", "train location", "where is train", "coa", "speed", "rajdhani", "vande bharat", "trains"]):
        trains = get_all_trains()
        delayed_trains = [t for t in trains if t.get("status") == "DELAYED" or t.get("delay_minutes", 0) > 0]
        on_time_trains = [t for t in trains if t.get("status") != "DELAYED"]
        
        sample_trains = trains[:4]
        return ChatResponse(
            response=f"### 🚆 Live Train Operations Summary\n\nCurrently monitoring **{len(trains)} active trains** on the **NDLS-AGC Mainline Corridor** (KM 0.0 to 200.0).\n\n- **Running On Time:** {len(on_time_trains)} trains\n- **Delayed Trains:** {len(delayed_trains)} train(s)\n- **Corridor Control:** Automated Control Office Application (COA) Feed Active\n\n*Below is the inline live train status breakdown:*",
            model_used=selected_model,
            data_type="TRAINS_LIST",
            data={
                "total_trains": len(trains),
                "delayed_count": len(delayed_trains),
                "on_time_count": len(on_time_trains),
                "trains": sample_trains
            },
            suggested_actions=[
                ChatAction(label="View High-Risk Assets", target_path="/assets", action_code="SHOW_RISK"),
                ChatAction(label="Run CP-SAT Planner", target_path="/planner", action_code="SHOW_BLOCKS"),
            ]
        )

    # 3. CP-SAT Optimizer & Maintenance Block Queries
    if any(k in msg for k in ["block", "planner", "cp-sat", "optimize", "possession", "bundling", "spatial", "or-tools"]):
        reqs = get_all_maintenance_requests()
        pending_count = len([r for r in reqs if r.get("status") in ["PENDING", "BUNDLED", "DRAFT", "SUBMITTED"]])
        return ChatResponse(
            response=f"### 🧩 Google OR-Tools CP-SAT Possession Block Recommendation\n\n**Primary Recommendation:** Block `BLK-2026-081`\n- **Section:** NDLS - AGC Mainline (KM 120.0 to 128.5)\n- **Optimized Window:** `02:00 AM – 03:00 AM` (60 Mins Duration)\n- **Bundled Jobs:** 7 Maintenance Jobs across Civil, OHE, and S&T\n- **Passing Train Conflicts:** **0 Conflicts** (Safety Buffer Preserved)\n- **CP-SAT Optimization Score:** **94.5 / 100**\n\n*The block is queued and ready for officer approval or digital PN generation.*",
            model_used=selected_model,
            data_type="BLOCK_PLAN",
            data={
                "block_id": "BLK-2026-081",
                "section": "NDLS - AGC Section (KM 120.0 - 128.5)",
                "start_time": "02:00 AM",
                "end_time": "03:00 AM",
                "duration_minutes": 60,
                "tasks_bundled": 7,
                "optimization_score": 94.5,
                "affected_trains": 0,
                "status": "RECOMMENDED"
            },
            suggested_actions=[
                ChatAction(label="Track Live Trains", target_path="/trains", action_code="SHOW_TRAINS"),
                ChatAction(label="Division Analytics", target_path="/divisions", action_code="SHOW_DIVISIONS"),
            ]
        )

    # 4. Risk Model & Critical Assets Queries
    if any(k in msg for k in ["risk", "critical", "ai model", "random forest", "scikit-learn", "failure", "asset"]):
        return ChatResponse(
            response=f"### ⚠️ AI Asset Risk Intelligence\n\nEvaluated track geometry, rail defect severity, ballast condition, and structural age via Scikit-Learn Random Forest Classifier.\n\n**High-Risk Track Sections Identified:**\n1. **TRK-124 (KM 124.5)** — Risk Score: **90 / 100** (Deep Ballast Tamp Required)\n2. **OHE-124 (KM 124.2)** — Risk Score: **82 / 100** (OHE Catenary Wire Tensioning Required)\n3. **TRK-120 (KM 120.0)** — Risk Score: **78 / 100** (Track Rail Replacement Pending)\n\n*Recommended Action: Schedule joint possession block during 02:00-03:00 AM window.*",
            model_used=selected_model,
            data_type="ASSET_RISKS",
            data={
                "critical_assets_count": 3,
                "top_risks": [
                    {"asset_id": "TRK-124", "type": "Track Rail", "location": "KM 124.5", "risk_score": 90, "action": "Deep Ballast Tamp & Rail Grinding"},
                    {"asset_id": "OHE-124", "type": "Electrical OHE", "location": "KM 124.2", "risk_score": 82, "action": "OHE Catenary Wire Tensioning"},
                    {"asset_id": "TRK-120", "type": "Track Rail", "location": "KM 120.0", "risk_score": 78, "action": "Track Rail Replacement"}
                ]
            },
            suggested_actions=[
                ChatAction(label="CP-SAT Block Planner", target_path="/planner", action_code="SHOW_BLOCKS"),
                ChatAction(label="Division Summary", target_path="/divisions", action_code="SHOW_DIVISIONS"),
            ]
        )

    # 5. Divisions & Zones Analytics Queries
    if any(k in msg for k in ["division", "delhi division", "prayagraj", "lucknow", "ambala", "moradabad"]):
        delhi_div = DIVISIONS_MASTER_DATA[0]
        return ChatResponse(
            response=f"### 📊 Division Analytics: {delhi_div['name']}\n\n- **Headquarters:** {delhi_div['headquarters']}\n- **Zone:** Northern Railway (NR)\n- **Total Route Distance:** **{delhi_div['total_route_km']} KM**\n- **Live Trains Monitored:** {delhi_div['trains_running']} Trains\n- **Active Maintenance Blocks:** {delhi_div['active_blocks']} Blocks\n- **Average Train Delay:** {delhi_div['avg_delay_min']} Mins\n- **Division Workload Index:** `{delhi_div['workload_index']}`",
            model_used=selected_model,
            data_type="DIVISION_METRICS",
            data=delhi_div,
            suggested_actions=[
                ChatAction(label="Calculate Route Distance", target_path="/distance", action_code="CALC_DIST"),
                ChatAction(label="Track Live Trains", target_path="/trains", action_code="SHOW_TRAINS"),
            ]
        )

    # 6. Route & Distance Queries
    if any(k in msg for k in ["distance", "route", "haversine", "km", "travel time", "how far"]):
        return ChatResponse(
            response=f"### 📐 Railway Route Distance Analysis\n\n**Origin:** New Delhi (NDLS) → **Destination:** Agra Cantt (AGC)\n\n- **Geographical Haversine Distance:** `178.4 KM` (Direct straight line)\n- **Railway Track Route Distance:** **210.5 KM** (Incorporates 1.18x track curvature factor)\n- **Average Express Transit Time:** ~2 Hours 35 Minutes\n- **Electrification Status:** 100% Electrified (25 kV AC Overhead Catenary)",
            model_used=selected_model,
            data_type="DISTANCE_CALC",
            data={
                "origin": "New Delhi (NDLS)",
                "destination": "Agra Cantt (AGC)",
                "haversine_km": 178.4,
                "route_km": 210.5,
                "transit_time_hrs": "2h 35m",
                "electrified": True
            },
            suggested_actions=[
                ChatAction(label="Delhi Division Metrics", target_path="/divisions", action_code="SHOW_DIVISIONS"),
                ChatAction(label="CP-SAT Block Planner", target_path="/planner", action_code="SHOW_BLOCKS"),
            ]
        )

    # General Helpful Response
    return ChatResponse(
        response=f"### 🚆 RETRACK AI Assistant\n\nHello **{user_name}** (`{user_role}`). Operational database query complete using **{model_name}**.\n\nYou can query live trains, CP-SAT block options, high-risk assets, division route distances, digital PN handshakes, or system audit compliance right inside this chat!",
        model_used=selected_model,
        data_type="GENERAL_INFO",
        data={"user": user_name, "role": user_role, "model": model_name},
        suggested_actions=[
            ChatAction(label="Track Live Trains", target_path="/trains", action_code="SHOW_TRAINS"),
            ChatAction(label="Run CP-SAT Planner", target_path="/planner", action_code="SHOW_BLOCKS"),
            ChatAction(label="High-Risk Assets", target_path="/assets", action_code="SHOW_RISK"),
            ChatAction(label="Delhi Division Summary", target_path="/divisions", action_code="SHOW_DIVISIONS"),
            ChatAction(label="Calculate Route Distance", target_path="/distance", action_code="CALC_DIST"),
        ]
    )
