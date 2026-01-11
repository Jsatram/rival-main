import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b">
          <nav className="mx-auto flex max-w-5xl items-center gap-4 p-4">
            <Link href="/" className="font-semibold">
              Rival
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/search">Search</Link>
              <Link href="/account">Account</Link>
            </div>

            <div className="ml-auto">
              <Link href="/login">Connect</Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-5xl p-4">{children}</main>
      </body>
    </html>
  );
}
