import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Container, CtaBand, Faq, MarketingShell, Pill, PrimaryCta, SecondaryCta, SectionHead } from "@/components/marketing/site";
import { DEMO_TACOS, MenuDemo } from "@/components/marketing/MenuDemo";
import { PER_MENU, PRO, fmtUsd } from "@/lib/billing/plans";
import appReview from "../../public/product/app-review.png";
import appPhone from "../../public/product/app-phone.png";
import { PosWordmark } from "@/components/pos-logo";

const STATS = [
  { value: "~20s", label: "to read a menu page" },
  { value: "3", label: "POS formats: Square, Clover, Toast" },
  { value: "4–20 hrs", label: "of hand entry it replaces" },
  { value: "$49", label: "per menu, paid at download" },
];

const STEPS = [
  { n: "01", title: "Snap or upload", body: "Phone photos of each page, a PDF, a spreadsheet, or the old POS's export. Multi-page is fine." },
  { n: "02", title: "Review in minutes", body: "Categories, items, sizes and modifier groups come back structured. Anything uncertain is flagged." },
  { n: "03", title: "Import to the POS", body: "Download a file formatted for Square, Clover or Toast and upload it. No retyping." },
];

const FAQ = [
  ["What can I upload?", "Photos (JPG, PNG), PDFs, CSV or Excel files, and exports from another POS. Several pages at once is fine."],
  ["How accurate is it?", "On our test menu it read every item, price and modifier group. Real menus vary, so anything it's unsure about is flagged for you to check before you export."],
  ["Which POS systems?", "Square, Clover and Toast today. Heartland, SpotOn and SkyTab are next."],
  ["When do I pay?", "Only when you download. Build and review free, then pay $49 to unlock the import file for that menu."],
  ["Can it read DoorDash or Uber Eats links?", "No. Those sites don't allow automated access. Screenshot the menu and upload the screenshots instead."],
] as const;

