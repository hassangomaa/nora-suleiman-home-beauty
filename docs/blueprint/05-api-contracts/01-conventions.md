# API Conventions

> **Canonical.** This document defines the cross-cutting contract that every endpoint in the [Nora](../00-overview/01-product-brief.md) REST API obeys: base URL, auth, envelope, pagination, errors, rate limits, idempotency, time/locale handling, file upload, and webhook signing. Endpoint-specific contracts live in [02-auth.md](02-auth.md), [03-providers-services.md](03-providers-services.md), and [04-bookings.md](04-bookings.md). Enums referenced here are canonical per [glossary](../00-overview/03-glossary.md); entities per [data-model](../01-architecture/04-data-model.md). Stack per [tech-stack](../01-architecture/01-tech-stack.md).

---

## 1. Base URL & versioning

| Env | Base URL |
|---|---|
| `local` | `http://localhost:3000/api/v1` |
| `staging` | `https://staging-api.nora-beauty.app/api/v1` |
| `production` | `https://api.nora-beauty.app/api/v1` |

- **Versioning strategy:** URI prefix `/api/v1`. Backwards-incompatible changes ship under `/api/v2`; additive changes (new optional fields, new endpoints) do **not** bump the version.
- All request and response bodies are `application/json; charset=utf-8` unless explicitly stated (file binary uploads go to S3 directly, see §11).
- All paths in [02](02-auth.md)–[04](04-bookings.md) are written **relative to the base URL** (e.g. `GET /providers` = `GET https://api.nora-beauty.app/api/v1/providers`).

---

## 2. Authentication & authorization

Auth is **phone + OTP → JWT** (no passwords at MVP). See the [authentication flow](../03-user-flows/02-authentication.md) and [auth contract](02-auth.md).

### 2.1 Bearer header

Every authenticated request carries the **access token**:

```http
Authorization: Bearer <access_jwt>
```

### 2.2 Token model

| Token | TTL | Storage | Purpose |
|---|---|---|---|
| `accessToken` | 15 min (`JWT_ACCESS_TTL=900`) | client memory / secure storage | Sent on every request as Bearer. |
| `refreshToken` | 30 days (`JWT_REFRESH_TTL=2592000`) | secure storage (Keychain/Keystore) | Exchanged at `POST /auth/refresh` for a new access token. One `Session` row per refresh token (hashed). |

Access JWT claims (`HS256`, secret `JWT_ACCESS_SECRET`):

```json
{
  "sub": "usr_3kf9a2bq7m",
  "roles": ["client", "provider"],
  "activeRole": "client",
  "accountState": "active",
  "sid": "ses_8x2k1m4p0a",
  "iat": 1751180400,
  "exp": 1751181300
}
```

