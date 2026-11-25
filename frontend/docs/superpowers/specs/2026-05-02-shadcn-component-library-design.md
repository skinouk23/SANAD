# shadcn Component Library Design

## Status

Ready for user review. This document records the approved design direction. It does not authorize implementation until the written spec is reviewed and approved.

## Goal

Create a real shared component library for Care@Home Tunisia by repairing the shadcn foundation, replacing drifted shared primitives with current shadcn/Radix-aligned components, expanding the primitive set, and migrating repeated app UI to those components.

The work should make shadcn usable as the source-code design-system workflow for this project. It should also leave room for later customization and selective 21st-dev-magic composites after the shadcn foundation is stable.

## Current Context

The frontend is a React 18, TypeScript, Vite, and Tailwind CSS v4 SPA. The project already chose Tailwind v4, shadcn conventions, Radix primitives, semantic tokens, and no Base UI adoption.

Relevant project rules already exist:

- `docs/adr/ADR-001-ui-foundation.md` standardizes new shared UI on Tailwind v4, shadcn conventions, Radix primitives, and `src/shared/ui`.
- `docs/adr/ADR-002-semantic-theme-tokens.md` requires reusable UI to use semantic tokens rather than page-specific color picks.
- `docs/07-styling-and-theming.md` documents the current CSS-first Tailwind v4 token setup, shared UI boundary, and component usage examples.
- `docs/governance/frontend-contribution-guide.md` defines placement rules for primitives, composites, features, pages, and legacy UI.

Project exploration found these concrete issues:

- `components.json` exists and points shadcn UI aliases at `src/shared/ui/primitives`, but `npx shadcn@latest info` and `npx shadcn@latest add button --dry-run` currently fail with `Invalid configuration found`.
- `components.json` still uses older metadata, including `style: "default"`, `tailwind.baseColor: "slate"`, and a non-standard `composites` alias.
- `src/shared/ui/primitives` contains useful but drifted shadcn-style components: `Button`, `Card`, `Dialog`, `DropdownMenu`, `Input`, `Label`, `Select`, `Sheet`, `Skeleton`, `Tabs`, `Textarea`, `Tooltip`, `Badge`, `Checkbox`, and toast exports.
- Some local primitives differ from current shadcn behavior. Examples include a native `Select` named like Radix `Select`, a native `Checkbox`, legacy loading and stretch props on `Button`, partial `DropdownMenu` exports, and a `Sheet` built through the local `DialogContent` base.
- Existing forms use a local `FormField` composite that can clone wrapper elements instead of the actual control in some usages.
- Many pages and features still hand-code modals, forms, tables, filters, switches, and status blocks that should move to shared primitives or composites.
- Sonner is already mounted at app level through `src/app/providers/AppToaster.tsx`.

## Approved Direction

Use an aggressive foundation-first migration.

The approved approach is: repair the shadcn foundation first, rebuild drifted core primitives, add missing high-value components in batches, migrate consumers directly, then selectively use 21st-dev-magic for polished composites.

This approach accepts temporary branch breakage while core primitives and their consumers are migrated together. It avoids broad long-lived compatibility layers.

## Non-Goals

- Do not create a separate component package.
- Do not add a production or dev-only component showcase route.
- Do not move new generic shared UI into legacy `src/components`.
- Do not replace Tailwind v4, Radix, shadcn conventions, React Router, TanStack Query, Zod, Axios, Sonner, or the current theme runtime.
- Do not adopt Base UI.
- Do not reset the whole project to an untouched shadcn visual preset.
- Do not use 21st-dev-magic as the main source for low-level primitives.
- Do not change business data ownership, backend mode, route ownership, auth ownership, theme ownership, or i18n ownership as part of this work.

## Architecture

The component library remains inside the current project boundaries.

`components.json` defines shadcn CLI integration, registry access, aliases, Tailwind v4 CSS entry, icon library, and shadcn/Radix expectations. It must support reliable `info`, `search`, `view`, `docs`, `add --dry-run`, and component diff workflows.

The target `components.json` contract is explicit:

- Use a current CLI-supported Radix shadcn style and base color validated by `npx shadcn@latest info`.
- Keep `tailwind.config` blank because the project uses Tailwind v4 CSS-first mode.
- Keep `tailwind.css` pointed at `src/index.css`.
- Keep `aliases.ui` pointed at `@/shared/ui/primitives`.
- Point `aliases.components` at a shared UI boundary rather than a legacy `src/components` boundary.
- Keep `aliases.utils` pointed at `@/shared/lib/utils`.
- Point `aliases.lib` at `@/shared/lib` when the CLI needs a lib destination.
- Point `aliases.hooks` at a shared, project-owned hooks destination only when a selected shadcn component requires generated hooks.
- Remove non-standard or stale fields if the current CLI rejects them.

