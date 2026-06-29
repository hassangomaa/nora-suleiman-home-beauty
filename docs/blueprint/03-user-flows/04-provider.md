# User Flow — Provider

> **Scope.** The provider (`مقدّمة خدمة`) journey: instant onboarding (no approval) → build profile (services with price+duration, portfolio, availability) → go discoverable → receive/accept booking → chat → travel + present QR → perform service → mark complete → earnings credited to wallet → request withdrawal → buy a visibility package → respond to a complaint.
>
> **Roles.** Actor is an authenticated `provider` (a phone+OTP account with the provider capability). A `client` may add this capability to the *same* account ([personas-roles](../00-overview/02-personas-roles.md) §1).
>
> **Gaps closed.** Instant onboarding ([product-brief](../00-overview/01-product-brief.md) §3.1), G8 (service duration + availability), G2 (wallet + withdrawal — detailed in [payments-payouts](05-payments-payouts.md)), G4 (complaint response), visibility packages ([product-brief](../00-overview/01-product-brief.md) §6).
>
> **Entry.** Reached after OTP verification with `intended_role=provider` ([authentication](02-authentication.md) §4.1) or by an existing client choosing "become a provider."

---

## 1. Provider capability sub-states

Independent of account state (`active` / `suspended` / `deactivated`); from [personas-roles](../00-overview/02-personas-roles.md) §5:

| Flag | Meaning | Required for |
|---|---|---|
| `profile_complete` | ≥1 service (price+duration) and ≥1 portfolio item. | Appearing in search. |
| `accepting_bookings` | Availability set + "open for work" toggle ON. | Being bookable. |
| `tier` | `beginner` / `mid` / `established`. | Commission %. |
| `visibility_boost` | Active package (silver/gold/platinum) + expiry. | Ranking boost. |

A provider is **discoverable** only when `account_state=active` AND `profile_complete` AND `accepting_bookings`.

---

## 2. Screens involved

| ID | Name | Purpose |
|---|---|---|
| `PRV-10` | Provider Home / Dashboard | KPIs, today's bookings, open-for-work toggle. |
| `PRV-11` | Profile Setup Wizard | Post-OTP onboarding steps (services → portfolio → availability). |
| `PRV-12` | Services Manager | CRUD services with price + duration (G8). |
| `PRV-13` | Portfolio Manager | Upload/reorder gallery images (S3 signed URLs). |
| `PRV-14` | Availability Calendar | Weekly hours + blocks; drives slot generation. |
| `PRV-15` | Edit Profile | Bio, specialties, service areas, photo. |
| `PRV-20` | Bookings List | Incoming requests + upcoming/active/history tabs. |
| `PRV-21` | Booking Detail | Accept/reject, on-the-way, QR present, complete. |
| `PRV-22` | QR Present / Scan | Show check-in QR or scan client QR. |
| `PRV-23` | In-Visit Add-on | Propose an add-on during the visit. |
| `PRV-30` | Wallet / Earnings | Balance, ledger, pending vs available. |
| `PRV-31` | Withdraw | Request withdrawal (step-up; bank details). |
| `PRV-40` | Visibility Packages | Buy silver/gold/platinum boost. |
| `PRV-50` | Complaints | View + respond to complaints/disputes. |
| `SHR-20` | Chat | Provider ↔ client messaging (with images). |
| `SHR-21` | Support | Provider support tickets. |

---

## 3. Instant onboarding & profile build (no approval)

1. After OTP verify with `intended_role=provider` ([authentication](02-authentication.md)), the account is created `active` **immediately** — no admin approval queue ([product-brief](../00-overview/01-product-brief.md) §3.1).
2. Route to `PRV-11` **Profile Setup Wizard**:
   1. **Basics** (`PRV-15`): display name, bio, specialties, service areas, profile photo.
   2. **Services** (`PRV-12`): add ≥1 service with **name, category, price (SAR), duration (minutes)** (G8). `POST /me/services`.
   3. **Portfolio** (`PRV-13`): upload ≥1 image (resized client-side < 1 MB, signed S3 URL per [tech-stack](../01-architecture/01-tech-stack.md) §1). `POST /me/portfolio`.
   4. **Availability** (`PRV-14`): set weekly working hours + day blocks. `PUT /me/availability`.
