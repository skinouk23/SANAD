import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw, Syringe } from 'lucide-react';
import { equipmentKeys } from '@/features/equipment/keys';
import { useUploadAndAttachEquipmentMainImage } from '@/features/equipment/hooks';
import { resolveProviderCategoryConfigKey, useAddService } from '@/features/providers';
import {
  buildCreatePayload,
  type ProviderServiceFormValues,
  type ProviderServicePresetDraftOverrides,
} from '@/features/providers/providerServiceForm';
import { useProviderNewServiceScreen } from '@/features/providers/services/providerNewService.hook';
import { showSuccessToast } from '@/shared/lib/notifications/toast';
import { Skeleton, SkeletonCard } from '@/shared/ui/composites/loading';

const PARTIAL_SUCCESS_IMAGE_ERROR =
  'Service enregistre, mais l image de l equipement n a pas pu etre televersee. Vous pouvez reessayer sans recreer le service.';

const DEFAULT_SERVICE_GRADIENT = 'from-cyan-500 to-blue-500';

const SERVICE_TYPE_GRADIENTS: Record<string, string> = {
  ambulance: 'from-red-500 to-rose-500',
  elderly: 'from-purple-500 to-indigo-500',
  elderly_care: 'from-purple-500 to-indigo-500',
  equipment: 'from-purple-500 to-indigo-500',
  laboratory: 'from-indigo-500 to-purple-500',
  nursing: DEFAULT_SERVICE_GRADIENT,
  nutrition: 'from-green-500 to-emerald-500',
  pharmacy: 'from-emerald-500 to-teal-500',
  physio: 'from-blue-500 to-cyan-500',
  physiotherapy: 'from-blue-500 to-cyan-500',
  radiology: 'from-pink-500 to-rose-500',
  veterinary: 'from-emerald-500 to-teal-500',
};

function renderProviderNewServiceStateLayout(children: ReactNode) {
  return (
    <div className="min-h-screen pb-20">
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-6">{children}</div>
    </div>
  );
}

function renderProviderNewServiceProfileLoadingState() {
  return renderProviderNewServiceStateLayout(
    <div aria-live="polite" className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <SkeletonCard className="space-y-4 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 lg:col-span-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-36 rounded" />
            <Skeleton className="h-3 w-44 rounded" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-1.5">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </SkeletonCard>

      <SkeletonCard className="space-y-3 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-5 w-28 rounded" />
        </div>
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-4/5 rounded" />
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-900/50"
          >
            <Skeleton className="mb-1.5 h-3.5 w-32 rounded" />
            <Skeleton className="mb-1 h-2.5 w-full rounded" />
            <Skeleton className="mb-2 h-2.5 w-3/4 rounded" />
            <div className="flex gap-2">
              <Skeleton className="h-3 w-14 rounded" />
              <Skeleton className="h-3 w-12 rounded" />
            </div>
          </div>
        ))}
      </SkeletonCard>
    </div>,
  );
}

function buildCreateServiceSubmit(
  submitDisabled: boolean,
  mutateAsync: ReturnType<typeof useAddService>['mutateAsync'],
  uploadEquipmentImageAsync: ReturnType<typeof useUploadAndAttachEquipmentMainImage>['mutateAsync'],
  navigate: ReturnType<typeof useNavigate>,
  providerCategoryKey: ReturnType<typeof resolveProviderCategoryConfigKey>,
  presetDraftOverrides: ProviderServicePresetDraftOverrides | null,
  equipmentImageFile: File | null,
  savedServiceIdForImageRetry: string | null,
  setSavedServiceIdForImageRetry: (serviceId: string | null) => void,
  setEquipmentImageUploadError: (message: string | null) => void,
  clearEquipmentImage: () => void,
  invalidateEquipmentQueries: () => void,
) {
  return async (values: ProviderServiceFormValues) => {
    if (!providerCategoryKey || submitDisabled) {
      return;
    }

    try {
      let serviceId = savedServiceIdForImageRetry;

      if (!serviceId) {
        const payload = buildCreatePayload(
          values,
          providerCategoryKey,
          presetDraftOverrides ?? undefined,
        );
        const createdService = await mutateAsync(payload);
        serviceId = createdService.id;

        if (providerCategoryKey === 'equipment') {
          invalidateEquipmentQueries();
        }
      }

      if (providerCategoryKey === 'equipment' && equipmentImageFile) {
        try {
          await uploadEquipmentImageAsync({ serviceId, file: equipmentImageFile });
          clearEquipmentImage();
          setSavedServiceIdForImageRetry(null);
        } catch (error) {
          setSavedServiceIdForImageRetry(serviceId);
          setEquipmentImageUploadError(
            error instanceof Error
              ? `${PARTIAL_SUCCESS_IMAGE_ERROR} ${error.message}`
              : PARTIAL_SUCCESS_IMAGE_ERROR,
          );
          return;
        }
      }

      showSuccessToast('Service créé avec succès.');
      navigate('/provider/services');
    } catch {
      // API errors are surfaced by the shared client toast layer.
    }
  };
}

