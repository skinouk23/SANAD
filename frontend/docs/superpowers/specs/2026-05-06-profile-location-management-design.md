# Profile Location Management Design

Date: 2026-05-06
Status: Approved design, pending written spec review

## Context

Care@Home needs one clear way to store and reuse patient and provider locations.

Today, the backend already stores address and coordinate fields on both profile entities, but the self-profile APIs do not expose coordinates. Booking creation already accepts address coordinates, and several frontend booking flows already prefill from `AuthContext.user.address`. Other home-service booking flows still start with empty address fields.

Provider signup currently requires a city. The main professional signup does not collect a street address. Specialized provider signup screens collect an address and city, but only the city reaches backend registration. Patients can already enter a location in booking flows through address fields and the address picker.

## Goal

Create a profile-owned saved location model for patients and providers.

The saved location should:

- Let providers optionally enter an address during signup.
- Let patients and providers update their saved address and coordinates from a dashboard top-bar action.
- Reverse-geocode captured browser coordinates into readable address fields before saving.
- Use the saved patient location to prefill home-service booking flows.
- Keep saved base location separate from live provider tracking.

## Non-Goals

- Do not implement live provider tracking during active appointments.
- Do not use `ProviderLocation` in this slice; it remains reserved for future live tracking.
- Do not redesign the booking API. Booking creation already accepts address coordinates.
- Do not require providers to grant browser geolocation permission during signup.
- Do not block patient booking if profile location cannot load.
- Do not add new database columns unless exploration later proves the existing columns are unusable.

## Chosen Approach

Use the patient and provider profile records as the canonical saved base location.

Patient saved location lives on `Patient`: `AddressLine1`, `City`, `PostalCode`, `Latitude`, and `Longitude`.

Provider saved location lives on `Provider`: `AddressLine1`, `City`, `PostalCode`, `Latitude`, `Longitude`, and the existing `ServiceRadiusKm`.

Existing self-profile endpoints remain the owning API surface:

- `GET /api/v1/patients/me`
- `PUT /api/v1/patients/me`
- `GET /api/v1/providers/me`
- `PUT /api/v1/providers/me`

Dashboard location capture becomes a shortcut for updating the saved profile location. Booking prefill reads the patient profile from the server first, then falls back to the cached auth address if needed.

## Alternatives Considered

### Frontend-Only Cached Location

The app could save the detected address only in `AuthContext` and secure storage.

This is fast, but it is not reliable. It does not persist across devices, does not improve provider discovery, and can drift from the backend profile.

### Separate Location Endpoints

The backend could expose dedicated endpoints such as `/patients/me/location` and `/providers/me/location`.

This gives location a clean API boundary, but it duplicates the current profile update responsibility. The existing profile endpoints already own address fields, so separate endpoints add surface area without a clear benefit for saved base location.

### Profile-Owned Saved Location

This is the selected approach. It uses existing profile ownership, persists across devices, and keeps future live tracking separate.

## Backend Design

### Patient Profile Contract

Extend the patient self-profile response and update request to include coordinates:

- `latitude?: number | null`
- `longitude?: number | null`

The update command, validator, mapping profile, and handler should pass the coordinates through the existing tracked-entity update flow. The handler loads the authenticated patient, mutates the tracked entity, and saves through the unit of work.

Coordinate rules:

- Latitude must be between `-90` and `90`.
- Longitude must be between `-180` and `180`.
- Latitude and longitude must be provided together or omitted together.
- `0` is a valid coordinate value and must not be treated as empty.

### Provider Profile Contract

Extend the provider self-profile response and update request with the same coordinate fields.

The provider update command, validator, mapping profile, and handler should use the existing provider profile update path. The update must preserve partial-update semantics: omitted fields do not clear existing values.

### Provider Registration

Extend auth registration to accept an optional provider address field:

- `address?: string | null`

For provider registrations, save this value to `Provider.AddressLine1` when present. Keep `city` required. Do not require coordinates during signup.

For patient registration, keep the existing behavior unless a later patient onboarding design adds full address collection.

### Privacy And Storage

Patient and provider coordinates are confidential profile data. The existing entity fields already mark address and coordinates as encrypted confidential fields. New request, response, logging, and validation code must avoid exposing coordinates in logs.

`ProviderLocation` is not used because it models live GPS samples, not a saved provider base address.

## Frontend Design

### Provider Signup

Add an optional address field near the provider city field in the main professional signup flow. Specialized provider signup already has address and city fields; update its submit path so the optional address reaches backend registration.

Signup rules:

- City remains required.
- Address is optional.
- Coordinates are not collected during signup.
- The UI should explain that providers can update their exact location later from the dashboard or profile.

### Dashboard Location Action

Add a patient/provider location button to `AppLayout`'s authenticated top bar, next to the existing theme/language/profile controls. The button should be visible for patient and provider users, not admins. Dashboard header components should not own geolocation state; they may display location status later, but the save action belongs to the shared authenticated top bar.

On click:

