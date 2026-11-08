import ExcelJS from "exceljs";
import { centsToDecimal } from "../menu/money";
import type { Issue } from "../menu/normalize";
import type { Menu } from "../menu/schema";
import { addSheet, itemsInOrder, slug, sortedCategories, uniqueNames, workbookBytes, XLSX_MIME, type ExportResult } from "./common";

/**
 * Toast exporter.
 *
 * Toast has no public menu-write API (Menus API v2/v3 are read-only) and no general self-serve
 * import. Two outputs, one workbook:
 *
 * 1) "Menu build" sheets in Toast's own structure (Menu → Menu Group → Item → Modifier Group →
 *    Modifier). For Toast's onboarding/menu team, or for keying it into Toast Web.
 * 2) "Bulk import" sheet shaped like Toast Web's bulk import CSV (Menus → Bulk management),
 *    available on Essentials/Pro/Enterprise. Menus and menu groups must already exist; rows point
 *    to them by GUID, so the user fills in the group GUIDs. Save the sheet as CSV to upload.
 *
 * STATUS: needs a real sample export to verify. Bulk-import column names are MEDIUM confidence,
 * order/capitalization LOW. No public Toast template was available to diff against.
 */

const BULK_HEADER = [
  "Operation",
  "Entity type",
  "Operation ID",
  "Name",
  "Pricing strategy",
  "Price",
  "Parent entity type",
  "Parent version ID or operation ID",
];

export async function exportToast(menu: Menu): Promise<ExportResult> {
  const issues: Issue[] = [];
  const menuName = menu.restaurantName ? `${menu.restaurantName} Menu` : "Main Menu";
  const cats = sortedCategories(menu);
  const catName = new Map(cats.map((c) => [c.id, c.name]));
  const groupNames = uniqueNames(menu.modifierGroups, (g) => g.name);
  const gName = new Map(menu.modifierGroups.map((g) => [g.id, groupNames.get(g)!]));
  const items = itemsInOrder(menu);

  // Sheet 1-3: human/onboarding build sheets.
  const groupsRows = cats.map((c) => [menuName, c.name, c.description ?? null]);
  const itemRows: (string | number | null)[][] = [];
  for (const it of items) {
    it.variations.forEach((v, i) => {
      itemRows.push([
        catName.get(it.categoryId) ?? "",
        it.name,
        it.variations.length > 1 ? v.name : null,
        v.priceCents === null ? "Open price" : centsToDecimal(v.priceCents),
        i === 0 ? (it.description ?? null) : null,
        i === 0 ? it.modifierGroupIds.map((g) => gName.get(g)).filter(Boolean).join("; ") : null,
        i === 0 ? (it.taxHint === "alcohol" ? "Alcohol" : it.taxHint === "non_taxable" ? "None" : "Food") : null,
        v.sku ?? null,
      ]);
    });
  }
  const modRows: (string | number | null)[][] = [];
  for (const g of menu.modifierGroups)
    g.options.forEach((o, i) =>
      modRows.push([
        i === 0 ? gName.get(g.id)! : null,
        i === 0 ? (g.minSelect > 0 ? "Required" : "Optional") : null,
        i === 0 ? g.minSelect : null,
        i === 0 ? (g.maxSelect ?? "No limit") : null,
        o.name,
        centsToDecimal(o.priceCents),
      ]),
    );

  // Sheet 4: bulk import rows.
  const bulk: (string | null)[][] = [];
  let n = 0;
  const op = () => `fpm-${++n}`;
  const itemOp = new Map<string, string>();
  for (const it of items) {
    if (it.variations.length > 1) {
      issues.push({ level: "warn", message: `"${it.name}" has sizes. Toast bulk import makes sizes a modifier group priced by modifier.`, itemId: it.id });
    }
    const id = op();
    itemOp.set(it.id, id);
    const multi = it.variations.length > 1;
    bulk.push([
      "CREATE",
      "MENU_ITEM",
      id,
      it.name,
      multi ? "PRICED_BY_MODIFIERS" : "BASE",
      multi || it.variations[0].priceCents === null ? "" : centsToDecimal(it.variations[0].priceCents!),
      "MENU_GROUP",
      `REPLACE_WITH_GUID: ${catName.get(it.categoryId) ?? ""}`,
    ]);
    if (multi) {
      const sg = op();
      bulk.push(["CREATE", "MODIFIER_GROUP", sg, "Size", "", "", "MENU_ITEM", id]);
      for (const v of it.variations)
        bulk.push(["CREATE", "MODIFIER", op(), v.name, "", v.priceCents === null ? "" : centsToDecimal(v.priceCents), "MODIFIER_GROUP", sg]);
    }
  }
  // Toast bulk import can't parent a new modifier group to a menu group, only to an item.
  // Create each group under its first item, then ATTACH to the rest.
  for (const g of menu.modifierGroups) {
    const users = items.filter((i) => i.modifierGroupIds.includes(g.id));
    if (!users.length) continue;
    const gid = op();
    bulk.push(["CREATE", "MODIFIER_GROUP", gid, gName.get(g.id)!, "", "", "MENU_ITEM", itemOp.get(users[0].id)!]);
    for (const o of g.options) bulk.push(["CREATE", "MODIFIER", op(), o.name, "", centsToDecimal(o.priceCents), "MODIFIER_GROUP", gid]);
    for (const u of users.slice(1)) bulk.push(["ATTACH", "MODIFIER_GROUP", gid, gName.get(g.id)!, "", "", "MENU_ITEM", itemOp.get(u.id)!]);
    if (g.minSelect !== 1 || g.maxSelect !== 1)
      issues.push({ level: "warn", message: `Toast bulk import makes "${gName.get(g.id)}" required, pick 1. Set min ${g.minSelect} / max ${g.maxSelect ?? "no limit"} in Toast Web after import.` });
  }

  const wb = new ExcelJS.Workbook();
  addSheet(wb, "Menu Groups", ["Menu", "Menu Group", "Description"], groupsRows);
  addSheet(wb, "Items", ["Menu Group", "Item", "Size", "Price", "Description", "Modifier Groups", "Tax", "SKU / PLU"], itemRows);
  addSheet(wb, "Modifier Groups", ["Modifier Group", "Required?", "Min", "Max", "Modifier", "Price"], modRows);
  addSheet(wb, "Bulk import (save as CSV)", BULK_HEADER, bulk);
  addSheet(wb, "Taxes", ["Tax", "Rate %"], menu.taxes.map((t) => [t.name, t.ratePercent]));

  return {
    files: [{ filename: `${slug(menu.restaurantName || "menu")}-toast-menu-build.xlsx`, mime: XLSX_MIME, body: await workbookBytes(wb) }],
    issues,
    steps: [
      "Toast has no self-serve import for most accounts. Send this workbook to your Toast onboarding/menu team, or key it in Toast Web → Menus.",
      "On Essentials/Pro/Enterprise: create the menu and menu groups first, paste each group's GUID over REPLACE_WITH_GUID on the Bulk import sheet, save that sheet as CSV, then Menus → Bulk management → Import.",
      "Bulk import can't be undone. Save, then Publish.",
    ],
  };
}
