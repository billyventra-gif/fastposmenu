import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Tag } from "lucide-react";
import { PER_MENU, PRO, fmtUsd } from "@/lib/billing/plans";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Pricing",
  description: "$49 a menu, any POS. Or $149 a month for 10 menus. Built for ISOs, agents and resellers.",
  alternates: { canonical: "/pricing" },
};

const FAQ = [
  ["When do I pay?", "When you download. Build and review the menu first, then pay to unlock the import file."],
  ["What if the read is off?", "Fix it in the review screen before you pay. Flagged items are marked so you know where to look."],
  ["Promo codes?", "Yes. Enter it on the checkout page."],
  ["Which POS systems?", "Square, Clover and Toast today. Heartland, SpotOn and SkyTab are next."],
];

export default function PricingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 pb-20 sm:px-8">
        <section className="animate-rise py-10 text-center sm:py-14">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Simple pricing.</h1>
          <p className="mx-auto mt-3 max-w-md text-lg text-muted">Pay per menu, or go monthly if you board restaurants every month.</p>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Per menu */}
          <div className="flex animate-rise flex-col rounded-3xl bg-surface p-6 ring-1 ring-line sm:p-8">
            <p className="font-semibold text-muted">{PER_MENU.name}</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-5xl font-extrabold tracking-tight">{fmtUsd(PER_MENU.priceCents)}</span>
              <span className="pb-1.5 text-muted">/ menu</span>
            </div>
            <p className="mt-2 text-muted">{PER_MENU.blurb}</p>
            <ul className="mt-6 flex-1 space-y-3">
              {PER_MENU.features.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <Check className="mt-0.5 size-5 shrink-0 text-emerald-600" /> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/build"
              className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-brand font-semibold text-white shadow-[0_10px_30px_-10px_rgba(255,90,31,0.7)] hover:bg-brand-ink"
            >
              Build a menu <ArrowRight className="size-5" />
            </Link>
          </div>

          {/* Pro */}
          <div className="relative flex animate-rise flex-col rounded-3xl bg-ink p-6 text-white sm:p-8" style={{ animationDelay: "80ms" }}>
            <span className="absolute right-5 top-5 rounded-full bg-brand px-3 py-1 text-xs font-bold">Save ~70%</span>
            <p className="font-semibold text-white/70">{PRO.name}</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-5xl font-extrabold tracking-tight">{fmtUsd(PRO.priceCents)}</span>
              <span className="pb-1.5 text-white/70">/ month</span>
            </div>
            <p className="mt-2 text-white/70">{PRO.blurb}</p>
            <ul className="mt-6 flex-1 space-y-3">
              {PRO.features.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <Check className="mt-0.5 size-5 shrink-0 text-brand" /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-8 inline-flex h-14 items-center justify-center rounded-2xl bg-white/10 font-semibold text-white/80">
              {PRO.available ? "Start Pro" : "Coming soon"}
            </div>
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted">
          <Tag className="size-4" /> Running a special? Promo codes work at checkout.
        </p>

        <section className="mx-auto mt-14 max-w-2xl">
          <h2 className="text-xl font-bold">Questions</h2>
          <dl className="mt-4 divide-y divide-line rounded-3xl bg-surface ring-1 ring-line">
            {FAQ.map(([q, a]) => (
              <div key={q} className="p-5">
                <dt className="font-semibold">{q}</dt>
                <dd className="mt-1 text-muted">{a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
