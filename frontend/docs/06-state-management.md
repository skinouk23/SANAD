# 06 — State Management

## Ownership Model

Sanad currently uses a small set of distinct state owners. The architecture does not include Redux, Zustand, MobX, or a second global state library.

| State kind | Owner | Canonical location | Typical examples |
| --- | --- | --- | --- |
| Server state | TanStack React Query | `src/shared/lib/query/client.ts` plus feature hooks and query options | Lists, detail views, cached API responses, mutations |
| Auth and session state | React context | `src/contexts/AuthContext.tsx` | Current user, tokens, session restore, auth errors |
| Theme preference | React context | `src/shared/lib/theme/theme-context.tsx` | `dark`, `light`, or `system` theme preference |
| Language and translations | React context | `src/shared/lib/i18n/language-context.tsx` | Active locale, translation dictionary, text direction |
| Local transient UI state | Component state or reducer | Owning page or feature component | Open panels, form inputs, temporary wizard state |

## Provider Composition

`src/App.tsx` mounts `AppProviders` around the router. The current provider tree is:

```tsx
<ErrorBoundary>
  <ThemeProvider>
    <LanguageProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <AppToaster />
          {import.meta.env.DEV && (
            <Suspense fallback={null}>
              <ReactQueryDevtools initialIsOpen={false} />
            </Suspense>
          )}
        </QueryClientProvider>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
</ErrorBoundary>
```

This composition lives in `src/app/providers/AppProviders.tsx`.

Key details:

- The router sits inside the provider composition, not the other way around.
- The app-level `ErrorBoundary` is part of the provider layer and logs through runtime diagnostics.
- `AppToaster` is mounted once at the global provider level.
- React Query Devtools are lazy-loaded in development only.
- `AuthProvider` clears query caches by importing the shared `queryClient` singleton directly, so it does not need to sit inside `QueryClientProvider` to perform logout cleanup.

## Server State With TanStack Query

The shared QueryClient lives in `src/shared/lib/query/client.ts`.

Current defaults are:

- `staleTime: 5 minutes`
- `gcTime: 10 minutes`
- `retry: false` for queries and mutations
- `refetchOnWindowFocus: false`

This client also hooks query and mutation cache errors to `runtimeDiagnostics` so Zod schema parse failures are recorded with query-domain context.

Feature folders own their query keys, query options, services, and hooks. The app shell does not fetch feature data directly from `src/app/router/` or `src/app/layouts/`.

## AuthContext

`src/contexts/AuthContext.tsx` is still the canonical auth store.

Its current responsibilities are:

- Restoring persisted sessions through `src/shared/lib/http/auth-session.ts`.
- Managing `isAuthenticated`, `user`, `authError`, and `isLoading`.
- Handling login, registration, refresh-token restore, logout, and user patch helpers.
- Rejecting `admin` and `super_admin` accounts so this SPA stays public, patient, and provider only.
- Synchronizing the Axios in-memory token cache through `setTokenCache()`.
- Clearing the shared QueryClient on auth boundary changes.
- Enforcing the inactivity timeout and failed-login rate limit.
- Listening for `auth:unauthorized` and `auth:forbidden` browser events emitted by the API layer.
- Feeding both `auditLogger` and `runtimeDiagnostics` with actor context.

Auth state has not been moved into `src/shared/lib/`; it remains a real context implementation under `src/contexts/`.

## Theme State

Theme state is now owned by `src/shared/lib/theme/theme-context.tsx`.

`src/contexts/ThemeContext.tsx` is only a compatibility re-export for existing imports.

The current theme model supports:

- `theme: 'dark' | 'light' | 'system'`
- `resolvedTheme: 'dark' | 'light'`
- `setTheme(theme)`
- `toggleTheme()`
- `isDark`

The provider stores the preference under `theme-preference`, writes `data-theme-preference` to `<html>`, and toggles the `dark` and `light` classes on the document element. When the preference is `system`, it also listens for `prefers-color-scheme` changes and reapplies the resolved theme.

## Language State

Language state is now owned by `src/shared/lib/i18n/language-context.tsx`.

`src/contexts/LanguageContext.tsx` is only a compatibility re-export for existing imports.

The current language stack is split across:

- `src/shared/lib/i18n/languages.ts` for language definitions and default-locale selection.
- `src/shared/lib/i18n/locale-loader.ts` for dynamic translation loading and caching.
- `src/i18n/` for translation dictionaries and shared translation types.

Current behavior:

- The default locale comes from `env.DEFAULT_LOCALE` when it matches a supported language, otherwise the app falls back to `fr-FR`.
- Non-default translations are loaded lazily and cached per language code.
- Language changes are applied with `startTransition()`.
- The provider persists the selected language in `localStorage`.
- The provider keeps `document.documentElement.lang` and `document.documentElement.dir` synchronized with the active language.

## Compatibility Boundary

For theme and i18n, the canonical modules now live under `src/shared/lib/`. Existing imports from `@/contexts/ThemeContext` and `@/contexts/LanguageContext` still work because those files are thin compatibility barrels.

For auth state, `src/contexts/` still contains the real implementation.

## Decision Guide

| If the state is... | Put it in... |
| --- | --- |
| API-backed and cacheable | A feature hook backed by TanStack Query |
| Logged-in identity or session lifecycle | `AuthContext` |
| Theme or locale preference | The canonical theme or i18n context under `src/shared/lib/` |
| Temporary page or form interaction state | Local component state or reducer |

Mock mode does not change state ownership. It only swaps the network boundary during runtime initialization.
