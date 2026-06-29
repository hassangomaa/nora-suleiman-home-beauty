# User Flow — Onboarding

> **Scope.** First-launch experience up to the auth handoff: splash → language → onboarding carousel → role choice → into [authentication](02-authentication.md). Also covers returning-user skip logic, deep-link entry, and the cold/warm-start decision tree.
>
> **Roles touched.** Pre-auth visitor (not yet `client` / `provider` / `admin` — see [personas-roles](../00-overview/02-personas-roles.md)). No account exists until OTP verification in the [authentication flow](02-authentication.md).
>
> **Gap traceability.** Establishes the `become-provider` entry that feeds the instant-onboarding requirement (no approval queue, per [product-brief](../00-overview/01-product-brief.md) §3.1). Surfaces saved-locale persistence that supports **G12** (client profile detail) downstream.

---

## 1. Entry points

| Entry | Trigger | Lands on |
|---|---|---|
| Cold start (first install) | App icon tap, no persisted state | `SHR-01` Splash → `SHR-02` Language Select |
| Warm start (returning, signed out) | App icon tap, locale persisted, no valid session | `SHR-01` Splash → `SHR-04` Auth (skips carousel) |
| Warm start (returning, signed in) | App icon tap, valid refresh token | `SHR-01` Splash → role home (`CLI-10` / `PRV-10`) |
| Deep link (unauthenticated) | `nora://booking/{id}`, `https://nora-beauty.app/p/{slug}`, QR scan | `SHR-01` Splash → intent stored → routed after auth |
| Deep link (authenticated) | same | `SHR-01` Splash → target screen directly |
| Push-notification tap | Expo Notifications payload with `route` | resolved like a deep link |

Locale (`ar-SA` default / `en`) and the `onboarding_seen` flag are persisted on-device (Expo `SecureStore` for tokens, `AsyncStorage` for non-secret flags). Locale defaults to `ar-SA` (RTL) per [tech-stack](../01-architecture/01-tech-stack.md) §6.

---

## 2. Screens involved

| ID | Name | Purpose |
|---|---|---|
| `SHR-01` | Splash | Brand splash; bootstraps config, resolves session, decides route. |
| `SHR-02` | Language Select | Choose `ar` (RTL) or `en` (LTR); first-run only. |
| `SHR-03` | Onboarding Carousel | 3-slide value-prop carousel (trust, home service, escrow safety). |
| `SHR-03b` | Role Choice | "I'm looking for a service" (client) vs "I offer services" (become-provider). |
| `SHR-04` | Auth — Phone Entry | Handoff target; documented in [authentication](02-authentication.md). |
| `CLI-10` | Client Home | Authenticated client landing (discover). |
| `PRV-10` | Provider Home | Authenticated provider dashboard. |

---

## 3. APIs called

| Step | Name | Method · Path | Auth | Notes |
|---|---|---|---|---|
| Bootstrap | `GET /config/bootstrap` | `GET /api/v1/config/bootstrap` | none | Returns min-app-version, force-update flag, feature flags, locales, ToS/privacy URLs. |
| Session probe | `POST /auth/refresh` | `POST /api/v1/auth/refresh` | refresh token (cookie/secure store) | Validates persisted refresh token; issues new access token. See [02-auth](../05-api-contracts/02-auth.md). |
| Locale persist | (local) | — | — | Written to `AsyncStorage`; echoed to server on first authed call via `Accept-Language`. |
| Deep-link resolve | `GET /links/resolve` | `GET /api/v1/links/resolve?u={url}` | optional | Normalizes universal link / `nora://` URI into an in-app route + entity preview. |

> Endpoint conventions (base URL, `Accept-Language`, error envelope) per [05-api-contracts/01-conventions.md](../05-api-contracts/01-conventions.md). Bootstrap and refresh run in parallel on `SHR-01`.

---

## 4. Happy path — first-time client

