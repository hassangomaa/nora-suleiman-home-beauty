# Implementation Roadmap — Milestones

**Project:** منصة خدمات التجميل المنزلية (Nora Suleiman) · **Doc ref:** `SLT-PRO-2026-051`
**Status:** pre-SRS build blueprint. Canonical until superseded by signed SRS.
**Commercial baseline:** **USD 3,000 / 35 working days** for the MVP, starting **after SRS sign-off**.

This document sequences the build into ten phases (Phase 0 → Phase 9). Every phase traces to:

- the **10 systems** in [`../00-overview/01-product-brief.md`](../00-overview/01-product-brief.md) §5, and
- the gap register **G1–G12** in [`../../GAP-ANALYSIS-AR.md`](../../GAP-ANALYSIS-AR.md) §4.

The canonical stack, versions, and non-functional targets are fixed in [`../01-architecture/01-tech-stack.md`](../01-architecture/01-tech-stack.md). Nothing here overrides those; this file is the *ordering* and *acceptance* layer on top of the blueprint.

> **Scope decision adopted:** Path (2) from the gap analysis — a tuned MVP that pulls **G1, G2, G3, G4, G5, G7, G8, G11, G12** into scope and defers **G6 (extended support)** to a minimal in-app channel, **G9 (live GPS)** and **Nafath (G/Security)** to Phase 2+. See [`../../GAP-ANALYSIS-AR.md`](../../GAP-ANALYSIS-AR.md) §5.

---

## 1. How the 35 working days reconcile with the proposal

The signed proposal prices five workstreams totalling 35 working days. The phases below are the *build* decomposition of those workstreams; they sum to the same 35 days. Phase 0 + Phase 1 are the front of the **MVP dev** window (they are not pre-SRS work — repo, tokens, and the design system are day-one build tasks once SRS is signed).

| Proposal workstream (from [`PROPOSAL-AR`](../../PROPOSAL-AR.md)) | Proposal days | Mapped phases | Phase days |
|---|:--:|---|:--:|
| Gap analysis & SRS | 3–4 | *(pre-roadmap; gates the start)* | — |
| UX/UI design | 4–5 | Phase 1 (design-system implementation) + design carried through P2–P9 screens | 4.5 |
| MVP development | 22–24 | Phase 0 + Phases 2–8 | 22.5 |
| Testing & UAT | 4–5 | Phase 9 (QA/UAT + security review) portion | 4.0 |
| Deployment & launch | 2–3 | Phase 0 (CI/CD skeleton) + Phase 9 (store + web launch) portion | 4.0 |
| **Total** | **35** | **Phases 0–9** | **35.0** |

> The SRS effort (3–4 d) is **excluded** from the 35-day build clock by the proposal ("after SRS sign-off"). The roadmap below is the 35-day build clock only.

---

## 2. Phase narratives

Each phase lists its **objective**, the **systems** it advances (numbers refer to product-brief §5), and the **gap items** it closes.

### Phase 0 — Foundations: repo, Claude context, design tokens
**Objective.** Stand up the monorepo and make the blueprint executable by Claude Projects before any feature code.

- Initialise pnpm-workspaces + Turborepo monorepo per [`../01-architecture/02-folder-structure.md`](../01-architecture/02-folder-structure.md): apps `mobile` (Expo SDK 52), `web` (Next.js 14.2), `api` (NestJS 10), `admin`; packages `@app/contracts`, `@app/ui-tokens`.
- Load the entire `docs/blueprint/` tree into a Claude Project; pin [`../00-overview/01-product-brief.md`](../00-overview/01-product-brief.md), [`../01-architecture/01-tech-stack.md`](../01-architecture/01-tech-stack.md), and the design-system token JSON files per [`../README.md`](../README.md) "How to use with Claude Projects".
- Generate `@app/ui-tokens` from the design-system JSON in [`../02-design-system/01-colors.md`](../02-design-system/01-colors.md) and [`../02-design-system/02-typography.md`](../02-design-system/02-typography.md).
- Provision baselines: PostgreSQL 16 + Prisma 5 (empty schema scaffold from [`../01-architecture/04-data-model.md`](../01-architecture/04-data-model.md)), Redis 7, S3-compatible bucket, Sentry, `.env.example` mirroring tech-stack §4.
- CI/CD skeleton: GitHub Actions (lint, `tsc --noEmit`, Jest) + EAS Build config; three environments (`local` / `staging` / `production`).

**Systems:** infrastructure for all 10. **Gaps closed:** none directly; enables **G11** (TLS/at-rest config documented in env + host).

