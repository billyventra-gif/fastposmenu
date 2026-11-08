# Fast POS Menu: Phase 1 research

Code 85 Labs · 2026-11-08 · Detail and every source link: the four appendices in [`docs/research/`](research/).

> **How solid this is.** This session's network blocked most vendor sites (squareup.com, clover.com, toasttab.com, doordash.com, uber.com, grubhub.com, registrars, RDAP), and the backup scraper was out of credits. So the findings come from three kinds of source:
> - search-engine excerpts of the official pages
> - real vendor export files that people committed to public GitHub repos
> - vendor API specs on GitHub
>
> Anthropic's docs and npm data were read directly. Anything marked **VERIFY** should be opened by hand, and **no exporter is verified until a generated file imports clean into a real account.**

---

## TL;DR

1. **Ship order: Clover → Square → Toast.** Your three are the right three, but Square is weaker than it looks: Square already does free photo/PDF/URL menu import (build done by WoFlow, "under 24 hours"). Clover has no US AI import, its spreadsheet can create modifier groups, and it's the biggest small-restaurant POS by location count. Toast has the most pain ($150/hr menu builds) but the least automation (no write API).
2. **Don't scrape DoorDash, Uber Eats or Grubhub.** All three ban automated access in their terms. Ship "screenshot it and upload it" now. Restaurant's-own-website import comes later. The app already blocks marketplace links with that message.
3. **Cost per menu is under $1** (Claude Opus 5.5, 150 items with modifiers, about $0.40–0.65 with retries). **At $49 per menu, gross margin is about 95%.** Subscriptions clear 90% too (§5).
4. **Domain:** `fastposmenu.food` reads as **unavailable**, and Vercel *does* sell .food (a made-up .food name came back available). So it's likely registered or reserved. Confirm at lookup.icann.org. `fastposmenu.com` is available at about $12/yr. Nothing was bought.
5. **The opening is cross-POS output and speed for resellers/ISOs.** Built-in importers only feed their own POS, and Toast, SkyTab and Heartland still build menus by hand.

---

## 1. Top 10 US restaurant POS: how menus get in

Market share (best public evidence):
- **Baird, Jan 2026, small-restaurant card processing:** Clover ~20% (~175k locations), Toast ~17%, Square ~13%, Heartland/Genius ~11%.
- **Toast:** ~180k locations at Q2 2026.
- **UBS, by dollar volume:** Toast leads with 16% of $962B US restaurant payments.
- **Others:** SkyTab 30k+ installs (2024), PAR Brink 21k+, TouchBistro ~16k. SpotOn, Aloha and Simphony don't publish counts.

The paid IHL 2026 hospitality POS study is the option if you need a defensible share table. Details: [appendix B](research/b-other-pos-and-market-share.md).

| # | POS | How a menu gets in | Third-party API push | Format confidence |
|---|---|---|---|---|
| 1 | **Clover** | Self-serve Excel import (.xlsx/.xls, ≤5 MB). Sheets: Items, Modifier Groups, Categories, Tax Rates. **Can create modifier groups.** | REST v3 inventory API. Needs OAuth plus Clover App Market approval to publish. | HIGH on sheet/column names (from a real v2.0.0 export). VERIFY re-import behavior. |
| 2 | **Toast** | No general self-serve import. Toast Web bulk import CSV (Menus → Bulk management) only on Essentials/Pro/Enterprise, irreversible, needs existing menu-group GUIDs. Otherwise a paid menu build at $150/hr. | **None.** Menus API v2/v3 is read-only (`menus:read` only), even for partners. | MEDIUM on bulk column names, LOW on order. No public template. |
| 3 | **Square** | Self-serve item library import (XLSX/CSV), plus a **free** photo/PDF/URL import done by WoFlow. | **Public Catalog API** (`/v2/catalog/batch-upsert`, OAuth `ITEMS_WRITE`). No partner approval needed unless you list on the App Marketplace. | HIGH on API. HIGH on sheet column names, MEDIUM on order. The **sheet can't create modifier sets**, only link existing ones. |
| 4 | Heartland / Genius | Export → edit → re-import XLSX (Admin Portal → Tools → Import/Export → Menu), ≤200 items per batch. | v2 menu endpoints after certification; write access unconfirmed. | Needs sample export. |
| 5 | Shift4 SkyTab (+Revel) | Support-assisted: the merchant sends a "POS Menu Import Template" or a competitor export to Shift4 programming. | Marketplace API appears read-only for menus. | Needs template from Shift4. **Product angle:** pre-fill their template. |
| 6 | SpotOn | CSV "Menu Item Template" in Back of House, plus a narrow bulk editor. | Central API appears read-only for menus. | Needs sample. |
| 7 | NCR Voyix Aloha | Aloha Cloud: CSV templates (items, variations, modifiers; ≤5 modifier options per item). Enterprise Aloha: NCR or reseller only. | NCR platform API (`PUT /catalog/items`), per-location fees. | Needs sample. |
| 8 | Lightspeed K-Series | Best-documented self-serve CSV/XLSX with column mapping. **Has its own AI menu importer.** | Rich item API by SKU (partner). | Documented. |
| 9 | TouchBistro | CSV, items only, ≤200 per upload, no modifiers or taxes. | Partner-only, NDA. | Needs sample. |
| 10 | PAR Brink | Enterprise; partner-driven. | Partner API. | Not researched deeply. |

