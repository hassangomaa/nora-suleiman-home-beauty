# Design System — Spacing & Layout

> **Canonical tokens.** Built on a strict **4pt grid**. Do not hardcode spacing/radius/shadow values in components; consume the named tokens. The JSON block at the end is the machine-readable source for `@app/ui-tokens`. Colors come from [colors](01-colors.md); type from [typography](02-typography.md).

## 1. Spacing scale (4pt grid)

Every layout dimension is a multiple of **4pt**. Use logical insets (see [§9 RTL](#9-rtl-direction-rules)) rather than raw left/right.

| Token | Value (pt) | Typical use |
|---|:--:|---|
| `space/0` | 0 | Reset, flush edges |
| `space/1` | 4 | Hairline gaps, icon-to-label in dense chips |
| `space/2` | 8 | Icon ↔ text in buttons, chip padding, tight stacks |
| `space/3` | 12 | List-item vertical padding, gap between form rows |
| `space/4` | 16 | **Default screen gutter & card padding**, section inner padding |
| `space/5` | 20 | Comfortable card padding, gap above section headers |
| `space/6` | 24 | Block separation, modal/bottom-sheet inner padding |
| `space/7` | 28 | Large vertical rhythm between unrelated blocks |
| `space/8` | 32 | Section spacing on roomy screens, empty-state padding |
| `space/9` | 40 | Hero spacing, top padding under app bar on landings |
| `space/10` | 48 | Major vertical separation, onboarding step spacing |
| `space/11` | 56 | Splash/illustration breathing room |
| `space/12` | 64 | Maximum standard gap (full-bleed hero margins) |

**Rules**

- Default screen horizontal gutter is `space/4` (16pt) on mobile.
- Card internal padding is `space/4`; raised/feature cards may use `space/5`.
- Vertical gap between sibling cards in a list is `space/3` (12pt).
- Never introduce off-grid values (e.g. 10, 14, 18). If a comp needs them, round to the nearest token.

## 2. Border-radius scale

| Token | Value (pt) | Where used |
|---|:--:|---|
| `radius/sm` | 6 | Chips, tags, status chips, small inputs, badges |
| `radius/md` | 10 | **Default** — buttons, text inputs, dropdowns, list rows |
| `radius/lg` | 16 | Cards (provider/service/booking), banners, toasts |
| `radius/xl` | 24 | Bottom sheets (top corners), modals/dialogs, feature cards |
| `radius/full` | 9999 | Avatars, FAB, pill buttons, rating dots, online indicator |

**Rules**

- Bottom sheets round only the **top-start** and **top-end** corners (`radius/xl`); bottom corners stay 0.
- Image thumbnails in cards inherit the card radius minus 1 step (`radius/lg` card → `radius/md` inner image when inset).

## 3. Elevation & shadow tokens

Light mode uses soft, low-opacity shadows on warm neutrals. Dark mode reduces shadow visibility and instead leans on `bg/surface-raised` lightness from [colors §5](01-colors.md) plus a subtle border.

| Token | Light (offset / blur / color@opacity) | Dark | Used by |
|---|---|---|---|
| `elevation/0` | none | none | Flush surfaces, list rows on canvas |
| `elevation/1` | `0 1 2` · `neutral/900 @ 6%` | `0 1 2` · `#000 @ 24%` + 1px `border/default` | Cards at rest, chips, inputs |
| `elevation/2` | `0 2 8` · `neutral/900 @ 8%` | `0 2 8` · `#000 @ 32%` + 1px `border/default` | Raised cards, app bar on scroll, dropdown |
| `elevation/3` | `0 6 16` · `neutral/900 @ 10%` | `0 6 16` · `#000 @ 40%` + 1px `border/strong` | Bottom sheets, FAB, popovers |
| `elevation/4` | `0 12 32` · `neutral/900 @ 14%` | `0 12 32` · `#000 @ 48%` + 1px `border/strong` | Modals/dialogs, toasts above sheets |

**Rules**

- Shadow color in light mode is always derived from `neutral/900` (`#161214`) at the listed opacity — never a black drop shadow (it muddies the warm neutrals).
- In dark mode, prefer the raised-surface token + border over heavy shadow; shadows are present but secondary.
- Focus rings are **not** shadows; they use `focus/ring` from [colors §5](01-colors.md) as an outline (see [components a11y](04-components.md)).

## 4. Z-index layers

Single ordered scale. Higher always renders above lower; never invent values between.

| Token | Value | Layer |
|---|:--:|---|
| `z/base` | 0 | Page content |
| `z/raised` | 10 | Sticky section headers, raised cards |
| `z/appbar` | 100 | App bar / header, bottom nav bar |
| `z/fab` | 200 | Floating action button |
| `z/dropdown` | 300 | Dropdown / select menus, autocomplete |
| `z/sheet` | 400 | Bottom sheet + its scrim |
| `z/modal` | 500 | Modal / dialog + its scrim |
| `z/toast` | 600 | Toast / snackbar (always above sheets and modals) |
| `z/tooltip` | 700 | Tooltips, coach marks |

- Scrim/overlay opacity: `neutral/900 @ 48%` (light), `#000 @ 64%` (dark). The scrim sits one z-step below its owning surface.

## 5. Breakpoints (responsive web portal)

The mobile app is single-column phone-first; these breakpoints govern the [responsive web portal and admin dashboard](../00-overview/01-product-brief.md).

| Token | Min width (px) | Target | Layout |
|---|:--:|---|---|
| `bp/xs` | 0 | Small phones | 1 column, 4-col grid |
| `bp/sm` | 480 | Large phones | 1 column, 4-col grid |
| `bp/md` | 768 | Tablets | 2 columns, 8-col grid |
| `bp/lg` | 1024 | Laptops | 3 columns, 12-col grid |
| `bp/xl` | 1280 | Desktops | 12-col grid, max content width 1200px |
| `bp/2xl` | 1536 | Wide | 12-col grid, centered, gutters grow |

- Content max-width on web is **1200px**, centered with auto logical margins.
- The marketplace card grid: 1-up (`xs`/`sm`), 2-up (`md`), 3-up (`lg`), 4-up (`xl`+).

## 6. Grid & gutters

| Context | Columns | Gutter | Outer margin |
|---|:--:|:--:|---|
| Mobile app | 4 | `space/4` (16) | `space/4` (16) |
| Web `md` | 8 | `space/5` (20) | `space/6` (24) |
| Web `lg`+ | 12 | `space/6` (24) | auto (centered, max 1200px) |

- Column spans for cards: provider/service card = 2 of 4 mobile columns (2-up) only on web `md`+; on phone they are full-width single column with `space/3` vertical gaps.

## 7. Icon sizes

| Token | Value (pt) | Use |
|---|:--:|---|
| `icon/xs` | 16 | Inline with `caption`, chip leading icon, metadata rows |
| `icon/sm` | 20 | Inline with `body`/`label`, list-item leading, input affix |
| `icon/md` | 24 | **Default** — app bar actions, bottom-nav, buttons, IconButton |
| `icon/lg` | 32 | Empty-state accent, avatars fallback glyph, feature tiles |
| `icon/xl` | 48 | Large empty states, onboarding illustrations |

- Icon stroke weight pairs with `label`/`body` weight; active nav icons use filled variants in `action/primary`.

## 8. Touch targets

- **Minimum interactive target is 44 × 44 pt** (hit area), even when the visible glyph is smaller (e.g. a 24pt `IconButton` glyph expands its hit slop to 44pt).
- Spacing between adjacent targets ≥ `space/2` (8pt) to prevent mis-taps.
- Primary buttons are `size/lg` = 48pt tall; compact controls never go below 44pt.
- List rows are ≥ 56pt tall (`space/12` reference) to keep the whole row tappable.

## 9. RTL & direction rules

Arabic is the primary locale (`ar-SA`); the UI is **RTL-first**, not retrofitted (see [product principles](../00-overview/01-product-brief.md)). Layout direction flips with locale; the design tokens are direction-agnostic by using **logical** properties.

### 9.1 Logical properties (never physical left/right)

| Use this (logical) | Not this (physical) |
|---|---|
| `marginStart` / `marginEnd` | `marginLeft` / `marginRight` |
| `paddingStart` / `paddingEnd` | `paddingLeft` / `paddingRight` |
| `start` / `end` (insets) | `left` / `right` |
| `borderStartStartRadius` etc. | `borderTopLeftRadius` etc. |
| `textAlign: 'start'` / `'end'` | `textAlign: 'left'` / `'right'` |
| flex `row` + `I18nManager.isRTL` aware | hardcoded row reversal |

- In React Native, set `I18nManager.forceRTL(true)` for `ar`; do not hardcode `flexDirection: 'row-reverse'` — let the engine flip.
- On web, set `dir="rtl"` on `<html>` for `ar` and use CSS logical properties (`margin-inline-start`, `inset-inline-end`, etc.).

### 9.2 Icon mirroring

Direction-dependent icons **mirror** in RTL; orientation-meaningful or branded icons **do not**.

| Mirror in RTL | Do **not** mirror |
|---|---|
| Back arrow / chevron-left/right | Clock / time |
| "Next"/"Previous" navigation chevrons | Brand logos & wordmarks |
| Send (paper-plane in chat) | Media transport (play ▶, fast-forward implies time, leave as-is per platform) |
| Forward / reply arrows | Camera, image, gallery glyphs |
| Progress/stepper direction | Checkmark, plus, settings gear, search lens (visually symmetric) |
| Trailing "drill-in" chevron on list items | Star (rating), heart |

- Mirroring is a horizontal flip of the glyph, not a re-layout. Apply via `I18nManager.isRTL ? [{ scaleX: -1 }] : undefined` (RN) or `transform: scaleX(-1)` gated on `[dir="rtl"]` (web).
- The chat **send** icon mirrors so the paper plane points toward the message flow direction; the **play** icon stays per platform convention.

### 9.3 Bidi text handling

- Wrap user-generated content that may mix scripts (provider name + English service term, phone numbers, URLs) and isolate with Unicode bidi isolates (`⁨ … ⁩`, FSI/PDI) or platform `unicodeBidi: 'isolate'` to prevent reordering glitches.
- Phone numbers and prices are **LTR runs inside RTL text** — isolate them so the `+966` prefix and digits stay in correct visual order.
- Never manually insert RLM/LRM by string concatenation in app code; rely on isolation wrappers and the formatter layer.

### 9.4 Number, currency & date locale formatting

| Locale | Digits | Example price | Example date | Example time |
|---|---|---|---|---|
| `ar-SA` | Arabic-Indic ٠١٢٣٤٥٦٧٨٩ | ‎٢٥٠ ر.س | ٢٩ يونيو ٢٠٢٦ | ٣:٠٠ م |
| `en` | Western 0123456789 | SAR 250 | 29 Jun 2026 | 3:00 PM |

- Use `Intl.NumberFormat`/`Intl.DateTimeFormat` (or the app i18n layer) keyed off the active locale — never hand-format.
- Currency is **SAR**; in `ar` render as `ر.س` after the (Arabic-Indic) amount, in `en` as `SAR` before the amount. Pair with [typography prices rule](02-typography.md) (`h3`/700 amount, `caption` currency).
- Timezone is fixed to **Asia/Riyadh** at launch (per [product brief constraints](../00-overview/01-product-brief.md)).
- Calendar is Gregorian for scheduling; Hijri display is out of MVP scope.

## 10. Token JSON (source of truth)

```json
{
  "space": {
    "0": 0, "1": 4, "2": 8, "3": 12, "4": 16, "5": 20, "6": 24,
    "7": 28, "8": 32, "9": 40, "10": 48, "11": 56, "12": 64
  },
  "radius": {
    "sm": 6, "md": 10, "lg": 16, "xl": 24, "full": 9999
  },
  "icon": {
    "xs": 16, "sm": 20, "md": 24, "lg": 32, "xl": 48
  },
  "touchTarget": { "min": 44 },
  "zIndex": {
    "base": 0, "raised": 10, "appbar": 100, "fab": 200,
    "dropdown": 300, "sheet": 400, "modal": 500, "toast": 600, "tooltip": 700
  },
  "breakpoint": {
    "xs": 0, "sm": 480, "md": 768, "lg": 1024, "xl": 1280, "2xl": 1536,
    "contentMaxWidth": 1200
  },
  "elevation": {
    "0": { "light": null, "dark": null },
    "1": {
      "light": { "x": 0, "y": 1, "blur": 2, "color": "#161214", "opacity": 0.06 },
      "dark":  { "x": 0, "y": 1, "blur": 2, "color": "#000000", "opacity": 0.24, "border": "#403A3D" }
    },
    "2": {
      "light": { "x": 0, "y": 2, "blur": 8, "color": "#161214", "opacity": 0.08 },
      "dark":  { "x": 0, "y": 2, "blur": 8, "color": "#000000", "opacity": 0.32, "border": "#403A3D" }
    },
    "3": {
      "light": { "x": 0, "y": 6, "blur": 16, "color": "#161214", "opacity": 0.10 },
      "dark":  { "x": 0, "y": 6, "blur": 16, "color": "#000000", "opacity": 0.40, "border": "#5C5258" }
    },
    "4": {
      "light": { "x": 0, "y": 12, "blur": 32, "color": "#161214", "opacity": 0.14 },
      "dark":  { "x": 0, "y": 12, "blur": 32, "color": "#000000", "opacity": 0.48, "border": "#5C5258" }
    }
  },
  "scrim": {
    "light": { "color": "#161214", "opacity": 0.48 },
    "dark":  { "color": "#000000", "opacity": 0.64 }
  }
}
```
