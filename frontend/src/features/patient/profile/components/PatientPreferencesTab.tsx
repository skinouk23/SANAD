import { useId } from 'react';
import { BellRing, Globe, Moon, RefreshCw, Sun } from 'lucide-react';
import { Controller, type UseFormReturn } from 'react-hook-form';

import { languages, type LanguageCode } from '@/shared/lib/i18n/languages';
import { cn } from '@/shared/lib/utils';
import { ListSkeleton } from '@/shared/ui/composites/loading';
import {
  ProfileCard,
  ProfileMessage,
  ProfilePanel,
  ProfileToggle,
} from '@/shared/ui/composites/profile-surface';
import { Button } from '@/shared/ui/primitives/button';
import { Field, FieldGroup, FieldLabel, FieldTitle } from '@/shared/ui/primitives/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';

import type {
  PatientPreferencesFormValues,
  PatientPreferencesResponse,
} from '@/features/family-circle/schema';
import type {
  PreferenceToggleConfig,
  ToggleablePreferenceKey,
} from '@/features/patient/profile/patientProfile.utils';

interface PatientPreferencesTabProps {
  idBase: string;
  currentLanguageCode: LanguageCode;
  isThemeDark: boolean;
  title: string;
  description: string;
  themeLabel: string;
  darkLabel: string;
  lightLabel: string;
  languageLabel: string;
  mutedTextClassName: string;
  loading: boolean;
  disabled: boolean;
  errorMessage: string | null;
  retryLabel: string;
  noDataLabel: string;
  form: UseFormReturn<PatientPreferencesFormValues>;
  patientPreferences: PatientPreferencesResponse | null;
  refreshing: boolean;
  toggleConfigs: PreferenceToggleConfig[];
  onLanguageChange: (languageCode: LanguageCode) => void;
  onToggleTheme: () => void;
  onRetry: () => void;
  onPreferenceToggle: (field: ToggleablePreferenceKey, checked: boolean) => Promise<void>;
}

export function PatientPreferencesTab({
  idBase,
  currentLanguageCode,
  isThemeDark,
  title,
  description,
  themeLabel,
  darkLabel,
  lightLabel,
  languageLabel,
  mutedTextClassName,
  loading,
  disabled,
  errorMessage,
  retryLabel,
  noDataLabel,
  form,
  patientPreferences,
  refreshing,
  toggleConfigs,
  onLanguageChange,
  onToggleTheme,
  onRetry,
  onPreferenceToggle,
}: PatientPreferencesTabProps) {
  const languageSelectId = useId();

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
    <ProfilePanel className="space-y-6" idBase={idBase} tabId="preferences">
      <ProfileCard contentClassName="space-y-6 p-4 sm:p-6">
        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <BellRing className="h-4 w-4 text-cyan-500" />
                {title}
              </h2>
              <p className={`text-sm ${mutedTextClassName}`}>{description}</p>
            </div>
            {refreshing ? (
              <span className="w-fit rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-medium text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-200">
                Mise à jour...
              </span>
            ) : null}
          </div>

          {errorMessage && !patientPreferences ? (
            <div className="mt-5">
              <ProfileMessage tone="error">{errorMessage}</ProfileMessage>
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
              >
                <RefreshCw className="h-4 w-4" />
                {retryLabel}
              </button>
            </div>
          ) : null}

          {loading && !patientPreferences ? (
            <ListSkeleton className="mt-6 md:grid md:grid-cols-2" items={4} />
          ) : null}

          {patientPreferences ? (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {toggleConfigs.map((config) => (
                <Controller
                  key={config.key}
                  control={form.control}
                  name={config.key}
                  render={({ field }) => (
                    <ProfileToggle
                      id={config.key}
                      label={config.label}
                      checked={field.value}
                      disabled={disabled}
                      onChange={(checked) => {
                        field.onChange(checked);
                        void onPreferenceToggle(config.key, checked);
                      }}
                    />
                  )}
                />
              ))}
            </div>
          ) : null}

          {!loading && !errorMessage && !patientPreferences ? (
            <div className="mt-6">
              <p className={`text-sm ${mutedTextClassName}`}>{noDataLabel}</p>
            </div>
          ) : null}
        </section>

        <section className="border-t border-slate-200 pt-6 dark:border-slate-700">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Globe className="h-4 w-4 text-purple-500" />
            {languageLabel} / {themeLabel}
          </h2>

          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <Field className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/30">
              <FieldLabel
                className="text-sm font-medium text-slate-900 dark:text-white"
                htmlFor={languageSelectId}
              >
                {languageLabel}
              </FieldLabel>
              <Select onValueChange={handleLanguageChange} value={currentLanguageCode}>
                <SelectTrigger
                  className="w-full rounded-xl border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white"
                  id={languageSelectId}
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
                  type="button"
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
                  type="button"
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
        </section>
      </ProfileCard>
    </ProfilePanel>
  );
}
