# Marketing operating plan (post-launch)

Owner: CMO · v1 · 2026-11-12

## Daily (15–45 min of my time; ~5 min of Billy's)

- **Numbers check:** yesterday's sessions by source, builds started, paid menus (Stripe), ad spend and CPA. Flag anything off by 2× to Billy.
- **Social:** prepare the next day's approved post with first-comment link; draft replies to every comment on Billy's posts for him to send (or send from the brand account once approved).
- **Inbound:** read every question from LinkedIn/FB/email/support; turn repeats into FAQ lines or guides.
- **Paid (when live):** search terms report Mon/Thu; add negatives; pause anything that trips a kill rule (`paid.md`).

## Weekly

| Day | What |
|---|---|
| Mon | Weekly report to Billy (template below). Kill/scale decisions on ads. Lock this week's posts. |
| Tue | Publish 1 guide (P1/P2 keyword from `seo.md`). Request indexing in Search Console. |
| Wed | Creative: script/brief 2–3 short videos for next week from real questions and build results. |
| Thu | Outreach: 10 personalized notes to ISOs/resellers from LinkedIn engagement (drafted for Billy). Community answers where allowed. |
| Fri | Review funnel drop-offs with the build session (where builds stall, what gets flagged most); turn findings into copy changes and product asks. Draft next week's calendar. |

## Monthly

- Refresh `seo.md` with Search Console data (what we rank for, what we should).
- Re-plan paid budget tier based on CPA vs. targets.
- Update brand proof points with real numbers (only once true: menus built, POS split, avg build time, % items flagged).
- Customer conversations: aim for 5 calls with agents/ISOs who used it. Update personas.

## KPIs

| KPI | Definition | Source | Month 1 target | Month 3 target |
|---|---|---|---|---|
| Organic sessions | Google organic to marketing pages | Search Console / Vercel Analytics | 300 | 2,000 |
| Total sessions | All marketing pages | Vercel Analytics | 2,000 | 6,000 |
| Builds started | `build_started` | App events | 200 | 800 |
| Paid menus | Stripe completed checkouts | Stripe | 40 | 200 |
| Landing → build rate | builds started / landing sessions | Analytics | ≥ 12% | ≥ 18% |
| Build → paid rate | paid / builds started | Stripe + events | ≥ 25% | ≥ 30% |
| Repeat buyers | customers with 2+ paid menus in 30 days | Stripe | 5 | 25 |
| CAC (paid) | ad spend / paid customers from ads | Ads + Stripe metadata | ≤ $60 | ≤ $50 |
| Conversion by channel | paid menus / sessions, per utm_source | Stripe metadata | measured | optimized |
| Pro waitlist / interest | ISOs/agents asking for monthly | Inbox + form | 15 | Pro launched |
| LinkedIn | Billy's post impressions; profile visits; DMs from ISOs | LinkedIn | 20k impr., 10 ISO DMs | 60k impr., 30 ISO DMs |

Targets are first guesses for a brand-new product with ~$500 ad spend; I'll reset them after week 2 with real baselines.

## Weekly report template (Monday, 5 lines)

```
Week of ___
Revenue: $___ (__ paid menus; __ repeat). Builds started: __. Build→paid: __%.
Traffic: __ sessions (organic __ / LinkedIn __ / paid __ / direct __).
Paid: $__ spent, CPA $__ (target $60). Changes: ___.
Best content: ___ (why). Worst: ___.
Need from you: ___
```

## What I need from Billy (standing)

| Ask | When | Time |
|---|---|---|
| Approve the week's posts (batch, Monday) | Weekly | 10 min |
| Post on LinkedIn from your profile, reply to comments | Daily | 5–10 min |
| Approve spend changes over $100 | As needed | 2 min |
| 2–3 customer intros/calls a month with ISOs or agents you trust (outside any employer relationship) | Monthly | 1 hr |
| Shoot short demo clips (or approve a freelancer) | Bi-weekly | 30 min |
| Decisions on accounts, domain, budget, contact email | Once, now | 20 min |

## Open decisions (launch-blocking items first)

1. **Merge `cmo/launch-site` to main** (needs review; build session should merge after its own work to avoid conflicts).
2. **Contact inbox:** the footer's Contact link uses `hello@fastposmenu.com` (from `NEXT_PUBLIC_SUPPORT_EMAIL`). That inbox only works once the domain is bought and email is set up. Not any employer address.
3. **Domain:** buy fastposmenu.com before paid traffic.
4. **Is /build public at launch?** The CTAs all point there. If it stays password-gated on Monday, I'll switch CTAs to a waitlist/"request access" message instead.
5. Month-one ad budget tier.
6. Social accounts + LinkedIn company page.
7. Employment-lawyer check from `docs/research.md` §8 before public marketing that names Billy. I'm flagging it, not deciding it.
