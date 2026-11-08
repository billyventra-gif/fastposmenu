import { z } from "zod";

/**
 * What the model returns. Deliberately "dumb":
 * - prices are the raw text as printed ("$12.95", "MP", "+1.50"), parsed in code
 * - no IDs, no cents, no tax rates
 * - modifier groups referenced by name; code links them
 *
 * Kept flat and non-recursive so it works with structured outputs.
 */
export const ExtractedPrice = z.object({
  label: z
    .string()
    .nullable()
    .describe('Size or variant label as printed, e.g. "Small", "Half", "16oz". null when the item has one price.'),
  price_text: z
    .string()
    .describe('Price exactly as printed, e.g. "$12.95", "12", "MP". Empty string if no price shown.'),
});

export const ExtractedItem = z.object({
  name: z.string(),
  description: z.string().nullable(),
  prices: z.array(ExtractedPrice).describe("One entry per size/variant. At least one entry."),
  modifier_groups: z
    .array(z.string())
    .describe("Names of modifier_groups (defined at the top level) that apply to this item."),
  dietary: z.array(z.string()).describe('Printed markers only, e.g. "V", "GF", "spicy". Do not infer.'),
  tax_hint: z.enum(["prepared_food", "alcohol", "non_taxable", "unknown"]),
  confidence: z
    .enum(["high", "low"])
    .describe("low if any part of this item was hard to read or you had to guess."),
  note: z.string().nullable().describe("Short reason when confidence is low. Otherwise null."),
});

export const ExtractedModifierGroup = z.object({
  name: z.string().describe('e.g. "Choose a protein", "Add-ons", "Dressing"'),
  min_select: z.number().int().nullable().describe("Minimum picks if stated or clearly implied (\"choose one\" = 1). null if unknown."),
  max_select: z.number().int().nullable().describe("Maximum picks if stated. null if unlimited or unknown."),
  rule_text: z.string().nullable().describe('The printed rule, e.g. "Choose 2", "Add any". null if none.'),
  options: z.array(
    z.object({
      name: z.string(),
      price_text: z.string().nullable().describe('Upcharge as printed, e.g. "+$2", "1.50". null if free/none shown.'),
    }),
  ),
});

export const Extraction = z.object({
  restaurant_name: z.string().nullable(),
  categories: z.array(
    z.object({
      name: z.string(),
      description: z.string().nullable(),
      items: z.array(ExtractedItem),
    }),
  ),
  modifier_groups: z.array(ExtractedModifierGroup),
  notes: z
    .array(z.string())
    .describe("Anything a human should check: cut-off pages, illegible sections, tax/service-charge notes printed on the menu."),
});
export type Extraction = z.infer<typeof Extraction>;
