# API Contracts — Chat & Notifications

> **Scope.** Real-time chat over Socket.IO (handshake, events, presence, read receipts) with a REST fallback (conversations, messages, image upload via signed URL, mark-read), plus push/in-app notifications: device-token registration, listing, mark-read, preferences, the appointment-reminder scheduler, and the admin promotional broadcast. Entities & enums per [../01-architecture/04-data-model.md](../01-architecture/04-data-model.md) and [../00-overview/03-glossary.md](../00-overview/03-glossary.md).
>
> **Stack.** NestJS + Socket.IO gateway · Prisma/PostgreSQL · Redis adapter for multi-node socket fan-out & presence · S3-compatible storage (signed URLs) for chat media · Expo Notifications → FCM/APNs · BullMQ/Redis for scheduled reminders. Money/none here; all times ISO-8601 `timestamptz`.

> **Conventions.** Reuses the canonical envelope, error shape, pagination, and auth defined in [05-payments-payouts.md](05-payments-payouts.md) §0 (since `01-conventions.md` does not yet exist in this folder).

---

## 1. Enums (canonical)

### `conversation_type` (`ConversationType`)
`booking` (chat tied to a `Booking`) · `support` (user ↔ support team).

### `message_type` (`MessageType`)
`text` · `image` · `system` (system-generated, e.g. "Provider is on the way").

### `notification_type` (`NotificationType`) — canonical glossary set
`booking_confirmation` · `appointment_reminder` · `on_the_way` · `booking_cancelled` · `reschedule_request` · `payment_receipt` · `payout_update` · `new_message` · `new_review` · `promotional` · `system`.

### `notification_channel` (`NotificationChannel`)
`push` · `in_app`.

---

## 2. Chat over Socket.IO

### 2.1 Connection & auth handshake

**Endpoint:** `wss://api.nora-beauty.app/realtime` · **Namespace:** `/chat` · transports: `websocket` (polling fallback).

**Auth:** the access JWT is passed in the connection `auth` payload (preferred) or `Authorization` header during the upgrade.

```js
const socket = io("wss://api.nora-beauty.app/realtime/chat", {
  transports: ["websocket"],
  auth: { token: "<access_jwt>" }
});
```

On connect the server validates the JWT, loads the user, joins per-user room `user:<userId>` and one room per conversation the user participates in (`conversation:<conversationId>`), then emits `connection:ready`.

**`connection:ready` (server → client):**
```json
{
  "userId": "ckusr_client01",
  "activeRole": "client",
  "conversations": ["ckconv_aa", "ckconv_bb"],
  "serverTime": "2026-06-29T11:30:00.000Z"
}
```

**Disconnect / errors:** invalid or expired token → `connect_error` with `{ "code": "unauthenticated" }` and the socket is refused. Account `suspended`/`deactivated` → `{ "code": "forbidden" }`. Tokens are re-validated on reconnect; clients should refresh the access token (REST) and reconnect.

---

### 2.2 Events

All event payloads use camelCase. A `clientId` (client-generated UUID) accompanies sends for optimistic UI and server idempotency (maps to `Message.clientId`).

| Direction | Event | Payload | Notes |
|---|---|---|---|
| C → S | `message:send` | `{ conversationId, type, body?, media?, clientId }` | `type` ∈ `text`/`image`. For `image`, `media` = `{ url, width, height }` from a confirmed signed-URL upload (§2.4 / 3.4). Ack callback returns the persisted message. |
| S → C | `message:received` | full `Message` object | Broadcast to all participants' rooms (including sender for confirmation). |
| C → S | `typing:start` / `typing:stop` | `{ conversationId }` | Throttled server-side; relayed to other participant only. |
| S → C | `typing` | `{ conversationId, userId, isTyping }` | |
| C → S | `message:read` | `{ conversationId, lastReadMessageId }` | Marks all messages up to and including this id as read for the caller. |
| S → C | `message:read:receipt` | `{ conversationId, userId, lastReadMessageId, readAt }` | Read-receipt fan-out to the counterpart. |
| S → C | `presence` | `{ userId, status, lastSeenAt }` | `status` ∈ `online`/`offline`; backed by Redis presence keys. |
| C → S | `presence:subscribe` | `{ userIds: [] }` | Subscribe to presence of conversation counterparts. |
| S → C | `error` | `{ event, code, message }` | Per-event error (e.g. `not_a_participant`). |

