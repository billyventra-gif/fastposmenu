import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

/** Shared chrome and building blocks for marketing pages (server components). Design system v2. */

export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/** Page shell: header, main, footer. */
export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <SiteHeader />
      <main className="w-full flex-1 pb-24">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

/** Small label above a headline. Mono, quiet, one accent dot. */
export function Pill({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-2 pr-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
      {icon ? <span className="text-brand [&_svg]:size-3.5">{icon}</span> : <span className="size-1.5 rounded-full bg-brand" />}
      {children}
    </span>
  );
}

export function PrimaryCta({ href = "/build", children }: { href?: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-ink px-5 text-[15px] font-medium text-white transition-colors hover:bg-ink/85"
    >
      {children} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export function SecondaryCta({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-12 items-center justify-center rounded-lg border border-line bg-surface px-5 text-[15px] font-medium transition-colors hover:border-ink/25"
    >
      {children}
    </Link>
  );
}

export function SectionHead({ eyebrow, title, sub, center }: { eyebrow?: string; title: ReactNode; sub?: ReactNode; center?: boolean }) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && (
        <p className={cn("flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted", center && "justify-center")}>
          <span className="h-px w-5 bg-brand" />
          {eyebrow}
        </p>
      )}
      <h2 className="mt-4 text-[32px] font-semibold leading-[1.08] tracking-[-0.022em] sm:text-[44px]">{title}</h2>
      {sub && <p className="mt-4 text-[17px] leading-relaxed text-muted">{sub}</p>}
    </div>
  );
}

export function Card({ children, className, dark }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <div className={cn("rounded-xl p-6 sm:p-7", dark ? "bg-ink text-white" : "border border-line bg-surface", className)}>{children}</div>
  );
}

export function IconTile({ children }: { children: ReactNode }) {
  return <span className="grid size-9 place-items-center rounded-lg border border-line bg-surface text-ink [&_svg]:size-[18px]">{children}</span>;
}

/** Accordion FAQ (native <details>, no JS). */
export function Faq({ items }: { items: readonly (readonly [string, ReactNode])[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map(([q, a]) => (
        <details key={q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-[16px] font-medium [&::-webkit-details-marker]:hidden">
            {q}
            <Plus className="size-4 shrink-0 text-muted transition-transform group-open:rotate-45" />
          </summary>
          <div className="pb-5 pr-10 leading-relaxed text-muted">{a}</div>
        </details>
      ))}
    </div>
  );
}

/** Closing call to action band. */
export function CtaBand({ title, sub, cta = "Build a menu", href = "/build" }: { title: ReactNode; sub?: ReactNode; cta?: string; href?: string }) {
  return (
    <Container className="mt-24">
      <div className="relative overflow-hidden rounded-2xl bg-ink px-6 py-14 text-white sm:px-14 sm:py-16">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at 70% 30%, black, transparent 70%)",
          }}
          aria-hidden
        />
        <div className="relative max-w-xl">
          <h2 className="text-[32px] font-semibold leading-[1.08] tracking-[-0.022em] sm:text-[44px]">{title}</h2>
          {sub && <p className="mt-4 text-[17px] leading-relaxed text-white/65">{sub}</p>}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={href}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 text-[15px] font-medium text-ink hover:bg-white/90"
            >
              {cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-white/20 px-5 text-[15px] font-medium text-white hover:bg-white/10"
            >
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
    <p className="flex gap-3 rounded-lg border border-line bg-surface px-4 py-3 text-[14px] leading-relaxed text-muted">
      <span className="mt-0.5 h-fit shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink">Beta</span>
      <span>
        The {pos ? `${pos} ` : ""}import file follows the published import layout, and we&apos;re still confirming it against real accounts. Check the
        import preview before you save, and tell us if anything doesn&apos;t go in clean.
      </span>
    </p>
  );
}
