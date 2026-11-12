import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

/** Shared chrome and building blocks for marketing pages (server components). */

export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

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
      Fast POS Menu
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

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 text-sm sm:grid-cols-3 sm:px-8">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-muted">Any restaurant menu into Square, Clover or Toast, in minutes. Built for the people who board restaurants.</p>
        </div>
        <div>
          <p className="font-semibold">Product</p>
          <ul className="mt-3 space-y-2 text-muted">
            <li><Link href="/for-isos" className="hover:text-ink">For ISOs and agents</Link></li>
            <li><Link href="/clover" className="hover:text-ink">Clover menu import</Link></li>
            <li><Link href="/square" className="hover:text-ink">Square menu import</Link></li>
            <li><Link href="/toast" className="hover:text-ink">Toast menu upload</Link></li>
            <li><Link href="/pricing" className="hover:text-ink">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Guides</p>
          <ul className="mt-3 space-y-2 text-muted">
            <li><Link href="/guides/import-menu-into-clover" className="hover:text-ink">Import a menu into Clover</Link></li>
            <li><Link href="/guides/square-item-library-import" className="hover:text-ink">Square item library import</Link></li>
            <li><Link href="/guides/toast-menu-bulk-import" className="hover:text-ink">Upload a menu to Toast</Link></li>
            <li><Link href="/guides/switch-pos-without-retyping-menu" className="hover:text-ink">Switch POS without retyping</Link></li>
            <li><Link href="/guides" className="hover:text-ink">All guides</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line px-5 py-6 text-center text-xs leading-relaxed text-muted">
        <p>A Code 85 Labs product.</p>
        <p className="mx-auto mt-1 max-w-2xl">
          Square, Clover and Toast are trademarks of their respective owners. Fast POS Menu is independent and is not affiliated with, endorsed
          by or certified by them.
        </p>
      </div>
    </footer>
  );
}

/** Page shell: header, main, footer. */
export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <SiteHeader />
      <main className="w-full flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

export function Pill({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-ink">
      {icon}
      {children}
    </span>
  );
}

export function PrimaryCta({ href = "/build", children }: { href?: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-brand px-7 text-[17px] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(255,90,31,0.7)] transition hover:bg-brand-ink active:scale-[0.98]"
    >
      {children} <ArrowRight className="size-5" />
    </Link>
  );
}

export function SecondaryCta({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex h-14 items-center justify-center rounded-2xl px-5 font-semibold ring-1 ring-line hover:bg-surface">
      {children}
    </Link>
  );
}

export function SectionHead({ eyebrow, title, sub, center }: { eyebrow?: string; title: ReactNode; sub?: ReactNode; center?: boolean }) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && <p className="text-sm font-bold uppercase tracking-wide text-brand-ink">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-lg text-muted">{sub}</p>}
    </div>
  );
}

export function Card({ children, className, dark }: { children: ReactNode; className?: string; dark?: boolean }) {
  return <div className={cn("rounded-3xl p-5 sm:p-6", dark ? "bg-ink text-white" : "bg-surface ring-1 ring-line", className)}>{children}</div>;
}

export function IconTile({ children }: { children: ReactNode }) {
  return <span className="grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand">{children}</span>;
}

export function Faq({ items }: { items: readonly (readonly [string, ReactNode])[] }) {
  return (
    <dl className="divide-y divide-line rounded-3xl bg-surface ring-1 ring-line">
      {items.map(([q, a]) => (
        <div key={q} className="p-5">
          <dt className="font-semibold">{q}</dt>
          <dd className="mt-1 leading-relaxed text-muted">{a}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Closing call to action band. */
export function CtaBand({ title, sub, cta = "Build a menu", href = "/build" }: { title: ReactNode; sub?: ReactNode; cta?: string; href?: string }) {
  return (
    <Container className="mt-20">
      <div className="relative overflow-hidden rounded-[32px] bg-ink px-6 py-10 text-white sm:px-12 sm:py-14">
        <div className="absolute -right-24 -top-24 size-72 rounded-full bg-brand/30 blur-3xl" aria-hidden />
        <div className="relative max-w-xl">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{title}</h2>
          {sub && <p className="mt-3 text-lg text-white/70">{sub}</p>}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <PrimaryCta href={href}>{cta}</PrimaryCta>
            <Link href="/pricing" className="inline-flex h-14 items-center justify-center rounded-2xl px-5 font-semibold text-white ring-1 ring-white/20 hover:bg-white/10">
              $49 a menu · Pricing
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}

/** Small honest-claims footnote used wherever formats are discussed. */
export function BetaNote({ pos }: { pos?: string }) {
  return (
    <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-950 ring-1 ring-amber-200">
      <span className="font-semibold">Beta format.</span> The {pos ? `${pos} ` : ""}import file follows the published import layout, and we&apos;re
      still confirming it against real accounts. Check the import preview before you save, and tell us if anything doesn&apos;t go in clean.
    </p>
  );
}
