"use client";

import { useState, useSyncExternalStore } from "react";
import { Loader2 } from "lucide-react";
import { openBillingPortal, readProSession } from "@/lib/billing/device";
import { readUtm } from "./UtmCapture";

const noop = () => () => {};

/** Pro buttons on the pricing card: start a subscription, or manage it on this device. */
export default function ProCta() {
  const hasPro = useSyncExternalStore(noop, () => !!readProSession(), () => false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ utm: readUtm() }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.url) throw new Error(d.error || "Couldn't start checkout.");
      window.location.href = d.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't start checkout.");
      setBusy(false);
    }
  };
  const manage = async () => {
    setError(null);
    const err = await openBillingPortal();
    if (err) setError(err);
  };

  return (
    <div>
      {hasPro ? (
        <button onClick={manage} className="inline-flex h-12 items-center rounded-lg bg-white px-5 text-[15px] font-medium text-ink">
          Manage billing
        </button>
      ) : (
        <button onClick={start} disabled={busy} className="inline-flex h-12 items-center gap-2 rounded-lg bg-white px-5 text-[15px] font-medium text-ink disabled:opacity-60">
          {busy && <Loader2 className="size-4 animate-spin" />} Start Pro
        </button>
      )}
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
    </div>
  );
}
