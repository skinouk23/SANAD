import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/shared/lib/utils';

const badgeVariants = cva(
  'group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-semibold whitespace-nowrap shadow-sm backdrop-blur-md transition-[background-color,border-color,color,box-shadow] duration-200 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default:
          'border-primary/30 bg-primary/15 text-primary shadow-primary/10 hover:bg-primary/20',
        secondary:
          'border-border/80 bg-secondary/90 text-secondary-foreground hover:bg-accent hover:text-foreground',
        destructive:
          'border-destructive/25 bg-destructive/10 text-destructive shadow-destructive/10 hover:bg-destructive/15',
        outline:
          'border-border bg-card/70 text-foreground hover:border-primary/30 hover:bg-accent hover:text-primary',
        selected:
          'border-primary/40 bg-primary/20 text-primary shadow-primary/10 hover:bg-primary/25',
        success: 'border-success/25 bg-success/10 text-success hover:bg-success/15',
        warning: 'border-warning/25 bg-warning/10 text-warning hover:bg-warning/15',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { asChild = false, children, className, icon, variant = 'default', ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      ref={ref}
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {icon ? (
        <span
          data-icon="inline-start"
          data-slot="badge-icon"
          className="inline-flex shrink-0 items-center"
        >
          {icon}
        </span>
      ) : null}
      {children}
    </Comp>
  );
});

// eslint-disable-next-line react-refresh/only-export-components
export { badgeVariants };
