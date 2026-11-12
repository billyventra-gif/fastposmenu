import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GUIDES } from "@/content/guides";
import { Container, CtaBand, MarketingShell } from "@/components/marketing/site";

export const metadata: Metadata = {
  title: "POS menu guides for Square, Clover and Toast · Fast POS Menu",
  description:
    "Plain-English guides to importing a restaurant menu into Square, Clover and Toast, and moving a menu from one POS to another.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <MarketingShell>
      <Container>
        <section className="animate-rise py-10 sm:py-14">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Menu import guides</h1>
          <p className="mt-3 max-w-xl text-lg text-muted">
            How menus actually get into Square, Clover and Toast, and how to move one between them. Written for agents, installers and owners.
          </p>
        </section>
        <ul className="grid gap-3 md:grid-cols-2">
          {GUIDES.map((g, i) => (
            <li key={g.slug} className="animate-rise" style={{ animationDelay: `${i * 60}ms` }}>
              <Link
                href={`/guides/${g.slug}`}
                className="group flex h-full flex-col rounded-3xl bg-surface p-6 ring-1 ring-line transition hover:ring-ink/20"
              >
                <span className="text-xs font-bold uppercase tracking-wide text-brand-ink">{g.tag}</span>
                <h2 className="mt-2 text-xl font-bold leading-snug">{g.title}</h2>
                <p className="mt-2 flex-1 leading-relaxed text-muted">{g.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                  Read · {g.readMins} min <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
      <CtaBand title="Skip the guide. Build the menu." sub="Upload the menu, review it, download the import file." />
    </MarketingShell>
  );
}
