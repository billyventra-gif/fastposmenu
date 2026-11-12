import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Camera, Clock, FileSpreadsheet, Hourglass, Repeat, ScanLine, Store, Users, Wand2, Wrench } from "lucide-react";
import {
  Card,
  Container,
  CtaBand,
  Faq,
  IconTile,
  MarketingShell,
  Pill,
  PrimaryCta,
  SecondaryCta,
  SectionHead,
} from "@/components/marketing/site";
import { DEMO_TACOS, MenuDemo } from "@/components/marketing/MenuDemo";

export const metadata: Metadata = {
  title: "Menu builds for ISOs and POS resellers",
  description:
    "Stop typing menus during installs. Turn the merchant's menu into a Square, Clover or Toast import file in minutes. $49 a menu.",
  alternates: { canonical: "/for-isos" },
  openGraph: {
    title: "Board the restaurant. Skip the menu build.",
    description: "Menu photos, PDF or old-POS export in. Square, Clover or Toast import file out. Minutes, not days.",
  },
};

const PAINS = [
  {
    icon: Hourglass,
    title: "Hours nobody bills for",
    body: "Hand menu builds commonly run 4 to 20 hours. Your install team, your agent or the merchant eats every one of them.",
  },
  {
    icon: Clock,
    title: "Go-lives that slip",
    body: "The app's approved, the hardware's shipped, and the merchant still isn't running cards because the menu isn't in. That's where deals cancel.",
  },
  {
    icon: Repeat,
    title: "POS switches that stall",
    body: "The best deals come off another POS. Then the owner hears \"we'll need to rebuild your menu\" and the deal sits.",
  },
];

const STEPS = [
  { icon: Camera, title: "Snap it at the table", body: "Phone photos of the printed menu, a PDF, a spreadsheet or the old POS's export. Multiple pages at once." },
  { icon: Wand2, title: "It builds the menu", body: "Categories, items, sizes, modifier groups with min/max and tax hints. About a minute for most menus." },
  { icon: ScanLine, title: "Fix what's flagged", body: "Anything it isn't sure about is marked. Tap to fix on your phone. Nothing ships you didn't see." },
  { icon: FileSpreadsheet, title: "Download the import file", body: "Formatted for the POS you're installing: Clover, Square or Toast. Pay when you download." },
];

const COMPARE: { label: string; time: string; cost: string; pos: string; who: string; us?: boolean }[] = [
  { label: "Typing it by hand", time: "4–20 hours", cost: "Your team's time", pos: "Any", who: "Your installer, agent or the owner" },
  { label: "POS vendor menu build", time: "Days in a queue", cost: "Bundled, or ~$150/hr at Toast", pos: "That vendor's POS only", who: "The vendor's onboarding team" },
  { label: "Built-in AI importers", time: "Minutes to ~24 hours", cost: "Free", pos: "Own POS only (Square, Lightspeed, Aldelo)", who: "The merchant" },
  { label: "Freelancer (Fiverr, Upwork)", time: "1–3 days", cost: "~$50–300 a menu", pos: "Depends on the freelancer", who: "Someone you have to manage" },
  { label: "Fast POS Menu", time: "Minutes", cost: "$49 a menu (~$15 on Pro)", pos: "Clover, Square, Toast", who: "You, on your phone", us: true },
];

const WHO = [
  {
    icon: Users,
    title: "ISOs",
    body: "Take menu builds off your install team's plate. More boards per week with the same people, and merchants processing sooner.",
  },
  {
    icon: BadgeCheck,
    title: "Sales agents",
    body: "Build the menu in the meeting. \"Hand me your menu, give me two minutes\" closes better than \"onboarding will reach out.\"",
  },
  {
    icon: Wrench,
    title: "POS resellers and installers",
    body: "Start every install from a clean draft in the right format. Your techs check and finish. Quote the install, not the hours.",
  },
  {
    icon: Store,
    title: "POS switches",
    body: "Moving a merchant from Toast to Square, or Square to Clover? Upload the old POS's export or photos of the menu. Nothing gets retyped.",
  },
];

