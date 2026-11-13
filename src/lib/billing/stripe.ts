import "server-only";
import Stripe from "stripe";

/**
 * Billing is ON only when BILLING_ENABLED=true and STRIPE_SECRET_KEY is set.
 * Off = every export is free (local dev, private beta).
 */
export const billingEnabled = () => process.env.BILLING_ENABLED === "true" && !!process.env.STRIPE_SECRET_KEY;

let client: Stripe | null = null;
export function stripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not set");
  return (client ??= new Stripe(process.env.STRIPE_SECRET_KEY));
}

/** Draft IDs are generated in the browser. Keep them boring so they're safe in metadata/URLs. */
export const DRAFT_ID = /^d_[a-z0-9]{8,40}$/;

/** Pro subscriptions are on when billing is on and a subscription Price is configured. */
export const proEnabled = () => billingEnabled() && !!process.env.STRIPE_PRICE_SUBSCRIPTION;

export const CHECKOUT_SESSION = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/;
