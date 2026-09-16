# Project Limitations & Prototype Scope

## Honest Systems Assessment
RETRACK – RailSync-AI is a proof-of-concept prototype built for Smart India Hackathon (SIH 2026). It is designed to demonstrate technical feasibility and mathematical decision-support pipelines.

## Current Project Limitations
1. **Demonstration Dataset:** Operates on simulated operational datasets modeled after Northern Railway (NDLS - AGC corridor) rather than live production CRIS database connections.
2. **ML Model Training Scope:** The Scikit-Learn Random Forest model is trained on synthetic inspection datasets; production deployment requires multi-year GMT historical track maintenance records.
3. **Regulatory Authorization:** Production deployment on Indian Railways requires formal safety certification, CRIS interface approval, and adherence to General & Subsidiary Rules (G&SR).
4. **Solver Time Limit:** CP-SAT solver is configured with a 10-second solver time limit for interactive web response speeds.
