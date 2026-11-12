"use client";

import { useEffect } from "react";

export const UTM_KEY = "fpm:utm:v1";
const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "li_fat_id"] as const;

/**
 * Remember where a visitor came from (first touch, 30 days) so checkout can tag the Stripe
 * session with it. Measures paid menus per channel. Stored only in this browser.
 */
export default function UtmCapture() {
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const found = Object.fromEntries(KEYS.filter((k) => p.get(k)).map((k) => [k, p.get(k)!.slice(0, 100)]));
      const existing = JSON.parse(localStorage.getItem(UTM_KEY) ?? "null");
      const fresh = existing && Date.now() - existing.at < 30 * 24 * 3600 * 1000;
      if (Object.keys(found).length && !fresh) {
        localStorage.setItem(UTM_KEY, JSON.stringify({ ...found, landing: window.location.pathname.slice(0, 100), at: Date.now() }));
      }
    } catch {
      /* storage blocked: skip */
    }
  }, []);
  return null;
}

/** Read stored attribution for checkout. */
export function readUtm(): Record<string, string> {
  try {
    const v = JSON.parse(localStorage.getItem(UTM_KEY) ?? "null");
    if (!v) return {};
    const out: Record<string, string> = {};
    for (const [k, val] of Object.entries(v)) if (k !== "at" && typeof val === "string") out[k] = val;
    return out;
  } catch {
    return {};
  }
}