**`message:send` ack (callback) — success:**
```json
{
  "ok": true,
  "message": {
    "id": "ckmsg_91",
    "conversationId": "ckconv_aa",
    "senderId": "ckusr_client01",
    "type": "text",
    "body": "السلام عليكم، هل تتوفرين الخميس الساعة ٥ مساءً؟",
    "mediaUrl": null,
    "clientId": "1f0a8e2c-7b44-4f0a-9b9d-2c1d3e4f5a6b",
    "readAt": null,
    "createdAt": "2026-06-29T11:31:02.000Z"
  }
}
```

**`message:send` ack — error:**
```json
{ "ok": false, "code": "not_a_participant", "message": "You are not a participant of this conversation." }
```

**Socket error codes:** `unauthenticated`, `forbidden`, `not_a_participant`, `conversation_not_found`, `validation_error`, `message_too_long` (body > 4000 chars), `media_not_confirmed` (image url not from a confirmed upload), `rate_limited`.

> If a recipient is offline, `message:received` is not delivered over socket; instead a `new_message` push notification is generated (§4) and the message is fetched on next REST sync.

---

### 2.3 REST fallback — list conversations

`GET /conversations`
**Auth:** `client` or `provider` (own conversations).
**Description:** Paginated conversations, ordered by `lastMessageAt` desc, with the counterpart, last message preview, and unread count.

**Query params:** `limit`, `cursor`, `type` (`booking` | `support`, optional).

**Success `200`:**
```json
{
  "data": [
    {
      "id": "ckconv_aa",
      "type": "booking",
      "bookingId": "ckbk_7QF3a1b2c3",
      "bookingReference": "NB-7QF3",
      "counterpart": { "userId": "ckusr_prov07", "fullName": "نورة سليمان", "avatarUrl": "https://cdn.nora-beauty.app/av/prov07.jpg", "presence": "online" },
      "lastMessage": { "id": "ckmsg_91", "type": "text", "preview": "السلام عليكم، هل تتوفرين الخميس...", "senderId": "ckusr_client01", "createdAt": "2026-06-29T11:31:02.000Z" },
      "unreadCount": 0,
      "lastMessageAt": "2026-06-29T11:31:02.000Z"
    }
  ],
  "meta": { "nextCursor": "eyJpZCI6ImNrY29udl9iYiJ9", "hasMore": true, "limit": 20 }
}
```

**Errors:** `401 unauthenticated`, `403 forbidden`.

---

### 2.4 REST fallback — list messages

`GET /conversations/:id/messages`
**Auth:** `client`/`provider` participant of the conversation.
**Description:** Paginated message history, newest first (reverse-chronological cursor).

**Query params:** `limit` (default 30, max 100), `cursor`.

**Success `200`:**
```json
{
  "data": [
    {
      "id": "ckmsg_91",
      "conversationId": "ckconv_aa",
      "senderId": "ckusr_client01",
      "type": "text",
      "body": "السلام عليكم، هل تتوفرين الخميس الساعة ٥ مساءً؟",
      "mediaUrl": null,
      "mediaWidth": null,
      "mediaHeight": null,
      "clientId": "1f0a8e2c-7b44-4f0a-9b9d-2c1d3e4f5a6b",
      "readAt": null,
      "createdAt": "2026-06-29T11:31:02.000Z"
    },
    {
      "id": "ckmsg_92",
      "conversationId": "ckconv_aa",
      "senderId": "ckusr_prov07",
      "type": "image",
      "body": null,
      "mediaUrl": "https://cdn.nora-beauty.app/chat/ckconv_aa/8f3.jpg?X-Amz-Expires=900&...",
      "mediaWidth": 1080,
      "mediaHeight": 1440,
      "clientId": "9a2b...",
      "readAt": "2026-06-29T11:35:00.000Z",
      "createdAt": "2026-06-29T11:33:40.000Z"
    }
  ],
  "meta": { "nextCursor": "eyJpZCI6ImNrbXNnXzgwIn0", "hasMore": true, "limit": 30 }
}
```
`mediaUrl` is returned as a freshly signed GET URL (TTL 15m).

