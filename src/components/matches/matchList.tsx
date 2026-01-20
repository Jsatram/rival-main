import { MatchRow } from "./matchRow";

export type MatchListItem = {
  matchId: string | null;
  startedAt: string | null;
  queue: string | null;
  map: string | null;
  agent: string | null;
  result: "win" | "loss" | "draw" | null;
  stats: {
    kills: number | null;
    deaths: number | null;
    assists: number | null;
    acs: number | null;
  } | null;
  includedInSnapshot: boolean;
};

export function MatchList({
  puuid,
  matches,
}: {
  puuid: string;
  matches: MatchListItem[];
}) {
  return (
    <div className="space-y-2">
      {matches.map((m, idx) => (
        <MatchRow key={m.matchId ?? `row-${idx}`} puuid={puuid} match={m} />
      ))}
    </div>
  );
}
