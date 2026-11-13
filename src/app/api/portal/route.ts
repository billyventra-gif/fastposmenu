import type { NextRequest } from "next/server";
import { CHECKOUT_SESSION, proEnabled, stripe } from "@/lib/billing/stripe";

/**
 * Stripe Customer Portal for Pro subscribers (update card, invoices, cancel).
 * Identifies the customer from the subscription Checkout Session id kept in their browser.
 * Works for canceled subscriptions too, so they can still see invoices.
 */
export async function POST(req: NextRequest) {
  if (!proEnabled()) return Response.json({ error: "Billing isn't turned on." }, { status: 503 });
  const body = (await req.json().catch(() => ({}))) as { proSessionId?: string };
  if (!body.proSessionId || !CHECKOUT_SESSION.test(body.proSessionId)) return Response.json({ error: "No subscription found on this device." }, { status: 400 });
  try {
    const s = await stripe().checkout.sessions.retrieve(body.proSessionId);
    const customer = typeof s.customer === "string" ? s.customer : s.customer?.id;
    if (s.mode !== "subscription" || !customer) return Response.json({ error: "No subscription found on this device." }, { status: 404 });
    const portal = await stripe().billingPortal.sessions.create({ customer, return_url: `${req.nextUrl.origin}/build` });
    return Response.json({ url: portal.url });
  } catch (e) {
    console.error("[portal] failed", e);
    return Response.json({ error: "Couldn't open billing. Try again." }, { status: 500 });
  }
}
