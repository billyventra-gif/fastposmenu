"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Check,
  ChevronRight,
  Layers,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { formatCents } from "@/lib/menu/money";
import { newId, type Category, type Item, type Menu, type ModifierGroup, type TaxHint } from "@/lib/menu/schema";
import * as E from "@/lib/menu/edit";
import { POS_INFO } from "@/lib/export/registry";
import PriceInput from "./PriceInput";
import ExportSheet from "./ExportSheet";
import { BottomBar, Button, Field, PosMark, Sheet, Stat, cx, inputCls } from "./ui";

type Tab = "items" | "modifiers" | "settings";

export function ruleLabel(g: Pick<ModifierGroup, "minSelect" | "maxSelect">) {
  const { minSelect: lo, maxSelect: hi } = g;
  if (lo === 0 && hi === null) return "Optional · any";
  if (lo === 0) return `Optional · up to ${hi}`;
  if (hi === lo) return `Required · pick ${lo}`;
  if (hi === null) return `Pick at least ${lo}`;
  return `Pick ${lo}–${hi}`;
}

export default function Review({
  menu,
  onChange,
  onChangePos,
  draftId,
  paidSessionId,
  openExport,
  onExportOpened,
}: {
  menu: Menu;
  onChange: (m: Menu) => void;
  onChangePos: () => void;
  draftId: string;
  paidSessionId?: string;
  openExport?: boolean;
  onExportOpened?: () => void;
}) {
  const [tab, setTab] = useState<Tab>("items");
  const [query, setQuery] = useState("");
  const [onlyFlagged, setOnlyFlagged] = useState(false);
  const [itemId, setItemId] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [catId, setCatId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  // Returning from Stripe: open the export sheet once.
  useEffect(() => {
    if (!openExport) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot open after checkout redirect
    setExporting(true);
    onExportOpened?.();
  }, [openExport, onExportOpened]);

  const cats = useMemo(() => [...menu.categories].sort((a, b) => a.sortOrder - b.sortOrder), [menu.categories]);
  const flagged = menu.items.filter((i) => i.confidence === "low");
  const q = query.trim().toLowerCase();
  const visible = (i: Item) =>
    (!onlyFlagged || i.confidence === "low") && (!q || i.name.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q));
  const groupName = new Map(menu.modifierGroups.map((g) => [g.id, g.name]));

  const item = menu.items.find((i) => i.id === itemId) ?? null;
  const group = menu.modifierGroups.find((g) => g.id === groupId) ?? null;
  const cat = menu.categories.find((c) => c.id === catId) ?? null;

  const addItemTo = (categoryId: string) => {
    const next = E.addItem(menu, categoryId);
    onChange(next);
    setItemId(next.items[next.items.length - 1].id);
  };

  return (
    <section className="animate-rise">
      {/* Title row */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted">Review the menu</p>
        <button onClick={onChangePos} className="flex items-center gap-2 rounded-full bg-surface py-1 pl-1 pr-3 text-sm font-semibold ring-1 ring-line hover:ring-ink/20">
          <PosMark pos={menu.target} className="size-7 rounded-full text-xs" />
          {POS_INFO[menu.target].label}
        </button>
      </div>
      <input
        aria-label="Restaurant name"
        value={menu.restaurantName}
        placeholder="Restaurant name"
        onChange={(e) => onChange({ ...menu, restaurantName: e.target.value })}
        className="-ml-1 mt-1 w-full rounded-lg bg-transparent px-1 text-3xl font-bold tracking-tight placeholder:text-muted/50 hover:bg-ink/5 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand sm:text-4xl"
      />

      {/* Stats */}
      <div className="mt-5 grid grid-cols-4 gap-2 sm:max-w-xl sm:gap-3">
        <Stat value={menu.items.length} label="items" />
        <Stat value={menu.categories.length} label="categories" />
        <Stat value={menu.modifierGroups.length} label="modifiers" />
        <button onClick={() => (setTab("items"), setOnlyFlagged(!onlyFlagged))} className="text-left" disabled={!flagged.length}>
          <Stat value={flagged.length} label={onlyFlagged ? "showing" : "to check"} tone={flagged.length ? "warn" : "default"} />
        </button>
      </div>

      {menu.warnings.length > 0 && (
        <details className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-950 ring-1 ring-amber-200">
          <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold">
            <AlertTriangle className="size-4" /> {menu.warnings.length} note{menu.warnings.length > 1 ? "s" : ""} from the read
          </summary>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            {menu.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </details>
      )}

      {/* Tabs */}
      <div className="sticky top-14 z-20 -mx-4 mt-6 bg-bg/90 px-4 pb-3 pt-2 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex gap-1 rounded-2xl bg-ink/5 p-1 sm:max-w-md">
          {(
            [
              ["items", "Items", UtensilsCrossed],
              ["modifiers", "Modifiers", Layers],
              ["settings", "Tax", Settings2],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cx(
                "flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl text-sm font-semibold transition",
                tab === id ? "bg-surface shadow-sm" : "text-muted hover:text-ink",
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === "items" && (
          <div className="mt-3 lg:hidden">
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
              {cats.map((c) => (
                <a
                  key={c.id}
                  href={`#cat-${c.id}`}
                  className="shrink-0 rounded-full bg-surface px-3.5 py-2 text-sm font-medium ring-1 ring-line active:bg-ink active:text-white"
                >
                  {c.name}
                  <span className="ml-1.5 text-muted">{menu.items.filter((i) => i.categoryId === c.id).length}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {tab === "items" && (
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-8">
          <aside className="hidden lg:block">
            <nav className="sticky top-32 space-y-1">
              {cats.map((c) => (
                <a key={c.id} href={`#cat-${c.id}`} className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium hover:bg-surface">
                  <span className="truncate">{c.name}</span>
                  <span className="text-muted">{menu.items.filter((i) => i.categoryId === c.id).length}</span>
                </a>
              ))}
              <button onClick={() => onChange(E.addCategory(menu))} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted hover:bg-surface">
                <Plus className="size-4" /> Category
              </button>
            </nav>
          </aside>

          <div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search items" className={cx(inputCls, "bg-surface pl-11")} />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full hover:bg-ink/5">
                  <X className="size-4" />
                </button>
              )}
            </div>
            {onlyFlagged && (
              <button onClick={() => setOnlyFlagged(false)} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-950">
                Showing items to check <X className="size-3.5" />
              </button>
            )}

            {menu.items.length === 0 && (
              <div className="mt-6 rounded-3xl bg-surface p-8 text-center ring-1 ring-line">
                <p className="font-semibold">No items yet</p>
                <p className="mt-1 text-sm text-muted">Add a category, then add items.</p>
                <Button className="mt-4" onClick={() => onChange(E.addCategory(menu, "Menu"))}>
                  <Plus className="size-4" /> Add category
                </Button>
              </div>
            )}

            <div className="mt-4 space-y-8">
              {cats.map((c) => {
                const items = menu.items.filter((i) => i.categoryId === c.id && visible(i));
                if ((q || onlyFlagged) && items.length === 0) return null;
                return (
                  <div key={c.id} id={`cat-${c.id}`} className="scroll-mt-44 lg:scroll-mt-32">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <h3 className="text-xl font-bold tracking-tight">{c.name}</h3>
                      <button onClick={() => setCatId(c.id)} aria-label={`Edit ${c.name}`} className="grid size-10 place-items-center rounded-full hover:bg-ink/5">
                        <MoreHorizontal className="size-5" />
                      </button>
                    </div>
                    <ul className="grid gap-2.5 md:grid-cols-2">
                      {items.map((it) => (
                        <li key={it.id}>
                          <ItemCard item={it} groupName={groupName} onOpen={() => setItemId(it.id)} />
                        </li>
                      ))}
                      {!q && !onlyFlagged && (
                        <li className="md:col-span-2">
                          <button
                            onClick={() => addItemTo(c.id)}
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line text-sm font-medium text-muted hover:border-ink/30 hover:text-ink"
                          >
                            <Plus className="size-4" /> Add item
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                );
              })}
              {menu.items.length > 0 && !q && !onlyFlagged && (
                <Button variant="secondary" onClick={() => onChange(E.addCategory(menu))} className="lg:hidden">
                  <Plus className="size-4" /> Add category
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "modifiers" && (
        <div className="grid gap-3 md:grid-cols-2">
          {menu.modifierGroups.map((g) => {
            const used = menu.items.filter((i) => i.modifierGroupIds.includes(g.id)).length;
            return (
              <button key={g.id} onClick={() => setGroupId(g.id)} className="animate-rise rounded-3xl bg-surface p-4 text-left ring-1 ring-line transition hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-lg font-bold">{g.name}</p>
                    <p className="text-sm text-muted">
                      {ruleLabel(g)} · on {used} item{used === 1 ? "" : "s"}
                    </p>
                  </div>
                  <ChevronRight className="mt-1 size-5 text-muted" />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {g.options.map((o) => (
                    <span key={o.id} className="rounded-full bg-bg px-2.5 py-1 text-sm">
                      {o.name}
                      {o.priceCents > 0 && <span className="ml-1 font-semibold text-brand-ink">+{formatCents(o.priceCents).slice(1)}</span>}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
          <button
            onClick={() => {
              const next = E.addGroup(menu);
              onChange(next);
              setGroupId(next.modifierGroups[next.modifierGroups.length - 1].id);
            }}
            className="flex min-h-28 items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-line font-medium text-muted hover:border-ink/30 hover:text-ink"
          >
            <Plus className="size-5" /> New modifier group
          </button>
        </div>
      )}

      {tab === "settings" && <TaxPanel menu={menu} onChange={onChange} />}

      {/* Bottom action bar */}
      <BottomBar className="flex max-w-6xl items-center gap-3">
          <div className="hidden min-w-0 flex-1 text-sm sm:block">
            {flagged.length ? (
              <span className="text-amber-800">
                <b>{flagged.length}</b> item{flagged.length > 1 ? "s" : ""} to check before export
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-700">
                <Check className="size-4" /> Looks ready
              </span>
            )}
          </div>
          <Button size="lg" className="w-full sm:w-auto sm:min-w-64" onClick={() => setExporting(true)} disabled={!menu.items.length}>
            Export to {POS_INFO[menu.target].label}
          </Button>
      </BottomBar>

      <ItemSheet
        key={item?.id}
        item={item}
        menu={menu}
        cats={cats}
        onChange={onChange}
        onClose={() => setItemId(null)}
      />
      <GroupSheet key={group?.id} group={group} menu={menu} onChange={onChange} onClose={() => setGroupId(null)} />
      <CategorySheet cat={cat} cats={cats} menu={menu} onChange={onChange} onClose={() => setCatId(null)} />
      <ExportSheet open={exporting} menu={menu} draftId={draftId} paidSessionId={paidSessionId} onClose={() => setExporting(false)} />
    </section>
  );
}

function ItemCard({ item, groupName, onOpen }: { item: Item; groupName: Map<string, string>; onOpen: () => void }) {
  const low = item.confidence === "low";
  return (
    <button
      onClick={onOpen}
      className={cx(
        "flex w-full animate-rise items-start gap-3 rounded-2xl bg-surface p-3.5 text-left ring-1 transition hover:shadow-md active:scale-[0.99]",
        low ? "ring-amber-300" : "ring-line",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {low && <AlertTriangle className="size-4 shrink-0 text-amber-500" aria-label="Check this" />}
          <p className="truncate font-semibold">{item.name}</p>
        </div>
        {low && item.note ? (
          <p className="mt-0.5 line-clamp-1 text-sm text-amber-800">{item.note}</p>
        ) : (
          item.description && <p className="mt-0.5 line-clamp-1 text-sm text-muted">{item.description}</p>
        )}
        {item.modifierGroupIds.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {item.modifierGroupIds.map((g) => (
              <span key={g} className="rounded-md bg-bg px-1.5 py-0.5 text-xs text-muted">
                {groupName.get(g)}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        {item.variations.map((v) => (
          <span key={v.id} className="text-sm font-semibold tabular-nums">
            {item.variations.length > 1 && <span className="mr-1 font-normal text-muted">{v.name}</span>}
            {formatCents(v.priceCents)}
          </span>
        ))}
      </div>
    </button>
  );
}

const TAX_OPTIONS: [TaxHint, string][] = [
  ["prepared_food", "Food"],
  ["alcohol", "Alcohol"],
  ["non_taxable", "No tax"],
];

function ItemSheet({
  item,
  menu,
  cats,
  onChange,
  onClose,
}: {
  item: Item | null;
  menu: Menu;
  cats: Category[];
  onChange: (m: Menu) => void;
  onClose: () => void;
}) {
  if (!item) return null;
  const up = (patch: Partial<Item>) => onChange(E.updateItem(menu, item.id, patch));
  const setVar = (id: string, patch: Partial<Item["variations"][number]>) =>
    up({ variations: item.variations.map((v) => (v.id === id ? { ...v, ...patch } : v)) });

  return (
    <Sheet
      open
      onClose={onClose}
      title="Edit item"
      footer={
        <div className="flex gap-2">
          <Button variant="danger" onClick={() => (onChange(E.deleteItem(menu, item.id)), onClose())} aria-label="Delete item">
            <Trash2 className="size-5" />
          </Button>
          {item.confidence === "low" ? (
            <Button className="flex-1" onClick={() => (up({ confidence: "high", note: undefined }), onClose())}>
              <Check className="size-5" /> Looks right
            </Button>
          ) : (
            <Button className="flex-1" onClick={onClose}>
              Done
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-5">
        {item.confidence === "low" && item.note && (
          <p className="flex gap-2 rounded-2xl bg-amber-50 p-3 text-sm text-amber-950 ring-1 ring-amber-200">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" /> {item.note}
          </p>
        )}
        <Field label="Name">
          <input className={inputCls} value={item.name} onChange={(e) => up({ name: e.target.value })} />
        </Field>
        <Field label="Description">
          <textarea
            rows={3}
            className={cx(inputCls, "h-auto py-3")}
            value={item.description ?? ""}
            onChange={(e) => up({ description: e.target.value || undefined })}
          />
        </Field>

        <div>
          <p className="mb-1.5 text-sm font-medium text-muted">{item.variations.length > 1 ? "Sizes & prices" : "Price"}</p>
          <div className="space-y-2">
            {item.variations.map((v) => (
              <div key={v.id} className="flex gap-2">
                {item.variations.length > 1 && (
                  <input aria-label="Size name" className={cx(inputCls, "min-w-0 flex-1")} value={v.name} onChange={(e) => setVar(v.id, { name: e.target.value })} />
                )}
                <PriceInput
                  label={`${v.name} price`}
                  cents={v.priceCents}
                  onCommit={(c) => setVar(v.id, { priceCents: c })}
                  className={item.variations.length > 1 ? "w-32" : "w-full"}
                />
                {item.variations.length > 1 && (
                  <button
                    aria-label={`Remove ${v.name}`}
                    onClick={() => up({ variations: item.variations.filter((x) => x.id !== v.id) })}
                    className="grid size-12 shrink-0 place-items-center rounded-xl text-muted hover:bg-ink/5"
                  >
                    <X className="size-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() =>
              up({
                variations: [
                  ...item.variations.map((v, i) => (item.variations.length === 1 && i === 0 && v.name === "Regular" ? { ...v, name: "Small" } : v)),
                  { id: newId("var"), name: item.variations.length === 1 ? "Large" : "Size", priceCents: item.variations.at(-1)?.priceCents ?? 0 },
                ],
              })
            }
            className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-brand-ink"
          >
            <Plus className="size-4" /> Add size
          </button>
          <p className="mt-1 text-xs text-muted">Type MP for market price.</p>
        </div>

        <Field label="Category">
          <select className={inputCls} value={item.categoryId} onChange={(e) => up({ categoryId: e.target.value })}>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        {menu.modifierGroups.length > 0 && (
          <div>
            <p className="mb-1.5 text-sm font-medium text-muted">Modifier groups</p>
            <div className="flex flex-wrap gap-2">
              {menu.modifierGroups.map((g) => {
                const on = item.modifierGroupIds.includes(g.id);
                return (
                  <button
                    key={g.id}
                    onClick={() => onChange(E.toggleGroupOnItem(menu, item.id, g.id))}
                    className={cx(
                      "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium ring-1 transition",
                      on ? "bg-ink text-white ring-ink" : "bg-surface ring-line hover:ring-ink/30",
                    )}
                  >
                    {on && <Check className="size-3.5" />}
                    {g.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <p className="mb-1.5 text-sm font-medium text-muted">Tax</p>
          <div className="flex gap-1 rounded-2xl bg-ink/5 p-1">
            {TAX_OPTIONS.map(([v, label]) => (
              <button
                key={v}
                onClick={() => up({ taxHint: v, taxIds: v === "non_taxable" ? [] : menu.taxes.map((t) => t.id) })}
                className={cx("h-10 flex-1 rounded-xl text-sm font-semibold transition", item.taxHint === v ? "bg-surface shadow-sm" : "text-muted")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Sheet>
  );
}

function Stepper({ label, value, onSet, min, allowNone }: { label: string; value: number | null; onSet: (v: number | null) => void; min: number; allowNone?: boolean }) {
  return (
    <div className="flex-1 rounded-2xl bg-bg p-3 ring-1 ring-line">
      <p className="text-xs font-medium text-muted">{label}</p>
      <div className="mt-1 flex items-center justify-between">
        <button
          aria-label={`Less ${label}`}
          onClick={() => onSet(value === null ? null : value - 1 < min ? (allowNone ? null : min) : value - 1)}
          className="grid size-10 place-items-center rounded-xl bg-surface text-xl ring-1 ring-line"
        >
          −
        </button>
        <span className="text-lg font-bold tabular-nums">{value ?? "Any"}</span>
        <button aria-label={`More ${label}`} onClick={() => onSet(value === null ? Math.max(min, 1) : value + 1)} className="grid size-10 place-items-center rounded-xl bg-surface text-xl ring-1 ring-line">
          +
        </button>
      </div>
    </div>
  );
}

function GroupSheet({ group, menu, onChange, onClose }: { group: ModifierGroup | null; menu: Menu; onChange: (m: Menu) => void; onClose: () => void }) {
  if (!group) return null;
  const up = (patch: Partial<ModifierGroup>) => onChange(E.updateGroup(menu, group.id, patch));
  const required = group.minSelect > 0;

  return (
    <Sheet
      open
      onClose={onClose}
      title="Modifier group"
      footer={
        <div className="flex gap-2">
          <Button
            variant="danger"
            aria-label="Delete group"
            onClick={() => confirm(`Delete "${group.name}"?`) && (onChange(E.deleteGroup(menu, group.id)), onClose())}
          >
            <Trash2 className="size-5" />
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Done
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <Field label="Name">
          <input className={inputCls} value={group.name} onChange={(e) => up({ name: e.target.value })} />
        </Field>

        <div>
          <div className="flex gap-1 rounded-2xl bg-ink/5 p-1">
            {[
              [false, "Optional"],
              [true, "Required"],
            ].map(([req, label]) => (
              <button
                key={String(label)}
                onClick={() =>
                  up(
                    req
                      ? { minSelect: Math.max(1, group.minSelect), maxSelect: group.maxSelect === null ? null : Math.max(group.maxSelect, 1) }
                      : { minSelect: 0 },
                  )
                }
                className={cx("h-10 flex-1 rounded-xl text-sm font-semibold transition", required === req ? "bg-surface shadow-sm" : "text-muted")}
              >
                {label as string}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-3">
            <Stepper
              label="Min picks"
              value={group.minSelect}
              min={0}
              onSet={(v) => {
                const min = v ?? 0;
                up({ minSelect: min, maxSelect: group.maxSelect !== null && group.maxSelect < min ? min : group.maxSelect });
              }}
            />
            <Stepper label="Max picks" value={group.maxSelect} min={Math.max(1, group.minSelect)} allowNone onSet={(v) => up({ maxSelect: v })} />
          </div>
          <p className="mt-2 text-sm text-muted">{ruleLabel(group)}</p>
        </div>

        <div>
          <p className="mb-1.5 text-sm font-medium text-muted">Options</p>
          <ul className="space-y-2">
            {group.options.map((o) => (
              <li key={o.id} className="flex gap-2">
                <input
                  aria-label="Option name"
                  className={cx(inputCls, "min-w-0 flex-1")}
                  value={o.name}
                  onChange={(e) => up({ options: group.options.map((x) => (x.id === o.id ? { ...x, name: e.target.value } : x)) })}
                />
                <PriceInput
                  label={`${o.name} upcharge`}
                  allowMarket={false}
                  cents={o.priceCents}
                  className="w-28"
                  onCommit={(c) => up({ options: group.options.map((x) => (x.id === o.id ? { ...x, priceCents: c ?? 0 } : x)) })}
                />
                {group.options.length > 1 && (
                  <button
                    aria-label={`Remove ${o.name}`}
                    onClick={() => up({ options: group.options.filter((x) => x.id !== o.id) })}
                    className="grid size-12 shrink-0 place-items-center rounded-xl text-muted hover:bg-ink/5"
                  >
                    <X className="size-5" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          <button
            onClick={() => up({ options: [...group.options, { id: newId("opt"), name: "New option", priceCents: 0, isDefault: false }] })}
            className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-brand-ink"
          >
            <Plus className="size-4" /> Add option
          </button>
        </div>
      </div>
    </Sheet>
  );
}

function CategorySheet({ cat, cats, menu, onChange, onClose }: { cat: Category | null; cats: Category[]; menu: Menu; onChange: (m: Menu) => void; onClose: () => void }) {
  if (!cat) return null;
  const i = cats.findIndex((c) => c.id === cat.id);
  const count = menu.items.filter((it) => it.categoryId === cat.id).length;
  return (
    <Sheet
      open
      onClose={onClose}
      title="Category"
      footer={
        <Button className="w-full" onClick={onClose}>
          Done
        </Button>
      }
    >
      <div className="space-y-4">
        <Field label="Name">
          <input className={inputCls} value={cat.name} onChange={(e) => onChange(E.renameCategory(menu, cat.id, e.target.value))} />
        </Field>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" disabled={i === 0} onClick={() => onChange(E.moveCategory(menu, cat.id, -1))}>
            <ArrowUp className="size-4" /> Move up
          </Button>
          <Button variant="secondary" className="flex-1" disabled={i === cats.length - 1} onClick={() => onChange(E.moveCategory(menu, cat.id, 1))}>
            <ArrowDown className="size-4" /> Move down
          </Button>
        </div>
        <Button
          variant="danger"
          className="w-full"
          onClick={() => confirm(`Delete "${cat.name}" and its ${count} item${count === 1 ? "" : "s"}?`) && (onChange(E.deleteCategory(menu, cat.id)), onClose())}
        >
          <Trash2 className="size-4" /> Delete category ({count} item{count === 1 ? "" : "s"})
        </Button>
      </div>
    </Sheet>
  );
}

function TaxPanel({ menu, onChange }: { menu: Menu; onChange: (m: Menu) => void }) {
  const tax = menu.taxes[0];
  const [rate, setRate] = useState(tax?.ratePercent ?? "");
  const [name, setName] = useState(tax?.name ?? "Sales Tax");
  const valid = /^\d{1,2}(\.\d{1,4})?$/.test(rate);
  const save = () => {
    if (!rate) return onChange(E.setTaxes(menu, []));
    if (!valid) return;
    onChange(E.setTaxes(menu, [{ id: tax?.id ?? newId("tax"), name: name.trim() || "Sales Tax", ratePercent: rate }]));
  };
  const counts = {
    food: menu.items.filter((i) => i.taxHint === "prepared_food" || i.taxHint === "unknown").length,
    alcohol: menu.items.filter((i) => i.taxHint === "alcohol").length,
    none: menu.items.filter((i) => i.taxHint === "non_taxable").length,
  };
  return (
    <div className="max-w-xl animate-rise space-y-4">
      <div className="rounded-3xl bg-surface p-5 ring-1 ring-line">
        <p className="font-bold">Sales tax</p>
        <p className="mt-1 text-sm text-muted">Applied to every item not marked &quot;No tax.&quot;</p>
        <div className="mt-4 grid grid-cols-[1fr_8rem] gap-3">
          <Field label="Name">
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} onBlur={save} />
          </Field>
          <Field label="Rate">
            <div className="relative">
              <input
                aria-label="Sales tax percent"
                inputMode="decimal"
                placeholder="8.875"
                value={rate}
                onChange={(e) => setRate(e.target.value.trim())}
                onBlur={save}
                className={cx(inputCls, "pr-8 text-right", rate && !valid && "ring-red-500")}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">%</span>
            </div>
          </Field>
        </div>
        {!menu.taxes.length && <p className="mt-3 text-sm text-amber-800">No rate set. Items will import untaxed.</p>}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Stat value={counts.food} label="food & drink" />
        <Stat value={counts.alcohol} label="alcohol" />
        <Stat value={counts.none} label="no tax" />
      </div>
    </div>
  );
}
