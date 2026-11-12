import Link from "next/link";
import type { ReactNode } from "react";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/for-isos", label: "For ISOs" },
  { href: "/clover", label: "Clover" },
  { href: "/square", label: "Square" },
  { href: "/toast", label: "Toast" },
  { href: "/guides", label: "Guides" },
  { href: "/pricing", label: "Pricing" },
] as const;

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
      <span className="grid size-8 place-items-center rounded-lg bg-brand text-white">F</span>
      {SITE.name}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <nav aria-label="Main" className="flex items-center gap-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-ink/5 lg:inline-flex">
              {n.label}
            </Link>
          ))}
          <Link href="/build" className="ml-1 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink/85">
            Open app
          </Link>
        </nav>
      </div>
      {/* Phones/tablets: scrollable pill row instead of a hamburger. One tap to any page. */}
      <nav aria-label="Sections" className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 pb-2 sm:px-8 lg:hidden">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="shrink-0 rounded-full bg-surface px-3.5 py-1.5 text-sm font-semibold ring-1 ring-line">
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

const FOOTER_COLS: { title: string; links: [string, string][] }[] = [
  {
    title: "Product",
    links: [
      ["/for-isos", "For ISOs and agents"],
      ["/clover", "Clover menu import"],
      ["/square", "Square menu import"],
      ["/toast", "Toast menu upload"],
      ["/pricing", "Pricing"],
    ],
  },
  {
    title: "Guides",
    links: [
      ["/guides/import-menu-into-clover", "Import a menu into Clover"],
      ["/guides/square-item-library-import", "Square item library import"],
      ["/guides/toast-menu-bulk-import", "Upload a menu to Toast"],
      ["/guides/switch-pos-without-retyping-menu", "Switch POS without retyping"],
      ["/guides", "All guides"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 text-sm sm:grid-cols-3 sm:px-8">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-muted">Any restaurant menu into Square, Clover or Toast, in minutes. Built for the people who board restaurants.</p>
        </div>
        {FOOTER_COLS.map((c) => (
          <div key={c.title}>
            <p className="font-semibold">{c.title}</p>
            <ul className="mt-3 space-y-2 text-muted">
              {c.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-muted sm:flex-row sm:px-8">
          <span className="text-center sm:text-left">
            © 2026 {SITE.company}. Square, Clover and Toast are trademarks of their owners. Fast POS Menu is independent and not affiliated with or
            endorsed by them.
          </span>
          <nav className="flex shrink-0 gap-4">
            <Link href="/terms" className="hover:text-ink">Terms</Link>
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            <Link href="/refunds" className="hover:text-ink">Refunds</Link>
            <a href={`mailto:${SITE.supportEmail}`} className="hover:text-ink">Contact</a>
          </nav>
        </div>
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
