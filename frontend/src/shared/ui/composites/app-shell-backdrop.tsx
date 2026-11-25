import type { ReactNode } from 'react';

export type AppShellVariant = 'cyber' | 'admin' | 'care' | 'soft';

interface AppShellBackdropProps {
  children: ReactNode;
  variant?: AppShellVariant;
  className?: string;
  contentClassName?: string;
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
