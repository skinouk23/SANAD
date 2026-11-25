import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Briefcase, Shield } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import type { FieldPath } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { AuthPanel, AuthShell } from '@/features/auth';
import { getProfessionalProviderServiceOptions } from '@/features/auth/config/authCatalog';
import { getDefaultRouteForRuntimeRole } from '@/features/auth/role-policy';
import { getApiErrorMessage } from '@/features/auth/screens/authFlow.helpers';
import {
  createCertification,
  createDiploma,
  getProfessionalNutritionSubtypeOptions,
  PROFESSIONAL_SIGN_UP_PLANS,
  professionalStepFieldNames,
  type ProfessionalSignUpStep,
} from '@/features/auth/screens/professional-signup/professionalSignUp.config';
import {
  uploadProviderSignupDocuments,
  type ProviderSignupDocumentUploadInput,
} from '@/features/auth/providerSignupDocuments';
import {
  ProfessionalAccountStep,
  ProfessionalDocumentsStep,
  ProfessionalServiceStep,
  ProfessionalSignUpStepper,
  ProfessionalSubscriptionStep,
} from '@/features/auth/screens/professional-signup/ProfessionalSignUpSections';
import {
  type ProfessionalSignUpFormValues,
  ProfessionalSignUpFormSchema,
} from '@/features/auth/schema';
import { isNutritionProviderCategory } from '@/features/providers';
import { cn } from '@/shared/lib/utils';
import { FormStatusMessage } from '@/shared/ui/composites/form-field';
import { Button } from '@/shared/ui/primitives/button';
import { Spinner } from '@/shared/ui/primitives/spinner';
import { createDefaultTunisiaPhoneValue, getPasswordStrength } from '@/utils/input-validation';

function collectProfessionalSignupDocuments(
  values: ProfessionalSignUpFormValues,
): ProviderSignupDocumentUploadInput[] {
  const documents: ProviderSignupDocumentUploadInput[] = [];

  if (values.licenseFile) {
    documents.push({
      documentType: 'license',
      documentName: values.license || values.licenseFile.name,
      file: values.licenseFile,
    });
  }

  if (values.identityFile) {
    documents.push({
      documentType: 'id_card',
      documentName: values.identityFile.name,
      file: values.identityFile,
    });
  }

  for (const diploma of values.diplomas) {
    if (diploma.file) {
      documents.push({
        documentType: 'diploma',
        documentName: diploma.name || diploma.file.name,
        file: diploma.file,
      });
    }
  }

  for (const certification of values.certifications) {
    if (certification.file) {
      documents.push({
        documentType: 'certification',
        documentName: certification.name || certification.file.name,
        file: certification.file,
      });
    }
  }

  return documents;
}

