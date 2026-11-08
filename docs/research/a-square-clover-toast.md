# POS menu import research: Square, Clover, Toast

Researched 2026-11-08 for Fast POS Menu exporters.

## Evidence limits (read first)

This sandbox could not open any vendor host. squareup.com, developer.squareup.com, docs.clover.com, clover.com, doc.toasttab.com, support.toasttab.com and web.archive.org all failed DNS under the session's network policy. The only reachable host was GitHub. So the evidence comes from three places:

- **[S] Search summaries** of the official pages (WebSearch). The URLs are cited, but I did not read the full pages.
- **[F] Real vendor files** that third parties committed to public GitHub repos: Square catalog exports named `<merchantId>_catalog-YYYY-MM-DD-HHMM.csv`, and a parsed Clover "inventory-export-v2" workbook. These are the strongest evidence for header strings.
- **[SPEC] Vendor-published machine specs on GitHub.** These are Square's OpenAPI spec (`square/connect-api-specification/api.json`), Clover's Android SDK model classes (`clover/clover-android-sdk`), and copies of Toast's Menus API OpenAPI yaml. They are authoritative for the API.

Third-party write-ups are marked **[3P]** and are used only as leads.

To read the official pages, allow these hosts in the session network settings: squareup.com, developer.squareup.com, docs.clover.com, www.clover.com, doc.toasttab.com, support.toasttab.com.

---

## 1. Square

### 1.1 How menus get in
| Route | Status |
|---|---|
| Dashboard bulk import (XLSX or CSV) | **Self-serve.** Items > Item library > Actions > Import / Export Library. You can download a blank template or export the existing library. [S] https://squareup.com/help/us/en/article/5153-import-items-online , glossary https://squareup.com/help/us/en/article/8211-item-import-spreadsheet-glossary , troubleshooting https://squareup.com/help/us/en/article/6172-import-item-library-troubleshooting |
| Public API | **Yes, open to any developer.** Catalog API `POST /v2/catalog/batch-upsert` with OAuth scope `ITEMS_WRITE` (plus `ITEMS_READ` to read). [SPEC] https://developer.squareup.com/docs/products/catalog/overview , https://developer.squareup.com/docs/oauth-api/square-permissions |
| Partner-only | No. An App Marketplace listing needs Square review, but plain OAuth to any seller does not (from my own knowledge; I could not open the page, so medium confidence). |

### 1.2 Import spreadsheet columns

These are the exact header strings from real exports [F]. The set and order vary by account (locations, features, template version), and **Square says not to reorder, rename or delete columns** [S]. The safest approach is to export a template from the target account and fill it in. For a generic file, use the newest layout below.

**Newest layout, with Reference Handle** (koyeary/nextonthemenu `public/square.csv`, 3 locations). Fixed columns in order:

