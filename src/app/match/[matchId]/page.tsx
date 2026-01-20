import Link from "next/link";

export default async function MatchDetailStubPage({
  params,
  searchParams,
}: {
  params: Promise<{ matchId: string }>;
  searchParams?: Promise<{ puuid?: string }>;
}) {
  const { matchId } = await params;
  const { puuid } = (await searchParams) ?? {};

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Match</h1>
          <p className="text-sm text-muted-foreground">Match ID: {matchId}</p>
        </div>

        {puuid ? (
          <Link
            href={`/player/${puuid}/matches`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Back to matches
          </Link>
        ) : (
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Home
          </Link>
        )}
      </header>

      <section className="rounded-xl border bg-card p-4">
        <div className="text-sm text-muted-foreground">
          Match details are not yet available. This route is reserved for Epic 5
          ingestion.
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        <section className="rounded-xl border bg-card p-4">
          <div className="text-sm font-medium">Overview</div>
          <div className="mt-2 text-sm text-muted-foreground">Placeholder</div>
        </section>

        <section className="rounded-xl border bg-card p-4">
          <div className="text-sm font-medium">Scoreboard</div>
          <div className="mt-2 text-sm text-muted-foreground">Placeholder</div>
        </section>

        <section className="rounded-xl border bg-card p-4 md:col-span-2">
          <div className="text-sm font-medium">Rounds</div>
          <div className="mt-2 text-sm text-muted-foreground">Placeholder</div>
        </section>
      </div>
    </div>
  );
}
