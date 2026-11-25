# 12 — Runtime Diagnostics

This page documents the current local runtime diagnostics system used by the frontend.

## Where It Lives

- public surface: `src/shared/lib/monitoring/index.ts`
- collector: `src/shared/lib/monitoring/runtime-diagnostics.ts`
- bootstrap initialization: `src/app/bootstrap/runtime.ts`
- route context updates: `src/app/layouts/RootLayout.tsx`
- actor context updates: `src/contexts/AuthContext.tsx`

## Event Shape

Each recorded event stores:

- `id`
- `timestamp`
- `type`
- `level`
- sanitized `route`
- redacted `actor`
- redacted `context`

Actor context is populated from authenticated session state and can include `userId`, `role`, and `sessionId`.

## What Gets Captured

| Diagnostic type | Current source |
| --- | --- |
| `bootstrap.failure` | startup failures during env validation, mock startup, or boot rendering |
| `react.boundary.error` | the app-wide React error boundary in `AppProviders` |
| `runtime.window.error` | unhandled browser `error` events |
| `runtime.unhandled-rejection` | unhandled promise rejections |
| `router.error` | admin and cyber route error elements |
| `api.failure` | normalized terminal API failures from `src/api/client.ts` |
| `api.failure.repeated` | repeated similar API failures inside the configured time window |
| `schema.parse.failure` | Zod failures captured by shared schema helpers or the React Query client |

## Storage and Retention

Diagnostics are stored locally, per tab session.

- storage location: `sessionStorage`
- storage key: `__sanad_runtime_diagnostics`
- retention limit: the latest 50 events
- duplicate suppression: identical event fingerprints are reused for 5 seconds
- repeated API aggregation: a repeated-failure event is emitted after 3 matching API failures inside 60 seconds
- development logging: captured events are also written to the console in development

The diagnostics module itself does not ship events to a remote service. It records them locally so the UI can surface stable reference IDs.

## Redaction and Safe Context Rules

Diagnostics are redacted before storage.

Current protections come from `src/utils/security.ts` and the monitoring helpers:

- `redactSensitiveData(...)` redacts object fields whose names look like tokens, sessions, email, phone, names, addresses, banking, or medical data
- `redactSensitiveText(...)` scrubs bearer tokens, JWTs, email addresses, phone numbers, and long numeric identifiers out of free text
- route capture stores a sanitized path, query-key names only, and whether a hash exists
- opaque path segments are normalized to placeholders such as `:id` or `:identifier`
- context values are trimmed to a maximum depth, key count, array item count, and string length so diagnostics stay bounded

## Reference IDs in the UI

Every diagnostic event gets an `id`. That value is the user-facing reference ID.

Reference IDs currently appear in these places:

- bootstrap failure fallback rendered from `src/index.tsx`
- app-wide crash fallback in `src/app/errors/ErrorFallback.tsx`
- admin route error page in `src/app/router/error-elements.tsx`
- cyber route error page in `src/app/router/error-elements.tsx`

The app-wide error boundary also logs `diagnosticId` into `auditLogger`, which helps correlate the visible reference with local audit entries.

Routine API toasts do not currently show a reference ID. Reference IDs are reserved for bootstrap, boundary, route, and locally stored diagnostic events.

## Related References

- [03 — Data Layer](./03-data-layer.md)
- [11 — Axios](./11-axios.md)
