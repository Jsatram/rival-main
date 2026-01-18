import { describe, expect, it } from "vitest";
import { loadMatchSummaryFixture } from "../src/fixtures/loadFixture";
import { computeProfilePayloadFromFixtureName } from "../src/compute/fromFixture";

describe("match-summary fixtures", () => {
  it("loads unorthodox fixture", () => {
    const fx = loadMatchSummaryFixture("unorthodox");

    expect(fx.version).toBeTypeOf("number");
    expect(fx.label).toBeTruthy();
    expect(fx.player.puuid).toBeTruthy();
    expect(Array.isArray(fx.matches)).toBe(true);
    expect(fx.matches.length).toBeGreaterThan(0);
  });

  it("computes deterministic payload from fixture", () => {
    const payload = computeProfilePayloadFromFixtureName(
      "unorthodox",
      "1970-01-01T00:00:00.000Z",
    );

    expect(payload.matchesAnalyzed).toBeGreaterThan(0);
    expect(payload.window.matches).toBe(payload.matchesAnalyzed);
    expect(payload.lastComputedAt).toBe("1970-01-01T00:00:00.000Z");

    // Task 4: we expect all 7 signal keys to be computed (no padding reliance)
    expect(payload.signals.length).toBe(7);

    const keys = payload.signals.map((s) => s.key);
    expect(new Set(keys).size).toBe(7);
    expect(keys).toEqual([
      "combatImpact",
      "openingDuel",
      "objectivePlay",
      "clutch",
      "discipline",
      "utility",
      "teamplay",
    ]);

    // Sanity: each signal should have evidence and a bounded score
    for (const s of payload.signals) {
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
      expect(Array.isArray(s.evidence)).toBe(true);
      expect(s.evidence.length).toBeGreaterThan(0);
    }
  });
});
