import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getDefaultRouteForRuntimeRole } from '@/shared/lib/auth/role-policy';

/**
 * 404 page rendered inside AppLayout so the user still sees the
 * app header and bottom nav. Single "Accueil" button routes to the
 * user's role-appropriate dashboard (patient / provider / landing).
 */
export function NotFoundPage() {
  const { isAuthenticated, user } = useAuth();

  const homePath = !isAuthenticated
    ? '/'
    : user
      ? getDefaultRouteForRuntimeRole(user.role)
      : '/auth/login';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-warning/20 bg-warning/10">
        <AlertTriangle className="h-10 w-10 text-warning" />
      </div>

      {/* Heading */}
      <h1 className="mb-2 text-6xl font-bold text-foreground">404</h1>
      <h2 className="mb-3 text-xl font-semibold text-foreground/80">Page introuvable</h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>

      {/* Single action — role-aware home */}
      <Link
        to={homePath}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
      >
        <Home className="w-5 h-5" />
        Accueil
      </Link>
    </div>
  );
}