`src/styles/theme-tokens.css` remains the theme source of truth. The migration keeps Care@Home's semantic token ownership, but component structure and interaction patterns should align with current shadcn where safe.

`src/shared/ui/primitives` becomes the source-code component library. Core primitives should track upstream shadcn/Radix structure, naming, accessibility behavior, and composition rules unless the project has an explicit reason to differ.

`src/shared/ui/composites` holds reusable domain-neutral assemblies built from primitives. Examples include `SectionCard`, `EmptyState`, `ConfirmDialog`, form layouts, loading compositions, and later selected 21st-inspired composites.

`src/features/*` and `src/pages/*` consume the library. Business-specific UI remains feature-owned. Repeated controls, overlays, forms, tables, feedback states, and layout surfaces should migrate to shared primitives or composites.

No app showcase route will be added. Usage guidance belongs in markdown documentation and in clear component source patterns.

## Component Scope

### Foundation Batch

The first implementation milestone repairs the foundation.

- Fix `components.json` so the current shadcn CLI works reliably.
- Preserve the UI component target under `src/shared/ui/primitives`.
- Add missing standard aliases using the target alias contract in this spec.
- Decide destinations for non-UI generated files before adding components, so shadcn does not create accidental `src/lib`, `src/hooks`, or legacy `src/components` drift.
- Rebuild or realign core primitives that currently drift from shadcn conventions.
- Avoid broad compatibility wrappers. Consumers can migrate directly because temporary branch breakage is acceptable.

Core primitives in scope:

- `Button`
- `Card`
- `Dialog`
- `Sheet`
- `DropdownMenu`
- `Tabs`
- `Input`
- `Textarea`
- `Label`
- `Checkbox`
- `Select`
- `Skeleton`
- `Badge`
- `Tooltip`
- Sonner wiring and toast exports

### Expansion Batch

After the foundation works, add missing high-value shadcn primitives in focused batches.

High-priority candidates:

- `Field`
- `Form`
- `InputGroup`
- `NativeSelect`
- `Switch`
- `RadioGroup`
- `Toggle`
- `ToggleGroup`
- `Alert`
- `AlertDialog`
- `Separator`
- `Spinner`
- `Table`
- `Pagination`
- `Popover`
- `Command`
- `Combobox`
- `ScrollArea`
- `Avatar`
- `Progress`

Navigation primitives, such as `Sidebar`, `Breadcrumb`, and `NavigationMenu`, can be added only when a concrete route or shell migration needs them.

Large shadcn blocks may inform page patterns, but they should not replace the app architecture. Shared primitives and composites remain the system boundary.

### 21st-dev-magic Scope

Use 21st-dev-magic selectively after the shadcn primitive layer is stable.

- Use it for polished composites or page sections, not low-level primitives.
- Inspect or generate one candidate at a time.
- Treat output as source material, not as accepted code.
- Normalize every adopted component to project tokens, aliases, accessibility rules, shadcn composition, and shared/feature boundaries.

## Migration Flow

### Phase 1: shadcn Foundation Repair

- Update `components.json` to match current shadcn CLI expectations.
- Confirm the CLI can run `info`, `add --dry-run`, registry search/view, and component diffs.
- Keep `@/shared/ui/primitives` as the target for UI components.
- Define explicit destinations for non-UI generated files before adding components.

### Phase 2: Core Primitive Replacement

- Replace drifted primitives with current shadcn/Radix-aligned implementations.
- Remove project-specific primitive APIs when they conflict with shadcn conventions.
- Migrate consumers directly instead of keeping broad compatibility props such as permanent loading/stretch button props, native `Select` masquerading as Radix `Select`, or native `Checkbox` masquerading as Radix `Checkbox`.
- Keep semantic project tokens where they express meaning.
- Accept upstream shadcn structure and interaction patterns where they improve correctness.

### Phase 3: High-Value Primitive Expansion

- Add form, feedback, table, overlay, menu, and selection primitives in batches.
- Use shadcn MCP and registry tools to inspect components before adding them.
- Review generated files after every add.
- Fix aliases, tokens, dependencies, icon usage, and composition issues before migrating consumers.

### Phase 4: Consumer Migration

Migrate consumers by UI category when possible.

- Forms first.
- Overlays second.
- Tables, pagination, and feedback third.
- Navigation, menus, and selection patterns fourth.

Convert manual modals to `Dialog`, `Sheet`, or `AlertDialog`. Convert repeated raw inputs, selects, checklists, switches, and option groups to `Field`, `Form`, `Input`, `NativeSelect` or Radix `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Toggle`, and `ToggleGroup`.

Convert hand-built tables, pagination, status blocks, empty states, separators, skeletons, spinners, badges, and avatars to shared primitives or composites.

Leave business-specific components in feature folders unless three unrelated areas can reuse them unchanged.

### Phase 5: Selective 21st Adoption

