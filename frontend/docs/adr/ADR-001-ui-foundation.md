# ADR-001: UI Foundation

## Status

Accepted

## Decision

New shared UI will standardize on:

- Tailwind CSS v4 for styling and tokens
- shadcn component conventions and `components.json` metadata
- Radix primitives for accessibility-sensitive behavior
- No Base UI adoption

## Why

- Tailwind v4 keeps styling local, fast, and token-friendly.
- shadcn gives copy-into-repo ownership instead of a black-box component package.
- Radix provides stable accessibility primitives for dialogs, menus, tabs, labels, tooltips, and slots.
- Adding Base UI would create a second primitive layer, duplicate patterns, and raise migration cost.

## Rules

- New shared primitives belong in `src/shared/ui/primitives`.
- New shared composed building blocks belong in `src/shared/ui/composites`.
- Prefer extending existing shadcn-style files over introducing parallel abstractions.
- Use `class-variance-authority`, `clsx`, and `tailwind-merge` for variantable shared components.
- Keep `components.json` aligned with the shared UI boundary.
- Do not add a second design-system package or alternate primitive library without a new ADR.

## Consequences

- Generic wrappers under legacy `src/components/ui` have been removed.
- `src/components` still exists as a legacy area, but new generic shared UI does not belong there.
- Existing legacy route and layout code can remain while it is migrated gradually.
- New UI work must land in the shared primitive and composite split rather than expanding legacy `src/components` patterns.
