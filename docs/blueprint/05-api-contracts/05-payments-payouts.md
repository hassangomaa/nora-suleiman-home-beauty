# API Contracts — Payments, Wallet & Payouts

> **Scope.** Escrow payments (Moyasar hold/capture), refunds, invoices, the provider wallet & ledger, withdrawals (payouts), commission-tier configuration, and the Moyasar webhook. Realizes the money flow in [../03-user-flows/05-payments-payouts.md](../03-user-flows/05-payments-payouts.md). Entities & enums are canonical per [../01-architecture/04-data-model.md](../01-architecture/04-data-model.md) and [../00-overview/03-glossary.md](../00-overview/03-glossary.md).
>
> **Stack.** NestJS + Prisma + PostgreSQL · Moyasar gateway · BullMQ/Redis for clearance/payout/reconciliation jobs. All money is **integer minor units (halalas)**, `currency = "SAR"`; never floats. Timestamps are ISO-8601 `timestamptz` (app TZ `Asia/Riyadh`).

> **Conventions.** The cross-cutting contract (base URL, auth envelope, errors, pagination, rate limits, webhook signing) is canonical in [01-conventions.md](01-conventions.md). Section 0 below restates only the money-relevant essentials (idempotency, minor-units, error codes) for quick reference; on any discrepancy, [01-conventions.md](01-conventions.md) wins.

---

## 0. Money conventions (quick reference — see [01-conventions.md](01-conventions.md) for the full contract)

**Base URL.** `https://api.nora-beauty.app/api/v1` (all paths below are relative to `/api/v1`).

**Auth.** `Authorization: Bearer <access_jwt>` (JWT access token, TTL 15m). The token carries `sub` (user id), `activeRole` (`client` | `provider`), and for admins `adminRole` (`super_admin` | `ops` | `finance` | `support`). Sensitive money actions (withdrawals, IBAN changes) additionally require a **step-up token** via header `X-Step-Up-Token: <step_up_jwt>` (see [../03-user-flows/02-authentication.md](../03-user-flows/02-authentication.md) §7).

**Idempotency.** Mutating POSTs that move money accept an `Idempotency-Key: <uuid>` header. The first request with a given key is processed and its response cached for 24h; replays return the **same** response with `200`/`201` and header `Idempotency-Replayed: true`.

**Success envelope.**
```json
{ "data": { }, "meta": { } }
```
`meta` is present only when relevant (pagination, aggregates).

**Error envelope.** Every non-2xx returns:
```json
{
  "error": {
    "code": "insufficient_balance",
    "message": "Requested amount exceeds available wallet balance.",
    "messageAr": "المبلغ المطلوب يتجاوز الرصيد المتاح في المحفظة.",
    "details": [{ "field": "amountMinor", "issue": "must be <= availableMinor" }],
    "requestId": "req_01HZX9..."
  }
}
```
`details` is present for validation (`422`) errors. `requestId` correlates with logs/Sentry.

**Standard error codes.** `validation_error` (422), `unauthenticated` (401), `step_up_required` (401), `forbidden` (403), `not_found` (404), `conflict` (409), `idempotency_conflict` (409), `rate_limited` (429), `internal_error` (500).

**Pagination.** Cursor-based. Query params: `?limit=<1..100, default 20>&cursor=<opaque>`. Response `meta`:
```json
{ "meta": { "nextCursor": "eyJpZCI6...", "hasMore": true, "limit": 20 } }
```
`nextCursor` is `null` when `hasMore` is `false`.

**Money fields.** Always two paired fields where a human display is useful: `amountMinor` (integer halalas) plus a derived read-only `amountFormatted` (e.g. `"320.00 SAR"`). Writes only ever accept `*Minor`.

---

## 1. Payment & escrow status enums

### `payment_status` (`PaymentStatus`)
The DB enum (`initiated authorized captured failed refunded partially_refunded`) is mapped to the canonical glossary lifecycle for API responses. The API surfaces the **glossary** values:

