import ExcelJS from "exceljs";
import { centsToDecimal } from "../menu/money";
import type { Menu } from "../menu/schema";
import { addSheet, itemsInOrder, slug, uniqueNames, workbookBytes, XLSX_MIME, type ExportResult } from "./common";
import type { Issue } from "../menu/normalize";

/**
 * Square exporter.
 *
 * 1) Item library XLSX for Dashboard → Items → Import library.
 *    STATUS: needs a real sample export to verify. Column names come from real Square exports
 *    (newest layout, 2025-26). Order matches those exports; Square matches by header name.
 *    Known limit: the spreadsheet can LINK modifier sets that already exist ("Modifier Set - X" = Y)
 *    but can't CREATE them. So we tell the user to create sets first, or use the API payload.
 *
 * 2) Catalog API batch-upsert JSON (POST /v2/catalog/batch-upsert). Creates categories, taxes,
 *    modifier lists (with min/max), items and variations in one go. High confidence (OpenAPI spec).
 *    Pushing it needs an OAuth app with ITEMS_WRITE. Not wired yet.
 */

// Newest Square export header, in order. Per-location columns are omitted: we import to all locations.
const BASE_HEADER = [
  "Reference Handle",
  "Token",
  "Item Name",
  "Variation Name",
  "Unit and Precision",
  "SKU",
  "Description",
  "Categories",
  "Reporting Category",
  "SEO Title",
  "SEO Description",
  "Permalink",
  "GTIN",
  "Square Online Item Visibility",
  "Item Type",
  "Weight (lb)",
  "Social Media Link Title",
  "Social Media Link Description",
  "Shipping Enabled",
  "Self-serve Ordering Enabled",
  "Delivery Enabled",
  "Pickup Enabled",
  "Price",
  "Online Sale Price",
  "Archived",
  "Sellable",
  "Contains Alcohol",
  "Stockable",
  "Auto Add Item to Check",
  "Option Name 1",
  "Option Value 1",
  "Default Unit Cost",
  "Default Vendor Name",
  "Default Vendor Code",
];

const NAME_MAX = 512;

export function squareRows(menu: Menu) {
  const issues: Issue[] = [];
  const catName = new Map(menu.categories.map((c) => [c.id, c.name]));
  const groups = menu.modifierGroups;
  const groupNames = uniqueNames(groups, (g) => g.name);
  const header = [
    ...BASE_HEADER,
    ...groups.map((g) => `Modifier Set - ${groupNames.get(g)}`),
    ...menu.taxes.map((t) => `Tax - ${t.name} (${t.ratePercent}%)`),
  ];
  const col = (h: string) => header.indexOf(h);
  const rows: (string | number | null)[][] = [];
  const items = itemsInOrder(menu);
  const itemNames = uniqueNames(items, (i) => i.name);

  for (const it of items) {
    const name = itemNames.get(it)!;
    if (name.length > NAME_MAX) issues.push({ level: "error", message: `"${name.slice(0, 40)}…" is longer than Square allows.`, itemId: it.id });
    if (name !== it.name) issues.push({ level: "warn", message: `Renamed duplicate "${it.name}" to "${name}" (Square needs unique item names).`, itemId: it.id });
    const varNames = uniqueNames(it.variations, (v) => v.name);
    it.variations.forEach((v) => {
      const r: (string | number | null)[] = new Array(header.length).fill(null);
      r[col("Reference Handle")] = `#${slug(name)}`;
      r[col("Item Name")] = name;
      r[col("Variation Name")] = varNames.get(v)!;
      r[col("SKU")] = v.sku ?? null;
      // Square repeats item-level fields on every variation row in its exports.
      r[col("Description")] = it.description ?? null;
      r[col("Categories")] = catName.get(it.categoryId) ?? null;
      r[col("Reporting Category")] = catName.get(it.categoryId) ?? null;
      r[col("Item Type")] = "Prepared food and beverage";
      r[col("Price")] = v.priceCents === null ? "Variable" : centsToDecimal(v.priceCents);
      r[col("Archived")] = "N";
      r[col("Sellable")] = "Y";
      r[col("Stockable")] = "N";
      r[col("Contains Alcohol")] = it.taxHint === "alcohol" ? "Y" : "N";
      r[col("Self-serve Ordering Enabled")] = "Y";
      r[col("Delivery Enabled")] = "Y";
      r[col("Pickup Enabled")] = "Y";
      r[col("Auto Add Item to Check")] = "N";
      for (const g of groups) r[col(`Modifier Set - ${groupNames.get(g)}`)] = it.modifierGroupIds.includes(g.id) ? "Y" : "N";
      for (const t of menu.taxes) r[col(`Tax - ${t.name} (${t.ratePercent}%)`)] = it.taxIds.includes(t.id) ? "Y" : "N";
      rows.push(r);
    });
  }
  return { header, rows, issues, groupNames };
}

