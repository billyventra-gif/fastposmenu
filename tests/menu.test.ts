import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ExcelJS from "exceljs";
import { parsePrice, centsToDecimal } from "../src/lib/menu/money";
import { Extraction } from "../src/lib/menu/extraction-schema";
import { inferRule, normalizeExtractions, checkMenu } from "../src/lib/menu/normalize";
import { setTaxes } from "../src/lib/menu/edit";
import { mapSheetDeterministic, readSpreadsheet } from "../src/lib/ingest/spreadsheet";
import { classifyLink } from "../src/lib/ingest/link";
import { exportMenu } from "../src/lib/export";
import { squareCatalogPayload } from "../src/lib/export/square";

const fixture = Extraction.parse(JSON.parse(readFileSync(new URL("./fixtures/sample-extraction.json", import.meta.url), "utf8")));

test("parsePrice handles printed formats", () => {
  assert.deepEqual(parsePrice("$12.95"), { kind: "fixed", cents: 1295 });
  assert.deepEqual(parsePrice("12"), { kind: "fixed", cents: 1200 });
  assert.deepEqual(parsePrice("+1.5"), { kind: "fixed", cents: 150 });
  assert.deepEqual(parsePrice("$1,250.00"), { kind: "fixed", cents: 125000 });
  assert.deepEqual(parsePrice(".50"), { kind: "fixed", cents: 50 });
  assert.deepEqual(parsePrice("MP"), { kind: "market" });
  assert.deepEqual(parsePrice("Market Price"), { kind: "market" });
  assert.deepEqual(parsePrice("free"), { kind: "fixed", cents: 0 });
  assert.deepEqual(parsePrice("ask"), { kind: "none" });
  assert.deepEqual(parsePrice(""), { kind: "none" });
  assert.equal(centsToDecimal(1295), "12.95");
  assert.equal(centsToDecimal(5), "0.05");
});

test("inferRule reads printed choice rules", () => {
  assert.deepEqual(inferRule("choose one", null, null), { min: 1, max: 1 });
  assert.deepEqual(inferRule("pick up to 2", null, null), { min: 0, max: 2 });
  assert.deepEqual(inferRule(null, null, null), { min: 0, max: null });
  assert.deepEqual(inferRule("Choose 2", null, null), { min: 2, max: 2 });
  assert.deepEqual(inferRule(null, 3, 1), { min: 3, max: 3 });
});

test("normalize: fixture becomes a valid canonical menu", () => {
  const m = normalizeExtractions([fixture], "square", ["sample-menu.png"]);
  assert.equal(m.restaurantName, "Riverbend Taqueria");
  assert.equal(m.categories.length, 4);
  assert.equal(m.items.length, 13);
  assert.equal(m.modifierGroups.length, 3);
  const protein = m.modifierGroups.find((g) => g.name === "Pick Your Protein")!;
  assert.equal(protein.minSelect, 1);
  assert.equal(protein.maxSelect, 1);
  assert.equal(protein.options[0].priceCents, 200);
  const flavors = m.modifierGroups.find((g) => g.name === "Margarita Flavors")!;
  assert.deepEqual([flavors.minSelect, flavors.maxSelect], [0, 2]);
  const chips = m.items.find((i) => i.name === "Chips & Salsa")!;
  assert.deepEqual(chips.variations.map((v) => [v.name, v.priceCents]), [["Sm", 350], ["Lg", 600]]);
  const shrimp = m.items.find((i) => i.name.startsWith("Shrimp"))!;
  assert.equal(shrimp.variations[0].priceCents, null);
  const burrito = m.items.find((i) => i.name === "Classic Burrito")!;
  assert.equal(burrito.modifierGroupIds.length, 2);
  assert.ok(m.warnings.some((w) => w.includes("gratuity")));
});

test("normalize: merges pages and links groups defined on another page", () => {
  const page1 = { ...fixture, modifier_groups: [] };
  const page2 = { restaurant_name: null, categories: [{ name: "tacos", description: null, items: [] }], modifier_groups: fixture.modifier_groups, notes: [] };
  const m = normalizeExtractions([page1, page2], "clover", []);
  assert.equal(m.categories.length, 4, "tacos == Tacos");
  assert.equal(m.items.find((i) => i.name === "Classic Burrito")!.modifierGroupIds.length, 2);
});

test("CSV path maps deterministically (no model)", async () => {
  const buf = readFileSync(new URL("../samples/sample-menu.csv", import.meta.url));
  const sheets = await readSpreadsheet(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), "sample-menu.csv");
  const ex = mapSheetDeterministic(sheets[0]);
  assert.ok(ex);
  const m = normalizeExtractions([ex!], "square", ["sample-menu.csv"]);
  assert.equal(m.items.length, 8);
  const h = m.items.find((i) => i.name === "Horchata")!;
  assert.deepEqual(h.variations.map((v) => [v.name, v.priceCents]), [["16oz", 375], ["24oz", 495]]);
  assert.equal(m.items.find((i) => i.name === "House Margarita")!.variations[0].priceCents, 1000);
});

