# 04 — Hooks

This document explains the custom hooks pattern used across all feature modules. Every feature module has a `hooks/` directory containing three categories of hooks: **query hooks**, **mutation hooks**, and **helper hooks**.

## Feature Public APIs

Feature root barrels such as `src/features/bookings/index.ts` are external consumer APIs.

- Pages and other features may consume hooks from a feature root barrel such as `@/features/bookings`
- Same-feature runtime code must not import its own root barrel; import local modules instead
- Use same-folder relative imports where possible, and use internal `@/features/<feature>/...` paths when crossing directories inside the same feature
- When another feature needs a narrower stable surface than the root barrel, expose or consume an explicit nested public entrypoint such as `@/features/providers/public-api` or `@/features/providers/schedule-planning`
- Do not deep-import another feature's internals below its public boundary
- These rules help keep the runtime import graph acyclic; the repository also includes targeted guards around sensitive graphs such as bookings/providers

---

## Hook Categories

| Category | Purpose | Uses React Query? | Example |
|----------|---------|-------------------|---------|
| **Query hooks** | Fetch and cache data | Yes (`useQuery`) | `useAppointments()`, `useAppointment(id)` |
| **Mutation hooks** | Create, update, delete | Yes (`useMutation`) | `useCreateAppointment()`, `useCancelAppointment()` |
| **Helper hooks** | Pure UI logic | No | `useAppointmentStatus()`, `useAppointmentDateTime()` |

---

## Query Hooks

Query hooks wrap `useQuery()` from TanStack React Query. They consume the pre-built `queryOptions()` from the feature's `options.ts` file.

### Basic Pattern

```typescript
// src/features/bookings/hooks/useBookings.ts

import { useQuery } from '@tanstack/react-query';
import { bookingListOptions } from '@/features/bookings/options';
import type { BookingFilters } from '@/features/bookings/service';

export function useAppointments(filters?: BookingFilters) {
  const query = useQuery(bookingListOptions(filters));

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
```

**Key points:**
- The hook passes `queryOptions()` directly to `useQuery()` — the options object bundles the cache key and fetch function together.
- The return shape is normalized to `{ data, loading, error, refetch }` for consistency across the app.
- `data` defaults to `null` (not `undefined`) so components can do `if (!data)` checks.

### Single Item Query

```typescript
// src/features/bookings/hooks/useBooking.ts

export function useAppointment(appointmentId: string | undefined) {
  const query = useQuery({
    ...bookingDetailOptions(appointmentId ?? ''),
    enabled: !!appointmentId,  // Don't fetch if no ID provided
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
```

The `enabled` option prevents the query from firing when the ID is undefined (e.g., when the component first mounts before route params are available).

### Paginated Query

```typescript
// src/features/bookings/hooks/useBookings.ts

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { paginatedBookingsOptions } from '@/features/bookings/options';

export function usePaginatedAppointments(initialFilters?: BookingFilters) {
  const query = useQuery({
    ...paginatedBookingsOptions(initialFilters),
    placeholderData: keepPreviousData,  // Keep old data visible during page transitions
  });

  const result = query.data ?? null;

  return {
    data: result?.items ?? [],
    pagination: result?.pagination ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
```

**`keepPreviousData`** is critical for pagination UX — without it, the UI flashes empty every time the user changes page because the new page's data isn't cached yet.

### Derived/Sorted Query

Some hooks add client-side processing on top of cached data:

```typescript
// src/features/bookings/hooks/useBookings.ts

export function useUpcomingAppointments() {
  const query = useQuery(upcomingBookingsOptions());

  // Sort by date ascending (memoized to avoid re-sorting on every render)
  const sortedData = useMemo(() => {
    if (!query.data) return [];
    return [...query.data].sort(
      (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );
  }, [query.data]);

  return {
    data: sortedData,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
```

### Grouped Query

