import { describe, expect, it } from "vitest";
import { computeRoleFit } from "../src/compute/role/roleFit";
import type { FixtureMatch } from "../src/fixtures/types";

describe("role fit", () => {
  it("infers duelist from agent picks and scores mismatch", () => {
    const matches: FixtureMatch[] = Array.from({ length: 10 }).map((_, i) => ({
      matchId: `m${i}`,
      playedAt: "2025-01-01T00:00:00.000Z",
      queue: "competitive",
      map: "Ascent",
      agent: "Reyna",
      stats: {
        kills: 20,
        deaths: 15,
        assists: 2,
        acs: 250,
        adr: 150,
        hsPct: 25,
        firstKills: 4,
        firstDeaths: 3,
        plants: 0,
        defuses: 0,
        clutchesWon: 0,
      },
    }));

    const fit = computeRoleFit("sentinel", matches);

    expect(fit.expressedRole).toBe("duelist");
    expect(fit.declaredRole).toBe("sentinel");
    expect(fit.fitScore).toBeLessThan(85);
    expect(fit.reason.length).toBeGreaterThan(0);
  });

  it("returns flex when role is not dominant", () => {
    const agents = ["Reyna", "Omen", "Sova", "Killjoy"] as const;

    const matches: FixtureMatch[] = Array.from({ length: 20 }).map((_, i) => {
      const agent = agents[i % agents.length]!; // ✅ CHANGE: assert non-undefined
      return {
        matchId: `m${i}`,
        playedAt: "2025-01-01T00:00:00.000Z",
        queue: "competitive",
        map: "Ascent",
        agent, // ✅ CHANGE: use the non-undefined agent variable
        stats: {
          kills: 18,
          deaths: 16,
          assists: 4,
          acs: 220,
          adr: 140,
          hsPct: 22,
          firstKills: 2,
          firstDeaths: 2,
          plants: 1,
          defuses: 0,
          clutchesWon: 0,
        },
      };
    });

    const fit = computeRoleFit("flex", matches);

    expect(fit.expressedRole).toBe("flex");
    expect(fit.fitScore).toBeGreaterThanOrEqual(70);
  });
});
