"use client";

import { useState } from "react";
import { AlertTriangle, ArrowLeft, Check, Loader2 } from "lucide-react";
import type { Menu } from "@/lib/menu/schema";
import { applyOps, type ApplyResult, type EditPlan } from "@/lib/menu/edit-ops";
import { Button, Sheet, cx, inputCls } from "./ui";

const EXAMPLES = [
  "Raise all prices 5% and round to the nearest quarter",
  "Make Add-Ons optional, up to 3",
  "Move drinks to the end",
  "Add a required side choice to every burger: fries, salad or soup",
  "Mark beer and wine as alcohol",
];

/** "Tell it what to change": plain English → preview of exact changes → apply. */
export default function ChangeSheet({
  open,
  menu,
  onClose,
  onApply,
}: {
  open: boolean;
  menu: Menu;
  onClose: () => void;
  onApply: (next: Menu, summary: string) => void;
}) {
  const [request, setRequest] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ plan: EditPlan; result: ApplyResult } | null>(null);

  const reset = () => {
    setPreview(null);
    setError(null);
  };

  const ask = async () => {
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/revise", { method: "POST", body: JSON.stringify({ menu, request }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Couldn't make that change.");
      const plan = d.plan as EditPlan;
      setPreview({ plan, result: applyOps(menu, plan.ops) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't make that change.");
    } finally {
      setBusy(false);
    }
  };

  const close = () => {
    reset();
    onClose();
  };

  return (
    <Sheet
      open={open}
      onClose={close}
      title={preview ? "Review changes" : "Tell it what to change"}
      footer={
        preview ? (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={reset}>
              <ArrowLeft className="size-4" /> Edit
            </Button>
            <Button
              className="flex-1"
              disabled={!preview.result.changes.length}
              onClick={() => {
                onApply(preview.result.menu, preview.plan.summary);
                setRequest("");
                close();
              }}
            >
              <Check className="size-4" /> Apply {preview.result.changes.length} change{preview.result.changes.length === 1 ? "" : "s"}
            </Button>
          </div>
        ) : (
          <Button className="w-full" size="lg" disabled={!request.trim() || busy} onClick={ask}>
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Working it out…
              </>
            ) : (
              "Preview changes"
            )}
          </Button>
        )
      }
    >
      {!preview ? (
        <div className="space-y-4">
          <p className="text-sm text-muted">Describe the change in plain English. You&apos;ll see exactly what changes before anything is applied.</p>
          <textarea
            autoFocus
            rows={4}
            maxLength={2000}
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="e.g. Raise all prices 5% and round to the nearest quarter"
            className={cx(inputCls, "h-auto py-3 leading-relaxed")}
          />
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Try</p>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLES.map((x) => (
                <button key={x} onClick={() => setRequest(x)} className="rounded-md border border-line bg-surface px-2.5 py-1.5 text-left text-[13px] hover:border-ink/30">
                  {x}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-[15px]">{preview.plan.summary}</p>
          {preview.result.changes.length > 0 ? (
            <ul className="divide-y divide-line rounded-xl border border-line">
              {preview.result.changes.map((c, i) => (
                <li key={i} className="flex gap-3 px-3.5 py-3 text-sm">
                  <span className="font-mono text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg border border-line p-3 text-sm text-muted">No changes to make. Try rewording the request.</p>
          )}
          {(preview.plan.unclear || preview.result.skipped.length > 0) && (
            <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <div className="space-y-1">
                {preview.plan.unclear && <p>{preview.plan.unclear}</p>}
                {preview.result.skipped.map((s, i) => (
                  <p key={i}>{s}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Sheet>
  );
}
