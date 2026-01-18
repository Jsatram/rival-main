import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { SignalsSection } from "@/components/profile/signalSection";
import { ArchetypePanel } from "@/components/profile/archetypePanel";
import { RoleFitPanel } from "@/components/profile/roleFitPanel";
import { UnorthodoxPanel } from "@/components/profile/unorthodoxPanel";
import { DataQualityPanel } from "@/components/profile/dataQualityPanel";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { puuid: string };
};

function getBaseUrl() {
  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return "http://localhost:3000";
  return `${proto}://${host}`;
}

async function getProfileSnapshot(puuid: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/profile/${puuid}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok)
    throw new Error(`Failed to load profile snapshot (${res.status})`);
  return res.json();
}

function confidencePillClass(level: string) {
  const l = level.toLowerCase();
  if (l === "high") return "bg-green-500/15 text-green-300 border-green-500/25";
  if (l === "medium")
    return "bg-yellow-500/15 text-yellow-300 border-yellow-500/25";
  if (l === "low") return "bg-red-500/15 text-red-300 border-red-500/25";
  return "bg-muted text-muted-foreground border-border";
}

export default async function PlayerProfilePage({ params }: PageProps) {
  const puuid = params.puuid;
  const payload = await getProfileSnapshot(puuid);
  if (!payload) notFound();

  const confLevel = String(payload.confidence?.level ?? "unknown");
  const computed = payload.lastComputedAt
    ? new Date(payload.lastComputedAt).toLocaleString()
    : "unknown";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="rounded-xl border p-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Player Profile</div>
            <div className="text-xl font-semibold break-all">{puuid}</div>
          </div>

          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${confidencePillClass(
              confLevel,
            )}`}
          >
            {confLevel} confidence
          </span>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div>
            <span className="font-medium text-foreground tabular-nums">
              {payload.matchesAnalyzed}
            </span>{" "}
            matches analyzed
          </div>
          <div>
            window:{" "}
            <span className="font-medium text-foreground">
              {payload.window?.label ?? "unknown"}
            </span>{" "}
            ({payload.window?.matches ?? "?"})
          </div>
          <div>
            last computed:{" "}
            <span className="font-medium text-foreground">{computed}</span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {payload.confidence?.reason ?? ""}
        </div>
      </div>

      {/* Signals full width */}
      <SignalsSection signals={payload.signals} />

      {/* Deterministic 2-column layout */}
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        {/* Left: stacked */}
        <div className="space-y-6">
          <RoleFitPanel roleFit={payload.roleFit} />
          <UnorthodoxPanel unorthodox={payload.unorthodox} />
        </div>

        {/* Right: tall solo */}
        <div>
          <ArchetypePanel archetypeScores={payload.archetypeScores} />
        </div>
      </div>

      {/* Data Quality full width */}
      <DataQualityPanel
        confidence={payload.confidence}
        window={payload.window}
        matchesAnalyzed={payload.matchesAnalyzed}
        lastComputedAt={payload.lastComputedAt}
      />
    </div>
  );
}
