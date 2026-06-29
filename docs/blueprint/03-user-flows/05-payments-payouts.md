# User Flow — Payments & Payouts (Escrow, Commission, Wallet, Withdrawals)

> **Scope.** End-to-end money flow: payment intent → escrow hold at booking → capture on completion → commission split (per provider tier) → provider wallet credit → withdrawal request → admin approval → bank transfer → refunds on cancellation (by policy window) → dispute hold. States, who-can-do-what, and reconciliation.
>
> **This is gap G2** ([gap analysis](../GAP-ANALYSIS-AR.md) §G2) — provider wallet, payout/withdrawal, and escrow. It also realizes the payment-protection requirement and ties into G1 (refund windows).
>
> **Stack.** Gateway **Moyasar** (HyperPay fallback) supporting mada / Visa-Mastercard / **Apple Pay / STC Pay** with hold/capture; payout & expiry jobs on **BullMQ + Redis**; ledger in **PostgreSQL/Prisma**. Currency **SAR** only ([tech-stack](../01-architecture/01-tech-stack.md)).
>
> **Roles.** `client` pays; `provider` earns/withdraws; `admin` (`finance`) approves payouts & resolves disputes ([personas-roles](../00-overview/02-personas-roles.md) §3).

---

## 1. Money objects & who-can-do-what

| Object | Owner | States | Who acts |
|---|---|---|---|
| **Payment Intent** | client booking | `created` → `authorized` (hold) → `captured` / `voided` / `failed` | client (create via gateway), system/webhook (transition) |
| **Escrow Hold** | platform (custodial) | `held` → `captured` → `released` / `refunded` (full/partial) | system on booking lifecycle |
| **Commission** | platform | computed at capture | system (per `tier`) |
| **Wallet Entry (ledger)** | provider | `credit` / `debit` (immutable rows) | system only (never user-editable) |
| **Wallet Balance** | provider | `pending_balance`, `available_balance`, `withdrawal_hold` | derived from ledger |
| **Withdrawal** | provider | `requested` → `approved` → `processing` → `paid` / `rejected` / `failed` | provider (request + step-up), admin finance (approve/reject), system (bank transfer) |
| **Refund** | client | `pending` → `processed` / `failed` | system (per policy/dispute outcome) |
| **Dispute Hold** | platform | `held` → `released` / `refunded` / `split` | admin ops/finance |

Permissions (from [personas-roles](../00-overview/02-personas-roles.md) §3):

| Capability | client | provider | admin |
|---|:--:|:--:|:--:|
| Pay for booking | ✓ | — | — |
| View own wallet/earnings | — | self | all |
| Request withdrawal | — | self (+step-up) | — |
| Approve/process payout | — | — | ✓ (finance) |
| Issue refund (policy) | auto via cancel | — | ✓ (override) |
| Resolve dispute → money outcome | — | — | ✓ (ops/finance) |
| Configure commission/packages | — | — | ✓ (super/finance) |

---

## 2. Commission tiers

Commission is taken from the captured amount at completion; the remainder is the provider's net credit. Per `tier` ([personas-roles](../00-overview/02-personas-roles.md) §5, [product-brief](../00-overview/01-product-brief.md) §6), admin-configurable (defaults; final values in SRS):

| Tier | Default commission | Provider keeps |
|---|---|---|
| `beginner` | 2% | 98% |
| `mid` | 1.5% | 98.5% |
| `established` | 1% | 99% |

`PLATFORM_COMMISSION_DEFAULT=0.02` ([tech-stack](../01-architecture/01-tech-stack.md) §4); per-tier overrides live in the DB. Visibility-package purchases are **direct platform revenue** (not escrow, no commission split) — see [provider](04-provider.md) §10.

---

## 3. Payment intent & escrow hold (at booking)

Triggered from [client-booking](03-client-booking.md) §4 step 9 (`CLI-17`).

1. Client confirms the booking → server creates the booking `pending_provider` and a **Payment Intent** (`created`) for the quoted total (services + add-ons + travel fee).
2. App calls `POST /payments/intents`; the Moyasar sheet runs the chosen method (mada / Apple Pay / STC Pay / card) with **authorize-only (hold)**, not capture.
3. Gateway authorizes the amount → `payments/webhook` (HMAC-verified with `MOYASAR_WEBHOOK_SECRET`) confirms → Intent `authorized`, Escrow Hold `held`. Funds are reserved on the client's instrument, owned custodially by the platform — neither side can spend them yet.
4. Booking stays `pending_provider` awaiting provider accept.

**APIs:** `POST /api/v1/payments/intents`, `POST /api/v1/payments/webhook` (gateway→server), `GET /api/v1/payments/intents/{id}`. Schemas in [05-api-contracts/05-payments-payouts.md](../05-api-contracts/05-payments-payouts.md).