| API value (`status`) | DB enum | Meaning |
|---|---|---|
| `pending` | `initiated` | Intent created; gateway not yet authorized. |
| `authorized` | `authorized` | Funds held on the client's instrument (pre-capture). |
| `held_in_escrow` | `captured` (+ booking not yet released) | Captured & custodially held pending completion/clearance. |
| `released` | `captured` (+ wallet credited/cleared) | Released from escrow into the provider wallet pipeline. |
| `refunded` | `refunded` | Full amount returned to client. |
| `partially_refunded` | `partially_refunded` | Part returned per refund policy. |
| `failed` | `failed` | Authorization/capture attempt failed. |

### `refund_status` (`RefundStatus`)
`pending` → `processed` | `failed` (retryable on `failed`).

### `refund_reason` (`RefundReason`)
`client_cancel` · `provider_cancel` · `no_show` · `dispute` · `goodwill`.

### `payout_status` (`PayoutStatus`)
`requested` → `approved` → `processing` → `paid` · `rejected` · `failed`.

### `wallet_txn_type` / `wallet_txn_status`
Type: `earning` · `commission_fee` · `refund` · `payout_debit` · `adjustment` · `points_credit`.
Status: `pending` → `posted` | `reversed`.

### Escrow state machine
```
 intent created
      │  POST /payments/intent
      ▼
   PENDING ──gateway authorize (webhook)──▶ AUTHORIZED (hold on instrument)
      │ decline/timeout                          │ provider rejects / accept-expires / cancel pre-accept
      ▼                                          ▼
   FAILED                                   VOIDED (100% released, nothing captured)
                                                 │ booking completed
                                                 ▼
                                    HELD_IN_ESCROW (capture)  ── commission split (tier %) ──┐
                                                 │                                            ▼
                                                 │                              WALLET pending ──72h, no dispute──▶ available
                                                 │ refund (full/partial, policy §6 of flow)
                                                 ▼
                                    REFUNDED / PARTIALLY_REFUNDED
```
Capture/clearance is **suspended** if a complaint puts the booking into dispute hold (see [07-ratings-complaints.md](07-ratings-complaints.md) §2 and the money flow [../03-user-flows/05-payments-payouts.md](../03-user-flows/05-payments-payouts.md) §7).

---

## 2. Payments

### 2.1 Create payment intent (escrow hold)

`POST /payments/intent`
**Auth:** `client` (the booking owner).
**Description:** Creates a `Payment` (status `pending`) for a `pending` booking and returns a Moyasar payment session for **authorize-only (hold)**. Idempotent on `Idempotency-Key` and one-payment-per-booking (`Payment.bookingId @unique`). The hold becomes `authorized` only when Moyasar confirms via webhook (§7).

**Headers:** `Idempotency-Key: <uuid>` (required).

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `bookingId` | string (cuid) | required; must belong to caller; booking `status = pending`; no existing non-failed `Payment`. |
| `method` | enum `PaymentMethod` | required; one of `mada` `card` `apple_pay` `stc_pay` `wallet`. |
| `returnUrl` | string (https url) | required for `card`/`mada` 3DS redirect; max 512 chars. |
| `savePaymentMethod` | boolean | optional; default `false`. |

```json
{
  "bookingId": "ckbk_7QF3a1b2c3",
  "method": "mada",
  "returnUrl": "norabeauty://payments/return",
  "savePaymentMethod": false
}
```

**Success `201`:**
```json
{
  "data": {
    "payment": {
      "id": "ckpay_9k2m4p",
      "bookingId": "ckbk_7QF3a1b2c3",
      "status": "pending",
      "method": "mada",
      "amountMinor": 32000,
      "amountFormatted": "320.00 SAR",
      "currency": "SAR",
      "providerRef": null,
      "authorizedAt": null,
      "capturedAt": null,
      "createdAt": "2026-06-29T11:02:14.000Z"
    },
    "gateway": {
      "provider": "moyasar",
      "moyasarPaymentId": "pay_AbCd1234EfGh",
      "publishableKey": "pk_live_3xAmPlEkEy",
      "transactionUrl": "https://api.moyasar.com/v1/payments/pay_AbCd1234EfGh/3ds",
      "expiresAt": "2026-06-29T11:17:14.000Z"
    }
  }
}
```

