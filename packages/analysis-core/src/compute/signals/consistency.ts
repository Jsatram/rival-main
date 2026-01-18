import type { SignalSummary } from "../../contract/profile";
import type { FixtureMatch } from "../../fixtures/types";
import {
  confidenceFromMatches,
  round1,
  scaleTo100,
  stdDev,
  avg,
} from "./utils";

/**
 * Consistency
 * Lower ACS variance -> higher consistency score.
 */
export function computeConsistency(matches: FixtureMatch[]): SignalSummary {
  const n = matches.length;
  const acs = matches.map((m) => m.stats.acs);
  const mAcs = avg(acs);
  const sd = stdDev(acs);

  // Typical SD range: 20 (very consistent) .. 90 (very swingy)
  const swing = scaleTo100(sd, 20, 90);
  const score = 100 - swing;

  return {
    key: "teamplay", // NOTE: keep key stable; we'll treat this as "Consistency" but contract doesn't have a "consistency" key.
    label: "Consistency",
    score,
    polarity: "higherBetter",
    evidence: [
      `Avg ACS: ${round1(mAcs)}`,
      `ACS swing (std dev): ${round1(sd)}`,
    ],
    confidence: confidenceFromMatches(n),
  };
}
