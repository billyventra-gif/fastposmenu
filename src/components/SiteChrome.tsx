import Link from "next/link";
import type { ReactNode } from "react";
import { SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
      <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
        <span className="grid size-8 place-items-center rounded-lg bg-brand text-white">F</span>
        {SITE.name}
      </Link>
      <nav className="flex items-center gap-1 sm:gap-2">
        <Link href="/pricing" className="rounded-full px-3 py-2 text-sm font-semibold hover:bg-ink/5">
          Pricing
        </Link>
        <Link href="/build" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink/85">
          Open app
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-muted sm:flex-row sm:px-8">
        <span>
          © 2026 {SITE.company}. Square, Clover and Toast are trademarks of their owners. Not affiliated.
        </span>
        <nav className="flex gap-4">
          <Link href="/pricing" className="hover:text-ink">Pricing</Link>
          <Link href="/terms" className="hover:text-ink">Terms</Link>
          <Link href="/privacy" className="hover:text-ink">Privacy</Link>
          <Link href="/refunds" className="hover:text-ink">Refunds</Link>
          <a href={`mailto:${SITE.supportEmail}`} className="hover:text-ink">Contact</a>
        </nav>
      </div>
    </footer>
  );
}

/** Plain, readable layout for policy pages. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-20 pt-8 sm:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted">Last updated {updated}</p>
        <div className="mt-8 space-y-6 leading-relaxed [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_p]:text-ink/85 [&_ul]:space-y-1.5">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