### Phase 1 — Design system implementation
**Objective.** Turn the design-system spec into shared, RTL-first UI primitives consumed by mobile and web.

- Implement color, typography, spacing/radius/elevation tokens from [`../02-design-system/01-colors.md`](../02-design-system/01-colors.md), [`../02-design-system/02-typography.md`](../02-design-system/02-typography.md), [`../02-design-system/03-spacing-layout.md`](../02-design-system/03-spacing-layout.md) (light/dark, `ar-SA` RTL default + `en` LTR).
- Build the component library from [`../02-design-system/04-components.md`](../02-design-system/04-components.md): buttons, inputs, cards, sheets, list rows, plus the five canonical states (default / loading / empty / error / success).
- Wire i18n (RTL mirroring, Arabic numerals option), Expo Router 4 navigation shell, theme provider; Tailwind + shadcn/ui theme on web mirroring the same tokens.

**Systems:** cross-cutting (UI substrate for all). **Gaps closed:** none directly; prerequisite for every screen-bearing phase.

### Phase 2 — Auth & onboarding
**Objective.** Phone + OTP authentication, role selection, sessions, and the client profile detail that the gap analysis flagged.

- Language → onboarding → role flow per [`../03-user-flows/01-onboarding.md`](../03-user-flows/01-onboarding.md); phone + OTP and session/re-auth per [`../03-user-flows/02-authentication.md`](../03-user-flows/02-authentication.md).
- Backend: Unifonic OTP (Twilio fallback), JWT access+refresh (TTLs per tech-stack §4), OTP TTL/attempt limits, Redis-backed sessions + rate limiting.
- Roles: client / provider / admin per [`../00-overview/02-personas-roles.md`](../00-overview/02-personas-roles.md).
- **Client profile detail (G12):** saved addresses (multiple) + saved payment-method placeholders.

**Systems:** 1 (Accounts & roles), 10 (Security — OTP). **Gaps closed:** **G12**; advances **G11**.

### Phase 3 — Provider side
**Objective.** Instant, no-approval provider onboarding plus the service/availability data that booking depends on.

- Instant onboarding (no admin queue) and provider management per [`../03-user-flows/04-provider.md`](../03-user-flows/04-provider.md).
- Services with **price + duration per service (G8)**; portfolio gallery (image upload, client-side resize < 1 MB, S3 signed URLs).
- **Availability calendar (G8):** working hours + slots that feed conflict-prevention in Phase 4.

**Systems:** 2 (Service system), partial 1 (provider profile). **Gaps closed:** **G8** (duration + availability foundation).

### Phase 4 — Client discovery & booking
**Objective.** Discover nearest providers, check real availability, create a booking with cancel/reschedule/refund policy.

- Discovery: nearest-provider search (PostGIS `ST_DWithin`), category/specialty filtering, provider profile + portfolio + ratings surface.
- Booking flow per [`../03-user-flows/03-client-booking.md`](../03-user-flows/03-client-booking.md): date/time selection, **availability validation + duration-based conflict prevention (closes G8 booking side)**, confirm.
- **Cancel + reschedule + refund policy (G1):** state machine and policy hooks (refund execution lands with Phase 5 escrow).
- Client location capture + "on the way" status + QR check-in (live GPS deferred to Phase 2+, per G9).

**Systems:** 3 (Booking), 4 (Location — search, QR, "on the way"). **Gaps closed:** **G1**, completes **G8**; partial **G9** (QR/"on the way" only).

### Phase 5 — Payments, escrow, wallet & payouts
**Objective.** Close the core of the business model — money in, held, and paid out.

- Moyasar integration (mada / Visa-Mastercard / Apple Pay / STC Pay), invoices/receipts, webhooks (signature-verified) per [`../03-user-flows/05-payments-payouts.md`](../03-user-flows/05-payments-payouts.md).
- **Escrow hold/capture (G2):** funds held on booking, captured on completion (QR check-in → completed), released to provider wallet net of commission.
- **Provider wallet + payouts/withdrawals (G2)**; commission engine (admin-configurable default `PLATFORM_COMMISSION_DEFAULT`, per-tier overrides in DB).
- **Refund execution (completes G1):** cancellation/refund policy wired to escrow; payment protection tied to dispute hooks.
- BullMQ jobs for payout processing and reconciliation.
- **G10** resolved operationally by confirming Moyasar wallet support.

**Systems:** 5 (Payment). **Gaps closed:** **G2**, completes **G1** refund leg, confirms **G10**.

### Phase 6 — Chat, notifications, reminders & broadcasts
**Objective.** Real-time communication plus the notification engine that drives growth.

