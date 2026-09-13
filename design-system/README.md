# Nora Suleiman Home Beauty — Design System

> **نورة سليمان — تجميل منزلي**. A women-only, on-demand home-beauty marketplace for the Kingdom of Saudi Arabia. This design system bundles the visual foundations, reusable React components, and a working mobile-app UI kit needed to build any surface in the brand.

---

## 1. Context

**Product.** A two-sided marketplace that connects clients in KSA with freelance home-beauty providers (makeup artists, hairstylists, nail technicians, henna artists, skincare specialists) who deliver the service **at the client's home** — with in-app discovery, booking, escrowed payment, chat, QR check-in, and ratings.

**Positioning.** Not a salon-management system. Women-only. Arabic-first/RTL-native. Trust by design (escrow + QR + ratings). Year-one priority: frictionless onboarding and growth, not monetisation.

**Channels in scope of this DS.** Primary: mobile app (Client + Provider, Expo / React Native). The same tokens drive a responsive Next.js web portal and admin dashboard.

**Brand promise.** Elegant, feminine, premium. Warm rose primary, muted gold accent, soft warm-neutral surfaces — *never* the generic "tech blue." Clean typography that reads beautifully in Arabic.

---

## 2. Sources

This DS was built from the documentation pack at:

- GitHub — **[hassangomaa/nora-suleiman-home-beauty](https://github.com/hassangomaa/nora-suleiman-home-beauty)** (Smart Lead Tech, ref `SLT-PRO-2026-051`).
  - `docs/blueprint/02-design-system/` — canonical color, typography, spacing, components specs.
  - `docs/blueprint/00-overview/` — product brief, personas, glossary.
  - `docs/blueprint/03-user-flows/` and `04-mobile-screens/` — flow + screen catalog.

The most useful files for picking up where this leaves off (open them for any deeper question):

- `docs/blueprint/02-design-system/01-colors.md` — full palette + theme map + JSON tokens.
- `docs/blueprint/02-design-system/04-components.md` — the canonical 29-component contract (anatomy, variants, states, RTL/a11y rules).
- `docs/blueprint/04-mobile-screens/01-client-screens.md` — 17 client screens with route, layout, states, APIs, RTL/a11y.

The DS does **not** require the docs at runtime — they're imported into `docs/` for the reader's convenience.

> ⚠️ The source repo ships **no logo, no font binaries, no real photography, no icon set**. Every visual asset in this DS is therefore either type-based (wordmark) or substituted from a public set (see §5 Iconography, §6 Fonts).

---

## 3. Content fundamentals

**Language.** Arabic (`ar-SA`) is the primary UI language; English is a fallback. Copy is written by a native speaker — never use machine-mixed AR/EN inside a single sentence. The reader is addressed in the **feminine "you"** (`-كِ` / `أنتِ`) because the platform is women-only.

**Tone.** Warm, confident, respectful, lightly aspirational. Calm and clear in transactional moments (payment, cancellation, refund). Never flirty, never markety-pushy.

**Casing.** Arabic has no case — keep diacritics minimal. Latin Overline tokens (e.g. eyebrows in dashboards) may use UPPERCASE. Buttons, titles, body — sentence case.

**Numerals.** In `ar-SA`: **Arabic-Indic** (`٠١٢٣…٩`) for prices, dates, times, badge counts. In `en`: Western digits. Currency is **SAR** — render as `ر.س` *after* the amount in `ar`, as `SAR` *before* the amount in `en`. Bidi-isolate any numeric run inside Arabic text (prices, phone numbers, last-4) so `+966` and digits stay in correct visual order.

**Emoji.** Tasteful, sparing — a single 🌸 or ✨ in a welcome line is OK. Never functional (don't use emoji where an icon belongs). Avoid faces and skin-tone emoji entirely.

**Copy examples (canonical voice).**

| Use | AR | EN |
|---|---|---|
| Primary CTA | `احجزي الآن` | Book now |
| Welcome | `أهلاً ريم 🌸` | Welcome, Reem 🌸 |
| Discover prompt | `ابحثي عن خدمة أو مقدّمة` | Search a service or provider |
| Confirmed status | `بانتظار تأكيد المقدّمة` | Awaiting provider confirmation |
| Escrow notice | `سيُحجز المبلغ ولن يُخصم حتى اكتمال الخدمة` | Held — released after the service completes |
| Empty bookings | `لا حجوزات قادمة — ابدئي بحجز خدمتك الأولى` | No upcoming bookings yet |
| Reschedule confirm | `طلب إعادة جدولة بانتظار موافقة المقدّمة` | Reschedule request pending |

---

## 4. Visual foundations

**Palette.** Warm rose primary (`#D6486E`, `primary/500`) on soft warm neutrals (`#FAF7F8` … `#161214`). Muted gold (`#C9A36A`, `secondary/500`) for luxury accents: rating stars, premium provider rings + badges, Gold/Platinum visibility packages. Semantic colours (success green, warning amber, error red, info blue) live alongside but never compete with rose — they're reserved for state.

**Backgrounds.** Generally calm flat surfaces. Hero bands use `bg/tint` (rose-50) as a soft wash — never aggressive gradients or photography. The only intentional gradient is on service thumbnails (a subtle rose→gold blend) as a tasteful placeholder. **No purple-blue gradients**, no glassy backdrop blurs.

**Typography.** Arabic-first. **Tajawal** for `ar` (400 / 500 / 700) and **Inter** for `en` and Latin runs (400 / 500 / 600 / 700). Line-height never drops below `1.5×` font size for body — Arabic diacritics demand it. Headings are 18 / 20 / 24 / 28 px (h3 / h2 / h1 / display); body is 14 / 16; caption 12; overline 11 UPPERCASE Latin only.

**Spacing.** Strict **4 pt grid** — `space-0` 0 through `space-12` 64. Default screen gutter and card padding: `space-4` (16 pt). Sibling card gap: `space-3` (12 pt). Never introduce off-grid values.

**Radii.** `sm` 6 (chips, status), `md` 10 (buttons, inputs, list rows — default), `lg` 16 (cards, banners, toasts), `xl` 24 (modals, bottom sheets), `full` 9999 (avatars, FAB, pills). Bottom sheets round only their top corners.

**Shadows.** Soft, warm, low-opacity — derived from `neutral/900` (`#161214`), **never pure black** in light mode. Four steps: `1` cards at rest, `2` raised + dropdowns, `3` sheets + FAB, `4` modals + toasts. Dark mode dials the shadow back and relies on `bg/surface-raised` lightness + a 1 px border instead.

**Transparency & blur.** Used very sparingly. Scrim is `neutral/900 @ 48%` (light) / `#000 @ 64%` (dark). No frosted-glass app bars; the app bar is solid and gains a shadow + divider on scroll.

**Borders.** Hairline `border/default` on inputs, list rows, and dark-mode raised cards. `border/strong` on hover/active fields and stronger dividers. Never colourful borders for emphasis — emphasis comes from fill (`bg/tint`).

**Cards.** `radius-lg` (16) container, `space-4` (16) inset, `elevation-1` at rest, `bg/surface-raised`. Thumbnails inside use `radius-md` (10). Whole card is a single tap target with a composed accessible label.

**Hover (web).** Primary buttons darken to `primary-600`; secondary/ghost gain a `bg/tint` wash; raised cards lift to `elevation-2`. **Press.** Primary uses `action/primary-pressed`; cards scale to `0.99`; tonal/standard icon-buttons darken one neutral step.

**Focus.** *Always* an outline (`focus/ring`, `primary-400`), `2 pt` offset — never a drop shadow. Keyboard-only by default.

**Motion.** Restrained. ~150 ms transitions on color and shadow. Bottom sheets and toasts slide+fade up. Loading uses shimmer skeletons matching the destination layout — *never* a bare spinner over a content area; spinners are reserved for inline/button/async-validation contexts. No bouncy springs, no looping decorative animation.

**Imagery (when sourced).** Warm, soft, real — natural skin tones, gentle lighting, never harsh studio. Avoid stock-photo clichés (white teeth grids, generic spa stones). Provider portfolios are the photography source; we provide tinted gradient placeholders where no image is set yet.

**Layout rules.** RTL-first. Mobile single-column, `space-4` (16) horizontal gutter, list-row min height 56, touch target ≥44, buttons `lg` 48 tall. Web max content width 1200 px, centered, with 12-column grid from `lg` (1024 px) up.

**Anti-patterns to avoid in this brand.** Tech-blue accents; sharp 90° corners on cards; black drop shadows; emoji-stuffed UI copy; aggressive multi-stop gradients; colour-only state (a status always pairs colour with icon and label).

---

## 5. Iconography

**Approach.** Lightweight, clean line-style icons with a filled variant for active/selected states (active bottom-nav, favorited heart). Functional only — icons label or signal, never decorate.

**The set we ship.** **Material Symbols Rounded** (Google) — a single variable font carrying outline default + a `FILL` axis for the active variant. Loaded via `styles.css`.

> 🔁 **Substitution flag.** The blueprint specifies the icon *style* (clean outline + filled active) but **does not name an icon set**. Material Symbols Rounded is the closest match (outline default, fill axis, Arabic-friendly rounded aesthetic, ligature-based usage). If the brand later commissions a custom set, replace `tokens/icons.css` and the `Icon` component's font-family reference — nothing else needs to change.

**Usage in components.** Use the `<Icon>` component (`components/foundation/Icon.jsx`) — ligature names like `favorite`, `star`, `chevron_left`, `event`, `qr_code_scanner`. Set `fill` for active states and `mirror` for direction-dependent glyphs (back/forward chevrons, chat send) so they flip in RTL automatically.

**Logo & wordmark.** No official logo was provided. We ship a typographic placeholder lockup in `guidelines/brand-logo.card.html`: a rose-gradient circular monogram (`ن`, the Arabic letter Nūn) with a gold outer ring, paired with the Tajawal Arabic wordmark and a small Latin Overline. Use this as a stand-in for splash screens, headers, and app icons until the brand commissions a proper mark. **Ask the user to upload the final logo files** when available.

**No drawn SVG illustrations** are shipped. All visual marks are either typographic, tinted-gradient placeholders, or Material Symbols glyphs.

---

## 6. Fonts

- **Tajawal** (Arabic primary) — 400, 500, 700. Loaded from Google Fonts.
- **Inter** (Latin / numerals) — 400, 500, 600, 700. Loaded from Google Fonts.
- **Material Symbols Rounded** (icons) — variable font, loaded from Google Fonts.

> 🔁 **Substitution flag.** The blueprint specifies Tajawal + Inter explicitly. Both are the real brand families — there is no substitution. If you want a fully offline-capable bundle, swap the Google Fonts `@import` in `styles.css` for self-hosted `@font-face` rules pointing at downloaded `.woff2` binaries (drop them under `tokens/fonts/`).

---

## 7. Index — what's in this project

```
styles.css                       — entry stylesheet (consumers link this one file)

tokens/                          — design tokens, all reachable via @import from styles.css
  colors.css                     — palette, semantic, neutrals, light + dark themes
  typography.css                 — families, weights, type scale tokens
  spacing.css                    — 4pt scale, radius, icon, z, elevation, touch target
  icons.css                      — Material Symbols Rounded icon class
  base.css                       — minimal resets + keyframes

guidelines/                      — foundation specimen cards (Design System tab)
  color-primary.card.html · color-secondary.card.html · color-semantic.card.html
  color-neutrals.card.html · color-theme.card.html
  type-families.card.html · type-headings.card.html · type-body.card.html · type-numerals.card.html
  spacing-scale.card.html · spacing-radius.card.html · spacing-elevation.card.html · spacing-icons.card.html
  brand-logo.card.html · brand-specialties.card.html

components/                      — reusable React UI primitives
  foundation/Icon                — Material Symbols glyph wrapper
  actions/Button, IconButton, Fab
  inputs/TextInput, SearchBar, Chip
  display/Avatar, RatingStars, Money
  feedback/Badge, StatusChip, Banner, Skeleton, EmptyState
  cards/ProviderCard, ServiceCard, BookingCard, ListItem
  navigation/AppBar, BottomNavBar

ui_kits/client-app/              — interactive client mobile-app recreation (iOS frame, RTL)
  index.html                     — phone shell + router + tab bar
  app-data.js                    — mock providers, services, bookings, addresses
  app-screens-discover.jsx       — Home, Provider Profile, Service Detail
  app-screens-booking.jsx        — Booking Create, Review & Pay, Confirmation
  app-screens-account.jsx        — Bookings list, Profile

docs/                            — verbatim source documentation (imported from the repo)
README.md                        — this file
SKILL.md                         — Claude Code skill entry point
```

**Components catalogue (21 exports).**

`Icon` · `Button` · `IconButton` · `Fab` · `TextInput` · `SearchBar` · `Chip` · `Avatar` · `RatingStars` · `Money` · `Badge` · `StatusChip` · `Banner` · `Skeleton` · `EmptyState` · `ListItem` · `ProviderCard` · `ServiceCard` · `BookingCard` · `AppBar` · `BottomNavBar`

All exported on `window.NoraSuleimanHomeBeautyDesignSystem_5b646a` after loading `_ds_bundle.js`. Run `check_design_system` in this project to confirm the namespace and the live component list.

**UI kit coverage.** The `ui_kits/client-app` recreation walks the discovery → booking → payment → confirmation flow plus account screens. Provider-side screens (PRV-*) and shared pre-auth (Splash / OTP / Onboarding) are documented in `docs/blueprint/04-mobile-screens/` but not yet recreated — that's the next iteration.

---

## 8. To go deeper

Open the source documentation imported under `docs/`:

- For a *new* screen — start in `docs/blueprint/04-mobile-screens/` (client / provider / shared).
- For a *new* component variant — start in `docs/blueprint/02-design-system/04-components.md`.
- For a *flow* (booking, auth, payments) — `docs/blueprint/03-user-flows/`.
- For *API contracts* — `docs/blueprint/05-api-contracts/`.

The GitHub repo at [hassangomaa/nora-suleiman-home-beauty](https://github.com/hassangomaa/nora-suleiman-home-beauty) carries the full pack; explore it for any context this DS doesn't already cover.
