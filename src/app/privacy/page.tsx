import type { Metadata } from "next";
import { LegalPage } from "@/components/SiteChrome";
import { SITE } from "@/lib/site";

// DRAFT: plain-English starting point. Have counsel review before launch.
export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="November 12, 2026">
      <p>
        {SITE.name} is operated by {SITE.company}. This policy explains what we collect and why. Short version: we use your menu to build your import
        file, we don&apos;t sell your data, and we keep as little as we can.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <b>Menu files you upload.</b> Sent to our servers and to our AI provider (Anthropic) to read the menu. We don&apos;t keep the files after
          processing.
        </li>
        <li>
          <b>Your menu draft.</b> Saved in your own browser so you don&apos;t lose work. Clearing your browser data deletes it.
        </li>
        <li>
          <b>Payment details.</b> Handled by Stripe. We never see your full card number. We receive a receipt record (amount, date, email if given).
        </li>
        <li>
          <b>Usage data.</b> Basic, cookie-free page analytics (Vercel Web Analytics) and server logs (time, page, rough location, errors) to keep
          the Service running.
        </li>
      </ul>

      <h2>Who we share it with</h2>
      <ul>
        <li>Anthropic (AI processing of uploaded menus)</li>
        <li>Stripe (payments)</li>
        <li>Vercel (hosting and analytics)</li>
      </ul>
      <p>Each processes data only to provide its service to us. We don&apos;t sell or rent personal information.</p>

      <h2>Your choices</h2>
      <p>
        Email <a href={`mailto:${SITE.supportEmail}`} className="underline">{SITE.supportEmail}</a> to ask what we hold about you or to delete it.
        California residents have rights under the CCPA, including to know, delete and correct personal information.
      </p>

      <h2>Changes</h2>
      <p>We&apos;ll update this page when our practices change. The date above shows the latest version.</p>
    </LegalPage>
  );
}
