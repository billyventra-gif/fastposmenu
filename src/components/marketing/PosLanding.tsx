import Link from "next/link";
import type { ReactNode } from "react";
import { BookOpen, Camera, Check, FileSpreadsheet, ScanLine, Wand2 } from "lucide-react";
import type { PosTarget } from "@/lib/menu/schema";
import { BetaNote, Card, Container, CtaBand, Faq, IconTile, MarketingShell, Pill, PrimaryCta, SecondaryCta, SectionHead } from "./site";
import { MenuDemo, type DemoRow } from "./MenuDemo";

export type PosLandingProps = {
  pos: PosTarget;
  name: string;
  h1: ReactNode;
  sub: string;
  demo: { title: string; rows: DemoRow[] };
  /** What's in the download. */
  files: { title: string; body: string }[];
  /** POS-specific details we handle so the user doesn't have to. */
  handles: string[];
  /** Where the file goes in the POS (as of today's labels). */
  importSteps: string[];
  guide: { href: string; title: string };
  faq: readonly (readonly [string, ReactNode])[];
};

const FLOW = [
  { icon: Camera, title: "Upload", body: "Photos, PDF, spreadsheet or another POS's export." },
  { icon: Wand2, title: "Build", body: "Categories, items, sizes and modifier groups with min/max." },
  { icon: ScanLine, title: "Review", body: "Fix anything flagged, on your phone." },
  { icon: FileSpreadsheet, title: "Download", body: "The import file, formatted for this POS." },
];

export function PosLanding(p: PosLandingProps) {
  return (
    <MarketingShell>
      <Container>
        <section className="grid items-center gap-10 py-10 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div className="animate-rise">
            <Pill>{p.name} menu import</Pill>
            <h1 className="mt-5 text-[40px] font-semibold leading-[1.05] tracking-tight sm:text-6xl">{p.h1}</h1>
            <p className="mt-5 max-w-lg text-lg text-muted">{p.sub}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryCta>Build a {p.name} menu</PrimaryCta>
              <SecondaryCta href="/pricing">$49 a menu · Pricing</SecondaryCta>
            </div>
            <p className="mt-4 text-sm text-muted">Build and review free. Pay when you download.</p>
          </div>
          <MenuDemo title={p.demo.title} label={`${p.name} import`} rows={p.demo.rows} />
        </section>
      </Container>

      <Container className="py-10">
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FLOW.map(({ icon: Icon, title, body }) => (
            <li key={title} className="rounded-xl bg-surface p-5 border border-line">
              <IconTile>
                <Icon className="size-5" />
              </IconTile>
              <h2 className="mt-4 font-semibold">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
            </li>
          ))}
        </ol>
      </Container>

      <Container className="py-12">
        <SectionHead eyebrow="What you download" title={`Files built for ${p.name}'s import.`} />
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {p.files.map((f) => (
            <Card key={f.title}>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 leading-relaxed text-muted">{f.body}</p>
            </Card>
          ))}
        </div>
        <div className="mt-4">
          <BetaNote pos={p.name} />
        </div>
      </Container>

      <Container className="py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow="The fiddly parts" title={`What we handle for ${p.name}`} />
            <ul className="mt-6 space-y-3">
              {p.handles.map((h) => (
                <li key={h} className="flex gap-3">
                  <Check className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                  <span className="leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">Then, in {p.name}</p>
            <ol className="mt-4 space-y-3">
              {p.importSteps.map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-brand-ink">{i + 1}</span>
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-muted">Menu labels as of November 2026. {p.name} changes them now and then.</p>
            <Link href={p.guide.href} className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-ink hover:underline">
              <BookOpen className="size-4" /> {p.guide.title}
            </Link>
          </Card>
        </div>
      </Container>

      <Container className="py-12">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight">{p.name} questions</h2>
          <div className="mt-5">
            <Faq items={p.faq} />
          </div>
          <p className="mt-6 text-muted">
            Board restaurants for a living?{" "}
            <Link href="/for-isos" className="font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
              See how ISOs and agents use it
            </Link>
            .
          </p>
        </div>
      </Container>

      <CtaBand title={`Your next ${p.name} menu, in minutes.`} sub="Snap it, check it, download it." cta={`Build a ${p.name} menu`} />
    </MarketingShell>
  );
}
