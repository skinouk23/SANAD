import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useAmbulanceServiceTypes } from '@/features/ambulance';
import { useNutritionDietTypes, useNutritionSubcategories } from '@/features/nutrition';
import {
  getServiceAuthoringConfig,
  resolveProviderCategoryConfigKey,
  useMyProviderProfile,
  useMyServicePresets,
} from '@/features/providers';
import {
  applyProviderServicePresetToFormValues,
  createFreshProviderServiceFormValues,
  createProviderServiceFormSchema,
  type ProviderServiceFormValues,
  type ProviderServicePresetDraftOverrides,
} from '@/features/providers/providerServiceForm';
import { getApiErrorMessage } from '@/utils/get-api-error-message';
import { useVeterinaryAnimalTypes } from '@/features/veterinary';

interface LookupDependency {
  endpoint: string;
  hasData: boolean;
  loading: boolean;
  error: unknown;
  refetch: () => Promise<unknown>;
}

function toFieldOptions(configItems: Array<{ code: string; label: string }> | null | undefined) {
  if (!configItems || configItems.length === 0) {
    return undefined;
  }

  return configItems.map((item) => ({
    value: item.code,
    label: item.label,
  }));
}

function getLookupFailureMessage(dependency: LookupDependency): string {
  if (dependency.error) {
    return getApiErrorMessage(
      dependency.error,
      `Impossible de charger les options live ${dependency.endpoint}.`,
    );
  }

  if (!dependency.hasData) {
    return `${dependency.endpoint} a renvoyé une réponse vide.`;
  }

  return `Impossible de charger les options live ${dependency.endpoint}.`;
}