export async function exportSquare(menu: Menu): Promise<ExportResult> {
  const { header, rows, issues, groupNames } = squareRows(menu);
  const wb = new ExcelJS.Workbook();
  addSheet(wb, "Items", header, rows);
  const base = slug(menu.restaurantName || "menu");

  const steps: string[] = [];
  if (menu.modifierGroups.length) {
    steps.push(
      "Square's spreadsheet import can't create modifier sets. Before importing, create these in Items → Modifiers (exact names):",
      ...menu.modifierGroups.map(
        (g) =>
          `• ${groupNames.get(g)} — ${g.options.map((o) => (o.priceCents ? `${o.name} +${centsToDecimal(o.priceCents)}` : o.name)).join(", ")}` +
          ` (min ${g.minSelect}, max ${g.maxSelect ?? "no limit"})`,
      ),
      "Or skip that: the API file creates everything in one push once we connect your Square account.",
    );
  }
  steps.push("Then: Items & services → Items → Actions → Import library → Modify library → upload the .xlsx.");

  return {
    files: [
      { filename: `${base}-square-item-library.xlsx`, mime: XLSX_MIME, body: await workbookBytes(wb) },
      {
        filename: `${base}-square-catalog-api.json`,
        mime: "application/json",
        body: new TextEncoder().encode(JSON.stringify(squareCatalogPayload(menu), null, 2)),
      },
    ],
    issues,
    steps,
  };
}

/** Square Catalog API batch-upsert body. Temp IDs start with "#" per Square's convention. */
export function squareCatalogPayload(menu: Menu) {
  const t = (id: string) => `#${id}`;
  const objects: Record<string, unknown>[] = [];
  for (const c of menu.categories) objects.push({ type: "CATEGORY", id: t(c.id), category_data: { name: c.name } });
  for (const tax of menu.taxes)
    objects.push({
      type: "TAX",
      id: t(tax.id),
      tax_data: { name: tax.name, percentage: tax.ratePercent, calculation_phase: "TAX_SUBTOTAL_PHASE", inclusion_type: "ADDITIVE", applies_to_custom_amounts: true, enabled: true },
    });
  for (const g of menu.modifierGroups)
    objects.push({
      type: "MODIFIER_LIST",
      id: t(g.id),
      modifier_list_data: {
        name: g.name,
        selection_type: g.maxSelect === 1 ? "SINGLE" : "MULTIPLE",
        min_selected_modifiers: g.minSelect,
        // Omitted = no maximum.
        ...(g.maxSelect !== null ? { max_selected_modifiers: g.maxSelect } : {}),
        modifiers: g.options.map((o, i) => ({
          type: "MODIFIER",
          id: t(o.id),
          modifier_data: { name: o.name, price_money: { amount: o.priceCents, currency: "USD" }, ordinal: i + 1 },
        })),
      },
    });
  for (const it of itemsInOrder(menu))
    objects.push({
      type: "ITEM",
      id: t(it.id),
      item_data: {
        name: it.name,
        description: it.description,
        product_type: "FOOD_AND_BEV",
        categories: [{ id: t(it.categoryId) }],
        reporting_category: { id: t(it.categoryId) },
        tax_ids: it.taxIds.map(t),
        is_alcoholic: it.taxHint === "alcohol",
        modifier_list_info: it.modifierGroupIds.map((g) => ({ modifier_list_id: t(g), enabled: true })),
        variations: it.variations.map((v, i) => ({
          type: "ITEM_VARIATION",
          id: t(v.id),
          item_variation_data: {
            item_id: t(it.id),
            name: v.name,
            ordinal: i,
            sku: v.sku,
            ...(v.priceCents === null
              ? { pricing_type: "VARIABLE_PRICING" }
              : { pricing_type: "FIXED_PRICING", price_money: { amount: v.priceCents, currency: "USD" } }),
          },
        })),
      },
    });
  // Square caps a batch at 1,000 objects; split if needed.
  const batches = [];
  for (let i = 0; i < objects.length; i += 1000) batches.push({ objects: objects.slice(i, i + 1000) });
  return { idempotency_key: crypto.randomUUID(), batches };
}