| # | Header | Meaning / format |
|---|---|---|
| 1 | `Reference Handle` | Per-item handle that links rows. The sample value looks like a slug, e.g. `#12-large-cookies-tray-to-go-`. Leave blank for new items [3P community]. |
| 2 | `Token` | Square's object ID for the **variation**. Blank = create new; keep it unchanged = update. Must be blank when moving items to a new account [S]. |
| 3 | `Item Name` | Required. Rows with the same Item Name become one item with several variations. |
| 4 | `Variation Name` | Required, e.g. `Regular`, `Small`, `Large`. |
| 5 | `Unit and Precision` | Unit of measure. Units can't be set by import [3P]. |
| 6 | `SKU` | Required column; the value may be blank. |
| 7 | `Description` | Required column. Rich-text descriptions export as HTML [S glossary via 3P]. |
| 8 | `Categories` | Comma-separated. `>` marks a subcategory. Backslash escapes a literal `,` or `>` [S glossary via 3P]. When names are duplicated, the export appends ` (TOKEN)`. |
| 9 | `Reporting Category` | Single category. |
| 10 | `SEO Title` | |
| 11 | `SEO Description` | |
| 12 | `Permalink` | |
| 13 | `GTIN` | |
| 14 | `Square Online Item Visibility` | Seen values: `visible`, `hidden`, `unavailable`. |
| 15 | `Item Type` | `Standard` (or blank), `Prepared food and beverage`, `Physical good`, `Event`, `Digital`, `Other`, `Bundle`, `Service`, `Donation` [S glossary via 3P]. |
| 16 | `Weight (lb)` | Some accounts write `Weight (kg)` instead. |
| 17 | `Social Media Link Title` | |
| 18 | `Social Media Link Description` | |
| 19 | `Shipping Enabled` | Y/N |
| 20 | `Self-serve Ordering Enabled` | Y/N |
| 21 | `Delivery Enabled` | Y/N |
| 22 | `Pickup Enabled` | Y/N |
| 23 | `Price` | **Dollars as a decimal, no currency symbol** (e.g. `6.00`, `20.95`). Blank or `Variable` = variable price [S]. Must be 0 or more. |
| 24 | `Online Sale Price` | Not documented; blank in every sample. |
| 25 | `Archived` | Y/N |
| 26 | `Sellable` | Y/N/blank |
| 27 | `Contains Alcohol` | Y/N |
| 28 | `Stockable` | Y/N/blank |
| 29 | `Auto Add Item to Check` | Y/N. Some accounts write `Skip Detail Screen in POS` here instead. |
| 30 | `Option Name 1` | Item option (e.g. `Size`). `Option Name 2`/`Option Value 2` appear when options are used (seen in nextonthemenu `catalog.csv`). |
| 31 | `Option Value 1` | e.g. `Large` |
| 32 | `Default Unit Cost` | |
| 33 | `Default Vendor Name` | |
| 34 | `Default Vendor Code` | |

Then come per-location blocks, repeated for each location in this order: `Enabled <Location>`, `Current Quantity <Location>`, `New Quantity <Location>`, `Stock Alert Enabled <Location>`, `Stock Alert Count <Location>`, `Price <Location>`.
- `Enabled <Location>` is required when there is more than one location [S].
- Single-location exports often omit `Enabled` and `Price <Location>`.
- `Current Quantity` is informational only; `New Quantity` sets stock [3P citing Square help].

After the location blocks:
- `Modifier Set - <Set Name>`: one column per modifier set in the account, value `Y`/`N`. Blank = off [S]. When two sets share a name, the ID is appended: `Modifier Set - Flavor - INST7PSUNRASXDKNC5NF7UUI` [F].
- `Tax - <Tax Name> (<rate>%)`, e.g. `Tax - Sales Tax (6%)` or `"Tax - New York, New York (11201) (8.875%)"`, value `Y`/`N` [F]. Keep the header exactly as the account writes it, or the item is imported untaxed [3P].

**Older layout, no Reference Handle or Unit and Precision** (gokhankelebek/istanbul, April 2025, real restaurant):
`Token,Item Name,Variation Name,SKU,Description,Categories,Reporting Category,SEO Title,SEO Description,Permalink,GTIN,Square Online Item Visibility,Item Type,Weight (lb),Social Media Link Title,Social Media Link Description,Shipping Enabled,Self-serve Ordering Enabled,Delivery Enabled,Pickup Enabled,Price,Online Sale Price,Archived,Sellable,Contains Alcohol,Stockable,Auto Add Item to Check,Option Name 1,Option Value 1,` then location blocks, then `Modifier Set - …`.

**Variant seen in July 2026** (DeavenKaiser export): `Customer-facing Name` after `Item Name`, and `Preselect First Variation` after `Auto Add Item to Check`. Another variant (quirkey) uses `Reporting Category` + `Additional Categories` instead of `Categories`.

