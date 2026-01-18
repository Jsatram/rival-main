# Minimal DB Schema — Epic 1.5 (Postgres)

## Purpose

This schema supports:

- Persisting opted-in players (identity + opt-in state)
- Persisting a lightweight match index per player (analysis-ready summaries)

Non-goals:

- No full Riot match payload storage
- No background sync workers
- No admin tooling
- No complex normalization (keep it minimal and iteration-friendly)

---

## Table: opted_in_players

Stores one row per opted-in Riot identity (PUUID).

### Columns

- id: UUID PK
- puuid: TEXT unique (canonical identity)
- game_name: TEXT (last known)
- tag_line: TEXT (last known)
- declared_role: TEXT nullable (duelist/initiator/controller/sentinel/flex)
- is_opted_in: BOOLEAN (soft opt-out supported)
- opted_in_at: TIMESTAMPTZ nullable
- opted_out_at: TIMESTAMPTZ nullable
- created_at: TIMESTAMPTZ default now()
- updated_at: TIMESTAMPTZ default now()

### Constraints / Indexes

- UNIQUE(puuid)
- Optional: index on (game_name, tag_line) for lookups

---

## Table: match_index

Stores one row per (puuid, match_id) with minimal summary stats.
This enables re-running analysis-core from persisted data.

### Columns

- id: UUID PK
- puuid: TEXT (FK-ish to opted_in_players.puuid)
- match_id: TEXT (Riot match id)
- played_at: TIMESTAMPTZ
- queue: TEXT
- map: TEXT
- agent: TEXT

Lightweight stats summary (from fixture / match summary):

- kills: INT
- deaths: INT
- assists: INT
- acs: INT
- adr: INT
- hs_pct: REAL
- first_kills: INT
- first_deaths: INT
- plants: INT
- defuses: INT
- clutches_won: INT

Metadata:

- created_at: TIMESTAMPTZ default now()

### Constraints / Indexes

- UNIQUE(puuid, match_id) (idempotent upsert)
- Index on (puuid, played_at DESC) (fast “latest N matches” queries)

---

## Future (NOT in 1.5.1)

### player_profile_snapshots (Epic 1.5.5 optional)

Stores the computed PlayerProfilePayload JSON, last computed time, and window info.
This is optional and may be added later.

---

## Why we do NOT store full match payloads yet

Storing full payloads adds:

- schema churn
- storage costs
- ingestion complexity
- operational burden (sync/retry/backfill)

For Epic 1.5, we only need enough to:

- recompute insights deterministically
- validate end-to-end flow (persist -> analyze -> payload)
