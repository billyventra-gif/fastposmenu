# Google Ads setup: click-by-click for Billy

Owner: CMO · v1 · 2026-11-12 · For the $500 month-one plan in `paid.md`.

**Don't start until:** (1) fastposmenu.com is live on the site, (2) a test purchase shows `utm_*` in Stripe metadata, (3) you've approved the budget. About 30 minutes. Google's menus change often; if a label differs, look for the closest match.

## 1. Create the account (10 min)

1. Use a **personal Google account or a new one for Code 85 Labs**. Not any employer account.
2. Go to ads.google.com → Start now.
3. When it pushes a "Smart campaign" wizard, choose **Switch to Expert Mode** (small link near the bottom), then **Create an account without a campaign**.
4. Billing country US, time zone **America/Los_Angeles**, currency USD. Your timezone and currency can't be changed later.
5. Add a payment method. Set an **account-level budget cap** if offered (Billing → Account budget) at **$550**, so a mistake can't overspend.

## 2. Conversion tracking (10 min)

Two conversions:
- **Primary: Purchase.** Value $49, count "One".
- **Secondary: Build started.** No value, count "One". Used for learning, not bidding.

Simplest setup, with no code changes:
1. Goals → Conversions → New conversion action → **Import** → *Other data sources or CRMs* → **Track conversions from clicks**. This uses offline import keyed by `gclid`.
2. Every Monday I export paid checkouts from Stripe (each one carries `gclid` in its metadata) and upload them as a CSV. Takes 5 minutes, works now, and doesn't need a tag on the site.
3. Later, if you want real-time tracking: approve the build session adding the Google Ads tag on the purchase-success page, and update the Privacy page first.

Turn on **auto-tagging** (Admin → Account settings → Auto-tagging) so `gclid` is added to clicks.

## 3. Create the campaigns (10 min, or I can send you a CSV for Google Ads Editor)

For each campaign in `paid.md` (Clover, Square, Toast, Switching):
- Campaign type **Search**. Goal **Sales** (or skip the goal).
- Networks: **untick Search Partners and Display Network.**
- Locations: United States, set to **Presence: people in or regularly in** (not "interest").
- Language English.
- Bidding: **Maximize clicks** with a **max CPC limit of $4**.
- Daily budget: **$4.25** each (4 campaigns × $4.25 × 30 days ≈ $510).
- Ad groups and keywords: copy from `paid.md`. Use **phrase match** ("clover menu import") and **exact match** ([clover menu import]). No broad match in month one.
- Ads: one responsive search ad per ad group with the headlines and descriptions from `paid.md`. Final URL with UTMs, e.g.
  `https://fastposmenu.com/clover?utm_source=google&utm_medium=cpc&utm_campaign=clover-import&utm_content=rsa-a&utm_term={keyword}`
- **Negative keyword list** (Tools → Shared library → Negative keyword lists): add the list from `paid.md` and apply it to all campaigns.
- Assets: sitelinks (For ISOs, Pricing, Guides, How it works), callouts ("$49 a menu", "Pay when you download", "Square, Clover, Toast", "Review on your phone").

Leave everything **Paused**. I'll do a final review, then you switch them on.

## 4. Access

Give me what I need to monitor: Admin → Access and security → add the email you want me reporting through, with **Read-only** access. I'll send weekly numbers and recommended changes, and you make or approve every change.

## What can go wrong

- **Trademark limits:** ads containing "Square", "Clover" or "Toast" may show as "Eligible (limited)". If they're disapproved, swap those headlines for "your POS" versions. Keywords with brand names are generally fine.
- **Low search volume:** some keywords show "Low search volume" and won't run. That's normal for niche terms; keep the ones that serve.
- **Policy review:** new accounts can take 1–2 business days to approve ads.
