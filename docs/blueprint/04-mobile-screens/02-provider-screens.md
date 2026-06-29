# Mobile Screens — Provider (مقدّمة خدمة)

> **Build blueprint, provider role.** Every screen consumes **named tokens only** — colors from [colors](../02-design-system/01-colors.md), type from [typography](../02-design-system/02-typography.md), spacing/radius/elevation/icons/z from [spacing-layout](../02-design-system/03-spacing-layout.md) — and named components from [components](../02-design-system/04-components.md). No hardcoded hex/sizes/strings outside the i18n layer. Arabic-first/RTL per [spacing §9](../02-design-system/03-spacing-layout.md). Role = `provider` (a phone+OTP account with the provider capability; may coexist with `client` on the same account) per [personas-roles §1/§3](../00-overview/02-personas-roles.md). Flow alignment: [provider](../03-user-flows/04-provider.md); client counterparts in [client-screens](01-client-screens.md); shared pre-auth/chat/support in [shared-screens](03-shared-screens.md); money in [payments-payouts](../03-user-flows/05-payments-payouts.md).
>
> **Navigation shell.** Provider tabs use [BottomNavBar](../02-design-system/04-components.md#25-bottomnavbar) (Dashboard / Bookings / Wallet / Chat / Profile). Routing is **Expo Router**; tab group `(provider)`. Booking-status enum + tokens are canonical per [colors §3](../02-design-system/01-colors.md), rendered via [StatusChip](../02-design-system/04-components.md#10-statuschip).
>
> **Provider capability sub-states** ([personas-roles §5](../00-overview/02-personas-roles.md), [provider §1](../03-user-flows/04-provider.md)): `profile_complete` (≥1 service w/ price+duration AND ≥1 portfolio item → required to appear in search), `accepting_bookings` (availability set + open-for-work toggle), `tier` (`beginner`/`mid`/`established` → commission %), `visibility_boost` (silver/gold/platinum + expiry). Discoverable ⇔ `active` AND `profile_complete` AND `accepting_bookings`.

## Screen index

| ID | Name (AR / EN) | Route | Flow ref |
|---|---|---|---|
| PRV-01 | إعداد الملف / Provider Onboarding Wizard | `app/(provider)/onboarding/index.tsx` | [provider §3](../03-user-flows/04-provider.md) `PRV-11` |
| PRV-02 | لوحة التحكم / Provider Dashboard | `app/(provider)/index.tsx` | `PRV-10` |
| PRV-03 | إدارة الخدمات / Manage Services | `app/(provider)/services/index.tsx` | `PRV-12` |
| PRV-04 | معرض الأعمال / Manage Portfolio | `app/(provider)/portfolio.tsx` | `PRV-13` |
| PRV-05 | تقويم التوفّر / Availability Calendar | `app/(provider)/availability.tsx` | `PRV-14` |
| PRV-06 | طلب حجز وارد / Incoming Booking Request | `app/(provider)/bookings/[id]/request.tsx` | `PRV-20`/`PRV-21` |
| PRV-07 | تفاصيل الحجز / Provider Booking Detail | `app/(provider)/bookings/[id]/index.tsx` | `PRV-21`/`22`/`23` |
| PRV-08 | الأرباح والمحفظة / Earnings & Wallet | `app/(provider)/wallet/index.tsx` | `PRV-30` |
| PRV-09 | سحب الأموال / Withdraw Funds | `app/(provider)/wallet/withdraw.tsx` | `PRV-31` |
| PRV-10 | باقات الظهور / Visibility Packages | `app/(provider)/visibility.tsx` | `PRV-40` |
| PRV-11 | الملف والإعدادات / Provider Profile & Settings | `app/(provider)/profile.tsx` | `PRV-15` |
| PRV-12s | إشعارات المقدّمة / Provider Notifications | `app/(provider)/notifications.tsx` | — |

> The wizard sub-steps reuse PRV-03/04/05 in a guided mode; PRV-06 also lists in PRV-07's Bookings list. PRV-12s is suffixed to avoid colliding with the `PRV-12` flow id (Services).

---

## PRV-01 · إعداد الملف / Provider Onboarding (profile setup wizard)

- **Purpose** — Post-OTP instant onboarding (no approval queue): collect basics → add ≥1 service (price+duration) → upload ≥1 portfolio item → set availability, until the server flips `profile_complete=true`. Mirrors [provider §3](../03-user-flows/04-provider.md) `PRV-11`.
- **Route** — `app/(provider)/onboarding/index.tsx` (stepped stack; steps deep-linkable `?step=basics|services|portfolio|availability`).
- **Entry points** — OTP verify with `intended_role=provider` ([authentication §4.1](../03-user-flows/02-authentication.md)); existing client choosing "كوني مقدّمة خدمة" ([client CLI-13](01-client-screens.md)); resumed if abandoned mid-setup.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) with progress stepper (direction-aware, 4 steps) + "تخطّي لاحقاً" ghost action (allowed but provider stays non-discoverable until complete).
  - **Step 1 Basics:** [TextInput](../02-design-system/04-components.md#3-textinput) display name, multiline bio, specialty [Chips](../02-design-system/04-components.md#9-chip--tag) (multi-select), service-areas selector, profile photo [Avatar](../02-design-system/04-components.md#11-avatar) `xl` + upload IconButton.
  - **Step 2 Services:** guided [Service](../02-design-system/04-components.md#14-service-card) add — reuses PRV-03 add form (name, category, price SAR, duration minutes); ≥1 required.
  - **Step 3 Portfolio:** guided uploader (reuses PRV-04); ≥1 image required.
  - **Step 4 Availability:** weekly hours grid (reuses PRV-05).
  - Footer: secondary "السابق" (start) + primary `lg` "التالي"/"إنهاء" (end).
- **States**
  - **default** — current step form.
  - **loading** — per-step save → button [loading state](../02-design-system/04-components.md#1-button); image upload progress (signed S3 URL).
  - **empty** — fresh provider; each required step blocks "التالي" until satisfied (e.g. no service → disabled + helper).
  - **error** — save/upload fail → field [TextInput error](../02-design-system/04-components.md#3-textinput) or [error Banner](../02-design-system/04-components.md#20-banner) with retry; upload too large → resize hint (<1 MB per [provider §3](../03-user-flows/04-provider.md)).
  - **success** — final step → `profile_complete=true` → route to PRV-02 with a [Banner](../02-design-system/04-components.md#20-banner) `success` "ملفّك جاهز! فعّلي «مفتوحة للعمل» لتظهري في البحث".
- **Interactions** — Per step: fill → "التالي" persists (`PATCH /me/provider`, `POST /me/services`, `POST /me/portfolio`, `PUT /me/availability`). "السابق" navigates back without losing data. Photo/portfolio upload → signed S3 URL flow. "إنهاء" → completion check → PRV-02. "تخطّي لاحقاً" → PRV-02 (incomplete; discoverability off).
- **Navigation** — **From:** OTP verify, CLI-13 become-provider. **To:** PRV-02; sub-forms reuse PRV-03/04/05 logic.
- **APIs consumed** — `PATCH /api/v1/me/provider` ; `POST /api/v1/me/services` ; `POST /api/v1/me/portfolio` (signed S3) ; `PUT /api/v1/me/availability`. Server flips `profile_complete` automatically.
- **RTL & a11y** — Stepper direction follows reading order; chevrons mirror. Price/duration LTR-isolated Arabic-Indic. Each required step announces what's missing. Image upload progress is a polite live region; alt text prompted for portfolio images.

---

## PRV-02 · لوحة التحكم / Provider Dashboard (today / earnings KPIs)

- **Purpose** — Provider home: open-for-work toggle, today's bookings, KPI snapshot (today/week earnings, rating, completion), and quick entries. Mirrors `PRV-10`.
- **Route** — `app/(provider)/index.tsx` (Dashboard tab).
- **Entry points** — Post-auth provider landing ([authentication §4](../03-user-flows/02-authentication.md)); Dashboard tab; PRV-01 completion.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader): greeting/name title, trailing notifications IconButton + [Badge](../02-design-system/04-components.md#21-badge).
  - **Open-for-work** [ListItem](../02-design-system/04-components.md#16-listitem) with switch ("مفتوحة للعمل") → toggles `accepting_bookings`; when off or `!profile_complete`, an inline [Banner](../02-design-system/04-components.md#20-banner) `warning` explains non-discoverability + CTA to finish setup.
  - **KPI cards** row (2-up): today's earnings + week's earnings ([Money display](../02-design-system/04-components.md#28-moneyprice-display)), rating ([RatingStars](../02-design-system/04-components.md#12-ratingstars) display), completion %, upcoming count — each a small card (`radius/lg`, `elevation/1`).
  - **اليوم / Today** section (`h2`): list of today's [Booking cards](../02-design-system/04-components.md#15-booking-card) with [StatusChip](../02-design-system/04-components.md#10-statuschip) and quick action (accept / on-the-way / start / complete by status).
  - Pending requests highlight (count badge) → PRV-06 list.
  - Quick links row: الخدمات (PRV-03), التوفّر (PRV-05), المحفظة (PRV-08), الظهور (PRV-10).
- **States**
  - **default** — toggle + KPIs + today list.
  - **loading** — KPI + booking-card skeletons.
  - **empty** — no bookings today → [EmptyState](../02-design-system/04-components.md#23-emptystate) `no-bookings` "لا حجوزات اليوم"; new provider with empty profile → setup CTA.
  - **error** — [error-with-retry §29.3](../02-design-system/04-components.md#29-global-states).
  - **success** — toggle on → "أنتِ الآن ظاهرة للعميلات" [Toast](../02-design-system/04-components.md#19-toast--snackbar).
- **Interactions** — Toggle switch → `PATCH /me/provider/discoverability` (optimistic; reverts on error; blocked w/ warning if `!profile_complete`). Tap KPI → wallet/ratings detail. Tap today card → PRV-07; inline quick action runs the status transition. Pending badge → PRV-06. Quick links → respective screens. Notifications → PRV-12s. Pull-to-refresh.
- **Navigation** — **From:** auth landing, Dashboard tab. **To:** PRV-03/05/06/07/08/10/12s.
- **APIs consumed** — `GET /api/v1/me/provider` (sub-states) ; `PATCH /api/v1/me/provider/discoverability` ; `GET /api/v1/me/bookings?status=today` ; `GET /api/v1/me/dashboard/kpis` ; `GET /api/v1/me/wallet` (KPI balance) ; `GET /api/v1/me/notifications?unread=1`.
- **RTL & a11y** — Switch state announced ("مفتوحة للعمل، مُفعّل"). KPI amounts Arabic-Indic, bidi-isolated. Warning Banner icon+text. Today cards composed labels with status text. Toggle has hint when blocked.

---

## PRV-03 · إدارة الخدمات / Manage Services (CRUD with price + duration)

- **Purpose** — Create/read/update/delete services, each with **name, category, price (SAR), duration (minutes)** (G8) — required for `profile_complete` and slot computation.
- **Route** — `app/(provider)/services/index.tsx` (+ add/edit sheet `services/[id]/edit.tsx`).
- **Entry points** — Dashboard quick link, PRV-01 step 2, PRV-11 menu.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back + title `h2` "خدماتي".
  - List of service [ListItems](../02-design-system/04-components.md#16-listitem)/[Service cards](../02-design-system/04-components.md#14-service-card): name (`h3`), category [Chip](../02-design-system/04-components.md#9-chip--tag), [Money display](../02-design-system/04-components.md#28-moneyprice-display) + duration `caption`, active toggle, trailing overflow (edit/delete/duplicate).
  - [FAB](../02-design-system/04-components.md#26-fab) "أضيفي خدمة" → add/edit [BottomSheet](../02-design-system/04-components.md#17-bottomsheet) with [TextInputs](../02-design-system/04-components.md#3-textinput) (name, desc), category [Dropdown](../02-design-system/04-components.md#7-dropdownselect), price input (numeric, SAR affix), duration input (minutes), optional add-on rows, save Button.
- **States**
  - **default** — services listed.
  - **loading** — list-row skeletons; save → button loading.
  - **empty** — [EmptyState](../02-design-system/04-components.md#23-emptystate) `no-portfolio`-style "لم تضيفي خدمات بعد" + CTA "أضيفي خدمتك الأولى" (also gates `profile_complete`).
  - **error** — validation: price/duration required → [TextInput error](../02-design-system/04-components.md#3-textinput); save fail → [error Banner](../02-design-system/04-components.md#20-banner); delete-in-use (service has future bookings) → blocked with explanation.
  - **success** — add/edit/delete → [Toast](../02-design-system/04-components.md#19-toast--snackbar) ("تم حفظ الخدمة" / "تم الحذف — تراجع").
- **Interactions** — FAB → add sheet → `POST /me/services`. Tap row / overflow edit → edit sheet → `PATCH /me/services/{id}`. Overflow delete → confirm [Modal](../02-design-system/04-components.md#18-modal--dialog) → `DELETE /me/services/{id}`. Toggle active → `PATCH`. Duplicate → pre-filled add sheet.
- **Navigation** — **From:** PRV-02/01/11. **To:** add/edit sheet.
- **APIs consumed** — `GET /api/v1/me/services` ; `POST /api/v1/me/services` ; `PATCH /api/v1/me/services/{id}` ; `DELETE /api/v1/me/services/{id}`.
- **RTL & a11y** — Price/duration numeric inputs LTR-isolated; SAR affix at logical position. Required-field errors via live region. FAB anchored reading-end bottom. Delete `role="alertdialog"`. Each row announces name+price+duration+active state.

---

## PRV-04 · معرض الأعمال / Manage Portfolio (upload / reorder)

- **Purpose** — Upload, reorder, caption, and delete portfolio images (signed S3 URLs); ≥1 item required for `profile_complete`.
- **Route** — `app/(provider)/portfolio.tsx`.
- **Entry points** — Dashboard quick link, PRV-01 step 3, PRV-11 menu.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back + title `h2` "معرض أعمالي" + "ترتيب" toggle (enter reorder mode).
  - Image grid (thumbnails `radius/md`); reorder mode = drag handles; each tile trailing overflow (delete / set-cover / caption).
  - [FAB](../02-design-system/04-components.md#26-fab) "أضيفي صورة" → image picker (camera/gallery via [SHR-17 permission](03-shared-screens.md)).
- **States**
  - **default** — grid of images.
  - **loading** — tile skeletons; per-image upload progress overlay (signed S3).
  - **empty** — [EmptyState](../02-design-system/04-components.md#23-emptystate) `no-portfolio` "أضيفي أعمالك ليثق بكِ العميلات" + CTA.
  - **error** — upload too large (>1 MB after client resize) / fail → [error Banner](../02-design-system/04-components.md#20-banner) + retry per failed tile.
  - **success** — upload/reorder/delete → [Toast](../02-design-system/04-components.md#19-toast--snackbar); reorder persists on drop.
- **Interactions** — FAB → pick (camera/gallery) → client resize <1 MB → request signed URL → upload → `POST /me/portfolio`. Reorder drag → `PATCH /me/portfolio/reorder`. Overflow: delete → confirm Modal → `DELETE /me/portfolio/{id}`; set-cover → `PATCH`; caption → inline input.
- **Navigation** — **From:** PRV-02/01/11. **To:** image picker, SHR-17.
- **APIs consumed** — `POST /api/v1/me/portfolio` (signed S3 put then register) ; `DELETE /api/v1/me/portfolio/{id}` ; `PATCH /api/v1/me/portfolio/reorder` ; `PATCH /api/v1/me/portfolio/{id}` (cover/caption).
- **RTL & a11y** — Grid fills in reading order; reorder announces position changes. Each image needs alt/caption (prompted). Upload progress polite live region. Delete `role="alertdialog"`.

---

## PRV-05 · تقويم التوفّر / Availability Calendar

- **Purpose** — Set weekly working hours and day/time blocks that drive client-side slot generation and conflict prevention (G8). Required for `accepting_bookings`.
- **Route** — `app/(provider)/availability.tsx`.
- **Entry points** — Dashboard quick link, PRV-01 step 4, PRV-11 menu.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back + title `h2` "أوقات عملي" + save action.
  - Weekly hours: per-day rows ([ListItem](../02-design-system/04-components.md#16-listitem) with day name, working toggle, start/end [TimeSlotPicker](../02-design-system/04-components.md#8-datepicker--timeslotpicker)/time inputs).
  - Blocks/exceptions: [DatePicker](../02-design-system/04-components.md#8-datepicker--timeslotpicker) calendar marking blocked days; confirmed bookings shown read-only (cannot block over them).
  - "نسخ على كل الأيام" helper.
  - Footer primary `lg` Button "حفظ".
- **States**
  - **default** — current weekly schedule + blocks.
  - **loading** — schedule skeleton; save → button loading.
  - **empty** — no hours set → prompt "حدّدي أوقات عملك لتستقبلي الحجوزات" (gates `accepting_bookings` effect).
  - **error** — invalid range (end ≤ start) → inline field error; save fail → [error Banner](../02-design-system/04-components.md#20-banner); blocking over an existing confirmed booking → blocked with notice.
  - **success** — save → [Toast](../02-design-system/04-components.md#19-toast--snackbar) "تم تحديث التوفّر".
- **Interactions** — Toggle day working; set start/end; add a day block; "نسخ على كل الأيام"; "حفظ" → `PUT /me/availability`. Tap a confirmed booking in calendar → PRV-07 (read-only here).
- **Navigation** — **From:** PRV-02/01/11. **To:** PRV-07 (from a confirmed slot).
- **APIs consumed** — `GET /api/v1/me/availability` ; `PUT /api/v1/me/availability` ; `GET /api/v1/me/bookings?scope=confirmed` (overlay).
- **RTL & a11y** — Calendar week start `ar-SA`; month nav mirrors; clock glyph not mirrored; times Arabic-Indic. Day rows announce working/closed + hours. Invalid range error via live region.

---

## PRV-06 · طلب حجز وارد / Incoming Booking Request (accept / reject)

- **Purpose** — Review a `pending_provider` request (services, duration, area, slot, payout estimate net of commission) within the accept window, and accept or reject. Mirrors `PRV-20`/`PRV-21` accept step.
- **Route** — `app/(provider)/bookings/[id]/request.tsx` (and the request list `app/(provider)/bookings.tsx` Bookings tab → "الطلبات").
- **Entry points** — Push on new booking ([provider §5.1](../03-user-flows/04-provider.md)), Dashboard pending highlight, Bookings tab "الطلبات" segment, notification.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back + title `h2` "طلب حجز" + [StatusChip](../02-design-system/04-components.md#10-statuschip) `pending`.
  - **Accept-window countdown** [Banner](../02-design-system/04-components.md#20-banner) `warning` (live timer; expiry → `expired`, client refunded).
  - Client mini-header ([Avatar](../02-design-system/04-components.md#11-avatar) `md` + first name) + service area (not exact address until accept).
  - Details block: services + durations, summed duration, slot date/time.
  - **Payout estimate** [Money display](../02-design-system/04-components.md#28-moneyprice-display): gross, commission (by `tier`), **net payout** emphasized.
  - Footer: destructive [Button](../02-design-system/04-components.md#1-button) "رفض" (start) + primary `lg` Button "قبول" (end).
- **States**
  - **default** — request details + countdown.
  - **loading** — skeleton; accept/reject → button loading.
  - **empty** — list view: no pending requests → [EmptyState](../02-design-system/04-components.md#23-emptystate) "لا طلبات حالياً".
  - **error** — `409 slot_conflict` on accept (overlaps another confirmed booking) → [error Banner](../02-design-system/04-components.md#20-banner) "تعارض في الموعد"; window expired mid-view → status flips to `expired` with notice.
  - **success** — accept → `confirmed` → PRV-07 + reminders scheduled; reject → `rejected` (client refunded) → back to list.
- **Interactions** — "قبول" → `POST /bookings/{id}/accept` → `confirmed`; "رفض" → confirm [Modal](../02-design-system/04-components.md#18-modal--dialog) → `POST /bookings/{id}/reject`. Countdown reaching zero → auto-`expired`. Tap "مراسلة" (after accept) → SHR-07.
- **Navigation** — **From:** push, Dashboard, Bookings list, notifications. **To:** PRV-07 (accept), back (reject/expire), SHR-07.
- **APIs consumed** — `GET /api/v1/me/bookings?status=pending_provider` (list) ; `GET /api/v1/bookings/{id}` (detail) ; `POST /api/v1/bookings/{id}/accept` ; `POST /api/v1/bookings/{id}/reject`.
- **RTL & a11y** — Countdown polite live region. Net payout announced distinctly. `409` conflict via `role="alert"`. Footer button order RTL (primary accept at reading-end). Reject `role="alertdialog"`. Exact address withheld pre-accept (privacy).

---

## PRV-07 · تفاصيل الحجز / Provider Booking Detail (QR, on-the-way, in-progress, complete, add-on)

- **Purpose** — Provider-side fulfilment hub for a confirmed booking: on-the-way, present/scan QR check-in, start, propose in-visit add-on, complete; plus chat, cancel (with penalty), and no-show handling. Consolidates `PRV-21`/`22`/`23`.
- **Route** — `app/(provider)/bookings/[id]/index.tsx`.
- **Entry points** — PRV-06 accept, Dashboard today card, Bookings tab, push (`nora://booking/{id}`), PRV-05 confirmed-slot tap.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back + title `h2` "تفاصيل الحجز" + overflow (cancel / report client no-show / dispute, status-gated).
  - Top [StatusChip](../02-design-system/04-components.md#10-statuschip) + status timeline (confirmed → on_the_way → checked_in → in_progress → completed).
  - Client + service block: name, services+durations, **full address** (now revealed) with "فتح في الخرائط" link, slot, [Money display](../02-design-system/04-components.md#28-moneyprice-display) net payout (escrow held note).
  - **Action zone** (status-driven primary [Button](../02-design-system/04-components.md#1-button)):
    - `confirmed` → "في الطريق" → `on_the_way`.
    - `on_the_way` → "عرض رمز الدخول" → QR present screen (`PRV-22`); fallback "مسح رمز العميلة" → scanner.
    - `checked_in` → "بدء الخدمة" → `in_progress`.
    - `in_progress` → "اقتراح خدمة إضافية" → add-on compose ([BottomSheet](../02-design-system/04-components.md#17-bottomsheet)) and "إنهاء الخدمة" → `complete`.
  - Secondary: "مراسلة" (SHR-07).
- **States**
  - **default** — status + actions per state.
  - **loading** — detail skeleton; action → button loading; live updates via socket (client scan, approval, confirm).
  - **empty** — n/a (single entity).
  - **error** — `422 invalid_checkin_token` (QR) → scanner error + ops path; `409 not_checked_in` on start/complete → block w/ notice (check-in is a precondition); cancel after accept → penalty warning.
  - **success** — transitions confirmed via [Toast](../02-design-system/04-components.md#19-toast--snackbar) ("تم تعليم «في الطريق»", "بدأت الخدمة", "تم الإنهاء — بانتظار تأكيد العميلة"); on `completed` + capture, wallet credit reflected on PRV-08.
- **Interactions**
  - "في الطريق" → `POST /bookings/{id}/on-the-way`.
  - "عرض رمز الدخول" → present QR (`PRV-22`); client scans → `checked_in`. Fallback scan client QR → `POST /bookings/{id}/checkin`.
  - "بدء الخدمة" → `POST /bookings/{id}/start`.
  - "اقتراح خدمة إضافية" → compose add-on (name, price) → `POST /bookings/{id}/addons` → client approves on [CLI-10](01-client-screens.md); declined → continue original scope.
  - "إنهاء الخدمة" → `POST /bookings/{id}/complete` → client confirms / auto → `completed` → escrow capture → wallet credit (pending→available).
  - Overflow: "إلغاء" → confirm [Modal](../02-design-system/04-components.md#18-modal--dialog) warning of full client refund + provider penalty → `POST /bookings/{id}/cancel`; "العميلة لم تحضر" → no-show report; "نزاع" → PRV-12 (Complaints) / SHR-09.
- **Navigation** — **From:** PRV-06/02, Bookings list, push, PRV-05. **To:** QR present/scan (`PRV-22`), add-on sheet, SHR-07, PRV-12, SHR-09.
- **APIs consumed** — `GET /api/v1/bookings/{id}` ; `POST /api/v1/bookings/{id}/on-the-way` ; `POST /api/v1/bookings/{id}/checkin` ; `POST /api/v1/bookings/{id}/start` ; `POST /api/v1/bookings/{id}/addons` ; `POST /api/v1/bookings/{id}/complete` ; `POST /api/v1/bookings/{id}/cancel` ; Socket.IO booking channel for live status.
- **RTL & a11y** — Timeline in reading direction; status text equivalents (color never alone). QR present screen renders a high-contrast code with an accessible "اعرضي هذا الرمز للعميلة" caption; scanner has a clear region hint; clock glyphs not mirrored. Cancel `role="alertdialog"` states penalty. Map link bidi-isolated address.

---

## PRV-08 · الأرباح والمحفظة / Earnings & Wallet (balance, transactions)

- **Purpose** — Show wallet balances (`available` / `pending`) and the ledger of credits (completed bookings net of commission), debits (refunds/penalties), and withdrawals; entry to withdraw. Mirrors `PRV-30`.
- **Route** — `app/(provider)/wallet/index.tsx` (Wallet tab).
- **Entry points** — Wallet tab; Dashboard KPI; "سحب" CTA paths.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) title `h2` "المحفظة".
  - Balance header: **available** [Money display](../02-design-system/04-components.md#28-moneyprice-display) `h1` + **pending** ([Money display](../02-design-system/04-components.md#28-moneyprice-display) with `warning/500` "قيد التحصيل" note — not yet withdrawable).
  - Primary `lg` Button "سحب" → PRV-09 (disabled if `available=0`).
  - Ledger list ([ListItems](../02-design-system/04-components.md#16-listitem)): each entry = type icon (`icon/sm`), label (booking #/refund/penalty/withdrawal), date `caption`, signed [Money display](../02-design-system/04-components.md#28-moneyprice-display) (credit `success/500` / debit `text/secondary` with sign). Filter [Chips](../02-design-system/04-components.md#9-chip--tag) (الكل / إيداعات / سحوبات).
  - Low-balance [Banner](../02-design-system/04-components.md#20-banner) `warning` when relevant.
- **States**
  - **default** — balances + ledger.
  - **loading** — balance skeleton + ledger-row skeletons.
  - **empty** — no transactions → [EmptyState](../02-design-system/04-components.md#23-emptystate) "لا حركات بعد — أكملي حجزاً لتبدأ أرباحك".
  - **error** — [error-with-retry §29.3](../02-design-system/04-components.md#29-global-states).
  - **success** — n/a transient; withdraw success reflected after PRV-09.
- **Interactions** — "سحب" → PRV-09 (guarded: requires payout account + `available>0`). Filter Chips → re-query ledger. Tap a ledger row → detail (linked booking → PRV-07 / withdrawal status). Pull-to-refresh; infinite scroll.
- **Navigation** — **From:** Wallet tab, Dashboard. **To:** PRV-09, PRV-07 (from a credit row).
- **APIs consumed** — `GET /api/v1/me/wallet` (balances) ; `GET /api/v1/me/wallet/ledger?filter&page`.
- **RTL & a11y** — Amounts Arabic-Indic, signed values bidi-isolated with explicit sign (not color alone). Pending vs available announced distinctly. Ledger rows composed labels. "سحب" disabled state announced with reason.

---

## PRV-09 · سحب الأموال / Withdraw Funds

- **Purpose** — Request a withdrawal of an amount ≤ `available_balance` to a saved payout account; a sensitive action requiring **step-up** re-auth. Mirrors `PRV-31`, [provider §9](../03-user-flows/04-provider.md).
- **Route** — `app/(provider)/wallet/withdraw.tsx`.
- **Entry points** — "سحب" on PRV-08.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back + title `h2` "سحب الأموال".
  - Available balance recap [Money display](../02-design-system/04-components.md#28-moneyprice-display).
  - Amount [TextInput](../02-design-system/04-components.md#3-textinput) (numeric, SAR affix) + "سحب الكل" quick chip.
  - Payout-account block: saved bank/IBAN [ListItem](../02-design-system/04-components.md#16-listitem); if none → "أضيفي حساب التحويل" → bank-details form (also step-up protected).
  - Summary (amount, any fee, ETA).
  - Footer primary `lg` Button "تأكيد السحب".
- **States**
  - **default** — amount entry + payout account.
  - **loading** — submit → button loading; step-up sheet ([SHR-05 OTP](03-shared-screens.md)/Re-Auth) in flight.
  - **empty** — no payout account → form prompt (block withdraw until added).
  - **error** — `422 insufficient_balance` (amount > available) → field error; `401 step_up_required`/expired → re-open [SHR-07 Re-Auth](../03-user-flows/02-authentication.md); no account → block; submit fail → [error Banner](../02-design-system/04-components.md#20-banner).
  - **success** — withdrawal created `requested` (moved available→hold) → [Banner](../02-design-system/04-components.md#20-banner) `success` "تم إرسال طلب السحب — قيد المراجعة" → back to PRV-08.
- **Interactions** — Enter amount (validated ≤ available, >0); "سحب الكل" fills max. Add/edit payout account → `PUT /me/payout-account` (step-up). "تأكيد السحب" → step-up re-auth ([authentication §7](../03-user-flows/02-authentication.md)) → `POST /me/withdrawals` with `step_up_token`. On success → PRV-08.
- **Navigation** — **From:** PRV-08. **To:** Re-Auth sheet (SHR/auth), PRV-08.
- **APIs consumed** — `GET /api/v1/me/payout-account` ; `PUT /api/v1/me/payout-account` (step-up) ; `POST /api/v1/me/withdrawals` (step-up token) ; `POST /api/v1/auth/step-up` (via re-auth) ; `GET /api/v1/me/wallet` (recap).
- **RTL & a11y** — Amount/IBAN LTR-isolated; SAR affix logical. Validation errors via live region. Step-up sheet focus-trapped. Confirm announces funds moved to hold pending admin review. Only `available` (cleared) funds withdrawable; `pending` excluded ([provider §9](../03-user-flows/04-provider.md)).

---

## PRV-10 · باقات الظهور / Visibility Packages (silver / gold / platinum purchase)

- **Purpose** — Buy a visibility boost (Silver 2–3d / Gold 5d / Platinum 10d) that raises search ranking; direct Moyasar charge (platform revenue, **not** escrow). Mirrors `PRV-40`, [provider §10](../03-user-flows/04-provider.md).
- **Route** — `app/(provider)/visibility.tsx`.
- **Entry points** — Dashboard quick link, PRV-11 menu, "boost" prompts.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back + title `h2` "باقات الظهور".
  - Active-boost [Banner](../02-design-system/04-components.md#20-banner) `info` with expiry countdown if one is active.
  - Package cards (3, `radius/lg`): tier name + premium styling (`secondary/100`/`secondary/700` for Gold; distinct accents per tier), duration `caption`, ranking-effect blurb, [Money display](../02-design-system/04-components.md#28-moneyprice-display) price, primary "شراء" Button.
  - Not-discoverable warning [Banner](../02-design-system/04-components.md#20-banner) `warning` if `!profile_complete`/not open-for-work ("لن يظهر أثر الباقة حتى تكتمل ملفّك").
- **States**
  - **default** — 3 packages, prices.
  - **loading** — package skeletons; purchase → button loading + Moyasar sheet.
  - **empty** — n/a (packages are static config).
  - **error** — payment fail → [error Banner](../02-design-system/04-components.md#20-banner) "فشل الدفع — حاولي مجدداً"; boost already active → per policy [Modal](../02-design-system/04-components.md#18-modal--dialog) (extend expiry vs blocked).
  - **success** — payment success → `visibility_boost` set with expiry → [Banner](../02-design-system/04-components.md#20-banner) `success` "تم تفعيل باقتك" + countdown.
- **Interactions** — Tap "شراء" → `POST /me/visibility/purchase` → Moyasar direct-charge sheet → on success boost applied (BullMQ auto-expiry). Active-boost extend per policy. Dismiss.
- **Navigation** — **From:** PRV-02/11. **To:** Moyasar SDK sheet.
- **APIs consumed** — `GET /api/v1/me/visibility/packages` (catalog) ; `POST /api/v1/me/visibility/purchase` ; Moyasar SDK (direct charge) ; `GET /api/v1/me/provider` (boost state/expiry).
- **RTL & a11y** — Prices Arabic-Indic. Premium tier conveyed by label + badge (not color alone). Expiry countdown polite live region. Warning Banner when boost ineffective. Package cards composed labels (tier+duration+price+effect).

---

## PRV-11 · الملف والإعدادات / Provider Profile & Settings

- **Purpose** — Provider account hub: edit public profile (bio, specialties, areas, photo), manage services/portfolio/availability, payout account, settings, role switch, support, logout. Mirrors `PRV-15`.
- **Route** — `app/(provider)/profile.tsx` (Profile tab).
- **Entry points** — Profile tab.
- **Layout / components**
  - Header: [Avatar](../02-design-system/04-components.md#11-avatar) `xl` (premium ring if boosted) + name (`h2`) + tier [Chip](../02-design-system/04-components.md#9-chip--tag) + [RatingStars](../02-design-system/04-components.md#12-ratingstars) display + "تعديل الملف العام" ghost Button → SHR-12 Edit Profile (provider fields).
  - Capability status block: `profile_complete` / open-for-work / `visibility_boost` indicators (each with icon+label).
  - Navigational [ListItems](../02-design-system/04-components.md#16-listitem): الخدمات (PRV-03), معرض الأعمال (PRV-04), التوفّر (PRV-05), المحفظة (PRV-08), باقات الظهور (PRV-10), حساب التحويل (payout account, step-up), الشكاوى (PRV-12), المحادثات (SHR-06), الدعم (SHR-08), الإعدادات (SHR-11).
  - Role switch (if dual-capability): "التبديل إلى وضع العميلة" → [client CLI-01](01-client-screens.md).
  - Destructive "تسجيل الخروج".
- **States**
  - **default** — profile + menu + capability status.
  - **loading** — header + row skeletons.
  - **empty** — n/a.
  - **error** — load fail → [error-with-retry §29.3](../02-design-system/04-components.md#29-global-states).
  - **success** — navigation to sub-screens; edits reflected on return.
- **Interactions** — Tap any ListItem → its screen. "تعديل الملف العام" → SHR-12. Payout account → step-up then form. Role switch → swap tab group. "تسجيل الخروج" → confirm [Modal](../02-design-system/04-components.md#18-modal--dialog) → `POST /auth/logout` → SHR-04.
- **Navigation** — **From:** Profile tab. **To:** SHR-12, PRV-03/04/05/08/10/12, SHR-06/08/11, CLI-01 (role switch), SHR-04 (logout).
- **APIs consumed** — `GET /api/v1/me/provider` ; `GET /api/v1/me` ; `POST /api/v1/auth/logout`.
- **RTL & a11y** — Tier/capability conveyed by label+icon (color never alone). List rows navigational with mirrored chevrons. Role switch announces target mode. Logout `role="alertdialog"`.

---

## PRV-12s · إشعارات المقدّمة / Provider Notifications

- **Purpose** — Provider notification feed: new booking requests, accept-window reminders, on-the-way prompts, payout status, complaint updates, promo broadcasts.
- **Route** — `app/(provider)/notifications.tsx`.
- **Entry points** — Dashboard notifications IconButton, PRV-11 menu, push tap.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) title `h2` "الإشعارات" + "تعليم الكل كمقروء".
  - Notification [ListItems](../02-design-system/04-components.md#16-listitem): leading type icon (`icon/sm`, semantic-colored), title `body`, snippet `caption`, time `caption` (Arabic-Indic); unread = `bg/tint` + [Badge](../02-design-system/04-components.md#21-badge) dot. Optional day-group headers.
- **States**
  - **default** — feed, unread highlighted.
  - **loading** — list-row skeletons.
  - **empty** — [EmptyState](../02-design-system/04-components.md#23-emptystate) `no-notifications` "لا إشعارات بعد".
  - **error** — [error-with-retry §29.3](../02-design-system/04-components.md#29-global-states).
  - **success** — tap → mark read + route.
- **Interactions** — Tap → mark read (`PATCH`) + deep-route (PRV-06 request, PRV-07 booking, PRV-08 payout, PRV-12 complaint, SHR-07 chat). "تعليم الكل كمقروء" → `POST /me/notifications/read-all`. Pull-to-refresh; infinite scroll.
- **Navigation** — **From:** Dashboard, PRV-11, push. **To:** PRV-06/07/08/12, SHR-07.
- **APIs consumed** — `GET /api/v1/me/notifications?page` ; `PATCH /api/v1/me/notifications/{id}/read` ; `POST /api/v1/me/notifications/read-all`. Expo push delivery.
- **RTL & a11y** — Type icon at reading-start paired with label (color never alone). Unread state in accessible name. Times Arabic-Indic; entity names bidi-isolated.

---

> **Cross-references.** Complaints (`PRV-50` flow) are handled on the Complaint/Dispute shared screen [SHR-09](03-shared-screens.md) (provider-respond mode) and accessed via PRV-07/PRV-11/PRV-12s. QR present/scan (`PRV-22`) is the provider half of the check-in handled inline in PRV-07. Chat (`SHR-06`/`SHR-07`), Support (`SHR-08`), Settings (`SHR-11`), Edit Profile (`SHR-12`), permission prompts (`SHR-15`/`SHR-16`/`SHR-17`), Re-Auth/OTP step-up live in [03-shared-screens.md](03-shared-screens.md). Client-side counterparts in [01-client-screens.md](01-client-screens.md). Money mechanics in [payments-payouts](../03-user-flows/05-payments-payouts.md).