- Use 21st after the shared primitive layer is stable.
- Adopt only composites that solve repeated app needs.
- Normalize generated output before it enters the project.
- Keep final code inside `src/shared/ui/composites` only when it is domain-neutral. Keep feature-specific 21st-inspired UI inside the owning feature.

## Usage Rules

- Use shadcn MCP, registry tools, or `npx shadcn@latest docs/view/search` before adding or changing a component.
- Never overwrite existing primitives blindly. Inspect upstream output or diffs, then intentionally replace or merge.
- Shared primitives must use semantic tokens such as `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `ring-ring`, `bg-primary`, `bg-destructive`, `bg-success`, and `bg-warning`.
- Do not add reusable UI under legacy `src/components`.
- Keep primitive names aligned with shadcn. If the project needs a native select, name it `NativeSelect` rather than `Select`.
- Avoid broad custom props on primitives when composition is enough. Loading buttons should compose `Spinner` and `disabled` rather than depend on a permanent custom loading primitive API.
- Forms should use shadcn `Field` and `Form` patterns where appropriate.
- Dialogs, sheets, drawers, and alert dialogs must use Radix-backed primitives with titles, focus management, escape behavior, and portals.
- Tables, empty states, alerts, separators, skeletons, spinners, badges, avatars, and pagination should use shared primitives or composites instead of repeated styled `div` and `span` markup.
- Icons should follow the project icon library, currently Lucide.
- Do not accept 21st-generated UI raw. Normalize it to project tokens, aliases, accessibility rules, and boundaries.

## Data And State Rules

- Server state stays in TanStack Query.
- Auth state stays in `src/contexts/AuthContext.tsx`.
- Theme state stays in `src/shared/lib/theme`.
- Language state stays in `src/shared/lib/i18n`.
- Shared UI primitives and composites must not call APIs, own route state, or depend on business data shapes.
- Feature components may map business data into shared UI props, but shared UI must stay domain-neutral.

## Error And State Handling

- Form validation should use `Field`, `Form`, `aria-invalid`, `data-invalid`, associated descriptions and errors, and `role="alert"` where needed.
- Blocking confirmations should use `AlertDialog`.
- General modal workflows should use `Dialog`.
- Side panels should use `Sheet`.
- Bottom or mobile drawer patterns should use `Drawer` only if the project explicitly adopts it.
- Error, warning, success, empty, and loading states should use shared primitives or composites rather than page-local styled blocks.
- Destructive, warning, and success colors must communicate state only, not service category or brand decoration.

## Quality Gates

Foundation and shared UI changes should run:

- `npm run lint`
- `npm run type-check`

Shared UI or route-wide migrations should also run:

- `npm run build`

Bundle-sensitive changes, heavy blocks, charts, maps, navigation, or broad dependency additions should run:

- `npm run build:budget`

Manual review should cover:

- Light, dark, and system themes.
- RTL-sensitive UI.
- Keyboard navigation and focus rings.
- Dialogs, sheets, and alert dialogs.
- Form invalid states and associated error text.
- Mobile layout and touch targets.
- High-traffic flows such as auth, booking, dashboards, messaging, and profile surfaces.
- Absence of accidental raw palette drift in shared UI.

## Implementation Milestones

### Milestone 1: Foundation Repair

- Fix shadcn config and aliases.
- Verify shadcn CLI commands work.
- Decide destinations for generated non-UI files.
- Document component usage rules.

### Milestone 2: Core Primitive Rebuild

- Replace or realign core primitives.
- Remove incompatible custom primitive APIs.
- Migrate affected consumers until the app compiles.

### Milestone 3: Form And Overlay Standardization

- Add `Field`, `Form`, `InputGroup`, `NativeSelect`, and related controls.
- Add or realign `Dialog`, `Sheet`, `AlertDialog`, `Popover`, and menu primitives.
- Migrate repeated forms and manual modals.

### Milestone 4: Data Display And Feedback

- Add `Table`, `Pagination`, `Alert`, `Separator`, `Spinner`, `Progress`, `Avatar`, and related display primitives.
- Migrate repeated status blocks, tables, pagination, empty states, and loading states.

### Milestone 5: Selective 21st Composites

- Identify repeated composite needs after primitive migration.
- Use 21st-dev-magic for selected polished composite candidates.
- Normalize and place accepted composites according to shared or feature ownership.

## Success Criteria

- `components.json` supports current shadcn CLI workflows.
- The project has one shared UI source of truth under `src/shared/ui`.
- Core primitives align with current shadcn/Radix behavior and naming.
- Native and Radix controls are named clearly and do not masquerade as each other.
- Repeated form, overlay, table, feedback, loading, and selection UI moves to shared primitives or composites.
- Shared UI uses semantic tokens and avoids raw reusable palette classes.
- 21st-dev-magic is used only after the foundation is stable and only for normalized composites.
- No new generic UI is added to legacy `src/components`.
- Verification commands pass for each completed implementation milestone.
