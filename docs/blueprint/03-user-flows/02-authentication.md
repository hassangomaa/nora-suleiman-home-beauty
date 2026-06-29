# User Flow — Authentication

> **Scope.** Phone + OTP authentication end-to-end: phone entry (`+966`) → OTP send → OTP verify (6-digit, resend timer, max attempts, lockout) → new-vs-existing account → session creation (JWT access + refresh) → silent token refresh → re-authentication → logout → account deactivation / reactivation.
>
> **Roles.** `client` / `provider` register via phone + OTP; `admin` is invited (web dashboard, out of mobile scope). See [personas-roles](../00-overview/02-personas-roles.md) §3.
>
> **Stack.** OTP via **Unifonic** (Twilio fallback), JWT access+refresh, Redis-backed rate limiting & OTP store, per [tech-stack](../01-architecture/01-tech-stack.md). No password exists at MVP.
>
> **Entry point.** Reached from [onboarding](01-onboarding.md) `SHR-03b` with an `intended_role`, from a deep-link that required auth, or from a re-auth prompt.

---

## 1. Canonical security constants

From [tech-stack](../01-architecture/01-tech-stack.md) §4 environment variables — never hardcode:

| Constant | Value | Meaning |
|---|---|---|
| `OTP_TTL` | `300` s (5 min) | OTP validity window. |
| `OTP_MAX_ATTEMPTS` | `5` | Wrong-code attempts per OTP before invalidation. |
| `JWT_ACCESS_TTL` | `900` s (15 min) | Access-token lifetime. |
| `JWT_REFRESH_TTL` | `2592000` s (30 d) | Refresh-token lifetime. |

Additional derived policy (documented here, configured in API):

| Policy | Value | Enforced at |
|---|---|---|
| Resend cooldown | 60 s (then 60 → 120 → 300 backoff) | Client timer + server rate limit |
| OTP sends per phone | 5 / hour, 10 / day | Redis sliding window |
| Verify attempts per phone | tracked alongside `OTP_MAX_ATTEMPTS` | Redis counter |
| Lockout on exceed | 15 min phone-level lockout | Redis TTL key |
| OTP length | 6 digits, numeric | Generator |
| OTP delivery | SMS (Unifonic sender `NoraBeauty`); fallback Twilio | SMS service |

---

## 2. Screens involved

| ID | Name | Purpose |
|---|---|---|
| `SHR-04` | Auth — Phone Entry | `+966` country-locked phone input; ToS/privacy consent. |
| `SHR-05` | Auth — OTP Verify | 6-digit code entry, resend timer, attempt counter. |
| `SHR-06` | Auth — New-Account Intro | Shown only for first-time numbers; confirms `intended_role`. |
| `SHR-07` | Re-Auth Sheet | Step-up verification for sensitive actions (withdrawal, deactivate). |
| `SHR-08` | Account Deactivated | Self-service deactivate confirmation + reactivation entry. |
| `SHR-09` | Account Suspended | Read-only notice for admin-suspended accounts + support link. |
| `SHR-30` | Settings | Hosts logout, deactivate, language, role switch. |

---

## 3. APIs called

| Step | Name | Method · Path | Auth | Body / notes |
|---|---|---|---|---|
| Send OTP | `POST /auth/otp/request` | `POST /api/v1/auth/otp/request` | none | `{ phone: "+9665XXXXXXXX", intended_role }` → `{ request_id, expires_in, resend_in, channel }` |
| Verify OTP | `POST /auth/otp/verify` | `POST /api/v1/auth/otp/verify` | none | `{ request_id, code }` → `{ access_token, refresh_token, is_new, user }` |
| Resend OTP | `POST /auth/otp/resend` | `POST /api/v1/auth/otp/resend` | none | `{ request_id }` → new `expires_in`, `resend_in` |
| Refresh | `POST /auth/refresh` | `POST /api/v1/auth/refresh` | refresh token | `{ refresh_token }` → new `access_token` (+ rotated `refresh_token`) |
| Logout | `POST /auth/logout` | `POST /api/v1/auth/logout` | access token | revokes current refresh token (one device) |
| Logout-all | `POST /auth/logout-all` | `POST /api/v1/auth/logout-all` | access token | revokes all refresh tokens (all devices) |
| Step-up | `POST /auth/step-up` | `POST /api/v1/auth/step-up` | access token | issues short-lived `step_up_token` after OTP re-verify |
| Deactivate | `POST /account/deactivate` | `POST /api/v1/account/deactivate` | access + step-up | sets account state `deactivated` |
| Reactivate | `POST /account/reactivate` | `POST /api/v1/account/reactivate` | none (post-OTP) | restores `active` if previously `deactivated` |

> Full schemas in [05-api-contracts/02-auth.md](../05-api-contracts/02-auth.md). Error envelope per [01-conventions.md](../05-api-contracts/01-conventions.md).

---

## 4. Happy path

