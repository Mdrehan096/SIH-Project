# RETRACK Viva & Hackathon Presentation Guide

## Common Viva & Exam Questions

### Q1: What is RETRACK?
- **Answer**: RETRACK – RailSync-AI is an AI-powered railway maintenance planning, operations coordination, and decision-support system built for Indian Railways (SIH 2026 Problem Statement 26027).
- **Key Point**: Unifies multi-department maintenance feeds (TMS, TDMS, SMMS, COA) and uses CP-SAT optimization to schedule conflict-free bundled maintenance blocks.

### Q2: Why use Google OR-Tools CP-SAT?
- **Answer**: CP-SAT (Constraint Programming - Satisfiability) is a state-of-the-art Mixed-Integer Linear Programming solver. It solves complex multi-constraint scheduling problems in seconds while enforcing mandatory train safety buffers.
- **Key Point**: Fast, exact constraint optimization.

### Q3: How is train safety guaranteed?
- **Answer**: RETRACK enforces a mandatory **+15 minute safety buffer margin** before and after express train passages (Vande Bharat, Rajdhani). If a block window overlaps with a train schedule, CP-SAT automatically shifts or rejects the block.
- **Key Point**: Zero train-block conflict guarantee.

### Q4: What is Digital Private Number (PN)?
- **Answer**: A cryptographically generated 2-factor verification code exchange between the Section Controller and Station Master to grant and clear block possessions securely.
- **Key Point**: Eliminates verbal communication errors on track safety.
