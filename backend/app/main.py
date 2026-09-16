import logging
from datetime import datetime, timezone
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.constants import APP_TITLE, APP_VERSION, SIH_PROBLEM_STATEMENT_ID

# Import route modules
from app.api.routes import (
    auth,
    maintenance,
    tms,
    tdms,
    smms,
    coa,
    trains,
    assets,
    risk,
    bundling,
    safety,
    optimizer,
    blocks,
    pn,
    analytics,
    divisions,
    zones,
    distance,
    chat,
    audit,
    notifications,
    reports,
    workflow,
    admin,
    appearance,
)

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("retrack")

app = FastAPI(
    title=APP_TITLE,
    version=APP_VERSION,
    description=f"AI-Powered Automatic Block Planning System for Indian Railways (SIH 2026 Problem ID: {SIH_PROBLEM_STATEMENT_ID})",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Configure CORS
origins = settings.CORS_ORIGINS
if "*" not in origins:
    origins.extend(["http://localhost:5173", "http://127.0.0.1:5173"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = datetime.now(timezone.utc)
    response = await call_next(request)
    process_time = (datetime.now(timezone.utc) - start_time).total_seconds() * 1000
    logger.info(
        f"{request.method} {request.url.path} - Status: {response.status_code} - Completed in {process_time:.2f}ms"
    )
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An internal server error occurred.",
            "error_code": "INTERNAL_SERVER_ERROR",
            "details": {"error": str(exc)},
        },
    )


# Include API Routers under /api/v1
api_v1_prefix = settings.API_V1_STR
app.include_router(auth.router, prefix=api_v1_prefix)
app.include_router(tms.router, prefix=api_v1_prefix)
app.include_router(tdms.router, prefix=api_v1_prefix)
app.include_router(smms.router, prefix=api_v1_prefix)
app.include_router(coa.router, prefix=api_v1_prefix)
app.include_router(maintenance.router, prefix=api_v1_prefix)
app.include_router(trains.router, prefix=api_v1_prefix)
app.include_router(assets.router, prefix=api_v1_prefix)
app.include_router(risk.router, prefix=api_v1_prefix)
app.include_router(bundling.router, prefix=api_v1_prefix)
app.include_router(safety.router, prefix=api_v1_prefix)
app.include_router(optimizer.router, prefix=api_v1_prefix)
app.include_router(blocks.router, prefix=api_v1_prefix)
app.include_router(pn.router, prefix=api_v1_prefix)
app.include_router(analytics.router, prefix=api_v1_prefix)
app.include_router(divisions.router, prefix=api_v1_prefix)
app.include_router(zones.router, prefix=api_v1_prefix)
app.include_router(distance.router, prefix=api_v1_prefix)
app.include_router(chat.router, prefix=api_v1_prefix)
app.include_router(audit.router, prefix=api_v1_prefix)
app.include_router(notifications.router, prefix=api_v1_prefix)
app.include_router(reports.router, prefix=api_v1_prefix)
app.include_router(workflow.router, prefix=api_v1_prefix)
app.include_router(admin.router, prefix=api_v1_prefix)
app.include_router(appearance.router, prefix=api_v1_prefix)



@app.get("/", tags=["Health"])
async def root():
    return {
        "system": APP_TITLE,
        "sih_problem_id": SIH_PROBLEM_STATEMENT_ID,
        "status": "operational",
        "api_v1_url": f"{settings.API_V1_STR}/health",
        "docs_url": "/docs",
    }


@app.get(settings.API_V1_STR, tags=["Health"])
@app.get(f"{settings.API_V1_STR}/", tags=["Health"])
async def api_v1_root():
    return {
        "system": APP_TITLE,
        "api_version": "v1",
        "status": "operational",
        "health_check": f"{settings.API_V1_STR}/health",
        "endpoints": [
            f"{settings.API_V1_STR}/auth/login",
            f"{settings.API_V1_STR}/maintenance",
            f"{settings.API_V1_STR}/trains",
            f"{settings.API_V1_STR}/assets",
            f"{settings.API_V1_STR}/risk/score",
            f"{settings.API_V1_STR}/bundling/generate",
            f"{settings.API_V1_STR}/safety/validate",
            f"{settings.API_V1_STR}/optimizer/optimize",
            f"{settings.API_V1_STR}/blocks",
            f"{settings.API_V1_STR}/whatif/simulate",
            f"{settings.API_V1_STR}/pn/generate",
            f"{settings.API_V1_STR}/analytics/dashboard",
        ],
        "docs_url": "/docs",
    }


@app.get(f"{settings.API_V1_STR}/health", tags=["Health"])
async def health_check():
    return {
        "success": True,
        "status": "healthy",
        "service": APP_TITLE,
        "version": APP_VERSION,
        "sih_problem_statement_id": SIH_PROBLEM_STATEMENT_ID,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "modules": {
            "ingestion": "ready",
            "risk_scoring": "ready",
            "bundling": "ready",
            "safety_engine": "ready",
            "cp_sat_optimizer": "ready",
            "what_if_engine": "ready",
            "digital_pn": "ready",
        },
    }