1. Arrive at `SHR-04` **Phone Entry** with `intended_role` (from [onboarding](01-onboarding.md)).
2. Country code is fixed to **`+966`** (KSA-only at MVP); user types the local number. Input is masked/normalized to E.164 (`+9665XXXXXXXX`).
3. User checks the ToS + privacy consent and taps **متابعة / Continue**.
4. App calls `POST /auth/otp/request` with `{ phone, intended_role }`.
5. Server generates a 6-digit OTP, stores `request_id → {phone, code_hash, attempts:0}` in Redis with TTL `OTP_TTL`, and dispatches SMS via Unifonic. Responds `{ request_id, expires_in:300, resend_in:60, channel:"sms" }`.
6. Route to `SHR-05` **OTP Verify**; the resend timer starts at `resend_in` (60 s), and a 5:00 countdown reflects `expires_in`.
7. User enters the 6-digit code (auto-read via SMS autofill where available). App calls `POST /auth/otp/verify` with `{ request_id, code }`.
8. Server validates: not expired, attempts < `OTP_MAX_ATTEMPTS`, hash matches. On success it consumes the OTP (single-use), creates or loads the account, and mints **access** (`JWT_ACCESS_TTL`) + **refresh** (`JWT_REFRESH_TTL`) tokens.
9. Response `{ access_token, refresh_token, is_new, user:{ id, role, account_state, capabilities } }`. Tokens are stored in Expo `SecureStore`.
10. **Branch on `is_new`:**
    - `is_new = true` → route to `SHR-06` **New-Account Intro**, then to role setup (client → `CLI-10` Home, or first-time saved-address prompt; provider → provider profile setup per [provider](04-provider.md) §3).
    - `is_new = false` → route directly to the role home (`CLI-10` / `PRV-10`) or resume the stored deep-link intent from [onboarding](01-onboarding.md) §6.

---

## 5. New vs existing account

A single phone number maps to exactly one account (per [personas-roles](../00-overview/02-personas-roles.md) §1). The server decides at verify time:

| Situation | `is_new` | Behavior |
|---|:--:|---|
| Phone never seen | `true` | Create account with `intended_role`; account state set straight to `active` (providers are active immediately — no approval queue). |
| Phone exists, same role | `false` | Sign in; ignore `intended_role`. |
| Phone exists, but `intended_role=provider` on a client-only account | `false` | Sign in **and** add provider capability; route to provider profile setup. Same account gains a capability — no second account is created. |
| Phone exists, state `deactivated` | `false` | Trigger reactivation flow (§10) instead of a normal sign-in. |
| Phone exists, state `suspended` | `false` | Block; route to `SHR-09` (§10). |

The `pending_otp` account state from [personas-roles](../00-overview/02-personas-roles.md) §4 exists transiently between request and successful verify; it is never a long-lived persisted account at MVP because account rows are created on verify, not on request.

---

## 6. Session creation & token refresh

- **Storage.** `access_token` + `refresh_token` in Expo `SecureStore` (Keychain/Keystore). Never in `AsyncStorage`.
- **Access use.** Every authed request sends `Authorization: Bearer {access_token}`.
- **Silent refresh.** A TanStack Query / Axios interceptor catches `401 token_expired`, calls `POST /auth/refresh` once, retries the original request. Concurrent 401s are de-duplicated to a single in-flight refresh ([state-management](../01-architecture/03-state-management.md)).
- **Rotation.** Refresh issues a new access token and **rotates** the refresh token; the old refresh token is revoked server-side (reuse detection → force full re-auth and `logout-all`).
- **Proactive refresh.** On app foreground, if the access token has < 60 s left, refresh before issuing requests.

```
request ──▶ 200 ──────────────────────────────▶ done
   │
   └─▶ 401 token_expired ──▶ POST /auth/refresh
                                 │
                   ┌─────────────┴─────────────┐
                   ▼                           ▼
              200 (new pair) ──▶ retry      4xx (refresh invalid)
                   original request           │
                                              ▼
                                     clear tokens ──▶ SHR-04 (re-login)
```

---

## 7. Re-authentication (step-up)

Sensitive actions require fresh proof of phone ownership even with a valid session:

- **Triggers:** withdrawal request ([payments-payouts](05-payments-payouts.md) §5; [provider](04-provider.md) §9), account deactivation, changing the phone number (Phase 2).
- **Flow:** action → `SHR-07` Re-Auth Sheet → `POST /auth/otp/request` (same phone) → OTP verify → `POST /auth/step-up` issues a short-lived `step_up_token` (~5 min) → the sensitive endpoint requires that token.
- Step-up does **not** mint new session tokens; it only proves liveness for the gated action.

---

## 8. Logout

| Action | Endpoint | Effect |
|---|---|---|
| Logout (this device) | `POST /auth/logout` | Revokes the current refresh token; clears `SecureStore`; routes to `SHR-04`. |
| Logout all devices | `POST /auth/logout-all` | Revokes every refresh token for the account (also auto-invoked on refresh-token reuse detection). |

After logout, `onboarding_seen` stays `true` so the user returns to `SHR-04` (not the carousel) per [onboarding](01-onboarding.md) §5.

---

## 9. Unhappy paths & edge cases

### 9.1 OTP failures

