import * as React from 'react';

import { cn } from '@/shared/lib/utils';

const gradientIconSizes = {
  sm: "size-8 rounded-lg [&_svg:not([class*='size-'])]:size-4",
  md: "size-10 rounded-xl [&_svg:not([class*='size-'])]:size-5",
  lg: "size-12 rounded-2xl [&_svg:not([class*='size-'])]:size-6",
} as const;

export interface GradientIconProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: string;
  size?: keyof typeof gradientIconSizes;
}

export const GradientIcon = React.forwardRef<HTMLDivElement, GradientIconProps>(
  function GradientIcon(
    { children, className, gradient = 'from-cyan-500 to-blue-600', size = 'md', ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        data-slot="gradient-icon"
        data-size={size}
        className={cn(
          'inline-flex shrink-0 items-center justify-center bg-gradient-to-br text-white shadow-sm shadow-primary/20 ring-1 ring-white/10 [&_svg]:pointer-events-none [&_svg]:shrink-0',
          gradient,
          gradientIconSizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
