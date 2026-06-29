# Data Model

> **Canonical.** PostgreSQL 16 + PostGIS via Prisma 5 (see [01-tech-stack.md](01-tech-stack.md)). The schema lives at `apps/api/src/prisma/schema.prisma` ([folder-structure](02-folder-structure.md#5-appsapi--nestjs)). All money is stored as **integer minor units (halalas)** with `currency = "SAR"`; never floats. All timestamps are `timestamptz`, app timezone `Asia/Riyadh`. Enums mirror [@app/contracts](02-folder-structure.md#61-packagescontracts--appcontracts).

## 1. Entity → systems map

The 10 systems from [product-brief §5](../00-overview/01-product-brief.md#5-the-10-systems-client-requirements--mvp-mapping) own these entities:

| # | System | Entities |
|:-:|---|---|
| 1 | Accounts & roles | `User`, `ClientProfile`, `ProviderProfile`, `Address`, `Session` |
| 2 | Service system | `ServiceCategory`, `Service`, `PortfolioItem` |
| 3 | Booking | `Booking`, `BookingItem`, `Availability`, `AvailabilitySlot` |
| 4 | Location | `Address` (PostGIS), `ProviderProfile.location` (PostGIS), QR fields on `Booking` |
| 5 | Payment | `Payment`, `Refund`, `Wallet`, `WalletTransaction`, `Payout`, `CommissionTier` |
| 6 | Ratings & reviews | `Review` |
| 7 | Notifications | `Notification` |
| 8 | Communication | `Conversation`, `Message`, `SupportTicket` |
| 9 | Admin dashboard | `AdminUser`, `Complaint`, `SupportTicket`, `VisibilityPackage`, `PointsLedger`, reports |
| 10 | Security | `Session`, `AuditLog`, encryption (TLS + at-rest) |

---

## 2. ASCII ER overview

```
                         ┌──────────────┐
                         │     User     │ (role-bearing account; phone+OTP)
                         └──────┬───────┘
        ┌───────────────┬───────┼────────────┬───────────────┐
        │ 1:1           │ 1:1   │ 1:N         │ 1:1           │ 1:N
  ┌──────────┐   ┌─────────────┐ ┌─────────┐ ┌────────┐  ┌─────────┐
  │ Client   │   │  Provider   │ │ Address │ │ Wallet │  │ Session │
  │ Profile  │   │  Profile    │ │(PostGIS)│ │        │  │         │
  └────┬─────┘   └──────┬──────┘ └─────────┘ └───┬────┘  └─────────┘
       │                │ 1:N          │ 1:N      │ 1:N
       │          ┌─────┴─────┐  ┌──────────┐ ┌──────────────────┐
       │          │  Service  │  │Portfolio │ │ WalletTransaction │
       │          │(price+dur)│  │  Item    │ └──────────────────┘
       │          └─────┬─────┘  └──────────┘        ▲
       │   N:1 ┌────────┘ │ N:1                       │ 1:N
       │  ┌────┴───────┐  │ 1:N                  ┌────┴────┐
       │  │  Service   │  │                      │ Payout  │──N:1──> CommissionTier
       │  │  Category  │  │                      └─────────┘
       │  └────────────┘  │                ┌──────────────────┐
       │                  │                │ VisibilityPackage │──N:1──> ProviderProfile
       └──────┐  ┌────────┘  ┌─────────────┤ PointsLedger      │
         1:N  ▼  ▼ 1:N       │             └──────────────────┘
          ┌──────────┐   ┌───┴────────────┐
          │ Booking  │1:N│  BookingItem   │ (add-ons → Service)
          │ (status) │   └────────────────┘
          └────┬─────┘
   ┌──────┬────┼─────────┬───────────┬──────────────┐
   │1:1   │1:N │1:1      │1:1        │1:N            │1:1
┌────────┐┌──────┐┌──────────┐┌────────────┐ ┌──────────┐
│Payment ││Review││Complaint ││Conversation│ │  (QR on  │
│        ││      ││/Dispute  ││            │ │ Booking) │
└───┬────┘└──────┘└──────────┘└─────┬──────┘ └──────────┘
    │1:N                            │1:N
┌────────┐                    ┌──────────┐
│ Refund │                    │ Message  │ (text + media[])
└────────┘                    └──────────┘

  ┌───────────┐      ┌──────────────┐      ┌──────────┐      ┌──────────────┐
  │ AdminUser │─1:N─>│ SupportTicket│      │ AuditLog │      │ Notification │
  │  (RBAC)   │      │ (assigned)   │      │(by Admin)│      │  (per User)  │
  └───────────┘      └──────────────┘      └──────────┘      └──────────────┘
```

---

## 3. Enums

```prisma
enum Role            { client provider }
enum AccountState    { pending_otp active suspended deactivated }
enum AdminRole       { super_admin ops finance support }

enum ProviderTier    { beginner mid established }       // drives commission %
enum PackageType     { silver gold platinum }           // visibility boost
enum PackageStatus   { active expired cancelled }

enum BookingStatus {
  pending              // created, awaiting provider accept (and/or payment hold)
  confirmed            // provider accepted; slot reserved
  on_the_way           // provider en route
  in_progress          // QR check-in done; service ongoing
  completed            // finished; eligible for review + payout release
  cancelled            // by client/provider/admin per policy
  reschedule_requested // a party requested a new slot; awaiting counterpart
}

enum CancelledBy      { client provider admin system }

enum PaymentMethod    { mada card apple_pay stc_pay wallet }
enum PaymentStatus    { initiated authorized captured failed refunded partially_refunded }
enum RefundStatus     { pending processed failed }
enum RefundReason     { client_cancel provider_cancel no_show dispute goodwill }

enum WalletTxnType    { earning commission_fee refund payout_debit adjustment points_credit }
enum WalletTxnStatus  { pending posted reversed }

enum PayoutStatus     { requested approved processing paid rejected failed }

enum MessageType      { text image system }
enum ConversationType { booking support }

enum NotificationType {
  booking_confirmation booking_reminder booking_status
  payment_receipt payout_update chat_message
  review_request promotion system
}
enum NotificationChannel { push in_app }

enum ComplaintStatus  { open under_review resolved rejected }
enum ComplaintType    { service_quality no_show payment safety other }
enum TicketStatus     { open pending_user resolved closed }
```

---

## 4. Prisma schema excerpt (core entities)

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [postgis]                 // PostGIS for proximity search
}

// ───────────────────────── System 1: Accounts & roles ─────────────────────────

model User {
  id           String       @id @default(cuid())
  phone        String       @unique          // E.164, KSA
  fullName     String?
  avatarUrl    String?
  roles        Role[]       @default([client])
  activeRole   Role         @default(client)
  accountState AccountState @default(pending_otp)
  locale       String       @default("ar-SA")
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  clientProfile   ClientProfile?
  providerProfile ProviderProfile?
  addresses       Address[]
  sessions        Session[]
  wallet          Wallet?
  bookingsAsClient   Booking[] @relation("ClientBookings")
  reviewsWritten     Review[]  @relation("ReviewAuthor")
  notifications      Notification[]
  complaintsFiled    Complaint[] @relation("ComplaintReporter")
  supportTickets     SupportTicket[]

  @@index([accountState])
  @@map("users")
}

model Session {
  id               String   @id @default(cuid())
  userId           String
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  refreshTokenHash String                            // hashed; never store raw token
  userAgent        String?
  ip               String?
  expiresAt        DateTime                          // JWT_REFRESH_TTL = 30d
  revokedAt        DateTime?
  createdAt        DateTime @default(now())

  @@index([userId])
  @@index([expiresAt])
  @@map("sessions")
}

model ClientProfile {
  id           String  @id @default(cuid())
  userId       String  @unique
  user         User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  defaultAddressId String?
  createdAt    DateTime @default(now())

  @@map("client_profiles")
}

model ProviderProfile {
  id                 String        @id @default(cuid())
  userId             String        @unique
  user               User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  bio                String?
  tier               ProviderTier  @default(beginner)
  profileComplete    Boolean       @default(false)  // ≥1 service + ≥1 portfolio item
  acceptingBookings  Boolean       @default(false)  // "open for work"
  ratingAvg          Decimal       @default(0) @db.Decimal(3, 2)
  ratingCount        Int           @default(0)
  // PostGIS home/base point for nearest-provider search (Unsupported -> raw SQL writes)
  location           Unsupported("geography(Point, 4326)")?
  serviceRadiusKm    Int           @default(15)
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt

  services       Service[]
  portfolio      PortfolioItem[]
  availability   Availability[]
  bookings       Booking[]        @relation("ProviderBookings")
  reviews        Review[]         @relation("ProviderReviews")
  packages       VisibilityPackage[]
  pointsLedger   PointsLedger[]

  @@index([tier])
  @@index([profileComplete, acceptingBookings])
  @@map("provider_profiles")
}

model Address {
  id         String  @id @default(cuid())
  userId     String
  user       User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  label      String?                                  // "المنزل", "العمل"
  line1      String
  city       String
  district   String?
  notes      String?
  lat        Float
  lng        Float
  // PostGIS point kept in sync with lat/lng for ST_DWithin queries
  geo        Unsupported("geography(Point, 4326)")?
  isDefault  Boolean @default(false)
  createdAt  DateTime @default(now())

  bookings   Booking[]

  @@index([userId])
  @@map("addresses")
}

// ───────────────────────── System 2: Service system ─────────────────────────

model ServiceCategory {
  id        String    @id @default(cuid())
  slug      String    @unique                          // SEO for web portal
  nameAr    String
  nameEn    String
  iconUrl   String?
  sortOrder Int       @default(0)
  isActive  Boolean   @default(true)

  services  Service[]

  @@map("service_categories")
}

model Service {
  id              String          @id @default(cuid())
  providerId      String
  provider        ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)
  categoryId      String
  category        ServiceCategory @relation(fields: [categoryId], references: [id])
  nameAr          String
  nameEn          String?
  description     String?
  priceMinor      Int                                  // SAR halalas — REQUIRED
  durationMinutes Int                                  // service duration — REQUIRED
  isAddon         Boolean         @default(false)      // add-ons referenced by BookingItem
  isActive        Boolean         @default(true)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  bookings     Booking[]
  bookingItems BookingItem[]

  @@index([providerId, isActive])
  @@index([categoryId])
  @@map("services")
}

model PortfolioItem {
  id         String          @id @default(cuid())
  providerId String
  provider   ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)
  imageUrl   String                                    // S3 signed-URL key
  caption    String?
  sortOrder  Int             @default(0)
  createdAt  DateTime        @default(now())

  @@index([providerId])
  @@map("portfolio_items")
}

