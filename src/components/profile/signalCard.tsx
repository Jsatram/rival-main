type SignalConfidence = "low" | "medium" | "high";

export type SignalSummary = {
  key: string;
  label: string;
  score: number; // 0..100
  evidence: string[];
  confidence: SignalConfidence;
  polarity?: "higherBetter" | "lowerBetter";
};

function clamp01to100(n: number) {
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
}

function getScoreColor(score: number) {
  if (score >= 75) return "bg-green-500/70";
  if (score >= 40) return "bg-yellow-500/70";
  return "bg-red-500/70";
}

function confidencePillClass(level: SignalConfidence) {
  if (level === "high")
    return "bg-green-500/15 text-green-300 border-green-500/25";
  if (level === "medium")
    return "bg-yellow-500/15 text-yellow-300 border-yellow-500/25";
  return "bg-red-500/15 text-red-300 border-red-500/25";
}

function ConfidenceBadge({ level }: { level: SignalConfidence }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${confidencePillClass(level)}`}
    >
      {level} confidence
    </span>
  );
}

export function SignalCard({ signal }: { signal: SignalSummary }) {
  const safeScore = clamp01to100(signal.score);
  const barColor = getScoreColor(safeScore);

  return (
    <div className="rounded-xl border p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          {/* <div className="text-sm text-muted-foreground">Signal</div> */}
          <div className="text-lg font-semibold">{signal.label}</div>
        </div>
        <ConfidenceBadge level={signal.confidence} />
      </div>

      <div className="flex items-end justify-between gap-6">
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-semibold tabular-nums">{safeScore}</div>
          <div className="text-sm text-muted-foreground">/ 100</div>
        </div>

        <div className="flex-1">
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full ${barColor}`}
              style={{ width: `${safeScore}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Based on match evidence from the current window.
          </div>
        </div>
      </div>

      {signal.evidence?.length ? (
        <div className="pt-2">
          <div className="text-sm font-medium">Evidence</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc pl-5">
            {signal.evidence.map((item, i) => (
              <li key={`${signal.key}-evidence-${i}`}>{item}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="pt-2 text-sm text-muted-foreground">
          No evidence notes available for this signal.
        </div>
      )}
    </div>
  );
}
