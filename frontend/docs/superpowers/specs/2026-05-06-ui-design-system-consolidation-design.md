# UI Design System Consolidation Design

## Status

Ready for user review. This document records the approved design direction for organizing recent frontend UI/UX changes. It does not authorize implementation until the written spec is reviewed and approved.

## Goal

Organize the UI and design changes made in `CareAtHomeFinal` since commit `4725d598d6ca5e3b9de093fc4d9aaaee7416e6f8` without intentionally changing the current rendered design.

The consolidation should remove repeated design mechanics from page and feature files when those mechanics belong in shared CSS tokens, shared primitive variants, or shared composites. The highest priority is visual preservation: the current `HEAD` design is the source of truth.

## Current Context

`CareAtHomeFinal` is a React 18, TypeScript, Vite, and Tailwind CSS v4 frontend. Tailwind runs in CSS-first mode through `src/index.css`, `src/styles/theme-tokens.css`, and `src/styles/theme-base.css`.

The project already has a design-system foundation:

- `src/styles/theme-tokens.css` defines semantic CSS variables and exposes Tailwind v4 `@theme inline` tokens.
- `src/styles/theme-base.css` owns global base styles and small shared utilities.
- `src/shared/ui/primitives` contains Radix- and shadcn-aligned primitives.
- `src/shared/ui/composites` contains reusable domain-neutral assemblies.
- `components.json` points shadcn aliases at `@/shared/ui`, `@/shared/ui/primitives`, and `@/shared/lib`.
- `docs/07-styling-and-theming.md`, `docs/adr/ADR-001-ui-foundation.md`, `docs/adr/ADR-002-semantic-theme-tokens.md`, and `docs/governance/frontend-contribution-guide.md` define the current styling and placement rules.

Project exploration found broad design changes since the baseline commit: 234 files changed, with heavy UI work across shell, shared UI, booking flows, public and service pages, patient and provider dashboards, messaging, marketing, insurance, active delivery, and related docs. The current problem is not lack of styling; it is that recently introduced design mechanics risk becoming scattered across many files.

## Source Of Truth

The visual source of truth is the current frontend state at `HEAD`.

The baseline commit `4725d598d6ca5e3b9de093fc4d9aaaee7416e6f8` is only an audit aid. Use it to identify changed files, repeated patterns, and newly introduced shared pieces. Do not use it to restore the old design.

Visual preservation means preserving the rendered intent of `HEAD`, including light and dark themes, responsive behavior, RTL-sensitive layout, hover and active states, focus states, loading states, disabled states, and error states.

## Non-Goals

- Do not redesign the app.
- Do not introduce a new visual identity.
- Do not change backend behavior, API contracts, data fetching, route ownership, auth ownership, theme ownership, or i18n ownership.
- Do not add a component showcase route.
- Do not move new generic UI into legacy `src/components`.
- Do not rewrite feature logic as part of design cleanup.
- Do not add broad compatibility layers unless a concrete migrated consumer requires them.
- Do not use a screenshot-heavy visual regression workflow by default.

## Approved Approach

Use inventory-led extraction.

First, inventory repeated design mechanics introduced or changed since `4725d598d6ca5e3b9de093fc4d9aaaee7416e6f8`. Then classify each finding as a shared token, primitive variant, composite, or feature-local exception. Only after that classification should implementation migrate code.

This approach is slower than editing shared components first, but it best protects the current design. It avoids normalizing unique route visuals too early and gives each extraction a clear owner.

## Architecture And Boundaries

The consolidation keeps the existing frontend architecture.

### `src/styles/theme-tokens.css`

This file remains the source of reusable semantic tokens. Add or adjust tokens only when a repeated visual role needs a stable name. Token names must describe purpose, not hue or page taste.

Good token candidates include repeated surface opacity, border accents, glow shadows, focus rings, text emphasis, safe-area values, and reusable app background roles.

### `src/styles/theme-base.css`

This file remains limited to global base behavior and small reusable utilities. It may hold scrollbars, loading animation utilities, skeleton helpers, reduced-motion behavior, safe-area helpers, and app-wide background support. It should not become a page-style dumping ground.

### `src/shared/ui/primitives`

