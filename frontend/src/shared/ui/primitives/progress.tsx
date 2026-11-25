import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/shared/lib/utils';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(function Progress({ className, value, ...props }, ref) {
  const normalizedValue = Math.max(0, Math.min(100, value ?? 0));

  return (
    <ProgressPrimitive.Root
      ref={ref}
      data-slot="progress"
      className={cn(
        'relative flex h-1 w-full items-center overflow-x-hidden rounded-full border border-border/60 bg-muted/50 shadow-inner shadow-primary/5 backdrop-blur-md',
        className,
      )}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="size-full flex-1 bg-gradient-to-r from-primary to-[var(--accent-secondary)] shadow-[0_0_14px_var(--shadow-glow)] transition-transform"
        style={{ transform: `translateX(-${100 - normalizedValue}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});

export { Progress };
