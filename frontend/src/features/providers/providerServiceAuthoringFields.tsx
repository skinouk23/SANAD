import { Clock, DollarSign } from 'lucide-react';
import { Controller, type FieldErrors, type UseFormReturn } from 'react-hook-form';
import { cn } from '@/shared/lib/utils';
import { Checkbox } from '@/shared/ui/primitives/checkbox';
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/ui/primitives/field';
import { Input } from '@/shared/ui/primitives/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/shared/ui/primitives/input-group';
import { Textarea } from '@/shared/ui/primitives/textarea';
import type { ServiceAuthoringField } from './providerAuthoringConfig';
import type { ProviderServiceFormValues } from './providerServiceForm.helpers';

function getFieldErrorMessage(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  if ('message' in error && typeof error.message === 'string') {
    return error.message;
  }

  return undefined;
}

const EMPTY_SERVICE_SELECT_VALUE = '__empty_service_select__';

function ProviderServiceCheckboxField({
  error,
  field,
  form,
}: {
  error?: string;
  field: ServiceAuthoringField;
  form: UseFormReturn<ProviderServiceFormValues>;
}) {
  return (
    <Field
      className="items-start gap-2 py-1 text-sm text-foreground"
      data-invalid={error ? true : undefined}
      orientation="horizontal"
    >
      <Controller
        control={form.control}
        name={field.id}
        render={({ field: controllerField }) => (
          <>
            <Checkbox
              aria-invalid={Boolean(error) || undefined}
              checked={controllerField.value === true}
              id={field.id}
              onBlur={controllerField.onBlur}
              onCheckedChange={(value) => controllerField.onChange(value === true)}
              ref={controllerField.ref}
            />
            <FieldContent>
              <FieldLabel className="cursor-pointer" htmlFor={field.id}>
                {field.label}
              </FieldLabel>
              <FieldError>{error}</FieldError>
            </FieldContent>
          </>
        )}
      />
    </Field>
  );
}

function ProviderServiceMultiSelectField({
  error,
  field,
  form,
}: {
  error?: string;
  field: ServiceAuthoringField;
  form: UseFormReturn<ProviderServiceFormValues>;
}) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel>
        {field.label}
        {field.required ? <span className="ml-1 text-destructive">*</span> : null}
      </FieldLabel>
      <Controller
        control={form.control}
        name={field.id}
        render={({ field: controllerField }) => {
          const selectedValues = Array.isArray(controllerField.value) ? controllerField.value : [];

          return (
            <FieldGroup className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {field.options?.map((option) => {
                const checked = selectedValues.includes(option.value);
                const optionId = `${field.id}-${option.value}`.replace(/[^a-zA-Z0-9_-]/g, '-');

                return (
                  <Field
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
                      checked
                        ? 'border-ring bg-accent text-foreground'
                        : 'border-border bg-card text-foreground hover:border-border-strong',
                    )}
                    data-invalid={error ? true : undefined}
                    key={option.value}
                    orientation="horizontal"
                  >
                    <Checkbox
                      aria-invalid={Boolean(error) || undefined}
                      checked={checked}
                      id={optionId}
                      onCheckedChange={(value) => {
                        const nextChecked = value === true;

                        controllerField.onChange(
                          nextChecked
                            ? Array.from(new Set([...selectedValues, option.value]))
                            : selectedValues.filter((value) => value !== option.value),
                        );
                      }}
                    />
                    <FieldLabel
                      className="min-w-0 flex-1 cursor-pointer truncate"
                      htmlFor={optionId}
                    >
                      {option.label}
                    </FieldLabel>
                  </Field>
                );
              })}
            </FieldGroup>
          );
        }}
      />
      <FieldError>{error}</FieldError>
    </Field>
  );
}

function ProviderServiceTextareaField({
  error,
  field,
  form,
}: {
  error?: string;
  field: ServiceAuthoringField;
  form: UseFormReturn<ProviderServiceFormValues>;
}) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={field.id}>
        {field.label}
        {field.required ? <span className="ml-1 text-destructive">*</span> : null}
      </FieldLabel>
      <Textarea
        aria-invalid={Boolean(error) || undefined}
        id={field.id}
        placeholder={field.placeholder}
        rows={3}
        {...form.register(field.id)}
        className="resize-none"
      />
      <FieldError>{error}</FieldError>
    </Field>
  );
}