Square, Clover and Toast column-by-column detail: [appendix A](research/a-square-clover-toast.md).

### How the exporters handle each of the first three

- **Square:** the item library XLSX has one row per variation, `Modifier Set - X` and `Tax - X (rate%)` columns, and `Variable` for market price. Because the sheet can't create modifier sets, the app lists the exact sets to create first. It also emits a **Catalog API batch-upsert JSON** that creates everything (categories, taxes, modifier lists with min/max, items, variations) in one push once OAuth is wired. That API push is our edge over Square's free 24-hour import.
- **Clover:** a five-sheet workbook. Links are by name, and extra groups or categories go on continuation rows. Sizes become a required "Size" modifier group with base price = smallest size; identical size sets are shared.
- **Toast:** a menu-build workbook in Toast's own structure (Menu → Group → Item → Modifier Group → Modifier) for the onboarding team, plus a bulk-import sheet. That sheet uses CREATE/ATTACH rows, `REPLACE_WITH_GUID` placeholders for menu groups, and sizes as a "priced by modifiers" group.

All three are labelled **"Beta format: needs a real sample export to verify"** in the UI.

## 2. Link ingestion (DoorDash / Uber Eats / Grubhub)

**Plain version:** all three ban automated access in their terms. Examples:
- Grubhub, and DoorDash's online-ordering terms: no access "with any robot, spider, web crawler, extraction software, automated process… to scrape, copy… or monitor".
- Grubhub also bans "circumvent[ing] any technological measure".
- Uber's terms template bans "programs or scripts for the purpose of scraping… or otherwise data mining".

The US clauses were seen in search excerpts; **VERIFY** them, and robots.txt, by hand.

**Legal risk, in plain English:**
- **Federal hacking law (CFAA):** low risk for public pages after *Van Buren* (2021) and *hiQ v. LinkedIn*.
- **Breach of contract:** the real risk. hiQ still lost on contract and paid a $500K consent judgment with an injunction.
- **"The user authorized us" doesn't protect us.** *Facebook v. Power Ventures*: user permission didn't help once Facebook sent a cease-and-desist letter.
- ***Meta v. Bright Data*** went the scraper's way only because Meta's terms covered logged-in users. DoorDash's and Grubhub's wording is broader.
- **Copyright:** prices and item names are facts and free to take. **Photos are copyrighted, and often not even the restaurant's.** Creative descriptions can be protected.
- **Bot protection:** these sites need headless browsers and residential proxies. Getting around those protections adds legal weight, and the parsers break often.
- **No known suit** by DoorDash, Uber or Grubhub against a scraper, but you don't want to be the first.

**Partner APIs** (DoorDash Marketplace, Uber Eats, Grubhub) are gated behind certification or an NDA, and mostly push menus *to* the platform. Uber has a read-menu endpoint, but production access requires a partnership.

| Option | Risk |
|---|---|
| Merchant uploads a screenshot, saved page/PDF or POS export of their own menu | **Low** |
| Restaurant's own website, fetched once, plain HTTP, robots.txt respected | **Low** |
| Google Business Profile menu via the owner's OAuth | **Low** |
| Merchant pastes *their own* marketplace link and we fetch it once | **Medium:** the platform's terms bind our server |
| Bulk or stealth scraping with proxies | **High** |

**Ship first:** upload, which is built. The link box tells marketplace users to screenshot and upload. Next is own-site URL import, stubbed behind `LINK_FETCH_ENABLED` until there's an SSRF guard and a robots.txt check. Don't ship marketplace-URL fetching without a lawyer's sign-off. Detail: [appendix C](research/c-link-and-file-ingestion.md).

