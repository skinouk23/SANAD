import { RefreshCw, Save } from 'lucide-react';
import type { FormEventHandler } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import { FormActions } from '@/shared/ui/composites/form-field';
import { FormSkeleton } from '@/shared/ui/composites/loading';
import { ProfileCard, ProfileMessage, ProfilePanel } from '@/shared/ui/composites/profile-surface';
import { Button } from '@/shared/ui/primitives/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/primitives/field';
import { Input } from '@/shared/ui/primitives/input';
import { TunisiaPhoneInput } from '@/shared/ui/primitives/tunisia-phone-input';
import { Spinner } from '@/shared/ui/primitives/spinner';
import { Textarea } from '@/shared/ui/primitives/textarea';

import type { PatientProfileFormValues } from '@/features/family-circle/schema';

interface PatientHealthTabProps {
  idBase: string;
  title: string;
  description: string;
  medicalHistoryLabel: string;
  allergiesLabel: string;
  medicationsLabel: string;
  insuranceProviderLabel: string;
  insuranceNumberLabel: string;
  emergencyContactLabel: string;
  emergencyContactNameLabel: string;
  emergencyContactPhoneLabel: string;
  emergencyContactRelationshipLabel: string;
  saveLabel: string;
  savingLabel: string;
  retryLabel: string;
  noDataLabel: string;
  loading: boolean;
  errorMessage: string | null;
  profileAvailable: boolean;
  refreshing: boolean;
  saving: boolean;
  saveDisabled: boolean;
  form: UseFormReturn<PatientProfileFormValues>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onRetry: () => void;
  onFieldChange: () => void;
}

