import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Activity, AlertCircle, Globe, Key, Lock, RefreshCw, Smartphone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import {
  useAccountSecurity,
  useChangePassword,
  useRevokeOtherSessions,
  useRevokeSession,
} from '@/features/auth/hooks/useAccountSecurity';
import { AuthInputField, PasswordToggle } from '@/features/auth/components/AuthFormControls';
import {
  type ChangePasswordFormValues,
  ChangePasswordFormSchema,
  type SessionSummary,
} from '@/features/auth/schema';
import { cn } from '@/shared/lib/utils';
import { showErrorToast, showSuccessToast } from '@/shared/lib/notifications/toast';
import { ConfirmDialog } from '@/shared/ui/composites/confirm-dialog';
import { FormSkeleton, ListSkeleton } from '@/shared/ui/composites/loading';
import { FormStatusMessage } from '@/shared/ui/composites/form-field';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

import type { TranslationKeys } from '@/i18n/types';
import type { ApiError } from '@/shared/schemas/api.schema';

interface StatusMessageProps {
  message: string;
  tone: 'error' | 'success';
}

type PendingConfirmAction =
  | {
      type: 'others';
    }
  | {
      session: SessionSummary;
      type: 'session';
    }
  | null;

const EMPTY_PASSWORD_FORM: ChangePasswordFormValues = {
  confirmNewPassword: '',
  currentPassword: '',
  newPassword: '',
};

function formatDateTime(value: string | null, locale: string, fallback: string): string {
  if (!value) {
    return fallback;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedDate);
}

