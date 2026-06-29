# API Contract — Authentication, Session & Account

> **Scope.** Phone-OTP authentication, JWT access/refresh lifecycle, session management, the current-user profile (`/me`), account deactivation/reactivation, and the client → provider capability upgrade. All endpoints obey the cross-cutting rules in [01-conventions.md](01-conventions.md) (envelope, errors, headers, rate limits). Roles per [personas-roles](../00-overview/02-personas-roles.md); account states and enums per [glossary §6](../00-overview/03-glossary.md); entities (`User`, `Session`, `ClientProfile`, `ProviderProfile`) per [data-model](../01-architecture/04-data-model.md). Flow narrative: [03-user-flows/02-authentication.md](../03-user-flows/02-authentication.md).

---

## 0. Auth model summary

- **One phone = one account.** `User.phone` is unique (E.164, KSA `+9665XXXXXXXX`). A returning user requesting an OTP re-authenticates the **same** account.
- **No passwords.** Identity is proven by a 6-digit OTP delivered via Unifonic SMS.
- **JWT pair on success.** `accessToken` (15 min) + `refreshToken` (30 days, one `Session` row, hashed).
- **Roles.** New accounts start `roles: ["client"]`, `activeRole: "client"`. A client becomes a provider via `POST /me/become-provider` (§9), which adds `"provider"` to `roles` and creates a `ProviderProfile`. `admin` accounts are invited out-of-band (admin console), not created here.
- **States** (`User.accountState`): `pending_otp` → `active` after first verify; `suspended` (admin); `deactivated` (self).

---

## 1. POST /auth/otp/request

Request an OTP for a phone number. Creates a `pending_otp` `User` on first sight; otherwise reuses the existing account.

| | |
|---|---|
| **Method · Path** | `POST /auth/otp/request` |
| **Auth** | Public (no Bearer). |
| **Rate limit** | 1 / 30 s and 5 / hour **per phone**; 20 / hour per IP. |

### Request body

```json
{
  "phone": "+966551234567",
  "channel": "sms"
}
```

| Field | Type | Validation |
|---|---|---|
| `phone` | string | **Required.** E.164 KSA: matches `^\+9665\d{8}$`. Normalized server-side (strips spaces, converts leading `0`/`966`). |
| `channel` | enum | Optional, default `sms`. `sms` only at MVP (`whatsapp` reserved). |

### Behavior / OTP rules

- Generates a **6-digit** numeric code, TTL **5 min** (`OTP_TTL=300`), stored hashed in Redis keyed by phone.
- A new request **before** the 30 s cooldown → `429 RATE_LIMITED` with `Retry-After`.
- A new request **within** TTL but after cooldown invalidates the prior code and issues a new one.
- Response **never reveals** whether the phone already had an account (anti-enumeration).

### Success `200 OK`

```json
{
  "success": true,
  "data": {
    "phone": "+966551234567",
    "otpSent": true,
    "expiresAt": "2026-06-29T14:10:00+03:00",
    "resendAvailableAt": "2026-06-29T14:05:30+03:00",
    "channel": "sms",
    "otpLength": 6
  }
}
```

### Errors

| HTTP | code | When |
|---|---|---|
| 422 | `VALIDATION_ERROR` | `phone` missing or not a valid `+9665…` number. |
| 429 | `RATE_LIMITED` | Cooldown not elapsed or hourly cap hit; `Retry-After` set. |
| 503 | `DEPENDENCY_UNAVAILABLE` | Unifonic (and Twilio fallback) failed to send; safe to retry. |

---

## 2. POST /auth/otp/verify

Verify the OTP and issue the JWT pair. Completes signup (first time) or login.

| | |
|---|---|
| **Method · Path** | `POST /auth/otp/verify` |
| **Auth** | Public (no Bearer). |
| **Rate limit** | Max **5 attempts** per active OTP (`OTP_MAX_ATTEMPTS=5`), then lockout. |

### Request body

```json
{
  "phone": "+966551234567",
  "code": "483921",
  "device": {
    "platform": "ios",
    "model": "iPhone 14",
    "pushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
  }
}
```

| Field | Type | Validation |
|---|---|---|
| `phone` | string | **Required.** Same E.164 KSA format as §1. |
| `code` | string | **Required.** Exactly 6 digits (`^\d{6}$`). |
| `device.platform` | enum | Optional. `ios` · `android` · `web`. Stored on `Session.userAgent`. |
| `device.model` | string | Optional. ≤ 64 chars. |
| `device.pushToken` | string | Optional. Expo push token for notifications. |

### OTP / lockout rules

