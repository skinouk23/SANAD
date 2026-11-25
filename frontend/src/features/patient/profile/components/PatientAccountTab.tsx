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

import type { PatientAccountFormValues } from '@/features/family-circle/schema';

interface PatientAccountTabProps {
  idBase: string;
  email: string;
  emailLabel: string;
  firstNameLabel: string;
  lastNameLabel: string;
  addressLabel: string;
  cityLabel: string;
  postalCodeLabel: string;
  phoneLabel: string;
  title: string;
  description: string;
  form: UseFormReturn<PatientAccountFormValues>;
  saving: boolean;
  saveDisabled: boolean;
  saveLabel: string;
  savingLabel: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onFieldChange: () => void;
}

export function PatientAccountTab({
  idBase,
  email,
  emailLabel,
  firstNameLabel,
  lastNameLabel,
  addressLabel,
  cityLabel,
  postalCodeLabel,
  phoneLabel,
  title,
  description,
  form,
  saving,
  saveDisabled,
  saveLabel,
  savingLabel,
  onSubmit,
  onFieldChange,
}: PatientAccountTabProps) {
  return (
    <ProfilePanel idBase={idBase} tabId="compte">
      <ProfileCard contentClassName="p-4 sm:p-6">
        <form onSubmit={onSubmit}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
            </div>
          </div>

          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field data-invalid={form.formState.errors.firstName ? true : undefined}>
              <FieldLabel htmlFor="patientAccountFirstName">{firstNameLabel}</FieldLabel>
              <Input
                aria-invalid={form.formState.errors.firstName ? true : undefined}
                id="patientAccountFirstName"
                {...form.register('firstName', {
                  onChange: onFieldChange,
                })}
              />
              <FieldError>{form.formState.errors.firstName?.message}</FieldError>
            </Field>
            <Field data-invalid={form.formState.errors.lastName ? true : undefined}>
              <FieldLabel htmlFor="patientAccountLastName">{lastNameLabel}</FieldLabel>
              <Input
                aria-invalid={form.formState.errors.lastName ? true : undefined}
                id="patientAccountLastName"
                {...form.register('lastName', {
                  onChange: onFieldChange,
                })}
              />
              <FieldError>{form.formState.errors.lastName?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="patientAccountEmail">{emailLabel}</FieldLabel>
              <Input id="patientAccountEmail" readOnly type="email" value={email} />
            </Field>
            <Field data-invalid={form.formState.errors.phone ? true : undefined}>
              <FieldLabel htmlFor="patientAccountPhone">{phoneLabel}</FieldLabel>
              <TunisiaPhoneInput
                aria-invalid={form.formState.errors.phone ? true : undefined}
                id="patientAccountPhone"
                {...form.register('phone', {
                  onChange: onFieldChange,
                })}
              />
              <FieldError>{form.formState.errors.phone?.message}</FieldError>
            </Field>
            <Field data-invalid={form.formState.errors.address ? true : undefined}>
              <FieldLabel htmlFor="patientAccountAddress">{addressLabel}</FieldLabel>
              <Input
                aria-invalid={form.formState.errors.address ? true : undefined}
                id="patientAccountAddress"
                {...form.register('address', {
                  onChange: onFieldChange,
                })}
              />
              <FieldError>{form.formState.errors.address?.message}</FieldError>
            </Field>
            <Field data-invalid={form.formState.errors.city ? true : undefined}>
              <FieldLabel htmlFor="patientAccountCity">{cityLabel}</FieldLabel>
              <Input
                aria-invalid={form.formState.errors.city ? true : undefined}
                id="patientAccountCity"
                {...form.register('city', {
                  onChange: onFieldChange,
                })}
              />
              <FieldError>{form.formState.errors.city?.message}</FieldError>
            </Field>
            <Field data-invalid={form.formState.errors.postalCode ? true : undefined}>
              <FieldLabel htmlFor="patientAccountPostalCode">{postalCodeLabel}</FieldLabel>
              <Input
                aria-invalid={form.formState.errors.postalCode ? true : undefined}
                id="patientAccountPostalCode"
                {...form.register('postalCode', {
                  onChange: onFieldChange,
                })}
              />
              <FieldError>{form.formState.errors.postalCode?.message}</FieldError>
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