export function PatientHealthTab({
  idBase,
  title,
  description,
  medicalHistoryLabel,
  allergiesLabel,
  medicationsLabel,
  insuranceProviderLabel,
  insuranceNumberLabel,
  emergencyContactLabel,
  emergencyContactNameLabel,
  emergencyContactPhoneLabel,
  emergencyContactRelationshipLabel,
  saveLabel,
  savingLabel,
  retryLabel,
  noDataLabel,
  loading,
  errorMessage,
  profileAvailable,
  refreshing,
  saving,
  saveDisabled,
  form,
  onSubmit,
  onRetry,
  onFieldChange,
}: PatientHealthTabProps) {
  return (
    <ProfilePanel className="space-y-4" idBase={idBase} tabId="sante">
      {errorMessage && !profileAvailable ? (
        <div>
          <ProfileMessage tone="error">{errorMessage}</ProfileMessage>
          <Button className="mt-3" type="button" onClick={onRetry} variant="outline">
            <RefreshCw data-icon="inline-start" />
            {retryLabel}
          </Button>
        </div>
      ) : null}

      {loading && !profileAvailable ? (
        <FormSkeleton className="border-border/70 bg-card/95 shadow-sm" fields={6} />
      ) : null}

      {profileAvailable ? (
        <ProfileCard contentClassName="p-4 sm:p-6">
          <form onSubmit={onSubmit}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
              </div>
              {refreshing ? (
                <span className="w-fit rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-medium text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-200">
                  Mise à jour...
                </span>
              ) : null}
            </div>

            <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                className="md:col-span-2"
                data-invalid={form.formState.errors.medicalHistory ? true : undefined}
              >
                <FieldLabel htmlFor="patientMedicalHistory">{medicalHistoryLabel}</FieldLabel>
                <Textarea
                  aria-invalid={form.formState.errors.medicalHistory ? true : undefined}
                  id="patientMedicalHistory"
                  rows={4}
                  className="resize-none"
                  {...form.register('medicalHistory', {
                    onChange: onFieldChange,
                  })}
                />
                <FieldError>{form.formState.errors.medicalHistory?.message}</FieldError>
              </Field>

              <Field data-invalid={form.formState.errors.allergies ? true : undefined}>
                <FieldLabel htmlFor="patientAllergies">{allergiesLabel}</FieldLabel>
                <Textarea
                  aria-invalid={form.formState.errors.allergies ? true : undefined}
                  id="patientAllergies"
                  rows={4}
                  className="resize-none"
                  {...form.register('allergies', {
                    onChange: onFieldChange,
                  })}
                />
                <FieldError>{form.formState.errors.allergies?.message}</FieldError>
              </Field>
              <Field data-invalid={form.formState.errors.currentMedications ? true : undefined}>
                <FieldLabel htmlFor="patientMedications">{medicationsLabel}</FieldLabel>
                <Textarea
                  aria-invalid={form.formState.errors.currentMedications ? true : undefined}
                  id="patientMedications"
                  rows={4}
                  className="resize-none"
                  {...form.register('currentMedications', {
                    onChange: onFieldChange,
                  })}
                />
                <FieldError>{form.formState.errors.currentMedications?.message}</FieldError>
              </Field>
              <Field data-invalid={form.formState.errors.insuranceProvider ? true : undefined}>
                <FieldLabel htmlFor="patientInsuranceProvider">{insuranceProviderLabel}</FieldLabel>
                <Input
                  aria-invalid={form.formState.errors.insuranceProvider ? true : undefined}
                  id="patientInsuranceProvider"
                  {...form.register('insuranceProvider', {
                    onChange: onFieldChange,
                  })}
                />
                <FieldError>{form.formState.errors.insuranceProvider?.message}</FieldError>
              </Field>
              <Field data-invalid={form.formState.errors.insuranceNumber ? true : undefined}>
                <FieldLabel htmlFor="patientInsuranceNumber">{insuranceNumberLabel}</FieldLabel>
                <Input
                  aria-invalid={form.formState.errors.insuranceNumber ? true : undefined}
                  id="patientInsuranceNumber"
                  {...form.register('insuranceNumber', {
                    onChange: onFieldChange,
                  })}
                />
                <FieldError>{form.formState.errors.insuranceNumber?.message}</FieldError>
              </Field>
            </FieldGroup>

            <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {emergencyContactLabel}
                </h3>
              </div>

              <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field data-invalid={form.formState.errors.emergencyContactName ? true : undefined}>
                  <FieldLabel htmlFor="patientEmergencyContactName">
                    {emergencyContactNameLabel}
                  </FieldLabel>
                  <Input
                    aria-invalid={form.formState.errors.emergencyContactName ? true : undefined}
                    id="patientEmergencyContactName"
                    {...form.register('emergencyContactName', {
                      onChange: onFieldChange,
                    })}
                  />
                  <FieldError>{form.formState.errors.emergencyContactName?.message}</FieldError>
                </Field>
                <Field
                  data-invalid={form.formState.errors.emergencyContactPhone ? true : undefined}
                >
                  <FieldLabel htmlFor="patientEmergencyContactPhone">
                    {emergencyContactPhoneLabel}
                  </FieldLabel>
                  <TunisiaPhoneInput
                    aria-invalid={form.formState.errors.emergencyContactPhone ? true : undefined}
                    id="patientEmergencyContactPhone"
                    {...form.register('emergencyContactPhone', {
                      onChange: onFieldChange,
                    })}
                  />
                  <FieldError>{form.formState.errors.emergencyContactPhone?.message}</FieldError>
                </Field>
                <Field
                  data-invalid={
                    form.formState.errors.emergencyContactRelationship ? true : undefined
                  }
                >
                  <FieldLabel htmlFor="patientEmergencyContactRelationship">
                    {emergencyContactRelationshipLabel}
                  </FieldLabel>
                  <Input
                    aria-invalid={
                      form.formState.errors.emergencyContactRelationship ? true : undefined
                    }
                    id="patientEmergencyContactRelationship"
                    {...form.register('emergencyContactRelationship', {
                      onChange: onFieldChange,
                    })}
                  />
                  <FieldError>
                    {form.formState.errors.emergencyContactRelationship?.message}
                  </FieldError>
                </Field>
              </FieldGroup>
            </div>

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
      ) : null}

      {!loading && !errorMessage && !profileAvailable ? (
        <ProfileCard contentClassName="p-4 sm:p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">{noDataLabel}</p>
        </ProfileCard>
      ) : null}
    </ProfilePanel>
  );
}
