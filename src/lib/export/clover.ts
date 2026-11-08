import ExcelJS from "exceljs";
import { centsToDecimal } from "../menu/money";
import type { Issue } from "../menu/normalize";
import type { Menu, ModifierGroup } from "../menu/schema";
import { addSheet, itemsInOrder, slug, sortedCategories, uniqueNames, workbookBytes, XLSX_MIME, type ExportResult } from "./common";

/**
 * Clover exporter: inventory import workbook (template v2.0.0 layout).
 *
 * STATUS: needs a real sample export to verify. Sheet + column names come from a real
 * Clover export (template v2.0.0) found in public repos and match Clover help ("column P links
 * modifier groups"). Unverified: re-import update vs duplicate behavior, Variant columns.
 *
 * Linking is BY NAME. An item with several groups/categories/taxes uses extra rows below it
 * with every other cell blank.
 *
 * Sizes: Clover restaurants usually sell sizes through a required "Size" modifier group.
 * We do the same: item price = cheapest size, group options carry the upcharge. Items with the
 * same size labels and upcharges share one group.
 */

const ITEMS_HEADER = [
  "Clover ID",
  "Name",
  "Alternate Name",
  "Description",
  "Price",
  "Price Type",
  "Price Unit",
  "Cost",
  "Product Code",
  "SKU",
  "Quantity",
  "Hidden?",
  "Default tax rates?",
  "Non-revenue item?",
  "Printer Labels",
  "Modifier Groups",
  "Categories",
  "Tax Rates",
];
const GROUPS_HEADER = ["Modifier Group ID", "Modifier Group Name", "Pop up Automatically?", "Modifier", "Price", "Required Quantity", "Max Quantity"];
const CATS_HEADER = ["Category ID", "Category Name", "Subcategory Name", "Item Sort Order"];
const TAX_HEADER = ["Tax Rate ID", "Name", "Tax Rate", "Tax Amount", "Default?"];

const NAME_MAX = 127; // Clover item name limit (API). Conservative.

export async function exportClover(menu: Menu): Promise<ExportResult> {
  const issues: Issue[] = [];
  const catName = new Map(menu.categories.map((c) => [c.id, c.name]));
  const groupNames = uniqueNames(menu.modifierGroups, (g) => g.name);
  const groupName = new Map(menu.modifierGroups.map((g) => [g.id, groupNames.get(g)!]));

  // Size groups synthesized from variations.
  const sizeGroups = new Map<string, { name: string; min: number; max: number; options: { name: string; cents: number }[] }>();
  const items = itemsInOrder(menu);
  const itemNames = uniqueNames(items, (i) => i.name);

  const itemRows: (string | number | null)[][] = [];
  for (const it of items) {
    const name = itemNames.get(it)!;
    if (name.length > NAME_MAX) issues.push({ level: "error", message: `"${name.slice(0, 40)}…" is longer than ${NAME_MAX} characters.`, itemId: it.id });
    const groups = it.modifierGroupIds.map((g) => groupName.get(g)!).filter(Boolean);

    let priceCents: number | null = it.variations[0].priceCents;
    if (it.variations.length > 1) {
      const fixed = it.variations.filter((v) => v.priceCents !== null);
      if (fixed.length !== it.variations.length) {
        issues.push({ level: "warn", message: `"${name}" mixes fixed and market prices; sizes import as fixed only.`, itemId: it.id });
      }
      const base = Math.min(...fixed.map((v) => v.priceCents!));
      priceCents = Number.isFinite(base) ? base : null;
      const options = it.variations.map((v) => ({ name: v.name, cents: (v.priceCents ?? base) - base }));
      const sig = options.map((o) => `${o.name.toLowerCase()}:${o.cents}`).join("|");
      if (!sizeGroups.has(sig)) {
        const label = `Size: ${options.map((o) => o.name).join("/")}`;
        const clash = [...sizeGroups.values()].filter((g) => g.name.startsWith(label)).length;
        sizeGroups.set(sig, { name: clash ? `${label} (${clash + 1})` : label, min: 1, max: 1, options });
      }
      groups.unshift(sizeGroups.get(sig)!.name);
    }

    const taxes = menu.taxes.filter((t) => it.taxIds.includes(t.id)).map((t) => t.name);
    const cats = [catName.get(it.categoryId) ?? ""];
    const extra = Math.max(groups.length, cats.length, taxes.length, 1);
    for (let k = 0; k < extra; k++) {
      const r: (string | number | null)[] = new Array(ITEMS_HEADER.length).fill(null);
      if (k === 0) {
        r[1] = name;
        r[3] = it.description ?? null;
        r[4] = priceCents === null ? "0.00" : centsToDecimal(priceCents);
        r[5] = priceCents === null ? "Variable" : "Fixed";
        r[9] = it.variations[0].sku ?? null;
        r[11] = "No";
        r[12] = taxes.length ? "Yes" : "No";
        r[13] = "No";
      }
      r[15] = groups[k] ?? null;
      r[16] = cats[k] ?? null;
      r[17] = taxes[k] ?? null;
      itemRows.push(r);
    }
  }

  const groupRows: (string | number | null)[][] = [];
  const pushGroup = (name: string, min: number, max: number | null, opts: { name: string; cents: number }[]) => {
    opts.forEach((o, i) => {
      groupRows.push([
        null,
        i === 0 ? name : null,
        i === 0 ? (min > 0 ? "Yes" : "No") : null,
        o.name,
        centsToDecimal(o.cents),
        i === 0 ? min : null,
        i === 0 ? (max ?? "") : null,
      ]);
    });
  };
  for (const g of sizeGroups.values()) pushGroup(g.name, g.min, g.max, g.options);
  for (const g of menu.modifierGroups as ModifierGroup[])
    pushGroup(groupName.get(g.id)!, g.minSelect, g.maxSelect, g.options.map((o) => ({ name: o.name, cents: o.priceCents })));

  const catRows = sortedCategories(menu).map((c) => [null, c.name, null, null]);
  const taxRows = menu.taxes.map((t, i) => [null, t.name, t.ratePercent, null, i === 0 ? "Yes" : "No"]);

  const wb = new ExcelJS.Workbook();
  addSheet(wb, "Instructions & Glossary", ["Fast POS Menu"], [
    ["Generated for Clover inventory import (template v2.0.0 layout)."],
    ["Dashboard → Inventory → Items → ⋯ → Import → upload this file."],
    ["Linking is by name. Extra rows under an item add more modifier groups/categories/taxes."],
  ]);
  addSheet(wb, "Items", ITEMS_HEADER, itemRows);
  addSheet(wb, "Modifier Groups", GROUPS_HEADER, groupRows);
  addSheet(wb, "Categories", CATS_HEADER, catRows);
  addSheet(wb, "Tax Rates", TAX_HEADER, taxRows);

  if (sizeGroups.size)
    issues.push({ level: "warn", message: `Sizes became ${sizeGroups.size} required "Size" modifier group(s). Base price = smallest size.` });

  return {
    files: [{ filename: `${slug(menu.restaurantName || "menu")}-clover-inventory.xlsx`, mime: XLSX_MIME, body: await workbookBytes(wb) }],
    issues,
    steps: [
      "Clover Dashboard → Inventory → Items → ⋯ (More) → Import.",
      "Upload the .xlsx. Clover creates items, modifier groups, categories and tax rates from the sheets.",
      "Spot-check a few items with modifiers on the device before going live.",
    ],
  };
}
