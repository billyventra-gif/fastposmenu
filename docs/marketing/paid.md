# Paid ads plan: first 30 days

Owner: CMO · v1 · 2026-11-12

**No spend, no accounts, no pixels until Billy approves.** This doc is the plan and the ask.

## The short version

- **Start with Google Search on high-intent "import/switch" queries, $500 month one.** It's the only channel where people are already looking for exactly what we do. Cheap to test, easy to kill.
- **LinkedIn is where ISOs are, but it's expensive** (high CPCs, $10/day minimum per campaign). Run it only at the $1,500+ tier, and only to Billy's best organic post as a "thought leader ad" plus one /for-isos campaign.
- **Meta = retargeting only**, and only once we have enough site traffic to build an audience (realistically week 3+). Owner-facing Reels as prospecting is a test at $3,000.
- **Don't spend a dollar until tracking works end to end** (ad click → /build → paid menu, attributed by UTM). Otherwise we're guessing.
- **Domain first.** Ads to a `*.vercel.app` URL look sketchy to ISOs and to ad review. Buy fastposmenu.com (~$12/yr, available per research) before launching paid.

---

## Unit economics and CAC targets

From `docs/research.md` §5: per-menu cost is ~$2.86 all-in (tokens + Stripe + infra) on $49, so **~$46 gross profit per menu**. Pro: ~$149 − ~$16 = **~$133 gross profit per month**.

| Customer | Assumption (validate in month 1) | Gross profit | **Target CAC** | Ceiling |
|---|---|---|---|---|
| Restaurant owner (one-time) | 1 menu, ever | $46 | **≤ $25** | $40 |
| Agent / reseller on per-menu | ~3 menus in first 90 days | ~$138 | **≤ $60** | $90 |
| Pro subscriber (when live) | 6-month average life | ~$800 | **≤ $250** | $400 (≤ 3-month payback) |
| ISO (team on Pro, or several agents) | 2+ seats/accounts | $1,600+ | **≤ $500** | case by case |

Blended month-1 target: **CAC ≤ $60 per paying customer**, with first-purchase payback on agents within 90 days. Owner-only campaigns must hit ≤ $25 per paid menu or get cut.

