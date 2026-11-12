# Go-to-market checklist: launch Monday, Nov 16, 2026

Owner key: **B** = Billy (only you can do it), **C** = Claude build session, **M** = CMO session.

## Done
- [x] App: upload → AI read → review/edit (mobile + tablet) → export for Square, Clover, Toast
- [x] Live on Vercel (personal team), auto-deploys from `main`
- [x] Pricing page ($49/menu; Pro $149/mo "coming soon") + Stripe pay-per-menu checkout with promo codes
- [x] Terms, Privacy, Refund pages (drafts; see legal review below)
- [x] SEO plumbing: sitemap, robots, titles/descriptions, social share image
- [x] Vercel Web Analytics component (turn on in dashboard)
- [x] Read limits: 8 menu reads per IP per hour, 25 files max per upload
- [x] Public-launch switch (`PUBLIC_APP=true`) to drop the beta password
- [x] CMO session started: brand kit, SEO, launch pages on `cmo/launch-site`, social calendar, paid plan

## Thu 11/12 – Fri 11/13
- [ ] **B** Buy `fastposmenu.com` (~$12/yr; `.food` is taken). Tell Claude "buy it" and it can be done through your Vercel account, or buy it yourself.
- [ ] **B** Create the support inbox `hello@fastposmenu.com` (Google Workspace ~$7/mo, or free forwarding).
- [ ] **B** Stripe account under Code 85 Labs (not SmarterSwipe): business details, bank, support email, statement descriptor `FASTPOSMENU`.
- [ ] **B** Vercel env (Settings → Environment Variables), Production + Preview, then Redeploy:
  - `STRIPE_SECRET_KEY` = `sk_test_...` (Sensitive), `BILLING_ENABLED` = `true`
  - Test a purchase with card 4242 4242 4242 4242
- [ ] **B** Anthropic: use a Code 85 Labs key and set a **monthly spend limit** (e.g. $200) in console.anthropic.com → Limits.
- [ ] **B** Book a 30-min call with an employment lawyer: IP-assignment and outside-activity clauses (your employer resells POS). Do this before public launch.
- [ ] **B + C** Verify one real import: create a free Clover developer sandbox (sandbox.dev.clover.com), import our Clover file, send Claude any errors. Same for Square sandbox if time allows.

## Sat 11/14 – Sun 11/15
- [ ] **B** Upgrade Vercel to **Pro** ($20/mo). Hobby is non-commercial.
- [ ] **B** Add the domain to the Vercel project (Settings → Domains), set it as primary.
- [ ] **B** Vercel env: `NEXT_PUBLIC_SITE_URL=https://fastposmenu.com`, `NEXT_PUBLIC_SUPPORT_EMAIL=hello@fastposmenu.com`.
- [ ] **B** Turn on Web Analytics (Vercel project → Analytics → Enable).
- [ ] **B** (Pro) Vercel Firewall → rate-limit rule on `/api/extract` (e.g. 20 requests / 10 min per IP).
- [ ] **M → B** Review the brand kit and launch pages; approve merging `cmo/launch-site` into `main`.
- [ ] **C** Add the CMO's pages to the sitemap after merge; final QA on phone and tablet.
- [ ] **B** Skim Terms/Privacy/Refunds (ideally have the lawyer glance at them on the same call).

## Mon 11/16: go live
- [ ] **B** Stripe: switch to live keys (`sk_live_...`) in Vercel.
- [ ] **B** Vercel env: delete `SITE_PASSWORD`, set `PUBLIC_APP=true`, Redeploy.
- [ ] **B** Run one real $49 purchase end to end with a promo code (refund yourself after).
- [ ] **B** Google Search Console: verify the domain, submit `https://fastposmenu.com/sitemap.xml`.
- [ ] **M** Launch posts (LinkedIn first) after Billy approves.

## After launch
- Pro plan ($149/mo): needs accounts + database (Supabase back on) to track builds.
- Own-website link import (marketplace links stay blocked).
- Exporter verification for Square and Toast with real exports; drop the "beta" label as each passes.
- 30-menu accuracy test set; decide Opus vs Sonnet from data.
