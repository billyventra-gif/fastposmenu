import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

/** Shared chrome and building blocks for marketing pages (server components). */

export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/** Page shell: header, main, footer. */
export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <SiteHeader />
      <main className="w-full flex-1 pb-20">{children}</main>
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
