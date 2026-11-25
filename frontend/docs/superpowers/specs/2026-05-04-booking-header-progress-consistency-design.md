# Booking Header And Progress Consistency Design

Date: 2026-05-04
Status: Approved design

## Context

Care@Home has several booking flows under `src/features/bookings/flow/`. They share the same broad page structure: provider context, step progress, booking form content, optional summary/sidebar content, payment, and confirmation.

The current flows do not present the header and progress areas consistently. Some pages render the progress steps before the header. Some render the header before progress. Some headers are split across separate cards, and some place a provider summary card inside another card.

Recent booking work already standardized the in-flow action row. This design covers the top booking chrome: the provider header and progress step placement.

## Problem

Users should see the same booking page structure regardless of service type. Today, the top of the booking page changes between flows, which makes the page feel assembled from different patterns.

The main problems are:

- Header placement differs between booking flows.
- Progress placement differs between booking flows.
- Some headers are nested cards.
- Some headers are split into more than one card.
- Some two-column flows place top chrome only over the main form column instead of the full page width.

## Goal

Standardize booking page chrome so every booking flow uses the same visual order:

```text
[Unified Provider Header Card]
[Progress Steps Card]
[Booking Content + Optional Sidebar]
```

The header must be one card. It must not contain another card inside it, and it must not be split across multiple sibling cards.

The header and progress areas must span the full booking page width above any content/sidebar grid.

## Non-Goals

- Do not change booking APIs, query keys, submission payloads, quote payloads, or payment payloads.
- Do not change booking step counts, labels, validation rules, or transition behavior.
- Do not redesign booking step content, pricing summaries, payment forms, or success panels.
- Do not change global route back behavior.
- Do not standardize unrelated non-booking multi-step flows.
- Do not introduce new dependencies or a new styling system.

## Chosen Approach

Create shared booking-owned chrome for all booking flows.

The shared chrome renders:

- A full-width provider header card.
- A full-width progress card under the header when progress should be visible.
- A content slot below progress for the existing booking body and optional sidebar.

Each booking flow supplies provider and step metadata to the shared chrome. Each flow keeps its own business logic.

## Alternatives Considered

### Shared Booking Chrome Wrapper

Use one booking-owned wrapper that owns page spacing, header placement, progress placement, and content slot order.

This is the selected approach. It gives every booking flow the same top-level structure and prevents nested or split header cards from returning.

### Shared Header Only

Create a shared header component, but keep each booking flow responsible for placing the header, progress, and content grid.

This is smaller, but it leaves duplicated layout decisions in every flow. The flows can drift again.

### CSS-Only Normalization

Keep existing markup and adjust classes so the pages look flatter.

This is fastest, but it does not solve the markup problem. A card inside a card would still be a nested header, even if styling hides it.

## Layout Contract

All booking flows use this order:

```text
[Unified Provider Header Card]
[Progress Steps Card]
[Booking Content + Optional Sidebar]
```

The header and progress areas span the full content width. In two-column flows, the header and progress sit above both the main form column and the sidebar column.

This applies to booking flows for:

- Care
- Pharmacy
- Equipment
- Laboratory
- Radiology
- Veterinary
- Nutrition
- Ambulance
- Funeral
- Gym

## Header Card Content

The header card presents provider identity first.

```text
[Provider image/avatar]  Provider name
                         ★ 4.7 (82 avis)
                         Booking type • Location/subtitle
```

The `4.7 (82 avis)` value is an example of the layout. Real values must come from provider rating data.

Rules:

- The provider name is the header title.
- The provider image or avatar appears before the title.
- The rating row appears directly under the provider name when rating data exists.
- The booking type and location/subtitle row appears under the rating row. If location is missing, show the booking type with the best available subtitle instead of an empty separator.
- If the provider has no rating data, omit the rating row and move the booking type/location row up.
- Do not show fake rating values.
- Do not split provider identity, rating, booking type, or location into separate cards.
- Do not place another card inside the header card.

The rating row should use the localized review label that already exists in the flow translations, such as `avis` in French.

## Progress Rules

The progress indicator appears in one full-width card under the header.

Rules:

- Render progress through the shared booking chrome, not directly in each flow's page body.
- Keep the existing `BookingStepIndicator` behavior and active-step semantics.
- Each flow continues to provide its own `currentStep` and `stepLabels`.
- Hide progress on success and confirmation screens.
- Keep the header visible on success and confirmation screens.