// ───────────────────────── System 3: Booking & availability ─────────────────────────

model Availability {
  id         String          @id @default(cuid())
  providerId String
  provider   ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)
  weekday    Int                                       // 0=Sun .. 6=Sat (recurring rule)
  startTime  String                                    // "10:00" local Asia/Riyadh
  endTime    String                                    // "18:00"
  isActive   Boolean         @default(true)

  slots      AvailabilitySlot[]

  @@unique([providerId, weekday, startTime, endTime])
  @@map("availability")
}

model AvailabilitySlot {
  id             String       @id @default(cuid())
  availabilityId String
  availability   Availability @relation(fields: [availabilityId], references: [id], onDelete: Cascade)
  providerId     String                                 // denormalized for fast lookup
  startsAt       DateTime                               // concrete bookable slot (timestamptz)
  endsAt         DateTime
  isBooked       Boolean      @default(false)
  bookingId      String?      @unique

  @@index([providerId, startsAt, isBooked])
  @@map("availability_slots")
}

model Booking {
  id            String          @id @default(cuid())
  reference     String          @unique               // human code e.g. NB-7QF3
  clientId      String
  client        User            @relation("ClientBookings", fields: [clientId], references: [id])
  providerId    String
  provider      ProviderProfile @relation("ProviderBookings", fields: [providerId], references: [id])
  serviceId     String
  service       Service         @relation(fields: [serviceId], references: [id])
  addressId     String
  address       Address         @relation(fields: [addressId], references: [id])

  status        BookingStatus   @default(pending)
  scheduledAt   DateTime                              // chosen slot start
  durationMinutes Int                                 // snapshot of service duration
  notes         String?

  // pricing snapshot (halalas) — immutable record of what was agreed
  subtotalMinor   Int
  addonsTotalMinor Int          @default(0)
  totalMinor      Int
  commissionMinor Int           @default(0)           // platform cut at capture time

  // cancellation / reschedule
  cancelledBy     CancelledBy?
  cancelReason    String?
  cancelledAt     DateTime?
  rescheduleFromAt DateTime?

  // System 4: location / QR check-in
  qrCheckInCode   String?       @unique               // provider presents / client scans
  checkedInAt     DateTime?
  onTheWayAt      DateTime?
  completedAt     DateTime?

  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  items         BookingItem[]
  payment       Payment?
  review        Review?
  complaint     Complaint?
  conversation  Conversation?

  @@index([clientId, status])
  @@index([providerId, status])
  @@index([scheduledAt])
  @@map("bookings")
}

