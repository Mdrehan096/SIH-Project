# RETRACK – RailSync-AI

### AI-Powered Railway Maintenance Planning, Operations Coordination & Decision Support Platform
**SIH 2026 Problem Statement ID:** 26027  
**Title:** AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways  
**Division:** Northern Railway (Delhi Division — NDLS / AGC / GZB Corridors)

---

## 📌 Executive Summary

**RETRACK – RailSync-AI** is an enterprise-grade decision support platform built for **Indian Railways**. It unifies multi-departmental maintenance requests from legacy systems (**TMS** for Civil Track, **TDMS** for Track Defects, and **SMMS** for Electrical Traction OHE & Signal/Telecom), cross-references live train schedules from **COA (Control Office Application)**, and leverages **Google OR-Tools CP-SAT Mixed-Integer Linear Programming (MILP)** alongside **Scikit-Learn Machine Learning** to automatically generate conflict-free maintenance block possessions.

By bundling geographically proximate maintenance tasks across departments within a **5 km spatial corridor**, RETRACK reduces corridor downtime by **up to 40%** while maintaining mandatory safety buffer margins (+15 mins) around passing express trains.

---

## 🤖 RETRACKAI — Project-Specific LLM & RAG Assistant

RETRACK incorporates **RETRACKAI**, a dedicated ChatGPT-style project knowledge assistant engineered specifically for RETRACK – RailSync-AI (SIH 2026 Problem Statement 26027).

```
                         USER QUERY
                              │
                              ▼
                       RETRACKAI UI
                              │
                              ▼
            Chat API (/api/v1/chat/query & /stream)
                              │
                              ▼
                   Conversation Memory Service
                              │
                              ▼
                     Query Rewriter Engine
  (e.g., "Why is it needed?" ➔ "Why is predictive risk scoring needed in RETRACK?")
                              │
                              ▼
                     Intent Classifier
  (CLASSIFIES INTO: WORKFLOW, OPTIMIZATION, VIVA, MODULE_EXPLANATION, etc.)
                              │
                              ▼
                     RETRACK Domain RAG
         ┌────────────────────┴────────────────────┐
         ▼                                         ▼
   Vector Retriever                         Live Data Feeds
  (24 Knowledge Files)                   (TMS, TDMS, SMMS, COA)
         │                                         │
         └────────────────────┬────────────────────┘
                              ▼
                    LLM Provider Service
            (Configurable via .env settings)
                              │
                              ▼
                  Structured Response Generator
                              │
                              ▼
                  Expandable Source Metadata
                              │
                              ▼
                SSE Streaming Token Output / UI
```

### Key RETRACKAI Features & Modules
1. **Domain-Specific RAG Knowledge Base (24 Markdown Documents):** Grounded in structured project documentation covering Problem Statement 26027, End-to-End Workflow, TMS/TDMS/SMMS/COA feeds, Data Ingestion, Spatial & Temporal Bundling, CP-SAT MILP solver math, Scikit-Learn Random Forest risk weights, Digital PN 2-factor handshake, Database Schema, REST APIs, Security, Viva Guide, Terminology, Future Scope, and Limitations.
2. **Contextual Query Rewriter (`query_rewriter.py`):** Converts conversational follow-up questions ("Why is it needed?") into standalone, context-complete queries ("Why is predictive risk scoring needed in RETRACK?") using sliding memory history.
3. **15-Class Intent Classifier (`intent_classifier.py`):** Automatically detects user query intent (`PROJECT_OVERVIEW`, `WORKFLOW`, `AI_ML`, `OPTIMIZATION`, `SAFETY`, `DATABASE`, `API`, `VIVA`, `FUTURE_SCOPE`, `LIMITATIONS`, etc.).
4. **Environment-Configurable LLM Provider (`llm_provider.py`):** Modular abstraction supporting Google Gemini, Groq, OpenAI, and local LLMs via `.env` configuration.
5. **Streaming SSE Endpoint (`POST /api/v1/chat/stream`):** Server-Sent Events endpoint enabling real-time ChatGPT-like token streaming responses.
6. **Chat History & Session Management:** Persists conversations and messages in Supabase PostgreSQL (`retrackai_conversations`, `retrackai_messages`, `retrackai_feedback`) with sidebar history search, conversation renaming, and chat deletion.
7. **🎓 Viva & Presentation Mode:** Specialized Q&A defense mentor mode generating exam-ready answers and key technical points for hackathon judges and viva mentors.
8. **Safe Application Data Tools (`tools.py`):** Direct read-only integration with TMS, TDMS, SMMS, COA, Risk Engine, and CP-SAT solver feeds.
9. **Strict Hallucination Control:** Focuses strictly on RETRACK project knowledge and railway operational parameters, preventing fabricated data.

---

## 🏗 Architecture Pattern: Model-View-Controller (MVC)

