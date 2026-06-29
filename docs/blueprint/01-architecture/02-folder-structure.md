# Folder Structure

> **Canonical.** This is the physical layout of the monorepo. The stack is locked in [01-tech-stack.md](01-tech-stack.md): pnpm + Turborepo, Expo Router (SDK 52), Next.js (App Router), NestJS + Prisma, shared `@app/contracts` / `@app/ui-tokens` packages. Every path below is real — create it as written.

## 1. Top-level monorepo

A single pnpm workspace orchestrated by Turborepo. `apps/*` are deployables; `packages/*` are shared libraries consumed by the apps.

```
nora-beauty/
├── apps/
│   ├── mobile/                 # React Native + Expo (client + provider, one app, role-switched)
│   ├── web/                    # Next.js — public, Google-indexable discovery + booking portal
│   ├── admin/                  # Next.js — operations dashboard (RBAC: super_admin/ops/finance/support)
│   └── api/                    # NestJS — single API serving mobile + web + admin
├── packages/
│   ├── contracts/              # @app/contracts — zod schemas + DTO types (one source of truth)
│   ├── ui-tokens/              # @app/ui-tokens — design tokens generated from design-system JSON
│   └── config/                 # @app/config — shared tsconfig, eslint, prettier, jest presets
├── docs/
│   └── blueprint/              # this documentation set
├── .github/
│   └── workflows/              # CI: lint, typecheck, test, EAS build, container deploy
├── .env.example                # mirrors §4 of tech-stack (never commit real secrets)
├── package.json                # workspace root scripts (turbo run …)
├── pnpm-workspace.yaml         # workspaces: apps/*, packages/*
├── turbo.json                  # pipeline: build, lint, typecheck, test, dev
└── tsconfig.base.json          # extended by every package via @app/config
```

`pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

`turbo.json` pipeline (abbreviated, illustrative):

```jsonc
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build":     { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
    "typecheck": { "dependsOn": ["^build"] },
    "lint":      {},
    "test":      { "dependsOn": ["^build"] },
    "dev":       { "cache": false, "persistent": true }
  }
}
```

---

## 2. `apps/mobile` — Expo Router file tree

The mobile app contains **both** the client (عميلة) and provider (مقدّمة خدمة) experiences in one binary; the active experience is chosen by the authenticated role (see [state-management → auth store](03-state-management.md#21-auth-store)). Admin is web-only.

Route groups (parenthesized folders) do **not** add path segments — they exist to attach a layout and gate access:

- `(auth)` — unauthenticated phone/OTP onboarding.
- `(client)` — bottom-tab shell for clients; redirects providers away.
- `(provider)` — bottom-tab shell for providers; redirects clients away.
- `(modal)` — full-screen flows presented over either shell (booking wizard, chat, QR).

```
apps/mobile/
├── app/                                # Expo Router root (file = route)
│   ├── _layout.tsx                     # Root: providers (QueryClient, Zustand hydrate, i18n/RTL, theme)
│   ├── index.tsx                       # Boot gate → redirects to (auth) | (client) | (provider)
│   ├── +not-found.tsx
│   │
│   ├── (auth)/
│   │   ├── _layout.tsx                 # Stack; blocks if already authenticated
│   │   ├── welcome.tsx                 # Language + role intent (client / provider)
│   │   ├── phone.tsx                    # Enter phone → request OTP
│   │   ├── otp.tsx                      # Verify OTP (6 digits, 5m TTL)
│   │   └── complete-profile.tsx        # Minimal profile after first verify
│   │
│   ├── (client)/
│   │   ├── _layout.tsx                 # Tabs shell; guard: role === 'client'
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx             # Bottom tabs (RTL order)
│   │   │   ├── index.tsx               # الرئيسية — home / nearby providers
│   │   │   ├── explore.tsx             # استكشاف — categories + map search
│   │   │   ├── bookings.tsx            # حجوزاتي — booking list (active/past)
│   │   │   ├── messages.tsx            # المحادثات — conversation list
│   │   │   └── profile.tsx             # حسابي — profile, addresses, payment methods
│   │   ├── provider/
│   │   │   └── [providerId].tsx        # Provider detail: portfolio, services, ratings
│   │   ├── service/
│   │   │   └── [serviceId].tsx         # Service detail (price + duration + add-ons)
│   │   ├── addresses/
│   │   │   ├── index.tsx               # Saved addresses
│   │   │   └── edit.tsx                # Address picker (Google Maps)
│   │   └── reviews/
│   │       └── [bookingId].tsx         # Submit rating/review (post-completion)
│   │
│   ├── (provider)/
│   │   ├── _layout.tsx                 # Tabs shell; guard: role === 'provider'
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx               # لوحتي — dashboard / KPIs / "open for work" toggle
│   │   │   ├── requests.tsx            # الطلبات — incoming bookings (accept/reject)
│   │   │   ├── calendar.tsx            # التقويم — availability + scheduled jobs
│   │   │   ├── messages.tsx            # المحادثات
│   │   │   └── wallet.tsx              # المحفظة — balance, transactions, withdraw
│   │   ├── services/
│   │   │   ├── index.tsx               # My services list
│   │   │   └── edit.tsx                # Create/edit service (price + duration + add-ons)
│   │   ├── portfolio/
│   │   │   └── index.tsx               # Portfolio gallery management
│   │   ├── visibility/
│   │   │   └── index.tsx               # Buy/manage visibility package (silver/gold/platinum)
│   │   └── earnings/
│   │       └── index.tsx               # Earnings breakdown + commission tier
│   │
│   ├── (modal)/
│   │   ├── _layout.tsx                 # presentation: 'modal'; requires auth
│   │   ├── booking/
│   │   │   ├── [serviceId]/
│   │   │   │   ├── slot.tsx            # Step 1: date/time from availability
│   │   │   │   ├── address.tsx         # Step 2: choose address
│   │   │   │   ├── addons.tsx          # Step 3: add-ons (BookingItem)
│   │   │   │   ├── review.tsx          # Step 4: summary + policy
│   │   │   │   └── pay.tsx             # Step 5: Moyasar payment (escrow hold)
│   │   │   └── [bookingId]/
│   │   │       ├── index.tsx           # Booking detail + lifecycle actions
│   │   │       ├── reschedule.tsx      # Request reschedule
│   │   │       ├── cancel.tsx          # Cancel + refund policy preview
│   │   │       └── qr.tsx              # QR check-in (client scans / provider presents)
│   │   ├── chat/
│   │   │   └── [conversationId].tsx    # Realtime chat thread (text + image)
│   │   ├── support/
│   │   │   └── new.tsx                 # Open support ticket
│   │   └── complaint/
│   │       └── [bookingId].tsx         # File complaint/dispute on a booking
│   │
│   ├── +html.tsx                       # (web export head, RTL dir)
│   └── _sitemap.tsx
│
├── src/
│   ├── features/                       # Feature-first business code (NOT routes)
│   │   ├── auth/                       # hooks, components, api, types per feature
│   │   ├── providers/
│   │   ├── services/
│   │   ├── bookings/
│   │   ├── payments/
│   │   ├── wallet/
│   │   ├── chat/
│   │   ├── notifications/
│   │   ├── ratings/
│   │   └── support/
│   ├── components/                     # Shared, presentational, app-wide UI
│   │   ├── ui/                         # Primitives bound to @app/ui-tokens (Button, Text, Card)
│   │   └── layout/                     # Screen scaffolds, headers, RTL-aware containers
│   ├── stores/                         # Zustand stores (see state-management.md)
│   │   ├── auth.store.ts
│   │   ├── booking-draft.store.ts
│   │   └── preferences.store.ts        # locale + theme
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts               # fetch wrapper, base URL, auth header, refresh
│   │   │   └── socket.ts               # Socket.IO client + Query cache bridge
│   │   ├── query/
│   │   │   ├── client.ts               # QueryClient + defaults
│   │   │   └── keys.ts                 # query-key factory (single source of truth)
│   │   ├── i18n/                       # ar-SA (default) + en, RTL helpers
│   │   ├── maps/                       # Google Maps / location helpers
│   │   └── storage/                    # SecureStore (tokens) + MMKV/AsyncStorage cache
│   ├── hooks/                          # Cross-feature hooks (useDebounce, useRTL …)
│   └── theme/                          # Token → RN style mapping from @app/ui-tokens
│
├── assets/                             # fonts (Arabic+Latin), images, icons, splash
├── app.config.ts                       # Expo config (deep-link scheme: nora://, EAS project id)
├── eas.json                            # EAS Build profiles (development/preview/production)
├── metro.config.js                     # monorepo-aware resolver (watch packages/*)
├── babel.config.js
├── tsconfig.json                       # extends @app/config; path aliases (§5)
└── package.json
```

> **Route vs. logic split.** `app/` holds only thin route files that compose feature code. Real logic (hooks, API calls, components, types) lives in `src/features/<feature>/`. A route file should be small: layout + one or two feature components.

---

## 3. `apps/web` — Next.js public portal

SSR/SSG for Google-indexable discovery and booking (App Router, `next-intl` for `ar-SA` RTL default + `en`).

```
apps/web/
├── app/
│   ├── [locale]/                       # ar-SA (default, dir="rtl") | en
│   │   ├── layout.tsx                  # html lang/dir, fonts, providers
│   │   ├── page.tsx                    # Landing / hero / categories
│   │   ├── providers/
│   │   │   ├── page.tsx                # Provider search (SSR, filters, map)
│   │   │   └── [providerId]/
│   │   │       └── page.tsx            # Provider profile (SEO metadata, portfolio)
│   │   ├── services/
│   │   │   └── [categorySlug]/
│   │   │       └── page.tsx            # Category landing (indexable)
│   │   ├── booking/
│   │   │   └── [serviceId]/
│   │   │       └── page.tsx            # Web booking flow (auth-gated steps)
│   │   ├── account/
│   │   │   ├── page.tsx                # Profile
│   │   │   └── bookings/page.tsx
│   │   ├── auth/
│   │   │   └── page.tsx                # Phone + OTP (web)
│   │   ├── legal/
│   │   │   ├── terms/page.tsx
│   │   │   └── privacy/page.tsx
│   │   └── not-found.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   └── api/                            # Route handlers (proxy/OG image only — no business logic)
├── src/
│   ├── features/                       # Mirrors mobile feature split (providers, services, booking)
│   ├── components/
│   │   ├── ui/                         # shadcn/ui wrappers bound to @app/ui-tokens
│   │   └── layout/
│   ├── lib/
│   │   ├── api/                        # Server + client API helpers (shares @app/contracts)
│   │   ├── query/                      # TanStack Query (client components)
│   │   └── i18n/
│   └── styles/
│       └── globals.css                 # Tailwind layers + token CSS vars
├── messages/                           # ar.json, en.json
├── next.config.mjs
├── tailwind.config.ts                  # consumes @app/ui-tokens
├── tsconfig.json
└── package.json
```

---

## 4. `apps/admin` — Next.js dashboard

Authenticated SPA-in-Next for operations. RBAC sub-roles from [personas-roles](../00-overview/02-personas-roles.md#1-roles): `super_admin`, `ops`, `finance`, `support`. No public/SEO surface.

```
apps/admin/
├── app/
│   ├── layout.tsx                      # Shell: sidebar, auth guard, RBAC context
│   ├── login/page.tsx                  # Admin login (invited accounts)
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Authenticated layout + nav
│   │   ├── page.tsx                    # Overview: GMV, bookings, providers KPIs
│   │   ├── users/
│   │   │   ├── page.tsx                # Clients + providers (suspend/reactivate)
│   │   │   └── [userId]/page.tsx
│   │   ├── providers/
│   │   │   ├── page.tsx                # Moderate services/portfolio, tiers
│   │   │   └── [providerId]/page.tsx
│   │   ├── bookings/
│   │   │   ├── page.tsx                # All bookings + lifecycle override
│   │   │   └── [bookingId]/page.tsx
│   │   ├── payments/page.tsx           # Transactions, refunds (finance)
│   │   ├── payouts/page.tsx            # Withdrawal queue, approve/process (finance)
│   │   ├── commission/page.tsx         # Commission tiers config (super/finance)
│   │   ├── packages/page.tsx           # Visibility packages config
│   │   ├── points/page.tsx             # Sales points / redemptions
│   │   ├── complaints/page.tsx         # Complaints/disputes resolution (ops)
│   │   ├── support/page.tsx            # Support tickets (support role)
│   │   ├── broadcasts/page.tsx         # Promotional notifications (ops)
│   │   ├── reports/page.tsx            # Reports & analytics
│   │   └── audit/page.tsx              # AuditLog viewer (super_admin)
│   └── api/                            # Route handlers (server actions / proxy only)
├── src/
│   ├── features/                       # users, bookings, payouts, commission, complaints, …
│   ├── components/
│   │   ├── ui/                         # shadcn/ui + @app/ui-tokens
│   │   ├── data-table/                 # shared table, filters, pagination
│   │   └── charts/
│   ├── lib/
│   │   ├── api/
│   │   ├── query/
│   │   └── rbac/                       # role/permission guards mirroring API RBAC
│   └── styles/
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. `apps/api` — NestJS

