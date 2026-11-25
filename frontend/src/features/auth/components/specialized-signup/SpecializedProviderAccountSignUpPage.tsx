import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check, Lock, Mail, MapPin, Phone, Plus, Shield, User, X } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import type { FieldPath } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  AuthCheckboxField,
  AuthInputField,
  PasswordStrengthMeter,
  PasswordToggle,
} from '@/features/auth/components/AuthFormControls';
import { AuthPanel, AuthShell } from '@/features/auth/components/AuthShell';
import { getDefaultRouteForRuntimeRole } from '@/features/auth/role-policy';
import {
  getApiErrorMessage,
  sanitizeTextValue,
  splitPersonName,
} from '@/features/auth/screens/authFlow.helpers';
import {
  uploadProviderSignupDocuments,
  type ProviderSignupDocumentUploadInput,
} from '@/features/auth/providerSignupDocuments';
import {
  type SpecializedProviderAccountConfig,
  type SpecializedProviderAccountFormValues,
  SPECIALIZED_SIGNUP_PLANS,
  createDocumentId,
  createSpecializedProviderAccountSchema,
} from '@/features/auth/specializedSignUp';
import { cn } from '@/shared/lib/utils';
import { FormStatusMessage } from '@/shared/ui/composites/form-field';
import { Button } from '@/shared/ui/primitives/button';
import {
  createDefaultTunisiaPhoneValue,
  getPasswordStrength,
  TUNISIA_PHONE_PLACEHOLDER,
} from '@/utils/input-validation';
import {
  SpecializedAccentHeader,
  SpecializedFileField,
  SpecializedFlowStepper,
} from './SpecializedFlowShared';

import type { LucideIcon } from 'lucide-react';

const specializedLabelClassName =
  'mb-1 text-[10px] font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400';

const specializedInputClassName =
  'rounded-lg border-slate-300 bg-white text-sm text-slate-900 focus-within:border-cyan-500 focus-within:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white';

const specializedGlassPanelClassName =
  'rounded-2xl border border-cyan-400/20 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-cyan-400/15 dark:bg-slate-900/50';

function collectSpecializedSignupDocuments(
  values: SpecializedProviderAccountFormValues,
): ProviderSignupDocumentUploadInput[] {
  const documents: ProviderSignupDocumentUploadInput[] = [];

  for (const document of values.requiredDocuments) {
    if (document.file) {
      documents.push({
        documentType: document.id,
        documentName: document.label || document.file.name,
        file: document.file,
      });
    }
  }

  for (const document of values.additionalDocuments) {
    if (document.file) {
      documents.push({
        documentType: 'certification',
        documentName: document.name || document.file.name,
        file: document.file,
      });
    }
  }

  return documents;
}

interface SpecializedProviderAccountSignUpPageProps {
  config: SpecializedProviderAccountConfig;
  icon: LucideIcon;
}