export function useProviderNewServiceScreen() {
  const {
    data: providerProfile,
    loading: providerProfileLoading,
    error: providerProfileError,
    refetch: refetchProviderProfile,
  } = useMyProviderProfile();
  const { data: presets, loading: presetsLoading, error: presetsError } = useMyServicePresets();
  const {
    data: nutritionDietTypes,
    loading: nutritionDietTypesLoading,
    error: nutritionDietTypesError,
    refetch: refetchNutritionDietTypes,
  } = useNutritionDietTypes();
  const {
    data: nutritionSubcategories,
    loading: nutritionSubcategoriesLoading,
    error: nutritionSubcategoriesError,
    refetch: refetchNutritionSubcategories,
  } = useNutritionSubcategories();
  const {
    data: ambulanceServiceTypes,
    loading: ambulanceServiceTypesLoading,
    error: ambulanceServiceTypesError,
    refetch: refetchAmbulanceServiceTypes,
  } = useAmbulanceServiceTypes();
  const {
    data: veterinaryAnimalTypes,
    loading: veterinaryAnimalTypesLoading,
    error: veterinaryAnimalTypesError,
    refetch: refetchVeterinaryAnimalTypes,
  } = useVeterinaryAnimalTypes();

  const providerCategoryKey = resolveProviderCategoryConfigKey(providerProfile?.serviceType);
  const config = getServiceAuthoringConfig(providerCategoryKey);

  const lookupDependencies = useMemo<LookupDependency[]>(() => {
    if (!providerCategoryKey) {
      return [];
    }

    switch (providerCategoryKey) {
      case 'nutrition':
        return [
          {
            endpoint: '/nutrition/subcategories',
            hasData: Array.isArray(nutritionSubcategories) && nutritionSubcategories.length > 0,
            loading: nutritionSubcategoriesLoading,
            error: nutritionSubcategoriesError,
            refetch: async () => refetchNutritionSubcategories(),
          },
          {
            endpoint: '/nutrition/diet-types',
            hasData: Array.isArray(nutritionDietTypes) && nutritionDietTypes.length > 0,
            loading: nutritionDietTypesLoading,
            error: nutritionDietTypesError,
            refetch: async () => refetchNutritionDietTypes(),
          },
        ];
      case 'ambulance':
        return [
          {
            endpoint: '/ambulance/service-types',
            hasData: Array.isArray(ambulanceServiceTypes) && ambulanceServiceTypes.length > 0,
            loading: ambulanceServiceTypesLoading,
            error: ambulanceServiceTypesError,
            refetch: async () => refetchAmbulanceServiceTypes(),
          },
        ];
      case 'veterinary':
        return [
          {
            endpoint: '/veterinary/animal-types',
            hasData: Array.isArray(veterinaryAnimalTypes) && veterinaryAnimalTypes.length > 0,
            loading: veterinaryAnimalTypesLoading,
            error: veterinaryAnimalTypesError,
            refetch: async () => refetchVeterinaryAnimalTypes(),
          },
        ];
      default:
        return [];
    }
  }, [
    ambulanceServiceTypes,
    ambulanceServiceTypesError,
    ambulanceServiceTypesLoading,
    nutritionDietTypes,
    nutritionDietTypesError,
    nutritionDietTypesLoading,
    nutritionSubcategories,
    nutritionSubcategoriesError,
    nutritionSubcategoriesLoading,
    providerCategoryKey,
    refetchAmbulanceServiceTypes,
    refetchNutritionDietTypes,
    refetchNutritionSubcategories,
    refetchVeterinaryAnimalTypes,
    veterinaryAnimalTypes,
    veterinaryAnimalTypesError,
    veterinaryAnimalTypesLoading,
  ]);

  const lookupLoading = lookupDependencies.some((dependency) => dependency.loading);
  const lookupFailure =
    lookupDependencies.find(
      (dependency) => !dependency.loading && (dependency.error || !dependency.hasData),
    ) ?? null;
  const lookupStatusMessage = lookupLoading
    ? `Chargement des options live ${lookupDependencies.map((dependency) => dependency.endpoint).join(', ')}.`
    : null;
  const lookupErrorMessage = lookupFailure ? getLookupFailureMessage(lookupFailure) : null;

  const effectiveFields = useMemo(() => {
    if (!config) {
      return [];
    }

    const nutritionDietTypeOptions = toFieldOptions(nutritionDietTypes) ?? [];
    const nutritionSubcategoryOptions = toFieldOptions(nutritionSubcategories) ?? [];
    const ambulanceTypeOptions = toFieldOptions(ambulanceServiceTypes) ?? [];
    const veterinaryTypeOptions = toFieldOptions(veterinaryAnimalTypes) ?? [];

    return config.fields.map((field) => {
      if (providerCategoryKey === 'nutrition' && field.id === 'subcategory') {
        return { ...field, options: nutritionSubcategoryOptions };
      }

      if (providerCategoryKey === 'nutrition' && field.id === 'dietTypes') {
        return { ...field, options: nutritionDietTypeOptions };
      }

      if (providerCategoryKey === 'ambulance' && field.id === 'serviceTypes') {
        return { ...field, options: ambulanceTypeOptions };
      }

      if (providerCategoryKey === 'veterinary' && field.id === 'animalTypes') {
        return { ...field, options: veterinaryTypeOptions };
      }

      return field;
    });
  }, [
    ambulanceServiceTypes,
    config,
    nutritionDietTypes,
    nutritionSubcategories,
    providerCategoryKey,
    veterinaryAnimalTypes,
  ]);

  const categoryConfigFields = useMemo(
    () => getServiceAuthoringConfig(providerCategoryKey)?.fields ?? [],
    [providerCategoryKey],
  );
  const formSchema = useMemo(
    () => createProviderServiceFormSchema(effectiveFields),
    [effectiveFields],
  );
  const defaultFormValues = useMemo(
    () => createFreshProviderServiceFormValues(categoryConfigFields),
    [categoryConfigFields],
  );
  const form = useForm<ProviderServiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });
  const [presetDraftOverrides, setPresetDraftOverrides] =
    useState<ProviderServicePresetDraftOverrides | null>(null);

  useEffect(() => {
    if (!providerCategoryKey) {
      return;
    }

    form.reset(defaultFormValues);
    setPresetDraftOverrides(null);
  }, [defaultFormValues, form, providerCategoryKey]);

  const presetPanelDescription = presetsLoading
    ? 'Chargement des suggestions...'
    : presetsError
      ? 'Suggestions indisponibles pour le moment.'
      : 'Cliquez sur un service pour pré-remplir le formulaire';

  const handlePresetApply = (preset: (typeof presets)[number]) => {
    if (!providerCategoryKey) {
      return;
    }

    const result = applyProviderServicePresetToFormValues(
      preset,
      providerCategoryKey,
      effectiveFields,
    );
    setPresetDraftOverrides(result.overrides);
    form.reset(result.values);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleRetryLookups = async () => {
    await Promise.all(lookupDependencies.map((dependency) => dependency.refetch()));
  };

  const providerProfileErrorMessage = providerProfileError
    ? getApiErrorMessage(
        providerProfileError,
        'Le profil prestataire est indisponible pour le moment.',
      )
    : 'Le profil prestataire ne définit aucune catégorie exploitable pour créer un service.';

  return {
    config,
    form,
    effectiveFields,
    presetDraftOverrides,
    providerProfile,
    providerProfileLoading,
    providerProfileErrorMessage,
    refetchProviderProfile,
    presets,
    presetsLoading,
    providerCategoryKey,
    lookupLoading,
    lookupErrorMessage,
    lookupStatusMessage,
    presetPanelDescription,
    handlePresetApply,
    handleRetryLookups,
  };
}
