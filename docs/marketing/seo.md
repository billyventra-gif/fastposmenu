# SEO plan

Owner: CMO · v1 · 2026-11-12

## The short version

- **Two audiences, two kinds of search.** Restaurant owners and installers search *how-to* ("how to import menu into Clover"). ISOs and agents barely search for this at all. They find us on LinkedIn and from other agents. So **SEO is the owner/installer channel**, and the ISO page is built to convert traffic we send it (LinkedIn, paid, outreach), not to rank on day one.
- **We win long-tail how-to queries the POS vendors answer badly.** Vendor help pages tell you which button to click. They don't build the file for you, and they never cover moving *between* POS brands. Our guides explain the vendor's process honestly, then offer the shortcut.
- **Cross-POS "switch" queries are the moat.** "Toast to Square menu", "Clover to Toast menu transfer" and similar. No vendor writes these well, because each vendor only wants you importing into its own product.
- **Launch set:** `/for-isos`, `/clover`, `/square`, `/toast`, `/guides` + 5 articles. Then 1–2 guides a week.

## How solid the numbers are

I don't have Keyword Planner, Ahrefs or Semrush access in this session, and no search console data exists yet (pre-launch). Volume and difficulty below are **directional estimates** from the shape of the SERPs (who ranks, how many vendor help pages, forum threads, ad presence) and from the fact that these are niche B2B/SMB queries. Treat them as tiers, not numbers.

- Volume tiers (US, monthly, Google): **VL** < 50 · **L** 50–250 · **M** 250–1,000 · **H** 1,000+
- Difficulty: **Easy** = forums, small blogs, thin vendor pages in the top 10 · **Med** = vendor help pages dominate but don't fully answer · **Hard** = vendor product pages + big review sites

**Action for Billy (free, 10 min):** open Google Ads → Keyword Planner with any Google account (no spend needed) and paste the keyword list below. I'll replace tiers with real ranges. Verify Search Console the day the domain is live.

What the SERPs looked like (checked 2026-11-12):
- "how to import menu into Clover" → Clover's developer docs, then ISO and processor help desks (several merchant-services companies publish their own "Clover menu creation spreadsheet" articles). **This tells us ISOs already handle this job for merchants.** Beatable with a better guide.
- "Square item library import CSV" → Square help pages own the top 10 (glossary, troubleshooting, import). Hard to outrank head-on; target the modifier-set gap ("the import can't create modifier sets").
- "Toast menu bulk import" → Toast's platform guide and support articles, plus a few integrator pages. The bulk tool is package-gated, uses operation rows and GUIDs, and is irreversible. Lots of room for a plain-English guide.

---

## Keyword map

Priority: **P1** = launch page/article targets it now · **P2** = next 30 days · **P3** = backlog.

### POS import how-to (owner + installer; commercial-investigational)

| Keyword | Intent | Vol | Diff | Priority | Target page |
|---|---|---|---|---|---|
| how to import menu into clover | how-to | L | Med | P1 | /guides/import-menu-into-clover |
| clover menu import / clover inventory import | how-to | L–M | Med | P1 | /guides/import-menu-into-clover, /clover |
| clover menu spreadsheet / clover inventory template | how-to | L | Med | P1 | /guides/import-menu-into-clover |
| clover modifier groups import | how-to | VL | Easy | P1 | /guides/import-menu-into-clover |
| square item library import csv | how-to | L–M | Hard | P1 | /guides/square-item-library-import |
| square menu import / import menu to square | how-to | L | Med | P1 | /square, /guides/square-item-library-import |
| square import modifiers csv / square modifier set import | how-to | L | Med | P1 | /guides/square-item-library-import |
| toast menu upload / upload menu to toast | how-to | L | Med | P1 | /guides/toast-menu-bulk-import, /toast |
| toast bulk import tool / toast menu bulk import | how-to | L | Med | P1 | /guides/toast-menu-bulk-import |
| toast menu build cost / toast menu setup fee | commercial | VL–L | Easy | P1 | /toast |
| pos menu setup / restaurant pos menu setup | how-to | L | Med | P2 | /guides (hub) |
| menu import pos / pos menu import tool | commercial | L | Med | P1 | / (home), /pricing |

### Switching POS (owner + agent; highest value, lowest competition)

| Keyword | Intent | Vol | Diff | Priority | Target page |
|---|---|---|---|---|---|
| switch pos menu / switching pos systems menu | commercial | L | Easy | P1 | /guides/switch-pos-without-retyping-menu |
| pos menu migration / menu migration | commercial | VL–L | Easy | P1 | /guides/switch-pos-without-retyping-menu |
| toast to square menu / move menu from toast to square | how-to | VL | Easy | P1 | /guides/toast-to-square-menu |
| clover to toast menu / clover to square menu | how-to | VL | Easy | P2 | new guides (one per pair) |
| square to clover menu / square to toast menu | how-to | VL | Easy | P2 | new guides |
| transfer menu between pos | how-to | VL | Easy | P2 | /guides/switch-pos-without-retyping-menu |
| export menu from toast / clover export inventory | how-to | L | Med | P2 | new guides ("how to export your menu from X") |

