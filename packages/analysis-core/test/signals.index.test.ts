import { describe, expect, it } from "vitest";
import { computeSignals } from "../src/compute/signals";
import type { FixtureMatch } from "../src/fixtures/types";

describe("signals index", () => {
  it("returns all 7 signal keys in stable order", () => {
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

    const signals = computeSignals(matches);
    expect(signals.map((s) => s.key)).toEqual([
      "combatImpact",
      "openingDuel",
      "objectivePlay",
      "clutch",
      "discipline",
      "utility",
      "teamplay",
    ]);
  });
});
