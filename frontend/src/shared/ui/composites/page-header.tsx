import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/primitives/badge';

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  align?: 'left' | 'center';
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  variant?: 'default' | 'section' | 'hero';
}

export function PageHeader({
  actions,
  align,
  badge,
  className,
  description,
  eyebrow,
  title,
  variant = 'default',
  ...props
}: PageHeaderProps) {
  const effectiveAlign = align ?? (variant === 'default' ? 'left' : 'center');
  const isCentered = effectiveAlign === 'center';
  const isDefault = variant === 'default';

  return (
    <div
      className={cn(
        isDefault
          ? 'flex flex-col gap-4 border-b border-border/80 pb-5'
          : 'flex flex-col gap-4 py-2',
        isDefault && !isCentered && 'sm:flex-row sm:items-start sm:justify-between',
        variant === 'hero' && 'gap-5 py-4',
        isCentered ? 'items-center text-center' : 'text-left',
        !isCentered && !isDefault && 'items-start',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col gap-2',
          isCentered && 'items-center',
          !isDefault && 'w-full max-w-3xl',
        )}
      >
        {eyebrow ? (
          <div
            className={cn(
              'text-sm font-medium uppercase tracking-[0.18em]',
              isDefault ? 'text-muted-foreground' : 'text-primary',
            )}
          >
            {eyebrow}
          </div>
        ) : null}
        <div className={cn('flex flex-wrap items-center gap-3', isCentered && 'justify-center')}>
          <h1
            className={cn(
              'font-semibold tracking-tight text-foreground',
              isDefault && 'text-2xl sm:text-3xl',
              !isDefault && 'text-balance font-bold',
              variant === 'section' && 'text-3xl sm:text-4xl',
              variant === 'hero' && 'text-4xl sm:text-5xl',
            )}
          >
            {title}
          </h1>
          {typeof badge === 'string' ? <Badge variant="secondary">{badge}</Badge> : badge}
        </div>
        {description ? (
          <p
            className={cn(
              'max-w-3xl text-sm text-muted-foreground sm:text-base',
              !isDefault && 'text-pretty',
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className={cn('flex flex-wrap items-center gap-2', isCentered && 'justify-center')}>
          {actions}
        </div>
      ) : null}
    </div>
  );
}
