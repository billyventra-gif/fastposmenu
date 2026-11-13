"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowRight, Minus, Plus } from "lucide-react";
import type { Menu } from "@/lib/menu/schema";
import { applyOps, type EditOp } from "@/lib/menu/edit-ops";
import { formatCents } from "@/lib/menu/money";
import { Button, Sheet, cx, inputCls } from "./ui";

type Round = Extract<EditOp, { op: "adjust_prices" }>["round"];
const ROUNDS: [Round, string][] = [
  ["none", "Exact"],
  ["nickel", "$0.05"],
  ["quarter", "$0.25"],
  ["dollar", "$1"],
  ["ends_99", ".99"],
];

function Segment<T extends string>({ value, options, onChange, className }: { value: T; options: [T, ReactNode][]; onChange: (v: T) => void; className?: string }) {
  return (
    <div className={cx("flex gap-1 rounded-xl bg-ink/5 p-1", className)}>
      {options.map(([v, label]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={cx("flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition", value === v ? "bg-surface shadow-sm" : "text-muted")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/** Bulk price increase/decrease. No AI: code does the math, with a live preview. */
export default function PriceSheet({
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
  const [dir, setDir] = useState<"up" | "down">("up");
  const [mode, setMode] = useState<"percent" | "amount">("percent");
  const [amount, setAmount] = useState("5");
  const [scope, setScope] = useState<string>("all");
  const [round, setRound] = useState<Round>("none");
  const [mods, setMods] = useState(false);

  const cats = useMemo(() => [...menu.categories].sort((a, b) => a.sortOrder - b.sortOrder), [menu.categories]);
  const n = Number(amount);
  const valid = Number.isFinite(n) && n > 0 && (mode === "amount" || n < (dir === "down" ? 100 : 1000));

  const result = useMemo(() => {
    if (!valid) return null;
    const op: EditOp = {
      op: "adjust_prices",
      scope: scope === "all" ? { all: true, category_ids: [], item_ids: [] } : { all: false, category_ids: [scope], item_ids: [] },
      mode,
      value: dir === "up" ? n : -n,
      round,
      include_modifiers: mods,
    };
    return applyOps(menu, [op]);
  }, [menu, valid, scope, mode, dir, n, round, mods]);

  const examples = useMemo(() => {
    if (!result) return [];
    const out: { name: string; before: number | null; after: number | null }[] = [];
    for (const it of menu.items) {
      const after = result.menu.items.find((x) => x.id === it.id);
      if (!after) continue;
      it.variations.forEach((v, i) => {
        const a = after.variations[i]?.priceCents ?? null;
        if (a !== v.priceCents) out.push({ name: it.variations.length > 1 ? `${it.name} · ${v.name}` : it.name, before: v.priceCents, after: a });
      });
    }
    return out;
  }, [menu, result]);

  const label = `${dir === "up" ? "Increase" : "Decrease"} ${mode === "percent" ? `${n}%` : `$${n.toFixed(2)}`}`;
  const scopeName = scope === "all" ? "all items" : cats.find((c) => c.id === scope)?.name ?? "";

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Adjust prices"
      footer={
        <Button
          size="lg"
          className="w-full"
          disabled={!result || examples.length === 0}
          onClick={() => {
            onApply(result!.menu, `${label} on ${scopeName}${round !== "none" ? `, rounded` : ""}${mods ? " (incl. modifiers)" : ""}`);
            onClose();
          }}
        >
          {examples.length ? `Apply to ${examples.length} price${examples.length === 1 ? "" : "s"}` : "Nothing to change"}
        </Button>
      }
    >
      <div className="space-y-5">
        <Segment
          value={dir}
          onChange={setDir}
          options={[
            ["up", <><Plus className="size-4" /> Increase</>],
            ["down", <><Minus className="size-4" /> Decrease</>],
          ]}
        />

        <div className="grid grid-cols-[1fr_auto] gap-2">
          <div className="relative">
            {mode === "amount" && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">$</span>}
            <input
              aria-label="Amount"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              className={cx(inputCls, "text-lg tabular-nums", mode === "amount" && "pl-7", !valid && amount && "ring-red-500")}
            />
            {mode === "percent" && <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted">%</span>}
          </div>
          <Segment className="w-28" value={mode} onChange={setMode} options={[["percent", "%"], ["amount", "$"]]} />
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-muted">Apply to</span>
          <select className={inputCls} value={scope} onChange={(e) => setScope(e.target.value)}>
            <option value="all">All items</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <div>
          <p className="mb-1.5 text-sm font-medium text-muted">Round to</p>
          <div className="flex flex-wrap gap-1.5">
            {ROUNDS.map(([v, l]) => (
              <button
                key={v}
                type="button"
                onClick={() => setRound(v)}
                className={cx("rounded-lg border px-3 py-2 font-mono text-[13px]", round === v ? "border-ink bg-ink text-white" : "border-line bg-surface")}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3">
          <span>
            <span className="block text-[15px] font-medium">Include modifier upcharges</span>
            <span className="block text-sm text-muted">e.g. &quot;Add guac +2.50&quot;</span>
          </span>
          <input type="checkbox" checked={mods} onChange={(e) => setMods(e.target.checked)} className="size-5 accent-[#0e0f11]" />
        </label>

        <div>
          <p className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            <span>Preview</span>
            <span>{examples.length} change{examples.length === 1 ? "" : "s"}</span>
          </p>
          {examples.length ? (
            <ul className="divide-y divide-line rounded-xl border border-line">
              {examples.slice(0, 6).map((x, i) => (
                <li key={i} className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm">
                  <span className="min-w-0 truncate">{x.name}</span>
                  <span className="flex shrink-0 items-center gap-1.5 font-mono text-[13px] tabular-nums">
                    <span className="text-muted">{formatCents(x.before)}</span>
                    <ArrowRight className="size-3.5 text-muted" />
                    <span>{formatCents(x.after)}</span>
                  </span>
                </li>
              ))}
              {examples.length > 6 && <li className="px-3.5 py-2.5 text-sm text-muted">+ {examples.length - 6} more</li>}
            </ul>
          ) : (
            <p className="rounded-xl border border-line p-3 text-sm text-muted">{valid ? "No prices change with these settings." : "Enter an amount."}</p>
          )}
          <p className="mt-2 text-xs text-muted">Market-price (MP) items aren&apos;t changed.</p>
        </div>
      </div>
    </Sheet>
  );
}
