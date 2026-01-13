import Link from "next/link";
import { getSession } from "@/lib/session";
import { getOptInStatus } from "@/lib/optin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { H1, Muted } from "@/components/typography";

export default async function AccountPage() {
  const session = await getSession();
  const user = session.user;

  // Central rule: DB is source of truth for opt-in.
  // If session says "connected" but DB says "opted out" (or missing),
  // treat as not connected from a visibility standpoint.
  let isDbOptedIn = false;
  if (user?.puuid) {
    const status = await getOptInStatus(user.puuid);
    isDbOptedIn = status.ok;
  }

  const effectiveUser = user && isDbOptedIn ? user : null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <H1>Account</H1>
        <Muted>Manage your Rival connection and visibility settings.</Muted>
      </div>

      {!effectiveUser ? (
        <Card>
          <CardHeader>
            <CardTitle>Not connected</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Muted>
              Connect your Riot account to opt in and display your stats on
              Rival.
            </Muted>

            {user && !isDbOptedIn ? (
              <Muted>
                Your session was connected, but your account is currently opted
                out in the database. Reconnect to opt in again.
              </Muted>
            ) : null}

            <Button asChild>
              <Link href="/login">Connect Riot account</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Connected</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm">
              <div className="text-muted-foreground">Signed in as</div>
              <div className="font-medium">
                {effectiveUser.gameName ?? "Player"}#
                {effectiveUser.tagLine ?? "----"}
              </div>

              <div className="text-muted-foreground mt-2">PUUID</div>
              <div className="font-mono text-xs break-all">
                {effectiveUser.puuid}
              </div>
            </div>

            <form action="/api/auth/riot/disconnect" method="post">
              <Button variant="secondary" type="submit">
                Disconnect / Opt out
              </Button>
            </form>

            <Muted>
              After disconnecting, your stats will no longer be visible on
              Rival.
            </Muted>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
