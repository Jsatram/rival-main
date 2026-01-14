# Unorthodox Playstyle Support (Epic 2 - Task 2.8)

**Purpose:** Ensure Rival supports non-meta but effective styles without punishing them for breaking "standard" role expectations.

---

## Principles

1. **Separate risk from failure**
   - High-risk behavior is not “bad” if it correlates with winning.

2. **Compare within cohorts**
   - Compare players to similar contexts:
     - same agent / role family
     - same mode
     - similar window sizes

3. **Avoid one-score tyranny**
   - Use multi-dimensional outputs with clear components.

---

## Design Rules (v1)

### A) Avoid harsh penalties for aggression on support roles
- Aggressive controller/sentinel styles should be labeled, not punished.

### B) Identify “High-Variance Success”
Tag players who show:
- higher volatility (kills/damage/openings fluctuate)
- but sustained positive outcomes (wins / consistent contribution)

### C) Use explainable labels
Examples:
- “High-Variance Playmaker”
- “Aggressive Initiator”
- “Risk-Forward Controller”

Not:
- “Bad smokes”
- “Wrong playstyle”

---

## Trust Requirement

Whenever Rival applies an unorthodox label, show:
- the behaviors it observed (components)
- the context window
- and avoid absolute claims.

---

## Open Questions (Track for Later)

- Best “win correlation” proxy once we have more features?
- When we add per-round data, do we label “late-round presence” vs “early deaths”?

