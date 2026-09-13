# Design System — Components

> **Canonical component library.** Every component below consumes named tokens only — colors from [colors](01-colors.md), type from [typography](02-typography.md), spacing/radius/elevation/icons from [spacing-layout](03-spacing-layout.md). No hardcoded hex/sizes. Arabic-first/RTL per [spacing-layout §9](03-spacing-layout.md); roles (عميلة / مقدّمة خدمة / إدارة) per [personas-roles](../00-overview/02-personas-roles.md).

## Conventions used in this doc

- **States** covered per interactive component: default, hover (web/pointer only), pressed, focus (keyboard/AT focus ring), disabled, loading, error (where applicable).
- **Focus ring** is always an outline using `focus/ring` (`primary/400` light / `primary/300` dark), offset 2pt — never a drop shadow ([spacing §3](03-spacing-layout.md)).
- **Touch target** ≥ 44pt for every tappable element ([spacing §8](03-spacing-layout.md)).
- **Direction**: all insets logical (`start`/`end`); leading/trailing refer to reading order, not physical side.
- **Color never alone**: every state that uses color also carries an icon or text label ([colors §6](01-colors.md)).

---

## 1. Button

**Anatomy:** container (radius `radius/md`) → optional leading icon (`icon/md`) → label (`label` 14/500) → optional trailing icon. Icon ↔ label gap `space/2`.

**Variants**

| Variant | Container | Label/Icon | Border |
|---|---|---|---|
| `primary` | `action/primary` (`primary/500` light / `primary/400` dark) | `text/on-primary` | none |
| `secondary` | `bg/surface` | `action/primary` | 1px `border/strong` |
| `ghost` | transparent | `action/primary` | none |
| `destructive` | `error/500` | `neutral/0` | none |

**Sizes**

| Size | Height | Inset (start/end) | Type |
|---|:--:|:--:|---|
| `sm` | 36 | `space/3` | `label` |
| `md` | 44 | `space/4` | `label` |
| `lg` | 48 (default CTA) | `space/5` | `label` |

**States**

