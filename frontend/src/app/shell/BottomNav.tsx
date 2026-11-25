import { Link, useLocation, useNavigate, useNavigation } from 'react-router-dom';
import type { ElementType } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import type { SupportedRuntimeRole } from '@/shared/lib/auth/role-policy';
import type { TranslationKeys } from '@/i18n/types';
import {
  BarChart3,
  Calendar,
  CreditCard,
  HelpCircle,
  Home,
  LogOut,
  MessageCircle,
  Package,
  Pill,
  Settings,
  User,
  Wallet,
  Zap,
} from 'lucide-react';

type NavLabelKey = keyof TranslationKeys['nav'];

interface BaseNavItem {
  id: string;
  labelKey: NavLabelKey;
  compactLabelKey?: NavLabelKey;
  icon: ElementType;
  gradient: string;
}

interface LinkNavItem extends BaseNavItem {
  path: string;
  action?: never;
}

interface ActionNavItem extends BaseNavItem {
  path?: never;
  action: () => void;
}

type NavItem = LinkNavItem | ActionNavItem;

interface NavItemBaseProps {
  active: boolean;
  pending: boolean;
}

function getNavItemClass({ active, pending }: NavItemBaseProps) {
  return `group relative flex w-full flex-col items-center gap-1 rounded-xl px-1.5 py-1.5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-2 ${active ? 'text-foreground' : pending ? 'bg-accent/60 text-primary' : 'text-muted-foreground hover:bg-accent/60'}`;
}

