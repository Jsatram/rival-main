import { describe, expect, it } from "vitest";
import type { PlayerProfilePayload } from "../src/contract/profile";

describe("Epic 2 -> Epic 3 contract", () => {
  it("PlayerProfilePayload can be constructed with required fields", () => {
    const payload: PlayerProfilePayload = {
      signals: [
        {
          key: "combatImpact",
          label: "Combat Impact",
          score: 50,
          polarity: "higherBetter",
          evidence: ["Fixture placeholder evidence"],
          confidence: "low",
        },
      ],
      archetypeScores: {
        primary: "flex",
        secondary: "support",
        scores: {
          entry: 50,
          support: 55,
          anchor: 45,
          lurker: 50,
          playmaker: 50,
          igl: 50,
          flex: 60,
        },
      },
      roleFit: {
        declaredRole: "flex",
        expressedRole: "flex",
        fitScore: 80,
        reason: "Fixture placeholder",
      },
      unorthodox: {
        deviationScore: 40,
        efficiencyScore: 60,
        tag: "creative",
        reason: "Fixture placeholder",
      },
      confidence: {
        level: "low",
        reason: "Not enough matches yet (fixture placeholder)",
      },
      matchesAnalyzed: 20,
      window: {
        matches: 20,
        label: "last 20 matches (fixture)",
      },
      lastComputedAt: new Date(0).toISOString(),
    };

    expect(payload.signals.length).toBeGreaterThan(0);
    expect(payload.matchesAnalyzed).toBe(payload.window.matches);
    expect(payload.lastComputedAt).toContain("1970");
  });
});
