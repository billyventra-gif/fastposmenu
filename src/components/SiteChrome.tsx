import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, Menu as MenuIcon } from "lucide-react";
import { SITE } from "@/lib/site";
import { Wordmark } from "./brand";

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
    <Link href="/" aria-label={`${SITE.name} home`}>
      <Wordmark />
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-[14px] text-muted transition-colors hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/build"
            className="inline-flex h-9 items-center rounded-lg bg-ink px-3.5 text-[14px] font-medium text-white transition-colors hover:bg-ink/85"
          >
            Open app
          </Link>
          {/* Mobile menu: no JS needed. Each page renders a fresh header, so it closes on navigation. */}
          <details className="group relative lg:hidden">
            <summary className="grid size-9 cursor-pointer list-none place-items-center rounded-lg border border-line bg-surface [&::-webkit-details-marker]:hidden">
              <MenuIcon className="size-4" />
              <span className="sr-only">Menu</span>
            </summary>
            <div className="absolute right-0 top-11 w-60 rounded-xl border border-line bg-surface p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)]">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="block rounded-lg px-3 py-2.5 text-[15px] hover:bg-bg">
                  {n.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
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
  {
    title: "Company",
    links: [
      ["/terms", "Terms"],
      ["/privacy", "Privacy"],
      ["/refunds", "Refunds"],
      [`mailto:${SITE.supportEmail}`, "Contact"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 text-[14px] sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs leading-relaxed text-muted">
            Any restaurant menu into Square, Clover or Toast, in minutes. Built for the people who board restaurants.
          </p>
          <Link href="/build" className="mt-5 inline-flex items-center gap-1 font-medium hover:underline">
            Build a menu <ArrowUpRight className="size-4" />
          </Link>
        </div>
        {FOOTER_COLS.map((c) => (
          <div key={c.title}>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{c.title}</p>
            <ul className="mt-4 space-y-2.5">
              {c.links.map(([href, label]) => (
                <li key={href}>
                  {href.startsWith("mailto:") ? (
                    <a href={href} className="text-ink/80 hover:text-ink">
                      {label}
                    </a>
                  ) : (
                    <Link href={href} className="text-ink/80 hover:text-ink">
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-6 text-[12px] leading-relaxed text-muted sm:px-8">
          <span className="mb-1 block text-[13px] text-ink/80">
            {SITE.name} by{" "}
            <a href={SITE.companyUrl} className="font-medium underline-offset-2 hover:underline">
              {SITE.company}
            </a>
          </span>
          © 2026 {SITE.company}. Square, Clover and Toast are trademarks of their owners. Fast POS Menu is independent and not affiliated with or
          endorsed by them.
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
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-24 pt-14 sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Legal</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm text-muted">Last updated {updated}</p>
        <div className="mt-10 space-y-5 text-[15.5px] leading-[1.7] text-ink/85 [&_a]:underline [&_a]:underline-offset-2 [&_b]:font-semibold [&_b]:text-ink [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
