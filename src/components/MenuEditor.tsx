"use client";

import { useState } from "react";
import { centsToDecimal, formatCents, inputToCents } from "@/lib/menu/money";
import { newId, type Item, type Menu, type ModifierGroup, type TaxHint } from "@/lib/menu/schema";
import * as E from "@/lib/menu/edit";
import { POS_INFO } from "@/lib/export/registry";

const field = "h-11 rounded-lg border border-neutral-300 bg-white px-3";
const fieldFull = `${field} w-full`;
const smallBtn = "rounded-md border border-neutral-300 px-2.5 py-1 text-sm";

/** Text input that holds its own string and commits a price in cents on blur. */
function PriceInput({
  cents,
  onCommit,
  allowMarket = true,
  label,
}: {
  cents: number | null;
  onCommit: (c: number | null) => void;
  allowMarket?: boolean;
  label: string;
}) {
  const [text, setText] = useState(cents === null ? "MP" : centsToDecimal(cents));
  const [bad, setBad] = useState(false);
  return (
    <input
      aria-label={label}
      inputMode="decimal"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => {
        const c = inputToCents(text);
        if (c === undefined || (c === null && !allowMarket)) {
          setBad(true);
          return;
        }
        setBad(false);
        setText(c === null ? "MP" : centsToDecimal(c));
        onCommit(c);
      }}
      className={`${field} w-28 shrink-0 text-right ${bad ? "border-red-500" : ""}`}
    />
  );
}

