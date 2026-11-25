import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { XIcon } from 'lucide-react';
import * as SheetPrimitive from '@radix-ui/react-dialog';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/primitives/button';
import type { DialogSize } from '@/shared/ui/primitives/dialog';

export type SheetProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Root>;

export function Sheet(props: SheetProps) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

export const SheetTrigger = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Trigger>
>(function SheetTrigger(props, ref) {
  return <SheetPrimitive.Trigger ref={ref} data-slot="sheet-trigger" {...props} />;
});

export const SheetClose = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Close>
>(function SheetClose(props, ref) {
  return <SheetPrimitive.Close ref={ref} data-slot="sheet-close" {...props} />;
});

export function SheetPortal(props: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

export const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(function SheetOverlay({ className, ...props }, ref) {
  return (
    <SheetPrimitive.Overlay
      ref={ref}
      data-slot="sheet-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-150 data-[state=closed]:opacity-0 data-[state=open]:opacity-100',
        className,
      )}
      {...props}
    />
  );
});

const sheetVariants = cva(
  'fixed z-50 flex flex-col gap-4 overflow-y-auto border-border/70 bg-card/95 p-6 text-card-foreground shadow-2xl shadow-primary/10 ring-1 ring-primary/10 backdrop-blur-xl outline-none transition-transform duration-200',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0',
        right:
          'inset-y-0 right-0 h-full w-full border-l data-[state=closed]:translate-x-full data-[state=open]:translate-x-0',
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=closed]:translate-y-full data-[state=open]:translate-y-0',
        left: 'inset-y-0 left-0 h-full w-full border-r data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
        xl: '',
        full: '',
      },
    },
    compoundVariants: [
      { side: 'right', size: 'sm', className: 'max-w-sm' },
      { side: 'left', size: 'sm', className: 'max-w-sm' },
      { side: 'right', size: 'md', className: 'max-w-md' },
      { side: 'left', size: 'md', className: 'max-w-md' },
      { side: 'right', size: 'lg', className: 'max-w-lg' },
      { side: 'left', size: 'lg', className: 'max-w-lg' },
      { side: 'right', size: 'xl', className: 'max-w-2xl' },
      { side: 'left', size: 'xl', className: 'max-w-2xl' },
      { side: 'right', size: 'full', className: 'max-w-none' },
      { side: 'left', size: 'full', className: 'max-w-none' },
      { side: 'top', size: 'sm', className: 'max-h-[35dvh]' },
      { side: 'bottom', size: 'sm', className: 'max-h-[35dvh]' },
      { side: 'top', size: 'md', className: 'max-h-[50dvh]' },
      { side: 'bottom', size: 'md', className: 'max-h-[50dvh]' },
      { side: 'top', size: 'lg', className: 'max-h-[70dvh]' },
      { side: 'bottom', size: 'lg', className: 'max-h-[70dvh]' },
      { side: 'top', size: 'xl', className: 'max-h-[85dvh]' },
      { side: 'bottom', size: 'xl', className: 'max-h-[85dvh]' },
      { side: 'top', size: 'full', className: 'h-full max-h-none' },
      { side: 'bottom', size: 'full', className: 'h-full max-h-none' },
    ],
    defaultVariants: {
      side: 'right',
      size: 'md',
    },
  },
);

type SheetVariantProps = Omit<VariantProps<typeof sheetVariants>, 'size'> & {
  size?: DialogSize;
};

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>, SheetVariantProps {
  showCloseButton?: boolean;
}

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(function SheetContent(
  { children, className, side = 'right', showCloseButton = true, size = 'md', ...props },
  ref,
) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        data-slot="sheet-content"
        data-side={side}
        data-size={size}
        className={cn(sheetVariants({ className, side, size }))}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <SheetPrimitive.Close asChild data-slot="sheet-close">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute right-3 top-3 text-muted-foreground hover:text-primary"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </SheetPrimitive.Close>
        ) : null}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
});

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-2 text-left', className)}
      {...props}
    />
  );
}

export function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        'mt-auto grid grid-cols-2 gap-2 [&>*]:min-w-0 [&>*]:w-full [&>*:only-child]:col-span-2',
        className,
      )}
      {...props}
    />
  );
}

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(function SheetTitle({ className, ...props }, ref) {
  return (
    <SheetPrimitive.Title
      ref={ref}
      data-slot="sheet-title"
      className={cn('text-lg font-semibold text-foreground', className)}
      {...props}
    />
  );
});

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(function SheetDescription({ className, ...props }, ref) {
  return (
    <SheetPrimitive.Description
      ref={ref}
      data-slot="sheet-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});
