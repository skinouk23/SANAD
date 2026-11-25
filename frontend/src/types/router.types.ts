// ============================================
// ROUTE HANDLE TYPES
// Used with createBrowserRouter + useMatches()
// to provide declarative back-button navigation
// ============================================

/**
 * Metadata attached to route definitions via the `handle` property.
 * AppLayout reads this via `useMatches()` to determine back-button behavior.
 *
 * - `string`: static parent path (e.g. '/services')
 * - `function`: dynamic parent resolved from route params (e.g. (p) => `/care/${p.serviceId}`)
 * - `undefined` / omitted: no back button shown (dashboards, landing, auth)
 *
 * Account-owned routes hide the app-shell avatar because the avatar links back to Account.
 * History-first routes use browser history when available and fall back by authenticated role.
 */
export interface RouteHandle {
  parent?: string | ((params: Record<string, string>) => string);
  accountOwned?: boolean;
  back?: {
    type: 'history-first';
    fallbackByRole: Partial<Record<'patient' | 'provider', string>>;
  };
}
