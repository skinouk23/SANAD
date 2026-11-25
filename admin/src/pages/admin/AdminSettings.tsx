import React, { useCallback, useEffect, useState } from 'react';
import {
  Ban,
  Globe,
  Loader2,
  Percent,
  RefreshCcw,
  Save,
  Settings2,
  ShieldAlert,
  Stethoscope
} from 'lucide-react';
import {
  getAdminSettings,
  updateAdminSettings
} from '../../services/adminSettings.service';
import type {
  AdminCommissionOverride,
  AdminPlatformSettings,
  AdminServiceAvailability
} from '../../types/admin-settings.types';

const SERVICE_ICON_MAP: Record<string, string> = {
  syringe: '💉',
  heart: '❤️',
  activity: '💪',
  stethoscope: '🩺',
  baby: '👶',
  'user-check': '🌙',
  brain: '🧠',
  calendar: '📅',
  'flask-conical': '🧪',
  scan: '🩻',
  ambulance: '🚑',
  'utensils-crossed': '🥗',
  accessibility: '♿',
  trophy: '🏋️',
  pharmacy: '💊'
};

function ToggleSwitch({
  checked,
  danger = false,
  onChange
}: {
  checked: boolean;
  danger?: boolean;
  onChange: (checked: boolean) => void;
}) {
  const backgroundClass = danger
    ? 'bg-red-200 dark:bg-red-950 peer-checked:bg-red-600 dark:border-red-800 after:border-red-300'
    : 'bg-slate-200 dark:bg-slate-700 peer-checked:bg-teal-600 dark:border-slate-600 after:border-slate-300';

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <div
        className={`w-9 h-5 rounded-full peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${backgroundClass}`}
      />
    </label>
  );
}

function toNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function resolveServiceGlyph(service: AdminServiceAvailability): string {
  const normalizedIcon = service.icon?.trim().toLowerCase() || '';
  return SERVICE_ICON_MAP[normalizedIcon] || service.name.charAt(0).toUpperCase() || '•';
}

function updateService(
  services: AdminServiceAvailability[],
  serviceId: string,
  updater: (service: AdminServiceAvailability) => AdminServiceAvailability
): AdminServiceAvailability[] {
  return services.map((service) =>
    service.id === serviceId ? updater(service) : service
  );
}

function updateCommissionOverride(
  overrides: AdminCommissionOverride[],
  overrideId: string,
  updater: (overrideItem: AdminCommissionOverride) => AdminCommissionOverride
): AdminCommissionOverride[] {
  return overrides.map((overrideItem) =>
    overrideItem.id === overrideId ? updater(overrideItem) : overrideItem
  );
}

