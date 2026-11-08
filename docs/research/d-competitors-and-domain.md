# Fast POS Menu: Market and Competitor Research (as of 2026-11-08)

**Method note:** In this session, WebFetch and curl could not reach most hosts (squareup.com, support.toasttab.com, porkbun.com, rdap.org and Verisign RDAP were all blocked by the session's network allowlist). The Firecrawl scraper had no credits left. So every claim below comes from WebSearch result snippets and summaries, and the URL given is the page each snippet came from. I could not open the pages to confirm them. Figures marked "third-party" come from aggregators or review sites, not the vendor.

---

## Part 1: Competitors and pricing

### Headline answer: is photo-to-menu or URL-to-menu import already free?

| Vendor | Photo/PDF/URL to menu import? | Cost | Date | Source |
|---|---|---|---|---|
| **Square** | **Yes.** In Dashboard > Items & services > Menus > Create a menu, "Upload a file, photo, or URL of your existing menu." It accepts PDF, JPG and PNG and is processed through the **WoFlow** integration. Square emails you when it is done, and "most menu builds take under 24 hours." There is also a "transfer from another platform (Toast, DoorDash)" flow through WoFlow. One AU help page says upload/import is only for quick-service restaurants. | No fee is stated. The help article covers Square Free, Plus and Premium, so it is probably free, but this is unconfirmed. | WoFlow upload: no launch date found. Separate **AI Menu Generator** (a starter menu written by GPT) announced **Oct 18, 2023**. | https://squareup.com/help/us/en/article/6424-create-and-update-menus ; https://app.squareup.com/help/au/en/article/6424 ; https://techcrunch.com/2023/10/18/squares-new-ai-features-include-a-website-and-restaurant-menu-generator ; https://businesswire.com/news/home/20231018675988/en/New-Generative-AI-Features-from-Square-Give-Powerful-Technology-to-All-Businesses |
| **Toast** | **No import found.** Toast's **Menu Checker** accepts a link, PDF or photo, but only analyzes the menu (pricing, allergens and similar). It does not import it. ToastIQ (launched May 1, 2025) edits prices and availability by chat. Onboarding gives you either a **template build** or a purchased **"full menu build"**. | Hourly Professional Services. A Toast "Menu Expert Hours" page says **$150/hr**. UK table shows £80–£120/hr. On-site install day is $1,000. Toast installers "do not build menus on-site." Third-party: $95/hr onboarding. | Menu Checker live in 2026. ToastIQ May 2025. | https://pos.toasttab.com/toast-menu-checker ; https://support.toasttab.com/en/article/Professional-Services ; https://support.toasttab.com/en/article/Services-Rates-and-Fees ; https://support.toasttab.com/article/Self-Service-Guide ; https://www.businesswire.com/news/home/20250501039656/en/toast-launches-toastiq-to-superpower-the-future-of-restaurants ; https://merchantinsiders.com/blogs/toast-fees/ |
| **Clover (Fiserv)** | **Unclear in the US.** No US Clover doc describes photo import. A German **EuroShop 2026** page (Fiserv/TeleCash) describes an "AI-powered menu builder" that photographs a menu and imports items, prices, categories and modifiers. US rollout is unconfirmed. Integrators import from Clover Inventory > Items. | Unknown | EuroShop 2026 (Feb/Mar 2026) | https://www.euroshop-tradefair.com/en/Home/Company_News/Clover_set_to_transform_the_German_POS_market_-_Global_ecosystem_debuts_at_EuroShop ; https://helpdesk.tryotter.com/hc/en-us/articles/18832014938003-Otter-Clover-Integration-Guide |
| **Lightspeed** (O-Series / K-Series / Kounta) | **Yes.** The "AI menu importer" accepts PDF, PNG, JPG, HTML, CSV and TXT and extracts products, prices, categories and option sets, with a review step. It only works when the account has no products yet. Kounta's "AI Menu Import" also accepts photos and screenshots from another POS. | Included in the product (no separate fee found) | Kounta release reported **July 2026** | https://o-series-support.lightspeedhq.com/hc/articles/51562172008987 ; https://k-series-support.lightspeedhq.com/hc/articles/1260804605430-Importing-and-exporting-menus ; https://updates.kounta.com/156183-build-your-menu-faster-with-ai |
| **SpotOn** | **No photo import found.** Its AI Menu Assistant does prompt-based bulk edits and is "included at no extra cost." The onboarding specialist handles "menu programming." | Programming bundled into onboarding. Setup fees exist (third-party). | n/a | https://www.spoton.com/solutions/ai-menu-assistant/ ; https://toolradar.com/tools/spoton |
| **Shift4 SkyTab / Shift4 Dine** | **No AI import.** A Pre-Launch Specialist programs the menu from your submission and the menu template. Conversions are accepted from a limited list of POS exports (e.g. a Clover export). After 30 days, changes go through a Menu Programming Request form. | Bundled. Third-party says the $29.99/mo plan includes menu programming and installation. | n/a | https://www.skytab.com/resource-center/onboarding-guide ; https://shift4.zendesk.com/hc/en-us/articles/28528184692627-SkyTab-Menu-Submission-Guide ; https://www.posusa.com/skytab-pos-system/ |
| **TouchBistro** | No AI import found. The onboarding manager handles "menu setup." | Setup fee exists, amount unpublished | n/a | https://www.nerdwallet.com/article/small-business/touchbistro-review |
| **Heartland / Genius (Global Payments)** | No AI import found. Menus are programmed in the Admin Portal during implementation. | Unpublished | n/a | https://www.heartland.us/products/point-of-sale/restaurant ; https://www.scribd.com/document/379898653/Implementation-Task-List |
| **Aldelo Express** | **Yes.** The "AI Menu Builder" builds a menu from a photo of a printed menu taken with the POS camera. | Included | Press release **Nov 3, 2023** | https://www.aldelo.com/news/press-release-ai-menu-builder-now-available-for-restaurants |
| **Teya, Surfboard, NeroPay** (EU) | Yes, AI import from a photo or file | Included | 2025–26 | https://help.teya.com/hc/en-gb/articles/49062567716625-Importing-your-menu-with-AI ; https://surfpay.surfboardpayments.com/blog/new-feature-create-a-product-list-by-photographing-your-menu |

**Bottom line:** Square, Lightspeed and Aldelo already offer photo, file or URL import inside their own products, apparently for free. Square's version is human-assisted through WoFlow and takes about 24 hours. Toast, SpotOn, SkyTab, TouchBistro and Heartland still build menus with people, either bundled into onboarding or billed hourly (Toast ~$150/hr). Clover's AI builder is shown in Europe, and US availability is unconfirmed. None of these tools exports to another vendor's POS, which leaves a cross-POS gap.

### Full competitor pricing table

| Name | What it does | Price | Source URL |
|---|---|---|---|
| Square Menus upload (WoFlow) | Photo/PDF/URL to Square menu, about 24 hours | No fee stated (likely free) | https://squareup.com/help/us/en/article/6424-create-and-update-menus |
| Square AI Menu Generator | Writes a starter menu with GenAI (not an import) | Free | https://techcrunch.com/2023/10/18/squares-new-ai-features-include-a-website-and-restaurant-menu-generator |
| Toast Professional Services / Menu Expert Hours | Consultant builds or updates the menu | $150/hr (US page); £80–£120/hr (UK); recurring hour packages | https://support.toasttab.com/en/article/Professional-Services ; https://support.toasttab.com/en/article/Services-Rates-and-Fees |
| Toast on-site install | 8-hour install day, no menu build included | $1,000 | https://support.toasttab.com/en/article/Services-Rates-and-Fees |
| Lightspeed AI menu importer | Photo/PDF/CSV to Lightspeed | Included | https://o-series-support.lightspeedhq.com/hc/articles/51562172008987 |
| Lightspeed onboarding | Guided setup including menu | $500–$2,000 one-time (third-party estimate) | https://www.itqlick.com/lightspeed-restaurant/pricing |
| SkyTab menu programming | Specialist programs the menu | Bundled with plan | https://www.skytab.com/resource-center/onboarding-guide |
| Aldelo AI Menu Builder | Photo to Aldelo menu | Included | https://www.aldelo.com/news/press-release-ai-menu-builder-now-available-for-restaurants |
| Deliverect | Syncs menus between POS and delivery apps | From $119/mo (3+ locations); older figures $79–$149/location + $199 onboarding | https://www.deliverect.com/en-us/pricing ; https://www.thrivepos.com/en-us/en-us/thrive-pizza-point-of-sale-with-deliverect-thanks-faq |
| ItsaCheckmate | POS to delivery-app menu sync | $85/mo (2 integrations), $100/mo (unlimited); partners cite $115–$140/location | https://get.itsacheckmate.com/digital-delivery-roi-calculator ; https://trycake.com/pages/checkmate-integration |
| Chowly | POS to delivery-app integration | ~$35/mo minimum per location (third-party), otherwise quote only | https://us.fitgap.com/products/030974/chowly |
| Otter | Order hub and menu sync | Widely varying: $19–$89+/mo/location (third-party) | https://trustradius.com/products/otter-order-manager/reviews ; https://www.fooderise.com/en/blog/otter-tryotter-prix-tarifs-caches-restaurateurs-2026 |
| WoFlow | Menu digitization vendor behind Square's upload | B2B, unpublished | https://squareup.com/help/us/en/article/6424-create-and-update-menus |
| Grubhub + Invisible Technologies | AI plus human pipeline turning unstructured menus into structured data for merchant onboarding | Internal to Grubhub (free to merchants) | https://invisibletech.ai/case-studies/grubhub-improves-merchant-onboarding-with-agentic-ai |
| DoorDash | Menu Manager "Request Menu Update"; free photoshoot | Free | https://merchants.doordash.com/en-us/learning-center/photos ; https://help.doordash.com/en-ca/merchants/article/free-photoshoot |
| Popmenu | Restaurant website and menu | $149–$499/mo + $119–$499 setup (third-party) | https://www.menutiger.com/blog/bentobox-alternative ; https://www.trustradius.com/compare-products/owner-com-vs-popmenu |
| BentoBox | Website and ordering; imports from Clover | From $119/mo (third-party) | https://capterra.com/p/222733/BentoBox/ |
| Owner.com | Website and ordering | $499/mo (Flex $249 + 5%) | https://costbench.com/software/food-delivery-platform/owner-com/ |
| MENU TIGER / Menukite | AI photo/PDF to QR digital menu (not a POS import) | Free tier (MENU TIGER: 10 items) | https://www.menutiger.com/blog/ai-menu-maker ; https://www.producthunt.com/products/menukite |
| Veryfi | OCR API (has a "Restaurant Menu OCR API" page) | Free for 100 docs/mo; ~$0.08–$0.16/doc; Starter $500/mo | https://www.veryfi.com/restaurant-menu-ocr-api/ ; https://faq.veryfi.com/en/articles/3743986-what-are-the-plans-prices-for-ocr-api |
| Fiverr menu-entry gigs | Manual entry into Square, Clover or Toast | $10–$25 entry gigs (e.g. $25 for up to 50 items; $20 menu entry with modifiers); $50–$100 tiers | https://www.fiverr.com/gigs/menu-data-entry ; https://www.fiverr.com/oladeleade_/set-up-customize-troubleshoot-toast-pos-system-like-a-pro ; https://www.fiverr.com/asad_rafeeque/do-restaurant-menu-data-entry-and-food-menu-data-entry ; https://www.fiverr.com/tayyabrehman473/make-uber-eats-menu-professionally-with-pics-and-options |
| Fiverr Excel/CSV to POS gig | Converts a spreadsheet to a Square, Toast or Clover menu | Price not shown | https://fiverr.com/olive_thompson1/convert-excel-csv-files-into-square-toast-clover-pos-menus |
| Upwork | POS menu programming service listing; general data entry ~$7–$9/hr; POS integration developers $30–$50/hr | as stated | https://www.upwork.com/services/product/admin-customer-support-pos-inventory-management-menu-building-1868402954165735212 |
| Freelancer.com | Square menu build bids | ~$10–$15 bids | https://www.freelancer.de/projects/research/square-pos-menu-build |

Inference from the gig prices: a 100–200 item menu with modifiers would likely cost **$50–$300 on Fiverr**. The entry gigs cap at about 50 items and extra items are priced as add-ons. No listing showed an exact price for 150 items.

### ISO / reseller practice

- **Who pays:** In most cases the POS vendor or ISO absorbs the menu build into onboarding: SkyTab, SpotOn, Lightspeed and TouchBistro onboarding all include "menu setup." Toast bills it hourly when it goes beyond a template. No source documents a standard ISO split. Sources: https://www.skytab.com/resource-center/onboarding-guide ; https://www.spoton.com/solutions/ai-menu-assistant/ ; https://lightspeedhq.com/pos/restaurant/getting-started-with-lightspeed ; https://www.nerdwallet.com/article/small-business/touchbistro-review
- **Cost benchmarks:** "Menu programming" costs about $100–$500, and onboarding fees run $0–$800+ (from a vendor blog): https://www.mydigimenu.com/post/pos-integration-cost . Toast charges $150/hr: https://support.toasttab.com/en/article/Professional-Services
- **Hours:** I found no rigorous benchmark. One restaurant owner said they "installed our entire menu in around 8 hours over a few days" (https://thinktank.pmq.com/t/building-your-own-pos-system/12974). Tonic POS says manual entry stretches "from hours into days" (https://tonicpos.com/the-fastest-menu-setup-youve-never-heard-of/). SkyTab's specialist "estimates the time required to program your menu" (https://www.skytab.com/resource-center/onboarding-guide). The 4–20 hour range in the brief is plausible but unverified. At Toast's $150/hr, that range is about $600–$3,000.
- **Reseller margins:** Resellers report 40–60% on SaaS, 15–25% on hardware and 0.1–0.5% on processing (vendor claim): https://www.orderpin.co/category/iso-guide/page/3/

---

## Part 2: Domain check

What I tried:
1. `curl` against https://rdap.verisign.com/com/v1/domain/fastposmenu.com, https://rdap.org/domain/fastposmenu.food, https://rdap.identitydigital.services/rdap/domain/fastposmenu.food and https://data.iana.org/rdap/dns.json. All failed with **proxy 403 (host not allowed in this session)**.
2. WebFetch of https://porkbun.com/checkout/search?q=fastposmenu.food. This failed with **host not allowed**. I did not try Namecheap, GoDaddy or Dynadot pages for the same reason.
3. **Vercel registrar API** (a read-only availability and price lookup; nothing was bought):
   - `fastposmenu.food` returned **available: false**, and the domain price lookup returned a null purchase price (error).
   - Control test: `xqzvbn8841qqtest.food` returned **available: true**, so the .food lookup itself works.
   - `.food` TLD price at Vercel: **$39.14 registration / $39.14 renewal** (transfer $59.99).
   - `fastposmenu.com` returned **available: true**, at **$12.03/yr** (Vercel).
4. A WebSearch for "fastposmenu" found no website using the name.

**Conclusion:** **fastposmenu.food appears NOT available.** It is most likely already registered, or registry-reserved or premium. I could not get WHOIS to tell those apart, so Billy should confirm at https://lookup.icann.org/en/lookup . **fastposmenu.com appears AVAILABLE** (about $12/yr).

.food retail pricing (aggregator domainoffer.net, mid-2026): Porkbun ~$3.63 first year / ~$31.41 renewal; Namecheap ~$4.98 / ~$48.98; Dynadot ~$4.99 / ~$32.32; Spaceship ~$2.16 / ~$31.25. Source: https://domainoffer.net/tld/food . .food is a Donuts/Identity Digital TLD.
