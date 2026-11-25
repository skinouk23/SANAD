import { forwardRef, useId } from 'react';
import type {
  ChangeEvent,
  FocusEventHandler,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Checkbox } from '@/shared/ui/primitives/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/shared/ui/primitives/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/shared/ui/primitives/input-group';
import { TunisiaPhoneInput } from '@/shared/ui/primitives/tunisia-phone-input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';

const authControlClassName = 'h-11 rounded-xl data-[size=default]:h-11';

const authLabelClassName =
  'text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground';

const authMessageClassName = 'text-xs';

const AUTH_SELECT_EMPTY_VALUE = '__auth_select_empty__';

interface AuthBaseFieldProps {
  className?: string;
  contentClassName?: string;
  error?: ReactNode;
  hint?: ReactNode;
  label?: ReactNode;
  labelClassName?: string;
  messageClassName?: string;
  required?: boolean;
  icon?: ReactNode;
  endAdornment?: ReactNode;
}

function getMessageIds(fieldId: string) {
  return {
    errorId: `${fieldId}-error`,
    hintId: `${fieldId}-hint`,
  };
}

function mergeDescribedBy(
  current: InputHTMLAttributes<HTMLInputElement>['aria-describedby'],
  ...ids: Array<string | false | undefined>
) {
  return [current, ...ids].filter(Boolean).join(' ') || undefined;
}

function RequiredIndicator({ required }: { required?: boolean }) {
  return required ? <span className="ml-1 text-destructive">*</span> : null;
}

interface AuthInputFieldProps
  extends AuthBaseFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {}

export const AuthInputField = forwardRef<HTMLInputElement, AuthInputFieldProps>(
  function AuthInputField(
    {
      className,
      contentClassName,
      endAdornment,
      error,
      hint,
      icon,
      label,
      labelClassName,
      messageClassName,
      required,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const fieldId = props.id ?? generatedId;
    const { errorId, hintId } = getMessageIds(fieldId);

    return (
      <Field className={className} data-invalid={error ? true : undefined}>
        {label ? (
          <FieldLabel className={cn(authLabelClassName, labelClassName)} htmlFor={fieldId}>
            {label}
            <RequiredIndicator required={required} />
          </FieldLabel>
        ) : null}
        <InputGroup className={cn(authControlClassName, contentClassName)}>
          {props.type === 'tel' ? (
            <TunisiaPhoneInput
              {...props}
              ref={ref}
              aria-describedby={mergeDescribedBy(
                props['aria-describedby'],
                hint ? hintId : undefined,
                error ? errorId : undefined,
              )}
              aria-invalid={error ? true : props['aria-invalid']}
              id={fieldId}
              inputVariant="group"
            />
          ) : (
            <InputGroupInput
              {...props}
              ref={ref}
              aria-describedby={mergeDescribedBy(
                props['aria-describedby'],
                hint ? hintId : undefined,
                error ? errorId : undefined,
              )}
              aria-invalid={error ? true : props['aria-invalid']}
              id={fieldId}
            />
          )}
          {icon ? (
            <InputGroupAddon
              align="inline-start"
              className="text-muted-foreground transition-colors group-focus-within/input-group:text-primary"
            >
              {icon}
            </InputGroupAddon>
          ) : null}
          {endAdornment ? (
            <InputGroupAddon align="inline-end">{endAdornment}</InputGroupAddon>
          ) : null}
        </InputGroup>
        {hint ? (
          <FieldDescription className={cn(authMessageClassName, messageClassName)} id={hintId}>
            {hint}
          </FieldDescription>
        ) : null}
        {error ? (
          <FieldError
            aria-live="polite"
            className={cn(authMessageClassName, messageClassName)}
            id={errorId}
          >
            {error}
          </FieldError>
        ) : null}
      </Field>
    );
  },
);

interface AuthSelectFieldProps
  extends AuthBaseFieldProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: Array<{ label: string; value: string }>;
  size?: 'sm' | 'default';
}

function toAuthSelectValue(value: AuthSelectFieldProps['value'] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ? String(value[0]) : AUTH_SELECT_EMPTY_VALUE;
  }

  if (value == null) {
    return undefined;
  }

  return String(value) || AUTH_SELECT_EMPTY_VALUE;
}