### 1.3 How menu concepts are represented (spreadsheet)
- **Sizes/variations:** one row per variation, sharing `Item Name`. Item-level fields (Description, Categories) must match across the rows. Up to 250 variations per item [SPEC CatalogItemVariation].
- **Modifier groups:** the spreadsheet only links existing sets to items (Y/N column). **It cannot create a set, its options, prices or min/max rules** [S + community]. Square help has a *beta* note that nested modifier sets "can be imported via bulk import", but nesting must be configured in the Dashboard [S]. I could not confirm a modifier-set import sheet format. **Needs a real account check.**
- **Min/max:** not in the spreadsheet. API only.
- **Price levels:** only per-location prices (`Price <Location>`). No happy-hour or price-level concept in the import.
- **Taxes:** `Tax - Name (rate%)` Y/N columns. The taxes must already exist in the account [S troubleshooting].
- **SKU:** `SKU` belongs to the variation. Format the column as text so leading zeros survive.
- **Images:** no image column.

### 1.4 API push (Square Catalog API) [SPEC: square/connect-api-specification api.json]
- `POST /v2/catalog/batch-upsert` with `{idempotency_key (<=128), batches:[{objects:[...]}]}`.
  - Up to **10,000 objects per request** and **1,000 per batch**. Each batch is all-or-nothing.
  - **Full-replacement semantics:** a missing field is cleared, and leaving out inline variations deletes them.
  - Only one write at a time per seller; concurrent writes get **429**.
- New objects use temporary IDs that start with `#`, and other objects in the same request can reference them.
- `ITEM` (`item_data`):
  - `name` (max 512), `description_html` (max 65535; plain `description` is deprecated)
  - `categories:[{id, ordinal}]` (`category_id` is deprecated), `reporting_category`, `tax_ids[]`
  - `modifier_list_info[]`: `modifier_list_id`, `min_selected_modifiers`, `max_selected_modifiers`, `enabled`, `ordinal`, `modifier_overrides`, `allow_quantities`
  - `variations[]` (at least 1), `product_type`, `skip_modifier_screen`, `item_options` (max 6), `abbreviation` (max 24)
- `ITEM_VARIATION`: `item_id`, `name` (max 255), `sku`, `upc`, `pricing_type` FIXED_PRICING/VARIABLE_PRICING, `price_money{amount, currency}` (**amount in cents**), `location_overrides`, `track_inventory`, `item_option_values`.
- `MODIFIER_LIST`: `name` (max 255), `modifiers[]` (inline MODIFIER objects), `min_selected_modifiers`/`max_selected_modifiers` (-1 = unset, 0 = no limit), `modifier_type` LIST/TEXT, `allow_quantities`. `selection_type` SINGLE/MULTIPLE is deprecated.
- `MODIFIER`: `name` (max 255), `price_money` (cents), `on_by_default`, `ordinal`.
- `CATEGORY`: `name` (max 255), `parent_category`, `category_type`.
- `TAX`: `name`, `percentage` as a **string** (`"7.5"`), `calculation_phase`, `inclusion_type` ADDITIVE/INCLUSIVE.
- `present_at_all_locations` / `present_at_location_ids` on every object.

### 1.5 Gotchas
- Variations are rows, and grouping is by Item Name. Two different products with the same name get merged.
- `Token` is per variation. Never invent one; leave it blank for new items.
- Prices in the sheet are dollars; in the API they are cents.
- Accepted files: `.xlsx` or `.csv` only (`.xls` and `.xlsm` are rejected) [S]. Remove commas in CSV text or quote properly [S].
- A partial import still succeeds for the good rows, and Square provides an error report to download [S].
- [3P, unverified] The import asks Modify vs Replace library, and there is an "Undo" action after import.
- I found no documented row limit.

**Confidence / needs verification: Square spreadsheet.**
- HIGH: core header strings and `Modifier Set - ` / `Tax - ` / location-column patterns (several real exports agree).
- MEDIUM: exact column order and presence, which varies by account and template version.
- LOW: modifier-set creation by import (beta), `Online Sale Price`, row limits, Modify/Replace.
- Before shipping, export a blank template from a fresh US Square for Restaurants account.

**Confidence: Square API.** HIGH (vendor OpenAPI spec).

