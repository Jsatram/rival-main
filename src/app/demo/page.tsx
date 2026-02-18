import Link from "next/link";
import { isDemoOptedIn } from "@/lib/demoMode";

export const dynamic = "force-dynamic";

export default function DemoLandingPage() {
  const optedIn = isDemoOptedIn();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Rival Demo</h1>
        <p className="text-muted-foreground">
          This is a public, no-login demo that shows the intended end-user
          experience using example data. No Riot account is required.
        </p>
      </header>

      <section className="rounded-xl border bg-card p-5 space-y-3">
        <div className="text-sm font-medium">What you’ll see</div>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>A simulated opt-in flow</li>
          <li>A player profile with insights (example data)</li>
          <li>Clear labeling that this is a demo</li>
          <li>An opt-out action that removes demo access</li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        {!optedIn ? (
          <Link
            href="/demo/opt-in"
            className="inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Start Demo
          </Link>
        ) : (
          <Link
            href="/demo/profile"
            className="inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Continue Demo
          </Link>
        )}

        <Link
          href="/"
          className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Back to Rival
        </Link>
      </div>

      <section className="rounded-xl border bg-card p-5">
        <div className="text-sm font-medium">Riot review note</div>
        <p className="mt-2 text-sm text-muted-foreground">
          This flow is intentionally frictionless: no accounts, no downloads, no
          private access. Everything in this demo is publicly viewable and
          clearly marked as example data.
        </p>
      </section>
    </div>
  );
}
