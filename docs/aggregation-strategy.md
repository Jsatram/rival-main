# Aggregation Strategy (Epic 2 - Task 2.5)

**Purpose:** Define how Rival summarizes raw match stats into player-level aggregates. This is conceptual: no SQL, no materialized views, no implementation.

---

## Principles

1. **Aggregates are derived**
   - Aggregations can be recomputed.
   - Store raw facts first; aggregate later.

2. **Use rolling windows**
   - Players care about “recent form” and “baseline skill” separately.

3. **Cohort-aware views**
   - Provide splits by mode, agent, map, and role (role inferred from agent taxonomy).

---

## Standard Windows (v1)

- Last 10 matches
- Last 25 matches
- Last 100 matches
- Lifetime (all ingested)

---

## Aggregation Dimensions (v1)

### Primary splits
- Overall (all matches)
- By queue/mode (competitive, unrated, etc.)
- By agent
- By map (optional surface; useful later)

### Secondary splits (future)
- By side (attacker/defender) if modeled reliably
- By party size (solo/duo/5-stack) if available

---

## Aggregated Metrics (v1)

From `/docs/metrics-layer.md`:

- Matches played
- Rounds played
- K/D/A totals + per-match averages
- Total damage + per-match averages
- Win rate
- Objective rates (plants/defuses per match) if available
- Openings & trades (if round kill events are in scope)

---

## Display vs Storage Guidance

- Prefer storing aggregates as:
  - computed tables keyed by `(puuid, window, dimension)` OR
  - computed on read for early MVP
- Either way, aggregates must be re-computable.

---

## Consistency Rules

- A match belongs to exactly one bucket for each dimension (e.g., one map, one mode, one agent for the player).
- Rolling windows are based on match start timestamp ordering.

---

## Open Questions (Track for Later)

- When to materialize aggregates vs compute on read?
- Do we introduce “seasonal” windows once patch/act mapping is stable?

