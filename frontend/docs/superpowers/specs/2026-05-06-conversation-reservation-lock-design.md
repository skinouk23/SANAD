# Conversation Reservation Lock Design

Date: 2026-05-06

## Summary

Conversations must stay readable, but message sending must require an active reservation between the same patient and professional. An active reservation is a booking in `Confirmed`, `ProviderOnWay`, or `InProgress`. If no such booking exists, existing conversations open in read-only mode and show a clear lock message. New conversations must not be created without an active reservation.

This design extends the existing conversation sendability contract. The backend remains authoritative through `canSendMessage` and `messagingBlockedReason`; the frontend reflects those fields in the inbox, chat, and contact entry points. A patient-facing entry-status check lets the provider contact UI disable the message action before it tries to create a conversation.

## Current State

The backend already has a dedicated `Features/Conversations` slice with conversation DTOs, query projections, and send-message command enforcement. `ConversationResponse` already includes `canSendMessage` and `messagingBlockedReason`.

The current lock rules cover conversation activity and patient/provider messaging preferences. They do not check whether the patient and provider have an active reservation. `SendMessageHandler` also does not enforce a reservation gate.

The frontend messaging feature already parses `canSendMessage` and `messagingBlockedReason`. `MessageChatPage` already disables the composer and shows a banner when messaging is blocked. The missing frontend work is to understand the new reservation blocked reason and to handle failed conversation entry from provider contact surfaces.

## Goals

- Require a confirmed-or-later active reservation before either participant can send messages.
- Keep existing conversations readable when the reservation gate is closed.
- Prevent creation of new conversations when there is no active reservation.
- Show a reserve-first message instead of a generic failure when the patient tries to contact a professional without an active reservation.
- Disable the provider contact message action when the backend can determine that no existing conversation can open and no active reservation allows creation.
- Preserve the existing `ApiResponse<T>` shape and current conversation DTO pattern.
- Keep the change scoped to conversations, booking access checks, and the messaging UI.

## Non-Goals

- Do not add a new realtime chat system.
- Do not change message history visibility for existing conversations.
- Do not introduce a separate conversation lifecycle job that toggles `Conversation.IsActive` based on bookings.
- Do not broaden active reservations to `Pending`, `Completed`, or `Validated` bookings.
- Do not add tests unless explicitly requested during implementation.

## Business Rules

Messaging is unlocked only when all of these are true:

- The conversation is active.
- The sender is one of the conversation participants.
- The counterpart's messaging preferences allow the sender to message them.
- The patient-provider pair has at least one booking with status `Confirmed`, `ProviderOnWay`, or `InProgress`.

The reservation gate applies in both directions. Patients and providers are both read-only without an active confirmed-or-later booking.

Existing conversations still open when the gate is closed. The user can read old messages, but the composer is disabled.

New conversations are not created without an active reservation. If a patient opens a professional contact modal without an existing conversation and without an active reservation, the frontend disables the message action, shows a reserve-first message, and keeps the user on the current screen.

## Recommended Approach

Use a backend-authoritative access gate and frontend display hints.

The backend computes sendability from preferences and reservation state in one place. Read endpoints project the result into `ConversationResponse`. Write endpoints recompute the result before creating messages. This prevents stale clients or direct API calls from bypassing the rule.

The frontend treats `canSendMessage` as the source of truth for enabling the composer. It uses `messagingBlockedReason` only to choose the user-facing explanation.

## Backend Design

### DTO Contract

Add one stable blocked reason code:

```text
no_active_reservation
```

Extend the existing `ConversationMessagingAccess` record with this reservation state:

```text
HasActiveReservation
```

The public `ConversationResponse` shape stays the same. It continues to expose:

- `canSendMessage`
- `messagingBlockedReason`

The frontend schema accepts the new reason code. No new endpoint is required for the chat detail page.

### Active Reservation Check

The conversation repository should use a reusable query that checks `Bookings` for the same `PatientId` and `ProviderId` with one of these statuses:

