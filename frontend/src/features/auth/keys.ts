/**
 * Auth Query Key Factory
 *
 * Hierarchical keys for auth-related queries:
 *   authKeys.all        → invalidate everything auth-related
 *   authKeys.profile()  → current user profile
 *   authKeys.session()  → session state
 *   authKeys.security() → account security overview
 */
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  security: () => [...authKeys.all, 'security'] as const,
} as const;