---

## 2. Clover

### 2.1 How menus get in
| Route | Status |
|---|---|
| Dashboard bulk import (Excel workbook) | **Self-serve.** Inventory > Items > Import/Export. File must be **.xls or .xlsx, max 5 MB** [S]. https://docs.clover.com/dev/docs/importing-inventory , https://www.clover.com/en-US/help/work-with-item-details-in-a-spreadsheet |
| Public REST API | **Yes**, v3 inventory endpoints. Production use needs an app in the Clover developer dashboard with the **Write inventory** permission, OAuth, and **Clover approval before App Market publishing**. You must justify each permission requested. Sandbox allows merchant API tokens; production requires OAuth [S]. https://docs.clover.com/dev/docs/gdp-set-app-permissions , https://docs.clover.com/dev/docs/app-approval-and-app-market-faqs |

### 2.2 Import workbook: sheets and columns

Source [F]: a real Clover export workbook, parsed to JSON in wild-bean-web/WildeBeanCoffee `inventory-export-v2-parsed.json` (a cafe). Its glossary sheet reads **"Template Version v2.0.0"**. One cross-check: Clover help says the Items sheet's "column P" links modifier groups [S], and in v2.0.0 column P is exactly `Modifier Groups`.

**Sheet order:** `Instructions & Glossary`, `Items`, `Modifier Groups`, `Categories`, `Tax Rates`. Clover help also lists these 5 tabs [S].

**Sheet `Items`** (column letters inferred from order):

| Col | Header (exact) | Format / notes |
|---|---|---|
| A | `Clover ID` | Glossary: "Leave blank" for new items. Existing ID = update; a changed ID causes an error [S]. |
| B | `Name` | Item name |
| C | `Alternate Name` | Alternate or kitchen-language name |
| D | `Description` | |
| E | `Price` | **Dollars.** The export shows `$9.99`; the parse may have kept the currency cell format. Blank = variable price. |
| F | `Price Type` | `Fixed` / `Variable` / `Per Unit` |
| G | `Price Unit` | Required when Per Unit (e.g. `lb`) |
| H | `Cost` | |
| I | `Product Code` | UPC |
| J | `SKU` | |
| K | `Quantity` | Stock count |
| L | `Hidden?` | `Yes`/`No` |
| M | `Default tax rates?` | `Yes`/`No` |
| N | `Non-revenue item?` | `Yes`/`No` |
| O | `Printer Labels` | Kitchen routing labels (Clover "tags/labels") |
| P | `Modifier Groups` | **Name** of a group on the Modifier Groups sheet |
| Q | `Categories` | **Name** of a category |
| R | `Tax Rates` | **Name** of a tax rate. Used when Default tax rates? = No. |
| S | `Variant Attribute` | e.g. Size |
| T | `Variant Option` | e.g. Large |
| U | `Variant Attribute` | The header repeats. The parser renamed it `_1`, so the real header is probably identical (unverified). |
| V | `Variant Option` | Same as U. |

**Multi-value fields use continuation rows.** An item with several modifier groups or categories puts the first in its own row. Each additional group or category goes in the following rows, which have every other cell blank [F]. Example: `Signature Bowl` lists 4 modifier groups, one per row.

**Sheet `Modifier Groups`:**

| Header | Notes |
|---|---|
| `Modifier Group ID` | Blank for new groups |
| `Modifier Group Name` | Only on the group's first row |
| `Pop up Automatically?` | `Yes`/`No`, first row only. Glossary: enter yes for required modifiers. |
| `Modifier` | One modifier per row. Following rows leave the group columns blank. |
| `Price` | Dollars (`$0.50`) |
| `Required Quantity` | Min selections (first row of the group) |
| `Max Quantity` | Max selections (first row of the group) |

**Sheet `Categories`:** `Category ID`, `Category Name`, `Subcategory Name`, `Item Sort Order`. Item names are listed **down the rows under each category**, in POS display order. Subcategories go directly under their parent.

