# API Contract — Providers, Services, Portfolio & Addresses

> **Scope.** Provider discovery (proximity search + ranking), provider profile read/update, availability rules, the service catalog (categories + services with **price + duration**), portfolio media (upload/reorder/delete), and client saved addresses. Cross-cutting rules in [01-conventions.md](01-conventions.md). Auth/roles in [02-auth.md](02-auth.md) and [personas-roles](../00-overview/02-personas-roles.md). Entities/enums (`ProviderProfile`, `Service`, `ServiceCategory`, `PortfolioItem`, `Availability`, `AvailabilitySlot`, `Address`) per [data-model](../01-architecture/04-data-model.md); domain terms per [glossary](../00-overview/03-glossary.md).

---

## 0. Discoverability prerequisites

A provider appears in `GET /providers` only when **all** hold (per [personas-roles §5](../00-overview/02-personas-roles.md#5-provider-capability-sub-states)):

- `User.accountState = active`
- `ProviderProfile.profileComplete = true` (≥1 active service with price+duration **and** ≥1 portfolio item)
- `ProviderProfile.acceptingBookings = true`
- `ProviderProfile.location` is set (PostGIS point)

---

## 1. GET /providers — proximity search & ranking

Search discoverable providers near a point, filterable by category, sortable by distance / rating / visibility.

| | |
|---|---|
| **Method · Path** | `GET /providers` |
| **Auth** | Bearer (`client`, `provider`, or `admin`). |
| **Pagination** | Page mode ([conventions §5.2](01-conventions.md#52-page-pagination)). |
| **Rate limit** | 60 / min. |

### Query params

| Param | Type | Required | Validation / notes |
|---|---|---|---|
| `lat` | number | **yes** | −90..90. Search origin (usually the client's selected address). |
| `lng` | number | **yes** | −180..180. |
| `radiusKm` | number | no | Default 15. 1–50. Maps to `ST_DWithin(..., radius_m)`. |
| `categoryId` | string | no | Filter by `ServiceCategory.id`. |
| `categorySlug` | string | no | Alternative to `categoryId` (e.g. `makeup`). |
| `q` | string | no | Free-text over provider `fullName` / service `nameAr`/`nameEn`; 1–80 chars. |
| `priceMinMinor` | integer | no | Lower bound on the provider's cheapest matching service. |
| `priceMaxMinor` | integer | no | Upper bound. |
| `ratingMin` | number | no | 0–5; minimum `ratingAvg`. |
| `sort` | string | no | One or more of `distance`, `-ratingAvg`, `priceMinMinor`, `-visibility`. Default = ranking (below). |
| `page`, `pageSize` | integer | no | Page mode; `pageSize` 1–50, default 20. |

### Ranking note (default order)

When `sort` is omitted, results use the canonical ranking from [data-model §5](../01-architecture/04-data-model.md#5-key-indexes--postgis): **active visibility package first** (silver/gold/platinum, `expiresAt > now`), then **`ratingAvg` desc**, then **`distance_m` asc**. Visibility packages buy ranking position **within** the radius — they never expand the radius or surface non-discoverable providers. Rating influences but does not override an active boost. Explicit `sort` overrides this composite order.

### Success `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "prv_5kd03x",
      "userId": "usr_3kf9a2bq7m",
      "fullName": "لطيفة الحربي",
      "avatarUrl": "avatars/usr_3kf9a2bq7m/a2.jpg",
      "bio": "خبيرة مكياج سهرات ومناسبات",
      "tier": "established",
      "ratingAvg": "4.90",
      "ratingCount": 218,
      "distanceKm": 3.4,
      "serviceRadiusKm": 15,
      "visibilityBoost": { "type": "platinum", "status": "active", "expiresAt": "2026-07-09T23:59:59+03:00" },
      "premiumBadge": "platinum",
      "priceFromMinor": 25000,
      "currency": "SAR",
      "topCategories": [
        { "id": "cat_makeup", "slug": "makeup", "nameAr": "مكياج", "nameEn": "Makeup" }
      ]
    },
    {
      "id": "prv_9aa71z",
      "userId": "usr_88kd1a",
      "fullName": "نورة السبيعي",
      "avatarUrl": "avatars/usr_88kd1a/a1.jpg",
      "bio": "تصفيف شعر ومكياج",
      "tier": "mid",
      "ratingAvg": "4.70",
      "ratingCount": 94,
      "distanceKm": 5.1,
      "serviceRadiusKm": 20,
      "visibilityBoost": null,
      "premiumBadge": null,
      "priceFromMinor": 18000,
      "currency": "SAR",
      "topCategories": [
        { "id": "cat_hair", "slug": "hair", "nameAr": "تصفيف شعر", "nameEn": "Hair" }
      ]
    }
  ],
  "meta": {
    "pagination": { "mode": "page", "page": 1, "pageSize": 20, "totalItems": 12, "totalPages": 1, "hasMore": false },
    "search": { "lat": 24.7136, "lng": 46.6753, "radiusKm": 15 }
  }
}
```

### Errors

| HTTP | code | When |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Missing/invalid `lat`/`lng`, `radiusKm` out of range, unsupported `sort` field. |
| 401 | `UNAUTHORIZED` | Missing/invalid token. |

---

## 2. GET /providers/:id

Full public provider profile with services, portfolio, and rating summary.

| | |
|---|---|
| **Method · Path** | `GET /providers/:id` |
| **Auth** | Bearer (any role). |
| **Path param** | `id` — `ProviderProfile.id`. |

### Query params

| Param | Type | Notes |
|---|---|---|
| `lat`, `lng` | number | Optional; if both present, response includes `distanceKm` from this point. |

### Success `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "prv_5kd03x",
    "userId": "usr_3kf9a2bq7m",
    "fullName": "لطيفة الحربي",
    "avatarUrl": "avatars/usr_3kf9a2bq7m/a2.jpg",
    "bio": "خبيرة مكياج سهرات ومناسبات",
    "tier": "established",
    "profileComplete": true,
    "acceptingBookings": true,
    "ratingAvg": "4.90",
    "ratingCount": 218,
    "serviceRadiusKm": 15,
    "distanceKm": 3.4,
    "visibilityBoost": { "type": "platinum", "status": "active", "expiresAt": "2026-07-09T23:59:59+03:00" },
    "premiumBadge": "platinum",
    "services": [
      {
        "id": "svc_1a2b3c",
        "categoryId": "cat_makeup",
        "nameAr": "مكياج سهرة",
        "nameEn": "Evening Makeup",
        "description": "مكياج كامل يشمل الرموش",
        "priceMinor": 35000,
        "currency": "SAR",
        "durationMinutes": 90,
        "isAddon": false,
        "isActive": true
      },
      {
        "id": "svc_4d5e6f",
        "categoryId": "cat_makeup",
        "nameAr": "تركيب رموش",
        "nameEn": "Lash Application",
        "priceMinor": 8000,
        "currency": "SAR",
        "durationMinutes": 20,
        "isAddon": true,
        "isActive": true
      }
    ],
    "portfolio": [
      { "id": "pf_01", "imageUrl": "portfolio/usr_3kf9a2bq7m/2026/06/1.jpg", "caption": "إطلالة عروس", "sortOrder": 0 },
      { "id": "pf_02", "imageUrl": "portfolio/usr_3kf9a2bq7m/2026/06/2.jpg", "caption": "سموكي", "sortOrder": 1 }
    ],
    "recentReviews": [
      { "id": "rev_77", "rating": 5, "comment": "احترافية وملتزمة بالوقت", "createdAt": "2026-06-20T19:30:00+03:00" }
    ]
  }
}
```

### Errors

| HTTP | code | When |
|---|---|---|
| 404 | `NOT_FOUND` | No such provider, or not discoverable (to a non-owner, non-admin caller). |
| 401 | `UNAUTHORIZED` | Missing/invalid token. |

---

## 3. PATCH /providers/me — update own provider profile

| | |
|---|---|
| **Method · Path** | `PATCH /providers/me` |
| **Auth** | Bearer (`provider`, owner). |

### Request body (all optional; ≥1 required)

```json
{
  "bio": "خبيرة مكياج وتصفيف شعر للمناسبات",
  "serviceRadiusKm": 20,
  "acceptingBookings": true,
  "baseLocation": { "lat": 24.7200, "lng": 46.6800 }
}
```

| Field | Type | Validation |
|---|---|---|
| `bio` | string | ≤ 500 chars. |
| `serviceRadiusKm` | integer | 1–50. |
| `acceptingBookings` | boolean | "Open for work" toggle. Setting `true` requires `profileComplete = true` and ≥1 active `Availability`, else `409 PROFILE_INCOMPLETE`. |
| `baseLocation.lat` / `.lng` | number | Updates PostGIS `location`; both required together. |

### Success `200 OK`

Returns the updated provider profile (same shape as §2, without `services`/`portfolio` arrays unless changed).

### Errors

| HTTP | code | When |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Empty body, out-of-range values, partial `baseLocation`. |
| 409 | `PROFILE_INCOMPLETE` | `acceptingBookings:true` while not discoverable-ready. |
| 403 | `FORBIDDEN` | Caller is not a provider. |
| 401 | `UNAUTHORIZED` | Missing/invalid token. |

---

## 4. Availability (provider calendar CRUD)

Providers define **recurring weekly rules** (`Availability`: weekday + start/end wall-clock). Concrete bookable `AvailabilitySlot`s are materialized from these rules and consumed by booking (see [04-bookings.md §1](04-bookings.md)).

### 4.1 GET /providers/me/availability

| | |
|---|---|
| **Method · Path** | `GET /providers/me/availability` |
| **Auth** | Bearer (`provider`, owner). |

Success `200 OK`:

```json
{
  "success": true,
  "data": [
    { "id": "avl_sun", "weekday": 0, "startTime": "16:00", "endTime": "22:00", "isActive": true },
    { "id": "avl_mon", "weekday": 1, "startTime": "16:00", "endTime": "22:00", "isActive": true },
    { "id": "avl_thu", "weekday": 4, "startTime": "10:00", "endTime": "23:00", "isActive": true }
  ]
}
```

### 4.2 POST /providers/me/availability

Create one or more recurring rules.

Request body:

```json
{
  "rules": [
    { "weekday": 0, "startTime": "16:00", "endTime": "22:00" },
    { "weekday": 4, "startTime": "10:00", "endTime": "23:00" }
  ]
}
```

| Field | Type | Validation |
|---|---|---|
| `rules[].weekday` | integer | **Required.** 0=Sun .. 6=Sat. |
| `rules[].startTime` | string | **Required.** `"HH:mm"` 24h, Asia/Riyadh. |
| `rules[].endTime` | string | **Required.** `"HH:mm"` > `startTime`. |

Behavior: rules per `(weekday, startTime, endTime)` are unique; a duplicate → `409 AVAILABILITY_CONFLICT`. Overlapping windows on the same weekday → `409 AVAILABILITY_OVERLAP`. Success `201 Created` returns the created rules.

### 4.3 PATCH /providers/me/availability/:id

Edit a rule's window or `isActive`.

```json
{ "startTime": "17:00", "endTime": "23:00", "isActive": true }
```

Success `200 OK` returns the updated rule. Editing into an overlap → `409 AVAILABILITY_OVERLAP`.

### 4.4 DELETE /providers/me/availability/:id

Removes a recurring rule and its **future unbooked** slots. Rule with **booked** future slots cannot be hard-deleted → `409 SLOT_HAS_BOOKINGS` (deactivate via PATCH instead). Success `204 No Content`.

### Availability errors

| HTTP | code | When |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Bad weekday/time, `endTime ≤ startTime`. |
| 409 | `AVAILABILITY_CONFLICT` | Identical rule already exists. |
| 409 | `AVAILABILITY_OVERLAP` | Window overlaps another active rule that weekday. |
| 409 | `SLOT_HAS_BOOKINGS` | Deleting a rule with active future bookings. |
| 404 | `NOT_FOUND` | Rule id not owned by caller. |
| 403 | `FORBIDDEN` | Caller is not a provider. |

---

## 5. Service categories

### 5.1 GET /service-categories

| | |
|---|---|
| **Method · Path** | `GET /service-categories` |
| **Auth** | Bearer (any role). |
| **Query** | `isActive` (boolean, default `true`). |

Success `200 OK`:

```json
{
  "success": true,
  "data": [
    { "id": "cat_makeup", "slug": "makeup", "nameAr": "مكياج", "nameEn": "Makeup", "iconUrl": "icons/makeup.svg", "sortOrder": 0, "isActive": true },
    { "id": "cat_hair", "slug": "hair", "nameAr": "تصفيف شعر", "nameEn": "Hair", "iconUrl": "icons/hair.svg", "sortOrder": 1, "isActive": true },
    { "id": "cat_nails", "slug": "nails", "nameAr": "عناية بالأظافر", "nameEn": "Nails", "iconUrl": "icons/nails.svg", "sortOrder": 2, "isActive": true }
  ]
}
```

> Category create/update/deactivate is **admin-only** (`POST`/`PATCH /admin/service-categories`) and documented in the admin contract; providers consume the read endpoint above.

---

## 6. Services (provider CRUD — price + duration)

A `Service` **must** carry `priceMinor` and `durationMinutes`. Add-ons set `isAddon: true` and are attachable to a booking as `BookingItem`s (see [04 §8](04-bookings.md)).

### 6.1 GET /providers/me/services

Bearer (`provider`, owner). Query `isActive`, `isAddon`. Returns the owner's services (same object shape as §6.2 response).

### 6.2 POST /providers/me/services

| | |
|---|---|
| **Method · Path** | `POST /providers/me/services` |
| **Auth** | Bearer (`provider`, owner). |

Request body:

```json
{
  "categoryId": "cat_makeup",
  "nameAr": "مكياج عروس",
  "nameEn": "Bridal Makeup",
  "description": "مكياج عروس كامل مع تثبيت يدوم طوال اليوم",
  "priceMinor": 60000,
  "durationMinutes": 120,
  "isAddon": false
}
```

| Field | Type | Validation |
|---|---|---|
| `categoryId` | string | **Required.** Existing active `ServiceCategory.id`. |
| `nameAr` | string | **Required.** 2–80 chars. |
| `nameEn` | string | Optional, 2–80 chars. |
| `description` | string | Optional, ≤ 500 chars. |
| `priceMinor` | integer | **Required.** ≥ 1000 (SAR 10.00) and ≤ 5_000_000 (SAR 50,000). |
| `durationMinutes` | integer | **Required.** 15–480, multiple of 5. |
| `isAddon` | boolean | Optional, default `false`. |

Behavior: creating the first active service (with ≥1 portfolio item present) flips `profileComplete = true`. Success `201 Created`:

```json
{
  "success": true,
  "data": {
    "id": "svc_7g8h9i",
    "providerId": "prv_5kd03x",
    "categoryId": "cat_makeup",
    "nameAr": "مكياج عروس",
    "nameEn": "Bridal Makeup",
    "description": "مكياج عروس كامل مع تثبيت يدوم طوال اليوم",
    "priceMinor": 60000,
    "currency": "SAR",
    "durationMinutes": 120,
    "isAddon": false,
    "isActive": true,
    "createdAt": "2026-06-29T15:20:00+03:00"
  }
}
```

### 6.3 PATCH /providers/me/services/:id

Partial update (any of the §6.2 fields plus `isActive`). Validation identical. Deactivating (`isActive:false`) the **last** active service flips `profileComplete = false` and removes the provider from search. A service referenced by a **future booking** cannot be deleted but may be deactivated. Success `200 OK` returns the updated service.

### 6.4 DELETE /providers/me/services/:id

Hard-delete only if the service has **no** bookings/booking-items referencing it; otherwise `409 SERVICE_IN_USE` (deactivate instead). Success `204 No Content`.

### Service errors

| HTTP | code | When |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Missing required field, price/duration out of range, duration not /5. |
| 404 | `NOT_FOUND` | `categoryId` unknown, or service id not owned. |
| 409 | `SERVICE_IN_USE` | Deleting a service with bookings. |
| 403 | `FORBIDDEN` | Caller is not a provider / not owner. |

---

## 7. Portfolio (upload / reorder / delete)

Images use the [signed-URL pattern](01-conventions.md#11-file-upload-signed-url-pattern) (`purpose: portfolio_image`).

### 7.1 GET /providers/me/portfolio

Bearer (`provider`, owner). Returns items ordered by `sortOrder`:

```json
{
  "success": true,
  "data": [
    { "id": "pf_01", "imageUrl": "portfolio/usr_3kf9a2bq7m/2026/06/1.jpg", "caption": "إطلالة عروس", "sortOrder": 0, "createdAt": "2026-06-10T12:00:00+03:00" }
  ]
}
```

### 7.2 POST /providers/me/portfolio

Attach an uploaded image as a portfolio item.

Request body:

```json
{ "imageKey": "portfolio/usr_3kf9a2bq7m/2026/06/9f3a1c.jpg", "caption": "ميك أب ناعم" }
```

| Field | Type | Validation |
|---|---|---|
| `imageKey` | string | **Required.** S3 `key` from `POST /uploads/sign` (`purpose: portfolio_image`), owned by caller, object must exist. |
| `caption` | string | Optional, ≤ 120 chars. |

Behavior: appended at the next `sortOrder`. Creating the first item (with ≥1 active service present) flips `profileComplete = true`. Success `201 Created` returns the item.

### 7.3 PUT /providers/me/portfolio/order

Reorder the whole gallery atomically.

Request body:

```json
{ "order": ["pf_03", "pf_01", "pf_02"] }
```

| Field | Type | Validation |
|---|---|---|
| `order` | string[] | **Required.** Must contain **exactly** the caller's current portfolio item ids, each once. Index = new `sortOrder`. |

A list that is missing or contains unknown/duplicate ids → `422 VALIDATION_ERROR`. Success `200 OK` returns the reordered items.

### 7.4 PATCH /providers/me/portfolio/:id

Edit `caption` only. Success `200 OK`.

### 7.5 DELETE /providers/me/portfolio/:id

Removes the item and queues the S3 object for deletion. Deleting the **last** item flips `profileComplete = false` (removes from search). Success `204 No Content`.

### Portfolio errors

| HTTP | code | When |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Bad `caption`, malformed `order` list. |
| 410 | `RESOURCE_GONE` | `imageKey` not uploaded / presign expired. |
| 404 | `NOT_FOUND` | Item id not owned by caller. |
| 403 | `FORBIDDEN` | Caller is not a provider / not owner. |

---

## 8. Addresses (client saved locations CRUD)

Per [permissions matrix](../00-overview/02-personas-roles.md#3-permissions-matrix), saved addresses are a **client** capability. Each `Address` carries `lat`/`lng` (PostGIS `geo`) used as a booking location and as the default search origin.

### 8.1 GET /me/addresses

Bearer (`client`, owner). Returns the caller's addresses, default first:

```json
{
  "success": true,
  "data": [
    {
      "id": "adr_2bd991",
      "label": "المنزل",
      "line1": "حي النرجس، شارع الأمير محمد بن سلمان",
      "city": "الرياض",
      "district": "النرجس",
      "notes": "الدور الثاني، شقة ٣",
      "lat": 24.8231,
      "lng": 46.6402,
      "isDefault": true,
      "createdAt": "2026-05-10T09:20:00+03:00"
    }
  ]
}
```

### 8.2 POST /me/addresses

Request body:

```json
{
  "label": "العمل",
  "line1": "برج المملكة، طريق الملك فهد",
  "city": "الرياض",
  "district": "العليا",
  "notes": "الاستقبال بالدور الأرضي",
  "lat": 24.7113,
  "lng": 46.6745,
  "isDefault": false
}
```

| Field | Type | Validation |
|---|---|---|
| `label` | string | Optional, ≤ 40 chars (e.g. `المنزل`, `العمل`). |
| `line1` | string | **Required.** 3–200 chars. |
| `city` | string | **Required.** 2–80 chars. |
| `district` | string | Optional, ≤ 80 chars. |
| `notes` | string | Optional, ≤ 200 chars (gate code, floor). |
| `lat` | number | **Required.** −90..90. |
| `lng` | number | **Required.** −180..180. |
| `isDefault` | boolean | Optional, default `false`. Setting `true` unsets the prior default. |

Behavior: the first address created is auto-default. Success `201 Created` returns the address; the PostGIS `geo` point is derived from `lat`/`lng`.

### 8.3 PATCH /me/addresses/:id

Partial update (any §8.2 field). Setting `isDefault:true` atomically demotes the previous default. Success `200 OK`.

### 8.4 DELETE /me/addresses/:id

Removes a saved address. Blocked if referenced by an **active** booking → `409 ADDRESS_IN_USE`. Deleting the current default promotes the most recently used remaining address to default. Success `204 No Content`.

### Address errors

| HTTP | code | When |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Missing `line1`/`city`/`lat`/`lng` or out-of-range coords. |
| 409 | `ADDRESS_IN_USE` | Deleting an address tied to an active booking. |
| 404 | `NOT_FOUND` | Address id not owned by caller. |
| 403 | `FORBIDDEN` | Caller lacks the client capability. |

---

See [04-bookings.md](04-bookings.md) for slot availability, booking creation against these services/addresses, and the booking state machine.
