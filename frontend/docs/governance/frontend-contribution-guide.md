# Frontend Contribution Guide

Use this guide for all frontend refactor-foundation work.

## Source of Truth

- ADRs in `docs/adr/` define the architectural decisions.
- This guide defines the day-to-day placement and implementation rules.
- If code and docs disagree during migration, follow the ADR direction for new work and avoid widening legacy patterns.

## Where Code Belongs

### `src/app/router`

Put route ownership here.

Examples:

- route groups
- route guards
- route helpers and route fallback elements

Keep this layer thin. It should wire navigation, not hold business logic.

### `src/app/layouts`, `src/app/shell`, `src/app/errors`, `src/app/providers`

Put app-shell ownership here.

Examples:

- top-level layouts
- global shell loaders/backdrops
- route/app error fallbacks
- global provider composition and app toaster wiring

Do not move feature logic here.

### `src/shared/ui/primitives`

Put low-level, reusable building blocks here.

Examples:

- alert, alert-dialog, avatar, badge, button, card, checkbox, command, dialog, dropdown-menu, field, input, input-group, label, native-select, pagination, popover, progress, radio-group, scroll-area, select, separator, sheet, skeleton, spinner, switch, tabs, table, textarea, toast/sonner, toggle, toggle-group, tooltip
- thin wrappers over Radix primitives
- variantable components used across features

Do not put business copy, feature-specific API assumptions, or route knowledge here.

### `src/shared/ui/composites`

Put reusable combinations of primitives here.

Examples:

- page headers
- confirm dialogs
- empty states
- section cards
- shared loading compositions
- profile/account chrome patterns shared across patient and provider surfaces

Composites may encode common layout and UX patterns, but must stay domain-neutral.

Legacy note:

- Generic wrappers under `src/components/ui` have been removed.
- Shared profile chrome no longer lives under `src/components/profile`.
- Use `src/shared/ui/primitives/*` and `src/shared/ui/composites/*` as the only shared UI source of truth.

### `components.json`

Keep shadcn configured for the shared UI boundary.

- `style` must remain `radix-nova`.
- Tailwind must remain v4 CSS-first: `tailwind.config` is an empty string and `tailwind.css` is `src/index.css`.
- `aliases.ui` must target `@/shared/ui/primitives`.
- `aliases.components` must target `@/shared/ui`.
- `aliases.utils` must target `@/shared/lib/utils`.
- `aliases.lib` must target `@/shared/lib`.
- Do not point generated output at legacy `src/components`, `src/lib`, or an unapproved hooks directory.

### `src/features/<feature>`

Put feature-owned UI and data logic here.

Examples:

- booking forms
- provider cards with provider-specific actions
- messaging thread widgets
- feature hooks, query options, schemas, and service calls

If a component only makes sense inside one business area, it belongs to that feature even if it looks polished.

### `src/pages`

Put route entry modules and page composition here.

Pages should:

- load route data via feature hooks
- compose shared and feature components
- own route-level layout concerns

Pages should not become the long-term home for reusable widgets.

### `src/shared/lib`

Put reusable platform helpers here.

Examples:

- HTTP/session helpers
- query client setup
- toast helpers
- development/runtime helpers

### `src/integrations`

Put third-party boundaries here.

Examples:

- Leaflet/Nominatim map adapters
- OSRM routing requests
- backend-owned multipart file transport helpers
- jsPDF export helpers
- analytics SDK adapters

### `src/components`

Treat this as legacy.

- Do not place new generic shared UI here.
- Only touch it when extending an existing legacy route/layout pattern or migrating code out of it.

## Primitive vs Composite vs Module UI

Use this decision rule:

- Primitive: reusable, low-level, no business meaning
- Composite: reusable pattern made from primitives, still domain-neutral
- Module UI: tied to one feature's business concepts, permissions, or data shapes

Quick test:

- If three unrelated features could use it unchanged, it is probably shared.
- If the name includes business nouns like booking, provider, pharmacy, rewards, or patient, it is probably module UI.
- If it mainly solves accessibility or interaction mechanics, it is probably a primitive.

## Dependency Governance

- Prefer existing stack pieces first: React, React Router, TanStack Query, Zod, Axios, Tailwind v4, shadcn patterns, Radix, Lucide.
- Prefer adding or extending a shadcn-style component over introducing a new component framework.
- Do not add Base UI.
- Do not add a second state library for normal frontend work.
- Do not add CSS-in-JS or another styling system for shared UI.
- New dependency proposals should have a narrow need, low overlap with current tools, and a migration story.

## Shadcn Update Workflow

Follow this workflow for every shadcn add, replacement, or refresh.

1. Run `npx shadcn@latest info` and confirm the current config resolves to shared paths.
2. Inspect upstream docs, registry entries, and examples with shadcn docs/view/search tools.
3. Run `npx shadcn@latest add @shadcn/<component> --dry-run` before writing files.
4. For existing primitives, run a diff workflow such as `npx shadcn@latest add @shadcn/<component> --diff <file>` when available.
5. Add the component only after the dry-run stays inside `src/shared/ui` or `src/shared/lib`.
6. Review generated files for imports, token usage, Lucide icon usage, dependencies, accessibility, and data-slot conventions.
7. Fix aliases and semantic token classes before migrating consumers.
8. Export accepted primitives from `src/shared/ui/primitives/index.ts`.
9. Migrate consumers to the current primitive API instead of adding broad compatibility props.
10. Verify with `npm run type-check` and `npm run lint`; run `npm run build` for broad shared UI, routing, shell, or release-sensitive changes.

Do not use overwrite operations unless the component file and all affected consumers are part of the active slice. Do not create a component showcase route.

## Primitive Usage Rules

### Buttons

- Use the default `Button` variant for the primary page action.
- Use `variant="secondary"`, `variant="outline"`, `variant="ghost"`, `variant="destructive"`, or `variant="link"` only when the visual role matches.
- Compose pending action buttons with `disabled`, `aria-busy`, and `Spinner` using `data-icon="inline-start"` or `data-icon="inline-end"`.
- Stretch buttons with layout classes such as `className="w-full"`.
- Icon-only buttons must have an accessible name.

### Forms

- Use `FieldGroup` and `Field` for grouped form layout.
- Put `data-invalid` on `Field` and `aria-invalid` on the concrete control.
- Use `FieldLabel`, `FieldDescription`, and `FieldError` to keep labels, help text, and validation text associated.
- Use `Input` and `Textarea` directly when there are no add-ons.
- Use `InputGroupInput` and `InputGroupTextarea` inside `InputGroup` when a control has inline icons, prefix/suffix text, or inline actions. Place icons and actions with `InputGroupAddon` and `InputGroupButton`.
- Do not use local `pl-*`, `pr-*`, absolute icon positioning, or feature-level `focus-visible:*` classes to place icons in inputs.
- Limit direct `Input` and `Textarea` `className` usage to layout or exceptional state-specific styling. Do not override base chrome such as padding, border, background, radius, focus ring, disabled state, or invalid state.
- Use `NativeSelect` for simple browser-native select controls and Radix `Select` for custom trigger/content composition.
- Use Radix `Checkbox` with `checked` and `onCheckedChange`; map `checked === true` when a boolean form value is required.
- Use `RadioGroup` for single-choice sets and `Switch` for boolean settings.
- Use React Hook Form `Controller` for Radix controls with `value`/`onValueChange` or `checked`/`onCheckedChange`; use `register(...)` for standard native controls.

Preferred form fragments:

