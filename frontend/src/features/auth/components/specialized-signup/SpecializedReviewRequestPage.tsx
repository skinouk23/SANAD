import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check, CheckCircle, MapPin, Phone, Shield, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthInputField } from '@/features/auth/components/AuthFormControls';
import { AuthPanel, AuthShell } from '@/features/auth/components/AuthShell';
import { sanitizeTextValue } from '@/features/auth/screens/authFlow.helpers';
import {
  type SpecializedReviewRequestConfig,
  type SpecializedReviewRequestFormValues,
  SpecializedReviewRequestSchema,
} from '@/features/auth/specializedSignUp';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/primitives/button';
import {
  createDefaultTunisiaPhoneValue,
  TUNISIA_PHONE_PLACEHOLDER,
} from '@/utils/input-validation';
import {
  SpecializedAccentHeader,
  SpecializedFileField,
  SpecializedFlowStepper,
} from './SpecializedFlowShared';

import type { LucideIcon } from 'lucide-react';

const specializedReviewLabelClassName =
  'mb-1 text-[10px] font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400';

const specializedReviewInputClassName =
  'rounded-lg border-slate-300 bg-white text-sm text-slate-900 focus-within:border-cyan-500 focus-within:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white';

interface SpecializedReviewRequestPageProps {
  config: SpecializedReviewRequestConfig;
  icon: LucideIcon;
}

