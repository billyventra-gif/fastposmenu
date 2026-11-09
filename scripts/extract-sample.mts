/**
 * Live extraction test against the fictional sample menu.
 *   ANTHROPIC_API_KEY=... npm run test:live
 * Optional: MENU_MODEL=claude-sonnet-5-5 to compare models.
 *
 * Scores the model's read against tests/fixtures/sample-extraction.json (hand-written answer key):
 * item recall, price accuracy, modifier-group recall. Prints token cost.
 */
import { readFileSync } from "node:fs";
import { extractMenu, type ExtractInput } from "../src/lib/ingest/claude";
import { Extraction } from "../src/lib/menu/extraction-schema";
import { normalizeExtractions } from "../src/lib/menu/normalize";
import { costUsd } from "../src/lib/billing/costs";

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("No ANTHROPIC_API_KEY. Put it in .env.local (cp .env.example .env.local) and run again.");
  process.exit(1);
}

const root = new URL("../", import.meta.url);
const key = Extraction.parse(JSON.parse(readFileSync(new URL("tests/fixtures/sample-extraction.json", root), "utf8")));
const expected = normalizeExtractions([key], "square", []);
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

async function run(label: string, input: ExtractInput) {
  const t0 = Date.now();
  const { extraction, usage } = await extractMenu(input);
  const got = normalizeExtractions([extraction], "square", []);
  let found = 0;
  let priceOk = 0;
  const misses: string[] = [];
  for (const e of expected.items) {
    const g = got.items.find((i) => norm(i.name).includes(norm(e.name).replace(/\d+$/, "")) || norm(e.name).includes(norm(i.name)));
    if (!g) {
      misses.push(`missing: ${e.name}`);
      continue;
    }
    found++;
    const ep = e.variations.map((v) => v.priceCents).join(",");
    const gp = g.variations.map((v) => v.priceCents).join(",");
    if (ep === gp) priceOk++;
    else misses.push(`price: ${e.name} expected ${ep} got ${gp}`);
  }
  const groupsFound = expected.modifierGroups.filter((eg) => got.modifierGroups.some((g) => norm(g.name).includes(norm(eg.name).slice(0, 6)))).length;
  console.log(`\n== ${label} (${usage.model}, ${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  console.log(`items found     ${found}/${expected.items.length}`);
  console.log(`prices exact    ${priceOk}/${expected.items.length}`);
  console.log(`modifier groups ${groupsFound}/${expected.modifierGroups.length}  (got ${got.modifierGroups.length})`);
  console.log(`tokens in/out   ${usage.input}/${usage.output}  cache read ${usage.cacheRead}`);
  console.log(`cost            $${costUsd(usage.model, usage.input, usage.output, usage.cacheRead).toFixed(4)}`);
  if (misses.length) console.log(misses.map((m) => `  - ${m}`).join("\n"));
}

const png = readFileSync(new URL("samples/sample-menu.png", root)).toString("base64");
const pdf = readFileSync(new URL("samples/sample-menu.pdf", root)).toString("base64");
await run("photo (PNG)", { kind: "images", images: [{ mediaType: "image/png", base64: png }], label: "sample-menu.png" });
await run("PDF", { kind: "pdf", base64: pdf, label: "sample-menu.pdf" });