- In-app chat per [`../03-user-flows/03-client-booking.md`](../03-user-flows/03-client-booking.md) ↔ provider: Socket.IO gateway, message history, presence/typing, **image sharing (G7)** via S3 signed URLs.
- Push via Expo Notifications → FCM/APNs: booking confirmation (existing), **scheduled appointment reminders (G3)** via BullMQ, **promotional broadcasts / campaigns (G3)** triggered from admin.

**Systems:** 7 (Notifications), 8 (Communication — chat + media). **Gaps closed:** **G3**, **G7**.

### Phase 7 — Ratings/reviews, complaints/disputes & support
**Objective.** Trust loop and the dispute/support channels flagged as gaps.

- **Star rating + written review tied to a completed booking, with ranking effect (G5)** per [`../03-user-flows/03-client-booking.md`](../03-user-flows/03-client-booking.md) (review step) and search-ranking input from Phase 4.
- **Complaints / disputes (G4):** client/provider can file against a booking; status workflow linked to payment protection/refund (Phase 5).
- **In-app support channel (G6, minimal):** support conversation thread (lightweight, not full ticketing) per the deferred scope decision.

**Systems:** 6 (Ratings & reviews), 8 (Communication — support), 9 (admin dispute feed). **Gaps closed:** **G4**, **G5**; **G6** minimal.

### Phase 8 — Admin dashboard
**Objective.** Operations console for users, money, growth levers, and disputes.

- Next.js admin (SPA-in-Next): user management (clients + providers), reports/statistics (bookings, payments).
- **Earnings/commission per provider + payable balances (G2 admin side)**; commission-tier configuration; **visibility packages** (Silver/Gold/Platinum) and **promotional broadcast triggers** (feeds Phase 6).
- **Complaints/disputes queue (G4 admin side):** review, resolve, trigger refunds.

**Systems:** 9 (Admin dashboard), supports 5/6/7. **Gaps closed:** completes admin side of **G2** and **G4**.

### Phase 9 — Web portal, QA/UAT, security review & launch
**Objective.** Public discovery channel, full quality gates, and go-live across stores + web.

- Next.js public web portal (SSR, Google-indexable) for discovery + booking entry per [`../00-overview/01-product-brief.md`](../00-overview/01-product-brief.md) §4.
- QA/UAT: Jest unit, Supertest API e2e, **Detox critical flows (auth, booking, payment)**; coverage gate ≥ 70% on services/use-cases (tech-stack §5).
- **Security review (G11):** TLS in transit + at-rest encryption verified and documented; OTP/rate-limit/abuse review; payment-flow stress test.
- Launch: EAS store submissions (iOS/Android), web + API container deploy to production, Sentry/observability live.

**Systems:** all (web channel + 10 Security hardening). **Gaps closed:** **G11**; verification of all prior gaps under UAT.

---

## 3. Milestone table

Days are **working days** and sum to **35.0**, reconciling with the proposal table in §1.

| Phase | Deliverables | 10 systems covered | Gaps closed (G1–G12) | Depends on | Est. (days) |
|:--:|---|---|---|:--:|:--:|
| **P0** Foundations | Monorepo, Claude Project context, `@app/ui-tokens`, DB/Redis/S3/Sentry baselines, CI/CD skeleton, 3 envs | Infra for all 10 | — (enables G11) | — | 2.0 |
| **P1** Design system | Tokens (color/type/spacing), RTL-first component library + 5 states, i18n, nav shell, web theme | Cross-cutting UI | — | P0 | 4.5 |
| **P2** Auth & onboarding | Phone+OTP, JWT sessions/re-auth, 3 roles, client saved addresses/payment placeholders | 1, 10 (OTP) | G12 | P0, P1 | 3.0 |
| **P3** Provider side | Instant onboarding, services + **duration**, portfolio (S3), availability calendar | 2, 1 (provider) | G8 (foundation) | P2 | 3.5 |
| **P4** Discovery & booking | Nearest search (PostGIS), availability + conflict prevention, booking create, cancel/reschedule/refund policy, QR + "on the way" | 3, 4 | G1, G8 (complete); G9 partial | P3 | 4.0 |
| **P5** Payments & escrow | Moyasar (mada/Apple Pay/STC Pay), escrow hold/capture, wallet, payouts, commission engine, refund execution, BullMQ | 5 | G2; G1 refund; G10 | P4 | 5.0 |
| **P6** Chat & notifications | Socket.IO chat + image share, push (FCM/APNs), scheduled reminders, broadcasts | 7, 8 (chat) | G3, G7 | P2, P5 | 3.5 |
| **P7** Ratings & disputes | Reviews tied to bookings + ranking effect, complaints/disputes, minimal in-app support | 6, 8 (support), 9 (feed) | G4, G5, G6 (minimal) | P4, P5 | 3.0 |
| **P8** Admin dashboard | Users, reports, commission/earnings + balances, packages, broadcast triggers, complaints queue | 9 | G2/G4 (admin side) | P5, P6, P7 | 3.0 |
| **P9** Web + QA/launch | SSR web portal, Jest/Supertest/Detox, ≥70% coverage, security review (TLS/at-rest), store + prod deploy | All; 10 (security) | G11; verify all | P1–P8 | 3.5 |
| | | | | **Total** | **35.0** |

