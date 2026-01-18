import type { SignalSummary } from "../../contract/profile";
import type { FixtureMatch } from "../../fixtures/types";
import { avg, confidenceFromMatches, round1, scaleTo100 } from "./utils";

/**
 * Teamplay
 * Proxy using assists + objective involvement.
 */
export function computeTeamplay(matches: FixtureMatch[]): SignalSummary {
  const n = matches.length;

  const avgAssists = avg(matches.map((m) => m.stats.assists));
  const avgPlants = avg(matches.map((m) => m.stats.plants));
  const avgDefuses = avg(matches.map((m) => m.stats.defuses));

  const involvement = avgAssists + avgPlants + avgDefuses;

  // Heuristic range: 3..15 combined actions per match
  const score = scaleTo100(involvement, 3, 15);

  return {
    key: "teamplay",
    label: "Teamplay",
    score,
    polarity: "higherBetter",
    evidence: [
      `Avg assists: ${round1(avgAssists)}`,
      `Avg plants+defuses: ${round1(avgPlants + avgDefuses)}`,
    ],
    confidence: confidenceFromMatches(n),
  };
}