```typescript
export function useTodayAppointments() {
  const query = useQuery(todayBookingsOptions());

  const sortedData = useMemo(() => { /* sort logic */ }, [query.data]);

  const grouped = useMemo(() => {
    const completed = sortedData.filter((a) => a.status === 'completed');
    const upcoming = sortedData.filter((a) =>
      ['pending', 'confirmed', 'in_progress'].includes(a.status ?? ''),
    );
    return { completed, upcoming, all: sortedData };
  }, [sortedData]);

  return {
    data: sortedData,
    grouped,        // Additional structured view
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
```

---

## Mutation Hooks

Mutation hooks wrap `useMutation()` and handle cache invalidation after successful operations.

### Simple Mutation (invalidate on success)

```typescript
// src/features/bookings/hooks/useBookingMutations.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingKeys } from '@/features/bookings/keys';
import { createBooking } from '@/features/bookings/service';
import type { CreateBookingRequest } from '@/features/bookings/schema';

export function useCreateAppointment() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreateBookingRequest) => createBooking(data),
    onSuccess: () => {
      // Invalidate all list queries so they refetch with the new booking
      void qc.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });

  return {
    mutate: mutation.mutate,         // Fire-and-forget
    mutateAsync: mutation.mutateAsync, // Awaitable
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}
```

### Update Mutation (invalidate list + detail)

```typescript
export function useUpdateAppointment() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookingRequest }) =>
      updateBooking(id, data),
    onSuccess: (_data, variables) => {
      // Invalidate the list AND the specific detail query
      void qc.invalidateQueries({ queryKey: bookingKeys.lists() });
      void qc.invalidateQueries({ queryKey: bookingKeys.detail(variables.id) });
    },
  });

  return { mutate: mutation.mutate, loading: mutation.isPending, error: mutation.error, ... };
}
```

### Optimistic Mutation (instant UI update with rollback)

Cancel and rate operations use optimistic updates for instant feedback:

```typescript
export function useCancelAppointment() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      cancelBooking(id, reason),

    // BEFORE the API call: optimistically update the cache
    onMutate: async ({ id }) => {
      // 1. Cancel in-flight queries to prevent overwrites
      await qc.cancelQueries({ queryKey: bookingKeys.lists() });

      // 2. Snapshot current list caches (for rollback)
      const previousLists = qc.getQueriesData<BookingListItemResponse[]>({
        queryKey: bookingKeys.lists(),
      });

      // 3. Optimistically set status to 'cancelled' in all list caches
      qc.setQueriesData<BookingListItemResponse[]>(
        { queryKey: bookingKeys.lists() },
        (old) => old?.map((item) =>
          item.id === id ? { ...item, status: 'cancelled' } : item
        ),
      );

      // 4. Return snapshot for rollback
      return { previousLists };
    },

    // ON ERROR: rollback to the snapshot
    onError: (_err, _vars, context) => {
      if (context?.previousLists) {
        for (const [key, data] of context.previousLists) {
          qc.setQueryData(key, data);
        }
      }
    },

    // ALWAYS: refetch from the server to ensure consistency
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });

  return { mutate: mutation.mutate, loading: mutation.isPending, ... };
}
```

**The optimistic update flow:**
1. User clicks "Cancel" -> UI instantly shows "Cancelled" status
2. API call fires in the background
3. If it succeeds -> `onSettled` refetches the real data
4. If it fails -> `onError` rolls back to the snapshot

---

## Helper Hooks

Pure UI logic hooks — no data fetching, no React Query. They compute derived values for display.

### Status Display

```typescript
// src/features/bookings/hooks/useBookingHelpers.ts

const STATUS_CONFIG: Record<string, StatusConfig> = {
  pending:     { label: 'En attente',  color: 'text-amber-500',  bgColor: 'bg-amber-500/20' },
  confirmed:   { label: 'Confirme',    color: 'text-blue-500',   bgColor: 'bg-blue-500/20' },
  in_progress: { label: 'En cours',    color: 'text-cyan-500',   bgColor: 'bg-cyan-500/20' },
  completed:   { label: 'Termine',     color: 'text-green-500',  bgColor: 'bg-green-500/20' },
  cancelled:   { label: 'Annule',      color: 'text-red-500',    bgColor: 'bg-red-500/20' },
  no_show:     { label: 'Absent',      color: 'text-slate-500',  bgColor: 'bg-slate-500/20' },
};

export function useAppointmentStatus(status: string) {
  return useMemo(() => STATUS_CONFIG[status] ?? DEFAULT_STATUS_CONFIG, [status]);
}
```

