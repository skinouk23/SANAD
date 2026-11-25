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
  PreferenceToggleConfig,
  ToggleablePreferenceKey,
} from '@/features/providers/profile/providerProfile.utils';
import type { ProviderPreferencesFormValues } from '@/features/providers/preferences-schema';

interface ProviderPreferencesTabProps {
  idBase: string;
  currentLanguageCode: LanguageCode;
  isThemeDark: boolean;
  title: string;
  lastSyncedLabel: string;
  loadingLabel: string;
  themeLabel: string;
  darkLabel: string;
  lightLabel: string;
  languageLabel: string;
  notificationsLabel: string;
  conversationsLabel: string;
  profileVisibilityLabel: string;
  preferencesVisibilityLabel: string;
  mutedTextClassName: string;
  loading: boolean;
  refreshing: boolean;
  disabled: boolean;
  errorMessage: string | null;
  retryLabel: string;
  noDataLabel: string;
  form: UseFormReturn<ProviderPreferencesFormValues>;
  providerPreferences: ProviderPreferencesFormValues | null;
  notificationToggleConfigs: PreferenceToggleConfig[];
  privacyToggleConfigs: PreferenceToggleConfig[];
  onLanguageChange: (languageCode: LanguageCode) => void;
  onToggleTheme: () => void;
  onRetry: () => void;
  onPreferenceToggle: (field: ToggleablePreferenceKey, checked: boolean) => Promise<void>;
  formatLastUpdatedLabel: () => string;
}

export function ProviderPreferencesTab({
  idBase,
  currentLanguageCode,
  isThemeDark,
  title,
  lastSyncedLabel,
  loadingLabel,
  themeLabel,
  darkLabel,
  lightLabel,
  languageLabel,
  notificationsLabel,
  conversationsLabel,
  profileVisibilityLabel,
  preferencesVisibilityLabel,
  mutedTextClassName,
  loading,
  refreshing,
  disabled,
  errorMessage,
  retryLabel,
  noDataLabel,
  form,
  providerPreferences,
  notificationToggleConfigs,
  privacyToggleConfigs,
  onLanguageChange,
  onToggleTheme,
  onRetry,
  onPreferenceToggle,
  formatLastUpdatedLabel,
}: ProviderPreferencesTabProps) {
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900/30 dark:text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              {lastSyncedLabel}
            </p>
            <p className="mt-1 text-xs font-semibold">
              {refreshing ? loadingLabel : formatLastUpdatedLabel()}
            </p>
            <p className={`mt-1 text-[11px] ${mutedTextClassName}`}>
              {profileVisibilityLabel}: {preferencesVisibilityLabel}
            </p>
          </div>
        </div>

        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <BellRing className="h-4 w-4 text-cyan-500" />
            {notificationsLabel}
          </h3>

          {errorMessage && !providerPreferences ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/30">
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

          {loading && !providerPreferences ? (
            <ListSkeleton className="mt-6 xl:grid xl:grid-cols-2" items={4} />
          ) : null}

          {providerPreferences ? (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {notificationToggleConfigs.map((config) => (
                <Controller
                  key={config.key}
                  control={form.control}
                  name={config.key}
                  render={({ field }) => (
                    <ProfileToggle
                      id={config.key}
                      label={config.label}
                      description={config.description}
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

          {!loading && !errorMessage && !providerPreferences ? (
            <div className="mt-6">
              <p className={`text-sm ${mutedTextClassName}`}>{noDataLabel}</p>
            </div>
          ) : null}
        </section>

        {providerPreferences ? (
          <section className="border-t border-slate-200 pt-6 dark:border-slate-700">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <BellRing className="h-4 w-4 text-cyan-500" />
              {conversationsLabel}
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
              {privacyToggleConfigs.map((config) => (
                <Controller
                  key={config.key}
                  control={form.control}
                  name={config.key}
                  render={({ field }) => (
                    <ProfileToggle
                      id={config.key}
                      label={config.label}
                      description={config.description}
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

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900/30 dark:text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                {profileVisibilityLabel}
              </p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                {preferencesVisibilityLabel}
              </p>
            </div>
          </section>
        ) : null}

        <section className="border-t border-slate-200 pt-6 dark:border-slate-700">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Globe className="h-4 w-4 text-purple-500" />
            {languageLabel} / {themeLabel}
          </h3>

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
