import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { ArrowRight, Camera, FileSpreadsheet, ScanLine, Sparkles, Wand2 } from "lucide-react";

const DEMO = [
  { name: "Street Tacos (3)", price: "11.50", tag: "Protein" },
  { name: "Classic Burrito", price: "12.75", tag: "Protein · Add-ons" },
  { name: "Chips & Salsa", price: "3.50 / 6.00", tag: "Sm · Lg" },
  { name: "Horchata", price: "3.75 / 4.95", tag: "16oz · 24oz" },
  { name: "House Margarita", price: "10.00", tag: "Flavors · up to 2" },
];

const STEPS = [
  { icon: Camera, title: "Snap or upload", body: "Photos, PDF, spreadsheet, or the old POS export. Multiple pages are fine." },
  { icon: Wand2, title: "We build it", body: "Categories, items, sizes, modifiers with min/max, tax hints. In about a minute." },
  { icon: ScanLine, title: "Fix what's flagged", body: "Unsure items are marked. Tap to edit, right on your phone." },
  { icon: FileSpreadsheet, title: "Import", body: "Download a file formatted for Square, Clover, or Toast." },
];

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 sm:px-8">
        <section className="grid items-center gap-10 py-10 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-ink">
              <Sparkles className="size-4" /> For owners, agents and resellers
            </span>
            <h1 className="mt-5 text-[42px] font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Any menu.
              <br />
              Any POS.
              <br />
              <span className="text-brand">In minutes.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted">Stop retyping menus. Snap the one the restaurant has and get a file the POS will import.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/build"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-brand px-7 text-[17px] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(255,90,31,0.7)] transition hover:bg-brand-ink active:scale-[0.98]"
              >
                Build a menu <ArrowRight className="size-5" />
              </Link>
              <Link href="/pricing" className="inline-flex h-14 items-center justify-center rounded-2xl px-5 font-semibold ring-1 ring-line hover:bg-surface">
                $49 a menu · See pricing
              </Link>
              <span className="hidden h-14 items-center justify-center gap-3 text-sm text-muted lg:inline-flex">
                <span className="font-semibold text-ink">Square</span>·<span className="font-semibold text-ink">Clover</span>·
                <span className="font-semibold text-ink">Toast</span>
              </span>
            </div>
          </div>

          {/* Animated demo: a menu page gets scanned into structured rows. */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden>
            <div className="absolute -inset-6 -z-10 rounded-[48px] bg-gradient-to-br from-brand/20 via-brand-soft to-transparent blur-2xl" />
            <div className="grid grid-cols-[0.8fr_1.2fr] gap-3 sm:gap-4">
              <div className="relative overflow-hidden rounded-3xl bg-[#fffaf0] p-4 shadow-xl ring-1 ring-line">
                <p className="text-center font-serif text-[11px] font-bold tracking-widest">RIVERBEND</p>
                <div className="mt-3 space-y-2.5">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <div key={i} className="flex justify-between gap-2">
                      <span className="h-1.5 rounded-full bg-ink/25" style={{ width: `${40 + ((i * 29) % 45)}%` }} />
                      <span className="h-1.5 w-5 rounded-full bg-ink/30" />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-x-0 h-12 animate-scan bg-gradient-to-b from-transparent via-brand/25 to-transparent">
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-brand shadow-[0_0_10px_2px_rgba(255,90,31,0.6)]" />
                </div>
              </div>
              <div className="rounded-3xl bg-surface p-3 shadow-xl ring-1 ring-line sm:p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wide text-muted">Clover import</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">READY</span>
                </div>
                <ul className="space-y-1.5">
                  {DEMO.map((d, i) => (
                    <li key={d.name} className="animate-rise rounded-xl bg-bg px-2.5 py-2" style={{ animationDelay: `${300 + i * 180}ms` }}>
                      <div className="flex items-center justify-between gap-2 text-[13px] font-semibold">
                        <span className="truncate">{d.name}</span>
                        <span className="shrink-0 tabular-nums">{d.price}</span>
                      </div>
                      <div className="text-[11px] text-muted">{d.tag}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="animate-rise rounded-3xl bg-surface p-5 ring-1 ring-line" style={{ animationDelay: `${i * 80}ms` }}>
                <span className="grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <Icon className="size-5" />
                </span>
                <h2 className="mt-4 font-bold">{title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
