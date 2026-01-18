import type { RoleFit } from "../../contract/profile";
import type { FixtureMatch } from "../../fixtures/types";
import type { Role } from "../../contract/profile";
import { inferExpressedRole, roleDistribution } from "./inferExpressedRole";

/**
 * Compute role fit between declared role and expressed role.
 * Output is UI-ready: fitScore 0..100 + reason.
 */
export function computeRoleFit(
  declaredRole: Role,
  matches: FixtureMatch[],
): RoleFit {
  const expressedRole = inferExpressedRole(matches);
  const dist = roleDistribution(matches);

  const total = Math.max(matches.length, 1);
  const expressedCount = dist[expressedRole] ?? 0;
  const expressedPct = Math.round((expressedCount / total) * 100);

  // Scoring heuristic (deterministic):
  // - Exact match => strong fit
  // - One side is flex => moderate fit
  // - Mismatch => lower fit
  let fitScore = 45;

  if (declaredRole === expressedRole) fitScore = 85;
  else if (declaredRole === "flex" || expressedRole === "flex") fitScore = 70;

  const reason =
    declaredRole === expressedRole
      ? `Declared and expressed role align (${expressedRole}).`
      : expressedRole === "flex"
        ? `No single role dominates agent picks; expressed role is flex.`
        : `Declared ${declaredRole}, but agent picks suggest ${expressedRole} (~${expressedPct}% of matches).`;

  return {
    declaredRole,
    expressedRole,
    fitScore,
    reason,
  };
}
