import { z } from 'zod';
import type {
  CreateServiceRequest,
  ProviderServicePresetResponse,
  UpdateServiceRequest,
} from '@/features/services/schema';
import { UpdateServiceRequestSchema } from '@/features/services/schema';
import type { ProviderCategoryConfigKey } from './providerAuthoring';
import { getServiceAuthoringConfig, type ServiceAuthoringField } from './providerAuthoringConfig';

export type ProviderServiceFormValue = string | boolean | string[];
export type ProviderServiceFormValues = Record<string, ProviderServiceFormValue>;

type PresetTypeConfig = Record<string, unknown>;

export type ProviderServicePresetDraftOverrides = Partial<
  Pick<
    ProviderServicePresetResponse['draft'],
    | 'priceType'
    | 'currency'
    | 'durationMinutes'
    | 'serviceLocation'
    | 'requiresPrescription'
    | 'isUrgent'
    | 'requiresMedicalHistory'
  >
> & {
  typeConfig?: PresetTypeConfig;
};

export interface ProviderServiceManagementEditSource {
  name: string;
  description: string;
  price: number;
  duration: number;
  location: string;
  requiresPrescription: boolean;
  isUrgent: boolean;
  ceremonyType?: string;
  burialType?: string;
  repatriation?: boolean;
  floralService?: boolean;
  transportService?: boolean;
  adminAssistance?: boolean;
  griefSupport?: boolean;
  available24h?: boolean;
}

const STANDARD_FIELD_IDS = new Set([
  'name',
  'description',
  'price',
  'basePrice',
  'priceDaily',
  'duration',
  'location',
  'locationType',
  'isUrgent',
  'prescription',
  'requiresPrescription',
]);

export const EDITABLE_SERVICE_LOCATIONS = ['home', 'clinic', 'both', 'online'] as const;

export function getServiceLocationLabel(location: string): string {
  switch (location) {
    case 'home':
      return 'Domicile';
    case 'clinic':
      return 'Cabinet';
    case 'both':
      return 'Domicile et cabinet';
    case 'online':
      return 'En ligne';
    default:
      return location;
  }
}

const SERVICE_MANAGEMENT_PRIMARY_FIELDS: ServiceAuthoringField[] = [
  {
    id: 'name',
    label: 'Nom du service',
    type: 'text',
    required: true,
  },
  {
    id: 'description',
    label: 'Description',
    type: 'textarea',
  },
  {
    id: 'price',
    label: 'Prix (TND)',
    type: 'number',
    required: true,
  },
  {
    id: 'duration',
    label: 'Durée (min)',
    type: 'number',
  },
  {
    id: 'location',
    label: "Lieu d'intervention",
    type: 'select',
    options: EDITABLE_SERVICE_LOCATIONS.map((location) => ({
      value: location,
      label: getServiceLocationLabel(location),
    })),
  },
  {
    id: 'isUrgent',
    label: 'Disponible en urgence',
    type: 'checkbox',
  },
  {
    id: 'requiresPrescription',
    label: 'Ordonnance requise',
    type: 'checkbox',
  },
];

const FUNERAL_SERVICE_MANAGEMENT_PRIMARY_FIELDS: ServiceAuthoringField[] = [
  {
    id: 'name',
    label: 'Nom du service',
    type: 'text',
    required: true,
  },
  {
    id: 'description',
    label: 'Description',
    type: 'textarea',
  },
  {
    id: 'price',
    label: 'Prix de base (TND)',
    type: 'number',
    required: true,
  },
  {
    id: 'ceremonyType',
    label: 'Type de cérémonie',
    type: 'select',
    options: [
      { value: 'religious', label: 'Religieuse uniquement' },
      { value: 'civil', label: 'Civile uniquement' },
      { value: 'both', label: 'Les deux' },
    ],
  },
  {
    id: 'burialType',
    label: 'Mode de sépulture',
    type: 'select',
    options: [
      { value: 'burial', label: 'Inhumation uniquement' },
      { value: 'cremation', label: 'Crémation uniquement' },
      { value: 'both', label: 'Les deux' },
    ],
  },
];

