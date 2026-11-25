import type { ReactNode } from 'react';
import { Link, Outlet, useMatches, useNavigate, useNavigation } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';

import { BottomNav } from '@/app/shell/BottomNav';
import { AppShellBackdrop } from '@/app/shell/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { useFileBlobUrl } from '@/shared/lib/files/useFileBlobUrl';
import { AssistantTopBarButton } from '@/app/layouts/AssistantTopBarButton';
import { ProfileLocationButton } from '@/app/layouts/ProfileLocationButton';
import { LanguageSelector } from '@/shared/ui/composites/language-selector';
import { ThemeSwitcher } from '@/shared/ui/composites/theme-switcher';
import type { SupportedRuntimeRole } from '@/shared/lib/auth/role-policy';
import type { RouteHandle } from '@/types/router.types';

export interface AppLayoutProps {
  overlay?: ReactNode;
}

const ACCOUNT_PATHS: Record<SupportedRuntimeRole, string> = {
  patient: '/patient/profile',
  provider: '/provider/profile',
};

function getHistoryIndex() {
  const index = window.history.state?.idx;

  return typeof index === 'number' ? index : 0;
}

export function AppLayout({ overlay }: AppLayoutProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const matches = useMatches();
  const { objectUrl: avatarUrl } = useFileBlobUrl(user?.avatarFileId);

  // ============================================
  // BACK BUTTON — read handle.parent from the deepest matched route
  // ============================================
  const currentMatch = [...matches]
    .reverse()
    .find((match) => Boolean(match.handle as RouteHandle | undefined));
  const handle = currentMatch?.handle as RouteHandle | undefined;
  const currentParams = currentMatch?.params ?? {};
  const parent = handle?.parent
    ? typeof handle.parent === 'function'
      ? handle.parent(currentParams as Record<string, string>)
      : handle.parent
    : undefined;
  const historyFirstBack = handle?.back?.type === 'history-first' ? handle.back : undefined;
  const fallbackParent = user ? historyFirstBack?.fallbackByRole[user.role] : undefined;
  const showBackButton = Boolean(parent || historyFirstBack);
  const accountPath = user ? ACCOUNT_PATHS[user.role] : undefined;
  const userInitial = user?.name?.trim().charAt(0).toUpperCase();
  const showAuthenticatedActions = isAuthenticated && Boolean(accountPath);
  const showRouteProgress = navigation.state === 'loading';

  const handleBack = () => {
    if (historyFirstBack) {
      if (getHistoryIndex() > 0) {
        navigate(-1);
        return;
      }

      if (fallbackParent) {
        navigate(fallbackParent, { replace: true });
      }

      return;
    }

    if (parent) {
      navigate(parent);
    }
  };

  return (
    <AppShellBackdrop>
      {/* Top Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 pt-[var(--safe-top)] text-foreground shadow-sm shadow-primary/5 backdrop-blur-md">
        {/* Route loading indicator */}
        {showRouteProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
            <div className="app-shell-brand-progress h-full w-full animate-[shimmer_1.5s_ease-in-out_infinite]" />
          </div>
        )}

        <div className="mx-auto flex min-h-[var(--app-header-height)] max-w-7xl items-center justify-between px-4 py-2">
          {/* Left side - Back button */}
          <div className="flex items-center">
            {showBackButton ? (
              <button
                aria-label="Go back"
                onClick={handleBack}
                className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                type="button"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : (
              <div className="h-11 w-11" /> // Spacer to maintain layout
            )}
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center gap-2">
            {showAuthenticatedActions && accountPath && user ? (
              <div className="mr-1 flex items-center gap-2 border-r border-border/70 pr-3">
                <AssistantTopBarButton />
                <ProfileLocationButton />
              </div>
            ) : null}

            <ThemeSwitcher className="h-9 w-9 min-h-0 min-w-0" />
            <LanguageSelector />
            {showAuthenticatedActions && accountPath && user ? (
              <Link
                aria-label="Open profile"
                to={accountPath}
                className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-border bg-card text-sm font-semibold text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="h-11 w-11 rounded-full object-cover"
                    decoding="async"
                    height="44"
                    width="44"
                  />
                ) : userInitial ? (
                  <span>{userInitial}</span>
                ) : (
                  <User className="h-4 w-4" />
                )}
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main
        aria-busy={navigation.state === 'loading' ? true : undefined}
        className="relative z-10 pb-[var(--bottom-nav-offset)] pt-[var(--app-header-offset)]"
      >
        <Outlet />
      </main>

      {overlay}

      {/* Bottom Navigation */}
      <BottomNav />
    </AppShellBackdrop>
  );
}
