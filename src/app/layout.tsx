import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Rival",
  description: "Opt-in Valorant stats tracking",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <header className="border-b">
          <nav className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
            <Link href="/" className="font-semibold tracking-tight">
              Rival
            </Link>

            <div className="flex items-center gap-1">
              <Button variant="ghost" asChild>
                <Link href="/search">Search</Link>
              </Button>

              <Button variant="ghost" asChild>
                <Link href="/account">Account</Link>
              </Button>
            </div>
            <div className="ml-auto">
              <Button size="lg" asChild>
                <Link href="/login">Connect</Link>
              </Button>
            </div>
          </nav>
        </header>

        <main>
          <Container>{children}</Container>
        </main>
      </body>
    </html>
  );
}
