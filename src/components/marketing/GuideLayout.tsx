import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { GUIDES, type GuideMeta } from "@/content/guides";
import { Container, CtaBand, MarketingShell } from "./site";

const fmtDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

/** Long-form styles without a typography plugin. */
const PROSE = [
  "text-[17px] leading-relaxed text-ink/90",
  "[&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:tracking-tight [&_h2]:text-ink",
  "[&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-ink",
  "[&_p]:mt-4 [&_ul]:mt-4 [&_ol]:mt-4",
  "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6",
  "[&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-ink",
  "[&_a]:font-semibold [&_a]:text-brand-ink [&_a]:underline [&_a]:decoration-brand/30 [&_a]:underline-offset-4 hover:[&_a]:decoration-brand",
  "[&_code]:rounded [&_code]:bg-ink/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[15px]",
  "[&_table]:mt-5 [&_table]:w-full [&_table]:text-left [&_table]:text-[15px] [&_th]:border-b [&_th]:border-line [&_th]:py-2 [&_th]:pr-4 [&_th]:font-semibold",
  "[&_td]:border-b [&_td]:border-line [&_td]:py-2 [&_td]:pr-4 [&_td]:align-top",
].join(" ");

export function GuideLayout({
  guide,
  tldr,
  cta,
  children,
}: {
  guide: GuideMeta;
  tldr: ReactNode;
  cta: { title: string; sub: string; label: string };
  children: ReactNode;
}) {
  const related = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        dateModified: guide.updated,
        datePublished: guide.updated,
        author: { "@type": "Organization", name: "Code 85 Labs" },
        publisher: { "@type": "Organization", name: "Fast POS Menu" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Guides", item: "/guides" },
          { "@type": "ListItem", position: 2, name: guide.short, item: `/guides/${guide.slug}` },
        ],
      },
    ],
  };

  return (
    <MarketingShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Container>
        <article className="mx-auto max-w-2xl pt-6 sm:pt-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted">
            <Link href="/guides" className="hover:text-ink">
              Guides
            </Link>
            <ChevronRight className="size-4" />
            <span>{guide.tag}</span>
          </nav>
          <h1 className="mt-4 text-[34px] font-semibold leading-[1.1] tracking-tight sm:text-5xl">{guide.title}</h1>
          <p className="mt-4 text-sm text-muted">
            Updated {fmtDate(guide.updated)} · {guide.readMins} min read
          </p>

          <aside className="mt-8 rounded-xl bg-brand-soft p-5 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-ink">Short version</p>
            <div className="mt-2 leading-relaxed [&_li]:mt-1.5 [&_ul]:list-disc [&_ul]:pl-5">{tldr}</div>
          </aside>

          <div className={PROSE}>{children}</div>

          <p className="mt-12 border-t border-line pt-6 text-xs leading-relaxed text-muted">
            Menu labels and import rules are as of the date above and can change. Square, Clover and Toast are trademarks of their respective owners.
            Fast POS Menu is independent and not affiliated with or endorsed by them. Our import files are in beta while we confirm them against real
            accounts.
          </p>
        </article>
      </Container>

      <CtaBand title={cta.title} sub={cta.sub} cta={cta.label} />

      <Container className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight">More guides</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {related.map((g) => (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}`} className="block h-full rounded-xl bg-surface p-5 border border-line transition hover:ring-ink/20">
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-ink">{g.tag}</span>
                <span className="mt-2 block font-semibold leading-snug">{g.short}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </MarketingShell>
  );
}

/** Inline callout used inside articles. */
export function Callout({ children }: { children: ReactNode }) {
  return <div className="mt-6 rounded-2xl bg-surface p-5 border border-line [&>p:first-child]:mt-0">{children}</div>;
}
