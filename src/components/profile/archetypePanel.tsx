type Archetype =
  | "entry"
  | "support"
  | "anchor"
  | "lurker"
  | "playmaker"
  | "igl"
  | "flex";

export type ArchetypeScores = {
  primary: Archetype;
  secondary?: Archetype;
  scores: Record<Archetype, number>;
};

function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function clamp01to100(n: number) {
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
}

function ArchetypeBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
      {label}
    </span>
  );
}

function getArchetypeFillClass(isPrimary: boolean, isSecondary: boolean) {
  if (isPrimary) return "bg-primary/70";
  if (isSecondary) return "bg-primary/40";
  return "bg-foreground/40";
}

function getRowAccentClass(isPrimary: boolean, isSecondary: boolean) {
  if (isPrimary) return "bg-primary/10 border-primary/30";
  if (isSecondary) return "bg-primary/5 border-primary/20";
  return "";
}

export function ArchetypePanel({
  archetypeScores,
}: {
  archetypeScores: ArchetypeScores;
}) {
  const primary = archetypeScores?.primary;
  const secondary = archetypeScores?.secondary;

  const entries = Object.entries(archetypeScores?.scores ?? {}) as [
    Archetype,
    number,
  ][];

  if (!primary || entries.length === 0) {
    return (
      <section className="rounded-xl border p-5">
        <h2 className="text-lg font-semibold">Archetypes</h2>
        <p className="text-sm text-muted-foreground mt-1">
          No archetype data is available for this snapshot.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Archetypes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            A snapshot of playstyle tendencies across common roles.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          <ArchetypeBadge label={`Primary: ${titleCase(primary)}`} />
          {secondary ? (
            <ArchetypeBadge label={`Secondary: ${titleCase(secondary)}`} />
          ) : null}
        </div>
      </div>

      <div className="grid gap-3">
        {entries.map(([key, score]) => {
          const safe = clamp01to100(score);
          const isPrimary = key === primary;
          const isSecondary = !!secondary && key === secondary;

          const fillClass = getArchetypeFillClass(isPrimary, isSecondary);
          const rowAccent = getRowAccentClass(isPrimary, isSecondary);

          return (
            <div key={key} className={`rounded-lg border p-3 ${rowAccent}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="font-medium">{titleCase(key)}</div>
                  {isPrimary ? (
                    <span className="text-xs text-muted-foreground">
                      (primary)
                    </span>
                  ) : isSecondary ? (
                    <span className="text-xs text-muted-foreground">
                      (secondary)
                    </span>
                  ) : null}
                </div>

                <div className="text-sm text-muted-foreground tabular-nums">
                  {safe}
                </div>
              </div>

              <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full ${fillClass}`}
                  style={{ width: `${safe}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-muted-foreground">
        These archetypes summarize patterns in the analyzed window, not fixed
        identity.
      </div>
    </section>
  );
}
