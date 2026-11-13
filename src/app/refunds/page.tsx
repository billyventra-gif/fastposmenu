import type { Metadata } from "next";
import { LegalPage } from "@/components/SiteChrome";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Refund Policy", alternates: { canonical: "/refunds" } };

export default function RefundsPage() {
  return (
    <LegalPage title="Refund Policy" updated="November 12, 2026">
      <p>You review the full menu before you pay, so you know what you&apos;re getting. If something still goes wrong, we&apos;ll make it right.</p>

      <h2>When we refund</h2>
      <ul>
        <li>Your POS rejects the import file and we can&apos;t fix it within 3 business days.</li>
        <li>You were charged twice for the same menu.</li>
      </ul>

      <h2>How to ask</h2>
      <p>
        Email <a href={`mailto:${SITE.supportEmail}`} className="underline">{SITE.supportEmail}</a> within 14 days of purchase with your receipt and
        the error you saw. Refunds go back to the original card through Stripe, usually within 5–10 business days.
      </p>

      <h2>Subscriptions</h2>
      <p>
        Pro can be canceled anytime from Manage billing and stops at the end of the current billing period. Unused builds don&apos;t roll over.
        Receipts and billing questions:{" "}
        <a href={`mailto:${SITE.billingEmail}`} className="underline">{SITE.billingEmail}</a>.
      </p>
    </LegalPage>
  );
}
