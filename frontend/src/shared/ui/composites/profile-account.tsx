import { AlertTriangle, LogOut, Moon, Sun, Trash2 } from 'lucide-react';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';

import { languages, type LanguageCode } from '@/shared/lib/i18n/languages';
import { cn } from '@/shared/lib/utils';
import { ProfileCard } from '@/shared/ui/composites/profile-surface';
import { Button } from '@/shared/ui/primitives/button';
import { Checkbox } from '@/shared/ui/primitives/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';
import { Field, FieldGroup, FieldLabel, FieldTitle } from '@/shared/ui/primitives/field';
import { Input } from '@/shared/ui/primitives/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';

interface DeleteAccountDialogFormState {
  currentPassword: string;
  keyword: string;
  acknowledged: boolean;
}

export interface DeleteAccountDialogConfirmPayload {
  currentPassword: string;
}

interface DeleteAccountDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  currentPasswordLabel: string;
  keywordLabel: string;
  keywordValue: string;
  acknowledgeLabel: string;
  confirmLabel: string;
  cancelLabel: string;
  submitting: boolean;
  onClose: () => void;
  onConfirm: (request: DeleteAccountDialogConfirmPayload) => Promise<void> | void;
}

interface ProfileDangerZoneProps {
  title: string;
  logoutLabel: string;
  deleteLabel: string;
  onLogout: () => void;
  onDeleteAccount: () => void;
  className?: string;
}

interface ProfileAppearanceSettingsProps {
  languageLabel: string;
  themeLabel: string;
  lightLabel: string;
  darkLabel: string;
  currentLanguageCode: LanguageCode;
  onLanguageChange: (code: LanguageCode) => void;
  isThemeDark: boolean;
  onToggleTheme: () => void;
}

const EMPTY_FORM_STATE: DeleteAccountDialogFormState = {
  currentPassword: '',
  keyword: '',
  acknowledged: false,
};