RETRACK – RailSync-AI enforces a clean, modular **Model-View-Controller (MVC)** architectural pattern across both backend services and frontend user interfaces:

```
                      +---------------------------------+
                      |       USER / BROWSER CLIENT     |
                      +---------------------------------+
                                       |
                                       v
                +-----------------------------------------------+
                |                 VIEW LAYER                    |
                |  - React Pages (BlockPlanner, DigitalPn)   |
                |  - FastAPI API Routes (REST Controllers)      |
                +-----------------------------------------------+
                                  |            ^
                     HTTP Request |            | JSON Response
                                  v            |
                +-----------------------------------------------+
                |              CONTROLLER LAYER                 |
                |  - MaintenanceController (CRUD & State)       |
                |  - OptimizerController (CP-SAT Solver)        |
                |  - RiskController (Scikit-Learn ML Engine)    |
                |  - PNController (2-Factor Handshake)          |
                |  - ChatController (RETRACKAI LLM Orchestrator)|
                +-----------------------------------------------+
                                  |            ^
                    Business Data |            | Domain Model Data
                                  v            |
                +-----------------------------------------------+
                |                 MODEL LAYER                   |
                |  - Domain Entities (app/models/domain.py)     |
                |  - Pydantic DTO Schemas (app/schemas/)         |
                |  - Supabase PostgreSQL Database (schema.sql)  |
                +-----------------------------------------------+
```

---

## 🛠 Technology Stack

### Frontend Architecture
- **Framework:** React 18.2 with TypeScript 5.2 (100% Strict Type Safety)
- **Build System:** Vite 5.4 (Instant Hot Module Replacement & Production Bundling)
- **Styling:** TailwindCSS 3.4, PostCSS, Custom Light/Dark Theme Context
- **Icons & UI:** Lucide React Icon Library
- **Mapping Canvas:** Mapbox GL JS 3.3 (Vector Track Map & Interactive GIS Layers)
- **Data Visualization:** Recharts 2.12 (Pie Charts, Bar Charts, Risk Importance Gauges)
- **HTTP & Cloud SDK:** Axios 1.6 & `@supabase/supabase-js` v2.4

### Backend Architecture
- **Architecture Pattern:** MVC (Model-View-Controller) Architecture
- **Language & Runtime:** Python 3.11+ / 3.14
- **API Framework:** FastAPI 0.110+ (Asynchronous ASGI Engine with OpenAPI Docs & SSE Streaming)
- **Data Validation:** Pydantic v2.6 & `pydantic-settings`
- **Security:** PyJWT (HS256 Token Auth), Passlib Bcrypt, Role-Based Access Control (RBAC)
- **Web Server:** Uvicorn (Production ASGI Server)

### AI, Machine Learning & Mathematical Optimization
- **LLM Assistant:** RETRACKAI RAG Engine (Query Rewriter, Intent Classifier, LLM Provider, Memory Service)
- **Optimization Solver:** Google OR-Tools v9.9 (CP-SAT Constraint Programming Solver)
- **Predictive Risk Model:** Scikit-Learn v1.4 (Random Forest Classifier & Feature Importance Evaluator)
- **Data Processing:** Pandas v2.2, NumPy v1.26, Joblib v1.3

### Database & Live Cloud Persistence
- **Engine:** Supabase PostgreSQL 15+ (Cloud Relational Database)
- **Driver:** `supabase-py` v2.4, Direct PostgreSQL Connection Pooler
- **Schema:** 20 Relational Tables, `uuid-ossp` Extensions, PL/pgSQL Triggers for `updated_at`, Spatial & Status B-Tree Indexes.

---

## 🔄 End-to-End System Workflow

```mermaid
flowchart TD
    subgraph Ingestion ["1. Multi-Department Data Ingestion"]
        A1["TMS (Civil Track)"]
        A2["TDMS (Track Defects)"]
        A3["SMMS (Electrical OHE & S&T)"]
        A4["COA (Train Timetables & Schedules)"]
    end

    subgraph Analytics ["2. Predictive Risk & Corridor Bundling"]
        B1["Scikit-Learn Random Forest Classifier"]
        B2["Asset Health Risk Score (0 - 100)"]
        B3["5 km Spatial & Temporal Corridor Bundler"]
    end

    subgraph Optimization ["3. CP-SAT Optimization Engine"]
        C1["Google OR-Tools CP-SAT Solver"]
        C2["Custom Time Slot & Duration Constraint Engine"]
        C3["Safety Matrix & Buffer Margin Validation (+15m)"]
    end

    subgraph Approval ["4. Officer Decision & Handshake"]
        D1["Section Controller Review & Time-Slot Approval"]
        D2["Digital Private Number (PN) Cryptographic Code"]
        D3["Station Master Verification Handshake"]
    end

    subgraph Execution ["5. Live Execution & Status Persistence"]
        E1["Supabase PostgreSQL Persistence"]
        E2["Interactive Department Status Updates (PENDING -> COMPLETED)"]
        E3["Operational Notification Broadcast & Audit Logging"]
    end

    A1 & A2 & A3 & A4 --> B1
    B1 --> B2 --> B3
    B3 --> C1 --> C2 --> C3
    C3 --> D1 --> D2 --> D3
    D3 --> E1 --> E2 --> E3
```