## 3. File ingestion

- **Photos (Claude vision):**
  - Cost is ⌈w/28⌉×⌈h/28⌉ tokens per image. Current models read up to a 2,576 px long edge (about 4,784 tokens).
  - The app shrinks photos in the browser to a 2,000 px long edge (about 3,900 tokens per page), which keeps menu text legible.
  - JPEG, PNG, WebP and GIF only. **iPhone HEIC is rejected** with a fix-it message.
  - Up to 20 photos go in one call, so the model sees modifiers printed on another page.
- **PDFs:** up to 600 pages. Each page is sent as extracted text plus an image (about 1.5–3k tokens on top of the image). One call per PDF; results are merged in code.
- **Structured output:** we use `output_config.format` with the Zod schema, which guarantees valid JSON. The model returns **raw price text** ("$12.95", "MP", "+1.50"). Code parses it to integer cents, infers min/max from rule text ("choose one", "up to 2"), generates IDs, de-dupes groups and categories across pages, and links modifier groups by name. **The math stays in code.**
- **Accuracy:** no public menu benchmark exists. LLMs beat traditional OCR on semi-structured documents; dense tables are where they slip. Plan:
  - a 30–50 menu test set (`npm run test:live` is the start);
  - a mandatory review screen, which the app has: low-confidence items are flagged with a filter.
- **Spreadsheets:**
  - **Parsing:** papaparse for CSV, exceljs for XLSX. *Not* the npm `xlsx` package, which is stuck at 0.18.5 with two CVEs.
  - **Tidy sheets** (name/price/category, including Square-style variation rows) map **in code with zero tokens**.
  - **Messy sheets** and exports with modifiers go to Claude as CSV text.
- **Old-POS exports:**
  - Square: one row per variation, `Token`/`Item Name`/`Variation Name`.
  - Clover: an XLSX with Items, Modifier Groups, Categories and Tax Rates tabs.
  - Toast: `menu_export_*.csv` with an `Entity type` column.
  - Next step: code mappers for each, so re-platforming (e.g. Clover → Toast) costs zero tokens.

## 4. Competitors and market pricing

| Who | What | Price |
|---|---|---|
| **Square** | Free photo/PDF/URL menu import (WoFlow), "under 24 hours." AI Menu Generator (Oct 2023) writes a starter menu. | Free, but **Square only** |
| **Lightspeed** | AI menu importer (PDF, image, HTML, CSV), empty accounts only | Included |
| **Aldelo** | Photo-to-menu from the POS camera (Nov 2023) | Included |
| **Toast** | Menu Checker only analyzes. Full menu build is paid. | **$150/hr** consultant; $1,000 install day |
| **Clover** | AI photo import shown at EuroShop 2026 (Germany); not confirmed in US | VERIFY |
| SpotOn, SkyTab, TouchBistro, Heartland | Human menu programming during onboarding | Usually bundled |
| Fiverr menu entry | Entry-level gigs | $10–25 per 50 items; **est. $50–300** for 100–200 items with modifiers |
| Upwork | Data entry / POS developers | $7–9/hr / $30–50/hr |
| Deliverect, ItsaCheckmate, Chowly, Otter | Menu *sync* POS ↔ delivery apps (not builds) | $19–119+/mo per location |
| Veryfi | Generic OCR API | ~$0.08–0.16/doc |

A menu build typically takes **4–20 hours** by hand, by an owner's account and your estimate; there's no rigorous source. At Toast's rate that's $600–3,000. **Who pays today:** usually the ISO/vendor eats it during onboarding, and at Toast the merchant pays. Detail: [appendix D](research/d-competitors-and-domain.md).

## 5. Unit economics

**Assumptions for a typical 150-item menu with about 12 modifier groups:**
- Input: 4 photo pages ≈ 16k tokens (a 4-page PDF ≈ 26k).
- Output: ≈ 12.5k tokens of JSON plus about 30% thinking at `medium` effort ≈ 16k.
- 1.5× on top for retries and re-reads.

Measure the real numbers with `npm run test:live`. Every request logs its tokens and cost.

| Model | Cost per menu (photos) | Cost per menu (PDF) | ×1.5 buffer |
|---|---|---|---|
| **Claude Opus 5.5** ($4/$20 per MTok), default | $0.39 | $0.43 | **$0.58–0.64** |
| Claude Sonnet 5.5 ($2/$10) | $0.19 | $0.21 | $0.29–0.32 |
| Claude Haiku 5.5 ($0.10/$0.50) | $0.01 | $0.01 | $0.02 |