export function SpecializedProviderAccountSignUpPage({
  config,
  icon: Icon,
}: SpecializedProviderAccountSignUpPageProps) {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const schema = useMemo(
    () => createSpecializedProviderAccountSchema(config.requiredDocuments.length),
    [config.requiredDocuments.length],
  );

  const {
    control,
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    setValue,
    trigger,
    watch,
  } = useForm<SpecializedProviderAccountFormValues>({
    defaultValues: {
      additionalDocuments: [],
      address: '',
      city: '',
      confirmPassword: '',
      email: '',
      identifier: '',
      managerName: '',
      offerings: [],
      organizationName: '',
      password: '',
      phone: createDefaultTunisiaPhoneValue(),
      verificationConsentGiven: true,
      requiredDocuments: config.requiredDocuments.map((document) => ({
        file: null,
        fileName: '',
        id: document.id,
        label: document.label,
      })),
      subscriptionPlan: '',
      yearsInBusiness: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(schema),
  });

  const additionalDocuments = useFieldArray({ control, name: 'additionalDocuments' });
  const password = watch('password');
  const passwordStrength = getPasswordStrength(password ?? '');
  const selectedOfferings = watch('offerings');
  const selectedPlan = watch('subscriptionPlan');
  const verificationConsentGiven = watch('verificationConsentGiven');
  const watchedRequiredDocuments = watch('requiredDocuments');
  const watchedAdditionalDocuments = watch('additionalDocuments');

  const steps = ['Informations', 'Prestations', 'Documents', 'Abonnement'];

  const handleBack = () => {
    clearErrors('root.submit');

    if (step === 1) {
      navigate('/auth/onboarding');
      return;
    }

    setStep((current) => (current - 1) as 1 | 2 | 3 | 4);
  };

  const handleOfferingToggle = (offeringId: string) => {
    const nextOfferings = selectedOfferings.includes(offeringId)
      ? selectedOfferings.filter((current) => current !== offeringId)
      : [...selectedOfferings, offeringId];

    setValue('offerings', nextOfferings, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: step >= 2,
    });
  };

  const validateCurrentStep = async () => {
    const fields: Record<1 | 2 | 3 | 4, FieldPath<SpecializedProviderAccountFormValues>[]> = {
      1: [
        'organizationName',
        'managerName',
        'email',
        'phone',
        'password',
        'confirmPassword',
        'city',
        'identifier',
        'yearsInBusiness',
      ],
      2: ['offerings'],
      3: ['verificationConsentGiven', 'requiredDocuments', 'additionalDocuments'],
      4: ['subscriptionPlan'],
    };

    return trigger(fields[step], { shouldFocus: true });
  };

  const handleContinue = async () => {
    clearErrors('root.submit');

    const valid = await validateCurrentStep();

    if (!valid || step === 4) {
      return;
    }

    setStep((current) => (current + 1) as 1 | 2 | 3 | 4);
  };

  const onSubmit = async (values: SpecializedProviderAccountFormValues) => {
    const { firstName, lastName } = splitPersonName(values.managerName);

    try {
      const uploadedDocuments = await uploadProviderSignupDocuments(
        collectSpecializedSignupDocuments(values),
      );

      const registeredUser = await registerUser({
        address: values.address?.trim() || null,
        city: values.city,
        countryCode: 'TN',
        email: values.email,
        firstName,
        lastName,
        password: values.password,
        phone: values.phone,
        providerApplicationId: uploadedDocuments.applicationId,
        providerDocuments: uploadedDocuments.providerDocuments,
        role: 'provider',
        serviceType: config.serviceType,
        verificationConsentGiven: values.verificationConsentGiven,
      });

      navigate(getDefaultRouteForRuntimeRole(registeredUser.role), { replace: true });
    } catch (error) {
      setError('root.submit', {
        message: getApiErrorMessage(error, 'Erreur lors de la creation du compte.'),
      });
    }
  };

  return (
    <AuthShell className={cn('px-4', step === 4 ? 'max-w-5xl' : 'max-w-2xl')}>
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

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {step === 1 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <AuthInputField
                  className="md:col-span-2"
                  error={errors.organizationName?.message}
                  icon={<Icon className="h-4 w-4" />}
                  id="specialized-organization-name"
                  label={config.organizationLabel}
                  labelClassName={specializedLabelClassName}
                  contentClassName={specializedInputClassName}
                  placeholder={config.organizationPlaceholder}
                  required
                  {...register('organizationName', { setValueAs: sanitizeTextValue })}
                />

                <AuthInputField
                  error={errors.managerName?.message}
                  icon={<User className="h-4 w-4" />}
                  id="specialized-manager-name"
                  label={config.managerLabel}
                  labelClassName={specializedLabelClassName}
                  contentClassName={specializedInputClassName}
                  placeholder={config.managerPlaceholder}
                  required
                  {...register('managerName', { setValueAs: sanitizeTextValue })}
                />

                <AuthInputField
                  error={errors.identifier?.message}
                  id="specialized-identifier"
                  label={config.identifierLabel}
                  labelClassName={specializedLabelClassName}
                  contentClassName={specializedInputClassName}
                  placeholder={config.identifierPlaceholder}
                  required
                  {...register('identifier', { setValueAs: sanitizeTextValue })}
                />

                <AuthInputField
                  autoComplete="email"
                  error={errors.email?.message}
                  icon={<Mail className="h-4 w-4" />}
                  id="specialized-email"
                  label="Adresse e-mail"
                  labelClassName={specializedLabelClassName}
                  contentClassName={specializedInputClassName}
                  placeholder="contact@etablissement.tn"
                  required
                  type="email"
                  {...register('email', { setValueAs: sanitizeTextValue })}
                />

                <AuthInputField
                  autoComplete="tel"
                  error={errors.phone?.message}
                  icon={<Phone className="h-4 w-4" />}
                  id="specialized-phone"
                  label="Telephone professionnel"
                  labelClassName={specializedLabelClassName}
                  contentClassName={specializedInputClassName}
                  placeholder={TUNISIA_PHONE_PLACEHOLDER}
                  required
                  type="tel"
                  {...register('phone')}
                />

                <div>
                  <AuthInputField
                    autoComplete="new-password"
                    endAdornment={
                      <PasswordToggle
                        onToggle={() => setShowPassword((current) => !current)}
                        visible={showPassword}
                      />
                    }
                    error={errors.password?.message}
                    icon={<Lock className="h-4 w-4" />}
                    id="specialized-password"
                    label="Mot de passe"
                    labelClassName={specializedLabelClassName}
                    contentClassName={specializedInputClassName}
                    placeholder="••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                  />
                  <PasswordStrengthMeter empty={!password} score={passwordStrength.score} />
                </div>

                <AuthInputField
                  autoComplete="new-password"
                  error={errors.confirmPassword?.message}
                  icon={<Lock className="h-4 w-4" />}
                  id="specialized-confirm-password"
                  label="Confirmer le mot de passe"
                  labelClassName={specializedLabelClassName}
                  contentClassName={specializedInputClassName}
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                />

                <AuthInputField
                  autoComplete="street-address"
                  error={errors.address?.message}
                  icon={<MapPin className="h-4 w-4" />}
                  id="specialized-address"
                  label="Adresse"
                  labelClassName={specializedLabelClassName}
                  contentClassName={specializedInputClassName}
                  placeholder="Adresse complete"
                  hint="Optionnelle. Vous pourrez préciser votre position exacte plus tard depuis le tableau de bord."
                  {...register('address', { setValueAs: sanitizeTextValue })}
                />

                <AuthInputField
                  error={errors.city?.message}
                  id="specialized-city"
                  label="Ville"
                  labelClassName={specializedLabelClassName}
                  contentClassName={specializedInputClassName}
                  placeholder="Tunis"
                  required
                  {...register('city', { setValueAs: sanitizeTextValue })}
                />

                <AuthInputField
                  error={errors.yearsInBusiness?.message}
                  id="specialized-years"
                  inputMode="numeric"
                  label={config.yearsLabel}
                  labelClassName={specializedLabelClassName}
                  contentClassName={specializedInputClassName}
                  placeholder={config.yearsPlaceholder}
                  required
                  {...register('yearsInBusiness')}
                />
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-5">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {config.offeringsTitle}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {config.offeringsDescription}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {config.offerings.map((offering) => {
                    const selected = selectedOfferings.includes(offering.id);

                    return (
                      <button
                        key={offering.id}
                        className={cn(
                          'group flex items-center gap-3 rounded-2xl border p-4 text-left shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5',
                          selected
                            ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 shadow-cyan-500/20 ring-1 ring-cyan-400/30'
                            : 'border-slate-200 bg-white/70 hover:border-cyan-400 hover:bg-cyan-50/60 dark:border-slate-700 dark:bg-slate-800/45 dark:hover:border-cyan-400/70 dark:hover:bg-cyan-950/25',
                        )}
                        onClick={() => handleOfferingToggle(offering.id)}
                        type="button"
                      >
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-all group-hover:scale-105',
                            selected
                              ? 'bg-gradient-to-br from-cyan-400/25 to-blue-500/25'
                              : 'bg-slate-100 dark:bg-slate-800',
                          )}
                        >
                          <span className="transition-transform group-hover:scale-110">
                            {offering.icon}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800 transition-colors group-hover:text-cyan-700 dark:text-slate-100 dark:group-hover:text-cyan-300">
                            {offering.label}
                          </p>
                        </div>
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
                      </button>
                    );
                  })}
                </div>

                {errors.offerings?.message ? (
                  <FormStatusMessage>{errors.offerings.message}</FormStatusMessage>
                ) : null}
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

                <div className={specializedGlassPanelClassName}>
                  <AuthCheckboxField
                    checked={verificationConsentGiven}
                    contentClassName="gap-1"
                    hint="Sanad AI peut pre-controler vos documents pour accelerer la verification de votre profil."
                    id="specialized-verification-consent"
                    label="I allow Sanad AI to verify my documents."
                    labelClassName="font-semibold text-slate-900 dark:text-white"
                    onCheckedChange={(checked) => {
                      clearErrors(['requiredDocuments', 'additionalDocuments']);
                      setValue('verificationConsentGiven', checked, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                    }}
                  />
                </div>

                <div className="space-y-3">
                  {config.requiredDocuments.map((document, index) => (
                    <SpecializedFileField
                      key={document.id}
                      description={document.description}
                      error={errors.requiredDocuments?.[index]?.fileName?.message}
                      fileName={watchedRequiredDocuments?.[index]?.fileName ?? ''}
                      id={`required-document-${document.id}`}
                      label={document.label}
                      onChange={(file) => {
                        setValue(
                          `requiredDocuments.${index}`,
                          {
                            file,
                            fileName: file?.name ?? '',
                            id: document.id,
                            label: document.label,
                          },
                          { shouldDirty: true, shouldTouch: true, shouldValidate: true },
                        );
                      }}
                    />
                  ))}
                </div>

                <div className={specializedGlassPanelClassName}>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {config.additionalDocumentsTitle}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {config.additionalDocumentsPlaceholder}
                      </p>
                    </div>
                    <Button
                      className="rounded-xl border-cyan-400/30 bg-white/60 text-cyan-700 shadow-none hover:border-cyan-400 hover:bg-cyan-50 dark:bg-slate-900/50 dark:text-cyan-300 dark:hover:bg-cyan-950/30"
                      onClick={() =>
                        additionalDocuments.append({
                          file: null,
                          fileName: '',
                          id: createDocumentId(),
                          name: '',
                        })
                      }
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {additionalDocuments.fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="rounded-2xl border border-cyan-400/20 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-cyan-400/15 dark:bg-slate-800/45"
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <AuthInputField
                            className="flex-1"
                            error={errors.additionalDocuments?.[index]?.name?.message}
                            id={`additional-document-name-${field.id}`}
                            label={config.additionalDocumentsLabel}
                            labelClassName={specializedLabelClassName}
                            contentClassName={specializedInputClassName}
                            placeholder="ISO 9001, agrement, certificat..."
                            {...register(`additionalDocuments.${index}.name`, {
                              setValueAs: sanitizeTextValue,
                            })}
                          />

                          <Button
                            className="mt-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => additionalDocuments.remove(index)}
                            size="icon"
                            type="button"
                            variant="ghost"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <SpecializedFileField
                          error={errors.additionalDocuments?.[index]?.fileName?.message}
                          fileName={watchedAdditionalDocuments?.[index]?.fileName ?? ''}
                          id={`additional-document-file-${field.id}`}
                          label={config.additionalDocumentsLabel}
                          onChange={(file) => {
                            setValue(`additionalDocuments.${index}.file`, file, {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            });
                            setValue(`additionalDocuments.${index}.fileName`, file?.name ?? '', {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-50/70 p-4 text-sm text-cyan-700 dark:bg-cyan-950/25 dark:text-cyan-300">
                  <Shield className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <p>
                    {verificationConsentGiven
                      ? 'Vos documents sont transmis de maniere securisee et peuvent etre pre-controles par Sanad AI avant verification.'
                      : "Vos documents restent requis. Sanad les examinera manuellement et votre fiche publique affichera le badge non verifie tant que la verification n'est pas terminee."}
                  </p>
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-5">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Choisissez votre abonnement
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Selectionnez la formule la plus adaptee a votre activite.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                  {SPECIALIZED_SIGNUP_PLANS.map((plan) => {
                    const selected = selectedPlan === plan.id;

                    return (
                      <button
                        key={plan.id}
                        className={cn(
                          'group relative rounded-3xl border p-5 text-left shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1',
                          selected
                            ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/15 via-white/80 to-blue-500/15 shadow-cyan-500/20 ring-1 ring-cyan-400/30 dark:via-slate-900/65'
                            : 'border-slate-200 bg-white/70 hover:border-cyan-400 hover:bg-cyan-50/50 dark:border-slate-700 dark:bg-slate-800/45 dark:hover:border-cyan-400/70 dark:hover:bg-cyan-950/25',
                        )}
                        onClick={() =>
                          setValue('subscriptionPlan', plan.id, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          })
                        }
                        type="button"
                      >
                        {plan.popular ? (
                          <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg shadow-cyan-500/25">
                            Populaire
                          </span>
                        ) : null}

                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-cyan-600 transition-transform group-hover:scale-105 dark:text-cyan-300">
                          <Check className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {plan.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {plan.description}
                        </p>
                        <div className="mt-4 flex items-end gap-2">
                          <span className="text-3xl font-bold text-slate-900 dark:text-white">
                            {plan.price}
                          </span>
                          <span className="pb-1 text-sm text-slate-500 dark:text-slate-400">
                            DT/{plan.period}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-cyan-700 dark:text-cyan-300">
                          Commission: {plan.commission}
                        </p>

                        <div className="mt-4 space-y-2">
                          {plan.features.map((feature) => (
                            <div
                              key={feature}
                              className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400"
                            >
                              <Check className="mt-0.5 h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        <div
                          className={cn(
                            'mt-5 rounded-xl py-2.5 text-center text-sm font-bold transition-colors',
                            selected
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm shadow-cyan-500/20'
                              : 'bg-slate-100 text-slate-500 group-hover:text-cyan-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:text-cyan-300',
                          )}
                        >
                          {selected ? 'Selectionne' : 'Selectionner'}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {errors.subscriptionPlan?.message ? (
                  <FormStatusMessage>{errors.subscriptionPlan.message}</FormStatusMessage>
                ) : null}
              </div>
            ) : null}

            {errors.root?.submit?.message ? (
              <FormStatusMessage>{errors.root.submit.message}</FormStatusMessage>
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

              {step < 4 ? (
                <Button
                  className="flex-1 border-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-none transition-all hover:scale-[1.02] hover:brightness-100 hover:shadow-[0_0_22px_rgba(6,182,212,0.45)]"
                  onClick={handleContinue}
                  type="button"
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  className="flex-1 border-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-none transition-all hover:scale-[1.02] hover:brightness-100 hover:shadow-[0_0_22px_rgba(6,182,212,0.45)] disabled:hover:scale-100"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? 'Creation du compte...' : 'Creer mon compte'}
                </Button>
              )}
            </div>
          </form>
        </AuthPanel>
      </div>
    </AuthShell>
  );
}
