import { insertMatchIdsIdempotent, countMatches } from "@/lib/matches";

/**
 * Contract test for Epic 2 Match Model idempotency:
 * - match_id is unique (PK)
 * - inserting same match_id twice does not duplicate
 */
export async function runMatchInsertTest() {
  const first = await insertMatchIdsIdempotent({
    matchIds: ["match-1", "match-2", "match-3"],
  });

  const second = await insertMatchIdsIdempotent({
    matchIds: ["match-2", "match-3", "match-4"],
  });

  const total = await countMatches();

  return { first, second, total };
}
