# Mobile Screens — Shared (pre-auth, chat, support, settings, fallbacks, permissions)

> **Build blueprint, cross-role.** These screens serve all roles (pre-auth visitor, `client` عميلة, `provider` مقدّمة خدمة) or sit outside a role tab group. Every screen consumes **named tokens only** — colors from [colors](../02-design-system/01-colors.md), type from [typography](../02-design-system/02-typography.md), spacing/radius/elevation/icons/z from [spacing-layout](../02-design-system/03-spacing-layout.md) — and named components from [components](../02-design-system/04-components.md). No hardcoded hex/sizes/strings outside the i18n layer. Arabic-first/RTL per [spacing §9](../02-design-system/03-spacing-layout.md). Routing is **Expo Router**; pre-auth screens live in the `(auth)` / root group, the rest are pushed stacks reachable from either role.
>
> **Flow alignment.** Pre-auth → [onboarding](../03-user-flows/01-onboarding.md) (`SHR-01..03b`); auth → [authentication](../03-user-flows/02-authentication.md) (`SHR-04..09`); chat/support/complaint per [client-booking §8/§9](../03-user-flows/03-client-booking.md) and [provider §8/§11](../03-user-flows/04-provider.md). Client/provider screens: [01-client-screens](01-client-screens.md), [02-provider-screens](02-provider-screens.md).

## Screen index

