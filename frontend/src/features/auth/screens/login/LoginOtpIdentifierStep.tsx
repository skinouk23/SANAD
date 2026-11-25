import type { FormEventHandler } from 'react';
import { ArrowRight, Mail, Phone, User } from 'lucide-react';
import type { AuthProviderServiceOption } from '@/features/auth/config/authCatalog';
import type { OtpChannel } from '@/features/auth/schema';
import type { TranslationKeys } from '@/i18n/types';
import { cn } from '@/shared/lib/utils';
import { AuthCheckboxField, AuthInputField } from '@/features/auth/components/AuthFormControls';
import { Button } from '@/shared/ui/primitives/button';
import { FieldGroup } from '@/shared/ui/primitives/field';
import { FormStatusMessage } from '@/shared/ui/composites/form-field';
import { Spinner } from '@/shared/ui/primitives/spinner';

interface LoginOtpIdentifierStepProps {
  accountType: 'patient' | 'professional';
  channel: OtpChannel;
  email: string;
  emailError?: string;
  isSubmitting: boolean;
  onChannelChange: (channel: OtpChannel) => void;
  onEmailChange: (email: string) => void;
  onPhoneChange: (phoneNumber: string) => void;
  onResetSelection: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onUsePassword: () => void;
  phoneError?: string;
  phoneNumber: string;
  rememberMe: boolean;
  selectedService: AuthProviderServiceOption | null;
  setRememberMe: (checked: boolean) => void;
  submitError: string;
  t: TranslationKeys;
}

export function LoginOtpIdentifierStep({
  accountType,
  channel,
  email,
  emailError,
  isSubmitting,
  onChannelChange,
  onEmailChange,
  onPhoneChange,
  onResetSelection,
  onSubmit,
  onUsePassword,
  phoneError,
  phoneNumber,
  rememberMe,
  selectedService,
  setRememberMe,
  submitError,
  t,
}: LoginOtpIdentifierStepProps) {
  const isEmail = channel === 'email';
  const labelClassName = 'mb-1.5 text-[11px] font-bold uppercase tracking-wide text-cyan-600';
  const inputClassName =
    'h-12 rounded-xl border-slate-300 bg-slate-50/90 text-base text-slate-900 transition-all focus-within:border-cyan-500 focus-within:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white [&_[data-slot=input-group-addon]]:px-3';

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex min-h-14 items-center gap-3 rounded-xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-500/30 dark:bg-slate-800/50">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 text-white">
          {selectedService ? selectedService.icon : <User className="h-4 w-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
            {t.auth.loginAs}
          </p>
          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
            {accountType === 'patient'
              ? t.auth.patient
              : selectedService?.label || t.auth.professional}
          </p>
        </div>
        <Button
          className="h-auto min-h-10 px-2 text-xs font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
          variant="link"
          type="button"
          onClick={onResetSelection}
        >
          {t.auth.change}
        </Button>
      </div>

      <div className="grid h-14 grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        <button
          aria-pressed={isEmail}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all',
            isEmail
              ? 'bg-white text-cyan-600 shadow-sm dark:bg-slate-900 dark:text-cyan-400'
              : 'text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300',
          )}
          onClick={() => onChannelChange('email')}
          type="button"
        >
          <Mail className="h-4 w-4" />
          {t.auth.email}
        </button>
        <button
          aria-pressed={!isEmail}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all',
            !isEmail
              ? 'bg-white text-cyan-600 shadow-sm dark:bg-slate-900 dark:text-cyan-400'
              : 'text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300',
          )}
          onClick={() => onChannelChange('sms')}
          type="button"
        >
          <Phone className="h-4 w-4" />
          {t.auth.sms}
        </button>
      </div>

      <FieldGroup className="gap-3">
        {isEmail ? (
          <AuthInputField
            autoComplete="email"
            disabled={isSubmitting}
            error={emailError}
            icon={<Mail className="size-4" />}
            id="otp-login-email"
            label={t.auth.emailAddress}
            labelClassName={labelClassName}
            contentClassName={inputClassName}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="vous@exemple.com"
            required
            type="email"
            value={email}
          />
        ) : (
          <AuthInputField
            autoComplete="tel"
            disabled={isSubmitting}
            error={phoneError}
            icon={<Phone className="size-4" />}
            id="otp-login-phone"
            label={t.auth.phoneNumber}
            labelClassName={labelClassName}
            contentClassName={inputClassName}
            onChange={(event) => onPhoneChange(event.target.value)}
            placeholder="+216 55 555 555"
            required
            type="tel"
            value={phoneNumber}
          />
        )}

        <AuthCheckboxField
          checked={rememberMe}
          id="otp-login-remember-me"
          label={t.auth.rememberMe}
          labelClassName="text-xs text-slate-600 transition-colors group-hover/field:text-slate-900 dark:text-slate-400 dark:group-hover/field:text-white"
          onCheckedChange={setRememberMe}
        />
      </FieldGroup>

      {submitError ? (
        <FormStatusMessage className="text-center text-xs" role="alert">
          {submitError}
        </FormStatusMessage>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="min-h-16 w-full overflow-hidden border-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-base font-bold text-white shadow-none transition-all hover:brightness-105 hover:shadow-[0_0_22px_rgba(6,182,212,0.35)] disabled:hover:shadow-none sm:min-h-14"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Spinner data-icon="inline-start" /> {t.common.loading}
          </>
        ) : (
          <>
            {t.auth.continue}
            <ArrowRight data-icon="inline-end" className="h-5 w-5" />
          </>
        )}
      </Button>

      <Button
        className="mx-auto h-auto min-h-10 px-2 text-xs font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
        variant="link"
        type="button"
        onClick={onUsePassword}
      >
        {t.auth.usePasswordInstead}
      </Button>
    </form>
  );
}
