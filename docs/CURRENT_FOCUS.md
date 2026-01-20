# CURRENT_FOCUS — Rival

This document describes the current development focus and near-term direction of the Rival project.
It is intended to prevent scope drift and clarify what is actively being worked on.

---

## Current Status

- Epic 3 (Player Profile Experience) is **complete**
- Epic 4 (Match History & Match Detail) is **complete**
- Analysis Core is **alive, deterministic, and tested**
- Snapshot persistence is in place (Epic 1.5)
- UI renders real computed payloads (from fixtures)
- No Riot ingestion is active yet

The system is stable, layered, and ingestion-ready.

---

## Active Focus

### Epic 5 — Ingestion & Recompute Pipeline (Next)

The next focus is enabling **real Riot match ingestion** and automated snapshot refresh.

This includes:

- Riot API integration
- Match payload ingestion
- Background recompute jobs
- Snapshot refresh policies
- Rate-limit handling and failure recovery

Epic 4 UI and contracts must **not** be refactored during ingestion.

---

## Explicitly Out of Scope (Right Now)

- UI redesign
- New insight types
- Advanced match detail rendering
- Social or competitive features
- Insight refinement or threshold tuning

These are intentionally deferred.

---

## Guiding Rule

All ingestion work must:

- Respect existing UI contracts
- Preserve snapshot determinism
- Avoid recomputation in UI
- Fail gracefully under partial ingestion

Epic 4 structure is the contract ingestion must plug into — not rewrite.

---

## Definition of “Done” for Current Focus

Epic 5 will be considered complete when:

- Real Riot matches are ingested
- Player snapshots refresh automatically
- The existing UI updates without refactors
- Rate limits and failure cases are handled safely
