# 11 — Axios

This page documents the current shared HTTP client in `src/api/client.ts`. It reflects the current interceptor and session behavior, not older CSRF or blanket-sanitization experiments.

## File Map

- `src/api/client.ts` — Axios instance, interceptors, helpers, and error normalization
- `src/shared/lib/http/auth-session.ts` — persisted token, refresh token, and session helpers
- `src/contexts/AuthContext.tsx` — caller that keeps the in-memory token cache in sync
- `src/shared/lib/monitoring/runtime-diagnostics.ts` — local diagnostics capture for API failures

## Base Client Configuration

The shared client is created with:

| Setting | Current source |
| --- | --- |
| `baseURL` | `env.API_BASE_URL` |
| `timeout` | `env.API_TIMEOUT` |
| default headers | `Content-Type`, `Accept`, `X-App-Version` |
| credentials | `withCredentials: true` |
| size limits | `maxContentLength` and `maxBodyLength` set to `10 * 1024 * 1024` |

The exported helper surface is:

- `api.get/post/put/patch/delete` for typed helpers that unwrap `ApiResponse<T>.data`
- `api.raw` for code paths that need the full Axios instance or raw response
- `apiClient` as the underlying configured instance

## Request Interceptor

The current request interceptor performs these steps:

| Step | Current behavior |
| --- | --- |
| duration tracking | stamps `_startTime` so response latency can be measured |
| country routing header | sets `X-Country-Code` from `env.COUNTRY_CODE` |
| auth header | reads the in-memory `_cachedToken` and adds `Authorization: Bearer ...` when available |
| request reference | generates `_requestId` and sends it as `X-Request-ID` |
| audit logging | logs the sanitized request path and query-key names through `auditLogger` |
| debug logging | writes redacted request info in development when debug mode is enabled |

The shared client no longer claims to do the following:

- no client-generated CSRF header injection
- no blanket request-body sanitization or mutation
- no fake request-side security response headers
- no automatic idempotency key generation for all write requests

If a specific write call needs an idempotency key, the caller adds it explicitly. A current example is booking creation in `src/features/bookings/service.ts`.

## Token and Session Coordination

The access token used by the request interceptor lives in memory.

Current coordination model:

- `setTokenCache()` and `getTokenCache()` manage synchronous access to the active access token
- persisted auth state and refresh tokens live behind `src/shared/lib/http/auth-session.ts`
- `AuthContext` updates the token cache on login, restore, refresh-based recovery, and logout
- logout also clears the shared `queryClient` so server-state caches do not leak across sessions

## 401 Refresh Flow

The client uses single-flight refresh coordination for unauthorized responses.

1. The first eligible `401` starts a refresh request to `/Auth/refresh-token`.
2. Concurrent `401` responses wait on `subscribeTokenRefresh()` instead of starting parallel refreshes.
3. On success, the client persists the refreshed session, updates the token cache, unblocks queued requests, and retries the original request.
4. On failure, the client clears persisted auth state and dispatches `auth:unauthorized`.

Refresh requests are marked as internal and silent, so they do not show user-facing error toasts.

## Retry Policy

Automatic retry is intentionally narrow.

Only idempotent methods are retried automatically:

- `GET`
- `HEAD`
- `OPTIONS`

The client retries these failure classes when `config._retryCount < env.API_RETRY_ATTEMPTS`:

| Failure | Current behavior |
| --- | --- |
| `408` | exponential backoff retry |
| `429` | retry using `Retry-After` when present |
| `5xx` | exponential backoff retry |
| `ECONNABORTED`, `ERR_NETWORK`, `ETIMEDOUT` | exponential backoff retry |

The retry delay uses `env.API_RETRY_DELAY` as the base, doubles per attempt, adds jitter, and caps at 30 seconds.

Write requests are not generally auto-retried. The important exception is a single replay of the original request after a successful token refresh.

## Error Normalization and UI Behavior

Every terminal Axios failure is normalized to the shared `ApiError` shape:

- `code`
- `message`
- `details`
- `errors`
- `statusCode`

Current behavior after normalization:

- `showErrorToast(...)` runs unless the request is marked `_silentError` or `_isInternalRefreshRequest`
- backend field-level validation errors are preserved on `errors`
- `runtimeDiagnostics.captureApiFailure(...)` records the failure locally with status, code, retry count, request id, and sanitized route context
- repeated similar API failures can be promoted into `api.failure.repeated` diagnostics by the monitoring layer

## Relationship to React Query

React Query retries are disabled by default in `src/shared/lib/query/client.ts` because Axios already owns refresh and retry behavior. Individual query options can still override that default when a specific flow needs different behavior.

## Related References

- [03 — Data Layer](./03-data-layer.md)
- [12 — Runtime Diagnostics](./12-runtime-diagnostics.md)
