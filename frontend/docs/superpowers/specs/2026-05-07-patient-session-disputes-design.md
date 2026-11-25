# Patient Session Disputes Design

Date: 2026-05-07
Status: Approved design, pending written spec review

## Context

Care@Home now models booking execution through booking sessions. The backend has a parent `Booking` for commercial and payment concerns and child `BookingSession` records for provider execution, verification, no-show, cancellation, and dispute state. The frontend already has booking session schemas, service calls, mutations, mock handlers, provider delivery UI, patient tracking, and patient appointments views.

Provider-side session disputes already exist in a narrow form. `POST /api/v1/booking-sessions/{sessionId}/dispute` is provider-owned and stores `DisputedAt` and `DisputeReason` directly on `BookingSession`. The project also contains richer `Dispute` and `DisputeMessage` entities, but the current `Dispute` model is booking-level and one-to-one, and it does not identify a specific `BookingSession`.

The patient does not currently have a way to dispute a session. Patient tracking can display a `Disputed` status, but it cannot open a dispute.

## Goal

Allow a patient to dispute a specific booking session from the tracking flow. The dispute freezes settlement until an admin resolves it. The first version should collect a structured reason and a free-text description, let the provider see the dispute read-only, and expose admin-only API endpoints to resolve the dispute as either refunding the patient or paying the provider.

## Non-Goals

- Do not add an admin dispute management screen in this version.
- Do not add patient-provider dispute chat in this version.
- Do not add evidence upload or attachment storage in this version.
- Do not let the provider respond to patient-opened disputes in this version.
- Do not support whole-booking disputes in this version.
- Do not redesign booking creation, provider delivery, or the broader payment gateway.

## Chosen Approach

Use a session-level dispute record tied to one `BookingSession`.

The patient opens the dispute from tracking. The backend validates ownership, status eligibility, duplicate dispute rules, and the 48-hour completed-session deadline. It creates a `Dispute` record, marks the session as `Disputed`, updates parent booking roll-up, and leaves settlement frozen until admin resolution.

This approach fits the session-based booking model and avoids overloading the existing provider-only dispute endpoint. It also avoids the complexity of a full dispute center with messages, evidence, and provider responses.

## Alternatives Considered

### Reuse The Existing Provider Dispute Endpoint

The patient could call the current session dispute endpoint and store only `DisputeReason` on `BookingSession`.

This is the fastest path, but it is too thin for admin review. It lacks opened-by tracking, a dispute lifecycle, resolution metadata, and a clear boundary between provider code-failure disputes and patient complaints.

### Full Dispute Center

The platform could activate `DisputeMessage`, add evidence uploads, support provider responses, and build admin screens at the same time.

This is stronger long term, but it is too large for the current need. The approved first version needs reason, description, provider visibility, and admin API resolution only.

### Session-Level Dispute Record

The selected approach adds a real dispute record for one session and keeps the UI/API narrow.

It gives the admin enough information to decide the outcome, keeps payment behavior explicit, and leaves room to add messages, evidence, and admin screens later.

## Domain Model

### Dispute

`Dispute` should become capable of representing a session dispute. Add a required `BookingSessionId` for patient session disputes and a relationship to `BookingSession`.

Recommended fields for the first version:

- `Id`
- `DisputeNumber`
- `BookingId`
- `BookingSessionId`
- `PaymentId`, nullable; set it from the parent booking payment when present, otherwise store `null`
- `ReportedByUserId`
- `ReportedByRole`, with `Patient` for this flow
- `ReportedAgainstUserId`, usually the provider user
- `Reason`
- `Description`
- `Status`, with `Open` and `Resolved` as the first-version values
- `OpenedAt`
- `ResolvedAt`
- `ResolvedByUserId`
- `ResolutionOutcome`, with `RefundPatient` or `PayProvider` when resolved
- `ResolutionNote`

Allow only one open dispute per session. Historical resolved disputes can remain for audit, but a session should not have multiple active disputes.

### BookingSession

Keep these denormalized fields on `BookingSession` for fast session list and tracking display:

- `Status = Disputed`
- `DisputedAt`
- `DisputeReason`

The full dispute detail comes from `Dispute`. `BookingSession` should not become the source of truth for description, resolution notes, or admin outcome.

### State Transitions

The patient can open a dispute only from these session statuses:

- `Arrived`
- `InProgress`
- `Completed`

For `Completed`, the dispute must be opened within 48 hours of `ServiceCompletedAt`.

When a dispute opens, the session moves to `Disputed`. Normal provider and patient actions cannot move it out of `Disputed`.

Admin resolution is the only transition out of `Disputed`:

