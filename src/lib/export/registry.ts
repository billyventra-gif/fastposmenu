import type { PosTarget } from "../menu/schema";

/**
 * What each POS gets, and how sure we are about the format.
 * "verified" flips to true only after we've imported a generated file into a real account
 * (or diffed against a real export) and it went in clean.
 */
export const POS_INFO: Record<
  PosTarget,
  { label: string; fileLabel: string; blurb: string; howTo: string; verified: boolean; verifyNote: string }
> = {
  square: {
    label: "Square",
    fileLabel: "Item library spreadsheet",
    blurb: "Item library .xlsx, plus a Catalog API file for one-push setup.",
    howTo: "Square Dashboard → Items & services → Items → Actions → Import library → Modify library (or Replace). Upload the file.",
    verified: false,
    verifyNote: "Needs a real sample export to verify. Built from Square's published import template columns.",
  },
  clover: {
    label: "Clover",
    fileLabel: "Inventory import workbook",
    blurb: "One workbook: items, modifier groups, categories, and tax.",
    howTo: "Clover Dashboard → Inventory → Items → ⋯ → Import. Upload the file. Modifier groups and categories import from their own sheets.",
    verified: false,
    verifyNote: "Needs a real sample export to verify. Clover's sheet/column names vary by region and app version.",
  },
  toast: {
    label: "Toast",
    fileLabel: "Menu build sheet",
    blurb: "Build sheet for Toast onboarding, plus a bulk-import tab.",
    howTo: "Toast has no self-serve menu import. Send this workbook to your Toast onboarding/menu team, or use it to key the menu in Toast Web → Menus. Upload partners can map it directly.",
    verified: false,
    verifyNote: "Needs a real sample export to verify. Toast doesn't publish an import format; this follows Toast's menu structure (Menu → Group → Item → Modifier group → Modifier).",
  },
};
