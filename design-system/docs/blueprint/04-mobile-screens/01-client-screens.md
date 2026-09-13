# Mobile Screens — Client (عميلة)

> **Build blueprint, client role.** Every screen consumes **named tokens only** — colors from [colors](../02-design-system/01-colors.md), type from [typography](../02-design-system/02-typography.md), spacing/radius/elevation/icons/z from [spacing-layout](../02-design-system/03-spacing-layout.md) — and named components from [components](../02-design-system/04-components.md). No hardcoded hex/sizes/strings outside the i18n layer. Arabic-first/RTL per [spacing §9](../02-design-system/03-spacing-layout.md). Role = `client` per [personas-roles §3](../00-overview/02-personas-roles.md). Flow alignment: [client-booking](../03-user-flows/03-client-booking.md); shared pre-auth + chat + support in [shared-screens](03-shared-screens.md); provider counterparts in [provider-screens](02-provider-screens.md).
>
> **Navigation shell.** Client tabs use [BottomNavBar](../02-design-system/04-components.md#25-bottomnavbar) (Discover / Bookings / Chat / Profile). Stack routing is **Expo Router** (file-based). Tab group `(client)`; modal/flow screens are pushed stacks. Booking-status enum + tokens are canonical per [colors §3](../02-design-system/01-colors.md) and rendered via [StatusChip](../02-design-system/04-components.md#10-statuschip).
>
> **Booking-status enum (canonical, from the flow):** `pending_provider` · `confirmed` · `rejected` · `expired` · `on_the_way` · `checked_in` · `in_progress` · `completed` · `cancelled_by_client` · `cancelled_by_provider` · `no_show_client` · `no_show_provider` · `disputed`. Status→token mapping per [colors §3](../02-design-system/01-colors.md).

## Screen index

| ID | Name (AR / EN) | Route | Flow ref |
|---|---|---|---|
| CLI-01 | الرئيسية / Home — Discovery | `app/(client)/index.tsx` | [booking §4.1](../03-user-flows/03-client-booking.md) `CLI-10` |
| CLI-02 | عوامل التصفية / Search Filters | `app/(client)/search/filters.tsx` | [booking §4.2](../03-user-flows/03-client-booking.md) |
| CLI-03 | نتائج البحث / Search Results | `app/(client)/search/results.tsx` | `CLI-11` |
| CLI-04 | ملف المقدّمة / Provider Profile | `app/(client)/provider/[id]/index.tsx` | `CLI-12` |
| CLI-05 | تفاصيل الخدمة / Service Detail | `app/(client)/provider/[id]/service/[serviceId].tsx` | `CLI-13` |
| CLI-06 | إنشاء الحجز / Booking Create | `app/(client)/booking/new/index.tsx` | `CLI-14`+`CLI-15` |
| CLI-07 | مراجعة ودفع / Booking Review & Pay | `app/(client)/booking/new/review.tsx` | `CLI-16` |
| CLI-08 | طريقة الدفع / Payment Method | `app/(client)/booking/new/pay.tsx` | `CLI-17` |
| CLI-09 | تأكيد الحجز / Booking Confirmation | `app/(client)/booking/new/confirmed.tsx` | `CLI-18` |
| CLI-10 | تفاصيل الحجز / Booking Detail | `app/(client)/booking/[id]/index.tsx` | `CLI-22`/`23`/`24`/`25`/`27`/`28` |
| CLI-11 | حجوزاتي / My Bookings | `app/(client)/bookings.tsx` | `CLI-20` |
| CLI-12 | التقييم والمراجعة / Rate & Review | `app/(client)/booking/[id]/review.tsx` | `CLI-26` |
| CLI-13 | الملف الشخصي / Client Profile | `app/(client)/profile.tsx` | — |
| CLI-14 | العناوين المحفوظة / Saved Addresses | `app/(client)/profile/addresses.tsx` | `CLI-14` (G12) |
| CLI-15 | طرق الدفع / Payment Methods | `app/(client)/profile/payment-methods.tsx` | — |
| CLI-16 | الإشعارات / Notifications | `app/(client)/notifications.tsx` | — |
| CLI-17 | المفضّلة / Favorites | `app/(client)/favorites.tsx` | — |

---

## CLI-01 · الرئيسية / Home — Discovery

- **Purpose** — Entry to the booking funnel: location context + specialty tiles + nearby/featured providers, plus free-text search. Mirrors [booking §4.1](../03-user-flows/03-client-booking.md) (`CLI-10`).
- **Route** — `app/(client)/index.tsx` (first tab of `(client)` group).
- **Entry points** — Post-auth landing for `is_new=false` clients ([authentication §4](../03-user-flows/02-authentication.md)); Discover tab in [BottomNavBar](../02-design-system/04-components.md#25-bottomnavbar); deep link `nora://home`; back from any pushed flow screen.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) `transparent` over a `bg/tint` hero band: leading location pill (📍 `icon/sm`, area name in `body`, chevron — opens location BottomSheet), trailing notifications [IconButton](../02-design-system/04-components.md#2-iconbutton) with unread [Badge](../02-design-system/04-components.md#21-badge).
  - [SearchBar](../02-design-system/04-components.md#6-searchbar) `standalone`, placeholder "ابحثي عن خدمة أو مقدّمة" — tap routes to CLI-03 in query mode.
  - Specialty tiles row: horizontal scroll of category [Chips](../02-design-system/04-components.md#9-chip--tag) `assist` (ميك أب / شعر / أظافر / عناية بالبشرة / حنّاء) with leading `icon/xs`, gap `space/2`.
  - Section header (`h2`, `space/5` above) "مقدّمات قريبة منكِ" → vertical list of [Provider cards](../02-design-system/04-components.md#13-provider-card), gap `space/3`, gutter `space/4`.
  - Optional "مميّزات" (premium/boosted) carousel of Provider cards with `secondary/100` premium badge for Gold/Platinum `visibility_boost`.
- **States**
  - **default** — location resolved; specialty chips + provider list rendered.
  - **loading** — [Skeleton](../02-design-system/04-components.md#22-skeleton-loader) card variant (3–4 rows) under the hero; `aria-busy`.
  - **empty** — no nearby providers → inline [EmptyState](../02-design-system/04-components.md#23-emptystate) `no-results` ("لا توجد مقدّمات قريبة") with CTA "وسّعي نطاق البحث" → CLI-02 with widened radius.
  - **error** — search/bootstrap fail → [global error-with-retry §29.3](../02-design-system/04-components.md#29-global-states) with "إعادة المحاولة".
  - **success** — n/a transient; tapping a chip/card transitions to results/profile.
- **Interactions**
  - Tap location pill → location-picker BottomSheet (uses [permission prompt SHR-15](03-shared-screens.md) if location not granted) → re-query `GET /providers/search`.
  - Tap notifications IconButton → CLI-16.
  - Tap SearchBar → CLI-03 in free-text mode (focused input).
  - Tap specialty Chip → CLI-03 pre-filtered `specialty=`.
  - Tap Provider card body → CLI-04; tap card heart [IconButton](../02-design-system/04-components.md#2-iconbutton) → toggle favorite (optimistic; [Toast](../02-design-system/04-components.md#19-toast--snackbar) "أُضيفت للمفضّلة" / "أُزيلت").
  - Pull-to-refresh → re-fetch search.
- **Navigation** — **From:** auth landing, Discover tab. **To:** CLI-02, CLI-03, CLI-04, CLI-16, location sheet, SHR-15.
- **APIs consumed** — `GET /api/v1/providers/search?lat&lng&specialty&q&sort` ; `GET /api/v1/me/notifications?unread=1` (badge count) ; favorite toggle `POST/DELETE /api/v1/me/favorites/{providerId}`.
- **RTL & a11y** — RTL-first; location pin + chevron mirror, search lens does **not** mirror ([spacing §9.2](../02-design-system/03-spacing-layout.md)). Distances/ratings as Arabic-Indic in `ar`. Each Provider card is one composed accessible label (name + rating + distance + favorite state). Location pill announces current area; heart announces favorite state, not color.

---

## CLI-02 · عوامل التصفية / Search Filters

- **Purpose** — Refine the provider search: specialty, radius, price range, minimum rating, availability window, sort.
- **Route** — `app/(client)/search/filters.tsx` (presented as modal stack / [BottomSheet](../02-design-system/04-components.md#17-bottomsheet) `modal`).
- **Entry points** — Filter IconButton in CLI-01 SearchBar / CLI-03 AppBar; "وسّعي نطاق البحث" CTA from CLI-01/CLI-03 empty states.
- **Layout / components**
  - [BottomSheet](../02-design-system/04-components.md#17-bottomsheet) `full-height` with drag handle + header (`h2` "تصفية" + close IconButton at reading-end).
  - Specialty: row of filter [Chips](../02-design-system/04-components.md#9-chip--tag) (multi-select, `bg/tint`+`primary/300` when active).
  - Radius: labeled slider (`label` + value `caption` in km, Arabic-Indic) — rendered as a stepped control with `action/primary` track.
  - Price range: dual-thumb slider with [Money display](../02-design-system/04-components.md#28-moneyprice-display) endpoints.
  - Minimum rating: [RatingStars](../02-design-system/04-components.md#12-ratingstars) `input` (1–5).
  - Availability: [Chips](../02-design-system/04-components.md#9-chip--tag) (اليوم / هذا الأسبوع / أي وقت).
  - Sort [Dropdown](../02-design-system/04-components.md#7-dropdownselect): الأقرب / الأعلى تقييماً / المميّزة أولاً.
  - Footer actions: ghost [Button](../02-design-system/04-components.md#1-button) "مسح" (reset) at reading-start; primary `lg` Button "عرض النتائج" at reading-end.
- **States**
  - **default** — current filter values pre-filled from query params.
  - **loading** — live result count chip shows inline spinner while a debounced count query runs.
  - **empty** — n/a (filters always render); a "٠ نتيجة" count is allowed and disables nothing.
  - **error** — count query fails → silent fallback; "عرض النتائج" still navigates and CLI-03 surfaces the error.
  - **success** — "عرض النتائج" applies filters to CLI-03.
- **Interactions** — Toggle any Chip/slider/stars/sort → debounced `GET /providers/search?...&count_only=1` updates the "عرض النتائج (N)" label. "مسح" resets all to defaults. Close/scrim/back dismisses **without** applying (non-destructive sheet). "عرض النتائج" → CLI-03 with the composed query.
- **Navigation** — **From:** CLI-01, CLI-03. **To:** CLI-03 (apply) or back (dismiss).
- **APIs consumed** — `GET /api/v1/providers/search?...&count_only=1` (live count) ; full results fetched by CLI-03.
- **RTL & a11y** — Sliders direction-aware (low value at reading-start). Footer button order respects RTL (primary at reading-end per [Modal a11y](../02-design-system/04-components.md#18-modal--dialog)). Each filter group has a programmatic label; rating slider exposes `role="slider"` 1–5. Backdrop tap dismisses (non-destructive).

---

## CLI-03 · نتائج البحث / Search Results

- **Purpose** — Ranked list of discoverable providers (distance + rating + `visibility_boost`) matching the query/filters. Mirrors `CLI-11` in [booking §4.2](../03-user-flows/03-client-booking.md).
- **Route** — `app/(client)/search/results.tsx` (query params `q`, `specialty`, `sort`, filter set).
- **Entry points** — CLI-01 SearchBar/chip, CLI-02 "عرض النتائج", deep link `nora://search?...`.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) with back IconButton (chevron mirrors), inline [SearchBar](../02-design-system/04-components.md#6-searchbar), trailing filter IconButton with active-filter [Badge](../02-design-system/04-components.md#21-badge) dot.
  - Result count + sort row ("١٢ مقدّمة" `caption` + sort [Chip](../02-design-system/04-components.md#9-chip--tag)/Dropdown).
  - Vertical list of [Provider cards](../02-design-system/04-components.md#13-provider-card) (gap `space/3`); boosted providers carry `secondary/100`/`secondary/700` premium badge; providers not `accepting_bookings` render the card **unavailable** state (dimmed + "غير متاحة حالياً").
- **States**
  - **default** — provider cards listed; infinite scroll appends pages.
  - **loading** — initial: [Skeleton](../02-design-system/04-components.md#22-skeleton-loader) provider-card rows; paging: footer inline spinner.
  - **empty** — `[]` → [EmptyState](../02-design-system/04-components.md#23-emptystate) `no-results` "لا توجد مقدّمات خدمة قريبة" with actions: widen radius (→CLI-02), change specialty, clear filters; soft-fallback nearest few may render below per [booking §6.1](../03-user-flows/03-client-booking.md).
  - **error** — [error-with-retry §29.3](../02-design-system/04-components.md#29-global-states).
  - **success** — tap card → CLI-04.
- **Interactions** — Tap card → CLI-04; tap heart → favorite toggle (Toast); tap filter → CLI-02; edit SearchBar → re-query; change sort → re-query; pull-to-refresh; reach list end → load next page. Unavailable cards are non-tappable for booking (still openable to view profile, with booking disabled there).
- **Navigation** — **From:** CLI-01, CLI-02. **To:** CLI-04, CLI-02.
- **APIs consumed** — `GET /api/v1/providers/search?lat&lng&specialty&q&sort&page` ; favorite toggle `POST/DELETE /api/v1/me/favorites/{providerId}`.
- **RTL & a11y** — Cards lay out RTL; trailing drill-in mirrors. Results count announced via live region on each query. Premium badge has text equivalent ("مميّزة — ذهبي"). Unavailable state conveyed by label, not dimming alone.

---

## CLI-04 · ملف المقدّمة / Provider Profile (public)

- **Purpose** — Public provider profile: portfolio, services (price+duration), ratings/reviews, availability teaser, chat/favorite — the pre-booking decision screen. Mirrors `CLI-12`.
- **Route** — `app/(client)/provider/[id]/index.tsx`.
- **Entry points** — Provider cards (CLI-01/03/17), deep link `https://nora-beauty.app/p/{slug}` → resolved to id, chat list entry, notification tap.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) `transparent`→raised on scroll: back IconButton (mirrors), trailing share + favorite [IconButtons](../02-design-system/04-components.md#2-iconbutton).
  - Header block: [Avatar](../02-design-system/04-components.md#11-avatar) `xl` (premium ring `secondary/500` if boosted), name (`h1`, 1-line), specialty (`caption`/`text/secondary`), [RatingStars](../02-design-system/04-components.md#12-ratingstars) display + review count, area/distance row (pin `icon/xs`).
  - Premium badge (`secondary/100`/`secondary/700`) when Gold/Platinum.
  - Portfolio gallery: horizontal scroll of thumbnails (`radius/md`), tap → full-screen viewer.
  - Services section (`h2` "الخدمات"): list of [Service cards](../02-design-system/04-components.md#14-service-card) — name (`h3`), 2-line desc, [Money display](../02-design-system/04-components.md#28-moneyprice-display) + duration `caption`, primary Button "احجزي".
  - Reviews section (`h2` "التقييمات"): summary stars + paginated review [ListItems](../02-design-system/04-components.md#16-listitem) (avatar, name, stars, text, date).
  - Sticky footer bar: secondary Button "مراسلة" (chat) at reading-start + primary `lg` Button "احجزي الآن" at reading-end.
- **States**
  - **default** — full profile rendered.
  - **loading** — header skeleton + service/review skeleton rows.
  - **empty** — provider with no reviews → inline "لا توجد تقييمات بعد"; no portfolio is not possible for discoverable providers (`profile_complete` requires ≥1 item).
  - **error** — `404`/network → [error-with-retry §29.3](../02-design-system/04-components.md#29-global-states); deleted provider routes home with toast ([onboarding §7](../03-user-flows/01-onboarding.md)).
  - **success** — selecting a service / "احجزي" → CLI-05 or directly CLI-06.
  - **provider unavailable** — not `accepting_bookings`: booking Buttons disabled with helper "غير متاحة حالياً"; chat + favorite remain enabled.
- **Interactions** — Tap portfolio thumb → full-screen gallery (swipe, pinch). Tap Service card / "احجزي" → CLI-05 (detail) or CLI-06 (create) per service complexity. Tap "مراسلة" → SHR-07 Chat Conversation. Tap favorite/share. Tap "عرض الكل" reviews → reviews list (paged). "احجزي الآن" footer → CLI-05/CLI-06 with the first/selected service.
- **Navigation** — **From:** CLI-01/03/17, deep link, chat, notifications. **To:** CLI-05, CLI-06, SHR-07, gallery viewer.
- **APIs consumed** — `GET /api/v1/providers/{id}` ; `GET /api/v1/providers/{id}/services` ; `GET /api/v1/providers/{id}/reviews?page` ; favorite `POST/DELETE /api/v1/me/favorites/{providerId}`.
- **RTL & a11y** — Name + Latin service terms bidi-isolated ([spacing §9.3](../02-design-system/03-spacing-layout.md)). Gallery swipe direction follows reading order. Stars order fills from reading-start. Footer button order RTL-correct. Each service announces "name، price، duration، احجزي".

---

## CLI-05 · تفاصيل الخدمة / Service Detail

- **Purpose** — Single-service detail with full description, price, duration, optional add-ons preview before starting a booking. Mirrors `CLI-13` (service select).
- **Route** — `app/(client)/provider/[id]/service/[serviceId].tsx`.
- **Entry points** — Service card / "احجزي" on CLI-04; deep link to a specific service.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back IconButton + title `h3` (service name) + favorite IconButton.
  - Service media (thumbnail/gallery, `radius/md`).
  - Title (`h2`), full description (`body-lg`), [Money display](../02-design-system/04-components.md#28-moneyprice-display) (`h2` emphasis) + duration row (`caption`, e.g. "٤٥ دقيقة").
  - Add-ons preview: selectable [ListItems](../02-design-system/04-components.md#16-listitem) with checkbox + per-item [Money display](../02-design-system/04-components.md#28-moneyprice-display) (these are *preview*; in-visit add-ons are approved later on CLI-10).
  - Provider mini-card ([Provider card](../02-design-system/04-components.md#13-provider-card) compact) linking back to CLI-04.
  - Sticky footer: running total [Money display](../02-design-system/04-components.md#28-moneyprice-display) + primary `lg` Button "متابعة الحجز".
- **States**
  - **default** — service + selectable add-ons.
  - **loading** — media + text skeleton.
  - **empty** — n/a (a service always has price+duration per [service system ✚](../00-overview/01-product-brief.md)).
  - **error** — [error-with-retry §29.3](../02-design-system/04-components.md#29-global-states).
  - **success** — "متابعة الحجز" → CLI-06 carrying selected `service_ids` + add-ons.
- **Interactions** — Toggle add-on ListItem checkbox → footer total recomputes (client-side preview). Tap provider mini-card → CLI-04. "متابعة الحجز" → CLI-06. Favorite/back.
- **Navigation** — **From:** CLI-04. **To:** CLI-06, CLI-04.
- **APIs consumed** — `GET /api/v1/providers/{id}/services` (or `/{serviceId}` detail) for the service + its add-on catalog. No write here.
- **RTL & a11y** — Price/duration Arabic-Indic, bidi-isolated. Add-on checkboxes announce selected state + price delta. Footer total announced on change (polite live region).

---

## CLI-06 · إنشاء الحجز / Booking Create (address + date + time slot)

- **Purpose** — Collect the two booking inputs the slot computation needs: **address** (saved/new) and **date + conflict-aware time slot** sized to the summed service duration. Combines `CLI-14` (address) + `CLI-15` (date/time).
- **Route** — `app/(client)/booking/new/index.tsx` (params: `provider_id`, `service_ids[]`, `addon_ids[]`).
- **Entry points** — "متابعة الحجز" (CLI-05) / "احجزي الآن" (CLI-04).
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back + title `h2` "احجزي موعدك" + step indicator (stepper, direction-aware).
  - **Address block** (`h3` "العنوان"): [Saved-address ListItems](../02-design-system/04-components.md#16-listitem) (radio-select, leading pin `icon/sm`, label + truncated address) + "أضيفي عنواناً جديداً" ListItem (trailing chevron) → map-pin picker BottomSheet → `POST /me/addresses`.
  - **Date block** ([DatePicker](../02-design-system/04-components.md#8-datepicker--timeslotpicker), locale week start Sun for `ar-SA`, month chevrons mirror).
  - **Time-slot block** ([TimeSlotPicker](../02-design-system/04-components.md#8-datepicker--timeslotpicker): morning/afternoon/evening grouped slot [Chips](../02-design-system/04-components.md#9-chip--tag); only slots fitting summed duration without overlap are enabled; unavailable struck/disabled).
  - Sticky footer: selected date+time summary (`label`) + primary `lg` Button "متابعة" (enabled only when address + slot chosen).
- **States**
  - **default** — saved addresses + calendar; slots load for the selected date.
  - **loading** — availability fetch → [Skeleton](../02-design-system/04-components.md#22-skeleton-loader) slot-grid; address list skeleton on first load.
  - **empty** — no saved addresses → inline [EmptyState](../02-design-system/04-components.md#23-emptystate) `no-results`-style prompt "أضيفي عنوانك الأول"; a date with no slots → "لا توجد مواعيد متاحة في هذا اليوم" with hint to pick another day.
  - **error** — availability load fail → inline [error-with-retry §29.3](../02-design-system/04-components.md#29-global-states) in the slot block (preserves address/date selection).
  - **success** — "متابعة" → CLI-07.
- **Interactions** — Select address radio; "أضيفي عنواناً جديداً" → map BottomSheet (uses [SHR-15 location permission](03-shared-screens.md) if needed), drop pin, label, save → list refreshes + auto-selects. Pick date → re-fetch slots for that date. Pick slot Chip → footer updates. "متابعة" → CLI-07. Back preserves draft.
- **Navigation** — **From:** CLI-04/05. **To:** CLI-07, address map sheet, SHR-15.
- **APIs consumed** — `GET /api/v1/me/addresses` ; `POST /api/v1/me/addresses` ; `GET /api/v1/providers/{id}/availability?date&service_ids` (per [booking §4.6](../03-user-flows/03-client-booking.md)).
- **RTL & a11y** — Calendar day grid follows `ar-SA` week start (not arbitrary mirror); month nav chevrons mirror; clock glyph does not mirror ([components DatePicker a11y](../02-design-system/04-components.md#8-datepicker--timeslotpicker)). Each day cell + slot chip has full `aria-label` (date/time in Arabic-Indic). Selected slot announced. Address radios grouped with role labels.

---

## CLI-07 · مراجعة ودفع / Booking Review & Pay

- **Purpose** — Server-computed price breakdown (services + add-ons + any travel fee), cancellation/refund policy notice, then create the booking (`pending_provider`) before payment. Mirrors `CLI-16`.
- **Route** — `app/(client)/booking/new/review.tsx`.
- **Entry points** — "متابعة" from CLI-06.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back + title `h2` "مراجعة الحجز".
  - Summary card ([Booking card](../02-design-system/04-components.md#15-booking-card) style): provider [Avatar](../02-design-system/04-components.md#11-avatar)+name, services list, date+time row (calendar `icon/sm` + clock non-mirrored), address line.
  - Price breakdown rows (`body` label start / [Money display](../02-design-system/04-components.md#28-moneyprice-display) end): services subtotal, add-ons, travel fee, then total ([Money display](../02-design-system/04-components.md#28-moneyprice-display) `h2`).
  - Policy notice [Banner](../02-design-system/04-components.md#20-banner) `info`: cancellation/refund windows summary (100% before accept / ≥24h, 50% 6–24h, 0% <6h per [booking §8.1](../03-user-flows/03-client-booking.md)) with link to full policy.
  - Footer: primary `lg` Button "تأكيد الحجز".
- **States**
  - **default** — quote rendered.
  - **loading** — `POST /bookings/quote` pending → price rows skeleton; button disabled.
  - **empty** — n/a.
  - **error** — quote fails → [error-with-retry §29.3](../02-design-system/04-components.md#29-global-states); `409 slot_unavailable` → [Modal](../02-design-system/04-components.md#18-modal--dialog) "الموعد لم يعد متاحاً" → bounce to CLI-06 to re-pick ([booking §6.2](../03-user-flows/03-client-booking.md)).
  - **success** — `POST /bookings` returns `pending_provider` + hold token → proceed to CLI-08.
- **Interactions** — On mount, call `POST /bookings/quote`. Tap policy link → policy detail sheet. "تأكيد الحجز" → `POST /bookings` (creates `pending_provider`); on success route to CLI-08 (payment sheet); on `409` → CLI-06.
- **Navigation** — **From:** CLI-06. **To:** CLI-08, CLI-06 (on conflict), policy sheet.
- **APIs consumed** — `POST /api/v1/bookings/quote` ; `POST /api/v1/bookings`.
- **RTL & a11y** — Breakdown labels at reading-start, amounts at reading-end (logical). Each amount bidi-isolated, Arabic-Indic. Total announced. Policy Banner `role="status"` with icon+text (color never alone). Confirm button announces it creates a pending booking that is paid next step.

---

## CLI-08 · طريقة الدفع / Payment Method

- **Purpose** — Open the Moyasar payment sheet to **authorize and hold** (escrow) the booking amount — not capture. Mirrors `CLI-17`. Method choices: mada / Apple Pay / STC Pay / card.
- **Route** — `app/(client)/booking/new/pay.tsx` (params: `booking_id`, `hold_token`).
- **Entry points** — "تأكيد الحجز" success on CLI-07.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back (guarded: confirms abandoning the held slot) + title `h2` "الدفع".
  - Held-amount [Money display](../02-design-system/04-components.md#28-moneyprice-display) `h1` with `warning/500` "سيُحجز المبلغ ولن يُخصم حتى اكتمال الخدمة" note (escrow hold semantics).
  - Saved-method [ListItems](../02-design-system/04-components.md#16-listitem) (radio): مدى/بطاقة (last-4 + brand icon), STC Pay, Apple Pay (platform-gated).
  - "إضافة بطاقة" ListItem → Moyasar add-card sheet.
  - Slot-hold countdown (`caption`, `warning/500`) — short grace window per [booking §6.3](../03-user-flows/03-client-booking.md).
  - Footer: primary `lg` Button "ادفعي وأكّدي الحجز".
- **States**
  - **default** — methods listed, amount shown, countdown running.
  - **loading** — gateway sheet open → button [loading state](../02-design-system/04-components.md#1-button); webhook-confirm pending shows inline spinner + "جارٍ تأكيد الدفع".
  - **empty** — no saved method → only "إضافة بطاقة" + wallet options.
  - **error** — decline / 3DS fail / mada reject / webhook timeout → [error Banner](../02-design-system/04-components.md#20-banner) "فشل الدفع، حاولي بطريقة أخرى"; booking auto-voided if hold not confirmed; retry with alternate method within grace; repeated failure → back to CLI-07 with slot released ([booking §6.3](../03-user-flows/03-client-booking.md)).
  - **success** — hold confirmed (gateway success + `payments/webhook`) → CLI-09; booking stays `pending_provider`.
- **Interactions** — Select method radio; "إضافة بطاقة" → Moyasar SDK add-card; "ادفعي وأكّدي الحجز" → `POST /payments/intents` then run gateway flow; await webhook confirmation. Guarded back → [Modal](../02-design-system/04-components.md#18-modal--dialog) "إلغاء الحجز؟" (slot released).
- **Navigation** — **From:** CLI-07. **To:** CLI-09 (success), CLI-07 (abandon/fail), Moyasar SDK sheet.
- **APIs consumed** — `POST /api/v1/payments/intents` ; Moyasar SDK (mada/Apple Pay/STC Pay/card) ; server-side `POST /api/v1/payments/webhook` confirms the hold (gateway→server).
- **RTL & a11y** — Amount + last-4 LTR-isolated. Escrow-hold note paired with `warning/500` icon (color never alone). Countdown is a polite live region. Apple Pay button uses native a11y. Method radios announce brand + last-4.

---

## CLI-09 · تأكيد الحجز / Booking Confirmation

- **Purpose** — Success acknowledgement after a confirmed escrow hold: reminders set, QR placeholder, next-step guidance (awaiting provider accept). Mirrors `CLI-18`.
- **Route** — `app/(client)/booking/new/confirmed.tsx` (param `booking_id`).
- **Entry points** — Successful hold on CLI-08.
- **Layout / components**
  - Centered success illustration + [Banner](../02-design-system/04-components.md#20-banner) `success` "تم حجز موعدك — بانتظار تأكيد المقدّمة" ([StatusChip](../02-design-system/04-components.md#10-statuschip) `pending_provider` shown).
  - Summary [Booking card](../02-design-system/04-components.md#15-booking-card) (provider, services, date/time, address, total).
  - QR placeholder block (`caption` "سيظهر رمز الدخول عند موعد الخدمة") — actual scanner is CLI-10/SHR check-in.
  - Reminders note (`body` "سنذكّرك قبل ٢٤ ساعة وقبل ساعتين").
  - Footer: primary `lg` Button "عرض الحجز" + ghost Button "العودة للرئيسية".
- **States**
  - **default** — success content.
  - **loading** — brief while `GET /bookings/{id}` hydrates the summary.
  - **empty** — n/a.
  - **error** — hydration fail → [error-with-retry §29.3](../02-design-system/04-components.md#29-global-states) (hold already succeeded; booking exists).
  - **success** — this **is** the success screen.
- **Interactions** — "عرض الحجز" → CLI-10; "العودة للرئيسية" → CLI-01; system schedules T-24h/T-2h reminders server-side on provider accept. Back/gesture → CLI-01 (cannot return into the pay flow).
- **Navigation** — **From:** CLI-08. **To:** CLI-10, CLI-01.
- **APIs consumed** — `GET /api/v1/bookings/{id}` (hydrate). Reminder scheduling is server/BullMQ on `confirmed`.
- **RTL & a11y** — Success Banner `role="status"`, icon+text. StatusChip announces "بانتظار التأكيد". Buttons RTL order. Confetti/animation `aria-hidden`.

---

## CLI-10 · تفاصيل الحجز / Booking Detail (status timeline, QR, on-the-way, cancel, reschedule)

- **Purpose** — The live operational hub for one booking: status timeline, on-the-way banner, QR check-in scanner entry, in-visit add-on approval, completion confirm, cancel/reschedule/report-no-show, chat, and dispute. Consolidates flow screens `CLI-22/23/24/25/27/28`.
- **Route** — `app/(client)/booking/[id]/index.tsx`.
- **Entry points** — CLI-09, CLI-11 cards, push/notification deep link `nora://booking/{id}`, chat, confirmation toasts.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back + title `h2` "تفاصيل الحجز" + overflow IconButton (cancel / reschedule / report / dispute, role+status gated).
  - Top [StatusChip](../02-design-system/04-components.md#10-statuschip) (status-colored, icon mandatory) + contextual [Banner](../02-design-system/04-components.md#20-banner): `info` "المقدّمة في الطريق" on `on_the_way`; `warning` on `reschedule_requested`; `error` on `cancelled_*`; `success` on `completed`.
  - Status **timeline** (vertical stepper, direction-aware): pending → confirmed → on_the_way → checked_in → in_progress → completed, with timestamps (Arabic-Indic).
  - Booking summary block (provider [Avatar](../02-design-system/04-components.md#11-avatar)+name, services, date/time, address, [Money display](../02-design-system/04-components.md#28-moneyprice-display) total + escrow-hold note).
  - **Action zone** (status-driven primary [Button](../02-design-system/04-components.md#1-button)):
    - `confirmed`/`on_the_way` → "مسح رمز الدخول" → opens QR scanner (camera, [SHR-17 camera permission](03-shared-screens.md)); fallback "عرض رمزي" presents client QR for provider to scan.
    - `in_progress` → completion confirm appears when provider marks complete: "تأكيد اكتمال الخدمة".
    - add-on proposed during `in_progress` → in-app [Modal](../02-design-system/04-components.md#18-modal--dialog)/sheet "موافقة على خدمة إضافية" (add-on, incremental [Money display](../02-design-system/04-components.md#28-moneyprice-display)) → approve/decline.
  - Secondary actions: "مراسلة" (chat) always (until archived), "إعادة جدولة" / "إلغاء" (status-gated), "لم تصل المقدّمة" (after slot start + grace), "فتح شكوى".
  - Post-completion: "تقييم المقدّمة" → CLI-12.
- **States**
  - **default** — status + timeline + summary; actions reflect current status & refund window.
  - **loading** — detail skeleton (header + timeline + summary blocks); live updates via socket/polling.
  - **empty** — n/a (single entity).
  - **error** — load fail → [error-with-retry §29.3](../02-design-system/04-components.md#29-global-states); action errors surface inline: `409 not_cancellable` after check-in → [Toast](../02-design-system/04-components.md#19-toast--snackbar) + route to dispute; `422 invalid_checkin_token` → scanner error.
  - **success** — action confirmations via [Toast](../02-design-system/04-components.md#19-toast--snackbar): "تم تأكيد اكتمال الخدمة"، "تم الإلغاء — استُرجع المبلغ", etc.
- **Interactions**
  - **QR scan** → opens scanner (`CLI-23`) → `POST /bookings/{id}/checkin` with token → `checked_in`; wrong/expired token → `422` error + ops path via SHR-09 Support.
  - **Approve add-on** → `POST /bookings/{id}/addons/{addonId}/approve` (incremental hold); decline closes sheet.
  - **Confirm completion** → `POST /bookings/{id}/confirm-completion` → `completed`; (auto-confirm after window if untouched).
  - **Cancel** → cancel preview screen/sheet (`CLI-27`): server returns window bucket + refund amount → [destructive Modal](../02-design-system/04-components.md#18-modal--dialog) confirm → `POST /bookings/{id}/cancel` → `cancelled_by_client` + refund.
  - **Reschedule** → reschedule sheet (`CLI-28`): re-check availability → pick new slot → `POST /bookings/{id}/reschedule` (request; existing hold preserved).
  - **Report no-show** → "لم تصل المقدّمة" → `POST /bookings/{id}/report-no-show` → `no_show_provider` (ops review).
  - **Dispute** → "فتح شكوى" → SHR-09 Complaint/Dispute with booking context.
  - **Chat** → SHR-07.
  - **Rate** (post-completion) → CLI-12.
- **Navigation** — **From:** CLI-09/11, push, chat. **To:** QR scanner, cancel preview, reschedule sheet, CLI-06 (re-pick on conflict), CLI-12, SHR-07, SHR-09.
- **APIs consumed** — `GET /api/v1/bookings/{id}` ; `POST /api/v1/bookings/{id}/checkin` ; `POST /api/v1/bookings/{id}/addons/{addonId}/approve` ; `POST /api/v1/bookings/{id}/confirm-completion` ; `POST /api/v1/bookings/{id}/cancel` (preview + confirm) ; `POST /api/v1/bookings/{id}/reschedule` ; `POST /api/v1/bookings/{id}/report-no-show` ; live updates via Socket.IO booking channel.
- **RTL & a11y** — Timeline progresses in reading direction; step icons + labels (color never alone). Status chip + banners have text equivalents. QR camera scanner exposes a clear scanning-region hint; clock glyphs do not mirror. Destructive cancel uses `role="alertdialog"`; refund amount announced before confirm. All status-gated actions are hidden (not just disabled) when the role/status forbids them, but the server remains source of truth ([personas-roles §3](../00-overview/02-personas-roles.md)).

---

## CLI-11 · حجوزاتي / My Bookings (tabs: upcoming / past)

- **Purpose** — List of the client's bookings split into **upcoming** (actionable) and **past** (history/review), each as a status-colored card.
- **Route** — `app/(client)/bookings.tsx` (Bookings tab).
- **Entry points** — Bookings tab in [BottomNavBar](../02-design-system/04-components.md#25-bottomnavbar); "عرض الحجز" from CLI-09; notification deep links.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) title `h1` "حجوزاتي".
  - Segmented tab control (direction-aware): "القادمة" / "السابقة".
  - List of [Booking cards](../02-design-system/04-components.md#15-booking-card) (gap `space/3`): top [StatusChip](../02-design-system/04-components.md#10-statuschip), service+provider, date/time row, address (truncated), price summary, context actions (إعادة جدولة / إلغاء / تقييم depending on status).
- **States**
  - **default** — cards in the active tab; upcoming sorted by soonest, past by recency.
  - **loading** — [Skeleton](../02-design-system/04-components.md#22-skeleton-loader) booking-card rows.
  - **empty** — upcoming empty → [EmptyState](../02-design-system/04-components.md#23-emptystate) `no-bookings` "لا حجوزات قادمة" + CTA "تصفّحي الخدمات" → CLI-01; past empty → "لا حجوزات سابقة".
  - **error** — [error-with-retry §29.3](../02-design-system/04-components.md#29-global-states).
  - **success** — tap card → CLI-10.
- **Interactions** — Switch tab → fetch that segment. Tap card → CLI-10. Inline card actions: "تقييم" (completed) → CLI-12; "إعادة جدولة"/"إلغاء" → CLI-10 action sheets. Pull-to-refresh; infinite scroll on past.
- **Navigation** — **From:** Bookings tab, CLI-09. **To:** CLI-10, CLI-12, CLI-01.
- **APIs consumed** — `GET /api/v1/bookings?scope=upcoming|past&page` (client self).
- **RTL & a11y** — Tab order reverses with RTL; active tab `aria-selected`. Cards composed accessible labels include status text. Cancelled cards desaturated **and** labelled. Dates Arabic-Indic.

---

## CLI-12 · التقييم والمراجعة / Rate & Review

- **Purpose** — Submit 1–5 stars + optional written review tied to a **completed** booking (G5); affects provider ranking. Mirrors `CLI-26`.
- **Route** — `app/(client)/booking/[id]/review.tsx`.
- **Entry points** — "تقييم المقدّمة" on CLI-10 (completed) / "تقييم" on CLI-11 card / post-completion prompt/notification.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back + title `h2` "قيّمي الخدمة".
  - Provider mini-header ([Avatar](../02-design-system/04-components.md#11-avatar) `md` + name + service).
  - [RatingStars](../02-design-system/04-components.md#12-ratingstars) `input` (`icon/md`, 1–5) — required.
  - Optional quick-tag [Chips](../02-design-system/04-components.md#9-chip--tag) (الالتزام بالوقت / النظافة / الاحترافية).
  - [TextInput](../02-design-system/04-components.md#3-textinput) multiline "اكتبي مراجعتك (اختياري)".
  - Footer: primary `lg` Button "إرسال التقييم" (enabled once ≥1 star).
- **States**
  - **default** — empty stars, optional fields.
  - **loading** — submit → button [loading state](../02-design-system/04-components.md#1-button).
  - **empty** — n/a.
  - **error** — submit fail → [error Banner](../02-design-system/04-components.md#20-banner)/[Toast](../02-design-system/04-components.md#19-toast--snackbar) "تعذّر إرسال التقييم"; `409 already_reviewed` → show existing review read-only; `403`/not-completed → block with notice.
  - **success** — `POST /review` → [Toast](../02-design-system/04-components.md#19-toast--snackbar) "شكراً لتقييمك" → back to CLI-10/CLI-11.
- **Interactions** — Tap/drag stars to set value; toggle quick-tags; type review; "إرسال التقييم" → `POST /bookings/{id}/review`. Back discards a draft (confirm if dirty).
- **Navigation** — **From:** CLI-10/11. **To:** back to CLI-10/11.
- **APIs consumed** — `POST /api/v1/bookings/{id}/review`.
- **RTL & a11y** — Stars fill from reading-start; star glyph not mirrored; input `role="slider"` 1–5 with value text. Review tied to completed booking only (server-enforced). Multiline input `textAlign: start`; error via live region.

---

## CLI-13 · الملف الشخصي / Client Profile

- **Purpose** — Client account hub: identity, navigation to addresses/payment methods/favorites/notifications, support, settings, role-switch (if dual-capability), logout.
- **Route** — `app/(client)/profile.tsx` (Profile tab).
- **Entry points** — Profile tab in [BottomNavBar](../02-design-system/04-components.md#25-bottomnavbar).
- **Layout / components**
  - Header: [Avatar](../02-design-system/04-components.md#11-avatar) `xl` + name (`h2`) + phone (LTR-isolated `+966 …`, `caption`) + "تعديل الملف" ghost Button → SHR-12 Edit Profile.
  - Navigational [ListItems](../02-design-system/04-components.md#16-listitem) (trailing chevron, mirrors): العناوين المحفوظة (→CLI-14), طرق الدفع (→CLI-15), المفضّلة (→CLI-17), الإشعارات (→CLI-16), المحادثات (→SHR-06), الدعم (→SHR-08), الإعدادات (→SHR-11).
  - "كوني مقدّمة خدمة" ListItem (become-provider) → provider onboarding [PRV-01](02-provider-screens.md) (same account gains capability per [personas-roles §1](../00-overview/02-personas-roles.md)); for dual-capability accounts shows a role-switch toggle instead.
  - Destructive "تسجيل الخروج" [Button](../02-design-system/04-components.md#1-button) (ghost/destructive).
- **States**
  - **default** — profile + menu.
  - **loading** — header skeleton + list-row skeletons.
  - **empty** — n/a.
  - **error** — profile load fail → [error-with-retry §29.3](../02-design-system/04-components.md#29-global-states).
  - **success** — navigation to sub-screens.
- **Interactions** — Tap any ListItem → its screen. "كوني مقدّمة خدمة" → PRV-01 / role switch. "تسجيل الخروج" → confirm [Modal](../02-design-system/04-components.md#18-modal--dialog) → `POST /auth/logout` → SHR-04 ([authentication §8](../03-user-flows/02-authentication.md)).
- **Navigation** — **From:** Profile tab. **To:** SHR-12, CLI-14, CLI-15, CLI-16, CLI-17, SHR-06, SHR-08, SHR-11, PRV-01, SHR-04 (logout).
- **APIs consumed** — `GET /api/v1/me` ; `POST /api/v1/auth/logout`.
- **RTL & a11y** — Phone bidi-isolated. List rows navigational `accessibilityRole="button"`, chevrons mirror. Logout destructive confirm `role="alertdialog"`.

---

## CLI-14 · العناوين المحفوظة / Saved Addresses

- **Purpose** — Manage saved service addresses (G12): list, add (map pin), edit, delete, set default — reused by CLI-06.
- **Route** — `app/(client)/profile/addresses.tsx`.
- **Entry points** — CLI-13 menu; "إدارة العناوين" link from CLI-06 address block.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back + title `h2` "العناوين المحفوظة".
  - List of address [ListItems](../02-design-system/04-components.md#16-listitem) (leading pin `icon/sm`, label `body` + full address `caption`, default [Chip](../02-design-system/04-components.md#9-chip--tag), trailing overflow IconButton: edit/delete/set-default).
  - [FAB](../02-design-system/04-components.md#26-fab) (or footer primary Button) "أضيفي عنواناً" → map-pin BottomSheet.
- **States**
  - **default** — addresses listed.
  - **loading** — list-row skeletons.
  - **empty** — [EmptyState](../02-design-system/04-components.md#23-emptystate) "لا عناوين محفوظة" + CTA "أضيفي عنوانك الأول".
  - **error** — [error-with-retry §29.3](../02-design-system/04-components.md#29-global-states).
  - **success** — add/edit/delete → [Toast](../02-design-system/04-components.md#19-toast--snackbar) ("تم حفظ العنوان" / "تم الحذف — تراجع").
- **Interactions** — Tap "أضيفي" / FAB → map sheet (location permission via [SHR-15](03-shared-screens.md)), drop/drag pin, enter label + details → `POST /me/addresses`. Overflow: edit → `PATCH`; delete → confirm [Modal](../02-design-system/04-components.md#18-modal--dialog) → `DELETE`; set default → `PATCH`. Tap row → edit.
- **Navigation** — **From:** CLI-13, CLI-06. **To:** map sheet, SHR-15.
- **APIs consumed** — `GET /api/v1/me/addresses` ; `POST /api/v1/me/addresses` ; `PATCH /api/v1/me/addresses/{id}` ; `DELETE /api/v1/me/addresses/{id}`.
- **RTL & a11y** — Pin leading at reading-start; overflow trailing; FAB anchored reading-end bottom. Delete `role="alertdialog"`. Map sheet exposes pin position; address text bidi-isolated.

---

## CLI-15 · طرق الدفع / Payment Methods

- **Purpose** — Manage saved Moyasar cards/wallets used for escrow holds: list, add, delete, set default.
- **Route** — `app/(client)/profile/payment-methods.tsx`.
- **Entry points** — CLI-13 menu; "إدارة الطرق" from CLI-08.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back + title `h2` "طرق الدفع".
  - List of method [ListItems](../02-design-system/04-components.md#16-listitem) (leading brand icon — مدى/Visa/Mastercard/STC Pay, last-4 `body`, expiry `caption`, default [Chip](../02-design-system/04-components.md#9-chip--tag), trailing overflow: delete/set-default).
  - Footer primary Button "إضافة بطاقة" → Moyasar add-card SDK sheet.
  - Security note [Banner](../02-design-system/04-components.md#20-banner) `info` "بياناتك محفوظة بأمان لدى مزوّد الدفع".
- **States**
  - **default** — methods listed.
  - **loading** — list-row skeletons.
  - **empty** — [EmptyState](../02-design-system/04-components.md#23-emptystate) "لا طرق دفع محفوظة" + CTA "إضافة بطاقة".
  - **error** — load/add fail → [error Banner](../02-design-system/04-components.md#20-banner)/[error-with-retry §29.3](../02-design-system/04-components.md#29-global-states).
  - **success** — add/delete → [Toast](../02-design-system/04-components.md#19-toast--snackbar).
- **Interactions** — "إضافة بطاقة" → Moyasar SDK tokenization → `POST /me/payment-methods`. Overflow: delete → confirm Modal → `DELETE`; set-default → `PATCH`.
- **Navigation** — **From:** CLI-13, CLI-08. **To:** Moyasar SDK sheet.
- **APIs consumed** — `GET /api/v1/me/payment-methods` ; `POST /api/v1/me/payment-methods` (token) ; `DELETE /api/v1/me/payment-methods/{id}` ; `PATCH /api/v1/me/payment-methods/{id}` (default). Card data never touches the app server (gateway-tokenized).
- **RTL & a11y** — last-4 + expiry LTR-isolated. Brand icons have text labels. Delete `role="alertdialog"`. Security Banner icon+text.

---

## CLI-16 · الإشعارات / Notifications

- **Purpose** — Chronological list of booking, reminder, and promotional notifications; tap routes to the target entity; mark-as-read.
- **Route** — `app/(client)/notifications.tsx`.
- **Entry points** — Notifications IconButton (CLI-01), CLI-13 menu, push tap (resolved by [onboarding §6](../03-user-flows/01-onboarding.md)).
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) title `h2` "الإشعارات" + "تعليم الكل كمقروء" action.
  - List of notification [ListItems](../02-design-system/04-components.md#16-listitem): leading status icon (`icon/sm`, semantic-colored per type), title `body`, snippet `caption`, time `caption` (Arabic-Indic); unread row gets `bg/tint` + [Badge](../02-design-system/04-components.md#21-badge) dot.
  - Type grouping/section headers optional (اليوم / أمس / أقدم).
- **States**
  - **default** — notifications listed, unread highlighted.
  - **loading** — list-row skeletons.
  - **empty** — [EmptyState](../02-design-system/04-components.md#23-emptystate) `no-notifications` "لا إشعارات بعد".
  - **error** — [error-with-retry §29.3](../02-design-system/04-components.md#29-global-states).
  - **success** — tap → marks read + navigates.
- **Interactions** — Tap row → mark read (`PATCH`) + deep-route to target (CLI-10 booking, CLI-04 provider, SHR-07 chat, etc.). "تعليم الكل كمقروء" → `POST /me/notifications/read-all`. Pull-to-refresh; infinite scroll.
- **Navigation** — **From:** CLI-01/13, push. **To:** CLI-10, CLI-04, SHR-07, and other targets.
- **APIs consumed** — `GET /api/v1/me/notifications?page` ; `PATCH /api/v1/me/notifications/{id}/read` ; `POST /api/v1/me/notifications/read-all`. Delivery via Expo push.
- **RTL & a11y** — Type icon at reading-start (color never alone — paired type label). Unread state announced in accessible name ("غير مقروء"). Times Arabic-Indic; bidi-isolated entity names.

---

## CLI-17 · المفضّلة / Favorites

- **Purpose** — Saved providers for quick re-booking.
- **Route** — `app/(client)/favorites.tsx`.
- **Entry points** — CLI-13 menu; favorite toggles from CLI-01/03/04.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) title `h2` "المفضّلة".
  - List/grid of [Provider cards](../02-design-system/04-components.md#13-provider-card) with filled heart [IconButton](../02-design-system/04-components.md#2-iconbutton); unavailable providers show the card unavailable state.
- **States**
  - **default** — favorited providers.
  - **loading** — provider-card skeletons.
  - **empty** — [EmptyState](../02-design-system/04-components.md#23-emptystate) "لا مقدّمات في المفضّلة" + CTA "تصفّحي المقدّمات" → CLI-01.
  - **error** — [error-with-retry §29.3](../02-design-system/04-components.md#29-global-states).
  - **success** — un-favorite → optimistic removal + [Toast](../02-design-system/04-components.md#19-toast--snackbar) "أُزيلت — تراجع".
- **Interactions** — Tap card → CLI-04; tap heart → `DELETE /me/favorites/{id}` (optimistic, undo Toast). Pull-to-refresh.
- **Navigation** — **From:** CLI-13. **To:** CLI-04, CLI-01.
- **APIs consumed** — `GET /api/v1/me/favorites` ; `DELETE /api/v1/me/favorites/{providerId}`.
- **RTL & a11y** — Heart does not mirror; announces favorite state. Cards composed labels. Undo Toast action at reading-end.

---

> **Cross-references.** Pre-auth (Splash/Language/Onboarding/Role/Phone/OTP), Chat (`SHR-06`/`SHR-07`), Support (`SHR-08`), Complaint/Dispute (`SHR-09`), Settings (`SHR-11`), Edit Profile (`SHR-12`), permission prompts (`SHR-15`/`SHR-16`/`SHR-17`) live in [03-shared-screens.md](03-shared-screens.md). Provider-side counterparts of every shared booking step are in [02-provider-screens.md](02-provider-screens.md). Money mechanics in [payments-payouts](../03-user-flows/05-payments-payouts.md).
