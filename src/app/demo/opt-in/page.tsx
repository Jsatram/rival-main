import { redirect } from "next/navigation";
import { isDemoOptedIn, setDemoOptedIn } from "@/lib/demoMode";

export const dynamic = "force-dynamic";

export default function DemoOptInPage() {
  const optedIn = isDemoOptedIn();
  if (optedIn) {
    redirect("/demo/profile");
  }

  async function continueAction() {
    "use server";
    setDemoOptedIn();
    redirect("/demo/profile");
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Simulated Opt-In</h1>
        <p className="text-muted-foreground">
          In production, Rival requires explicit opt-in before displaying player
          data. This demo simulates that opt-in using example data only.
        </p>
      </header>

      <section className="rounded-xl border bg-card p-5 space-y-3">
        <div className="text-sm font-medium">What “Opt-In” means</div>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>
            Players must explicitly grant permission before Rival displays their
            stats.
          </li>
          <li>
            Players can opt out at any time, removing access to their profile.
          </li>
          <li>
            This demo uses only fixture/example data and does not contact Riot
            APIs.
          </li>
        </ul>
      </section>

      <form action={continueAction}>
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          Continue
        </button>
      </form>

      <p className="text-sm text-muted-foreground">
        You can opt out from the demo profile page at any time.
      </p>
    </div>
  );
}