**Unhappy paths:**

| Case | Result |
|---|---|
| Authorization declined (funds/3DS/mada) | Intent `failed`; booking provisional slot released; client retries on `CLI-17` ([client-booking](03-client-booking.md) §6.3). |
| Webhook never arrives (timeout) | Reconciliation job polls Moyasar; if not authorized within grace, Intent `voided`, slot released. |
| Duplicate webhook | Idempotency key on Intent makes transitions idempotent. |
| Provider rejects / accept window expires | Hold `voided` (never captured) → instrument released; no money moved. |

> **Hold ≠ capture.** No money leaves the client and nothing is credited to the provider until completion (§4). This is the core escrow guarantee (payment protection / G2).

---

## 4. Capture on completion → commission split → wallet credit

Triggered from [client-booking](03-client-booking.md) §4 steps 16–17.

1. Service `completed` (client confirms on `CLI-25`, or **auto-confirm** after the post-completion window — default **24 h** — via a BullMQ job).
2. System **captures** the Escrow Hold → Payment Intent `captured`, Escrow `captured`. Money now moves from instrument to platform.
3. **Commission split** by provider `tier` (§2): `commission = total × rate`; `provider_net = total − commission`.
4. **Wallet credit:** a `credit` ledger row for `provider_net` is written → added to `pending_balance`.
5. **Clearance window:** after the clearance hold (default **72 h** post-completion, no dispute) a BullMQ job moves the amount `pending_balance → available_balance`. Available funds are withdrawable (§5).
6. Client gets a final **invoice** (services + add-ons + total, SAR); provider sees the net + commission line in `PRV-30` wallet ledger.

```
 total (held) ──capture──▶ platform
        │
        ├─ commission (tier %) ─▶ platform revenue
        └─ provider_net ─▶ wallet PENDING ──(clearance 72h, no dispute)──▶ AVAILABLE
```

**Auto-confirm guard:** if a dispute is opened before auto-confirm or during clearance, capture/clearance is suspended and the funds enter a **dispute hold** (§7).

---

## 5. Withdrawal: request → admin approval → bank transfer

From [provider](04-provider.md) §9 (`PRV-30` → `PRV-31`).