| Case | Server response | UX on `SHR-05` |
|---|---|---|
| Wrong code (attempts left) | `422 otp_invalid` + `attempts_left` | Inline error "رمز غير صحيح / Incorrect code"; shake input; show remaining attempts. |
| Wrong code, attempts exhausted | `429 otp_attempts_exceeded` | Invalidate OTP; force **Resend**; if lockout reached, show lockout state. |
| Expired OTP | `410 otp_expired` | "انتهت صلاحية الرمز / Code expired"; enable **Resend** immediately. |
| Resend before cooldown | `429 resend_too_soon` + `resend_in` | Resend button disabled with live countdown; ignore taps. |
| Send rate exceeded (per phone) | `429 otp_rate_limited` + `retry_after` | "حاولي لاحقًا / Try again later" with `retry_after`; back to `SHR-04`. |
| Phone lockout (15 min) | `423 phone_locked` + `retry_after` | Lockout banner with countdown; **Continue** disabled; support link. |
| SMS delivery failure (Unifonic) | server retries → Twilio fallback | If both fail, `502 otp_delivery_failed`; offer retry; surface support. |
| Invalid phone format | `400 invalid_phone` | Inline field error before request is sent (client-side E.164 validation first). |
| Non-`+966` number | blocked client-side | Country selector locked to KSA at MVP ([product-brief](../00-overview/01-product-brief.md) §9). |

### 9.2 Session / account edge cases

| Case | Handling |
|---|---|
| Refresh token invalid/rotated-reuse | `401 refresh_invalid` → clear tokens, `logout-all`, route `SHR-04`. |
| Access token tampered | `401 token_invalid` → no silent refresh; force re-login. |
| Clock skew | Server is source of truth for expiry; client tolerates ±60 s. |
| App killed mid-verify | `request_id` stored in memory only; on relaunch, restart from `SHR-04` (request_id not persisted for security). |
| Account suspended after login | Next API call returns `403 account_suspended` → route `SHR-09`. |
| Account deactivated on another device | Refresh returns `409 account_deactivated` → route `SHR-08` reactivation. |
| Step-up token expired | `401 step_up_required` → re-open `SHR-07`. |

---

## 10. Account deactivation & reactivation

**Deactivation (self-service):**
1. Settings `SHR-30` → "إلغاء تنشيط الحساب / Deactivate account".
2. Requires step-up (§7) → `SHR-07` OTP re-verify.
3. App calls `POST /account/deactivate` with `step_up_token`.
4. Guard: a provider with an in-progress booking or a pending withdrawal is blocked (`409 has_active_obligations`) until resolved — see [payments-payouts](05-payments-payouts.md). A client with an upcoming paid booking is blocked until it is cancelled/completed.
5. On success: account state → `deactivated`, provider becomes non-discoverable, sessions revoked (`logout-all`), route to `SHR-08`.

**Reactivation:**
1. A user with a `deactivated` account simply re-authenticates from `SHR-04` (phone + OTP).
2. At verify, the server detects `deactivated` and calls the reactivation path: `POST /account/reactivate`.
3. State → `active`; provider discoverability and prior data are restored; a fresh session is minted.

**Suspended (admin-imposed):** Not user-reversible. `SHR-09` shows the reason summary and a support-ticket link; transactions are blocked while `suspended` ([personas-roles](../00-overview/02-personas-roles.md) §4).

---

## 11. ASCII flow diagram

```
 from onboarding (intended_role)
            │
            ▼
   ┌─────────────────┐
   │ SHR-04 Phone     │  +966 only · ToS consent
   │ POST /otp/request│
   └────────┬─────────┘
            │ request_id, expires_in=300, resend_in=60
            ▼
   ┌─────────────────────────────┐      resend (cooldown ok)
   │ SHR-05 OTP Verify (6 digit) │◀──── POST /otp/resend
   │ POST /otp/verify            │
   └───────┬──────────┬──────────┘
   success │          │ failure
           │          ├─ wrong (attempts<5) ─▶ inline error, stay
           │          ├─ wrong (==5)        ─▶ 429 ─▶ force resend / lockout
           │          ├─ expired (410)      ─▶ enable resend
           │          └─ phone locked (423) ─▶ lockout banner (15m)
           ▼
   ┌─────────────────┐  mint access(15m)+refresh(30d) → SecureStore
   │ is_new ?         │
   └───┬─────────┬────┘
 true  │         │ false
       ▼         ▼
 SHR-06 New   ┌── state? ──┐
 Account Intro│            │
       │      active   deactivated   suspended
       ▼        │            │           │
 role setup     ▼            ▼           ▼
 (CLI-10 /   role home   reactivate   SHR-09
  provider   (CLI-10 /   (SHR-08)     Suspended
  setup)      PRV-10)

 sensitive action ─▶ SHR-07 Re-Auth ─▶ /otp/verify ─▶ /auth/step-up ─▶ gated endpoint
 logout ─▶ /auth/logout ─▶ clear tokens ─▶ SHR-04
```

---

## 12. Hand-off

A verified session routes clients into the [client booking flow](03-client-booking.md) and providers into the [provider flow](04-provider.md). Money-gated actions (withdrawal) re-enter §7 step-up and continue in [payments-payouts](05-payments-payouts.md).
