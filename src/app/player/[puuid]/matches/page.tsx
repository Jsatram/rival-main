import Link from "next/link";
import { EmptyMatchState } from "@/components/matches/emptyMatchState";
import { MatchList, type MatchListItem } from "@/components/matches/matchList";

async function getMatches(puuid: string): Promise<MatchListItem[]> {
  // Server component fetch (local dev). If you deploy later, we’ll swap this to dynamic host.
  const res = await fetch(
    `http://localhost:3000/api/matches/${puuid}?limit=20`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) return [];
  const json = await res.json();
  return (json?.matches ?? []) as MatchListItem[];
}

export default async function PlayerMatchesPage({
  params,
}: {
  params: Promise<{ puuid: string }>;
}) {
  const { puuid } = await params;

  // Epic 4.3: render real match list from read-only API
  const matches = await getMatches(puuid);
  const usedCount = matches.filter((m) => m.includedInSnapshot).length;

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Matches</h1>
          <p className="text-sm text-muted-foreground">
            Recent match history for this player.
          </p>
        </div>

        <Link
          href={`/player/${puuid}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Back to profile
        </Link>
      </header>

      <section className="rounded-xl border bg-card">
        <div className="text-sm text-muted-foreground">
          These <span className="font-medium text-foreground">{usedCount}</span>{" "}
          matches were used to compute your profile snapshot.
        </div>

        <div className="p-4">
          {matches.length === 0 ? (
            <EmptyMatchState />
          ) : (
            <MatchList puuid={puuid} matches={matches} />
          )}
        </div>
      </section>
    </div>
  );
}
