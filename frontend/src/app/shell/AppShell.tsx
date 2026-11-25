import { HeartPulse } from 'lucide-react';
import type { ReactNode } from 'react';

export type AppShellVariant = 'cyber' | 'admin' | 'care' | 'soft';

interface AppShellBackdropProps {
  children: ReactNode;
  variant?: AppShellVariant;
  className?: string;
  contentClassName?: string;
}

interface PageLoadingShellProps {
  children: ReactNode;
  variant?: AppShellVariant;
  topBar?: ReactNode;
  withBackdrop?: boolean;
  className?: string;
  contentClassName?: string;
  container?: '4xl' | '7xl' | 'full';
}

interface PageLoadingTopBarProps {
  children: ReactNode;
  variant?: AppShellVariant;
  sticky?: boolean;
  className?: string;
}

interface AppStartupLoaderProps {
  title?: string;
  subtitle?: string;
}

interface ShellConfig {
  root: string;
  grid?: string;
  orbs: string[];
}

const SHELL_CONFIG: Record<AppShellVariant, ShellConfig> = {
  cyber: {
    root: 'app-shell-backdrop-cyber',
    grid: 'app-shell-grid-cyber',
    orbs: ['app-shell-orb-cyber-1', 'app-shell-orb-cyber-2'],
  },
  admin: {
    root: 'app-shell-backdrop-admin',
    grid: 'app-shell-grid-admin',
    orbs: ['app-shell-orb-admin-1', 'app-shell-orb-admin-2'],
  },
  care: {
    root: 'app-shell-backdrop-care',
    orbs: ['app-shell-orb-care-1', 'app-shell-orb-care-2'],
  },
  soft: {
    root: 'app-shell-backdrop-soft',
    orbs: ['app-shell-orb-soft-1', 'app-shell-orb-soft-2'],
  },
};

const TOP_BAR_STYLES: Record<AppShellVariant, string> = {
  cyber: 'app-shell-topbar-cyber',
  admin: 'app-shell-topbar-admin',
  care: 'app-shell-topbar-care',
  soft: 'app-shell-topbar-soft',
};

const CONTAINER_WIDTHS = {
  '4xl': 'max-w-4xl',
  '7xl': 'max-w-7xl',
  full: '',
} as const;

export function AppShellBackdrop({
  children,
  variant = 'cyber',
  className = '',
  contentClassName = '',
}: AppShellBackdropProps) {
  const config = SHELL_CONFIG[variant];

  return (
    <div
      className={`app-shell-backdrop relative min-h-screen min-h-dvh transition-[background-color,color,border-color] duration-300 ${config.root} ${className}`}
      data-shell-variant={variant}
    >
      {config.grid ? (
        <div className={`app-shell-grid pointer-events-none fixed inset-0 ${config.grid}`} />
      ) : null}

      {config.orbs.map((orb, index) => (
        <div
          key={`${variant}-orb-${index}`}
          className={`app-shell-orb pointer-events-none ${orb}`}
        />
      ))}

      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </div>
  );
}

export function PageLoadingTopBar({
  children,
  variant = 'cyber',
  sticky = true,
  className = '',
}: PageLoadingTopBarProps) {
  return (
    <div
      className={`${sticky ? 'sticky top-0' : 'relative'} app-shell-topbar z-30 border-b border-border ${TOP_BAR_STYLES[variant]} ${className}`}
    >
      {children}
    </div>
  );
}

export function PageLoadingShell({
  children,
  variant = 'cyber',
  topBar,
  withBackdrop = false,
  className = '',
  contentClassName = 'px-4 py-8 sm:px-6 lg:px-8 animate-pulse',
  container = '7xl',
}: PageLoadingShellProps) {
  const containerClassName = CONTAINER_WIDTHS[container];
  const content = (
    <>
      {topBar ? <div className="relative z-20">{topBar}</div> : null}

      <div className="relative z-10">
        <div className={`${containerClassName} mx-auto ${contentClassName}`}>{children}</div>
      </div>
    </>
  );

  if (withBackdrop) {
    return (
      <AppShellBackdrop variant={variant} className={className}>
        {content}
      </AppShellBackdrop>
    );
  }

  return <div className={`min-h-screen ${className}`}>{content}</div>;
}

export function AppStartupLoader({
  title = 'Care@Home Tunisia',
  subtitle = 'Preparation de votre espace de soins... ',
}: AppStartupLoaderProps) {
  return (
    <AppShellBackdrop
      variant="cyber"
      className="overflow-hidden"
      contentClassName="flex min-h-screen min-h-dvh items-center justify-center px-6 py-12"
    >
      <div className="w-full max-w-md" role="status" aria-live="polite">
        <div className="app-startup-card relative overflow-hidden rounded-[28px] border p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="app-startup-card-glow absolute inset-0" />

          <div className="relative flex flex-col items-center gap-5 text-center">
            <span className="sr-only">Chargement de l'application</span>

            <div className="relative">
              <div className="app-shell-brand-glow absolute inset-0 rounded-[28px] blur-xl" />
              <div className="app-shell-brand-surface app-shell-brand-shadow relative flex h-16 w-16 items-center justify-center rounded-[24px]">
                <HeartPulse className="h-8 w-8" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="app-startup-eyebrow text-[11px] font-semibold uppercase tracking-[0.28em]">
                Plateforme de soins a domicile
              </p>
              <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
                {subtitle.trim()}
              </p>
            </div>

            <div className="app-startup-progress-shell w-full rounded-full border p-1">
              <div className="app-startup-progress-track relative h-2 overflow-hidden rounded-full">
                <div className="app-shell-brand-progress absolute inset-y-0 -left-1/3 w-1/3 rounded-full motion-safe:animate-[shimmer_1.6s_ease-in-out_infinite]" />
              </div>
            </div>

            <div className="grid w-full grid-cols-3 gap-2 text-[11px] font-medium">
              {['Verifie', 'Rapide', '24/7'].map((item) => (
                <div key={item} className="app-startup-chip rounded-full px-3 py-2">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShellBackdrop>
  );
}
