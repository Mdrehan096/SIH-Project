# RETRACK – RailSync-AI REST API Reference
SIH 2026 Problem Statement ID: 26027

API Base URL: `http://localhost:8000/api/v1`

## Key Endpoints

### 1. Health
- `GET /health`: Health check and module status.

### 2. Authentication
- `POST /auth/login`: Authenticate and receive JWT token.
- `GET /auth/me`: Get current user profile.

### 3. Maintenance Requests
- `GET /maintenance`: List requests (filter by department/status).
- `POST /maintenance`: Create request.
- `GET/PATCH/DELETE /maintenance/{id}`: Operations on request.

### 4. Trains & COA Paths
- `GET /trains`: List trains.
- `GET /trains/paths`: Timetable path segments.

### 5. AI & Optimization Engine
- `POST /risk/score`: Calculate Scikit-Learn predictive risk score.
- `POST /bundling/generate`: Run 5 km spatial bundling engine.
- `POST /safety/validate`: Validate safety constraints.
- `POST /optimizer/optimize`: Execute OR-Tools CP-SAT solver.

### 6. Possession Blocks & PN Workflow
- `GET /blocks`: List candidate and approved blocks.
- `POST /blocks/{id}/approve`: Controller block approval.
- `POST /blocks/{id}/reject`: Controller block rejection.
- `POST /pn/generate`: Generate Digital Private Number.
- `POST /pn/verify`: Station Master PN verification.

### 7. Simulation & Analytics
- `POST /whatif/simulate`: Dynamic what-if recalculation.
- `GET /analytics/dashboard`: Operational analytics metrics.
