# State Management

> **Canonical.** State strategy for the mobile app (and shared with web where noted). Stack locked in [01-tech-stack.md](01-tech-stack.md): **Zustand** for local/UI/session state, **TanStack Query v5** for all server state, **Socket.IO** for realtime. Folder placement in [02-folder-structure.md](02-folder-structure.md).

## 1. The split

A single rule decides where a piece of state lives:

| State type | Owner | Examples |
|---|---|---|
| **Server state** (anything the API owns) | TanStack Query | providers, services, bookings, wallet, conversations, reviews |
| **Session/auth** | Zustand (`auth.store`) | tokens, current user, active role, account state |
| **Ephemeral cross-screen UI** | Zustand (`booking-draft.store`) | the in-progress booking wizard |
| **Device preferences** | Zustand (`preferences.store`) | locale (`ar-SA`/`en`), RTL dir, theme |
| **Pure component UI** | local `useState` | input focus, toggles, accordion open |

> **Never** mirror server data into Zustand. The Query cache is the source of truth for server state; Zustand holds only what the server does not own (tokens, drafts, preferences). This avoids the classic "two copies drift apart" bug.

---

## 2. Zustand stores

All stores live in `src/stores/` and export a `useXxxStore` hook (see [naming conventions](02-folder-structure.md#7-naming-conventions)). Tokens are persisted to **SecureStore**; non-sensitive state to MMKV/AsyncStorage. Server state is **never** persisted here.

### 2.1 Auth store

Holds the session. The only place tokens live. `role` drives which Expo Router group renders ([(client) vs (provider)](02-folder-structure.md#2-appsmobile--expo-router-file-tree)). Account/capability states mirror [personas-roles §4–5](../00-overview/02-personas-roles.md#4-account-lifecycle--states).

```ts
// src/stores/auth.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureStorage } from "@/lib/storage"; // Expo SecureStore adapter

export type Role = "client" | "provider";
export type AccountState = "pending_otp" | "active" | "suspended" | "deactivated";

export interface SessionUser {
  id: string;
  phone: string;
  fullName: string | null;
  roles: Role[];          // a client may also gain "provider"
  activeRole: Role;       // currently active experience
  accountState: AccountState;
  avatarUrl: string | null;
}

interface AuthState {
  accessToken: string | null;   // 15m TTL (JWT_ACCESS_TTL)
  refreshToken: string | null;  // 30d TTL (JWT_REFRESH_TTL)
  user: SessionUser | null;
  isHydrated: boolean;          // persisted state finished loading

  setSession: (p: { accessToken: string; refreshToken: string; user: SessionUser }) => void;
  setTokens: (p: { accessToken: string; refreshToken: string }) => void; // after refresh
  setUser: (user: SessionUser) => void;
  switchRole: (role: Role) => void;     // toggles client <-> provider experience
  clear: () => void;                    // logout / refresh failure
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isHydrated: false,

      setSession: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken, user }),
      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      switchRole: (role) => {
        const user = get().user;
        if (user && user.roles.includes(role)) set({ user: { ...user, activeRole: role } });
      },
      clear: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: "nora.auth",
      storage: createJSONStorage(() => secureStorage), // tokens at rest in SecureStore
      onRehydrateStorage: () => (state) => state && (state.isHydrated = true),
    },
  ),
);
```

### 2.2 Booking-draft store

The booking wizard ([(modal)/booking](02-folder-structure.md#2-appsmobile--expo-router-file-tree)) spans 5 screens. The draft is ephemeral client state — it becomes server state only when `pay.tsx` posts it.

```ts
// src/stores/booking-draft.store.ts
import { create } from "zustand";

export interface DraftAddon { serviceId: string; quantity: number }

interface BookingDraftState {
  providerId: string | null;
  serviceId: string | null;
  slotStartsAt: string | null;   // ISO, from provider availability
  addressId: string | null;
  addons: DraftAddon[];
  notes: string;

  setService: (p: { providerId: string; serviceId: string }) => void;
  setSlot: (iso: string) => void;
  setAddress: (id: string) => void;
  toggleAddon: (serviceId: string) => void;
  setNotes: (notes: string) => void;
  reset: () => void;             // call on wizard exit or after successful booking
  isComplete: () => boolean;     // gate the "pay" step
}

const initial = {
  providerId: null, serviceId: null, slotStartsAt: null,
  addressId: null, addons: [] as DraftAddon[], notes: "",
};

export const useBookingDraftStore = create<BookingDraftState>((set, get) => ({
  ...initial,
  setService: (p) => set(p),
  setSlot: (slotStartsAt) => set({ slotStartsAt }),
  setAddress: (addressId) => set({ addressId }),
  toggleAddon: (serviceId) =>
    set((s) => {
      const exists = s.addons.find((a) => a.serviceId === serviceId);
      return {
        addons: exists
          ? s.addons.filter((a) => a.serviceId !== serviceId)
          : [...s.addons, { serviceId, quantity: 1 }],
      };
    }),
  setNotes: (notes) => set({ notes }),
  reset: () => set(initial),
  isComplete: () =>
    Boolean(get().providerId && get().serviceId && get().slotStartsAt && get().addressId),
}));
```

### 2.3 Preferences store (locale + theme)

`ar-SA` is the default (RTL); `en` is the LTR fallback. Changing locale flips RTL via `I18nManager` and re-bootstraps i18n. Theme follows the design tokens in [@app/ui-tokens](02-folder-structure.md#62-packagesui-tokens--appui-tokens).

```ts
// src/stores/preferences.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { localStorageAdapter } from "@/lib/storage"; // MMKV/AsyncStorage

export type Locale = "ar-SA" | "en";
export type ThemeMode = "light" | "dark" | "system";

interface PreferencesState {
  locale: Locale;
  isRTL: boolean;
  theme: ThemeMode;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: ThemeMode) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      locale: "ar-SA",
      isRTL: true,
      theme: "system",
      setLocale: (locale) => set({ locale, isRTL: locale === "ar-SA" }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: "nora.prefs", storage: createJSONStorage(() => localStorageAdapter) },
  ),
);
```

---

## 3. TanStack Query — server state

All reads/writes against the API go through Query. The `QueryClient` and defaults live in `src/lib/query/client.ts`; the key factory in `src/lib/query/keys.ts`.

### 3.1 Query-key conventions

One factory, hierarchical keys, so invalidation can be coarse or surgical. Keys read domain → scope → params.

```ts
// src/lib/query/keys.ts
export const queryKeys = {
  me: () => ["me"] as const,

  providers: {
    all:    () => ["providers"] as const,
    nearby: (p: { lat: number; lng: number; radiusKm: number; categoryId?: string }) =>
              ["providers", "nearby", p] as const,
    detail: (id: string) => ["providers", "detail", id] as const,
  },
  services: {
    byProvider: (providerId: string) => ["services", "provider", providerId] as const,
    detail:     (id: string) => ["services", "detail", id] as const,
    categories: () => ["services", "categories"] as const,
  },
  availability: (providerId: string, from: string, to: string) =>
                  ["availability", providerId, from, to] as const,

  bookings: {
    list:   (scope: "client" | "provider", filter?: string) =>
              ["bookings", "list", scope, filter ?? "all"] as const,
    detail: (id: string) => ["bookings", "detail", id] as const,
  },
  wallet: {
    balance:      () => ["wallet", "balance"] as const,
    transactions: () => ["wallet", "transactions"] as const,
  },
  chat: {
    conversations: () => ["chat", "conversations"] as const,
    messages:      (conversationId: string) => ["chat", "messages", conversationId] as const,
  },
  reviews:   (providerId: string) => ["reviews", providerId] as const,
  notifications: () => ["notifications"] as const,
} as const;
```

Invalidation: `invalidateQueries({ queryKey: ["bookings"] })` clears every booking query; `["bookings", "detail", id]` clears just one.

### 3.2 Cache / staleTime policy per domain

Defaults: `staleTime: 30_000`, `gcTime: 5min`, `retry: 2 (exp backoff)`, `refetchOnReconnect: true`. Per-domain overrides:

| Domain | `staleTime` | Notes |
|---|---|---|
| Service categories | `Infinity` (manual invalidate) | Near-static reference data |
| Provider detail / services / portfolio | 5 min | Changes rarely; safe to cache |
| Nearby provider search | 60 s | Balance freshness vs. map churn |
| Availability slots | 30 s | Must feel fresh while booking |
| Bookings list / detail | 0 (always refetch) + realtime push | Lifecycle is time-sensitive |
| Wallet balance / transactions | 15 s; invalidate on payout events | Money — bias to fresh |
| Chat conversations | 10 s + realtime | List re-ordered by socket events |
| Chat messages | `Infinity` per thread | Maintained by socket, not polling |
| Reviews | 5 min | |
| Notifications | 30 s + realtime | Badge count |
| `me` (profile) | 5 min | Invalidate on profile edit |

```ts
// src/lib/query/client.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 2,
      retryDelay: (n) => Math.min(1000 * 2 ** n, 30_000),
      refetchOnReconnect: true,
      refetchOnWindowFocus: false, // RN: use AppState foreground refetch instead
    },
    mutations: { retry: 0 },
  },
});
```

### 3.3 Mutation + invalidation patterns

Mutations live in feature folders (`features/<f>/api`). After success, invalidate the keys the mutation could have affected.

```ts
// features/bookings/api/useCreateBooking.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBookingSchema, type CreateBooking } from "@app/contracts";
import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBooking) =>
      api.post("/bookings", createBookingSchema.parse(input)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.bookings.list("client") });
      qc.invalidateQueries({ queryKey: queryKeys.wallet.balance() });
    },
  });
}
```

Invalidation map (which mutation refreshes what):

| Mutation | Invalidates |
|---|---|
| Create booking | `bookings.list("client")`, `wallet.balance` (if wallet-paid), `availability(provider)` |
| Accept / reject booking | `bookings.detail(id)`, `bookings.list("provider")` |
| Cancel / reschedule | `bookings.detail(id)`, both `bookings.list` scopes, `availability` |
| QR check-in (in_progress) | `bookings.detail(id)` |
| Submit review | `reviews(providerId)`, `providers.detail(providerId)` (ranking), `bookings.detail` |
| Edit service | `services.byProvider`, `services.detail`, `providers.detail` |
| Set availability | `availability(provider, …)` |
| Withdraw / payout | `wallet.balance`, `wallet.transactions` |
| Edit profile | `me`, `providers.detail(self)` |

### 3.4 Optimistic updates

Used where the user expects instant feedback: **chat send** and **booking lifecycle actions**. Pattern: `onMutate` snapshots + patches the cache, `onError` rolls back, `onSettled` invalidates to reconcile with the server.

**Chat send** — message appears immediately as `status: "sending"`; socket `message:new` echo reconciles it.

```ts
// features/chat/api/useSendMessage.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";

export function useSendMessage(conversationId: string) {
  const qc = useQueryClient();
  const key = queryKeys.chat.messages(conversationId);
  return useMutation({
    mutationFn: (body: { text?: string; mediaUrl?: string; clientId: string }) =>
      api.post(`/chat/${conversationId}/messages`, body),
    onMutate: async (draft) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData(key);
      qc.setQueryData(key, (old: any[] = []) => [
        ...old,
        { id: `tmp-${draft.clientId}`, ...draft, status: "sending", createdAt: new Date().toISOString() },
      ]);
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(key, ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });
}
```

**Booking action** (e.g. provider accepts) — flip `status` in `bookings.detail` and the list immediately; roll back on failure.

```ts
// features/bookings/api/useBookingAction.ts (excerpt)
onMutate: async ({ id, nextStatus }) => {
  const key = queryKeys.bookings.detail(id);
  await qc.cancelQueries({ queryKey: key });
  const prev = qc.getQueryData(key);
  qc.setQueryData(key, (b: any) => b && { ...b, status: nextStatus });
  return { prev, key };
},
onError: (_e, _v, ctx) => ctx && qc.setQueryData(ctx.key, ctx.prev),
onSettled: (_d, _e, { id }) => {
  qc.invalidateQueries({ queryKey: queryKeys.bookings.detail(id) });
  qc.invalidateQueries({ queryKey: ["bookings", "list"] });
},
```

---

## 4. Data-flow diagram

```
                     ┌─────────────────────────────────────────────┐
                     │                  UI (Expo Router screens)    │
                     │  reads server state via useQuery / useMutation│
                     │  reads session/draft/prefs via Zustand hooks  │
                     └───────────────┬───────────────┬─────────────┘
                                     │               │
                 server state ▲      │               │ ▼ local state
                 (read/write) │      │               │ (session/draft/prefs)
                              │      ▼               ▼
        ┌─────────────────────────────────┐   ┌──────────────────────────┐
        │      TanStack Query cache        │   │       Zustand stores      │
        │  providers/bookings/wallet/chat… │   │  auth · booking-draft ·   │
        │  (source of truth for server)    │   │  preferences (persisted)  │
        └───────┬───────────────▲──────────┘   └──────────┬───────────────┘
                │ fetch/mutate   │ setQueryData            │ tokens
                ▼                │ (realtime/optim.)        ▼
        ┌─────────────────┐     │              ┌────────────────────────────┐
        │  api client      │─────┘ attaches ───│  SecureStore (tokens)       │
        │ (lib/api/client) │  Authorization     │  MMKV/AsyncStorage (prefs)  │
        └───────┬──────────┘                    └────────────────────────────┘
                │  HTTPS /api/v1                  ▲
                ▼                                 │ Socket.IO events
        ┌───────────────────────────┐   ┌────────┴───────────────┐
        │   NestJS REST API         │   │  Socket.IO gateway      │
        │ (modules per system)      │   │  message:new, booking:* │
        └───────────────────────────┘   └────────────────────────┘
```

---

## 5. Offline & retry behavior

- **Cache hydration.** `gcTime` keeps recently-viewed data in memory; for cold-start resilience, the Query cache is persisted with `@tanstack/query-async-storage-persister` (MMKV) so the last-seen bookings/providers render instantly while a background refetch runs.
- **Online manager.** `onlineManager` is wired to NetInfo. Queries pause when offline and `refetchOnReconnect` fires on reconnect.
- **Mutation pause + replay.** Mutations fired offline are paused and replayed on reconnect via `queryClient.resumePausedMutations()`. Each mutation carries a `clientId` (idempotency key) so the server safely dedupes replays — critical for booking creation and chat sends.
- **Retry policy.** Queries retry twice with exponential backoff capped at 30 s. Mutations do **not** auto-retry (`retry: 0`) except the paused-offline replay above — money/booking writes must not silently double-fire.
- **Stale-while-revalidate.** Stale data is shown immediately and refreshed in the background; the UI distinguishes `isPending` (no data) from `isFetching` (refreshing) for spinners vs. shimmer.

---

## 6. Token-refresh handling

Access token TTL is 15 min, refresh TTL 30 days ([tech-stack §4](01-tech-stack.md#4-required-environment-variables)). The api client transparently refreshes.

1. Every request reads `accessToken` from `useAuthStore` and sets `Authorization: Bearer …`.
2. On a `401` with an expired-token code, the client calls `POST /auth/refresh` with the refresh token.
3. **Single-flight:** concurrent 401s share one in-flight refresh promise; queued requests await it, then retry once with the new token.
4. On success, `setTokens` updates the store (and SecureStore via persist); the original request is replayed.
5. On refresh failure (revoked/expired), `useAuthStore.clear()` runs, the Query cache is cleared (`queryClient.clear()`), and the root gate redirects to `(auth)`.

```ts
// src/lib/api/client.ts (refresh core, abbreviated)
let refreshing: Promise<void> | null = null;

async function refreshOnce() {
  if (!refreshing) {
    const { refreshToken } = useAuthStore.getState();
    refreshing = fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error("refresh_failed");
        const t = await r.json();
        useAuthStore.getState().setTokens(t);
      })
      .catch(() => {
        useAuthStore.getState().clear();
        queryClient.clear();
        throw new Error("session_expired");
      })
      .finally(() => { refreshing = null; });
  }
  return refreshing;
}
```

---

## 7. Realtime (Socket.IO) ↔ Query cache integration

The socket does not own UI state; it **patches the Query cache** so screens already subscribed via `useQuery` re-render automatically. The connection is established after auth and authenticated with the access token.

- **Connect:** `lib/api/socket.ts` connects on login, joins per-user rooms (`user:<id>`) and active conversation rooms. Reconnect uses the same single-flight token refresh as REST.
- **`message:new`:** appends to `chat.messages(conversationId)` (replacing the optimistic `tmp-…` by `clientId`) and bumps the matching item in `chat.conversations`.
- **`message:read` / `typing`:** patch read receipts / a transient typing flag in the conversation cache.
- **`booking:status_changed`:** `setQueryData(bookings.detail(id), …)` and invalidate `bookings.list` for both scopes; drives provider "on the way", "in progress", etc.
- **`notification:new`:** prepend to `notifications()` and update the unread badge.
- **Fallback:** if the socket is down, the per-domain `staleTime` + `refetchOnReconnect` polling keeps data eventually-consistent, so realtime is an enhancement, not a hard dependency.

```ts
// src/lib/api/socket.ts (bridge, abbreviated)
import { io } from "socket.io-client";
import { queryClient } from "@/lib/query/client";
import { queryKeys } from "@/lib/query/keys";
import { useAuthStore } from "@/stores/auth.store";

export function connectSocket() {
  const socket = io(SOCKET_URL, { auth: { token: useAuthStore.getState().accessToken } });

  socket.on("message:new", (m) => {
    const key = queryKeys.chat.messages(m.conversationId);
    queryClient.setQueryData(key, (old: any[] = []) => {
      const i = old.findIndex((x) => x.id === `tmp-${m.clientId}`);
      if (i >= 0) { const next = [...old]; next[i] = m; return next; }
      return [...old, m];
    });
    queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations() });
  });

  socket.on("booking:status_changed", ({ id }) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.bookings.detail(id) });
    queryClient.invalidateQueries({ queryKey: ["bookings", "list"] });
  });

  socket.on("notification:new", () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications() }));

  return socket;
}
```

See [data-model.md](04-data-model.md) for the server entities behind each cache domain and [folder-structure.md](02-folder-structure.md) for file placement.
