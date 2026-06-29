# API Contracts — Ratings, Complaints & Support

> **Scope.** Client reviews of completed bookings (create, list, aggregates, edit window), complaints/disputes (filed by client or provider, status transitions, admin resolution with a money outcome), and support tickets (create, list, reply, close). Entities & enums per [../01-architecture/04-data-model.md](../01-architecture/04-data-model.md) and [../00-overview/03-glossary.md](../00-overview/03-glossary.md).
>
> **Stack.** NestJS + Prisma/PostgreSQL. Review writes recompute `ProviderProfile.ratingAvg`/`ratingCount` (feeds search ranking). Complaints can place a booking's escrow into **dispute hold** — see [05-payments-payouts.md](05-payments-payouts.md) §1 and the money flow [../03-user-flows/05-payments-payouts.md](../03-user-flows/05-payments-payouts.md) §7.

> **Conventions.** Reuses the canonical envelope, error shape, pagination, and auth defined in [05-payments-payouts.md](05-payments-payouts.md) §0 (since `01-conventions.md` does not yet exist in this folder).

---

## 1. Enums & rules

### `complaint_status` (`ComplaintStatus`) — canonical glossary set
`open` → `under_review` → (`awaiting_response`) → `resolved` | `rejected` | `escalated`.

| Value | Meaning |
|---|---|
| `open` | Filed; awaiting triage. |
| `under_review` | Admin (ops) investigating. |
| `awaiting_response` | Waiting on counterpart/filer for info. |
| `resolved` | Closed with an outcome (refund / hold release / warning / none). |
| `rejected` | Closed as invalid. |
| `escalated` | Raised to `super_admin`/`finance` for a higher decision. |

### `complaint_type` (`ComplaintType`)
`service_quality` · `no_show` · `payment` · `safety` · `other`.

### `ticket_status` (`TicketStatus`) — canonical glossary set
`new` → `open` → (`pending_user` | `on_hold`) → `resolved` → `closed`.

### Review rules
- **Eligibility:** a `Review` may be created **only** when the booking `status = completed`. One review per booking (`Review.bookingId @unique`) — idempotent create.
- **Author:** the booking's **client** (`authorId = clientId`).
- **Rating:** integer `1..5`; `comment` optional (max 1000 chars).
- **Edit window:** a review may be edited/deleted within **`REVIEW_EDIT_WINDOW_HOURS` = 48h** of creation; after that it is immutable.
- **Ranking effect:** create/edit/delete recomputes `ProviderProfile.ratingAvg` (Decimal(3,2)) and `ratingCount`, and emits a `new_review` notification to the provider on create.

---

## 2. Ratings & reviews

### 2.1 Create a review

