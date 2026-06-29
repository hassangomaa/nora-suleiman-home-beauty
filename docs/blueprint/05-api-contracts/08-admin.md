# API Contracts — Admin

> **Scope.** Admin-only endpoints: user management, bookings oversight, reports/analytics (GMV, bookings, providers, commission), commission-tier CRUD, visibility-package CRUD + assignment, points config, complaints queue + resolution, payouts queue, promotional broadcast, and the audit log. Entities & enums per [../01-architecture/04-data-model.md](../01-architecture/04-data-model.md) and [../00-overview/03-glossary.md](../00-overview/03-glossary.md).
>
> **Stack.** NestJS + Prisma/PostgreSQL. Every admin **mutation** writes an immutable `AuditLog` (`action`, `entityType`, `entityId`, `before`, `after`, `ip`). All money is integer minor units (halalas), `SAR`.

> **Conventions.** Reuses the canonical envelope, error shape, pagination, and auth defined in [05-payments-payouts.md](05-payments-payouts.md) §0 (since `01-conventions.md` does not yet exist in this folder). All paths are under `/api/v1/admin` unless noted.

---

## 1. RBAC sub-roles

Admin auth uses the same Bearer JWT, with `adminRole` ∈ `super_admin` · `ops` · `finance` · `support` (`AdminRole`). Each endpoint lists the minimum role(s); `super_admin` may perform anything.

| Capability area | Allowed sub-roles |
|---|---|
| User management (suspend/reactivate) | `super_admin`, `ops` |
| Bookings oversight (view, force-cancel) | `super_admin`, `ops` |
| Reports / analytics | `super_admin`, `ops`, `finance` |
| Commission tiers CRUD | `super_admin`, `finance` |
| Visibility packages CRUD + assignment | `super_admin`, `ops` |
| Points config | `super_admin`, `ops` |
| Complaints queue + resolution (money) | `super_admin`, `ops`; money outcome → `finance`/`super_admin` |
| Payouts queue (approve/reject/process) | `super_admin`, `finance` |
| Promotional broadcast | `super_admin`, `ops` |
| Audit log (read) | `super_admin`, `finance`, `ops` |

Insufficient role → `403 forbidden`. Non-admin token on any `/admin/*` path → `403 forbidden`.

---

## 2. User management

### 2.1 List / search users

`GET /admin/users`
**Auth:** `super_admin`, `ops`.
**Description:** Paginated user directory with search and filters.

**Query params:** `limit`, `cursor`, `q` (name/phone search), `role` (`client`|`provider`), `accountState` (enum `AccountState`), `tier` (`ProviderTier`, providers), `city`, `from`, `to` (createdAt).

**Success `200`:**
```json
{
  "data": [
    {
      "id": "ckusr_prov07",
      "fullName": "نورة سليمان",
      "phone": "+966512345678",
      "roles": ["provider"],
      "activeRole": "provider",
      "accountState": "active",
      "providerTier": "mid",
      "ratingAvg": "4.87",
      "city": "الرياض",
      "createdAt": "2026-02-11T09:00:00.000Z"
    }
  ],
  "meta": { "nextCursor": "eyJpZCI6ImNrdXNyXzA2In0", "hasMore": true, "limit": 20 }
}
```

**Errors:** `401 unauthenticated`, `403 forbidden`, `422 validation_error`.

---

### 2.2 Get user detail

`GET /admin/users/:id`
**Auth:** `super_admin`, `ops`.
**Description:** Full profile with role profiles, wallet summary (providers), counts (bookings, complaints), and recent audit entries.

**Success `200`:**
```json
{
  "data": {
    "id": "ckusr_prov07",
    "fullName": "نورة سليمان",
    "phone": "+966512345678",
    "roles": ["provider"],
    "accountState": "active",
    "locale": "ar-SA",
    "providerProfile": { "tier": "mid", "acceptingBookings": true, "ratingAvg": "4.87", "ratingCount": 63, "serviceRadiusKm": 15 },
    "walletSummary": { "balanceMinor": 184500, "pendingMinor": 31360, "currency": "SAR" },
    "counts": { "bookingsTotal": 71, "bookingsCompleted": 63, "openComplaints": 0 },
    "createdAt": "2026-02-11T09:00:00.000Z"
  }
}
```

**Errors:** `403 forbidden`, `404 user_not_found`.

---

### 2.3 Suspend a user

`POST /admin/users/:id/suspend`
**Auth:** `super_admin`, `ops`.
**Description:** Sets `accountState = suspended` (blocks transacting; sessions revoked). Blocked if the provider has an open payout (`409`). Writes `AuditLog`.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `reason` | string | required; 5–500 chars. |
| `relatedComplaintId` | string (cuid) | optional. |