const FAQ = [
  [
    "Square already has a free menu import. Why pay?",
    "Square's import only builds Square menus and says most builds take up to a day. If you board on Clover or Toast, or you're moving a merchant off Square, it doesn't help. This does all three in minutes.",
  ],
  [
    "Our onboarding team already builds menus.",
    "Keep them. They start from a finished draft in the right import format and only check it. Same people, more installs.",
  ],
  [
    "What if it reads something wrong?",
    "You review every item before you pay. Anything it's unsure of is flagged so you know where to look, and edits take seconds on a phone.",
  ],
  [
    "Will the file import clean?",
    "Each file follows that POS's published import layout: Clover's inventory workbook, Square's item library sheet, and Toast's bulk-import sheet plus a menu-build workbook. Formats are in beta while we confirm them against real accounts, so check the import preview. If something doesn't go in, tell us and we'll fix it.",
  ],
  [
    "Can it pull the menu from DoorDash or Uber Eats?",
    "No. Those sites don't allow automated access. Screenshot the page and upload the screenshots. It reads them the same as a photo.",
  ],
  [
    "We sell SkyTab, Heartland or SpotOn.",
    "Those are next on the list. Today, a structured menu from us is still a much faster start for their programming team than a stack of photos.",
  ],
  [
    "What does it cost at volume?",
    "$49 a menu today, paid at download. Pro is $149 a month for 10 builds (about $15 a menu, extra builds $15) and is coming soon. Running a team? Ask about promo codes for your agents.",
  ],
  [
    "Is merchant data safe?",
    <>
      It&apos;s a restaurant menu, not cardholder data, and checkout is hosted by Stripe, so no card data ever touches the product. Uploads are
      only used to build that menu: they&apos;re read by our AI provider and not stored, and the draft lives in your browser. Details in our{" "}
      <Link href="/privacy" className="font-semibold text-ink underline decoration-line underline-offset-4">
        privacy policy
      </Link>
      .
    </>,
  ],
] as const;

