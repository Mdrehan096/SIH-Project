# Data Ingestion & Multi-Department Integration

## Data Sources
RETRACK ingests data continuously from four primary Indian Railways systems:
1. **TMS (Track Management System)**: Civil track maintenance jobs, tamping requests, rail replacements, and ballast cleaning.
2. **TDMS (Track Defect Management System)**: Rail crack records, ultrasonic flaw detection alerts, joint defects, and geometry defects.
3. **SMMS (Signal & Mechanical Management System)**: Electrical OHE catenary maintenance, signal interlocks, point machine testing, and track circuit repairs.
4. **COA (Control Office Application)**: Real-time train timetables, live train locations, passenger express priorities (Vande Bharat, Rajdhani, Shatabdi), and freight movements.

## Normalization Pipeline
- Ingested records are cleaned and normalized into standard REST/Pydantic DTO payloads.
- Geographical locations are converted into standard corridor kilometer markers (e.g. KM 120.0 to KM 145.0 on NDLS-AGC section).
- Time windows are normalized into UTC ISO-8601 timestamps.
