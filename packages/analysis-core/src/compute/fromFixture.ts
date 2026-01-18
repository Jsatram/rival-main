import type { PlayerProfilePayload } from "../contract/profile";
import { loadMatchSummaryFixture } from "../fixtures/loadFixture";
import type { MatchSummaryFixture } from "../fixtures/types";
import { computeSignals } from "./signals";
import { computeRoleFit } from "./role/roleFit";

/**
 * Compute a PlayerProfilePayload from a match-summary fixture.
 * Deterministic by default (inject nowIso in tests).
 */
export function computeProfilePayloadFromFixture(
  fixture: MatchSummaryFixture,
  nowIso: string = new Date(0).toISOString(),
): PlayerProfilePayload {
  const matches = fixture.matches ?? [];
  const n = matches.length;

  // Task 4: signals are computed via the signals module (not inline)
  const signals = computeSignals(matches);

  // TEMP: still used for placeholder archetype/unorthodox until Task 5 refactor
  const avgAcs = avg(matches.map((m) => m.stats.acs));

  // Placeholder archetype/role/unorthodox until Task 5 implements real scoring.
  const archetypeScores = {
    primary: "flex" as const,
    secondary: "playmaker" as const,
    scores: {
      entry: 50,
      support: 50,
      anchor: 50,
      lurker: 50,
      playmaker: scaleTo100(avgAcs, 150, 350),
      igl: 50,
      flex: 55,
    },
  };

  const roleFit = computeRoleFit(fixture.player.declaredRole as any, matches);

  const unorthodox = {
    deviationScore: 70,
    efficiencyScore: scaleTo100(avgAcs, 150, 350),
    tag: "creative" as const,
    reason: `Declared ${fixture.player.declaredRole} but plays high-duel agents`,
  };

  const confidence = {
    level: n >= 20 ? "medium" : "low",
    reason:
      n >= 20
        ? `Based on ${n} matches.`
        : `Only ${n} matches; results may be noisy.`,
  } as const;

  return {
    signals,
    archetypeScores,
    roleFit,
    unorthodox,
    confidence,
    matchesAnalyzed: n,
    window: { matches: n, label: fixture.label ?? `fixture (${n} matches)` },
    lastComputedAt: nowIso,
  };
}

/**
 * Convenience: load fixture JSON by name and compute payload.
 */
export function computeProfilePayloadFromFixtureName(
  fixtureName: string,
  nowIso: string = new Date(0).toISOString(),
): PlayerProfilePayload {
  const fixture = loadMatchSummaryFixture(fixtureName);
  return computeProfilePayloadFromFixture(fixture, nowIso);
}

/* helpers (TEMP until Task 5 refactor) */

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function scaleTo100(value: number, min: number, max: number): number {
  if (max <= min) return 50;
  return clamp0to100(((value - min) / (max - min)) * 100);
}

function clamp0to100(n: number): number {
  if (Number.isNaN(n)) return 0;
  if (n < 0) return 0;
  if (n > 100) return 100;
  return Math.round(n);
}