**Errors:**
| Status | code | When |
|---|---|---|
| 422 | `validation_error` | missing/invalid field. |
| 403 | `forbidden` | booking not owned by caller. |
| 404 | `booking_not_found` | `bookingId` unknown. |
| 409 | `booking_not_payable` | booking not in `pending`, or already has an `authorized`/`captured` payment. |
| 409 | `idempotency_conflict` | same `Idempotency-Key` reused with a different body. |
| 502 | `gateway_error` | Moyasar session creation failed. |

---

### 2.2 Capture payment (on completion)

`POST /payments/:id/capture`
**Auth:** `admin` (`finance`) for manual capture; normally invoked **internally** by the completion/auto-confirm BullMQ job. Documented for admin/ops overrides.
**Description:** Captures an `authorized` hold for a `completed` booking, computes commission from the provider's `CommissionTier`, and writes the wallet credit pair (`earning` + `commission_fee`) into `pendingMinor`. Idempotent: re-capturing a captured payment returns the existing state.

**Path params:** `id` — `Payment.id`.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `amountMinor` | integer | optional partial capture; default = full `amountMinor`; `1 <= amountMinor <= payment.amountMinor`. |
| `reason` | string | optional; max 280 chars (audit note). |

```json
{ "amountMinor": 32000, "reason": "Booking NB-7QF3 completed and confirmed" }
```

**Success `200`:**
```json
{
  "data": {
    "payment": {
      "id": "ckpay_9k2m4p",
      "status": "held_in_escrow",
      "amountMinor": 32000,
      "capturedAt": "2026-06-30T13:40:09.000Z",
      "providerRef": "pay_AbCd1234EfGh"
    },
    "commission": {
      "tier": "beginner",
      "percentBps": 200,
      "commissionMinor": 640,
      "commissionFormatted": "6.40 SAR",
      "providerNetMinor": 31360,
      "providerNetFormatted": "313.60 SAR"
    },
    "walletTransactions": [
      { "id": "ckwt_e1", "type": "earning", "status": "pending", "amountMinor": 31360 },
      { "id": "ckwt_e2", "type": "commission_fee", "status": "posted", "amountMinor": -640 }
    ]
  }
}
```

**Errors:**
| Status | code | When |
|---|---|---|
| 403 | `forbidden` | caller is not `finance`/`super_admin`. |
| 404 | `payment_not_found` | unknown id. |
| 409 | `payment_not_authorized` | payment not in `authorized` state. |
| 409 | `booking_not_completed` | linked booking not `completed`. |
| 409 | `dispute_hold` | booking under dispute; capture suspended. |
| 422 | `validation_error` | `amountMinor` out of range. |
| 502 | `gateway_error` | Moyasar capture call failed. |

---

### 2.3 Refund a payment

`POST /payments/:id/refund`
**Auth:** `admin` (`ops` or `finance`); also invoked internally by the cancellation engine per the refund-policy windows (flow §6). `ops` may issue policy refunds; discretionary `goodwill` refunds require `finance`.
**Description:** Creates a `Refund` and executes it against Moyasar (`void` if not captured, `refund` if captured). Reverses wallet credits proportionally via a `WalletTransaction(type: refund)`. Idempotent on `Idempotency-Key`.

**Headers:** `Idempotency-Key: <uuid>` (required).

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `amountMinor` | integer | required; `1 <= amountMinor <= remainingRefundableMinor`. |
| `reason` | enum `RefundReason` | required; `client_cancel` `provider_cancel` `no_show` `dispute` `goodwill`. |
| `note` | string | optional; max 500 chars; required when `reason = goodwill`. |

```json
{ "amountMinor": 16000, "reason": "client_cancel", "note": "Cancelled 8h before slot — 50% policy refund" }
```

**Success `201`:**
```json
{
  "data": {
    "refund": {
      "id": "ckref_3h7",
      "paymentId": "ckpay_9k2m4p",
      "amountMinor": 16000,
      "amountFormatted": "160.00 SAR",
      "reason": "client_cancel",
      "status": "pending",
      "providerRef": "ref_Zz98Yy76",
      "createdAt": "2026-06-30T09:15:00.000Z",
      "processedAt": null
    },
    "payment": { "id": "ckpay_9k2m4p", "status": "partially_refunded" }
  }
}
```
The refund moves to `processed` (or `failed`) via the Moyasar webhook (§7).