test("link policy blocks marketplaces", () => {
  assert.equal(classifyLink("https://www.doordash.com/store/foo-123").kind, "marketplace");
  assert.equal(classifyLink("order.ubereats.com/x").kind, "marketplace");
  assert.equal(classifyLink("https://www.grubhub.com/restaurant/x").kind, "marketplace");
  assert.equal(classifyLink("riverbendtaqueria.com/menu").kind, "own_site");
  assert.equal(classifyLink("not a url").kind, "invalid");
});

async function readXlsx(body: Uint8Array) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength) as ArrayBuffer);
  const out: Record<string, string[][]> = {};
  wb.eachSheet((ws) => {
    const rows: string[][] = [];
    ws.eachRow((r) => rows.push((r.values as unknown[]).slice(1).map((v) => (v == null ? "" : String(v)))));
    out[ws.name] = rows;
  });
  return out;
}

function sampleMenu(target: "square" | "clover" | "toast") {
  const m = normalizeExtractions([fixture], target, []);
  return setTaxes(m, [{ id: "tax_1", name: "Sales Tax", ratePercent: "8.875" }]);
}

test("Square export: one row per variation, modifier + tax columns", async () => {
  const r = await exportMenu(sampleMenu("square"));
  assert.equal(r.issues.filter((i) => i.level === "error").length, 0);
  const x = await readXlsx(r.files[0].body);
  const [header, ...rows] = x["Items"];
  assert.equal(header[2], "Item Name");
  assert.ok(header.includes("Modifier Set - Pick Your Protein"));
  assert.ok(header.includes("Tax - Sales Tax (8.875%)"));
  assert.equal(rows.length, 15, "13 items + 2 extra variations");
  const price = header.indexOf("Price");
  const shrimp = rows.find((r) => r[2].startsWith("Shrimp"))!;
  assert.equal(shrimp[price], "Variable");
  const modelo = rows.find((r) => r[2] === "Modelo Especial")!;
  assert.equal(modelo[header.indexOf("Contains Alcohol")], "Y");
  assert.ok(r.steps[0].includes("can't create modifier sets"));
  const api = squareCatalogPayload(sampleMenu("square"));
  const objs = api.batches[0].objects;
  assert.equal(objs.filter((o) => o.type === "ITEM").length, 13);
  assert.equal(objs.filter((o) => o.type === "MODIFIER_LIST").length, 3);
});

test("Clover export: 5 sheets, sizes become a required group, links by name", async () => {
  const r = await exportMenu(sampleMenu("clover"));
  const x = await readXlsx(r.files[0].body);
  assert.deepEqual(Object.keys(x), ["Instructions & Glossary", "Items", "Modifier Groups", "Categories", "Tax Rates"]);
  const items = x["Items"];
  assert.equal(items[0][15], "Modifier Groups");
  const chipsIdx = items.findIndex((r) => r[1] === "Chips & Salsa");
  assert.equal(items[chipsIdx][4], "3.50", "base = smallest size");
  assert.equal(items[chipsIdx][15], "Size: Sm/Lg");
  const burritoIdx = items.findIndex((r) => r[1] === "Classic Burrito");
  assert.equal(items[burritoIdx + 1][1], "", "continuation row has blank name");
  assert.equal(items[burritoIdx + 1][15], "Add-Ons");
  const groups = x["Modifier Groups"];
  assert.ok(groups.some((r) => r[1] === "Pick Your Protein" && r[5] === "1" && r[6] === "1"));
});

test("Toast export: build sheets + bulk import rows", async () => {
  const r = await exportMenu(sampleMenu("toast"));
  const x = await readXlsx(r.files[0].body);
  assert.ok(x["Bulk import (save as CSV)"]);
  const bulk = x["Bulk import (save as CSV)"].slice(1);
  assert.equal(bulk.filter((b) => b[1] === "MENU_ITEM").length, 13);
  assert.ok(bulk.some((b) => b[0] === "ATTACH" && b[3] === "Pick Your Protein"));
  assert.ok(bulk.find((b) => b[3] === "Chips & Salsa")![4] === "PRICED_BY_MODIFIERS");
});

test("checkMenu flags missing taxes and market prices", () => {
  const m = normalizeExtractions([fixture], "square", []);
  const issues = checkMenu(m);
  assert.ok(issues.some((i) => i.message.includes("No tax rate")));
  assert.ok(issues.some((i) => i.message.includes("Shrimp")));
});

test("extract rate limit: 8 per IP per hour, then a wait time", async () => {
  const { takeExtract } = await import("../src/lib/ratelimit");
  const t0 = 1_000_000;
  for (let i = 0; i < 8; i++) assert.equal(takeExtract("1.2.3.4", t0 + i), 0);
  assert.ok(takeExtract("1.2.3.4", t0 + 10) > 0, "9th read in the hour is blocked");
  assert.equal(takeExtract("5.6.7.8", t0 + 10), 0, "other IPs unaffected");
  assert.equal(takeExtract("1.2.3.4", t0 + 60 * 60 * 1000 + 1), 0, "window resets after an hour");
});
