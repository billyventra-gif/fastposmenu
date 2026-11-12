import { GUIDES } from "@/content/guides";

/**
 * Site-wide settings. Set these in Vercel once the domain and inbox exist:
 *   NEXT_PUBLIC_SITE_URL=https://fastposmenu.com
 *   NEXT_PUBLIC_SUPPORT_EMAIL=hello@fastposmenu.com
 */
export const SITE = {
  name: "Fast POS Menu",
  company: "Code 85 Labs",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://fastposmenu-billyventra-9501s-projects.vercel.app").replace(/\/$/, ""),
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "hello@fastposmenu.com",
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
