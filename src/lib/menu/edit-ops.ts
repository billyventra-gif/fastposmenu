import { z } from "zod";
import { parsePrice } from "./money";
import { newId, type Menu, type TaxHint } from "./schema";

/**
 * "Tell it what to change": the model turns a plain-English request into these operations.
 * Code applies them, including all price math. The model never writes cents.
 * Flat, non-recursive shapes so they work with structured outputs.
 */

const Ids = z.array(z.string()).describe("IDs exactly as given in the menu JSON.");
const Scope = z.object({
  all: z.boolean().describe("true = every item on the menu."),
  category_ids: Ids,
  item_ids: Ids,
});

export const EditOp = z.discriminatedUnion("op", [
  z.object({
    op: z.literal("adjust_prices"),
    scope: Scope,
    mode: z.enum(["percent", "amount"]).describe("percent: +5 means 5% up, -10 means 10% down. amount: dollars added, e.g. 0.50 or -1."),
    value: z.number(),
    round: z.enum(["none", "nickel", "dime", "quarter", "dollar", "ends_99"]).describe('How to round the new price. "none" keeps cents.'),
    include_modifiers: z.boolean().describe("Also change upcharges on modifier options used by these items."),
  }),
  z.object({
    op: z.literal("set_price"),
    item_id: z.string(),
    variation_id: z.string().nullable().describe("null = the item's only/first price."),
    price_text: z.string().describe('New price as text, e.g. "12.95", or "MP" for market price.'),
  }),
  z.object({
    op: z.literal("update_item"),
    item_id: z.string(),
    name: z.string().nullable(),
    description: z.string().nullable().describe('null = leave as is. Empty string "" = remove the description.'),
  }),
  z.object({ op: z.literal("delete_items"), item_ids: Ids }),
  z.object({
    op: z.literal("move_items"),
    item_ids: Ids,
    category_id: z.string().nullable().describe("Existing category. Or null and give new_category_name."),
    new_category_name: z.string().nullable(),
  }),
  z.object({ op: z.literal("rename_category"), category_id: z.string(), name: z.string() }),
  z.object({ op: z.literal("reorder_categories"), category_ids: Ids.describe("Full new order, first to last.") }),
  z.object({ op: z.literal("delete_category"), category_id: z.string(), move_items_to_category_id: z.string().nullable() }),
  z.object({
    op: z.literal("update_group"),
    group_id: z.string(),
    name: z.string().nullable(),
    min_select: z.number().int().nullable(),
    max_select: z.number().int().nullable().describe("null = leave as is. Use 0 to mean no limit."),
  }),
  z.object({
    op: z.literal("add_group"),
    name: z.string(),
    min_select: z.number().int(),
    max_select: z.number().int().describe("0 = no limit."),
    options: z.array(z.object({ name: z.string(), price_text: z.string().describe('Upcharge, e.g. "1.50" or "0".') })),
    item_ids: Ids,
  }),
  z.object({ op: z.literal("attach_group"), group_id: z.string(), scope: Scope }),
  z.object({ op: z.literal("detach_group"), group_id: z.string(), scope: Scope }),
  z.object({
    op: z.literal("set_option_price"),
    group_id: z.string(),
    option_name: z.string(),
    price_text: z.string(),
  }),
  z.object({
    op: z.literal("set_tax_type"),
    scope: Scope,
    tax_type: z.enum(["prepared_food", "alcohol", "non_taxable"]),
  }),
]);
export type EditOp = z.infer<typeof EditOp>;

export const EditPlan = z.object({
  summary: z.string().describe("One or two short sentences describing what will change."),
  ops: z.array(EditOp),
  unclear: z.string().nullable().describe("If part of the request was ambiguous or impossible, say what. Otherwise null."),
});
export type EditPlan = z.infer<typeof EditPlan>;

const ROUND: Record<string, (c: number) => number> = {
  none: (c) => Math.round(c),
  nickel: (c) => Math.round(c / 5) * 5,
  dime: (c) => Math.round(c / 10) * 10,
  quarter: (c) => Math.round(c / 25) * 25,
  dollar: (c) => Math.round(c / 100) * 100,
  ends_99: (c) => Math.max(99, Math.round((c + 1) / 100) * 100 - 1),
};