### Photo / PDF to POS (owner; problem-aware)

| Keyword | Intent | Vol | Diff | Priority | Target page |
|---|---|---|---|---|---|
| menu photo to pos / picture of menu to pos | commercial | VL | Easy | P1 | / (home) |
| pdf menu to csv / menu to spreadsheet | how-to | L | Med | P2 | new guide |
| menu data entry service | commercial | L | Med | P2 | /pricing, comparison guide |
| menu entry fiverr alternative | commercial | VL | Easy | P3 | comparison guide |
| ai menu import | commercial | L | Hard | P3 | / (home) |

### ISO / agent (low volume, high value; convert, don't expect to rank big)

| Keyword | Intent | Vol | Diff | Priority | Target page |
|---|---|---|---|---|---|
| menu build service for isos / pos menu programming service | commercial | VL | Easy | P1 | /for-isos |
| restaurant boarding iso / merchant boarding restaurant | informational | VL | Easy | P1 | /for-isos, /guides/menu-builds-restaurant-boarding |
| pos menu programming | commercial | L | Med | P1 | /for-isos |
| pos reseller menu setup / pos installer menu | commercial | VL | Easy | P2 | /for-isos (#resellers section) → /for-resellers later |
| restaurant pos onboarding / pos implementation checklist | informational | L | Med | P2 | new guide: "Restaurant POS install checklist for agents" |
| merchant services agent tools | informational | VL–L | Med | P3 | /for-isos |

### Not targeting

- "doordash menu import", "uber eats menu scraper" and similar. We don't do it (see brand rules).
- Brand + "login", "support", "phone number" queries for Square/Clover/Toast. Wrong intent, and it reads like impersonation.
- "free pos" type head terms. Wrong buyer, impossible SERP.

---

## Site architecture

```
/                         Home: "Any menu. Any POS. In minutes." (existing; light copy tune later)
/for-isos                 Main ISO/agent/reseller landing page (new, launch)
/clover                   POS page (new, launch)
/square                   POS page (new, launch)
/toast                    POS page (new, launch)
/pricing                  Existing
/guides                   Guides hub (new, launch)
  /guides/import-menu-into-clover
  /guides/square-item-library-import
  /guides/toast-menu-bulk-import
  /guides/toast-to-square-menu
  /guides/switch-pos-without-retyping-menu
  /guides/menu-builds-restaurant-boarding      (ISO thought piece)
/build                    App (password-gated; noindex, owned by build session)
/terms /privacy /refunds  Owned by build session
```

**Why /guides, not /blog:** the content is evergreen how-to, and "guide" earns the click on how-to SERPs. News/announcements, if any, go on LinkedIn.

**Next 60 days:**
- `/switch/[from]-to-[to]` pages for each POS pair (6 pairs, 3 POS). Only ship when each has genuinely different content (export steps from the source POS, import steps into the target). No thin programmatic pages.
- `/for-agents` and `/for-resellers` split out from `/for-isos` once we see which section gets the clicks.
- POS pages for SkyTab, Heartland, SpotOn **only once each exporter is live.**

### Internal linking

- Every guide links to its POS page and to `/build` (primary CTA) and `/pricing`.
- POS pages link to their how-to guide and to `/for-isos`.
- `/for-isos` links to all 3 POS pages and the boarding guide.
- Global header: Guides · For ISOs · Pricing · Open app. Footer: POS pages, guides, legal.

### Technical SEO (build session owns; my requests to them)

- `sitemap.xml` including all marketing pages and guides; `robots.txt` disallowing `/build` and `/api`.
- Default metadata + OG image; I'll supply per-page `metadata` on my pages.
- Canonical domain once bought (recommend fastposmenu.com). Today everything is on a `*.vercel.app` URL: **don't push SEO until the real domain is live**, or we're building authority on a URL we'll throw away.
- Article structured data (JSON-LD `Article` + `BreadcrumbList`; `FAQPage` markup won't earn rich results for us anymore but is harmless). I'm adding `Article` JSON-LD on guides myself (page-level, no conflict).

---

## On-page plan per page

| Page | Title tag (≤60) | H1 | Primary / secondary keywords | Meta description (≤155) | Primary CTA |
|---|---|---|---|---|---|
| /for-isos | Menu builds for ISOs and POS resellers · Fast POS Menu | Board the restaurant. Skip the menu build. | pos menu programming; menu build service for isos; restaurant boarding | Stop typing menus during installs. Turn the merchant's menu into a Square, Clover or Toast import file in minutes. $49 a menu. | Build a menu |
| /clover | Clover menu import from photos or PDF · Fast POS Menu | Build a Clover menu from the one they already have. | clover menu import; clover inventory import; clover modifier groups import | Turn menu photos, a PDF or an old-POS export into a Clover inventory spreadsheet with items, categories and modifier groups. | Build a Clover menu |
| /square | Square menu import from photos or PDF · Fast POS Menu | Build a Square item library in minutes. | square menu import; square item library import csv; square modifiers import | Turn any menu into a Square item library import file, plus the exact modifier sets to create first. Works for moving off other POS too. | Build a Square menu |
| /toast | Toast menu upload without the build hours · Fast POS Menu | A Toast menu build without the hourly bill. | toast menu upload; toast bulk import; toast menu build cost | Turn menu photos or a PDF into a Toast bulk-import sheet and a menu-build workbook. Minutes, not menu-expert hours. | Build a Toast menu |
| /guides | POS menu guides for Square, Clover and Toast | Menu import guides | pos menu setup; pos menu migration | Plain-English guides to importing a restaurant menu into Square, Clover and Toast, and moving a menu between them. | Read / Build a menu |
| /guides/import-menu-into-clover | How to import a menu into Clover (2026 guide) | How to import a menu into Clover | how to import menu into clover; clover menu spreadsheet | Clover's import workbook, sheet by sheet: items, modifier groups, categories, tax rates. Plus the fast way. | Build a Clover menu |
| /guides/square-item-library-import | Square item library import: CSV guide with modifiers | How to import a menu into Square's item library | square item library import csv; square modifier set import | How Square's item import sheet works, why it can't create modifier sets, and how to get a full menu in fast. | Build a Square menu |
| /guides/toast-menu-bulk-import | How to upload a menu to Toast (bulk import guide) | How to upload a menu to Toast | toast menu upload; toast bulk import tool | Toast's bulk import tool explained: who can use it, operation rows, GUIDs, and what to set in Toast Web after. | Build a Toast menu |
| /guides/toast-to-square-menu | Move a menu from Toast to Square without retyping | Moving a restaurant from Toast to Square without retyping the menu | toast to square menu; switch from toast to square | Export the Toast menu (or just photograph it), rebuild it as a Square import file, and go live without a weekend of data entry. | Build a Square menu |
| /guides/switch-pos-without-retyping-menu | Switching POS? How to move your menu without retyping | Switching POS without retyping the menu | switch pos menu; pos menu migration | The menu is the hardest part of switching POS. A checklist for owners and agents, and how to do it in minutes. | Build a menu |
| /guides/menu-builds-restaurant-boarding | Menu builds are slowing your restaurant boarding | The menu build is the slowest step in restaurant boarding | restaurant boarding iso; pos onboarding | For ISOs and agents: what menu builds cost your shop in hours and go-live time, and how to take them off the critical path. | Try it on your next board |

### On-page rules (every page)

- One H1 with the primary keyword in natural words. Keyword in the first 100 words.
- Answer first: the first paragraph of every guide answers the query in 2–3 sentences. Then the steps.
- Use the vendor's own UI labels in steps (e.g. "Inventory → Items → Import"), marked "as of Nov 2026, labels can change."
- Every guide has: a TL;DR box, numbered steps, a "gotchas" section, a "the fast way" section with our CTA, a trademark line, and a last-updated date.
- Images: real screenshots of *our* app only. Never screenshots of vendor dashboards (copyright/trademark and accuracy risk).
- Alt text describes the UI, not keywords.
- Mobile: H1 ≤ 3 lines on a 375px screen; CTA visible without scrolling on the landing pages.

---

## Off-page / authority (first 60 days)

1. **Directories:** Product Hunt (launch day, needs Billy's account), G2/Capterra free listings, "AI tools" directories (There's An AI For That, Futurepedia). Needs Billy's approval to create accounts.
2. **ISO ecosystem:** guest post or quote in an industry newsletter or podcast (merchant services, payments). Pitch: "the hidden cost of menu builds in restaurant boarding."
3. **Communities:** helpful answers (not links-first) in r/restaurantowners, r/smallbusiness POS threads, Toast/Clover/Square community forums where people ask "how do I import my menu." Only where rules allow and only with Billy's approval.
4. **Linkable asset (P2):** a free "POS menu import cheat sheet" PDF comparing Square/Clover/Toast import sheets (fields, limits, gotchas). The kind of thing ISO help desks link to.

## Measurement

- Search Console: impressions/clicks per guide, queries we show for but don't target (new guide ideas).
- Goal for day 60: all P1 pages indexed, 10+ guides live, 500+ monthly organic impressions on "import/switch" queries, first organic paid menu.
- Track organic → `/build` → paid menu in analytics (see `paid.md` tracking plan).
