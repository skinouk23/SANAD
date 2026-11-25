# 01 — Project Overview

## Scope

`CareAtHomeFinal/` is the frontend SPA for Care@Home Tunisia (Sanad). It serves public, patient, provider, service discovery, and messaging experiences from one React application.

This document reflects the current Block 12 frontend structure. It replaces earlier template-era assumptions such as Tailwind v3 styling, router ownership outside `src/app/router`, and default-on mocks.

The app can run against the real backend or, in development only, against an opt-in MSW mock worker. Real backend mode is the default.

## Stack At A Glance

| Layer | Current choice | Notes |
| --- | --- | --- |
| UI runtime | React 18 | Single-page application |
| Language | TypeScript 5 | Strict compiler settings |
| Build tool | Vite 5 | Uses the React plugin and `@tailwindcss/vite` |
| Styling | Tailwind CSS 4 | Global tokens and base styles are imported from `src/index.css` |
| Routing | React Router DOM 6 data router | `createBrowserRouter` + `RouterProvider` |
| Server state | TanStack React Query 5 | Shared client in `src/shared/lib/query/client.ts` |
| Client state | React contexts + local component state | No additional state library |
| Validation | Zod 4 | Runtime schema validation and parse diagnostics |
| HTTP | Axios 1 | Shared client in `src/api/client.ts` |
| Mocking | MSW 2 | Development-only and opt-in |
| Testing | Vitest 4 + Testing Library | Setup lives in `src/test/setup.ts` |
| Diagnostics | Custom runtime diagnostics | `src/shared/lib/monitoring/` |

## Runtime Boot Flow

The application startup path is:

```text
src/index.tsx
  -> initializeRuntime() in src/app/bootstrap/runtime.ts
  -> <App />
     -> <AppProviders>
        -> <RouterProvider router={appRouter} fallbackElement={<RouterFallback />} />
```

`initializeRuntime()` performs runtime work before React renders:

1. It initializes `runtimeDiagnostics`.
2. It validates environment variables through `validateEnv()`.
3. It logs env details only when `VITE_ENABLE_DEBUG_MODE=true` in development.
4. It starts MSW only when `shouldEnableMockData()` returns `true`.
5. It returns control to `boot()`, which mounts React.

If runtime initialization or the first render fails, `src/index.tsx` renders a minimal boot-failure screen with a diagnostic reference id instead of trying to continue with a broken app.

## Source Map

| Path | Current responsibility |
| --- | --- |
| `src/app/bootstrap/` | Runtime initialization, env validation, mock bootstrap |
| `src/app/providers/` | App provider composition, global error boundary, toaster wiring |
| `src/app/router/` | Router creation, route groups, guards, helpers, fallback element, route error pages |
| `src/app/layouts/` | Root and app layout shells |
| `src/app/shell/` | Shared shell UI such as startup loaders, navigation, and consent banner |
| `src/pages/` | Lazy-loaded route entry modules and page composition |
| `src/features/` | Domain-owned hooks, query options, services, schemas, assistants, and feature UI |
| `src/shared/lib/` | Canonical shared runtime modules such as query, theme, i18n, monitoring, notifications, HTTP session helpers, and dev utilities |
| `src/shared/ui/` | Shared primitives and composites |
| `src/shared/schemas/` | Cross-domain runtime schemas and API envelopes |
| `src/contexts/` | `AuthContext` and compatibility re-export barrels for theme and language |
| `src/mocks/` | MSW worker and handler aggregation |
| `src/integrations/` | Third-party boundaries such as maps, exports, and external adapters |
| `src/styles/` | Theme tokens and shared global styles |
| `src/components/` | Legacy shared area; not the preferred home for new shared UI |

## Canonical Module Locations

- Router ownership lives under `src/app/router/`.
- The browser router instance is exported from `src/app/router/router.tsx`.
- Theme source of truth is `src/shared/lib/theme/theme-context.tsx`.
- Language source of truth is `src/shared/lib/i18n/language-context.tsx`.
- `src/contexts/ThemeContext.tsx` and `src/contexts/LanguageContext.tsx` now exist as compatibility re-exports.
- `AuthProvider` still lives in `src/contexts/AuthContext.tsx`.
- Backend auth can still return `admin` and `super_admin`, but this SPA blocks those roles during login and session restore.

## Runtime Modes And Environment Flags

| Mode | Conditions | Behavior |
| --- | --- | --- |
| Real backend mode | Default local config and all production builds | Uses the configured API base URL and does not load MSW |
| Mock development mode | `import.meta.env.DEV` and `VITE_ENABLE_MOCK_DATA=true` | Dynamically imports `src/shared/lib/dev/msw.ts` and starts the worker before React renders |
| Debug diagnostics mode | `VITE_ENABLE_DEBUG_MODE=true` in development | Enables extra env logging and richer local diagnostic output |

Environment validation also rejects `VITE_ENABLE_MOCK_DATA=true` in production builds.

## Performance Reporting And Budgets

Performance reporting is part of the current toolchain:

- `npm run build` runs `vite build --manifest`.
- `npm run build:report` rebuilds and writes `dist/reports/performance-report.json` and `dist/reports/performance-report.txt`.
- `npm run build:budget` runs the same analysis and exits non-zero when `performance-budgets.json` is exceeded.

The budget file currently tracks the shared shell, heavy route entry bundles, and selected optional domains such as assistant tooling, mapping, and report-export dependencies.

## Documentation Pointers

- [05 — Routing and Pages](./05-routing-and-pages.md) for the current router tree and guard behavior.
- [06 — State Management](./06-state-management.md) for provider composition and state ownership.
- [ADR Index](./adr/README.md) for architecture decisions that guide new work.
- [Frontend Contribution Guide](./governance/frontend-contribution-guide.md) for placement and boundary rules.
