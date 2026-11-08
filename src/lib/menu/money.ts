/**
 * Money helpers. All math in integer cents.
 * The model hands us raw price text ("$12.95", "12", "+1.50", "MP"); we parse it here.
 */

export type ParsedPrice =
  | { kind: "fixed"; cents: number }
  | { kind: "market" } // "MP", "Market", "Market price", "AQ"
  | { kind: "none" }; // blank / unreadable

const MARKET =
  /^(mp|m\.p\.|market(\s*price)?|aq|seasonal|price\s*varies|varies)$/i;

export function parsePrice(raw: string | number | null | undefined): ParsedPrice {
  if (raw === null || raw === undefined) return { kind: "none" };
  if (typeof raw === "number") {
    if (!Number.isFinite(raw)) return { kind: "none" };
    return { kind: "fixed", cents: Math.round(raw * 100) };
  }
  let s = raw.trim();
  if (!s) return { kind: "none" };
  if (MARKET.test(s)) return { kind: "market" };
  if (/^(free|no\s*charge|n\/c)$/i.test(s)) return { kind: "fixed", cents: 0 };
  s = s
    .replace(/^add\s+/i, "")
    .replace(/^\+\s*/, "")
    .replace(/\s*(usd|ea\.?|each)$/i, "")
    .replace(/[$\s,]/g, "");
  // "12.95" | "12" | ".50" | "12.9"
  const m = s.match(/^(\d*)(?:\.(\d{1,2}))?$/);
  if (!m || (m[1] === "" && m[2] === undefined)) return { kind: "none" };
  const dollars = m[1] ? parseInt(m[1], 10) : 0;
  const cents = m[2] ? parseInt(m[2].padEnd(2, "0"), 10) : 0;
  return { kind: "fixed", cents: dollars * 100 + cents };
}

/** 1295 -> "12.95" (no symbol; what most import templates want) */
export function centsToDecimal(cents: number): string {
  const neg = cents < 0;
  const abs = Math.abs(cents);
  const s = `${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
  return neg ? `-${s}` : s;
}

/** 1295 -> "$12.95" for display. null -> "Market" */
export function formatCents(cents: number | null): string {
  if (cents === null) return "Market";
  return `$${centsToDecimal(cents)}`;
}

/** User typing in the editor: "12.5" -> 1250. Returns undefined if not a price. */
export function inputToCents(input: string): number | null | undefined {
  const p = parsePrice(input);
  if (p.kind === "fixed") return p.cents;
  if (p.kind === "market") return null;
  return undefined;
}