- `RefundPatient`: close the dispute in the patient's favor, move the session to the non-payable `Cancelled` outcome with a dispute-resolution cancellation reason, and apply the session refund allocation.
- `PayProvider`: close the dispute in the provider's favor and mark the session as validated/payable so settlement can continue.

The booking roll-up service should set the parent booking to `Disputed` while any child session has an open dispute.

## Backend API Design

### Open Patient Session Dispute

Endpoint:

```http
POST /api/v1/booking-sessions/{sessionId}/patient-dispute
```

Authorization:

- Patient only.
- The authenticated patient must own the session.

Request body:

```json
{
  "reason": "ServiceQualityIssue",
  "description": "The provider left before completing the requested service."
}
```

Validation:

- `reason` is required and must be one of the supported reason values.
- `description` is required, trimmed, and must be between 20 and 2000 characters.
- The session must exist and belong to the patient.
- The session status must be `Arrived`, `InProgress`, or `Completed`.
- A completed session must be within 48 hours of `ServiceCompletedAt`.
- The session must not already have an open dispute.

Response body:

```json
{
  "disputeId": "00000000-0000-0000-0000-000000000000",
  "disputeNumber": "DSP-20260507-0001",
  "bookingId": "00000000-0000-0000-0000-000000000000",
  "sessionId": "00000000-0000-0000-0000-000000000000",
  "status": "Open",
  "reason": "ServiceQualityIssue",
  "description": "The provider left before completing the requested service.",
  "openedAt": "2026-05-07T12:20:22Z"
}
```

The controller should return this payload through the existing `ApiResponse<T>` envelope.

### Get Session Dispute

Endpoint:

```http
GET /api/v1/booking-sessions/{sessionId}/dispute
```

Authorization:

- Patient who owns the session.
- Provider assigned to the session.
- Admin.

Response should include dispute number, status, reason, description, opened timestamp, opened-by role, resolution outcome, resolution note, and resolved timestamp when present.

### Resolve Dispute

Endpoint:

```http
POST /api/v1/disputes/{disputeId}/resolve
```

Authorization:

- Admin only.

Request body:

```json
{
  "outcome": "RefundPatient",
  "resolutionNote": "Service was not completed. Patient refund approved."
}
```

Supported outcomes:

- `RefundPatient`
- `PayProvider`

Resolution behavior:

- `RefundPatient` closes the dispute in the patient's favor. In version one, it maps the disputed session to the existing non-payable `Cancelled` path with a dispute-resolution cancellation reason, then applies the session refund allocation.
- `PayProvider` closes the dispute in the provider's favor, marks the session validated/payable, triggers booking roll-up, and lets settlement continue.

The first implementation should reuse existing settlement, refund, and roll-up services where possible. It should not duplicate payment logic inside the dispute handler.

## Backend Implementation Boundaries

Add a vertical slice under `Features/Bookings/` or a clearly named `Features/Disputes/` slice. The chosen location should keep booking-session state changes, dispute records, and payment resolution easy to reason about.

Recommended backend units:

- `OpenPatientSessionDisputeCommand` and handler.
- `ResolveSessionDisputeCommand` and handler.
- `GetSessionDisputeQuery` and handler.
- `DisputeRepository` for tracked write reads and scoped read queries.
- `DisputeConfiguration` update for `BookingSessionId`, indexes, and relationship mapping.
- FluentValidation validators for open and resolve commands.
- DTOs for open request, open response, detail response, and resolve request.

All write handlers should use `IUnitOfWork` transactions. Repository reads should use `AsNoTracking()` unless the handler intends to mutate the entity.

## Frontend Design

### Tracking Entry Point

The patient sees the dispute action in the tracking flow.

Show `Dispute session` only when the current session is eligible:

- Status is `Arrived`, `InProgress`, or `Completed`.
- If status is `Completed`, `ServiceCompletedAt` is within 48 hours.
- There is no open dispute.

Do not show the action in appointments detail in this version.

### Dispute Form

Use the project's shared dialog or sheet primitives for the form. The form should use existing project form patterns.

Fields:

- `Reason`: required select.
- `Description`: required textarea.

Reason values:

- `ProviderDidNotArrive`
- `ServiceNotProvided`
- `ServiceQualityIssue`
- `WrongServiceOrItems`
- `SafetyOrConductConcern`
- `Other`

Submit behavior:

- Call the patient dispute mutation.
- Keep the dialog open and show inline errors if the API returns an error.
- On success, close the dialog, invalidate tracking/session queries, and show the session as disputed.

### Disputed State Display

When a session has an open dispute, tracking should show a read-only disputed-state panel:

- Dispute status: under admin review.
- Reason label.
- Description.
- Opened date.

When the dispute is resolved, tracking should show the resolution outcome. Show the resolution note only when `ResolutionNote` has text; otherwise omit the note row.