export function DeleteAccountDialog({
  isOpen,
  title,
  description,
  currentPasswordLabel,
  keywordLabel,
  keywordValue,
  acknowledgeLabel,
  confirmLabel,
  cancelLabel,
  submitting,
  onClose,
  onConfirm,
}: DeleteAccountDialogProps) {
  const [formState, setFormState] = useState<DeleteAccountDialogFormState>(EMPTY_FORM_STATE);
  const passwordInputId = useId();
  const keywordInputId = useId();
  const acknowledgementInputId = useId();
  const [isLocalSubmitting, setIsLocalSubmitting] = useState(false);
  const isLocalSubmittingRef = useRef(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      return;
    }

    setFormState(EMPTY_FORM_STATE);
    isLocalSubmittingRef.current = false;
    setIsLocalSubmitting(false);
  }, [isOpen]);

  const isKeywordConfirmed = formState.keyword === keywordValue;
  const isSubmitBlocked = submitting || isLocalSubmitting;
  const isConfirmEnabled =
    formState.currentPassword.trim().length > 0 && isKeywordConfirmed && formState.acknowledged;

  const handleClose = () => {
    if (!isSubmitBlocked && !isLocalSubmittingRef.current) {
      onClose();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isConfirmEnabled || isSubmitBlocked || isLocalSubmittingRef.current) {
      return;
    }

    isLocalSubmittingRef.current = true;
    setIsLocalSubmitting(true);

    try {
      await onConfirm({
        currentPassword: formState.currentPassword,
      });
    } finally {
      isLocalSubmittingRef.current = false;
      setIsLocalSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : undefined)}>
      <DialogContent
        showCloseButton={false}
        size="md"
        className="border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          passwordInputRef.current?.focus();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          previousActiveElementRef.current?.focus();
        }}
        onPointerDownOutside={(event) => {
          if (isSubmitBlocked) {
            event.preventDefault();
          }
        }}
        onEscapeKeyDown={(event) => {
          if (isSubmitBlocked) {
            event.preventDefault();
          }
        }}
        onInteractOutside={(event) => {
          if (isSubmitBlocked) {
            event.preventDefault();
          }
        }}
      >
        <div className="absolute inset-0 -z-10 rounded-2xl" data-testid="delete-account-backdrop" />

        <DialogHeader className="items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500 dark:bg-red-500/15 dark:text-red-400">
            <AlertTriangle aria-hidden="true" className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-6 text-slate-500 dark:text-slate-400">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel className="text-sm font-medium" htmlFor={passwordInputId}>
                {currentPasswordLabel}
              </FieldLabel>
              <Input
                autoComplete="current-password"
                className="rounded-xl"
                id={passwordInputId}
                ref={passwordInputRef}
                type="password"
                value={formState.currentPassword}
                onChange={(event) => {
                  setFormState((currentState) => ({
                    ...currentState,
                    currentPassword: event.target.value,
                  }));
                }}
              />
            </Field>

            <Field>
              <FieldLabel className="text-sm font-medium" htmlFor={keywordInputId}>
                {keywordLabel}
              </FieldLabel>
              <Input
                className="rounded-xl"
                id={keywordInputId}
                placeholder={keywordValue}
                type="text"
                value={formState.keyword}
                onChange={(event) => {
                  setFormState((currentState) => ({
                    ...currentState,
                    keyword: event.target.value,
                  }));
                }}
              />
            </Field>

            <Field
              data-disabled={isSubmitBlocked ? true : undefined}
              orientation="horizontal"
              className="items-start rounded-xl border border-border bg-muted/20 p-3"
            >
              <Checkbox
                checked={formState.acknowledged}
                className="mt-1"
                disabled={isSubmitBlocked}
                id={acknowledgementInputId}
                onCheckedChange={(checked) => {
                  setFormState((currentState) => ({
                    ...currentState,
                    acknowledged: checked === true,
                  }));
                }}
              />
              <FieldLabel
                className="text-sm leading-6 text-muted-foreground"
                htmlFor={acknowledgementInputId}
              >
                {acknowledgeLabel}
              </FieldLabel>
            </Field>
          </FieldGroup>

          <DialogFooter className="pt-2">
            <Button
              className="flex-1 rounded-xl sm:flex-none"
              disabled={isSubmitBlocked}
              variant="outline"
              onClick={handleClose}
            >
              {cancelLabel}
            </Button>
            <Button
              className="flex-1 rounded-xl sm:flex-none"
              disabled={!isConfirmEnabled || isSubmitBlocked}
              type="submit"
              variant="destructive"
            >
              {confirmLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ProfileDangerZone({
  title,
  logoutLabel,
  deleteLabel,
  onLogout,
  onDeleteAccount,
  className = '',
}: ProfileDangerZoneProps) {
  return (
    <section aria-labelledby="profile-danger-zone-title" className={className}>
      <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4 shadow-sm backdrop-blur-sm dark:border-red-900/30 dark:bg-slate-800/50 sm:p-6">
        <h2
          className="mb-4 flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-400"
          id="profile-danger-zone-title"
        >
          <AlertTriangle aria-hidden="true" className="h-4 w-4" />
          {title}
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-transparent dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            type="button"
            onClick={onLogout}
          >
            <LogOut aria-hidden="true" className="h-4 w-4" />
            {logoutLabel}
          </button>

          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20"
            type="button"
            onClick={onDeleteAccount}
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
            {deleteLabel}
          </button>
        </div>
      </div>
    </section>
  );
}

export function ProfileAppearanceSettings({
  languageLabel,
  themeLabel,
  lightLabel,
  darkLabel,
  currentLanguageCode,
  onLanguageChange,
  isThemeDark,
  onToggleTheme,
}: ProfileAppearanceSettingsProps) {
  const selectId = useId();

  const themeButtonClassName = (buttonUsesDarkTheme: boolean) => {
    const isActive = isThemeDark === buttonUsesDarkTheme;

    return cn(
      'flex-1 rounded-xl border text-sm font-medium transition-colors',
      isActive
        ? 'border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-300 dark:hover:bg-slate-900/50 dark:hover:text-white',
    );
  };

  const handleLanguageChange = (value: string) => {
    const selectedLanguage = languages.find((language) => language.code === value);

    if (selectedLanguage) {
      onLanguageChange(selectedLanguage.code);
    }
  };

  return (
    <ProfileCard contentClassName="flex flex-col gap-5 p-4 pt-4 sm:p-6 sm:pt-6">
      <div className="flex flex-col gap-5">
        <FieldGroup className="gap-5">
          <Field className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/30">
            <FieldLabel
              className="text-sm font-medium text-slate-900 dark:text-white"
              htmlFor={selectId}
            >
              {languageLabel}
            </FieldLabel>
            <Select onValueChange={handleLanguageChange} value={currentLanguageCode}>
              <SelectTrigger
                className="w-full rounded-xl border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white"
                id={selectId}
              >
                <SelectValue placeholder={languageLabel} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {languages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/30">
            <FieldTitle className="text-sm font-medium text-slate-900 dark:text-white">
              {themeLabel}
            </FieldTitle>
            <div className="flex gap-3">
              <Button
                aria-pressed={!isThemeDark}
                className={themeButtonClassName(false)}
                size="lg"
                variant="outline"
                onClick={() => {
                  if (isThemeDark) {
                    onToggleTheme();
                  }
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Sun aria-hidden="true" className="h-4 w-4" />
                  {lightLabel}
                </span>
              </Button>
              <Button
                aria-pressed={isThemeDark}
                className={themeButtonClassName(true)}
                size="lg"
                variant="outline"
                onClick={() => {
                  if (!isThemeDark) {
                    onToggleTheme();
                  }
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Moon aria-hidden="true" className="h-4 w-4" />
                  {darkLabel}
                </span>
              </Button>
            </div>
          </Field>
        </FieldGroup>
      </div>
    </ProfileCard>
  );
}
