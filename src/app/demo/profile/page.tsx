import Link from "next/link";
import { redirect } from "next/navigation";
import { clearDemoOptedIn, isDemoOptedIn } from "@/lib/demoMode";

export const dynamic = "force-dynamic";

type ArchetypeScore = {
  name: string;
  score: number; // 0..100
  note: string;
};

type Signal = {
  label: string;
  value: string;
  interpretation: string;
};

export default function DemoProfilePage() {
  const optedIn = isDemoOptedIn();
  if (!optedIn) redirect("/demo");

  async function optOutAction() {
    "use server";
    clearDemoOptedIn();
    redirect("/demo");
  }

  // Example / fixture profile content
  const player = {
    displayName: "DemoPlayer#NA1",
    role: "Controller",
    mainAgent: "Omen",
    playstyle:
      "Aggressive controller with high initiative and strong early-round impact.",
    lastUpdated: new Date().toLocaleString(),
  };

  const strengths: string[] = [
    "High first blood rate—consistently creates opening advantages",
    "Proactive smokes that enable fast hits and mid-round pivots",
    "Comfortable taking duels while still supporting team tempo",
    "Strong entry timing when the team commits",
  ];

  const weaknesses: string[] = [
    "Occasional over-extensions after opening picks",
    "Can sacrifice late-round positioning for early fights",
    "Smokes sometimes used early without enough information",
  ];

  const signals: Signal[] = [
    {
      label: "First Blood Rate",
      value: "High",
      interpretation:
        "Frequently secures the first kill, indicating strong aggression and duel confidence.",
    },
    {
      label: "Engagement Profile",
      value: "Aggressive",
      interpretation:
        "Prefers early initiative—often takes space before utility fully develops.",
    },
    {
      label: "Controller Utility Tempo",
      value: "Fast",
      interpretation:
        "Uses smokes early to force decisions and enable quick executes.",
    },
    {
      label: "Risk Tolerance",
      value: "Above Average",
      interpretation:
        "Willing to take fights that swing rounds, sometimes at the cost of consistency.",
    },
  ];

  const archetypes: ArchetypeScore[] = [
    {
      name: "Tempo Controller",
      score: 86,
      note: "Uses utility to accelerate rounds.",
    },
    {
      name: "Aggro Initiator",
      score: 78,
      note: "Creates first contact and pressure.",
    },
    {
      name: "Clutch Stabilizer",
      score: 52,
      note: "Average late-round conversion.",
    },
    {
      name: "Utility Anchor",
      score: 44,
      note: "Less focused on passive site holding.",
    },
  ];

  function barWidth(score: number) {
    const s = Number.isFinite(score) ? score : 0;
    return `${Math.max(0, Math.min(100, s))}%`;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Demo Profile</h1>
          <div className="text-sm text-muted-foreground">
            {player.displayName} • {player.role} • Main:{" "}
            <span className="font-medium text-foreground">
              {player.mainAgent}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Last updated: {player.lastUpdated}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/demo"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Demo Home
          </Link>

          <Link
            href="/demo/matches"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Matches
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

      <section className="rounded-xl border bg-card p-5 space-y-2">
        <div className="text-sm font-medium">Summary</div>
        <p className="text-sm text-muted-foreground">{player.playstyle}</p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border bg-card p-5">
          <div className="text-sm font-medium">Strengths</div>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
            {strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <div className="text-sm font-medium">Weaknesses</div>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
            {weaknesses.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-xl border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-medium">Archetype Scoring</div>
          <div className="text-xs text-muted-foreground">
            Example scoring (0–100)
          </div>
        </div>

        <div className="space-y-3">
          {archetypes.map((a) => (
            <div key={a.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">{a.name}</div>
                <div className="text-muted-foreground tabular-nums">
                  {a.score}
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-foreground"
                  style={{ width: barWidth(a.score) }}
                />
              </div>
              <div className="text-xs text-muted-foreground">{a.note}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5 space-y-3">
        <div className="text-sm font-medium">Signals</div>
        <div className="grid gap-3 md:grid-cols-2">
          {signals.map((s) => (
            <div key={s.label} className="rounded-lg border p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium">{s.label}</div>
                <div className="text-sm text-muted-foreground">{s.value}</div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {s.interpretation}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
