import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '@/shared/lib/utils';

function Popover({ ...props }: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(function PopoverTrigger(props, ref) {
  return <PopoverPrimitive.Trigger ref={ref} data-slot="popover-trigger" {...props} />;
});

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(function PopoverContent({ className, align = 'center', sideOffset = 4, ...props }, ref) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 flex w-72 origin-(--radix-popover-content-transform-origin) flex-col gap-2.5 rounded-xl border border-border/70 bg-popover/95 p-2.5 text-sm text-popover-foreground shadow-xl shadow-primary/10 ring-1 ring-primary/10 backdrop-blur-xl outline-hidden transition-[opacity,transform] duration-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});

const PopoverAnchor = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Anchor>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor>
>(function PopoverAnchor(props, ref) {
  return <PopoverPrimitive.Anchor ref={ref} data-slot="popover-anchor" {...props} />;
});

const PopoverHeader = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function PopoverHeader({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="popover-header"
        className={cn('flex flex-col gap-0.5 text-sm', className)}
        {...props}
      />
    );
  },
);

const PopoverTitle = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function PopoverTitle({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="popover-title"
        className={cn('font-medium', className)}
        {...props}
      />
    );
  },
);

const PopoverDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<'p'>
>(function PopoverDescription({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      data-slot="popover-description"
      className={cn('text-muted-foreground', className)}
      {...props}
    />
  );
});

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};
