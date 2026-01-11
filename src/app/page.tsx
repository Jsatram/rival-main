import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { H1, Muted } from "@/components/typography";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <H1>Rival</H1>
        <Muted>Opt-in Valorant stats tracking.</Muted>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <Button asChild>
            <Link href="/login">Connect</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
