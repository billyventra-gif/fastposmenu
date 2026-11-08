import type { Extraction } from "./extraction-schema";
import { parsePrice } from "./money";
import {
  Menu,
  type Category,
  type Item,
  type ModifierGroup,
  type PosTarget,
  type Tax,
  emptyMenu,
  newId,
} from "./schema";

const key = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

const WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
function num(s: string): number | undefined {
  const n = WORDS[s.toLowerCase()] ?? parseInt(s, 10);
  return Number.isFinite(n) ? n : undefined;
}

/** Fill min/max from printed rule text when the model left them null. Code, not the model. */
export function inferRule(
  rule: string | null,
  min: number | null,
  max: number | null,
): { min: number; max: number | null } {
  let lo = min;
  let hi = max;
  const r = (rule ?? "").toLowerCase();
  let m: RegExpMatchArray | null;
  if ((m = r.match(/up to (\w+)/))) {
    hi ??= num(m[1]) ?? null;
    lo ??= 0;
  } else if ((m = r.match(/(?:choose|pick|select)\s+(?:any\s+)?(\w+)/))) {
    const n = num(m[1]);
    if (n !== undefined) {
      lo ??= n;
      hi ??= n;
    }
  }
  if (/required/.test(r)) lo = Math.max(lo ?? 0, 1);
  lo = Math.max(0, lo ?? 0);
  if (hi !== null && hi < 1) hi = null;
  if (hi !== null && hi < lo) hi = lo;
  return { min: lo, max: hi };
}

/**
 * Merge one or more model extractions (one per file / page batch) into a canonical Menu.
 * Categories and modifier groups are de-duplicated by name.
 */
export function normalizeExtractions(
  extractions: Extraction[],
  target: PosTarget,
  files: string[],
): Menu {
  const menu = emptyMenu(target);
  menu.source = { kind: "upload", files };
  const catByKey = new Map<string, Category>();
  const groupByKey = new Map<string, ModifierGroup>();
  const warnings = new Set<string>();

  for (const ex of extractions) {
    if (!menu.restaurantName && ex.restaurant_name) menu.restaurantName = ex.restaurant_name.trim();
    for (const n of ex.notes) warnings.add(n);
  }
  // Pass 1: all modifier groups from every file, so items can reference groups defined on another page.
  for (const ex of extractions) {
    for (const g of ex.modifier_groups) {
      const k = key(g.name);
      if (!g.name.trim() || g.options.length === 0) continue;
      if (groupByKey.has(k)) continue; // first definition wins
      const rule = inferRule(g.rule_text, g.min_select, g.max_select);
      const options = g.options
        .filter((o) => o.name.trim())
        .map((o) => {
          const p = parsePrice(o.price_text);
          if (p.kind === "market") warnings.add(`Modifier "${o.name}" in "${g.name}" has a market price. Set a price.`);
          return {
            id: newId("opt"),
            name: o.name.trim(),
            priceCents: p.kind === "fixed" ? p.cents : 0,
            isDefault: false,
          };
        });
      if (options.length === 0) continue;
      const group: ModifierGroup = {
        id: newId("mg"),
        name: g.name.trim(),
        minSelect: rule.min,
        maxSelect: rule.max === null ? null : Math.min(rule.max, options.length),
        options,
      };
      if (group.maxSelect !== null && group.maxSelect < group.minSelect) group.maxSelect = group.minSelect;
      groupByKey.set(k, group);
    }
  }
  // Pass 2: categories and items.
  for (const ex of extractions) {
    for (const c of ex.categories) {
      const name = c.name.trim() || "Uncategorized";
      const k = key(name);
      let cat = catByKey.get(k);
      if (!cat) {
        cat = {
          id: newId("cat"),
          name,
          description: c.description?.trim() || undefined,
          sortOrder: catByKey.size,
        };
        catByKey.set(k, cat);
      }
      for (const it of c.items) {
        if (!it.name.trim()) continue;
        menu.items.push(toItem(it, cat.id, groupByKey, warnings));
      }
    }
  }

  menu.categories = [...catByKey.values()];
  menu.modifierGroups = [...groupByKey.values()];
  menu.warnings = [...warnings];
  return Menu.parse(menu);
}

