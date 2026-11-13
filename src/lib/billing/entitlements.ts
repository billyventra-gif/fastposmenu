import "server-only";
import type Stripe from "stripe";
import { PRO } from "./plans";
import { consumeBuild, type QuotaMeta } from "./quota";
import { billingEnabled, CHECKOUT_SESSION, DRAFT_ID, proEnabled, stripe } from "./stripe";

/**
 * No database. Two ways to unlock a download:
 *  1. Per menu: a paid one-time Checkout Session whose metadata.draftId matches this draft.
 *  2. Pro: the subscription Checkout Session id (kept in the subscriber's browser). We ask Stripe
 *     if the subscription is active and count builds in its metadata (see quota.ts).
 * A paid or already-counted draft can be re-downloaded as often as needed.
 */

export type ProStatus = { used: number; limit: number; customer: string };
export type Entitlement =
  | { allowed: true; paidSessionId?: string; pro?: ProStatus }
  | { allowed: false; reason: string; pro?: ProStatus };

export async function canExtract(): Promise<Entitlement> {
  return { allowed: true };
}

/** Look up an active Pro subscription from its Checkout Session id. */
export async function proFromSession(proSessionId: unknown): Promise<{ sub: Stripe.Subscription; customer: string } | null> {
  if (!proEnabled() || typeof proSessionId !== "string" || !CHECKOUT_SESSION.test(proSessionId)) return null;
  const s = await stripe().checkout.sessions.retrieve(proSessionId, { expand: ["subscription"] });
  if (s.mode !== "subscription" || !s.subscription || typeof s.subscription === "string") return null;
  const sub = s.subscription;
  if (sub.status !== "active" && sub.status !== "trialing") return null;
  const customer = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  return { sub, customer };
}

async function paidForDraft(draftId: string, paidSessionId: unknown): Promise<boolean> {
  if (typeof paidSessionId !== "string" || !CHECKOUT_SESSION.test(paidSessionId)) return false;
  const s = await stripe().checkout.sessions.retrieve(paidSessionId);
  return s.mode === "payment" && (s.payment_status === "paid" || s.payment_status === "no_payment_required") && s.metadata?.draftId === draftId;
}

export async function canExport(draftId: unknown, paidSessionId: unknown, proSessionId?: unknown): Promise<Entitlement> {
  if (!billingEnabled()) return { allowed: true };
  if (typeof draftId !== "string" || !DRAFT_ID.test(draftId)) return { allowed: false, reason: "Missing menu ID. Refresh and try again." };
  try {
    if (await paidForDraft(draftId, paidSessionId)) return { allowed: true, paidSessionId: paidSessionId as string };

    const pro = await proFromSession(proSessionId);
    if (!pro) return { allowed: false, reason: "payment_required" };
    const periodStart = pro.sub.items.data[0]?.current_period_start ?? 0;
    const q = consumeBuild(pro.sub.metadata as QuotaMeta, periodStart, draftId, PRO.builds);
    const status = { used: q.used, limit: PRO.builds, customer: pro.customer };
    if (!q.allowed) return { allowed: false, reason: "pro_limit", pro: status };
    if (q.changed) await stripe().subscriptions.update(pro.sub.id, { metadata: { ...q.next } });
    return { allowed: true, pro: status };
  } catch (e) {
    console.error("[billing] lookup failed", e);
    return { allowed: false, reason: "Couldn't confirm payment. Try again in a minute." };
  }
}
