import type { SignalSummary } from "../../contract/profile";
import type { FixtureMatch } from "../../fixtures/types";
import { avg, confidenceFromMatches, round1, scaleTo100 } from "./utils";

/**
 * Opening Duel
 * Measures opening impact: FirstKills vs FirstDeaths.
 */
export function computeOpeningDuel(matches: FixtureMatch[]): SignalSummary {
  const n = matches.length;

  const avgFK = avg(matches.map((m) => m.stats.firstKills));
  const avgFD = avg(matches.map((m) => m.stats.firstDeaths));
  const net = avgFK - avgFD;

  // Typical-ish net range: -3 (bad) .. +6 (great)
  const score = scaleTo100(net, -3, 6);

  return {
    key: "openingDuel",
    label: "Opening Duel",
    score,
    polarity: "higherBetter",
    evidence: [
      `Avg FK: ${round1(avgFK)}`,
      `Avg FD: ${round1(avgFD)}`,
      `Net: ${round1(net)}`,
    ],
    confidence: confidenceFromMatches(n),
  };
}
