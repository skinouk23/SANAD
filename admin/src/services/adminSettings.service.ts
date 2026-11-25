import { api } from '../api/client';
import type {
  AdminPlatformSettings,
  AdminCommissionOverride,
  AdminServiceAvailability
} from '../types/admin-settings.types';

interface AdminSettingsApiResponse {
  features: {
    providerPortalEnabled: boolean;
    patientPortalEnabled: boolean;
    aiDocumentAnalysisEnabled: boolean;
    maintenanceModeEnabled: boolean;
  };
  services: Array<{
    code: string;
    label: string;
    icon: string | null;
    displayOrder: number;
    providerPortalEnabled: boolean;
    patientPortalEnabled: boolean;
  }>;
  commissions: {
    defaultRate: number;
    overrides: Array<{
      code: string;
      label: string;
      rate: number;
    }>;
  };
  transfers: {
    minAmount: number;
  };
  cancellations: {
    warningThreshold: number;
    blockThreshold: number;
    suspensionPeriodDays: number;
  };
}

interface UpdateAdminSettingsApiPayload {
  features: {
    providerPortalEnabled: boolean;
    patientPortalEnabled: boolean;
    aiDocumentAnalysisEnabled: boolean;
    maintenanceModeEnabled: boolean;
  };
  services: Array<{
    code: string;
    providerPortalEnabled: boolean;
    patientPortalEnabled: boolean;
  }>;
  commissions: {
    defaultRate: number;
    overrides: Array<{
      code: string;
      rate: number;
    }>;
  };
  transfers: {
    minAmount: number;
  };
  cancellations: {
    warningThreshold: number;
    blockThreshold: number;
    suspensionPeriodDays: number;
  };
}

function mapServiceAvailability(
  services: AdminSettingsApiResponse['services']
): AdminServiceAvailability[] {
  return services.map((service) => ({
    id: service.code,
    name: service.label,
    icon: service.icon,
    displayOrder: service.displayOrder,
    providerPortal: service.providerPortalEnabled,
    patientPortal: service.patientPortalEnabled
  }));
}

function mapCommissionOverrides(
  overrides: AdminSettingsApiResponse['commissions']['overrides']
): AdminCommissionOverride[] {
  return overrides.map((overrideItem) => ({
    id: overrideItem.code,
    name: overrideItem.label,
    rate: overrideItem.rate
  }));
}

export function mapAdminSettingsResponse(
  response: AdminSettingsApiResponse
): AdminPlatformSettings {
  return {
    features: {
      providerPortal: response.features.providerPortalEnabled,
      patientPortal: response.features.patientPortalEnabled,
      aiAnalysis: response.features.aiDocumentAnalysisEnabled,
      maintenanceMode: response.features.maintenanceModeEnabled
    },
    services: mapServiceAvailability(response.services),
    commissions: {
      defaultRate: response.commissions.defaultRate,
      overrides: mapCommissionOverrides(response.commissions.overrides)
    },
    transfers: {
      minAmount: response.transfers.minAmount
    },
    cancellations: {
      warningThreshold: response.cancellations.warningThreshold,
      blockThreshold: response.cancellations.blockThreshold,
      suspensionPeriodDays: response.cancellations.suspensionPeriodDays
    }
  };
}

export function mapAdminSettingsPayload(
  settings: AdminPlatformSettings
): UpdateAdminSettingsApiPayload {
  return {
    features: {
      providerPortalEnabled: settings.features.providerPortal,
      patientPortalEnabled: settings.features.patientPortal,
      aiDocumentAnalysisEnabled: settings.features.aiAnalysis,
      maintenanceModeEnabled: settings.features.maintenanceMode
    },
    services: settings.services.map((service) => ({
      code: service.id,
      providerPortalEnabled: service.providerPortal,
      patientPortalEnabled: service.patientPortal
    })),
    commissions: {
      defaultRate: settings.commissions.defaultRate,
      overrides: settings.commissions.overrides.map((overrideItem) => ({
        code: overrideItem.id,
        rate: overrideItem.rate
      }))
    },
    transfers: {
      minAmount: settings.transfers.minAmount
    },
    cancellations: {
      warningThreshold: settings.cancellations.warningThreshold,
      blockThreshold: settings.cancellations.blockThreshold,
      suspensionPeriodDays: settings.cancellations.suspensionPeriodDays
    }
  };
}

export async function getAdminSettings(): Promise<AdminPlatformSettings> {
  const response = await api.get<AdminSettingsApiResponse>('/admin/settings');
  return mapAdminSettingsResponse(response);
}

export async function updateAdminSettings(
  settings: AdminPlatformSettings
): Promise<AdminPlatformSettings> {
  const response = await api.put<AdminSettingsApiResponse>(
    '/admin/settings',
    mapAdminSettingsPayload(settings)
  );

  return mapAdminSettingsResponse(response);
}

export const adminSettingsService = {
  getAdminSettings,
  updateAdminSettings
};