export function AdminSettings() {
  const [settings, setSettings] = useState<AdminPlatformSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await getAdminSettings();
      setSettings(response);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load admin settings.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const updateSettings = useCallback((
    updater: (current: AdminPlatformSettings) => AdminPlatformSettings
  ) => {
    setSettings((current) => current ? updater(current) : current);
  }, []);

  const handleSave = async () => {
    if (!settings) {
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const savedSettings = await updateAdminSettings(settings);
      setSettings(savedSettings);
      setSuccessMessage('Settings saved successfully.');
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to save admin settings.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const toggleServicePortal = (
    serviceId: string,
    portal: 'providerPortal' | 'patientPortal'
  ) => {
    updateSettings((current) => ({
      ...current,
      services: updateService(current.services, serviceId, (service) => ({
        ...service,
        [portal]: !service[portal]
      }))
    }));
  };

  const toggleAllPortal = (portal: 'providerPortal' | 'patientPortal') => {
    updateSettings((current) => {
      const allEnabled = current.services.every((service) => service[portal]);

      return {
        ...current,
        services: current.services.map((service) => ({
          ...service,
          [portal]: !allEnabled
        }))
      };
    });
  };

  const allProviderEnabled = settings?.services.every((service) => service.providerPortal) ?? false;
  const allPatientEnabled = settings?.services.every((service) => service.patientPortal) ?? false;

  if (isLoading && !settings) {
    return (
      <div className="min-h-[320px] flex items-center justify-center rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading platform settings...
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="space-y-4 max-w-4xl">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-300">
          {error || 'Unable to load admin settings.'}
        </div>
        <button
          onClick={() => void loadSettings()}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          <RefreshCcw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Platform Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Configure global platform behavior and rules.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => void loadSettings()}
            disabled={isLoading || isSaving}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-70 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-70"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:text-emerald-300">
          {successMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/50">
            <Settings2 className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Feature Toggles
            </h2>
          </div>
          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Professional Portal
                </p>
                <p className="text-xs text-slate-500">
                  Allow providers to log in and accept bookings.
                </p>
              </div>
              <ToggleSwitch
                checked={settings.features.providerPortal}
                onChange={(checked) =>
                  updateSettings((current) => ({
                    ...current,
                    features: {
                      ...current.features,
                      providerPortal: checked
                    }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Patient Portal
                </p>
                <p className="text-xs text-slate-500">
                  Allow patients to log in and make bookings.
                </p>
              </div>
              <ToggleSwitch
                checked={settings.features.patientPortal}
                onChange={(checked) =>
                  updateSettings((current) => ({
                    ...current,
                    features: {
                      ...current.features,
                      patientPortal: checked
                    }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  AI Document Analysis
                </p>
                <p className="text-xs text-slate-500">
                  Automatically analyze provider documents during signup.
                </p>
              </div>
              <ToggleSwitch
                checked={settings.features.aiAnalysis}
                onChange={(checked) =>
                  updateSettings((current) => ({
                    ...current,
                    features: {
                      ...current.features,
                      aiAnalysis: checked
                    }
                  }))
                }
              />
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/50">
            <Stethoscope className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Service Availability
            </h2>
            <span className="ml-auto text-[10px] text-slate-500 dark:text-slate-400">
              {settings.services.filter((service) => service.providerPortal).length}/
              {settings.services.length} provider ·{' '}
              {settings.services.filter((service) => service.patientPortal).length}/
              {settings.services.length} patient
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/30">
                <tr>
                  <th className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Service
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center gap-1">
                      <span>Professional Portal</span>
                      <button
                        onClick={() => toggleAllPortal('providerPortal')}
                        className="text-[10px] font-normal normal-case text-teal-600 hover:underline dark:text-teal-400"
                      >
                        {allProviderEnabled ? 'Disable all' : 'Enable all'}
                      </button>
                    </div>
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center gap-1">
                      <span>Patient Portal</span>
                      <button
                        onClick={() => toggleAllPortal('patientPortal')}
                        className="text-[10px] font-normal normal-case text-teal-600 hover:underline dark:text-teal-400"
                      >
                        {allPatientEnabled ? 'Disable all' : 'Enable all'}
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {settings.services.map((service) => (
                  <tr
                    key={service.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm dark:bg-slate-700">
                          {resolveServiceGlyph(service)}
                        </span>
                        <div>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {service.name}
                          </span>
                          <span className="ml-2 text-[10px] font-mono text-slate-400">
                            {service.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ToggleSwitch
                        checked={service.providerPortal}
                        onChange={() => toggleServicePortal(service.id, 'providerPortal')}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ToggleSwitch
                        checked={service.patientPortal}
                        onChange={() => toggleServicePortal(service.id, 'patientPortal')}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/50">
            <Percent className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Commission Rates (%)
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                Default Rate
              </label>
              <input
                type="number"
                value={settings.commissions.defaultRate}
                onChange={(event) =>
                  updateSettings((current) => ({
                    ...current,
                    commissions: {
                      ...current.commissions,
                      defaultRate: toNumber(event.target.value)
                    }
                  }))
                }
                className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm focus:ring-2 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-900"
              />
            </div>

            {settings.commissions.overrides.map((overrideItem) => (
              <div key={overrideItem.id}>
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  {overrideItem.name}
                </label>
                <input
                  type="number"
                  value={overrideItem.rate}
                  onChange={(event) =>
                    updateSettings((current) => ({
                      ...current,
                      commissions: {
                        ...current.commissions,
                        overrides: updateCommissionOverride(
                          current.commissions.overrides,
                          overrideItem.id,
                          (currentOverride) => ({
                            ...currentOverride,
                            rate: toNumber(event.target.value)
                          })
                        )
                      }
                    }))
                  }
                  className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm focus:ring-2 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-900"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/50">
            <Globe className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Financial Rules
            </h2>
          </div>
          <div className="p-4">
            <div className="max-w-xs">
              <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                Minimum Transfer Amount (TND)
              </label>
              <p className="mb-2 text-[10px] text-slate-500">
                Minimum wallet balance required before a provider can request a payout.
              </p>
              <input
                type="number"
                value={settings.transfers.minAmount}
                onChange={(event) =>
                  updateSettings((current) => ({
                    ...current,
                    transfers: {
                      minAmount: toNumber(event.target.value)
                    }
                  }))
                }
                className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm focus:ring-2 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-900"
              />
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/50">
            <Ban className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Cancellation Policy
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                Warning Threshold (%)
              </label>
              <p className="mb-2 text-[10px] text-slate-500">
                Cancellation rate that triggers an admin warning.
              </p>
              <input
                type="number"
                value={settings.cancellations.warningThreshold}
                onChange={(event) =>
                  updateSettings((current) => ({
                    ...current,
                    cancellations: {
                      ...current.cancellations,
                      warningThreshold: toNumber(event.target.value)
                    }
                  }))
                }
                className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm focus:ring-2 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                Block Threshold (%)
              </label>
              <p className="mb-2 text-[10px] text-slate-500">
                Cancellation rate that triggers a provider suspension.
              </p>
              <input
                type="number"
                value={settings.cancellations.blockThreshold}
                onChange={(event) =>
                  updateSettings((current) => ({
                    ...current,
                    cancellations: {
                      ...current.cancellations,
                      blockThreshold: toNumber(event.target.value)
                    }
                  }))
                }
                className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm focus:ring-2 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                Suspension Period (Days)
              </label>
              <p className="mb-2 text-[10px] text-slate-500">
                Suspension period applied after the provider crosses the threshold.
              </p>
              <input
                type="number"
                value={settings.cancellations.suspensionPeriodDays}
                onChange={(event) =>
                  updateSettings((current) => ({
                    ...current,
                    cancellations: {
                      ...current.cancellations,
                      suspensionPeriodDays: toNumber(event.target.value)
                    }
                  }))
                }
                className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm focus:ring-2 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-900"
              />
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10">
          <div className="flex items-center gap-2 border-b border-red-200 bg-red-100/50 px-4 py-3 dark:border-red-900/30 dark:bg-red-900/20">
            <ShieldAlert className="h-4 w-4 text-red-600" />
            <h2 className="text-sm font-semibold text-red-900 dark:text-red-400">
              Danger Zone
            </h2>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-400">
                  Maintenance Mode
                </p>
                <p className="text-xs text-red-700 dark:text-red-500">
                  Disable access for all non-admin users and keep the platform in maintenance mode.
                </p>
              </div>
              <ToggleSwitch
                checked={settings.features.maintenanceMode}
                danger
                onChange={(checked) =>
                  updateSettings((current) => ({
                    ...current,
                    features: {
                      ...current.features,
                      maintenanceMode: checked
                    }
                  }))
                }
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
