# 05 — Routing and Pages

## Ownership

The frontend has a single browser router: `appRouter` in `src/app/router/router.tsx`. `src/App.tsx` mounts that router through `RouterProvider`.

Route definitions are split across `src/app/router/routes/*.tsx`, while the actual page modules live in `src/pages/`. `src/app/router/` is the source of truth for navigation wiring. The legacy `src/routes/` directory is not part of the active router setup.

## Top-Level Route Tree

```text
appRouter
└── RootLayout
    └── appLayoutRoutes (pathless AppLayoutRoute -> AppLayout)
        ├── publicRoutes
        ├── serviceRoutes
        ├── patientRoutes
        ├── sharedMessagingRoutes
        ├── sharedHelpRoutes
        ├── providerRoutes
        └── * -> NotFoundPage
```

`RootLayout` is always active. It handles scroll restoration, consent banner rendering, and runtime diagnostics route-context updates on every navigation.

## Route Modules

| Route module | Shell / guard | Example paths | Notes |
| --- | --- | --- | --- |
| `publicRoutes.tsx` | `AppLayout` | `/`, `/services`, `/how-it-works`, `/subscriptions`, `/auth/*` | Public landing, auth, and discovery routes |
| `serviceRoutes.tsx` | `AppLayout`, with one nested `PatientRoute` section | `/equipment`, `/laboratory`, `/radiology`, `/care/:serviceId`, `/gym` | Service discovery pages are mostly public; `equipment/:id` is explicitly patient-guarded |
| `patientRoutes.tsx` | `AppLayout` + `PatientRoute` | `/patient-dashboard`, `/patient/profile`, `/mon-espace`, `/medicaments`, booking flows | Patient-only routing is grouped by ownership, not by one URL prefix |
| `sharedMessagingRoutes.tsx` | `AppLayout` + `PatientProviderRoute` | `/messages`, `/messages/:conversationId` | Shared patient/provider messaging area |
| `sharedHelpRoutes.tsx` | `AppLayout` + `PatientProviderRoute` | `/aide` | Shared patient/provider help area |
| `providerRoutes.tsx` | `AppLayout` + `ProviderRoute` | `/provider-dashboard`, `/provider/profile`, `/provider/services`, `/provider/balance`, `/provider/transactions`, `/provider/analytics` | Provider-facing routes |

Route grouping is based on guard ownership and layout composition, not strictly on URL prefixes. For example, `/mon-espace` is protected by `PatientRoute` and `/aide` is protected by `PatientProviderRoute` even though neither lives under `/patient/*`.

## Guard Behavior

| Guard | Current behavior |
| --- | --- |
| `PatientRoute` | Shows `AppStartupLoader` while auth restores, redirects unauthenticated users to `/auth/login` with `returnTo`, redirects providers to `/provider-dashboard`, blocks `admin` and `super_admin`, and otherwise allows patient routes |
| `ProviderRoute` | Shows `AppStartupLoader` while auth restores, redirects unauthenticated users to `/auth/login`, redirects patients to `/patient-dashboard`, blocks `admin` and `super_admin`, and otherwise allows provider routes |
| `PatientProviderRoute` | Allows patient and provider roles, redirects unauthenticated users to `/auth/login`, and blocks `admin` and `super_admin` |

All guards live under `src/app/router/guards/` and keep route protection in the router layer rather than scattering it across page modules.

## Lazy Route Modules And Loaders

The router uses the `L()` helper from `src/app/router/helpers.ts` to register lazy route modules.

`L()` expects a page module to export a named component. If that same page module also exports `loader`, the helper attaches it to the route automatically. That keeps route data loading close to the owning page module while preserving centralized route ownership.

Current pages using this pattern include service pages, equipment pages, messaging pages, and selected patient pages.

## Loading Behavior

- `RouterProvider` is mounted with `fallbackElement={<RouterFallback />}` in `src/App.tsx`.
- `RouterFallback` is only for the router startup phase before the first route tree is ready.
- `AppLayout` uses `useNavigation()` to render a thin loading indicator during route transitions.
- Normal route navigation is not driven by a global page-level suspense screen after startup.

`AppLayoutRoute` passes `AssistantDock` into `AppLayout` as a shell overlay. The dock lives under `src/features/assistant/`; the chatbot and voice panels lazy-load their heavier dialog and panel content separately.

## Route Handles And Back Navigation

The `h()` helper in `src/app/router/helpers.ts` attaches `handle.parent` metadata to a route. `AppLayout` reads the deepest matched route handle through `useMatches()` and uses it to render the back button.

Handles can be:

- A static string such as `'/services'`.
- A function that derives a parent path from route params.
- A history-first back rule with role fallback.

The booking route for `care/:serviceId/booking/:providerId` uses the dynamic form so the back button resolves back to `/care/:serviceId`.

Profile routes use parent handles for normal back navigation. `AppLayout` always points the top-bar avatar at the role-specific profile route.

## Route Errors And Diagnostics

The router uses `RouteErrorPage` for the active app layout route branch.

Each error element calls `useRouteError()`, records the failure through `runtimeDiagnostics.captureRouterError(...)`, and shows a local reference id. That reference id is intended for debugging and support traces.

`RootLayout` updates runtime diagnostics route context on every navigation through `runtimeDiagnostics.setRouteContext({ pathname, search, hash })`. That means router errors and higher-level React boundary errors are tagged with a sanitized view of the active route.

Outside route-level failures, `AppProviders` wraps the application in a React `ErrorBoundary` and renders `ErrorFallback` for non-router subtree crashes.

## Not Found Behavior

The app layout branch defines `* -> NotFoundPage` inside `appLayoutRoutes.tsx`.

Old `/admin/*` URLs are no longer mounted by this SPA, so they now fall through to the normal not-found experience unless another valid route matches.

## Adding A New Page

1. Create the page module under the appropriate `src/pages/` subfolder.
2. Export the page component as a named export.
3. Export `loader` from the same file if the route needs a data-router loader.
4. Register the page from the correct file in `src/app/router/routes/` using `L()`.
5. Place the route under the correct guard group instead of implementing access control in the page itself.
6. Add `h(...)` when the app shell should expose back navigation.

New route ownership should stay in `src/app/router/`; do not add active route definitions under `src/routes/`.