**Errors:** `401 unauthenticated`, `403 not_a_participant`, `404 conversation_not_found`.

---

### 2.5 REST fallback — send message

`POST /conversations/:id/messages`
**Auth:** `client`/`provider` participant.
**Description:** Persists a message (used when the socket is unavailable). The server still fans the message out over Socket.IO to online participants. Idempotent on `clientId`.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `type` | enum | required; `text` or `image`. |
| `body` | string | required if `type=text`; 1–4000 chars; must be absent/empty for `image`. |
| `media` | object | required if `type=image`: `{ url (confirmed signed-upload key), width (int>0), height (int>0) }`. |
| `clientId` | string (uuid) | required; idempotency key. |

```json
{
  "type": "text",
  "body": "تمام، الموعد الساعة ٥ مساءً يوم الخميس ٢ يوليو.",
  "clientId": "3c7d9e10-2a4b-4c6d-8e0f-1a2b3c4d5e6f"
}
```

**Success `201`:** the persisted `Message` (same shape as §2.4 item).

**Errors:**
| Status | code | When |
|---|---|---|
| 422 | `validation_error` | bad/missing field. |
| 422 | `message_too_long` | body > 4000 chars. |
| 422 | `media_not_confirmed` | image `url` not a confirmed upload. |
| 403 | `not_a_participant` | caller not in conversation. |
| 404 | `conversation_not_found` | unknown id. |
| 409 | `duplicate_client_id` | replay returns the original message with `200`. |

---

### 2.6 REST fallback — mark conversation read

`POST /conversations/:id/read`
**Auth:** participant.
**Description:** Marks all messages up to `lastReadMessageId` as read and resets unread count; emits `message:read:receipt`.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `lastReadMessageId` | string (cuid) | required; must belong to the conversation. |

```json
{ "lastReadMessageId": "ckmsg_92" }
```

**Success `200`:**
```json
{ "data": { "conversationId": "ckconv_aa", "lastReadMessageId": "ckmsg_92", "unreadCount": 0, "readAt": "2026-06-29T11:35:10.000Z" } }
```

**Errors:** `403 not_a_participant`, `404 conversation_not_found`, `422 validation_error`.

---

### 2.7 Chat image upload — signed URL

`POST /conversations/:id/media/upload-url`
**Auth:** participant.
**Description:** Returns a short-lived S3 **signed PUT URL** for a chat image. The client uploads the bytes directly to S3, then references the returned `key` as `media.url` in `message:send` / `POST messages`. The server marks the key confirmed once the object exists (verified on first message reference or via HEAD).

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `contentType` | string | required; one of `image/jpeg` `image/png` `image/webp`. |
| `sizeBytes` | integer | required; `1 <= sizeBytes <= 8388608` (8 MB). |

```json
{ "contentType": "image/jpeg", "sizeBytes": 524288 }
```

**Success `201`:**
```json
{
  "data": {
    "key": "chat/ckconv_aa/2026/06/8f3a91.jpg",
    "uploadUrl": "https://nora-media.s3.me-central-1.amazonaws.com/chat/ckconv_aa/2026/06/8f3a91.jpg?X-Amz-Signature=...&X-Amz-Expires=900",
    "method": "PUT",
    "headers": { "Content-Type": "image/jpeg" },
    "expiresAt": "2026-06-29T11:48:00.000Z"
  }
}
```

**Errors:** `403 not_a_participant`, `404 conversation_not_found`, `422 unsupported_media_type`, `422 file_too_large`.

---

## 3. Notifications

### 3.1 Register device token

`POST /notifications/devices`
**Auth:** any authenticated user (`client`/`provider`).
**Description:** Registers/refreshes an Expo push token for the caller's device. Idempotent on `expoPushToken` (re-registration updates `lastSeenAt` and platform).

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `expoPushToken` | string | required; must match `ExponentPushToken[...]` format. |
| `platform` | enum | required; `ios` or `android`. |
| `deviceName` | string | optional; max 120 chars. |

```json
{ "expoPushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]", "platform": "ios", "deviceName": "iPhone 15 — نورة" }
```

