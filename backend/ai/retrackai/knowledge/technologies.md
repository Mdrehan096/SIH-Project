# Technology Stack — Core Frameworks & Libraries

## Frontend Stack
- **Framework:** React 18.2 with TypeScript 5.2 (100% Strict Type Safety)
- **Build System:** Vite 5.4 (Instant HMR & Optimized Production Bundling)
- **Styling:** TailwindCSS 3.4, PostCSS, Custom Light/Dark Theme Context
- **Iconography:** Lucide React Icon Library
- **Vector GIS Mapping:** Mapbox GL JS 3.3 (Interactive Track Map Canvas & Coordinates)
- **Data Visualization:** Recharts 2.12 (Pie Charts, Bar Charts, Risk Feature Weighting Gauges)
- **HTTP & Cloud SDK:** Axios 1.6 & `@supabase/supabase-js` v2.4

## Backend Stack
- **Architecture Pattern:** Model-View-Controller (MVC) Architecture
- **Language & Runtime:** Python 3.11+ / 3.14
- **API Framework:** FastAPI 0.110+ (Asynchronous REST API Engine with OpenAPI Docs)
- **Data Validation:** Pydantic v2.6 & `pydantic-settings`
- **Security & Auth:** PyJWT (HS256 Token Authentication), Passlib Bcrypt, Role-Based Access Control (RBAC)
- **Web Server:** Uvicorn (Production ASGI Server)

## AI, ML & Mathematical Optimization
- **Optimization Solver:** Google OR-Tools v9.9 (CP-SAT Constraint Programming Solver)
- **Predictive Risk Model:** Scikit-Learn v1.4 (Random Forest Classifier & Feature Importance Evaluator)
- **Data Science Core:** Pandas v2.2, NumPy v1.26, Joblib v1.3

## Database & Cloud Persistence
- **Engine:** Supabase PostgreSQL 15+ (Cloud Relational Database)
- **Driver:** `supabase-py` v2.4, Direct PostgreSQL Connection Pooler (`psycopg2-binary`, `asyncpg`)
- **Schema Features:** 17 Relational Tables, `uuid-ossp` Extensions, PL/pgSQL Triggers for `updated_at`, Spatial & Status B-Tree Indexes.
