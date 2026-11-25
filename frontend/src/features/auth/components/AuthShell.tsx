import type { ReactNode } from 'react';

import { LanguageSelector } from '@/shared/ui/composites/language-selector';
import { ThemeSwitcher } from '@/shared/ui/composites/theme-switcher';
import { cn } from '@/shared/lib/utils';

interface AuthShellProps {
  children: ReactNode;
  className?: string;
}

export function AuthShell({ children, className }: AuthShellProps) {
  return (
    <div className="relative flex min-h-[100dvh] items-start justify-center overflow-x-hidden px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-[calc(env(safe-area-inset-top)+1rem)] sm:min-h-screen sm:items-center sm:py-6">
      <div className="fixed right-3 top-[calc(env(safe-area-inset-top)+0.5rem)] z-50 flex items-center gap-2 sm:right-4 sm:top-4">
        <ThemeSwitcher />
        <LanguageSelector />
      </div>

      <div className={cn('relative z-10 w-full', className)}>{children}</div>
    </div>
  );
}

interface AuthPanelProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function AuthPanel({ children, className, contentClassName }: AuthPanelProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[20px] p-[2px] shadow-2xl shadow-primary/10',
        className,
      )}
    >
      <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />
      <div
        className={cn(
          'relative rounded-[18px] border border-white/40 bg-white/95 p-4 text-card-foreground shadow-inner shadow-white/20 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/95 dark:shadow-black/20 sm:p-5',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
