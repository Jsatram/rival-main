import type { SignalSummary } from "../../contract/profile";
import type { FixtureMatch } from "../../fixtures/types";
import { avg, confidenceFromMatches, round1, scaleTo100 } from "./utils";

/**
 * Discipline
 * Proxy for "staying alive / not donating deaths".
 * Uses average deaths per match, inverted.
 */
export function computeDiscipline(matches: FixtureMatch[]): SignalSummary {
  const n = matches.length;
  const avgDeaths = avg(matches.map((m) => m.stats.deaths));

  // Typical deaths range: 10 (great) .. 22 (bad) per match
  // Invert by mapping higher deaths to lower score.
  const raw = scaleTo100(avgDeaths, 10, 22);
  const score = 100 - raw;

  return {
    key: "discipline",
    label: "Discipline",
    score,
    polarity: "higherBetter",
    evidence: [`Avg deaths: ${round1(avgDeaths)}`],
    confidence: confidenceFromMatches(n),
  };
}