Primitives own low-level reusable UI mechanics. Examples include `Button`, `Badge`, `Card`, `Input`, `Textarea`, `NativeSelect`, `Select`, `Field`, `Dialog`, `Sheet`, `AlertDialog`, `Tabs`, `Table`, `Pagination`, `Skeleton`, `Spinner`, and `Progress`.

Primitive variants should describe role, state, size, density, or layout behavior. They should not encode a one-off route design.

### `src/shared/ui/composites`

Composites own repeated domain-neutral assemblies. Examples include page headers, section cards, empty states, loading states, error states, cyber or glass surfaces, gradient icon tiles, filter bars, stat-card shells, form-section shells, and mobile-safe action bars.

Composites may encode layout and visual rhythm. They must not depend on business APIs, route names, permissions, or feature-specific data shapes.

### `src/features/*`

Feature folders keep business-specific UI and data mapping. A provider schedule card, pharmacy booking section, campaign card, patient health widget, or delivery map panel stays feature-owned unless unrelated features can use it unchanged.

Feature code may use current local visuals when those visuals carry real business meaning or are unique to that route.

### `src/pages/*`

Pages remain route composition. They may arrange shared and feature components, but they should not define reusable design-system rules.

### `src/components`

`src/components` remains legacy-only. Do not add new generic UI there.

## Inventory Classification

Every repeated styling or structure finding should land in one of four buckets.

### Token Candidate

Use this bucket for repeated values or visual roles that should be centralized without creating a React component.

Examples:

- app background layers
- glass surface opacity
- border accent color
- glow shadows
- focus rings
- text emphasis levels
- safe-area offsets
- skeleton colors
- reusable layout rhythm values

### Primitive Variant Candidate

Use this bucket when repeated low-level component states or roles appear across unrelated features.

Examples:

- gradient primary buttons
- glass or secondary buttons
- outline and ghost buttons
- icon-only button sizes
- status, selected, metadata, and warning badges
- glass, elevated, bordered, interactive, and dense card surfaces
- input focus, invalid, disabled, placeholder, and add-on styling
- dialog, sheet, and alert-dialog chrome
- tabs, table, pagination, skeleton, spinner, and progress states

### Composite Candidate

Use this bucket when repeated UI assemblies are domain-neutral but too large to be primitive variants.

Examples:

- cyber or glass page panels
- page headers
- section cards
- empty, error, and loading blocks
- gradient icon tiles
- stat-card shells
- filter bars
- repeated form section shells
- mobile action bars
- dashboard section wrappers

### Feature-Local Exception

Use this bucket when a visual is intentional, unique, or tied to business meaning.

Examples:

- backend-provided service colors
- provider or service category accents when they represent data
- map markers, routes, and other data-visualization colors
- route-specific hero treatment
- unique card content that carries business meaning
- visuals that would become misleading if generalized

Feature-local exceptions should be explicit in the inventory so future cleanup does not repeatedly rediscover them.

## Component And Variant Contract

Shared components should absorb repeated mechanics while preserving the rendered `HEAD` design.

### Buttons

`Button` should cover repeated action roles such as gradient primary, glass or secondary, outline, ghost, destructive, link, icon-only, size variants, and composed loading states.

Loading should remain compositional where possible: callers combine `disabled`, `aria-busy`, `Spinner`, and icon placement rather than relying on a broad custom loading API.

### Cards And Surfaces

`Card`, `SectionCard`, and any approved surface composite should centralize repeated border, radius, shadow, backdrop, padding, hover, and dense-surface patterns.

Do not collapse route-specific panels into a shared component if the shared abstraction would hide business structure or change visual hierarchy.

### Badges And Chips

`Badge` variants should describe status or UI role. Status variants communicate state. Selected and metadata variants communicate UI selection or labeling.

Do not turn every business category color into a generic badge variant. Backend-provided or service-specific colors can remain feature-local or flow through a narrow service-accent helper when that is the existing business contract.

### Forms And Controls

Form primitives and composites should centralize repeated control chrome: focus rings, invalid state, disabled state, placeholder color, icon spacing, add-on spacing, labels, descriptions, and error text.

New and touched form cleanup should preserve React Hook Form, Zod, and current accessibility behavior. Controls should keep associated labels, descriptions, invalid state, and errors.

