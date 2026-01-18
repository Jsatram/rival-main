import { describe, expect, it } from "vitest";
import { computeCombatImpact } from "../src/compute/signals/combatImpact";
import type { FixtureMatch } from "../src/fixtures/types";

describe("signal: Combat Impact", () => {
  it("computes a stable score and evidence", () => {
    const matches: FixtureMatch[] = [
      {
        matchId: "m1",
        playedAt: "2025-01-01T00:00:00.000Z",
        queue: "competitive",
        map: "Ascent",
        agent: "Jett",
        stats: {
          kills: 20,
          deaths: 15,
          assists: 5,
          acs: 250,
          adr: 150,
          hsPct: 30,
          firstKills: 4,
          firstDeaths: 3,
          plants: 1,
          defuses: 0,
          clutchesWon: 0,
        },
      },
    ];

    const s = computeCombatImpact(matches);

    expect(s.key).toBe("combatImpact");
    expect(s.score).toBeGreaterThanOrEqual(0);
    expect(s.score).toBeLessThanOrEqual(100);
    expect(s.evidence.length).toBeGreaterThan(0);
  });
});