**Errors:**
| Status | code | When |
|---|---|---|
| 403 | `forbidden` | role lacks refund permission (e.g. `goodwill` by `ops`). |
| 404 | `payment_not_found` | unknown id. |
| 409 | `payment_not_refundable` | payment `failed`/already fully `refunded`. |
| 422 | `refund_exceeds_balance` | `amountMinor > remainingRefundableMinor`. |
| 422 | `validation_error` | bad reason / missing `note` for goodwill. |
| 502 | `gateway_error` | Moyasar refund/void failed (retryable). |

---

### 2.4 Get payment

`GET /payments/:id`
**Auth:** `client` (owner of the booking), `provider` (booking provider, redacted instrument data), or `admin`.
**Description:** Returns a payment with its refunds.

**Success `200`:**
```json
{
  "data": {
    "id": "ckpay_9k2m4p",
    "bookingId": "ckbk_7QF3a1b2c3",
    "bookingReference": "NB-7QF3",
    "status": "partially_refunded",
    "method": "mada",
    "amountMinor": 32000,
    "amountFormatted": "320.00 SAR",
    "currency": "SAR",
    "providerRef": "pay_AbCd1234EfGh",
    "authorizedAt": "2026-06-29T11:03:01.000Z",
    "capturedAt": "2026-06-30T13:40:09.000Z",
    "refundedTotalMinor": 16000,
    "refunds": [
      { "id": "ckref_3h7", "amountMinor": 16000, "reason": "client_cancel", "status": "processed", "processedAt": "2026-06-30T09:16:40.000Z" }
    ],
    "createdAt": "2026-06-29T11:02:14.000Z"
  }
}
```

**Errors:** `401 unauthenticated`, `403 forbidden`, `404 payment_not_found`.

---

### 2.5 List invoices

`GET /payments/invoices`
**Auth:** `client` (own invoices) or `provider` (invoices for own bookings; net/commission view).
**Description:** Paginated list of itemized invoices for the caller's completed/paid bookings.

**Query params:** `limit`, `cursor`, `from` (ISO date, optional), `to` (ISO date, optional), `status` (`paid` | `refunded` | `partially_refunded`, optional).

**Success `200`:**
```json
{
  "data": [
    {
      "invoiceNo": "INV-2026-018342",
      "bookingReference": "NB-7QF3",
      "paymentId": "ckpay_9k2m4p",
      "issuedAt": "2026-06-30T13:40:10.000Z",
      "currency": "SAR",
      "lines": [
        { "label": "مكياج سهرة / Evening makeup", "amountMinor": 28000 },
        { "label": "إضافة: رموش / Add-on: lashes", "amountMinor": 4000 }
      ],
      "subtotalMinor": 28000,
      "addonsTotalMinor": 4000,
      "totalMinor": 32000,
      "totalFormatted": "320.00 SAR",
      "commissionMinor": 640,
      "status": "partially_refunded",
      "refundedTotalMinor": 16000
    }
  ],
  "meta": { "nextCursor": "eyJpZCI6ImNrcGF5XzhqIn0", "hasMore": true, "limit": 20 }
}
```

**Errors:** `401 unauthenticated`, `422 validation_error` (bad date range).

---

## 3. Wallet (provider)

### 3.1 Get wallet

`GET /wallet`
**Auth:** `provider` (own wallet) or `admin` with `?userId=<id>`.
**Description:** Returns the provider's balances. `pendingMinor` = escrow + clearance + dispute-held earnings (not withdrawable); `balanceMinor` = posted/available; an additional derived `withdrawalHoldMinor` reflects amounts locked by open payouts.

**Success `200`:**
```json
{
  "data": {
    "walletId": "ckwal_p1",
    "currency": "SAR",
    "balanceMinor": 184500,
    "balanceFormatted": "1,845.00 SAR",
    "pendingMinor": 31360,
    "pendingFormatted": "313.60 SAR",
    "withdrawalHoldMinor": 50000,
    "withdrawalHoldFormatted": "500.00 SAR",
    "availableForWithdrawalMinor": 134500,
    "availableForWithdrawalFormatted": "1,345.00 SAR",
    "payoutAccount": { "ibanMasked": "SA03 **** **** **** **** 1234", "beneficiaryName": "نورة سليمان" },
    "updatedAt": "2026-06-30T14:00:00.000Z"
  }
}
```