function maskIpAddress(ipAddress: string | null): string {
  if (!ipAddress || ipAddress.trim().length === 0) {
    return '—';
  }

  if (ipAddress.includes(':')) {
    const parts = ipAddress.split(':').filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}:****`;
    }

    return `${ipAddress.slice(0, 4)}****`;
  }

  const octets = ipAddress.split('.');

  if (octets.length === 4) {
    return `${octets[0]}.${octets[1]}.***.***`;
  }

  if (ipAddress.length <= 4) {
    return '****';
  }

  return `${ipAddress.slice(0, 4)}****`;
}

function getDisplayValue(value: string | null): string | null {
  const trimmedValue = value?.trim();

  return trimmedValue && trimmedValue.length > 0 ? trimmedValue : null;
}

function getSessionDisplayName(session: SessionSummary, fallback: string): string {
  return getDisplayValue(session.displayName) ?? getDisplayValue(session.deviceType) ?? fallback;
}

function isMobileSession(session: SessionSummary): boolean {
  const deviceText = [session.displayName, session.deviceType, session.operatingSystem]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return /android|iphone|ipad|mobile|samsung/.test(deviceText);
}

function buildPasswordRequirements(password: string, profile: TranslationKeys['profile']) {
  return [
    {
      isValid: password.length >= 8,
      label: profile.passwordMinLength,
    },
    {
      isValid: /[A-Z]/.test(password),
      label: profile.passwordUppercase,
    },
    {
      isValid: /[a-z]/.test(password),
      label: profile.passwordLowercase,
    },
    {
      isValid: /[0-9]/.test(password),
      label: profile.passwordDigit,
    },
    {
      isValid: /[!@#$%^&*]/.test(password),
      label: profile.passwordSpecialChar,
    },
  ];
}

function isWrongCurrentPasswordError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const apiError = error as ApiError;
  const currentPasswordErrors = apiError.errors?.currentPassword;

  if (apiError.statusCode !== 400) {
    return false;
  }

  if (Array.isArray(currentPasswordErrors)) {
    return currentPasswordErrors.some(
      (message) =>
        typeof message === 'string' && message.toLowerCase().includes('current password'),
    );
  }

  return (
    typeof apiError.message === 'string' &&
    apiError.message.toLowerCase().includes('current password')
  );
}

function StatusMessage({ message, tone }: StatusMessageProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border px-4 py-3 text-sm',
        tone === 'success'
          ? 'border-success/20 bg-success/10 text-success'
          : 'border-destructive/20 bg-destructive/10 text-destructive',
      )}
      role={tone === 'success' ? 'status' : 'alert'}
    >
      {message}
    </div>
  );
}

export function AccountSecuritySection() {
  const { currentLanguage, t } = useLanguage();
  const securityQuery = useAccountSecurity();
  const changePasswordMutation = useChangePassword();
  const revokeSessionMutation = useRevokeSession();
  const revokeOtherSessionsMutation = useRevokeOtherSessions();
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);
  const [pendingConfirmAction, setPendingConfirmAction] = useState<PendingConfirmAction>(null);
  const [submitError, setSubmitError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    clearErrors,
    formState: { errors, isValid },
    handleSubmit,
    register,
    reset,
    setError,
    watch,
  } = useForm<ChangePasswordFormValues>({
    defaultValues: EMPTY_PASSWORD_FORM,
    mode: 'onChange',
    resolver: zodResolver(ChangePasswordFormSchema),
  });

  const securityOverview = securityQuery.data;
  const otherSessions = securityOverview?.sessions.filter((session) => !session.isCurrent) ?? [];
  const newPassword = watch('newPassword') ?? '';
  const passwordRequirements = buildPasswordRequirements(newPassword, t.profile);
  const cardClassName =
    'rounded-2xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50';
  const nestedCardClassName =
    'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/30';
  const mutedTextClassName = 'text-slate-500 dark:text-slate-400';
  const passwordSubmitDisabled = changePasswordMutation.isPending || !isValid;
  const revokeAllDisabled = revokeOtherSessionsMutation.isPending || otherSessions.length === 0;
  const confirmDialogLoading =
    revokeSessionMutation.isPending || revokeOtherSessionsMutation.isPending;

  const clearPasswordFormErrors = () => {
    if (errors.currentPassword?.message) {
      clearErrors('currentPassword');
    }

    if (submitError) {
      setSubmitError('');
    }
  };

  const handlePasswordSubmit = handleSubmit(async (values) => {
    setSubmitError('');

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      await securityQuery.refetch();
      reset(EMPTY_PASSWORD_FORM);
      setSubmitError('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      showSuccessToast(t.profile.passwordChangeSuccess);
    } catch (error) {
      if (isWrongCurrentPasswordError(error)) {
        setError('currentPassword', {
          message: t.profile.wrongCurrentPassword,
        });
        showErrorToast(new Error(t.profile.wrongCurrentPassword), t.profile.wrongCurrentPassword);
        return;
      }

      setSubmitError(getApiErrorMessage(error, t.profile.passwordChangeError));
      showErrorToast(error, t.profile.passwordChangeError);
    }
  });

  const handleConfirmRevoke = async () => {
    if (!pendingConfirmAction) {
      return;
    }

    if (pendingConfirmAction.type === 'session') {
      setRevokingSessionId(pendingConfirmAction.session.id);

      try {
        await revokeSessionMutation.mutateAsync(pendingConfirmAction.session.id);
        await securityQuery.refetch();
        showSuccessToast(t.profile.sessionRevoked);
      } catch (error) {
        showErrorToast(error, t.common.error);
      } finally {
        setRevokingSessionId(null);
        setPendingConfirmAction(null);
      }

      return;
    }

    try {
      await revokeOtherSessionsMutation.mutateAsync();
      await securityQuery.refetch();
      showSuccessToast(t.profile.allSessionsRevoked);
    } catch (error) {
      showErrorToast(error, t.common.error);
    } finally {
      setPendingConfirmAction(null);
    }
  };

  return (
    <>
      <section className={`${cardClassName} p-4 sm:p-6`} aria-labelledby="account-security-heading">
        <h2 id="account-security-heading" className="sr-only">
          {t.profile.security}
        </h2>

        {securityQuery.error && securityOverview ? (
          <div className="mt-5">
            <StatusMessage
              message={getApiErrorMessage(securityQuery.error, t.common.loadingError)}
              tone="error"
            />
          </div>
        ) : null}

        {securityQuery.isPending && !securityOverview ? (
          <div className="mt-6 space-y-4" aria-live="polite">
            <FormSkeleton className="border-border/70 bg-card/95 shadow-sm" fields={3} />
            <ListSkeleton items={2} />
          </div>
        ) : null}

        {!securityQuery.isPending && !securityOverview && securityQuery.error ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/30">
            <StatusMessage
              message={getApiErrorMessage(securityQuery.error, t.common.loadingError)}
              tone="error"
            />
            <button
              type="button"
              onClick={() => {
                void securityQuery.refetch();
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            >
              <RefreshCw className="h-4 w-4" />
              {t.common.retry}
            </button>
          </div>
        ) : null}

        {securityOverview ? (
          <div className="space-y-6">
            <div className={`rounded-2xl border p-5 ${nestedCardClassName}`}>
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <Key className="h-4 w-4 text-amber-500" />
                  {t.profile.changePassword}
                </h3>
                <p className={`mt-1 text-sm ${mutedTextClassName}`}>
                  {t.profile.passwordRequirements}
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <AuthInputField
                    autoComplete="current-password"
                    contentClassName="rounded-xl border-border bg-input"
                    disabled={changePasswordMutation.isPending}
                    endAdornment={
                      <PasswordToggle
                        onToggle={() => setShowCurrentPassword((current) => !current)}
                        visible={showCurrentPassword}
                      />
                    }
                    error={errors.currentPassword?.message}
                    icon={<Lock className="h-4 w-4" />}
                    id="account-security-current-password"
                    label={t.profile.currentPassword}
                    type={showCurrentPassword ? 'text' : 'password'}
                    {...register('currentPassword', {
                      onChange: clearPasswordFormErrors,
                    })}
                  />

                  <AuthInputField
                    autoComplete="new-password"
                    contentClassName="rounded-xl border-border bg-input"
                    disabled={changePasswordMutation.isPending}
                    endAdornment={
                      <PasswordToggle
                        onToggle={() => setShowNewPassword((current) => !current)}
                        visible={showNewPassword}
                      />
                    }
                    error={errors.newPassword?.message}
                    icon={<Lock className="h-4 w-4" />}
                    id="account-security-new-password"
                    label={t.profile.newPassword}
                    type={showNewPassword ? 'text' : 'password'}
                    {...register('newPassword', {
                      onChange: () => {
                        if (submitError) {
                          setSubmitError('');
                        }
                      },
                    })}
                  />
                </div>

                <AuthInputField
                  autoComplete="new-password"
                  contentClassName="rounded-xl border-border bg-input"
                  disabled={changePasswordMutation.isPending}
                  endAdornment={
                    <PasswordToggle
                      onToggle={() => setShowConfirmPassword((current) => !current)}
                      visible={showConfirmPassword}
                    />
                  }
                  error={errors.confirmNewPassword?.message}
                  icon={<Lock className="h-4 w-4" />}
                  id="account-security-confirm-password"
                  label={t.profile.confirmNewPassword}
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmNewPassword', {
                    onChange: () => {
                      if (submitError) {
                        setSubmitError('');
                      }
                    },
                  })}
                />

                {submitError ? <FormStatusMessage>{submitError}</FormStatusMessage> : null}

                <div className={`rounded-2xl border p-4 ${nestedCardClassName}`}>
                  <p className="text-sm font-semibold text-foreground">
                    {t.profile.passwordRequirements}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {passwordRequirements.map((requirement) => (
                      <li
                        key={requirement.label}
                        className={`flex items-center gap-2 text-sm ${
                          requirement.isValid ? 'text-success' : mutedTextClassName
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
                            requirement.isValid
                              ? 'bg-success/10 text-success'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {requirement.isValid ? '✓' : '•'}
                        </span>
                        <span>{requirement.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={passwordSubmitDisabled}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {changePasswordMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : null}
                    {t.profile.changePassword}
                  </button>
                </div>
              </form>
            </div>

            <div className={`rounded-2xl border p-4 ${nestedCardClassName}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <Activity className="h-4 w-4 text-green-500" />
                  {t.profile.activeSessions}
                </h3>

                <button
                  type="button"
                  disabled={revokeAllDisabled}
                  onClick={() => {
                    setPendingConfirmAction({ type: 'others' });
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                >
                  {revokeOtherSessionsMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : null}
                  {t.profile.revokeAllOtherSessions}
                </button>
              </div>

              {otherSessions.length === 0 ? (
                <div
                  className={`mt-4 rounded-xl border px-3 py-2 text-sm ${nestedCardClassName} ${mutedTextClassName}`}
                >
                  {t.profile.noOtherSessions}
                </div>
              ) : null}

              <div className="mt-4 space-y-2" role="list">
                {securityOverview.sessions.map((session) => {
                  const isRevokingThisSession =
                    revokeSessionMutation.isPending && revokingSessionId === session.id;
                  const SessionIcon = isMobileSession(session) ? Smartphone : Globe;
                  const displayName = getSessionDisplayName(session, t.common.noData);
                  const sessionMetadata = [
                    {
                      label: 'IP',
                      value: maskIpAddress(session.ipAddress),
                    },
                    {
                      label: t.profile.sessionCreated,
                      value: formatDateTime(
                        session.createdAt,
                        currentLanguage.code,
                        t.common.noData,
                      ),
                    },
                    {
                      label: t.profile.sessionExpires,
                      value: formatDateTime(
                        session.expiresAt,
                        currentLanguage.code,
                        t.common.noData,
                      ),
                    },
                  ];

                  return (
                    <div
                      key={session.id}
                      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800/60 sm:flex-row sm:items-center sm:justify-between"
                      role="listitem"
                    >
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
                          <SessionIcon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="min-w-0 truncate text-sm font-medium text-foreground">
                              {displayName}
                            </p>
                            {session.isCurrent ? (
                              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-emerald-600 dark:text-emerald-400">
                                {t.profile.currentSession}
                              </span>
                            ) : null}
                          </div>

                          <div
                            className={`mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs ${mutedTextClassName}`}
                          >
                            {sessionMetadata.map((item, index) => (
                              <span key={item.label} className="inline-flex items-center gap-2">
                                {index > 0 ? <span aria-hidden="true">•</span> : null}
                                <span>
                                  {item.label}: {item.value}
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {!session.isCurrent ? (
                        <button
                          type="button"
                          disabled={isRevokingThisSession || revokeOtherSessionsMutation.isPending}
                          onClick={() => {
                            setPendingConfirmAction({ session, type: 'session' });
                          }}
                          className="inline-flex items-center justify-center gap-1.5 self-start rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 sm:self-center"
                        >
                          {isRevokingThisSession ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          ) : null}
                          {t.profile.revokeSession}
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {securityOverview.sessions.length === 0 ? (
                <div className="mt-5 flex items-center gap-2 text-sm text-warning">
                  <AlertCircle className="h-4 w-4" />
                  <span>{t.common.noData}</span>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>

      <ConfirmDialog
        cancelLabel={t.common.cancel}
        confirmLabel={
          pendingConfirmAction?.type === 'others'
            ? t.profile.revokeAllOtherSessions
            : t.profile.revokeSession
        }
        description={
          pendingConfirmAction?.type === 'others'
            ? t.profile.revokeAllConfirm
            : t.profile.revokeSessionConfirm
        }
        destructive
        loading={confirmDialogLoading}
        onConfirm={() => {
          void handleConfirmRevoke();
        }}
        onOpenChange={(open) => {
          if (!open && !confirmDialogLoading) {
            setPendingConfirmAction(null);
          }
        }}
        open={pendingConfirmAction !== null}
        title={
          pendingConfirmAction?.type === 'others'
            ? t.profile.revokeAllOtherSessions
            : t.profile.revokeSession
        }
      />
    </>
  );
}