1. Provider must have a saved **payout account** (IBAN) — `PUT /me/payout-account` (step-up protected).
2. Provider requests an amount ≤ `available_balance`. Withdrawal is a **sensitive action** → step-up re-auth ([authentication](02-authentication.md) §7) → `step_up_token`.
3. `POST /me/withdrawals` → Withdrawal `requested`; amount moves `available_balance → withdrawal_hold` (so it can't be double-spent).
4. **Admin finance** reviews in the dashboard:
   - **Approve** → `approved`; queued for transfer.
   - **Reject** → `rejected`; `withdrawal_hold → available_balance` returns; reason recorded.
5. Bank transfer executes (BullMQ payout job / manual batch) → `processing` → on confirmation `paid` (ledger `debit` finalizes the withdrawal); on bank error → `failed`, funds returned to `available_balance`, retryable.

| State | Set by | Funds location |
|---|---|---|
| `requested` | provider (+step-up) | `withdrawal_hold` |
| `approved` | admin finance | `withdrawal_hold` |
| `processing` | system | `withdrawal_hold` (in transfer) |
| `paid` | system (bank confirm) | left the platform (debited) |
| `rejected` | admin finance | back to `available_balance` |
| `failed` | system (bank error) | back to `available_balance` |

**Unhappy paths:** amount > available (`422 insufficient_balance`); no payout account (blocked); step-up expired (`401 step_up_required`); only **cleared/available** funds withdrawable (`pending` excluded); deactivation blocked while a withdrawal is open ([authentication](02-authentication.md) §10).

---

## 6. Refunds on cancellation (by policy window — G1)

Refund amounts follow the cancellation windows in [client-booking](03-client-booking.md) §8.1 (admin-configurable defaults). Mechanics depend on whether capture has occurred:

| Trigger | Stage | Money action |
|---|---|---|
| Cancel while `pending_provider` (pre-accept) | hold only | **Void hold** (100% back; nothing captured). |
| Client cancel ≥ 24 h | usually pre-capture hold | **100% release** of hold (or full refund if already captured). |
| Client cancel 6–24 h | hold/captured | **50%**: refund 50% to client; remaining 50% captured → provider compensation credit (net of commission). |
| Client cancel < 6 h | hold/captured | **0% refund**: amount captured → provider compensation (net of commission). |
| Provider cancel (any time) | hold/captured | **100%** to client + **provider penalty** (debit ledger row / strike); ranking impact. |
| Provider no-show | post-slot | **100%** client refund + penalty. |
| Client no-show | post-slot | per policy: no/partial refund; captured amount may credit provider as compensation (ops-reviewed). |
| Reject / accept-expire | hold only | **Void hold** (100%). |

**Refund API:** internal `POST /api/v1/refunds` (system/admin), executed against Moyasar (`void` if not captured, `refund` if captured). States `pending → processed → failed` (retry on `failed`). Partial captures: where only part is refunded, the captured remainder feeds the wallet credit pipeline (§4) as compensation. Admin can issue a discretionary override refund (logged).

---

## 7. Dispute hold

From [client-booking](03-client-booking.md) §9 / [provider](04-provider.md) §11 (complaints, G4).

1. Client or provider raises a complaint on a booking → status `disputed`.
2. **Funds freeze:** if not yet captured, the hold is frozen (not voided); if captured but still in `pending`/clearance, the wallet credit is moved to a **dispute hold** (excluded from `available`, not withdrawable). Auto-confirm/clearance jobs are suspended for this booking.
3. Both parties submit evidence ([provider](04-provider.md) §11; client via `SHR-21`).
4. **Admin ops/finance** adjudicates → one of:
   - **Release to provider** → funds resume the §4 pipeline (`pending → available`).
   - **Refund to client** → full/partial refund per §6; remainder (if any) released to provider.
   - **Split** → partial refund + partial provider credit, commission recomputed on the provider portion.
5. Repeat-abuse outcomes may `suspend` an account ([personas-roles](../00-overview/02-personas-roles.md) §4). Every outcome writes immutable ledger rows + an audit record.

| Dispute outcome | Client | Provider | Platform |
|---|---|---|---|
| Provider wins | no refund | full net credit | commission |
| Client wins | full refund | nothing (penalty if at fault) | commission reversed |
| Split | partial refund | partial net credit | commission on provider share |

---

## 8. Reconciliation

| Mechanism | Cadence | Purpose |
|---|---|---|
| Gateway sync job | scheduled (BullMQ) | Reconcile Moyasar intents/charges/refunds against local Intent + Escrow states; resolve missing/duplicate webhooks. |
| Ledger invariant check | scheduled | Assert `available + pending + withdrawal_hold + dispute_hold == Σ(credits − debits)` per provider; alert on drift (Sentry). |
| Escrow custody check | scheduled | `Σ held + Σ dispute_held` reconciles to gateway-held + platform-captured-not-paid. |
| Payout batch reconciliation | per payout run | Match `paid` withdrawals to bank confirmations; flag `processing` stragglers and `failed` returns. |
| Commission report | admin dashboard | GMV, commission earned, per-tier, per-provider ([08-admin](../05-api-contracts/08-admin.md)). |
| Webhook idempotency | per event | Idempotency keys + event log prevent double capture/refund. |

The **ledger is append-only** (no row mutation/deletion); balances are always derived. All amounts in **SAR**, integer minor units (halalas) to avoid float drift.

---

## 9. End-to-end state machine (ASCII)

```
 BOOKING + PAYMENT INTENT
   created ──gateway authorize──▶ AUTHORIZED (ESCROW: held)
      │ decline/timeout                         │
      ▼                                         │ provider rejects/expires
   FAILED/VOIDED ◀───────────────────────────── void hold (100% back)
                                                │
                                         provider accepts (confirmed)
                                                │
                              ┌─── cancel (window §6) ───┐
                              ▼                          │
                  void / refund (100/50/0%)              │ service runs → completed
                              │                          ▼
                              │                  CAPTURE (ESCROW: captured)
                              │                          │
                              │                 commission split (tier §2)
                              │                          ▼
                              │                  WALLET: pending ──72h──▶ available
                              │                          │
                              │                          ▼
                              │                  WITHDRAWAL: requested(+step-up)
                              │                   → available→withdrawal_hold
                              │                          │
                              │              admin finance: approve / reject
                              │                  approve│        │reject → back to available
                              │                          ▼
                              │                  processing ──bank──▶ PAID (debited)
                              │                          └─ fail → back to available
                              ▼
                   DISPUTE (any time pre-payout):
                     freeze hold / move credit → DISPUTE HOLD (not withdrawable)
                       admin adjudicate → release(provider) / refund(client) / split
```

---

## 10. Hand-off

The client experience that triggers these money events is in **[03-client-booking.md](03-client-booking.md)** (book, cancel/reschedule, no-show, completion). The provider experience (earnings, wallet, withdrawal, packages, complaint response) is in **[04-provider.md](04-provider.md)**. Step-up re-auth for withdrawals/sensitive money actions is in **[02-authentication.md](02-authentication.md)** §7. API schemas: **[05-api-contracts/05-payments-payouts.md](../05-api-contracts/05-payments-payouts.md)** and admin tooling in **[08-admin.md](../05-api-contracts/08-admin.md)**.
