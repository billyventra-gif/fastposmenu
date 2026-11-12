import "server-only";
import { billingEnabled, DRAFT_ID, stripe } from "./stripe";

/**
 * Pay-per-menu, no database:
 *  - Each menu draft has a random draftId (made in the browser).
 *  - Checkout puts the draftId in the Stripe session metadata.
 *  - On export we ask Stripe: is this session paid, and is it for this draftId?
 * A paid draft can be re-exported as often as needed.
 *
 * Pro subscriptions (monthly build credits) need accounts + a database. Not wired yet.
 */

export type Entitlement = { allowed: true; paidSessionId?: string } | { allowed: false; reason: string };

// Extraction is free while billing is off; when it's on, the beta password gate + Stripe
// on export are the controls. Add per-IP rate limiting before opening extraction publicly.
export async function canExtract(): Promise<Entitlement> {
  return { allowed: true };
}

export async function canExport(draftId: unknown, paidSessionId: unknown): Promise<Entitlement> {
  if (!billingEnabled()) return { allowed: true };
  if (typeof draftId !== "string" || !DRAFT_ID.test(draftId)) return { allowed: false, reason: "Missing menu ID. Refresh and try again." };
  if (typeof paidSessionId !== "string" || !paidSessionId.startsWith("cs_")) return { allowed: false, reason: "payment_required" };
  try {
    const s = await stripe().checkout.sessions.retrieve(paidSessionId);
    if (s.payment_status !== "paid" && s.payment_status !== "no_payment_required") return { allowed: false, reason: "payment_required" };
    if (s.metadata?.draftId !== draftId) return { allowed: false, reason: "payment_required" };
    return { allowed: true, paidSessionId };
  } catch (e) {
    console.error("[billing] session lookup failed", e);
    return { allowed: false, reason: "Couldn't confirm payment. Try again in a minute." };
  }
}