- Wrong code increments an attempt counter. On the **5th** wrong attempt the phone is **locked for 15 min** → `423 OTP_LOCKED`; further requests during lockout also return `423`.
- Expired/consumed code → `410 OTP_EXPIRED`. Each code is single-use; a correct verify consumes it.
- First successful verify flips `accountState` `pending_otp → active` and ensures a `ClientProfile` + `Wallet` placeholder exist.
- A `suspended` account that verifies correctly → `403 ACCOUNT_SUSPENDED` (no tokens issued). A `deactivated` account is **reactivated** on successful verify (see §8).

### Success `200 OK`

```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfM2tmOWEyYnE3bSJ9.0pX...",
      "refreshToken": "rt_9c4e2a7f8b134d6e9a01c3f5d7b8e0a2",
      "tokenType": "Bearer",
      "accessTokenExpiresAt": "2026-06-29T14:20:00+03:00",
      "refreshTokenExpiresAt": "2026-07-29T14:05:00+03:00"
    },
    "isNewUser": true,
    "user": {
      "id": "usr_3kf9a2bq7m",
      "phone": "+966551234567",
      "fullName": null,
      "avatarUrl": null,
      "roles": ["client"],
      "activeRole": "client",
      "accountState": "active",
      "locale": "ar-SA"
    }
  }
}
```

### Errors

| HTTP | code | When |
|---|---|---|
| 422 | `VALIDATION_ERROR` | `phone`/`code` missing or wrong format. |
| 401 | `OTP_INVALID` | Code does not match the active OTP (attempts remain). |
| 410 | `OTP_EXPIRED` | No active OTP, expired, or already consumed. |
| 423 | `OTP_LOCKED` | Attempt cap reached; locked 15 min. `Retry-After` set. |
| 403 | `ACCOUNT_SUSPENDED` | Account is `suspended`; contact support. |

---

## 3. POST /auth/refresh

Exchange a valid refresh token for a new access token. **Rotates** the refresh token.

| | |
|---|---|
| **Method · Path** | `POST /auth/refresh` |
| **Auth** | Refresh token in body (no access Bearer required). |

### Request body

```json
{ "refreshToken": "rt_9c4e2a7f8b134d6e9a01c3f5d7b8e0a2" }
```

| Field | Type | Validation |
|---|---|---|
| `refreshToken` | string | **Required.** Opaque token previously issued. |

### Behavior

- Looks up the matching `Session` by `refreshTokenHash`, checks not expired and `revokedAt == null`.
- On success: issues a new access token **and** a new refresh token, sets `Session.refreshTokenHash` to the new value (rotation). The presented token is now invalid.
- **Reuse detection:** presenting an already-rotated/revoked token → `401 REFRESH_TOKEN_REUSED` and **all** of the user's sessions are revoked (forces full re-login).

### Success `200 OK`

```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfM2tmOWEyYnE3bSJ9.7Qa...",
      "refreshToken": "rt_2f7b9e0a3c4d5e6f8091a2b3c4d5e6f7",
      "tokenType": "Bearer",
      "accessTokenExpiresAt": "2026-06-29T14:35:00+03:00",
      "refreshTokenExpiresAt": "2026-07-29T14:20:00+03:00"
    }
  }
}
```

### Errors

| HTTP | code | When |
|---|---|---|
| 422 | `VALIDATION_ERROR` | `refreshToken` missing. |
| 401 | `REFRESH_TOKEN_INVALID` | Unknown, expired, or revoked token. |
| 401 | `REFRESH_TOKEN_REUSED` | Rotated token replayed; all sessions revoked. |
| 403 | `ACCOUNT_NOT_ACTIVE` | Account became `suspended`/`deactivated` since issue. |

---

## 4. POST /auth/logout

