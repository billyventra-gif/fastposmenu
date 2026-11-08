import ExcelJS from "exceljs";
import Papa from "papaparse";
import type { Extraction } from "../menu/extraction-schema";

export type Sheet = { name: string; rows: string[][] };

export async function readSpreadsheet(buf: ArrayBuffer, filename: string): Promise<Sheet[]> {
  if (/\.csv$/i.test(filename) || /\.txt$/i.test(filename)) {
    const text = new TextDecoder().decode(buf).replace(/^﻿/, "");
    const res = Papa.parse<string[]>(text, { skipEmptyLines: "greedy" });
    return [{ name: filename, rows: res.data.map((r) => r.map((c) => String(c ?? "").trim())) }];
  }
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buf);
  const sheets: Sheet[] = [];
  wb.eachSheet((ws) => {
    const rows: string[][] = [];
    ws.eachRow({ includeEmpty: false }, (row) => {
      const vals = (row.values as unknown[]).slice(1).map(cellText);
      if (vals.some((v) => v)) rows.push(vals);
    });
    if (rows.length) sheets.push({ name: ws.name, rows });
  });
  return sheets;
}

function cellText(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") {
    const o = v as { text?: string; result?: unknown; richText?: { text: string }[] };
    if (o.richText) return o.richText.map((r) => r.text).join("").trim();
    if (o.text !== undefined) return String(o.text).trim();
    if (o.result !== undefined) return String(o.result).trim();
    if (v instanceof Date) return v.toISOString();
  }
  return String(v).trim();
}

/** Find the header row: first row in the top 10 that has a name-ish and a price-ish column. */
function findHeader(rows: string[][]): number {
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const h = rows[i].map((c) => c.toLowerCase());
    if (h.some((c) => /name|item/.test(c)) && h.some((c) => /price|cost|amount/.test(c))) return i;
  }
  return -1;
}

const pick = (h: string[], ...res: RegExp[]) => {
  for (const re of res) {
    const i = h.findIndex((c) => re.test(c));
    if (i >= 0) return i;
  }
  return -1;
};

/**
 * Deterministic mapping for tidy spreadsheets and common POS exports (Square item library,
 * Clover inventory, generic "name / price / category"). Returns null if the layout isn't
 * recognized; caller then sends the sheet text to Claude.
 *
 * Modifiers in exports are too vendor-specific to map blind, so they go to Claude unless
 * we recognize the format.
 */
export function mapSheetDeterministic(sheet: Sheet): Extraction | null {
  const hi = findHeader(sheet.rows);
  if (hi < 0) return null;
  const h = sheet.rows[hi].map((c) => c.toLowerCase().trim());
  const iName = pick(h, /^item name$/, /^name$/, /^item$/, /item name/, /name/);
  const iPrice = pick(h, /^price$/, /price/, /cost|amount/);
  if (iName < 0 || iPrice < 0) return null;
  const iVar = pick(h, /^variation name$/, /^variation$/, /^size$/, /variant/);
  const iCat = pick(h, /^categories$/, /^category$/, /^reporting category$/, /categor/, /menu group|group/);
  const iDesc = pick(h, /^description$/, /descr/);

  const cats = new Map<string, Extraction["categories"][number]>();
  let lastItem: Extraction["categories"][number]["items"][number] | null = null;
  let lastName = "";

  for (const r of sheet.rows.slice(hi + 1)) {
    const name = (r[iName] ?? "").trim();
    const price = (r[iPrice] ?? "").trim();
    const variation = iVar >= 0 ? (r[iVar] ?? "").trim() : "";
    // Square exports: variation rows repeat the item name (or leave it blank).
    if ((!name || name === lastName) && lastItem && variation) {
      lastItem.prices.push({ label: variation, price_text: price });
      continue;
    }
    if (!name) continue;
    const catName = (iCat >= 0 ? r[iCat] : "")?.split(/[,;]/)[0]?.trim() || "Uncategorized";
    if (!cats.has(catName)) cats.set(catName, { name: catName, description: null, items: [] });
    const item = {
      name,
      description: iDesc >= 0 && r[iDesc] ? r[iDesc] : null,
      prices: [{ label: variation && !/^regular$/i.test(variation) ? variation : null, price_text: price }],
      modifier_groups: [],
      dietary: [],
      tax_hint: "unknown" as const,
      confidence: "high" as const,
      note: null,
    };
    cats.get(catName)!.items.push(item);
    lastItem = item;
    lastName = name;
  }
  // If a single-price item later gained variations, its first label shouldn't be null.
  for (const c of cats.values())
    for (const it of c.items)
      if (it.prices.length > 1 && it.prices[0].label === null) it.prices[0].label = "Regular";

  if (cats.size === 0) return null;
  return { restaurant_name: null, categories: [...cats.values()], modifier_groups: [], notes: [] };
}

/** Does the workbook look like it carries modifiers we can't map deterministically? */
export function looksLikeHasModifiers(sheets: Sheet[]): boolean {
  return sheets.some(
    (s) => /modifier/i.test(s.name) || (s.rows[0] ?? []).some((c) => /modifier/i.test(c)),
  );
}

/** Render sheets as CSV text for Claude. Never truncated: caller rejects oversize input instead. */
export function sheetsToText(sheets: Sheet[]): string {
  return sheets.map((s) => `### Sheet: ${s.name}\n${Papa.unparse(s.rows)}\n`).join("\n");
}
