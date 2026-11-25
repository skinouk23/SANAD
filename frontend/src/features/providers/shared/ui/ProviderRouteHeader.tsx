import type { ReactNode } from 'react';

interface ProviderRouteHeaderProps {
  children: ReactNode;
  containerClassName?: string;
}

export function ProviderRouteHeader({
  children,
  containerClassName = 'mx-auto max-w-7xl px-4 py-4',
}: ProviderRouteHeaderProps) {
  return (
    <div className="relative z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
      <div className={containerClassName}>{children}</div>
    </div>
  );
}
