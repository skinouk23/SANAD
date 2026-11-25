import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@/shared/lib/utils';

type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & {
  size?: 'sm' | 'default';
};

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  function Switch({ className, size = 'default', ...props }, ref) {
    return (
      <SwitchPrimitive.Root
        ref={ref}
        data-slot="switch"
        data-size={size}
        className={cn(
          'peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent bg-input transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px]',
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className="pointer-events-none block rounded-full bg-background ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=checked]:bg-primary-foreground data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-foreground group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3"
        />
      </SwitchPrimitive.Root>
    );
  },
);

export { Switch };
