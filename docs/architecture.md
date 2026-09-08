# RETRACK – RailSync-AI Architecture Specification
SIH 2026 Problem Statement ID: 26027

## System Overview
RailSync-AI is an AI-powered decision-support system designed to aggregate multi-source railway maintenance requests (TMS, TDMS, SMMS) and train movement paths (COA) to generate optimal, conflict-free joint possession blocks.

```
TMS + TDMS + SMMS + COA
        ↓
Multi-Source Ingestion & Normalization
        ↓
Predictive Risk Scoring (Scikit-Learn Random Forest)
        ↓
5 KM Spatial & Temporal Bundling Engine
        ↓
Safety & Constraint Validation Engine
        ↓
Google OR-Tools CP-SAT Optimization Solver
        ↓
Optimal Maintenance Block Possession
        ↓
Controller Review & Dynamic What-If Simulation
        ↓
Digital Private Number (PN) Verification
        ↓
Block Authorization & Audit Analytics
```

## Monorepo Layout
- **`frontend/`**: React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Lucide Icons, Recharts.
- **`backend/`**: Python 3.11, FastAPI, Pydantic v2, Uvicorn, Google OR-Tools, Scikit-Learn, Joblib, Supabase.
- **`database/`**: PostgreSQL 15 schema, indexes, constraints, and seed data.
- **`data/`**: Synthetic CSV datasets.
- **`tests/`**: Pytest automated test suite.
