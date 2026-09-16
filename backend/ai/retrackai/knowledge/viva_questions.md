# 🎓 Viva & Presentation Questions

## Q1: Why did you use FastAPI instead of Flask or Django?
**Short Answer:** FastAPI provides asynchronous non-blocking I/O, automatic Pydantic data validation, high performance (benchmarking close to NodeJS/Go), and auto-generated OpenAPI documentation.
**Detailed Answer:** In a high-concurrency railway system where real-time feeds from TMS, TDMS, SMMS, and COA arrive simultaneously, FastAPI's `async/await` architecture prevents thread blocking during CP-SAT solver calls and database lookups.

## Q2: Why did you choose PostgreSQL / Supabase?
**Short Answer:** PostgreSQL provides ACID compliance, strong relational integrity for multi-table schemas, spatial indexing, and custom PL/pgSQL triggers required for railway asset management.
**Detailed Answer:** Railway maintenance data requires strict transactional guarantees. We used Supabase PostgreSQL 15+ to leverage relational foreign keys across 17 tables, instant connection pooling, and real-time state synchronization.

## Q3: Why did you use Scikit-Learn Random Forest for asset risk scoring?
**Short Answer:** Random Forest handles non-linear feature interactions (defect severity, asset age, defect frequency), prevents overfitting, and provides interpretable feature decision weights.
**Detailed Answer:** Unlike black-box neural networks, Random Forest allows railway engineers to inspect decision weights (e.g. Defect Severity 35%, Failures 25%), providing Explainable AI (XAI) confidence required for safety-critical railway decisions.

## Q4: Why did you select Google OR-Tools CP-SAT for block optimization?
**Short Answer:** CP-SAT is a state-of-the-art Constraint Programming & MILP solver that guarantees mathematically optimal schedules while respecting strict hard safety constraints.
**Detailed Answer:** Heuristic algorithms cannot guarantee zero train schedule overlaps or safety buffer compliance. CP-SAT formulates integer decision variables for block start/end times and finds optimal feasible windows in under 10 seconds.

## Q5: Why is the spatial bundling threshold set to 5.0 km?
**Short Answer:** A 5 km corridor matches typical Indian Railways maintenance gang movement limits and electrical OHE sector isolation lengths, minimizing corridor downtime by up to 40%.

## Q6: What happens if the CP-SAT solver finds no feasible solution?
**Short Answer:** The solver triggers constraint relaxation on soft constraints (e.g., holding freight trains at loop lines) while keeping hard safety rules strictly enforced.

## Q7: How is the system secured?
**Short Answer:** Uses JWT HS256 authentication, Role-Based Access Control (RBAC), Passlib password hashing, and zero hardcoded secret exposure.

## Q8: Explain the project in 30 seconds.
**Short Answer:** RETRACK is an AI platform for Indian Railways that combines multi-department maintenance requests with live train timetables, uses Machine Learning to score asset risks, and uses Google OR-Tools CP-SAT to automatically schedule conflict-free, 5 km bundled maintenance blocks while preserving passenger train safety margins.
