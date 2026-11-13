import { stripe } from "@/lib/billing/stripe";

/**
 * Stripe webhook (signature-checked with STRIPE_WEBHOOK_SECRET).
 * No database yet, so entitlements are read live from Stripe at download time and this
 * endpoint only records events in the logs. It's the hook for accounts/email later.
 * Stripe Dashboard → Developers → Webhooks → endpoint: <site>/api/stripe/webhook
 */
const LOGGED = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
  "charge.refunded",
]);

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !process.env.STRIPE_SECRET_KEY) return new Response("Webhook not configured", { status: 503 });
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });
  const raw = await req.text();
  let event;
  try {
    event = stripe().webhooks.constructEvent(raw, sig, secret);
  } catch {
    return new Response("Bad signature", { status: 400 });
  }
  if (LOGGED.has(event.type)) {
    const o = event.data.object as { id?: string; metadata?: Record<string, string> | null };
    console.log("[stripe]", event.type, { id: o.id, livemode: event.livemode, kind: o.metadata?.kind, draftId: o.metadata?.draftId });
  }
  return Response.json({ received: true });
}