```json
{ "reason": "تكرار عدم الحضور وشكاوى موثّقة من العميلات.", "relatedComplaintId": "ckcmp_01" }
```

**Success `200`:**
```json
{ "data": { "id": "ckusr_prov07", "accountState": "suspended", "suspendedAt": "2026-06-30T18:00:00.000Z" } }
```

**Errors:** `403 forbidden`, `404 user_not_found`, `409 already_suspended`, `409 open_payout_blocks_suspend`, `422 validation_error`.

---

### 2.4 Reactivate a user

`POST /admin/users/:id/reactivate`
**Auth:** `super_admin`, `ops`.
**Description:** Restores a `suspended`/`deactivated` user to `active`. Writes `AuditLog`.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `note` | string | optional; max 500 chars. |

```json
{ "note": "تمت معالجة المخالفة والاتفاق على الالتزام بالسياسة." }
```

**Success `200`:**
```json
{ "data": { "id": "ckusr_prov07", "accountState": "active", "reactivatedAt": "2026-07-05T10:00:00.000Z" } }
```

**Errors:** `403 forbidden`, `404 user_not_found`, `409 not_suspended` (already active).

---

## 3. Bookings oversight

### 3.1 List bookings (oversight)

`GET /admin/bookings`
**Auth:** `super_admin`, `ops`.
**Description:** Paginated bookings across the platform with filters.

**Query params:** `limit`, `cursor`, `status` (enum `BookingStatus`), `clientId`, `providerId`, `city`, `from`, `to` (scheduledAt), `hasDispute` (boolean), `q` (reference).

**Success `200`:**
```json
{
  "data": [
    {
      "id": "ckbk_7QF3a1b2c3",
      "reference": "NB-7QF3",
      "status": "completed",
      "clientName": "ع. ال.",
      "providerName": "نورة سليمان",
      "serviceName": "مكياج سهرة",
      "scheduledAt": "2026-06-30T14:00:00.000Z",
      "totalMinor": 32000,
      "totalFormatted": "320.00 SAR",
      "commissionMinor": 640,
      "hasComplaint": false,
      "createdAt": "2026-06-29T11:00:00.000Z"
    }
  ],
  "meta": { "nextCursor": "eyJpZCI6ImNrYmtfN1FFMiJ9", "hasMore": true, "limit": 20 }
}
```

**Errors:** `401 unauthenticated`, `403 forbidden`, `422 validation_error`.

---

### 3.2 Force-cancel a booking

`POST /admin/bookings/:id/cancel`
**Auth:** `super_admin`, `ops`.
**Description:** Administratively cancels a non-terminal booking (`cancelledBy = admin`), triggering the policy refund/void per [05-payments-payouts.md](05-payments-payouts.md) §2.3 and releasing the slot. Writes `AuditLog`.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `reason` | string | required; 5–500 chars. |
| `refundOutcome` | enum | required; `refund_full` `refund_partial` `void_hold` `no_refund`. |
| `refundAmountMinor` | integer | required when `refundOutcome=refund_partial`; `1 <= amount <= booking.totalMinor`. |

```json
{ "reason": "إغلاق الحساب بسبب مخالفة السياسة.", "refundOutcome": "refund_full", "refundAmountMinor": null }
```

**Success `200`:**
```json
{
  "data": {
    "booking": { "id": "ckbk_7QF3a1b2c3", "status": "cancelled", "cancelledBy": "admin", "cancelledAt": "2026-06-30T18:10:00.000Z" },
    "refund": { "id": "ckref_adm1", "amountMinor": 32000, "status": "pending" }
  }
}
```

**Errors:** `403 forbidden`, `404 booking_not_found`, `409 booking_terminal` (already `completed`/`cancelled`), `422 validation_error`.

---

## 4. Reports & analytics

### 4.1 GMV & commission summary

`GET /admin/reports/summary`
**Auth:** `super_admin`, `ops`, `finance`.
**Description:** Headline metrics for a date range, grouped by an optional interval.

**Query params:** `from` (ISO date, required), `to` (ISO date, required), `groupBy` (`day`|`week`|`month`, default `day`), `city` (optional).

