import Link from "next/link";
import { redirect } from "next/navigation";
import { clearDemoOptedIn, isDemoOptedIn } from "@/lib/demoMode";

export const dynamic = "force-dynamic";

type DemoMatch = {
  matchId: string;
  startedAt: string; // ISO
  queue: string;
  map: string;
  agent: string;
  result: "win" | "loss";
  stats: {
    kills: number;
    deaths: number;
    assists: number;
    acs: number;
  };
  includedInSnapshot: boolean;
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export default function DemoMatchesPage() {
  const optedIn = isDemoOptedIn();
  if (!optedIn) redirect("/demo");

  async function optOutAction() {
    "use server";
    clearDemoOptedIn();
    redirect("/demo");
  }

  // Example-only matches (aligned to demo profile story)
  const matches: DemoMatch[] = [
    {
      matchId: "demo-match-008",
      startedAt: "2026-01-17T03:12:00.000Z",
      queue: "competitive",
      map: "Ascent",
      agent: "Omen",
      result: "win",
      stats: { kills: 24, deaths: 15, assists: 7, acs: 286 },
      includedInSnapshot: true,
    },
    {
      matchId: "demo-match-007",
      startedAt: "2026-01-16T02:41:00.000Z",
      queue: "competitive",
      map: "Bind",
      agent: "Omen",
      result: "win",
      stats: { kills: 21, deaths: 14, assists: 6, acs: 271 },
      includedInSnapshot: true,
    },
    {
      matchId: "demo-match-006",
      startedAt: "2026-01-15T04:08:00.000Z",
      queue: "competitive",
      map: "Lotus",
      agent: "Omen",
      result: "loss",
      stats: { kills: 19, deaths: 18, assists: 5, acs: 239 },
      includedInSnapshot: true,
    },
    {
      matchId: "demo-match-005",
      startedAt: "2026-01-14T05:22:00.000Z",
      queue: "competitive",
      map: "Split",
      agent: "Omen",
      result: "win",
      stats: { kills: 26, deaths: 17, assists: 4, acs: 298 },
      includedInSnapshot: true,
    },
    {
      matchId: "demo-match-004",
      startedAt: "2026-01-13T02:09:00.000Z",
      queue: "competitive",
      map: "Haven",
      agent: "Omen",
      result: "loss",
      stats: { kills: 20, deaths: 19, assists: 6, acs: 244 },
      includedInSnapshot: false,
    },
    {
      matchId: "demo-match-003",
      startedAt: "2026-01-12T03:55:00.000Z",
      queue: "competitive",
      map: "Ascent",
      agent: "Omen",
      result: "win",
      stats: { kills: 23, deaths: 16, assists: 8, acs: 279 },
      includedInSnapshot: false,
    },
  ];

  const usedCount = matches.filter((m) => m.includedInSnapshot).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Demo Matches</h1>
          <p className="text-sm text-muted-foreground">
            Example match history used to illustrate Rival’s UX.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/demo/profile"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Back to demo profile
          </Link>

          <form action={optOutAction}>
            <button
              type="submit"
              className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Opt out
            </button>
          </form>
        </div>
      </header>

      <section className="rounded-xl border bg-card">
        <div className="border-b p-4">
          <div className="text-sm text-muted-foreground">
            These{" "}
            <span className="font-medium text-foreground">{usedCount}</span>{" "}
            matches were used to compute the demo profile snapshot.
          </div>
        </div>

        <div className="p-4 space-y-2">
          {matches.map((m) => (
            <div
              key={m.matchId}
              className={[
                "flex items-center justify-between gap-4 rounded-lg border p-3",
                m.includedInSnapshot ? "bg-muted/30" : "bg-card",
              ].join(" ")}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium truncate">
                    {m.map} • {m.queue}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {m.includedInSnapshot
                      ? "Used in snapshot"
                      : "Not in snapshot"}
                  </div>
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  {fmtTime(m.startedAt)} • Agent: {m.agent}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm">
                  {m.result === "win" ? "Win" : "Loss"}
                </div>

                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  K/D/A {m.stats.kills}/{m.stats.deaths}/{m.stats.assists} • ACS{" "}
                  {m.stats.acs}
                </div>

                {/* <Link
                  href={`/match/${m.matchId}?puuid=demo`}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  View
                </Link> */}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <div className="text-sm font-medium">Note</div>
        <p className="mt-2 text-sm text-muted-foreground">
          This page uses example-only data and does not call Riot APIs. Match
          detail pages are stubbed in this demo.
        </p>
      </section>
    </div>
  );
}
