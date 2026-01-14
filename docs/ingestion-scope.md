# Ingestion Scope (Epic 2 - Task 2.1)

**Purpose:** Define exactly what data Rival is permitted to ingest for opted-in users and explicitly forbid all other data collection.

This document defines the **maximum allowed data surface**.

---

## Scope Versioning

- **Ingestion Version:** `v1`
- Any expansion REQUIRES a new ingestion version.

---

## Core Principles

1. **Opt-in required**
2. **Matches are immutable**
3. **Raw data is stored once**
4. **Derived data is versioned**
5. **Scope creep is forbidden without version bump**

---

## In Scope (v1)

### A) Player Identity (Opted-in only)

- Riot PUUID
- Region
- Display name (UX only)
- Opt-in timestamps
- Last sync timestamp

---

### B) Match Index

- Match ID
- Match start timestamp
- Queue/mode
- Map
- Match outcome (team-level)

---

### C) Player-in-Match Summary Stats

- Agent
- Team
- Rounds played
- K / D / A
- ACS (if provided)
- Total damage (match total)
- Plants / defuses (if provided)

---

### D) Round Kill Events (Strictly Limited)

**This is the ONLY round-level data allowed in v1.**

- Round number
- Kill timestamp (ms since round start)
- Killer PUUID
- Victim PUUID
- Assist PUUIDs (if provided)

> **No other round-level data may be ingested without a new ingestion version.**

---

## Explicitly Out of Scope (v1)

- Per-round damage arrays
- Position / heatmap data
- Full event timelines
- Utility timing or usage events
- Per-round economy snapshots
- Riot MVP/SVP treated as truth

---

## Compliance Guardrails

- Opted-out users MUST NOT be synced.
- Opted-out users MUST NOT be backfilled.
- Opted-out users MUST NOT appear in internal analytics.

---

## What This Enables

- Match history
- Trades
- Openings
- Explainable impact components

---

## Deferred (Future Versions)

- DPR (requires per-round damage)
- Clutch modeling
- Heatmaps
- Advanced utility analysis