## Component Boundaries

Add one booking-owned chrome wrapper in `src/features/bookings/flow/` named `BookingFlowChrome`.

`BookingFlowChrome` owns:

- Page spacing and max width.
- Full-width header placement.
- Full-width progress placement.
- The content slot below progress.
- The rule that progress hides on success.

Add one booking-owned header component named `BookingFlowHeaderCard`.

`BookingFlowHeaderCard` owns:

- Provider image/avatar layout.
- Provider name title.
- Rating row when available.
- Booking type and location/subtitle row.
- One-card header chrome.

Booking flow files own:

- Provider data selection and formatting.
- Current step and step labels.
- Success state detection.
- Service selection, availability, quote, payment, and submission behavior.
- Existing sidebars and content grids.

The shared chrome must not know how booking submission, quote creation, or payment validation works.

## Flow Migration Rules

Each booking flow moves to this structure:

```tsx
<BookingFlowChrome
  header={providerHeaderData}
  currentStep={currentStep}
  stepLabels={stepLabels}
  showProgress={!isSuccessStep}
>
  {existingBookingContent}
</BookingFlowChrome>
```

Migration rules:

- Remove duplicated top-level booking chrome where it only controls page spacing, header placement, or progress placement.
- Move existing provider/header details into the unified header card.
- Remove nested header cards.
- Remove split sibling header cards.
- Move `BookingStepIndicator` placement into `BookingFlowChrome`.
- Preserve sidebars below the progress card.
- Preserve success panels and destination actions.
- Hide progress on success screens while keeping the header card visible.
- Preserve route behavior, payment behavior, quote behavior, and submission payloads.

## Data Flow

This design does not change server state or API contracts.

Each flow derives a small header data object from provider data it already loads. The shared header receives display-ready values such as:

- `providerName`
- `providerImageUrl`
- `ratingAverage`
- `ratingCount`
- `bookingTypeLabel`
- `locationLabel` or `subtitle`

Each flow still computes its own step state. The shared chrome only receives `currentStep`, `stepLabels`, and `showProgress`.

## Error Handling

Existing loading and error behavior remains in place.

- Provider loading keeps using existing booking skeletons.
- Provider load failure keeps using `BookingPageErrorState`.
- Service, availability, quote, and payment errors stay inside the current flow surfaces.
- Success screens keep their current confirmation and destination actions.

The shared chrome should not add new recovery behavior.

## Accessibility

The unified header and progress areas must preserve accessible reading order.

- The provider name uses one `h1` in the header card.
- The provider image uses meaningful alt text based on the provider name.
- Decorative fallback icons are hidden from assistive technology when text already names the provider.
- The star icon in the rating row is decorative.
- The rating value and review count are readable text.
- The progress stepper keeps `aria-current="step"` for the active step.
- DOM order matches visual order: header, progress, content.

## Testing And Verification

Default verification for implementation:

- `npm run lint`
- `npm run type-check`

Manual checks:

- Header appears before progress in every booking flow.
- Progress appears before all booking content and sidebars.
- Header and progress span full width above two-column layouts.
- Header is one card, with no nested header card inside it.
- Header content order is provider name, rating row, then booking type/location row.
- Providers without rating omit the rating row.
- Success screens keep the header and hide progress.
- Mobile and desktop layouts keep the same content order.

## Acceptance Criteria

- Every booking flow renders a single full-width provider header card at the top.
- Every non-success booking step renders a full-width progress card directly under the header.
- Booking content and optional sidebars render under progress.
- The provider header shows image/avatar, provider name, rating when available, then booking type and location/subtitle.
- Header cards are not nested and are not split across multiple cards.
- Progress is hidden on success and confirmation screens.
- Existing booking behavior, data contracts, routing, quote logic, payment logic, and submission logic remain unchanged.

## Risks

- Booking flows have different local structures, so migration must preserve each flow's step and success-state logic.
- Some providers may not expose rating or image data; the header must handle missing values without placeholder noise.
- A shared wrapper can become too broad if business logic leaks into it. Keep the wrapper layout-only.

## Open Decisions

No product decisions remain open. The approved direction is a shared booking chrome wrapper with a single full-width provider header card, a full-width progress card under it, and progress hidden on success screens.