**Errors:** `401 unauthenticated`, `403 forbidden`, `404 wallet_not_found`.

---

### 3.2 List wallet transactions (ledger)

`GET /wallet/transactions`
**Auth:** `provider` (own) or `admin` with `?userId=`.
**Description:** Append-only ledger, newest first. Filterable by `type` and date range.

**Query params:** `limit`, `cursor`, `type` (enum `WalletTxnType`, optional), `status` (enum `WalletTxnStatus`, optional), `from`, `to`.

**Success `200`:**
```json
{
  "data": [
    {
      "id": "ckwt_e1",
      "type": "earning",
      "status": "posted",
      "amountMinor": 31360,
      "amountFormatted": "+313.60 SAR",
      "balanceAfterMinor": 184500,
      "bookingId": "ckbk_7QF3a1b2c3",
      "bookingReference": "NB-7QF3",
      "payoutId": null,
      "description": "Earnings — booking NB-7QF3",
      "createdAt": "2026-06-30T13:40:09.000Z",
      "postedAt": "2026-07-03T13:40:09.000Z"
    },
    {
      "id": "ckwt_e2",
      "type": "commission_fee",
      "status": "posted",
      "amountMinor": -640,
      "amountFormatted": "-6.40 SAR",
      "balanceAfterMinor": 153140,
      "bookingId": "ckbk_7QF3a1b2c3",
      "description": "Platform commission 2% (beginner)",
      "createdAt": "2026-06-30T13:40:09.000Z",
      "postedAt": "2026-06-30T13:40:09.000Z"
    }
  ],
  "meta": { "nextCursor": "eyJpZCI6ImNrd3RfZDkifQ", "hasMore": true, "limit": 20 }
}
```

**Errors:** `401 unauthenticated`, `403 forbidden`, `422 validation_error`.

---

## 4. Payouts (withdrawals)

### 4.1 Request a withdrawal

`POST /payouts/withdraw`
**Auth:** `provider` (own wallet) **+ step-up** (`X-Step-Up-Token`).
**Description:** Requests a payout up to `availableForWithdrawalMinor`. Moves the amount from available → withdrawal hold and creates a `Payout` in `requested`. Requires a saved payout account (IBAN). Idempotent on `Idempotency-Key`.

**Headers:** `X-Step-Up-Token` (required), `Idempotency-Key` (required).

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `amountMinor` | integer | required; `MIN_WITHDRAWAL_MINOR (5000) <= amountMinor <= availableForWithdrawalMinor`. |

```json
{ "amountMinor": 100000 }
```

**Success `201`:**
```json
{
  "data": {
    "payout": {
      "id": "ckpo_77z",
      "walletId": "ckwal_p1",
      "amountMinor": 100000,
      "amountFormatted": "1,000.00 SAR",
      "currency": "SAR",
      "status": "requested",
      "ibanMasked": "SA03 **** **** **** **** 1234",
      "beneficiaryName": "نورة سليمان",
      "requestedAt": "2026-06-30T14:05:00.000Z",
      "processedAt": null
    },
    "wallet": { "availableForWithdrawalMinor": 34500, "withdrawalHoldMinor": 150000 }
  }
}
```

**Errors:**
| Status | code | When |
|---|---|---|
| 401 | `step_up_required` | missing/expired `X-Step-Up-Token`. |
| 403 | `forbidden` | caller not the wallet owner. |
| 409 | `no_payout_account` | no saved IBAN. |
| 422 | `insufficient_balance` | `amountMinor > availableForWithdrawalMinor`. |
| 422 | `below_minimum` | `amountMinor < MIN_WITHDRAWAL_MINOR`. |
| 409 | `account_not_active` | provider `accountState` not `active`. |

---

### 4.2 List payouts

`GET /payouts`
**Auth:** `provider` (own) or `admin` (`finance`/`super_admin`; all, filterable).
**Description:** Paginated payouts, newest first.

**Query params:** `limit`, `cursor`, `status` (enum `PayoutStatus`, optional), `userId` (admin only), `from`, `to`.

