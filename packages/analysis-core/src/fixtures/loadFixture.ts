import fs from "node:fs";
import path from "node:path";
import type { MatchSummaryFixture } from "./types";

/**
 * Loads a fixture JSON by name from:
 *   packages/analysis-core/fixtures/<name>.json
 *
 * This uses a path relative to this file so it works regardless of cwd.
 */
export function loadMatchSummaryFixture(name: string): MatchSummaryFixture {
  const file = path.resolve(__dirname, "data", `${name}.json`);

  const raw = fs.readFileSync(file, "utf-8");
  const parsed = JSON.parse(raw) as MatchSummaryFixture;

  if (!parsed || typeof parsed !== "object") {
    throw new Error(`Fixture "${name}" is not a JSON object`);
  }
  if (typeof parsed.version !== "number") {
    throw new Error(`Fixture "${name}" missing "version"`);
  }
  if (!parsed.player?.puuid) {
    throw new Error(`Fixture "${name}" missing "player.puuid"`);
  }
  if (!Array.isArray(parsed.matches)) {
    throw new Error(`Fixture "${name}" missing "matches" array`);
  }

  return parsed;
}
