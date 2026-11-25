# ADR-006: Auth and Session Handling

## Status

Accepted

## Decision

Authentication and session lifecycle are split across three layers:

- `src/shared/lib/http/auth-session.ts` owns session persistence, restore rules, and refresh-request preparation.
- `src/api/client.ts` owns transport concerns, bearer attachment, unauthorized handling, and silent refresh retries.
- `src/contexts/AuthContext.tsx` owns UI-facing auth state, orchestration, and route-level exposure.

## Why

- Auth affects routing, API headers, unauthorized handling, cache clearing, and session restoration.
- Spreading token/session logic across features increases security and consistency risk.
- The frontend must not simulate security guarantees that only the backend can enforce.

## Rules

- `AuthContext` orchestrates restore, login, logout, session expiry handling, and current-user session state.
- `auth-session` owns storage policy and refresh-token transport preparation.
- The shared API client owns request/response auth wiring and unauthorized signaling.
- Query cache is cleared on logout or invalid session transitions.
- Feature modules may read auth state and invoke auth actions, but must not implement parallel token stores.
- Persisted auth data must go through the auth-session and secure-storage path, not raw `localStorage` writes.
- Access token, user snapshot, and session metadata are session-scoped.
- Refresh tokens are session-scoped by default and only persist across browser restarts when the user explicitly chose `rememberMe`.
- Legacy always-local refresh tokens without an explicit persistent-session marker are treated as deprecated and cleaned up.
- The API client no longer performs blanket request sanitization or sends a client-generated CSRF header.
- Debug and mock behavior must remain development-only.

## Backend Coordination

- Full HttpOnly-cookie refresh requires the backend to accept `POST /Auth/refresh-token` with credentials and no body token.
- The frontend is now ready to call `/Auth/refresh-token` with an empty body and falls back to a stored refresh token only when one is still part of the current compatibility path.
- For durable cookie-based `rememberMe`, the backend must issue and rotate the refresh cookie server-side and return CORS/credential settings compatible with `withCredentials: true`.
- Any real CSRF protection for cookie-authenticated state-changing requests must be issued and validated by the backend. The removed client-generated token was not a legitimate guarantee.

## Consequences

- Auth flows stay auditable and predictable.
- Feature code remains focused on domain behavior instead of session plumbing.
- Browser persistence of sensitive auth material is reduced and explicitly justified.