Modular NestJS. One module per bounded context; modules map 1:1 to the **10 systems** (see [product-brief §5](../00-overview/01-product-brief.md#5-the-10-systems-client-requirements--mvp-mapping)). Each module follows the same internal shape so any module is predictable.

```
apps/api/
├── src/
│   ├── main.ts                         # bootstrap: /api/v1 prefix, pino, validation pipe, CORS
│   ├── app.module.ts                   # imports all feature modules
│   ├── common/
│   │   ├── guards/                     # JwtAuthGuard, RolesGuard (RBAC), OtpThrottleGuard
│   │   ├── interceptors/               # logging, response shape, transaction
│   │   ├── filters/                    # http-exception filter (uniform error body)
│   │   ├── decorators/                 # @CurrentUser, @Roles, @Public
│   │   └── pipes/                      # ZodValidationPipe (reuses @app/contracts)
│   ├── config/                         # typed env loader, config schema
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   ├── prisma.service.ts
│   │   └── schema.prisma               # see data-model.md
│   ├── modules/
│   │   ├── auth/                       # System 1 — phone OTP, JWT access+refresh, sessions
│   │   ├── users/                      # System 1 — User, ClientProfile, addresses, account state
│   │   ├── providers/                  # System 2 — ProviderProfile, tier, visibility flags
│   │   ├── services/                   # System 2 — categories, services (price+duration), portfolio
│   │   ├── bookings/                   # System 3 + 4 — lifecycle, reschedule, QR check-in
│   │   ├── payments/                   # System 5 — Moyasar hold/capture, refunds, invoices
│   │   ├── payouts/                    # System 5 — Wallet, transactions, withdrawals
│   │   ├── chat/                       # System 8 — Socket.IO gateway, conversations, media
│   │   ├── notifications/              # System 7 — push (Expo→FCM/APNs), reminders, broadcasts
│   │   ├── ratings/                    # System 6 — reviews tied to completed bookings, ranking
│   │   ├── complaints/                 # System 9 — complaints/disputes + support tickets
│   │   └── admin/                      # System 9 + 10 — RBAC ops, commission, packages, audit
│   ├── jobs/                           # BullMQ processors (reminders, payouts, package expiry)
│   └── realtime/                       # Socket.IO server config, auth middleware, rooms
├── test/                               # e2e (Supertest)
├── nest-cli.json
├── tsconfig.json
└── package.json
```

Each `modules/<name>/` follows this fixed internal structure:

```
modules/bookings/
├── bookings.module.ts
├── bookings.controller.ts              # HTTP routes (REST, /api/v1/bookings)
├── bookings.service.ts                 # business/use-case logic (≥70% coverage gate)
├── bookings.repository.ts              # Prisma access (optional thin wrapper)
├── dto/                                # request/response — import zod from @app/contracts
│   ├── create-booking.dto.ts
│   └── reschedule-booking.dto.ts
├── events/                             # domain events (booking.confirmed → notifications)
└── bookings.service.spec.ts            # unit tests
```

---

## 6. Shared packages

### 6.1 `packages/contracts` — `@app/contracts`

Single source of truth for request/response shapes. zod schemas + inferred TS types, mirroring [api-contracts](../05-api-contracts/01-conventions.md). Consumed by mobile, web, admin (client-side validation + types) **and** api (server-side `ZodValidationPipe`).

```
packages/contracts/
├── src/
│   ├── auth/                           # requestOtp, verifyOtp, refresh schemas
│   ├── users/
│   ├── providers/
│   ├── services/
│   ├── bookings/                       # incl. BookingStatus enum mirror
│   ├── payments/
│   ├── chat/
│   ├── ratings/
│   ├── complaints/
│   ├── common/                         # pagination, error envelope, geo point
│   └── index.ts                        # barrel re-export
├── tsconfig.json
└── package.json                        # name: "@app/contracts"
```

### 6.2 `packages/ui-tokens` — `@app/ui-tokens`

Design tokens generated from design-system JSON ([colors](../02-design-system/01-colors.md), [typography](../02-design-system/02-typography.md)). Emits platform targets: TS objects (RN), CSS variables (web/admin Tailwind).

```
packages/ui-tokens/
├── tokens/
│   ├── colors.json
│   ├── typography.json
│   └── spacing.json
├── src/
│   ├── colors.ts                       # generated
│   ├── typography.ts
│   ├── css/tokens.css                  # generated CSS vars (web)
│   └── index.ts
├── scripts/build-tokens.ts             # JSON → TS + CSS
├── tsconfig.json
└── package.json                        # name: "@app/ui-tokens"
```

### 6.3 `packages/config` — `@app/config`

Shared tooling presets so every app/package lints/types/tests identically.

```
packages/config/
├── tsconfig.base.json                  # extended by all tsconfig.json
├── eslint/index.js                     # shared ESLint flat config
├── prettier/index.js
├── jest/preset.js
└── package.json                        # name: "@app/config"
```

---

## 7. Naming conventions

| Artifact | Convention | Example |
|---|---|---|
| Route files (Expo Router / Next) | lowercase, framework-driven; dynamic segments `[param]`, groups `(group)` | `app/(client)/provider/[providerId].tsx` |
| React components | `PascalCase` file + named export | `ProviderCard.tsx` → `export function ProviderCard()` |
| UI primitives | `PascalCase` under `components/ui` | `Button.tsx`, `Text.tsx` |
| Hooks | `useXxx.ts`, camelCase | `useBookingDraft.ts`, `useNearbyProviders.ts` |
| Zustand stores | `<name>.store.ts`, export `useXxxStore` | `auth.store.ts` → `useAuthStore` |
| TanStack query keys | factory in `lib/query/keys.ts` | `queryKeys.providers.nearby(params)` |
| API feature folders (Nest) | singular-ish `kebab`/lowercase, one bounded context | `modules/bookings/` |
| Nest files | `<name>.<kind>.ts` | `bookings.service.ts`, `create-booking.dto.ts` |
| Nest classes | `PascalCase` + role suffix | `BookingsService`, `BookingsController` |
| zod schemas (contracts) | `camelCase` schema + `PascalCase` type | `createBookingSchema` / `CreateBooking` |
| Prisma models | `PascalCase` singular | `Booking`, `WalletTransaction` |
| DB tables | `snake_case` plural via `@@map` | `@@map("wallet_transactions")` |
| Enums (Prisma + contracts) | `PascalCase` name, `snake_case` members | `BookingStatus { on_the_way }` |
| Env vars | `SCREAMING_SNAKE_CASE` | `JWT_ACCESS_TTL` |
| Test files | colocated `.spec.ts` / `.test.tsx` | `bookings.service.spec.ts` |

**Feature-first rule.** Business code lives under `features/<feature>/` (mobile/web/admin) or `modules/<feature>/` (api), not scattered across global folders. Only truly cross-cutting, presentational, or infrastructural code lives in `components/`, `lib/`, `common/`.

---

## 8. Import-alias rules

Path aliases keep imports stable and prevent deep `../../../` chains. Aliases are declared in each app's `tsconfig.json` (extending `@app/config`) and resolved by Metro (mobile) / Next (web/admin) / Nest (`tsconfig-paths`).

| Alias | Resolves to | Scope |
|---|---|---|
| `@/*` | that app's `src/*` | within a single app |
| `@app/contracts` | `packages/contracts` | all apps |
| `@app/ui-tokens` | `packages/ui-tokens` | mobile, web, admin |
| `@app/config` | `packages/config` | tooling only |

Rules:

1. **Never** import across apps (`apps/web` must not import from `apps/mobile`). Share via `packages/*` only.
2. Cross-feature imports go through a feature's public barrel (`features/bookings/index.ts`), never deep into its internals.
3. Routes import from features (`@/features/...`); features may import from `@/components`, `@/lib`, `@/hooks` but **not** from routes.
4. `@app/contracts` is the only place request/response types are defined; do not redeclare DTO shapes per app.
5. Tokens are consumed exclusively via `@app/ui-tokens` (no hard-coded hex/spacing in components).

Example mobile `tsconfig.json` paths:

```jsonc
{
  "extends": "@app/config/tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@app/contracts": ["../../packages/contracts/src"],
      "@app/ui-tokens": ["../../packages/ui-tokens/src"]
    }
  }
}
```

---

## 9. Where feature code lives — quick map

| You are building… | Mobile | Web/Admin | API |
|---|---|---|---|
| A screen/page | `app/...` route + `src/features/<f>` | `app/[locale]/...` + `src/features/<f>` | n/a |
| Server data fetch | `features/<f>/api` + `lib/query` | same | `modules/<f>/*.service.ts` |
| A request/response type | — (import from contracts) | — (import) | `dto/` re-exporting `@app/contracts` |
| UI state (draft, session) | `src/stores/*.store.ts` | local store/component state | n/a |
| A reusable button/card | `components/ui` | `components/ui` | n/a |
| A background job | n/a | n/a | `src/jobs` |
| Realtime chat plumbing | `lib/api/socket.ts` + `features/chat` | (web: same) | `modules/chat` + `src/realtime` |

See [state-management.md](03-state-management.md) for how stores and Query cache interact, and [data-model.md](04-data-model.md) for the entities each API module owns.