- **default** — as table above.
- **hover** — primary→`primary/600`; secondary/ghost→bg `primary/50` (light) / `primary/900` (dark); destructive→darken via `error/500` overlay 8%.
- **pressed** — `action/primary-pressed` (`primary/600` light / `primary/500` dark); destructive uses `error/500` + 12% `neutral/900` overlay.
- **focus** — focus ring outline.
- **disabled** — container `neutral/200` (light) / `neutral/700` (dark), label `text/disabled`; no shadow; not focusable.
- **loading** — replace label with inline spinner in current text color; keep width stable; container non-interactive (`aria-busy`).
- **error** — buttons themselves are not "error"; destructive variant communicates dangerous intent. Submit failures surface via [Banner/Toast](#19-toast--snackbar).

**Tokens:** `radius/md`, `space/2`–`space/5`, type `label`, colors `action/primary`, `action/primary-pressed`, `text/on-primary`, `error/500`, `border/strong`, `focus/ring`, `elevation/1` (primary at rest, light only).

**RTL/a11y:** leading icon sits at reading-start; chevrons mirror ([spacing §9.2](03-spacing-layout.md)). Min height ≥44 except `sm` which expands hit-slop to 44. `role="button"`, accessible name = label; loading sets `aria-busy="true"`; disabled sets `aria-disabled`.

---

## 2. IconButton

**Anatomy:** circular/`radius/md` hit area 44×44 containing a single `icon/md` glyph.

**Variants:** `standard` (transparent), `tonal` (`bg/tint`), `filled` (`action/primary` glyph `text/on-primary`), `contained-tonal`.

**Sizes:** glyph `icon/sm` (compact) or `icon/md` (default); hit area always 44.

**States:** default; hover bg `neutral/100` (light)/`neutral/700` (dark) for standard; pressed darken one neutral step or `action/primary-pressed` for filled; focus ring; disabled glyph `text/disabled`; loading spinner replaces glyph.

**Tokens:** `icon/sm`–`md`, `radius/md`/`radius/full`, `bg/tint`, `action/primary`, `focus/ring`, `space/2`.

**RTL/a11y:** directional glyphs mirror. **Must** have `accessibilityLabel`/`aria-label` (icon-only). Used in [AppBar](#26-appbarheader), cards, chat.

---

## 3. TextInput

**Anatomy:** label (`label`, above) → field container (radius `radius/md`, 1px `border/default`) with optional leading icon (`icon/sm`) + input text (`body-lg` 16, prevents iOS zoom) + optional trailing icon/affix → helper/error text (`caption`) below.

**Variants:** `outlined` (default), `filled` (`bg/surface` fill, bottom border). Multiline `textarea` grows to N lines.

**Sizes:** `md` 48 height, inset `space/3`; `sm` 40 for dense forms.

**States**

- **default** — border `border/default`, placeholder `text/disabled`.
- **hover** — border `border/strong`.
- **focus** — border `action/primary` 1.5px + focus ring; label tints `action/primary`.
- **filled (has value)** — text `text/primary`.
- **disabled** — bg `neutral/100`, text `text/disabled`, no focus.
- **loading** — trailing inline spinner (e.g. async validation), input stays editable unless specified.
- **error** — border `error/500`, error icon `icon/sm` trailing in `error/500`, helper text `error/500`; `aria-invalid="true"`, helper linked via `aria-describedby`.

**Tokens:** `radius/md`, `space/3`, type `label`/`body-lg`/`caption`, colors `border/default`, `border/strong`, `action/primary`, `error/500`, `text/*`, `focus/ring`.

**RTL/a11y:** `textAlign: 'start'`, leading icon at start; numeric/Latin entries isolated as LTR runs ([spacing §9.3](03-spacing-layout.md)). Label programmatically associated; error announced via live region.

---

## 4. OTPInput (6-digit)

**Anatomy:** 6 single-char boxes (radius `radius/md`, gap `space/2`), each `body-lg`/center-aligned; below: resend control + countdown (`caption`).

**Variants:** boxed (default). Auto-advance on entry, backspace moves to previous, paste fills all six.

**Sizes:** each box 48×56.

**States:** empty (border `border/default`); active box (border `action/primary` + ring); filled (`text/primary`); disabled during verify (loading spinner overlay on the row); error — all boxes border `error/500`, shake once, message `error/500` (e.g. "الرمز غير صحيح").

**Tokens:** `radius/md`, `space/2`, `body-lg`, `caption`, `action/primary`, `error/500`, `border/default`, `success/500` (brief on success), `focus/ring`.

**RTL/a11y:** OTP digits are a numeric LTR run even in `ar` (first typed digit fills the start-most box visually consistent with phone input). One-time-code autofill (`textContentType="oneTimeCode"` / `autocomplete="one-time-code"`). Group has `aria-label`; countdown is a polite live region. Used in phone-OTP auth ([product principle 1](../00-overview/01-product-brief.md)).

---

## 5. PhoneInput (KSA +966)

**Anatomy:** country code chip (flag 🇸🇦 + `+966`, fixed at MVP) → national number field (`body-lg`). Single visual control, radius `radius/md`.

**Variants:** locked country (KSA-only at MVP); number formatted as `5X XXX XXXX`.

**Sizes:** `md` 48 height.

**States:** mirror [TextInput](#3-textinput) — default/hover/focus/disabled/error. Error on invalid Saudi mobile (must start `5`, 9 digits) → border `error/500`, helper "أدخلي رقم جوال سعودي صحيح".

**Tokens:** same as TextInput + `bg/tint` for the code chip.

**RTL/a11y:** the entire phone value (`+966 5X XXX XXXX`) is an **LTR isolated run** inside RTL layout; the `+966` prefix renders at the start ([spacing §9.3/§9.4](03-spacing-layout.md)). `textContentType="telephoneNumber"`, numeric keypad. Accessible name announces "+966" expanded.

---

## 6. SearchBar

**Anatomy:** rounded container (`radius/full` or `radius/md`) → leading search lens (`icon/sm`, non-mirrored) → input (`body`) → trailing clear (✕) when text present + optional filter IconButton.

**Variants:** `inline` (in AppBar), `standalone` (discovery screen with suggestions dropdown).

**Sizes:** 44 height.

**States:** default (placeholder `text/secondary` e.g. "ابحثي عن خدمة أو مقدّمة"); focus ring + suggestions [Dropdown](#7-dropdownselect) opens (`z/dropdown`); loading trailing spinner while querying; cleared (empty); disabled rare.

**Tokens:** `radius/full`/`radius/md`, `icon/sm`, `space/2`–`space/3`, `body`, `bg/surface`, `text/secondary`, `focus/ring`, `elevation/2` for suggestions.

**RTL/a11y:** lens at reading-start; search lens is symmetric, does not mirror. `role="search"`; results count announced. Used by client discovery (Reem persona).

---

## 7. Dropdown / Select

**Anatomy:** trigger (looks like [TextInput](#3-textinput) with trailing chevron-down `icon/sm`) → menu panel (`radius/lg`, `elevation/2`, `z/dropdown`) of [ListItems](#16-listitem) → selected item gets a check + `bg/tint`.

**Variants:** single-select, multi-select (checkboxes), searchable (filter field at top).

**Sizes:** trigger 48; menu max-height with scroll.

**States:** closed/default; hover trigger border `border/strong`; open (chevron rotates, ring on trigger); item hover `neutral/100`/`neutral/700`; item selected `bg/tint` + `action/primary` check; disabled item `text/disabled`; loading menu shows [Skeleton](#22-skeleton-loader) rows; error trigger border `error/500`.

**Tokens:** `radius/md`/`radius/lg`, `elevation/2`, `z/dropdown`, `bg/tint`, `action/primary`, `icon/sm`, type `body`/`label`.

**RTL/a11y:** chevron flips vertically only (no horizontal mirror); menu aligns to trigger start. `role="listbox"`/`option`, `aria-expanded`, type-ahead, arrow-key nav, Esc closes.

---

## 8. DatePicker & TimeSlotPicker

**DatePicker anatomy:** month header with prev/next chevrons (mirrored in RTL) → weekday row → day grid; selected day `action/primary` filled circle (`radius/full`), today ringed, disabled days `text/disabled`.

**TimeSlotPicker anatomy:** scrollable list/grid of slot [Chips](#9-chip--tag) (e.g. ٣:٠٠ م) grouped by morning/afternoon/evening; selected slot `action/primary`, unavailable struck/disabled.

**Variants:** inline (in [BottomSheet](#17-bottomsheet)) or full screen; single date, slot grid.

**Sizes:** day cell 44×44; slot chip height 40, min 44 hit.

**States:** default; hover day `bg/tint`; selected filled; today outline `action/primary`; disabled/unavailable `text/disabled` + cannot select; loading availability → skeleton slot grid; error loading → [error-with-retry](#28-global-states).

**Tokens:** `radius/full` (day), `radius/sm` (slot), `action/primary`, `bg/tint`, `text/disabled`, `space/2`–`space/3`, type `body`/`caption`, `warning/500` (reschedule-requested context).

**RTL/a11y:** the **day grid does not mirror** the calendar week order arbitrarily — it follows locale week start (Sun for `ar-SA`); month nav chevrons mirror. Dates shown Arabic-Indic in `ar` ([spacing §9.4](03-spacing-layout.md)). Each day `aria-label` full date; grid keyboard-navigable; clock glyph in time picker does **not** mirror. Powers booking flow ([booking system](../00-overview/01-product-brief.md)).

---

## 9. Chip / Tag

**Anatomy:** pill (`radius/sm`) → optional leading icon (`icon/xs`) → label (`label`/`caption`) → optional trailing ✕ (removable) or check (selectable). Inset `space/2`.

**Variants:** `assist`, `filter` (selectable, toggles `bg/tint`+`action/primary` border when active), `input/removable` (trailing ✕), `suggestion`.

**Sizes:** `sm` 28 height, `md` 32 height (≥44 hit slop).

**States:** default `bg/surface` + `border/default`; hover `neutral/100`; selected `bg/tint` + border `primary/300` + label `primary/700`; pressed darken; disabled `text/disabled`; focus ring.

**Tokens:** `radius/sm`, `space/2`, `icon/xs`, `bg/tint`, `primary/300`, `primary/700`, `border/default`, type `label`/`caption`.

**RTL/a11y:** trailing ✕ sits at reading-end; remove action labeled ("إزالة"). Filter chips `role="checkbox"`/`aria-pressed`.

---

## 10. StatusChip (booking statuses)

**Anatomy:** small pill (`radius/sm`) → status **dot/icon** (`icon/xs`) → status label (`label`/`caption`). Tinted background = semantic `/100`, text/dot = semantic `/500` (or `primary/500`). Icon is mandatory (color-never-alone, [colors §6](01-colors.md)).

**Booking-status → token mapping** (canonical, from [colors §3](01-colors.md); enum in [glossary](../00-overview/03-glossary.md)):

| Status | AR | bg | fg/dot | Icon |
|---|---|---|---|---|
| `pending` | بانتظار التأكيد | `warning/100` | `warning/500` | hourglass |
| `confirmed` | مؤكّد | `info/100` | `info/500` | check |
| `on_the_way` | في الطريق | `info/100` | `info/500` | car/route |
| `in_progress` | جارٍ التنفيذ | `primary/50` | `primary/500` | sparkle |
| `completed` | مكتمل | `success/100` | `success/500` | check-circle |
| `cancelled` | ملغي | `error/100` | `error/500` | x-circle |
| `reschedule_requested` | طلب إعادة جدولة | `warning/100` | `warning/500` | calendar-clock |

**Sizes:** 24–28 height.

**States:** static display chip (no hover/press) but may be focusable when it links to booking detail.

**Tokens:** `radius/sm`, semantic `/100`+`/500`, `primary/50`+`primary/500`, `icon/xs`, type `caption`/`label`.

**RTL/a11y:** dot/icon at reading-start; label localized; `aria-label` repeats status text so screen readers don't rely on color/icon. Used on [booking card](#15-card) and detail.

---

## 11. Avatar

**Anatomy:** circle (`radius/full`) image; fallback = initials on `primary/100` bg with `primary/700` text, or person glyph (`icon/lg`). Optional online dot (`success/500`, `radius/full`) at trailing-bottom, optional ring for premium (`secondary/500`).

**Variants:** image, initials, glyph, with-badge, stacked group (overlap).

**Sizes:** `xs` 24, `sm` 32, `md` 40, `lg` 56, `xl` 96 (profile header).

**States:** default; loading skeleton circle; error→fallback initials/glyph; selected ring `action/primary`.

**Tokens:** `radius/full`, `primary/100`/`primary/700`, `secondary/500` (premium ring), `success/500` (online), `icon/lg`, `space/1` (badge offset).

**RTL/a11y:** online/premium badge offset uses logical end; `alt`/`accessibilityLabel` = person name. In stacks, reading order start→end.

---

## 12. RatingStars

**Anatomy:** row of 5 stars (`icon/sm`) filled in `secondary/500` (gold), empty `neutral/300`; supports half star; trailing numeric (`caption`, Arabic-Indic in `ar`) and optional count.

**Variants:** `display` (read-only), `input` (tap/drag to rate, used post-completion review).

**Sizes:** display `icon/xs`/`icon/sm`; input `icon/md` for easy tapping (≥44 hit).

**States:** default; hover (input) preview-fill to hovered star; pressed; selected value; disabled `neutral/300`; loading skeleton.

**Tokens:** `secondary/500`, `neutral/300`, `icon/xs`–`md`, `caption`, `space/1`.

**RTL/a11y:** star **order follows reading direction** (rating fills from start); star glyph itself does not mirror. Input exposes `role="slider"` 1–5 with value text; review tied to a completed booking ([ratings system](../00-overview/01-product-brief.md)).

---

## 13–15. Card (provider / service / booking)

**Shared anatomy:** container `radius/lg`, padding `space/4` (feature `space/5`), `elevation/1` (light) / `bg/surface-raised`+border (dark), vertical gap between cards `space/3`.

### 13. Provider card
- **Anatomy:** [Avatar](#11-avatar) `md` → name (`h3`, 1-line ellipsis) + service category (`caption`, `text/secondary`) → [RatingStars](#12-ratingstars) display + review count → distance/area (`caption` with pin `icon/xs`) → optional premium badge (`secondary/100` bg, `secondary/700` text — Gold/Platinum [package](../00-overview/03-glossary.md)). Trailing favorite [IconButton](#2-iconbutton) (heart).
- **States:** default; hover lift to `elevation/2` (web); pressed scale 0.99; focus ring; loading [skeleton](#22-skeleton-loader) variant; unavailable (provider not `accepting_bookings`) → dimmed + "غير متاحة حالياً" label.

### 14. Service card
- **Anatomy:** thumbnail (radius `radius/md`, inset) → service name (`h3`, 1-line) → short desc (`body`, 2-line clamp) → **price** ([Money display](#27-moneyprice-display)) + duration (`caption`, e.g. ٤٥ دقيقة) → primary [Button](#1-button) "احجزي".
- **States:** as shared; price/duration always present (required per [service system ✚](../00-overview/01-product-brief.md)).

### 15. Booking card
- **Anatomy:** [StatusChip](#10-statuschip) (top, status-colored) → service + provider/client name → date+time row (calendar `icon/sm` non-mirrored clock) → address line (truncated, client side) → price summary → context actions (e.g. "إعادة جدولة" / "إلغاء" / "تقييم" depending on status & role).
- **States:** default; status drives accent; pressed → booking detail; cancelled card desaturated; loading skeleton.

**Tokens (all cards):** `radius/lg`/`radius/md`, `space/3`–`space/5`, `elevation/1`/`elevation/2`, `bg/surface-raised`, `border/default`, type `h3`/`body`/`caption`, `secondary/100`/`secondary/700` (premium), status semantics.

**RTL/a11y:** image leading at reading-start; trailing chevron (if drill-in) mirrors; whole card is one tap target with composed accessible label; truncation never hides price/status.

---

## 16. ListItem

**Anatomy:** leading (icon `icon/sm` / [Avatar](#11-avatar)) → primary text (`body`) + optional secondary (`caption`, `text/secondary`) → trailing (value text / [Chip](#9-chip--tag) / chevron / switch). Row height ≥56, inset `space/4`, divider `border/default`.

**Variants:** single-line, two-line, with-control (switch/checkbox), navigational (trailing chevron).

**States:** default; hover `bg/surface`; pressed `neutral/100`/`neutral/700`; focus ring; selected `bg/tint`; disabled `text/disabled`; loading skeleton row.

**Tokens:** `space/4`, `icon/sm`, `body`/`caption`, `bg/tint`, `border/default`, `text/secondary`.

**RTL/a11y:** leading at start, trailing chevron mirrors; entire row tappable, `accessibilityRole="button"` when navigational; switch state announced.

---

## 17. BottomSheet

**Anatomy:** scrim (`z/sheet`-1, scrim token) → sheet panel anchored to bottom, top corners `radius/xl`, `elevation/3`, `z/sheet`, drag handle (`neutral/300` pill) → header (title `h2` + optional close [IconButton](#2-iconbutton)) → content (inset `space/6`) → footer actions.

**Variants:** modal (with scrim, blocking), standard (peek/expand), full-height.

**Sizes:** content-height, half, full; max snap with safe-area inset.

**States:** entering (slide+fade), at-rest, dragging, dismissing (swipe-down/scrim tap); loading content → skeleton; disabled actions per state.

**Tokens:** `radius/xl`, `elevation/3`, `z/sheet`, scrim, `space/6`, `neutral/300` (handle), `h2`.

**RTL/a11y:** content lays out RTL; close at reading-end of header; focus trapped, Esc/back dismisses, `role="dialog"` `aria-modal`. Used for filters, slot picking, confirmations.

---

## 18. Modal / Dialog

**Anatomy:** centered scrim + panel (`radius/xl`, `elevation/4`, `z/modal`, max-width 480 on web) → title (`h2`) → body (`body`) → action row (start: ghost cancel / end: primary or destructive confirm).

**Variants:** confirmation, destructive-confirm (e.g. cancel booking → uses [destructive button](#1-button)), informational, form dialog.

**States:** open; loading (confirm button [loading state](#1-button)); error (inline [Banner](#20-banner) inside body); dismissing.

**Tokens:** `radius/xl`, `elevation/4`, `z/modal`, scrim, `space/6`, `h2`/`body`, button tokens, `error/500` (destructive).

**RTL/a11y:** action button order respects RTL (confirm at reading-end); focus trap + return focus to invoker; `role="alertdialog"` for destructive. Backdrop tap dismisses only non-destructive dialogs.

---

## 19. Toast / Snackbar

**Anatomy:** floating pill/`radius/lg` bar (`elevation/4`, `z/toast`, always topmost) → optional status icon (`icon/sm`) → message (`body`, 1–2 lines) → optional action (`label`, `action/primary` on dark / inverse). Auto-dismiss ~4s.

**Variants:** neutral, success, error, with-action (e.g. "تم الإلغاء — تراجع").

**Sizes:** single bar, max-width on web, full-width-minus-gutter on mobile (bottom, above [BottomNavBar](#25-bottomnavbar)).

**States:** entering (slide-up/fade); visible; action-hover/press; auto/swipe dismiss; queued (one at a time).

**Tokens:** `radius/lg`, `elevation/4`, `z/toast`, `space/3`–`space/4`, `body`/`label`, semantic `/500` icon, `neutral/800` bg (light, high-contrast) / `neutral/0` text.

**RTL/a11y:** icon at reading-start, action at reading-end; `role="status"` (polite) / `role="alert"` for errors; does not steal focus; respects safe area + nav bar offset.

---

## 20. Banner (success / warning / error / info)

**Anatomy:** inline full-width block (`radius/lg`) within content → leading status icon (`icon/sm`) → title (`label`) + message (`body`) → optional trailing action link / dismiss ✕.

**Variants** (bg = semantic `/100`, icon/accent = semantic `/500`):

| Variant | bg | accent | Example |
|---|---|---|---|
| success | `success/100` | `success/500` | "تم الدفع بنجاح" |
| warning | `warning/100` | `warning/500` | "رصيد المحفظة منخفض" |
| error | `error/100` | `error/500` | "فشل الدفع، حاولي مجدداً" |
| info | `info/100` | `info/500` | "المقدّمة في الطريق" |

**Sizes:** content-width; compact (1-line) or stacked.

**States:** static; dismissible (✕ at end); action link hover/press/focus.

**Tokens:** `radius/lg`, semantic `/100`+`/500`, `icon/sm`, `label`/`body`, `space/3`–`space/4`.

**RTL/a11y:** icon at start; non-modal, `role="status"`/`role="alert"` by severity; color paired with icon+text.

---

## 21. Badge

**Anatomy:** tiny count/dot overlay on an icon/avatar; numeric badge pill (`radius/full`) `error/500` bg + `neutral/0` text (`overline`/min `caption`), or bare dot.

**Variants:** dot (unread indicator), count (e.g. chat/notifications), label badge (premium → `secondary/500`).

**Sizes:** dot 8, count min 16 height.

**States:** present/absent; count caps at "٩٩+"; pulse on new (optional).

**Tokens:** `radius/full`, `error/500`, `secondary/500`, `neutral/0`, `overline`, `space/1` offset.

**RTL/a11y:** positioned at trailing-top (reading-end). Announced as part of host accessible name ("الإشعارات، ٣ غير مقروءة"); never count-by-color alone.

---

## 22. Skeleton loader

**Anatomy:** placeholder shapes (rects `radius/md`, circles `radius/full`, lines `radius/sm`) in `neutral/100` (light) / `neutral/700` (dark) with a shimmer sweep.

**Variants:** card skeleton, list-row skeleton, avatar+text, slot-grid skeleton — each mirrors the real component's layout.

**Sizes:** match the component they stand in for.

**States:** animating (shimmer) → swap to content on load → on failure swap to [error-with-retry](#28-global-states).

**Tokens:** `neutral/100`/`neutral/700`, `radius/sm`/`md`/`full`, `space/*` matching target.

**RTL/a11y:** shimmer sweep direction follows reading direction; container `aria-busy="true"`, hidden from AT label noise (`aria-hidden` on shapes, single "جارٍ التحميل" live note).

---

## 23. EmptyState

**Anatomy:** centered illustration/glyph (`icon/xl`, `neutral/400`) → title (`h3`) → supportive text (`body`, `text/secondary`) → optional primary [Button](#1-button) CTA. Padding `space/8`.

**Variants:** no-results (search), no-bookings, no-portfolio (provider prompt to add), no-notifications, no-chat.

**States:** static; CTA states inherit [Button](#1-button).

**Tokens:** `icon/xl`, `neutral/400`, `h3`/`body`, `text/secondary`, `space/8`, button tokens.

**RTL/a11y:** centered (direction-neutral); meaningful heading + text (not just art); CTA actionable. See [global states](#28-global-states).

---

## 24. AppBar / Header

**Anatomy:** bar height 56 (`z/appbar`), `bg/canvas`, `elevation/0` at top → `elevation/2` on scroll → leading (back [IconButton](#2-iconbutton), **chevron mirrors**) → title (`h2`/`h3`, may center or start-align) → trailing actions (IconButtons / [Badge](#21-badge)).

**Variants:** default, large/collapsing title, search-mode ([SearchBar](#6-searchbar) inline), transparent (over hero).

**Sizes:** standard 56; large 96 collapsing.

**States:** at-top (flat); scrolled (raised + divider); search-active; loading (title skeleton).

**Tokens:** `z/appbar`, `bg/canvas`, `elevation/2`, `icon/md`, `h2`/`h3`, `space/4`, safe-area top inset.

**RTL/a11y:** **back chevron mirrors** ([spacing §9.2](03-spacing-layout.md)); leading=back at reading-start; actions at reading-end; back has `aria-label="رجوع"`; `role="banner"`/header landmark.

---

## 25. BottomNavBar

**Anatomy:** 3–5 tabs, each = icon (`icon/md`) + label (`caption`/`overline`); bar `z/appbar`, `bg/surface-raised`, top border `border/default`, safe-area bottom inset. Active = filled icon + label in `action/primary`; inactive = outline icon + `text/secondary`.

**Variants:** client tabs (Discover / Bookings / Chat / Profile), provider tabs (Dashboard / Bookings / Wallet / Chat / Profile). Admin uses web nav, not this bar.

**Sizes:** bar height 56 + inset; each tab ≥44 wide.

**States:** active; inactive; pressed (ripple/tint); badge on tab (chat/notifications) via [Badge](#21-badge); disabled rare.

**Tokens:** `z/appbar`, `bg/surface-raised`, `border/default`, `action/primary`, `text/secondary`, `icon/md`, `caption`/`overline`, `space/1`.

**RTL/a11y:** tab order reverses with RTL (first tab at reading-start); icons that are directional (none here typically) would mirror; each tab `role="tab"` `aria-selected`, label always shown (not icon-only).

---

## 26. FAB (Floating Action Button)

**Anatomy:** circular (`radius/full`) 56 button, `action/primary` bg, `text/on-primary` icon (`icon/md`), `elevation/3`, `z/fab`, anchored bottom-end above [BottomNavBar](#25-bottomnavbar).

**Variants:** standard, extended (icon + `label`), mini 40.

**States:** default; hover `primary/600`/lift; pressed `action/primary-pressed`; focus ring; disabled `neutral/300`; loading spinner.

**Tokens:** `radius/full`, `action/primary`, `action/primary-pressed`, `text/on-primary`, `elevation/3`, `z/fab`, `icon/md`, `label` (extended).

**RTL/a11y:** anchored at reading-**end** bottom (start in RTL flips to physical left). Must have `aria-label`. Provider "add service"/"new" actions.

---

## 27. ChatBubble (sent / received / image)

**Anatomy:** bubble (`radius/lg` with the corner nearest the sender squared to `radius/sm`) → message text (`body`) or image (radius `radius/md`) → footer row: timestamp (`caption`, Arabic-Indic in `ar`) + read receipt (✓/✓✓, `info/500` when read).

**Variants**

| Variant | bg | text | Alignment |
|---|---|---|---|
| `sent` | `action/primary` | `text/on-primary` | reading-end |
| `received` | `bg/surface` + `border/default` | `text/primary` | reading-start |
| `image` | image fill, caption below | — | per sender |

**Sizes:** max-width ~78% of column; image thumbnails cap then open full.

**States:** default; sending (clock/spinner, 60% opacity); sent (✓); delivered/read (✓✓ `info/500`); failed (red ↻ retry + `error/500`); image loading skeleton; long-press → action sheet.

**Tokens:** `radius/lg`/`radius/sm`/`radius/md`, `action/primary`, `bg/surface`, `border/default`, `text/on-primary`/`text/primary`, `caption`, `info/500`, `error/500`, `space/2`–`space/3`.

**RTL/a11y:** sent bubbles align to reading-end, received to reading-start (auto-flips in RTL); the **send icon in composer mirrors** ([spacing §9.2](03-spacing-layout.md)); timestamps localized; receipts have text equivalents ("تم الإرسال"/"تمت القراءة"). Image has alt. Supports image sharing per [communication ✚](../00-overview/01-product-brief.md).

---

## 28. Money / Price display

**Anatomy:** amount (`h3` weight 700, Arabic-Indic digits in `ar`) + currency unit (`caption`) — e.g. **٢٥٠ ر.س** (`ar`) / **SAR 250** (`en`). Optional strikethrough original price (`text/secondary`) for discounts; optional "/الخدمة" or "/الساعة" suffix (`caption`).

**Variants:** inline price (cards), large (checkout total `h2`/`h1`), wallet balance, payout amount, discounted (was/now), free ("مجاناً").

**Sizes:** inline `h3`; emphasis `h2`/`h1`; secondary `body`.

**States:** static; loading skeleton; pending (e.g. escrow held → paired with `warning/500` note); refunded/negative shown with sign and `text/secondary`.

**Tokens:** `h1`/`h2`/`h3`/`caption`/`body`, `text/primary`/`text/secondary`, `success/500` (paid), `warning/500` (held/pending), `space/1`.

**RTL/a11y:** the amount+currency is formatted via locale `Intl.NumberFormat` ([spacing §9.4](03-spacing-layout.md)); the numeric run is bidi-isolated; currency `ر.س` follows amount in `ar`. Accessible label reads full ("مئتان وخمسون ريال" or "250 ريال" per implementation), never digits-by-color. Used in service/booking cards, [wallet & payouts](../00-overview/03-glossary.md).

---

## 29. Global states (cross-screen)

These three states are standardized so every list/detail/feed behaves identically.

### 29.1 Loading — Skeleton
- Use a [Skeleton loader](#22-skeleton-loader) matching the destination layout (card grid → card skeletons; list → row skeletons; detail → header+blocks).
- Never block the screen with a bare spinner for content areas; reserve spinners for inline/button/async-validation. `aria-busy="true"` on the region.

### 29.2 Empty
- Use [EmptyState](#23-emptystate) with a context-specific message + a CTA that resolves it (e.g. no-portfolio → "أضيفي عملاً"; no-bookings → "تصفّحي الخدمات").
- Empty ≠ error: empty is a valid zero-result state, neutral tone.

### 29.3 Error — with retry
- Centered error glyph (`icon/xl`, `error/500`), title (`h3`), explanation (`body`, `text/secondary`), and a **secondary [Button](#1-button) "إعادة المحاولة"**; for inline/section failures use an [error Banner](#20-banner) with a retry action.
- Distinguish: validation errors live on the field ([TextInput error](#3-textinput)); transient/network failures use error-with-retry; destructive failures use [Toast](#19-toast--snackbar) or [Modal](#18-modal--dialog).
- `role="alert"`; retry button is keyboard-focusable; preserve user input across retry.

> All three states inherit the same tokens already defined above and must respect RTL and AA contrast ([colors §6](01-colors.md)).