### Provider Visibility

Provider delivery and planning views should show a disputed badge or state when a patient dispute exists. Providers may read the reason and description, but they cannot respond in version one.

### Frontend API Units

Recommended frontend units:

- Extend booking schemas with patient dispute request and response schemas.
- Add service functions for opening a patient dispute and reading session dispute detail.
- Add TanStack Query options and mutations for dispute detail and open-dispute mutation.
- Update tracking UI to render the action, form, open state, and resolved state.
- Update MSW booking handlers for the new endpoints and response shapes.
- Add English, French, and Arabic translations for action text, form labels, reasons, success messages, errors, and disputed-state copy.

## Data Flow

1. Patient opens tracking for a session.
2. Frontend reads the session status and optional dispute detail.
3. Frontend shows `Dispute session` if the session is eligible.
4. Patient submits reason and description.
5. Backend validates ownership, status, deadline, and duplicate-dispute rules.
6. Backend creates a `Dispute`, marks the session `Disputed`, updates parent booking roll-up, and leaves settlement frozen.
7. Frontend refreshes tracking state and shows the dispute under admin review.
8. Provider views show a read-only disputed state.
9. Admin resolves the dispute by API.
10. Backend records the resolution, applies the refund or validation outcome, rolls up the booking, and lets payment processing continue.

## Error Handling

Use the existing global exception middleware and `ApiResponse<T>` envelope.

Expected errors:

- `401`: caller is not authenticated.
- `403`: caller is authenticated but not allowed to open, view, or resolve this dispute.
- `404`: session or dispute does not exist or is not visible to the caller.
- `400`: session status is not eligible, completed-session window expired, reason or description is invalid, there is already an open dispute, or the resolution outcome is unsupported.

The frontend should show these errors in the dispute form. It should not optimistically mark the session disputed before the mutation succeeds.

## Payment And Settlement Rules

An open dispute freezes settlement for the disputed session. The parent booking remains `Disputed` while any child session has an open dispute.

For `RefundPatient`, the backend should use the existing session cancellation/refund allocation path. The resolved session becomes non-payable, and the parent booking roll-up should no longer remain `Disputed` unless another open dispute exists.

For `PayProvider`, the backend should mark the session validated/payable and trigger the normal settlement path. If this is the final payable session, parent settlement can complete.

If existing payment services cannot express one of these outcomes cleanly, implementation should stop at an explicit handler error rather than silently changing financial state.

## Security And Authorization

- Patients can open disputes only for their own sessions.
- Patients can read dispute detail only for their own sessions.
- Providers can read dispute detail only for sessions assigned to them.
- Providers cannot resolve or respond to patient-opened disputes in version one.
- Admins can read and resolve disputes.
- Provider-facing APIs must not expose patient-only data beyond what is needed to understand the dispute reason and description.
- All responses must keep the existing `ApiResponse<T>` shape.

## Testing And Verification

Do not add tests by default unless explicitly requested.

If tests are requested later, the best backend tests are handler tests for:

- Patient ownership enforcement.
- Eligible and ineligible statuses.
- Completed-session 48-hour deadline.
- Duplicate open dispute prevention.
- Admin-only resolution.
- `RefundPatient` and `PayProvider` state outcomes.

The best frontend tests are tracking-flow tests for:

- Showing the dispute action only for eligible sessions.
- Hiding or disabling it after the 48-hour deadline.
- Submitting reason and description.
- Showing API errors inline.
- Rendering open and resolved dispute states.

Default verification commands after implementation:

```bash
# Backend, from Sanad CareAtHome Backend/
dotnet build "Sanad Platform Official.sln"

# Frontend, from CareAtHomeFinal/
npm run lint
npm run type-check
```

Manual smoke path:

1. Patient opens tracking for an `Arrived`, `InProgress`, or recently `Completed` session.
2. Patient opens the dispute form and submits a reason and description.
3. Tracking refreshes and shows the dispute under admin review.
4. Provider views the session and sees the disputed status read-only.
5. Admin resolves the dispute by API as `RefundPatient` or `PayProvider`.
6. Tracking and provider views show the resolved result.
7. Parent booking roll-up and settlement behavior match the chosen resolution.

## Open Implementation Notes

- The existing `Dispute` one-to-one relationship with `Booking` must be changed or extended so session disputes do not conflict with multi-session bookings.
- The existing provider-only dispute endpoint should stay separate unless a later refactor deliberately unifies provider and patient dispute creation behind a shared internal service.
- The current `Disputed` session state is terminal for normal execution. Admin resolution must be the only controlled escape path.
- The implementation must account for the existing uncommitted booking/session lifecycle changes in both frontend and backend worktrees before editing shared files.
