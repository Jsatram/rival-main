import type { Role } from "../../contract/profile";
import type { FixtureMatch } from "../../fixtures/types";
import { roleFromAgent } from "./agentRoleMap";

/**
 * Infer "expressed" role from the player’s agent usage.
 * Deterministic: same match list => same expressed role.
 *
 * Strategy:
 * - Count roles by agent played
 * - If top role is at least 30% of matches and not tied -> use it
 * - Otherwise "flex"
 */
export function inferExpressedRole(matches: FixtureMatch[]): Role {
  if (!matches.length) return "flex";

  const counts: Record<Role, number> = {
    duelist: 0,
    initiator: 0,
    controller: 0,
    sentinel: 0,
    flex: 0,
  };

  for (const m of matches) {
    const r = roleFromAgent(m.agent);
    counts[r] += 1;
  }

  const entries = Object.entries(counts) as Array<[Role, number]>;
  entries.sort((a, b) => b[1] - a[1]);

  const top = entries[0]; // ✅ CHANGE: avoid destructuring possibly-undefined
  const second = entries[1]; // ✅ CHANGE

  if (!top || !second) return "flex"; // ✅ CHANGE: satisfy TS (and safe anyway)

  const [topRole, topCount] = top; // ✅ CHANGE
  const [, secondCount] = second; // ✅ CHANGE

  const share = topCount / matches.length;

  // Must be meaningfully dominant and not tied
  if (topCount > secondCount && share >= 0.3) return topRole;

  return "flex";
}

/**
 * Useful for evidence/reason strings.
 */
export function roleDistribution(
  matches: FixtureMatch[],
): Record<Role, number> {
  const counts: Record<Role, number> = {
    duelist: 0,
    initiator: 0,
    controller: 0,
    sentinel: 0,
    flex: 0,
  };

  for (const m of matches) {
    const r = roleFromAgent(m.agent);
    counts[r] += 1;
  }

  return counts;
}
