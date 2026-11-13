import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PER_MENU, PRO, fmtUsd } from "@/lib/billing/plans";
import { proEnabled } from "@/lib/billing/stripe";
import ProCta from "@/components/ProCta";
import { Container, CtaBand, Faq, MarketingShell, Pill, PrimaryCta, SectionHead } from "@/components/marketing/site";

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
  ["Refunds?", "If your POS rejects the file and we can't fix it within 3 business days, we refund you. See the refund policy."],
] as const;

const COMPARE: [string, string, string][] = [
  ["Menu builds", "1 per purchase", "10 per month"],
  ["Price per menu", "$49", "~$15"],
  ["Extra menus", "$49 each", "$15 each"],
  ["Square, Clover, Toast", "✓", "✓"],
  ["Review and edit on phone", "✓", "✓"],
  ["Promo codes", "✓", "✓"],
  ["Priority help", "", "✓"],
];

export default function PricingPage() {
  const pro = proEnabled();
  return (
    <MarketingShell>
      <section className="relative border-b border-line">
        <div className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" aria-hidden />
        <Container className="relative pb-20 pt-16 sm:pt-20">
          <div className="mx-auto max-w-2xl text-center">
            <Pill>Pricing</Pill>
            <h1 className="mt-6 text-[44px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[64px]">
              Simple pricing. <span className="font-serif font-normal italic tracking-[-0.01em]">No contracts.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-[18px] text-muted">Pay per menu, or go monthly if you board restaurants every month.</p>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-4 md:grid-cols-2">
            <div className="flex flex-col rounded-xl border border-line bg-surface p-8">
              <p className="text-[15px] font-medium">{PER_MENU.name}</p>
              <p className="mt-5 font-display text-[56px] font-semibold leading-none tracking-[-0.04em]">
                {fmtUsd(PER_MENU.priceCents)}
                <span className="ml-1.5 text-[15px] font-normal tracking-normal text-muted">/ menu</span>
              </p>
              <p className="mt-4 text-muted">{PER_MENU.blurb}</p>
              <div className="mt-7">
                <PrimaryCta>Build a menu</PrimaryCta>
              </div>
              <ul className="mt-8 space-y-3 border-t border-line pt-7 text-[15px]">
                {PER_MENU.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col rounded-xl bg-ink p-8 text-white">
              <p className="flex items-center justify-between text-[15px] font-medium">
                {PRO.name}
                {!pro && (
                  <span className="rounded border border-white/20 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/70">
                    Coming soon
                  </span>
                )}
              </p>
              <p className="mt-5 font-display text-[56px] font-semibold leading-none tracking-[-0.04em]">
                {fmtUsd(PRO.priceCents)}
                <span className="ml-1.5 text-[15px] font-normal tracking-normal text-white/60">/ month</span>
              </p>
              <p className="mt-4 text-white/65">{PRO.blurb}</p>
              <div className="mt-7">
                {pro ? (
                  <ProCta />
                ) : (
                  <span className="inline-flex h-12 items-center rounded-lg border border-white/15 px-5 text-[15px] font-medium text-white/60">
                    Join the list at launch
                  </span>
                )}
              </div>
              <ul className="mt-8 space-y-3 border-t border-white/10 pt-7 text-[15px]">
                {PRO.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 text-center text-[13px] text-muted">Running a special? Promo codes work at checkout.</p>
        </Container>
      </section>

      <section>
        <Container className="py-24">
          <SectionHead eyebrow="Compare" title="What's included." center />
          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-xl border border-line bg-surface">
            <div className="grid grid-cols-[1.6fr_1fr_1fr] border-b border-line bg-bg px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-muted">
              <span />
              <span>Per menu</span>
              <span>Pro</span>
            </div>
            {COMPARE.map(([k, a, b]) => (
              <div key={k} className="grid grid-cols-[1.6fr_1fr_1fr] border-b border-line px-5 py-3.5 text-[15px] last:border-0">
                <span>{k}</span>
                <span className="text-muted">{a}</span>
                <span className="text-muted">{b}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line">
        <Container className="grid gap-10 py-24 lg:grid-cols-[1fr_1.6fr]">
          <SectionHead eyebrow="FAQ" title="Pricing questions." />
          <Faq items={FAQ} />
        </Container>
      </section>

      <CtaBand title="Build your first menu free." sub="You only pay when you download the import file." />
    </MarketingShell>
  );
}
