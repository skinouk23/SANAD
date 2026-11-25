import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="skeleton"
      className={cn('motion-safe:animate-pulse rounded-md bg-[var(--skeleton-base)]', className)}
      {...props}
    />
  );
});