function isLinkNavItem(item: NavItem): item is LinkNavItem {
  return 'path' in item;
}

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    void logout();
    navigate('/auth/login');
  };

  const providerNavItems: NavItem[] = [
    {
      id: 'dashboard',
      labelKey: 'dashboard',
      compactLabelKey: 'dashboardShort',
      icon: Home,
      gradient: 'from-cyan-500 to-blue-500',
      path: '/provider-dashboard',
    },
    {
      id: 'services',
      labelKey: 'services',
      icon: Package,
      gradient: 'from-purple-500 to-pink-500',
      path: '/provider/services',
    },
    {
      id: 'schedule',
      labelKey: 'schedule',
      icon: Calendar,
      gradient: 'from-blue-500 to-purple-500',
      path: '/provider/schedule',
    },
    {
      id: 'wallet',
      labelKey: 'wallet',
      icon: Wallet,
      gradient: 'from-cyan-500 to-teal-500',
      path: '/provider/balance',
    },
    {
      id: 'analytics',
      labelKey: 'analytics',
      icon: BarChart3,
      gradient: 'from-green-500 to-emerald-500',
      path: '/provider/analytics',
    },
    {
      id: 'finances',
      labelKey: 'finances',
      compactLabelKey: 'financesShort',
      icon: CreditCard,
      gradient: 'from-amber-500 to-orange-500',
      path: '/provider/transactions',
    },
    {
      id: 'messages',
      labelKey: 'messages',
      icon: MessageCircle,
      gradient: 'from-pink-500 to-rose-500',
      path: '/messages',
    },
    {
      id: 'help',
      labelKey: 'help',
      icon: HelpCircle,
      gradient: 'from-indigo-500 to-purple-500',
      path: '/aide',
    },
    {
      id: 'logout',
      labelKey: 'logout',
      icon: LogOut,
      gradient: 'from-red-500 to-rose-500',
      action: handleLogout,
    },
  ];

  const patientNavItems: NavItem[] = [
    {
      id: 'dashboard',
      labelKey: 'home',
      icon: Home,
      gradient: 'from-cyan-500 to-blue-500',
      path: '/patient-dashboard',
    },
    {
      id: 'services',
      labelKey: 'services',
      icon: Zap,
      gradient: 'from-blue-500 to-purple-500',
      path: '/services',
    },
    {
      id: 'equipment',
      labelKey: 'equipment',
      icon: Package,
      gradient: 'from-purple-500 to-pink-500',
      path: '/equipment',
    },
    {
      id: 'mon-espace',
      labelKey: 'mySpace',
      compactLabelKey: 'mySpaceShort',
      icon: Calendar,
      gradient: 'from-green-500 to-emerald-500',
      path: '/mon-espace',
    },
    {
      id: 'medications',
      labelKey: 'medications',
      compactLabelKey: 'medicationsShort',
      icon: Pill,
      gradient: 'from-emerald-500 to-teal-500',
      path: '/medicaments',
    },
    {
      id: 'messages',
      labelKey: 'messages',
      icon: MessageCircle,
      gradient: 'from-amber-500 to-orange-500',
      path: '/messages',
    },
    {
      id: 'help',
      labelKey: 'help',
      icon: HelpCircle,
      gradient: 'from-pink-500 to-rose-500',
      path: '/aide',
    },
    {
      id: 'logout',
      labelKey: 'logout',
      icon: LogOut,
      gradient: 'from-red-500 to-rose-500',
      action: handleLogout,
    },
  ];

  const defaultNavItems: NavItem[] = [
    {
      id: 'home',
      labelKey: 'home',
      icon: Home,
      gradient: 'from-cyan-500 to-blue-500',
      path: '/',
    },
    {
      id: 'services',
      labelKey: 'services',
      icon: Zap,
      gradient: 'from-blue-500 to-purple-500',
      path: '/services',
    },
    {
      id: 'how',
      labelKey: 'howItWorks',
      compactLabelKey: 'howItWorksShort',
      icon: Settings,
      gradient: 'from-purple-500 to-pink-500',
      path: '/how-it-works',
    },
    {
      id: 'login',
      labelKey: 'login',
      icon: User,
      gradient: 'from-amber-500 to-orange-500',
      path: '/auth/login',
    },
  ];

  const getLabel = (labelKey: NavLabelKey): string => {
    return t.nav[labelKey] || labelKey;
  };

  const navItemsByRole: Record<SupportedRuntimeRole, NavItem[]> = {
    patient: patientNavItems,
    provider: providerNavItems,
  };

  const navItems = !isAuthenticated ? defaultNavItems : user ? navItemsByRole[user.role] : null;

  if (!navItems) {
    return null;
  }

  const isNavPathMatch = (itemPath: string, pathname: string) => {
    if (itemPath === '/') return pathname === '/';
    if (itemPath === '/messages')
      return pathname === '/messages' || pathname.startsWith('/messages/');

    return pathname.startsWith(itemPath);
  };

  const visualPathname = navigation.location?.pathname ?? location.pathname;

  const isActive = (path: string) => isNavPathMatch(path, location.pathname);
  const isVisuallyActive = (path: string) => isNavPathMatch(path, visualPathname);

  const isPending = (path: string) =>
    navigation.state === 'loading' &&
    navigation.location !== undefined &&
    isNavPathMatch(path, navigation.location.pathname);

  return (
    <nav aria-label="Bottom navigation" className="fixed bottom-0 left-0 right-0 z-50">
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 -z-10 h-[calc(var(--bottom-nav-offset)_+_2rem)] bg-gradient-to-t from-background via-background/95 to-transparent"></div>

      {/* Main nav bar */}
      <div className="relative border-t border-border/50 bg-background/95 backdrop-blur-xl">
        <div className="app-shell-brand-divider absolute top-0 left-0 right-0 h-[2px]"></div>

        <div className="scrollbar-hide mx-auto flex h-[var(--bottom-nav-height)] max-w-[calc(100vw-1rem)] items-center overflow-x-auto overscroll-x-contain px-2 py-2 sm:px-4">
          <div className="mx-auto grid w-max grid-flow-col auto-cols-[4.25rem] items-stretch justify-center gap-1 sm:auto-cols-[5.25rem] lg:auto-cols-[5rem]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isLinkNavItem(item) ? isActive(item.path) : false;
              const pending = isLinkNavItem(item) ? isPending(item.path) : false;
              const visuallyActive = isLinkNavItem(item) ? isVisuallyActive(item.path) : false;
              const fullLabel = getLabel(item.labelKey);
              const visibleLabel = getLabel(item.compactLabelKey ?? item.labelKey);
              const itemClassName = getNavItemClass({
                active: visuallyActive,
                pending,
              });
              const content = (
                <>
                  {/* Active indicator */}
                  {visuallyActive && (
                    <>
                      <div
                        className={`absolute -top-[2px] left-1/2 h-[2px] w-12 -translate-x-1/2 bg-gradient-to-r ${item.gradient}`}
                      ></div>
                      <div
                        className={`absolute inset-0 rounded-xl bg-gradient-to-b ${item.gradient} opacity-10`}
                      ></div>
                    </>
                  )}

                  {pending && !visuallyActive && (
                    <div
                      className={`absolute -top-[2px] left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-gradient-to-r ${item.gradient} opacity-70`}
                    ></div>
                  )}

                  {/* Icon container */}
                  <div className="relative">
                    {visuallyActive && (
                      <div
                        className={`app-bottom-nav-active-glow absolute inset-0 rounded-xl bg-gradient-to-br ${item.gradient} opacity-50 blur-lg animate-pulse`}
                      ></div>
                    )}
                    <div
                      className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors md:h-10 md:w-10 ${visuallyActive ? `bg-gradient-to-br ${item.gradient} text-white shadow-lg shadow-primary/20` : pending ? 'border border-primary/20 bg-accent text-primary shadow-sm' : 'bg-secondary text-muted-foreground group-hover:bg-accent group-hover:text-primary'}`}
                    >
                      <Icon
                        className={`h-4 w-4 transition-colors md:h-5 md:w-5 ${visuallyActive ? 'text-white' : pending ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}
                      />
                    </div>
                  </div>

                  {/* Label */}
                  <span
                    className={`block whitespace-nowrap text-[10px] font-medium transition-colors md:text-xs ${visuallyActive ? 'text-foreground' : pending ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}
                  >
                    {visibleLabel}
                  </span>
                </>
              );

              return isLinkNavItem(item) ? (
                <Link
                  key={item.id}
                  aria-label={fullLabel}
                  aria-busy={pending ? true : undefined}
                  aria-current={active ? 'page' : undefined}
                  data-pending={pending ? 'true' : undefined}
                  title={fullLabel}
                  to={item.path}
                  className={itemClassName}
                >
                  {content}
                </Link>
              ) : (
                <button
                  key={item.id}
                  aria-label={fullLabel}
                  title={fullLabel}
                  type="button"
                  onClick={item.action}
                  className={itemClassName}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom safe area */}
        <div className="h-safe-area-inset-bottom bg-background/95"></div>
      </div>
    </nav>
  );
}