function ProviderServiceSelectField({
  error,
  field,
  form,
  includeEmptyOption,
}: {
  error?: string;
  field: ServiceAuthoringField;
  form: UseFormReturn<ProviderServiceFormValues>;
  includeEmptyOption: boolean;
}) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={field.id}>
        {field.label}
        {field.required ? <span className="ml-1 text-destructive">*</span> : null}
      </FieldLabel>
      <Controller
        control={form.control}
        name={field.id}
        render={({ field: controllerField }) => {
          const currentValue = String(controllerField.value ?? '');

          return (
            <Select
              name={controllerField.name}
              onValueChange={(value) => {
                controllerField.onChange(value === EMPTY_SERVICE_SELECT_VALUE ? '' : value);
              }}
              value={
                includeEmptyOption && !currentValue ? EMPTY_SERVICE_SELECT_VALUE : currentValue
              }
            >
              <SelectTrigger
                aria-invalid={Boolean(error) || undefined}
                className="w-full"
                id={field.id}
                onBlur={controllerField.onBlur}
                ref={controllerField.ref}
              >
                <SelectValue placeholder="Sélectionnez une option" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {includeEmptyOption ? (
                    <SelectItem value={EMPTY_SERVICE_SELECT_VALUE}>
                      Sélectionnez une option
                    </SelectItem>
                  ) : null}
                  {field.options
                    ?.filter((option) => option.value !== '' || !includeEmptyOption)
                    .map((option) => (
                      <SelectItem
                        key={option.value || `${EMPTY_SERVICE_SELECT_VALUE}-${option.label}`}
                        value={option.value || EMPTY_SERVICE_SELECT_VALUE}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          );
        }}
      />
      <FieldError>{error}</FieldError>
    </Field>
  );
}

function ProviderServiceInputField({
  error,
  field,
  form,
}: {
  error?: string;
  field: ServiceAuthoringField;
  form: UseFormReturn<ProviderServiceFormValues>;
}) {
  const AdornmentIcon = field.id.toLowerCase().includes('price')
    ? DollarSign
    : field.id.toLowerCase().includes('duration')
      ? Clock
      : null;

  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={field.id}>
        {field.label}
        {field.required ? <span className="ml-1 text-destructive">*</span> : null}
      </FieldLabel>
      {AdornmentIcon ? (
        <InputGroup data-invalid={error ? true : undefined}>
          <InputGroupAddon>
            <AdornmentIcon />
          </InputGroupAddon>
          <InputGroupInput
            aria-invalid={Boolean(error) || undefined}
            id={field.id}
            placeholder={field.placeholder}
            type={field.type === 'number' ? 'number' : 'text'}
            {...form.register(field.id)}
          />
        </InputGroup>
      ) : (
        <Input
          aria-invalid={Boolean(error) || undefined}
          id={field.id}
          placeholder={field.placeholder}
          type={field.type === 'number' ? 'number' : 'text'}
          {...form.register(field.id)}
        />
      )}
      <FieldError>{error}</FieldError>
    </Field>
  );
}

export function ProviderServiceAuthoringFields({
  fields,
  form,
  includeEmptyOption = true,
}: {
  fields: ServiceAuthoringField[];
  form: UseFormReturn<ProviderServiceFormValues>;
  includeEmptyOption?: boolean;
}) {
  return (
    <FieldGroup className="gap-4">
      {fields.map((field) => {
        const error = getFieldErrorMessage((form.formState.errors as FieldErrors)[field.id]);

        if (field.type === 'checkbox') {
          return (
            <ProviderServiceCheckboxField error={error} field={field} form={form} key={field.id} />
          );
        }

        if (field.type === 'multiselect' && field.options) {
          return (
            <ProviderServiceMultiSelectField
              error={error}
              field={field}
              form={form}
              key={field.id}
            />
          );
        }

        if (field.type === 'textarea') {
          return (
            <ProviderServiceTextareaField error={error} field={field} form={form} key={field.id} />
          );
        }

        if (field.type === 'select' && field.options) {
          return (
            <ProviderServiceSelectField
              error={error}
              field={field}
              form={form}
              includeEmptyOption={includeEmptyOption}
              key={field.id}
            />
          );
        }

        return <ProviderServiceInputField error={error} field={field} form={form} key={field.id} />;
      })}
    </FieldGroup>
  );
}