**Success `201`:**
```json
{ "data": { "id": "ckdev_01", "platform": "ios", "registeredAt": "2026-06-29T11:50:00.000Z" } }
```

**Errors:** `401 unauthenticated`, `422 validation_error` (bad token format/platform).

---

### 3.2 Unregister device token

`DELETE /notifications/devices/:token`
**Auth:** owner.
**Description:** Removes a device token (logout / push disable). `:token` is URL-encoded `expoPushToken`.
**Success `204`:** empty body.
**Errors:** `401 unauthenticated`, `404 device_not_found`.

---

### 3.3 List notifications

`GET /notifications`
**Auth:** owner (`client`/`provider`).
**Description:** Paginated in-app notification feed, newest first, with an unread badge count in `meta`.

**Query params:** `limit`, `cursor`, `unread` (boolean, optional), `type` (enum `NotificationType`, optional).

**Success `200`:**
```json
{
  "data": [
    {
      "id": "cknot_aa",
      "type": "appointment_reminder",
      "channel": "push",
      "titleAr": "تذكير بموعدك",
      "bodyAr": "موعدك مع نورة سليمان غداً الخميس الساعة ٥:٠٠ مساءً.",
      "data": { "deepLink": "norabeauty://bookings/ckbk_7QF3a1b2c3", "bookingId": "ckbk_7QF3a1b2c3" },
      "readAt": null,
      "sentAt": "2026-07-01T17:00:00.000Z",
      "createdAt": "2026-07-01T17:00:00.000Z"
    }
  ],
  "meta": { "nextCursor": "eyJpZCI6ImNrbm90X2FiIn0", "hasMore": true, "limit": 20, "unreadCount": 3 }
}
```

**Errors:** `401 unauthenticated`, `422 validation_error`.

---

### 3.4 Mark notification(s) read

`POST /notifications/read`
**Auth:** owner.
**Description:** Marks specific notifications, or all, as read.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `ids` | string[] (cuid) | optional; mutually exclusive with `all`; each must belong to caller. |
| `all` | boolean | optional; if `true` marks all unread read. Exactly one of `ids`/`all` required. |

```json
{ "ids": ["cknot_aa", "cknot_ab"] }
```

**Success `200`:**
```json
{ "data": { "markedRead": 2, "unreadCount": 1 } }
```

**Errors:** `401 unauthenticated`, `422 validation_error` (neither/both of `ids`/`all`), `404 notification_not_found`.

---

### 3.5 Get notification preferences

`GET /notifications/preferences`
**Auth:** owner.
**Description:** Returns per-type channel preferences. Transactional types (`booking_confirmation`, `payment_receipt`, `payout_update`, `system`) cannot be fully disabled; only `promotional` and reminder/chat noise are user-controllable.

**Success `200`:**
```json
{
  "data": {
    "pushEnabled": true,
    "quietHours": { "enabled": true, "startLocal": "23:00", "endLocal": "08:00", "timezone": "Asia/Riyadh" },
    "types": {
      "appointment_reminder": { "push": true, "inApp": true },
      "new_message": { "push": true, "inApp": true },
      "new_review": { "push": true, "inApp": true },
      "promotional": { "push": false, "inApp": true },
      "booking_confirmation": { "push": true, "inApp": true, "locked": true },
      "payment_receipt": { "push": true, "inApp": true, "locked": true },
      "payout_update": { "push": true, "inApp": true, "locked": true },
      "system": { "push": true, "inApp": true, "locked": true }
    }
  }
}
```

**Errors:** `401 unauthenticated`.

---

### 3.6 Update notification preferences

`PATCH /notifications/preferences`
**Auth:** owner.
**Description:** Partial update. Attempts to disable a `locked` type are rejected.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `pushEnabled` | boolean | optional. |
| `quietHours` | object | optional; `{ enabled, startLocal "HH:mm", endLocal "HH:mm" }`. |
| `types` | object | optional; map of `NotificationType` → `{ push?: boolean, inApp?: boolean }`; `locked` types may not be disabled. |

```json
{ "types": { "promotional": { "push": false, "inApp": false }, "appointment_reminder": { "push": true } } }
```

**Success `200`:** the full preferences object (same shape as §3.5).

