# ADR-005: Loading and Skeleton Policy

## Status

Accepted

## Decision

Loading feedback must match how much layout is already known.

## Policy

- Use skeletons when the final layout shape is known and data is the missing piece.
- Use inline spinners or compact busy indicators for small actions such as button submits, refreshes, and row-level mutations.
- Use page loaders only for route transitions or first-load states where the entire page shell is unknown.
- Prefer preserving previous data during background refetches instead of blanking the screen.
- Empty state is not a loading state; render it only after data resolves successfully with no content.

## Why

- Full-page spinners cause layout jumps and make the app feel slower.
- Skeletons work best when they preserve rhythm and reduce CLS.
- Background refetch should feel calm, not disruptive.

## Consequences

- Loading treatment becomes predictable across modules.
- New reusable loading components should encode these choices instead of introducing one-off patterns.
