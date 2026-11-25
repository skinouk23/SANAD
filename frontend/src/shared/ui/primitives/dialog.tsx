import * as React from 'react';
import { XIcon } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/primitives/button';

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type DialogScroll = 'none' | 'content' | 'body';
export type DialogProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;
export type DialogContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
  size?: DialogSize;
  scroll?: DialogScroll;
};

const dialogSizeClasses: Record<DialogSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'h-[calc(100dvh-2rem)] max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-2rem)]',
};

export function Dialog(props: DialogProps) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

export const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(function DialogTrigger(props, ref) {
  return <DialogPrimitive.Trigger ref={ref} data-slot="dialog-trigger" {...props} />;
});

export function DialogPortal(props: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

export const DialogClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(function DialogClose(props, ref) {
  return <DialogPrimitive.Close ref={ref} data-slot="dialog-close" {...props} />;
});

export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DialogOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      data-slot="dialog-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-150 data-[state=closed]:opacity-0 data-[state=open]:opacity-100',
        className,
      )}
      {...props}
    />
  );
});

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(function DialogContent(
  { children, className, scroll = 'none', showCloseButton = true, size = 'md', ...props },
  ref,
) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        data-slot="dialog-content"
        data-size={size}
        data-scroll={scroll}
        className={cn(
          'group/dialog-content fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-2xl border border-border/70 bg-card/95 p-6 text-card-foreground shadow-2xl shadow-primary/10 ring-1 ring-primary/10 backdrop-blur-xl outline-none transition-[opacity,transform] duration-150 data-[scroll=body]:max-h-[calc(100dvh-2rem)] data-[scroll=body]:overflow-y-auto data-[scroll=content]:max-h-[calc(100dvh-2rem)] data-[scroll=content]:overflow-hidden data-[scroll=content]:flex data-[scroll=content]:flex-col data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100 sm:w-full',
          dialogSizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close asChild data-slot="dialog-close">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute right-3 top-3 text-muted-foreground hover:text-primary"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        'flex flex-col gap-2 text-left group-data-[scroll=content]/dialog-content:shrink-0',
        className,
      )}
      {...props}
    />
  );
}

export function DialogBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-body"
      className={cn(
        'min-h-0 group-data-[scroll=content]/dialog-content:overflow-y-auto',
        className,
      )}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'mt-6 grid grid-cols-2 gap-2 group-data-[scroll=content]/dialog-content:shrink-0 [&>*]:min-w-0 [&>*]:w-full [&>*:only-child]:col-span-2',
        className,
      )}
      {...props}
    />
  );
}

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      data-slot="dialog-title"
      className={cn('text-lg font-semibold text-foreground', className)}
      {...props}
    />
  );
});

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      data-slot="dialog-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});
