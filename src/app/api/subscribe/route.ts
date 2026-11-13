import type { NextRequest } from "next/server";
import { proEnabled, stripe } from "@/lib/billing/stripe";

/** Start a Pro subscription Checkout. Price comes from STRIPE_PRICE_SUBSCRIPTION (set in Vercel). */
export async function POST(req: NextRequest) {
  if (!proEnabled()) return Response.json({ error: "Pro isn't available yet." }, { status: 503 });
  const body = (await req.json().catch(() => ({}))) as { utm?: Record<string, unknown> };
  const ATTR = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "li_fat_id", "landing"];
  const utm = Object.fromEntries(
    ATTR.flatMap((k) => (typeof body.utm?.[k] === "string" && body.utm[k] ? [[k, (body.utm[k] as string).slice(0, 100)]] : [])),
  );
  const origin = req.nextUrl.origin;
  try {
    const session = await stripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_SUBSCRIPTION!, quantity: 1 }],
      allow_promotion_codes: true,
      metadata: { kind: "pro", ...utm },
      subscription_data: { metadata: { kind: "pro" } },
      success_url: `${origin}/build?pro={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=1`,
    });
    return Response.json({ url: session.url });
  } catch (e) {
    console.error("[subscribe] failed", e);
    return Response.json({ error: "Couldn't start checkout. Try again." }, { status: 500 });
  }
}
