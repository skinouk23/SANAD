# ADR-003: State Ownership

## Status

Accepted

## Decision

State ownership is split by source of truth:

- Server state: TanStack Query in feature modules
- Global client state: React contexts only for app-wide concerns
- Local view state: component state

## Why

- The app already distinguishes remote data from client-only session, theme, and language state.
- Query ownership keeps fetching, caching, invalidation, and retry behavior out of page components.
- Limiting contexts prevents them from becoming a second global store.

## Rules

- API-backed entities belong in feature services, schemas, query options, and query hooks.
- Do not mirror query results into context or long-lived local state unless there is a clear offline or form-edit reason.
- Context is reserved for session/auth, language/direction, theme, and similar truly global client concerns.
- Page-local toggles, filters, wizard step UI, and modal state stay local unless reused by a feature hook.

## Consequences

- Features stay portable and easier to test.
- Session and app shell concerns remain centralized without turning contexts into business-data stores.
