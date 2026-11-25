# Session-Based Booking Flow Design

Date: 2026-05-06
Status: Approved design, pending written spec review

## Context

Care@Home has one booking feature spread across two sibling apps:

- Backend: `Sanad CareAtHome Backend/BackEnd/SanadPlatform.API/Features/Bookings/`
- Frontend: `CareAtHomeFinal/src/features/bookings/`, `src/features/delivery/`, and `src/features/patient/appointments/`

Current booking creation, pricing, confirmation, provider delivery, patient validation, payment settlement, and booking history all revolve around one `Booking` row. That row stores schedule fields, lifecycle status, provider journey timestamps, validation code fields, payment amounts, and completion fields.

This works for simple single-visit bookings, but it creates ambiguity once bookings can last multiple days or need stronger proof of service completion.

## Current Behavior Found

The backend already has a booking state machine with these statuses: `Pending`, `Confirmed`, `ProviderOnWay`, `InProgress`, `Completed`, `Validated`, `Cancelled`, `NoShow`, and `Disputed`.

Implemented backend transitions include booking creation, provider confirmation, cancellation, provider start journey, provider arrival, provider start service, provider completion, patient validation, and patient rating. `NoShow` and `Disputed` are modeled but do not have complete user-facing flows.

The current validation code is generated when the booking is created, stored on the parent booking, and returned in the create response. Patient validation later expects a 6-digit code, but the current patient appointment UI calls validation without submitting one. Provider active delivery also completes a booking without entering a code.

After provider completion, the booking becomes `Completed`. Patient validation changes it to `Validated`, settles cash wallet reservations, and updates some denormalized patient/provider stats. `AutoValidateAt` is set on completion, but no active auto-validation job was found during exploration.

Multi-day care currently sends a contiguous `startDate` and `endDate`, and backend pricing multiplies by day count. The parent booking still has only one lifecycle, one verification code, and one completion/validation state for the whole range. Equipment rental visually selects a range, but its top-level booking `endDate` remains equal to `startDate`; the rental end date lives in equipment-specific configuration.

## Problem

The current model mixes two concepts:

- The commercial booking: what the patient bought, how much it costs, who provides it, and how payment settles.
- The executed session: the actual visit, delivery, rental handoff, or service occurrence that a provider starts, attends, completes, validates, cancels, or disputes.

This causes several logical gaps:

- The provider cannot enter a patient verification code at completion.
- The patient validation flow and backend validation contract disagree.
- Verification codes are created too early and can expire before long-scheduled or multi-day services finish.
- A multi-day booking cannot track each day independently.
- Cancelling or disputing one day of a multi-day booking is not cleanly represented.
- Provider schedules, active delivery, patient tracking, and analytics all rely on parent booking dates or statuses instead of actual session dates and states.

## Goal

Introduce a session-based booking model for all booking types.

Every booking should have one parent `Booking` and one or more child `BookingSession` records. Single-day bookings get one session. Multi-day care bookings get one session per scheduled day.

The parent booking owns commercial and aggregate concerns. Each session owns execution concerns: journey state, arrival, start, completion, verification code, validation attempts, dispute, no-show, and session-level cancellation.

The provider enters the patient's verification code when completing a session. A valid code immediately validates that session.

## Non-Goals

- Do not implement non-contiguous multi-day date selection in this design. Care remains a contiguous date range initially.
- Do not redesign payment providers or introduce a new payment gateway.
- Do not replace all booking screens with a new wizard.
- Do not change unrelated visual styling beyond the UI needed to expose sessions and code entry.
- Do not add a parent `PartiallyCancelled` status in the first implementation.
- Do not normalize equipment rental into per-day rental sessions beyond the one default session that every booking receives.

## Chosen Approach

Use the larger platform model: all bookings have sessions.

`Booking` remains the parent aggregate. It owns patient, provider, selected services, quote totals, payment method, wallet reservation and settlement fields, cancellation metadata, and parent roll-up status.

`BookingSession` becomes the execution unit. It owns scheduled date, scheduled start/end time, timezone, session status, provider journey timestamps, service start/completion timestamps, verification code metadata, validation attempts, cancellation metadata, no-show metadata, and dispute metadata.

All provider execution actions target a session. Parent booking status is derived from child sessions and explicit parent actions such as provider acceptance or full cancellation.

## Alternatives Considered

### Keep One Booking And Add Provider Code Completion

The provider completion endpoint could accept `validationCode` and move the parent booking directly from `InProgress` to `Validated`.

This is the smallest fix for the missing code-entry path, but it leaves multi-day bookings with one lifecycle, one code, and one completion result. It does not support cancelling or disputing one visit while keeping the rest.

### Parent Booking With Sessions Only For Care

