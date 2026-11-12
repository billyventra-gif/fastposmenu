# Visual system

Matches the tokens already in `src/app/globals.css`. Don't introduce new colors on the site without adding a token there first.

## Color

| Token | Hex | Use |
|---|---|---|
| `--brand` | `#ff5a1f` | Primary actions, the one emphasized word in a headline, logo tile. Max ~10% of any screen. |
| `--brand-ink` | `#d43f0a` | Brand on hover; brand-colored text on light backgrounds (passes AA on `--brand-soft`). |
| `--brand-soft` | `#fff1ea` | Pills, icon tiles, highlight bands. |
| `--ink` | `#15171b` | Text, secondary buttons (dark pill), dark feature panels (Pro card). |
| `--muted` | `#6b6e75` | Body copy under headlines, captions. |
| `--bg` | `#f6f5f1` | Page background (warm off-white). Never pure white for the page. |
| `--surface` | `#ffffff` | Cards. Always with `ring-1 ring-line`. |
| `--line` | `#e6e3dc` | Hairlines, card rings, dividers. |
| Status green | Tailwind `emerald-100/600/800` | "READY", checkmarks. |
| Status amber | Tailwind `amber-100/900` | "Flagged / needs review." |

**Contrast:** white text on `#ff5a1f` is ~3:1. OK for large/bold button text (≥17px semibold, as used), not for small body text. For small orange text use `--brand-ink`.

**POS color tiles:** the app uses neutral monogram tiles (`PosMark`: S on ink, C on emerald, T on orange). These are *our* markers, not vendor logos. Keep them monogram-only; never recreate a vendor's logo shape.

## Type

- System sans stack (`--font-sans`: SF Pro / Segoe / Inter / Roboto). No web fonts: fast on phones, zero layout shift.
- Headlines: `font-extrabold tracking-tight`, tight leading (1.05). Mobile H1 42px, desktop 60px.
- Section heads: `text-2xl/3xl font-extrabold tracking-tight`.
- Body: 16–18px, `text-muted` for supporting copy, `leading-relaxed` in long-form.
- Numbers: `tabular-nums` for prices and stats.
- One brand-orange phrase per headline, max. ("Any menu. Any POS. **In minutes.**")

## Shape and layout

- Radius: buttons `rounded-2xl`, cards `rounded-3xl`, pills `rounded-full`. Big and soft.
- Primary button: `h-14 rounded-2xl bg-brand text-white` with the orange glow shadow `shadow-[0_10px_30px_-10px_rgba(255,90,31,0.7)]`.
- Secondary: `ring-1 ring-line` on transparent; dark pill `bg-ink text-white` for "Open app".
- Containers: `max-w-6xl px-5 sm:px-8`. Long-form articles `max-w-2xl`.
- Mobile-first: single column, full-width CTAs on phones, stacked buttons (`flex-col sm:flex-row`).
- Motion: `animate-rise` on entry with small stagger (80ms). The menu "scan" line is our signature motion. Respect reduced-motion (already global).

## Logo / wordmark direction

**Today:** orange rounded-square tile with a white "F" + "Fast POS Menu" in bold sans. Keep for launch. It's clean and already everywhere.

**Direction for v2 (post-launch, needs Billy's pick):**
1. **Scan tile (recommended).** The orange tile with a white "F" whose middle bar is the scan line (a thin horizontal bar that extends slightly past the letter, echoing the hero animation). Reads as "fast" + "scan". Works at 16px favicon.
2. **Receipt fold.** Tile with a zigzag bottom edge like a receipt/ticket. Payments-native. Risk: busy at small sizes.
3. **Wordmark only.** "fast**pos**menu" lowercase with "pos" in brand orange. Good for domain-led branding if we land fastposmenu.com.

Rules: logo tile is always `#ff5a1f` with white glyph, or white tile with `#ff5a1f` glyph on dark. Minimum size 24px. Clear space = half the tile width. Never stretch, outline, gradient or drop-shadow the logo. Never place next to a POS vendor logo.

**Favicon:** current `favicon.ico` is the Next default. Swap to the F tile (build session owns site-wide metadata; I'll hand them the asset).

## Imagery

- **The product is the hero.** Real screenshots from `docs/screenshots/` and screen recordings of sample menus being built. Phone frames over desktop.
- **Before/after** is the core visual: a messy paper menu (photo) → the clean structured list → "READY" import badge.
- **Sample menus only.** Made-up restaurants (Riverbend, Casa Lupita Taqueria, Northside Pizza Co., Daybreak Cafe). Never a real merchant's menu.
- Photos: warm, real restaurant settings (counter, kitchen pass, printed menus on a table), shot on a phone. No glossy stock handshakes, no robots, no glowing brains.
- Illustrations: none. Use UI fragments (rows, pills, badges) as graphic elements.

## Social templates

| Format | Size | Layout |
|---|---|---|
| LinkedIn single image | 1200×1200 | `--bg` background, big ink headline with one orange phrase, product screenshot in a phone frame bottom-right, small "Fast POS Menu" wordmark bottom-left. |
| LinkedIn carousel (PDF) | 1080×1350 | One idea per slide, slide 1 = hook, last slide = CTA + URL. |
| Reels/TikTok/Shorts | 1080×1920 | Hand holds phone over paper menu → screen recording → "READY" badge. Captions burned in, ink on white pill. Safe zones: keep text out of bottom 20% and right 15%. |
| OG image | 1200×630 | Headline left, before/after right. |

## Do / don't

| Do | Don't |
|---|---|
| Warm off-white backgrounds | Pure white pages or dark-mode marketing |
| One orange accent per view | Orange body text, orange backgrounds behind long copy |
| Real UI, real flow | Mockups of features we don't have (API push, more POS) |
| Neutral POS monograms or plain text names | Vendor logos, vendor brand colors used to imply a relationship |
| Big tap targets (≥44px) | Tiny text links as the main CTA on mobile |
