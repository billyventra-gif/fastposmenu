import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { BetaContentBlockParam } from "@anthropic-ai/sdk/resources/beta/messages/messages";
import { Extraction } from "../menu/extraction-schema";

/**
 * Claude menu extraction. The model reads; code does the math.
 *
 * Model is configurable so we can trade cost vs accuracy per plan (see docs/research.md §5).
 * Default: Claude Opus 5.5. Effort default "medium" (Opus 5.5's own default; set explicitly).
 */
const MODEL = process.env.MENU_MODEL || "claude-opus-5-5";
type Effort = "low" | "medium" | "high" | "xhigh" | "max";
const EFFORT = (process.env.MENU_EFFORT as Effort) || "medium";

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic());

// Frozen system prompt: keep byte-stable so it caches across requests.
const SYSTEM = `You turn restaurant menus into structured data for POS import.

Read every item on every page. Copy text faithfully:
- Names and descriptions exactly as printed (fix obvious OCR noise, don't rewrite copy).
- Prices exactly as printed into price_text. Don't convert, round, or add tax.
- One prices[] entry per size/variant ("Sm $8 / Lg $12" = two entries labeled Small/Large as printed).
- Group "choose a side / add protein / dressing" style choices into modifier_groups, define each group once at top level, and list the group names on every item it applies to. Include min/max only when printed or clearly implied ("choose one" = min 1, max 1).
- Section headers become categories, in menu order.
- tax_hint: alcohol for beer/wine/spirits/cocktails; prepared_food for other food and drink; unknown if unsure.
- dietary: only markers printed on the menu.
- Mark confidence "low" and add a short note when you had to guess (blurry, cut off, ambiguous price).
- Put cut-off pages, illegible areas, and printed service-charge/tax notes in notes[].
Don't invent items, prices, or modifiers.`;

export type ExtractInput =
  | { kind: "images"; images: { mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif"; base64: string }[]; label: string }
  | { kind: "pdf"; base64: string; label: string }
  | { kind: "text"; text: string; label: string };

export type ExtractResult = {
  extraction: Extraction;
  usage: { input: number; output: number; cacheRead: number; model: string };
};

export class ExtractionError extends Error {}

export async function extractMenu(input: ExtractInput): Promise<ExtractResult> {
  const content: BetaContentBlockParam[] = [];
  if (input.kind === "images") {
    input.images.forEach((img, i) => {
      content.push({ type: "text", text: `Page ${i + 1}:` });
      content.push({ type: "image", source: { type: "base64", media_type: img.mediaType, data: img.base64 } });
    });
  } else if (input.kind === "pdf") {
    content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: input.base64 } });
  } else {
    content.push({ type: "text", text: `<spreadsheet name="${input.label}">\n${input.text}\n</spreadsheet>` });
  }
  content.push({
    type: "text",
    text:
      input.kind === "text"
        ? "This is a menu or a POS export. Extract the full menu."
        : "Extract the full menu from these pages.",
  });

  const stream = getClient().beta.messages.stream({
    model: MODEL,
    max_tokens: 64000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
    output_config: { effort: EFFORT, format: betaZodOutputFormat(Extraction) },
    messages: [{ role: "user", content }],
  });
  const msg = await stream.finalMessage();

  if (msg.stop_reason === "refusal") throw new ExtractionError("The model declined this file. Try a clearer photo or a different file.");
  if (msg.stop_reason === "max_tokens") throw new ExtractionError("Menu too long for one pass. Split the file into smaller parts and upload again.");
  const parsed = msg.parsed_output;
  if (!parsed) throw new ExtractionError("Couldn't read a menu from this file.");

  return {
    extraction: Extraction.parse(parsed),
    usage: {
      input: msg.usage.input_tokens + (msg.usage.cache_creation_input_tokens ?? 0),
      output: msg.usage.output_tokens,
      cacheRead: msg.usage.cache_read_input_tokens ?? 0,
      model: msg.model,
    },
  };
}
