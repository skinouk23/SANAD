import * as React from 'react';

import { cn } from '@/shared/lib/utils';

export interface AnimatedBorderSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  borderClassName?: string;
  borderStyle?: React.CSSProperties;
  innerClassName?: string;
}

export function AnimatedBorderSurface({
  borderClassName,
  borderStyle,
  children,
  className,
  innerClassName,
  ...props
}: AnimatedBorderSurfaceProps) {
  return (
    <div
      className={cn('relative mb-4 overflow-hidden rounded-[16px] p-[2px] shadow-sm', className)}
      {...props}
    >
      <div
        className={cn(
          'absolute inset-[-100%] motion-safe:animate-[spin_4s_linear_infinite]',
          borderClassName,
        )}
        style={borderStyle}
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative rounded-[14px] bg-white/95 p-4 backdrop-blur-xl dark:bg-slate-900/95',
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
