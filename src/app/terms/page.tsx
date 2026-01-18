// app/terms/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

const LAST_UPDATED = "January 17, 2026";
const SITE_NAME = "Rival";
// TODO: update if you want a different contact
const CONTACT_EMAIL = "support@rival.gg";

export const metadata: Metadata = {
  title: "Terms of Service | Rival",
  description:
    "Terms of Service for Rival, an opt-in Valorant stats tracking website.",
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

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: <span className="font-medium">{LAST_UPDATED}</span>
        </p>

        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm leading-6 text-muted-foreground">
            By accessing or using{" "}
            <span className="font-medium text-foreground">{SITE_NAME}</span>,
            you agree to these Terms of Service. If you do not agree, do not use
            the site.
          </p>
        </div>
      </header>

      <div className="mt-10 space-y-10">
        <Section id="overview" title="Overview">
          <p>
            {SITE_NAME} is an{" "}
            <span className="font-medium text-foreground">opt-in</span> Valorant
            statistics tracking website. We only display game data for players
            who explicitly connect their Riot account and grant permission.
          </p>
          <p>{SITE_NAME} is not affiliated with or endorsed by Riot Games.</p>
        </Section>

        <Section id="eligibility" title="Eligibility">
          <p>
            You must be at least 13 years old (or the minimum age required in
            your jurisdiction) to use {SITE_NAME}. By using the site, you
            represent that you meet this requirement.
          </p>
        </Section>

        <Section id="opt-in" title="Opt-In and Account Connection">
          <p>
            To use core features of {SITE_NAME}, you must connect your Riot
            account and explicitly opt in through Riot authentication.
          </p>
          <p>
            By opting in, you authorize {SITE_NAME} to retrieve your
            Valorant-related data from Riot APIs and{" "}
            <span className="font-medium text-foreground">
              continue updating your stats
            </span>{" "}
            until you disconnect your account or opt out.
          </p>
          <p>
            You may disconnect your Riot account at any time through your
            account settings, which will stop ongoing data updates and remove
            your stats from public display.
          </p>
        </Section>

        <Section id="acceptable-use" title="Acceptable Use">
          <p>You agree not to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Use the service for unlawful purposes</li>
            <li>
              Attempt to bypass authentication or authorization mechanisms
            </li>
            <li>Scrape, harvest, or misuse data from {SITE_NAME}</li>
            <li>Interfere with or disrupt site operations or security</li>
          </ul>
        </Section>

        <Section id="intellectual-property" title="Intellectual Property">
          <p>
            All content and functionality on {SITE_NAME}, excluding Riot Games
            intellectual property, is owned by {SITE_NAME} or its licensors and
            is protected by applicable laws.
          </p>
          <p>
            Riot Games, Valorant, and all associated trademarks are the property
            of Riot Games, Inc.
          </p>
        </Section>

        <Section id="disclaimer" title="Disclaimers">
          <p>
            {SITE_NAME} is provided on an{" "}
            <span className="font-medium text-foreground">“as is”</span> and{" "}
            <span className="font-medium text-foreground">“as available”</span>{" "}
            basis without warranties of any kind.
          </p>
          <p>
            We do not guarantee the accuracy, completeness, or availability of
            statistics or services, including data provided by Riot APIs.
          </p>
        </Section>

        <Section id="limitation" title="Limitation of Liability">
          <p>
            To the maximum extent permitted by law, {SITE_NAME} and its
            operators shall not be liable for any indirect, incidental, special,
            or consequential damages arising out of or related to your use of
            the service.
          </p>
        </Section>

        <Section id="termination" title="Termination">
          <p>
            We may suspend or terminate access to {SITE_NAME} at any time for
            violations of these Terms or for operational, legal, or security
            reasons.
          </p>
          <p>
            You may stop using the service at any time by disconnecting your
            Riot account.
          </p>
        </Section>

        <Section id="changes" title="Changes to These Terms">
          <p>
            We may update these Terms from time to time. The “Last updated” date
            will reflect the most recent revision. Continued use of the service
            constitutes acceptance of the updated Terms.
          </p>
        </Section>

        <footer className="pt-6 text-xs text-muted-foreground">
          <p>
            Riot Games, Valorant, and related marks are trademarks or registered
            trademarks of Riot Games, Inc. This site is not endorsed by Riot
            Games.
          </p>
        </footer>
      </div>
    </main>
  );
}
