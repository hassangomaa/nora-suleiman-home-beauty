# User Flow — Client Booking

> **Scope.** The full client (`عميلة`) journey: discover → provider profile → service select → address → date/time slot (availability check) → review + add-ons → pay (escrow hold) → confirmation + reminders → provider "on the way" + QR check-in → service in progress → in-visit add-on → completion → release payment → rate & review. Includes **CANCEL** and **RESCHEDULE** sub-flows with refund-policy windows (**G1**) and **no-show** handling.
>
> **Roles.** Actor is an authenticated `client`. Counterpart is a `provider`. See [personas-roles](../00-overview/02-personas-roles.md) §3.
>
> **Gaps closed.** G1 (cancel/reschedule + refund policy), G5 (rating tied to completed booking), G8 (service duration + availability/conflict), G12 (saved addresses). Money mechanics detailed in [payments-payouts](05-payments-payouts.md) (**G2**).
>
> **Entry.** Reached after a valid session from [authentication](02-authentication.md), landing on `CLI-10`.

---

## 1. Booking status model

Canonical booking statuses used throughout this flow (mirrors [04-bookings](../05-api-contracts/04-bookings.md) and [data-model](../01-architecture/04-data-model.md)):

| Status | Meaning | Set by |
|---|---|---|
| `pending_provider` | Created + payment authorized (escrow hold); awaiting provider accept. | client (create) |
| `confirmed` | Provider accepted; reminders scheduled. | provider |
| `rejected` | Provider declined → full refund released. | provider |
| `expired` | Provider didn't respond within the accept window → full refund. | system |
| `on_the_way` | Provider marked en route. | provider |
| `checked_in` | QR check-in verified at the door. | client scan / provider present |
| `in_progress` | Service underway. | provider |
| `completed` | Service finished; capture + payout pipeline triggered. | provider, confirmed/auto by client |
| `cancelled_by_client` | Client cancelled (refund per window). | client |
| `cancelled_by_provider` | Provider cancelled (full client refund + penalty). | provider |
| `no_show_client` | Provider arrived; client unavailable. | provider + ops review |
| `no_show_provider` | Provider never arrived. | client report + ops review |
| `disputed` | Complaint raised; funds held. | client/provider → ops |

---

## 2. Screens involved

| ID | Name | Purpose |
|---|---|---|
| `CLI-10` | Client Home / Discover | Search entry: location + specialty + category tiles. |
| `CLI-11` | Search Results | Nearest providers list/map; filters & sort. |
| `CLI-12` | Provider Profile | Portfolio, services (price+duration), ratings, availability teaser. |
| `CLI-13` | Service Select | Pick service(s); shows duration; add-ons preview. |
| `CLI-14` | Address Picker | Saved addresses (G12) + map pin + new address. |
| `CLI-15` | Date/Time Slot | Availability calendar; conflict-aware slots. |
| `CLI-16` | Booking Review | Summary, add-ons, price breakdown, policy notice. |
| `CLI-17` | Payment Sheet | Moyasar (mada / Apple Pay / STC Pay / card); escrow hold. |
| `CLI-18` | Booking Confirmed | Success + reminders set + QR placeholder. |
| `CLI-22` | Booking Detail | Live status, "on the way", QR scan, actions. |
| `CLI-23` | QR Scanner | Scans provider-presented check-in QR. |
| `CLI-24` | In-Visit Add-on Approval | Approve provider-proposed add-on + incremental hold. |
| `CLI-25` | Completion / Release | Confirm completion → release escrow. |
| `CLI-26` | Rate & Review | Stars + written review (G5). |
| `CLI-27` | Cancel Booking | Shows refund window + amount; confirm. |
| `CLI-28` | Reschedule | New slot picker; policy notice. |
| `SHR-20` | Chat | Client ↔ provider messaging (with images). |
| `SHR-21` | Support / Complaint | Open ticket / file dispute. |

---

## 3. APIs called (by step)

