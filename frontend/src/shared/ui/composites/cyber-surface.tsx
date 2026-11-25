import * as React from 'react';

import { cn } from '@/shared/lib/utils';

export interface CyberSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  variant?: 'default' | 'muted' | 'accent';
}

export const CyberSurface = React.forwardRef<HTMLDivElement, CyberSurfaceProps>(
  function CyberSurface({ className, interactive = false, variant = 'default', ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="cyber-surface"
        data-variant={variant}
        data-interactive={interactive ? true : undefined}
        className={cn(
          'rounded-xl border border-border bg-card text-card-foreground shadow-sm shadow-primary/5 backdrop-blur-xl',
          variant === 'muted' && 'bg-secondary/90',
          variant === 'accent' && 'border-primary/30 bg-primary/10 shadow-primary/10',
          interactive &&
            'transition-[background-color,border-color,box-shadow,transform] duration-200 hover:border-primary/40 hover:bg-accent hover:shadow-[0_0_24px_var(--shadow-glow)] active:translate-y-px',
          className,
        )}
        {...props}
      />
    );
  },
);