**Sheet `Tax Rates`:** `Tax Rate ID`, `Name`, `Tax Rate` (percent), `Tax Amount` (flat $), `Default?` (`Yes`/`No`).

**Older template (v1), seen in third-party generators [3P]:**
- Items sheet: `Clover ID, Name, Alternate Name, Price, Price Type, Price Unit, Tax Rates, Cost, Product Code, SKU, Modifier Groups, Quantity, Printer Labels (or Labels), Hidden, Non-revenue item`. Tax Rates takes `DEFAULT`.
- Modifier Groups sheet: `Modifier Group Name, Pop-up Automatically, Modifier, Price`.
- Categories sheet is transposed: A1 `Category Name`, one column per category, item names below.
- Tax Rates sheet: `Name, Tax Rate, Default`.
- Treat v1 as legacy and target v2.0.0.

### 2.3 How menu concepts are represented
- **Modifier groups:** defined on the Modifier Groups sheet and linked by **name** in the Items `Modifier Groups` column. The import **can create** groups [S: "add a new modifier group on the Modifier Groups worksheet"]. Min/max come from Required Quantity / Max Quantity; auto-prompt from Pop up Automatically?.
- **Sizes:** either Variant Attribute/Option columns (variants, which create Clover item groups) or a "Size" modifier group. Restaurants usually use modifiers.
- **Price levels:** none.
- **Taxes:** a default-tax flag, or a named tax from the Tax Rates sheet.
- **SKU:** `SKU`; UPC goes in `Product Code`.
- **Kitchen routing:** `Printer Labels`.

### 2.4 API push (Clover REST v3) [SPEC: clover-android-sdk inventory models; S: docs.clover.com reference]
Base: `https://api.clover.com/v3/merchants/{mId}/...` (sandbox: `apisandbox.dev.clover.com`).
- `POST /items`: `name`, `alternateName`, `price` (**cents**, Long), `priceType` FIXED/VARIABLE/PER_UNIT, `unitName`, `sku`, `code`, `cost`, `defaultTaxRates`, `isRevenue`, `hidden`, `itemGroup`. Stock is set through a separate item_stocks call [S]. https://docs.clover.com/dev/reference/inventorycreateitem
- `POST /modifier_groups`: `name`, `alternateName`, `minRequired`, `maxAllowed`, `showByDefault`, `sortOrder`.
- `POST /modifier_groups/{id}/modifiers`: `name`, `price` (cents).
- `POST /item_modifier_groups` (body `elements:[{item:{id}, modifierGroup:{id}}]`) links items to groups. https://docs.clover.com/dev/reference/modifiercreateordeleteitemmodifiergroups
- `POST /categories` and `POST /category_items` (link). `POST /tags` (labels) and `POST /tag_items`.
- `POST /tax_rates`: `name`, `rate` (percent, scaled; community evidence says 10% = 1000000, unverified), `taxAmount` (cents, flat), `isDefault`. `POST /tax_rate_items` links items.
- Variants: `item_groups`, `attributes`, `options`, `option_items`. https://docs.clover.com/dev/docs/managing-items-item-groups
- The endpoint paths for links (`item_modifier_groups`, `category_items`, `tag_items`, `tax_rate_items`) are from my knowledge plus the cited reference titles. I did not read the full pages.

### 2.5 Gotchas
- Spreadsheet prices are dollars; API prices are cents.
- Format SKU and Product Code as text so leading zeros survive.
- Links in the sheet are **by name**: names must match exactly and should be unique.
- The 5 MB cap.
- Re-import: official help implies rows with a Clover ID update existing items. A third party says re-import creates duplicates. **Test this.**
- Merchants must reinstall an app after its permissions change [S].