Care bookings could get child sessions, while other booking types keep the current single booking lifecycle.

This fits the clearest multi-day use case, but it leaves provider execution split across two models. Provider active delivery, patient tracking, verification code handling, and disputes would need both booking-level and session-level code paths.

### Sessions For All Bookings

Every booking gets at least one session. Multi-day care gets one session per day.

This is the selected approach. It gives one execution model to provider delivery, patient tracking, code validation, disputes, no-shows, session cancellation, and schedules. It costs more migration effort, but it removes the largest logical ambiguity.

## Domain Model

### Booking Parent

The parent `Booking` should represent the contract and payment container.

It owns:

- Patient, provider, and service selection.
- Service line items and booking-type configuration.
- Address and notes snapshots that apply to the booking unless overridden by a future session-level feature.
- Quote totals, platform fee, commission, provider amount, and currency.
- Payment method and payment relationship.
- Cash wallet reservation and parent settlement metadata.
- Parent-level cancellation if the whole booking is cancelled.
- Parent roll-up status and session summary counts.

The parent should not own provider journey state or completion proof after the session model exists.

### BookingSession

Each `BookingSession` should represent one scheduled service occurrence.

It owns:

- `BookingId`
- `ProviderId` and `PatientId` for efficient scoped queries
- `ScheduledDate`
- `ScheduledStartTime`
- `ScheduledEndTime`
- `Timezone`
- `Status`
- `ProviderDepartedAt`
- `ProviderArrivedAt`
- `ServiceStartedAt`
- `ServiceCompletedAt`
- `VerificationCode`
- `VerificationCodeGeneratedAt`
- `VerificationCodeExpiresAt`
- `VerificationAttempts`
- `VerifiedAt`
- `VerificationMethod`
- `CancelledAt`, `CancelledBy`, and `CancellationReason`
- `NoShowAt` and `NoShowReason`
- `DisputedAt` and `DisputeReason`

The backend should store the code encrypted at rest because the patient app must be able to retrieve the active code after page refresh. The provider must never receive the verification code from a provider-facing endpoint.

### Session Counts

Parent booking responses should expose session counts instead of adding a `PartiallyCancelled` parent status.

Recommended fields:

- `totalSessions`
- `confirmedSessions`
- `inProgressSessions`
- `validatedSessions`
- `cancelledSessions`
- `disputedSessions`
- `noShowSessions`
- `remainingSessions`

These counts let the UI show partial progress without overloading the parent status enum.

## Lifecycle

### Parent Booking Lifecycle

The parent lifecycle should stay compact:

- `Pending`: created, waiting for provider confirmation.
- `Confirmed`: provider accepted and at least one non-cancelled session remains.
- `InProgress`: at least one session is `ProviderOnWay`, `Arrived`, or `InProgress`.
- `Completed`: retained for compatibility and exceptional/manual resolution paths where service execution has finished but payable validation is not complete. The normal new happy path should move the parent to `Validated` when the final payable session validates.
- `Validated`: all payable sessions are validated.
- `Disputed`: at least one session is disputed.
- `Cancelled`: the parent was cancelled before execution or all sessions were cancelled.

The parent should update through a roll-up service whenever a session changes. Handlers should not guess parent status independently.

### Session Lifecycle

Sessions should use explicit execution statuses:

```text
Pending -> Confirmed -> ProviderOnWay -> Arrived -> InProgress -> Validated
```

Allowed side paths:

- `Pending` or `Confirmed` -> `Cancelled`
- `ProviderOnWay` or `Arrived` -> `NoShow`
- `Arrived` or `InProgress` -> `Disputed`
- `InProgress` -> `Validated` with a valid code

`Validated`, `Cancelled`, `NoShow`, and resolved terminal dispute outcomes should be terminal for normal provider execution.

`Arrived` should be a real session status, not only a timestamp. This keeps provider buttons, patient tracking, code visibility, analytics, and transition validation clear.

## Verification Code Flow

The patient should not receive a verification code at booking creation.

The backend should generate or activate the session verification code when the provider marks that session as `Arrived`. The code belongs to that session, not to the parent booking.

Patient-facing APIs may return the code only when all of these conditions are true:

- The caller is the booking's patient.
- The session status is `Arrived` or `InProgress`.
- The code has not expired or has been regenerated for the active session.

Provider-facing APIs must not return the code. They should expose only whether a code is required, how many attempts remain, and whether completion is locked.

At completion, the provider enters the 6-digit code. A valid code should atomically:

- Set `ServiceCompletedAt`.
- Set `VerifiedAt`.
- Set `VerificationMethod` to `provider_entered_patient_code`.
- Move the session to `Validated`.
- Trigger parent roll-up.
- Trigger settlement only if this validation causes the parent to reach full payable validation. Otherwise, record session progress without releasing parent payment.