model BookingItem {
  id         String  @id @default(cuid())
  bookingId  String
  booking    Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  serviceId  String                                    // add-on service
  service    Service @relation(fields: [serviceId], references: [id])
  quantity   Int     @default(1)
  unitPriceMinor Int                                   // snapshot at booking time
  totalMinor Int

  @@index([bookingId])
  @@map("booking_items")
}

// ───────────────────────── System 5: Payment, wallet, payouts ─────────────────────────

model Payment {
  id            String        @id @default(cuid())
  bookingId     String        @unique
  booking       Booking       @relation(fields: [bookingId], references: [id])
  method        PaymentMethod
  status        PaymentStatus @default(initiated)
  amountMinor   Int
  currency      String        @default("SAR")
  // Moyasar escrow-style hold/capture
  providerRef   String?                               // Moyasar payment id
  authorizedAt  DateTime?                             // hold placed
  capturedAt    DateTime?                             // released to platform/escrow
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  refunds       Refund[]

  @@index([status])
  @@map("payments")
}

model Refund {
  id          String       @id @default(cuid())
  paymentId   String
  payment     Payment      @relation(fields: [paymentId], references: [id])
  amountMinor Int
  reason      RefundReason
  status      RefundStatus @default(pending)
  providerRef String?                                 // Moyasar refund id
  createdAt   DateTime     @default(now())
  processedAt DateTime?

  @@index([paymentId])
  @@map("refunds")
}

