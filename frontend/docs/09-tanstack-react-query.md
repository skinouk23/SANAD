# 09 — TanStack React Query Deep Dive

This guide teaches TanStack React Query v5 from scratch, then shows how this project applies every concept. By the end you will understand **why** server-state management exists, **how** the cache works, and **how** to add your own queries and mutations.

---

## Table of Contents

1. [What Problem Does React Query Solve?](#1-what-problem-does-react-query-solve)
2. [Core Concepts](#2-core-concepts)
3. [QueryClient — The Global Cache](#3-queryclient--the-global-cache)
4. [Query Keys — Cache Addresses](#4-query-keys--cache-addresses)
5. [Query Options — Reusable Query Configs](#5-query-options--reusable-query-configs)
6. [Fetching Data — useQuery](#6-fetching-data--usequery)
7. [Paginated & Infinite Queries](#7-paginated--infinite-queries)
8. [Mutations — Writing Data](#8-mutations--writing-data)
9. [Optimistic Updates](#9-optimistic-updates)
10. [Cache Operations](#10-cache-operations)
11. [Provider Setup & DevTools](#11-provider-setup--devtools)
12. [Data Flow Diagram](#12-data-flow-diagram)
13. [Checklist: Adding a New Query](#13-checklist-adding-a-new-query)

---

## 1. What Problem Does React Query Solve?

Without a server-state library, fetching data in React looks like this:

```tsx
function BookingList() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchBookings()
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // ...render
}
```

Every component repeats this pattern. You also have no:

- **Caching** — navigating away and back refetches everything.
- **Deduplication** — two components mounting at the same time fire two identical requests.
- **Background refresh** — stale data stays stale until the user manually refreshes.
- **Optimistic UI** — mutations feel slow because you wait for the server round-trip.

React Query solves all of these with a **global cache** that components subscribe to. You describe _what_ to fetch; the library handles _when_, _how often_, and _where to store it_.

### Server State vs. Client State

| Aspect | Client State | Server State |
|--------|-------------|--------------|
| Owner | The browser | A remote server |
| Examples | Theme, sidebar open, form input | Bookings, user profile, messages |
| Stale? | Never (you control it) | Always (someone else can change it) |
| Tool | `useState`, `useReducer`, Context | React Query, SWR, Apollo |

**Rule of thumb:** if the data lives in a database, it's server state — use React Query.

---

## 2. Core Concepts

React Query has four building blocks:

| Concept | What It Is | Analogy |
|---------|-----------|---------|
| **QueryClient** | The global cache + configuration | A database that lives in browser memory |
| **Query Key** | A unique address for cached data | A primary key / cache key |
| **Query Function** | An async function that fetches data | A SQL SELECT statement |
| **Mutation** | An async function that changes data | A SQL INSERT/UPDATE/DELETE |

The lifecycle of a query:

```
Component mounts
  → React Query checks cache for this key
    → Cache HIT + fresh?  → return cached data instantly
    → Cache HIT + stale?  → return cached data, refetch in background
    → Cache MISS?         → show loading, fetch data, store in cache
```

Key terms:

- **Fresh** — data was fetched less than `staleTime` ago. No refetch needed.
- **Stale** — data is older than `staleTime`. Will refetch on certain triggers.
- **Inactive** — no component is subscribed to this query. After `gcTime`, it's garbage-collected.
- **Fetching** — a network request is in flight right now.

---

## 3. QueryClient — The Global Cache

The `QueryClient` is a singleton that holds all cached data and default configuration. You create it once and provide it to your entire app.

### Generic pattern

```typescript
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 minutes before data is "stale"
      gcTime: 10 * 60 * 1000,     // 10 minutes before inactive data is garbage-collected
      retry: false,                 // Don't retry failed queries
      refetchOnWindowFocus: false,  // Don't refetch when user tabs back
    },
    mutations: {
      retry: false,
    },
  },
});
```

### Why these defaults?

| Setting | Value | Rationale |
|---------|-------|-----------|
| `staleTime: 5min` | Data is considered fresh for 5 minutes | Avoids redundant refetches when navigating between pages |
| `gcTime: 10min` | Inactive cache entries live 10 minutes | Keeps data around for back-navigation without wasting memory forever |
| `retry: false` | No automatic retries | When your HTTP client (Axios) already retries with exponential backoff, React Query retries on top would cause cascading 401 loops |
| `refetchOnWindowFocus: false` | No tab-focus refetch | Healthcare data doesn't change by the second; explicit invalidation is more predictable |

### Where it lives in this project

```
src/shared/lib/query/client.ts    ← singleton creation (25 lines)
src/App.tsx                 ← <QueryClientProvider> wraps the entire app
```

The `QueryClient` is also imported directly by `AuthContext` — on logout, it calls `queryClient.clear()` to wipe all cached data so the next user doesn't see stale data from the previous session.

---

## 4. Query Keys — Cache Addresses

A **query key** is an array that uniquely identifies a piece of cached data. React Query uses deep equality to compare keys.

### The basics

```typescript
// Simple key
useQuery({ queryKey: ['bookings'], queryFn: fetchBookings });

// Key with a variable — different userId = different cache entry
useQuery({ queryKey: ['bookings', userId], queryFn: () => fetchBookings(userId) });

// Key with an object — different filter combos = different cache entries
useQuery({ queryKey: ['bookings', 'list', { status: 'pending' }], queryFn: ... });
```

### The key factory pattern

Scattering raw string arrays across your codebase leads to typos and inconsistency. The solution: a **key factory** — a single object that generates all keys for a domain.

```typescript
// src/features/bookings/keys.ts
export const bookingKeys = {
  all:       ['bookings'] as const,
  lists:  () => [...bookingKeys.all, 'list'] as const,
  list:   (filters?) => [...bookingKeys.lists(), filters ?? {}] as const,
  details:() => [...bookingKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
  stats:  () => [...bookingKeys.all, 'stats'] as const,
};
```

This creates a **hierarchy**:

```
['bookings']                              ← all
['bookings', 'list']                      ← lists()
['bookings', 'list', { status: 'pending' }] ← list(filters)
['bookings', 'detail']                    ← details()
['bookings', 'detail', 'abc-123']         ← detail(id)
```

### Why hierarchies matter — Granular invalidation

After a mutation, you can invalidate at any level:

```typescript
// Invalidate EVERYTHING booking-related (lists + details + stats)
queryClient.invalidateQueries({ queryKey: bookingKeys.all });

// Invalidate only list queries (re-fetch all lists, leave details alone)
queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });

// Invalidate one specific detail
queryClient.invalidateQueries({ queryKey: bookingKeys.detail('abc-123') });
```

React Query matches keys using **prefix matching** — `['bookings']` matches any key that _starts with_ `['bookings']`.

### The `as const` trick

Every key uses `as const` to preserve the exact tuple type. Without it, TypeScript widens `['bookings', 'list']` to `string[]`, losing type safety.

### This project's key factories

All 18 feature modules follow the identical pattern. Each lives in `src/features/<name>/keys.ts`:

| Feature | Root Key | Notable Extra Keys |
|---------|----------|-------------------|
| bookings | `['bookings']` | `stats()`, `upcoming()`, `today()`, `past()` |
| providers | `['providers']` | `profile()`, `dashboard()`, `availability(id)` |
| equipment | `['equipment']` | `categories()`, `featured()`, `search(q)`, `bookings()` |
| messaging | `['messaging']` | `conversations()`, `conversation(id)`, `messages(id)`, `unreadCount()` |
| admin | `['admin']` | `stats()`, `health()`, `auditLogs()`, `fraudAlerts()`, `tickets()` |
| transactions | `['transactions']` | `stats()`, `balance()` |
| auth | `['auth']` | `session()`, `profile()` |

---

## 5. Query Options — Reusable Query Configs

React Query v5 introduced `queryOptions()` — a helper that bundles a query key + query function + config into a single reusable object.

### Why not just inline everything in `useQuery`?

```typescript
// BAD — duplicated across every component that needs bookings
useQuery({
  queryKey: ['bookings', 'list', filters],
  queryFn: () => getBookings(filters),
});

// GOOD — defined once, reused everywhere
// in options.ts:
export function bookingListOptions(filters?: BookingFilters) {
  return queryOptions({
    queryKey: bookingKeys.list(filters),
    queryFn: () => getBookings(filters),
  });
}

// in any component:
useQuery(bookingListOptions(filters));

// also works for prefetching:
queryClient.prefetchQuery(bookingListOptions(filters));
```

The `queryOptions()` function gives you full type inference — TypeScript knows the return type of `useQuery(bookingListOptions())` is `BookingListItemResponse[]` without you writing a single generic.

### Common option patterns in this project

**1. Enabled guards (skip query until we have an ID)**

```typescript
export function bookingDetailOptions(id: string) {
  return queryOptions({
    queryKey: bookingKeys.detail(id),
    queryFn: () => getBookingById(id),
    enabled: !!id,  // Don't fetch if id is empty string
  });
}
```

**2. Custom staleTime for static data**

```typescript
export function catalogCategoriesOptions() {
  return queryOptions({
    queryKey: equipmentKeys.catalogCategories(),
    queryFn: () => getCatalogCategories(),
    staleTime: 10 * 60 * 1000,  // 10 min — categories rarely change
  });
}
```

This overrides the global 5-minute `staleTime` for this specific query.

**3. Polling with refetchInterval**

```typescript
export function messagesOptions(conversationId: string) {
  return queryOptions({
    queryKey: messagingKeys.messages(conversationId),
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
    refetchInterval: 5000,  // Poll every 5 seconds for new messages
  });
}
```

This replaces manual `setInterval` + `useEffect` polling with a single config line. React Query automatically pauses polling when the tab is hidden.

**4. Infinite query options**

```typescript
export function equipmentPaginatedOptions(filters?: EquipmentFilters) {
  return infiniteQueryOptions({
    queryKey: equipmentKeys.list({ ...filters, _infinite: true }),
    queryFn: ({ pageParam }) =>
      getEquipmentPaginated({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
}
```

`infiniteQueryOptions()` is the infinite-query counterpart. It requires `initialPageParam` and `getNextPageParam` to tell React Query how to paginate.

---

## 6. Fetching Data — useQuery

`useQuery` is the primary hook for reading data.

### Basic usage

```typescript
import { useQuery } from '@tanstack/react-query';

function BookingList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error.message} />;
  return <ul>{data.map(b => <li key={b.id}>{b.title}</li>)}</ul>;
}
```

### The return object

| Property | Type | Meaning |
|----------|------|---------|
| `data` | `T \| undefined` | The resolved data (undefined until first fetch succeeds) |
| `isLoading` | `boolean` | True during the **first** fetch (no cached data yet) |
| `isFetching` | `boolean` | True during **any** fetch (including background refetches) |
| `error` | `Error \| null` | The error object if the query failed |
| `refetch` | `() => Promise` | Manually trigger a refetch |
| `isStale` | `boolean` | Whether the data is considered stale |
| `isSuccess` | `boolean` | Whether the query has succeeded at least once |

### This project's hook wrapper pattern

Every feature wraps `useQuery` in a custom hook that normalizes the return shape for backward compatibility with the old `useApi` hook:

```typescript
// src/features/bookings/hooks/useBookings.ts
export function useAppointments(filters?: BookingFilters) {
  const query = useQuery(bookingListOptions(filters));

  return {
    data: query.data ?? null,     // null instead of undefined
    loading: query.isLoading,      // "loading" not "isLoading"
    error: query.error,
    refetch: query.refetch,
  };
}
```

This pattern means **components never import from `@tanstack/react-query` directly** — they only use feature hooks. This isolates the library dependency and makes it swappable.

### Derived/computed data with useMemo

Some hooks sort or group the raw query data:

```typescript
export function useUpcomingAppointments() {
  const query = useQuery(upcomingBookingsOptions());

  const sortedData = useMemo(() => {
    if (!query.data) return [];
    return [...query.data].sort(
      (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );
  }, [query.data]);

  return { data: sortedData, loading: query.isLoading, error: query.error };
}
```

The `useMemo` only re-runs when `query.data` changes reference, not on every render.

---

## 7. Paginated & Infinite Queries

### Server-side pagination with `keepPreviousData`

When the user clicks "Page 2", you don't want the UI to flash empty while loading. `keepPreviousData` keeps the old page's data visible until the new page arrives:

```typescript
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export function usePaginatedAppointments(filters?: BookingFilters) {
  const query = useQuery({
    ...paginatedBookingsOptions(filters),
    placeholderData: keepPreviousData,  // ← the magic
  });

  return {
    data: query.data?.items ?? [],
    pagination: query.data?.pagination ?? null,
    loading: query.isLoading,
  };
}
```

Each page/filter combo gets its own cache entry (because the query key includes the filters). Switching back to a previously-visited page is instant.

### Infinite scroll with `useInfiniteQuery`

For "load more" / infinite scroll UIs, use `useInfiniteQuery`. It accumulates pages into an array:

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

export function usePaginatedEquipment(filters?: EquipmentFilters) {
  const query = useInfiniteQuery(equipmentPaginatedOptions(filters));

  // Flatten all pages into a single array for infinite scroll
  const allItems = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data],
  );

  return {
    data: allItems,
    loading: query.isLoading,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}
```

The options factory defines how to get the next page:

```typescript
getNextPageParam: (lastPage) => {
  const { page, totalPages } = lastPage.pagination;
  return page < totalPages ? page + 1 : undefined;  // undefined = no more pages
},
```

React Query calls `queryFn` with `{ pageParam }` — you pass that to your API call.

---

## 8. Mutations — Writing Data

`useMutation` handles create/update/delete operations.

### Basic pattern

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useCreateBooking() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateBookingRequest) => createBooking(data),
    onSuccess: () => {
      // After creating, refetch all booking lists so they include the new one
      qc.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });

  return {
    mutate: mutation.mutate,         // fire-and-forget
    mutateAsync: mutation.mutateAsync, // returns a Promise
    loading: mutation.isPending,
    error: mutation.error,
  };
}
```

### `mutate` vs `mutateAsync`

| Method | Returns | Error handling |
|--------|---------|----------------|
| `mutate(data)` | `void` | Errors go to `mutation.error` (no try/catch needed) |
| `mutateAsync(data)` | `Promise<T>` | You must `await` it and handle errors yourself |

Use `mutate` in event handlers. Use `mutateAsync` when you need to chain operations (e.g., create booking then navigate).

### Mutation callbacks

```typescript
useMutation({
  mutationFn: ...,
  onMutate: (variables) => { /* Before the request — used for optimistic updates */ },
  onSuccess: (data, variables) => { /* Request succeeded */ },
  onError: (error, variables, context) => { /* Request failed */ },
  onSettled: (data, error, variables) => { /* Always runs (success or failure) */ },
});
```

### Invalidation strategies

This project uses two patterns:

**Simple invalidation** (most mutations): Invalidate related queries on success. React Query marks them as stale and refetches in the background.

```typescript
onSuccess: () => {
  void qc.invalidateQueries({ queryKey: bookingKeys.lists() });
  void qc.invalidateQueries({ queryKey: bookingKeys.detail(id) });
},
```

**Broad invalidation** (status changes like confirm, start, complete): Invalidate _everything_ under the domain root.

```typescript
onSuccess: () => {
  void qc.invalidateQueries({ queryKey: bookingKeys.all });
},
```

---

## 9. Optimistic Updates

For actions where the outcome is predictable (cancel, rate), you can update the cache _before_ the server responds, then roll back if it fails.

### The four-step pattern

```typescript
export function useCancelAppointment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => cancelBooking(id, reason),

    // STEP 1: Before the request
    onMutate: async ({ id }) => {
      // Cancel in-flight queries to prevent them overwriting our optimistic update
      await qc.cancelQueries({ queryKey: bookingKeys.lists() });

      // Snapshot current cache for rollback
      const previousLists = qc.getQueriesData({ queryKey: bookingKeys.lists() });

      // Write optimistic data to cache
      qc.setQueriesData({ queryKey: bookingKeys.lists() }, (old) =>
        old?.map((item) =>
          item.id === id ? { ...item, status: 'cancelled' } : item
        ),
      );

      // Return snapshot as "context" for onError
      return { previousLists };
    },

    // STEP 2: On failure — rollback
    onError: (_err, _vars, context) => {
      if (context?.previousLists) {
        for (const [key, data] of context.previousLists) {
          qc.setQueryData(key, data);
        }
      }
    },

    // STEP 3: Always — refetch to get the real server state
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}
```

### Why `cancelQueries` before `setQueriesData`?

If a background refetch is in flight and completes _after_ your optimistic write, it would overwrite your optimistic data with stale server data. Canceling in-flight queries prevents this race condition.

### When to use optimistic updates

Use them when:
- The outcome is predictable (cancel = status becomes "cancelled")
- The UI should feel instant (messaging, toggling)
- The rollback is straightforward

Don't use them when:
- The server might reject the operation (insufficient funds, validation errors)
- The response includes new data you can't predict (server-generated IDs)

### Hooks with optimistic updates in this project

| Hook | Feature | What it optimistically updates |
|------|---------|-------------------------------|
| `useCancelAppointment` | bookings | Sets `status: 'cancelled'` |
| `useRateAppointment` | bookings | Sets `rating` on the item |
| `useCancelEquipmentBooking` | equipment | Sets `status: 'cancelled'` |
| `useSendMessage` | messaging | Appends message to conversation |
| `useUpdateFraudAlert` | admin | Updates alert status |
| `useUpdateSupportTicket` | admin | Updates ticket status |

---

## 10. Cache Operations

Beyond `useQuery` and `useMutation`, you can manipulate the cache directly via `QueryClient` methods.

| Method | When to Use | Count in Codebase |
|--------|-------------|-------------------|
| `invalidateQueries({ queryKey })` | After mutations — marks queries as stale, triggers refetch | 44 |
| `setQueryData(key, data)` | Optimistic updates — write data directly to a single cache entry | 25 |
| `setQueriesData({ queryKey }, updater)` | Optimistic updates — write data to all matching cache entries | (included above) |
| `cancelQueries({ queryKey })` | Before optimistic updates — stop in-flight fetches | 6 |
| `getQueriesData({ queryKey })` | Snapshot cache for rollback | (in `onMutate` handlers) |
| `clear()` | On logout — wipe the entire cache | 1 |

### `invalidateQueries` — the workhorse

```typescript
// Invalidate all booking queries (lists, details, stats)
qc.invalidateQueries({ queryKey: bookingKeys.all });

// Invalidate only list queries
qc.invalidateQueries({ queryKey: bookingKeys.lists() });
```

Invalidated queries are marked stale immediately. If a component is currently subscribed, a background refetch starts. If no component is subscribed, the data stays in cache but will refetch when a component subscribes again.

### `clear()` — the nuclear option

```typescript
// In AuthContext on logout:
queryClient.clear();
```

This removes every entry from the cache. Used exactly once in this project: when the user logs out.

### Not used yet: `prefetchQuery`

The options factory pattern was designed to enable prefetching:

```typescript
// Could be used in a route loader or on hover:
await queryClient.prefetchQuery(bookingDetailOptions(id));
```

This is not implemented yet but the architecture supports it out of the box.

---

## 11. Provider Setup & DevTools

### Provider hierarchy

In `src/App.tsx`:

```tsx
<AuthProvider>           {/* ← wraps QueryClientProvider so auth can import queryClient */}
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </ThemeProvider>
    <ReactQueryDevtools />   {/* ← only in development */}
  </QueryClientProvider>
</AuthProvider>
```

`AuthProvider` is _outside_ `QueryClientProvider` intentionally. This allows `AuthContext` to import the `queryClient` singleton directly (for `queryClient.clear()`) without creating a circular dependency.

### DevTools

React Query DevTools show you every cached query, its status, data, and timing. They are lazy-loaded and only rendered in development:

```tsx
const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((mod) => ({
    default: mod.ReactQueryDevtools,
  }))
);
```

Open them with the floating button in the bottom-left corner of your dev browser.

### Bundle splitting

In `vite.config.ts`, React Query is extracted into its own vendor chunk:

```typescript
manualChunks: {
  'vendor-query': ['@tanstack/react-query'],
}
```

This means React Query code is cached separately by the browser — updating your app code doesn't force users to re-download the library.

---

## 12. Data Flow Diagram

The complete path of a query from component to network:

```
Component
  │
  ├── useAppointments(filters)               ← custom feature hook
  │     │
  │     └── useQuery(bookingListOptions)     ← React Query hook
  │           │
  │           ├── queryKey: bookingKeys.list(filters)  ← cache address
  │           │
  │           └── queryFn: getBookings(filters)        ← service function
  │                 │
  │                 ├── api.get('/bookings', { params }) ← Axios typed helper
  │                 │     │
  │                 │     ├── Request interceptor (auth token, CSRF, sanitize)
  │                 │     │
  │                 │     ├── MSW intercepts (dev) OR real backend (prod)
  │                 │     │
  │                 │     └── Response interceptor (retry on 5xx, error normalize)
  │                 │
  │                 └── BookingSchema.parse(raw)        ← Zod runtime validation
  │
  └── renders with { data, loading, error }
```

The mutation path:

```
Component
  │
  ├── useCancelAppointment()                  ← custom feature hook
  │     │
  │     └── useMutation(...)                  ← React Query hook
  │           │
  │           ├── onMutate: optimistic update (cancel queries → snapshot → write)
  │           │
  │           ├── mutationFn: cancelBooking(id)  ← service function → api.post
  │           │
  │           ├── onError: rollback from snapshot
  │           │
  │           └── onSettled: invalidateQueries  ← triggers refetch
  │
  └── re-renders with fresh data from cache
```

---

## 13. Checklist: Adding a New Query

When you need to add a new query to an existing feature:

1. **Service function** (`service.ts`) — write the async function that calls the API and validates with Zod
2. **Query key** (`keys.ts`) — add a new key to the factory, extending from the parent
3. **Query options** (`options.ts`) — create a `queryOptions()` function combining key + service
4. **Hook** (`hooks/use*.ts`) — wrap `useQuery(yourOptions())` in a custom hook with `{ data, loading, error, refetch }`
5. **Export** (`index.ts`) — re-export the hook from the feature barrel

When adding a new mutation:

1. **Service function** — write the async function (POST/PUT/PATCH/DELETE)
2. **Mutation hook** — use `useMutation` with `onSuccess: invalidateQueries`
3. For optimistic updates: add `onMutate` (cancel + snapshot + write), `onError` (rollback), `onSettled` (invalidate)

### File naming convention

```
src/features/bookings/
  ├── keys.ts           ← query key factory
  ├── options.ts         ← query options factory
  ├── service.ts         ← API calls + Zod validation
  ├── schema.ts          ← Zod schemas
  ├── hooks/
  │   ├── useBookings.ts         ← query hooks
  │   └── useBookingMutations.ts ← mutation hooks
  └── index.ts           ← barrel exports
```

---

**Next:** [10 — Zod Deep Dive](./10-zod.md) covers the runtime validation layer that sits between the API client and React Query.