export function SpecializedReviewRequestPage({
  config,
  icon: Icon,
}: SpecializedReviewRequestPageProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const {
    clearErrors,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    trigger,
    watch,
  } = useForm<SpecializedReviewRequestFormValues>({
    defaultValues: {
      address: '',
      documentUploads: config.documents.map((document) => ({
        file: null,
        fileName: '',
        id: document.id,
        label: document.label,
      })),
      identifier: '',
      managerName: '',
      organizationName: '',
      phone: createDefaultTunisiaPhoneValue(),
      services: [],
      toggles: Object.fromEntries(
        (config.specialOptions ?? []).map((option) => [option.id, false]),
      ),
    },
    mode: 'onBlur',
    resolver: zodResolver(SpecializedReviewRequestSchema),
  });

  const steps = ['Informations', 'Services', 'Documents', 'Validation'];
  const selectedServices = watch('services');
  const uploadedDocuments = watch('documentUploads');
  const toggleValues = watch('toggles');

  const handleBack = () => {
    if (step === 1) {
      navigate('/auth/signup');
      return;
    }

    setStep((current) => (current - 1) as 1 | 2 | 3 | 4);
  };

  const handleServiceToggle = (service: string) => {
    const nextServices = selectedServices.includes(service)
      ? selectedServices.filter((current) => current !== service)
      : [...selectedServices, service];

    setValue('services', nextServices, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false,
    });
  };

  const validateCurrentStep = async () => {
    if (step === 1) {
      return trigger(['organizationName', 'managerName', 'identifier', 'phone', 'address'], {
        shouldFocus: true,
      });
    }

    return true;
  };

  const handleContinue = async () => {
    clearErrors();

    const valid = await validateCurrentStep();

    if (!valid || step === 4) {
      return;
    }

    setStep((current) => (current + 1) as 1 | 2 | 3 | 4);
  };

  const submitRequest = () => {
    // Manual review request submission remains UI-only until dedicated backend onboarding endpoints exist.
    setStep(4);
  };

  return (
    <AuthShell className="max-w-3xl px-4">
      <div className="pb-4 sm:py-4">
        <Button
          className="group mb-3 h-auto gap-1.5 px-0 text-sm font-medium text-cyan-600 shadow-none transition-colors hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
          onClick={handleBack}
          variant="link"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Retour
        </Button>

        <AuthPanel>
          <SpecializedAccentHeader
            iconBadge={config.iconBadge}
            subtitle={config.subtitle}
            title={config.title}
          />

          <SpecializedFlowStepper
            accentClassName="text-cyan-600 dark:text-cyan-400"
            step={step}
            steps={steps}
          />

          {step === 4 ? (
            <div className="rounded-3xl border border-cyan-400/20 bg-white/70 px-6 py-8 text-center shadow-sm backdrop-blur-sm dark:border-cyan-400/15 dark:bg-slate-900/50">
              <div className="relative mx-auto mb-6 h-24 w-24">
                <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 opacity-40 blur-md" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-white shadow-lg shadow-emerald-500/25">
                  <CheckCircle className="h-12 w-12" />
                </div>
              </div>
              <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
                {config.confirmationTitle}
              </h2>
              <p className="mx-auto mb-8 max-w-md text-base text-slate-500 dark:text-slate-400">
                {config.confirmationBody}
              </p>
              <Button
                className="border-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-none transition-all hover:scale-[1.02] hover:brightness-100 hover:shadow-[0_0_22px_rgba(6,182,212,0.45)]"
                onClick={() => navigate('/')}
              >
                Retour a l'accueil
              </Button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(submitRequest)}>
              {step === 1 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <AuthInputField
                    className="md:col-span-2"
                    error={errors.organizationName?.message}
                    icon={<Icon className="h-4 w-4" />}
                    id="review-organization-name"
                    label={config.organizationLabel}
                    labelClassName={specializedReviewLabelClassName}
                    contentClassName={specializedReviewInputClassName}
                    placeholder={config.organizationPlaceholder}
                    required
                    {...register('organizationName', { setValueAs: sanitizeTextValue })}
                  />

                  <AuthInputField
                    error={errors.managerName?.message}
                    icon={<User className="h-4 w-4" />}
                    id="review-manager-name"
                    label={config.managerLabel}
                    labelClassName={specializedReviewLabelClassName}
                    contentClassName={specializedReviewInputClassName}
                    placeholder={config.managerPlaceholder}
                    required
                    {...register('managerName', { setValueAs: sanitizeTextValue })}
                  />

                  <AuthInputField
                    error={errors.identifier?.message}
                    id="review-identifier"
                    label={config.identifierLabel}
                    labelClassName={specializedReviewLabelClassName}
                    contentClassName={specializedReviewInputClassName}
                    placeholder={config.identifierPlaceholder}
                    required
                    {...register('identifier', { setValueAs: sanitizeTextValue })}
                  />

                  <AuthInputField
                    error={errors.phone?.message}
                    icon={<Phone className="h-4 w-4" />}
                    id="review-phone"
                    label="Telephone professionnel"
                    labelClassName={specializedReviewLabelClassName}
                    contentClassName={specializedReviewInputClassName}
                    placeholder={TUNISIA_PHONE_PLACEHOLDER}
                    required
                    type="tel"
                    {...register('phone')}
                  />

                  <AuthInputField
                    className="md:col-span-2"
                    error={errors.address?.message}
                    icon={<MapPin className="h-4 w-4" />}
                    id="review-address"
                    label="Adresse complete"
                    labelClassName={specializedReviewLabelClassName}
                    contentClassName={specializedReviewInputClassName}
                    placeholder="Adresse, ville, code postal"
                    required
                    {...register('address', { setValueAs: sanitizeTextValue })}
                  />

                  {(config.specialOptions ?? []).length ? (
                    <div className="md:col-span-2 space-y-3 pt-2">
                      {config.specialOptions?.map((option) => {
                        const checked = Boolean(toggleValues?.[option.id]);

                        return (
                          <button
                            key={option.id}
                            className={cn(
                              'group flex w-full items-start gap-3 rounded-2xl border p-4 text-left shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5',
                              checked
                                ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 shadow-cyan-500/20 ring-1 ring-cyan-400/30'
                                : 'border-slate-200 bg-white/70 hover:border-cyan-400 hover:bg-cyan-50/60 dark:border-slate-700 dark:bg-slate-800/45 dark:hover:border-cyan-400/70 dark:hover:bg-cyan-950/25',
                            )}
                            onClick={() =>
                              setValue(`toggles.${option.id}`, !checked, {
                                shouldDirty: true,
                                shouldTouch: true,
                              })
                            }
                            type="button"
                          >
                            <div
                              className={cn(
                                'mt-0.5 flex h-5 w-5 items-center justify-center rounded border',
                                checked
                                  ? 'border-cyan-400 bg-gradient-to-br from-cyan-400 to-blue-500 text-white'
                                  : 'border-slate-300 dark:border-slate-600',
                              )}
                            >
                              {checked ? <Check className="h-3.5 w-3.5" /> : null}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800 transition-colors group-hover:text-cyan-700 dark:text-slate-100 dark:group-hover:text-cyan-300">
                                {option.label}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {option.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-5">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {config.servicesTitle}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {config.servicesSubtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {config.services.map((service) => {
                      const selected = selectedServices.includes(service);

                      return (
                        <button
                          key={service}
                          className={cn(
                            'group flex items-center gap-3 rounded-2xl border p-4 text-left shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5',
                            selected
                              ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 shadow-cyan-500/20 ring-1 ring-cyan-400/30'
                              : 'border-slate-200 bg-white/70 hover:border-cyan-400 hover:bg-cyan-50/60 dark:border-slate-700 dark:bg-slate-800/45 dark:hover:border-cyan-400/70 dark:hover:bg-cyan-950/25',
                          )}
                          onClick={() => handleServiceToggle(service)}
                          type="button"
                        >
                          <div
                            className={cn(
                              'flex h-6 w-6 items-center justify-center rounded-full border',
                              selected
                                ? 'border-cyan-400 bg-gradient-to-br from-cyan-400 to-blue-500 text-white'
                                : 'border-slate-300 dark:border-slate-600',
                            )}
                          >
                            {selected ? <Check className="h-4 w-4" /> : null}
                          </div>
                          <span className="font-medium text-slate-800 transition-colors group-hover:text-cyan-700 dark:text-slate-100 dark:group-hover:text-cyan-300">
                            {service}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-5">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {config.documentsTitle}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {config.documentsSubtitle}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {config.documents.map((document, index) => (
                      <SpecializedFileField
                        key={document.id}
                        description={document.description}
                        fileName={uploadedDocuments?.[index]?.fileName ?? ''}
                        id={`review-document-${document.id}`}
                        label={document.label}
                        onChange={(file) => {
                          setValue(
                            `documentUploads.${index}`,
                            {
                              file,
                              fileName: file?.name ?? '',
                              id: document.id,
                              label: document.label,
                            },
                            { shouldDirty: true, shouldTouch: true },
                          );
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-50/70 p-4 text-sm text-cyan-700 dark:bg-cyan-950/25 dark:text-cyan-300">
                    <Shield className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    <p>{config.documentsNotice}</p>
                  </div>
                </div>
              ) : null}

              <div className="flex gap-3 border-t border-cyan-400/20 pt-6">
                {step > 1 ? (
                  <Button
                    className="flex-1 border-cyan-400/30 bg-white/60 text-cyan-700 shadow-none hover:border-cyan-400 hover:bg-cyan-50 dark:bg-slate-900/50 dark:text-cyan-300 dark:hover:bg-cyan-950/30"
                    onClick={handleBack}
                    type="button"
                    variant="outline"
                  >
                    Precedent
                  </Button>
                ) : null}

                {step < 3 ? (
                  <Button
                    className="flex-1 border-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-none transition-all hover:scale-[1.02] hover:brightness-100 hover:shadow-[0_0_22px_rgba(6,182,212,0.45)]"
                    onClick={handleContinue}
                    type="button"
                  >
                    Suivant
                  </Button>
                ) : (
                  <Button
                    className="flex-1 border-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-none transition-all hover:scale-[1.02] hover:brightness-100 hover:shadow-[0_0_22px_rgba(6,182,212,0.45)]"
                    type="submit"
                  >
                    Soumettre la demande
                  </Button>
                )}
              </div>
            </form>
          )}
        </AuthPanel>
      </div>
    </AuthShell>
  );
}