Conversion assumptions (to replace with real data after week 1): landing → build started 15–25%; build started → paid 25–40% (they've invested time, and they see the result before paying). Click → paid ≈ 4–10%.

At a $3 CPC and 6% click-to-paid: **~$50 per paid menu.** That's the line we need to beat on Google.

---

## Channels

### 1. Google Search (all tiers)

Campaigns, each to its own landing page:

| Campaign | Ad groups / keywords (phrase + exact) | Landing page |
|---|---|---|
| **POS import: Clover** | "clover menu import", "import menu into clover", "clover inventory import", "clover menu spreadsheet" | /clover |
| **POS import: Square** | "square menu import", "square item library import", "import menu to square", "square modifier import" | /square |
| **POS import: Toast** | "toast menu upload", "toast bulk import", "toast menu build", "toast menu setup cost" | /toast |
| **Switching POS** | "switch pos menu", "pos menu migration", "transfer menu to new pos", "toast to square menu", "clover to toast menu" | /guides/switch-pos-without-retyping-menu → or /for-isos (test) |
| **ISO / programming** (small, test) | "pos menu programming", "menu programming service", "pos menu setup service", "menu data entry service" | /for-isos |

Negatives from day one: free, jobs, salary, login, support, phone number, contact, careers, doordash, uber eats, grubhub, template download (test), app store, review, "how to use", training.

Settings: US only, Search network only (no Display, no Search Partners at first), manual CPC or Maximize Clicks with a CPC cap of $4 until we have 15+ conversions, then Maximize Conversions. Ad schedule: all week (owners search at night), check after 2 weeks.

CPC expectation: likely **$1.50–6** for these long-tail B2B/SMB terms. I can't pull Keyword Planner data from this session. Billy, a free Keyword Planner run gets us real numbers before we spend.

**Responsive search ad copy** (headlines ≤ 30 chars, descriptions ≤ 90):

Clover campaign:
- H: Clover Menu Import in Minutes · Photo or PDF to Clover File · Skip the Clover Menu Build · Items, Sizes and Modifiers · Review on Your Phone · $49 a Menu · Pay When You Download · Built for POS Resellers
- D: Snap the menu. Get a Clover inventory workbook with items, modifier groups and categories. · No typing. Review anything flagged, then download the import file. $49 a menu.

Square campaign:
- H: Square Menu Import in Minutes · Photo to Square Item Library · Sizes as Variations · Modifier Sets Mapped for You · $49 a Menu · Moving Off Toast or Clover?
- D: Turn any menu into a Square item library file, plus the exact modifier sets to create first. · Minutes, not a day. Review on your phone, pay when you download.

Toast campaign:
- H: Toast Menu Upload, No Typing · Skip the Hourly Menu Build · Toast Bulk Import Sheet · Menu Photo to Toast Build · $49 a Menu
- D: Toast-ready bulk-import sheet and menu-build workbook from photos or a PDF. Minutes. · Toast lists menu builds at ~$150/hr. Build it yourself for $49. Review before you pay.

Switching:
- H: Switch POS, Keep Your Menu · Don't Retype Your Menu · Old Menu to New POS File · Square, Clover or Toast · $49 a Menu
- D: Upload the old POS export or menu photos. Download an import file for your new POS. · Sizes, modifiers and categories translated for you. Review on your phone first.

ISO:
- H: Menu Builds for ISOs · Board Restaurants Faster · Skip the Menu Build · Clover, Square, Toast · $49 a Menu, Pro Soon
- D: Your install team shouldn't be typing menus. Snap it, review it, download the import file. · Merchants processing sooner. Built for ISOs, agents and POS resellers.

Ad copy rules: no "official/certified/partner", no vendor logos in ad creative (Search has none anyway; site logo use doesn't extend to ads), trademark terms in ad text may be restricted by the trademark owner. If an ad gets limited for trademark, fall back to "your POS" variants and keep the brand terms as keywords only. Sitelinks: For ISOs · Pricing · Guides · How it works.

### 2. LinkedIn ($1,500 and $3,000 tiers)

| Campaign | Format | Targeting | Landing |
|---|---|---|---|
| **Thought leader ad** | Boost Billy's best-performing organic post from week 1 (likely L1 or L3) | US; job titles: ISO owner, agent, merchant services sales, payments sales, POS sales, POS installer, onboarding manager, implementation specialist; industries: Financial Services, IT Services; company size 1–200; skills: Merchant Services, Point of Sale | /for-isos |
| **ISO lead** | Single image or 30s video | Same audience, exclude <2 yrs experience | /for-isos |

Expect CPC $6–15 and a small audience. Success = cost per **build started** ≤ $40 from LinkedIn; paid conversions will lag (ISOs test before they buy).

LinkedIn ad copy (single image, intro ≤ 150 chars shown):
- Intro: "Your install team shouldn't be typing menus. Snap the merchant's menu, get a Clover, Square or Toast import file in minutes."
- Headline: "Board the restaurant. Skip the menu build."
- CTA button: Learn more
- Creative: /for-isos hero on the `#fbfbfa` canvas, Inter Tight headline with the serif-italic accent phrase, product shot (`public/product/app-phone.png`) in a hairline frame. See `docs/brand/visual.md`.

### 3. Meta (Facebook / Instagram)

- **Retargeting** ($1,500+, starting week 3 if the site has ~1,000+ visitors in 30 days): people who visited any page but didn't start a build, and people who started a build but didn't pay (needs pixel event). Creative: V1 and V4 demos. Message: "Your menu's still waiting. Finish it in 2 minutes."
- **Owner prospecting test** ($3,000 tier only): Reels placements, interests: restaurant owners / small business owners / food service; US. Creative: V1, V3. Landing: home or /guides/switch-pos-without-retyping-menu. Kill if cost per paid menu > $40 after $300.

---

## Budget scenarios (first 30 days)

| | **$500** | **$1,500** | **$3,000** |
|---|---|---|---|
| Google Search | $500 (Clover, Square, Toast, Switching; ~$17/day) | $900 (all 5 campaigns) | $1,400 |
| LinkedIn | — | $500 (thought leader ad + ISO lead, $10/day each for ~25 days) | $900 |
| Meta | — | $100 retargeting (from week 3) | $500 (retargeting $150 + owner Reels test $350) |
| Creative (freelance video edit) | $0 (Billy shoots, I script) | $0–100 | $200 |
| **Expected paid menus** (at ~$50–70 blended) | ~7–10 | ~20–28 | ~40–55 |
| What we learn | Which POS query converts; real CPCs; landing conv. rate | + whether ISOs click and build from LinkedIn | + whether owners convert on Meta at ≤ $25 |

**Recommendation: $500 in month one, Google only**, launched the week of Nov 23 once tracking is verified (not on launch day: let organic and direct traffic show us baseline conversion first). Move to $1,500 in month two only if Google CPA ≤ $60.

Kill rules (checked every Monday):
- Any ad group with $100 spent and 0 builds started → pause.
- Any campaign with $250 spent and CPA > 2× target → pause, rework landing page.
- Search terms report reviewed twice a week for the first month; add negatives.

---

## Tracking and attribution

### UTM convention

`utm_source` = google | linkedin | meta | facebook-group | reddit | newsletter | partner
`utm_medium` = cpc | paid-social | organic | email | referral
`utm_campaign` = clover-import | square-import | toast-upload | switch-pos | iso | launch | retarget
`utm_content` = ad or post ID (e.g. `l1-launch`, `rsa-clover-a`, `v1-demo`)
`utm_term` = `{keyword}` (Google ValueTrack)

Example: `/clover?utm_source=google&utm_medium=cpc&utm_campaign=clover-import&utm_content=rsa-a&utm_term={keyword}`

### Funnel events (build session implements; I define)

| Event | Fires when | Properties |
|---|---|---|
| `page_view` | any marketing page | path, utm_* |
| `build_started` | first file uploaded in /build | pos, input_type (photo/pdf/sheet/export) |
| `build_completed` | menu extracted, review screen shown | pos, item_count, flagged_count |
| `checkout_started` | Stripe Checkout opened | pos, price, promo_code? |
| `purchase` | Stripe checkout.session.completed | value=49, currency=USD, pos, utm_* (from session metadata) |

How: capture `utm_*` + `gclid` on landing, keep them in a first-party cookie or sessionStorage, and pass them into Stripe Checkout `metadata`. Then the Stripe dashboard alone tells us paid menus by channel, even before any ad pixel exists.

Analytics: Vercel Web Analytics with custom events (already on the platform; no extra vendor). Ad platform conversion tags (Google Ads conversion, LinkedIn Insight, Meta Pixel) fire on `purchase` and `build_started` only, and only after Billy approves the accounts. Privacy page must list them before they go live.

### Reporting

Weekly sheet (see `operating-plan.md`): spend, clicks, CPC, builds started, paid menus, CPA, by campaign. Source of truth for revenue is Stripe; ad platforms are directional.

---

## Approval (what I need from Billy)

1. **Budget tier for month one** (recommend $500, Google only).
2. **Create Google Ads account** (I'll give a click-by-click setup) and add a payment method. LinkedIn Campaign Manager and Meta Business accounts only if you pick $1,500+.
3. **Buy fastposmenu.com** before any paid traffic (~$12/yr).
4. OK for the build session to add UTM capture → Stripe metadata and the funnel events above.
5. OK to add ad conversion tags later (with Privacy page update).
