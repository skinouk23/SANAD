import { Save } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';

import { FormActions } from '@/shared/ui/composites/form-field';
import { ProfileCard, ProfilePanel } from '@/shared/ui/composites/profile-surface';
import { Button } from '@/shared/ui/primitives/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/primitives/field';
import { Input } from '@/shared/ui/primitives/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';
import { Spinner } from '@/shared/ui/primitives/spinner';
import { Textarea } from '@/shared/ui/primitives/textarea';

import type { ProviderProfileFormValues } from '@/features/providers/schema';

interface ProviderProfessionalTabProps {
  idBase: string;
  title: string;
  providerCategoryLabel: string;
  isNutritionProvider: boolean;
  nutritionSubtypeLabel: string;
  businessNameLabel: string;
  providerCategoryFieldLabel: string;
  specializationLabel: string;
  serviceRadiusLabel: string;
  bioLabel: string;
  noDataLabel: string;
  saveLabel: string;
  savingLabel: string;
  cancelLabel: string;
  saveDisabled: boolean;
  saving: boolean;
  form: UseFormReturn<ProviderProfileFormValues>;
  nutritionSubtypeOptions: Array<{ value: string; label: string }>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  refreshing: boolean;
  onReset: () => void;
  onFieldChange: () => void;
}

const EMPTY_NUTRITION_SUBTYPE_VALUE = '__empty_nutrition_subtype__';

export function ProviderProfessionalTab({
  idBase,
  title,
  providerCategoryLabel,
  isNutritionProvider,
  nutritionSubtypeLabel,
  businessNameLabel,
  providerCategoryFieldLabel,
  specializationLabel,
  serviceRadiusLabel,
  bioLabel,
  noDataLabel,
  saveLabel,
  savingLabel,
  cancelLabel,
  saveDisabled,
  saving,
  form,
  nutritionSubtypeOptions,
  onSubmit,
  refreshing,
  onReset,
  onFieldChange,
}: ProviderProfessionalTabProps) {
  return (
    <ProfilePanel idBase={idBase} tabId="professionnel">
      <ProfileCard contentClassName="p-4 sm:p-6">
        <form onSubmit={onSubmit}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
            {refreshing ? (
              <span className="w-fit rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-medium text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-200">
                Mise à jour...
              </span>
            ) : null}
          </div>

          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field data-invalid={form.formState.errors.businessName ? true : undefined}>
              <FieldLabel htmlFor="businessName">{businessNameLabel}</FieldLabel>
              <Input
                aria-invalid={form.formState.errors.businessName ? true : undefined}
                id="businessName"
                {...form.register('businessName', { onChange: onFieldChange })}
              />
              <FieldError>{form.formState.errors.businessName?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="serviceType">{providerCategoryFieldLabel}</FieldLabel>
              <Input id="serviceType" readOnly value={providerCategoryLabel} />
            </Field>
            {isNutritionProvider ? (
              <Field
                data-invalid={form.formState.errors.nutritionProviderSubtype ? true : undefined}
              >
                <FieldLabel htmlFor="nutritionProviderSubtype">{nutritionSubtypeLabel}</FieldLabel>
                <Controller
                  control={form.control}
                  name="nutritionProviderSubtype"
                  render={({ field }) => (
                    <Select
                      name={field.name}
                      onValueChange={(value) => {
                        field.onChange(value === EMPTY_NUTRITION_SUBTYPE_VALUE ? '' : value);
                        onFieldChange();
                      }}
                      value={field.value || EMPTY_NUTRITION_SUBTYPE_VALUE}
                    >
                      <SelectTrigger
                        aria-invalid={
                          form.formState.errors.nutritionProviderSubtype ? true : undefined
                        }
                        className="w-full"
                        id="nutritionProviderSubtype"
                        onBlur={field.onBlur}
                        ref={field.ref}
                      >
                        <SelectValue placeholder={noDataLabel} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value={EMPTY_NUTRITION_SUBTYPE_VALUE}>
                            {noDataLabel}
                          </SelectItem>
                          {nutritionSubtypeOptions
                            .filter((subtype) => subtype.value !== '')
                            .map((subtype) => (
                              <SelectItem key={subtype.value} value={subtype.value}>
                                {subtype.label}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{form.formState.errors.nutritionProviderSubtype?.message}</FieldError>
              </Field>
            ) : null}
            <Field data-invalid={form.formState.errors.specialization ? true : undefined}>
              <FieldLabel htmlFor="specialization">{specializationLabel}</FieldLabel>
              <Input
                aria-invalid={form.formState.errors.specialization ? true : undefined}
                id="specialization"
                {...form.register('specialization', { onChange: onFieldChange })}
              />
              <FieldError>{form.formState.errors.specialization?.message}</FieldError>
            </Field>
            <Field data-invalid={form.formState.errors.serviceRadius ? true : undefined}>
              <FieldLabel htmlFor="serviceRadius">{serviceRadiusLabel}</FieldLabel>
              <Input
                aria-invalid={form.formState.errors.serviceRadius ? true : undefined}
                id="serviceRadius"
                type="number"
                {...form.register('serviceRadius', { onChange: onFieldChange })}
              />
              <FieldError>{form.formState.errors.serviceRadius?.message}</FieldError>
            </Field>
            <Field
              className="md:col-span-2"
              data-invalid={form.formState.errors.bio ? true : undefined}
            >
              <FieldLabel htmlFor="bio">{bioLabel}</FieldLabel>
              <Textarea
                aria-invalid={form.formState.errors.bio ? true : undefined}
                id="bio"
                rows={4}
                className="resize-none"
                {...form.register('bio', { onChange: onFieldChange })}
              />
              <FieldError>{form.formState.errors.bio?.message}</FieldError>
            </Field>
          </FieldGroup>

          <FormActions className="mt-4 flex justify-end border-t border-slate-200 pt-4 dark:border-slate-700 [&>*]:w-auto [&>*:only-child]:col-span-1">
            <div className="flex w-auto flex-col gap-3 sm:flex-row">
              <Button
                className="w-auto rounded-lg border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                type="button"
                variant="outline"
                onClick={onReset}
                disabled={saveDisabled}
              >
                {cancelLabel}
              </Button>
              <Button
                className="w-auto rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 text-white hover:opacity-90"
                disabled={saveDisabled || saving}
                aria-busy={saving || undefined}
                type="submit"
              >
                {saving ? <Spinner data-icon="inline-start" /> : <Save className="h-4 w-4" />}
                {saving ? savingLabel : saveLabel}
              </Button>
            </div>
          </FormActions>
        </form>
      </ProfileCard>
    </ProfilePanel>
  );
}
