import * as React from 'react';

import { cn } from '@/shared/lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-24 w-full rounded-lg border border-border bg-input px-3 py-2 text-base text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 read-only:cursor-default read-only:bg-muted/50 read-only:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-[invalid]:border-destructive data-[invalid]:ring-2 data-[invalid]:ring-destructive/20 data-[invalid=true]:border-destructive data-[invalid=true]:ring-2 data-[invalid=true]:ring-destructive/20 md:text-sm',
        className,
      )}
      {...props}
    />
  );
});