> **Reconciliation:** P0 (2.0) + P9 deploy portion ≈ proposal Deployment (2–3 d, here folded into P0 CI/CD + P9 launch = 4.0 across two phases). P1 + design carried in screens ≈ UX/UI (4.5). P0+P2–P8 build = 22.5 ≈ MVP development (22–24). P9 QA/security = 4.0 ≈ Testing & UAT (4–5). Grand total 35.0.

---

## 4. Definition of Done — per phase

A phase is **Done** only when every box is checked. The standing **global gates** apply to every phase: ESLint/Prettier pass, `tsc --noEmit` green, Jest green in CI, no `__set__`/placeholder leaking into committed config, Sentry instrumented, RTL (`ar-SA`) + `en` verified, secrets only in env.

**P0 — Foundations**
- [ ] Monorepo builds via Turborepo; all four apps + two packages compile.
- [ ] `@app/ui-tokens` generated from design-system JSON, imported by mobile + web.
- [ ] DB/Redis/S3/Sentry reachable in `local` and `staging`; `.env.example` complete.
- [ ] CI runs lint + typecheck + tests on PR; EAS build config validated; 3 envs documented.
- [ ] Claude Project loaded with `docs/blueprint/`; pinned files confirmed.

**P1 — Design system**
- [ ] All tokens implemented (light/dark) and snapshot-matched to the design-system docs.
- [ ] Every component renders its five states; RTL mirroring verified.
- [ ] i18n switches `ar-SA`↔`en` with correct direction; nav shell deep-link-ready (booking/QR).

**P2 — Auth & onboarding**
- [ ] OTP send/verify works via Unifonic (Twilio fallback path tested); attempt/TTL limits enforced.
- [ ] Access+refresh JWT issued/rotated; re-auth and logout work; Redis rate limiting active.
- [ ] Role routing (client/provider/admin) correct; client can add/edit multiple saved addresses (**G12**).
- [ ] Detox: auth happy-path + invalid-OTP path pass.

**P3 — Provider side**
- [ ] Provider self-onboards with **no admin approval**; profile complete.
- [ ] Service carries price **and duration**; validation rejects zero/negative duration (**G8**).
- [ ] Portfolio upload resizes < 1 MB, served via signed URLs.
- [ ] Availability calendar persists and is queryable by the booking engine.

**P4 — Discovery & booking**
- [ ] Nearest-provider search returns ranked results within distance radius (PostGIS).
- [ ] Booking creation blocks slot conflicts using service duration (**G8 complete**).
- [ ] Cancel + reschedule transitions enforce refund policy hooks (**G1**); statuses match glossary enums.
- [ ] QR check-in + "on the way" status update booking state; live GPS explicitly out (**G9 deferred**).

**P5 — Payments & escrow**
- [ ] Payment captured via Moyasar (mada + Apple Pay + STC Pay tested in staging keys).
- [ ] Escrow holds on booking, releases to provider wallet net of commission on completion (**G2**).
- [ ] Withdrawal request → payout job processed; balances reconcile.
- [ ] Refund executes per policy on cancel (**G1 refund leg**); webhook signatures verified.
- [ ] Commission default + per-tier override applied correctly.

**P6 — Chat & notifications**
- [ ] Realtime chat with history, presence/typing; image share via signed URLs (**G7**).
- [ ] Confirmation push delivered; scheduled reminder fires before appointment (**G3**).
- [ ] Admin-triggered broadcast reaches targeted segment (**G3**).

**P7 — Ratings & disputes**
- [ ] Review allowed only on completed booking; rating feeds search ranking (**G5**).
- [ ] Complaint/dispute can be filed and progresses through its status workflow (**G4**).
- [ ] Minimal in-app support thread reachable (**G6 minimal**).

