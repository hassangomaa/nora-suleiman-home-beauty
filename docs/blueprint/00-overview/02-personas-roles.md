# Personas & Roles

## 1. Roles

The platform has three first-class roles. A single phone number resolves to one account; a client may later **also** become a provider (the account gains the provider capability — it is not a second account).

| Role | AR | Description |
|---|---|---|
| `client` | عميلة | Books and pays for home-beauty services. |
| `provider` | مقدّمة خدمة | Freelance professional offering services at the client's home. |
| `admin` | إدارة | Smart Lead Tech / operator staff managing the platform. |

Admin sub-roles (RBAC within the dashboard): `super_admin`, `ops` (bookings/users/complaints), `finance` (payouts/commission), `support` (support tickets, read-only on finance).

## 2. Personas

### 2.1 Client — "Reem", 27, Riyadh

- Wants a trusted makeup artist at home for an event this weekend.
- Browses by service type and proximity, checks portfolios and ratings, books a slot, pays in-app (mada/Apple Pay), expects a reminder and confirmation that the provider is on the way.
- Pain points she expects solved: trust, clear pricing, no haggling, safety (escrow + QR).

### 2.2 Provider — "Latifah", 31, makeup artist

- Works independently from home; wants more bookings without paying monthly fees.
- Signs up instantly, builds a profile with a portfolio and price list, sets availability, accepts bookings, gets paid reliably after each completed job, and can boost her ranking when she wants more work.
- Pain points solved: instant start, reliable payouts (wallet + withdrawal), visibility control.

### 2.3 Admin — "Operations", Smart Lead Tech

- Monitors users, bookings, and GMV; configures commission tiers and visibility packages; resolves complaints/disputes and processes provider payouts.

## 3. Permissions matrix

`✓` = allowed · `—` = not allowed · `self` = own records only.

| Capability | client | provider | admin |
|---|:--:|:--:|:--:|
| Register via phone + OTP | ✓ | ✓ | ✓ (invited) |
| Edit own profile | self | self | self |
| Manage saved addresses / payment methods | ✓ | — | — |
| Search providers / services | ✓ | ✓ | ✓ |
| Create / manage services + portfolio | — | self | moderate |
| Set availability calendar | — | self | — |
| Create booking | ✓ | — | on behalf |
| Accept / reject booking | — | self | — |
| Cancel booking | self | self | ✓ |
| Reschedule booking | self (req.) | self (req.) | ✓ |
| QR check-in / verify | scan | present | — |
| Pay for booking | ✓ | — | — |
| View own wallet / earnings | — | self | all |
| Request withdrawal | — | self | — |
| Approve / process payout | — | — | ✓ (finance) |
| Chat with counterpart | ✓ | ✓ | — |
| Open support ticket | ✓ | ✓ | manage |
| Submit rating / review | ✓ (after completion) | — | moderate |
| File complaint / dispute | ✓ | ✓ | resolve |
| Configure commission / packages | — | — | ✓ (super/finance) |
| Send promotional broadcast | — | — | ✓ (ops) |
| View reports / analytics | — | self KPIs | ✓ |

## 4. Account lifecycle & states

| State | Applies to | Meaning |
|---|---|---|
| `pending_otp` | all | Phone entered, OTP not yet verified. |
| `active` | all | Verified and usable. Providers are active **immediately** (no approval queue). |
| `suspended` | client/provider | Admin-blocked (abuse/complaint outcome); cannot transact. |
| `deactivated` | client/provider | User-initiated; can be reactivated by re-auth. |

## 5. Provider capability sub-states

Independent of account state (a provider can be `active` but not yet `discoverable`):

| Flag | Meaning |
|---|---|
| `profile_complete` | Has ≥1 service with price+duration and ≥1 portfolio item. Required to appear in search. |
| `accepting_bookings` | Availability set and provider toggled "open for work". |
| `tier` | `beginner` / `mid` / `established` — drives commission %. |
| `visibility_boost` | Active package (silver/gold/platinum) with expiry. |

> RBAC enforcement is implemented in the API per [05-api-contracts/01-conventions.md](../05-api-contracts/01-conventions.md); the UI hides actions a role cannot perform but the server is the source of truth.
