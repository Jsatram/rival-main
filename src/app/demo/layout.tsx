import Link from "next/link";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Demo banner */}
      <div className="sticky top-0 z-50 border-b bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2">
          <div className="text-sm font-medium">
            Demo Mode —{" "}
            <span className="text-muted-foreground">Example Data</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 text-sm text-muted-foreground">
          <div>Rival — Public Demo</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