Output tokens dominate the cost. The system prompt is cached (cache reads $0.20/MTok on Opus 5.5). Batch API (50% off) fits a future "email me when it's done" mode. **Recommendation: keep Opus 5.5 as the default and decide with data.** Run the same 30-menu test set on Sonnet 5.5 and Haiku 5.5. If one matches accuracy, set `MENU_MODEL` per plan. Accuracy is the product; the model is under 2% of price either way.

**Other per-menu costs:**
- Vercel Pro $20/mo plus Supabase Pro $25/mo, spread over even 50 menus, is ≈ $0.90/menu. It falls fast with volume.
- Storage is pennies, with a 30-day auto-delete.
- **No proxy or scraping cost**, because we don't scrape.
- **Stripe** 2.9% + $0.30 is the biggest variable cost.

**Proposed prices:**

| Plan | Price | Our cost (worst case: every build used, Opus, retries, Stripe) | Gross margin |
|---|---|---|---|
| **Per menu** | **$49** | $0.64 tokens + $1.72 Stripe + ~$0.50 infra ≈ $2.86 | **~94%** |
| **Pro** (resellers boarding a few per month) | **$149/mo, 10 builds** | $6.40 + $4.62 + $5 ≈ $16.02 | **~89%** at 100% use; ~91% at 60% use |
| **Agency** (ISOs) | **$399/mo, 40 builds** | $25.60 + $11.87 + $10 ≈ $47.47 | **~88%** at 100% use; ~91% at 60% use |

Pro and Agency dip just under 90% only in the worst case: every build used, *and* every menu needing a retry on Opus. At realistic use (about 60%) both clear 90%. If Sonnet 5.5 tests as accurate as Opus, both clear 90% even at full use (Pro ≈ 91%, Agency ≈ 91%). If not, track real use and adjust the included build counts.

**Sanity check:** $49 is the same as or less than a Fiverr gig, 3–60× cheaper than a Toast build ($600–3,000), and minutes instead of days. It's an easy sell for Toast/Clover/SkyTab/Heartland; for Square-only, compete on speed plus API push or bundle it. Overage on subscriptions: $15/build.

## 6. Which 3 POS to support first

Your instinct (Square, Clover, Toast) holds, but **sequence it Clover → Square → Toast**:

1. **Clover first:**
   - Largest small-restaurant share.
   - No US AI import confirmed.
   - The spreadsheet can create modifier groups, so it's the most complete import of the three.
   - Your ISO world resells it, so you know the buyer. (Keep SmarterSwipe merchants and data out of it; see the caution below.)
2. **Square second:**
   - Square's own free import erodes the per-menu value.
   - But its Catalog API is open (no partner gate), so **one-click API push** is a real edge over Square's 24-hour turnaround.
   - The same canonical schema also lets you move a menu *off* Square.
3. **Toast third:**
   - The most pain ($150/hr builds) and the fastest growth.
   - The least automation: no write API, and bulk import only on higher tiers.
   - The product there is a clean build sheet plus a bulk CSV that cuts onboarding hours.

**Next after those:** SkyTab, where you'd pre-fill Shift4's import template (support-assisted today, so we save the merchant a long back-and-forth with Shift4 support), then Heartland. Skip Lightspeed, which has its own AI importer.

## 7. Domain

- **`fastposmenu.food`: unavailable** per Vercel's registrar lookup. Vercel sells .food ($39.14/yr), and a made-up .food name returned available, so this is likely registered, reserved or premium. Check owner and status at https://lookup.icann.org. Elsewhere .food runs about $3.63 first year / $31.41 renewal at Porkbun, and $4.98 / $48.98 at Namecheap (aggregator data, **VERIFY**).
- **`fastposmenu.com`: available**, about $12/yr. Recommend grabbing it either way.
- Nothing purchased.

## 8. Before you go further: employment

**Talk to an employment lawyer before launch.** SmarterSwipe resells Square and Clover, and a menu-building tool for POS onboarding sits right next to that day job. Have the lawyer check:
- the **IP-assignment clause**, especially whether it covers inventions "related to the employer's business" or made with any employer time or equipment;
- the **outside-activity / moonlighting** and **non-solicit** clauses, before selling to ISOs who compete with SmarterSwipe;
- that no SmarterSwipe merchant menus, data, accounts or relationships are used for testing or sales.

California Labor Code §2870 helps for work done on your own time and equipment, but **not** for inventions that "relate to the employer's business". That's the gray area here.