1. User taps the app icon → `SHR-01` **Splash** renders the brand mark.
2. Splash fires `GET /config/bootstrap` and `POST /auth/refresh` in parallel.
3. `bootstrap` returns OK and reports app version ≥ `min_version`; no force-update.
4. `refresh` returns `401` (no/invalid token) → visitor is unauthenticated.
5. `onboarding_seen` flag is **absent** → route to `SHR-02` **Language Select**.
6. User selects **العربية** → app sets locale `ar-SA`, applies RTL layout direction, persists locale.
7. Route to `SHR-03` **Onboarding Carousel**; user swipes through 3 slides (or taps **تخطّي / Skip**).
8. On last slide / Skip → set `onboarding_seen = true`; route to `SHR-03b` **Role Choice**.
9. User taps **أبحث عن خدمة (I'm looking for a service)** → store `intended_role = client`.
10. Route to `SHR-04` **Auth — Phone Entry** with `intended_role=client`. Onboarding ends; control passes to the [authentication flow](02-authentication.md).

### 4.1 Happy path — become-provider variant

Steps 1–8 identical. At step 9 the user taps **أقدّم خدمات (I offer services)** → store `intended_role = provider` → route to `SHR-04` with `intended_role=provider`. After OTP verification, a brand-new account gains the **provider capability** and is sent to provider profile setup (see [provider flow](04-provider.md) §3). A client may later also become a provider — it is the *same account* gaining a capability, never a second account (per [personas-roles](../00-overview/02-personas-roles.md) §1).

---

## 5. Returning-user skip logic

The decision happens entirely on `SHR-01` after `bootstrap` + `refresh` resolve.

| `onboarding_seen` | Refresh result | Route |
|:--:|---|---|
| false | any | `SHR-02` Language Select (full first-run) |
| true | `401` / no token | `SHR-04` Auth — Phone Entry (skip carousel + role if a prior `intended_role` is cached; otherwise show `SHR-03b` Role Choice first) |
| true | `200` + role `client` | `CLI-10` Client Home |
| true | `200` + role `provider` | `PRV-10` Provider Home |
| true | `200` + dual-capability | last-used role home (persisted `active_role`); role switch lives in settings (`SHR-30`) |

Re-running the carousel is never forced. Language can always be changed later in Settings (`SHR-30`), which re-applies layout direction at runtime.

---

## 6. Deep-link & push entry

1. OS opens the app with a URL (universal link, `nora://` scheme, or QR payload) or a push `route`.
2. `SHR-01` captures the target as a **pending intent** before routing.
3. Bootstrap + refresh resolve as in §4.
4. **If authenticated and role authorized** → navigate directly to the target (e.g. `CLI-22` Booking Detail, `PRV-21` Booking Detail, `p/{slug}` → `CLI-12` Provider Profile).
5. **If unauthenticated** → store pending intent, route through minimal auth (skip carousel/role if inferable), then resume the intent post-verification.
6. **If role mismatch** (e.g. client opens a provider-only deep link) → show `SHR-99` Not-Authorized sheet and fall back to role home.
7. **QR check-in deep link** (`nora://checkin/{bookingId}`) is provider-presented / client-scanned — it requires an authenticated session and an active booking; otherwise it shows an explanatory error and routes to the relevant booking detail. (See [client-booking](03-client-booking.md) §9 and [provider](04-provider.md) §7.)

---

## 7. Decision branches & edge cases

| Branch / edge | Condition | Handling |
|---|---|---|
| Force update | `bootstrap.force_update = true` or version < `min_version` | `SHR-01` shows blocking update sheet with store link; no further routing. |
| Bootstrap network fail | `GET /config/bootstrap` errors/timeouts | Splash shows retry state with cached config fallback; if no cache, offline screen with **إعادة المحاولة / Retry**. |
| Refresh ambiguous error | `refresh` returns `5xx` (not `401`) | Treat as unauthenticated *without* clearing the stored token; allow retry so a valid session is not destroyed by a transient server error. |
| Carousel back-swipe past slide 1 | User swipes back from `SHR-03` slide 1 | Returns to `SHR-02` Language Select. |
| Role choice deferred | User backgrounds app on `SHR-03b` | `intended_role` not set; next launch re-shows `SHR-03b` (carousel skipped since `onboarding_seen=true`). |
| Locale change mid-onboarding | User changes language on `SHR-02` after a back-swipe | Layout direction re-applied immediately; carousel re-renders in the new locale. |
| Deep link to deleted entity | `links/resolve` returns `404` | Route to role home with a non-blocking toast: "هذا الرابط لم يعد متاحًا / This link is no longer available." |
| Suspended/deactivated account | `refresh` succeeds but account state is `suspended`/`deactivated` | Route to the account-state screen in [authentication](02-authentication.md) §10, not to a role home. |

---

## 8. ASCII flow diagram

```
                         ┌──────────────────────┐
            App launch ─▶│      SHR-01 Splash    │
                         │  GET /config/bootstrap│
                         │  POST /auth/refresh   │
                         └───────────┬───────────┘
                                     │
              ┌──────────────────────┼───────────────────────────┐
              ▼                      ▼                           ▼
     force_update=true      refresh = 200 (valid)        refresh = 401 / none
              │                      │                           │
              ▼            ┌─────────┴─────────┐                 ▼
    ┌──────────────┐       ▼                   ▼        ┌──────────────────┐
    │ Update sheet │   role=client       role=provider  │ onboarding_seen? │
    │  (blocking)  │       │                   │        └────────┬─────────┘
    └──────────────┘       ▼                   ▼            no   │   yes
                     ┌───────────┐      ┌────────────┐  ────────┼────────────
                     │ CLI-10    │      │ PRV-10     │     ▼            ▼
                     │ Client    │      │ Provider   │  SHR-02      (cached
                     │ Home      │      │ Home       │  Language     intended_role?)
                     └───────────┘      └────────────┘  Select       │   │
                                                           │      no │   │ yes
                                                           ▼         ▼   ▼
                                                    SHR-03 Carousel  SHR-03b  SHR-04
                                                           │         Role     Auth
                                                  Skip/last│         Choice   (Phone)
                                                           ▼         │
                                                    SHR-03b Role ◀───┘
                                                    Choice
                                                   ┌───┴────┐
                                          client ◀─┘        └─▶ provider
                                                   │        │
                                                   ▼        ▼
                                              SHR-04 Auth (intended_role)
                                                   │
                                                   ▼
                                         ── continues in 02-authentication.md ──

  Deep link / push ─▶ SHR-01 (store pending intent) ─▶ [auth if needed] ─▶ target screen
```

---

## 9. Hand-off

This flow always terminates by routing to `SHR-04` (Auth — Phone Entry) with an `intended_role`, or directly to a role home for valid sessions. Continue in **[02-authentication.md](02-authentication.md)**.
