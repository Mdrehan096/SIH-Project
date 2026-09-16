# System Architecture — Model-View-Controller (MVC) Pattern

## High-Level Architecture
RETRACK – RailSync-AI follows a strict **Model-View-Controller (MVC)** design pattern, ensuring clear separation of concerns between data models, business logic controllers, and presentation views.

```
                      +---------------------------------+
                      |       USER / BROWSER CLIENT     |
                      +---------------------------------+
                                       |
                                       v
               +-----------------------------------------------+
               |                 VIEW LAYER                    |
               |  - React 18 Pages (BlockPlanner, DigitalPn)   |
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

## Layer Breakdown

### 1. Model Layer (`backend/app/models/` & `backend/app/schemas/`)
- **Domain Models (`domain.py`)**: `MaintenanceRequestModel`, `TrainModel`, `BlockPossessionModel`, `DigitalPNModel`, `NotificationModel`.
- **Pydantic DTOs (`schemas/`)**: Strict type checking and request/response validation.
- **Relational Storage (`schema.sql`)**: 17 Relational Tables in Supabase PostgreSQL 15+.

### 2. Controller Layer (`backend/app/controllers/`)
- `MaintenanceController`: Manages maintenance request workflows and status updates (`PENDING` -> `COMPLETED`).
- `OptimizerController`: Coordinates OR-Tools CP-SAT constraint optimization and 5 km spatial bundling.
- `RiskController`: Evaluates Scikit-Learn Random Forest failure probability and risk feature importance weights.
- `PNController`: Handles 2-factor Digital PN cryptographic generation and Station Master verification handshakes.

### 3. View Layer (`frontend/src/pages/` & `backend/app/api/routes/`)
- **Backend API Routes**: FastAPI router endpoints (`/maintenance`, `/optimizer`, `/pn`, `/chat`, `/trains`, `/risk`) returning structured JSON views.
- **Frontend UI Views**: Interactive React pages styled with TailwindCSS and Mapbox GL JS map canvas.
