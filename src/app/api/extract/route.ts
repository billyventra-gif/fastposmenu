import { extractMenu, ExtractionError, type ExtractInput } from "@/lib/ingest/claude";
import {
  looksLikeHasModifiers,
  mapSheetDeterministic,
  readSpreadsheet,
  sheetsToText,
} from "@/lib/ingest/spreadsheet";
import { costUsd } from "@/lib/billing/costs";
import { canExtract } from "@/lib/billing/entitlements";
import { normalizeExtractions } from "@/lib/menu/normalize";
import type { Extraction } from "@/lib/menu/extraction-schema";
import { PosTarget } from "@/lib/menu/schema";

export const maxDuration = 300;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
type ImageType = (typeof IMAGE_TYPES)[number];
const MAX_IMAGES_PER_CALL = 20;
// ~300k tokens of spreadsheet text. Bigger than that: ask the user to split it.
const MAX_SHEET_CHARS = 1_000_000;

export async function POST(req: Request) {
  const form = await req.formData();
  const target = PosTarget.safeParse(form.get("target"));
  if (!target.success) return Response.json({ error: "Pick a POS first." }, { status: 400 });
  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) return Response.json({ error: "Add at least one file." }, { status: 400 });

  // Billing hook: always allowed until Stripe is wired.
  const ent = await canExtract();
  if (!ent.allowed) return Response.json({ error: ent.reason }, { status: 402 });

  const jobs: ExtractInput[] = [];
  const direct: Extraction[] = [];
  const images: { mediaType: ImageType; base64: string }[] = [];

  try {
    for (const f of files) {
      const buf = await f.arrayBuffer();
      const name = f.name || "upload";
      if ((IMAGE_TYPES as readonly string[]).includes(f.type)) {
        images.push({ mediaType: f.type as ImageType, base64: Buffer.from(buf).toString("base64") });
      } else if (f.type === "application/pdf" || /\.pdf$/i.test(name)) {
        jobs.push({ kind: "pdf", base64: Buffer.from(buf).toString("base64"), label: name });
      } else if (/\.(csv|xlsx|txt)$/i.test(name)) {
        const sheets = await readSpreadsheet(buf, name);
        const mapped = looksLikeHasModifiers(sheets) ? null : sheets.length === 1 ? mapSheetDeterministic(sheets[0]) : null;
        if (mapped) {
          direct.push(mapped); // clean sheet: no tokens spent
        } else {
          const text = sheetsToText(sheets);
          if (text.length > MAX_SHEET_CHARS)
            return Response.json({ error: `${name} is too big for one pass. Split it into smaller files.` }, { status: 413 });
          jobs.push({ kind: "text", text, label: name });
        }
      } else if (/\.xls$/i.test(name)) {
        return Response.json({ error: `${name} is an old .xls file. Save it as .xlsx or .csv and try again.` }, { status: 415 });
      } else {
        return Response.json({ error: `Can't read ${name}. Use a photo, PDF, CSV, or XLSX.` }, { status: 415 });
      }
    }
    for (let i = 0; i < images.length; i += MAX_IMAGES_PER_CALL) {
      jobs.push({ kind: "images", images: images.slice(i, i + MAX_IMAGES_PER_CALL), label: `photos ${i + 1}+` });
    }

    const results = await Promise.all(jobs.map((j) => extractMenu(j)));
    const menu = normalizeExtractions(
      [...direct, ...results.map((r) => r.extraction)],
      target.data,
      files.map((f) => f.name),
    );

    const usage = results.reduce(
      (a, r) => ({
        input: a.input + r.usage.input,
        output: a.output + r.usage.output,
        cacheRead: a.cacheRead + r.usage.cacheRead,
        costUsd: a.costUsd + costUsd(r.usage.model, r.usage.input, r.usage.output, r.usage.cacheRead),
      }),
      { input: 0, output: 0, cacheRead: 0, costUsd: 0 },
    );
    console.log("[extract]", { files: files.length, calls: jobs.length, items: menu.items.length, ...usage });

    return Response.json({ menu, usage });
  } catch (e) {
    if (e instanceof ExtractionError) return Response.json({ error: e.message }, { status: 422 });
    console.error("[extract] failed", e);
    return Response.json({ error: "Something broke reading that file. Try again." }, { status: 500 });
  }
}
