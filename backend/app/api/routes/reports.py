from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from app.core.security import get_current_user

router = APIRouter(prefix="/reports", tags=["System Reports & Export"])

AVAILABLE_REPORTS = [
    {
        "id": "RPT-MAINT-01",
        "title": "Integrated Maintenance Block Utilization Report",
        "category": "MAINTENANCE",
        "description": "Comprehensive audit of 5 km spatial bundling efficiency, total possession hours saved, and department breakdown.",
        "period": "Current Month (Sept 2026)",
        "format": "PDF / CSV",
    },
    {
        "id": "RPT-DIV-02",
        "title": "Division Operations & Distance Performance Report",
        "category": "DIVISION",
        "description": "Detailed division-wise route kilometer breakdown, active block workload, and train traffic density analysis.",
        "period": "Quarter 3 (2026)",
        "format": "PDF / CSV",
    },
    {
        "id": "RPT-TRAIN-03",
        "title": "COA Train Impact & Delay Avoidance Analysis",
        "category": "TRAIN_IMPACT",
        "description": "Analysis of train delays avoided due to joint possession window optimization vs uncoordinated maintenance.",
        "period": "Current Week",
        "format": "PDF / CSV",
    },
    {
        "id": "RPT-RISK-04",
        "title": "AI Predictive Risk & Asset Health Summary",
        "category": "RISK_ANALYSIS",
        "description": "Scikit-Learn Random Forest risk predictions, high-risk track sections, and preventive maintenance recommendations.",
        "period": "Last 30 Days",
        "format": "PDF / CSV",
    },
]


@router.get("", response_model=List[Dict[str, Any]])
async def list_reports(current_user: dict = Depends(get_current_user)):
    return AVAILABLE_REPORTS
