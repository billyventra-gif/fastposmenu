# Visual system (v2)

Matches design system v2 on main (2026-11-12): tokens in `src/app/globals.css`, fonts in `src/app/fonts.ts`, logo in `src/components/brand.tsx`, primitives in `src/components/marketing/site.tsx`. If this doc and the code disagree, the code wins and this doc gets fixed.

**The look in one line:** editorial fintech. White canvas, near-black type, hairline borders, small radii, one serif-italic phrase per headline, and orange used like a highlighter, not a paint roller.

## Color

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#fbfbfa` | Page canvas. |
| `--surface` | `#ffffff` | Cards, panels, inputs. Always with a hairline `border-line`. |
| `--ink` | `#0e0f11` | Text, primary buttons, dark panels (CTA band, "us" row in comparisons). |
| `--muted` | `#62646b` | Supporting copy, captions, mono labels. |
| `--line` | `#e7e6e3` | Hairline borders and dividers. |
| `--brand` | `#ff5a1f` | **Accent only:** the dot in the logo mark, the tick before an eyebrow, step numbers, the dot in a pill. |
| `--brand-ink` | `#d6430c` | Rare: orange text that has to pass contrast (e.g. step numbers on a tint). |
| `--brand-soft` | `#f3f2ef` | Despite the name, a **neutral** tint for icon tiles and the guide summary box. |
| Status green | Tailwind `emerald-*` | "READY", checkmarks. |
| Status amber | Tailwind `amber-*` | Flagged / needs review, inside the app. |

**Orange rules.** Never orange headlines, orange buttons, orange body text or links, orange backgrounds, gradients, glows or blur blobs. If you're reaching for orange to make something stand out, use weight, size, the serif accent or a dark panel instead.

## Type

| Role | Font | Style |
|---|---|---|
| Headings | **Inter Tight** (`font-display`) | Semibold, tight tracking (about -0.02em), tight leading. Mobile H1 ≈ 40px, desktop ≈ 60px. |
| Accent phrase | **Instrument Serif**, italic (`font-serif`) | **One phrase per headline, max**, usually the payoff: "Board the restaurant. *Skip the menu build.*" Same color as the headline. |
| Body | **Inter** (`font-sans`) | 16–18px, `text-muted` for supporting copy. |
| Labels | **IBM Plex Mono** (`font-mono`) | Eyebrows, labels, file names, prices in demos: uppercase, 11px, wide tracking (0.12–0.14em), `text-muted`. |

Don't use `font-bold`/`font-extrabold` on marketing pages. Semibold is the heaviest weight.

## Shape and components

- **Radii 8–12px** (Tailwind `rounded-lg`/`xl`/`2xl` are remapped to 8/10/12px). Pills stay `rounded-full`.
- **Borders, not shadows.** `border border-line` on cards. Product shots and the demo card can carry one soft shadow.
- **Primary button:** black, `rounded-lg h-12`, white text, small arrow. **Secondary:** white with `border-line`. Use `PrimaryCta` / `SecondaryCta`.
- **Eyebrow:** orange tick + mono label via `SectionHead eyebrow`. **Pill:** white, hairline border, orange dot, mono text (`Pill`).
- **Cards:** `Card` (white or dark). **FAQ:** `Faq` (accordion). **Closing band:** `CtaBand` (ink panel). **Beta note:** `BetaNote` (bordered, with a mono "Beta" tag). Keep it on every POS page.
- **Icon tiles:** `IconTile` (neutral tint, ink icon).
- Layout: `max-w-6xl px-5 sm:px-8`; long-form `max-w-2xl`. Mobile first: stacked full-width CTAs, header menu on phones.
- **Use the primitives. No one-off styling on new pages.**

## Logo

- **Mark:** a black rounded square holding a "menu card" (three white lines of decreasing length) with an orange dot top-right (the only orange). File: `Mark` in `src/components/brand.tsx`. Works 16–64px.
- **Wordmark:** Mark + "Fast POS Menu" in Inter Tight semibold, tight tracking (`Wordmark`).
- Clear space: half the mark's width. Minimum 16px. On dark backgrounds, invert to a white square with ink lines and keep the orange dot.
- Never stretch, recolor the square orange, outline, add effects, or place it next to a POS vendor's logo.
- Favicon and OG image should use the Mark (build session owns these files).

## Imagery

- **Product first:** `public/product/app-review.png`, `public/product/app-phone.png`, and the fictional menu photo `public/product/menu-photo.png` (Riverbend Taqueria). Demo rows set in mono with a file name (`riverbend_clover.xlsx`) and a READY badge.
- **Before/after** stays the core story: paper menu → structured rows → import file.
- **Sample menus only** (`docs/marketing/sample-menus.md`). Never a real merchant's menu.
- Photos: real counters, real printed menus, natural light, shot on a phone. No stock handshakes, robots or glowing brains. No illustrations.
- POS names appear as plain text or neutral monograms (`PosMark`). Never vendor logos or vendor brand colors used as a logo.

## Social and ad templates

| Format | Size | Layout |
|---|---|---|
| LinkedIn single image | 1200×1200 | `#fbfbfa` canvas, Inter Tight headline with one Instrument Serif italic phrase, product shot in a hairline-bordered frame, mono eyebrow top-left, Wordmark bottom-left. |
| LinkedIn carousel | 1080×1350 | One idea per slide. Mono slide counter (01/06) with orange tick. Last slide: Wordmark + URL. |
| Stat graphic | 1200×1200 | 2×2 grid of hairline cards, big Inter Tight numbers (13/13), mono labels. |
| Reels/TikTok/Shorts | 1080×1920 | Real footage + screen recording. Captions: white Inter on an ink rounded-lg label, safe zones clear (bottom 20%, right 15%). End card: Wordmark on canvas. |
| OG image | 1200×630 | Headline left (serif accent), demo card right. |

## Do / don't

| Do | Don't |
|---|---|
| Canvas, ink, hairlines | Gradients, glows, blur blobs, heavy shadows |
| One serif-italic phrase per headline | Orange headlines or multiple accents |
| Black primary buttons | Big orange buttons |
| Mono for labels, files, prices | Mono for body copy |
| Semibold max weight | Bold/extrabold "shouting" type |
| Real product shots and sample menus | Mockups of features we don't have (API push, more POS) |