### Overlays

`Dialog`, `Sheet`, and `AlertDialog` should own overlay chrome, size, scroll behavior, width, max-height, overflow, padding, radius, background, close-button placement, and focus behavior.

Feature code should not recreate overlay chrome with local fixed backdrops, local `max-h-*`, local `overflow-*`, local `rounded-*`, local `bg-*`, or local padding patterns when an approved shared overlay variant fits.

### Data And State Components

`Tabs`, `Table`, `Pagination`, `Skeleton`, `Spinner`, `Progress`, `EmptyState`, loading composites, and error composites should centralize repeated density, state styling, and accessibility mechanics.

Non-happy-path UI is part of the design system. It should preserve current copy, recovery actions, state semantics, and accessible announcements.

## Migration Priority

After the inventory, migrate by highest duplication and highest visual leverage.

Recommended order:

1. Shell, app background, top header, bottom navigation, assistant placement, consent placement, and page offsets.
2. Shared primitives for buttons, cards, badges, forms, overlays, tabs, tables, pagination, loading, and skeleton states.
3. Shared composites for page headers, section cards, empty/loading/error blocks, cyber/glass surfaces, gradient icon tiles, filter bars, stat-card shells, and mobile action bars.
4. Booking flows and service pages, because they have many repeated controls and service-accent patterns.
5. Patient and provider dashboards, because they have repeated cards, stats, notifications, dialogs, and action panels.
6. Messaging, provider wallet, provider transactions, marketing, insurance, and active delivery, because they repeat cards, filters, overlays, status blocks, and dense mobile layouts.
7. Remaining route families and documented feature-local exceptions.

Each slice should extract the smallest correct shared layer first, then update consumers with minimal JSX churn.

## Preservation Rules

- Move exact class groups into shared variants or composites when possible.
- Preserve responsive breakpoints, dark-mode behavior, RTL-sensitive alignment, hover states, active states, focus rings, disabled states, loading states, and error states.
- Keep backend-provided service colors and business data colors when they are part of the current product behavior.
- Do not flatten meaningful visual differences into generic variants.
- Do not rename or reshape public component APIs unless affected consumers are migrated in the same slice.
- Do not convert a route-specific visual into a shared variant without evidence that it repeats across unrelated features.
- Ask for approval before any intentional visual exception.

## Verification Strategy

Use code-level verification by default.

For each implementation slice:

- Review diffs for visual-equivalence risk: moved class groups, variant defaults, token mappings, conditional classes, responsive classes, dark classes, focus classes, and disabled or loading styling.
- Run `npm run lint`.
- Run `npm run type-check`.
- Run `npm run build` when shared UI, shell, routing, or broad route families are touched.
- Update existing tests only when imports, component APIs, or route composition change.
- Do not add new tests by default.

Use browser or screenshot checks only for high-risk or disputed areas, not as the default workflow.

High-risk examples include shell layout, fixed mobile action bars, bottom navigation, overlays, maps, active delivery, service-accent colors, and any cleanup where class movement could alter geometry.

## Documentation Outputs

The implementation plan should produce or update project-local docs rather than relying on memory.

Expected docs:

- A design-system consolidation inventory under `docs/superpowers/` or another approved docs path.
- Updates to `docs/07-styling-and-theming.md` when token groups, variants, or exceptions change.
- Updates to `docs/governance/frontend-contribution-guide.md` when placement or usage rules change.
- An exception log for approved feature-local visuals and approved visual differences.

## Success Criteria

- Recent UI changes are organized through a documented inventory.
- Repeated visual mechanics move into the correct layer: token, primitive variant, or composite.
- Feature-specific visuals remain in feature folders when they carry business meaning.
- The current `HEAD` design remains visually unchanged except for user-approved exceptions.
- Shared UI uses clear variant names and semantic token classes where appropriate.
- Pages stop carrying reusable design-system rules.
- The migration can continue route family by route family without rediscovering the same styling decisions.

## Open Decisions Resolved By This Spec

- First implementation slice: inventory-led extraction.
- Visual source of truth: current `HEAD` design.
- Baseline commit role: audit aid only.
- Verification standard: code-level review and normal frontend checks by default.
- Visual exceptions: consult the user before intentional changes.