export default function MenuEditor({
  menu,
  onChange,
  onChangePos,
}: {
  menu: Menu;
  onChange: (m: Menu) => void;
  onChangePos: () => void;
}) {
  const [onlyFlagged, setOnlyFlagged] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const flagged = menu.items.filter((i) => i.confidence === "low");
  const cats = [...menu.categories].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Review the menu</h1>
        <button onClick={onChangePos} className={smallBtn}>
          POS: {POS_INFO[menu.target].label}
        </button>
      </div>
      <p className="mt-1 text-sm text-neutral-600">
        {menu.items.length} items · {menu.categories.length} categories · {menu.modifierGroups.length} modifier groups
      </p>

      <label className="mt-4 block text-sm font-medium">
        Restaurant name
        <input
          className={`${fieldFull} mt-1`}
          value={menu.restaurantName}
          onChange={(e) => onChange({ ...menu, restaurantName: e.target.value })}
        />
      </label>

      {menu.warnings.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm">
          <p className="font-semibold text-amber-900">Notes from the read</p>
          <ul className="mt-1 list-disc pl-5 text-amber-900">
            {menu.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {flagged.length > 0 && (
        <label className="mt-4 flex items-center gap-2 rounded-xl bg-white p-3 text-sm ring-1 ring-neutral-200">
          <input type="checkbox" checked={onlyFlagged} onChange={(e) => setOnlyFlagged(e.target.checked)} className="size-5" />
          <span>
            Show only the <b>{flagged.length}</b> items to check
          </span>
        </label>
      )}

      <TaxEditor menu={menu} onChange={onChange} />

      <div className="mt-6 space-y-5">
        {cats.map((c, ci) => {
          const items = menu.items.filter((i) => i.categoryId === c.id && (!onlyFlagged || i.confidence === "low"));
          if (onlyFlagged && items.length === 0) return null;
          return (
            <div key={c.id} className="rounded-xl border border-neutral-200 bg-white">
              <div className="flex items-center gap-2 border-b border-neutral-200 p-3">
                <input
                  aria-label="Category name"
                  className="h-10 min-w-0 flex-1 rounded-md px-2 text-lg font-semibold hover:bg-neutral-50 focus:bg-neutral-50"
                  value={c.name}
                  onChange={(e) => onChange(E.renameCategory(menu, c.id, e.target.value))}
                />
                <button aria-label="Move up" disabled={ci === 0} onClick={() => onChange(E.moveCategory(menu, c.id, -1))} className={`${smallBtn} disabled:opacity-30`}>
                  ↑
                </button>
                <button aria-label="Move down" disabled={ci === cats.length - 1} onClick={() => onChange(E.moveCategory(menu, c.id, 1))} className={`${smallBtn} disabled:opacity-30`}>
                  ↓
                </button>
                <button
                  aria-label="Delete category"
                  onClick={() => confirm(`Delete "${c.name}" and its items?`) && onChange(E.deleteCategory(menu, c.id))}
                  className={`${smallBtn} text-red-600`}
                >
                  ✕
                </button>
              </div>
              <ul className="divide-y divide-neutral-100">
                {items.map((it) => (
                  <ItemRow
                    key={it.id}
                    item={it}
                    menu={menu}
                    open={open === it.id}
                    onToggle={() => setOpen(open === it.id ? null : it.id)}
                    onChange={onChange}
                  />
                ))}
              </ul>
              <button onClick={() => onChange(E.addItem(menu, c.id))} className="w-full p-3 text-left text-sm font-medium text-brand">
                + Add item
              </button>
            </div>
          );
        })}
        <button onClick={() => onChange(E.addCategory(menu))} className={`${smallBtn} py-2`}>
          + Add category
        </button>
      </div>

      <GroupsEditor menu={menu} onChange={onChange} />
    </section>
  );
}

function ItemRow({
  item,
  menu,
  open,
  onToggle,
  onChange,
}: {
  item: Item;
  menu: Menu;
  open: boolean;
  onToggle: () => void;
  onChange: (m: Menu) => void;
}) {
  const up = (patch: Partial<Item>) => onChange(E.updateItem(menu, item.id, patch));
  const priceSummary = item.variations.map((v) => formatCents(v.priceCents)).join(" / ");
  return (
    <li className={item.confidence === "low" ? "bg-amber-50" : ""}>
      <button onClick={onToggle} className="flex w-full items-start justify-between gap-3 p-3 text-left">
        <span className="min-w-0">
          <span className="block font-medium">
            {item.confidence === "low" && <span className="mr-1 text-amber-600" title="Check this">●</span>}
            {item.name}
          </span>
          {item.note && <span className="block text-xs text-amber-800">{item.note}</span>}
          {item.modifierGroupIds.length > 0 && (
            <span className="block text-xs text-neutral-500">
              {item.modifierGroupIds.map((g) => menu.modifierGroups.find((x) => x.id === g)?.name).filter(Boolean).join(", ")}
            </span>
          )}
        </span>
        <span className="shrink-0 text-sm tabular-nums text-neutral-700">{priceSummary}</span>
      </button>

      {open && (
        <div className="space-y-3 px-3 pb-4">
          <input aria-label="Item name" className={fieldFull} value={item.name} onChange={(e) => up({ name: e.target.value })} />
          <textarea
            aria-label="Description"
            placeholder="Description"
            className="min-h-20 w-full rounded-lg border border-neutral-300 bg-white p-3"
            value={item.description ?? ""}
            onChange={(e) => up({ description: e.target.value || undefined })}
          />

          <div>
            <p className="text-sm font-medium">Sizes / prices</p>
            <div className="mt-1 space-y-2">
              {item.variations.map((v, vi) => (
                <div key={v.id} className="flex gap-2">
                  <input
                    aria-label="Size name"
                    className={`${field} min-w-0 flex-1`}
                    value={v.name}
                    onChange={(e) => up({ variations: item.variations.map((x) => (x.id === v.id ? { ...x, name: e.target.value } : x)) })}
                  />
                  <PriceInput
                    label={`${v.name} price`}
                    cents={v.priceCents}
                    onCommit={(c) => up({ variations: item.variations.map((x) => (x.id === v.id ? { ...x, priceCents: c } : x)) })}
                  />
                  {item.variations.length > 1 && (
                    <button aria-label="Remove size" onClick={() => up({ variations: item.variations.filter((_, j) => j !== vi) })} className={smallBtn}>
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => up({ variations: [...item.variations, { id: newId("var"), name: "Large", priceCents: 0 }] })}
                className="text-sm font-medium text-brand"
              >
                + Add size
              </button>
            </div>
          </div>

          {menu.modifierGroups.length > 0 && (
            <div>
              <p className="text-sm font-medium">Modifier groups</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {menu.modifierGroups.map((g) => {
                  const on = item.modifierGroupIds.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      onClick={() => onChange(E.toggleGroupOnItem(menu, item.id, g.id))}
                      className={`rounded-full border px-3 py-1.5 text-sm ${on ? "border-brand bg-brand text-white" : "border-neutral-300"}`}
                    >
                      {g.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm">
              Tax type{" "}
              <select
                className="ml-1 h-10 rounded-lg border border-neutral-300 bg-white px-2"
                value={item.taxHint}
                onChange={(e) => {
                  const taxHint = e.target.value as TaxHint;
                  up({ taxHint, taxIds: taxHint === "non_taxable" ? [] : menu.taxes.map((t) => t.id) });
                }}
              >
                <option value="prepared_food">Food / drink</option>
                <option value="alcohol">Alcohol</option>
                <option value="non_taxable">Not taxed</option>
                <option value="unknown">Not sure</option>
              </select>
            </label>
            {item.confidence === "low" && (
              <button onClick={() => up({ confidence: "high", note: undefined })} className={`${smallBtn} border-green-600 text-green-700`}>
                Looks right
              </button>
            )}
            <button onClick={() => onChange(E.deleteItem(menu, item.id))} className={`${smallBtn} ml-auto text-red-600`}>
              Delete item
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

function TaxEditor({ menu, onChange }: { menu: Menu; onChange: (m: Menu) => void }) {
  const tax = menu.taxes[0];
  const [rate, setRate] = useState(tax?.ratePercent ?? "");
  const valid = /^\d{1,2}(\.\d{1,4})?$/.test(rate);
  return (
    <div className="mt-4 rounded-xl bg-white p-3 ring-1 ring-neutral-200">
      <p className="text-sm font-medium">Sales tax rate</p>
      <div className="mt-1 flex items-center gap-2">
        <input
          aria-label="Sales tax percent"
          inputMode="decimal"
          placeholder="e.g. 8.875"
          value={rate}
          onChange={(e) => setRate(e.target.value.trim())}
          onBlur={() => {
            if (!rate) return onChange(E.setTaxes(menu, []));
            if (!valid) return;
            onChange(E.setTaxes(menu, [{ id: tax?.id ?? newId("tax"), name: tax?.name ?? "Sales Tax", ratePercent: rate }]));
          }}
          className={`${field} w-32 ${rate && !valid ? "border-red-500" : ""}`}
        />
        <span className="text-sm text-neutral-600">% · applied to everything not marked &quot;Not taxed&quot;</span>
      </div>
    </div>
  );
}

function GroupsEditor({ menu, onChange }: { menu: Menu; onChange: (m: Menu) => void }) {
  const up = (g: ModifierGroup, patch: Partial<ModifierGroup>) => onChange(E.updateGroup(menu, g.id, patch));
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold">Modifier groups</h2>
      <p className="text-sm text-neutral-600">Min 0 = optional. Leave Max blank for no limit.</p>
      <div className="mt-3 space-y-4">
        {menu.modifierGroups.map((g) => {
          const used = menu.items.filter((i) => i.modifierGroupIds.includes(g.id)).length;
          return (
            <div key={g.id} className="rounded-xl border border-neutral-200 bg-white p-3">
              <div className="flex gap-2">
                <input aria-label="Group name" className={`${field} w-full min-w-0 flex-1 font-semibold`} value={g.name} onChange={(e) => up(g, { name: e.target.value })} />
                <button
                  aria-label="Delete group"
                  onClick={() => confirm(`Delete "${g.name}"?`) && onChange(E.deleteGroup(menu, g.id))}
                  className={`${smallBtn} text-red-600`}
                >
                  ✕
                </button>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <label>
                  Min{" "}
                  <input
                    aria-label="Min"
                    type="number"
                    min={0}
                    value={g.minSelect}
                    onChange={(e) => {
                      const min = Math.max(0, parseInt(e.target.value || "0", 10));
                      up(g, { minSelect: min, maxSelect: g.maxSelect !== null && g.maxSelect < min ? min : g.maxSelect });
                    }}
                    className="ml-1 h-10 w-16 rounded-lg border border-neutral-300 px-2"
                  />
                </label>
                <label>
                  Max{" "}
                  <input
                    aria-label="Max"
                    type="number"
                    min={1}
                    value={g.maxSelect ?? ""}
                    onChange={(e) => {
                      const v = e.target.value ? Math.max(1, parseInt(e.target.value, 10)) : null;
                      up(g, { maxSelect: v === null ? null : Math.max(v, g.minSelect) });
                    }}
                    className="ml-1 h-10 w-16 rounded-lg border border-neutral-300 px-2"
                  />
                </label>
                <span className="text-neutral-500">on {used} items</span>
              </div>
              <ul className="mt-3 space-y-2">
                {g.options.map((o) => (
                  <li key={o.id} className="flex gap-2">
                    <input
                      aria-label="Option name"
                      className={`${field} min-w-0 flex-1`}
                      value={o.name}
                      onChange={(e) => up(g, { options: g.options.map((x) => (x.id === o.id ? { ...x, name: e.target.value } : x)) })}
                    />
                    <PriceInput
                      label={`${o.name} upcharge`}
                      allowMarket={false}
                      cents={o.priceCents}
                      onCommit={(c) => up(g, { options: g.options.map((x) => (x.id === o.id ? { ...x, priceCents: c ?? 0 } : x)) })}
                    />
                    {g.options.length > 1 && (
                      <button aria-label="Remove option" onClick={() => up(g, { options: g.options.filter((x) => x.id !== o.id) })} className={smallBtn}>
                        ✕
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => up(g, { options: [...g.options, { id: newId("opt"), name: "Option", priceCents: 0, isDefault: false }] })}
                className="mt-2 text-sm font-medium text-brand"
              >
                + Add option
              </button>
            </div>
          );
        })}
        <button onClick={() => onChange(E.addGroup(menu))} className={`${smallBtn} py-2`}>
          + Add modifier group
        </button>
      </div>
    </div>
  );
}
