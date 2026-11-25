import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/shared/lib/utils';

export type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;

export const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  function Label({ className, ...props }, ref) {
    return (
      <LabelPrimitive.Root
        ref={ref}
        data-slot="label"
        className={cn(
          'flex items-center gap-2 text-sm font-medium leading-none text-foreground select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 group-data-[disabled]:pointer-events-none group-data-[disabled]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className,
        )}
        {...props}
      />
    );
  },
);