Revoke the current session (the refresh token tied to the access token's `sid`).

| | |
|---|---|
| **Method · Path** | `POST /auth/logout` |
| **Auth** | Bearer (any role). |

### Request body

```json
{ "allSessions": false }
```

| Field | Type | Validation |
|---|---|---|
| `allSessions` | boolean | Optional, default `false`. `true` revokes **all** of the user's sessions (log out everywhere). |

### Behavior

- Sets `revokedAt` on the current `Session` (or all sessions when `allSessions: true`). The access token remains valid until its 15-min expiry by design; clients must discard tokens immediately.

### Success `204 No Content`

(No body.)

### Errors

| HTTP | code | When |
|---|---|---|
| 401 | `UNAUTHORIZED` | Missing/invalid access token. |

---

## 5. GET /me

Return the authenticated user with role-appropriate profile sub-objects.

| | |
|---|---|
| **Method · Path** | `GET /me` |
| **Auth** | Bearer (any role). |

### Success `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "usr_3kf9a2bq7m",
    "phone": "+966551234567",
    "fullName": "ريم العتيبي",
    "avatarUrl": "avatars/usr_3kf9a2bq7m/a1.jpg",
    "roles": ["client", "provider"],
    "activeRole": "client",
    "accountState": "active",
    "locale": "ar-SA",
    "createdAt": "2026-05-10T09:12:00+03:00",
    "clientProfile": {
      "id": "cli_77aa12",
      "defaultAddressId": "adr_2bd991"
    },
    "providerProfile": {
      "id": "prv_5kd03x",
      "bio": "خبيرة مكياج سهرات ومناسبات",
      "tier": "mid",
      "profileComplete": true,
      "acceptingBookings": true,
      "ratingAvg": "4.80",
      "ratingCount": 132,
      "serviceRadiusKm": 15,
      "visibilityBoost": { "type": "gold", "status": "active", "expiresAt": "2026-07-04T23:59:59+03:00" }
    }
  }
}
```

- `clientProfile` is always present (every account is at least a client). `providerProfile` is present only when `roles` includes `provider`. `visibilityBoost` is `null` when no active package.

### Errors

| HTTP | code | When |
|---|---|---|
| 401 | `UNAUTHORIZED` | Missing/invalid access token. |

---

## 6. PATCH /me

Update mutable profile fields and/or switch the active role.

| | |
|---|---|
| **Method · Path** | `PATCH /me` |
| **Auth** | Bearer (any role). |

### Request body (all fields optional; at least one required)

```json
{
  "fullName": "ريم العتيبي",
  "avatarUrl": "avatars/usr_3kf9a2bq7m/a2.jpg",
  "locale": "ar-SA",
  "activeRole": "provider"
}
```

| Field | Type | Validation |
|---|---|---|
| `fullName` | string | 2–80 chars; Arabic/Latin letters, spaces. |
| `avatarUrl` | string | An S3 `key` from [`POST /uploads/sign`](01-conventions.md#11-file-upload-signed-url-pattern) with `purpose: avatar`, owned by caller. |
| `locale` | enum | `ar-SA` · `en`. |
| `activeRole` | enum | `client` · `provider`. Must be a role the account already holds, else `422`. |

### Success `200 OK`

Returns the updated `/me` object (same shape as §5).

### Errors

| HTTP | code | When |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Empty body, bad `fullName`, or `activeRole` not in `roles`. |
| 410 | `RESOURCE_GONE` | `avatarUrl` key not uploaded / presign expired. |
| 401 | `UNAUTHORIZED` | Missing/invalid token. |

---

## 7. POST /me/deactivate

User-initiated account deactivation (soft). Sets `accountState = deactivated`.

| | |
|---|---|
| **Method · Path** | `POST /me/deactivate` |
| **Auth** | Bearer (`client` or `provider`). |

### Request body

```json
{ "reason": "أخذ استراحة من العمل" }
```

| Field | Type | Validation |
|---|---|---|
| `reason` | string | Optional, ≤ 280 chars (stored for ops insight). |

### Behavior / guards

- **Blocked** if the account has any **active booking** (status in `pending`, `confirmed`, `on_the_way`, `in_progress`, `reschedule_requested`) → `409 ACTIVE_BOOKINGS_EXIST`.
- **Blocked** for a provider with a **positive withdrawable wallet balance** until withdrawn/settled → `409 WALLET_BALANCE_PENDING`.
- On success: sets `accountState = deactivated`, revokes **all** sessions, and removes the provider from search (no longer discoverable). History/audit is retained (no row deletion).

### Success `200 OK`

```json
{
  "success": true,
  "data": { "id": "usr_3kf9a2bq7m", "accountState": "deactivated", "deactivatedAt": "2026-06-29T14:40:00+03:00" }
}
```

### Errors

| HTTP | code | When |
|---|---|---|
| 409 | `ACTIVE_BOOKINGS_EXIST` | Caller has non-terminal bookings. |
| 409 | `WALLET_BALANCE_PENDING` | Provider has withdrawable balance. |
| 403 | `FORBIDDEN` | Admin accounts cannot self-deactivate here. |
| 401 | `UNAUTHORIZED` | Missing/invalid token. |

---

## 8. POST /me/reactivate

Reactivate a previously `deactivated` account. Two paths:

1. **Re-auth path (primary):** a deactivated user simply runs `POST /auth/otp/request` + `POST /auth/otp/verify`; a successful verify auto-reactivates (`deactivated → active`) and returns tokens. This endpoint is **not** needed in that flow.
2. **In-session path (this endpoint):** for a still-authenticated session whose account was deactivated, re-activate without a fresh OTP within the access-token window.

| | |
|---|---|
| **Method · Path** | `POST /me/reactivate` |
| **Auth** | Bearer (valid token issued before deactivation, or step-up OTP). |

### Request body

```json
{}
```

(No fields. The caller's identity comes from the token.)

### Behavior

- Sets `accountState = active`. A provider must still re-toggle `acceptingBookings` to return to search.
- A `suspended` account **cannot** self-reactivate → `403 ACCOUNT_SUSPENDED` (admin action required).

### Success `200 OK`

```json
{
  "success": true,
  "data": { "id": "usr_3kf9a2bq7m", "accountState": "active", "reactivatedAt": "2026-06-29T15:02:00+03:00" }
}
```

### Errors

| HTTP | code | When |
|---|---|---|
| 409 | `ALREADY_ACTIVE` | Account is already `active`. |
| 403 | `ACCOUNT_SUSPENDED` | Suspended accounts need admin reinstatement. |
| 401 | `UNAUTHORIZED` | Missing/invalid token. |

---

## 9. POST /me/become-provider

Upgrade a client account to **also** hold the provider capability. Idempotent for an already-provider account.

| | |
|---|---|
| **Method · Path** | `POST /me/become-provider` |
| **Auth** | Bearer (`client`). |

### Request body

```json
{
  "bio": "خبيرة مكياج سهرات ومناسبات في الرياض",
  "serviceRadiusKm": 15,
  "baseLocation": { "lat": 24.7136, "lng": 46.6753 }
}
```

| Field | Type | Validation |
|---|---|---|
| `bio` | string | Optional, ≤ 500 chars. |
| `serviceRadiusKm` | integer | Optional, default 15. 1–50. |
| `baseLocation.lat` | number | **Required.** −90..90; the provider's base point (PostGIS `geography(Point,4326)`). |
| `baseLocation.lng` | number | **Required.** −180..180. |

### Behavior

- Adds `"provider"` to `roles`, creates a `ProviderProfile` (`tier = beginner`, `profileComplete = false`, `acceptingBookings = false`), and writes the PostGIS `location`.
- Providers are **active immediately** — no approval queue ([personas-roles §4](../00-overview/02-personas-roles.md#4-account-lifecycle--states)). The account is **not yet discoverable**: it needs ≥1 service (price+duration) and ≥1 portfolio item (`profileComplete`) plus `acceptingBookings = true` — see [03-providers-services.md](03-providers-services.md).
- If `roles` already includes `provider` → returns the existing profile (`200`, idempotent), does not duplicate.

### Success `201 Created`

```json
{
  "success": true,
  "data": {
    "roles": ["client", "provider"],
    "activeRole": "provider",
    "providerProfile": {
      "id": "prv_5kd03x",
      "bio": "خبيرة مكياج سهرات ومناسبات في الرياض",
      "tier": "beginner",
      "profileComplete": false,
      "acceptingBookings": false,
      "serviceRadiusKm": 15,
      "ratingAvg": "0.00",
      "ratingCount": 0
    },
    "nextSteps": ["add_service", "add_portfolio_item", "set_availability", "toggle_accepting"]
  }
}
```

### Errors

| HTTP | code | When |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Missing/out-of-range `baseLocation` or bad `serviceRadiusKm`. |
| 403 | `ACCOUNT_NOT_ACTIVE` | Account not `active`. |
| 401 | `UNAUTHORIZED` | Missing/invalid token. |

---

## 10. Session model & security notes

- One `refreshToken` ⇒ one `Session` row (`refreshTokenHash`, `userAgent`, `ip`, `expiresAt`, `revokedAt`). Multiple devices ⇒ multiple concurrent sessions.
- **Listing/revoking sessions** is exposed in the account-security UI; the contract: `GET /me/sessions` (list active sessions) and `DELETE /me/sessions/:id` (revoke one) — both Bearer, owner-only, returning the standard envelope; a `404 NOT_FOUND` if the session id is not the caller's.
- Access tokens are stateless (validated by signature + `exp`); revocation is enforced at refresh time via the `Session` record. Effective max staleness after a revoke = the 15-min access TTL.
- All token strings in examples are illustrative.

See [03-providers-services.md](03-providers-services.md) for provider profile/services/availability and [04-bookings.md](04-bookings.md) for the booking lifecycle.
