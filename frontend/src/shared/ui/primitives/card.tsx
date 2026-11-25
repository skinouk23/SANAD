import * as React from 'react';

import { cn } from '@/shared/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'sm';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, size = 'default', ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="card"
      data-size={size}
      className={cn(
        'group/card rounded-xl border border-border bg-card text-card-foreground shadow-sm shadow-primary/5 backdrop-blur-xl data-[size=sm]:text-sm',
        className,
      )}
      {...props}
    />
  );
});

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="card-header"
        className={cn(
          'grid auto-rows-min items-start gap-1.5 p-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] group-data-[size=sm]/card:p-4',
          className,
        )}
        {...props}
      />
    );
  },
);

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(function CardTitle({ className, ...props }, ref) {
  return (
    <h3
      ref={ref}
      data-slot="card-title"
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
});

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});

export const CardAction = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardAction({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="card-action"
        className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
        {...props}
      />
    );
  },
);

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="card-content"
        className={cn(
          'p-6 pt-0 group-data-[size=sm]/card:p-4 group-data-[size=sm]/card:pt-0',
          className,
        )}
        {...props}
      />
    );
  },
);

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="card-footer"
        className={cn(
          'flex items-center gap-3 p-6 pt-0 group-data-[size=sm]/card:p-4 group-data-[size=sm]/card:pt-0',
          className,
        )}
        {...props}
      />
    );
  },
);
