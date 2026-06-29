# Product Brief

## 1. One-liner

A women-only marketplace that connects clients in Saudi Arabia with **freelance home-beauty providers** (makeup artists, hairstylists, nail technicians, and similar) who deliver the service **at the client's home** — with in-app discovery, booking, payment, escrowed provider payouts, chat, and ratings.

## 2. Vision & positioning

- **Not** a salon-management system (that is the [Cash Salon](../../../../v1/projects/implemented/cache-salon/README.md) reference). This is a **two-sided marketplace** for independent providers serving clients at home.
- **Audience:** women only.
- **Launch market:** Kingdom of Saudi Arabia. Later expansion (Kuwait, Qatar) is out of MVP scope.
- **Year-one priority (client-stated):** *user acquisition and rapid growth*, not direct platform revenue. Every product decision favours frictionless onboarding and viral growth over monetization gates.

## 3. Product principles

1. **Instant provider onboarding** — no admin approval queue (Instagram/Snapchat-style). Verification is phone + OTP only at MVP.
2. **No heavy subscriptions** — providers are not gated behind monthly fees. Revenue comes from a low transaction commission and optional visibility packages.
3. **Arabic-first, RTL-native** — Arabic is the primary language; the UI is designed RTL-first, not retrofitted.
4. **Trust by design** — escrowed payments, QR check-in, ratings, and a complaints channel make both sides safe.
5. **Extensible** — modules can be added later (national-ID verification, geographic expansion) without rebuilding the platform.

## 4. Channels

| Channel | Purpose | Stack ref |
|---|---|---|
| Mobile app (iOS + Android) | Primary client & provider experience | [tech-stack](../01-architecture/01-tech-stack.md) |
| Responsive web portal | Public, Google-indexable discovery + booking | Next.js |
| Admin dashboard | Operations, reports, commission, packages, complaints | Next.js |
| Backend API | Single API serving all channels | NestJS |

## 5. The 10 systems (client requirements) → MVP mapping

This blueprint implements the client's ten requested systems. Status reflects the [gap analysis](../../GAP-ANALYSIS-AR.md); items pulled **into MVP** to close gaps are marked ✚.

| # | System | MVP scope in this blueprint |
|:-:|---|---|
| 1 | Accounts & roles | Phone+OTP auth; roles: client / provider / admin; profile management (incl. client saved addresses ✚) |
| 2 | Service system | Categories, service details, **price + duration ✚**, portfolio gallery |
| 3 | Booking | Date/time selection, availability calendar, confirm, **cancel + reschedule + refund policy ✚** |
| 4 | Location | Client location, nearest-provider search, **"on the way" status + QR check-in** (live GPS tracking → Phase 2) |
| 5 | Payment | Card + wallet (mada/Apple Pay/STC Pay), invoices, **escrow + provider wallet + payouts ✚**, payment protection |
| 6 | Ratings & reviews | **Star rating + written review tied to a completed booking + effect on ranking ✚** |
| 7 | Notifications | Booking confirmation, **appointment reminders ✚**, **promotional broadcasts ✚** |
| 8 | Communication | In-app chat with history + **image sharing ✚**; **in-app support channel ✚** |
| 9 | Admin dashboard | Users, reports, earnings/commission, **complaints/disputes ✚** |
| 10 | Security | OTP, **TLS + at-rest encryption (stated) ✚**, payment protection; national-ID (Nafath) → Phase 2 |

## 6. Revenue model (admin-configurable)

Configured from the admin dashboard — no code change required to adjust.

| Model | Default | Notes |
|---|---|---|
| Transaction commission | ~1–2% of payment | Configurable per provider tier (beginner / mid / established) |
| Visibility packages | Silver (2–3d) · Gold (5d) · Platinum (10d) | Boost search ranking for a duration |
| Sales points | e.g. SAR 1,000 sales = 100 points | Redeemable for ads / boosted visibility |
| Subscriptions | **Off by default** | Client prefers to avoid; toggle exists but unused at launch |

> Final percentages/policy are set in the signed SRS; these are meeting-derived defaults.

## 7. Explicitly out of MVP (Phase 2+)

- Nafath / Elm national-ID verification (requires in-KSA hosting).
- Live GPS arrival tracking (MVP uses "on the way" status + QR).
- POS terminal hardware bundles.
- Geographic expansion (Kuwait/Qatar/Egypt).
- Haraj app and the Telegram AI training bot (separate quotes).

## 8. Success metrics (year one)

- Provider sign-ups and active providers (instant onboarding conversion).
- Client downloads → first-booking conversion.
- Booking completion rate; cancellation/no-show rate.
- GMV and commission (tracked, not optimized in year one).
- Rating coverage (% completed bookings reviewed).

## 9. Constraints & assumptions

- Women-only enforced by product/content policy, not by hard identity verification at MVP.
- One payment gateway integrated at MVP (KSA-capable: mada + Apple Pay + STC Pay).
- Single timezone/locale at launch: Asia/Riyadh, `ar-SA` primary, `en` fallback. Currency: SAR.
- Readiness targeted before the holiday season (accelerated 35-working-day track after SRS).