**Success `200`:**
```json
{
  "data": {
    "range": { "from": "2026-06-01", "to": "2026-06-30" },
    "currency": "SAR",
    "totals": {
      "gmvMinor": 4820000,
      "gmvFormatted": "48,200.00 SAR",
      "commissionMinor": 86400,
      "commissionFormatted": "864.00 SAR",
      "bookingsCreated": 412,
      "bookingsCompleted": 351,
      "bookingsCancelled": 38,
      "completionRate": 0.852,
      "activeProviders": 96,
      "newClients": 173,
      "refundedMinor": 124000
    },
    "series": [
      { "bucket": "2026-06-29", "gmvMinor": 161000, "commissionMinor": 2880, "bookingsCompleted": 12 },
      { "bucket": "2026-06-30", "gmvMinor": 198000, "commissionMinor": 3640, "bookingsCompleted": 15 }
    ]
  }
}
```
GMV counts captured booking totals; commission is platform cut at capture (visibility-package revenue reported separately via §4.3).

**Errors:** `403 forbidden`, `422 validation_error` (missing/invalid `from`/`to`), `422 range_too_large` (> 366 days).

---

### 4.2 Bookings analytics

`GET /admin/reports/bookings`
**Auth:** `super_admin`, `ops`, `finance`.
**Description:** Booking funnel and status breakdown for a date range.

**Query params:** `from`, `to` (required), `groupBy` (`day`|`week`|`month`), `categoryId`, `city`.

**Success `200`:**
```json
{
  "data": {
    "range": { "from": "2026-06-01", "to": "2026-06-30" },
    "byStatus": { "pending": 14, "confirmed": 9, "completed": 351, "cancelled": 38, "reschedule_requested": 0 },
    "byCategory": [
      { "categoryId": "ckcat_makeup", "nameAr": "مكياج", "count": 198, "gmvMinor": 2640000 },
      { "categoryId": "ckcat_hair", "nameAr": "تصفيف شعر", "count": 96, "gmvMinor": 1280000 }
    ],
    "avgTicketMinor": 13730,
    "avgTicketFormatted": "137.30 SAR"
  }
}
```

**Errors:** `403 forbidden`, `422 validation_error`.

---

### 4.3 Providers & commission analytics

`GET /admin/reports/providers`
**Auth:** `super_admin`, `ops`, `finance`.
**Description:** Top providers by GMV/commission, per-tier breakdown, and visibility-package revenue for a date range.

**Query params:** `from`, `to` (required), `tier` (enum `ProviderTier`), `limit` (top-N, default 20).

**Success `200`:**
```json
{
  "data": {
    "range": { "from": "2026-06-01", "to": "2026-06-30" },
    "byTier": [
      { "tier": "beginner", "providers": 54, "gmvMinor": 1810000, "commissionMinor": 36200 },
      { "tier": "mid", "providers": 31, "gmvMinor": 2120000, "commissionMinor": 31800 },
      { "tier": "established", "providers": 11, "gmvMinor": 890000, "commissionMinor": 8900 }
    ],
    "packageRevenueMinor": 540000,
    "packageRevenueFormatted": "5,400.00 SAR",
    "topProviders": [
      { "providerId": "ckprv_07", "name": "نورة سليمان", "tier": "mid", "completed": 41, "gmvMinor": 562000, "commissionMinor": 8430, "ratingAvg": "4.87" }
    ]
  }
}
```

**Errors:** `403 forbidden`, `422 validation_error`.

---

## 5. Commission tiers (CRUD)

> Read endpoint `GET /commission-tiers` is in [05-payments-payouts.md](05-payments-payouts.md) §5.1.

### 5.1 Update a commission tier

`PUT /admin/commission-tiers/:tier`
**Auth:** `super_admin`, `finance`.
**Description:** Sets the basis-point rate for a tier (`beginner`|`mid`|`established`). Applies to **future** captures only (historical commissions are immutable snapshots on bookings). Writes `AuditLog` (`before`/`after`).

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `percentBps` | integer | required; `0 <= percentBps <= 3000` (0–30%). |
| `isActive` | boolean | optional; default keeps current. |

```json
{ "percentBps": 150, "isActive": true }
```

**Success `200`:**
```json
{ "data": { "id": "ckct_m", "tier": "mid", "percentBps": 150, "percentDisplay": "1.5%", "isActive": true, "updatedAt": "2026-06-30T18:30:00.000Z" } }
```

**Errors:** `403 forbidden`, `404 tier_not_found` (unknown tier), `422 validation_error`.

---

## 6. Visibility packages (CRUD + assignment)

### 6.1 List package catalog & active assignments

`GET /admin/visibility-packages`
**Auth:** `super_admin`, `ops`.
**Description:** Returns the package-type catalog (price/duration defaults) and, with `?providerId=`, that provider's active/expired packages.

