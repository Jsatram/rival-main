import type { SignalSummary } from "../../contract/profile";
import type { FixtureMatch } from "../../fixtures/types";
import { computeCombatImpact } from "./combatImpact";
import { computeOpeningDuel } from "./openingDuel";
import { computeClutch } from "./clutch";
import { computeObjectivePlay } from "./objectivePlay";
import { computeDiscipline } from "./discipline";
import { computeUtility } from "./utility";
import { computeTeamplay } from "./teamplay";

export function computeSignals(matches: FixtureMatch[]): SignalSummary[] {
  return [
    computeCombatImpact(matches),
    computeOpeningDuel(matches),
    computeObjectivePlay(matches),
    computeClutch(matches),
    computeDiscipline(matches),
    computeUtility(matches),
    computeTeamplay(matches),
  ];
}
