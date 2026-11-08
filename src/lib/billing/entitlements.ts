/**
 * Billing hook. No payments yet: everything is allowed.
 *
 * Plan for Stripe (see docs/research.md §5 for the price points):
 *  - Per-menu build: Stripe Checkout (mode: "payment") for one build credit.
 *    Webhook `checkout.session.completed` -> insert row into `build_credits`.
 *  - Subscription: Stripe Checkout (mode: "subscription") for a monthly plan with N builds.
 *    Webhooks `customer.subscription.*` -> upsert `subscriptions`.
 *  - Spend a credit when the user DOWNLOADS an export (not on extract), so they can
 *    preview the result before paying. Extraction is rate-limited instead.
 *
 * Wire-up points:
 *  - src/app/api/extract/route.ts  -> canExtract()
 *  - src/app/api/export/route.ts   -> canExport() then recordExport()
 *  - add src/app/api/stripe/webhook/route.ts
 */

export type Plan = "free" | "per_menu" | "pro" | "agency";

export const PLANS = {
  per_menu: { priceUsd: 49, builds: 1 },
  pro: { priceUsd: 149, buildsPerMonth: 10 },
  agency: { priceUsd: 399, buildsPerMonth: 40 },
} as const;

export type Entitlement = { allowed: true } | { allowed: false; reason: string; upgradeUrl: string };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canExtract(userId: string | null): Promise<Entitlement> {
  return { allowed: true };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canExport(userId: string | null, menuId: string): Promise<Entitlement> {
  return { allowed: true };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function recordExport(userId: string | null, menuId: string, target: string): Promise<void> {
  // no-op until Stripe + Supabase are wired
}
