import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle, Lock, Mail, MapPin, Phone, Shield, User } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import {
  AuthCheckboxField,
  AuthInputField,
  AuthPanel,
  AuthSelectField,
  AuthShell,
  PasswordStrengthMeter,
  PasswordToggle,
} from '@/features/auth';
import { getDefaultRouteForRuntimeRole } from '@/features/auth/role-policy';
import { type SignUpFormValues, SignUpFormSchema } from '@/features/auth/schema';
import { getApiErrorMessage, sanitizeTextValue } from '@/features/auth/screens/authFlow.helpers';
import {
  getSignUpVariantConfig,
  SIGN_UP_CITY_OPTIONS,
} from '@/features/auth/screens/sign-up/signUp.constants';
import { FormStatusMessage } from '@/shared/ui/composites/form-field';
import { Button } from '@/shared/ui/primitives/button';
import { FieldGroup } from '@/shared/ui/primitives/field';
import { Spinner } from '@/shared/ui/primitives/spinner';
import { auditLogger } from '@/utils/audit-logger';
import { consentManager } from '@/utils/consent-manager';
import {
  createDefaultTunisiaPhoneValue,
  getPasswordStrength,
  TUNISIA_PHONE_PLACEHOLDER,
} from '@/utils/input-validation';

export function SignUpScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { register: registerUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const requestedUserType = searchParams.get('type');
  const userType = requestedUserType === 'professional' ? 'professional' : 'patient';
  const currentConfig = useMemo(() => getSignUpVariantConfig(t)[userType], [t, userType]);
  const variantClassNames: Record<
    'patient' | 'professional',
    { buttonGlow: string; gradient: string }
  > = {
    patient: {
      buttonGlow: 'hover:shadow-[0_0_22px_rgba(6,182,212,0.45)]',
      gradient: 'from-cyan-500 to-blue-500',
    },
    professional: {
      buttonGlow: 'hover:shadow-[0_0_22px_rgba(139,92,246,0.45)]',
      gradient: 'from-blue-500 to-purple-500',
    },
  };
  const currentVariantClassNames = variantClassNames[userType];
  const labelClassName =
    'mb-1 text-[10px] font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400';
  const inputClassName =
    'rounded-lg border-slate-300 bg-white text-sm text-slate-900 focus-within:border-cyan-500 focus-within:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white';

  useEffect(() => {
    if (userType === 'professional') {
      navigate('/auth/signup/professional', { replace: true });
    }
  }, [navigate, userType]);

  const {
    formState: { errors, isSubmitting },
    clearErrors,
    control,
    handleSubmit,
    register,
    setError,
    setValue,
    watch,
  } = useForm<SignUpFormValues>({
    defaultValues: {
      city: '',
      confirmPassword: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      phone: createDefaultTunisiaPhoneValue(),
      termsAccepted: false,
      userType,
    },
    mode: 'onBlur',
    resolver: zodResolver(SignUpFormSchema),
  });

  const password = watch('password');
  const passwordStrength = getPasswordStrength(password ?? '');
  const termsAccepted = watch('termsAccepted');

  const clearSubmitError = () => {
    if (errors.root?.submit?.message) {
      clearErrors('root.submit');
    }
  };

  const onValidSubmit = async (values: SignUpFormValues) => {
    consentManager.grantConsent('essential', 'explicit');
    consentManager.grantConsent('health_data', 'explicit');

    auditLogger.log('AUTH_LOGIN_ATTEMPT', 'Signup form submitted', {
      severity: 'info',
      details: {
        city: values.city,
        userType: values.userType,
      },
    });

    try {
      const role = values.userType === 'professional' ? 'provider' : 'patient';

      const registeredUser = await registerUser({
        city: values.city,
        countryCode: 'TN',
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
        phone: values.phone,
        role,
      });

      auditLogger.log('AUTH_LOGIN_SUCCESS', 'Account created successfully', {
        severity: 'info',
      });

      navigate(getDefaultRouteForRuntimeRole(registeredUser.role), { replace: true });
    } catch (error) {
      setError('root.submit', {
        message: getApiErrorMessage(error, 'Erreur lors de la creation du compte'),
      });
    }
  };

  const onInvalidSubmit = (fieldErrors: typeof errors) => {
    auditLogger.log('AUTH_LOGIN_FAILURE', 'Signup validation failed', {
      severity: 'info',
      details: {
        errorFields: Object.keys(fieldErrors).filter((key) => key !== 'root'),
      },
    });
  };

  return (
    <AuthShell className="max-w-xl">
      <div className="pb-4 sm:py-4">
        <Button
          className="group mb-3 h-auto px-0 text-sm font-medium text-cyan-600 shadow-none transition-colors hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
          onClick={() => navigate('/auth/onboarding')}
          variant="link"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            data-icon="inline-start"
          />
          {t.common.back}
        </Button>

        <AuthPanel>
          <div className="mb-5 text-center">
            <div className="relative mx-auto mb-3 h-14 w-14">
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${currentVariantClassNames.gradient} opacity-40 blur-md animate-pulse`}
              />
              <div
                className={`relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${currentVariantClassNames.gradient} text-2xl`}
              >
                {currentConfig.icon}
              </div>
            </div>

            <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
              {t.signup.registration}
            </p>
            <h2 className="mb-1 text-xl font-bold text-slate-900 dark:text-white">
              {currentConfig.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{currentConfig.subtitle}</p>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
          >
            <input type="hidden" value={userType} {...register('userType')} />

            <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <AuthInputField
                autoComplete="given-name"
                error={errors.firstName?.message}
                icon={<User />}
                id="signup-first-name"
                label={t.signup.firstName}
                labelClassName={labelClassName}
                contentClassName={inputClassName}
                placeholder={t.signup.firstName}
                required
                {...register('firstName', {
                  onChange: clearSubmitError,
                  setValueAs: sanitizeTextValue,
                })}
              />

              <AuthInputField
                autoComplete="family-name"
                error={errors.lastName?.message}
                id="signup-last-name"
                label={t.signup.lastName}
                labelClassName={labelClassName}
                contentClassName={inputClassName}
                placeholder={t.signup.lastName}
                required
                {...register('lastName', {
                  onChange: clearSubmitError,
                  setValueAs: sanitizeTextValue,
                })}
              />
            </FieldGroup>

            <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <AuthInputField
                autoComplete="email"
                error={errors.email?.message}
                icon={<Mail />}
                id="signup-email"
                label={t.auth.email}
                labelClassName={labelClassName}
                contentClassName={inputClassName}
                placeholder="votre@email.com"
                required
                type="email"
                {...register('email', {
                  onChange: clearSubmitError,
                  setValueAs: sanitizeTextValue,
                })}
              />

              <AuthInputField
                autoComplete="tel"
                error={errors.phone?.message}
                icon={<Phone />}
                id="signup-phone"
                label={t.signup.phone}
                labelClassName={labelClassName}
                contentClassName={inputClassName}
                placeholder={TUNISIA_PHONE_PLACEHOLDER}
                required
                type="tel"
                {...register('phone', { onChange: clearSubmitError })}
              />
            </FieldGroup>

            <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                  icon={<Lock />}
                  id="signup-password"
                  label={t.auth.password}
                  labelClassName={labelClassName}
                  contentClassName={inputClassName}
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { onChange: clearSubmitError })}
                />
                <PasswordStrengthMeter empty={!password} score={passwordStrength.score} />
              </div>

              <AuthInputField
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                icon={<Lock />}
                id="signup-confirm-password"
                label={t.signup.confirmPassword}
                labelClassName={labelClassName}
                contentClassName={inputClassName}
                placeholder="••••••••"
                required
                type={showPassword ? 'text' : 'password'}
                {...register('confirmPassword', { onChange: clearSubmitError })}
              />
            </FieldGroup>

            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <AuthSelectField
                  ref={field.ref}
                  error={errors.city?.message}
                  icon={<MapPin />}
                  id="signup-city"
                  label={t.signup.city}
                  labelClassName={labelClassName}
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={(event) => {
                    clearSubmitError();
                    field.onChange(event.target.value);
                  }}
                  options={[{ label: t.signup.selectCity, value: '' }, ...SIGN_UP_CITY_OPTIONS]}
                  required
                  contentClassName={inputClassName}
                  value={field.value}
                />
              )}
            />

            <AuthCheckboxField
              checked={Boolean(termsAccepted)}
              className="pt-1"
              contentClassName="gap-0.5"
              error={errors.termsAccepted?.message}
              id="signup-terms"
              label={
                <>
                  {t.signup.acceptTerms}{' '}
                  <a
                    className="font-medium text-cyan-600 underline underline-offset-2 transition-colors hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
                    href="#"
                  >
                    {t.signup.termsOfUse}
                  </a>{' '}
                  {t.signup.and}{' '}
                  <a
                    className="font-medium text-cyan-600 underline underline-offset-2 transition-colors hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
                    href="#"
                  >
                    {t.signup.privacyPolicy}
                  </a>
                </>
              }
              labelClassName="block text-[11px] leading-tight text-slate-600 dark:text-slate-400"
              onCheckedChange={(checked) => {
                clearSubmitError();
                setValue('termsAccepted', checked, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }}
            />

            {errors.root?.submit?.message ? (
              <FormStatusMessage>{errors.root.submit.message}</FormStatusMessage>
            ) : null}

            <Button
              aria-busy={isSubmitting}
              className={`mt-2 h-auto w-full overflow-hidden border-0 bg-gradient-to-r ${currentVariantClassNames.gradient} py-2.5 text-sm font-bold text-white shadow-none transition-all hover:scale-[1.02] hover:brightness-100 ${currentVariantClassNames.buttonGlow} disabled:hover:scale-100`}
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
                <>
                  <CheckCircle data-icon="inline-start" />
                  {t.signup.createMyAccount}
                </>
              )}
            </Button>
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