### Date/Time Formatting

```typescript
export function useAppointmentDateTime(scheduledAt: string) {
  return useMemo(() => {
    const date = new Date(scheduledAt);
    const now = new Date();

    let dateLabel: string;
    if (isToday(date))    dateLabel = "Aujourd'hui";
    else if (isTomorrow(date)) dateLabel = 'Demain';
    else dateLabel = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

    const timeLabel = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    return {
      date,
      dateLabel,
      timeLabel,
      fullLabel: `${dateLabel} a ${timeLabel}`,
      isPast: date < now,
      isToday: isToday(date),
      isTomorrow: isTomorrow(date),
      isUpcoming: date >= now,
    };
  }, [scheduledAt]);
}
```

---

## Using Hooks in Components

```tsx
// External consumer example (page or another feature)
import { useAppointments, useAppointmentStatus, useAppointmentDateTime } from '@/features/bookings';

function BookingList() {
  const { data: bookings, loading, error } = useAppointments({ status: 'upcoming' });

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!bookings?.length) return <EmptyState />;

  return (
    <div>
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}

function BookingCard({ booking }: { booking: BookingListItemResponse }) {
  const status = useAppointmentStatus(booking.status ?? 'pending');
  const dateTime = useAppointmentDateTime(booking.scheduledAt);

  return (
    <div className="p-4 rounded-xl border">
      <span className={`${status.bgColor} ${status.color} px-2 py-1 rounded`}>
        {status.label}
      </span>
      <p>{dateTime.fullLabel}</p>
    </div>
  );
}
```

Inside `src/features/bookings/**` itself, import local booking modules directly instead of routing back through `@/features/bookings`.

---

## Hook Barrels and Public Entrypoints

Each feature's `hooks/index.ts` re-exports everything for consumers that need the feature's hook surface:

```typescript
// src/features/bookings/hooks/index.ts
export { useAppointment } from './useBooking';
export { useAppointments, usePaginatedAppointments, useUpcomingAppointments, ... } from './useBookings';
export { useCreateAppointment, useCancelAppointment, useRateAppointment, ... } from './useBookingMutations';
export { useAppointmentStatus, useAppointmentDateTime } from './useBookingHelpers';
```

And the feature's `index.ts` re-exports hooks alongside everything else:

```typescript
// src/features/bookings/index.ts
export * from './hooks';
export { bookingKeys } from './keys';
// ...
```

Treat those barrels as public entrypoints, not as internal implementation dependencies.

- External consumers can import from `@/features/<feature>`
- Same-feature runtime files should import the specific local module they need instead of looping back through the root barrel
- If a feature needs a narrower consumer surface, create an explicit nested public entrypoint rather than telling consumers to deep-import internal files

---

## Creating a New Hook (Checklist)

When adding a new feature or endpoint:

1. **schema.ts** — Add Zod schemas for the new request/response types
2. **service.ts** — Add the API function (`api.get/post/etc.` + `Schema.parse()`)
3. **keys.ts** — Add a key to the factory
4. **options.ts** — Add a `queryOptions()` function
5. **hooks/** — Create the hook file using the patterns above
6. **hooks/index.ts** — Export the new hook
7. **index.ts** — Export the new hook from the consumer-facing barrel if it is part of the public API
8. **public entrypoints** — If external consumers only need a narrow slice, prefer an explicit nested public entrypoint over deep imports or same-feature barrel backreferences

---

## Next

- [05 — Routing & Pages](./05-routing-and-pages.md) — How pages consume these hooks