The current create response should stop exposing `validationCode` after migration.

## Provider Flow

Provider work queues should list sessions, not only parent bookings.

For each assigned session, the provider can:

- Confirm the parent booking before execution begins.
- Start journey for a confirmed session.
- Mark arrived.
- Start service.
- Complete service by entering the patient code.
- Open a dispute when the patient refuses to provide a code or the provider cannot complete normal validation.
- Cancel a future session when cancellation rules allow it.

The active delivery route should take a `sessionId`. It can still show parent booking context, patient details, service name, address, price context, and schedule details, but the state transitions target the session.

The provider completion UI should include a code-entry dialog or completion panel. It should not call completion without a code.

## Patient Flow

Booking creation forms remain mostly unchanged.

After creation, the patient sees the parent booking and its generated session schedule. The confirmation screen should not show a validation code.

In patient appointments and tracking:

- Upcoming tabs show future sessions grouped by parent booking.
- Active tracking shows provider journey state for the active session.
- When the provider marks `Arrived`, the patient sees the 6-digit session code.
- The patient gives that code to the provider after service completion.
- Once the provider submits a valid code, the session becomes validated without a separate patient validation button.

The old patient validation action should be removed or repurposed. If patient confirmation is still desired later, it should become a dispute or feedback flow, not the normal settlement gate.

## Multi-Day Care

Care remains the initial true multi-day flow.

For a care booking with `startDate` and `endDate`, the backend should generate one session per included date. Each session uses the parent booking's daily start/end time and timezone.

Availability checks must validate every generated session before creating the booking. If any date/time is unavailable, creation should fail with a clear conflict response that identifies the unavailable date when possible.

Non-contiguous day selection is out of scope for this design. It can be added later by replacing date-range expansion with an explicit selected-date list.

## Session-Level Cancellation

A patient or provider should be able to cancel one future session without cancelling the whole parent booking, subject to cancellation rules.

Rules:

- Session cancellation is allowed only before the session starts.
- Cancelling one session sets only that session to `Cancelled`.
- The parent remains active if at least one payable session remains.
- Parent responses expose session counts so the UI can show partial cancellation.
- If all sessions are cancelled, the parent becomes `Cancelled`.
- The cancellation flow must apply a session-level refund, credit, or cancellation fee rule.

The first implementation should not add a parent `PartiallyCancelled` status. Counts carry that information.

## Disputes And No-Code Cases

If the provider cannot get a valid completion code, they should open a session dispute.

Valid dispute reasons include:

- Patient refused to provide code.
- Code did not match after allowed attempts.
- Patient left before completion.
- Service could not be completed for another stated reason.

Disputing one session should not discard validated sessions. The parent rolls up to `Disputed` while retaining session-level results.

No-show can remain modeled, but this design does not require a full no-show product flow before the session model is introduced. If no-show is implemented, it should be session-level.

## Payment And Settlement

The safest first settlement model is parent settlement when all payable sessions are validated.

This avoids partial double-settlement while the existing finance code still centers on parent bookings and payments. Session validation records proof and progress. Parent validation triggers existing payment settlement, wallet settlement, provider revenue updates, and patient/provider completed stats once all payable sessions are validated.

If the business later needs provider payouts after each day, the finance model can add session-level ledger references. That should be a separate finance design because it affects wallet reservations, provider balances, refunds, and revenue recognition.

The parent `Completed` status should not drive normal settlement in the new flow. It exists to preserve compatibility with existing rows and to support future exceptional workflows where execution is complete but validation is blocked.

For session cancellation, the system needs an explicit value calculation for the cancelled session. For equal daily care sessions, the first version can allocate the booking service subtotal evenly across payable sessions, then apply policy fees or credits. More complex service-specific allocation can follow later.

## API Design

Parent booking endpoints remain responsible for quote, create, parent detail, parent list, provider confirmation, and full parent cancellation.

New or migrated session endpoints should include:

```text
GET    /api/v1/booking-sessions
GET    /api/v1/booking-sessions/{sessionId}
POST   /api/v1/booking-sessions/{sessionId}/start-journey
POST   /api/v1/booking-sessions/{sessionId}/arrive
POST   /api/v1/booking-sessions/{sessionId}/start-service
POST   /api/v1/booking-sessions/{sessionId}/complete
POST   /api/v1/booking-sessions/{sessionId}/dispute
POST   /api/v1/booking-sessions/{sessionId}/cancel
```

`complete` request:

```json
{
  "validationCode": "123456"
}
```

`complete` response should include:

- Session id and status.
- Parent booking id and roll-up status.
- Remaining attempts when completion fails because of a wrong code.
- Settlement state when parent validation is reached.

