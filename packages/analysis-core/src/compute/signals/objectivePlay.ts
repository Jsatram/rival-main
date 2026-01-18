import type { SignalSummary } from "../../contract/profile";
import type { FixtureMatch } from "../../fixtures/types";
import { avg, confidenceFromMatches, round1, scaleTo100 } from "./utils";

/**
 * Objective Play
 * Plants + defuses per match.
 */
export function computeObjectivePlay(matches: FixtureMatch[]): SignalSummary {
  const n = matches.length;
  const avgPlants = avg(matches.map((m) => m.stats.plants));
  const avgDefuses = avg(matches.map((m) => m.stats.defuses));
  const involvement = avgPlants + avgDefuses;

  // Typical range: 0..3 objective actions per match (heuristic)
  const score = scaleTo100(involvement, 0, 3);

  return {
    key: "objectivePlay",
    label: "Objective Play",
    score,
    polarity: "higherBetter",
    evidence: [
      `Avg plants: ${round1(avgPlants)}`,
      `Avg defuses: ${round1(avgDefuses)}`,
    ],
    confidence: confidenceFromMatches(n),
  };
}
