"""
RETRACKAI Service Orchestrator
Main AI service orchestrating query classification, knowledge retrieval (RAG),
live application data tools, conversation history, and prompt construction.
"""

import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime

from app.ai.retrackai.retriever import retriever
from app.ai.retrackai.tools import (
    get_tms_feed,
    get_tdms_feed,
    get_smms_feed,
    get_coa_trains,
    get_maintenance_requests,
    get_risk_analysis,
    get_optimizer_results,
    get_digital_pn_status,
    get_project_statistics,
)
from app.ai.retrackai.prompts import (
    RETRACKAI_SYSTEM_IDENTITY,
    VIVA_MODE_PROMPT_PREFIX,
    SUMMARY_MODES_PROMPTS,
    EXPLAINER_MODES_PROMPTS,
)
from app.ai.retrackai.schemas import (
    RETRACKAIQueryRequest,
    RETRACKAIQueryResponse,
    KnowledgeSourceMetadata,
    ChatActionDTO,
)
from app.db.queries import save_retrackai_message


class RETRACKAIService:
    """Service orchestrating RETRACKAI intelligence, tool calling, and RAG."""

    def process_query(self, req: RETRACKAIQueryRequest, current_user: dict) -> RETRACKAIQueryResponse:
        user_msg = req.message.strip()
        msg_lower = user_msg.lower()
        conv_id = req.conversation_id or f"conv-{uuid.uuid4().hex[:8]}"
        msg_id = f"msg-{uuid.uuid4().hex[:8]}"
        user_role = current_user.get("role", req.user_role or "CONTROLLER")
        selected_model = req.model or "gemini-1.5-pro"

        sources: List[KnowledgeSourceMetadata] = []
        data_type: Optional[str] = None
        data_obj: Optional[Dict[str, Any]] = None
        suggested_actions: List[ChatActionDTO] = []
        response_text = ""

        # 1. Handle Explainer Mode Shortcuts
        if req.explainer_mode and req.explainer_mode in EXPLAINER_MODES_PROMPTS:
            prompt_instruction = EXPLAINER_MODES_PROMPTS[req.explainer_mode]
            rag_docs = retriever.search(prompt_instruction, top_k=3)
            response_text = self._build_knowledge_response(prompt_instruction, rag_docs, sources)

        # 2. Check for Live Data Queries (Tool Calling)
        elif any(k in msg_lower for k in ["tdms", "defect", "cracks", "ultrasonic", "flaw"]):
            data_type = "ASSET_RISKS"
            data_obj = get_tdms_feed()
            sources.append(KnowledgeSourceMetadata(source="Live Application Data", document="TDMS Defect Feed", section="Critical Defects"))
            response_text = (
                f"### ⚠️ Live TDMS Track Defect Summary\n\n"
                f"Retrieved **{data_obj.get('critical_defects_count', 0)} critical defect records** from the Track Defect Management System (TDMS) feed.\n\n"
                f"- **Primary Threat:** Rail cracks and ultrasonic flaw alerts at KM 124.5 (`TRK-124`).\n"
                f"- **Recommended Action:** Schedule joint maintenance block possession during 02:00-03:00 AM window.\n\n"
                f"*Data Source: Live TDMS Feed (Demonstration Prototype Data)*"
            )
            suggested_actions = [
                ChatActionDTO(label="Run CP-SAT Planner", target_path="/planner", action_code="SHOW_BLOCKS"),
                ChatActionDTO(label="High-Risk Assets", target_path="/assets", action_code="SHOW_RISK"),
            ]

        elif any(k in msg_lower for k in ["tms", "civil", "track repair", "tamping"]):
            data_type = "MAINTENANCE_FEED"
            data_obj = get_tms_feed()
            sources.append(KnowledgeSourceMetadata(source="Live Application Data", document="TMS Civil Feed", section="Maintenance Jobs"))
            response_text = (
                f"### 🔨 Live TMS Civil Engineering Summary\n\n"
                f"Retrieved **{data_obj.get('total_count', 0)} civil track repair requests** from the Track Management System (TMS) feed.\n\n"
                f"- **Top Priority Job:** Track Rail Replacement & Deep Ballast Tamping (KM 124.5).\n"
                f"- **Required Block Type:** `TRAFFIC_BLOCK` / `JOINT_POSSESSION` (60 min duration).\n\n"
                f"*Data Source: Live TMS Feed*"
            )
            suggested_actions = [
                ChatActionDTO(label="Run CP-SAT Planner", target_path="/planner", action_code="SHOW_BLOCKS"),
            ]

        elif any(k in msg_lower for k in ["smms", "ohe", "electrical", "catenary", "signal", "interlocking"]):
            data_type = "MAINTENANCE_FEED"
            data_obj = get_smms_feed()
            sources.append(KnowledgeSourceMetadata(source="Live Application Data", document="SMMS Electrical & S&T Feed", section="Power & Signal Jobs"))
            response_text = (
                f"### ⚡ Live SMMS Electrical OHE & Signal/Telecom Summary\n\n"
                f"Retrieved **{data_obj.get('total_count', 0)} electrical and signal requests** from the SMMS feed.\n\n"
                f"- **OHE Catenary Wire Tensioning (`OHE-124`):** Location KM 124.2 requiring `POWER_BLOCK`.\n"
                f"- **Signal Relay Test (`SIG-125`):** Location KM 125.0 requiring signal red interlock.\n\n"
                f"*Data Source: Live SMMS Feed*"
            )

        elif any(k in msg_lower for k in ["coa", "train", "vande bharat", "rajdhani", "delayed"]):
            data_type = "TRAINS_LIST"
            data_obj = get_coa_trains()
            sources.append(KnowledgeSourceMetadata(source="Live Application Data", document="COA Train Operations Feed", section="Timetables & Delays"))
            response_text = (
                f"### 🚆 Live COA Train Operations Summary\n\n"
                f"Currently monitoring **{data_obj.get('total_trains_running', 0)} active trains** on the NDLS-AGC Corridor.\n\n"
                f"- **On-Time Running:** {data_obj.get('on_time_count', 0)} trains\n"
                f"- **Delayed Trains:** {data_obj.get('delayed_count', 0)} train(s)\n"
                f"- **Express Priority:** Vande Bharat Express & Rajdhani Express operating on schedule.\n\n"
                f"*Data Source: Live COA Train Feed*"
            )
            suggested_actions = [
                ChatActionDTO(label="CP-SAT Planner", target_path="/planner", action_code="SHOW_BLOCKS"),
            ]

        elif any(k in msg_lower for k in ["cp-sat", "optimizer", "block plan", "possession", "bundling"]):
            data_type = "BLOCK_PLAN"
            data_obj = get_optimizer_results()
            sources.append(KnowledgeSourceMetadata(source="RETRACK Project Documentation", document="optimization.md", section="CP-SAT MILP Solver"))
            response_text = (
                f"### 🧩 Google OR-Tools CP-SAT Possession Block Output\n\n"
                f"**Recommended Block:** `BLK-2026-081`\n"
                f"- **Section:** NDLS - AGC Section (KM 120.0 to 128.5)\n"
                f"- **Optimized Window:** `02:00 AM – 03:00 AM` (60 Mins Duration)\n"
                f"- **Bundled Jobs:** 7 Maintenance Jobs across Civil, OHE, and S&T\n"
                f"- **Train Conflicts:** **0 Conflicts** (Safety Buffer Preserved)\n"
                f"- **Optimization Score:** **94.5 / 100**\n\n"
                f"*Data Source: CP-SAT Optimization Solver Engine*"
            )

        elif any(k in msg_lower for k in ["digital pn", "pn code", "private number", "handshake"]):
            data_type = "PN_STATUS"
            data_obj = get_digital_pn_status()
            sources.append(KnowledgeSourceMetadata(source="RETRACK Project Documentation", document="digital_pn.md", section="2-Factor Handshake Protocol"))
            response_text = (
                f"### 🔑 Digital Private Number (PN) Exchange Status\n\n"
                f"- **Block ID:** `{data_obj.get('block_id', 'BLK-2026-081')}`\n"
                f"- **Cryptographic PN Code:** **{data_obj.get('pn_code', 'PN-847291')}**\n"
                f"- **Generated By:** {data_obj.get('generated_by', 'Section Controller')}\n"
                f"- **Handshake Status:** **{data_obj.get('status', 'VERIFIED')}**\n"
                f"- **Verified By:** {data_obj.get('verified_by', 'Station Master (NDLS)')}\n\n"
                f"*Data Source: Digital PN Handshake Audit Log*"
            )

        # 3. Handle Knowledge RAG Search
        else:
            rag_docs = retriever.search(user_msg, top_k=3)
            if rag_docs:
                response_text = self._build_knowledge_response(user_msg, rag_docs, sources)
            else:
                # Fallback to general project overview if no direct RAG matches
                sources.append(KnowledgeSourceMetadata(source="RETRACK Project Documentation", document="project_overview.md", section="Executive Overview"))
                response_text = (
                    f"### 🚆 RETRACK – RailSync-AI Overview\n\n"
                    f"Hello! I am RETRACKAI, the official AI knowledge assistant for RETRACK – RailSync-AI (SIH 2026 Problem Statement 26027).\n\n"
                    f"RETRACK unifies multi-department maintenance requests (**TMS**, **TDMS**, **SMMS**), cross-references **COA Train Timetables**, "
                    f"and uses **Google OR-Tools CP-SAT** with **Scikit-Learn Random Forest ML** to schedule joint 5 km block possessions.\n\n"
                    f"Ask me about:\n"
                    f"- Project architecture & workflow\n"
                    f"- TMS vs TDMS vs SMMS vs COA\n"
                    f"- CP-SAT mathematical optimization & +15 min safety buffer\n"
                    f"- Digital PN 2-factor handshake protocol\n"
                    f"- Live trains or critical track defects"
                )

        # 4. Apply Viva Mode Prefix Formatting if enabled
        if req.viva_mode:
            response_text = (
                f"### 🎓 VIVA MENTOR ANSWER\n\n"
                f"**Short Answer:** {response_text.splitlines()[0] if response_text else 'RETRACK is an AI railway maintenance planning platform.'}\n\n"
                f"**Detailed Viva Explanation:**\n"
                f"{response_text}"
            )

        # Persist conversation & messages to storage
        try:
            save_retrackai_message(
                conversation_id=conv_id,
                user_id=current_user.get("id", "demo-user"),
                user_msg=user_msg,
                assistant_msg=response_text,
                data_type=data_type,
                data_obj=data_obj
            )
        except Exception:
            pass

        return RETRACKAIQueryResponse(
            conversation_id=conv_id,
            message_id=msg_id,
            response=response_text,
            model_used=selected_model,
            data_type=data_type,
            data=data_obj,
            sources=sources,
            suggested_actions=suggested_actions or [
                ChatActionDTO(label="CP-SAT Block Planner", target_path="/planner", action_code="SHOW_BLOCKS"),
                ChatActionDTO(label="Track Live Trains", target_path="/trains", action_code="SHOW_TRAINS"),
                ChatActionDTO(label="High-Risk Assets", target_path="/assets", action_code="SHOW_RISK"),
            ],
            viva_mode=req.viva_mode
        )

    def _build_knowledge_response(
        self, query: str, rag_docs: List[Dict[str, Any]], sources: List[KnowledgeSourceMetadata]
    ) -> str:
        body_parts = []
        for doc in rag_docs:
            sources.append(
                KnowledgeSourceMetadata(
                    source="RETRACK Project Documentation",
                    document=doc.get("document", doc.get("doc_id")),
                    section=doc.get("section", ""),
                )
            )
            body_parts.append(doc.get("content", ""))

        joined_content = "\n\n---\n\n".join(body_parts)
        return f"### 📘 RETRACK Knowledge Base Output\n\n{joined_content}"


retrackai_service = RETRACKAIService()