| Step | Name | Method · Path | Auth/role |
|---|---|---|---|
| Search | `GET /providers/search` | `GET /api/v1/providers/search?lat&lng&specialty&q&sort` | client |
| Provider profile | `GET /providers/{id}` | `GET /api/v1/providers/{id}` | client |
| Provider services | `GET /providers/{id}/services` | `GET /api/v1/providers/{id}/services` | client |
| Saved addresses | `GET /me/addresses` · `POST /me/addresses` | `/api/v1/me/addresses` | client (self) |
| Availability | `GET /providers/{id}/availability` | `GET /api/v1/providers/{id}/availability?date&service_ids` | client |
| Quote | `POST /bookings/quote` | `POST /api/v1/bookings/quote` | client |
| Create booking | `POST /bookings` | `POST /api/v1/bookings` | client |
| Payment intent | `POST /payments/intents` | `POST /api/v1/payments/intents` | client |
| Confirm payment | (Moyasar SDK + webhook) `POST /payments/webhook` | gateway → server | webhook |
| Booking detail | `GET /bookings/{id}` | `GET /api/v1/bookings/{id}` | client (self) |
| QR check-in | `POST /bookings/{id}/checkin` | `POST /api/v1/bookings/{id}/checkin` | client (scan) |
| In-visit add-on approve | `POST /bookings/{id}/addons/{addonId}/approve` | client |
| Confirm completion | `POST /bookings/{id}/confirm-completion` | `POST /api/v1/bookings/{id}/confirm-completion` | client |
| Cancel | `POST /bookings/{id}/cancel` | `POST /api/v1/bookings/{id}/cancel` | client (self) |
| Reschedule | `POST /bookings/{id}/reschedule` | `POST /api/v1/bookings/{id}/reschedule` | client (self, req.) |
| Report no-show | `POST /bookings/{id}/report-no-show` | `POST /api/v1/bookings/{id}/report-no-show` | client |
| Rate/review | `POST /bookings/{id}/review` | `POST /api/v1/bookings/{id}/review` | client (after completion) |

> Schemas: [04-bookings](../05-api-contracts/04-bookings.md), [03-providers-services](../05-api-contracts/03-providers-services.md), [05-payments-payouts](../05-api-contracts/05-payments-payouts.md). Proximity search uses PostGIS `ST_DWithin` ([tech-stack](../01-architecture/01-tech-stack.md) §1).

---

## 4. Happy path

1. **Discover** — On `CLI-10` the client grants/uses location and picks a specialty (ميك أب / شعر / أظافر…) or searches free-text. App calls `GET /providers/search?lat&lng&specialty`.
2. **Results** — `CLI-11` lists nearest discoverable providers (only those with `profile_complete` + `accepting_bookings`, ranked by distance + rating + `visibility_boost` per [provider](04-provider.md)). Client taps a provider.
3. **Profile** — `CLI-12` loads `GET /providers/{id}` + `/services`. Client reviews portfolio, ratings, and the price+duration per service.
4. **Service select** — `CLI-13`: client selects one or more services. Each service carries a **duration** (G8) used to compute the total slot length and prevent conflicts.
5. **Address** — `CLI-14`: client picks a **saved address** (G12) or drops a new map pin (`POST /me/addresses`). Address determines the service location and is included in the booking.
6. **Date/time** — `CLI-15`: app calls `GET /providers/{id}/availability?date&service_ids`; server returns only slots that fit the summed duration without overlapping the provider's existing bookings/blocks. Client picks a slot.
7. **Review + add-ons** — `CLI-16`: app calls `POST /bookings/quote` → price breakdown (services + selected add-ons + any travel fee, total in SAR). The cancellation/refund policy (§8) is shown inline.
8. **Create** — Client taps **تأكيد الحجز / Confirm**. App calls `POST /bookings` → booking created in `pending_provider` with a short-lived hold token tying it to a payment intent.
9. **Pay (escrow hold)** — `CLI-17` opens the Moyasar payment sheet. App calls `POST /payments/intents` and runs the gateway flow (mada / Apple Pay / STC Pay / card). The amount is **authorized and held in escrow** — *not captured* — per [payments-payouts](05-payments-payouts.md) §3.
10. **Confirmation** — On a successful hold (gateway success + `payments/webhook` confirms), booking stays `pending_provider`; `CLI-18` shows success. The provider receives a push to accept.
11. **Provider accepts** — When the provider accepts ([provider](04-provider.md) §6), status → `confirmed`; the client gets a push; **reminders are scheduled** (BullMQ): T-24h and T-2h before the slot (G3, [tech-stack](../01-architecture/01-tech-stack.md) §1).
12. **On the way** — On the day, provider taps "في الطريق"; status → `on_the_way`; client gets a push and `CLI-22` shows it (MVP uses status + push, not live GPS — G9 deferred).
13. **QR check-in** — Provider presents a check-in QR; client opens `CLI-23` scanner and scans → `POST /bookings/{id}/checkin` → status `checked_in`. (Fallback: client-presents / provider-scans; both directions verify the same booking token — see §9.)
14. **In progress** — Provider marks start; status → `in_progress`.
15. **In-visit add-on (optional)** — Provider proposes an add-on; client approves on `CLI-24` → incremental escrow hold is authorized (§7).
16. **Completion** — Provider marks the service complete. Client confirms on `CLI-25` (`POST /bookings/{id}/confirm-completion`) → status `completed`. If the client does not confirm within an auto-confirm window (see [payments-payouts](05-payments-payouts.md) §4), the system auto-confirms.
17. **Release payment** — On `completed`, escrow is **captured**, commission is split per provider tier, and the provider wallet is credited ([payments-payouts](05-payments-payouts.md) §4). The client sees a final invoice.
18. **Rate & review** — `CLI-26`: client submits 1–5 stars + an optional written review (G5) via `POST /bookings/{id}/review`. This affects the provider's search ranking.