model Wallet {
  id            String   @id @default(cuid())
  userId        String   @unique                       // provider's earnings wallet
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  balanceMinor  Int      @default(0)                   // posted, withdrawable
  pendingMinor  Int      @default(0)                   // in escrow until completion
  currency      String   @default("SAR")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  transactions  WalletTransaction[]
  payouts       Payout[]

  @@map("wallets")
}

model WalletTransaction {
  id          String           @id @default(cuid())
  walletId    String
  wallet      Wallet           @relation(fields: [walletId], references: [id], onDelete: Cascade)
  type        WalletTxnType
  status      WalletTxnStatus  @default(pending)
  amountMinor Int                                       // signed: +earning / -commission/-payout
  balanceAfterMinor Int?
  bookingId   String?                                   // source booking, if any
  payoutId    String?
  description String?
  createdAt   DateTime         @default(now())
  postedAt    DateTime?

  @@index([walletId, createdAt])
  @@index([bookingId])
  @@map("wallet_transactions")
}

model Payout {
  id              String       @id @default(cuid())
  walletId        String
  wallet          Wallet       @relation(fields: [walletId], references: [id])
  amountMinor     Int
  status          PayoutStatus @default(requested)     // withdrawal request lifecycle
  iban            String                               // payout destination
  beneficiaryName String
  approvedByAdminId String?
  providerRef     String?                              // bank/processor ref
  requestedAt     DateTime     @default(now())
  processedAt     DateTime?

  @@index([walletId, status])
  @@map("payouts")
}

model CommissionTier {
  id           String       @id @default(cuid())
  tier         ProviderTier @unique
  percentBps   Int                                     // basis points; 200 = 2% default
  isActive     Boolean      @default(true)
  updatedAt    DateTime     @updatedAt

  @@map("commission_tiers")
}

model VisibilityPackage {
  id          String          @id @default(cuid())
  providerId  String
  provider    ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)
  type        PackageType
  status      PackageStatus   @default(active)
  pricePaidMinor Int
  startsAt    DateTime        @default(now())
  expiresAt   DateTime                                 // silver 2-3d / gold 5d / platinum 10d
  createdAt   DateTime        @default(now())

  @@index([providerId, status, expiresAt])
  @@map("visibility_packages")
}