---

## 📂 Repository Structure

```
SIH_PROJECT/
├── database/
│   ├── schema.sql              # Supabase PostgreSQL 15+ DDL (20 Relational Tables)
│   └── seed.sql                # Northern Railway NDLS-AGC corridor operational demo data
├── backend/
│   ├── app/
│   │   ├── ai/retrackai/       # RETRACKAI LLM & RAG Engine (Service, Knowledge, Retriever, Tools, Prompts)
│   │   │   ├── knowledge/      # 24 Domain Knowledge Markdown Documents
│   │   │   ├── embedding_service.py # Vector Store & Embedding Abstraction
│   │   │   ├── intent_classifier.py # 15-Class Query Intent Engine
│   │   │   ├── llm_provider.py # Configurable Multi-LLM Provider Interface
│   │   │   ├── memory_service.py    # Sliding Context Window Memory
│   │   │   └── query_rewriter.py    # Follow-up Context Rewriter
│   │   ├── api/routes/         # VIEW LAYER: FastAPI endpoints (Chat, Maintenance, Trains, Optimizer, PN)
│   │   ├── controllers/        # CONTROLLER LAYER: Request Orchestrators
│   │   ├── core/               # Configuration settings, CORS, JWT security
│   │   ├── db/                 # Database Connection Manager & Supabase queries
│   │   ├── models/             # MODEL LAYER: Domain Data Entities
│   │   ├── schemas/            # MODEL LAYER: Pydantic Request/Response DTO Schemas
│   │   ├── services/           # BUSINESS LAYER: OR-Tools solver & ML model engines
│   │   └── main.py             # FastAPI Application Entry Point
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Backend environment variables
├── frontend/
│   ├── src/
│   │   ├── components/         # VIEW LAYER: AiChatbot, Header, Sidebar, GlobalSearch
│   │   ├── context/            # STATE LAYER: AuthContext, ThemeContext, RealtimeContext
│   │   ├── pages/              # VIEW LAYER: React Pages (BlockPlanner, DigitalPn, Analytics)
│   │   ├── services/           # API CLIENT LAYER: Axios client & backend endpoints
│   │   └── App.tsx             # Main App Router & Layout
│   ├── package.json            # Frontend NPM dependencies
│   └── .env                    # Frontend environment variables
└── tests/                      # Pytest unit & integration test suite (33 tests)
```

---

## 🚀 Quickstart Instructions

### 1. Prerequisites
- **Python 3.11+** or **3.14**
- **Node.js 18+** & `npm`
- **Git**

### 2. Live Supabase Database Setup
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open **SQL Editor** -> Execute `database/schema.sql`.
3. Execute `database/seed.sql` to seed Northern Railway operational demo data.

### 3. Backend Setup & Execution

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install backend dependencies
pip install -r requirements.txt

# Run FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```
- **API Base URL:** `http://localhost:8000`
- **Interactive OpenAPI Docs:** `http://localhost:8000/docs`
- **RETRACKAI Endpoint:** `http://localhost:8000/api/v1/chat/query`
- **RETRACKAI Streaming Endpoint:** `http://localhost:8000/api/v1/chat/stream`

### 4. Frontend Setup & Execution

```powershell
# Open a new terminal and navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start Vite dev server
npm run dev
```
- **Web Application:** `http://localhost:5173`

---

## 🔑 Demo Access Credentials

Log in at `http://localhost:5173/login` using any of these roles:

| Role | Email | Password | Allowed System Permissions |
| :--- | :--- | :--- | :--- |
| **Section Controller** | `controller@railsync.ir` | `controller123` | Block Approval, CP-SAT Time Slot Selection, PN Generation |
| **Station Master** | `stationmaster@railsync.ir` | `station123` | Digital PN Verification Handshake, Station Clearance |
| **Track Engineer** | `engineer.civil@railsync.ir` | `engineer123` | Maintenance Request Creation, AI Asset Risk Analysis |
| **System Admin** | `admin@railsync.ir` | `admin123` | Governance Panel, RBAC Management, Audit Logs |

---

## 🧪 Verification & Automated Testing

Run the automated Pytest suite from the project root:
```powershell
d:\SIH_PROJECT\backend\venv\Scripts\pytest.exe d:\SIH_PROJECT\tests
```
- **Pytest Suite:** `33 passed` (100% pass rate).
- **TypeScript Verification:** `npx tsc --noEmit` passed with **0 errors**.
- **Production Build:** `npm run build` compiled cleanly in **8.20s**.