---

## 5. Decision branches

| Branch | Condition | Outcome |
|---|---|---|
| No providers found | `search` returns empty | `CLI-11` empty state (§6.1). |
| Slot taken between view & confirm | availability stale at `POST /bookings` | `409 slot_unavailable` → bounce to `CLI-15` to re-pick (§6.2). |
| Payment hold fails | gateway decline / webhook fail | Booking auto-voided; stay on `CLI-17` (§6.3). |
| Provider rejects | provider declines | status `rejected` → full refund auto-released; client prompted to book another. |
| Provider accept window elapses | no response in window | status `expired` → full refund; client notified. |
| Client cancels | client action | `cancelled_by_client` + refund per window (§8). |
| Provider cancels | provider action | `cancelled_by_provider` → full client refund + provider penalty ([payments-payouts](05-payments-payouts.md) §6). |
| Reschedule | client/provider request | new slot; original hold preserved (§8.3). |
| Client no-show | provider reports | `no_show_client` → ops review; partial/no refund (§9.2). |
| Provider no-show | client reports | `no_show_provider` → full refund + penalty (§9.2). |
| Dispute | complaint filed | `disputed`; funds held ([payments-payouts](05-payments-payouts.md) §7). |

---

## 6. Unhappy paths

### 6.1 No providers found
`GET /providers/search` returns `[]`. `CLI-11` shows an empty state: "لا توجد مقدّمات خدمة قريبة / No providers nearby." Actions: widen radius, change specialty, clear filters, or enable broader location. No booking can start. (Server may suggest the nearest few outside the default radius as a soft fallback.)

### 6.2 Slot no longer available
Two clients race for one slot, or the provider blocked the time. `POST /bookings` (or `quote`) returns `409 slot_unavailable`. The client is returned to `CLI-15`, availability is re-fetched, and the taken slot is greyed out. No payment is attempted until a valid slot is held.

### 6.3 Payment / escrow hold failure
On `CLI-17` the gateway declines (insufficient funds, 3DS fail, mada rejection) or the `payments/webhook` does not confirm the hold within the timeout. Handling:
- Booking remains `pending_provider` only while a hold is pending; if the hold is not confirmed it is **auto-voided** and the provisional slot lock is released.
- `CLI-17` shows a retry with an alternate method; the slot is held for a short grace window so the client can retry without losing it.
- Repeated failure → return to `CLI-16` with the slot released. Full state machine in [payments-payouts](05-payments-payouts.md) §3.

---

## 7. In-visit add-on

1. During `in_progress`, the provider proposes an add-on (extra service/time) from `PRV-23`.
2. Client receives a push and opens `CLI-24` showing the add-on, price, and the **incremental** amount.
3. Client approves → `POST /bookings/{id}/addons/{addonId}/approve` authorizes an **additional escrow hold** for the delta (same payment method).
4. Decline → service continues at the original scope; no change.
5. The add-on amount is captured together with the base amount at completion and flows through the same commission split ([payments-payouts](05-payments-payouts.md) §4).

---

## 8. CANCEL & RESCHEDULE sub-flows (G1)

### 8.1 Refund-policy windows (canonical)

Measured from the scheduled start time. Applied at `POST /bookings/{id}/cancel`; the exact percentages are admin-configurable in the dashboard (defaults below; final values set in SRS):

| Window before start | Client-initiated cancel refund | Notes |
|---|---|---|
| Before provider accepts (`pending_provider`) | **100%** | Hold voided, never captured. |
| ≥ 24 h | **100%** | Free cancellation window. |
| 6 h – 24 h | **50%** | Partial; remainder treated as provider compensation. |
| < 6 h | **0%** | No refund (provider time reserved). |
| Provider-initiated cancel (any time) | **100%** to client | Plus provider penalty ([payments-payouts](05-payments-payouts.md) §6). |
| Provider no-show | **100%** to client | Plus penalty (§9.2). |

The applicable window and refund amount are always **previewed on `CLI-27` before the client confirms**, computed server-side via the cancel quote in the same endpoint family.

### 8.2 Cancel flow
1. From `CLI-22` the client taps **إلغاء / Cancel** → `CLI-27`.
2. App requests a cancel preview; server returns the window bucket + refund amount.
3. Client confirms → `POST /bookings/{id}/cancel`.
4. Server sets `cancelled_by_client`, releases/partial-refunds the escrow per §8.1, cancels scheduled reminders, and notifies the provider.
5. Edge: cancel attempted after `checked_in`/`in_progress` → blocked (`409 not_cancellable`); the client must use the dispute/complaint path (`SHR-21`).

