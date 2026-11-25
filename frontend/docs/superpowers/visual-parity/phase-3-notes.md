# Phase 3 Notes

## Transition Strategy

Phase 3 must not restore the legacy global `*` transition for color, background, or border changes.

Instead, add a reusable transition utility in a later implementation slice. Components can opt into that utility where parity needs it. This keeps transition behavior explicit and avoids global side effects on unrelated UI, overlays, forms, and third-party primitives.

## Follow-Up

- Define the transition utility in the shared styling layer when Phase 3 implementation begins.
- Apply it only to components with captured parity evidence or a documented visual need.
- Preserve reduced-motion behavior when adding opt-in transitions.

## Primary Action Foreground

Phase 3 keeps `--primary-foreground` white in both light and dark themes. Legacy cyan and blue CTA buttons use white labels, so the semantic primary action foreground must not inherit body text or dark background tokens.