| ID | Name (AR / EN) | Route | Flow ref |
|---|---|---|---|
| SHR-01 | شاشة البداية / Splash | `app/index.tsx` (bootstrap gate) | [onboarding §2](../03-user-flows/01-onboarding.md) `SHR-01` |
| SHR-02 | اختيار اللغة / Language Select | `app/(auth)/language.tsx` | `SHR-02` |
| SHR-03 | جولة تعريفية / Onboarding Carousel | `app/(auth)/onboarding.tsx` | `SHR-03` |
| SHR-04 | اختيار الدور / Role Select | `app/(auth)/role.tsx` | `SHR-03b` |
| SHR-05 | إدخال الجوال / Phone Entry | `app/(auth)/phone.tsx` | `SHR-04` |
| SHR-06 | تأكيد الرمز / OTP Verify | `app/(auth)/otp.tsx` | `SHR-05` |
| SHR-07 | المحادثات / Chat List | `app/(shared)/chats/index.tsx` | `SHR-20` (list) |
| SHR-08 | محادثة / Chat Conversation | `app/(shared)/chats/[id].tsx` | `SHR-20` |
| SHR-09 | الدعم / Support & Help | `app/(shared)/support/index.tsx` (+ `new.tsx`, `[id].tsx`) | `SHR-21` |
| SHR-10 | الشكاوى والنزاعات / Complaint & Dispute | `app/(shared)/disputes/index.tsx` (+ `new.tsx`, `[id].tsx`) | `SHR-21` |
| SHR-11 | الإعدادات / Settings | `app/(shared)/settings.tsx` | `SHR-30` |
| SHR-12 | تعديل الملف / Edit Profile | `app/(shared)/edit-profile.tsx` | — |
| SHR-13 | حالات بديلة / Empty · Offline · Error Fallbacks | `app/(shared)/_fallbacks/*` (composable) | [components §29](../02-design-system/04-components.md#29-global-states) |
| SHR-14 | طلبات الأذونات / Permission Prompts (location / notifications / camera) | `app/(shared)/permissions/*` (sheets) | [client §location](../03-user-flows/03-client-booking.md), [provider §portfolio](../03-user-flows/04-provider.md) |

> Re-Auth/step-up, Account Deactivated/Suspended (`SHR-07`/`SHR-08`/`SHR-09` in the auth flow) are owned by [authentication](../03-user-flows/02-authentication.md) and triggered from Settings (SHR-11) and Withdraw ([PRV-09](02-provider-screens.md)); they reuse the OTP component documented in SHR-06.

---

## SHR-01 · شاشة البداية / Splash

- **Purpose** — Brand splash that bootstraps config, resolves the session, applies persisted locale/direction, and decides the route (force-update / role home / onboarding / auth / deep-link). Mirrors [onboarding §4](../03-user-flows/01-onboarding.md).
- **Route** — `app/index.tsx` (root gate before any group).
- **Entry points** — Cold start, warm start, deep link (`nora://…`, universal link, QR), push tap — all pass through here.
- **Layout / components**
  - Centered brand mark / wordmark on `bg/canvas` (or `bg/tint`), `display` type if any text, `space/11` breathing room.
  - Inline spinner / subtle progress (no skeleton — pre-content).
- **States**
  - **default** — brand mark while bootstrap+refresh run in parallel.
  - **loading** — this **is** the loading screen (parallel `GET /config/bootstrap` + `POST /auth/refresh`).
  - **empty** — n/a.
  - **error** — bootstrap network fail → retry state with **إعادة المحاولة** ([error-with-retry §29.3](../02-design-system/04-components.md#29-global-states)); cached config fallback if present, else routes to SHR-13 offline.
  - **success** — routes per decision tree: force-update sheet (blocking) / `CLI-01` / `PRV-02` / `SHR-02` / `SHR-05` / deep-link target / account-state screen ([authentication §10](../03-user-flows/02-authentication.md)).
- **Interactions** — Mostly automatic. Force-update → blocking sheet with store link (no further routing). Retry → re-run bootstrap. Pending deep-link intent stored before routing ([onboarding §6](../03-user-flows/01-onboarding.md)).
- **Navigation** — **From:** app launch / OS deep-link / push. **To:** SHR-02, SHR-05, CLI-01, PRV-02, deep-link target, force-update sheet, SHR-13 (offline), account-state screens.
- **APIs consumed** — `GET /api/v1/config/bootstrap` ; `POST /api/v1/auth/refresh` ; `GET /api/v1/links/resolve?u={url}` (deep link). Bootstrap+refresh run in parallel.
- **RTL & a11y** — Apply persisted locale + `I18nManager.forceRTL` before first paint for `ar` ([spacing §9.1](../02-design-system/03-spacing-layout.md)). Brand mark `accessibilityLabel`; spinner announces "جارٍ التحميل" once (polite). Transient error treated as unauth **without** clearing tokens ([authentication §9.2](../03-user-flows/02-authentication.md)).

---

## SHR-02 · اختيار اللغة / Language Select

- **Purpose** — First-run language choice (`العربية` RTL / `English` LTR); applies layout direction at runtime and persists locale.
- **Route** — `app/(auth)/language.tsx`.
- **Entry points** — SHR-01 when `onboarding_seen=false`; carousel back-swipe past slide 1 ([onboarding §7](../03-user-flows/01-onboarding.md)).
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) optional/transparent.
  - Title `h1` "اختاري اللغة / Choose language".
  - Two large selectable [ListItems](../02-design-system/04-components.md#16-listitem)/cards (العربية / English), each with check on selection (`bg/tint` + `action/primary`).
  - Primary `lg` [Button](../02-design-system/04-components.md#1-button) "متابعة / Continue".
- **States**
  - **default** — `ar` pre-selected (default locale).
  - **loading** — n/a (local).
  - **empty** — n/a.
  - **error** — n/a (offline-safe local op).
  - **success** — applies direction immediately + persists → SHR-03.
- **Interactions** — Tap a language → re-applies layout direction live (RTL/LTR) and re-renders; "متابعة" → persist locale (`AsyncStorage`) → SHR-03.
- **Navigation** — **From:** SHR-01, SHR-03 (back). **To:** SHR-03.
- **APIs consumed** — None (local persist; echoed via `Accept-Language` on first authed call).
- **RTL & a11y** — Selecting a language flips direction instantly without layout break ([spacing §9.1](../02-design-system/03-spacing-layout.md)); both labels in their own script. Options `role="radio"`; selection announced. Language can be changed later in SHR-11.

---

## SHR-03 · جولة تعريفية / Onboarding Carousel

- **Purpose** — 3-slide value-prop carousel (trust, home service, escrow safety) shown once; sets `onboarding_seen=true`. Mirrors `SHR-03`.
- **Route** — `app/(auth)/onboarding.tsx`.
- **Entry points** — SHR-02 "متابعة"; first-run only.
- **Layout / components**
  - Full-bleed paged carousel: per slide illustration (`icon/xl`-scale art) + headline (`h2`) + body (`body-lg`, `text/secondary`).
  - Page-dots indicator (direction-aware, active dot `action/primary`).
  - "تخطّي / Skip" ghost [Button](../02-design-system/04-components.md#1-button) (header end); primary `lg` "التالي" → "ابدئي" on last slide.
- **States**
  - **default** — slide 1.
  - **loading** — n/a (bundled assets).
  - **empty** — n/a.
  - **error** — n/a.
  - **success** — last slide / Skip → `onboarding_seen=true` → SHR-04.
- **Interactions** — Swipe / "التالي" advances; back-swipe from slide 1 → SHR-02; "تخطّي" or last-slide "ابدئي" → set flag → SHR-04.
- **Navigation** — **From:** SHR-02. **To:** SHR-04, SHR-02 (back-swipe).
- **APIs consumed** — None.
- **RTL & a11y** — Paging + dots progress in reading direction; stepper/next chevrons mirror ([spacing §9.2](../02-design-system/03-spacing-layout.md)). Slides expose heading+text (not art-only); Skip always reachable. Never force-re-run later ([onboarding §5](../03-user-flows/01-onboarding.md)).

---

## SHR-04 · اختيار الدور / Role Select

- **Purpose** — Choose intent: "أبحث عن خدمة" (client) vs "أقدّم خدمات" (become-provider); stores `intended_role` and hands off to auth. Mirrors `SHR-03b`.
- **Route** — `app/(auth)/role.tsx`.
- **Entry points** — SHR-03 end/Skip; SHR-01 warm-start when no cached `intended_role` ([onboarding §5](../03-user-flows/01-onboarding.md)).
- **Layout / components**
  - Title `h1` "كيف تحبّين استخدام نورة؟".
  - Two large choice cards (`radius/lg`, `elevation/1`): client (search glyph) + provider (briefcase/sparkle glyph), each with `h3` title + `body` subtitle + select check.
- **States**
  - **default** — neither pre-selected (or last-used hinted).
  - **loading** — n/a.
  - **empty** — n/a.
  - **error** — n/a.
  - **success** — selection stores `intended_role` → SHR-05.
- **Interactions** — Tap a card → store `intended_role=client|provider` → SHR-05 with that role. Back → SHR-03.
- **Navigation** — **From:** SHR-03, SHR-01. **To:** SHR-05.
- **APIs consumed** — None (role passed to `POST /auth/otp/request` later).
- **RTL & a11y** — Cards lay out RTL; icons non-directional. Each card composed label (title+subtitle); `role="radio"`. Deferring role (backgrounding) re-shows this on next launch ([onboarding §7](../03-user-flows/01-onboarding.md)). A client may later become a provider on the same account ([personas-roles §1](../00-overview/02-personas-roles.md)).

---

## SHR-05 · إدخال الجوال / Phone Entry

- **Purpose** — `+966`-locked phone entry + ToS/privacy consent; requests an OTP. Mirrors `SHR-04`, [authentication §4](../03-user-flows/02-authentication.md).
- **Route** — `app/(auth)/phone.tsx` (param `intended_role`).
- **Entry points** — SHR-04; deep-link requiring auth; re-login after logout/token-invalid.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back (to SHR-04) + title `h1` "أدخلي رقم جوالك".
  - [PhoneInput](../02-design-system/04-components.md#5-phoneinput) (🇸🇦 +966 chip locked; national `5X XXX XXXX`).
  - Consent row: checkbox + linked ToS/privacy (`caption`, links open web).
  - Helper `caption` "سنرسل رمز تحقق عبر رسالة نصية".
  - Primary `lg` [Button](../02-design-system/04-components.md#1-button) "متابعة" (enabled when valid number + consent).
- **States**
  - **default** — empty field, consent unchecked, button disabled.
  - **loading** — "متابعة" → button [loading state](../02-design-system/04-components.md#1-button) during `POST /auth/otp/request`.
  - **empty** — initial empty input.
  - **error** — invalid Saudi mobile (must start `5`, 9 digits) → [PhoneInput error](../02-design-system/04-components.md#5-phoneinput) "أدخلي رقم جوال سعودي صحيح" (client-side E.164 first); `429 otp_rate_limited`/`423 phone_locked` → [error Banner](../02-design-system/04-components.md#20-banner) with `retry_after`; `502 otp_delivery_failed` → retry + support link ([authentication §9.1](../03-user-flows/02-authentication.md)).
  - **success** — request OK → SHR-06 with `request_id`.
- **Interactions** — Type number (formatted/normalized to E.164); check consent; "متابعة" → `POST /auth/otp/request { phone, intended_role }` → SHR-06 (timers seeded from `resend_in`/`expires_in`). ToS/privacy links → in-app web.
- **Navigation** — **From:** SHR-04, deep link, re-login. **To:** SHR-06.
- **APIs consumed** — `POST /api/v1/auth/otp/request` → `{ request_id, expires_in, resend_in, channel }`.
- **RTL & a11y** — Whole phone value is an LTR isolated run inside RTL; `+966` at reading-start ([spacing §9.3/§9.4](../02-design-system/03-spacing-layout.md)). `textContentType="telephoneNumber"`, numeric keypad. Consent links keyboard/AT reachable; country locked to KSA at MVP.

---

## SHR-06 · تأكيد الرمز / OTP Verify

- **Purpose** — Enter the 6-digit OTP with resend timer, attempt counter, expiry, and lockout handling; on success mint session (or trigger reactivation / step-up). Mirrors `SHR-05`, [authentication §4/§7/§9](../03-user-flows/02-authentication.md).
- **Route** — `app/(auth)/otp.tsx` (params `request_id`, masked phone). Also reused as the step-up Re-Auth body (`SHR-07` auth) and reactivation.
- **Entry points** — SHR-05 request success; step-up triggers (withdrawal [PRV-09](02-provider-screens.md), deactivate from SHR-11); reactivation of a `deactivated` account.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back + title `h1` "أدخلي الرمز" + subtitle `caption` (masked `+966 5•• ••• ••XX`).
  - [OTPInput](../02-design-system/04-components.md#4-otpinput) (6 boxes, auto-advance, paste, one-time-code autofill).
  - Resend control + countdown (`caption`, polite live region; 5:00 expiry, 60s resend cooldown).
  - Attempts-remaining hint on wrong code.
- **States**
  - **default** — empty boxes, expiry + resend countdowns running.
  - **loading** — on 6th digit → verify in flight ([OTPInput](../02-design-system/04-components.md#4-otpinput) row spinner overlay).
  - **empty** — initial.
  - **error** — `422 otp_invalid` (attempts left) → boxes `error/500`, shake once, "رمز غير صحيح" + remaining attempts; `429 otp_attempts_exceeded` → invalidate + force Resend; `410 otp_expired` → "انتهت صلاحية الرمز" + enable Resend; `429 resend_too_soon` → Resend disabled w/ countdown; `423 phone_locked` → lockout banner (15 min) + support link ([authentication §9.1](../03-user-flows/02-authentication.md)).
  - **success** — `200` mint access+refresh → branch on `is_new` / account state (active→role home/role setup; deactivated→reactivate; suspended→suspended screen) per [authentication §4–§5/§10](../03-user-flows/02-authentication.md). Step-up mode → issue `step_up_token`, return to caller.
- **Interactions** — Type/paste code → auto `POST /auth/otp/verify`. Resend (when cooldown elapsed) → `POST /auth/otp/resend` (re-seed timers). Back → SHR-05 (request_id is memory-only; killed app restarts from SHR-05).
- **Navigation** — **From:** SHR-05, step-up triggers, reactivation. **To:** SHR-04 New-Account / role home (CLI-01 / PRV-02 / PRV-01 setup) / reactivation / suspended screen / back to caller (step-up).
- **APIs consumed** — `POST /api/v1/auth/otp/verify` ; `POST /api/v1/auth/otp/resend` ; (step-up) `POST /api/v1/auth/step-up` ; (reactivation) `POST /api/v1/account/reactivate`. Tokens → Expo `SecureStore`.
- **RTL & a11y** — OTP is a numeric LTR run even in `ar`; first digit fills start-most box ([components §4 a11y](../02-design-system/04-components.md#4-otpinput)). `autocomplete="one-time-code"`. Group `aria-label`; countdown polite live region; errors announced via live region; lockout countdown accessible.

---

## SHR-07 · المحادثات / Chat List

- **Purpose** — List of the user's conversations with counterparts (client↔provider), each tied to a booking; unread counts; entry to a thread. Mirrors `SHR-20` list.
- **Route** — `app/(shared)/chats/index.tsx` (Chat tab for both roles).
- **Entry points** — Chat tab in [BottomNavBar](../02-design-system/04-components.md#25-bottomnavbar); "مراسلة" from provider profile/booking detail (client) or booking detail (provider); notification.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) title `h1` "المحادثات".
  - Conversation [ListItems](../02-design-system/04-components.md#16-listitem): leading [Avatar](../02-design-system/04-components.md#11-avatar) (counterpart, online dot), name (`body`), last-message snippet (`caption`, truncated; "📷 صورة" for image), time (`caption`), trailing unread [Badge](../02-design-system/04-components.md#21-badge) count + linked-booking [StatusChip](../02-design-system/04-components.md#10-statuschip) mini.
- **States**
  - **default** — conversations, newest first; unread highlighted.
  - **loading** — list-row skeletons.
  - **empty** — [EmptyState](../02-design-system/04-components.md#23-emptystate) `no-chat` "لا محادثات بعد — تبدأ المحادثة بعد إنشاء حجز".
  - **error** — [error-with-retry §29.3](../02-design-system/04-components.md#29-global-states); socket disconnect → inline reconnect banner.
  - **success** — tap → SHR-08.
- **Interactions** — Tap row → SHR-08 (marks read). Pull-to-refresh. Live updates via Socket.IO (new message bumps row + badge). Archived (post-completion) conversations are read-only and labelled.
- **Navigation** — **From:** Chat tab, profile/booking "مراسلة", notifications. **To:** SHR-08.
- **APIs consumed** — `GET /api/v1/chats?page` ; Socket.IO presence/message events ; unread counts. (Chat exists once a booking exists between the two parties; admin cannot read chat — [provider §8](../03-user-flows/04-provider.md).)
- **RTL & a11y** — Avatar leading at reading-start; unread badge trailing-top; snippet bidi-isolated (mixed scripts). Unread count in accessible name ("٣ غير مقروءة"). Online state announced as text.

---

## SHR-08 · محادثة / Chat Conversation (text + image sharing)

- **Purpose** — One-to-one booking-scoped messaging with text + image sharing, presence, typing, read receipts, history. Mirrors `SHR-20`, [provider §8](../03-user-flows/04-provider.md) (G7).
- **Route** — `app/(shared)/chats/[id].tsx`.
- **Entry points** — SHR-07 row; "مراسلة" from booking/profile detail; notification deep link.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back + counterpart [Avatar](../02-design-system/04-components.md#11-avatar) `sm` + name + presence/typing subtitle + overflow (view booking → CLI-10/PRV-07, report → SHR-10).
  - Linked-booking context strip ([StatusChip](../02-design-system/04-components.md#10-statuschip) + "عرض الحجز").
  - Message thread of [ChatBubbles](../02-design-system/04-components.md#27-chatbubble-sent--received--image): `sent` (reading-end, `action/primary`), `received` (reading-start), `image` variant; timestamps + read receipts (✓/✓✓ `info/500`); date separators.
  - Composer: [TextInput](../02-design-system/04-components.md#3-textinput) (multiline) + image-attach [IconButton](../02-design-system/04-components.md#2-iconbutton) (camera/gallery → [SHR-14 camera permission](#shr-14--طلبات-الأذونات--permission-prompts-location--notifications--camera)) + send IconButton (**send icon mirrors** in RTL).
- **States**
  - **default** — thread + composer.
  - **loading** — history skeleton bubbles; older-message paging spinner; image upload skeleton bubble.
  - **empty** — new thread → subtle "ابدئي المحادثة" hint (not full EmptyState).
  - **error** — message send fail → bubble `failed` state (red ↻ retry, `error/500`); image upload fail → retry on the image bubble; socket drop → reconnect banner; archived thread → composer disabled with "انتهت المحادثة" note.
  - **success** — message sent (✓) → delivered/read (✓✓ `info/500`).
- **Interactions** — Type + send → optimistic `sending` bubble → server ack. Attach image → pick (camera/gallery) → client resize → signed S3 upload → image bubble. Long-press bubble → action sheet (copy/retry/report). Tap image → full-screen viewer. "عرض الحجز" → CLI-10/PRV-07. Scroll up → load history. Report → SHR-10.
- **Navigation** — **From:** SHR-07, booking/profile detail, notifications. **To:** CLI-10 / PRV-07, image viewer, SHR-10, SHR-14.
- **APIs consumed** — `GET /api/v1/chats/{id}/messages?page` ; Socket.IO (send/receive/typing/receipts) ; image via signed S3 URL (`POST /api/v1/chats/{id}/attachments` → put). Chat read-only/archived after completion ([provider §8](../03-user-flows/04-provider.md)).
- **RTL & a11y** — Sent/received auto-flip with RTL; **send (paper-plane) icon mirrors**, image/camera glyphs do **not** ([spacing §9.2](../02-design-system/03-spacing-layout.md)). Timestamps Arabic-Indic; receipts have text equivalents ("تم الإرسال"/"تمت القراءة"); images require alt. Composer input `textAlign: start`. Mixed-script messages bidi-isolated.

---

## SHR-09 · الدعم / Support & Help (ticket list + new ticket)

- **Purpose** — In-app support channel: browse the user's support tickets and open a new one (general help, not booking-specific). Mirrors `SHR-21` support side.
- **Route** — `app/(shared)/support/index.tsx` ; new `app/(shared)/support/new.tsx` ; detail `app/(shared)/support/[id].tsx`.
- **Entry points** — Profile/Settings "الدعم" (CLI-13 / PRV-11 / SHR-11); lockout/error screens' support links; OTP delivery failure link.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) title `h2` "الدعم والمساعدة".
  - Optional FAQ/help [ListItems](../02-design-system/04-components.md#16-listitem) (collapsible) at top.
  - Ticket list: [ListItems](../02-design-system/04-components.md#16-listitem) (subject `body`, status [Chip](../02-design-system/04-components.md#9-chip--tag) — مفتوح/قيد المعالجة/مغلق, last-update `caption`).
  - [FAB](../02-design-system/04-components.md#26-fab)/footer Button "تذكرة جديدة" → new-ticket form (subject [TextInput](../02-design-system/04-components.md#3-textinput), category [Dropdown](../02-design-system/04-components.md#7-dropdownselect), description multiline, optional attachment).
  - Detail screen: threaded messages + reply composer.
- **States**
  - **default** — FAQ + ticket list.
  - **loading** — list-row skeletons; submit → button loading.
  - **empty** — [EmptyState](../02-design-system/04-components.md#23-emptystate) "لا تذاكر — كيف يمكننا مساعدتك؟" + CTA "تذكرة جديدة".
  - **error** — load/submit fail → [error-with-retry §29.3](../02-design-system/04-components.md#29-global-states) / [error Banner](../02-design-system/04-components.md#20-banner); validation on required fields → [TextInput error](../02-design-system/04-components.md#3-textinput).
  - **success** — ticket created/replied → [Toast](../02-design-system/04-components.md#19-toast--snackbar) "تم إرسال تذكرتك" → detail.
- **Interactions** — Tap FAQ → expand. "تذكرة جديدة" → form → `POST /support/tickets`. Tap ticket → detail; reply → `POST /support/tickets/{id}/messages`. Attach file (camera/gallery → SHR-14). Pull-to-refresh.
- **Navigation** — **From:** Settings/Profile, lockout/error/OTP-fail links. **To:** new-ticket form, ticket detail.
- **APIs consumed** — `GET /api/v1/support/tickets` ; `POST /api/v1/support/tickets` ; `GET /api/v1/support/tickets/{id}` ; `POST /api/v1/support/tickets/{id}/messages`.
- **RTL & a11y** — Status conveyed by Chip label+icon (color never alone). FAQ accordions expose expanded state. Form fields labelled; errors via live region. FAB at reading-end bottom.

---

## SHR-10 · الشكاوى والنزاعات / Complaint & Dispute (file + track)

- **Purpose** — File a booking-scoped complaint/dispute (client or provider), attach evidence, and track adjudication; provider-respond mode for incoming complaints (G4). Routes the booking to `disputed` (funds held). Mirrors `SHR-21` dispute side + [provider §11](../03-user-flows/04-provider.md) `PRV-50`.
- **Route** — `app/(shared)/disputes/index.tsx` ; new `app/(shared)/disputes/new.tsx` (param `booking_id`) ; detail `app/(shared)/disputes/[id].tsx`.
- **Entry points** — "فتح شكوى" from [CLI-10](01-client-screens.md) / [PRV-07](02-provider-screens.md); "نزاع" from chat overflow (SHR-08); provider's complaints entry (PRV-11/PRV-12s).
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back + title `h2` "الشكاوى" / "تقديم شكوى".
  - Disputes list: [ListItems](../02-design-system/04-components.md#16-listitem) (booking ref, status [Chip](../02-design-system/04-components.md#9-chip--tag) — مفتوحة/قيد المراجعة/تم الحل, date).
  - New form: linked-booking context card, reason [Dropdown](../02-design-system/04-components.md#7-dropdownselect), description multiline [TextInput](../02-design-system/04-components.md#3-textinput), evidence image attachments (signed S3), submit Button.
  - Detail/track: status timeline + threaded messages + evidence gallery; **provider-respond** composer when the user is the respondent.
- **States**
  - **default** — list / form / track view.
  - **loading** — skeletons; submit → button loading; upload progress.
  - **empty** — [EmptyState](../02-design-system/04-components.md#23-emptystate) "لا شكاوى".
  - **error** — submit/upload fail → [error Banner](../02-design-system/04-components.md#20-banner); already-disputed booking → opens existing dispute; not-eligible (e.g. wrong status) → blocked notice.
  - **success** — filed → [Banner](../02-design-system/04-components.md#20-banner) `success` "تم تقديم شكواك — سيتم مراجعتها"; booking → `disputed` (funds held per [client-booking §9](../03-user-flows/03-client-booking.md)).
- **Interactions** — "تقديم شكوى" → form → `POST /complaints { booking_id, reason, ... }` + evidence. Provider responds (respond mode) → `POST /complaints/{id}/respond` with text+evidence. Tap dispute → track. Admin ops adjudicates server-side (outcome affects held funds + provider standing — [provider §11](../03-user-flows/04-provider.md)).
- **Navigation** — **From:** CLI-10, PRV-07, SHR-08, PRV-11/12s. **To:** new form, dispute detail/track.
- **APIs consumed** — `GET /api/v1/me/complaints` ; `POST /api/v1/complaints` ; `GET /api/v1/complaints/{id}` ; `POST /api/v1/complaints/{id}/respond` ; evidence via signed S3. (Admin tooling is web-side.)
- **RTL & a11y** — Status timeline reading-direction; status Chip label+icon. Evidence images need alt. Form labelled; errors via live region. Booking ref + amounts bidi-isolated. Respond composer focus-managed.

---

## SHR-11 · الإعدادات / Settings (language, theme, notifications, account)

- **Purpose** — App + account settings: language, theme (light/dark/system), notification toggles, role switch, account actions (deactivate via step-up, logout, logout-all). Mirrors `SHR-30`.
- **Route** — `app/(shared)/settings.tsx`.
- **Entry points** — Profile menu (CLI-13 / PRV-11).
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back + title `h2` "الإعدادات".
  - **Language** [ListItem](../02-design-system/04-components.md#16-listitem) → language [Dropdown](../02-design-system/04-components.md#7-dropdownselect)/sheet (re-applies direction at runtime).
  - **Theme** [ListItem](../02-design-system/04-components.md#16-listitem) → segmented (فاتح / داكن / النظام) consuming [theme tokens](../02-design-system/01-colors.md#5-theme-mapping-light--dark).
  - **Notifications** section: per-category switches (الحجوزات / التذكيرات / العروض / المحادثات) → device + server prefs; link to OS settings if push disabled (SHR-14).
  - **Account** section: role switch (dual-capability), "إلغاء تنشيط الحساب" (destructive, step-up), "تسجيل الخروج", "تسجيل الخروج من كل الأجهزة".
  - App version / ToS / privacy links footer.
- **States**
  - **default** — current settings reflected.
  - **loading** — pref save → inline switch spinner; deactivate → button loading.
  - **empty** — n/a.
  - **error** — pref save fail → revert + [Toast](../02-design-system/04-components.md#19-toast--snackbar); deactivate blocked `409 has_active_obligations` (in-progress booking / pending withdrawal) → explanatory [Modal](../02-design-system/04-components.md#18-modal--dialog) ([authentication §10](../03-user-flows/02-authentication.md)).
  - **success** — saves persist; deactivate → `SHR-08` (auth) Account-Deactivated; logout → SHR-05.
- **Interactions** — Change language → re-apply direction + persist. Change theme → apply. Toggle notification categories → `PATCH /me/notification-prefs` (+ OS permission via SHR-14 if enabling). Role switch → swap tab group. "إلغاء تنشيط" → step-up (SHR-06 OTP) → `POST /account/deactivate`. "تسجيل الخروج" → `POST /auth/logout` → SHR-05; "من كل الأجهزة" → `POST /auth/logout-all`.
- **Navigation** — **From:** CLI-13, PRV-11. **To:** SHR-06 (step-up), SHR-05 (logout), Account-Deactivated (auth), SHR-14 (OS settings), CLI-01/PRV-02 (role switch).
- **APIs consumed** — `PATCH /api/v1/me/notification-prefs` ; `POST /api/v1/account/deactivate` (step-up) ; `POST /api/v1/auth/logout` ; `POST /api/v1/auth/logout-all` ; `POST /api/v1/auth/step-up`.
- **RTL & a11y** — Language change flips direction live without restart. Switch/segmented states announced. Destructive deactivate `role="alertdialog"`; obligations block explained as text. Theme respects system + AA contrast ([colors §6](../02-design-system/01-colors.md)).

---

## SHR-12 · تعديل الملف / Edit Profile

- **Purpose** — Edit the user's own profile (role-aware fields): client = name, photo; provider = name, bio, specialties, service areas, photo. Mirrors `PRV-15` for providers.
- **Route** — `app/(shared)/edit-profile.tsx`.
- **Entry points** — "تعديل الملف" from CLI-13 / "تعديل الملف العام" from PRV-11.
- **Layout / components**
  - [AppBar](../02-design-system/04-components.md#24-appbarheader) back + title `h2` "تعديل الملف" + "حفظ" action.
  - Profile photo [Avatar](../02-design-system/04-components.md#11-avatar) `xl` + change IconButton (camera/gallery → SHR-14).
  - [TextInput](../02-design-system/04-components.md#3-textinput) name (all); phone shown read-only (LTR-isolated, change is Phase 2).
  - Provider-only: bio multiline, specialty [Chips](../02-design-system/04-components.md#9-chip--tag), service-areas selector.
  - Footer primary `lg` Button "حفظ".
- **States**
  - **default** — current values pre-filled.
  - **loading** — save → button loading; photo upload progress.
  - **empty** — n/a.
  - **error** — validation (empty name) → [TextInput error](../02-design-system/04-components.md#3-textinput); save/upload fail → [error Banner](../02-design-system/04-components.md#20-banner).
  - **success** — save → [Toast](../02-design-system/04-components.md#19-toast--snackbar) "تم حفظ التغييرات" → back.
- **Interactions** — Edit fields; change photo (signed S3); "حفظ" → `PATCH /me` (client) / `PATCH /me/provider` (provider). Back with unsaved changes → confirm [Modal](../02-design-system/04-components.md#18-modal--dialog).
- **Navigation** — **From:** CLI-13, PRV-11. **To:** SHR-14 (camera), back.
- **APIs consumed** — `PATCH /api/v1/me` ; `PATCH /api/v1/me/provider` (provider fields) ; photo via signed S3.
- **RTL & a11y** — Inputs `textAlign: start`; phone read-only LTR-isolated. Photo upload progress polite live region; alt prompted. Discard-changes `role="alertdialog"`. Validation errors via live region.

---

## SHR-13 · حالات بديلة / Empty · Offline · Error Fallbacks

- **Purpose** — Standardized cross-screen fallbacks so every list/detail/feed behaves identically: empty, offline, and full-screen error-with-retry. Canonicalizes [components §29 global states](../02-design-system/04-components.md#29-global-states).
- **Route** — `app/(shared)/_fallbacks/*` — composable components rendered in place (offline as a root overlay/route `app/(shared)/_fallbacks/offline.tsx`); not standalone navigable screens except offline.
- **Entry points** — Rendered by any screen on the corresponding condition (zero results, network loss, fetch failure); offline overlay triggers on connectivity loss app-wide.
- **Layout / components**
  - **Empty** — [EmptyState](../02-design-system/04-components.md#23-emptystate): centered glyph (`icon/xl`, `neutral/400`), title `h3`, supportive `body` `text/secondary`, context CTA [Button](../02-design-system/04-components.md#1-button) (e.g. no-bookings → "تصفّحي الخدمات", no-portfolio → "أضيفي عملاً").
  - **Offline** — banner/overlay: offline glyph, "لا يوجد اتصال بالإنترنت", retry [Button](../02-design-system/04-components.md#1-button) "إعادة المحاولة"; cached content shown read-only where available.
  - **Error** — [error-with-retry §29.3](../02-design-system/04-components.md#29-global-states): glyph (`icon/xl`, `error/500`), title `h3`, explanation `body`, secondary [Button](../02-design-system/04-components.md#1-button) "إعادة المحاولة"; section failures use an [error Banner](../02-design-system/04-components.md#20-banner) with retry.
- **States**
  - **default** — the relevant fallback variant rendered.
  - **loading** — retry in flight → button [loading state](../02-design-system/04-components.md#1-button); on reconnect, swap back to content.
  - **empty** — empty variant (valid zero-result, neutral tone — empty ≠ error).
  - **error** — error variant; preserves user input across retry.
  - **success** — retry succeeds → host content replaces the fallback.
- **Interactions** — "إعادة المحاولة" re-runs the failed query / reconnects. Empty CTAs route to the resolving screen (e.g. CLI-01). Offline overlay auto-dismisses on reconnect.
- **Navigation** — **From/To:** in-place within any host screen; offline overlay returns to the prior screen on reconnect; empty CTAs navigate to their target (e.g. CLI-01).
- **APIs consumed** — None of its own; re-invokes the host screen's failed request.
- **RTL & a11y** — Centered/direction-neutral; meaningful heading+text (not art alone); `role="alert"` for error/offline; retry keyboard-focusable; input preserved across retry. All three respect RTL + AA contrast ([colors §6](../02-design-system/01-colors.md)).

---

## SHR-14 · طلبات الأذونات / Permission Prompts (location / notifications / camera)

- **Purpose** — Pre-permission rationale prompts that explain *why* a permission is needed before triggering the OS dialog, plus a denied/blocked state guiding the user to OS settings. Covers **location** (nearest-provider search, address pin), **notifications** (booking confirmations, reminders, broadcasts), **camera** (QR check-in scan, portfolio/chat/ticket images).
- **Route** — `app/(shared)/permissions/location.tsx` · `…/notifications.tsx` · `…/camera.tsx` (presented as [BottomSheet](../02-design-system/04-components.md#17-bottomsheet) `modal` or full screen).
- **Entry points** — **Location:** CLI-01 location pill, CLI-06 address map ([client-booking §location](../03-user-flows/03-client-booking.md)). **Notifications:** post-auth first run, SHR-11 enabling a category. **Camera:** CLI-10 QR scan, PRV-07 QR present/scan, PRV-04 portfolio upload, SHR-08 chat image, SHR-09/SHR-10 attachments.
- **Layout / components**
  - [BottomSheet](../02-design-system/04-components.md#17-bottomsheet) with drag handle + header (`h2` purpose title) + close.
  - Rationale block: relevant glyph (`icon/xl`), title `h3`, benefit copy `body` `text/secondary`.
  - Primary `lg` [Button](../02-design-system/04-components.md#1-button) "السماح" (triggers OS dialog) + ghost "ليس الآن".
  - **Denied/blocked variant:** [Banner](../02-design-system/04-components.md#20-banner) `warning` "تم رفض الإذن" + Button "فتح الإعدادات" (deep-link to OS app settings).
- **States**
  - **default** — rationale + allow/not-now.
  - **loading** — n/a (OS dialog is modal).
  - **empty** — n/a.
  - **error** — permission denied → denied variant; permanently blocked → blocked variant with OS-settings deep link.
  - **success** — granted → dismiss + resume the original action (search / map pin / scanner / picker / push registration).
- **Interactions** — "السماح" → request OS permission → on grant resume action; on deny → denied variant. "ليس الآن" → dismiss (degraded: e.g. manual area entry instead of GPS; no push). "فتح الإعدادات" → OS settings deep link. Re-checks status on app foreground.
- **Navigation** — **From:** the feature that needs the permission. **To:** back to that feature (granted), OS settings (blocked).
- **APIs consumed** — None directly; on notification grant → register Expo push token (`POST /api/v1/me/devices`). Location/camera use device APIs; results feed `providers/search`, address `POST /me/addresses`, QR `checkin`, and signed-S3 uploads in the calling screens.
- **RTL & a11y** — Sheet content RTL; close at reading-end; glyphs non-directional. Rationale is real text (not art-only); buttons ≥44pt. `role="dialog"` focus-trapped; denied/blocked state announced via `role="alert"`. Never block core flows without a degraded fallback (e.g. manual location entry).

---

> **Cross-references.** Client funnel + booking detail in [01-client-screens.md](01-client-screens.md); provider fulfilment, wallet, visibility in [02-provider-screens.md](02-provider-screens.md). Auth/session/step-up/account-state details in [authentication](../03-user-flows/02-authentication.md); first-launch routing in [onboarding](../03-user-flows/01-onboarding.md); money mechanics in [payments-payouts](../03-user-flows/05-payments-payouts.md). Design tokens/components: [colors](../02-design-system/01-colors.md), [typography](../02-design-system/02-typography.md), [spacing-layout](../02-design-system/03-spacing-layout.md), [components](../02-design-system/04-components.md).
