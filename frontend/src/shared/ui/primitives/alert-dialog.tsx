import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/primitives/button';
import type { DialogSize } from '@/shared/ui/primitives/dialog';

type ButtonVariantProps = Pick<React.ComponentProps<typeof Button>, 'size' | 'variant'>;
type AlertDialogSize = DialogSize | 'default';

const alertDialogSizeClasses: Record<AlertDialogSize, string> = {
  default: 'max-w-sm',
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'h-[calc(100dvh-2rem)] max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] overflow-y-auto sm:max-w-[calc(100vw-2rem)]',
};

export function AlertDialog(
  props: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root>,
) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

export const AlertDialogTrigger = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>
>(function AlertDialogTrigger(props, ref) {
  return <AlertDialogPrimitive.Trigger ref={ref} data-slot="alert-dialog-trigger" {...props} />;
});

export function AlertDialogPortal(
  props: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Portal>,
) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
}

export const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(function AlertDialogOverlay({ className, ...props }, ref) {
  return (
    <AlertDialogPrimitive.Overlay
      ref={ref}
      data-slot="alert-dialog-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-150 data-[state=closed]:opacity-0 data-[state=open]:opacity-100',
        className,
      )}
      {...props}
    />
  );
});

export interface AlertDialogContentProps extends React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Content
> {
  size?: AlertDialogSize;
}

export const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(function AlertDialogContent({ className, size = 'default', ...props }, ref) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          'fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-2xl border border-border/70 bg-card/95 p-4 text-card-foreground shadow-2xl shadow-primary/10 ring-1 ring-primary/10 backdrop-blur-xl outline-none transition-[opacity,transform] duration-150 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100 sm:w-full',
          alertDialogSizeClasses[size],
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
});

export function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn('grid gap-1.5 text-center sm:text-left', className)}
      {...props}
    />
  );
}

export function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        '-mx-4 -mb-4 grid grid-cols-2 gap-2 rounded-b-2xl border-t border-border/70 bg-muted/40 p-4 shadow-[inset_0_1px_0_rgb(34_211_238_/_0.12)] backdrop-blur-md [&>*]:min-w-0 [&>*]:w-full [&>*:only-child]:col-span-2',
        className,
      )}
      {...props}
    />
  );
}

export function AlertDialogMedia({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        'mx-auto mb-2 inline-flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-sm shadow-primary/10 sm:mx-0',
        className,
      )}
      {...props}
    />
  );
}

export const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(function AlertDialogTitle({ className, ...props }, ref) {
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      data-slot="alert-dialog-title"
      className={cn('text-base font-semibold text-foreground', className)}
      {...props}
    />
  );
});

export const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(function AlertDialogDescription({ className, ...props }, ref) {
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      data-slot="alert-dialog-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});

export const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> & ButtonVariantProps
>(function AlertDialogAction({ className, size = 'default', variant = 'default', ...props }, ref) {
  return (
    <Button asChild size={size} variant={variant}>
      <AlertDialogPrimitive.Action
        ref={ref}
        data-slot="alert-dialog-action"
        className={cn(className)}
        {...props}
      />
    </Button>
  );
});

export const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> & ButtonVariantProps
>(function AlertDialogCancel({ className, size = 'default', variant = 'outline', ...props }, ref) {
  return (
    <Button asChild size={size} variant={variant}>
      <AlertDialogPrimitive.Cancel
        ref={ref}
        data-slot="alert-dialog-cancel"
        className={cn(className)}
        {...props}
      />
    </Button>
  );
});