**Confidence / needs verification: Clover workbook.**
- HIGH: v2.0.0 sheet names and Items / Modifier Groups / Categories / Tax Rates headers (a real export, plus the "column P" cross-check).
- MEDIUM: duplicate `Variant Attribute`/`Variant Option` headers; whether Price must be a number or accepts `$`; whether Required/Max Quantity sit only on the group's first row.
- LOW: re-import overwrite behavior.
- Needs: a blank template downloaded from a real Clover dashboard (check the template version string) plus one test import.

**Confidence: Clover API.** HIGH for fields (SDK model). MEDIUM for association endpoint paths and the tax rate scale.

---

## 3. Toast

### 3.1 How menus get in
| Route | Status |
|---|---|
| Self-serve bulk import | **Yes, but gated by package.** Toast Web > Menus > Bulk management > **Bulk import tool**. You need the **Restaurant Management Essentials, Pro, or Enterprise** package **or the multi-location module** [S]. Changes are **not reversible** [S]. https://doc.toasttab.com/doc/platformguide/platformBulkImportToolOverview.html , https://support.toasttab.com/en/article/Getting-Started-Menu-Bulk-Import-Tool-with-Multi-Location-Management |
| Templates | Three: **Basic** (create items, modifier groups and modifiers with minimal fields), **Item update** (Entity type is always MENU_ITEM; updates name, price, SKU, PLU, description, POS/kitchen name, sales category), **Advanced** (create and attach, plus settings like button color, SKU, PLU). Each is a Google Sheet you copy, fill in, and **download as CSV** to upload [S/3P]. https://doc.toasttab.com/doc/platformguide/platformFillingOutTheBulkImportSpreadsheet.html , https://doc.toasttab.com/doc/platformguide/platformAdvancedTemplateExamples.html |
| Menu manager export/import | A newer pre-filled CSV for price audits and bulk price edits only [S]. https://doc.toasttab.com/doc/platformguide/platformMenuManagerExport.html |
| Public API | **Read-only for menus.** Menus API V2 and V3 expose only `GET /menus` and `GET /metadata` with the `menus:read` scope [SPEC: Toast menus OpenAPI yaml]. V3 is only for ordering partners. No menu write scope exists; write scopes are `stock:write` (86/out-of-stock) and `orders.items:write` [S]. https://doc.toasttab.com/doc/devguide/apiGettingMenuInformationFromTheMenusAPI.html , https://doc.toasttab.com/doc/devguide/apiScopes.html |
| Partner route | Partner Connect / integration partner approval gives API credentials, but **still no menu-write API**. For extra scopes, "contact the Toast integrations team" [S]. |
| Support-assisted | Toast onboarding builds menus for new customers. I found no public spec for that. |

**Bottom line for Toast:** export a bulk-import CSV (operation rows) for customers on eligible packages. For everyone else, offer a human-readable sheet or PDF for manual entry or Toast onboarding. A direct API push is not possible.

### 3.2 Bulk import CSV columns (operation-row format)

Toast's file is a **list of operations**, not one row per item. Header names come from search summaries of Toast's platform guide plus a third-party manual that cites it. **The exact order and capitalization are not confirmed.**

| Header (best evidence) | Values / rules |
|---|---|
| `Operation` | `CREATE` (always, in Basic) or `ATTACH` (link to an existing parent) [S] |
| `Entity type` | `MENU_ITEM`, `MODIFIER_GROUP`, `MODIFIER` [S/3P] |
| `Operation ID` | Unique in the file, max 255 characters; Toast suggests 1, 2, 3… Other rows reference it [S] https://doc.toasttab.com/doc/platformguide/platformUnderstandingTheOperationId.html |
| `Name` | Max 255 characters [S] |
| `Pricing strategy or method` | Items: `BASE` (required in Basic). Modifier group: `BASE` (group price) or `PRICED_BY_MODIFIERS` (prices on the modifier rows; leave the group Price blank). Case-insensitive [S/3P]. |
| `Price` | Optional in Basic. String, no `$`. `10` or `10.00`; `-1.00` or `(1.00)` = reduction; max 25 characters [3P citing guide]. |
| `Parent entity type` | `MENU_GROUP`, `MENU_ITEM`, `MODIFIER_GROUP` [S] |
| `Parent version ID or operation ID` | The existing parent's Toast GUID (versionId), or the Operation ID of a row in the same file [S] https://doc.toasttab.com/doc/platformguide/platformSpecifyingToastIdentifiers.html |

