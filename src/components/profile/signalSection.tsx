import { SignalCard, SignalSummary } from "./signalCard";

export function SignalsSection({ signals }: { signals: SignalSummary[] }) {
  if (!signals || signals.length === 0) {
    return (
      <section className="rounded-xl border p-5">
        <h2 className="text-lg font-semibold">Signals</h2>
        <p className="text-sm text-muted-foreground mt-1">
          No signal data is available for this snapshot.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border p-5 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Signals</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Signals summarize specific tendencies with evidence from the current
          match window.
        </p>
      </div>

      {/* Contract order is already stable. Do not sort. */}
      <div className="grid gap-4 md:grid-cols-2">
        {signals.map((s) => (
          <SignalCard key={s.key} signal={s} />
        ))}
      </div>
    </section>
  );
}
