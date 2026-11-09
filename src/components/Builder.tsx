"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Menu, POS_TARGETS, emptyMenu, type PosTarget } from "@/lib/menu/schema";
import { POS_INFO } from "@/lib/export/registry";
import Uploader from "./Uploader";
import Review from "./Review";
import { PosMark, cx } from "./ui";

const DRAFT_KEY = "fpm:draft:v1";
type Step = "pos" | "upload" | "review";
const STEPS: { id: Step; label: string }[] = [
  { id: "pos", label: "Pick POS" },
  { id: "upload", label: "Add menu" },
  { id: "review", label: "Review & export" },
];

export default function Builder() {
  const [target, setTarget] = useState<PosTarget | null>(null);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [step, setStep] = useState<Step>("pos");
  const [loaded, setLoaded] = useState(false);

  // Restore a draft saved on this device.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = Menu.safeParse(JSON.parse(raw));
        if (parsed.success && parsed.data.items.length) {
          /* eslint-disable react-hooks/set-state-in-effect -- one-time restore from localStorage */
          setMenu(parsed.data);
          setTarget(parsed.data.target);
          setStep("review");
          /* eslint-enable react-hooks/set-state-in-effect */
        }
      }
    } catch {
      /* ignore bad drafts */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded && menu) localStorage.setItem(DRAFT_KEY, JSON.stringify(menu));
  }, [menu, loaded]);

  const startOver = () => {
    if (menu?.items.length && !confirm("Start over? This clears the current menu.")) return;
    localStorage.removeItem(DRAFT_KEY);
    setMenu(null);
    setStep("pos");
  };

  const at = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="grid size-7 place-items-center rounded-lg bg-brand text-sm text-white">F</span>
            <span className="hidden sm:inline">Fast POS Menu</span>
          </Link>
          <ol className="flex items-center gap-1.5 text-xs font-medium sm:gap-2 sm:text-sm">
            {STEPS.map((s, i) => (
              <li key={s.id} className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className={cx(
                    "grid size-6 place-items-center rounded-full text-[11px] font-bold transition",
                    i < at && "bg-ink text-white",
                    i === at && "bg-brand text-white",
                    i > at && "bg-line text-muted",
                  )}
                >
                  {i + 1}
                </span>
                <span className={cx(i === at ? "text-ink" : "hidden text-muted md:inline")}>{s.label}</span>
                {i < STEPS.length - 1 && <span className="h-px w-3 bg-line sm:w-6" />}
              </li>
            ))}
          </ol>
          {step !== "pos" ? (
            <button onClick={startOver} className="flex items-center gap-1 rounded-full px-2 py-1 text-sm text-muted hover:bg-ink/5" aria-label="Start over">
              <RotateCcw className="size-4" />
              <span className="hidden sm:inline">Start over</span>
            </button>
          ) : (
            <span className="w-8" />
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-36 pt-6 sm:px-6 sm:pt-10">
        {step === "pos" && (
          <section className="mx-auto max-w-3xl animate-rise">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Where&apos;s this menu going?</h1>
            <p className="mt-2 text-muted">Pick the POS. You can switch later.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {POS_TARGETS.map((p, i) => (
                <button
                  key={p}
                  style={{ animationDelay: `${i * 60}ms` }}
                  onClick={() => {
                    setTarget(p);
                    if (menu) setMenu({ ...menu, target: p });
                    setStep(menu?.items.length ? "review" : "upload");
                  }}
                  className={cx(
                    "group flex animate-rise items-center gap-4 rounded-3xl bg-surface p-4 text-left ring-1 transition hover:-translate-y-0.5 hover:shadow-lg sm:flex-col sm:items-start sm:p-5",
                    target === p ? "ring-2 ring-brand" : "ring-line",
                  )}
                >
                  <PosMark pos={p} className="size-14 shrink-0 text-2xl" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-lg font-bold">
                      {POS_INFO[p].label}
                      <ArrowRight className="size-4 text-muted transition group-hover:translate-x-1 group-hover:text-brand sm:hidden" />
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-muted">{POS_INFO[p].blurb}</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted">Heartland, SpotOn, SkyTab and more are coming.</p>
          </section>
        )}

        {step === "upload" && target && (
          <Uploader
            target={target}
            onBack={() => setStep("pos")}
            onManual={() => {
              setMenu(emptyMenu(target));
              setStep("review");
            }}
            onDone={(m) => {
              setMenu(m);
              setStep("review");
            }}
          />
        )}

        {step === "review" && menu && <Review menu={menu} onChange={setMenu} onChangePos={() => setStep("pos")} />}
      </main>
    </div>
  );
}
