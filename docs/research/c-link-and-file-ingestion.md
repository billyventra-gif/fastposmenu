# Fast POS Menu: how to get a menu in (links vs. files)

Date: 2026-11-08. Research pass for the founder. Not legal advice. Have a lawyer read Part 1 before you ship anything that fetches marketplace pages.

## How strong is the evidence? (read this first)

This sandbox could not open doordash.com, uber.com, ubereats.com, grubhub.com, or any robots.txt file. Every direct fetch was blocked by the network policy, and the Firecrawl fallback was out of credits. So:

- **ToS quotes** come from web-search excerpts of the platforms' own pages (help.doordash.com, grubhub.com, uber.com regional pages), and in some cases from a third-party tracker (ConductAtlas). Each quote below says where it came from. **Before relying on any quote, open the live US page and confirm the wording.**
- **robots.txt was not checked.** I could not fetch it, and search did not return the file contents. Fetch `https://www.doordash.com/robots.txt`, `https://www.ubereats.com/robots.txt` and `https://www.grubhub.com/robots.txt` yourself. It matters less than it sounds: robots.txt is a crawler courtesy signal, not a contract, and the ToS bans below apply whatever it says.
- **Anthropic docs** (Part 2) were fetched directly from platform.claude.com and are quoted exactly.
- **npm versions** were read directly from registry.npmjs.org.

---

# Part 1: Ingesting DoorDash, Uber Eats and Grubhub store links

## 1.1 What the terms say

### DoorDash

The main US consumer terms page did not come back in search, so I could not quote its scraping clause directly. DoorDash's other US terms pages, all on help.doordash.com, use the same anti-scraping wording:

