// app/privacy/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

const LAST_UPDATED = "January 17, 2026";
// TODO: change these to your real values
const CONTACT_EMAIL = "privacy@rival.gg";
const SITE_NAME = "Rival";

export const metadata: Metadata = {
  title: "Privacy Policy | Rival",
  description:
    "Learn how Rival collects, uses, and protects your information. Rival is an opt-in Valorant stats tracking website.",
};

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: <span className="font-medium">{LAST_UPDATED}</span>
        </p>

        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm leading-6 text-muted-foreground">
            <span className="font-medium text-foreground">{SITE_NAME}</span> is
            an <span className="font-medium text-foreground">opt-in</span>{" "}
            Valorant stats tracking website. If you do not opt in, we do not
            display your stats or match history.
          </p>
        </div>
      </header>

      {/* Quick nav */}
      <nav className="mt-8 rounded-2xl border bg-card p-4">
        <p className="text-sm font-medium">On this page</p>
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {[
            ["overview", "Overview"],
            ["info-we-collect", "Information We Collect"],
            ["how-we-use", "How We Use Information"],
            ["opt-in", "Opt-In and Ongoing Updates"],
            ["sharing", "Sharing"],
            ["retention", "Data Retention"],
            ["security", "Security"],
            ["your-rights", "Your Choices"],
            ["children", "Children"],
            ["changes", "Changes"],
          ].map(([id, label]) => (
            <li key={id}>
              <a className="hover:underline" href={`#${id}`}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10 space-y-10">
        <Section id="overview" title="Overview">
          <p>
            This Privacy Policy explains how {SITE_NAME} collects, uses, and
            protects information when you use our website.
          </p>
          <p>
            {SITE_NAME} only displays Valorant stats for players who{" "}
            <span className="font-medium text-foreground">
              explicitly opt in
            </span>{" "}
            by connecting their Riot account and granting permission via Riot
            authentication.
          </p>
        </Section>

        <Section id="info-we-collect" title="Information We Collect">
          <p className="font-medium text-foreground">
            A. Information you provide
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Account connection details when you choose to connect your Riot
              account (e.g., identifiers needed to link your Riot account to a
              Rival profile).
            </li>
            <li>
              Support communications you send us (e.g., emails or bug reports).
            </li>
          </ul>

          <p className="font-medium text-foreground">
            B. Information we receive from Riot APIs
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Game-related data such as match history, competitive rank, and
              performance stats{" "}
              <span className="italic">
                (based on the permissions you grant)
              </span>
              .
            </li>
            <li>
              We use this data to compute and display stats on {SITE_NAME}.
            </li>
          </ul>

          <p className="font-medium text-foreground">
            C. Automatically collected data
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Basic usage and device data typical of websites (e.g., IP address,
              user agent, pages visited, and timestamps) for security and
              reliability.
            </li>
            <li>
              Cookies or similar technologies for session management (for
              example, to keep you signed in).
            </li>
          </ul>
        </Section>

        <Section id="how-we-use" title="How We Use Information">
          <ul className="list-disc space-y-2 pl-5">
            <li>To authenticate you and maintain your session.</li>
            <li>
              To display your stats and match history{" "}
              <span className="font-medium text-foreground">
                only after you opt in
              </span>
              .
            </li>
            <li>
              To keep your opted-in stats updated over time (until you opt out).
            </li>
            <li>To improve performance, reliability, and user experience.</li>
            <li>
              To prevent abuse, fraud, or security incidents and comply with
              applicable law.
            </li>
          </ul>
        </Section>

        <Section id="opt-in" title="Opt-In and Ongoing Updates">
          <p>
            When you connect your Riot account and opt in, you authorize{" "}
            {SITE_NAME} to retrieve your game data and{" "}
            <span className="font-medium text-foreground">
              continue updating your stats
            </span>{" "}
            at intervals we choose for product functionality and freshness.
          </p>
          <p>
            You can opt out at any time by disconnecting your Riot account in
            your account settings. After opt-out/disconnect, your stats will no
            longer be displayed and we will stop automated updates.
          </p>
          <p className="text-xs">
            Note: Some limited data may be retained for security, compliance, or
            operational reasons (see “Data Retention” below).
          </p>
        </Section>

        <Section id="sharing" title="Sharing">
          <p>We do not sell your personal information.</p>
          <p>We may share information in the following limited cases:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-foreground">
                Service providers
              </span>{" "}
              (e.g., hosting, databases, analytics) who process data on our
              behalf under appropriate safeguards.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Legal / safety
              </span>{" "}
              if required to comply with law, enforce our terms, or protect
              users, the public, or {SITE_NAME}.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Business changes
              </span>{" "}
              (e.g., merger or acquisition) where information may be transferred
              as part of that transaction.
            </li>
          </ul>
        </Section>

        <Section id="retention" title="Data Retention">
          <p>
            If you are opted in, we retain the information needed to maintain
            your profile and keep stats updated.
          </p>
          <p>
            If you opt out / disconnect, we will stop updating and stop
            displaying your stats. We may retain limited data for a reasonable
            period for:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Security and abuse prevention</li>
            <li>Compliance and legal obligations</li>
            <li>System integrity, backups, and troubleshooting</li>
          </ul>
        </Section>

        <Section id="security" title="Security">
          <p>
            We use reasonable administrative, technical, and organizational
            measures to protect information. No method of transmission or
            storage is 100% secure, so we cannot guarantee absolute security.
          </p>
        </Section>

        <Section id="your-rights" title="Your Choices">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-foreground">Opt in</span> by
              connecting your Riot account.
            </li>
            <li>
              <span className="font-medium text-foreground">Opt out</span> by
              disconnecting your Riot account in settings.
            </li>
            <li>
              You can also contact us to request access, correction, or deletion
              of certain information where applicable.
            </li>
          </ul>

          <p className="text-sm">
            Go to{" "}
            <Link className="underline underline-offset-4" href="/account">
              Account
            </Link>{" "}
            (if signed in) to manage your connection status.
          </p>
        </Section>

        <Section id="children" title="Children">
          <p>
            {SITE_NAME} is not intended for children under 13 (or the minimum
            age required in your jurisdiction). If you believe a child has
            provided us information, contact us and we will take appropriate
            steps.
          </p>
        </Section>

        <Section id="changes" title="Changes to This Policy">
          <p>
            We may update this policy from time to time. We will revise the
            “Last updated” date and, if changes are material, we may provide
            additional notice within the product.
          </p>
        </Section>

        <footer className="pt-6 text-xs text-muted-foreground">
          <p>
            This page is provided for transparency and product clarity and is
            not legal advice. If you need a jurisdiction-specific policy,
            consult a qualified attorney.
          </p>
        </footer>
      </div>
    </main>
  );
}
