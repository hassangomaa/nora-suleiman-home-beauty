# API Contract — Bookings, Lifecycle & Escrow

> **Scope.** Slot discovery, booking creation with escrow hold, booking reads, the full status state-machine (accept / reject / on-the-way / QR check-in / start / complete), cancellation with refund-by-window, reschedule (request + accept), and in-visit add-ons. Cross-cutting rules in [01-conventions.md](01-conventions.md) (envelope, idempotency, errors, time). Auth/roles in [02-auth.md](02-auth.md) and [personas-roles](../00-overview/02-personas-roles.md). Entities/enums (`Booking`, `BookingItem`, `AvailabilitySlot`, `Payment`, `Refund`, `Wallet`) per [data-model](../01-architecture/04-data-model.md); statuses per [glossary §3–5](../00-overview/03-glossary.md). Flow: [03-user-flows/03-client-booking.md](../03-user-flows/03-client-booking.md), payments: [03-user-flows/05-payments-payouts.md](../03-user-flows/05-payments-payouts.md).

---

## 0. Booking status state-machine

`BookingStatus` enum: `pending`, `confirmed`, `on_the_way`, `in_progress`, `completed`, `cancelled`, `reschedule_requested` ([glossary §3](../00-overview/03-glossary.md#3-booking-status--booking_status)).

```
                 (client creates + pays hold)
                          │
                          ▼
   ┌──────────────────► pending ──────────────────────────────┐
   │                       │ accept (provider)                  │ reject (provider)
   │ reschedule/accept     ▼                                    │ cancel (client/admin)
   │                  confirmed ───────────────────────────────┤
   │                   │   │  │                                 │
   │     on-the-way    │   │  │ cancel (client/provider/admin)  │
   │     (provider)    ▼   │  └──────────────────────────┐      │
   │              on_the_way                              │      │
   │                   │ check-in/verify (QR)             │      ▼
   │                   ▼                                  │  cancelled
   │              in_progress ──── cancel (admin only) ───┘      ▲
   │                   │ complete (provider)                     │
   │                   ▼                                         │
   │              completed  (terminal; review + payout release) │
   │                                                             │
   └── reschedule_requested ◄── reschedule/request ── pending|confirmed
              │  accept (counterpart) → confirmed (new slot)
              │  reject  (counterpart) → back to prior status
              └  cancel  (either)      → cancelled
```

### Transition authority matrix

| Transition | From → To | Who may trigger | Endpoint |
|---|---|---|---|
| Create | — → `pending` | client (or admin on behalf) | `POST /bookings` |
| Accept | `pending` → `confirmed` | provider (owner) | `POST /bookings/:id/accept` |
| Reject | `pending` → `cancelled` | provider (owner) | `POST /bookings/:id/reject` |
| On the way | `confirmed` → `on_the_way` | provider (owner) | `POST /bookings/:id/on-the-way` |
| Check-in | `on_the_way` → `in_progress` | client scans / provider presents QR | `POST /bookings/:id/check-in` + `/verify` |
| Start | (alias of check-in completion) | provider (owner) | `POST /bookings/:id/start` |
| Complete | `in_progress` → `completed` | provider (owner) | `POST /bookings/:id/complete` |
| Cancel | `pending`/`confirmed`/`on_the_way` → `cancelled` | client / provider / admin (per window) | `POST /bookings/:id/cancel` |
| Cancel (in-progress) | `in_progress` → `cancelled` | **admin only** | `POST /bookings/:id/cancel` |
| Reschedule request | `pending`/`confirmed` → `reschedule_requested` | client / provider / admin | `POST /bookings/:id/reschedule` |
| Reschedule accept | `reschedule_requested` → `confirmed` | counterpart (or admin) | `POST /bookings/:id/reschedule/accept` |
| Reschedule reject | `reschedule_requested` → prior status | counterpart (or admin) | `POST /bookings/:id/reschedule/reject` |
| Add-on | (within `confirmed`/`on_the_way`/`in_progress`) | provider proposes, client confirms | `POST /bookings/:id/add-ons` |

`completed` and `cancelled` are **terminal**. Any transition not permitted from the current status → `409 INVALID_TRANSITION` with `details.from`/`details.to`.

### Escrow alignment ([data-model §6](../01-architecture/04-data-model.md#6-integrity--lifecycle-notes))

- `POST /bookings` → `Payment` **authorized** (hold placed; `PaymentStatus = authorized`).
- `accept` → capture into escrow; funds enter the provider `Wallet.pendingMinor` (`held_in_escrow`).
- `complete` → escrow **released**: `commissionMinor` computed from the provider's `CommissionTier`, paired `WalletTransaction`s (`earning` + `commission_fee`) move funds `pendingMinor → balanceMinor` (`released`).
- `cancel`/`reject` → `Refund` per the window policy (§6); escrow reversed.

---

## 1. GET /providers/:id/slots — bookable slots

Compute concrete bookable slots for a provider + service, respecting service `durationMinutes`, recurring `Availability`, already-booked slots, and lead time.

| | |
|---|---|
| **Method · Path** | `GET /providers/:id/slots` |
| **Auth** | Bearer (`client` or `admin`). |
| **Path param** | `id` — `ProviderProfile.id`. |

### Query params

| Param | Type | Required | Validation |
|---|---|---|---|
| `serviceId` | string | **yes** | Determines slot length via `durationMinutes`. Must belong to the provider and be active. |
| `from` | string (date) | no | `YYYY-MM-DD` Asia/Riyadh. Default today. |
| `to` | string (date) | no | `YYYY-MM-DD`; ≤ 30 days after `from`. Default `from`+7d. |
| `addonServiceIds` | string[] | no | Add-on ids; their durations extend the required slot length. |

### Behavior

- Slots are generated from active `Availability` rules for each weekday in `[from, to]`, sliced to fit `durationMinutes` (+ any add-on durations), excluding `AvailabilitySlot.isBooked = true` and any window overlapping an active booking. A configurable **lead time** (default 2 h) hides slots starting too soon.

### Success `200 OK`

```json
{
  "success": true,
  "data": {
    "providerId": "prv_5kd03x",
    "serviceId": "svc_1a2b3c",
    "requiredMinutes": 90,
    "timezone": "Asia/Riyadh",
    "days": [
      {
        "date": "2026-07-03",
        "weekday": 5,
        "slots": [
          { "startsAt": "2026-07-03T16:00:00+03:00", "endsAt": "2026-07-03T17:30:00+03:00", "available": true },
          { "startsAt": "2026-07-03T17:30:00+03:00", "endsAt": "2026-07-03T19:00:00+03:00", "available": true },
          { "startsAt": "2026-07-03T19:00:00+03:00", "endsAt": "2026-07-03T20:30:00+03:00", "available": false }
        ]
      }
    ]
  }
}
```

### Errors

| HTTP | code | When |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Missing `serviceId`, bad date range, range > 30 days. |
| 404 | `NOT_FOUND` | Provider/service not found or service not owned by provider. |
| 401 | `UNAUTHORIZED` | Missing/invalid token. |

---

## 2. POST /bookings — create + escrow hold

Create a booking and place a payment **hold** (authorize). Status starts `pending`.

| | |
|---|---|
| **Method · Path** | `POST /bookings` |
| **Auth** | Bearer (`client`; `admin` may pass `onBehalfOfClientId`). |
| **Headers** | `Idempotency-Key` **required** ([conventions §10](01-conventions.md#10-idempotency-keys)). |
| **Rate limit** | 30 / min. |

### Request body

```json
{
  "providerId": "prv_5kd03x",
  "serviceId": "svc_1a2b3c",
  "addressId": "adr_2bd991",
  "scheduledAt": "2026-07-03T16:00:00+03:00",
  "addons": [
    { "serviceId": "svc_4d5e6f", "quantity": 1 }
  ],
  "notes": "مناسبة زواج، أفضّل ألوان ترابية",
  "payment": { "method": "mada" }
}
```

| Field | Type | Validation |
|---|---|---|
| `providerId` | string | **Required.** Discoverable, `acceptingBookings = true`. |
| `serviceId` | string | **Required.** Active, non-addon service of `providerId`. |
| `addressId` | string | **Required.** Owned by the client; within the provider's `serviceRadiusKm` (else `422 OUT_OF_SERVICE_AREA`). |
| `scheduledAt` | string | **Required.** ISO-8601; must equal an available slot start from §1 (snaps to slot grid). |
| `addons[].serviceId` | string | Optional. `isAddon = true` services of the same provider. |
| `addons[].quantity` | integer | 1–10. |
| `notes` | string | Optional, ≤ 500 chars. |
| `payment.method` | enum | **Required.** `mada` · `card` · `apple_pay` · `stc_pay` · `wallet`. |
| `onBehalfOfClientId` | string | Admin-only; create for another client. |

### Behavior

- Validates slot is still free, then **reserves** the `AvailabilitySlot` (`isBooked = true`, links `bookingId`) inside a transaction. Concurrent reservation of the same slot → `409 SLOT_UNAVAILABLE`.
- Computes pricing snapshot (halalas): `subtotalMinor` (service) + `addonsTotalMinor` (sum of add-on `unitPriceMinor * quantity`) = `totalMinor`. Creates `BookingItem` rows for add-ons.
- Creates `Payment` and places a **hold** (`PaymentStatus = authorized`) via Moyasar. Card/Apple Pay/STC Pay may return a `paymentAction` requiring client-side 3DS/redirect; `wallet` (client) is not used to pay providers and is rejected here → `422 VALIDATION_ERROR`.
- Sets `Booking.status = pending`, generates a human `reference` (e.g. `NB-7QF3`). Notifies the provider.

### Success `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "bkg_9z1a2b",
    "reference": "NB-7QF3",
    "status": "pending",
    "clientId": "usr_3kf9a2bq7m",
    "providerId": "prv_5kd03x",
    "serviceId": "svc_1a2b3c",
    "addressId": "adr_2bd991",
    "scheduledAt": "2026-07-03T16:00:00+03:00",
    "durationMinutes": 110,
    "notes": "مناسبة زواج، أفضّل ألوان ترابية",
    "items": [
      { "id": "bit_01", "serviceId": "svc_4d5e6f", "quantity": 1, "unitPriceMinor": 8000, "totalMinor": 8000 }
    ],
    "subtotalMinor": 35000,
    "addonsTotalMinor": 8000,
    "totalMinor": 43000,
    "currency": "SAR",
    "payment": {
      "id": "pay_55kd",
      "method": "mada",
      "status": "authorized",
      "amountMinor": 43000,
      "providerRef": "moyasar_pay_3f9a",
      "paymentAction": { "type": "redirect_3ds", "url": "https://api.moyasar.com/v1/payments/3f9a/3ds" }
    },
    "createdAt": "2026-06-29T15:45:00+03:00"
  }
}
```

### Errors

| HTTP | code | When |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Missing/invalid field, `wallet` method, missing `Idempotency-Key`. |
| 422 | `OUT_OF_SERVICE_AREA` | Address beyond provider `serviceRadiusKm`. |
| 409 | `SLOT_UNAVAILABLE` | Slot just taken / no longer available. |
| 409 | `PROVIDER_NOT_ACCEPTING` | Provider toggled off or not discoverable. |
| 402 | `PAYMENT_AUTH_FAILED` | Card hold declined by Moyasar. |
| 404 | `NOT_FOUND` | Provider/service/address not found. |
| 403 | `ACCOUNT_NOT_ACTIVE` | Client not active. |

---

## 3. GET /bookings & GET /bookings/:id

### 3.1 GET /bookings — list

| | |
|---|---|
| **Method · Path** | `GET /bookings` |
| **Auth** | Bearer. Scoped automatically: a `client` sees own bookings, a `provider` sees bookings to their profile, `admin` sees all. |
| **Pagination** | Cursor mode ([conventions §5.1](01-conventions.md#51-cursor-pagination-default)). |

Query params: `status` (single or comma list of `BookingStatus`), `scheduledFrom`/`scheduledTo` (ISO instants), `sort` (`-scheduledAt` default, or `scheduledAt`/`-createdAt`), `limit`, `cursor`. Admin may add `clientId`/`providerId`.

Success `200 OK`:

```json
{
  "success": true,
  "data": [
    {
      "id": "bkg_9z1a2b",
      "reference": "NB-7QF3",
      "status": "confirmed",
      "scheduledAt": "2026-07-03T16:00:00+03:00",
      "durationMinutes": 110,
      "totalMinor": 43000,
      "currency": "SAR",
      "provider": { "id": "prv_5kd03x", "fullName": "لطيفة الحربي", "avatarUrl": "avatars/usr_3kf9a2bq7m/a2.jpg" },
      "service": { "id": "svc_1a2b3c", "nameAr": "مكياج سهرة" },
      "address": { "id": "adr_2bd991", "label": "المنزل", "district": "النرجس" }
    }
  ],
  "meta": { "pagination": { "mode": "cursor", "limit": 20, "nextCursor": null, "hasMore": false } }
}
```

### 3.2 GET /bookings/:id — detail

Bearer; visible only to the booking's client, provider, or an admin (else `404 NOT_FOUND`). Returns the full booking including `items`, `payment`, QR fields (`qrCheckInCode` only to the parties when applicable), timeline timestamps (`onTheWayAt`, `checkedInAt`, `completedAt`), and `cancelledBy`/`cancelReason` when terminal.

Errors (both): `401 UNAUTHORIZED`; detail `404 NOT_FOUND` when not a party.

---

## 4. Status transitions

All transition endpoints are Bearer-authed, owner/role-gated per the §0 matrix, and return the updated booking (`200 OK`). An illegal source status → `409 INVALID_TRANSITION`.

### 4.1 POST /bookings/:id/accept

Provider accepts a `pending` booking → `confirmed`. **Captures** the payment hold into escrow (`Payment.status = held_in_escrow`, funds into `Wallet.pendingMinor`). Opens the booking `Conversation`. Notifies the client (`booking_confirmation`).

Request body: `{}` (none). Errors: `409 INVALID_TRANSITION` (not `pending`), `402 PAYMENT_CAPTURE_FAILED` (capture declined; booking stays `pending`), `403 FORBIDDEN` (not the owning provider).

### 4.2 POST /bookings/:id/reject

Provider declines a `pending` booking → `cancelled` (`cancelledBy = provider`). Releases the slot, **voids** the authorization (full refund of the hold; `RefundReason = provider_cancel`). Notifies client (`booking_cancelled`).

```json
{ "reason": "مرتبطة بموعد آخر في نفس الوقت" }
```

`reason` optional ≤ 280. Errors: `409 INVALID_TRANSITION`, `403 FORBIDDEN`.

### 4.3 POST /bookings/:id/on-the-way

Provider marks departure: `confirmed` → `on_the_way`, sets `onTheWayAt`. Notifies client (`on_the_way`). Request body `{}`. Errors: `409 INVALID_TRANSITION` (not `confirmed`), `403 FORBIDDEN`.

### 4.4 QR check-in & verify

Safety gate to confirm the provider physically reached the address before service starts ([glossary: QR check-in](../00-overview/03-glossary.md#1-domain-terms-ar--en)). Two roles:

- **Provider presents** the QR: `GET /bookings/:id/check-in/qr` (provider, owner) returns the booking's `qrCheckInCode` and a render payload. Only valid while status is `on_the_way`.
- **Client scans + verifies**: `POST /bookings/:id/check-in/verify` (client, owner).

`POST /bookings/:id/check-in/verify` request body:

```json
{ "qrCheckInCode": "QR-7QF3-A1B2C3" }
```

| Field | Type | Validation |
|---|---|---|
| `qrCheckInCode` | string | **Required.** Must equal the booking's `qrCheckInCode`. |

Behavior: on match, `on_the_way` → `in_progress`, sets `checkedInAt`. Wrong code → `422 QR_CODE_MISMATCH`. Wrong status → `409 INVALID_TRANSITION`. Success `200 OK` returns the booking now `in_progress`.

### 4.5 POST /bookings/:id/start

Provider-side alias to confirm service start when QR check-in is complete (`in_progress`). Idempotent if already `in_progress`. Request `{}`. Used where the provider device drives start after the client verifies. Errors: `409 INVALID_TRANSITION` (not yet checked-in), `403 FORBIDDEN`.

### 4.6 POST /bookings/:id/complete

Provider marks service finished: `in_progress` → `completed`, sets `completedAt`. **Releases escrow**: computes `commissionMinor` from the provider's `CommissionTier.percentBps`, writes paired `WalletTransaction`s (`earning` + `commission_fee`) moving funds `pendingMinor → balanceMinor`, sets `Payment.status = released`. Enables the client review (`review_request`) and provider payout eligibility.

Request body `{}`. Success `200 OK`:

```json
{
  "success": true,
  "data": {
    "id": "bkg_9z1a2b",
    "reference": "NB-7QF3",
    "status": "completed",
    "completedAt": "2026-07-03T17:55:00+03:00",
    "totalMinor": 43000,
    "commissionMinor": 1290,
    "providerEarningMinor": 41710,
    "currency": "SAR",
    "payment": { "id": "pay_55kd", "status": "released" }
  }
}
```

Errors: `409 INVALID_TRANSITION` (not `in_progress`), `403 FORBIDDEN`.

---

## 5. POST /bookings/:id/cancel — cancel with refund-by-window

Cancel a non-terminal booking. Refund outcome depends on **who** cancels and the **time window** before `scheduledAt`.

| | |
|---|---|
| **Method · Path** | `POST /bookings/:id/cancel` |
| **Auth** | Bearer. Client or provider (own) for `pending`/`confirmed`/`on_the_way`; **admin only** for `in_progress`. |
| **Headers** | `Idempotency-Key` **required**. |

### Request body

```json
{ "reason": "ظرف طارئ" }
```

| Field | Type | Validation |
|---|---|---|
| `reason` | string | Optional ≤ 280 (required when cancelling within the no-refund window for audit). |

### Refund policy (client-initiated, by window before `scheduledAt`)

| Window | Refund | `RefundReason` | Notes |
|---|---|---|---|
| Still `pending` (not yet accepted) | 100% (void hold) | `client_cancel` | No capture yet. |
| `confirmed`, ≥ 24 h before | 100% | `client_cancel` | Full refund from escrow. |
| `confirmed`, 3–24 h before | 50% | `client_cancel` | Partial; 50% retained as provider compensation. |
| `confirmed`/`on_the_way`, < 3 h before | 0% | `client_cancel` | No refund; escrow released to provider per policy. |

**Provider-initiated** cancel (any window) → client refunded **100%** (`provider_cancel`); repeated provider cancels feed admin/reputation review. **Admin** cancel → outcome per the dispute decision (`RefundReason` may be `dispute`/`goodwill`/`no_show`), can be full/partial/none and is recorded in `AuditLog`.

Behavior: sets `status = cancelled`, `cancelledBy`, `cancelReason`, `cancelledAt`; releases the `AvailabilitySlot`; creates a `Refund` of the computed amount (`PaymentStatus → refunded` or `partially_refunded`); reverses escrow `WalletTransaction`s as needed. Notifies the counterpart (`booking_cancelled`).

### Success `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "bkg_9z1a2b",
    "status": "cancelled",
    "cancelledBy": "client",
    "cancelReason": "ظرف طارئ",
    "cancelledAt": "2026-07-02T20:10:00+03:00",
    "refund": {
      "id": "ref_22aa",
      "amountMinor": 21500,
      "reason": "client_cancel",
      "status": "pending",
      "policyWindow": "3_to_24h_50pct"
    },
    "payment": { "id": "pay_55kd", "status": "partially_refunded" }
  }
}
```

### Errors

| HTTP | code | When |
|---|---|---|
| 409 | `INVALID_TRANSITION` | Booking already terminal (`completed`/`cancelled`). |
| 403 | `FORBIDDEN` | Non-admin cancelling an `in_progress` booking, or not a party. |
| 422 | `VALIDATION_ERROR` | Missing `Idempotency-Key`, or missing `reason` in no-refund window. |
| 404 | `NOT_FOUND` | Not a party to the booking. |

---

## 6. Reschedule (request + accept)

Move a `pending`/`confirmed` booking to a new slot. Two-step: a party **requests**, the counterpart (or admin) **accepts**/**rejects**.

### 6.1 POST /bookings/:id/reschedule — request

| | |
|---|---|
| **Auth** | Bearer. client / provider (own) / admin. |

Request body:

```json
{ "newScheduledAt": "2026-07-05T18:00:00+03:00", "reason": "تعارض في الموعد" }
```

| Field | Type | Validation |
|---|---|---|
| `newScheduledAt` | string | **Required.** Must be an available slot (validated against §1) fitting the booking's `durationMinutes`. |
| `reason` | string | Optional ≤ 280. |

Behavior: status → `reschedule_requested`, stores the proposed slot, snapshots prior status in `rescheduleFromAt`. **Tentatively holds** the new slot so it can't be double-booked. Notifies the counterpart (`reschedule_request`). The original slot stays reserved until the request resolves. Success `200 OK` returns the booking with `reschedule.proposedAt`.

Errors: `409 INVALID_TRANSITION` (not `pending`/`confirmed`), `409 SLOT_UNAVAILABLE` (proposed slot taken), `422 VALIDATION_ERROR`, `403 FORBIDDEN`.

### 6.2 POST /bookings/:id/reschedule/accept

| | |
|---|---|
| **Auth** | Bearer. The **counterpart** of the requester (or admin). |
| **Headers** | `Idempotency-Key` **required**. |

Request body `{}`. Behavior: `reschedule_requested` → `confirmed` at `newScheduledAt`; releases the old `AvailabilitySlot`, commits the new one; `scheduledAt` updated; escrow hold unchanged. Notifies both parties (`booking_confirmation`). Success `200 OK` returns the booking confirmed at the new time.

Errors: `409 INVALID_TRANSITION`, `409 SLOT_UNAVAILABLE` (proposed slot lost in the meantime; request must be re-made), `403 FORBIDDEN` (not the counterpart).

### 6.3 POST /bookings/:id/reschedule/reject

Counterpart (or admin) declines → booking reverts to its prior status (`confirmed` or `pending`) at the original slot; the tentatively-held new slot is released. Request body: `{ "reason": "غير مناسب" }` (optional). Success `200 OK`. Errors: `409 INVALID_TRANSITION`, `403 FORBIDDEN`.

> Either party may instead `POST /bookings/:id/cancel` while in `reschedule_requested`; the standard cancel/refund policy (§5) applies.

---

## 7. (Reserved) status timeline

`GET /bookings/:id` (§3.2) returns the full timeline (`createdAt`, accept time via `confirmed`, `onTheWayAt`, `checkedInAt`, `completedAt`, `cancelledAt`); no separate timeline endpoint is needed at MVP.

---

## 8. POST /bookings/:id/add-ons — add-on during the visit

Add an extra service (e.g. lashes) mid-visit. Provider **proposes**, client **confirms** the incremental charge, then escrow is topped up.

| | |
|---|---|
| **Method · Path** | `POST /bookings/:id/add-ons` |
| **Auth** | Bearer. `provider` (owner) to propose; `client` (owner) to confirm. |
| **Headers** | `Idempotency-Key` **required**. |
| **Allowed status** | `confirmed`, `on_the_way`, or `in_progress`. |

### Request body (provider proposes)

```json
{
  "action": "propose",
  "items": [ { "serviceId": "svc_4d5e6f", "quantity": 1 } ]
}
```

### Request body (client confirms)

```json
{
  "action": "confirm",
  "proposalId": "addp_91",
  "payment": { "method": "mada" }
}
```

| Field | Type | Validation |
|---|---|---|
| `action` | enum | **Required.** `propose` (provider) · `confirm` (client) · `reject` (client). |
| `items[].serviceId` | string | For `propose`: active `isAddon` service of the provider. |
| `items[].quantity` | integer | 1–10. |
| `proposalId` | string | For `confirm`/`reject`: id of the pending proposal. |
| `payment.method` | enum | For `confirm`: `mada`/`card`/`apple_pay`/`stc_pay`. |

### Behavior

- `propose` registers a pending add-on proposal with a price snapshot; notifies the client. No money moves yet.
- `confirm` places an **incremental hold + capture** for the add-on total, appends `BookingItem` rows, and updates the booking `addonsTotalMinor`/`totalMinor` (the original `subtotalMinor` snapshot is preserved; totals recomputed). Funds added to `Wallet.pendingMinor`, released with the rest on `complete`.
- `reject` discards the proposal.
- Booking status does **not** change. Add-ons are not allowed once `completed`/`cancelled` → `409 INVALID_TRANSITION`.

### Success `200 OK` (after confirm)

```json
{
  "success": true,
  "data": {
    "id": "bkg_9z1a2b",
    "status": "in_progress",
    "items": [
      { "id": "bit_01", "serviceId": "svc_4d5e6f", "quantity": 1, "unitPriceMinor": 8000, "totalMinor": 8000 },
      { "id": "bit_02", "serviceId": "svc_4d5e6f", "quantity": 1, "unitPriceMinor": 8000, "totalMinor": 8000 }
    ],
    "subtotalMinor": 35000,
    "addonsTotalMinor": 16000,
    "totalMinor": 51000,
    "currency": "SAR",
    "payment": { "id": "pay_55kd", "status": "held_in_escrow", "amountMinor": 51000 }
  }
}
```

### Errors

| HTTP | code | When |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Bad `action`/items, non-addon service, missing `Idempotency-Key`. |
| 402 | `PAYMENT_AUTH_FAILED` | Incremental charge declined (proposal stays pending). |
| 409 | `INVALID_TRANSITION` | Status not in `confirmed`/`on_the_way`/`in_progress`. |
| 409 | `PROPOSAL_NOT_FOUND` | `proposalId` unknown/already resolved. |
| 403 | `FORBIDDEN` | Wrong party for the action. |
| 404 | `NOT_FOUND` | Not a party to the booking. |

---

See [03-providers-services.md](03-providers-services.md) for services/availability that feed bookings, [02-auth.md](02-auth.md) for auth, and [01-conventions.md](01-conventions.md) for envelope/error/idempotency rules.