function Chip({ children, on }: { children: ReactNode; on?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[12px] ${on ? "border-ink bg-ink text-white" : "border-line bg-surface"}`}>
      {on && <Check className="size-3" />}
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="relative border-b border-line">
        <div className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" aria-hidden />
        <Container className="relative pb-16 pt-14 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-rise">
              <Pill>Built for ISOs, agents & POS resellers</Pill>
            </div>
            <h1 className="mt-6 animate-rise text-[44px] font-semibold leading-[1.02] tracking-[-0.035em] [animation-delay:60ms] sm:text-[72px]">
              Any menu into any POS.{" "}
              <span className="font-serif font-normal italic tracking-[-0.01em] text-ink/90">In minutes.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl animate-rise text-[18px] leading-relaxed text-muted [animation-delay:120ms]">
              Snap the menu the restaurant already has. Get an import file for Square, Clover or Toast, without typing a single item.
            </p>
            <div className="mt-9 flex animate-rise flex-col justify-center gap-3 [animation-delay:180ms] sm:flex-row">
              <PrimaryCta>Build a menu</PrimaryCta>
              <SecondaryCta href="#how">See how it works</SecondaryCta>
            </div>
            <p className="mt-4 text-[13px] text-muted">Build and review free. Pay when you download.</p>
          </div>

          {/* Product shot */}
          {/* Phones: show the phone UI, legible at this size */}
          <div className="mx-auto mt-12 w-[270px] animate-rise overflow-hidden rounded-[34px] border-[7px] border-ink bg-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)] [animation-delay:240ms] md:hidden">
            <Image src={appPhone} alt="Editing an item on a phone" priority sizes="270px" className="w-full rounded-[27px]" />
          </div>
          <div className="relative mx-auto mt-16 hidden max-w-5xl animate-rise [animation-delay:240ms] md:block">
            <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.04),0_40px_80px_-40px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-1.5 border-b border-line bg-bg px-4 py-3">
                <span className="size-2.5 rounded-full bg-line" />
                <span className="size-2.5 rounded-full bg-line" />
                <span className="size-2.5 rounded-full bg-line" />
                <span className="ml-3 hidden rounded-md border border-line bg-surface px-3 py-0.5 font-mono text-[11px] text-muted sm:block">
                  fastposmenu.com/build
                </span>
              </div>
              <Image src={appReview} alt="Fast POS Menu review screen with items, categories and modifier groups" priority sizes="(max-width: 1100px) 100vw, 1024px" className="w-full" />
            </div>
            <div className="absolute -bottom-10 -right-2 hidden w-[230px] overflow-hidden rounded-[28px] border-[6px] border-ink bg-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)] md:block lg:-right-10">
              <Image src={appPhone} alt="Editing an item on a phone" sizes="230px" className="w-full rounded-[22px]" />
            </div>
          </div>
        </Container>
      </section>

      {/* Exports-to strip + stats */}
      <section className="border-b border-line bg-surface">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Exports import files for</p>
          <div className="flex items-center gap-8 text-[20px] text-ink/70 sm:gap-12">
            {(["square", "clover", "toast"] as const).map((p) => (
              <PosWordmark key={p} pos={p} className="h-6" />
            ))}
          </div>
        </Container>
        <div className="border-t border-line">
          <Container className="py-0">
            <div className="grid grid-cols-2 gap-px bg-line lg:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="bg-surface py-8 pr-4 sm:pr-6 [&:nth-child(2n)]:pl-5 lg:pl-6 lg:[&:first-child]:pl-0">
                  <div className="font-display text-[34px] font-semibold tracking-[-0.03em]">{s.value}</div>
                  <div className="mt-1 text-[14px] text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20">
        <Container className="py-24">
          <SectionHead eyebrow="How it works" title="From paper menu to import file." sub="Three steps. Most menus take a few minutes, start to finish." />
          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <ol className="space-y-0 border-t border-line">
              {STEPS.map((s) => (
                <li key={s.n} className="grid grid-cols-[3.5rem_1fr] gap-2 border-b border-line py-7">
                  <span className="font-mono text-[13px] text-brand">{s.n}</span>
                  <div>
                    <h3 className="text-[20px] font-semibold tracking-[-0.02em]">{s.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <MenuDemo title="Riverbend" label="Clover inventory workbook" rows={DEMO_TACOS} />
          </div>
        </Container>
      </section>

      {/* Feature grid */}
      <section className="border-y border-line bg-surface">
        <Container className="py-24">
          <SectionHead eyebrow="What it handles" title="The fiddly parts, done right." sub="Menus aren't lists. Sizes, required choices and upcharges are what make hand entry slow." />
          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
            <div className="bg-surface p-7 md:col-span-2">
              <h3 className="text-[18px] font-semibold">Modifier groups with real rules</h3>
              <p className="mt-2 max-w-md text-muted">&quot;Choose one protein&quot; becomes a required group, pick 1. &quot;Add-ons&quot; stays optional with upcharges.</p>
              <div className="mt-6 rounded-lg border border-line bg-bg p-4">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium">Pick Your Protein</span>
                  <span className="font-mono text-[11px] text-muted">REQUIRED · PICK 1</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Chip on>Carne Asada +2.00</Chip>
                  <Chip>Al Pastor</Chip>
                  <Chip>Pollo Asado</Chip>
                  <Chip>Carnitas</Chip>
                  <Chip>Grilled Veggies</Chip>
                </div>
              </div>
            </div>
            <div className="bg-surface p-7">
              <h3 className="text-[18px] font-semibold">Sizes and variants</h3>
              <p className="mt-2 text-muted">&quot;Sm 3.50 / Lg 6.00&quot; becomes two priced sizes.</p>
              <div className="mt-6 divide-y divide-line rounded-lg border border-line font-mono text-[13px]">
                <div className="flex justify-between px-3 py-2"><span>Small</span><span>3.50</span></div>
                <div className="flex justify-between px-3 py-2"><span>Large</span><span>6.00</span></div>
              </div>
            </div>
            <div className="bg-surface p-7">
              <h3 className="text-[18px] font-semibold">Flags what it isn&apos;t sure of</h3>
              <p className="mt-2 text-muted">Blurry prices and &quot;MP&quot; items are marked so you check them first.</p>
              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-[13px] text-amber-950">
                <span className="font-medium">Shrimp Tacos</span> · price shows MP
              </div>
            </div>
            <div className="bg-surface p-7">
              <h3 className="text-[18px] font-semibold">Any input</h3>
              <p className="mt-2 text-muted">Photos, PDFs, spreadsheets and old-POS exports. Clean spreadsheets are read instantly.</p>
              <div className="mt-6 flex flex-wrap gap-1.5 font-mono text-[11px]">
                {["JPG", "PNG", "PDF", "CSV", "XLSX"].map((t) => (
                  <span key={t} className="rounded border border-line px-2 py-1">{t}</span>
                ))}
              </div>
            </div>
            <div className="bg-surface p-7">
              <h3 className="text-[18px] font-semibold">Made for the phone</h3>
              <p className="mt-2 text-muted">Take photos at the table, fix items with a tap, export before you leave the install.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* ISOs */}
      <section>
        <Container className="grid gap-12 py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHead
              eyebrow="For ISOs and agents"
              title="Board the restaurant. Skip the menu build."
              sub="Menu builds are the hours nobody bills for and the reason go-lives slip. Start every install from a finished draft in the right format."
            />
            <Link href="/for-isos" className="mt-8 inline-flex items-center gap-1.5 font-medium hover:underline">
              Fast POS Menu for ISOs <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            <div className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-line bg-bg px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-muted">
              <span>Menu build</span>
              <span>Time</span>
              <span>Cost</span>
            </div>
            {[
              ["By hand", "4–20 hrs", "Your team"],
              ["POS vendor service", "Days", "~$150/hr*"],
              ["Freelancer", "1–3 days", "$50–300"],
            ].map(([a, b, c]) => (
              <div key={a} className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-line px-5 py-4 text-[15px]">
                <span>{a}</span>
                <span className="text-muted">{b}</span>
                <span className="text-muted">{c}</span>
              </div>
            ))}
            <div className="grid grid-cols-[1.4fr_1fr_1fr] bg-ink px-5 py-4 text-[15px] text-white">
              <span className="font-medium">Fast POS Menu</span>
              <span>Minutes</span>
              <span>$49</span>
            </div>
            <p className="px-5 py-3 text-[12px] text-muted">*Toast professional services rate. Times and costs are estimates.</p>
          </div>
        </Container>
      </section>

      {/* Pricing preview */}
      <section className="border-y border-line bg-surface">
        <Container className="py-24">
          <SectionHead eyebrow="Pricing" title="Pay per menu. Or go monthly." center />
          <div className="mx-auto mt-12 grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-line p-7">
              <p className="text-[15px] font-medium">{PER_MENU.name}</p>
              <p className="mt-4 font-display text-[44px] font-semibold tracking-[-0.03em]">
                {fmtUsd(PER_MENU.priceCents)}
                <span className="ml-1 text-[15px] font-normal tracking-normal text-muted">/ menu</span>
              </p>
              <p className="mt-2 text-muted">{PER_MENU.blurb}</p>
            </div>
            <div className="rounded-xl bg-ink p-7 text-white">
              <p className="flex items-center justify-between text-[15px] font-medium">
                {PRO.name}
                <span className="rounded border border-white/20 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/70">Soon</span>
              </p>
              <p className="mt-4 font-display text-[44px] font-semibold tracking-[-0.03em]">
                {fmtUsd(PRO.priceCents)}
                <span className="ml-1 text-[15px] font-normal tracking-normal text-white/60">/ month</span>
              </p>
              <p className="mt-2 text-white/65">{PRO.builds} menus a month, about $15 each.</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link href="/pricing" className="inline-flex items-center gap-1.5 font-medium hover:underline">
              Full pricing <ArrowRight className="size-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section>
        <Container className="grid gap-10 py-24 lg:grid-cols-[1fr_1.6fr]">
          <SectionHead eyebrow="FAQ" title="Questions, answered." />
          <Faq items={FAQ} />
        </Container>
      </section>

      <CtaBand title="Your next menu build takes minutes." sub="Snap it, check it, import it. Pay only when you download." />
    </MarketingShell>
  );
}
