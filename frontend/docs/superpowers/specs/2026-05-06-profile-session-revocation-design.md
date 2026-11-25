# Profile Session Revocation Design

## Status

Approved design. Written spec pending user review.

## Goal

Make the active session revocation area in patient and provider profile pages look like the legacy `CyberProfile.tsx` session block and work end to end against the real backend.

## Context

The current React app already shares account-security UI between patients and providers. `PatientProfileScreenSections.tsx` and `ProviderProfileScreenSections.tsx` both render `AccountSecuritySection` inside their Security tab. This shared component already calls real auth-security hooks and services for session inventory and revocation.

The backend already exposes matching authenticated endpoints in the Authentication slice:

- `GET /api/v1/Auth/security`
- `DELETE /api/v1/Auth/sessions/{sessionId}`
- `POST /api/v1/Auth/sessions/revoke-others`

The legacy frontend mock shows a compact `Sessions actives` panel with card rows, device icons, an `Actuel` badge for the current session, and a `Déconnecter` action for other sessions. The current implementation works through the existing API path but presents the session list in a more generic, form-like layout.

## Scope

This design changes only the active sessions and revoke area inside the existing Security tab.

In scope:

- Restyle the session inventory to match the legacy `CyberProfile.tsx` session list more closely.
- Keep one shared implementation for both patient and provider profiles.
- Keep per-session revoke and bulk revoke actions backed by the existing endpoints.
- Add backend response fields derived from stored `UserAgent` data so the UI can show useful labels such as `Chrome on Windows` or `Safari on iPhone`.
- Remove a revoked session card after the backend confirms revocation and the security query refetches.

Out of scope:

- Restyling the password change form.
- Restyling the 2FA display block.
- Restyling the full profile page, tab bar, hero, preferences, or danger zone.
- Adding IP geolocation, city, country, last-activity tracking, or revoked-session history.
- Changing authentication, token rotation, or revoke authorization semantics.

## Recommended Approach

Use the existing shared `AccountSecuritySection` and existing session hooks, but split the session-list rendering into a clearer legacy-styled block. Extend the backend `SessionSummary` contract with display-only fields derived from the existing encrypted `UserAgent` column. This keeps the implementation small, avoids duplicate patient/provider code, and gives the UI enough data to resemble the legacy mock without adding new persistence or external services.

## Alternatives Considered

### Frontend-Only Restyle

This would keep the backend unchanged and render cards from the existing `deviceType`, `ipAddress`, `createdAt`, `expiresAt`, and `isCurrent` fields.

This is faster, but it risks poor labels because `DeviceType` is generic or missing in the current backend session creation flow.

### Full Session Audit Redesign

This would add location, browser, OS, last activity, revoked-session status, and richer audit history.

This is more complete, but it exceeds the selected scope and would need a broader account-security design.

## Frontend Design

### Ownership

`AccountSecuritySection` remains the owning component for account security UI. Patient and provider profile screens keep using it through their existing Security tab composition.

The service and hook layers remain unchanged in purpose:

- `security-service.ts` owns HTTP calls.
- `useAccountSecurity.ts` owns TanStack Query fetching, mutations, and invalidation.
- `schema.ts` owns runtime validation of the security response.

### Session Block Layout

The active sessions area should present as a compact card group inspired by the legacy mock:

- Header with activity-style icon and `Sessions actives` title.
- Secondary bulk action button for `Révoquer toutes les autres sessions`, always present and disabled when no other sessions exist.
- Empty state when only the current session remains.
- One rounded card per active session.
- Device/browser icon on the left.
- Primary display label on top.
- `Actuel` badge next to the current session label.
- Secondary metadata below the label.
- `Déconnecter` or localized revoke action for non-current sessions only.

The primary label uses this fallback order:

1. `displayName`
2. `deviceType`
3. localized no-data text

The secondary metadata stays privacy-conscious and shows masked IP, created date, and expiry date. It must not show full raw IP or raw user-agent text.

### Revoke Behavior

Single-session revoke flow:

1. User clicks the non-current session revoke button.
2. Existing confirmation dialog opens.
3. User confirms.
4. Frontend calls `DELETE /Auth/sessions/{sessionId}`.
5. On success, the security query invalidates and refetches.
6. The revoked session card disappears because the backend no longer returns it as active.
7. Success toast appears.

Bulk revoke flow:

1. User clicks `Révoquer toutes les autres sessions`.
2. Existing confirmation dialog opens.
3. User confirms.
4. Frontend calls `POST /Auth/sessions/revoke-others`.
5. On success, the security query invalidates and refetches.
6. Only the current session remains.
7. The no-other-sessions empty state appears.
8. Success toast appears.

Failure behavior:

- Revoke mutation failures show the existing error toast.
- Failed revoke attempts keep the session card visible.
- Failed security overview refetch keeps existing stale data when available and shows the existing inline error state.

## Backend Design

### Contract Extension

Extend `SessionSummary` with display-only fields:

```ts
interface SessionSummary {
  id: string;
  ipAddress: string | null;
  deviceType: string | null;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
  displayName: string | null;
  browserName: string | null;
  operatingSystem: string | null;
}
```

Existing fields remain unchanged so existing consumers keep working.

### User-Agent Parsing

`GetSecurityOverview` should derive display fields from `UserSession.UserAgent` at read time. No database migration is needed.

The parser should be small and deterministic. It should identify common browsers and operating systems from user-agent strings:

- Browsers: Chrome, Safari, Firefox, Edge, Opera.
- Operating systems/devices: Windows, macOS, iPhone, iPad, Android, Linux.

`displayName` should combine detected browser and operating system as `<Browser> on <OS>`. If only one part is known, use that part. If neither part is known, return `null` for the new display fields and let the frontend fall back to `deviceType`, then localized no-data text.

The backend should not return the raw `UserAgent` string to the frontend.

### Revocation Semantics

The existing revoke behavior stays the source of truth:

- A user can revoke only sessions that belong to the same authenticated user.
- The current session cannot be revoked through the single-session endpoint.
- Bulk revoke preserves the current session.
- Revoked or expired sessions do not appear in `GET /Auth/security`.

## Data Flow

1. Profile page renders the shared Security tab.
2. `AccountSecuritySection` calls `useAccountSecurity()`.
3. `useAccountSecurity()` fetches `GET /Auth/security`.
4. The frontend schema validates the expanded `SessionSummary` objects.
5. The session block renders cards from the validated data.
6. Revoke actions call the existing mutation hooks.
7. Mutation success invalidates `authKeys.security()`.
8. Refetch returns the backend's current active session list.

## Error Handling

Backend errors continue to flow through the existing global middleware and `ApiResponse<T>` shape.

Frontend errors continue to use existing `showErrorToast`, `showSuccessToast`, query stale-data behavior, and confirmation dialog loading behavior.

Specific cases:

- `404 Session not found`: show error toast and keep current UI until refetch changes it.
- `400 Cannot revoke the current session`: should not occur from the UI because current-session cards have no revoke button, but the backend still enforces it.
- `401 Invalid user token`: handled by the existing auth/session infrastructure.

## Testing And Verification

Frontend checks:

- Update existing auth/security tests to cover the enriched session contract and legacy-styled session actions.
- Verify patient and provider profile pages both render the same shared session block.
- Run `npm run lint`.
- Run `npm run type-check`.
- Run targeted Vitest coverage for `AccountSecuritySection`, account-security hooks, and security service behavior.

Backend checks:

- Build the solution with `dotnet build "Sanad Platform Official.sln"`.
- Confirm `GET /Auth/security` returns enriched session fields without exposing raw user-agent data.
- Confirm `DELETE /Auth/sessions/{sessionId}` removes a non-current session from the next security overview response.
- Confirm `POST /Auth/sessions/revoke-others` leaves only the current session in the next security overview response.

Manual smoke path:

1. Log in as a patient.
2. Open Profile > Security.
3. Confirm the current session card has an `Actuel` badge and no revoke button.
4. Revoke another session and confirm its card disappears after success.
5. Repeat the same path as a provider.

## Decision State

All design decisions are resolved for this scope.
