"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, POS_TARGETS, emptyMenu, type PosTarget } from "@/lib/menu/schema";
import { POS_INFO } from "@/lib/export/registry";
import Uploader from "./Uploader";
import MenuEditor from "./MenuEditor";
import ExportPanel from "./ExportPanel";

const DRAFT_KEY = "fpm:draft:v1";

type Step = "pos" | "upload" | "review";

export default function Builder() {
  const [target, setTarget] = useState<PosTarget | null>(null);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [step, setStep] = useState<Step>("pos");
  const [loaded, setLoaded] = useState(false);

  // Restore a draft on this device. (Supabase sync is the next step; see README.)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = Menu.safeParse(JSON.parse(raw));
        if (parsed.success && parsed.data.items.length) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from localStorage
          setMenu(parsed.data);
          setTarget(parsed.data.target);
          setStep("review");
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

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-32 pt-5">
      <header className="mb-5 flex items-center justify-between">
        <Link href="/" className="font-bold">
          Fast POS Menu
        </Link>
        {step !== "pos" && (
          <button onClick={startOver} className="text-sm text-neutral-500 underline">
            Start over
          </button>
        )}
      </header>

      <Steps step={step} />

      {step === "pos" && (
        <section>
          <h1 className="text-2xl font-bold">Which POS is this going into?</h1>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {POS_TARGETS.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setTarget(p);
                  if (menu) setMenu({ ...menu, target: p });
                  setStep(menu?.items.length ? "review" : "upload");
                }}
                className={`rounded-xl border bg-white p-4 text-left hover:border-brand ${
                  target === p ? "border-brand ring-2 ring-brand/30" : "border-neutral-200"
                }`}
              >
                <span className="text-lg font-semibold">{POS_INFO[p].label}</span>
                <span className="mt-1 block text-sm text-neutral-600">{POS_INFO[p].fileLabel}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-neutral-500">Clover, Heartland, SpotOn, SkyTab and more are on the list.</p>
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

      {step === "review" && menu && (
        <>
          <MenuEditor menu={menu} onChange={setMenu} onChangePos={() => setStep("pos")} />
          <ExportPanel menu={menu} />
        </>
      )}
    </div>
  );
}

function Steps({ step }: { step: Step }) {
  const all: [Step, string][] = [
    ["pos", "POS"],
    ["upload", "Menu"],
    ["review", "Review & export"],
  ];
  const at = all.findIndex(([s]) => s === step);
  return (
    <ol className="mb-6 flex gap-2 text-xs font-medium">
      {all.map(([s, label], i) => (
        <li
          key={s}
          className={`flex-1 rounded-full px-3 py-1.5 text-center ${
            i <= at ? "bg-brand text-white" : "bg-neutral-200 text-neutral-600"
          }`}
        >
          {label}
        </li>
      ))}
    </ol>
  );
}