```tsx
<Field data-invalid={Boolean(errors.name)}>
  <FieldLabel htmlFor="name">Name</FieldLabel>
  <Input id="name" aria-invalid={Boolean(errors.name) || undefined} {...register('name')} />
  <FieldError>{errors.name?.message}</FieldError>
</Field>

<Field data-invalid={Boolean(errors.email)}>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <InputGroup>
    <InputGroupAddon align="inline-start">
      <Mail aria-hidden="true" />
    </InputGroupAddon>
    <InputGroupInput
      id="email"
      type="email"
      aria-invalid={Boolean(errors.email) || undefined}
      {...register('email')}
    />
    <InputGroupAddon align="inline-end">
      <InputGroupButton aria-label="Show email help" size="icon-sm">
        <Info aria-hidden="true" />
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
  <FieldError>{errors.email?.message}</FieldError>
</Field>

<Controller
  control={control}
  name="termsAccepted"
  render={({ field }) => (
    <Field orientation="horizontal" data-invalid={Boolean(errors.termsAccepted)}>
      <Checkbox
        id="termsAccepted"
        checked={field.value === true}
        onCheckedChange={(checked) => field.onChange(checked === true)}
        aria-invalid={Boolean(errors.termsAccepted) || undefined}
      />
      <FieldLabel htmlFor="termsAccepted">Accept terms</FieldLabel>
    </Field>
  )}
/>

<Controller
  control={control}
  name="city"
  render={({ field }) => (
    <Field data-invalid={Boolean(errors.city)}>
      <FieldLabel htmlFor="city">City</FieldLabel>
      <Select name={field.name} value={field.value} onValueChange={field.onChange}>
        <SelectTrigger
          id="city"
          className="w-full"
          onBlur={field.onBlur}
          ref={field.ref}
          aria-invalid={Boolean(errors.city) || undefined}
        >
          <SelectValue placeholder="Choose a city" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="tunis">Tunis</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <FieldError>{errors.city?.message}</FieldError>
    </Field>
  )}
/>

<Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
  {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
  Save changes
</Button>
```

### Overlays

- Use `Dialog` for centered modal workflows.
- Use `Sheet` for side, top, or bottom panels.
- Use `AlertDialog` for destructive, blocking, or explicit confirmation decisions.
- Every dialog, sheet, and alert dialog content must contain the matching title component.
- Use `DialogContent size="sm" | "md" | "lg" | "xl" | "full"` instead of feature-local width classes.
- Use `DialogContent scroll="none" | "content" | "body"`; pair `scroll="content"` with `DialogBody` so headers and footers stay visible while the body scrolls.
- Use `AlertDialogContent` for blocking confirmations and the shared size names where practical.
- Use `SheetContent side="..." size="..."` for edge panels; preserve side placement through the primitive instead of local panel chrome.
- Do not create custom fixed overlays when a shared overlay primitive fits.
- Do not set manual z-index values for shared overlays; portal, overlay, content, focus trap, escape key, and focus return behavior belong to the primitive.
- Do not recreate overlay chrome in feature or page code with local `bg-*`, `rounded-*`, `max-h-*`, `overflow-*`, `p-0`, custom fixed backdrops, or custom close-button placement.

### Data Display And Feedback

- Use `Table` for semantic tabular data and keep horizontal overflow contained.
- Use `Pagination` for page navigation and preserve `aria-current` on the active page.
- Use `Alert` for repeated inline feedback and `FormStatusMessage` for form-level submission states.
- Use `Separator` for structural division instead of border-only ad hoc dividers.
- Use `Spinner` for compact pending work and `Skeleton` or loading composites when the final shape is known.
- Use `EmptyState`; adopt an upstream `Empty` primitive only through the shared UI boundary if a future slice adds it.
- Use `Badge` for metadata, selected state, and status, not category color systems.
- Use `Avatar` for repeated person/provider imagery with accessible fallbacks.
- Use `Progress` only for real progress or explicit pending-work meters.

## 21st-Dev-Magic Governance

Use 21st-dev-magic only after the shadcn foundation is stable and only for selective composite inspiration or extraction.

