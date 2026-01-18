import type { SignalSummary } from "../../contract/profile";
import type { FixtureMatch } from "../../fixtures/types";
import { avg, confidenceFromMatches, round1, scaleTo100 } from "./utils";

/**
 * Combat Impact
 * Uses ACS as primary and ADR as support.
 * Produces a single 0..100 score with evidence from averages.
 */
export function computeCombatImpact(matches: FixtureMatch[]): SignalSummary {
  const n = matches.length;

  const avgAcs = avg(matches.map((m) => m.stats.acs));
  const avgAdr = avg(matches.map((m) => m.stats.adr));

  // Reasonable “typical” competitive-ish ranges (heuristic for now):
  // ACS: 150 (low) .. 350 (elite)
  // ADR: 110 (low) .. 190 (elite)
  const acsScore = scaleTo100(avgAcs, 150, 350);
  const adrScore = scaleTo100(avgAdr, 110, 190);

  // Weighted blend: ACS 70%, ADR 30%
  const score = Math.round(acsScore * 0.7 + adrScore * 0.3);

  return {
    key: "combatImpact",
    label: "Combat Impact",
    score,
    polarity: "higherBetter",
    evidence: [`Avg ACS: ${round1(avgAcs)}`, `Avg ADR: ${round1(avgAdr)}`],
    confidence: confidenceFromMatches(n),
  };
}
