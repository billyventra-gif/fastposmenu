import type { Metadata } from "next";
import { LegalPage } from "@/components/SiteChrome";
import { SITE } from "@/lib/site";

// DRAFT: plain-English starting point. Have counsel review before taking live payments.
export const metadata: Metadata = { title: "Terms of Service", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="November 12, 2026">
      <p>
        These terms cover your use of {SITE.name} (the &quot;Service&quot;), operated by {SITE.company} (&quot;we&quot;, &quot;us&quot;). By using the
        Service you agree to them.
      </p>

      <h2>What the Service does</h2>
      <p>
        You upload a restaurant menu (photos, PDF, spreadsheet or an export from another system). We use automated tools, including AI, to turn it
        into structured menu data you can review and edit, and then into an import file formatted for the point-of-sale system you pick.
      </p>

      <h2>Your responsibilities</h2>
      <ul>
        <li>Only upload menus you own or have permission to use.</li>
        <li>Review the menu before you export it. AI can misread items, prices and options. You are responsible for what you import into a POS.</li>
        <li>Check the imported menu in your POS (prices, taxes, modifiers) before taking real orders.</li>
        <li>Don&apos;t misuse the Service: no reverse engineering, abuse, automated scraping or attempts to get around payment.</li>
      </ul>

      <h2>POS formats</h2>
      <p>
        Import formats are based on each POS vendor&apos;s published or observed formats and may change without notice. Square, Clover and Toast are
        trademarks of their respective owners. {SITE.name} is not affiliated with, endorsed by or certified by them.
      </p>

      <h2>Payment</h2>
      <p>
        {SITE.company} is the seller, and charges appear from {SITE.company}. Prices are shown before you pay. Per-menu purchases unlock the
        import file for that menu. Pro is a monthly subscription that includes a set number of menu builds per billing period; extra builds
        are charged per build at the price shown, and unused builds don&apos;t roll over. You can cancel Pro anytime from Manage billing; it
        stays active until the end of the period you&apos;ve paid for. Payments are processed by Stripe. Billing questions:{" "}
        <a href={`mailto:${SITE.billingEmail}`} className="underline">{SITE.billingEmail}</a>. See our{" "}
        <a href="/refunds" className="underline">Refund Policy</a>.
      </p>

      <h2>Your content</h2>
      <p>
        You keep ownership of what you upload. You give us permission to process it to provide the Service. See our{" "}
        <a href="/privacy" className="underline">Privacy Policy</a> for how we handle it.
      </p>

      <h2>No warranty</h2>
      <p>
        The Service is provided &quot;as is&quot;. We don&apos;t guarantee that output will be error-free or accepted by every POS account
        configuration.
      </p>

      <h2>Limit of liability</h2>
      <p>
        To the extent the law allows, our total liability for any claim is limited to the amount you paid us for the menu or plan involved in the
        last 12 months. We aren&apos;t liable for indirect or consequential losses, such as lost sales.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms. The date above shows the latest version. Continued use means you accept the update.</p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${SITE.supportEmail}`} className="underline">{SITE.supportEmail}</a>. These terms are governed by the laws of the State of
        California.
      </p>
    </LegalPage>
  );
}
