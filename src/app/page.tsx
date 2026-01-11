import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rival</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Opt-in Valorant stats tracking.
          </p>
          <Button asChild>
            <Link href="/login">Connect</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
