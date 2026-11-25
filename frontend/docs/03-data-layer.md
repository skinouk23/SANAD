# 03 — Data Layer

This page describes the current end-to-end data path used by the frontend. The shape is feature-first, with shared HTTP, schema, query, and monitoring infrastructure underneath it.

## End-to-End Flow

```text
Page or feature component
  -> feature hook (`useQuery` / `useMutation`)
  -> feature `options.ts` and `keys.ts`
  -> feature `service.ts`
  -> `api.get/post/...` in `src/api/client.ts`
  -> Axios interceptors (auth header, request id, refresh/retry, error normalization)
  -> MSW in development when enabled, or the real backend
  -> Zod parse in feature schema or shared schema helper
  -> TanStack Query cache
  -> runtime diagnostics for API and schema failures
```

## Shared Layers

| Layer | Current responsibility | Key files |
| --- | --- | --- |
| Bootstrap and mock runtime | Initialize diagnostics, validate env, and optionally start MSW before React renders | `src/index.tsx`, `src/app/bootstrap/runtime.ts`, `src/shared/lib/dev/msw.ts` |
| HTTP client | Shared Axios instance, in-memory token cache, refresh coordination, retry logic, and normalized errors | `src/api/client.ts`, `src/shared/lib/http/auth-session.ts` |
| Schema boundary | `ApiResponse<T>` envelope, shared parse helpers, and feature DTO validation | `src/shared/schemas/api.schema.ts`, `src/features/**/schema.ts` |
| Server-state cache | Query client defaults, query and mutation cache hooks, and invalidation behavior | `src/shared/lib/query/client.ts`, `src/features/**/keys.ts`, `src/features/**/options.ts` |
| Diagnostics | API failure capture, schema error capture, and route and actor context | `src/shared/lib/monitoring/`, `src/app/layouts/RootLayout.tsx`, `src/contexts/AuthContext.tsx` |

## Query Client Defaults

The shared `QueryClient` lives in `src/shared/lib/query/client.ts` and is mounted by `AppProviders`.

| Setting | Current default | Why |
| --- | --- | --- |
| `queries.staleTime` | `5 * 60 * 1000` | Avoids unnecessary refetches on quick remounts |
| `queries.gcTime` | `10 * 60 * 1000` | Keeps inactive data around for back-navigation |
| `queries.retry` | `false` | Axios already owns retry and refresh behavior |
| `queries.refetchOnWindowFocus` | `false` | Refetches are explicit by default |
| `mutations.retry` | `false` | Write retries are opt-in at the call site |

The query client also attaches `QueryCache` and `MutationCache` `onError` handlers. Those handlers do not capture every error. They specifically record Zod and schema validation failures that bubble out of query and mutation functions.

## Feature Slice Shape

The canonical pattern is still:

- `schema.ts` for Zod schemas and inferred types
- `service.ts` for pure API calls
- `keys.ts` for query key factories
- `options.ts` for reusable `queryOptions(...)`
- `hooks/` or co-located `hooks.ts` files for consumer-facing hooks and mutations

Representative examples:

- `src/features/bookings/schema.ts`
- `src/features/bookings/service.ts`
- `src/features/bookings/keys.ts`
- `src/features/bookings/options.ts`
- `src/features/bookings/hooks/useBooking.ts`
- `src/features/provider-wallet/options.ts`
- `src/features/provider-wallet/hooks/useProviderWalletQueries.ts`

Not every feature uses the exact same folder depth, but the shared layers are consistent: services call the shared Axios client, options reference key factories, and hooks consume those options or invalidate those keys.

## HTTP and Schema Boundary

Successful API calls follow two shared rules:

1. `api.get/post/put/patch/delete` in `src/api/client.ts` unwrap the backend `ApiResponse<T>` envelope and return `response.data.data`.
2. Feature services validate the unwrapped payload with Zod before handing it to React Query or UI code.

Two shared parsing helpers exist in `src/shared/schemas/api.schema.ts`:

- `parseSchemaOrThrow(...)` captures a schema diagnostic and rethrows
- `safeParseResponse(...)` captures a schema diagnostic and returns raw data for transition scenarios

Current day-to-day services mostly use direct `Schema.parse(...)` or `parseSchemaOrThrow(...)`. `safeParseResponse(...)` exists as an escape hatch, not the default path.

## Mock Mode vs Real Backend

The service layer does not branch between mock and real data.

- `initializeRuntime()` runs before React mounts
- If `shouldEnableMockData()` is true, it dynamically imports `src/shared/lib/dev/msw.ts`
- MSW intercepts the same Axios calls that production code makes
- If mock mode is off, the same service functions call the configured backend directly

That keeps feature services as plain HTTP modules without per-endpoint mock switches.

## Monitoring Shape Inside the Data Layer

The current monitoring hooks are distributed across the shared stack:

- `src/api/client.ts` records normalized API failures through `runtimeDiagnostics.captureApiFailure(...)`
- `src/shared/lib/query/client.ts` records schema failures thrown from query and mutation execution
- `src/shared/schemas/api.schema.ts` records schema failures in shared parse helpers
- `src/app/layouts/RootLayout.tsx` keeps diagnostics tagged with a sanitized route context
- `src/contexts/AuthContext.tsx` attaches actor context when a user session is active

This is why data-layer failures can later surface as local reference IDs in the error boundary or route error pages even though the original failure happened lower in the stack.

## Example Flow

A typical query currently looks like this:

```text
`useQuery(bookingDetailOptions(id))`
  -> `bookingDetailOptions(id)` in `src/features/bookings/options.ts`
  -> `getBookingById(id)` in `src/features/bookings/service.ts`
  -> `api.get<BookingResponse>(...)` in `src/api/client.ts`
  -> backend or MSW response
  -> `BookingResponseSchema.parse(raw)`
  -> cached result or schema/API diagnostics on failure
```

A typical mutation looks similar, except the hook invalidates domain-specific keys after success rather than relying on blanket cache clearing.

## Related References

- [09 — TanStack React Query Deep Dive](./09-tanstack-react-query.md)
- [11 — Axios](./11-axios.md)
- [12 — Runtime Diagnostics](./12-runtime-diagnostics.md)
