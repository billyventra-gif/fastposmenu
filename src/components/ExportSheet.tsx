"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, CheckCircle2, Download, FileJson, FileSpreadsheet, Info, Loader2, Lock, Tag } from "lucide-react";
import type { Menu } from "@/lib/menu/schema";
import type { Issue } from "@/lib/menu/normalize";
import { POS_INFO } from "@/lib/export/registry";
import { PER_MENU, fmtUsd } from "@/lib/billing/plans";
import { readUtm } from "./UtmCapture";
import { Button, Sheet, cx } from "./ui";

type ExportFile = { filename: string; mime: string; base64: string };
type ExportResponse = { issues: Issue[]; steps: string[]; files: ExportFile[]; error?: string; needsPayment?: boolean };

function download(f: ExportFile) {
  const bytes = Uint8Array.from(atob(f.base64), (c) => c.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type: f.mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = f.filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ExportSheet({
  open,
  menu,
  draftId,
  paidSessionId,
  onClose,
}: {
  open: boolean;
  menu: Menu;
  draftId: string;
  paidSessionId?: string;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [res, setRes] = useState<ExportResponse | null>(null);
  const info = POS_INFO[menu.target];

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kick off export when the sheet opens
    setBusy(true);
    setRes(null);
    fetch("/api/export", { method: "POST", body: JSON.stringify({ menu, draftId, paidSessionId }) })
      .then((r) => r.json())
      .then((d) => !cancelled && setRes({ issues: [], steps: [], files: [], ...d }))
      .catch(() => !cancelled && setRes({ issues: [], steps: [], files: [], error: "Couldn't build the file. Try again." }))
      .finally(() => !cancelled && setBusy(false));
    return () => {
      cancelled = true;
    };
    // Rebuild only when the sheet opens; edits happen with the sheet closed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const checkout = async () => {
    setPaying(true);
    setPayError(null);
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ draftId, target: menu.target, restaurantName: menu.restaurantName, itemCount: menu.items.length, utm: readUtm() }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.url) throw new Error(d.error || "Couldn't start checkout.");
      window.location.href = d.url;
    } catch (e) {
      setPayError(e instanceof Error ? e.message : "Couldn't start checkout.");
      setPaying(false);
    }
  };

  const errors = res?.issues.filter((i) => i.level === "error") ?? [];
  const warns = res?.issues.filter((i) => i.level === "warn") ?? [];
  const bullets = res?.steps.filter((s) => s.startsWith("•")) ?? [];
  const steps = res?.steps.filter((s) => !s.startsWith("•")) ?? [];

  return (
    <Sheet open={open} onClose={onClose} title={`Export to ${info.label}`}>
      {busy && (
        <div className="flex flex-col items-center py-12 text-center">
          <Loader2 className="size-8 animate-spin text-brand" />
          <p className="mt-3 font-medium">Building your {info.label} file…</p>
        </div>
      )}

      {!busy && res?.needsPayment && (
        <div className="animate-rise space-y-5">
          <div className="rounded-3xl bg-ink p-5 text-white">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Lock className="size-4" /> Your file is ready to unlock
            </div>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-4xl font-semibold">{fmtUsd(PER_MENU.priceCents)}</span>
              <span className="pb-1 text-white/70">this menu</span>
            </div>
            <p className="mt-1 text-sm text-white/70">
              {menu.items.length} items → {info.label}. One-time. Re-download anytime.
            </p>
          </div>
          <ul className="space-y-2 text-sm">
            {PER_MENU.features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="size-4 text-emerald-600" /> {f}
              </li>
            ))}
          </ul>
          {payError && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{payError}</p>}
          <Button size="lg" className="w-full" onClick={checkout} disabled={paying}>
            {paying ? <Loader2 className="size-5 animate-spin" /> : null}
            Pay {fmtUsd(PER_MENU.priceCents)} and download
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
            <Tag className="size-3.5" /> Have a promo code? Enter it on the next screen. Secure checkout by Stripe.
          </p>
        </div>
      )}

      {!busy && res?.error && !res.needsPayment && <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{res.error}</p>}

      {!busy && errors.length > 0 && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-800 ring-1 ring-red-200">
          <p className="font-semibold">Fix these first</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errors.map((e, i) => (
              <li key={i}>{e.message}</li>
            ))}
          </ul>
        </div>
      )}

      {!busy && res && res.files.length > 0 && (
        <div className="animate-rise space-y-6">
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-900 ring-1 ring-emerald-200">
            <CheckCircle2 className="size-6 shrink-0" />
            <p className="font-semibold">Ready. Download, then follow the steps below.</p>
          </div>

          <div className="space-y-2">
            {res.files.map((f, i) => {
              const Icon = f.filename.endsWith(".json") ? FileJson : FileSpreadsheet;
              return (
                <button
                  key={f.filename}
                  onClick={() => download(f)}
                  className={cx(
                    "flex w-full items-center gap-3 rounded-2xl p-3.5 text-left transition active:scale-[0.99]",
                    i === 0 ? "bg-ink text-white" : "bg-surface ring-1 ring-line",
                  )}
                >
                  <span className={cx("grid size-11 shrink-0 place-items-center rounded-xl", i === 0 ? "bg-white/15" : "bg-bg")}>
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{f.filename}</span>
                    <span className={cx("block text-xs", i === 0 ? "text-white/70" : "text-muted")}>
                      {i === 0 ? info.fileLabel : "For API push (coming soon)"}
                    </span>
                  </span>
                  <Download className="size-5 shrink-0" />
                </button>
              );
            })}
          </div>

          <div>
            <p className="font-semibold">Next steps</p>
            <ol className="mt-3 space-y-3">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand-ink">{i + 1}</span>
                  <div className="text-sm leading-relaxed">
                    {s}
                    {i === 0 && bullets.length > 0 && (
                      <ul className="mt-2 space-y-1.5 rounded-2xl bg-bg p-3">
                        {bullets.map((b, j) => (
                          <li key={j} className="text-[13px]">
                            {b.replace(/^•\s*/, "")}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {warns.length > 0 && (
            <details className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-950 ring-1 ring-amber-200">
              <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold">
                <AlertTriangle className="size-4" /> {warns.length} thing{warns.length > 1 ? "s" : ""} to double-check
              </summary>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {warns.map((w, i) => (
                  <li key={i}>{w.message}</li>
                ))}
              </ul>
            </details>
          )}

          {!info.verified && (
            <p className="flex gap-2 text-xs leading-relaxed text-muted">
              <Info className="mt-0.5 size-4 shrink-0" />
              <span>
                <b>Beta format.</b> {info.verifyNote}
              </span>
            </p>
          )}

          <Button variant="secondary" className="w-full" onClick={onClose}>
            Back to menu
          </Button>
        </div>
      )}
    </Sheet>
  );
}