**Success `200`:**
```json
{
  "data": [
    {
      "id": "ckpo_77z",
      "providerName": "نورة سليمان",
      "amountMinor": 100000,
      "amountFormatted": "1,000.00 SAR",
      "status": "approved",
      "ibanMasked": "SA03 **** **** **** **** 1234",
      "approvedByAdminId": "ckadm_fin1",
      "providerRef": null,
      "requestedAt": "2026-06-30T14:05:00.000Z",
      "processedAt": null
    }
  ],
  "meta": { "nextCursor": null, "hasMore": false, "limit": 20 }
}
```

**Errors:** `401 unauthenticated`, `403 forbidden`.

---

### 4.3 Get payout

`GET /payouts/:id`
**Auth:** `provider` (owner) or `admin`.
**Success `200`:** single payout object (same shape as 4.2 item).
**Errors:** `401 unauthenticated`, `403 forbidden`, `404 payout_not_found`.

---

### 4.4 Admin — approve payout

`POST /payouts/:id/approve`
**Auth:** `admin` (`finance` or `super_admin`).
**Description:** Approves a `requested` payout → `approved` and enqueues the BullMQ bank-transfer job. Writes an `AuditLog`.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `note` | string | optional; max 280 chars. |

```json
{ "note": "KYC verified; IBAN matches beneficiary" }
```

**Success `200`:**
```json
{ "data": { "id": "ckpo_77z", "status": "approved", "approvedByAdminId": "ckadm_fin1" } }
```

**Errors:** `403 forbidden`, `404 payout_not_found`, `409 payout_not_requested` (not in `requested`).

---

### 4.5 Admin — reject payout

`POST /payouts/:id/reject`
**Auth:** `admin` (`finance` or `super_admin`).
**Description:** Rejects a `requested`/`approved` payout → `rejected`; returns the held amount to `availableForWithdrawalMinor`. Writes an `AuditLog`.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `reason` | string | required; max 500 chars. |

```json
{ "reason": "IBAN beneficiary name mismatch — please update payout account" }
```

**Success `200`:**
```json
{
  "data": {
    "id": "ckpo_77z",
    "status": "rejected",
    "wallet": { "availableForWithdrawalMinor": 134500, "withdrawalHoldMinor": 50000 }
  }
}
```

**Errors:** `403 forbidden`, `404 payout_not_found`, `409 payout_not_rejectable` (already `processing`/`paid`), `422 validation_error`.

---

### 4.6 Admin — mark payout processing / process

`POST /payouts/:id/process`
**Auth:** `admin` (`finance` or `super_admin`).
**Description:** Transitions an `approved` payout → `processing` and records the bank/processor reference; normally driven by the BullMQ payout job, exposed for manual batch runs. Final `paid`/`failed` transitions arrive from the bank-confirmation callback (or are set here for manual reconciliation).

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `providerRef` | string | required; bank transfer reference; max 128 chars. |
| `markPaid` | boolean | optional; default `false`; if `true` finalizes to `paid` (manual confirm) and writes the `payout_debit` ledger row. |

```json
{ "providerRef": "SARIE-20260701-0099", "markPaid": false }
```

**Success `200`:**
```json
{
  "data": {
    "id": "ckpo_77z",
    "status": "processing",
    "providerRef": "SARIE-20260701-0099",
    "processedAt": null
  }
}
```
On `markPaid: true`:
```json
{
  "data": {
    "id": "ckpo_77z",
    "status": "paid",
    "providerRef": "SARIE-20260701-0099",
    "processedAt": "2026-07-01T08:30:00.000Z",
    "ledgerTxnId": "ckwt_payout77z"
  }
}
```

**Errors:** `403 forbidden`, `404 payout_not_found`, `409 payout_not_approved` (not in `approved`/`processing`), `422 validation_error`.

> On a bank failure the processor callback sets the payout to `failed` and returns the held amount to `availableForWithdrawalMinor` (retryable). This callback path is internal and not exposed as a public endpoint.

---

## 5. Commission tiers (config)

### 5.1 List commission tiers

`GET /commission-tiers`
**Auth:** `admin` (any sub-role; read).
**Description:** Returns the three commission tiers and their basis-point rates.

