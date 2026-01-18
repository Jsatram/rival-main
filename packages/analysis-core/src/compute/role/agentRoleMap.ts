import type { Role } from "../../contract/profile";

/**
 * Minimal agent -> role mapping for role inference.
 * This is intentionally lightweight and can be expanded later.
 *
 * If an agent is unknown, we treat it as "flex".
 */
export const agentToRole: Record<string, Role> = {
  // Duelists
  Jett: "duelist",
  Reyna: "duelist",
  Raze: "duelist",
  Phoenix: "duelist",
  Yoru: "duelist",
  Neon: "duelist",
  Iso: "duelist",

  // Initiators
  Sova: "initiator",
  Skye: "initiator",
  Breach: "initiator",
  KAYO: "initiator",
  "KAY/O": "initiator",
  Fade: "initiator",
  Gekko: "initiator",

  // Controllers
  Omen: "controller",
  Brimstone: "controller",
  Viper: "controller",
  Astra: "controller",
  Harbor: "controller",
  Clove: "controller",

  // Sentinels
  Killjoy: "sentinel",
  Cypher: "sentinel",
  Sage: "sentinel",
  Chamber: "sentinel",
  Deadlock: "sentinel",
};

export function roleFromAgent(agentName: string): Role {
  return agentToRole[agentName] ?? "flex";
}