**Query params:** `providerId` (optional), `status` (enum `PackageStatus`), `limit`, `cursor`.

**Success `200`:**
```json
{
  "data": {
    "catalog": [
      { "type": "silver", "priceMinor": 15000, "durationDays": 3 },
      { "type": "gold", "priceMinor": 30000, "durationDays": 5 },
      { "type": "platinum", "priceMinor": 60000, "durationDays": 10 }
    ],
    "assignments": [
      { "id": "ckvp_01", "providerId": "ckprv_07", "type": "gold", "status": "active", "pricePaidMinor": 30000, "startsAt": "2026-06-28T00:00:00.000Z", "expiresAt": "2026-07-03T00:00:00.000Z" }
    ]
  },
  "meta": { "nextCursor": null, "hasMore": false, "limit": 20 }
}
```

**Errors:** `403 forbidden`, `422 validation_error`.

---

### 6.2 Update package catalog entry

`PUT /admin/visibility-packages/catalog/:type`
**Auth:** `super_admin`, `ops`.
**Description:** Sets price/duration for a package `type` (`silver`|`gold`|`platinum`). Affects future purchases/assignments only. Writes `AuditLog`.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `priceMinor` | integer | required; `>= 0`. |
| `durationDays` | integer | required; `1 <= durationDays <= 60`. |

```json
{ "priceMinor": 32000, "durationDays": 5 }
```

**Success `200`:**
```json
{ "data": { "type": "gold", "priceMinor": 32000, "durationDays": 5, "updatedAt": "2026-06-30T18:40:00.000Z" } }
```

**Errors:** `403 forbidden`, `404 package_type_not_found`, `422 validation_error`.

---

### 6.3 Assign a package to a provider

`POST /admin/visibility-packages/assign`
**Auth:** `super_admin`, `ops`.
**Description:** Grants a provider a visibility package (e.g. complimentary/promo). Creates a `VisibilityPackage` (`status active`) with `startsAt = now`, `expiresAt = now + durationDays`, and schedules the BullMQ expiry job. Writes `AuditLog`.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `providerId` | string (cuid) | required; must be an active provider. |
| `type` | enum `PackageType` | required; `silver`|`gold`|`platinum`. |
| `pricePaidMinor` | integer | required; `>= 0` (0 for complimentary grants). |
| `durationDaysOverride` | integer | optional; `1..60`; default = catalog duration. |

```json
{ "providerId": "ckprv_07", "type": "platinum", "pricePaidMinor": 0, "durationDaysOverride": 7 }
```

**Success `201`:**
```json
{
  "data": {
    "id": "ckvp_02",
    "providerId": "ckprv_07",
    "type": "platinum",
    "status": "active",
    "pricePaidMinor": 0,
    "startsAt": "2026-06-30T18:45:00.000Z",
    "expiresAt": "2026-07-07T18:45:00.000Z"
  }
}
```

**Errors:** `403 forbidden`, `404 provider_not_found`, `409 provider_not_active`, `422 validation_error`.

---

### 6.4 Cancel a provider's active package

`POST /admin/visibility-packages/:id/cancel`
**Auth:** `super_admin`, `ops`.
**Description:** Sets a `VisibilityPackage` to `cancelled` (boost ends immediately) and cancels its expiry job. Writes `AuditLog`.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `reason` | string | required; 3–300 chars. |

```json
{ "reason": "إلغاء بناءً على طلب المقدّمة." }
```

**Success `200`:**
```json
{ "data": { "id": "ckvp_02", "status": "cancelled", "cancelledAt": "2026-07-01T09:00:00.000Z" } }
```

**Errors:** `403 forbidden`, `404 package_not_found`, `409 package_not_active`, `422 validation_error`.

---

## 7. Points config

### 7.1 Get points configuration

`GET /admin/points/config`
**Auth:** `super_admin`, `ops`.
**Description:** Returns the sales-points earning/redemption rules.

**Success `200`:**
```json
{
  "data": {
    "earnRatePer1000Sar": 100,
    "redeemRules": [
      { "rewardType": "silver_boost", "pointsCost": 800 },
      { "rewardType": "gold_boost", "pointsCost": 1500 }
    ],
    "isActive": true,
    "updatedAt": "2026-06-01T00:00:00.000Z"
  }
}
```

**Errors:** `403 forbidden`.

---

### 7.2 Update points configuration

`PUT /admin/points/config`
**Auth:** `super_admin`, `ops`.
**Description:** Sets the earn rate and redemption catalog. Affects future earning only (`PointsLedger` rows are immutable). Writes `AuditLog`.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `earnRatePer1000Sar` | integer | required; `1 <= rate <= 10000` (points per SAR 1,000 of sales). |
| `redeemRules` | object[] | required; each `{ rewardType: string, pointsCost: int>0 }`; 1–20 entries. |
| `isActive` | boolean | optional. |