3. When ≥1 service+price+duration and ≥1 portfolio item exist, the server flips `profile_complete=true`.
4. The provider toggles **مفتوحة للعمل / Open for work** on `PRV-10` → `accepting_bookings=true`. Now discoverable in client search.

> A provider can be `active` but not discoverable (e.g. profile incomplete or toggle off). The toggle is the provider's instant on/off switch for new bookings.

---

## 4. APIs called

| Step | Name | Method · Path | Auth/role |
|---|---|---|---|
| Update profile | `PATCH /me/provider` | `PATCH /api/v1/me/provider` | provider (self) |
| Services CRUD | `POST/PATCH/DELETE /me/services[/{id}]` | `/api/v1/me/services` | provider (self) |
| Portfolio | `POST/DELETE /me/portfolio[/{id}]` | `/api/v1/me/portfolio` | provider (self) |
| Availability | `GET/PUT /me/availability` | `/api/v1/me/availability` | provider (self) |
| Open-for-work | `PATCH /me/provider/discoverability` | `/api/v1/me/provider/discoverability` | provider (self) |
| Incoming bookings | `GET /me/bookings?status=` | `/api/v1/me/bookings` | provider (self) |
| Accept / reject | `POST /bookings/{id}/accept` · `/reject` | `/api/v1/bookings/{id}/accept` | provider (self) |
| On the way | `POST /bookings/{id}/on-the-way` | `/api/v1/bookings/{id}/on-the-way` | provider (self) |
| Present/verify QR | `POST /bookings/{id}/checkin` | `/api/v1/bookings/{id}/checkin` | provider (present/scan) |
| Start | `POST /bookings/{id}/start` | `/api/v1/bookings/{id}/start` | provider (self) |
| Propose add-on | `POST /bookings/{id}/addons` | `/api/v1/bookings/{id}/addons` | provider (self) |
| Mark complete | `POST /bookings/{id}/complete` | `/api/v1/bookings/{id}/complete` | provider (self) |
| Wallet | `GET /me/wallet` · `GET /me/wallet/ledger` | `/api/v1/me/wallet` | provider (self) |
| Withdraw | `POST /me/withdrawals` | `/api/v1/me/withdrawals` | provider (self) + step-up |
| Bank details | `GET/PUT /me/payout-account` | `/api/v1/me/payout-account` | provider (self) + step-up |
| Buy package | `POST /me/visibility/purchase` | `/api/v1/me/visibility/purchase` | provider (self) |
| Complaints | `GET /me/complaints` · `POST /complaints/{id}/respond` | `/api/v1/me/complaints` | provider (self) |
| Chat | (Socket.IO) + `GET /chats/{id}/messages` | gateway / REST | provider |

> Schemas: [03-providers-services](../05-api-contracts/03-providers-services.md), [04-bookings](../05-api-contracts/04-bookings.md), [05-payments-payouts](../05-api-contracts/05-payments-payouts.md), [07-ratings-complaints](../05-api-contracts/07-ratings-complaints.md), [06-chat-notifications](../05-api-contracts/06-chat-notifications.md).

---

## 5. Happy path (fulfilment)