model PointsLedger {
  id          String          @id @default(cuid())
  providerId  String
  provider    ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)
  delta       Int                                       // + earned (SAR1000 sales=100pts) / - redeemed
  balanceAfter Int
  reason      String                                    // "sales_milestone" | "redeem_boost"
  bookingId   String?
  createdAt   DateTime        @default(now())

  @@index([providerId, createdAt])
  @@map("points_ledger")
}

// ───────────────────────── System 6: Ratings & reviews ─────────────────────────

model Review {
  id          String          @id @default(cuid())
  bookingId   String          @unique                   // exactly one review per completed booking
  booking     Booking         @relation(fields: [bookingId], references: [id])
  authorId    String
  author      User            @relation("ReviewAuthor", fields: [authorId], references: [id])
  providerId  String
  provider    ProviderProfile @relation("ProviderReviews", fields: [providerId], references: [id])
  rating      Int                                        // 1..5; affects ranking
  comment     String?
  createdAt   DateTime        @default(now())

  @@index([providerId, createdAt])
  @@map("reviews")
}

// ───────────────────────── System 8: Communication ─────────────────────────

model Conversation {
  id         String           @id @default(cuid())
  type       ConversationType @default(booking)
  bookingId  String?          @unique                   // booking chat (null for support)
  booking    Booking?         @relation(fields: [bookingId], references: [id])
  clientId   String                                      // participant
  providerId String                                      // participant
  lastMessageAt DateTime?
  createdAt  DateTime         @default(now())

  messages   Message[]

  @@index([clientId, lastMessageAt])
  @@index([providerId, lastMessageAt])
  @@map("conversations")
}

model Message {
  id             String        @id @default(cuid())
  conversationId String
  conversation   Conversation  @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  senderId       String
  type           MessageType   @default(text)
  body           String?
  mediaUrl       String?                                 // S3 signed-URL key (image sharing)
  mediaWidth     Int?
  mediaHeight    Int?
  clientId       String?                                 // idempotency key for optimistic send
  readAt         DateTime?
  createdAt      DateTime      @default(now())

  @@index([conversationId, createdAt])
  @@map("messages")
}

model SupportTicket {
  id         String       @id @default(cuid())
  userId     String                                      // opener (client/provider)
  user       User         @relation(fields: [userId], references: [id])
  subject    String
  body       String
  status     TicketStatus @default(open)
  assignedAdminId String?
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt

  @@index([status])
  @@map("support_tickets")
}

// ───────────────────────── System 7: Notifications ─────────────────────────

model Notification {
  id         String              @id @default(cuid())
  userId     String
  user       User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  type       NotificationType
  channel    NotificationChannel @default(push)
  titleAr    String
  bodyAr     String
  data       Json?                                        // deep-link payload (booking/chat)
  readAt     DateTime?
  sentAt     DateTime?
  createdAt  DateTime            @default(now())

  @@index([userId, readAt])
  @@map("notifications")
}

// ───────────────────────── System 9: Complaints / disputes ─────────────────────────

model Complaint {
  id            String          @id @default(cuid())
  bookingId     String          @unique
  booking       Booking         @relation(fields: [bookingId], references: [id])
  reporterId    String
  reporter      User            @relation("ComplaintReporter", fields: [reporterId], references: [id])
  type          ComplaintType
  status        ComplaintStatus @default(open)
  description   String
  resolution    String?
  resolvedByAdminId String?
  createdAt     DateTime        @default(now())
  resolvedAt    DateTime?

  @@index([status])
  @@map("complaints")
}

// ───────────────────────── System 9/10: Admin & audit ─────────────────────────

model AdminUser {
  id        String    @id @default(cuid())
  phone     String    @unique
  email     String?   @unique
  fullName  String
  role      AdminRole @default(ops)                       // super_admin/ops/finance/support
  isActive  Boolean   @default(true)
  createdAt DateTime  @default(now())

  auditLogs AuditLog[]

  @@map("admin_users")
}

