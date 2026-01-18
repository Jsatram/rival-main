import type { SignalSummary } from "../../contract/profile";
import type { FixtureMatch } from "../../fixtures/types";
import { avg, confidenceFromMatches, round1, scaleTo100 } from "./utils";

/**
 * Clutch
 * Uses average clutches won per match.
 */
export function computeClutch(matches: FixtureMatch[]): SignalSummary {
  const n = matches.length;
  const avgClutches = avg(matches.map((m) => m.stats.clutchesWon));

  // Typical range: 0..2 clutches won per match (heuristic)
  const score = scaleTo100(avgClutches, 0, 2);

  return {
    key: "clutch",
    label: "Clutch",
    score,
    polarity: "higherBetter",
    evidence: [`Avg clutches won: ${round1(avgClutches)}`],
    confidence: confidenceFromMatches(n),
  };
}