1. Request browser geolocation permission.
2. Capture latitude and longitude.
3. Reverse-geocode the coordinates into address fields using the existing map/geocoding integration pattern.
4. Save address, city, postal code, latitude, and longitude through the correct profile mutation.
5. Invalidate the matching profile query.
6. Update `AuthContext.user.address` after success so current booking flows can reuse the saved location immediately.

The button must be explicit and user-initiated. The app should not capture coordinates automatically on page load.

### Booking Prefill

Create one helper that converts a patient profile location into the booking address shape:

- `line1`
- `city`
- `postalCode`
- `latitude`
- `longitude`
- `instructions`

Home-service booking flows should use this source order:

1. Server patient profile from `/patients/me`.
2. Cached `AuthContext.user.address`.
3. Existing empty/manual-entry behavior.

The patient can still edit the prefilled address or open the existing address picker. Provider-site bookings should continue to omit patient address data.

Apply the helper to every booking flow that asks the patient for a service, pickup, delivery, or home address:

- Care
- Equipment delivery
- Pharmacy domicile delivery
- Gym home service
- Radiology home service
- Nutrition home service
- Laboratory home service
- Veterinary home visit
- Ambulance pickup and destination defaults, when the saved profile location is a sensible pickup default
- Funeral ceremony location, only as a convenience default that the patient can replace

Existing flows that already prefill from auth should switch to the server-profile-first helper to avoid inconsistent behavior.

## Data Flow

### Provider Signup

The provider enters a required city and, optionally, a street address. The frontend submits both to registration. The backend saves city and optional address to the provider profile. The provider can later improve accuracy with dashboard geolocation.

### Dashboard Location Update

The user clicks the location button. The browser returns coordinates after permission is granted. The frontend reverse-geocodes the coordinates, then sends a profile update containing readable address fields and the coordinate pair.

### Profile Persistence

The backend validates the address and coordinates, mutates the authenticated patient or provider profile, saves through the existing unit of work, and returns the updated profile response.

### Frontend Cache Sync

After a successful update, the frontend invalidates the patient or provider profile query. It also updates the auth address cache so booking flows opened in the same session see the new saved location.

### Booking Creation

When a patient starts a home-service booking, the booking flow reads `/patients/me` first. If the profile has a saved address, the flow pre-fills the booking address and coordinates. Booking submission continues to send the existing `address.latitude` and `address.longitude` fields.

## Error Handling

- If browser geolocation is unavailable, show a non-blocking message and keep manual address entry available.
- If permission is denied, do not retry aggressively. Keep the saved profile unchanged.
- If coordinates are captured but reverse-geocoding fails, do not save a blank or misleading address. Ask the user to retry or edit manually.
- If reverse-geocoding returns partial data, save only when there is at least a usable address line or city.
- If one coordinate is missing, reject the update before sending or through backend validation.
- If backend validation fails, show the normalized API error and keep the previous cached address.
- If profile update succeeds but auth-context cache update fails, treat the save as successful and rely on query invalidation to recover.
- If `/patients/me` fails during booking prefill, the booking flow should fall back to current manual entry behavior.

## Testing And Verification

Backend verification should cover:

- Patient profile update accepts and persists valid coordinate pairs.
- Provider profile update accepts and persists valid coordinate pairs.
- Coordinate validation rejects out-of-range latitude or longitude.
- Coordinate validation rejects a single coordinate without the other.
- Provider registration saves optional address when present and still allows signup without it.

Frontend verification should cover:

- Provider signup submits optional address without requiring it.
- Dashboard location action handles geolocation success, permission denial, and reverse-geocoding failure.
- Successful location update calls the correct patient or provider profile mutation.
- Booking prefill uses server patient profile before cached auth address.
- Provider-site booking paths continue to omit patient address data.

Default command verification after implementation should include:

- Backend: `dotnet build "Sanad Platform Official.sln"` from `Sanad CareAtHome Backend/`.
- Frontend: `npm run lint` and `npm run type-check` from `CareAtHomeFinal/`.

## Acceptance Criteria

- Providers can complete signup with city only or city plus optional address.
- Provider signup address, when supplied, is saved to the provider profile.
- Patient and provider profiles expose saved coordinates in self-profile responses.
- Patient and provider self-profile updates accept valid coordinate pairs.
- `AppLayout` top-bar location action saves reverse-geocoded address fields and coordinates for patient and provider users.
- The app never captures dashboard coordinates without a user click.
- Home-service booking flows prefill patient address from server profile first.
- Booking flows still let the patient edit or replace the prefilled address.
- Provider-site bookings do not send patient address data.
- Live provider tracking remains out of scope.

## Risks

- Location is sensitive profile data. Logging and error reporting must not expose exact coordinates.
- Reverse-geocoding can return incomplete or imprecise Tunisian address data. The UI must make manual correction easy.
- Some booking flows currently map address data differently. A shared helper is needed to prevent inconsistent prefill behavior.
- Updating `AuthContext.user.address` and TanStack Query caches in two places can drift if the mutation flow is not centralized.
- Existing frontend changes are already present in unrelated service and booking files. Implementation should avoid overwriting those changes.

## Open Decisions

No product decisions remain open for this spec.

No implementation placement decisions remain open. The location action belongs in `AppLayout`'s authenticated top bar.
