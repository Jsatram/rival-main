import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter a Riot ID (gameName#tagLine). Stats will only be shown for
            players who have opted in.
          </p>

          <form className="flex gap-2">
            <Input placeholder="gameName#tagLine" />
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