```json
{
  "earnRatePer1000Sar": 100,
  "redeemRules": [
    { "rewardType": "silver_boost", "pointsCost": 800 },
    { "rewardType": "gold_boost", "pointsCost": 1500 }
  ],
  "isActive": true
}
```

**Success `200`:** the full config object (shape of §7.1).

**Errors:** `403 forbidden`, `422 validation_error`.

---

## 8. Complaints queue + resolution

> Full schemas (list/get/transition/resolve) are in [07-ratings-complaints.md](07-ratings-complaints.md) §3. The admin queue is the same `GET /complaints` (admin view), `PATCH /complaints/:id/status`, and `POST /complaints/:id/resolve` endpoints, gated by the §1 RBAC matrix:

- `GET /complaints?assignedToMe=&status=&type=` — moderation queue (`super_admin`, `ops`).
- `PATCH /complaints/:id/status` — triage transitions (`super_admin`, `ops`).
- `POST /complaints/:id/resolve` — resolution; **money outcomes require `finance`/`super_admin`**.

Each writes an `AuditLog`. See [07-ratings-complaints.md](07-ratings-complaints.md) §3.4–§3.5 for request/response bodies and error codes.

---

## 9. Payouts queue

> Full schemas (list/get/approve/reject/process) are in [05-payments-payouts.md](05-payments-payouts.md) §4. The finance queue uses the same endpoints, gated to `super_admin`/`finance`:

- `GET /payouts?status=requested` — pending-approval queue.
- `POST /payouts/:id/approve` · `POST /payouts/:id/reject` · `POST /payouts/:id/process`.

Each writes an `AuditLog`. See [05-payments-payouts.md](05-payments-payouts.md) §4.4–§4.6 for request/response bodies and error codes.

---

## 10. Promotional broadcast

> Full schema is in [06-chat-notifications.md](06-chat-notifications.md) §3.7. Endpoint: `POST /notifications/broadcast` (`super_admin`, `ops`), respecting `promotional` opt-outs and quiet hours, enqueued on BullMQ, and writing an `AuditLog`. See that section for the request/response bodies and error codes.

---

## 11. Audit log

### 11.1 List audit entries

`GET /admin/audit-logs`
**Auth:** `super_admin`, `finance`, `ops`.
**Description:** Paginated, newest first, of admin mutations. Filterable by actor, entity, and action.

**Query params:** `limit`, `cursor`, `adminId`, `entityType` (e.g. `Booking`, `Payout`, `User`, `Complaint`, `CommissionTier`, `VisibilityPackage`), `entityId`, `action` (e.g. `payout.approve`, `booking.cancel`, `user.suspend`), `from`, `to`.

**Success `200`:**
```json
{
  "data": [
    {
      "id": "ckaud_01",
      "adminId": "ckadm_fin1",
      "adminName": "إدارة المالية",
      "adminRole": "finance",
      "action": "payout.approve",
      "entityType": "Payout",
      "entityId": "ckpo_77z",
      "before": { "status": "requested" },
      "after": { "status": "approved", "approvedByAdminId": "ckadm_fin1" },
      "ip": "212.118.10.4",
      "createdAt": "2026-06-30T14:10:00.000Z"
    }
  ],
  "meta": { "nextCursor": "eyJpZCI6ImNrYXVkXzAwIn0", "hasMore": true, "limit": 20 }
}
```

**Errors:** `401 unauthenticated`, `403 forbidden`, `422 validation_error`.

---

### 11.2 Get audit entry

`GET /admin/audit-logs/:id`
**Auth:** `super_admin`, `finance`, `ops`.
**Success `200`:** single audit entry (shape of §11.1 item, with full `before`/`after` JSON).
**Errors:** `403 forbidden`, `404 audit_entry_not_found`.

---

## 12. Related

- Payouts queue & commission config: [05-payments-payouts.md](05-payments-payouts.md)
- Promotional broadcast & reminders: [06-chat-notifications.md](06-chat-notifications.md)
- Complaints resolution & support tickets: [07-ratings-complaints.md](07-ratings-complaints.md)
- Bookings lifecycle: [04-bookings.md](04-bookings.md)
- Data model, enums & audit invariants: [../01-architecture/04-data-model.md](../01-architecture/04-data-model.md) · [../00-overview/03-glossary.md](../00-overview/03-glossary.md)