- `Confirmed`
- `ProviderOnWay`
- `InProgress`

The query should use `AsNoTracking()` and `AnyAsync()` because it only answers an access question. It should not load booking rows.

The existing `HasActiveBookingsForServiceAsync` method cannot be reused directly because it is service-scoped and includes `Pending`. The conversation rule is pair-scoped and excludes `Pending`.

### Read Projection

`CreateConversationProjection` should compute `canSendMessage` as:

```text
conversation is active
and preference rule allows sender
and active reservation exists
```

`messagingBlockedReason` should report the most specific applicable reason. Preference blocks should keep their existing reason codes. If preferences allow messaging but no active reservation exists, return `no_active_reservation`.

This keeps existing preference behavior intact and adds the reservation rule without changing consumers that only read `canSendMessage`.

### Get Or Create Conversation

`GetOrCreateConversationHandler` should look up the existing patient-provider conversation before applying create-only blockers. It should return an existing conversation for the pair even when it is currently locked by the reservation rule or by preferences. This allows old chat history to open in read-only mode.

If no conversation exists, the handler should create one only when the pair has an active confirmed-or-later booking. Without an active reservation, it should throw `InvalidOperationException` with a clear reserve-first message.

Preference-disabled messaging can still block creation, because creating a new chat is unnecessary if the target has disabled the relevant direction. Existing conversations are still returned read-only.

### Conversation Entry Status Endpoint

Add a patient-scoped entry-status endpoint in the Conversations slice:

```text
GET /api/v1/conversations/entry-status?providerId={providerId}
```

The endpoint should require the `patient` role. It returns a small DTO with:

- `providerId`
- `existingConversationId`
- `canOpenConversation`
- `canCreateConversation`
- `canSendMessage`
- `messagingBlockedReason`

The endpoint resolves the authenticated patient's profile, checks whether a conversation already exists for the pair, and computes messaging access with the same helper used by conversation reads and sends.

`canOpenConversation` is true when an existing conversation exists, even if `canSendMessage` is false. This lets the UI open old chat history in read-only mode. If no conversation exists, `canOpenConversation` is true only when a new conversation can be created. Without an active reservation, `canOpenConversation` and `canCreateConversation` are false and `messagingBlockedReason` is `no_active_reservation`.

This endpoint is an advisory UI hint. `POST /conversations` and `POST /conversations/{id}/messages` remain authoritative and must enforce the same rules.

### Send Message

`SendMessageHandler` should keep its current checks:

- Conversation exists.
- Sender is a participant.
- Conversation is active.
- Preferences allow the sender to message.

It should then enforce the active reservation gate with the same access helper used by `GetOrCreateConversationHandler`. If no active reservation exists, it should throw `InvalidOperationException`. The existing transaction and denormalized counter updates stay unchanged.

## Frontend Design

### Schema And Types

`MessagingBlockedReasonSchema` should accept `no_active_reservation` in addition to the existing preference reasons.

The frontend should not infer reservation state from local booking data inside the chat page. It should rely on `conversation.canSendMessage` because the backend has the complete, current booking state.

### Chat Page

`MessageChatPage` should map `no_active_reservation` to a localized reserve-first lock message. The chat should still render history and keep the composer disabled when `canSendMessage` is false.

Recommended English copy:

```text
Messaging is available after you have a confirmed active reservation with this professional.
```

Recommended French copy:

```text
La messagerie est disponible après confirmation d'une réservation active avec ce professionnel.
```

Arabic, German, and Dutch translations should be added alongside existing message keys to preserve localization coverage.

### Provider Contact Entry

`ProviderContactModal` should fetch the entry-status endpoint when the viewer is an authenticated patient and the modal has a provider ID.

If `existingConversationId` is present, the message action stays enabled and navigates directly to that conversation. The chat page then shows the read-only lock banner if `canSendMessage` is false.

