/**
 * Best-effort limits on menu reads (each costs ~$0.15–1.50 in Claude usage).
 *
 * In-memory, per server instance: a speed bump, not a wall. The real backstops are:
 *  1. A monthly spend limit on the Anthropic account (console.anthropic.com → Limits).
 *  2. A Vercel Firewall rate-limit rule on /api/extract (Pro plan).
 * Swap for a shared store (Upstash/Vercel KV or Supabase) when accounts land.
 */
const WINDOW_MS = 60 * 60 * 1000;
const PER_IP_PER_HOUR = Number(process.env.EXTRACT_LIMIT_PER_HOUR || 8);

const hits = new Map<string, number[]>();

export function clientIp(req: Request): string {
  return (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

/** Returns seconds to wait if over the limit, else 0 (and records the hit). */
export function takeExtract(ip: string, now = Date.now()): number {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= PER_IP_PER_HOUR) {
    hits.set(ip, recent);
    return Math.ceil((WINDOW_MS - (now - recent[0])) / 1000);
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return 0;
}

const reviseHits = new Map<string, number[]>();
const REVISE_PER_HOUR = Number(process.env.REVISE_LIMIT_PER_HOUR || 40);

/** Same idea for "tell it what to change" requests (cheaper, so a higher cap). */
export function takeRevise(ip: string, now = Date.now()): number {
  const recent = (reviseHits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= REVISE_PER_HOUR) {
    reviseHits.set(ip, recent);
    return Math.ceil((WINDOW_MS - (now - recent[0])) / 1000);
  }
  recent.push(now);
  reviseHits.set(ip, recent);
  return 0;
}
