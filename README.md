# RETRACK – RailSync-AI

**SIH 2026 Problem Statement ID:** 26027  
**Title:** AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways  

---

## 📌 Core Overview
**RailSync-AI** is an AI-powered decision-support system that aggregates maintenance requests from **TMS**, **TDMS**, and **SMMS**, matches them with live/scheduled train paths from **COA**, and generates optimal, conflict-free railway maintenance possession/block windows using **Google OR-Tools CP-SAT** optimization and **Scikit-Learn** predictive risk scoring.

The core objective is to synchronize maintenance activities across **Civil**, **Electrical**, and **S&T (Signal & Telecom)** departments so that geographically close, compatible maintenance jobs can be bundled within a **5 km corridor** and executed in a unified block window rather than repeatedly disrupting train operations.

---

## 🏗 System Architecture & Workflow

```
TMS + TDMS + SMMS + COA
        ↓
Multi-Source Ingestion & Normalization
        ↓
Predictive Risk Scoring (Scikit-Learn)
        ↓
5 km Spatial & Temporal Bundling
        ↓
Safety & Constraint Validation Engine
        ↓
OR-Tools CP-SAT Optimization Solver
        ↓
Optimal Conflict-Free Maintenance Block
        ↓
Controller Review & What-If Simulation
        ↓
Digital Private Number (PN) Verification
        ↓
Block Authorization & Audit Analytics
```

---

## 🛠 Technology Stack

- **Frontend:** React 18, TypeScript, Vite, CSS, React Router v6, Axios, Recharts, Lucide Icons
- **Backend:** Python 3.11, FastAPI, Pydantic v2, Uvicorn
- **AI / ML:** Scikit-learn, Pandas, NumPy, Joblib
- **Optimization:** Google OR-Tools (CP-SAT Solver)
- **Database & Auth:** Supabase PostgreSQL 15, Supabase Auth, Row Level Security (RLS)
- **Real-Time:** Supabase Realtime / WebSockets

---

## 📂 Repository Structure

```
RETRACK/
├── frontend/        # React + TypeScript + Vite Dashboard
├── backend/         # FastAPI REST API, Risk Model & CP-SAT Optimizer
├── database/        # PostgreSQL schema, seed data, and RLS policies
├── data/            # Synthetic Railway datasets (TMS, TDMS, SMMS, COA)
├── docs/            # System documentation and manuals
├── tests/           # Integration and unit tests
├── docker-compose.yml
└── README.md
```

---

## 🚀 Phase 1 Quickstart Instructions

### 1. Prerequisites
- Python 3.11+
- Node.js 18+ & npm
- Git

### 2. Backend Setup & Run

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install backend dependencies
pip install -r requirements.txt

# Create .env from template
copy .env.example .env

# Run FastAPI server
uvicorn app.main:app --reload --port 8000
```
- API Base URL: `http://localhost:8000`
- API Health Endpoint: `http://localhost:8000/api/v1/health`
- OpenAPI Docs: `http://localhost:8000/docs`

### 3. Frontend Setup & Run

```bash
# Open new terminal window and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env from template
copy .env.example .env

# Start Vite development server
npm run dev
```
- Frontend App URL: `http://localhost:5173`

---

## ⚠️ Hackathon Prototype Disclaimer
*RailSync-AI is a decision-support system prototype developed for Smart India Hackathon 2026. It uses synthetic mock data for TMS, TDMS, SMMS, and COA to demonstrate AI spatial bundling, risk scoring, CP-SAT optimization, what-if scenario modeling, and digital PN verification. It is not certified for direct live railway traffic control.*
