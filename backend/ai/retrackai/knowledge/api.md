# RESTful API Architecture — FastAPI Endpoint Reference

## API Overview
RETRACK backend exposes asynchronous RESTful JSON endpoints powered by **FastAPI 0.110+** and **Pydantic v2**.

## Core Endpoint Modules
- `POST /api/v1/auth/login`: Authenticates user and returns JWT bearer token.
- `GET /api/v1/maintenance`: Retrieves maintenance requests filtered by department.
- `POST /api/v1/maintenance`: Ingests new maintenance request.
- `PATCH /api/v1/maintenance/{id}`: Updates task status (`PENDING` -> `COMPLETED`) or priority.
- `GET /api/v1/trains`: Retrieves COA live train movement feed.
- `POST /api/v1/optimizer/optimize`: Runs Google OR-Tools CP-SAT solver for maintenance block planning.
- `POST /api/v1/risk/score`: Calculates Scikit-Learn Random Forest asset risk score.
- `POST /api/v1/pn/generate`: Generates cryptographic Digital PN code.
- `POST /api/v1/pn/verify`: Verifies Digital PN code by Station Master.
- `POST /api/v1/chat/query`: Main RETRACKAI conversational AI endpoint.
- `GET /api/v1/chat/conversations`: Fetches user's chat history sessions.
- `GET /api/v1/chat/conversations/{id}/messages`: Fetches message stream for a session.
- `GET /api/v1/chat/conversations/search`: Searches chat history.
- `POST /api/v1/chat/feedback`: Submits user 👍 / 👎 feedback.
- `GET /api/v1/health`: System health check endpoint.