**Errors:** `401 unauthenticated`, `422 validation_error`, `422 locked_type` (attempt to disable a locked transactional type).

---

### 3.7 Admin — promotional broadcast

`POST /notifications/broadcast`
**Auth:** `admin` (`super_admin` or `ops`).
**Description:** Sends a `promotional` notification to a targeted user segment via push + in-app, respecting each user's `promotional` opt-out and quiet hours (queued for after quiet hours). Enqueued on BullMQ; returns the broadcast job summary. Writes an `AuditLog`. Mirrored in [08-admin.md](08-admin.md) §10.

**Request JSON:**
| Field | Type | Validation |
|---|---|---|
| `titleAr` | string | required; 1–80 chars. |
| `bodyAr` | string | required; 1–240 chars. |
| `segment` | object | required; `{ role?: "client"|"provider", city?: string, providerTier?: "beginner"|"mid"|"established", inactiveDays?: int }`; at least one filter or `all: true`. |
| `data` | object | optional; deep-link payload, e.g. `{ "deepLink": "norabeauty://offers/eid" }`. |
| `scheduleAt` | string (ISO datetime) | optional; future time; omit to send now. |

```json
{
  "titleAr": "عروض العيد ",
  "bodyAr": "احجزي مكياج العيد الآن واحصلي على خصم ١٥٪ مع أفضل مقدّمات الخدمة في الرياض.",
  "segment": { "role": "client", "city": "الرياض" },
  "data": { "deepLink": "norabeauty://offers/eid" },
  "scheduleAt": "2026-07-05T16:00:00.000Z"
}
```

**Success `202`:**
```json
{
  "data": {
    "broadcastId": "ckbcast_01",
    "status": "scheduled",
    "estimatedRecipients": 4120,
    "optedOutSkipped": 318,
    "scheduledAt": "2026-07-05T16:00:00.000Z"
  }
}
```

**Errors:** `403 forbidden`, `422 validation_error`, `422 empty_segment` (no filter and `all` not set), `422 schedule_in_past`.

---

## 4. Notification generation & reminder scheduling

Notifications are produced **system-side** (not via a public create endpoint) on domain events, then persisted (`Notification`) and pushed via Expo to the user's registered device tokens:

| Trigger | Type | Channel |
|---|---|---|
| Provider accepts booking | `booking_confirmation` | push + in_app |
| New chat message while recipient offline | `new_message` | push + in_app |
| Booking cancelled / reschedule requested | `booking_cancelled` / `reschedule_request` | push + in_app |
| Provider taps "on the way" | `on_the_way` | push + in_app |
| Payment captured / invoice ready | `payment_receipt` | push + in_app |
| Payout status change | `payout_update` | push + in_app |
| Client posts a review | `new_review` (→ provider) | push + in_app |

**Appointment reminders (BullMQ).** When a booking becomes `confirmed`, the system schedules **delayed BullMQ jobs** keyed by `bookingId`:

- `T-24h` and `T-2h` before `scheduledAt` → `appointment_reminder` notifications to both client and provider.
- Jobs are computed against `scheduledAt` in `Asia/Riyadh` and use the `bookings.scheduledAt` index for the daily sweep that catches near-term bookings.
- **Cancellation/reschedule:** on `cancelled` or a confirmed reschedule, the existing delayed jobs are **removed by jobId** and re-scheduled for the new `scheduledAt`; reminders are never sent for non-active bookings.
- **Quiet hours:** if a reminder would fire inside the recipient's quiet hours, the push is deferred to the quiet-hours end while the in-app record is still written.
- **Idempotency:** each reminder job writes at most one `Notification` per `(bookingId, type, offset)` so retries do not duplicate.

---

## 5. Related

- Booking lifecycle that emits booking/reminder notifications: [04-bookings.md](04-bookings.md)
- Payment/payout notifications source: [05-payments-payouts.md](05-payments-payouts.md)
- Review notifications: [07-ratings-complaints.md](07-ratings-complaints.md)
- Admin broadcast tooling & audit: [08-admin.md](08-admin.md)
- Data model & enums: [../01-architecture/04-data-model.md](../01-architecture/04-data-model.md) · [../00-overview/03-glossary.md](../00-overview/03-glossary.md)
