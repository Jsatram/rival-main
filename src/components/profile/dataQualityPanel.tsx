type ConfidenceLevel = "low" | "medium" | "high" | string;

export type ProfileConfidence = {
  level: ConfidenceLevel;
  reason: string;
};

export type ProfileWindow = {
  label: string;
  matches: number;
};

function confidencePillClass(level: string) {
  const l = level.toLowerCase();
  if (l === "high") return "bg-green-500/15 text-green-300 border-green-500/25";
  if (l === "medium")
    return "bg-yellow-500/15 text-yellow-300 border-yellow-500/25";
  if (l === "low") return "bg-red-500/15 text-red-300 border-red-500/25";
  return "bg-muted text-muted-foreground border-border";
}

function ConfidencePill({ level }: { level: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${confidencePillClass(level)}`}
    >
      {level} confidence
    </span>
  );
}

export function DataQualityPanel({
  confidence,
  window,
  matchesAnalyzed,
  lastComputedAt,
}: {
  confidence: ProfileConfidence | null | undefined;
  window: ProfileWindow | null | undefined;
  matchesAnalyzed: number;
  lastComputedAt: string;
}) {
  const level = confidence?.level ?? "unknown";
  const reason = confidence?.reason ?? "No confidence note provided.";
  const windowLabel = window?.label ?? "unknown";
  const windowMatches = window?.matches ?? null;

  const computed = lastComputedAt
    ? new Date(lastComputedAt).toLocaleString()
    : "unknown";

  return (
    <section className="rounded-xl border p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Data Quality</h2>
          <p className="text-sm text-muted-foreground mt-1">
            How much data this profile is based on, and how confidently to
            interpret it.
          </p>
        </div>
        <ConfidencePill level={String(level)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4 space-y-2">
          <div className="text-sm text-muted-foreground">Confidence</div>
          <div className="text-2xl font-semibold tracking-wide">
            {String(level)}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {reason}
          </p>
        </div>

        <div className="rounded-lg border p-4 space-y-2">
          <div className="text-sm text-muted-foreground">Match window</div>
          <div className="text-2xl font-semibold tracking-wide">
            {windowLabel}
          </div>

          <div className="text-sm text-muted-foreground">
            {windowMatches !== null ? (
              <>
                Window size:{" "}
                <span className="font-medium text-foreground tabular-nums">
                  {windowMatches}
                </span>{" "}
                matches
              </>
            ) : (
              <>Window size: unknown</>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            Matches analyzed:{" "}
            <span className="font-medium text-foreground tabular-nums">
              {matchesAnalyzed}
            </span>
          </div>

          <div className="text-sm text-muted-foreground">
            Last computed:{" "}
            <span className="font-medium text-foreground">{computed}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 bg-muted/30 space-y-2">
        <div className="text-sm font-medium">How to read this</div>
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
          <li>
            This profile summarizes patterns in the current match window, not
            permanent skill.
          </li>
          <li>
            Lower confidence usually means fewer matches or weaker signals.
            Treat conclusions as tentative.
          </li>
          <li>
            Use the evidence bullets in each section to sanity-check the
            conclusions.
          </li>
        </ul>
      </div>
    </section>
  );
}
