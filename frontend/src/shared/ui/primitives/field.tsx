import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';
import { Label } from '@/shared/ui/primitives/label';
import { Separator } from '@/shared/ui/primitives/separator';

const FieldSet = React.forwardRef<HTMLFieldSetElement, React.ComponentPropsWithoutRef<'fieldset'>>(
  function FieldSet({ className, ...props }, ref) {
    return (
      <fieldset
        ref={ref}
        data-slot="field-set"
        className={cn(
          'flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
          className,
        )}
        {...props}
      />
    );
  },
);

const FieldLegend = React.forwardRef<
  HTMLLegendElement,
  React.ComponentPropsWithoutRef<'legend'> & { variant?: 'legend' | 'label' }
>(function FieldLegend({ className, variant = 'legend', ...props }, ref) {
  return (
    <legend
      ref={ref}
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        'mb-1.5 font-semibold text-foreground data-[variant=label]:text-sm data-[variant=legend]:text-base',
        className,
      )}
      {...props}
    />
  );
});

const FieldGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function FieldGroup({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="field-group"
        className={cn(
          'group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4',
          className,
        )}
        {...props}
      />
    );
  },
);

const fieldVariants = cva('group/field flex w-full gap-2 data-[invalid=true]:text-destructive', {
  variants: {
    orientation: {
      vertical: 'flex-col *:w-full [&>.sr-only]:w-auto',
      horizontal:
        'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      responsive:
        'flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

const Field = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & VariantProps<typeof fieldVariants>
>(function Field({ className, orientation = 'vertical', ...props }, ref) {
  return (
    <div
      ref={ref}
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
});

const FieldContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function FieldContent({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="field-content"
        className={cn('group/field-content flex flex-1 flex-col gap-0.5 leading-snug', className)}
        {...props}
      />
    );
  },
);

const FieldLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(function FieldLabel({ className, ...props }, ref) {
  return (
    <Label
      ref={ref}
      data-slot="field-label"
      className={cn(
        'group/field-label peer/field-label flex w-fit gap-2 text-sm font-medium leading-snug text-foreground group-data-[disabled=true]/field:opacity-50 group-data-[invalid=true]/field:text-destructive has-data-checked:border-primary/30 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5',
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
        className,
      )}
      {...props}
    />
  );
});

const FieldTitle = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function FieldTitle({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="field-label"
        className={cn(
          'flex w-fit items-center gap-2 text-sm font-medium text-foreground group-data-[disabled=true]/field:opacity-50 group-data-[invalid=true]/field:text-destructive',
          className,
        )}
        {...props}
      />
    );
  },
);

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<'p'>
>(function FieldDescription({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      data-slot="field-description"
      className={cn(
        'text-left text-sm font-normal leading-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5',
        'last:mt-0 nth-last-2:-mt-1',
        '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
        className,
      )}
      {...props}
    />
  );
});

const FieldSeparator = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function FieldSeparator({ children, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="field-separator"
        data-content={!!children}
        className={cn(
          'relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2',
          className,
        )}
        {...props}
      >
        <Separator className="absolute inset-0 top-1/2" />
        {children ? (
          <span
            className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
            data-slot="field-separator-content"
          >
            {children}
          </span>
        ) : null}
      </div>
    );
  },
);

type FieldErrorProps = React.ComponentPropsWithoutRef<'div'> & {
  errors?: Array<{ message?: string } | undefined>;
};

const FieldError = React.forwardRef<HTMLDivElement, FieldErrorProps>(function FieldError(
  { className, children, errors, ...props },
  ref,
) {
  const content = React.useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()];

    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map((error, index) =>
          error?.message ? <li key={index}>{error.message}</li> : null,
        )}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <div
      ref={ref}
      role="alert"
      data-slot="field-error"
      className={cn('text-sm font-normal text-destructive', className)}
      {...props}
    >
      {content}
    </div>
  );
});

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
};
