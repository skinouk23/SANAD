import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { ForgotPasswordDialog } from '@/features/auth/components/ForgotPasswordDialog';
import { AuthPanel, AuthShell } from '@/features/auth/components/AuthShell';
import { SanadBrandBadge } from '@/features/auth/components/SanadBrandBadge';
import { getLoginProviderServiceOptions } from '@/features/auth/config/authCatalog';
import { getDefaultRouteForRuntimeRole } from '@/features/auth/role-policy';
import {
  type LoginFormValues,
  LoginFormSchema,
  type OtpChannel,
  OtpCodeFormSchema,
  OtpIdentifierFormSchema,
  type RequestLoginOtpResponse,
} from '@/features/auth/schema';
import { type ProviderCategory } from '@/features/providers/providerAuthoring';
import { ComplianceBadges } from '@/shared/ui/composites/compliance-badges';
import { getApiErrorMessage, sanitizeTextValue } from '@/features/auth/screens/authFlow.helpers';
import { checkRateLimit } from '@/utils/security';
import { auditLogger } from '@/utils/audit-logger';
import { createDefaultTunisiaPhoneValue, formatTunisiaPhoneInput } from '@/utils/input-validation';
import { LoginFormStep } from './login/LoginFormStep';
import { LoginOtpCodeStep } from './login/LoginOtpCodeStep';
import { LoginOtpIdentifierStep } from './login/LoginOtpIdentifierStep';
import { LoginSelectionStep } from './login/LoginSelectionStep';

type AccountType = 'patient' | 'professional';
type Step = 'select' | 'otpIdentifier' | 'otpCode' | 'passwordLogin';

function getProviderReviewLoginMessage(message: string): string | null {
  const normalizedMessage = message
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (/(reject|rejet|refus|declin|denied|abgelehnt|afgewezen)/.test(normalizedMessage)) {
    return "Votre demande prestataire a ete refusee. Consultez l'e-mail de decision ou contactez le support Sanad pour corriger votre dossier.";
  }

  if (
    /(pending|review|approval|approve|under review|attente|validation|approbation|examen|ausstehend|beoordeling)/.test(
      normalizedMessage,
    )
  ) {
    return "Votre compte prestataire est en cours d'examen. Un administrateur doit approuver votre dossier et vos documents avant que la connexion soit active.";
  }

  return null;
}