**P8 — Admin dashboard**
- [ ] User management (suspend/inspect) for clients + providers.
- [ ] Earnings/commission + payable balances per provider visible and correct (**G2 admin**).
- [ ] Visibility packages configurable; broadcast trigger reaches Phase-6 pipeline.
- [ ] Complaints queue lets admin resolve and trigger refunds (**G4 admin**).

**P9 — Web + QA/launch**
- [ ] Public web portal SSR pages indexable (robots/sitemap/meta verified).
- [ ] Jest + Supertest + Detox (auth/booking/payment) pass; coverage ≥ 70% on services/use-cases.
- [ ] Security review signed off: TLS in transit + at-rest encryption confirmed (**G11**); payment stress test passed.
- [ ] iOS + Android submitted via EAS; web + API live in production; non-functional targets (tech-stack §6) met.

---

## 5. Phase 2+ (post-MVP) backlog

Explicitly **out of the 35-day MVP** per [`../00-overview/01-product-brief.md`](../00-overview/01-product-brief.md) §7 and [`../../GAP-ANALYSIS-AR.md`](../../GAP-ANALYSIS-AR.md) §5. Each is a separately scoped/quoted increment.

| # | Item | Origin | Why deferred |
|:--:|---|---|---|
| B1 | **Nafath / Elm national-ID verification** | Product-brief §7; Security G | Requires in-KSA hosting; OTP-only suffices for MVP. |
| B2 | **Live GPS arrival tracking** | G9 | MVP uses QR + "on the way"; live maps add map-cost + lat/long streaming complexity. |
| B3 | **Geographic expansion** (Kuwait / Qatar / Egypt) | Product-brief §7 | MVP is single market (KSA, `ar-SA`, SAR, Asia/Riyadh). |
| B4 | **POS terminal hardware bundles** | Product-brief §7 | Hardware + separate commercial track. |
| B5 | **Full support ticketing** (beyond minimal thread) | G6 | MVP ships minimal in-app support only. |
| B6 | **Elasticsearch proximity/relevance search** | Tech-stack §1 | PostGIS `ST_DWithin` sufficient at MVP volume. |
| B7 | **Sales-points loyalty + advanced package economy** | Product-brief §6 | Toggle-able; not a launch driver. |
| B8 | **Subscriptions** | Product-brief §6 | Off by default; client prefers commission model at launch. |
| B9 | **Haraj app + Telegram AI training bot** | Product-brief §7 | Separate quotes. |

---

## 6. Risks & mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|:--:|---|:--:|:--:|---|
| R1 | **Scope creep on G1/G2/G3** beyond signed SRS pushes past 35 days | High | High | Freeze gap statuses in SRS before day 1; change requests re-quoted; P5/P4 buffered as the largest estimates. |
| R2 | **Payment gateway (Moyasar) escrow/hold-capture** behaves differently than assumed | Medium | High | Spike escrow flow early in P5; HyperPay named as fallback (tech-stack §1); confirm wallet support (G10) before build. |
| R3 | **OTP deliverability** in KSA (Unifonic) unreliable | Medium | High | Twilio fallback wired in P2; retry + rate-limit + attempt cap; monitor delivery in staging. |
| R4 | **Store review delay** (Apple/Google) blocks launch window | Medium | High | Submit EAS builds early in P9; OTA (Expo) for post-review fixes; soft-launch web portal first. |
| R5 | **RTL/Arabic-first regressions** on later screens | Medium | Medium | RTL baked into P1 components + global DoD gate; visual checks each phase. |
| R6 | **Conflict-prevention/availability edge cases** (timezone, duration overlap) | Medium | Medium | Single timezone (Asia/Riyadh) at launch; duration-based locking tested in P4 DoD; Detox booking flow. |
| R7 | **Provider abuse via instant onboarding** (no approval) | Medium | Medium | Phone+OTP gate, complaints/disputes (P7) + admin suspend (P8); Nafath (B1) as Phase-2 trust upgrade. |
| R8 | **Holiday-season deadline** compresses QA | Medium | Medium | Coverage gate + Detox automated in CI from P0; security review scheduled, not last-minute; staging UAT continuous. |
| R9 | **Data-protection posture (G11)** unspecified until late | Low | Medium | TLS + at-rest documented in P0 env/host; verified in P9 security review; documented in SRS at no extra cost. |
| R10 | **Cross-channel contract drift** (mobile/web/admin/API) | Medium | Medium | Single source of truth in `@app/contracts` (zod/DTO) from P0; `tsc --noEmit` gate on every package. |

---

*Confidential — Smart Lead Tech. Canonical until superseded by signed SRS (`SLT-PRO-2026-051`).*
