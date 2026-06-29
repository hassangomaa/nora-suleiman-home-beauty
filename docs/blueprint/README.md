# App Blueprint — Home Beauty Services Platform

**Project:** منصة خدمات التجميل المنزلية (Nora Suleiman) · **Doc ref:** `SLT-PRO-2026-051`
**Audience:** engineering + design, and **Claude Projects** as an implementation context base.
**Status:** pre-SRS build blueprint. Canonical until superseded by signed SRS.

This blueprint is the single source of truth for building the mobile apps, web portal, admin dashboard, and backend from scratch. It is written for **zero-gap execution**: every screen, state, token, entity, and endpoint is fully specified — no placeholders.

> The client-facing proposal, meeting notes, and the requirements [gap analysis](../GAP-ANALYSIS-AR.md) live one level up in [`docs/`](../). This folder is the *technical* blueprint derived from them.

---

## How to use with Claude Projects

1. Add the entire [`docs/blueprint/`](.) tree to a Claude Project as context (markdown + JSON token files).
2. Pin [`00-overview/01-product-brief.md`](00-overview/01-product-brief.md), [`01-architecture/01-tech-stack.md`](01-architecture/01-tech-stack.md), and the design-system token files — they define every canonical constant.
3. When asking Claude to implement a screen or endpoint, reference the file by path (e.g. *"implement the screen in `04-mobile-screens/01-client-screens.md` §6.10 Booking Detail"*).
4. Constants (colors, type scale, spacing, API base) must be read from these files, never re-invented.

---

## Repository structure

```
docs/blueprint/
├── README.md                         # this file
├── 00-overview/
│   ├── 01-product-brief.md           # product scope, the 10 systems, MVP boundary
│   ├── 02-personas-roles.md          # client / provider / admin, permissions matrix
│   └── 03-glossary.md                # domain terms (AR/EN), status enums
├── 01-architecture/
│   ├── 01-tech-stack.md              # stack, versions, rationale, env config
│   ├── 02-folder-structure.md        # monorepo layout, naming conventions
│   ├── 03-state-management.md        # state, data flow, caching, offline
│   └── 04-data-model.md              # entities, relations, ER diagram, enums
├── 02-design-system/
│   ├── 01-colors.md                  # palette + tokens (light/dark) + JSON
│   ├── 02-typography.md              # Arabic-first type scale + JSON
│   ├── 03-spacing-layout.md          # spacing, radius, elevation, grid, RTL
│   └── 04-components.md              # buttons, inputs, cards, sheets, states
├── 03-user-flows/
│   ├── 01-onboarding.md              # language → onboarding → role
│   ├── 02-authentication.md          # phone + OTP, session, re-auth
│   ├── 03-client-booking.md          # discover → book → pay → QR → review
│   ├── 04-provider.md                # onboarding → manage → fulfil → payout
│   └── 05-payments-payouts.md        # escrow, commission, wallet, withdrawals
├── 04-mobile-screens/
│   ├── 01-client-screens.md          # every client screen, full spec
│   ├── 02-provider-screens.md        # every provider screen, full spec
│   └── 03-shared-screens.md          # splash, auth, chat, support, settings
├── 05-api-contracts/
│   ├── 01-conventions.md             # base URL, auth, errors, pagination
│   ├── 02-auth.md                    # OTP, session, profile
│   ├── 03-providers-services.md      # providers, services, portfolio, search
│   ├── 04-bookings.md                # availability, create, cancel, reschedule
│   ├── 05-payments-payouts.md        # intents, webhooks, wallet, withdrawals
│   ├── 06-chat-notifications.md      # chat, media, push, reminders
│   ├── 07-ratings-complaints.md      # reviews, complaints/disputes
│   └── 08-admin.md                   # users, reports, commission, packages
└── 06-roadmap/
    └── 01-milestones.md              # phased plan mapped to gap register
```

---

## Conventions used across all docs

- **Language:** UI is Arabic-first (RTL); English secondary. Specs are EN with AR domain terms.
- **Screen IDs:** `CLI-xx` (client), `PRV-xx` (provider), `SHR-xx` (shared).
- **Every screen** documents: purpose · components · states (default / loading / empty / error / success) · interactions · navigation · APIs consumed · RTL & a11y notes.
- **Every endpoint** documents: method · path · auth/role · request schema · response schema · error cases.
- **Gap traceability:** items map to `G1`–`G12` in the [gap analysis](../GAP-ANALYSIS-AR.md).

> Client confidential. Do not redistribute without Smart Lead Tech approval.