- `sub` — `User.id`. `roles` — `Role[]` the account holds. `activeRole` — the role the client app is currently operating as (a dual-role account switches with `PATCH /me`). `sid` — `Session.id` for refresh-token revocation.
- **Authorization** is server-side and role-based (RBAC). Each endpoint in [02](02-auth.md)–[04](04-bookings.md) declares the role(s) it requires. The UI hides disallowed actions but the API is the source of truth ([personas-roles §3](../00-overview/02-personas-roles.md#3-permissions-matrix)).
- A request whose token lacks the required role → `403 FORBIDDEN`. A missing/expired/invalid token → `401 UNAUTHORIZED`. A suspended/deactivated account on a transacting endpoint → `403 ACCOUNT_NOT_ACTIVE`.

### 2.3 Refresh rotation & logout

- `POST /auth/refresh` **rotates** the refresh token: the presented token's `Session.refreshTokenHash` is invalidated and a new one issued. Re-presenting a rotated token → `401 REFRESH_TOKEN_REUSED` and **all** sessions for that user are revoked (token-theft defense).
- `POST /auth/logout` revokes the current `Session` (sets `revokedAt`). See [02-auth.md §4](02-auth.md).

---

## 3. Standard response envelope

Every **success** response (2xx) uses this envelope:

```json
{
  "success": true,
  "data": { },
  "meta": { }
}
```

- `data` — the resource or array of resources. Object for single-resource reads, array for collections.
- `meta` — present only when there is something to report: pagination (§5), or a `requestId`. Single-object reads with no extra metadata may omit `meta`.

Every **error** response (4xx/5xx) uses the error envelope (§7).

Single resource example:

```json
{
  "success": true,
  "data": {
    "id": "svc_1a2b3c",
    "nameAr": "مكياج سهرة",
    "priceMinor": 35000,
    "currency": "SAR",
    "durationMinutes": 90,
    "createdAt": "2026-06-29T14:05:00+03:00"
  }
}
```

**Money** is always an integer minor unit (halalas) field suffixed `Minor`, paired with `"currency": "SAR"`. Never floats. `35000` = SAR 350.00. Formatting (e.g. `٣٥٠٫٠٠ ر.س`) is a client concern driven by `Accept-Language` (§9).

---

## 4. HTTP methods & status codes

| Method | Use | Typical success |
|---|---|---|
| `GET` | Read resource/collection | `200 OK` |
| `POST` | Create / non-idempotent action / state transition | `201 Created` (new resource) · `200 OK` (action) |
| `PATCH` | Partial update | `200 OK` |
| `PUT` | Full replace (rare; ordering writes) | `200 OK` |
| `DELETE` | Remove resource | `204 No Content` |

`204` responses carry **no body**. All others carry the envelope.

---

## 5. Pagination

Two modes. **Cursor** pagination is the default for high-churn, time-ordered feeds (bookings, notifications, messages, wallet ledger). **Page** pagination is offered for admin tables and search result lists where a total/jump-to-page is useful.

### 5.1 Cursor pagination (default)

Request:

```http
GET /bookings?limit=20&cursor=eyJjcmVhdGVkQXQiOiIyMDI2LTA2LTI4VDA5OjAwOjAwKzAzOjAwIiwiaWQiOiJia2dfOXoifQ
```

| Query param | Type | Default | Rules |
|---|---|---|---|
| `limit` | integer | `20` | 1–100. >100 → clamped to 100. |
| `cursor` | string (opaque, base64url) | — | Echo back `meta.nextCursor` from the previous page. Omit for first page. |

Response `meta`:

```json
{
  "success": true,
  "data": [ ],
  "meta": {
    "pagination": {
      "mode": "cursor",
      "limit": 20,
      "nextCursor": "eyJjcmVhdGVkQXQiOiIyMDI2LTA2LTI3VDExOjAwOjAwKzAzOjAwIiwiaWQiOiJia2dfN2EifQ",
      "hasMore": true
    }
  }
}
```

- `nextCursor` is `null` and `hasMore` is `false` on the last page. Cursors are opaque (base64url of `{sortKey,id}`); clients must not parse or construct them.

### 5.2 Page pagination

Request:

```http
GET /providers?page=2&pageSize=20
```

| Query param | Type | Default | Rules |
|---|---|---|---|
| `page` | integer | `1` | ≥1. |
| `pageSize` | integer | `20` | 1–100. |

Response `meta`:

```json
{
  "success": true,
  "data": [ ],
  "meta": {
    "pagination": {
      "mode": "page",
      "page": 2,
      "pageSize": 20,
      "totalItems": 137,
      "totalPages": 7,
      "hasMore": true
    }
  }
}
```

Each endpoint documents which mode it uses. Mixing `cursor` with `page`/`pageSize` on the same request → `400 INVALID_PAGINATION`.

---

## 6. Filtering, sorting, field selection

- **Filtering:** flat query params named after the filtered field, e.g. `?status=confirmed`, `?categoryId=cat_makeup`, `?isActive=true`. Multi-value via repeated key or comma list: `?status=pending,confirmed`. Unknown filter keys are ignored (forward-compatible); invalid **values** for a known key → `422 VALIDATION_ERROR`.
- **Ranges:** suffixes `Min`/`Max` and `From`/`To` (ISO-8601 instants), e.g. `?priceMin=10000&priceMax=50000`, `?scheduledFrom=2026-07-01T00:00:00+03:00&scheduledTo=2026-07-07T23:59:59+03:00`.
- **Sorting:** `?sort=<field>` ascending, `?sort=-<field>` descending; multiple comma-separated, applied left to right: `?sort=-ratingAvg,distance`. Each endpoint enumerates its allowed sort fields; an unsupported field → `422 VALIDATION_ERROR` (`field: "sort"`).
- **Search text:** `?q=<term>` for free-text search where supported (provider name, service name); trimmed, 1–80 chars.
- **Sparse fieldsets** are **not** supported at MVP; endpoints return a fixed shape.

---

## 7. Errors

### 7.1 Error envelope

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": [
      { "field": "phone", "rule": "e164_ksa", "message": "Phone must be a valid +966 number." }
    ],
    "requestId": "req_01J9Z6S0YH7Q5K"
  }
}
```

- `code` — stable machine-readable string from the catalog (§7.3). Clients branch on `code`, never on `message`.
- `message` — human-readable, localized per `Accept-Language` (§9). Safe to surface to users only for `4xx`; show a generic message for `5xx`.
- `details` — present for `422 VALIDATION_ERROR` (per-field). `field` uses dot/bracket paths (`items[0].serviceId`). `rule` names the failed validator.
- `requestId` — correlate with server logs (Sentry/pino); echoed in the `X-Request-Id` response header on every response.

### 7.2 HTTP status mapping

| HTTP | Meaning |
|---|---|
| `400` | Malformed request (bad JSON, bad query combo). |
| `401` | Missing/invalid/expired credentials. |
| `403` | Authenticated but not permitted (role / account state / ownership). |
| `404` | Resource not found, or not visible to caller. |
| `409` | Conflict (duplicate, state-machine violation, slot taken). |
| `410` | Gone (expired OTP, expired signed URL). |
| `422` | Validation error (well-formed but semantically invalid). |
| `423` | Locked (OTP lockout). |
| `429` | Rate limited (§8). |
| `500` | Unhandled server error. |
| `503` | Dependency unavailable (SMS/payment provider). |

### 7.3 Global error code catalog

Domain-specific codes are documented at their endpoints; these are global.

| Code | HTTP | When |
|---|---|---|
| `VALIDATION_ERROR` | 422 | One or more body/query fields fail validation; see `details`. |
| `MALFORMED_REQUEST` | 400 | Body is not valid JSON or content-type is wrong. |
| `INVALID_PAGINATION` | 400 | Cursor and page params mixed, or cursor unparseable. |
| `UNAUTHORIZED` | 401 | No token, or token invalid/expired/malformed. |
| `ACCESS_TOKEN_EXPIRED` | 401 | Access token expired; client should refresh (§2.3). |
| `REFRESH_TOKEN_INVALID` | 401 | Refresh token unknown, revoked, or expired. |
| `REFRESH_TOKEN_REUSED` | 401 | Rotated refresh token replayed; all sessions revoked. |
| `FORBIDDEN` | 403 | Authenticated but lacks the required role/capability. |
| `ACCOUNT_NOT_ACTIVE` | 403 | Account is `pending_otp`, `suspended`, or `deactivated`. |
| `OWNERSHIP_REQUIRED` | 403 | Resource exists but is not owned by the caller. |
| `NOT_FOUND` | 404 | Resource does not exist or is not visible to the caller. |
| `CONFLICT` | 409 | Generic conflicting state (see domain code where specific). |
| `IDEMPOTENCY_KEY_CONFLICT` | 409 | Same `Idempotency-Key` reused with a different request body (§10). |
| `RESOURCE_GONE` | 410 | OTP/signed URL/cursor target expired. |
| `RATE_LIMITED` | 429 | Too many requests in the window (§8). |
| `DEPENDENCY_UNAVAILABLE` | 503 | Upstream (Unifonic/Moyasar/S3) failed; safe to retry. |
| `INTERNAL_ERROR` | 500 | Unhandled error; `requestId` for support. |

---

## 8. Rate limiting

Enforced in Redis (sliding window) per identity (authenticated `User.id`, else client IP). Every response on a rate-limited route includes:

| Header | Example | Meaning |
|---|---|---|
| `X-RateLimit-Limit` | `60` | Max requests in the current window. |
| `X-RateLimit-Remaining` | `57` | Requests left in the window. |
| `X-RateLimit-Reset` | `1751181300` | Unix epoch (seconds) when the window resets. |
| `Retry-After` | `38` | Seconds to wait (sent only on `429`). |

Default limits (per identity):

| Scope | Limit |
|---|---|
| Global authenticated | 120 req / min |
| `POST /auth/otp/request` | 1 / 30 s, 5 / hour per phone (see [02 §1](02-auth.md)) |
| `POST /auth/otp/verify` | 5 attempts / OTP then lockout (see [02 §2](02-auth.md)) |
| Search (`GET /providers`) | 60 req / min |
| Mutating booking endpoints | 30 req / min |

Exceeding a limit → `429 RATE_LIMITED` with `Retry-After`.

---

## 9. Localization, time & money

### 9.1 Localization

```http
Accept-Language: ar
```

- Accepted values: `ar` (default, `ar-SA`, RTL) and `en`. Unrecognized → falls back to the authenticated user's `User.locale`, else `ar`.
- Drives: localized `error.message`, localized validation messages, and selection of localized fields where the API returns a single localized string (e.g. notification copy). **Bilingual content fields** (`nameAr`/`nameEn`, `titleAr`/`bodyAr`) are always returned in full as stored — `Accept-Language` does not strip them.
- Echoed back as `Content-Language` on the response.

### 9.2 Time & timezone

- All timestamps in requests and responses are **ISO-8601 with explicit offset**, emitted in **Asia/Riyadh** (`+03:00`, no DST): `"2026-06-29T14:05:00+03:00"`.
- Clients may send any valid ISO-8601 offset on input; the server normalizes/stores as `timestamptz` and re-emits in Asia/Riyadh.
- Availability `startTime`/`endTime` are wall-clock `"HH:mm"` strings in Asia/Riyadh ([data-model `Availability`](../01-architecture/04-data-model.md#3-enums)).

### 9.3 Money

- Integer minor units (halalas), field suffix `Minor`, always paired with `"currency": "SAR"`. `12500` = SAR 125.00. Arabic display formatting (Arabic-Indic digits, `ر.س`) is client-side.

---

## 10. Idempotency keys

Required on all **payment-affecting** and **booking-creating** `POST` requests; recommended on any retried `POST`. Specifically required by: `POST /bookings`, `POST /bookings/:id/cancel`, `POST /bookings/:id/reschedule/accept`, and all payment/payout writes.

```http
Idempotency-Key: 6f1c2e9a-3b8d-4f2a-9c11-7d0e5a4b1c22
```

- Value: client-generated UUID v4, unique per logical operation. Stored in Redis with the **request fingerprint** (hash of method + path + body) and the **first response** for 24 h.
- **Replay with the same key + same body** → returns the original stored response (same status, same body), without re-executing the side effect.
- **Same key + different body** → `409 IDEMPOTENCY_KEY_CONFLICT`.
- Missing key on a required endpoint → `422 VALIDATION_ERROR` (`field: "Idempotency-Key"`).
- A request still in-flight under the same key → `409 CONFLICT` (`code: "REQUEST_IN_PROGRESS"`); retry after a short backoff.

---

## 11. File upload (signed URL pattern)

Binary uploads (portfolio images, avatars, chat media) never transit the API. The API mints a short-lived **S3 presigned PUT URL**; the client uploads directly to S3-compatible storage ([tech-stack: S3/R2](../01-architecture/01-tech-stack.md), <1 MB/portfolio image, resized client-side), then references the returned `key`.

**Step 1 — request an upload URL.** `POST /uploads/sign` (auth: any active user):

Request:

```json
{
  "purpose": "portfolio_image",
  "contentType": "image/jpeg",
  "fileSizeBytes": 742194
}
```

| Field | Type | Validation |
|---|---|---|
| `purpose` | enum | `portfolio_image` · `avatar` · `chat_media`. |
| `contentType` | string | One of `image/jpeg`, `image/png`, `image/webp`. |
| `fileSizeBytes` | integer | 1 – 1_048_576 (1 MB) for images. |

Response `201`:

```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://nora-media.s3.me-central-1.amazonaws.com/portfolio/usr_3kf9a2bq7m/2026/06/9f3a1c.jpg?X-Amz-Signature=...",
    "method": "PUT",
    "headers": { "Content-Type": "image/jpeg" },
    "key": "portfolio/usr_3kf9a2bq7m/2026/06/9f3a1c.jpg",
    "expiresAt": "2026-06-29T14:20:00+03:00"
  }
}
```

**Step 2 — PUT the bytes to `uploadUrl`** with the exact `Content-Type`. A 200 from S3 means the object exists.

**Step 3 — reference the `key`** in the relevant resource write (e.g. `imageUrl` on a portfolio item, `avatarUrl` on the profile, `mediaUrl` on a message). The API verifies the object exists and was uploaded by the caller before persisting.

Errors: `422 VALIDATION_ERROR` (unsupported type/size), `410 RESOURCE_GONE` (referencing a `key` whose presign expired and was never uploaded), `503 DEPENDENCY_UNAVAILABLE` (S3 down).

---

## 12. Webhooks (inbound from providers)

Payment events arrive from **Moyasar**; SMS delivery events may arrive from **Unifonic**. Inbound webhooks hit a dedicated route and are **signature-verified** before processing.

`POST /webhooks/moyasar` (no Bearer; HMAC-signed):

```http
POST /api/v1/webhooks/moyasar
Content-Type: application/json
X-Moyasar-Signature: t=1751180460,v1=5d2e...a91c
```

- The signature header carries a timestamp `t` and HMAC-SHA256 `v1` of `"{t}.{rawBody}"` keyed by `MOYASAR_WEBHOOK_SECRET`.
- The server: (1) rejects if `|now - t| > 300 s` → `400` (replay window); (2) recomputes the HMAC over the **raw** body and compares in constant time → mismatch `401`; (3) treats the provider event id as an idempotency key (duplicate delivery is a no-op → `200`).
- Responses: `200` accepted/duplicate · `400` bad timestamp/payload · `401` bad signature. Non-2xx triggers provider retry with backoff.

### 12.1 Outbound webhooks (Nora → admin/integrators, Phase 2)

When Nora emits webhooks, each delivery is signed the same way under a per-subscription secret:

```http
X-Nora-Signature: t=1751180460,v1=<hmac_sha256(secret, "t.rawBody")>
X-Nora-Event: booking.completed
X-Nora-Delivery: evt_01J9Z6S0YH
```

Consumers verify identically (timestamp window + constant-time HMAC) and must respond `2xx` within 5 s or the event is retried (exponential backoff, up to 24 h).

---

## 13. Common headers summary

| Header | Direction | Notes |
|---|---|---|
| `Authorization: Bearer <jwt>` | request | Required on authenticated routes (§2). |
| `Accept-Language: ar\|en` | request | Localization (§9). |
| `Idempotency-Key: <uuid>` | request | Required on payment/booking writes (§10). |
| `Content-Type: application/json` | request | All JSON bodies. |
| `X-Request-Id` | response | Correlation id, echoed in error `requestId`. |
| `Content-Language` | response | Resolved locale. |
| `X-RateLimit-*`, `Retry-After` | response | Rate limiting (§8). |
