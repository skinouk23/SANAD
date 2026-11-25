# Booking Flow Action Row Design

Date: 2026-05-04
Status: Updated for non-sticky implementation

## Context

Care@Home has several booking flows under `src/features/bookings/flow/`. They share the same broad task: move a patient through service selection, scheduling, details, payment, and confirmation. The current flows do not place in-flow Back and Continue actions consistently.

The app also has a separate global header back button. `AppLayout` reads each route's `handle.parent` and renders a top-left back arrow when the route defines a parent. Booking routes define parent targets, so the header back button already gives users a consistent way to leave the booking page.

This spec covers only the in-flow step navigation actions inside booking flows.

## Problem

Users should not need to relearn the location of Back and Continue controls for each booking type. Today, flows place these actions in different ways: bottom rows, top-of-section buttons, full-width buttons, right-aligned buttons, and payment-specific rows.

This inconsistency is especially costly on mobile, where each booking type should keep the same action placement and visual hierarchy.

## Goal

Standardize in-flow booking step navigation so Back and Continue / Next appear in one predictable horizontal action row across desktop and mobile.

The row should sit inline at the bottom of the active step content or card. It should not stick to, float over, or follow the viewport while the user scrolls.

## Non-Goals

- Do not change global route back behavior in `AppLayout`.
- Do not redesign booking step content, pricing, payment logic, provider loading, or confirmation screens.
- Do not change route structure or booking data submission contracts.
- Do not introduce new form libraries or state ownership changes.
- Do not standardize unrelated non-booking multi-step flows in this spec.

## Chosen Approach

Use a shared inline action row for booking step navigation.

The action row belongs to the active step card or content section. It appears in normal document flow at the bottom of that step and does not become sticky while scrolling.

This approach keeps actions visually attached to the current booking step and preserves consistent Back-left / Continue-right placement across booking flows.

## Alternatives Considered

### Inline Docked Row

Place Back and Continue only at the bottom of each step card.

This is the selected approach. It keeps the controls part of the step content and avoids floating controls over form fields, validation messages, payment sections, or the app's bottom navigation.

### Always Sticky Footer

Place Back and Continue in a fixed viewport footer.

This is easy to find, but it can feel detached from the active step. It also increases overlap risk with the app's existing bottom navigation and mobile safe-area spacing.

### Sticky-to-Docked Row

Place the row inside the active step card and make it sticky within that card's scroll context.

This was rejected after review because the row should not follow the viewport while scrolling.

## Layout Rules

Use the same horizontal structure on desktop and mobile.

```text
[Back]                                      [Continue / Next]
```

On narrow mobile screens, keep the row horizontal:

```text
[Back]                         [Continue / Next]
```

Rules:

- Back appears on the left.
- Continue / Next appears on the right.
- Back uses the secondary or outline visual treatment.
- Continue / Next uses the primary visual treatment.
- The row uses enough gap and touch target height for mobile use.
- The row appears in normal document flow at the bottom of the active step content or card.
- The primary action should not jump to the left when Back is absent.

## Visibility Rules

The action row is for step navigation only. It should be visible when the user can move between booking steps.

Back:

- Hide in-flow Back on the first step.
- Show in-flow Back on later editable steps when returning to the previous step is valid.
- Keep the global header back button available for leaving the booking route.
- Do not show Back on final success screens unless it is a destination action with explicit copy.

Continue / Next:

- Show Continue / Next on editable pre-payment steps.
- Keep the button visible but disabled while required step data is incomplete.
- Use clear labels, such as `Next`, `Continue`, or `Continue to payment`, based on the next state.
- Replace normal Continue / Next with payment-specific primary actions on payment screens.
- Replace normal step navigation with destination actions on success screens.

## Behavior Rules

The action row should be predictable and state-driven.

- Clicking Back moves to the previous valid step in the flow.
- Clicking Continue / Next validates the active step and moves to the next valid step.
- Disabled Continue / Next states must reflect missing required selections or loading/error states.
- Payment steps keep their existing quote, payment-method, and submission validation rules.
- Success screens do not show generic step navigation.
- Slot conflict, price mismatch, and quote errors keep their existing recovery behavior.

## Component Boundary

Create or adapt one booking-owned action-row abstraction inside `src/features/bookings/flow/`.

The abstraction should own:

- Horizontal Back and Continue layout.
- Inline bottom-of-step placement.
- Mobile and desktop spacing.
- Disabled state rendering.
- Optional Back rendering without shifting the primary action to the wrong side.

Booking flow files should own:

- Which step is active.
- Whether Back is allowed.
- Whether Continue / Next is allowed.
- Button labels.
- Step transition handlers.
- Payment and success-specific action replacements.

This keeps shared layout rules in one place and preserves each flow's business logic.

## Affected Surfaces

The design applies to booking flows under `src/features/bookings/flow/`, including:

- Care booking
- Laboratory booking
- Radiology booking
- Pharmacy booking
- Funeral booking
- Veterinary booking
- Nutrition booking
- Ambulance booking
- Equipment booking
- Gym booking

The implementation can migrate flows incrementally, but the final state should use one shared action-row pattern for step navigation across these booking flows.

## Data Flow

This design does not change server state, API requests, query keys, booking quote payloads, payment payloads, or submission payloads.

Each booking flow continues to compute its own step validity from local state and existing hooks. The shared action row receives already-computed props such as `canGoBack`, `canContinue`, `backLabel`, `continueLabel`, `onBack`, and `onContinue`.

## Error Handling

Existing booking error behavior remains in place.

- Provider, service, quote, and availability loading states remain flow-owned.
- Quote retry controls stay inside quote surfaces.
- Payment errors stay inside payment surfaces.
- Slot conflicts can still return the user to an earlier step.
- Disabled Continue / Next states should avoid silent failure. If the missing requirement is not obvious, the active step should show helper or validation text near the relevant field.

## Accessibility

The action row must support keyboard, touch, and screen reader use.

- Buttons must remain native buttons or shared button primitives with accessible semantics.
- Disabled buttons must expose their disabled state.
- Button labels must describe the action.
- Inline positioning must not obscure focused controls.
- Touch targets should follow the project's mobile interaction guidance.
- The row must not cover validation messages, payment controls, or bottom navigation.

## Testing And Verification

Default verification for implementation should include:

- `npm run lint`
- `npm run type-check`

Recommended manual checks:

- On mobile width, Back and Continue remain horizontal.
- On desktop width, Back remains left and Continue remains right.
- On long steps, the row appears naturally at the bottom of the active step content or card.
- The row does not stick to, float over, or follow the viewport while scrolling.
- First steps hide in-flow Back without moving Continue to the wrong side.
- Payment steps show payment-specific primary actions instead of generic Continue.
- Success screens do not show generic Back / Continue navigation.

## Acceptance Criteria

- All booking step-navigation rows use the same horizontal Back-left, Continue-right pattern on mobile and desktop.
- The action row appears inline at the bottom of the active step content or card.
- The action row does not use sticky, fixed, or viewport-following positioning.
- First steps hide in-flow Back while preserving primary action placement.
- Payment and success screens use purpose-specific actions instead of generic step navigation.
- The global header back button remains unchanged.
- Existing booking data, quote, payment, and submission behavior remains unchanged.

## Risks

- Some booking flows have different step structures, so migration must preserve each flow's existing validation and transition rules.
- Long steps require users to reach the bottom of the active step before continuing.
- A shared row should not force payment screens into the same layout when payment needs a different primary action.

## Open Decisions

No open product decisions remain for this spec. The approved direction is a horizontal non-sticky action row on both mobile and desktop.
