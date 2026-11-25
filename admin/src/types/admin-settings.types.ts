export interface AdminSettingsFeatures {
  providerPortal: boolean;
  patientPortal: boolean;
  aiAnalysis: boolean;
  maintenanceMode: boolean;
}

export interface AdminServiceAvailability {
  id: string;
  name: string;
  icon: string | null;
  displayOrder: number;
  providerPortal: boolean;
  patientPortal: boolean;
}

export interface AdminCommissionOverride {
  id: string;
  name: string;
  rate: number;
}

export interface AdminPlatformSettings {
  features: AdminSettingsFeatures;
  services: AdminServiceAvailability[];
  commissions: {
    defaultRate: number;
    overrides: AdminCommissionOverride[];
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
