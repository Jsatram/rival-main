# Match Data Model (Epic 2 - Task 2.3)

**Purpose:** Define how Rival represents matches and per-player match stats conceptually, including keys, relationships, idempotency, and v1 round kill events.

This document is a contract. Epic 3 schema + ingestion must follow these rules unless this doc is updated.

---

## Principles

1. **Immutable match ingestion**
   - Once a match is ingested, treat it as immutable.
   - Do not overwrite match rows as a “refresh” strategy.
   - If Riot data changes or a bug is fixed, handle via versioning or derived recomputation, not mutating raw match facts.

2. **Idempotent ingestion**
   - Ingestion may run multiple times safely.
   - Unique keys must prevent duplicates.

3. **Raw vs Derived separation**
   - Raw match data: stored once per match.
   - Derived metrics: computed separately and can be regenerated.

4. **Scope alignment**
   - This model aligns to `/docs/ingestion-scope.md` for v1 ingestion fields.

---

## Entity Overview (Conceptual)

### 1) Match (match-level container)
Represents one Valorant match.

**Primary Key**
- `match_id` (Riot match identifier)

**Core Fields (v1)**
- `match_id`
- `started_at` (timestamp)
- `queue_type` / `mode`
- `map`
- `patch_id` (nullable; if not available, derived later)
- `ingestion_version` (e.g., "v1")
- `ingested_at` (timestamp)

**Notes**
- `match_id` is globally unique.
- Match-level fields should be minimal and stable.

---

### 2) Match Player (player-in-match record)
Represents a specific player’s participation in a match.

**Primary / Unique Key**
- Unique on `(match_id, puuid)`

**Core Fields (v1)**
- Identity:
  - `match_id`
  - `puuid`
  - `team_id` (or attacker/defender mapping as available)
  - `agent_id` (or agent name)
- Summary stats:
  - `rounds_played`
  - `kills`
  - `deaths`
  - `assists`
  - `acs` (if present)
  - `damage_total` (match total)
  - `plants` / `defuses` (if present)
- Outcome:
  - `did_win` (boolean)

**Notes**
- This is the primary source for profile stats and aggregations.
- Use `puuid` as canonical identity (not display name).

---

### 3) Match Round (optional container; v1 minimal)
Represents a single round within a match.

**Primary / Unique Key**
- Unique on `(match_id, round_number)`

**Core Fields (v1)**
- `match_id`
- `round_number`

**Notes**
- In v1, this exists mainly to anchor `Round Kill Events`.
- If you want to keep schema minimal in Epic 3, you can skip an explicit round table and store round number directly on kill events.
  - This doc models it conceptually either way.

---

### 4) Round Kill Event (v1 lightweight round detail)
Represents a kill event within a round.

**Primary / Unique Key (recommended)**
- Unique on `(match_id, round_number, event_index)`
  - `event_index` is the index after sorting by time (and stable tie-breaking)

**Core Fields (v1)**
- `match_id`
- `round_number`
- `time_since_round_start_ms`
- `killer_puuid`
- `victim_puuid`
- `assistant_puuids` (list/array or separate table later)

**Notes**
- This is the only v1 round-level detail included.
- Enables trade detection and opening duels without ingesting heavy per-round damage arrays.

---

## Relationships

- Match (1) → Match Player (many)
  - `Match.match_id` → `MatchPlayer.match_id`

- Match (1) → Round Kill Event (many)
  - `Match.match_id` → `RoundKillEvent.match_id`

- Match Player relates to Round Kill Event by matching `puuid` to killer/victim/assistants.
  - No hard FK required for killer/victim because those are also PUUIDs in the player list, but FK can be added if desired.

---

## Idempotency & Dedupe Rules (Hard Requirements)

1. **Match uniqueness**
   - `match_id` is unique.
   - Ingesting the same `match_id` twice must not create duplicates.

2. **MatchPlayer uniqueness**
   - `(match_id, puuid)` is unique.
   - Re-ingestion must upsert safely (or insert-ignore).

3. **Kill event uniqueness**
   - Define a deterministic uniqueness rule:
     - Sort by `time_since_round_start_ms`
     - Tie-break consistently (e.g., killer_puuid then victim_puuid)
     - Assign `event_index` based on that sorted order
   - Use `(match_id, round_number, event_index)` as unique key.

**Result:** safe reprocessing, safe backfills, no duplication.

---

## Handling Updates, Backfills, and Versioning

### Raw data policy
- Raw match data is treated as immutable once ingested.
- If ingestion scope changes (e.g., v2 adds per-round damage):
  - Increment `ingestion_version`
  - Backfill new tables/fields without rewriting v1 rows

### Derived data policy
- Derived metrics/signals are recomputed when:
  - ingestion_version changes
  - formulas change
  - bugs are fixed
- Derived tables should store:
  - `computed_version`
  - `computed_at`
  - references to match_id/puuid/window where applicable

---

## “Minimum viable” storage plan (v1)

For Epic 3, Rival must be able to store:

- Match
- Match Player
- Round Kill Events (optional but required if trades/opening duels are in v1 scope)

If round kill events are excluded from v1 in a future scope update:
- Trades/opening metrics must be deferred and not computed from guesses.

---

## What This Enables Immediately (v1)

- Match history (basic)
- Player profile summaries
- Agent/role splits
- Rolling window aggregates (10/25/100)
- Trade metrics (from kill events)
- Opening duel metrics (from first kill(s) per round)

---

## Open Questions (Track for Later)

- Should we store attacker/defender per round (side swaps) in v2?
- How do we represent remakes/forfeits consistently?
- Do we store assistants as array JSON or normalize into a join table in v1?
- Patch mapping strategy if patch id is not provided directly by match responses

