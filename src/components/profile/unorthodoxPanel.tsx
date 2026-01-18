export type Unorthodox = {
  tag: string;
  reason: string;
  deviationScore: number; // 0..100
  efficiencyScore: number; // 0..100
};

function clamp01to100(n: number) {
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  const safe = clamp01to100(value);

  return (
    <div className="rounded-lg border p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-sm font-medium tabular-nums">{safe}</div>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-foreground/60"
          style={{ width: `${safe}%` }}
        />
      </div>
      <div className="text-xs text-muted-foreground">
        Scaled 0–100 within the current analysis model.
      </div>
    </div>
  );
}

function TagPill({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
      {text}
    </span>
  );
}

export function UnorthodoxPanel({
  unorthodox,
}: {
  unorthodox: Unorthodox | null | undefined;
}) {
  if (!unorthodox) {
    return (
      <section className="rounded-xl border p-5">
        <h2 className="text-lg font-semibold">Unorthodox</h2>
        <p className="text-sm text-muted-foreground mt-1">
          No unorthodox playstyle data is available for this snapshot.
        </p>
      </section>
    );
  }

  const tag = unorthodox.tag || "unclassified";
  const reason = unorthodox.reason || "No reason provided.";

  return (
    <section className="rounded-xl border p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Unorthodox</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Highlights when your patterns differ from typical role expectations.
          </p>
        </div>

        <div className="flex justify-end">
          <TagPill text={`Tag: ${tag}`} />
        </div>
      </div>

      <div className="rounded-lg border p-4 bg-muted/30">
        <div className="text-sm text-muted-foreground">Summary</div>
        <div className="mt-1 text-base text-foreground">{reason}</div>
        <div className="mt-2 text-xs text-muted-foreground">
          This is descriptive, not a judgment. It can change as your match
          window updates.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ScoreRow label="Deviation score" value={unorthodox.deviationScore} />
        <ScoreRow label="Efficiency score" value={unorthodox.efficiencyScore} />
      </div>

      <div className="text-xs text-muted-foreground">
        Use this section to understand “how” you’re different, then verify it
        against the evidence in other panels.
      </div>
    </section>
  );
}