Patient session responses may include `verificationCode` only under the visibility rules in this spec. Provider responses should never include it.

## Frontend Design

Booking forms keep their current quote and create flow, but create responses and success screens should stop relying on a validation code.

Frontend schemas and services should add session DTOs and session mutations. Provider delivery hooks should move from booking mutation endpoints to session mutation endpoints.

Provider active delivery should change from `appointmentId` as parent booking id to session id. If route compatibility matters, the page can load a parent booking and redirect to the active session, but the execution state should be session-based.

Patient appointments should group sessions under parent bookings where useful. The validation tab should be removed or reworked because validation happens through provider code completion. History and rating should become available after the parent booking is fully validated, or after a session is validated if session-level reviews are introduced later.

Patient tracking should show the verification code only after the session is `Arrived`. It should also explain that the code is shared with the provider at completion.

## Error Handling

Wrong code:

- Reject completion.
- Increment session verification attempts.
- Keep session `InProgress`.
- Return attempts remaining.

Too many wrong attempts:

- Lock code-based completion for the session.
- Require the provider to open a dispute.

Expired code:

- If the session is still `Arrived` or `InProgress`, allow regeneration for the patient-visible code through an explicit backend rule.
- If the session is no longer active, require dispute or admin resolution.

No code or patient refusal:

- Provider opens a dispute with a required reason.

Partial multi-day failure:

- Only the affected session becomes `Disputed`, `Cancelled`, or `NoShow`.
- The parent roll-up reflects the unresolved state through status and counts.

Schedule conflict:

- Creation should fail before inserting the parent booking when any generated session conflicts.
- Conflict responses should identify the conflicting date/time when possible.

## Migration Plan

1. Add `BookingSession` backend entity, configuration, repository methods, and migration.
2. Backfill one session for each existing booking using parent schedule and lifecycle fields.
3. Generate multiple sessions for new multi-day care bookings.
4. Add a parent roll-up service and call it after every session mutation.
5. Add session-first provider execution endpoints.
6. Move provider active delivery and provider schedules to sessions.
7. Move patient tracking and patient appointments to sessions.
8. Remove validation-code exposure from booking creation responses.
9. Deprecate parent-level start, arrive, complete, and validate endpoints after frontend migration.

The implementation can be staged, but the final state should have one execution model: sessions.

## Acceptance Criteria

- Every new booking creates at least one `BookingSession`.
- Multi-day care creates one session per included day.
- Provider journey, arrival, service start, completion, dispute, no-show, and session cancellation target sessions.
- Verification codes are generated or activated only when a provider marks a session as arrived.
- Patient-facing APIs expose the code only to the patient and only for active arrived/in-progress sessions.
- Provider-facing APIs never expose the code.
- Provider completion requires a valid code.
- A valid provider-entered code immediately validates the session.
- The parent booking becomes `Validated` only when all payable sessions are validated.
- One future session can be cancelled while the rest of the parent booking remains active.
- Parent responses include session counts for partial progress and partial cancellation.
- The old patient validation-without-code path no longer controls normal settlement.

## Testing And Verification

Backend verification should cover:

- Session generation for single-day bookings.
- Session generation for multi-day care ranges.
- Provider transition rules for session lifecycle.
- Verification code generation on arrival.
- Code visibility by role and session state.
- Completion with valid, invalid, expired, and locked codes.
- Session-level cancellation without parent cancellation.
- Parent cancellation when all sessions are cancelled.
- Parent roll-up for validated, disputed, cancelled, and mixed session states.
- Payment settlement only once when the parent reaches full validation.

Frontend verification should cover:

- Booking success screens do not display a code.
- Patient tracking displays the code only after arrival.
- Provider completion requires code entry.
- Provider session actions call session endpoints.
- Patient appointment lists show session progress and counts.
- Multi-day care displays separate sessions under one parent booking.

Default command verification after implementation should include backend `dotnet build "Sanad Platform Official.sln"` and frontend `npm run lint` plus `npm run type-check` from the correct subproject directories.

## Risks

- This is a cross-app migration touching backend schema, booking APIs, provider delivery, patient tracking, patient appointments, finance settlement, and existing booking DTOs.
- Existing rows need a safe backfill so old bookings remain visible.
- Parent and session statuses can drift if roll-up logic is duplicated instead of centralized.
- Finance settlement must be idempotent to avoid double payment release.
- Frontend routes and labels currently use `appointmentId` for parent booking ids; migration must avoid broken links during rollout.

## Open Decisions

No product decisions remain open for this spec.

Implementation planning still needs to break this into safe vertical slices, likely starting with backend session storage and read-only backfill before changing provider execution.