export const AuthSelectField = forwardRef<HTMLButtonElement, AuthSelectFieldProps>(
  function AuthSelectField(
    {
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      className,
      contentClassName,
      defaultValue,
      disabled,
      error,
      hint,
      icon,
      id,
      label,
      labelClassName,
      messageClassName,
      name,
      onBlur,
      onChange,
      options,
      required,
      value,
    },
    ref,
  ) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const { errorId, hintId } = getMessageIds(fieldId);
    const selectValue = toAuthSelectValue(value);
    const selectDefaultValue = toAuthSelectValue(defaultValue);
    const placeholder =
      options.find((option) => option.value === '')?.label ??
      (typeof label === 'string' ? label : undefined);
    const handleBlur = onBlur as unknown as FocusEventHandler<HTMLButtonElement> | undefined;

    const handleValueChange = (nextValue: string) => {
      const mappedValue = nextValue === AUTH_SELECT_EMPTY_VALUE ? '' : nextValue;

      onChange?.({
        target: { name, value: mappedValue },
        currentTarget: { name, value: mappedValue },
      } as ChangeEvent<HTMLSelectElement>);
    };

    return (
      <Field className={className} data-invalid={error ? true : undefined}>
        {label ? (
          <FieldLabel className={cn(authLabelClassName, labelClassName)} htmlFor={fieldId}>
            {label}
            <RequiredIndicator required={required} />
          </FieldLabel>
        ) : null}
        <Select
          defaultValue={selectValue === undefined ? selectDefaultValue : undefined}
          name={name}
          onValueChange={handleValueChange}
          required={required}
          value={selectValue}
        >
          <SelectTrigger
            ref={ref}
            aria-describedby={mergeDescribedBy(
              ariaDescribedBy,
              hint ? hintId : undefined,
              error ? errorId : undefined,
            )}
            aria-invalid={error ? true : ariaInvalid}
            className={cn(authControlClassName, 'w-full', contentClassName)}
            disabled={disabled}
            id={fieldId}
            name={name}
            onBlur={handleBlur}
          >
            {icon ? (
              <span
                aria-hidden="true"
                className="text-muted-foreground transition-colors group-focus-within/field:text-primary"
              >
                {icon}
              </span>
            ) : null}
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((option) => (
                <SelectItem
                  key={option.value || AUTH_SELECT_EMPTY_VALUE}
                  value={option.value || AUTH_SELECT_EMPTY_VALUE}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {hint ? (
          <FieldDescription className={cn(authMessageClassName, messageClassName)} id={hintId}>
            {hint}
          </FieldDescription>
        ) : null}
        {error ? (
          <FieldError
            aria-live="polite"
            className={cn(authMessageClassName, messageClassName)}
            id={errorId}
          >
            {error}
          </FieldError>
        ) : null}
      </Field>
    );
  },
);

interface AuthCheckboxFieldProps extends Omit<AuthBaseFieldProps, 'endAdornment' | 'icon'> {
  checked: boolean;
  id: string;
  onCheckedChange: (checked: boolean) => void;
}

export function AuthCheckboxField({
  checked,
  className,
  contentClassName,
  error,
  hint,
  id,
  label,
  labelClassName,
  messageClassName,
  onCheckedChange,
  required,
}: AuthCheckboxFieldProps) {
  const { errorId, hintId } = getMessageIds(id);

  return (
    <Field className={className} data-invalid={error ? true : undefined} orientation="horizontal">
      <Checkbox
        aria-describedby={mergeDescribedBy(
          undefined,
          hint ? hintId : undefined,
          error ? errorId : undefined,
        )}
        aria-invalid={error ? true : undefined}
        checked={checked}
        className="mt-1"
        id={id}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      <FieldContent className={contentClassName}>
        <FieldLabel
          className={cn('text-sm leading-6 text-muted-foreground', labelClassName)}
          htmlFor={id}
        >
          {label}
          <RequiredIndicator required={required} />
        </FieldLabel>
        {hint ? (
          <FieldDescription className={cn(authMessageClassName, messageClassName)} id={hintId}>
            {hint}
          </FieldDescription>
        ) : null}
        {error ? (
          <FieldError
            aria-live="polite"
            className={cn(authMessageClassName, messageClassName)}
            id={errorId}
          >
            {error}
          </FieldError>
        ) : null}
      </FieldContent>
    </Field>
  );
}

interface PasswordStrengthMeterProps {
  empty: boolean;
  score: number;
}

export function PasswordStrengthMeter({ empty, score }: PasswordStrengthMeterProps) {
  if (empty) {
    return null;
  }

  const getBarClassName = (level: number) => {
    if (level > score) {
      return 'bg-muted';
    }

    if (score <= 1) {
      return 'bg-destructive';
    }

    if (score === 2) {
      return 'bg-warning';
    }

    if (score === 3) {
      return 'bg-success';
    }

    return 'bg-success';
  };

  return (
    <div className="mt-2 flex gap-1">
      {[1, 2, 3, 4].map((level) => (
        <div
          key={level}
          className={cn('h-1 flex-1 rounded-full transition-colors', getBarClassName(level))}
        />
      ))}
    </div>
  );
}

interface PasswordToggleProps {
  visible: boolean;
  onToggle: () => void;
}

export function PasswordToggle({ onToggle, visible }: PasswordToggleProps) {
  return (
    <InputGroupButton
      aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
      className="size-10 text-muted-foreground hover:text-primary sm:size-8"
      onClick={onToggle}
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      {visible ? <EyeOff /> : <Eye />}
    </InputGroupButton>
  );
}
