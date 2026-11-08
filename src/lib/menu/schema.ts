import { z } from "zod";

/**
 * Canonical menu schema.
 *
 * Every input (photo, PDF, CSV, XLSX, old-POS export, link) maps INTO this.
 * Every exporter (Square, Clover, Toast, ...) reads FROM this.
 *
 * Rules:
 * - Money is integer cents. Never floats. Parsing/formatting lives in ./money.ts.
 * - IDs are stable strings generated in code, never by the model.
 * - Tax *rates* are entered by the user. The model only gives hints.
 */

export const Cents = z.number().int();

export const TaxHint = z.enum([
  "prepared_food", // default restaurant food/drink
  "alcohol",
  "non_taxable", // e.g. some grocery/retail, gift cards
  "unknown",
]);
export type TaxHint = z.infer<typeof TaxHint>;

export const Tax = z.object({
  id: z.string(),
  name: z.string().min(1),
  /** Decimal percent as a string to avoid float drift, e.g. "8.875" */
  ratePercent: z.string().regex(/^\d{1,2}(\.\d{1,4})?$/),
});
export type Tax = z.infer<typeof Tax>;

export const Category = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  sortOrder: z.number().int(),
});
export type Category = z.infer<typeof Category>;

export const Variation = z.object({
  id: z.string(),
  /** "Regular" when the item has one price. Otherwise "Small", "Large", "Half", etc. */
  name: z.string().min(1),
  /** null = variable / market price. */
  priceCents: Cents.nullable(),
  sku: z.string().optional(),
});
export type Variation = z.infer<typeof Variation>;

export const ModifierOption = z.object({
  id: z.string(),
  name: z.string().min(1),
  /** Price added to the item. 0 for free options. */
  priceCents: Cents,
  isDefault: z.boolean(),
});
export type ModifierOption = z.infer<typeof ModifierOption>;

export const ModifierGroup = z
  .object({
    id: z.string(),
    name: z.string().min(1),
    minSelect: z.number().int().min(0),
    /** null = no limit */
    maxSelect: z.number().int().min(1).nullable(),
    options: z.array(ModifierOption).min(1),
  })
  .refine((g) => g.maxSelect === null || g.maxSelect >= g.minSelect, {
    message: "Max must be at least Min",
  });
export type ModifierGroup = z.infer<typeof ModifierGroup>;

export const Confidence = z.enum(["high", "low"]);

export const Item = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string(),
  variations: z.array(Variation).min(1),
  modifierGroupIds: z.array(z.string()),
  taxHint: TaxHint,
  /** Which of menu.taxes apply. Filled from taxHint by applyDefaultTaxes(). */
  taxIds: z.array(z.string()),
  dietary: z.array(z.string()),
  /** "low" = the extractor wasn't sure. The review UI flags these. */
  confidence: Confidence,
  note: z.string().optional(),
});
export type Item = z.infer<typeof Item>;

export const POS_TARGETS = ["square", "clover", "toast"] as const;
export const PosTarget = z.enum(POS_TARGETS);
export type PosTarget = z.infer<typeof PosTarget>;

export const Menu = z.object({
  schemaVersion: z.literal(1),
  restaurantName: z.string(),
  currency: z.literal("USD"),
  target: PosTarget,
  categories: z.array(Category),
  items: z.array(Item),
  modifierGroups: z.array(ModifierGroup),
  taxes: z.array(Tax),
  /** Things a human should look at before export. */
  warnings: z.array(z.string()),
  source: z.object({
    kind: z.enum(["upload", "link", "manual"]),
    files: z.array(z.string()),
  }),
});
export type Menu = z.infer<typeof Menu>;

export function emptyMenu(target: PosTarget): Menu {
  return {
    schemaVersion: 1,
    restaurantName: "",
    currency: "USD",
    target,
    categories: [],
    items: [],
    modifierGroups: [],
    taxes: [],
    warnings: [],
    source: { kind: "manual", files: [] },
  };
}

let counter = 0;
/** Short, unique-enough IDs generated in code. */
export function newId(prefix: string): string {
  counter = (counter + 1) % 1_000_000;
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}${rand}`;
}
