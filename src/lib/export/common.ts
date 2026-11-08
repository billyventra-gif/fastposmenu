import ExcelJS from "exceljs";
import type { Issue } from "../menu/normalize";
import type { Item, Menu } from "../menu/schema";

export type ExportFile = {
  filename: string;
  mime: string;
  body: Uint8Array;
};

export type ExportResult = {
  files: ExportFile[];
  /** POS-specific problems found while exporting. */
  issues: Issue[];
  /** Steps the user must do in the POS (e.g. create modifier sets first). */
  steps: string[];
};

export const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export async function workbookBytes(wb: ExcelJS.Workbook): Promise<Uint8Array> {
  const buf = await wb.xlsx.writeBuffer();
  return new Uint8Array(buf as ArrayBuffer);
}

export function addSheet(wb: ExcelJS.Workbook, name: string, header: string[], rows: (string | number | null)[][]) {
  const ws = wb.addWorksheet(name);
  ws.addRow(header);
  ws.getRow(1).font = { bold: true };
  for (const r of rows) ws.addRow(r.map((v) => (v === null ? "" : v)));
  ws.columns.forEach((c, i) => {
    const longest = Math.max(header[i]?.length ?? 8, ...rows.slice(0, 200).map((r) => String(r[i] ?? "").length));
    c.width = Math.min(50, Math.max(10, longest + 2));
  });
  return ws;
}

export function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "menu";
}

export function sortedCategories(menu: Menu) {
  return [...menu.categories].sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Items in menu order: by category sort order, then original order. */
export function itemsInOrder(menu: Menu): Item[] {
  const order = new Map(sortedCategories(menu).map((c, i) => [c.id, i]));
  return menu.items
    .map((it, i) => ({ it, i }))
    .sort((a, b) => (order.get(a.it.categoryId) ?? 0) - (order.get(b.it.categoryId) ?? 0) || a.i - b.i)
    .map((x) => x.it);
}

/** Make names unique within a scope by appending " (2)", " (3)". */
export function uniqueNames<T>(list: T[], get: (t: T) => string): Map<T, string> {
  const seen = new Map<string, number>();
  const out = new Map<T, string>();
  for (const t of list) {
    const base = get(t).trim();
    const k = base.toLowerCase();
    const n = (seen.get(k) ?? 0) + 1;
    seen.set(k, n);
    out.set(t, n === 1 ? base : `${base} (${n})`);
  }
  return out;
}