`POST /bookings/:id/review`
**Auth:** `client` (the booking's client).
**Description:** Creates the single review for a `completed` booking. Idempotent: if a review already exists for the booking, returns `409 review_exists` (use the edit endpoint within the window).

**Path params:** `id` — `Booking.id`.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `rating` | integer | required; `1 <= rating <= 5`. |
| `comment` | string | optional; max 1000 chars. |

```json
{ "rating": 5, "comment": "مكياج راقٍ وملتزمة بالموعد، أنصح بها بشدة!" }
```

**Success `201`:**
```json
{
  "data": {
    "review": {
      "id": "ckrev_01",
      "bookingId": "ckbk_7QF3a1b2c3",
      "bookingReference": "NB-7QF3",
      "authorId": "ckusr_client01",
      "providerId": "ckprv_07",
      "rating": 5,
      "comment": "مكياج راقٍ وملتزمة بالموعد، أنصح بها بشدة!",
      "editableUntil": "2026-07-02T13:45:00.000Z",
      "createdAt": "2026-06-30T13:45:00.000Z"
    },
    "providerRating": { "ratingAvg": "4.87", "ratingCount": 63 }
  }
}
```

**Errors:**
| Status | code | When |
|---|---|---|
| 422 | `validation_error` | rating out of range / comment too long. |
| 403 | `forbidden` | caller is not the booking's client. |
| 404 | `booking_not_found` | unknown booking. |
| 409 | `booking_not_completed` | booking `status` ≠ `completed`. |
| 409 | `review_exists` | a review already exists for this booking. |

---

### 2.2 Edit a review (within window)

`PATCH /reviews/:id`
**Auth:** `client` (review author).
**Description:** Updates rating/comment within the 48h edit window; recomputes provider aggregates.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `rating` | integer | optional; `1..5`. |
| `comment` | string | optional; max 1000 chars; `null` clears it. |

```json
{ "rating": 4, "comment": "تجربة جيدة جداً مع ملاحظة بسيطة على التأخير ٥ دقائق." }
```

**Success `200`:** the updated review + recomputed `providerRating` (same shape as §2.1).

**Errors:** `403 forbidden`, `404 review_not_found`, `409 edit_window_expired` (older than 48h), `422 validation_error`.

---

### 2.3 Delete a review (within window)

`DELETE /reviews/:id`
**Auth:** `client` (author) or `admin` (`ops`/`super_admin`; moderation, any time).
**Description:** Removes a review; recomputes provider aggregates. Author may delete only within the window; admin may delete anytime (writes `AuditLog`).
**Success `204`:** empty body.
**Errors:** `403 forbidden`, `404 review_not_found`, `409 edit_window_expired` (author after window; admin exempt).

---

### 2.4 List provider reviews (with summary aggregates)

`GET /providers/:providerId/reviews`
**Auth:** Public (no auth) — visible on provider profiles; authenticated calls get the same data.
**Description:** Paginated reviews for a provider, newest first, with a rating-distribution summary in `meta`.

**Query params:** `limit`, `cursor`, `rating` (1..5 filter, optional), `withComment` (boolean, optional).

**Success `200`:**
```json
{
  "data": [
    {
      "id": "ckrev_01",
      "rating": 5,
      "comment": "مكياج راقٍ وملتزمة بالموعد، أنصح بها بشدة!",
      "author": { "displayName": "ع. ال.", "avatarUrl": null },
      "bookingReference": "NB-7QF3",
      "createdAt": "2026-06-30T13:45:00.000Z",
      "edited": false
    }
  ],
  "meta": {
    "nextCursor": "eyJpZCI6ImNrcmV2XzAwIn0",
    "hasMore": true,
    "limit": 20,
    "summary": {
      "ratingAvg": "4.87",
      "ratingCount": 63,
      "distribution": { "5": 51, "4": 9, "3": 2, "2": 1, "1": 0 }
    }
  }
}
```
Author identity is shown as **initials** for client privacy (women-only platform).

**Errors:** `404 provider_not_found`, `422 validation_error`.

---

## 3. Complaints / disputes

### 3.1 File a complaint

`POST /complaints`
**Auth:** `client` or `provider` (must be a party to the referenced booking).
**Description:** Files a complaint, optionally tied to a booking. If tied to a booking whose payment is pre-payout, the booking enters **dispute hold** (escrow frozen; capture/clearance suspended) per [05-payments-payouts.md](05-payments-payouts.md) §1. One complaint per booking (`Complaint.bookingId @unique`).

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `bookingId` | string (cuid) | required; caller must be the booking's client or provider. |
| `type` | enum `ComplaintType` | required; `service_quality` `no_show` `payment` `safety` `other`. |
| `description` | string | required; 10–2000 chars. |
| `evidenceUrls` | string[] | optional; up to 5 confirmed signed-upload keys (images). |

```json
{
  "bookingId": "ckbk_7QF3a1b2c3",
  "type": "no_show",
  "description": "لم تحضر مقدّمة الخدمة في الموعد المتفق عليه ولم ترد على الرسائل.",
  "evidenceUrls": ["complaints/ckbk_7QF3a1b2c3/chat-screenshot.jpg"]
}
```

**Success `201`:**
```json
{
  "data": {
    "complaint": {
      "id": "ckcmp_01",
      "bookingId": "ckbk_7QF3a1b2c3",
      "bookingReference": "NB-7QF3",
      "reporterId": "ckusr_client01",
      "reporterRole": "client",
      "type": "no_show",
      "status": "open",
      "description": "لم تحضر مقدّمة الخدمة في الموعد المتفق عليه ولم ترد على الرسائل.",
      "evidenceUrls": ["https://cdn.nora-beauty.app/complaints/.../chat-screenshot.jpg?X-Amz-Expires=900"],
      "createdAt": "2026-06-30T15:00:00.000Z"
    },
    "disputeHold": { "applied": true, "amountMinor": 32000, "amountFormatted": "320.00 SAR" }
  }
}
```

**Errors:**
| Status | code | When |
|---|---|---|
| 422 | `validation_error` | bad/missing field; too many evidence items. |
| 403 | `forbidden` | caller not a party to the booking. |
| 404 | `booking_not_found` | unknown booking. |
| 409 | `complaint_exists` | a complaint already exists for this booking. |

---

### 3.2 List complaints

`GET /complaints`
**Auth:** `client`/`provider` (own filed or own bookings) or `admin` (all; the moderation queue).
**Description:** Paginated complaints, newest first. Admins get the full queue with assignment/status filters.

**Query params:** `limit`, `cursor`, `status` (enum, optional), `type` (enum, optional), `assignedToMe` (admin only, boolean), `from`, `to`.

**Success `200`:**
```json
{
  "data": [
    {
      "id": "ckcmp_01",
      "bookingReference": "NB-7QF3",
      "reporterRole": "client",
      "type": "no_show",
      "status": "under_review",
      "preview": "لم تحضر مقدّمة الخدمة في الموعد المتفق عليه...",
      "resolvedByAdminId": null,
      "createdAt": "2026-06-30T15:00:00.000Z",
      "resolvedAt": null
    }
  ],
  "meta": { "nextCursor": null, "hasMore": false, "limit": 20 }
}
```

**Errors:** `401 unauthenticated`, `403 forbidden`, `422 validation_error`.

---

### 3.3 Get complaint

`GET /complaints/:id`
**Auth:** the reporter, the booking counterpart, or `admin`.
**Success `200`:** full complaint (shape of §3.1 `complaint` plus `resolution`, `resolvedByAdminId`, `resolvedAt`).
**Errors:** `401 unauthenticated`, `403 forbidden`, `404 complaint_not_found`.

---

### 3.4 Admin — transition complaint status

`PATCH /complaints/:id/status`
**Auth:** `admin` (`ops`; `escalated` target requires the action to route to `super_admin`/`finance`).
**Description:** Moves a complaint through its lifecycle (e.g. `open → under_review`, `under_review → awaiting_response`, `→ escalated`). Resolution-with-outcome uses the dedicated endpoint §3.5. Writes `AuditLog`.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `status` | enum `ComplaintStatus` | required; must be a legal transition from the current status; `resolved`/`rejected` not allowed here (use §3.5). |
| `note` | string | optional; max 1000 chars (internal). |

```json
{ "status": "under_review", "note": "Reviewing chat logs and slot timestamps." }
```

**Success `200`:**
```json
{ "data": { "id": "ckcmp_01", "status": "under_review", "updatedAt": "2026-06-30T15:20:00.000Z" } }
```

**Errors:** `403 forbidden`, `404 complaint_not_found`, `409 illegal_transition`, `422 validation_error`.

---

### 3.5 Admin — resolve complaint (with money outcome)

`POST /complaints/:id/resolve`
**Auth:** `admin` (`ops` for non-money outcomes; **`finance` or `super_admin`** required when `outcome` moves money — refund/hold release/split).
**Description:** Closes a complaint as `resolved` (or `rejected`) and applies the adjudication outcome to the booking's escrow: release to provider, refund to client (full/partial), or split. Triggers the corresponding refund (see [05-payments-payouts.md](05-payments-payouts.md) §2.3) and/or wallet release, lifts the dispute hold, and writes `AuditLog`.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `decision` | enum | required; `resolved` or `rejected`. |
| `outcome` | enum | required when `decision=resolved`; one of `release_to_provider` `refund_client_full` `refund_client_partial` `split` `none`. |
| `refundAmountMinor` | integer | required when `outcome` ∈ `refund_client_partial`/`split`; `1 <= amount <= booking.totalMinor`. |
| `resolution` | string | required; 10–2000 chars (shared with both parties). |

```json
{
  "decision": "resolved",
  "outcome": "refund_client_full",
  "resolution": "تم التحقق من عدم حضور مقدّمة الخدمة. تمت إعادة كامل المبلغ للعميلة وتطبيق إنذار على الحساب.",
  "refundAmountMinor": null
}
```

**Success `200`:**
```json
{
  "data": {
    "complaint": {
      "id": "ckcmp_01",
      "status": "resolved",
      "resolution": "تم التحقق من عدم حضور مقدّمة الخدمة. تمت إعادة كامل المبلغ للعميلة...",
      "resolvedByAdminId": "ckadm_ops1",
      "resolvedAt": "2026-06-30T16:10:00.000Z"
    },
    "moneyOutcome": {
      "type": "refund_client_full",
      "refundId": "ckref_disp1",
      "refundAmountMinor": 32000,
      "refundFormatted": "320.00 SAR",
      "providerCreditMinor": 0,
      "disputeHoldReleased": true
    }
  }
}
```

**Errors:**
| Status | code | When |
|---|---|---|
| 403 | `forbidden` | money outcome attempted without `finance`/`super_admin`. |
| 404 | `complaint_not_found` | unknown id. |
| 409 | `already_resolved` | complaint already `resolved`/`rejected`. |
| 422 | `validation_error` | missing `outcome`/`refundAmountMinor`/`resolution`. |
| 422 | `refund_exceeds_total` | `refundAmountMinor > booking.totalMinor`. |
| 502 | `gateway_error` | downstream refund failed (resolution rolled back). |

---

## 4. Support tickets

### 4.1 Create a support ticket

`POST /support/tickets`
**Auth:** any authenticated user (`client`/`provider`).
**Description:** Opens a support ticket (`status = new`). Not tied to a booking. Routed to the `support` admin queue.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `subject` | string | required; 3–140 chars. |
| `body` | string | required; 10–4000 chars. |
| `attachmentUrls` | string[] | optional; up to 5 confirmed signed-upload keys. |

```json
{
  "subject": "لم يصلني إيصال الدفع",
  "body": "أتممت حجزاً برقم NB-7QF3 وخُصم المبلغ لكن لم يصلني إيصال الدفع على التطبيق.",
  "attachmentUrls": []
}
```

**Success `201`:**
```json
{
  "data": {
    "id": "cktkt_01",
    "subject": "لم يصلني إيصال الدفع",
    "status": "new",
    "assignedAdminId": null,
    "createdAt": "2026-06-30T17:00:00.000Z"
  }
}
```

**Errors:** `401 unauthenticated`, `422 validation_error`.

---

### 4.2 List support tickets

`GET /support/tickets`
**Auth:** owner (own tickets) or `admin` (`support`/`super_admin`; the full queue).
**Description:** Paginated tickets, newest activity first.

**Query params:** `limit`, `cursor`, `status` (enum `TicketStatus`, optional), `assignedToMe` (admin only, boolean).

**Success `200`:**
```json
{
  "data": [
    {
      "id": "cktkt_01",
      "subject": "لم يصلني إيصال الدفع",
      "status": "open",
      "assignedAdminId": "ckadm_sup1",
      "lastReplyAt": "2026-06-30T17:30:00.000Z",
      "createdAt": "2026-06-30T17:00:00.000Z",
      "updatedAt": "2026-06-30T17:30:00.000Z"
    }
  ],
  "meta": { "nextCursor": null, "hasMore": false, "limit": 20 }
}
```

**Errors:** `401 unauthenticated`, `403 forbidden`.

---

### 4.3 Get ticket with replies

`GET /support/tickets/:id`
**Auth:** owner or `admin` (`support`/`super_admin`).
**Description:** Returns the ticket and its threaded replies.

**Success `200`:**
```json
{
  "data": {
    "id": "cktkt_01",
    "subject": "لم يصلني إيصال الدفع",
    "body": "أتممت حجزاً برقم NB-7QF3 وخُصم المبلغ لكن لم يصلني إيصال الدفع على التطبيق.",
    "status": "open",
    "assignedAdminId": "ckadm_sup1",
    "replies": [
      {
        "id": "ckrep_01",
        "authorType": "admin",
        "authorName": "فريق الدعم",
        "body": "أهلاً بك، تم إصدار الإيصال وسيظهر تحت فواتيرك خلال دقائق. شكراً لتواصلك.",
        "attachmentUrls": [],
        "createdAt": "2026-06-30T17:30:00.000Z"
      }
    ],
    "createdAt": "2026-06-30T17:00:00.000Z",
    "updatedAt": "2026-06-30T17:30:00.000Z"
  }
}
```

**Errors:** `401 unauthenticated`, `403 forbidden`, `404 ticket_not_found`.

---

### 4.4 Reply to a ticket

`POST /support/tickets/:id/reply`
**Auth:** owner or `admin` (`support`/`super_admin`).
**Description:** Adds a reply. An owner reply moves an `pending_user` ticket back to `open`; an admin reply requesting info moves it to `pending_user` (set via §4.5 or the `setStatus` field). Closed tickets cannot receive replies.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `body` | string | required; 1–4000 chars. |
| `attachmentUrls` | string[] | optional; up to 5 confirmed keys. |
| `setStatus` | enum `TicketStatus` | optional (admin only); legal transition such as `open` `pending_user` `on_hold` `resolved`. |

```json
{ "body": "تم استلام الإيصال الآن، شكراً جزيلاً!", "attachmentUrls": [] }
```

**Success `201`:**
```json
{
  "data": {
    "reply": { "id": "ckrep_02", "authorType": "client", "body": "تم استلام الإيصال الآن، شكراً جزيلاً!", "createdAt": "2026-06-30T17:45:00.000Z" },
    "ticket": { "id": "cktkt_01", "status": "open" }
  }
}
```

**Errors:** `401 unauthenticated`, `403 forbidden`, `404 ticket_not_found`, `409 ticket_closed`, `422 validation_error`.

---

### 4.5 Close / resolve a ticket

`POST /support/tickets/:id/close`
**Auth:** `admin` (`support`/`super_admin`); the owner may also close their own ticket.
**Description:** Sets the ticket to `resolved` or `closed`. `resolved` allows the owner to reopen (reply) within `TICKET_REOPEN_WINDOW_HOURS = 72h`; after that, or when set to `closed`, it is final.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `status` | enum | required; `resolved` or `closed`. |
| `resolutionNote` | string | optional (admin); max 1000 chars. |

```json
{ "status": "resolved", "resolutionNote": "تم إصدار الإيصال وحل المشكلة." }
```

**Success `200`:**
```json
{ "data": { "id": "cktkt_01", "status": "resolved", "updatedAt": "2026-06-30T17:50:00.000Z" } }
```

**Errors:** `403 forbidden`, `404 ticket_not_found`, `409 illegal_transition` (e.g. already `closed`), `422 validation_error`.

---

## 5. Related

- Completion that unlocks reviews: [04-bookings.md](04-bookings.md)
- Dispute hold & refund mechanics: [05-payments-payouts.md](05-payments-payouts.md) · [../03-user-flows/05-payments-payouts.md](../03-user-flows/05-payments-payouts.md)
- `new_review` notification: [06-chat-notifications.md](06-chat-notifications.md)
- Admin complaints queue, ticket assignment & audit log: [08-admin.md](08-admin.md)
- Data model & enums: [../01-architecture/04-data-model.md](../01-architecture/04-data-model.md) · [../00-overview/03-glossary.md](../00-overview/03-glossary.md)