1. **Receive** — A client books and the escrow hold succeeds; provider gets a push. `PRV-20` shows a `pending_provider` request with a countdown to the accept window.
2. **Review** — Provider opens `PRV-21`: service(s), duration, address area, slot, payout estimate (net of commission for their `tier`).
3. **Accept** — `POST /bookings/{id}/accept` → status `confirmed`; the slot is locked; client reminders are scheduled (T-24h / T-2h, BullMQ). (Or **reject** → `rejected`, client fully refunded.)
4. **Chat** — Before the visit, provider and client coordinate on `SHR-20` (text + images; media via signed S3 URLs — G7).
5. **Travel** — On the day, provider taps **في الطريق / On the way** → `POST /bookings/{id}/on-the-way` → status `on_the_way`; client gets a push (MVP: status + push, not live GPS — G9 deferred).
6. **QR present** — At the door, provider presents the check-in QR on `PRV-22`; client scans (`CLI-23`) → status `checked_in`. (Fallback: provider scans the client's QR — same token.)
7. **Start** — Provider taps start → `POST /bookings/{id}/start` → `in_progress`.
8. **In-visit add-on (optional)** — Provider proposes an add-on on `PRV-23` → `POST /bookings/{id}/addons`; client approves (`CLI-24`) → incremental escrow hold ([client-booking](03-client-booking.md) §7).
9. **Complete** — Provider taps **إنهاء الخدمة / Complete** → `POST /bookings/{id}/complete`. Client confirms (or auto-confirm window) → status `completed`.
10. **Earnings credited** — On `completed`, escrow is captured, commission is split by the provider's `tier`, and the **net is credited to the provider wallet** as `pending` then `available` after the clearance window ([payments-payouts](05-payments-payouts.md) §4). `PRV-30` reflects it.

---

## 6. Receive / accept decision branches

| Branch | Condition | Outcome |
|---|---|---|
| Accept | within window | `confirmed`; reminders scheduled. |
| Reject | provider declines | `rejected`; client full refund; no penalty if before any check-in. |
| Timeout | no response in accept window | `expired`; client full refund; repeated expiries may lower ranking. |
| Conflict | slot overlaps another confirmed booking | server blocks double-accept (`409 slot_conflict`); availability is the source of truth (G8). |
| Provider cancels after accept | provider action | `cancelled_by_provider`; client full refund + **provider penalty** ([payments-payouts](05-payments-payouts.md) §6); ranking impact. |

---

## 7. QR, completion & no-show edge cases

| Case | Handling |
|---|---|
| QR token invalid/expired | `422 invalid_checkin_token`; retry or ops verification via `SHR-21`. |
| Client not at door | Provider waits grace period → reports client no-show → `no_show_client` (ops review) ([client-booking](03-client-booking.md) §9.2). |
| Provider never arrives | Client reports → `no_show_provider`; full client refund + provider penalty. |
| Complete without check-in | Blocked (`409 not_checked_in`); check-in is a precondition for `start`/`complete`. |
| Client disputes completion | status `disputed`; payout held ([payments-payouts](05-payments-payouts.md) §7). |
| Add-on declined | service proceeds at original scope. |

---

## 8. Chat

In-app chat via Socket.IO (NestJS gateway): presence, typing, message history persisted; image sharing via signed S3 URLs (G7). Chat is available once a booking exists between the two parties and is read-only/archived after completion. Admin cannot read chat ([personas-roles](../00-overview/02-personas-roles.md) §3). Abuse is reported through `SHR-21`.

---

## 9. Earnings → withdrawal

1. `PRV-30` **Wallet** shows: `available_balance`, `pending_balance`, and the ledger (`GET /me/wallet/ledger`) of credits (completed bookings, net of commission), debits (refunds, penalties), and withdrawals.
2. First withdrawal requires a saved **payout account** (bank/IBAN) via `PUT /me/payout-account` (step-up protected).
3. Provider taps **سحب / Withdraw** on `PRV-31`, enters an amount ≤ `available_balance`.
4. Withdrawal is a **sensitive action** → step-up re-auth ([authentication](02-authentication.md) §7) issues a `step_up_token`.
5. `POST /me/withdrawals` creates a withdrawal in `requested`; the amount is moved from `available` to a `withdrawal_hold`.
6. Admin finance reviews → approves → bank transfer; states `requested → approved → processing → paid` (or `rejected` → funds returned to `available`). Full lifecycle and who-can-do-what in [payments-payouts](05-payments-payouts.md) §5.

| Edge | Handling |
|---|---|
| Amount > available | `422 insufficient_balance`. |
| No payout account | block; prompt to add it first. |
| Step-up expired | `401 step_up_required` → re-verify. |
| Pending booking funds | only `available` (cleared) funds are withdrawable; `pending` is excluded. |
| Account deactivation with pending withdrawal | deactivation blocked until resolved ([authentication](02-authentication.md) §10). |

---

## 10. Visibility package purchase

1. `PRV-40` lists **Silver (2–3d) · Gold (5d) · Platinum (10d)** with price and ranking effect ([product-brief](../00-overview/01-product-brief.md) §6).
2. Provider selects a package → `POST /me/visibility/purchase` → Moyasar payment sheet (direct charge, not escrow; this is platform revenue).
3. On payment success, `visibility_boost` is set with an expiry; a BullMQ job expires it automatically.
4. Boost raises the provider's position in client search results (combined with distance + rating).

| Edge | Handling |
|---|---|
| Payment fails | no boost applied; retry. |
| Boost already active | stack/extend per policy (extend expiry) or block second purchase (configurable). |
| Provider not discoverable | warn that the boost has no effect until `profile_complete` + open-for-work. |

---

## 11. Respond to complaint (G4)

1. A client files a complaint/dispute (`SHR-21` → status may become `disputed`).
2. Provider sees it on `PRV-50` with the booking context.
3. Provider responds with text + optional evidence images → `POST /complaints/{id}/respond`.
4. Admin ops adjudicates; outcome may release/refund/partially refund the held funds and may affect provider standing (warning → `suspended` for repeat abuse). Money outcomes in [payments-payouts](05-payments-payouts.md) §7; admin tooling in [08-admin](../05-api-contracts/08-admin.md).

---

## 12. ASCII flow diagram

```
 OTP verify (intended_role=provider) ─▶ account ACTIVE immediately (no approval)
            │
            ▼
   PRV-11 Setup Wizard:  PRV-12 Services(price+duration) ─▶ PRV-13 Portfolio ─▶ PRV-14 Availability
            │                                                                        │
            └──────────────── profile_complete=true ◀───────────────────────────────┘
            │
   PRV-10 toggle "Open for work" → accepting_bookings=true → DISCOVERABLE
            │
            ▼
   PRV-20 incoming (pending_provider) ──┬── reject → rejected (client refund)
            │                           └── timeout → expired (client refund)
       accept │
            ▼
   confirmed ─▶ schedule client reminders ─▶ SHR-20 chat (text+images)
            │
   "On the way" → on_the_way (push) ─▶ PRV-22 present QR ─▶ checked_in
            │
   start → in_progress ──(add-on?)──▶ PRV-23 propose → client approve → +escrow hold
            │
   complete → (client confirm / auto) → completed
            │
   ESCROW CAPTURE → commission split (by tier) → WALLET credit (pending→available)
            │
   PRV-30 Wallet ─▶ PRV-31 Withdraw (step-up) → requested → [admin finance] → paid
                                                                  └─ rejected → funds back

 Side flows:
   PRV-40 Visibility → purchase (Moyasar direct) → visibility_boost(expiry) → ranking up
   PRV-50 Complaints → respond(+evidence) → admin adjudication → funds outcome
```

---

## 13. Hand-off

The client side of every shared step (book, accept-confirm, QR scan, completion, cancel/reschedule, no-show, review) is in **[03-client-booking.md](03-client-booking.md)**. All money flows (escrow capture, commission tiers, wallet, withdrawals, penalties, dispute holds) are specified in **[05-payments-payouts.md](05-payments-payouts.md)**.
