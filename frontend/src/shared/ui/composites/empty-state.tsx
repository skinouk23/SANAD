import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  action,
  className,
  description,
  icon,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-xl border border-border/70 bg-card/70 px-6 py-12 text-center text-card-foreground shadow-sm shadow-primary/5 backdrop-blur-xl',
        className,
      )}
      {...props}
    >
      {icon ? (
        <div className="mb-4 rounded-full border border-primary/20 bg-primary/10 p-3 text-primary shadow-sm shadow-primary/10">
          {icon}
        </div>
      ) : null}
      <div className="flex max-w-md flex-col gap-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">{action}</div>
      ) : null}
    </div>
  );
}
