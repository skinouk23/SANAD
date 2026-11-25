import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle, KeyRound, Mail, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { AuthInputField, PasswordToggle } from '@/features/auth/components/AuthFormControls';
import {
  type ForgotPasswordCodeValues,
  type ForgotPasswordEmailValues,
  type ForgotPasswordResetValues,
  ForgotPasswordCodeSchema,
  ForgotPasswordEmailSchema,
  ForgotPasswordResetSchema,
} from '@/features/auth/schema';
import { sanitizeTextValue } from '@/features/auth/screens/authFlow.helpers';
import { Button } from '@/shared/ui/primitives/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';
import { Field, FieldContent, FieldError, FieldLabel } from '@/shared/ui/primitives/field';
import { Input } from '@/shared/ui/primitives/input';
import { Spinner } from '@/shared/ui/primitives/spinner';
import { maskEmail } from '@/utils/security';

type Step = 'email' | 'code' | 'newPassword' | 'success';

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function wait(milliseconds: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

export function ForgotPasswordDialog({ isOpen, onClose }: ForgotPasswordDialogProps) {
  const [step, setStep] = useState<Step>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const emailForm = useForm<ForgotPasswordEmailValues>({
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(ForgotPasswordEmailSchema),
  });

  const codeForm = useForm<ForgotPasswordCodeValues>({
    defaultValues: {
      code: '',
    },
    mode: 'onSubmit',
    resolver: zodResolver(ForgotPasswordCodeSchema),
  });

  const passwordForm = useForm<ForgotPasswordResetValues>({
    defaultValues: {
      confirmPassword: '',
      newPassword: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(ForgotPasswordResetSchema),
  });

  const email = emailForm.watch('email');
  const verificationCode = codeDigits.join('');
  const codeFieldId = 'forgot-password-code-0';
  const codeError = codeForm.formState.errors.code?.message;
  const codeErrorId = `${codeFieldId}-error`;

  useEffect(() => {
    let interval: number | undefined;

    if (step === 'code' && resendTimer > 0) {
      interval = window.setInterval(() => {
        setResendTimer((previousValue) => {
          if (previousValue <= 1) {
            setCanResend(true);
            return 0;
          }

          return previousValue - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [resendTimer, step]);

  useEffect(() => {
    if (!isOpen) {
      setStep('email');
      setIsLoading(false);
      setResendTimer(60);
      setCanResend(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setCodeDigits(['', '', '', '', '', '']);
      emailForm.reset();
      codeForm.reset();
      passwordForm.reset();
    }
  }, [codeForm, emailForm, isOpen, passwordForm]);

  const handleEmailSubmit = emailForm.handleSubmit(async () => {
    // Forgot-password remains mocked until dedicated backend reset endpoints are available.
    setIsLoading(true);

    try {
      await wait(1000);
      setStep('code');
      setResendTimer(60);
      setCanResend(false);
      setCodeDigits(['', '', '', '', '', '']);
      codeForm.reset({ code: '' });
    } finally {
      setIsLoading(false);
    }
  });

  const handleCodeSubmit = codeForm.handleSubmit(async () => {
    setIsLoading(true);

    try {
      await wait(1000);
      setStep('newPassword');
      passwordForm.reset({ confirmPassword: '', newPassword: '' });
    } finally {
      setIsLoading(false);
    }
  });

  const handlePasswordSubmit = passwordForm.handleSubmit(async () => {
    setIsLoading(true);

    try {
      await wait(1000);
      setStep('success');
    } finally {
      setIsLoading(false);
    }
  });

  const handleCodeChange = (index: number, rawValue: string) => {
    const digits = rawValue.replace(/\D/g, '');
    const nextDigits = [...codeDigits];

    if (!digits) {
      nextDigits[index] = '';
      setCodeDigits(nextDigits);
      codeForm.setValue('code', nextDigits.join(''), {
        shouldDirty: true,
      });
      codeForm.clearErrors('code');
      return;
    }

    digits
      .slice(0, 6 - index)
      .split('')
      .forEach((digit, offset) => {
        nextDigits[index + offset] = digit;
      });

    const normalizedCode = nextDigits.join('');

    setCodeDigits(nextDigits);
    codeForm.setValue('code', normalizedCode, {
      shouldDirty: true,
      shouldValidate: normalizedCode.length === 6,
    });
    codeForm.clearErrors('code');

    const nextIndex = Math.min(index + digits.length, 5);
    codeInputRefs.current[nextIndex]?.focus();
  };

  const handleCodeKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Backspace') {
      return;
    }

    if (codeDigits[index]) {
      const nextDigits = [...codeDigits];
      nextDigits[index] = '';
      setCodeDigits(nextDigits);
      codeForm.setValue('code', nextDigits.join(''), {
        shouldDirty: true,
      });
      codeForm.clearErrors('code');
      return;
    }

    if (index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    if (!canResend) {
      return;
    }

    setResendTimer(60);
    setCanResend(false);
    setCodeDigits(['', '', '', '', '', '']);
    codeForm.reset({ code: '' });
    codeInputRefs.current[0]?.focus();
  };

  const handleBack = () => {
    if (step === 'code') {
      setStep('email');
      setCodeDigits(['', '', '', '', '', '']);
      codeForm.reset({ code: '' });
      return;
    }

    if (step === 'newPassword') {
      setStep('code');
      passwordForm.reset({ confirmPassword: '', newPassword: '' });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent size="md" scroll="content">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
            {step === 'success' ? (
              <CheckCircle className="h-8 w-8" />
            ) : step === 'code' ? (
              <KeyRound className="h-8 w-8" />
            ) : (
              <Mail className="h-8 w-8" />
            )}
          </div>

          <DialogTitle className="mb-2 text-2xl font-bold text-foreground">
            {step === 'success'
              ? 'Mot de passe réinitialisé'
              : step === 'newPassword'
                ? 'Nouveau mot de passe'
                : step === 'code'
                  ? 'Code de vérification'
                  : 'Mot de passe oublié'}
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            {step === 'success'
              ? 'Votre mot de passe a été réinitialisé avec succès'
              : step === 'newPassword'
                ? 'Choisissez un nouveau mot de passe sécurisé'
                : step === 'code'
                  ? `Code envoyé à ${maskEmail(email)}`
                  : 'Entrez votre email pour recevoir un code de réinitialisation'}
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          {(step === 'code' || step === 'newPassword') && (
            <Button
              onClick={handleBack}
              className="mb-4 px-0 font-medium"
              type="button"
              variant="link"
            >
              <ArrowLeft data-icon="inline-start" />
              Retour
            </Button>
          )}

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <AuthInputField
                disabled={isLoading}
                error={emailForm.formState.errors.email?.message}
                icon={<Mail />}
                id="forgot-password-email"
                label="Adresse email"
                placeholder="votre@email.com"
                type="email"
                {...emailForm.register('email', {
                  setValueAs: sanitizeTextValue,
                })}
              />

              <Button
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
                className="w-full font-bold"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Envoi...
                  </>
                ) : (
                  'Envoyer le code'
                )}
              </Button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4">
              <Field data-invalid={codeError ? true : undefined}>
                <FieldLabel htmlFor={codeFieldId}>Entrez le code à 6 chiffres</FieldLabel>
                <FieldContent>
                  <div className="flex justify-center gap-2">
                    {codeDigits.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(element) => {
                          codeInputRefs.current[index] = element;
                        }}
                        aria-describedby={codeError ? codeErrorId : undefined}
                        aria-invalid={codeError ? true : undefined}
                        aria-label={`Chiffre ${index + 1} du code de vérification`}
                        className="h-14 w-12 rounded-lg border-2 px-0 text-center text-2xl font-bold"
                        disabled={isLoading}
                        id={`forgot-password-code-${index}`}
                        inputMode="numeric"
                        maxLength={6}
                        onChange={(event) => handleCodeChange(index, event.target.value)}
                        onKeyDown={(event) => handleCodeKeyDown(index, event)}
                        value={digit}
                      />
                    ))}
                  </div>
                </FieldContent>
                {codeError ? (
                  <FieldError aria-live="polite" className="text-xs" id={codeErrorId}>
                    {codeError}
                  </FieldError>
                ) : null}
              </Field>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Code non reçu ?{' '}
                  {canResend ? (
                    <Button
                      type="button"
                      onClick={handleResendCode}
                      className="h-auto p-0 font-semibold"
                      variant="link"
                    >
                      <RefreshCw data-icon="inline-start" />
                      Renvoyer
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">Renvoyer dans {resendTimer}s</span>
                  )}
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                aria-busy={isLoading}
                className="w-full font-bold"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Vérification...
                  </>
                ) : (
                  'Vérifier le code'
                )}
              </Button>
            </form>
          )}

          {step === 'newPassword' && (
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <AuthInputField
                autoComplete="new-password"
                disabled={isLoading}
                endAdornment={
                  <PasswordToggle
                    onToggle={() => setShowNewPassword((current) => !current)}
                    visible={showNewPassword}
                  />
                }
                error={passwordForm.formState.errors.newPassword?.message}
                id="forgot-password-new-password"
                label="Nouveau mot de passe"
                placeholder="••••••••"
                type={showNewPassword ? 'text' : 'password'}
                {...passwordForm.register('newPassword')}
              />

              <AuthInputField
                autoComplete="new-password"
                disabled={isLoading}
                endAdornment={
                  <PasswordToggle
                    onToggle={() => setShowConfirmPassword((current) => !current)}
                    visible={showConfirmPassword}
                  />
                }
                error={passwordForm.formState.errors.confirmPassword?.message}
                id="forgot-password-confirm-password"
                label="Confirmer le mot de passe"
                placeholder="••••••••"
                type={showConfirmPassword ? 'text' : 'password'}
                {...passwordForm.register('confirmPassword')}
              />

              <Button
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
                className="w-full font-bold"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Réinitialisation...
                  </>
                ) : (
                  'Réinitialiser le mot de passe'
                )}
              </Button>
            </form>
          )}

          {step === 'success' && (
            <div className="flex flex-col gap-4 text-center">
              <p className="text-sm text-muted-foreground">
                Vous pouvez maintenant vous connecter avec votre nouveau mot de passe
              </p>
              <Button onClick={onClose} className="w-full font-bold" size="lg" type="button">
                Retour à la connexion
              </Button>
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
