# Messaging

Lead every message with the ISO/agent's problem. The product is the proof, not the headline.

## The core story (30 seconds)

Every restaurant you board needs a menu built in the POS before it can run a card. Today that's hours of someone typing (yours, your install team's or the merchant's), or $150 an hour at Toast, or days in a programming queue. The deal is signed but the merchant isn't processing.

Fast POS Menu takes the menu the restaurant already has (phone photos, a PDF, a spreadsheet or the old POS's export) and builds categories, items, sizes and modifier groups with min/max. You fix anything flagged on your phone, then download an import file for Square, Clover or Toast. Minutes, not days. $49 a menu.

---

## Messaging pillars

### 1. Speed to first transaction
**Claim:** The menu stops being the reason a go-live slips.
**Say:** "Minutes, not days." "Menu built before you leave the parking lot." "Merchants processing sooner."
**Proof:** 13-item test menu read in ~20 seconds from a photo and from a PDF. A full menu is a few minutes including review. Compare: SkyTab partners cite 2–7 days for programming; Square's own import says "under 24 hours."

### 2. Hours back for the people doing boarding
**Claim:** Your install team and agents stop typing menus.
**Say:** "Skip the menu build." "Your team fixes and finishes; it doesn't type." "Quote the install, not the hours."
**Proof:** Hand builds run roughly 4–20 hours per menu (owner and installer reports; no rigorous benchmark). At Toast's $150/hr that's $600–3,000. We're $49.

### 3. Any input, any (supported) POS
**Claim:** One tool for every restaurant you board, whatever they have and whatever you're installing.
**Say:** "Photos, PDF, spreadsheet or old-POS export in. Square, Clover or Toast file out." "Switching POS? The menu comes with you."
**Proof:** Three POS formats live today (beta). Built-in importers at Square, Lightspeed and Aldelo only import into their own POS.

### 4. You stay in control
**Claim:** Nothing goes into the POS that you didn't see.
**Say:** "Review and fix on your phone." "Unsure items are flagged." "Pay only when you download."
**Proof:** Mandatory review screen with low-confidence flags; build and review before paying.
**Feature to mention:** *Adjust prices*. Raise or lower the whole menu or one category by % or $, optionally including modifiers, rounded to $0.05 / $0.25 / $1 / .99, with a preview and undo. Pitch it as "new POS, new prices, one tap" for switch deals. Code does the math, not AI; say so if asked.

### 5. Built by payments people, for payments people
**Claim:** We understand boarding, not just menus.
**Say:** "Built for the people who board restaurants." "From an AI lab for the payments industry."
**Proof:** Code 85 Labs is a payments-focused AI lab; ISO-first pricing (Pro for agents boarding every month).
**Careful:** never reference Billy's employer or its merchants as proof.

---

## Proof points (approved, with source)

| Proof | Wording to use | Source |
|---|---|---|
| Read accuracy on test menu | "In testing, a 13-item sample menu read 13/13 items, 13/13 prices and 3/3 modifier groups from a phone photo and from a PDF, in about 20 seconds." | `docs/research.md` §5, measured 2026-11-09 |
| Price | "$49 per menu. Pay when you download." | `src/lib/billing/plans.ts` |
| Pro | "Pro: $149/mo for 10 builds (about $15 a menu). Coming soon." | plans.ts (`available: false`) |
| Toast build cost | "Toast lists menu expert hours at about $150/hr." | appendix D (vendor support page via search excerpt) |
| Square's import | "Square's free menu upload only builds Square menus and says most builds take under 24 hours." | appendix D |
| Hand-build time | "Hand menu builds commonly take 4 to 20 hours." Attribute as "operators report", not as a study. | appendix D |
| Fiverr | "Freelance menu entry runs about $50–300 for a full menu with modifiers." | appendix D (inference from gig prices) |

**Always pair the accuracy proof with "sample menu" or "in testing."** Real phone photos of real menus will be harder. Never claim a % accuracy on real-world menus until we've run the 30-menu test set.

## Claims we don't make

- "Official", "certified", "approved by", "partner of" Square/Clover/Toast.
- "Verified import formats" or "guaranteed to import." (Formats are beta.)
- "100% accurate", "no errors", "no review needed".
- "Works with every POS." (Three today. Next: SkyTab, Heartland, SpotOn. Say "next", not dates.)
- "Import from DoorDash/Uber Eats/Grubhub links."
- "Pushes directly into Square/Clover/Toast." (No live API push yet.)
- Any customer count, testimonial or logo until we have real, permissioned ones.

---

## Objection handling

| Objection | Answer |
|---|---|
| "Square already does this for free." | It does, for Square only, and it takes up to a day. If you board on Clover or Toast, or you're moving a merchant *off* Square, it doesn't help. We do all three in minutes. |
| "Our onboarding team already builds menus." | Keep them. They'll start from a finished draft in the right format and just check it. Same people, more installs per week. |
| "What if the AI gets it wrong?" | You review every item before you pay. Anything it's unsure of is flagged. You fix it on your phone in seconds. You only pay when the file is right. |
| "$49 is too much for a menu." | It's less than one hour of your time, and less than one hour of Toast's menu builders. If you board every month, Pro brings it to about $15 a menu. |
| "$49 is too cheap to be real." | The heavy lifting is automated, so it costs us very little to run. We price per menu so you can try it on one deal. |
| "Will the file import into my POS?" | It's formatted for that POS's import (Clover's spreadsheet, Square's item library, Toast's bulk sheet and menu-build workbook). Formats are in beta, so check the import preview. If something doesn't import, tell us and we'll fix it. |
| "Our merchants' data?" | It's their menu, not cardholder data. Checkout is Stripe-hosted, so no card data ever touches the product. Uploaded files are read by our AI provider and not stored; the draft lives in the user's browser. Uploads are only used to build that menu. Link /privacy. Never quote a retention period for the AI provider. |
| "Can it pull from their DoorDash page?" | No. Those sites don't allow it. Screenshot the page and upload the screenshots; it reads them the same way. |
| "We sell SkyTab / Heartland / SpotOn." | Those are next. Join the list and we'll tell you when your POS is live. Meanwhile, a structured spreadsheet out of us is a much faster start for their programming team. |
| "Can it handle a 300-item menu with nested modifiers?" | Upload every page together so it can see modifiers printed elsewhere. Large menus take longer and need more review. Send us your toughest one and we'll show you. |

---

## Message by persona (cheat sheet)

| Persona | Pain | Promise | CTA |
|---|---|---|---|
| ISO owner | Unbillable install hours, slipped go-lives | Menu builds in minutes; merchants processing sooner | "Try it on your next board" / "Book 15 min with the founder" |
| Sales agent | Nights typing menus; deals stalling | Build the menu at the table | "Build a menu" |
| Reseller/installer | Menu labor is the margin killer; every POS different | A clean draft in the right format; quote flat | "Build a menu" / "Get Pro when it ships" |
| Restaurant owner | Dread of retyping on a POS switch | Photo in, import file out | "Build your menu" |