- **US Storefront Consumer Terms, clause (g):** "you will not deep-link to the Storefront site or access our site manually or with any robot, spider, web crawler, extraction software, automated process and/or device to scrape, copy, index, frame, or monitor any portion of our site or any content on our site." ([help.doordash.com Storefront Consumer Terms](https://help.doordash.com/en-us/consumers/article/storefront-consumer-terms-and-conditions-english))
- **US Online Ordering Consumer Terms, clause (g):** same wording, with "Online Ordering site" in place of "Storefront site". ([help.doordash.com Online Ordering terms](https://help.doordash.com/en-us/consumers/online-ordering-consumer-terms-and-conditions))
- **AU/NZ Consumer Terms:** "(n) You will not conduct any systematic retrieval of data or other content from the Website, Software or Services." It also has a robot/spider/crawler ban "unless the Company has given you permission to do so in writing." ([help.doordash.com AU terms](https://help.doordash.com/en-us/consumers/article/consumer-terms-and-conditions-au-english))
- **Third-party record of the main DoorDash ToS (ConductAtlas, not DoorDash):** users may not "scrape or systematically retrieve data from the Services", even without logging in, and may not collect content "by automated means" without written permission. ConductAtlas also flags this clause as an AI-training restriction. ([ConductAtlas: systematic retrieval](https://conductatlas.com/platform/doordash/doordash-terms-of-service/provision/CA-P-025955/prohibition-on-systematic-data-retrieval/), [automated collection](https://conductatlas.com/platform/doordash/doordash-terms-of-service/provision/CA-P-025951/prohibition-on-automated-content-collection/))
- **Developer terms:** "You shall not crawl, scrape or otherwise index information on the DoorDash Platform without prior written consent from DoorDash." ([DoorDash developer terms v2](https://developer.doordash.com/en-US/terms/v2/2/))
- **Dasher deactivation policy (US):** "Scraping" is listed as an abuse, defined as "Using any robot, spider, web crawler, extraction software, automated process and/or device to scrape, copy, index, frame, monitor, conduct any systematic retrieval of data or other content from any portion of DoorDash platform or its content." ([help.doordash.com deactivation policy](https://help.doordash.com/en-us/dashers/article/deactivation-policy-us-english-dx))

**Merchant terms, on who owns the menu content.** In the US Merchant Terms, the merchant grants DoorDash a "royalty-free, non-exclusive, limited, revocable, and non-transferable license" to use and display Merchant Content. That implies the restaurant keeps ownership of its own content. ([Merchant ToS US §1-11](https://help.doordash.com/en-us/merchants/article/merchant-terms-of-service-us-english-section-1-11); the excerpt is from a version effective Jan 20, 2023.)

The photos are a separate problem. DoorDash says it may add photos to items that have none, and that these "may come from a connected Instagram account or Yelp" ([DoorDash Menu Photo Terms](https://help.doordash.com/merchants/s/article/Photos-Terms-Glossary)). So a photo on a DoorDash store page may not belong to the restaurant at all.

### Uber Eats (Uber US Terms of Use)

The US Terms page returned only its opening text in search, so I could not confirm the exact US clause. The same Uber terms template, in other countries' versions, says:

- "**cause or launch any programs or scripts for the purpose of scraping, indexing, surveying, or otherwise data mining any portion of the Services** or unduly burdening or hindering the operation and/or functionality of any aspect of the Services". This appears next to bans on reverse engineering and on framing or mirroring the Services. ([Uber India terms](https://www.uber.com/legal/terms/in), [Uber Uganda](https://www.uber.com/legal/terms/ug/), [Bangladesh](https://www.uber.com/legal/terms/bd/))
- A ScrapingBee guide says that "depending on the country, Uber's Terms of Use expressly prohibit scripts used to scrape" ([ScrapingBee](https://www.scrapingbee.com/blog/how-to-scrape-uber-eats-data/)). Confirm the US wording at [uber.com/terms](https://uber.com/terms).
- **Uber API terms:** you may not "parse, bulk collect, or scrape any of Uber's data (including but not limited to pricing)", and newer versions also ban using the data to develop or train models. ([developer.uber.com terms](https://developer.uber.com/docs/riders/terms-of-use)). The Uber Eats API terms also require that the merchant "has expressly authorised you" to access its data. ([Uber Eats API terms (CA)](https://www.uber.com/ca/en/legal/uber-eats-api-terms-of-use/))

### Grubhub

Clauses from the Grubhub Terms of Use, via search excerpt of the official page and ConductAtlas's December 2024 record:

- You agree "not to deep-link to or frame the Platform and/or access the Platform manually and/or with any robot, spider, web crawler, extraction software, automated process and/or device or other means to scrape, copy and/or monitor any portion of the Platform", unless Grubhub gives written authorization. ([grubhub.com/legal/terms-of-use](https://www.grubhub.com/legal/terms-of-use); [ConductAtlas](https://conductatlas.com/platform/grubhub/grubhub-terms-of-use/provision/CA-P-028371/no-scraping-or-automated-data-extraction/))
- You agree "not to conduct any scraping, indexing, surveying, data mining, or any other kind of systematic retrieval of data or other content from the Platform." ([ConductAtlas](https://conductatlas.com/platform/grubhub/grubhub-terms-of-use/provision/CA-P-028374/no-systematic-data-mining-or-indexing/))
- You agree "not to avoid, bypass, remove, deactivate, impair, descramble, or attempt, through any means, to circumvent any technological measure". ([ConductAtlas](https://conductatlas.com/platform/grubhub/grubhub-terms-of-use/provision/CA-P-028362/no-circumvention-of-platform-security-measures/))
- "the Platform is made available solely for your personal, non-commercial use." ([ConductAtlas](https://conductatlas.com/platform/grubhub/grubhub-terms-of-use/platform-personal-non-commercial-use-only/))

**What this means:** all three platforms ban automated copying of their pages in plain words. DoorDash's tracked clause and Grubhub's clause cover logged-out access too ("manually and/or with any robot"). The Meta v. Bright Data defense (Meta's terms only covered logged-in users) is therefore much weaker here.

## 1.2 US case law in plain English

- **Van Buren v. United States (Supreme Court, 2021).** This narrowed the federal anti-hacking law (CFAA). "Exceeds authorized access" means going into parts of a system that are off limits to you. It does not mean using information you were allowed to see for a purpose the owner dislikes. This is the "gates up or down" test. Footnote 8 left open whether a contract or policy can put a gate down, as opposed to only a technical barrier. ([Proskauer](https://newmedialaw.proskauer.com/2021/06/06/supreme-court-ends-long-running-circuit-split-over-cfaa-exceeds-authorized-access-issue-adopting-a-narrow-interpretation-that-will-reverberate-in-scraping-disputes-and-litigation-ov/), [MoFo](https://mofo.com/resources/insights/210609-supreme-court-limits))
- **hiQ v. LinkedIn (9th Cir. 2019, and again 2022 after Van Buren).** Scraping public LinkedIn profiles that need no login is likely not "without authorization" under the CFAA, because public pages have no gate. This only answered the federal hacking-law question, and hiQ still lost:
  - Nov 2022: the court granted LinkedIn summary judgment on **breach of contract** and held that LinkedIn's anti-scraping user agreement was enforceable.
  - Dec 2022: hiQ agreed to a consent judgment with a **$500,000 judgment** and liability for trespass to chattels and misappropriation under California law. hiQ also stipulated that LinkedIn could establish CFAA liability, and accepted a permanent injunction against scraping LinkedIn and an order to destroy its scraped data and code.
  - Lesson: "public data is legal to scrape" is the wrong takeaway. The CFAA risk dropped, but the contract and tort risk is real.
  ([Proskauer](https://www.proskauer.com/blog/hiq-and-linkedin-reach-proposed-settlement-in-landmark-scraping-case), [ZwillGen](https://www.zwillgen.com/alternative-data/hiq-v-linkedin-wrapped-up-web-scraping-lessons-learned/), [Morgan Lewis](https://www.morganlewis.com/blogs/sourcingatmorganlewis/2022/12/linkedin-v-hiq-landmark-data-scraping-suit-provides-guidance-to-data-scrapers-and-web-operators))
- **Facebook v. Power Ventures (9th Cir. 2016).** This one matters most for the "on the user's behalf" idea. Power had its users' permission to access their own Facebook data. Once Facebook sent a cease-and-desist letter and blocked IPs, continuing to access the site violated the CFAA and California Penal Code §502, even though the users still consented. A ToS violation alone was not enough for CFAA liability, but an express revocation was. ([Mintz](https://www.mintz.com/insights-center/viewpoints/2826/2016-07-facebook-v-vachani-user-authorization-can-be-revoked), [Eric Goldman](https://blog.ericgoldman.org/?p=17501))
- **Meta v. Bright Data (N.D. Cal., Judge Chen, Jan 23, 2024).** Meta lost. Read normally, Facebook's and Instagram's terms "only prohibit logged-in scraping, and not logged-off scraping." The court also rejected the clause that tried to keep binding Bright Data after it closed its accounts. Meta then dropped the case and waived appeal. The win turned on Meta's specific wording. DoorDash's and Grubhub's wording ("manually and/or with any robot", "even without logging in") is broader. ([FBM](https://www.fbm.com/technology/publications/major-decision-affects-law-of-scraping-and-online-data-collection-meta-platforms-v-bright-data/), [MediaPost](https://www.mediapost.com/publications/article/392920/judge-sides-against-meta-in-battle-over-scraping-p.html), [Meta drops suit](https://www.mediapost.com/publications/article/393996/None))
- **X Corp v. Bright Data (N.D. Cal., Judge Alsup, May 9, 2024).** X's contract and state-law claims over scraping and reselling public posts were dismissed. The court held them preempted by the Copyright Act, because users, not X, own the posts, and X cannot create a private copyright through its ToS. The court also said X had not shown harm. X was later allowed to amend and to revive claims of **server impairment** from scraping, but not the misappropriation claims. This is a trial-court ruling and the case is still live. For you, the "platform doesn't own the content" theory helps a little, since restaurants own their menus. The server-burden theory stays available to platforms. ([Techdirt](https://www.techdirt.com/2024/05/15/musks-extwitter-fumbles-copyright-law-loses-data-scraping-lawsuit), [FKKS](https://technologylaw.fkks.com/post/102j7s5/blockbuster-ruling-federal-court-holds-that-copyright-act-preempts-xs-web-scrap), [MediaPost: revive](https://www.mediapost.com/publications/article/401510/x-corp-can-revive-scraping-battle-with-bright-dat.html))
- **DoorDash, Uber or Grubhub suing scrapers.** I found no public case where any of the three sued a scraper over menu or listing data. They have sued each other (Uber Eats v. DoorDash, over antitrust) and fought NYC's customer-data-sharing law, winning in Sept 2024. ([Restaurant Dive](https://www.restaurantdive.com/news/uber-eats-lawsuit-against-doordash-impact-first-party-delivery/740759/), [Law360](https://www.law360.com/articles/1882275/doordash-uber-eats-grubhub-win-nyc-diner-data-law-row)) No lawsuits so far does not mean no risk. The realistic first move against a small vendor is IP blocking plus a cease-and-desist letter. After that letter, Power Ventures makes continued access a CFAA and §502 problem.

### Copyright in menus

- **Prices, item names, plain ingredient lists:** these are facts and not copyrightable (*Feist*). A creative selection or arrangement gets thin protection at most. ([Holman casebook ch. 2](https://holmancopyright.lawbooks.cali.org/chapter/chapter-2-requirements-for-copyrightability-under-the-1976-act/))
- **Creative descriptions** ("slow-smoked over applewood, finished with our grandmother's...") and **menu layouts or designs** can be protected. "Three beef tacos" cannot be protected, but a fanciful description of the dish can. ([WNYLRC](https://wnylrc.org/node/386), [Jancis Robinson/FT](https://www.jancisrobinson.com/articles/copyright-on-the-menu))
- **Food photos** are clearly copyrightable, and the owner may be a photographer, DoorDash, or a Yelp user rather than the restaurant (see the DoorDash photo note above).
- **Practical rule:** extract names, prices, categories and modifiers freely. Do not copy marketplace photos into the POS file. Treat long descriptions as content the restaurant should confirm it owns, and if you import them, do it with the restaurant's say-so.

### California-specific issues

- **Penal Code §502** (the California Comprehensive Computer Data Access and Fraud Act) was part of the Power Ventures liability. It is a state CFAA analogue and is often pleaded alongside the CFAA.
- **Trespass to chattels and misappropriation** under California common law are what hiQ ended up liable for.
- **Fair Food Delivery Act (AB 2149, 2020), Bus. & Prof. Code §22598 and following.** This regulates the platforms, not you. They cannot arrange delivery for a restaurant without an agreement. An earlier draft would also have banned posting a restaurant's menu without consent, but that language appears to have been dropped from the final law. ([Legiscan chaptered text](https://legiscan.com/CA/text/AB2149/2019), [NRN](https://www.nrn.com/delivery-takeout-solutions/california-to-stop-controversial-third-party-delivery-tactic-in-2021)) It is useful for pitching: restaurants in California care about controlling their own menu data.
- Platforms' ToS usually pick California or Delaware law and arbitration. Check the forum clause if you ever get a letter.

## 1.3 Technical reality

- All three sites are client-rendered React apps. A plain HTTP GET often returns a shell. One third-party write-up says DoorDash embeds menu JSON in the server-rendered HTML, but that is unverified and can change at any deploy. ([dev.to write-up](https://dev.to/vhub_systems_ed5641f65d59/how-to-scrape-doordash-uber-eats-and-grubhub-menu-data-in-2026-oo))
- All three use commercial bot management. Scraper vendors generally report residential proxies passing Cloudflare and Akamai-class protection around 95-99% of the time, against 20-40% for datacenter IPs ([plisio](https://plisio.net/cybersecurity/residential-proxies)). I could not confirm which vendor each platform uses.
- **What you would have to run:** headless Chromium (Playwright or Puppeteer) with stealth patches, rotating residential proxies, retry logic, and per-platform parsers that break when the front end changes.
- **Cost:** residential proxies run about $1-15 per GB, with a median around $4/GB at small volume in 2025 ([databay](https://databay.com/blog/how-much-do-residential-proxies-cost), [plisio](https://plisio.net/cybersecurity/residential-proxies)). At an assumed (not measured) 3-10 MB per store page with images blocked, plus retries, the per-menu proxy cost is cents. The real costs are:
  - engineering upkeep: parsers break silently
  - browser compute
  - the fact that **beating bot protection is "circumventing a technological measure"**, which Grubhub's ToS bans by name and which strengthens any authorization argument against you
- Managed scraping APIs (ScrapingBee, Apify actors) exist for all three platforms. Using one moves the operations work to the vendor, not the legal risk. Those vendors' own disclaimers put ToS compliance on you.

## 1.4 Compliant alternatives, with risk ratings

| Option | What it takes | Legal/ToS risk | Notes |
|---|---|---|---|
| **A. Merchant uploads a screenshot, saved page, PDF or photo of their own menu** | Nothing from any platform | **Low** | The restaurant obtains its own menu and hands it to you. You never touch the platform. Same vision pipeline as Part 2. Strip or ignore photos. |
| **B. Merchant uploads an export from their current POS** (Square, Clover, Toast) | Merchant clicks Export | **Low** | Best data quality: modifiers, variations and SKUs. See Part 2.3. |
| **C. Fetch the restaurant's own website** (their domain, their menu page or PDF) | One fetch on the owner's request | **Low** | They own the site and asked you to fetch it. If the "website" is actually a hosted ordering page (Toast, Square Online, DoorDash Storefront, ChowNow), it falls under that vendor's terms. DoorDash Storefront pages carry the clause (g) ban quoted above, so treat those like option F. |
| **D. Google Business Profile food menu** | OAuth with `business.manage` scope; `accounts.locations.getFoodMenus` | **Low** | Official API. The restaurant authorizes you. Only works where the location has a menu and `canHaveFoodMenus` is true. Many profiles have no structured menu, only photos. Requires Google API access approval. ([getFoodMenus](https://developers.google.com/my-business/reference/rest/v4/accounts.locations/getFoodMenus), [update guide](https://developers.google.com/my-business/content/update-food-menus)) |
| **E. Marketplace partner APIs** | Partner agreements | **Low risk, high effort, and mostly the wrong direction** | See below. |
| **F. User pastes their own DoorDash, Uber Eats or Grubhub URL; we fetch it once on their behalf** | Our server fetches the page | **Medium** | See the next section. |
| **G. Any URL, anyone, automated scraping at scale** | Headless browsers and proxies | **High** | Plain ToS breach and bot-protection circumvention. hiQ shows the contract and tort exposure. After a cease-and-desist letter, CFAA and §502 exposure too. |

**About the partner APIs (option E).** These APIs exist so a POS or middleware company can **push** a menu to the marketplace and receive orders. They are not built for pulling a menu out.

- **DoorDash Marketplace:** "not yet generally available". You apply through the Developer Portal, complete certification (including demonstrating menu creation and placing a test order), and meet quality thresholds such as an order failure rate below 1%. DoorDash also "automatically attempts to ingest a menu" from the partner during onboarding, which again is the push direction. ([general requirements](https://developer.doordash.com/en-US/docs/marketplace/overview/getting_started/general_integration_requirements), [SSIO](https://developer.doordash.com/docs/marketplace/overview/onboarding/ssio))
- **Uber Eats Marketplace APIs:** they do include `GET /eats/stores/{store_id}/menu` with the `eats.store` scope. Production access needs an NDA, an API license agreement, partner-manager approval and scope whitelisting. Sandbox access is self-serve. ([menu integration](https://developer.uber.com/docs/eats/guides/menu-integration), [getting started](https://developer.uber.com/docs/eats/guides/getting-started), [going live](https://developer.uber.com/docs/eats/guides/going-live))
- **Grubhub:** partner onboarding with a kickoff call, preproduction credentials, and menu ingest via the Menu API. Again, POS to Grubhub. ([Grubhub developer milestones](https://grubhub-developers.zendesk.com/hc/en-us/articles/10855385187092-Development-and-Milestones))

Realistically, none of these is a v1 path for a small menu-import tool. Uber's menu GET is the only clean "read" route, and it is gated behind partnership.

### Is "a user pastes a URL to a page they own and we fetch it once" meaningfully different?

It is somewhat better than bulk scraping, but it does not make the problem go away.

- **Better:**
  - The content is the restaurant's own menu, so copyright is mostly a non-issue for names and prices, and the X v. Bright Data reasoning (the platform doesn't own the content) helps you.
  - Volume is tiny, one page per signup, so the X Corp server-burden theory is weak.
  - There is no account login, so this is not Power Ventures credential use.
  - The practical chance of anyone noticing or caring is low.
- **Not different:**
  - The restaurant does **not** own the DoorDash, Uber Eats or Grubhub *page*. The platform owns the site, and the ToS binds whoever visits, which here is *your server*.
  - The DoorDash and Grubhub clauses cover any automated or logged-out access.
  - The restaurant cannot grant you rights to the platform's site that it doesn't have. Power Ventures says user consent does not override the site owner's revocation.
  - If the fetch needs a headless browser and residential proxies to get through, you are circumventing a technical measure, which Grubhub bans by name.
- **Risk-reduction moves if you do build it later:**
  - plain fetch only, no proxy rotation or stealth
  - an honest User-Agent
  - respect robots.txt
  - one fetch per user action, no caching or crawling of other stores
  - extract only names, prices, categories and modifiers; never photos
  - have the user confirm they are the owner or authorized
  - stop immediately and permanently for a platform if you receive a cease-and-desist letter
  - put "paste your link" behind a fallback: "Couldn't read it? Upload a screenshot."

  Even with all of that, the rating stays **Medium**, because the plain ToS text forbids it.

## 1.5 What to ship first

1. **Ship file upload as the main path:** photo, screenshot, PDF, XLSX or CSV, and POS export. It is low risk, works for every restaurant, and uses one pipeline (Part 2).
2. **Ship "Paste your website menu URL"** for the restaurant's own domain only. Fetch it once server-side. If the page is HTML, send the text (and a rendered screenshot if needed) to Claude. If it links to a PDF, use the PDF path. Block known marketplace and hosted-ordering domains and show "Take a screenshot of your DoorDash/Uber Eats/Grubhub menu and upload it instead." This gives you 80% of the "link" experience at low risk.
3. **Later, if there is demand:** a Google Business Profile import (OAuth), and possibly an Uber Eats partner application if you become a real integration partner.
4. **Don't ship marketplace URL fetching** without a lawyer's sign-off. If it ships, follow the restrictions above.

---

# Part 2: File ingestion

## 2.1 Menus from photos and PDFs with Claude vision

Fetched directly from [platform.claude.com/docs/en/build-with-claude/vision](https://platform.claude.com/docs/en/build-with-claude/vision) and [.../pdf-support](https://platform.claude.com/docs/en/build-with-claude/pdf-support) on 2026-11-08.

**Correction to the brief:** the "~1568 px long edge" and "tokens ≈ width×height/750" figures are out of date. The current docs say:

- "Each patch is a 28×28-pixel block of the image... An image, therefore, costs `⌈width / 28⌉ × ⌈height / 28⌉` visual tokens." (This is close to w×h/784, so the old /750 rule of thumb is roughly right.)
- Two resolution tiers:

| Tier | Models | Max long edge | Max visual tokens |
|---|---|---|---|
| High-resolution | Claude 4.7 and later | 2,576 px | 4,784 |
| Standard | All other models | 1,568 px | 1,568 |

  "High-resolution support is automatic on the listed models." Larger images are downscaled, keeping their aspect ratio.
- Examples from the docs: a 1920×1080 image costs 1,560 tokens on the standard tier (downsized to 1456×819) and 2,691 on high-res (not resized). A 3840×2160 image costs 4,784 tokens on high-res (downsized to 2576×1449).
- **Limits:**
  - max 8000×8000 px per image
  - **more than 20 images in one request triggers a stricter per-image limit; keep each image at 3,000 px or less**
  - 10 MB per image (base64) on the Claude API, 5 MB on Bedrock
  - 100 images per request on 200k-context models, 600 on others
  - 128 MB total request size
  - JPEG, PNG, GIF and WebP only (convert HEIC from iPhones)
- **Cost per menu photo, my arithmetic:** a 12 MP phone photo on the high-res tier gets capped at about 4,784 input tokens. At the docs' quoted Opus 5.5 price of $4/M input, that is about $0.02 of input per photo. On Haiku 4.5 at the standard tier (≤1,568 tokens, $1/M), about $0.0016. Output tokens for a JSON menu (often 3-10k tokens for a large menu) will usually cost more than the image. Check current output prices at [claude.com/pricing](https://claude.com/pricing).
- **Limitations the docs state:** "Claude might hallucinate or make mistakes when interpreting low-quality, rotated, or very small images under 200 pixels." Also: "Do not use Claude for tasks requiring perfect precision... without human oversight." For you, that means a review screen before export is mandatory, not optional.
- **Image tips from the docs:** keep text legible. Downscaling can make small text unreadable, so consider cropping or tiling. Avoid heavy JPEG compression.

**PDFs:**

- Max 600 pages per request (100 when the context window is under 1M tokens). 128 MB request. No password-protected or encrypted PDFs.
- How it works: "The system converts each page of the document into an image. The text from each page is extracted and provided alongside each page's image." So each page costs text tokens plus image tokens: "Each page typically uses 1,500–3,000 tokens" of text, plus the image cost above.
- Best practices from the docs: put the PDF before your text in the request, rotate pages upright, split large PDFs, and use prompt caching for repeated analysis.
- `.xlsx` and `.docx` **are not supported in document blocks**. Parse them yourself (see 2.2). CSV, TXT and MD can go in as `text/plain`.

**Multi-page menus:** for a typical 1-8 page menu, send all pages or images in one request so Claude sees section headers that span pages, and keep it to 20 images or fewer to avoid the stricter size limit. For large catering PDFs, chunk by page range, carry the last known category forward, then merge and de-duplicate in code.

**Getting JSON out reliably:** use **structured outputs**, `output_config.format` with `type: "json_schema"`. Per the docs it guarantees "schema-compliant responses through constrained decoding". In Node, use `zodOutputFormat()` with `client.messages.parse()`. The alternative is strict tool use (`strict: true`). Some JSON Schema constraints (minimum, maxLength and so on) are not enforced by the API; the SDK moves them into descriptions and validates client-side. ([structured outputs docs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs))

Suggested schema:
- `categories[]`, each with `items[]`
- each item: `name`, `description`, `price` (as a string, plus a parsed number), `variations[]` (size/price), `modifier_groups[]`, `notes`
- a `confidence`/`uncertain_fields` flag per item, which drives the review screen

### LLM vs. traditional OCR accuracy

No public benchmark covers restaurant menus. The nearest evidence, all vendor or aggregator sources:

- **Invoices:**
  - BusinessWare: GPT-4o with image input 90.5%; GPT-4o with an OCR layer 98%; Google Document AI 82%. A 2026 refresh put Claude Sonnet 4.5 at 90.27% and Document AI at 79.76%. ([BusinessWare](https://www.businesswaretech.com/blog/research-best-ai-services-for-automatic-invoice-processing), [IDP benchmark](https://www.businesswaretech.com/intelligent-document-processing-benchmark))
  - Koncile: Claude, GPT and Gemini within a few points of each other. ([Koncile](https://www.koncile.ai/en/ressources/claude-gpt-or-gemini-which-is-the-best-llm-for-invoice-extraction))
- **Tables:** one test had Textract at 82.1% table accuracy against 38.5% for GPT-4o on engineering drawings. On OmniDocBench (CVPR 2025), specialized table models score about 82 TEDS against about 71-74 for general VLMs. ([OmniDocBench](https://arxiv.org/pdf/2412.07626), [Codesota](https://www.codesota.com/benchmark/omnidocbench))
- **OmniAI (Feb 2025):** traditional OCR does better on dense pages; VLMs do better on messy, photographed or varied layouts. ([getomni.ai](https://getomni.ai/ocr-benchmark))

Menus are mostly the messy, varied-layout case: decorative fonts, prices aligned right with dot leaders, multi-column. They are also a *semantic* problem, such as working out which line is a modifier and which price belongs to which size. Plain OCR (Textract, Document AI) returns text and boxes, so you would still need an LLM to structure it.

**Recommendation:** go Claude-vision-first. Build a 30-50 menu test set (photos, PDFs, screenshots) and score item-name and price accuracy. Only add an OCR pre-pass (the "OCR + LLM" hybrid that scored best on invoices) if price errors show up on dense menus. Use the text layer of digital PDFs; the PDF feature already does this.

## 2.2 Excel/CSV parsing in Node

Read directly from registry.npmjs.org, 2026-11-08:

| Package | npm `latest` | Published | License | Notes |
|---|---|---|---|---|
| `xlsx` (SheetJS CE) | **0.18.5** | 2022-03-24 | Apache-2.0 | **Stale on npm.** SheetJS stopped publishing to npm. 0.18.5 is affected by **CVE-2023-30533** (prototype pollution on reading a crafted file; fixed in 0.19.3) and **CVE-2024-22363** (ReDoS; fixed after 0.20.2). Current CE is **0.20.3**, installed from SheetJS's CDN: `npm i --save https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz`. Because you parse untrusted uploads, **never use npm's 0.18.5**. ([issue #2961](https://git.sheetjs.com/sheetjs/sheetjs/issues/2961), [GitLab advisory](https://advisories.gitlab.com/npm/xlsx/CVE-2023-30533/), [Aikido](https://intel.aikido.dev/packages/npm/xlsx)) Widest format support: xls, xlsx, xlsb, ods, csv. |
| `exceljs` | 4.4.0 | 2023-10-19 | MIT | Reads and writes xlsx (not legacy .xls). Streaming reader. Slow release cadence (last publish 2023). Good for *writing* styled XLSX import files for the target POS. |
| `papaparse` | 5.7.0 | 2026-08-24 | MIT | The standard CSV parser. Handles quoted commas, BOMs, streaming, header mode. |
| `read-excel-file` | 9.3.14 | 2026-10-29 | MIT | Actively maintained, xlsx only, simple. A lightweight reader option. |

**Suggested setup:**
- **papaparse** for CSV
- **SheetJS 0.20.3 from the CDN tarball** (pinned, vendored, or via a lockfile with integrity) for reading xlsx and xls
- **exceljs** if you need to write formatted XLSX

Also:
- Run parsing in a worker with size and time limits.
- Cap rows and cells.
- Strip leading UTF-8 BOMs. The real Square export below starts with one.

## 2.3 What restaurants bring from their previous POS

A sibling research file in this scratchpad, `/tmp/claude-0/-home-user/d7442481-85cc-5385-ba1d-07d3d793714c/scratchpad/dl/sq_research.md`, has column-level detail. The short version:

- **Square item library** (CSV or XLSX, from Items → Actions → Export library):
  - one row per **variation**; rows for one item share `Item Name`
  - real header, from a public sample file: `Reference Handle, Token, Item Name, Variation Name, Unit and Precision, SKU, Description, Categories, Reporting Category, SEO Title, ..., Item Type, ..., Price, Online Sale Price, Archived, ..., Option Name 1, Option Value 1, Default Unit Cost, ...`
  - then per-location columns such as `Enabled <Location>`, `Current Quantity <Location>`, `Price <Location>`, plus `Modifier Set - <name>` and `Tax - <name> (rate%)` Y/N columns
  - no image column
  - descriptions may contain HTML
  - ([Square import troubleshooting](https://squareup.com/help/ca/en/article/6172-import-item-library-troubleshooting))
- **Clover inventory export** (XLSX from Items → Item List → Export):
  - a workbook with tabs **Items, Modifier Groups, Categories, Tax Rates**; some tabs can be empty
  - includes a `Clover ID` column
  - per a user report, the Categories tab may list item names rather than the Items tab carrying a category column, so you may need to join tabs
  - import files must be .xls or .xlsx, 5 MB or less
  - ([Clover docs](https://docs.clover.com/docs/importing-inventory), [Vori guide](https://help.vori.com/export-your-product-file-from-your-legacy-system/export-your-product-file-from-clover), [Clover uservoice](https://clover.uservoice.com/forums/946357-management-functions/suggestions/45980059-clover-inventory-export-inventory-ap-filters))
- **Toast:**
  - **Menu manager export**, `menu_export_[date].csv`: item and modifier rows in one file, told apart by an `Entity type` column
  - **Items database export**: per-entity CSVs from the Items database page
  - **AllItemsReport.csv**: the analytics/data-export version
  - Toast uses GUIDs heavily
  - ([Toast menu manager export](https://doc.toasttab.com/doc/platformguide/platformMenuManagerExport.html), [Items database export](https://doc.toasttab.com/doc/platformguide/platformItemsDatabaseExport.html), [Data export field reference](https://doc.toasttab.com/doc/platformguide/adminDataExportFieldReference.html))
- **DoorDash, Uber Eats, Grubhub:** I found no official full-menu export for restaurant menus in the DoorDash Merchant Portal. Retail stores can download an inventory file, and financial reports export as CSV. ([DoorDash inventory manager](https://help.doordash.com/en-ca/merchants/article/merchant-portal-inventory-manager)) I found nothing on an Uber Eats Manager export. This is another reason the "screenshot your marketplace menu" upload matters.

**Design implication:** detect the source by header fingerprint (Square: `Token` plus `Item Name` plus `Variation Name`; Clover: an `Items` sheet plus `Clover ID`; Toast: `Entity type` or GUID columns). Map known formats with deterministic code, which is cheap and exact. Fall back to Claude for unknown spreadsheets: send the header plus a sample of rows and ask for a column mapping under a schema, then apply that mapping in code to every row. Don't pass thousands of rows through the model.

---

## Open items to verify by hand
1. The live US DoorDash consumer terms scraping clause (help.doordash.com, "Consumer Terms and Conditions - US - English").
2. The live US Uber Terms of Use, at uber.com/legal/terms/us, for the "programs or scripts... scraping" clause.
3. The current Grubhub Terms of Use wording (the search copy was about 2 years old).
4. All three robots.txt files.
5. Toast and Clover column headers, using one real export from each.
