/**
 * Prices live here, in one place. Shown on /pricing and used by checkout.
 * Promotions/specials: create coupons + promotion codes in the Stripe Dashboard;
 * checkout accepts them (allow_promotion_codes). No code change needed.
 */
export const PER_MENU = {
  id: "per_menu",
  name: "Per menu",
  priceCents: 4900,
  blurb: "One menu, any POS. Pay when you download.",
  features: [
    "Photos, PDF, spreadsheet or old-POS export",
    "Sizes, modifiers and min/max rules",
    "Review and edit on your phone",
    "Import file for Square, Clover or Toast",
    "Re-download that menu anytime",
  ],
} as const;

export const PRO = {
  id: "pro",
  name: "Pro",
  priceCents: 14900,
  interval: "month",
  builds: 10,
  overageCents: 1500,
  blurb: "For agents and resellers boarding restaurants every month.",
  features: ["10 menu builds a month", "About $15 a menu", "Extra builds $15 each", "Every POS we support", "Priority help"],
  available: false, // needs accounts (Supabase) to track monthly builds
} as const;

export const fmtUsd = (cents: number) => `$${(cents / 100).toFixed(cents % 100 ? 2 : 0)}`;