function scopeItems(menu: Menu, s: z.infer<typeof Scope>): Set<string> {
  if (s.all) return new Set(menu.items.map((i) => i.id));
  const cats = new Set(s.category_ids);
  return new Set(menu.items.filter((i) => cats.has(i.categoryId) || s.item_ids.includes(i.id)).map((i) => i.id));
}

export type ApplyResult = { menu: Menu; changes: string[]; skipped: string[] };

/** Apply an edit plan. Pure: returns a new menu plus a human-readable change log. */
export function applyOps(input: Menu, ops: EditOp[]): ApplyResult {
  let m: Menu = structuredClone(input);
  const changes: string[] = [];
  const skipped: string[] = [];
  const itemName = (id: string) => m.items.find((i) => i.id === id)?.name ?? id;
  const fmt = (c: number | null) => (c === null ? "MP" : `$${(c / 100).toFixed(2)}`);

  for (const op of ops) {
    switch (op.op) {
      case "adjust_prices": {
        const ids = scopeItems(m, op.scope);
        if (!ids.size) {
          skipped.push("Price change matched no items.");
          break;
        }
        const r = ROUND[op.round] ?? ROUND.none;
        const bump = (c: number) => {
          const raw = op.mode === "percent" ? c * (1 + op.value / 100) : c + Math.round(op.value * 100);
          return Math.max(0, r(raw));
        };
        let n = 0;
        m.items = m.items.map((it) => {
          if (!ids.has(it.id)) return it;
          return {
            ...it,
            variations: it.variations.map((v) => {
              if (v.priceCents === null) return v;
              n++;
              return { ...v, priceCents: bump(v.priceCents) };
            }),
          };
        });
        if (op.include_modifiers) {
          const groups = new Set(m.items.filter((i) => ids.has(i.id)).flatMap((i) => i.modifierGroupIds));
          m.modifierGroups = m.modifierGroups.map((g) =>
            groups.has(g.id) ? { ...g, options: g.options.map((o) => (o.priceCents > 0 ? { ...o, priceCents: bump(o.priceCents) } : o)) } : g,
          );
        }
        const how = op.mode === "percent" ? `${op.value > 0 ? "+" : ""}${op.value}%` : `${op.value > 0 ? "+" : "-"}$${Math.abs(op.value).toFixed(2)}`;
        changes.push(`Prices ${how} on ${ids.size} item${ids.size === 1 ? "" : "s"} (${n} price${n === 1 ? "" : "s"})${op.round !== "none" ? `, rounded (${op.round.replace("_", " ")})` : ""}.`);
        break;
      }
      case "set_price": {
        const it = m.items.find((i) => i.id === op.item_id);
        const p = parsePrice(op.price_text);
        if (!it || p.kind === "none") {
          skipped.push(`Couldn't set price "${op.price_text}" on ${itemName(op.item_id)}.`);
          break;
        }
        const vid = op.variation_id ?? it.variations[0].id;
        const v = it.variations.find((x) => x.id === vid);
        if (!v) {
          skipped.push(`Size not found on ${it.name}.`);
          break;
        }
        const cents = p.kind === "fixed" ? p.cents : null;
        it.variations = it.variations.map((x) => (x.id === vid ? { ...x, priceCents: cents } : x));
        changes.push(`${it.name}${it.variations.length > 1 ? ` (${v.name})` : ""}: ${fmt(v.priceCents)} → ${fmt(cents)}.`);
        break;
      }
      case "update_item": {
        const it = m.items.find((i) => i.id === op.item_id);
        if (!it) {
          skipped.push("Item to edit wasn't found.");
          break;
        }
        const before = it.name;
        if (op.name?.trim()) it.name = op.name.trim();
        if (op.description !== null) it.description = op.description.trim() || undefined;
        changes.push(before !== it.name ? `Renamed ${before} → ${it.name}.` : `Updated ${it.name}.`);
        break;
      }
      case "delete_items": {
        const del = new Set(op.item_ids);
        const names = m.items.filter((i) => del.has(i.id)).map((i) => i.name);
        m.items = m.items.filter((i) => !del.has(i.id));
        if (names.length) changes.push(`Removed ${names.length} item${names.length === 1 ? "" : "s"}: ${names.slice(0, 5).join(", ")}${names.length > 5 ? "…" : ""}.`);
        break;
      }
      case "move_items": {
        let catId = op.category_id && m.categories.some((c) => c.id === op.category_id) ? op.category_id : null;
        if (!catId && op.new_category_name?.trim()) {
          const existing = m.categories.find((c) => c.name.toLowerCase() === op.new_category_name!.trim().toLowerCase());
          if (existing) catId = existing.id;
          else {
            catId = newId("cat");
            m.categories.push({ id: catId, name: op.new_category_name.trim(), sortOrder: m.categories.length });
            changes.push(`New category: ${op.new_category_name.trim()}.`);
          }
        }
        if (!catId) {
          skipped.push("Move: target category not found.");
          break;
        }
        const ids = new Set(op.item_ids);
        let n = 0;
        m.items = m.items.map((i) => (ids.has(i.id) ? (n++, { ...i, categoryId: catId! }) : i));
        changes.push(`Moved ${n} item${n === 1 ? "" : "s"} to ${m.categories.find((c) => c.id === catId)!.name}.`);
        break;
      }
      case "rename_category": {
        const c = m.categories.find((x) => x.id === op.category_id);
        if (!c || !op.name.trim()) {
          skipped.push("Category to rename wasn't found.");
          break;
        }
        changes.push(`Category ${c.name} → ${op.name.trim()}.`);
        c.name = op.name.trim();
        break;
      }
      case "reorder_categories": {
        const order = op.category_ids.filter((id) => m.categories.some((c) => c.id === id));
        const rest = [...m.categories].sort((a, b) => a.sortOrder - b.sortOrder).filter((c) => !order.includes(c.id)).map((c) => c.id);
        const full = [...order, ...rest];
        m.categories = m.categories.map((c) => ({ ...c, sortOrder: full.indexOf(c.id) }));
        changes.push("Reordered categories.");
        break;
      }
      case "delete_category": {
        const c = m.categories.find((x) => x.id === op.category_id);
        if (!c) {
          skipped.push("Category to delete wasn't found.");
          break;
        }
        const to = op.move_items_to_category_id && m.categories.some((x) => x.id === op.move_items_to_category_id) ? op.move_items_to_category_id : null;
        const count = m.items.filter((i) => i.categoryId === c.id).length;
        m.items = to ? m.items.map((i) => (i.categoryId === c.id ? { ...i, categoryId: to } : i)) : m.items.filter((i) => i.categoryId !== c.id);
        m.categories = m.categories.filter((x) => x.id !== c.id).sort((a, b) => a.sortOrder - b.sortOrder).map((x, k) => ({ ...x, sortOrder: k }));
        changes.push(`Deleted category ${c.name}${count ? (to ? ` (moved ${count} items)` : ` and its ${count} items`) : ""}.`);
        break;
      }
      case "update_group": {
        const g = m.modifierGroups.find((x) => x.id === op.group_id);
        if (!g) {
          skipped.push("Modifier group wasn't found.");
          break;
        }
        if (op.name?.trim()) g.name = op.name.trim();
        if (op.min_select !== null) g.minSelect = Math.max(0, op.min_select);
        if (op.max_select !== null) g.maxSelect = op.max_select <= 0 ? null : op.max_select;
        if (g.maxSelect !== null && g.maxSelect < g.minSelect) g.maxSelect = g.minSelect;
        changes.push(`${g.name}: min ${g.minSelect}, max ${g.maxSelect ?? "no limit"}.`);
        break;
      }
      case "add_group": {
        const options = op.options
          .filter((o) => o.name.trim())
          .map((o) => {
            const p = parsePrice(o.price_text);
            return { id: newId("opt"), name: o.name.trim(), priceCents: p.kind === "fixed" ? p.cents : 0, isDefault: false };
          });
        if (!op.name.trim() || !options.length) {
          skipped.push("New modifier group had no options.");
          break;
        }
        const min = Math.max(0, op.min_select);
        const max = op.max_select <= 0 ? null : Math.max(op.max_select, min || 1);
        const g = { id: newId("mg"), name: op.name.trim(), minSelect: min, maxSelect: max, options };
        m.modifierGroups.push(g);
        const ids = new Set(op.item_ids);
        m.items = m.items.map((i) => (ids.has(i.id) ? { ...i, modifierGroupIds: [...i.modifierGroupIds, g.id] } : i));
        changes.push(`New modifier group ${g.name} (${options.length} options) on ${ids.size} item${ids.size === 1 ? "" : "s"}.`);
        break;
      }
      case "attach_group":
      case "detach_group": {
        const g = m.modifierGroups.find((x) => x.id === op.group_id);
        const ids = scopeItems(m, op.scope);
        if (!g || !ids.size) {
          skipped.push("Modifier group or items weren't found.");
          break;
        }
        m.items = m.items.map((i) => {
          if (!ids.has(i.id)) return i;
          const has = i.modifierGroupIds.includes(g.id);
          if (op.op === "attach_group") return has ? i : { ...i, modifierGroupIds: [...i.modifierGroupIds, g.id] };
          return has ? { ...i, modifierGroupIds: i.modifierGroupIds.filter((x) => x !== g.id) } : i;
        });
        changes.push(`${op.op === "attach_group" ? "Added" : "Removed"} ${g.name} ${op.op === "attach_group" ? "to" : "from"} ${ids.size} item${ids.size === 1 ? "" : "s"}.`);
        break;
      }
      case "set_option_price": {
        const g = m.modifierGroups.find((x) => x.id === op.group_id);
        const o = g?.options.find((x) => x.name.toLowerCase() === op.option_name.trim().toLowerCase());
        const p = parsePrice(op.price_text);
        if (!g || !o || p.kind !== "fixed") {
          skipped.push(`Couldn't set upcharge for "${op.option_name}".`);
          break;
        }
        changes.push(`${g.name} › ${o.name}: ${fmt(o.priceCents)} → ${fmt(p.cents)}.`);
        o.priceCents = p.cents;
        break;
      }
      case "set_tax_type": {
        const ids = scopeItems(m, op.scope);
        const t: TaxHint = op.tax_type;
        m.items = m.items.map((i) => (ids.has(i.id) ? { ...i, taxHint: t, taxIds: t === "non_taxable" ? [] : m.taxes.map((x) => x.id) } : i));
        changes.push(`Tax type "${t.replace("_", " ")}" on ${ids.size} item${ids.size === 1 ? "" : "s"}.`);
        break;
      }
    }
  }
  // Drop groups no longer used? Keep them: the user may still want them. Clean dangling refs only.
  const groupIds = new Set(m.modifierGroups.map((g) => g.id));
  m = { ...m, items: m.items.map((i) => ({ ...i, modifierGroupIds: i.modifierGroupIds.filter((g) => groupIds.has(g)) })) };
  return { menu: m, changes, skipped };
}

/** Compact view of the menu for the model (IDs + what it needs, no noise). */
export function compactMenu(menu: Menu) {
  const cats = [...menu.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  return {
    categories: cats.map((c) => ({
      id: c.id,
      name: c.name,
      items: menu.items
        .filter((i) => i.categoryId === c.id)
        .map((i) => ({
          id: i.id,
          name: i.name,
          description: i.description ?? null,
          prices: i.variations.map((v) => ({ variation_id: v.id, size: v.name, price: v.priceCents === null ? "MP" : (v.priceCents / 100).toFixed(2) })),
          modifier_group_ids: i.modifierGroupIds,
          tax: i.taxHint,
        })),
    })),
    modifier_groups: menu.modifierGroups.map((g) => ({
      id: g.id,
      name: g.name,
      min: g.minSelect,
      max: g.maxSelect ?? "no limit",
      options: g.options.map((o) => ({ name: o.name, upcharge: (o.priceCents / 100).toFixed(2) })),
    })),
  };
}