const FUNERAL_SERVICE_MANAGEMENT_EXTRA_FIELDS: ServiceAuthoringField[] = [
  {
    id: 'repatriation',
    label: 'Rapatriement international',
    type: 'checkbox',
  },
  {
    id: 'floralService',
    label: 'Compositions florales',
    type: 'checkbox',
  },
  {
    id: 'transportService',
    label: 'Transport des proches',
    type: 'checkbox',
  },
  {
    id: 'adminAssistance',
    label: 'Assistance administrative',
    type: 'checkbox',
  },
  {
    id: 'griefSupport',
    label: 'Accompagnement au deuil',
    type: 'checkbox',
  },
  {
    id: 'available24h',
    label: 'Disponible 24h/24',
    type: 'checkbox',
  },
];

function buildFieldSchema(field: ServiceAuthoringField) {
  switch (field.type) {
    case 'checkbox':
      return z.boolean();
    case 'multiselect':
      return z.array(z.string());
    default:
      return z.string();
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function createProviderServiceFormSchema(fields: ServiceAuthoringField[]) {
  const shape = Object.fromEntries(fields.map((field) => [field.id, buildFieldSchema(field)]));

  return z.object(shape).superRefine((values, ctx) => {
    for (const field of fields) {
      const value = values[field.id];

      if (field.required) {
        if (field.type === 'checkbox' && value !== true) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field.id],
            message: `${field.label} est requis.`,
          });
          continue;
        }

        if (field.type === 'multiselect' && (!Array.isArray(value) || value.length === 0)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field.id],
            message: `${field.label} est requis.`,
          });
          continue;
        }

        if (typeof value === 'string' && value.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field.id],
            message: `${field.label} est requis.`,
          });
          continue;
        }
      }

      if (field.type === 'number' && typeof value === 'string' && value.trim().length > 0) {
        const parsed = Number(value);

        if (!Number.isFinite(parsed)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field.id],
            message: `${field.label} doit être un nombre valide.`,
          });
        }
      }
    }
  });
}

export function createFreshProviderServiceFormValues(
  fields: ServiceAuthoringField[],
): ProviderServiceFormValues {
  return Object.fromEntries(
    fields.map((field) => {
      if (field.type === 'checkbox') {
        return [field.id, false];
      }

      if (field.type === 'multiselect') {
        return [field.id, []];
      }

      return [field.id, ''];
    }),
  ) as ProviderServiceFormValues;
}

function getPriceFieldId(
  serviceType: ProviderCategoryConfigKey,
): 'price' | 'basePrice' | 'priceDaily' {
  if (serviceType === 'ambulance') {
    return 'basePrice';
  }

  if (serviceType === 'equipment') {
    return 'priceDaily';
  }

  return 'price';
}

function getLocationFieldId(fields: ServiceAuthoringField[]): 'location' | 'locationType' | null {
  if (fields.some((field) => field.id === 'locationType')) {
    return 'locationType';
  }

  if (fields.some((field) => field.id === 'location')) {
    return 'location';
  }

  return null;
}

function getPrescriptionFieldId(
  fields: ServiceAuthoringField[],
): 'prescription' | 'requiresPrescription' | null {
  if (fields.some((field) => field.id === 'requiresPrescription')) {
    return 'requiresPrescription';
  }

  if (fields.some((field) => field.id === 'prescription')) {
    return 'prescription';
  }

  return null;
}

function getUrgencyFieldId(fields: ServiceAuthoringField[]): 'isUrgent' | 'emergency24h' | null {
  if (fields.some((field) => field.id === 'isUrgent')) {
    return 'isUrgent';
  }

  if (fields.some((field) => field.id === 'emergency24h')) {
    return 'emergency24h';
  }

  return null;
}

function mapPresetTypeConfigKeyToFieldId(typeConfigKey: string): string {
  if (typeConfigKey === 'subcategoryCode') {
    return 'subcategory';
  }

  return typeConfigKey;
}

function mapPresetServiceLocationToFieldValue(
  serviceLocation: ProviderServicePresetResponse['draft']['serviceLocation'],
  fields: ServiceAuthoringField[],
): string | null {
  const locationFieldId = getLocationFieldId(fields);

  if (!locationFieldId) {
    return null;
  }

  if (locationFieldId === 'locationType') {
    if (serviceLocation === 'clinic') {
      return 'pharmacie';
    }

    if (serviceLocation === 'home') {
      return 'domicile';
    }

    if (serviceLocation === 'both') {
      return 'both';
    }

    return null;
  }

  return serviceLocation;
}