model AuditLog {
  id          String    @id @default(cuid())
  adminId     String?
  admin       AdminUser? @relation(fields: [adminId], references: [id])
  action      String                                       // "booking.cancel", "payout.approve"
  entityType  String                                       // "Booking", "Payout"
  entityId    String
  before      Json?
  after       Json?
  ip          String?
  createdAt   DateTime  @default(now())

  @@index([entityType, entityId])
  @@index([adminId, createdAt])
  @@map("audit_logs")
}
```

---

## 5. Key indexes & PostGIS

Standard B-tree indexes are declared inline above (`@@index`). The geospatial indexes that Prisma cannot express on `Unsupported("geography(...)")` columns are created in a **manual migration** (`prisma migrate dev --create-only`, then hand-edited SQL):

```sql
-- GiST spatial indexes for nearest-provider / proximity search (System 4)
CREATE INDEX provider_profiles_location_gix
  ON provider_profiles USING GIST (location);

CREATE INDEX addresses_geo_gix
  ON addresses USING GIST (geo);
```

Proximity query (used by `providers.nearby` — see [state-management query keys](03-state-management.md#31-query-key-conventions)) uses `ST_DWithin` on geography (meters), filtered to discoverable providers:

```sql
SELECT p.*, ST_Distance(p.location, ST_MakePoint($lng, $lat)::geography) AS distance_m
FROM provider_profiles p
WHERE p.profile_complete = true
  AND p.accepting_bookings = true
  AND ST_DWithin(p.location, ST_MakePoint($lng, $lat)::geography, $radius_m)
ORDER BY
  -- visibility boost first, then rating, then nearest
  (SELECT 1 FROM visibility_packages v
     WHERE v.provider_id = p.id AND v.status = 'active' AND v.expires_at > now() LIMIT 1) DESC NULLS LAST,
  p.rating_avg DESC,
  distance_m ASC
LIMIT $limit;
```

Index summary (load-bearing):

| Index | Purpose |
|---|---|
| `users.phone @unique` | OTP login lookup |
| `provider_profiles (profile_complete, accepting_bookings)` | Discoverability filter |
| `provider_profiles_location_gix` (GiST) | Proximity search |
| `addresses_geo_gix` (GiST) | Address geo distance |
| `availability_slots (providerId, startsAt, isBooked)` | Slot availability scan |
| `bookings (clientId, status)` / `(providerId, status)` | Role booking lists |
| `bookings.scheduledAt` | Reminder jobs (BullMQ) |
| `wallet_transactions (walletId, createdAt)` | Wallet ledger paging |
| `payouts (walletId, status)` | Finance payout queue |
| `visibility_packages (providerId, status, expiresAt)` | Boost ranking + expiry job |
| `messages (conversationId, createdAt)` | Chat history paging |
| `notifications (userId, readAt)` | Unread badge |
| `audit_logs (entityType, entityId)` | Admin audit trail |

---

## 6. Integrity & lifecycle notes

- **Money invariants.** A `Booking.totalMinor = subtotalMinor + addonsTotalMinor`. On `completed`, `Payment` is captured, `commissionMinor` is computed from `CommissionTier.percentBps` for the provider's `tier`, and a pair of `WalletTransaction` rows (`earning` + `commission_fee`) move funds from `pendingMinor` to `balanceMinor`. Refunds reverse via `WalletTransaction(type: refund)`.
- **Escrow.** Funds sit in `Wallet.pendingMinor` between `confirmed` and `completed`; only `posted` balance is withdrawable via `Payout`.
- **One-to-one guards.** `Review`, `Complaint`, `Payment`, and the booking `Conversation` are each `@unique` on `bookingId` — one per booking. `qrCheckInCode` and `Booking.reference` are globally unique.
- **Review eligibility.** A `Review` may only be created when its `Booking.status = completed` (enforced in `ratings.service`); writing one recomputes `ProviderProfile.ratingAvg`/`ratingCount`, feeding search ranking (System 6).
- **Soft state.** Account suspension/deactivation is modeled on `User.accountState`, not row deletion, so history and audit remain intact ([personas-roles §4](../00-overview/02-personas-roles.md#4-account-lifecycle--states)).
- **Audit.** Every admin mutation writes an `AuditLog` (System 10) with `before`/`after` JSON.

See [folder-structure → apps/api](02-folder-structure.md#5-appsapi--nestjs) for which module owns each model and [state-management](03-state-management.md) for how these entities surface as Query cache domains.