export function ProfessionalSignUpScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<ProfessionalSignUpStep>(1);

  const availableServices = useMemo(() => getProfessionalProviderServiceOptions(t), [t]);
  const nutritionSubtypeOptions = useMemo(() => getProfessionalNutritionSubtypeOptions(t), [t]);

  const {
    control,
    formState: { errors, isSubmitting },
    clearErrors,
    handleSubmit,
    register,
    setError,
    setValue,
    trigger,
    watch,
  } = useForm<ProfessionalSignUpFormValues>({
    defaultValues: {
      address: '',
      certifications: [],
      city: '',
      confirmPassword: '',
      diplomas: [],
      email: '',
      experience: '',
      firstName: '',
      identityFile: null,
      identityFileName: '',
      lastName: '',
      license: '',
      licenseFile: null,
      licenseFileName: '',
      nutritionProviderSubtype: '',
      password: '',
      phone: createDefaultTunisiaPhoneValue(),
      serviceType: '',
      subscriptionPlan: '',
      termsAccepted: false,
      useSameAccount: false,
      userType: 'professional',
      verificationConsentGiven: true,
    },
    mode: 'onBlur',
    resolver: zodResolver(ProfessionalSignUpFormSchema),
  });

  const diplomaFieldArray = useFieldArray({ control, name: 'diplomas' });
  const certificationFieldArray = useFieldArray({ control, name: 'certifications' });

  const password = watch('password');
  const passwordStrength = getPasswordStrength(password ?? '');
  const selectedPlan = watch('subscriptionPlan');
  const selectedServiceType = watch('serviceType');
  const nutritionProviderSubtype = watch('nutritionProviderSubtype');
  const diplomas = watch('diplomas');
  const certifications = watch('certifications');
  const identityFileName = watch('identityFileName');
  const licenseFileName = watch('licenseFileName');
  const termsAccepted = watch('termsAccepted');
  const useSameAccount = watch('useSameAccount');
  const verificationConsentGiven = watch('verificationConsentGiven');
  const isNutritionProvider = isNutritionProviderCategory(selectedServiceType || null);

  const clearSubmitError = () => {
    if (errors.root?.submit?.message) {
      clearErrors('root.submit');
    }
  };

  const goBack = () => {
    clearSubmitError();

    if (step === 1) {
      navigate('/auth/onboarding');
      return;
    }

    setStep((current) => (current - 1) as ProfessionalSignUpStep);
  };

  const validateCurrentStep = async () => {
    const fields =
      step === 2 && selectedServiceType !== 'nutrition'
        ? (['serviceType'] as FieldPath<ProfessionalSignUpFormValues>[])
        : (professionalStepFieldNames[step] as FieldPath<ProfessionalSignUpFormValues>[]);

    return trigger(fields, { shouldFocus: true });
  };

  const handleContinue = async () => {
    clearSubmitError();

    const isValid = await validateCurrentStep();

    if (!isValid || step === 4) {
      return;
    }

    setStep((current) => (current + 1) as ProfessionalSignUpStep);
  };

  const handleSelectServiceType = (
    serviceType: NonNullable<ProfessionalSignUpFormValues['serviceType']>,
  ) => {
    clearSubmitError();
    setValue('serviceType', serviceType, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    if (serviceType !== 'nutrition') {
      setValue('nutritionProviderSubtype', '', {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  };

  const handleSelectNutritionSubtype = (
    value: NonNullable<ProfessionalSignUpFormValues['nutritionProviderSubtype']>,
  ) => {
    clearSubmitError();
    setValue('nutritionProviderSubtype', value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onValidSubmit = async (values: ProfessionalSignUpFormValues) => {
    if (!values.serviceType) {
      return;
    }

    try {
      const uploadedDocuments = await uploadProviderSignupDocuments(
        collectProfessionalSignupDocuments(values),
      );

      const registeredUser = await registerUser({
        address: values.address?.trim() || null,
        city: values.city,
        countryCode: 'TN',
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
        phone: values.phone,
        providerApplicationId: uploadedDocuments.applicationId,
        providerDocuments: uploadedDocuments.providerDocuments,
        role: 'provider',
        serviceType: values.serviceType,
        verificationConsentGiven: values.verificationConsentGiven,
        ...(values.serviceType === 'nutrition' && values.nutritionProviderSubtype
          ? { nutritionProviderSubtype: values.nutritionProviderSubtype }
          : {}),
      });

      navigate(getDefaultRouteForRuntimeRole(registeredUser.role), { replace: true });
    } catch (error) {
      setError('root.submit', {
        message: getApiErrorMessage(error, 'Erreur lors de la création du compte'),
      });
    }
  };

  return (
    <AuthShell className={cn('px-4', step === 4 ? 'max-w-5xl' : 'max-w-xl')}>
      <div className="pb-4 sm:py-4">
        <Button
          className="group mb-3 h-auto px-0 text-sm font-medium text-cyan-600 shadow-none transition-colors hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
          onClick={goBack}
          variant="link"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            data-icon="inline-start"
          />
          {t.signup.back}
        </Button>

        <AuthPanel>
          <div className="mb-5 text-center">
            <div className="relative mx-auto mb-3 h-14 w-14">
              <div className="absolute inset-0 animate-pulse rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 opacity-40 blur-md" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25">
                <Briefcase className="h-6 w-6" />
              </div>
            </div>

            <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
              {t.signup.registration}
            </p>
            <h2 className="mb-1 text-xl font-bold text-slate-900 dark:text-white">
              {t.signup.professionalTitle}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.signup.professionalSubtitle}
            </p>
          </div>

          <ProfessionalSignUpStepper step={step} t={t} />

          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onValidSubmit)}>
            <input type="hidden" value="professional" {...register('userType')} />

            {step === 1 ? (
              <ProfessionalAccountStep
                clearSubmitError={clearSubmitError}
                errors={errors}
                hasPassword={Boolean(password)}
                passwordStrengthScore={passwordStrength.score}
                register={register}
                setValue={setValue}
                showPassword={showPassword}
                t={t}
                togglePassword={() => setShowPassword((current) => !current)}
                useSameAccount={Boolean(useSameAccount)}
              />
            ) : null}

            {step === 2 ? (
              <ProfessionalServiceStep
                availableServices={availableServices}
                clearSubmitError={clearSubmitError}
                errors={errors}
                isNutritionProvider={isNutritionProvider}
                nutritionProviderSubtype={nutritionProviderSubtype}
                nutritionSubtypeOptions={nutritionSubtypeOptions}
                onSelectNutritionSubtype={handleSelectNutritionSubtype}
                onSelectServiceType={handleSelectServiceType}
                selectedServiceType={selectedServiceType}
                t={t}
              />
            ) : null}

            {step === 3 ? (
              <ProfessionalDocumentsStep
                certificationFields={certificationFieldArray.fields}
                certifications={certifications}
                clearSubmitError={clearSubmitError}
                diplomaFields={diplomaFieldArray.fields}
                diplomas={diplomas}
                errors={errors}
                identityFileName={identityFileName}
                licenseFileName={licenseFileName}
                onAddCertification={() => certificationFieldArray.append(createCertification())}
                onAddDiploma={() => diplomaFieldArray.append(createDiploma())}
                onRemoveCertification={certificationFieldArray.remove}
                onRemoveDiploma={diplomaFieldArray.remove}
                register={register}
                setValue={setValue}
                t={t}
                verificationConsentGiven={Boolean(verificationConsentGiven)}
              />
            ) : null}

            {step === 4 ? (
              <ProfessionalSubscriptionStep
                clearSubmitError={clearSubmitError}
                errors={errors}
                onSelectPlan={(planId) => {
                  clearSubmitError();
                  setValue('subscriptionPlan', planId, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                onTermsAcceptedChange={(checked) => {
                  clearSubmitError();
                  setValue('termsAccepted', checked, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                plans={PROFESSIONAL_SIGN_UP_PLANS}
                selectedPlan={selectedPlan}
                t={t}
                termsAccepted={Boolean(termsAccepted)}
              />
            ) : null}

            {errors.root?.submit?.message ? (
              <FormStatusMessage>{errors.root.submit.message}</FormStatusMessage>
            ) : null}

            {step < 4 ? (
              <Button
                className="mt-2 h-auto w-full border-0 bg-gradient-to-r from-blue-500 to-purple-500 py-2.5 font-bold text-white shadow-none transition-all hover:scale-[1.02] hover:brightness-100 hover:shadow-[0_0_22px_rgba(139,92,246,0.45)]"
                onClick={handleContinue}
                size="lg"
                type="button"
              >
                {t.signup.continue}
              </Button>
            ) : (
              <Button
                aria-busy={isSubmitting}
                className="mt-2 h-auto w-full border-0 bg-gradient-to-r from-blue-500 to-purple-500 py-2.5 font-bold text-white shadow-none transition-all hover:scale-[1.02] hover:brightness-100 hover:shadow-[0_0_22px_rgba(139,92,246,0.45)] disabled:hover:scale-100"
                disabled={isSubmitting}
                size="lg"
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="text-white" data-icon="inline-start" />
                    Creation du compte en cours...
                  </>
                ) : (
                  t.signup.createMyAccount
                )}
              </Button>
            )}
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              {t.signup.alreadyHaveAccount}{' '}
              <Button
                className="h-auto p-0 font-semibold text-cyan-600 underline transition-colors hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
                onClick={() => navigate('/auth/login')}
                variant="link"
              >
                {t.auth.signIn}
              </Button>
            </p>
          </div>
        </AuthPanel>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <Shield className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>{t.signup.secureRegistration}</span>
        </div>
      </div>
    </AuthShell>
  );
}
