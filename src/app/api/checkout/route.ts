import type { NextRequest } from "next/server";
import { PER_MENU } from "@/lib/billing/plans";
import { billingEnabled, DRAFT_ID, stripe } from "@/lib/billing/stripe";
import { POS_INFO } from "@/lib/export/registry";
import { PosTarget } from "@/lib/menu/schema";

/** Start a Stripe Checkout for one menu build. Promo codes are accepted on the Stripe page. */
export async function POST(req: NextRequest) {
  if (!billingEnabled()) return Response.json({ error: "Payments aren't turned on yet." }, { status: 503 });
  const body = (await req.json().catch(() => ({}))) as { draftId?: string; target?: string; restaurantName?: string; itemCount?: number; utm?: Record<string, unknown> };
  if (!body.draftId || !DRAFT_ID.test(body.draftId)) return Response.json({ error: "Missing menu ID. Refresh and try again." }, { status: 400 });
  const target = PosTarget.safeParse(body.target);
  if (!target.success) return Response.json({ error: "Pick a POS first." }, { status: 400 });

  const name = (body.restaurantName ?? "").toString().slice(0, 80).trim();
  const pos = POS_INFO[target.data].label;
  const origin = req.nextUrl.origin;
  const priceId = process.env.STRIPE_PRICE_PER_MENU; // optional: a Price created in the Stripe Dashboard
  // Attribution (first-touch UTM/click IDs from the browser). Stripe metadata: string values, max 500 chars.
  const ATTR = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "li_fat_id", "landing"];
  const utm = Object.fromEntries(
    ATTR.flatMap((k) => (typeof body.utm?.[k] === "string" && body.utm[k] ? [[k, (body.utm[k] as string).slice(0, 100)]] : [])),
  );

  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        priceId
          ? { price: priceId, quantity: 1 }
          : {
              quantity: 1,
              price_data: {
                currency: "usd",
                unit_amount: PER_MENU.priceCents,
                product_data: {
                  name: "Fast POS Menu: one menu build",
                  description: `${name || "Menu"} → ${pos} import file`,
                },
              },
            },
      ],
      allow_promotion_codes: true,
      client_reference_id: body.draftId,
      metadata: {
        draftId: body.draftId,
        target: target.data,
        restaurant: name,
        items: String(Math.max(0, Math.floor(Number(body.itemCount) || 0))),
        ...utm,
      },
      success_url: `${origin}/build?paid={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/build?canceled=1`,
    });
    return Response.json({ url: session.url });
  } catch (e) {
    console.error("[checkout] failed", e);
    return Response.json({ error: "Couldn't start checkout. Try again." }, { status: 500 });
  }
}