### 8.3 Reschedule flow
1. From `CLI-22` the client taps **إعادة جدولة / Reschedule** → `CLI-28`.
2. App re-checks availability (`GET /providers/{id}/availability`) for the same service set/duration.
3. Client picks a new slot → `POST /bookings/{id}/reschedule { new_slot }`.
4. Reschedule is a **request** if the provider must re-accept (per [personas-roles](../00-overview/02-personas-roles.md) §3 "reschedule = self (req.)"); the **existing escrow hold is preserved** — no re-charge for an equal-price slot. A price delta (e.g. add-on change) is handled as an incremental hold/partial refund.
5. Reschedule frequency is limited (e.g. 1 free reschedule; further ones may follow the cancel window). Late reschedule (< 6 h) may be treated like a cancel under §8.1.
6. Provider declines the reschedule → original slot stands, or the client may cancel under §8.1.

---

## 9. QR check-in & no-show

### 9.1 QR check-in
- The booking carries a single-use, time-boxed check-in token bound to `booking_id`.
- **Primary:** provider presents QR (`PRV` side) → client scans on `CLI-23` → `POST /bookings/{id}/checkin` with the token → status `checked_in`.
- **Fallback:** client presents QR from `CLI-22` → provider scans. Either direction verifies the same token.
- Edge: scanning a token for the wrong/expired booking → `422 invalid_checkin_token`; manual ops verification path available via `SHR-21`.

### 9.2 No-show handling
| Type | Trigger | Status | Money |
|---|---|---|---|
| Provider no-show | Client taps "لم تصل / Didn't arrive" on `CLI-22` after the slot start + grace | `no_show_provider` (ops-reviewed) | Full client refund + provider penalty. |
| Client no-show | Provider reports the client unavailable at the door after grace | `no_show_client` (ops-reviewed) | Per policy: no/partial refund (provider time reserved); funds may be captured as compensation. |

Both no-show types are flagged to admin ops for review before final settlement and feed the cancellation/no-show success metric ([product-brief](../00-overview/01-product-brief.md) §8). Disputes route to `disputed` and [payments-payouts](05-payments-payouts.md) §7.

---

## 10. ASCII flow diagram

```
 CLI-10 Discover ──GET /providers/search──▶ CLI-11 Results
     │                                          │ (empty? → empty state)
     │                                          ▼
     │                                   CLI-12 Provider Profile
     │                                          │
     │                                   CLI-13 Service Select (duration, G8)
     │                                          ▼
     │                                   CLI-14 Address (saved, G12)
     │                                          ▼
     │                          GET /availability  CLI-15 Date/Time
     │                                          │  (slot taken? → 409 → re-pick)
     │                                          ▼
     │                          POST /bookings/quote  CLI-16 Review + add-ons
     │                                          ▼
     │                          POST /bookings  ──▶ status: pending_provider
     │                                          ▼
     │                          POST /payments/intents  CLI-17 Pay (ESCROW HOLD)
     │                            success │      │ fail → void + retry (6.3)
     │                                    ▼
     │                            CLI-18 Confirmed  (provider push to accept)
     │                                    │
     │            ┌───────────────────────┼───────────────────────┐
     │        reject/expire           accept                    (timeout)
     │            │                       │
     │       full refund          status: confirmed ──▶ schedule reminders (T-24h, T-2h)
     │                                    │
     │                            provider "on the way" → on_the_way (push)
     │                                    ▼
     │                            CLI-23 QR scan → POST /checkin → checked_in
     │                                    ▼
     │                            in_progress ──(add-on?)──▶ CLI-24 approve → +hold
     │                                    ▼
     │                            provider mark complete
     │                                    ▼
     │                    CLI-25 confirm-completion (or auto) → status: completed
     │                                    ▼
     │                    ESCROW CAPTURE → commission split → provider wallet
     │                                    ▼
     │                            CLI-26 Rate & Review (G5)
     │
 Sub-flows from CLI-22 Booking Detail:
   Cancel  → CLI-27 (preview refund window §8.1) → POST /cancel → cancelled_by_client + refund
   Resched → CLI-28 (re-check availability) → POST /reschedule (req.) → keep escrow hold
   No-show → POST /report-no-show → no_show_provider/client → ops review
   Dispute → SHR-21 → status disputed → funds held
```

---

## 11. Hand-off

Money mechanics (escrow hold/capture, commission, refunds, dispute holds) are specified end-to-end in **[05-payments-payouts.md](05-payments-payouts.md)**. The provider side of every shared step (accept, on-the-way, QR present, complete) is in **[04-provider.md](04-provider.md)**.
