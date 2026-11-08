/**
 * Link ingestion policy. See docs/research.md §2 for the legal reasoning.
 *
 * - Marketplace / hosted-ordering pages (DoorDash, Uber Eats, Grubhub, Toast/Clover/Square
 *   online ordering...): their ToS ban automated access. We don't fetch them. We tell the
 *   user to screenshot or save the page and upload it.
 * - The restaurant's own website: low risk. Fetch once, plain HTTP, no proxies, no
 *   stealth, honor robots.txt. Behind LINK_FETCH_ENABLED until we add SSRF hardening
 *   and robots.txt checks.
 */

export type LinkVerdict =
  | { kind: "marketplace"; platform: string; message: string }
  | { kind: "own_site"; url: string; enabled: boolean; message: string }
  | { kind: "invalid"; message: string };

const MARKETPLACES: [RegExp, string][] = [
  [/(^|\.)doordash\.com$/, "DoorDash"],
  [/(^|\.)ubereats\.com$|(^|\.)uber\.com$/, "Uber Eats"],
  [/(^|\.)grubhub\.com$|(^|\.)seamless\.com$/, "Grubhub"],
  [/(^|\.)postmates\.com$/, "Postmates"],
  [/(^|\.)toasttab\.com$/, "Toast online ordering"],
  [/(^|\.)clover\.com$/, "Clover online ordering"],
  [/(^|\.)square\.site$|(^|\.)squareup\.com$/, "Square Online"],
  [/(^|\.)yelp\.com$/, "Yelp"],
  [/(^|\.)google\.[a-z.]+$/, "Google"],
];

export function classifyLink(raw: string): LinkVerdict {
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw.trim()) ? raw.trim() : `https://${raw.trim()}`);
  } catch {
    return { kind: "invalid", message: "That doesn't look like a link." };
  }
  if (!/^https?:$/.test(url.protocol) || !url.hostname.includes(".")) {
    return { kind: "invalid", message: "That doesn't look like a link." };
  }
  const host = url.hostname.toLowerCase();
  for (const [re, platform] of MARKETPLACES) {
    if (re.test(host)) {
      return {
        kind: "marketplace",
        platform,
        message: `We don't pull menus from ${platform} links. Their terms don't allow it. Screenshot the menu (or save the page as PDF) and upload it. Takes a minute.`,
      };
    }
  }
  const enabled = process.env.LINK_FETCH_ENABLED === "true";
  return {
    kind: "own_site",
    url: url.toString(),
    enabled,
    message: enabled
      ? "Got it. Reading your website menu."
      : "Website import is coming soon. For now, screenshot or save your menu page as PDF and upload it.",
  };
}
