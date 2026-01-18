import type { SignalSummary } from "../../contract/profile";
import type { FixtureMatch } from "../../fixtures/types";
import { avg, confidenceFromMatches, round1, scaleTo100 } from "./utils";

/**
 * Utility
 * We don't have ability usage yet in fixtures.
 * Proxy: HS% lower + assists higher can suggest utility/teammate setup style.
 * This is explicitly a placeholder proxy until we have real utility stats.
 */
export function computeUtility(matches: FixtureMatch[]): SignalSummary {
  const n = matches.length;

  const avgHs = avg(matches.map((m) => m.stats.hsPct));
  const avgAssists = avg(matches.map((m) => m.stats.assists));

  // HS%: 10..40 typical, Assists: 2..10 typical
  const hsComponent = 100 - scaleTo100(avgHs, 10, 40); // lower HS% -> higher "utility proxy"
  const astComponent = scaleTo100(avgAssists, 2, 10);

  const score = Math.round(hsComponent * 0.4 + astComponent * 0.6);

  return {
    key: "utility",
    label: "Utility",
    score,
    polarity: "higherBetter",
    evidence: [
      `Avg assists: ${round1(avgAssists)}`,
      `Avg HS%: ${round1(avgHs)}`,
    ],
    confidence: confidenceFromMatches(n),
  };
}
