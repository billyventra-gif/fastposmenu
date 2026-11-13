import { GUIDES } from "@/content/guides";

/**
 * Site-wide settings. Fast POS Menu is a product of Code 85 Labs, which is also the seller.
 * Domains and inboxes aren't final, so all of these come from Vercel env vars:
 *   NEXT_PUBLIC_SITE_URL       app domain (fastposmenu.com planned; .food still open)
 *   NEXT_PUBLIC_COMPANY_URL    Code 85 Labs site
 *   NEXT_PUBLIC_SUPPORT_EMAIL  support inbox (planned support@code85labs.com)
 *   NEXT_PUBLIC_BILLING_EMAIL  receipts/billing inbox (planned billing@code85labs.com)
 */
export const SITE = {
  name: "Fast POS Menu",
  company: "Code 85 Labs",
  companyUrl: (process.env.NEXT_PUBLIC_COMPANY_URL || "https://code85.app").replace(/\/$/, ""),
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://fastposmenu-billyventra-9501s-projects.vercel.app").replace(/\/$/, ""),
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@code85labs.com",
  billingEmail: process.env.NEXT_PUBLIC_BILLING_EMAIL || "billing@code85labs.com",
  tagline: "Any restaurant menu, into any POS, in minutes.",
  description:
    "Turn menu photos, PDFs or old-POS exports into a Square, Clover or Toast import file in minutes. Built for ISOs, agents and POS resellers. $49 a menu.",
} as const;

/** Public pages for the sitemap. Marketing pages added later should be listed here too. */
export const PUBLIC_PAGES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/pricing", priority: 0.9 },
  { path: "/for-isos", priority: 0.9 },
  { path: "/clover", priority: 0.8 },
  { path: "/square", priority: 0.8 },
  { path: "/toast", priority: 0.8 },
  { path: "/guides", priority: 0.7 },
  ...GUIDES.map((g) => ({ path: `/guides/${g.slug}`, priority: 0.6 })),
  { path: "/terms", priority: 0.2 },
  { path: "/privacy", priority: 0.2 },
  { path: "/refunds", priority: 0.2 },
];