function toItem(
  it: Extraction["categories"][number]["items"][number],
  categoryId: string,
  groups: Map<string, ModifierGroup>,
  warnings: Set<string>,
): Item {
  const prices = it.prices.length ? it.prices : [{ label: null, price_text: "" }];
  let low = it.confidence === "low";
  const notes: string[] = it.note ? [it.note] : [];
  const seen = new Set<string>();
  const variations = prices.map((p, i) => {
    const parsed = parsePrice(p.price_text);
    let name = p.label?.trim() || (prices.length === 1 ? "Regular" : `Option ${i + 1}`);
    if (seen.has(key(name))) name = `${name} ${i + 1}`;
    seen.add(key(name));
    if (parsed.kind === "none") {
      low = true;
      notes.push(p.price_text ? `Couldn't read price "${p.price_text}"` : "No price found");
    }
    return {
      id: newId("var"),
      name,
      priceCents: parsed.kind === "fixed" ? parsed.cents : null,
    };
  });

  const modifierGroupIds: string[] = [];
  for (const ref of it.modifier_groups) {
    const g = groups.get(key(ref));
    if (g) {
      if (!modifierGroupIds.includes(g.id)) modifierGroupIds.push(g.id);
    } else {
      warnings.add(`"${it.name}" references modifier group "${ref}" that wasn't found.`);
    }
  }

  return {
    id: newId("item"),
    name: it.name.trim(),
    description: it.description?.trim() || undefined,
    categoryId,
    variations,
    modifierGroupIds,
    taxHint: it.tax_hint,
    taxIds: [],
    dietary: it.dietary.map((d) => d.trim()).filter(Boolean),
    confidence: low ? "low" : "high",
    note: notes.length ? notes.join("; ") : undefined,
  };
}

/** Apply taxes to items from their hint. non_taxable gets none; everything else gets all taxes. */
export function applyDefaultTaxes(menu: Menu): Menu {
  return {
    ...menu,
    items: menu.items.map((it) => ({
      ...it,
      taxIds: it.taxHint === "non_taxable" ? [] : menu.taxes.map((t: Tax) => t.id),
    })),
  };
}

export type Issue = { level: "error" | "warn"; message: string; itemId?: string };

/** Pre-export checks shared by all exporters. Exporters add their own POS-specific checks. */
export function checkMenu(menu: Menu): Issue[] {
  const issues: Issue[] = [];
  const parsed = Menu.safeParse(menu);
  if (!parsed.success) {
    for (const e of parsed.error.issues.slice(0, 20)) {
      issues.push({ level: "error", message: `${e.path.join(".")}: ${e.message}` });
    }
  }
  if (menu.items.length === 0) issues.push({ level: "error", message: "No items yet." });
  const catIds = new Set(menu.categories.map((c) => c.id));
  const groupIds = new Set(menu.modifierGroups.map((g) => g.id));
  const names = new Map<string, number>();
  for (const it of menu.items) {
    if (!catIds.has(it.categoryId)) issues.push({ level: "error", message: `"${it.name}" has no category.`, itemId: it.id });
    for (const g of it.modifierGroupIds)
      if (!groupIds.has(g)) issues.push({ level: "error", message: `"${it.name}" points to a deleted modifier group.`, itemId: it.id });
    if (it.variations.some((v) => v.priceCents === null))
      issues.push({ level: "warn", message: `"${it.name}" has no fixed price (will import as variable price).`, itemId: it.id });
    if (it.confidence === "low") issues.push({ level: "warn", message: `Check "${it.name}"${it.note ? `: ${it.note}` : ""}`, itemId: it.id });
    const k = `${it.categoryId}:${key(it.name)}`;
    names.set(k, (names.get(k) ?? 0) + 1);
  }
  for (const [k, n] of names)
    if (n > 1) {
      const item = menu.items.find((i) => `${i.categoryId}:${key(i.name)}` === k)!;
      issues.push({ level: "warn", message: `"${item.name}" appears ${n} times in the same category.`, itemId: item.id });
    }
  if (menu.taxes.length === 0) issues.push({ level: "warn", message: "No tax rate set. Items will import untaxed." });
  return issues;
}
