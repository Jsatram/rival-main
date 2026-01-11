import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { H1, Muted } from "@/components/typography";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <H1>Connect your Riot account</H1>
        <Muted>Rival only shows stats for players who explicitly opt in.</Muted>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How this works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            Rival only displays stats for players who have connected their Riot
            account. If a player has not opted in, their stats and match history
            are not visible on Rival.
          </p>

          <p>Connecting your Riot account allows Rival to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Verify your player identity</li>
            <li>Fetch your Valorant stats and match history</li>
            <li>Display your stats publicly after you opt in</li>
          </ul>

          <p>
            You can disconnect your Riot account at any time from your account
            settings. Once disconnected, your data will no longer be visible on
            Rival.
          </p>

          <Button size="lg" className="mt-4">
            Connect Riot account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