export default function ForIsosPage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <Container>
        <section className="grid items-center gap-10 py-10 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div className="animate-rise">
            <Pill>For ISOs, agents and POS resellers</Pill>
            <h1 className="mt-5 text-[40px] font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Board the restaurant.
              <br />
              <span className="font-serif font-normal italic tracking-[-0.01em]">Skip the menu build.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted">
              Snap the menu the merchant already has. Get an import file for Clover, Square or Toast in minutes, not days. Merchants run their first
              card sooner.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryCta>Try it on your next board</PrimaryCta>
              <SecondaryCta href="/pricing">$49 a menu · Pricing</SecondaryCta>
            </div>
            <p className="mt-4 text-sm text-muted">Build and review free. Pay when you download.</p>
          </div>
          <MenuDemo title="RIVERBEND" label="Clover import" rows={DEMO_TACOS} />
        </section>
      </Container>

      {/* Pain */}
      <Container className="py-12">
        <SectionHead
          eyebrow="The problem"
          title="The menu is where installs stall."
          sub="Every restaurant you board needs a menu in the POS before it can run a card. Somebody has to build it."
        />
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {PAINS.map(({ icon: Icon, title, body }) => (
            <Card key={title}>
              <IconTile>
                <Icon className="size-5" />
              </IconTile>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-1 leading-relaxed text-muted">{body}</p>
            </Card>
          ))}
        </div>
      </Container>

      {/* How it works */}
      <Container className="py-12">
        <SectionHead eyebrow="How it works" title="From the menu on the counter to an import file." sub="Built to run from a phone, in the parking lot if you have to." />
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="rounded-xl bg-surface p-5 border border-line">
              <div className="flex items-center justify-between">
                <IconTile>
                  <Icon className="size-5" />
                </IconTile>
                <span className="text-sm font-semibold text-muted tabular-nums">0{i + 1}</span>
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
            </li>
          ))}
        </ol>
      </Container>

      {/* Comparison */}
      <Container className="py-12">
        <SectionHead eyebrow="Your options today" title="How menus get built now." />
        {/* Cards on phones, table on desktop. */}
        <div className="mt-8 grid gap-3 md:hidden">
          {COMPARE.map((r) => (
            <Card key={r.label} dark={r.us}>
              <p className={r.us ? "font-semibold text-brand" : "font-semibold"}>{r.label}</p>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                <dt className={r.us ? "text-white/60" : "text-muted"}>Time</dt>
                <dd className="font-semibold">{r.time}</dd>
                <dt className={r.us ? "text-white/60" : "text-muted"}>Cost</dt>
                <dd className="font-semibold">{r.cost}</dd>
                <dt className={r.us ? "text-white/60" : "text-muted"}>POS</dt>
                <dd className="font-semibold">{r.pos}</dd>
                <dt className={r.us ? "text-white/60" : "text-muted"}>Who</dt>
                <dd className="font-semibold">{r.who}</dd>
              </dl>
            </Card>
          ))}
        </div>
        <div className="mt-8 hidden overflow-hidden rounded-xl bg-surface border border-line md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg text-muted">
              <tr>
                <th className="p-4 font-semibold"> </th>
                <th className="p-4 font-semibold">Time per menu</th>
                <th className="p-4 font-semibold">Cost</th>
                <th className="p-4 font-semibold">Works for</th>
                <th className="p-4 font-semibold">Who does the work</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {COMPARE.map((r) => (
                <tr key={r.label} className={r.us ? "bg-ink text-white" : undefined}>
                  <th className={r.us ? "p-4 font-semibold text-brand" : "p-4 font-semibold"}>{r.label}</th>
                  <td className="p-4">{r.time}</td>
                  <td className="p-4">{r.cost}</td>
                  <td className="p-4">{r.pos}</td>
                  <td className="p-4">{r.who}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">
          Hand-build hours are what operators report, not a study. Toast rate from Toast&apos;s published professional-services pricing; freelancer range
          from public gig listings. Checked November 2026.
        </p>
      </Container>

      {/* Who */}
      <Container className="py-12">
        <SectionHead eyebrow="Who it's for" title="Built for the people who board restaurants." />
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {WHO.map(({ icon: Icon, title, body }) => (
            <Card key={title}>
              <div className="flex items-start gap-4">
                <IconTile>
                  <Icon className="size-5" />
                </IconTile>
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-1 leading-relaxed text-muted">{body}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-muted">
          Installing a specific POS? See{" "}
          <Link href="/clover" className="font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
            Clover
          </Link>
          ,{" "}
          <Link href="/square" className="font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
            Square
          </Link>{" "}
          or{" "}
          <Link href="/toast" className="font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
            Toast
          </Link>
          .
        </p>
      </Container>

      {/* Proof */}
      <Container className="py-12">
        <div className="grid gap-8 rounded-2xl border border-line bg-surface p-6 sm:p-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <SectionHead eyebrow="Tested, not hyped" title="13 for 13 on our sample menu." sub="Read from a phone photo and from a PDF, about 20 seconds each." />
          <div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["13/13", "items"],
                ["13/13", "prices"],
                ["3/3", "modifier groups"],
                ["~20s", "per read"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-2xl bg-surface px-4 py-3 border border-line">
                  <div className="text-2xl font-semibold tabular-nums">{v}</div>
                  <div className="text-sm text-muted">{l}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              That&apos;s a clean, 13-item test menu with sizes, a market price and modifier groups. Real menus are messier and bigger, which is
              exactly why every build has a review step with flagged items, and why you only pay once it&apos;s right.
            </p>
          </div>
        </div>
      </Container>

      {/* Pricing teaser */}
      <Container className="py-12">
        <SectionHead eyebrow="Pricing" title="Priced like a tool, not a project." />
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <Card>
            <p className="font-semibold text-muted">Per menu</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight">
              $49 <span className="text-base font-medium text-muted">/ menu</span>
            </p>
            <p className="mt-2 text-muted">Less than an hour of anyone&apos;s time. Build and review free; pay when you download.</p>
          </Card>
          <Card dark>
            <p className="font-semibold text-white/70">Pro · coming soon</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight">
              $149 <span className="text-base font-medium text-white/70">/ month</span>
            </p>
            <p className="mt-2 text-white/70">10 builds a month, about $15 a menu. Extra builds $15. For shops boarding every month.</p>
          </Card>
        </div>
      </Container>

      {/* FAQ */}
      <Container className="py-12">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight">Questions agents ask</h2>
          <div className="mt-5">
            <Faq items={FAQ} />
          </div>
        </div>
      </Container>

      <CtaBand
        title="Try it on your next board."
        sub="Upload the menu, review it, and only pay when the import file is right."
        cta="Build a menu"
      />
    </MarketingShell>
  );
}