If no existing conversation exists and `canOpenConversation` is false, the modal disables the message action and shows a localized reserve-first message. If the entry-status request fails, the modal may keep the current click-to-open behavior and rely on the authoritative `POST /conversations` fallback, but no successful creation can bypass the backend rule.

### Provider Dashboard Entry

Provider dashboard message actions originate from appointment rows. These actions can remain visible for eligible patient rows, but the backend still enforces the confirmed-or-later rule. If an appointment is stale or no longer eligible, the provider sees the same business-rule failure.

## Data Flow

### Open Existing Conversation

1. The user opens the inbox or a chat detail route.
2. The backend projects each conversation with `canSendMessage` and `messagingBlockedReason`.
3. The frontend renders message history regardless of lock state.
4. The frontend disables the composer when `canSendMessage` is false.
5. The frontend shows the lock banner for `no_active_reservation` when that reason is present.

### Send Message

1. The frontend attempts sending only when the current conversation allows it.
2. The backend reloads the conversation and recomputes access.
3. The backend rejects the send if the active reservation no longer exists.
4. On success, the backend creates the message and updates denormalized conversation fields.
5. On failure, the frontend rolls back the optimistic message and shows an error. The follow-up query invalidation refreshes the lock state.

### Start Conversation From Provider Contact

1. The patient clicks the message action on a professional contact modal.
2. The frontend fetches the entry-status endpoint for that provider.
3. If an existing conversation exists, the frontend opens it directly.
4. If no conversation exists and the pair can create one, the frontend calls `POST /conversations`.
5. If no conversation exists and no active reservation exists, the frontend disables the message action, shows a reserve-first message, and stays on the current screen.
6. If the status becomes stale, `POST /conversations` still enforces the same rule.

## Error Handling

Use existing backend exception mapping:

- `KeyNotFoundException` for missing conversations or participant-hidden conversations.
- `UnauthorizedAccessException` for authenticated users who are not allowed to access the conversation endpoint.
- `InvalidOperationException` for business-rule failures, including no active reservation and messaging preference blocks.

The successful read DTO is the stable UI signal. Error text from failed mutations is a fallback for stale UI or entry actions.

## Verification Plan

Backend verification:

- Run `dotnet build "Sanad Platform Official.sln"` from `Sanad CareAtHome Backend/`.
- Verify an existing conversation with no `Confirmed`, `ProviderOnWay`, or `InProgress` booking returns `canSendMessage: false` and `messagingBlockedReason: "no_active_reservation"`.
- Verify `POST /conversations/{id}/messages` rejects sending without an active reservation.
- Verify `POST /conversations` does not create a new conversation without an active reservation.
- Verify `GET /conversations/entry-status?providerId=...` returns an existing conversation ID when old chat history exists, even if sending is locked.
- Verify `GET /conversations/entry-status?providerId=...` returns `canOpenConversation: false` and `messagingBlockedReason: "no_active_reservation"` when no conversation or active reservation exists.
- Verify `Confirmed`, `ProviderOnWay`, and `InProgress` bookings unlock sending.
- Verify existing preference blocks still produce their existing reason codes.

Frontend verification:

- Run `npm run lint` from `CareAtHomeFinal/`.
- Run `npm run type-check` from `CareAtHomeFinal/`.
- Open an existing locked conversation and confirm message history loads while the composer is disabled.
- Confirm the lock banner explains that a confirmed active reservation is required.
- Confirm provider contact entry disables the message action and shows the reserve-first message when no existing conversation or active reservation exists.
- Confirm provider contact entry opens an existing conversation even when that conversation is read-only.
- Confirm unlocked conversations still send normally.

## Implementation Notes

- Keep changes scoped to `Features/Conversations` and the booking query needed for pair-level access.
- Do not modify unrelated dirty files in either subproject.
- Preserve `ApiResponse<T>` response shapes.
- Preserve existing optimistic-send rollback behavior.
- Keep new frontend copy in the existing translation files.
