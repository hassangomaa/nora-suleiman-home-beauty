# Glossary & Canonical Enums

> **Authoritative.** This is the single source of truth for domain vocabulary (AR/EN) and for the status **enums** used across the API, data model, and UI. Enum string values are canonical (`snake_case`) and **must** match the data model and [API contracts](../05-api-contracts/01-conventions.md). UI labels come from here; status colors from [design-system colors §3](../02-design-system/01-colors.md) and the [StatusChip](../02-design-system/04-components.md) component. Roles are defined in [personas-roles](02-personas-roles.md).

---

## 1. Domain terms (AR / EN)

| Term (EN) | Term (AR) | Meaning |
|---|---|---|
| Client | عميلة | A woman who discovers, books, and pays for home-beauty services. Role `client`. |
| Provider | مقدّمة خدمة | A freelance professional (makeup, hair, nails, etc.) delivering services at the client's home. Role `provider`. |
| Admin / Operator | إدارة | Smart Lead Tech staff managing the platform (sub-roles: super_admin / ops / finance / support). Role `admin`. |
| Service category | فئة الخدمة | Top-level grouping of services (e.g. مكياج / تصفيف شعر / عناية بالأظافر). |
| Service | خدمة | A specific offering by a provider with name, **price**, and **duration**. |
| Portfolio | معرض الأعمال | A provider's gallery of past-work images shown on her profile; ≥1 item required to be discoverable. |
| Availability calendar | تقويم التوفّر | The provider's bookable dates/time slots. |
| Booking | حجز | A client's reserved appointment for a service at a date/time and address. |
| Time slot | الموعد / الفترة | A selectable appointment time within availability. |
| Reschedule | إعادة جدولة | A request to move a confirmed booking to a new slot (requires counterpart/admin acceptance). |
| Cancellation | إلغاء | Termination of a booking before completion, subject to the refund policy. |
| Refund policy | سياسة الاسترداد | Rules determining how much is refunded on cancellation by stage. |
| QR check-in | تسجيل الوصول برمز QR | On arrival, the client scans / the provider presents a QR to verify the provider reached the address and start the service safely. |
| "On the way" status | حالة "في الطريق" | Provider has departed toward the client (MVP substitute for live GPS tracking). |
| Escrow | الضمان (حجز المبلغ) | Client payment held by the platform and released to the provider only after the booking is completed. |
| Wallet | المحفظة | A provider's in-app balance accumulating released earnings, drawn down by withdrawals. |
| Payout / Withdrawal | تحويل / سحب الأرباح | Transfer of wallet funds to the provider's bank account, approved/processed by admin (finance). |
| Commission | العمولة | The platform's percentage cut of each completed payment. |
| Commission tier | شريحة العمولة | Provider tier (beginner / mid / established) that determines the commission %. |
| Visibility package | باقة الظهور | Paid boost (Silver / Gold / Platinum) raising a provider's search ranking for a duration. |
| Silver package | باقة فضية | Visibility boost for ~2–3 days. |
| Gold package | باقة ذهبية | Visibility boost for ~5 days; premium badge. |
| Platinum package | باقة بلاتينية | Visibility boost for ~10 days; highest premium badge. |
| Sales points | نقاط المبيعات | Points earned from sales (e.g. SAR 1,000 → 100 pts), redeemable for ads / boosted visibility. |
| Premium badge | شارة مميّزة | Visual mark on premium (Gold/Platinum) providers (gold `secondary` tokens). |
| Rating | التقييم | A 1–5 star score given by a client after a completed booking. |
| Review | المراجعة | The written feedback accompanying a rating; influences provider ranking. |
| OTP | رمز التحقق (OTP) | One-time 6-digit code sent by SMS to verify a phone number at sign-up/login. |
| Saved address | العنوان المحفوظ | A client's stored service location (home/work) reused at booking. |
| Payment method | وسيلة الدفع | Card / mada / Apple Pay / STC Pay used to pay for a booking. |
| Invoice | الفاتورة | The itemized record of a paid booking (service, commission, total). |
| Complaint / Dispute | شكوى / نزاع | A formal issue raised by a client or provider, resolved by admin. |
| Support ticket | تذكرة الدعم | An in-app support request handled by the support team. |
| Notification | الإشعار | A push/in-app message (confirmation, reminder, broadcast, etc.). |
| Promotional broadcast | رسالة ترويجية | An admin-sent promotional notification to a user segment. |
| Account state | حالة الحساب | Lifecycle status of a user account (see [enum §11](#11-account-state)). |
| Tier (provider) | مستوى المقدّمة | beginner / mid / established capability/commission tier. |
| Discoverable | قابلة للظهور | Provider meets requirements (profile_complete) to appear in search. |
| Accepting bookings | متاحة للحجز | Provider toggled "open for work" with availability set. |
| GMV | إجمالي قيمة المبيعات | Gross Merchandise Value — total transacted amount (tracked, not optimized year one). |

---

## 2. Enum conventions

- Values are lowercase `snake_case` strings, stable across API/DB/UI.
- Each table is **canonical**: do not add/rename values without a data-model migration.
- "Color" references map to [colors §3](../02-design-system/01-colors.md) semantic tokens and are rendered via [StatusChip](../02-design-system/04-components.md) (icon + label, never color alone).

---

## 3. Booking status — `booking_status`

| Value | AR label | EN label | Meaning | Color token |
|---|---|---|---|---|
| `pending` | بانتظار التأكيد | Pending | Created by client; awaiting provider acceptance. | `warning/500` |
| `confirmed` | مؤكّد | Confirmed | Provider accepted; appointment locked. | `info/500` |
| `on_the_way` | في الطريق | On the way | Provider departed toward the client's address. | `info/500` |
| `in_progress` | جارٍ التنفيذ | In progress | QR check-in done; service is being delivered. | `primary/500` |
| `completed` | مكتمل | Completed | Service finished; escrow eligible for release. | `success/500` |
| `cancelled` | ملغي | Cancelled | Terminated before completion (by client/provider/admin) per refund policy. | `error/500` |
| `reschedule_requested` | طلب إعادة جدولة | Reschedule requested | A move to a new slot is requested and pending acceptance. | `warning/500` |

---

## 4. Payment status — `payment_status`

| Value | AR label | EN label | Meaning |
|---|---|---|---|
| `pending` | قيد المعالجة | Pending | Payment initiated, not yet authorized/captured. |
| `authorized` | محجوز | Authorized | Funds reserved on the card (pre-capture). |
| `held_in_escrow` | محتجز في الضمان | Held in escrow | Captured and held by platform pending completion. |
| `released` | تم التحرير | Released | Funds released from escrow to the provider's wallet. |
| `refunded` | مُسترد | Refunded | Full amount returned to the client. |
| `partially_refunded` | مُسترد جزئياً | Partially refunded | Part of the amount returned (per refund policy). |
| `failed` | فشل الدفع | Failed | Charge attempt failed. |

---

## 5. Payout status — `payout_status`

| Value | AR label | EN label | Meaning |
|---|---|---|---|
| `requested` | تم الطلب | Requested | Provider submitted a withdrawal request. |
| `approved` | تمت الموافقة | Approved | Finance approved; queued for transfer. |
| `processing` | قيد التحويل | Processing | Bank transfer in progress. |
| `paid` | تم الدفع | Paid | Funds delivered to the provider's bank account. |
| `rejected` | مرفوض | Rejected | Request declined (e.g. KYC/balance issue); funds stay in wallet. |
| `failed` | فشل التحويل | Failed | Transfer attempt failed; amount returned to wallet. |

---

## 6. Account state — `account_state`

| Value | AR label | EN label | Meaning |
|---|---|---|---|
| `pending_otp` | بانتظار التحقق | Pending OTP | Phone entered; OTP not yet verified. |
| `active` | نشِط | Active | Verified and usable (providers active immediately — no approval queue). |
| `suspended` | موقوف | Suspended | Admin-blocked (abuse/complaint outcome); cannot transact. |
| `deactivated` | معطّل | Deactivated | User-initiated; reactivatable by re-auth. |

> Mirrors the [account lifecycle](02-personas-roles.md#4-account-lifecycle--states). Provider capability sub-flags (`profile_complete`, `accepting_bookings`, `tier`, `visibility_boost`) are independent of this state.

---

## 7. Complaint / dispute status — `complaint_status`

| Value | AR label | EN label | Meaning |
|---|---|---|---|
| `open` | مفتوحة | Open | Filed by a client or provider; awaiting triage. |
| `under_review` | قيد المراجعة | Under review | Admin (ops) is investigating. |
| `awaiting_response` | بانتظار الرد | Awaiting response | Waiting on the counterpart or filer for info. |
| `resolved` | تم الحل | Resolved | Closed with an outcome (refund/warning/none). |
| `rejected` | مرفوضة | Rejected | Closed as invalid/unsubstantiated. |
| `escalated` | مُصعّدة | Escalated | Raised to super_admin/finance for a higher decision. |

---

## 8. Notification type — `notification_type`

| Value | AR label | EN label | Meaning |
|---|---|---|---|
| `booking_confirmation` | تأكيد الحجز | Booking confirmation | Booking accepted/confirmed. |
| `appointment_reminder` | تذكير بالموعد | Appointment reminder | Upcoming-appointment reminder. |
| `on_the_way` | في الطريق | On the way | Provider has departed to the client. |
| `booking_cancelled` | إلغاء الحجز | Booking cancelled | A booking was cancelled. |
| `reschedule_request` | طلب إعادة جدولة | Reschedule request | A reschedule was requested. |
| `payment_receipt` | إيصال الدفع | Payment receipt | Payment succeeded / invoice ready. |
| `payout_update` | تحديث التحويل | Payout update | Withdrawal status changed. |
| `new_message` | رسالة جديدة | New message | New chat message received. |
| `new_review` | تقييم جديد | New review | A client left a rating/review. |
| `promotional` | رسالة ترويجية | Promotional | Admin marketing broadcast. |
| `system` | إشعار النظام | System | Account/security/system notice. |

---

## 9. Support ticket status — `ticket_status`

| Value | AR label | EN label | Meaning |
|---|---|---|---|
| `new` | جديدة | New | Opened by user; unassigned. |
| `open` | مفتوحة | Open | Acknowledged/assigned to support. |
| `pending_user` | بانتظار العميلة | Pending user | Awaiting reply from the requester. |
| `on_hold` | معلّقة | On hold | Paused (dependency/third party). |
| `resolved` | تم الحل | Resolved | Answer provided; pending confirmation/auto-close. |
| `closed` | مغلقة | Closed | Finalized. |

---

## 10. Provider commission tier — `commission_tier`

| Value | AR label | EN label | Meaning |
|---|---|---|---|
| `beginner` | مبتدئة | Beginner | New/low-volume provider; default tier. |
| `mid` | متوسطة | Mid | Established volume; adjusted commission %. |
| `established` | محترفة | Established | High-performing provider; preferential commission %. |

> Exact percentages are admin-configurable per the [revenue model](01-product-brief.md#6-revenue-model-admin-configurable).

---

## 11. Visibility package — `visibility_package`

| Value | AR label | EN label | Duration | Meaning |
|---|---|---|---|---|
| `none` | بدون | None | — | No active boost. |
| `silver` | فضية | Silver | ~2–3 days | Entry boost to search ranking. |
| `gold` | ذهبية | Gold | ~5 days | Mid boost + premium badge. |
| `platinum` | بلاتينية | Platinum | ~10 days | Top boost + highest premium badge. |

> Durations are meeting-derived defaults; final values set in the signed SRS / admin config.
