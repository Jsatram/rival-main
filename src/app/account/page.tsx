import Link from "next/link";
import { getSession } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { H1, Muted } from "@/components/typography";

export default async function AccountPage() {
  const session = await getSession();
  const user = session.user;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <H1>Account</H1>
        <Muted>Manage your Rival connection and visibility settings.</Muted>
      </div>

      {!user ? (
        <Card>
          <CardHeader>
            <CardTitle>Not connected</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Muted>
              Connect your Riot account to opt in and display your stats on
              Rival.
            </Muted>
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
                {user.gameName ?? "Player"}#{user.tagLine ?? "----"}
              </div>

              <div className="text-muted-foreground mt-2">PUUID</div>
              <div className="font-mono text-xs break-all">{user.puuid}</div>
            </div>

            {/* 🔴 THIS IS THE IMPORTANT CHANGE */}
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
