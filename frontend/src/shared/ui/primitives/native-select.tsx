import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

export type NativeSelectProps = Omit<React.ComponentPropsWithoutRef<'select'>, 'size'> & {
  size?: 'sm' | 'default';
};

const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(function NativeSelect(
  { className, size = 'default', ...props },
  ref,
) {
  return (
    <div
      className={cn(
        'group/native-select relative w-fit has-[select:disabled]:opacity-50',
        className,
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        ref={ref}
        data-slot="native-select"
        data-size={size}
        className="h-10 w-full min-w-0 appearance-none rounded-lg border border-border bg-input py-2 pr-9 pl-3 text-base text-foreground transition-colors outline-none select-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground hover:bg-input/80 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-[size=sm]:h-8 data-[size=sm]:py-1 data-[size=sm]:pr-8 data-[size=sm]:pl-2.5 md:text-sm"
        {...props}
      />
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground transition-colors select-none group-hover/native-select:text-foreground group-focus-within/native-select:text-primary"
        data-slot="native-select-icon"
      />
    </div>
  );
});

const NativeSelectOption = React.forwardRef<
  HTMLOptionElement,
  React.ComponentPropsWithoutRef<'option'>
>(function NativeSelectOption({ className, ...props }, ref) {
  return (
    <option
      ref={ref}
      data-slot="native-select-option"
      className={cn('bg-[Canvas] text-[CanvasText]', className)}
      {...props}
    />
  );
});

const NativeSelectOptGroup = React.forwardRef<
  HTMLOptGroupElement,
  React.ComponentPropsWithoutRef<'optgroup'>
>(function NativeSelectOptGroup({ className, ...props }, ref) {
  return (
    <optgroup
      ref={ref}
      data-slot="native-select-optgroup"
      className={cn('bg-[Canvas] text-[CanvasText]', className)}
      {...props}
    />
  );
});

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