function toFormFieldValue(
  field: ServiceAuthoringField,
  value: unknown,
): ProviderServiceFormValue | undefined {
  if (field.type === 'checkbox') {
    return typeof value === 'boolean' ? value : undefined;
  }

  if (field.type === 'multiselect') {
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string')
      : undefined;
  }

  if (field.type === 'number') {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }

    return typeof value === 'string' ? value : undefined;
  }

  return typeof value === 'string' ? value : undefined;
}

function toPriceType(
  value: string | null | undefined,
): 'fixed' | 'hourly' | 'range' | 'starting_from' {
  if (value === 'hourly' || value === 'range' || value === 'starting_from') {
    return value;
  }

  return 'fixed';
}

function getTrimmedStringValue(value: ProviderServiceFormValue | undefined): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function getBooleanValue(value: ProviderServiceFormValue | undefined): boolean {
  return value === true;
}

function getArrayValue(value: ProviderServiceFormValue | undefined): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const normalizedValues = value.filter(
    (item): item is string => typeof item === 'string' && item.trim().length > 0,
  );

  return normalizedValues.length > 0 ? normalizedValues : undefined;
}

function getNumberValue(value: ProviderServiceFormValue | undefined): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function getRawStringValue(value: ProviderServiceFormValue | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function getRequiredNumberValueOrZero(value: ProviderServiceFormValue | undefined): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toServiceLocation(value: string | undefined): CreateServiceRequest['serviceLocation'] {
  if (value === 'pharmacie') {
    return 'clinic';
  }

  if (value === 'domicile') {
    return 'home';
  }

  if (value === 'home' || value === 'clinic' || value === 'both' || value === 'online') {
    return value;
  }

  return 'home';
}

function buildGenericTypeConfig(
  formData: ProviderServiceFormValues,
  serviceType: ProviderCategoryConfigKey,
): Record<string, unknown> | undefined {
  const fields = getServiceAuthoringConfig(serviceType)?.fields ?? [];
  const entries: Array<[string, unknown]> = [];

  for (const field of fields) {
    if (STANDARD_FIELD_IDS.has(field.id)) {
      continue;
    }

    const rawValue = formData[field.id];

    if (field.type === 'checkbox') {
      if (rawValue === true) {
        entries.push([field.id, true]);
      }
      continue;
    }

    if (field.type === 'multiselect') {
      const values = getArrayValue(rawValue);
      if (values) {
        entries.push([field.id, values]);
      }
      continue;
    }

    if (field.type === 'number') {
      const value = getNumberValue(rawValue);
      if (value !== undefined) {
        entries.push([field.id, value]);
      }
      continue;
    }

    const value = getTrimmedStringValue(rawValue);
    if (value !== undefined) {
      entries.push([field.id, value]);
    }
  }

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

export function applyProviderServicePresetToFormValues(
  preset: ProviderServicePresetResponse,
  serviceType: ProviderCategoryConfigKey,
  fields: ServiceAuthoringField[],
): {
  values: ProviderServiceFormValues;
  overrides: ProviderServicePresetDraftOverrides | null;
} {
  const freshState = createFreshProviderServiceFormValues(fields);
  const nextOverrides: ProviderServicePresetDraftOverrides = {
    priceType: preset.draft.priceType,
    currency: preset.draft.currency,
    requiresMedicalHistory: preset.draft.requiresMedicalHistory,
  };
  const priceFieldId = getPriceFieldId(serviceType);
  const locationFieldId = getLocationFieldId(fields);
  const prescriptionFieldId = getPrescriptionFieldId(fields);
  const urgencyFieldId = getUrgencyFieldId(fields);

  freshState.name = preset.name;
  freshState.description = preset.description ?? '';
  freshState[priceFieldId] = String(preset.draft.price);

  if (preset.draft.durationMinutes !== null && preset.draft.durationMinutes !== undefined) {
    if (fields.some((field) => field.id === 'duration')) {
      freshState.duration = String(preset.draft.durationMinutes);
    } else {
      nextOverrides.durationMinutes = preset.draft.durationMinutes;
    }
  }

  if (locationFieldId) {
    const mappedLocation = mapPresetServiceLocationToFieldValue(
      preset.draft.serviceLocation,
      fields,
    );

    if (mappedLocation) {
      freshState[locationFieldId] = mappedLocation;
    } else {
      nextOverrides.serviceLocation = preset.draft.serviceLocation;
    }
  } else {
    nextOverrides.serviceLocation = preset.draft.serviceLocation;
  }

  if (prescriptionFieldId) {
    freshState[prescriptionFieldId] = preset.draft.requiresPrescription;
  } else {
    nextOverrides.requiresPrescription = preset.draft.requiresPrescription;
  }

  if (urgencyFieldId) {
    freshState[urgencyFieldId] = preset.draft.isUrgent;
  } else {
    nextOverrides.isUrgent = preset.draft.isUrgent;
  }

  const hiddenTypeConfig: PresetTypeConfig = {};

  if (isPlainObject(preset.draft.typeConfig)) {
    for (const [typeConfigKey, typeConfigValue] of Object.entries(preset.draft.typeConfig)) {
      const fieldId = mapPresetTypeConfigKeyToFieldId(typeConfigKey);
      const matchingField = fields.find((field) => field.id === fieldId);

      if (!matchingField) {
        hiddenTypeConfig[typeConfigKey] = typeConfigValue;
        continue;
      }

      const normalizedValue = toFormFieldValue(matchingField, typeConfigValue);

      if (normalizedValue !== undefined) {
        freshState[matchingField.id] = normalizedValue;
      }
    }
  }

  if (Object.keys(hiddenTypeConfig).length > 0) {
    nextOverrides.typeConfig = hiddenTypeConfig;
  }

  return {
    values: freshState,
    overrides: Object.keys(nextOverrides).length > 0 ? nextOverrides : null,
  };
}

export function buildCreatePayload(
  formData: ProviderServiceFormValues,
  serviceType: ProviderCategoryConfigKey,
  presetDraftOverrides?: ProviderServicePresetDraftOverrides,
): CreateServiceRequest {
  const name = getTrimmedStringValue(formData.name) ?? '';
  const description = getTrimmedStringValue(formData.description);
  const durationMinutes =
    presetDraftOverrides?.durationMinutes ?? getNumberValue(formData.duration);
  const price =
    getNumberValue(formData.basePrice) ??
    getNumberValue(formData.price) ??
    getNumberValue(formData.priceDaily) ??
    0;
  const formServiceLocation = toServiceLocation(
    getTrimmedStringValue(formData.locationType) ?? getTrimmedStringValue(formData.location),
  );
  const serviceLocation = presetDraftOverrides?.serviceLocation
    ? toServiceLocation(presetDraftOverrides.serviceLocation)
    : formServiceLocation;
  const requiresPrescription =
    presetDraftOverrides?.requiresPrescription ??
    (getBooleanValue(formData.prescription) || getBooleanValue(formData.requiresPrescription));
  const requiresMedicalHistory = presetDraftOverrides?.requiresMedicalHistory ?? false;
  let isUrgent = presetDraftOverrides?.isUrgent ?? getBooleanValue(formData.isUrgent);

  let typeConfig: Record<string, unknown> | undefined;

  switch (serviceType) {
    case 'nutrition': {
      const subcategoryCode = getTrimmedStringValue(formData.subcategory);
      const dietTypes = getArrayValue(formData.dietTypes);

      typeConfig = {
        ...(subcategoryCode ? { subcategoryCode } : {}),
        ...(dietTypes ? { dietTypes } : {}),
      };
      break;
    }

    case 'ambulance': {
      const serviceTypes = getArrayValue(formData.serviceTypes);
      const standardKilometers = getNumberValue(formData.standardKilometers);
      const pricePerExtraKm = getNumberValue(formData.pricePerExtraKm);

      typeConfig = {
        ...(serviceTypes ? { serviceTypes } : {}),
        ...(standardKilometers !== undefined ? { standardKilometers } : {}),
        ...(pricePerExtraKm !== undefined ? { pricePerExtraKm } : {}),
        ...(getBooleanValue(formData.available24h) ? { available24h: true } : {}),
      };
      break;
    }

    case 'funeral': {
      const ceremonyType = getTrimmedStringValue(formData.ceremonyType);
      const burialType = getTrimmedStringValue(formData.burialType);

      typeConfig = {
        ...(ceremonyType ? { ceremonyType } : {}),
        ...(burialType ? { burialType } : {}),
        ...(getBooleanValue(formData.repatriation) ? { repatriation: true } : {}),
        ...(getBooleanValue(formData.floralService) ? { floralService: true } : {}),
        ...(getBooleanValue(formData.transportService) ? { transportService: true } : {}),
        ...(getBooleanValue(formData.adminAssistance) ? { adminAssistance: true } : {}),
        ...(getBooleanValue(formData.griefSupport) ? { griefSupport: true } : {}),
        ...(getBooleanValue(formData.available24h) ? { available24h: true } : {}),
      };
      break;
    }

    case 'veterinary': {
      const animalTypes = getArrayValue(formData.animalTypes);

      isUrgent = getBooleanValue(formData.emergency24h);
      typeConfig = {
        ...(animalTypes ? { animalTypes } : {}),
        ...(getBooleanValue(formData.homeVisit) ? { homeVisit: true } : {}),
        ...(getBooleanValue(formData.emergency24h) ? { emergency24h: true } : {}),
      };
      break;
    }

    default: {
      typeConfig = buildGenericTypeConfig(formData, serviceType);
      break;
    }
  }

  const normalizedTypeConfig =
    typeConfig && Object.keys(typeConfig).length > 0 ? typeConfig : undefined;
  const mergedTypeConfig = {
    ...(presetDraftOverrides?.typeConfig ?? {}),
    ...(normalizedTypeConfig ?? {}),
  };
  const finalTypeConfig = Object.keys(mergedTypeConfig).length > 0 ? mergedTypeConfig : undefined;

  return {
    name,
    ...(description ? { description } : {}),
    price,
    priceType: toPriceType(presetDraftOverrides?.priceType),
    currency: presetDraftOverrides?.currency ?? 'TND',
    ...(durationMinutes !== undefined ? { durationMinutes } : {}),
    serviceLocation,
    requiresPrescription,
    requiresMedicalHistory,
    isUrgent,
    ...(finalTypeConfig ? { typeConfig: finalTypeConfig } : {}),
  };
}

export function getServiceManagementEditFields(serviceType: ProviderCategoryConfigKey) {
  if (serviceType === 'funeral') {
    return {
      primaryFields: FUNERAL_SERVICE_MANAGEMENT_PRIMARY_FIELDS,
      extraFields: FUNERAL_SERVICE_MANAGEMENT_EXTRA_FIELDS,
    };
  }

  return {
    primaryFields: SERVICE_MANAGEMENT_PRIMARY_FIELDS,
    extraFields: [] as ServiceAuthoringField[],
  };
}

export function createServiceManagementEditDefaults(
  service: ProviderServiceManagementEditSource,
): ProviderServiceFormValues {
  return {
    name: service.name,
    description: service.description,
    price: String(service.price),
    duration: String(service.duration),
    location: service.location,
    requiresPrescription: service.requiresPrescription,
    isUrgent: service.isUrgent,
    ceremonyType: service.ceremonyType ?? 'both',
    burialType: service.burialType ?? 'both',
    repatriation: service.repatriation ?? false,
    floralService: service.floralService ?? false,
    transportService: service.transportService ?? false,
    adminAssistance: service.adminAssistance ?? false,
    griefSupport: service.griefSupport ?? false,
    available24h: service.available24h ?? false,
  };
}

export function buildServiceManagementUpdatePayload(
  formData: ProviderServiceFormValues,
  selectedService: ProviderServiceManagementEditSource,
): UpdateServiceRequest {
  return UpdateServiceRequestSchema.parse({
    name: getRawStringValue(formData.name),
    description: getRawStringValue(formData.description),
    price: getRequiredNumberValueOrZero(formData.price),
    durationMinutes:
      formData.duration !== undefined
        ? getRequiredNumberValueOrZero(formData.duration)
        : selectedService.duration,
    serviceLocation: getRawStringValue(formData.location) ?? selectedService.location,
    requiresPrescription:
      formData.requiresPrescription !== undefined
        ? getBooleanValue(formData.requiresPrescription)
        : selectedService.requiresPrescription,
    isUrgent:
      formData.isUrgent !== undefined
        ? getBooleanValue(formData.isUrgent)
        : selectedService.isUrgent,
  });
}
