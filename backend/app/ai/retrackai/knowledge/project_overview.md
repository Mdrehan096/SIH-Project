# Project Overview — RETRACK: RailSync-AI

## Basic Information
- **Project Name:** RETRACK – RailSync-AI
- **SIH 2026 Problem Statement ID:** 26027
- **Problem Statement Title:** AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways
- **Target Division:** Northern Railway (NR) — Delhi Division (NDLS - AGC, NDLS - GZB, NDLS - TKD, NDLS - NZM corridors)

## Executive Summary
RETRACK – RailSync-AI is an enterprise-grade AI decision-support platform designed for Indian Railways. It integrates multi-departmental maintenance requirements from legacy systems (**TMS** for Civil Track, **TDMS** for Track Defects, and **SMMS** for Electrical Traction & Signal/Telecom), cross-references live train timetables from **COA (Control Office Application)**, and uses **Google OR-Tools CP-SAT Mixed-Integer Linear Programming (MILP)** alongside **Scikit-Learn Machine Learning** to automatically schedule joint, conflict-free maintenance block possessions.

## Target User Roles
1. **Section Controller (Operations Control):** Reviews recommended block possession schedules, evaluates custom time slots, approves blocks, and generates Digital Private Numbers (PN).
2. **Station Master:** Receives Digital PN codes, authenticates authorization via 2-factor handshake, locks signal interlocks, and issues line possession to field crews.
3. **Track / Maintenance Engineer (Civil, OHE, S&T):** Submits maintenance requests, inspects AI asset risk scores, and monitors work completion status (`PENDING` -> `IN_PROGRESS` -> `COMPLETED`).
4. **System Administrator:** Oversees Role-Based Access Control (RBAC), division analytics, governance, and audit compliance logging.

## Core Objectives
- Reduce corridor downtime by up to **40%** through 5 km spatial and temporal maintenance task bundling.
- Eliminate train-operation conflicts by maintaining a mandatory **+15 minute safety buffer** around express trains (Vande Bharat, Rajdhani, Shatabdi).
- Transition Indian Railways from manual, fragmented paper-based block planning to an automated, data-driven AI decision-support pipeline.
