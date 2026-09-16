# Security Architecture & Access Control (RBAC)

## Authentication & Authorization
- **Authentication Scheme:** JWT (JSON Web Tokens) with HS256 signature algorithm.
- **Password Hashing:** Passlib with Bcrypt algorithm.
- **Role-Based Access Control (RBAC):**
  - `ADMIN`: Full administrative control, governance panel, user management.
  - `CONTROLLER`: Section Controller access, block approval, time-slot selection, PN generation.
  - `STATION_MASTER`: Station Master PN verification, station clearance authorization.
  - `ENGINEER`: Maintenance request creation, AI asset risk analysis.

## Zero Secret Exposure Guarantee
All sensitive keys (`SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, database passwords) are stored strictly inside backend environment variables (`.env`). No raw secrets are ever exposed to the frontend or sent to the LLM model.
