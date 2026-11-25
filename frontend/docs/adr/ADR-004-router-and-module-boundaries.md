# ADR-004: Router and Module Boundaries

## Status

Accepted

## Decision

Routes define navigation and page entry points under `src/app/router`, while `src/features` is the canonical domain directory for business logic and feature-specific UI.

## Why

- The current codebase contains both route/page folders and vertical feature folders.
- Refactor work needs a stable rule for where new code goes so shared and module code stop bleeding together.

## Rules

- `src/pages` contains route entry modules, page composition, and route-only shells.
- `src/features/<feature>` contains the feature's services, schemas, hooks, tables, cards, forms, and module-specific widgets.
- Consumers outside the owning feature may import only from the feature root barrel (for example `@/features/auth`) or from an explicit nested public entrypoint with its own `index.ts` (for example `@/features/providers/schedule-planning`).
- Runtime code inside `src/features/<feature>` must not import that same feature's root public barrel. Use local modules or a narrower internal/public entrypoint instead.
- Pages must not deep-import feature internals such as `@/features/<feature>/components/...` or `@/features/<feature>/<subarea>/...` without an explicit public index.
- `src/app/router` contains route definitions, route helpers, route fallbacks, and route guards.
- `src/app/layouts`, `src/app/shell`, `src/app/errors`, and `src/app/providers` own app-shell wiring only.
- `src/app/router` may compose `pages`, `shared`, and app-local helpers, but must not import `features` directly.
- Non-router `src/app` code must not import `pages` or `features`.
- `src/shared/ui` contains reusable UI that is not owned by one business module.
- `src/shared/lib` contains reusable platform helpers such as HTTP/session utilities, query client setup, notifications, and dev/runtime helpers.
- `src/shared` must not import upward into `app`, `pages`, `features`, legacy `components`, or `contexts`.
- `src/integrations` contains third-party boundaries such as maps, routing, uploads, billing exports, and analytics.
- `src/integrations` may depend on `src/shared` and other integration-local code, but must stay isolated from `app`, `pages`, `features`, legacy `components`, and `contexts`.
- `src/components` is legacy. Avoid adding new reusable UI there.
- Features must not import `app` or `pages`.
- Cross-feature imports may use another feature's root barrel or explicit nested public entrypoint, but must not deep-import that feature's internals.

## Enforcement

- ESLint flat-config rules enforce the architecture boundaries above during local linting.
- Repository automation, when configured, should run `npm run lint`, `npm run type-check`, and `npm run build`.

## Exceptions

- Boundary exceptions are rare and temporary.
- A justified exception must be documented inline with a targeted `eslint-disable-next-line no-restricted-imports` comment that explains the reason and links to the tracking task, ADR, or issue.
- Exception comments must be removed once the owning public entrypoint or shared abstraction exists.

## Consequences

- New code is easier to place.
- Router changes stop becoming a dumping ground for reusable UI or business logic.
- Public root barrels stay consumer-facing instead of becoming internal cycle magnets.
- Structural regressions fail automatically instead of depending on review memory.
