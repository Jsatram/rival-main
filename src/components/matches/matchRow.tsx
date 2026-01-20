import Link from "next/link";
import type { MatchListItem } from "./matchList";

function fmtTime(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function resultLabel(result: MatchListItem["result"]) {
  if (result === "win") return "Win";
  if (result === "loss") return "Loss";
  if (result === "draw") return "Draw";
  return "—";
}

export function MatchRow({
  puuid,
  match,
}: {
  puuid: string;
  match: MatchListItem;
}) {
  const href = match.matchId ? `/match/${match.matchId}?puuid=${puuid}` : null;

  return (
    <div
      className={[
        "flex items-center justify-between gap-4 rounded-lg border p-3",
        match.includedInSnapshot ? "bg-muted/30" : "bg-card",
      ].join(" ")}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium truncate">
            {match.map ?? "—"} • {match.queue ?? "—"}
          </div>

          <div className="text-xs text-muted-foreground">
            {match.includedInSnapshot ? "Used in snapshot" : "Not in snapshot"}
          </div>
        </div>

        <div className="mt-1 text-xs text-muted-foreground">
          {fmtTime(match.startedAt)} • Agent: {match.agent ?? "—"}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm">{resultLabel(match.result)}</div>

        {match.stats ? (
          <div className="text-xs text-muted-foreground whitespace-nowrap">
            K/D/A {match.stats.kills ?? "—"}/{match.stats.deaths ?? "—"}/
            {match.stats.assists ?? "—"} • ACS {match.stats.acs ?? "—"}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground whitespace-nowrap">
            Stats —
          </div>
        )}

        {href ? (
          <Link
            href={href}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            View
          </Link>
        ) : (
          <span className="text-sm text-muted-foreground">View</span>
        )}
      </div>
    </div>
  );
}