export function useProviderNewServiceFlow() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const addServiceMutation = useAddService();
  const uploadEquipmentImageMutation = useUploadAndAttachEquipmentMainImage();
  const screen = useProviderNewServiceScreen();
  const providerCategoryKey = resolveProviderCategoryConfigKey(screen.providerProfile?.serviceType);
  const userServiceType = providerCategoryKey ?? 'nursing';
  const configGradient = SERVICE_TYPE_GRADIENTS[userServiceType] ?? DEFAULT_SERVICE_GRADIENT;
  const equipmentPreviewUrlRef = useRef<string | null>(null);
  const [equipmentImageFile, setEquipmentImageFile] = useState<File | null>(null);
  const [equipmentImagePreviewUrl, setEquipmentImagePreviewUrl] = useState<string | null>(null);
  const [savedServiceIdForImageRetry, setSavedServiceIdForImageRetry] = useState<string | null>(
    null,
  );
  const [equipmentImageUploadError, setEquipmentImageUploadError] = useState<string | null>(null);
  const isEquipmentProvider = providerCategoryKey === 'equipment';

  const clearEquipmentImage = () => {
    setEquipmentImageFile(null);
    setEquipmentImagePreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      equipmentPreviewUrlRef.current = null;
      return null;
    });
  };

  const handleEquipmentImageChange = (file: File | null) => {
    setEquipmentImageFile(file);
    setEquipmentImageUploadError(null);
    setEquipmentImagePreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      if (!file) {
        equipmentPreviewUrlRef.current = null;
        return null;
      }

      const nextUrl = URL.createObjectURL(file);
      equipmentPreviewUrlRef.current = nextUrl;
      return nextUrl;
    });
  };

  useEffect(() => {
    return () => {
      if (equipmentPreviewUrlRef.current) {
        URL.revokeObjectURL(equipmentPreviewUrlRef.current);
      }
    };
  }, []);

  const submitDisabled =
    addServiceMutation.loading ||
    uploadEquipmentImageMutation.loading ||
    screen.providerProfileLoading ||
    !screen.config ||
    screen.lookupLoading ||
    Boolean(screen.lookupErrorMessage);
  const Icon = screen.config?.icon ?? Syringe;
  const onSubmit = screen.form.handleSubmit(
    buildCreateServiceSubmit(
      submitDisabled,
      addServiceMutation.mutateAsync,
      uploadEquipmentImageMutation.mutateAsync,
      navigate,
      providerCategoryKey,
      screen.presetDraftOverrides,
      equipmentImageFile,
      savedServiceIdForImageRetry,
      setSavedServiceIdForImageRetry,
      setEquipmentImageUploadError,
      clearEquipmentImage,
      () => {
        void queryClient.invalidateQueries({ queryKey: equipmentKeys.all });
      },
    ),
  );

  const handleRetryEquipmentImageUpload = () => {
    if (!equipmentImageFile || !savedServiceIdForImageRetry) {
      return;
    }

    void uploadEquipmentImageMutation
      .mutateAsync({ serviceId: savedServiceIdForImageRetry, file: equipmentImageFile })
      .then(() => {
        clearEquipmentImage();
        setSavedServiceIdForImageRetry(null);
        setEquipmentImageUploadError(null);
        showSuccessToast('Image de l equipement ajoutee avec succes.');
        navigate('/provider/services');
      })
      .catch((error: unknown) => {
        setEquipmentImageUploadError(
          error instanceof Error
            ? `${PARTIAL_SUCCESS_IMAGE_ERROR} ${error.message}`
            : PARTIAL_SUCCESS_IMAGE_ERROR,
        );
      });
  };

  const loadingState =
    screen.providerProfileLoading && !screen.providerProfile
      ? renderProviderNewServiceProfileLoadingState()
      : null;

  const missingConfigState = !screen.config
    ? renderProviderNewServiceStateLayout(
        <div
          className="rounded-xl border border-red-200 bg-white/80 p-4 text-slate-900 shadow-sm backdrop-blur-sm dark:border-rose-500/30 dark:bg-slate-800/50 dark:text-white"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500 dark:text-rose-400" />
            <div className="space-y-3">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {screen.providerProfileErrorMessage}
              </p>
              <button
                type="button"
                onClick={() => {
                  void screen.refetchProviderProfile();
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-rose-500/40 dark:text-rose-300 dark:hover:bg-rose-500/10"
              >
                <RefreshCw className="h-4 w-4" />
                Réessayer
              </button>
            </div>
          </div>
        </div>,
      )
    : null;

  return {
    ...screen,
    Icon,
    configGradient,
    contentState: loadingState ?? missingConfigState,
    equipmentImageFile,
    equipmentImagePreviewUrl,
    equipmentImageRetryAvailable: Boolean(equipmentImageFile && savedServiceIdForImageRetry),
    equipmentImageUploadError,
    isEquipmentProvider,
    onCancel: () => navigate('/provider/services'),
    onEquipmentImageChange: handleEquipmentImageChange,
    onRetryEquipmentImageUpload: handleRetryEquipmentImageUpload,
    onSubmit,
    submitDisabled,
    submitLabel:
      addServiceMutation.loading || uploadEquipmentImageMutation.loading
        ? 'Enregistrement...'
        : screen.lookupLoading
          ? 'Chargement...'
          : 'Enregistrer',
  };
}
