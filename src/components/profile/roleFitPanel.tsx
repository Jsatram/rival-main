type Role =
  | "duelist"
  | "initiator"
  | "controller"
  | "sentinel"
  | "flex"
  | string;

export type RoleFit = {
  declaredRole: Role;
  expressedRole: Role;
  fitScore: number; // 0..100
  reason: string;
};

function titleCase(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function clamp01to100(n: number) {
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
}

function getFitColor(score: number) {
  if (score >= 75) return "bg-green-500/70";
  if (score >= 40) return "bg-yellow-500/70";
  return "bg-red-500/70";
}

function ScorePill({ score }: { score: number }) {
  const safe = clamp01to100(score);
  return (
    <div className="flex items-baseline gap-2">
      <div className="text-3xl font-semibold tabular-nums">{safe}</div>
      <div className="text-sm text-muted-foreground">/ 100</div>
    </div>
  );
}

function Meter({ score }: { score: number }) {
  const safe = clamp01to100(score);
  const color = getFitColor(safe);
  return (
    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${safe}%` }} />
    </div>
  );
}

function RoleBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
      {label}
    </span>
  );
}

export function RoleFitPanel({
  roleFit,
}: {
  roleFit: RoleFit | null | undefined;
}) {
  if (!roleFit) {
    return (
      <section className="rounded-xl border p-5">
        <h2 className="text-lg font-semibold">Role Fit</h2>
        <p className="text-sm text-muted-foreground mt-1">
          No role fit data is available for this snapshot.
        </p>
      </section>
    );
  }

  const declared = roleFit.declaredRole ?? "unknown";
  const expressed = roleFit.expressedRole ?? "unknown";
  const score = roleFit.fitScore ?? 0;

  const aligned =
    String(declared).toLowerCase() === String(expressed).toLowerCase();

  return (
    <section className="rounded-xl border p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Role Fit</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Compares the role you declare with the role your recent agent
            choices suggest.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          <RoleBadge label={`Declared role: ${titleCase(String(declared))}`} />
        </div>
      </div>

      <div className="rounded-lg border p-4 bg-muted/30">
        <div className="text-sm text-muted-foreground">Plays most like</div>
        <div className="mt-1 text-2xl font-semibold tracking-wide">
          {titleCase(String(expressed))}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          Based on patterns in the current match window.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[220px_1fr] items-start">
        <div className="rounded-lg border p-4 space-y-2">
          <div className="text-sm text-muted-foreground">Fit score</div>
          <ScorePill score={score} />
          <div className="pt-1">
            <Meter score={score} />
          </div>
          <div className="text-xs text-muted-foreground">
            {aligned
              ? "Declared and expressed roles align."
              : "Declared and expressed roles differ."}
          </div>
        </div>

        <div className="rounded-lg border p-4 space-y-2">
          <div className="text-sm font-medium">Reason</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {roleFit.reason || "No reason provided."}
          </p>
          <div className="text-xs text-muted-foreground">
            Role fit is inferred from recent match patterns and may shift over
            time.
          </div>
        </div>
      </div>
    </section>
  );
}
