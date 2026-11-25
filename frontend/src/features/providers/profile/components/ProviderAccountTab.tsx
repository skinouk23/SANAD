import { Save } from 'lucide-react';
import type { FormEventHandler } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import { FormActions } from '@/shared/ui/composites/form-field';
import { ProfileCard, ProfilePanel } from '@/shared/ui/composites/profile-surface';
import { Button } from '@/shared/ui/primitives/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/primitives/field';
import { Input } from '@/shared/ui/primitives/input';
import { Spinner } from '@/shared/ui/primitives/spinner';
import { TunisiaPhoneInput } from '@/shared/ui/primitives/tunisia-phone-input';

import type { ProviderAccountFormValues } from '@/features/providers/schema';

interface ProviderAccountTabProps {
  idBase: string;
  email: string;
  phoneLabel: string;
  emailLabel: string;
  firstNameLabel: string;
  lastNameLabel: string;
  addressLabel: string;
  cityLabel: string;
  postalCodeLabel: string;
  title: string;
  form: UseFormReturn<ProviderAccountFormValues>;
  saving: boolean;
  saveDisabled: boolean;
  saveLabel: string;
  savingLabel: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onFieldChange: () => void;
}

export function ProviderAccountTab({
  idBase,
  email,
  phoneLabel,
  emailLabel,
  firstNameLabel,
  lastNameLabel,
  addressLabel,
  cityLabel,
  postalCodeLabel,
  title,
  form,
  saving,
  saveDisabled,
  saveLabel,
  savingLabel,
  onSubmit,
  onFieldChange,
}: ProviderAccountTabProps) {
  return (
    <ProfilePanel idBase={idBase} tabId="compte">
      <ProfileCard contentClassName="p-4 sm:p-6">
        <form onSubmit={onSubmit}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
          </div>

          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="accountEmail">{emailLabel}</FieldLabel>
              <Input id="accountEmail" readOnly type="email" value={email} />
            </Field>
            <Field data-invalid={form.formState.errors.phone ? true : undefined}>
              <FieldLabel htmlFor="accountPhone">{phoneLabel}</FieldLabel>
              <TunisiaPhoneInput
                aria-invalid={form.formState.errors.phone ? true : undefined}
                id="accountPhone"
                {...form.register('phone', {
                  onChange: onFieldChange,
                })}
              />
              <FieldError>{form.formState.errors.phone?.message}</FieldError>
            </Field>
            <Field data-invalid={form.formState.errors.firstName ? true : undefined}>
              <FieldLabel htmlFor="accountFirstName">{firstNameLabel}</FieldLabel>
              <Input
                aria-invalid={form.formState.errors.firstName ? true : undefined}
                id="accountFirstName"
                {...form.register('firstName', { onChange: onFieldChange })}
              />
              <FieldError>{form.formState.errors.firstName?.message}</FieldError>
            </Field>
            <Field data-invalid={form.formState.errors.lastName ? true : undefined}>
              <FieldLabel htmlFor="accountLastName">{lastNameLabel}</FieldLabel>
              <Input
                aria-invalid={form.formState.errors.lastName ? true : undefined}
                id="accountLastName"
                {...form.register('lastName', { onChange: onFieldChange })}
              />
              <FieldError>{form.formState.errors.lastName?.message}</FieldError>
            </Field>
            <Field data-invalid={form.formState.errors.city ? true : undefined}>
              <FieldLabel htmlFor="accountCity">{cityLabel}</FieldLabel>
              <Input
                aria-invalid={form.formState.errors.city ? true : undefined}
                id="accountCity"
                {...form.register('city', { onChange: onFieldChange })}
              />
              <FieldError>{form.formState.errors.city?.message}</FieldError>
            </Field>
            <Field data-invalid={form.formState.errors.postalCode ? true : undefined}>
              <FieldLabel htmlFor="accountPostalCode">{postalCodeLabel}</FieldLabel>
              <Input
                aria-invalid={form.formState.errors.postalCode ? true : undefined}
                id="accountPostalCode"
                {...form.register('postalCode', { onChange: onFieldChange })}
              />
              <FieldError>{form.formState.errors.postalCode?.message}</FieldError>
            </Field>
            <Field
              className="md:col-span-2"
              data-invalid={form.formState.errors.address ? true : undefined}
            >
              <FieldLabel htmlFor="accountAddress">{addressLabel}</FieldLabel>
              <Input
                aria-invalid={form.formState.errors.address ? true : undefined}
                id="accountAddress"
                {...form.register('address', { onChange: onFieldChange })}
              />
              <FieldError>{form.formState.errors.address?.message}</FieldError>
            </Field>
          </FieldGroup>

          <FormActions className="mt-4 flex justify-end border-t border-slate-200 pt-4 dark:border-slate-700 [&>*]:w-auto [&>*:only-child]:col-span-1">
            <Button
              className="w-auto rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 text-white hover:opacity-90"
              disabled={saveDisabled || saving}
              aria-busy={saving || undefined}
              type="submit"
            >
              {saving ? <Spinner data-icon="inline-start" /> : <Save className="h-4 w-4" />}
              {saving ? savingLabel : saveLabel}
            </Button>
          </FormActions>
        </form>
      </ProfileCard>
    </ProfilePanel>
  );
}
