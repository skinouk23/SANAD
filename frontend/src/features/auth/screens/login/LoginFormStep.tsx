import type { FormEventHandler } from 'react';
import { Lock, Mail, Shield, User } from 'lucide-react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { type LoginFormValues } from '@/features/auth/schema';
import {
  AuthCheckboxField,
  AuthInputField,
  PasswordToggle,
} from '@/features/auth/components/AuthFormControls';
import type { AuthProviderServiceOption } from '@/features/auth/config/authCatalog';
import type { TranslationKeys } from '@/i18n/types';
import { sanitizeTextValue } from '@/features/auth/screens/authFlow.helpers';
import { FormStatusMessage } from '@/shared/ui/composites/form-field';
import { Button } from '@/shared/ui/primitives/button';
import { FieldGroup, FieldSeparator } from '@/shared/ui/primitives/field';
import { Spinner } from '@/shared/ui/primitives/spinner';

interface LoginFormStepProps {
  accountType: 'patient' | 'professional';
  authError: string | null;
  clearSubmitError: () => void;
  errors: FieldErrors<LoginFormValues>;
  isSubmitting: boolean;
  onForgotPassword: () => void;
  onResetSelection: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<LoginFormValues>;
  rememberMe: boolean;
  selectedService: AuthProviderServiceOption | null;
  setRememberMe: (checked: boolean) => void;
  showPassword: boolean;
  submitError: string;
  togglePassword: () => void;
  t: TranslationKeys;
}

export function LoginFormStep({
  accountType,
  authError,
  clearSubmitError,
  errors,
  isSubmitting,
  onForgotPassword,
  onResetSelection,
  onSubmit,
  register,
  rememberMe,
  selectedService,
  setRememberMe,
  showPassword,
  submitError,
  togglePassword,
  t,
}: LoginFormStepProps) {
  const labelClassName =
    'mb-1.5 text-xs font-medium tracking-wide text-cyan-600 dark:text-cyan-400';
  const inputClassName =
    'h-12 rounded-xl border-slate-300 bg-white text-base text-slate-900 transition-all focus-within:border-cyan-500 focus-within:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white sm:h-11 sm:text-sm';

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 sm:gap-3">
      {accountType === 'professional' && selectedService ? (
        <div className="flex min-h-16 items-center gap-3 rounded-xl border border-cyan-200 bg-cyan-50 p-3.5 dark:border-cyan-500/30 dark:bg-slate-800/50">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 text-lg">
            {selectedService.icon}
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
              {t.auth.loginAs}
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {selectedService.label}
            </p>
          </div>
          <Button
            className="h-auto min-h-11 px-2 text-xs font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 sm:min-h-0 sm:px-0"
            variant="link"
            type="button"
            onClick={onResetSelection}
          >
            {t.auth.change}
          </Button>
        </div>
      ) : null}

      {accountType === 'patient' ? (
        <div className="flex min-h-16 items-center gap-3 rounded-xl border border-cyan-200 bg-cyan-50 p-3.5 dark:border-cyan-500/30 dark:bg-slate-800/50">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
              {t.auth.loginAs}
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{t.auth.patient}</p>
          </div>
          <Button
            className="h-auto min-h-11 px-2 text-xs font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 sm:min-h-0 sm:px-0"
            variant="link"
            type="button"
            onClick={onResetSelection}
          >
            {t.auth.change}
          </Button>
        </div>
      ) : null}

      <FieldGroup className="gap-3">
        <AuthInputField
          autoComplete="email"
          disabled={isSubmitting}
          error={errors.email?.message}
          icon={<Mail />}
          id="login-email"
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
          autoComplete="current-password"
          disabled={isSubmitting}
          endAdornment={<PasswordToggle onToggle={togglePassword} visible={showPassword} />}
          error={errors.password?.message}
          icon={<Lock />}
          id="login-password"
          label={t.auth.password}
          labelClassName={labelClassName}
          contentClassName={inputClassName}
          placeholder="••••••••"
          required
          type={showPassword ? 'text' : 'password'}
          {...register('password', {
            onChange: clearSubmitError,
          })}
        />

        <div className="flex flex-col items-start gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <AuthCheckboxField
            checked={rememberMe}
            labelClassName="text-xs text-slate-600 transition-colors group-hover/field:text-slate-900 dark:text-slate-400 dark:group-hover/field:text-white"
            id="login-remember-me"
            label={t.auth.rememberMe}
            onCheckedChange={setRememberMe}
          />
          <Button
            className="-ml-2 h-auto min-h-11 px-2 py-2 text-xs font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 sm:ml-0 sm:min-h-0 sm:px-0 sm:py-0"
            type="button"
            onClick={onForgotPassword}
            variant="link"
          >
            {t.auth.forgotPassword}
          </Button>
        </div>
      </FieldGroup>

      {submitError || authError ? (
        <FormStatusMessage className="text-center text-xs" role="alert">
          {submitError || authError}
        </FormStatusMessage>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="mt-1 min-h-12 w-full overflow-hidden border-0 bg-gradient-to-r from-cyan-500 to-blue-500 py-3 text-base font-bold text-white shadow-none transition-all hover:brightness-100 hover:shadow-[0_0_22px_rgba(6,182,212,0.45)] motion-safe:hover:scale-[1.02] disabled:hover:scale-100 sm:mt-2 sm:min-h-11 sm:py-2.5 sm:text-sm"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Spinner data-icon="inline-start" /> Connexion en cours...
          </>
        ) : (
          <>
            <Shield data-icon="inline-start" /> Se connecter
          </>
        )}
      </Button>

      <FieldSeparator className="my-3 text-xs [&_[data-slot=field-separator-content]]:bg-card [&_[data-slot=field-separator-content]]:px-3 [&_[data-slot=field-separator-content]]:leading-none [&_[data-slot=field-separator-content]]:text-slate-500 [&_[data-slot=separator]]:top-1/2 [&_[data-slot=separator]]:h-px [&_[data-slot=separator]]:-translate-y-1/2 [&_[data-slot=separator]]:scale-y-50 [&_[data-slot=separator]]:bg-slate-200 dark:[&_[data-slot=field-separator-content]]:bg-card dark:[&_[data-slot=separator]]:bg-slate-700">
        {t.auth.orContinueWith}
      </FieldSeparator>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button
          type="button"
          disabled
          aria-disabled="true"
          className="min-h-11 w-full border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
          variant="outline"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="size-4" />
          <span className="text-xs font-medium">Google</span>
        </Button>
        <Button
          type="button"
          disabled
          aria-disabled="true"
          className="min-h-11 w-full border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
          variant="outline"
        >
          <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="size-4" />
          <span className="text-xs font-medium">Facebook</span>
        </Button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center text-[11px] leading-relaxed text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 sm:text-[10px]">
        La connexion Google/Facebook reste desactivee tant qu'une integration OAuth backend reelle
        n'est pas disponible.
      </div>
    </form>
  );
}
