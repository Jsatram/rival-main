# Signal Categories (Epic 2 - Task 2.6)

**Purpose:** Define the behavioral categories Rival wants to measure. No formulas, no weights, no scoring.

Signals are *conceptual buckets* that later become derived metrics.

---

## Principles

1. **Signals are descriptive**
   - They describe playstyle and tendencies, not “good/bad.”

2. **Signals are explainable**
   - Each signal must map to human-understandable inputs.

3. **Role-aware interpretation**
   - Same raw behavior means different things on different roles/agents.

---

## v1 Signal Categories

### 1) Aggression / Initiative
High-level indicators:
- Opening duel involvement (first kills + first deaths)
- First contact tendency (later)
- Trade-against frequency (entry-style vs safe-style)

### 2) Impact / Round Influence
High-level indicators:
- Damage contribution
- High-leverage kills (later)
- Objective involvement (plants/defuses)

### 3) Discipline / Survivability
High-level indicators:
- Deaths per match / per round
- Untraded deaths (team support context)
- Late-round presence (later)

### 4) Teamplay / Support
High-level indicators:
- Assists (summary)
- Trades (traded deaths, trades secured)
- Objective support

### 5) Consistency / Volatility
High-level indicators:
- Variance across matches (kills/damage/impact components)
- “High-variance success” flagging (see 2.8)

---

## Explicit Non-Signals (v1)

- “Aim skill” claims
- Heatmap/positioning intelligence
- Utility timing mastery (unless we ingest utility events later)

---

## Open Questions (Track for Later)

- Which signals should be agent-specific vs role-generic?
- Which signals need per-round damage/event streams?