**Success `200`:**
```json
{
  "data": [
    { "id": "ckct_b", "tier": "beginner", "percentBps": 200, "percentDisplay": "2%", "isActive": true, "updatedAt": "2026-01-10T00:00:00.000Z" },
    { "id": "ckct_m", "tier": "mid", "percentBps": 150, "percentDisplay": "1.5%", "isActive": true, "updatedAt": "2026-01-10T00:00:00.000Z" },
    { "id": "ckct_e", "tier": "established", "percentBps": 100, "percentDisplay": "1%", "isActive": true, "updatedAt": "2026-01-10T00:00:00.000Z" }
  ]
}
```

**Errors:** `401 unauthenticated`, `403 forbidden`.

> Mutation of tiers (`PUT /commission-tiers/:tier`) is documented in [08-admin.md](08-admin.md) §5 to keep all admin-write config in one place.

---

## 6. Moyasar webhook

### 6.1 Receive Moyasar event

`POST /payments/webhook`
**Auth:** **None (public)** — authenticated by HMAC signature, not JWT. Source IPs may be allow-listed at the edge.
**Description:** Receives Moyasar gateway events and drives `Payment`/`Refund` state transitions. **Signature verification:** the raw request body is HMAC-SHA256-signed; the server recomputes the digest with `MOYASAR_WEBHOOK_SECRET` and compares (constant-time) against the header `X-Moyasar-Signature`. Mismatch → `401`. **Idempotency:** each event carries a unique `id`; processed event ids are persisted, so duplicate deliveries are accepted with `200` but produce no second transition.

**Headers:** `X-Moyasar-Signature: <hex hmac>` (required), `Content-Type: application/json`.

**Handled event types → transitions:**
| `type` | Effect |
|---|---|
| `payment_authorized` | `Payment.status pending → authorized`; sets `authorizedAt`, `providerRef`; escrow `held`. |
| `payment_captured` | `Payment.status authorized → held_in_escrow`; sets `capturedAt`. |
| `payment_failed` | `Payment.status → failed`; releases reserved slot (booking flow). |
| `payment_voided` | `Payment.status → failed`/voided (no capture); 100% released. |
| `payment_refunded` | linked `Refund.status pending → processed`; `Payment.status → refunded` or `partially_refunded`. |
| `payment_refund_failed` | `Refund.status → failed` (retry queued). |

**Request JSON (example — `payment_captured`):**
```json
{
  "id": "evt_9f3c2a1b8d",
  "type": "payment_captured",
  "created_at": "2026-06-30T13:40:09Z",
  "data": {
    "id": "pay_AbCd1234EfGh",
    "status": "captured",
    "amount": 32000,
    "currency": "SAR",
    "source": { "type": "creditcard", "company": "mada" },
    "metadata": { "bookingId": "ckbk_7QF3a1b2c3", "paymentId": "ckpay_9k2m4p" }
  }
}
```

**Success `200`:**
```json
{ "data": { "received": true, "eventId": "evt_9f3c2a1b8d", "applied": true } }
```
Duplicate delivery returns `{ "data": { "received": true, "eventId": "evt_9f3c2a1b8d", "applied": false, "reason": "already_processed" } }` with `200`.

**Errors:**
| Status | code | When |
|---|---|---|
| 401 | `invalid_signature` | HMAC mismatch / missing `X-Moyasar-Signature`. |
| 400 | `malformed_event` | body not valid JSON / unknown shape. |
| 404 | `payment_not_found` | `metadata.paymentId` / `data.id` maps to no local payment. |
| 422 | `unhandled_event_type` | event type not in the handled set (logged, acked `200` with `applied:false` in practice; `422` only if strict mode enabled). |

> Always return `2xx` once the signature is valid and the event is durably enqueued, so Moyasar does not retry storm. Transient internal failures after a valid signature return `500` to trigger Moyasar's retry; the idempotency log prevents double application.

---

## 7. Related

- Money flow & policy windows: [../03-user-flows/05-payments-payouts.md](../03-user-flows/05-payments-payouts.md)
- Booking lifecycle that triggers capture/refund: [04-bookings.md](04-bookings.md)
- Disputes that freeze escrow: [07-ratings-complaints.md](07-ratings-complaints.md)
- Admin payout queue, commission/tier & package config, audit log: [08-admin.md](08-admin.md)
- Data model & enums: [../01-architecture/04-data-model.md](../01-architecture/04-data-model.md) · [../00-overview/03-glossary.md](../00-overview/03-glossary.md)