- Do not adopt generated output raw.
- Do not use it to source low-level primitives.
- Do not introduce Base UI.
- Normalize imports to project shared UI and feature boundaries.
- Replace raw palette classes with semantic theme tokens.
- Replace unsupported icons and helpers with Lucide and shared utilities.
- Place domain-neutral accepted composites in `src/shared/ui/composites`.
- Place business-specific accepted UI in the owning `src/features/*` slice.

## Enforced Boundaries

- Cross-directory imports must keep using the `@/` alias.
- `src/shared` cannot import from `src/app`, `src/pages`, `src/features`, legacy `src/components`, or `src/contexts`.
- `src/pages` may compose feature public APIs, but must not deep-import feature internals. Import from `@/features/<feature>` or from an explicit nested public entrypoint such as `@/features/<feature>/<public-subarea>` when that folder has its own `index.ts`.
- `src/features` cannot import `src/app` or `src/pages`.
- Cross-feature imports may use another feature's root barrel or explicit nested public entrypoint, but must not deep-import files below that boundary.
- Same-feature internal imports remain allowed inside the owning feature.
- `src/integrations` must stay isolated from `src/app`, `src/pages`, `src/features`, legacy `src/components`, and `src/contexts` unless a dependency is first promoted into `src/shared`.
- `src/app/router` is wiring-only and may compose `pages`, `shared`, and app-local helpers, but not `features` directly.
- Non-router `src/app` code must not import `pages` or `features`.

## Exception Policy

- Prefer creating or expanding a public barrel over suppressing the linter.
- If a temporary exception is unavoidable, use the smallest possible `eslint-disable-next-line no-restricted-imports` scope.
- Every exception comment must include the reason and a tracking reference such as an ADR, issue, or refactor task.
- Do not add blanket file-level disables for boundary rules.
- Remove the exception as soon as the missing public entrypoint or shared abstraction is available.

## Loading-State Selection

Choose the smallest fitting loading treatment.

- Route is changing or page shell is unknown: page loader
- Card, table, list, or form shape is known but data is pending: skeleton
- Button submit, refresh action, row mutation, optimistic follow-up: inline spinner or busy indicator
- Background refetch with usable old data: keep current content and show subtle busy feedback
- Loaded successfully with no items: empty state

Avoid replacing populated content with a full-page spinner during refetch.

## Theme Token Usage

- Shared UI should consume semantic theme tokens and token-backed utilities.
- Use purpose-based naming such as surface, border, foreground, accent, success, warning, danger, muted.
- Hard-coded Tailwind colors are acceptable for one-off feature visuals, prototypes, or brand moments that are intentionally local.
- If the same raw color choice appears across multiple components, it should become a semantic token.

When in doubt:

- shared component: token first
- feature page flourish: local class is acceptable

## Design-System Review Rules

- New shared primitives and composites must use semantic classes such as `bg-card`, `text-muted-foreground`, `border-border`, `ring-ring`, and status tokens.
- Raw palette classes in `src/shared/ui` should be rejected unless the change documents a content exception such as flag colors.
- Repeated raw palette classes in pages or features should be classified as semantic token usage, a shared variant, a shared composite, or a documented local exception.
- Form controls need visible focus and invalid states through `aria-invalid` or `data-invalid`; labels and errors must remain programmatically associated.
- Service/provider categories should not gain new decorative color systems unless a separate approved brand or business spec requires it.

## Deprecated Patterns

Avoid these in new work:

- adding new reusable UI under `src/components`
- introducing Base UI
- creating parallel auth/session stores outside `AuthContext` and the shared API client
- copying query results into context without a concrete reason
- page-wide blocking spinners for small fetches or background refetches
- hard-coding reusable component colors to a specific palette role when a semantic token should exist
- placing business logic or API calls inside shared primitives/composites
- adding route definitions that also carry feature implementation details
- adding new shared helpers under `src/lib`
- adding new route ownership under `src/routes`

## Migration Bias

- Do the smallest change that moves code toward these boundaries.
- Do not rewrite stable legacy code only to satisfy the new structure.
- When touching legacy shared UI, prefer extracting toward `src/shared/ui` instead of growing the old area.