Advanced template adds columns such as SKU, PLU, button color, and default modifier. I could not get these headers.

### 3.3 How menu concepts are represented
- **Hierarchy:**
  - Menu and Menu group must **already exist** (create them in Toast Web, then use the group's GUID as the parent), or be referenced by GUID.
  - In a CREATE row, a modifier group can only be parented to a **menu item**, not a menu group. ATTACH can use either [S].
- **Modifier groups and min/max:**
  - Groups created by the tool default to **Required = on, Multi-select = one choice** [S limitations page]. Other min/max must be set in Toast Web afterward (not confirmed for Advanced).
  - The tool cannot create a "No additional charge" (free) modifier group [S].
  - Only one default modifier per group [S].
- **Sizes:** in Toast, sizes are usually a size modifier group, or "Size" pricing set in Toast Web. The bulk tool forces `BASE` pricing on items, so per-size pricing goes in a `PRICED_BY_MODIFIERS` modifier group.
- **Taxes, price levels:** not in the Basic template. Set them in Toast Web.
- **SKU/PLU:** Advanced and Item-update templates.
- **Publish:** after import you must Save and then **Publish** before changes reach the POS [3P].

### 3.4 Gotchas
- Validation errors in the file structure fail the whole file. Rows with data issues fail on their own while the valid rows import [S]. https://doc.toasttab.com/doc/platformguide/platformFixingImportFailures.html
- The import is irreversible.
- Empty modifier groups break third-party syncs [3P].
- No row limit found. https://doc.toasttab.com/doc/platformguide/platformBulkImportLimitations.html (not read in full).

**Confidence / needs verification: Toast.**
- HIGH: API is read-only for menus (vendor OpenAPI shows GET only).
- HIGH: bulk import exists and is package-gated.
- MEDIUM: the 8 column names and enum values.
- LOW: exact header order, capitalization and the Advanced template columns.
- Needs: someone with an eligible Toast Web login to copy the Basic and Advanced templates and record the header rows. No real Toast bulk-import file was found in public repos.

---

## 4. Source files used (real samples)
- Square exports:
  - https://raw.githubusercontent.com/gokhankelebek/istanbul/HEAD/data/ML9YFNKMX5XZJ_catalog-2025-04-20-0010.csv
  - https://github.com/DeavenKaiser/ABAPBakeryDashboard/blob/75070efb21eb06eb65de84baddbfbaaa72d194c1/MLEWTP3S0E54G_catalog-2026-07-31-1804.csv
  - https://raw.githubusercontent.com/koyeary/nextonthemenu/HEAD/public/square.csv
  - https://raw.githubusercontent.com/ksfraser/ksf_generate_catalogue/HEAD/2XJWG21S422RM_catalog-2025-08-31-2022.csv
  - https://raw.githubusercontent.com/quirkey/rough-counts/HEAD/square-template.csv
- Clover export (parsed): https://raw.githubusercontent.com/wild-bean-web/WildeBeanCoffee/HEAD/inventory-export-v2-parsed.json
- Square OpenAPI: https://raw.githubusercontent.com/square/connect-api-specification/master/api.json
- Clover SDK models: https://github.com/clover/clover-android-sdk/tree/master/clover-android-sdk/src/main/java/com/clover/sdk/v3/inventory
- Toast Menus API OpenAPI (third-party copy): growth-operations/toast `toast_openapi_specs/toast-menus-api*.yaml`
- Third-party notes used as leads: chrisfbaileycb-arch/menuflow-pos `docs/manuals/{square,toast}.md`; dylancaponi/product-csv-to-shopify-woocommerce `research/square.md`; FredBearFin/Smokebox `docs/research/pos-export-formats.md`.
