import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/shared/ui/primitives/field';

export interface FormFieldProps {
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  label?: React.ReactNode;
  htmlFor?: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  labelClassName?: string;
  messageClassName?: string;
  required?: boolean;
}

function getFieldMessageIds(fieldId: string) {
  return {
    errorId: `${fieldId}-error`,
    hintId: `${fieldId}-hint`,
  };
}

export interface FormFieldLabelProps extends React.ComponentPropsWithoutRef<typeof FieldLabel> {
  required?: boolean;
}

export function FormFieldLabel({ children, className, required, ...props }: FormFieldLabelProps) {
  return (
    <FieldLabel
      className={cn(
        'text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
      {required ? <span className="ml-1 text-destructive">*</span> : null}
    </FieldLabel>
  );
}

export function FormFieldContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof FieldContent>) {
  return <FieldContent className={cn('gap-1.5', className)} {...props} />;
}

export interface FormFieldHelpProps extends React.ComponentPropsWithoutRef<
  typeof FieldDescription
> {
  tone?: 'default' | 'muted';
}

export function FormFieldHelp({
  children,
  className,
  tone = 'muted',
  ...props
}: FormFieldHelpProps) {
  if (!children) {
    return null;
  }

  return (
    <FieldDescription
      className={cn(
        'text-xs',
        tone === 'default' ? 'text-foreground' : 'text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </FieldDescription>
  );
}

export type FormFieldErrorProps = React.ComponentPropsWithoutRef<typeof FieldError>;

export function FormFieldError({ className, children, errors, ...props }: FormFieldErrorProps) {
  if (!children && !errors?.length) {
    return null;
  }

  return (
    <FieldError className={cn('text-xs', className)} errors={errors} {...props}>
      {children}
    </FieldError>
  );
}

function getDirectFieldElement(children: React.ReactNode) {
  return React.isValidElement<Record<string, unknown>>(children) ? children : null;
}

export function FormField({
  children,
  className,
  contentClassName,
  error,
  hint,
  htmlFor,
  label,
  labelClassName,
  messageClassName,
  required,
}: FormFieldProps) {
  const reactId = React.useId();
  const fieldElement = getDirectFieldElement(children);
  const childId = typeof fieldElement?.props.id === 'string' ? fieldElement.props.id : undefined;
  const fieldId = htmlFor ?? childId ?? reactId;
  const { errorId, hintId } = getFieldMessageIds(fieldId);

  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
  const child = fieldElement
    ? React.cloneElement(fieldElement, {
        id: fieldElement.props.id ?? fieldId,
        'aria-describedby':
          [fieldElement.props['aria-describedby'], describedBy].filter(Boolean).join(' ') ||
          undefined,
        'aria-invalid': error ? true : undefined,
      } as Record<string, unknown>)
    : children;

  return (
    <Field className={cn('gap-1.5', className)} data-invalid={error ? true : undefined}>
      {label ? (
        <FormFieldLabel htmlFor={fieldId} className={labelClassName} required={required}>
          {label}
        </FormFieldLabel>
      ) : null}

      <FormFieldContent className={contentClassName}>{child}</FormFieldContent>

      {hint ? (
        <FormFieldHelp className={messageClassName} id={hintId}>
          {hint}
        </FormFieldHelp>
      ) : null}
      {error ? (
        <FormFieldError aria-live="polite" className={messageClassName} id={errorId}>
          {error}
        </FormFieldError>
      ) : null}
    </Field>
  );
}

export function FormActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 pt-2 [&>*]:min-w-0 [&>*]:w-full [&>*:only-child]:col-span-2',
        className,
      )}
      {...props}
    />
  );
}

export interface FormSectionProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  description?: React.ReactNode;
  legend?: React.ReactNode;
}

export function FormSection({
  children,
  className,
  description,
  legend,
  ...props
}: FormSectionProps) {
  return (
    <FieldSet className={cn('gap-4', className)} {...props}>
      {legend ? (
        <FieldLegend className="mb-1.5 text-sm font-semibold text-foreground">{legend}</FieldLegend>
      ) : description ? (
        <FormFieldHelp>{description}</FormFieldHelp>
      ) : null}
      {legend && description ? <FormFieldHelp>{description}</FormFieldHelp> : null}
      {children}
    </FieldSet>
  );
}

export interface FormStatusMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'error' | 'info' | 'warning' | 'success';
}

const formStatusToneClassNames = {
  error: 'border-destructive/30 bg-destructive/10 text-destructive',
  info: 'border-border bg-muted/40 text-foreground',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  success: 'border-success/30 bg-success/10 text-success',
} as const;

export function FormStatusMessage({
  children,
  className,
  tone = 'error',
  ...props
}: FormStatusMessageProps) {
  return (
    <div
      className={cn(
        'rounded-lg border px-3 py-2 text-sm',
        formStatusToneClassNames[tone],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