export function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, requestLoginOtp, verifyLoginOtp, authError } = useAuth();
  const { t } = useLanguage();
  const searchParams = new URLSearchParams(location.search);
  const urlType = searchParams.get('type');
  const [step, setStep] = useState<Step>('select');
  const [accountType, setAccountType] = useState<AccountType>(
    urlType === 'professional' ? 'professional' : 'patient',
  );
  const [selectedService, setSelectedService] = useState<ProviderCategory | ''>('');
  const [otpChannel, setOtpChannel] = useState<OtpChannel>('email');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpPhoneNumber, setOtpPhoneNumber] = useState(createDefaultTunisiaPhoneValue);
  const [otpChallenge, setOtpChallenge] = useState<RequestLoginOtpResponse | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [otpEmailError, setOtpEmailError] = useState('');
  const [otpPhoneError, setOtpPhoneError] = useState('');
  const [otpCodeError, setOtpCodeError] = useState('');
  const [otpSubmitError, setOtpSubmitError] = useState('');
  const [otpRequestSubmitting, setOtpRequestSubmitting] = useState(false);
  const [otpVerifySubmitting, setOtpVerifySubmitting] = useState(false);
  const [otpResendSubmitting, setOtpResendSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;
  const safeReturnTo = useMemo(() => {
    const normalizedReturnTo = returnTo?.trim();

    if (!normalizedReturnTo || !normalizedReturnTo.startsWith('/')) {
      return undefined;
    }

    if (normalizedReturnTo === '/admin' || normalizedReturnTo.startsWith('/admin/')) {
      return undefined;
    }

    return normalizedReturnTo;
  }, [returnTo]);

  const providerServiceOptions = useMemo(() => getLoginProviderServiceOptions(t), [t]);

  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onBlur',
    resolver: zodResolver(LoginFormSchema),
  });

  const rememberMe = watch('rememberMe') ?? false;
  const selectedServiceInfo = providerServiceOptions.find(
    (service) => service.serviceType === selectedService,
  );
  const isOtpStep = step === 'otpIdentifier' || step === 'otpCode';

  useEffect(() => {
    if (resendCooldown <= 0) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [resendCooldown]);

  const clearSubmitError = useCallback(() => {
    if (submitError) {
      setSubmitError('');
    }
  }, [submitError]);

  const clearOtpErrors = useCallback(() => {
    setOtpEmailError('');
    setOtpPhoneError('');
    setOtpCodeError('');
    setOtpSubmitError('');
  }, []);

  const resetOtpState = useCallback(() => {
    setOtpChannel('email');
    setOtpEmail('');
    setOtpPhoneNumber(createDefaultTunisiaPhoneValue());
    setOtpChallenge(null);
    setOtpCode('');
    setOtpEmailError('');
    setOtpPhoneError('');
    setOtpCodeError('');
    setOtpSubmitError('');
    setOtpRequestSubmitting(false);
    setOtpVerifySubmitting(false);
    setOtpResendSubmitting(false);
    setResendCooldown(0);
  }, []);

  const resetLoginForm = useCallback(() => {
    reset({
      email: '',
      password: '',
      rememberMe: false,
    });
    clearErrors();
    setSubmitError('');
    setShowPassword(false);
  }, [clearErrors, reset]);

  const resetAuthEntryState = useCallback(() => {
    resetLoginForm();
    resetOtpState();
  }, [resetLoginForm, resetOtpState]);

  const handleAccountTypeSelect = useCallback(
    (type: AccountType) => {
      setAccountType(type);
      resetAuthEntryState();

      if (type === 'patient') {
        setSelectedService('');
        setStep('otpIdentifier');
      }
    },
    [resetAuthEntryState],
  );

  const handleServiceSelect = useCallback(
    (serviceType: ProviderCategory) => {
      resetAuthEntryState();
      setSelectedService(serviceType);
      setAccountType('professional');
      setStep('otpIdentifier');
    },
    [resetAuthEntryState],
  );

  const handleResetSelection = useCallback(() => {
    setStep('select');
    setSelectedService('');
    resetAuthEntryState();
  }, [resetAuthEntryState]);

  const handleBack = useCallback(() => {
    if (step === 'otpCode') {
      setStep('otpIdentifier');
      setOtpCode('');
      setOtpCodeError('');
      setOtpSubmitError('');
      return;
    }

    if (
      (step === 'otpIdentifier' || step === 'passwordLogin') &&
      (accountType === 'professional' || urlType === 'professional')
    ) {
      handleResetSelection();
      return;
    }

    if (step === 'otpIdentifier' || step === 'passwordLogin') {
      setStep('select');
      resetAuthEntryState();
      return;
    }

    navigate('/auth/onboarding');
  }, [accountType, handleResetSelection, navigate, resetAuthEntryState, step, urlType]);

  const handleUsePassword = useCallback(() => {
    setStep('passwordLogin');
    setSubmitError('');
    setOtpSubmitError('');
    setOtpCodeError('');
    setOtpEmailError('');
    setOtpPhoneError('');

    if (otpEmail) {
      setValue('email', otpEmail, {
        shouldDirty: true,
        shouldTouch: false,
      });
    }
  }, [otpEmail, setValue]);

  const handleOtpEmailChange = useCallback(
    (email: string) => {
      setOtpEmail(sanitizeTextValue(email));
      clearOtpErrors();
    },
    [clearOtpErrors],
  );

  const handleOtpPhoneChange = useCallback(
    (phoneNumber: string) => {
      setOtpPhoneNumber(formatTunisiaPhoneInput(sanitizeTextValue(phoneNumber)));
      clearOtpErrors();
    },
    [clearOtpErrors],
  );

  const requestOtp = useCallback(
    async (channel: OtpChannel, destination: string) => {
      const request =
        channel === 'email'
          ? {
              channel: 'email' as const,
              email: destination,
              rememberMe,
            }
          : {
              channel: 'sms' as const,
              phoneNumber: destination,
              rememberMe,
            };

      const response = await requestLoginOtp(request);

      setOtpChallenge(response);
      setOtpCode('');
      setResendCooldown(response.resendAvailableIn);
      setStep('otpCode');
      return response;
    },
    [rememberMe, requestLoginOtp],
  );

  const handleRequestOtpSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      clearOtpErrors();

      const parsed = OtpIdentifierFormSchema.safeParse({
        channel: otpChannel,
        email: otpEmail,
        phoneNumber: otpPhoneNumber,
      });

      if (!parsed.success) {
        const emailIssue = parsed.error.flatten().fieldErrors.email?.[0];
        const phoneIssue = parsed.error.flatten().fieldErrors.phoneNumber?.[0];
        setOtpEmailError(emailIssue ?? '');
        setOtpPhoneError(phoneIssue ?? '');
        setOtpSubmitError(emailIssue || phoneIssue ? '' : t.auth.otpRequestError);
        return;
      }

      if (!checkRateLimit('login_otp_form_submit', 5, 60000)) {
        setOtpSubmitError('Trop de tentatives. Veuillez patienter.');
        auditLogger.log('SECURITY_RATE_LIMITED', 'Login OTP form rate limited', {
          severity: 'warning',
        });
        return;
      }

      auditLogger.log('AUTH_LOGIN_ATTEMPT', 'Login OTP form submitted', {
        severity: 'info',
        details: {
          accountType,
          hasService: Boolean(selectedService),
        },
      });

      try {
        setOtpRequestSubmitting(true);
        await requestOtp(
          parsed.data.channel,
          parsed.data.channel === 'email'
            ? (parsed.data.email ?? '')
            : (parsed.data.phoneNumber ?? ''),
        );
      } catch (error) {
        const message = getApiErrorMessage(error, t.auth.otpRequestError);
        setOtpSubmitError(
          accountType === 'professional'
            ? (getProviderReviewLoginMessage(message) ?? message)
            : message,
        );
      } finally {
        setOtpRequestSubmitting(false);
      }
    },
    [
      accountType,
      clearOtpErrors,
      otpChannel,
      otpEmail,
      otpPhoneNumber,
      requestOtp,
      selectedService,
      t.auth.otpRequestError,
    ],
  );

  const handleVerifyOtpSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setOtpCodeError('');
      setOtpSubmitError('');

      if (!otpChallenge) {
        setOtpSubmitError(t.auth.otpRequestError);
        setStep('otpIdentifier');
        return;
      }

      const parsed = OtpCodeFormSchema.safeParse({ code: otpCode });

      if (!parsed.success) {
        setOtpCodeError(parsed.error.flatten().fieldErrors.code?.[0] ?? t.auth.otpVerifyError);
        return;
      }

      try {
        setOtpVerifySubmitting(true);
        const authUser = await verifyLoginOtp(
          {
            challengeId: otpChallenge.challengeId,
            code: parsed.data.code,
            rememberMe,
          },
          selectedService || undefined,
        );

        if (safeReturnTo) {
          navigate(safeReturnTo);
        } else {
          navigate(getDefaultRouteForRuntimeRole(authUser.role));
        }
      } catch (error) {
        const message = getApiErrorMessage(error, t.auth.otpVerifyError);
        setOtpSubmitError(
          accountType === 'professional'
            ? (getProviderReviewLoginMessage(message) ?? message)
            : message,
        );
      } finally {
        setOtpVerifySubmitting(false);
      }
    },
    [
      accountType,
      navigate,
      otpChallenge,
      otpCode,
      rememberMe,
      safeReturnTo,
      selectedService,
      t.auth.otpRequestError,
      t.auth.otpVerifyError,
      verifyLoginOtp,
    ],
  );

  const handleResendOtp = useCallback(async () => {
    const channel = otpChallenge?.channel ?? otpChannel;
    const parsed = OtpIdentifierFormSchema.safeParse({
      channel,
      email: otpEmail,
      phoneNumber: otpPhoneNumber,
    });

    if (!parsed.success) {
      setStep('otpIdentifier');
      setOtpEmailError(parsed.error.flatten().fieldErrors.email?.[0] ?? '');
      setOtpPhoneError(parsed.error.flatten().fieldErrors.phoneNumber?.[0] ?? '');
      setOtpSubmitError(t.auth.otpRequestError);
      return;
    }

    try {
      setOtpResendSubmitting(true);
      setOtpSubmitError('');
      await requestOtp(
        parsed.data.channel,
        parsed.data.channel === 'email'
          ? (parsed.data.email ?? '')
          : (parsed.data.phoneNumber ?? ''),
      );
    } catch (error) {
      setOtpSubmitError(getApiErrorMessage(error, t.auth.otpRequestError));
    } finally {
      setOtpResendSubmitting(false);
    }
  }, [
    otpChallenge?.channel,
    otpChannel,
    otpEmail,
    otpPhoneNumber,
    requestOtp,
    t.auth.otpRequestError,
  ]);

  const handleChangeOtpEmail = useCallback(() => {
    setStep('otpIdentifier');
    setOtpChallenge(null);
    setOtpCode('');
    setOtpCodeError('');
    setOtpSubmitError('');
  }, []);

  const handleLoginSubmit = useCallback(
    async (values: LoginFormValues) => {
      setSubmitError('');

      if (!checkRateLimit('login_submit', 5, 60000)) {
        setSubmitError('Trop de tentatives. Veuillez patienter.');
        auditLogger.log('SECURITY_RATE_LIMITED', 'Login form rate limited', {
          severity: 'warning',
        });
        return;
      }

      auditLogger.log('AUTH_LOGIN_ATTEMPT', 'Login form submitted', {
        severity: 'info',
        details: {
          accountType,
          hasService: Boolean(selectedService),
        },
      });

      try {
        const authUser = await login(
          values.email,
          values.password,
          selectedService || undefined,
          values.rememberMe ?? false,
        );

        if (safeReturnTo) {
          navigate(safeReturnTo);
        } else {
          navigate(getDefaultRouteForRuntimeRole(authUser.role));
        }
      } catch (error) {
        const message = getApiErrorMessage(error, 'Erreur de connexion');
        setSubmitError(
          accountType === 'professional'
            ? (getProviderReviewLoginMessage(message) ?? message)
            : message,
        );
      }
    },
    [accountType, login, navigate, safeReturnTo, selectedService],
  );

  return (
    <>
      <AuthShell className="max-w-md sm:max-w-xl">
        {step !== 'select' && (
          <button
            onClick={handleBack}
            className="group mb-2 inline-flex min-h-11 items-center rounded-lg px-1 text-sm font-medium text-cyan-600 transition-colors hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
            type="button"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {t.auth.change}
          </button>
        )}

        <AuthPanel>
          <div className="mb-4 text-center">
            <SanadBrandBadge label={t.common.brandName || 'Sanad'} />

            <h2 className="mb-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              {step === 'select'
                ? urlType === 'professional'
                  ? t.services.title
                  : t.auth.selectProfile
                : step === 'otpCode'
                  ? t.auth.verificationCode
                  : t.auth.secureLogin}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {step === 'select'
                ? urlType === 'professional'
                  ? t.services.subtitle
                  : t.auth.selectProfile
                : isOtpStep
                  ? t.auth.twoFactorSecure
                  : accountType === 'patient'
                    ? t.auth.accessHealthServices
                    : `Espace ${selectedServiceInfo?.label || t.auth.professional}`}
            </p>
          </div>

          {step === 'select' ? (
            <LoginSelectionStep
              onPatientSelect={() => handleAccountTypeSelect('patient')}
              onProviderServiceSelect={handleServiceSelect}
              providerServiceOptions={providerServiceOptions}
              t={t}
            />
          ) : step === 'otpIdentifier' ? (
            <LoginOtpIdentifierStep
              accountType={accountType}
              channel={otpChannel}
              email={otpEmail}
              emailError={otpEmailError}
              isSubmitting={otpRequestSubmitting}
              onChannelChange={(channel) => {
                setOtpChannel(channel);
                if (channel === 'sms') {
                  setOtpPhoneNumber((currentPhoneNumber) =>
                    createDefaultTunisiaPhoneValue(currentPhoneNumber),
                  );
                }
                clearOtpErrors();
              }}
              onEmailChange={handleOtpEmailChange}
              onPhoneChange={handleOtpPhoneChange}
              onResetSelection={handleResetSelection}
              onSubmit={handleRequestOtpSubmit}
              onUsePassword={handleUsePassword}
              phoneError={otpPhoneError}
              phoneNumber={otpPhoneNumber}
              rememberMe={rememberMe}
              selectedService={selectedServiceInfo ?? null}
              setRememberMe={(checked) => {
                setValue('rememberMe', checked, {
                  shouldDirty: true,
                  shouldTouch: true,
                });
                clearOtpErrors();
              }}
              submitError={otpSubmitError || authError || ''}
              t={t}
            />
          ) : step === 'otpCode' ? (
            <LoginOtpCodeStep
              channel={otpChallenge?.channel ?? otpChannel}
              code={otpCode}
              codeError={otpCodeError}
              destination={
                otpChallenge?.maskedDestination ||
                (otpChannel === 'email' ? otpEmail : otpPhoneNumber)
              }
              isResending={otpResendSubmitting}
              isSubmitting={otpVerifySubmitting}
              onChangeEmail={handleChangeOtpEmail}
              onCodeChange={(value) => {
                setOtpCode(value.replace(/\D/g, '').slice(0, 6));
                setOtpCodeError('');
                setOtpSubmitError('');
              }}
              onResend={handleResendOtp}
              onSubmit={handleVerifyOtpSubmit}
              onUsePassword={handleUsePassword}
              resendCooldown={resendCooldown}
              submitError={otpSubmitError || authError || ''}
              t={t}
            />
          ) : (
            <LoginFormStep
              accountType={accountType}
              authError={authError}
              clearSubmitError={clearSubmitError}
              errors={errors}
              isSubmitting={isSubmitting}
              onForgotPassword={() => setShowForgotPassword(true)}
              onResetSelection={handleResetSelection}
              onSubmit={handleSubmit(handleLoginSubmit)}
              register={register}
              rememberMe={rememberMe}
              selectedService={selectedServiceInfo ?? null}
              setRememberMe={(checked) => {
                setValue('rememberMe', checked, {
                  shouldDirty: true,
                  shouldTouch: true,
                });
                clearSubmitError();
              }}
              showPassword={showPassword}
              submitError={submitError}
              t={t}
              togglePassword={() => setShowPassword((current) => !current)}
            />
          )}

          <div className="mt-5 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.auth.noAccount}{' '}
              <button
                onClick={() => navigate('/auth/onboarding')}
                className="font-semibold text-cyan-600 underline transition-colors hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
                type="button"
              >
                {t.auth.signUp}
              </button>
            </p>
          </div>
        </AuthPanel>

        <div className="mt-3 flex flex-col items-center justify-center gap-2 text-center text-xs text-slate-400 dark:text-slate-500 sm:mt-4 sm:gap-3">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>{isOtpStep ? t.auth.sslEncryption : t.auth.sslSecure}</span>
          </div>
          <div className="hidden origin-top scale-90 sm:block">
            <ComplianceBadges />
          </div>
        </div>
      </AuthShell>

      <ForgotPasswordDialog
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  );
}
