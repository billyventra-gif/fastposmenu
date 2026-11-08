"use client";

import { useState } from "react";
import type { Menu } from "@/lib/menu/schema";
import type { Issue } from "@/lib/menu/normalize";
import { POS_INFO } from "@/lib/export/registry";

type ExportResponse = {
  issues: Issue[];
  steps: string[];
  files: { filename: string; mime: string; base64: string }[];
  error?: string;
};

function download(f: { filename: string; mime: string; base64: string }) {
  const bytes = Uint8Array.from(atob(f.base64), (c) => c.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type: f.mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = f.filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ExportPanel({ menu }: { menu: Menu }) {
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<ExportResponse | null>(null);
  const info = POS_INFO[menu.target];

  const run = async () => {
    setBusy(true);
    try {
      const r = await fetch("/api/export", { method: "POST", body: JSON.stringify({ menu }) });
      setRes(await r.json());
    } finally {
      setBusy(false);
    }
  };

  const errors = res?.issues.filter((i) => i.level === "error") ?? [];
  const warns = res?.issues.filter((i) => i.level === "warn") ?? [];

  return (
    <section className="mt-10 rounded-xl border-2 border-brand/40 bg-white p-4" id="export">
      <h2 className="text-xl font-bold">Export for {info.label}</h2>
      <p className="text-sm text-neutral-600">{info.fileLabel}</p>
      {!info.verified && (
        <p className="mt-2 rounded-lg bg-neutral-100 px-3 py-2 text-xs text-neutral-700">
          <b>Beta format.</b> {info.verifyNote}
        </p>
      )}

      {/* Sticky on mobile so export is always one tap away. */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-neutral-200 bg-white/95 p-3 backdrop-blur sm:static sm:mt-4 sm:border-0 sm:bg-transparent sm:p-0">
        <button onClick={run} disabled={busy} className="mx-auto block h-12 w-full max-w-3xl rounded-lg bg-brand font-semibold text-white disabled:opacity-50">
          {busy ? "Building file…" : `Get ${info.label} import file`}
        </button>
      </div>

      {res?.error && <p className="mt-3 text-sm text-red-700">{res.error}</p>}

      {errors.length > 0 && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
          <p className="font-semibold">Fix these first</p>
          <ul className="mt-1 list-disc pl-5">
            {errors.map((e, i) => (
              <li key={i}>{e.message}</li>
            ))}
          </ul>
        </div>
      )}

      {res && res.files.length > 0 && (
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            {res.files.map((f) => (
              <button key={f.filename} onClick={() => download(f)} className="flex w-full items-center justify-between rounded-lg border border-neutral-300 px-4 py-3 text-left text-sm hover:border-brand">
                <span className="truncate font-medium">{f.filename}</span>
                <span className="text-brand">Download</span>
              </button>
            ))}
          </div>
          <div>
            <p className="font-semibold">Next steps</p>
            <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm">
              {res.steps.filter((s) => !s.startsWith("•")).map((s, i) => (
                <li key={i}>
                  {s}
                  {i === 0 && res.steps.some((x) => x.startsWith("•")) && (
                    <ul className="mt-1 space-y-0.5 text-neutral-700">
                      {res.steps.filter((x) => x.startsWith("•")).map((x, j) => (
                        <li key={j}>{x}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </div>
          {warns.length > 0 && (
            <details className="text-sm">
              <summary className="cursor-pointer font-semibold text-amber-800">{warns.length} things to double-check</summary>
              <ul className="mt-1 list-disc pl-5 text-amber-900">
                {warns.map((w, i) => (
                  <li key={i}>{w.message}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </section>
  );
}
