/**
 * Browser-side billing state. No accounts yet, so a Pro subscription is tied to the device
 * that bought it: we keep the subscription Checkout Session id in localStorage.
 */
const PRO_KEY = "fpm:pro:v1";

export function readProSession(): string | undefined {
  try {
    return localStorage.getItem(PRO_KEY) || undefined;
  } catch {
    return undefined;
  }
}

export function saveProSession(id: string) {
  try {
    localStorage.setItem(PRO_KEY, id);
  } catch {
    /* private mode */
  }
}

export async function openBillingPortal(): Promise<string | null> {
  const r = await fetch("/api/portal", { method: "POST", body: JSON.stringify({ proSessionId: readProSession() }) });
  const d = await r.json().catch(() => ({}));
  if (r.ok && d.url) {
    window.location.href = d.url;
    return null;
  }
  return d.error || "Couldn't open billing.";
}
