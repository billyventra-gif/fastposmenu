/**
 * Pro build counting with no database: the count lives in the Stripe subscription's metadata.
 *   fpm_period = current billing period start (unix seconds)
 *   fpm_drafts = comma list of short draft keys built this period
 * Re-downloading a menu already counted this period is free. A new period resets the list.
 * Pure function so it can be tested without Stripe.
 */
export type QuotaMeta = { fpm_period?: string; fpm_drafts?: string };

export const draftKey = (draftId: string) => draftId.replace(/^d_/, "").slice(0, 12);

export function consumeBuild(
  meta: QuotaMeta,
  periodStart: number,
  draftId: string,
  limit: number,
): { allowed: boolean; used: number; changed: boolean; next: QuotaMeta } {
  const samePeriod = meta.fpm_period === String(periodStart);
  const drafts = samePeriod && meta.fpm_drafts ? meta.fpm_drafts.split(",").filter(Boolean) : [];
  const key = draftKey(draftId);
  if (drafts.includes(key)) return { allowed: true, used: drafts.length, changed: false, next: meta };
  if (drafts.length >= limit) return { allowed: false, used: drafts.length, changed: false, next: meta };
  const nextDrafts = [...drafts, key];
  return {
    allowed: true,
    used: nextDrafts.length,
    changed: true,
    next: { fpm_period: String(periodStart), fpm_drafts: nextDrafts.join(",") },
  };
}
