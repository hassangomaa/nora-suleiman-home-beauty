# Tech Stack

> **Canonical.** All implementation must use these technologies and versions. Changes require an SRS amendment. This is the recommended default stack to be confirmed at SRS sign-off.

## 1. Summary

| Layer | Technology | Version (min) | Why |
|---|---|---|---|
| Mobile (client + provider) | React Native + **Expo** (managed) | SDK 52 / RN 0.76 | Single codebase iOS+Android, OTA updates, strong RTL support, Claude-friendly. |
| Language (all JS) | **TypeScript** | 5.4+ | Type safety across mobile/web/API shared contracts. |
| Mobile navigation | **Expo Router** | 4.x | File-based routing, deep links for booking/QR. |
| Mobile state | **Zustand** + **TanStack Query** | 5.x | Local UI state (Zustand) + server cache (Query). See [state-management](03-state-management.md). |
| Web portal + Admin | **Next.js** (App Router) | 14.2+ | SSR for Google-indexable public pages; admin SPA-in-Next. |
| UI (web) | Tailwind CSS + shadcn/ui | latest | Fast, themable, RTL-capable. |
| Backend API | **NestJS** (Node) | Nest 10 / Node 20 LTS | Modular, DI, validation, WebSocket support. |
| ORM / DB | **Prisma** + **PostgreSQL** | Prisma 5 / PG 16 | Typed schema, migrations. See [data-model](04-data-model.md). |
| Realtime (chat) | **Socket.IO** (NestJS gateway) | 4.x | In-app chat + presence + typing. |
| Auth | Phone OTP + **JWT** (access+refresh) | — | No password at MVP; see [authentication flow](../03-user-flows/02-authentication.md). |
| SMS / OTP | **Unifonic** (primary) / Twilio (fallback) | — | KSA-grade SMS delivery. |
| Payments | **Moyasar** (primary) / HyperPay | — | mada, Visa/Mastercard, **Apple Pay, STC Pay**; supports escrow-style hold/capture. |
| Push notifications | **Expo Notifications** → FCM (Android) + APNs (iOS) | — | Confirmations, reminders, broadcasts. |
| Maps & geo | **Google Maps Platform** + `react-native-maps` | — | Address picker, distance/nearest search. PostGIS for server-side proximity. |
| Object storage | **S3-compatible** (AWS S3 / Cloudflare R2) | — | Portfolio images, chat media; signed URLs. |
| Background jobs | **BullMQ** + Redis | — | Reminders, payout processing, package expiry. |
| Caching / queues | **Redis** | 7.x | Sessions, rate limiting, job queue. |
| Search proximity | PostGIS (`ST_DWithin`) | PG 16 | Nearest-provider search; upgrade to Elastic if needed (Phase 2). |
| Observability | Sentry + structured logs (pino) | — | Error tracking client + server. |
| CI/CD | GitHub Actions + EAS Build | — | Mobile builds (EAS), web/API to container host. |
| Hosting | Containerized (Docker) on KSA-region-capable host | — | KSA-only hosting is Phase 2 (Nafath); MVP may use nearest region. |

## 2. Repository model

Single **monorepo** (pnpm workspaces + Turborepo). Layout in [02-folder-structure.md](02-folder-structure.md). Shared TypeScript packages:

- `@app/contracts` — shared DTOs/zod schemas mirroring [api-contracts](../05-api-contracts/01-conventions.md). One source of truth for request/response types across mobile, web, and API.
- `@app/ui-tokens` — generated from design-system JSON ([colors](../02-design-system/01-colors.md), [typography](../02-design-system/02-typography.md)).

## 3. Environments

| Env | API base | Purpose |
|---|---|---|
| `local` | `http://localhost:3000/api/v1` | Developer machine. |
| `staging` | `https://staging-api.nora-beauty.app/api/v1` | UAT, test payment keys. |
| `production` | `https://api.nora-beauty.app/api/v1` | Live. |

## 4. Required environment variables

Document only — never commit secrets. `.env.example` mirrors this.

```bash
# Core
NODE_ENV=production
API_PORT=3000
API_BASE_URL=https://api.nora-beauty.app/api/v1
WEB_BASE_URL=https://nora-beauty.app

# Database / cache
DATABASE_URL=postgresql://user:pass@host:5432/nora
REDIS_URL=redis://host:6379

# Auth
JWT_ACCESS_SECRET=__set__
JWT_REFRESH_SECRET=__set__
JWT_ACCESS_TTL=900            # 15m
JWT_REFRESH_TTL=2592000       # 30d
OTP_TTL=300                   # 5m
OTP_MAX_ATTEMPTS=5

# SMS
UNIFONIC_APP_SID=__set__
UNIFONIC_SENDER_ID=NoraBeauty

# Payments (Moyasar)
MOYASAR_SECRET_KEY=__set__
MOYASAR_PUBLISHABLE_KEY=__set__
MOYASAR_WEBHOOK_SECRET=__set__
PLATFORM_COMMISSION_DEFAULT=0.02   # 2% default; per-tier overrides in DB

# Storage
S3_ENDPOINT=__set__
S3_BUCKET=nora-media
S3_ACCESS_KEY=__set__
S3_SECRET_KEY=__set__

# Maps / push
GOOGLE_MAPS_API_KEY=__set__
EXPO_PROJECT_ID=__set__

# Observability
SENTRY_DSN=__set__
```

## 5. Versioning & quality gates

- **API versioning:** URI prefix `/api/v1`. Breaking changes → `/v2`.
- **Linting/formatting:** ESLint + Prettier; CI fails on lint errors.
- **Type checks:** `tsc --noEmit` in CI for every package.
- **Testing:** Jest (unit) + Supertest (API e2e) + Detox (mobile critical flows: auth, booking, payment).
- **Coverage gate:** ≥70% on `services`/`use-cases` layer for MVP.

## 6. Non-functional targets (MVP)

| Target | Value |
|---|---|
| API p95 latency | < 400 ms (non-payment endpoints) |
| Mobile cold start | < 3 s on mid-range Android |
| Crash-free sessions | > 99% |
| Image upload | resized client-side, < 1 MB per portfolio image |
| Localization | `ar-SA` (default, RTL) + `en` (LTR) |
