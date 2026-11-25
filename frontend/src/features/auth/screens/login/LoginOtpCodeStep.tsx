import type { FormEventHandler } from 'react';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import type { OtpChannel } from '@/features/auth/schema';
import type { TranslationKeys } from '@/i18n/types';
import { Button } from '@/shared/ui/primitives/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/primitives/input-otp';
import { FormStatusMessage } from '@/shared/ui/composites/form-field';
import { Spinner } from '@/shared/ui/primitives/spinner';

interface LoginOtpCodeStepProps {
  code: string;
  codeError?: string;
  channel: OtpChannel;
  destination: string;
  isResending: boolean;
  isSubmitting: boolean;
  onChangeEmail: () => void;
  onCodeChange: (code: string) => void;
  onResend: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onUsePassword: () => void;
  resendCooldown: number;
  submitError: string;
  t: TranslationKeys;
}

export function LoginOtpCodeStep({
  code,
  codeError,
  channel,
  destination,
  isResending,
  isSubmitting,
  onChangeEmail,
  onCodeChange,
  onResend,
  onSubmit,
  onUsePassword,
  resendCooldown,
  submitError,
  t,
}: LoginOtpCodeStepProps) {
  const canSubmit = code.length === 6 && !isSubmitting;
  const canResend = resendCooldown <= 0 && !isSubmitting && !isResending;
  const isSms = channel === 'sms';

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center gap-5">
      <div className="flex w-full items-start gap-3 rounded-xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-500/30 dark:bg-slate-800/50">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 text-white">
          {isSms ? <Phone className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
            {t.auth.verificationCode}
          </p>
          <p className="break-words text-sm font-semibold text-slate-900 dark:text-white">
            {t.auth.codeSentTo} {destination}
          </p>
        </div>
      </div>

      <div className="w-full">
        <label
          htmlFor="otp-login-code"
          className="mb-3 block text-[11px] font-bold uppercase tracking-wide text-cyan-600"
        >
          {t.auth.verificationCode}
        </label>
        <InputOTP
          id="otp-login-code"
          maxLength={6}
          value={code}
          onChange={onCodeChange}
          disabled={isSubmitting}
          inputMode="numeric"
          pattern="[0-9]*"
          aria-invalid={Boolean(codeError)}
          containerClassName="justify-center"
        >
          <InputOTPGroup className="gap-1.5 rounded-none border-0">
            {Array.from({ length: 6 }).map((_, index) => (
              <InputOTPSlot
                className="h-12 w-10 rounded-lg border border-slate-300 bg-slate-50 text-lg font-bold text-slate-900 shadow-sm first:rounded-lg first:border-l last:rounded-lg dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:h-14 sm:w-12 sm:text-xl"
                index={index}
                key={index}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
        {codeError ? (
          <p className="mt-2 text-center text-xs font-medium text-destructive" role="alert">
            {codeError}
          </p>
        ) : null}
      </div>

      {submitError ? (
        <FormStatusMessage className="w-full text-center text-xs" role="alert">
          {submitError}
        </FormStatusMessage>
      ) : null}

      <Button
        type="submit"
        disabled={!canSubmit}
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
            {t.auth.verifyAndLogin}
            <ArrowRight data-icon="inline-end" className="h-5 w-5" />
          </>
        )}
      </Button>

      <div className="flex w-full flex-col items-center gap-1 text-center">
        <Button
          className="h-auto min-h-10 whitespace-nowrap px-2 text-xs font-semibold text-cyan-600 hover:text-cyan-500 disabled:text-slate-400 dark:text-cyan-400 dark:hover:text-cyan-300"
          variant="link"
          type="button"
          disabled={!canResend}
          onClick={onResend}
        >
          {isResending
            ? t.common.loading
            : resendCooldown > 0
              ? `${t.auth.resendAvailableIn} ${resendCooldown}s`
              : t.auth.resendCode}
        </Button>
        <div className="flex items-center justify-center gap-4">
          <Button
            className="h-auto min-h-10 whitespace-nowrap px-2 text-xs font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
            variant="link"
            type="button"
            onClick={onChangeEmail}
          >
            {isSms ? t.auth.changePhone : t.auth.changeEmail}
          </Button>
          <Button
            className="h-auto min-h-10 whitespace-nowrap px-2 text-xs font-semibold text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300"
            variant="link"
            type="button"
            onClick={onUsePassword}
          >
            {t.auth.usePasswordInstead}
          </Button>
        </div>
      </div>
    </form>
  );
}
