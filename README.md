# Fast POS Menu

Any restaurant menu, into any POS, in minutes. A Code 85 Labs product.

Pick the POS → upload photos / PDF / CSV / XLSX → review and fix on your phone → download the import file.

Research behind the decisions: [`docs/research.md`](docs/research.md). Screenshots: [`docs/screenshots/`](docs/screenshots/).

## Run it

```bash
cp .env.example .env.local   # add ANTHROPIC_API_KEY
npm install
npm run dev                  # http://localhost:3000
```

| Command | What |
|---|---|
| `npm test` | Unit tests: price parsing, normalization, CSV path, link policy, all three exporters (offline) |
| `npm run test:live` | Real Claude extraction on the sample menu (photo + PDF), scored against the answer key, with token cost. Needs `ANTHROPIC_API_KEY`. Try `MENU_MODEL=claude-sonnet-5-5` to compare. |
| `npm run lint` / `npm run build` | Lint / production build |

## How it's put together

```
src/lib/menu/schema.ts             Canonical menu (Zod). Everything maps in, every exporter reads out. Money = integer cents.
src/lib/menu/extraction-schema.ts  What Claude returns: raw price text, group names, no IDs, no math.
src/lib/menu/normalize.ts          Extraction(s) → canonical menu: parse prices, infer min/max, merge pages, link groups. Pre-export checks.
src/lib/menu/money.ts              Price parsing/formatting.
src/lib/ingest/claude.ts           Claude call: structured output, cached system prompt, refusal fallback, usage.
src/lib/ingest/spreadsheet.ts      CSV/XLSX read; tidy sheets map in code (zero tokens), messy ones go to Claude.
src/lib/ingest/link.ts             Link policy: marketplaces blocked → "screenshot it". Own-site fetch flagged off.
src/lib/export/{square,clover,toast}.ts  POS exporters. All marked "needs a real sample export to verify".
src/lib/billing/                   Stripe hook (entitlements stubs) + token cost table.
src/app/api/{extract,export,link}  Route handlers.
src/components/                    Builder, Uploader, MenuEditor (mobile-first), ExportPanel.
supabase/migrations/0001_init.sql  Schema for menus, extraction cost log, credits, subscriptions, upload bucket. Not applied.
samples/                           Fictional test menu (HTML/PNG/PDF/CSV). No real merchant data.
```

## Status

- **Exporters:** built from the documented/observed formats, unit-tested, **not yet verified against real accounts.** Next step: import each into a sandbox account (Square sandbox, Clover dev account, a Toast test location) and diff against a real export.
- **Live extraction:** wired and type-checked, not yet run against the API (no key in the build session). Run `npm run test:live`.
- **Storage:** drafts live in the browser (localStorage). Supabase schema is ready; auth + sync is next.
- **Uploads:** capped at ~4 MB per request (Vercel body limit). Bigger PDFs need the Supabase signed-upload path.
- **Billing:** not wired. Hooks are in `src/lib/billing/entitlements.ts` (charge on download, not on preview).
- **Link import:** marketplace links are refused with a screenshot prompt. Own-site import is behind `LINK_FETCH_ENABLED` and not built.
