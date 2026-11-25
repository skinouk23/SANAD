import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Clock, DollarSign, Syringe, ToggleRight } from 'lucide-react';

import { useUploadAndAttachEquipmentMainImage } from '@/features/equipment/hooks';
import { equipmentKeys } from '@/features/equipment/keys';
import {
  resolveProviderCategoryConfigKey,
  useMyProviderProfile,
  useMyServices,
  useRemoveService,
  useToggleService,
  useUpdateService,
} from '@/features/providers';
import { getServiceAuthoringConfig } from '@/features/providers/providerAuthoringConfig';
import {
  buildServiceManagementUpdatePayload,
  createProviderServiceFormSchema,
  createServiceManagementEditDefaults,
  getServiceManagementEditFields,
  type ProviderServiceFormValues,
} from '@/features/providers/providerServiceForm';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

import { getErrorStatus, toServiceView, type ServiceView } from './serviceManagement.types';

import type { FormEventHandler } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface ProviderServiceManagementStat {
  gradient?: string;
  icon: LucideIcon;
  label: string;
  value: string | number;
}

export interface ProviderServiceManagementScreenViewModel {
  activeServices: ServiceView[];
  config: ReturnType<typeof getServiceAuthoringConfig>;
  configGradient: string;
  editFieldGroups: ReturnType<typeof getServiceManagementEditFields>;
  editForm: ReturnType<typeof useForm<ProviderServiceFormValues>>;
  editSubmitDisabled: boolean;
  equipmentImageFile: File | null;
  equipmentImagePreviewUrl: string | null;
  equipmentImageRetryAvailable: boolean;
  equipmentImageUploadError: string | null;
  Icon: LucideIcon;
  inactiveServices: ServiceView[];
  isEquipmentProvider: boolean;
  providerProfile: ReturnType<typeof useMyProviderProfile>['data'] | null | undefined;
  providerProfileErrorMessage: string;
  providerProfileLoading: boolean;
  selectedService: ServiceView | null;
  servicesData: ReturnType<typeof useMyServices>['data'] | null | undefined;
  servicesError: unknown;
  servicesErrorMessage: string | null;
  servicesErrorStatus: ReturnType<typeof getErrorStatus>;
  servicesLoading: boolean;
  servicesPlaceholderData: boolean;
  servicesRefreshing: boolean;
  showDeleteModal: boolean;
  showEditModal: boolean;
  stats: ProviderServiceManagementStat[];
  userServiceType: string;
  onAddService: () => void;
  onCloseDeleteModal: () => void;
  onCloseEditModal: () => void;
  onDeleteClick: (service: ServiceView) => void;
  onDeleteConfirm: () => void;
  onEditClick: (service: ServiceView) => void;
  onEquipmentImageChange: (file: File | null) => void;
  onEditSave: FormEventHandler<HTMLFormElement>;
  onRefetchProviderProfile: () => void;
  onRefetchServices: () => void;
  onRetryEquipmentImageUpload: () => void;
  onToggleActive: (id: string) => void;
  formatDuration: (duration: number) => string;
}

const DEFAULT_SERVICE_GRADIENT = 'from-cyan-500 to-blue-500';
const PARTIAL_SUCCESS_IMAGE_ERROR =
  'Service enregistre, mais l image de l equipement n a pas pu etre televersee. Vous pouvez reessayer sans recreer le service.';

const SERVICE_TYPE_GRADIENTS: Record<string, string> = {
  ambulance: 'from-red-500 to-rose-500',
  doctor: 'from-teal-500 to-cyan-500',
  elderly: 'from-purple-500 to-indigo-500',
  elderly_care: 'from-purple-500 to-indigo-500',
  equipment: 'from-purple-500 to-indigo-500',
  funeral: 'from-slate-600 to-slate-700',
  laboratory: 'from-indigo-500 to-purple-500',
  maternity: 'from-pink-400 to-rose-500',
  nursing: DEFAULT_SERVICE_GRADIENT,
  pharmacy: 'from-emerald-500 to-teal-500',
  physio: 'from-blue-500 to-cyan-500',
  physiotherapy: 'from-blue-500 to-cyan-500',
  psychology: 'from-violet-500 to-purple-500',
  radiology: 'from-pink-500 to-rose-500',
  nutrition: 'from-green-500 to-emerald-500',
  veterinary: 'from-emerald-500 to-teal-500',
};

export function useProviderServiceManagementScreen(): ProviderServiceManagementScreenViewModel {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: providerProfile,
    loading: providerProfileLoading,
    error: providerProfileError,
    refetch: refetchProviderProfile,
  } = useMyProviderProfile();
  const providerCategoryKey = resolveProviderCategoryConfigKey(providerProfile?.serviceType);
  const userServiceType = providerCategoryKey ?? 'nursing';
  const config = getServiceAuthoringConfig(providerCategoryKey);
  const configGradient = SERVICE_TYPE_GRADIENTS[userServiceType] ?? DEFAULT_SERVICE_GRADIENT;
  const Icon = (config?.icon ?? Syringe) as typeof Syringe;

  const {
    data: servicesData,
    loading: servicesLoading,
    isRefreshing: servicesRefreshing,
    isPlaceholderData: servicesPlaceholderData,
    error: servicesError,
    refetch: refetchServices,
  } = useMyServices();
  const { mutate: toggleMutate } = useToggleService();
  const { mutateAsync: updateMutate, loading: updateLoading } = useUpdateService();
  const { mutate: removeMutate } = useRemoveService();
  const uploadEquipmentImageMutation = useUploadAndAttachEquipmentMainImage();

  const providerProfileErrorMessage = providerProfileError
    ? getApiErrorMessage(
        providerProfileError,
        'Le profil prestataire est indisponible pour le moment.',
      )
    : 'Le profil prestataire ne définit aucune catégorie exploitable pour gérer les services.';
  const servicesErrorMessage = servicesError
    ? getApiErrorMessage(
        servicesError,
        'Les services du prestataire sont indisponibles pour le moment.',
      )
    : null;
  const servicesErrorStatus = getErrorStatus(servicesError);

  const services: ServiceView[] = useMemo(
    () => (servicesData?.items ?? []).map(toServiceView),
    [servicesData],
  );

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceView | null>(null);
  const equipmentPreviewUrlRef = useRef<string | null>(null);
  const [equipmentImageFile, setEquipmentImageFile] = useState<File | null>(null);
  const [equipmentImagePreviewUrl, setEquipmentImagePreviewUrl] = useState<string | null>(null);
  const [equipmentImageRetryServiceId, setEquipmentImageRetryServiceId] = useState<string | null>(
    null,
  );
  const [equipmentImageUploadError, setEquipmentImageUploadError] = useState<string | null>(null);
  const isEquipmentProvider = userServiceType === 'equipment';
  const editSubmitDisabled = updateLoading || uploadEquipmentImageMutation.loading;
  const editFieldGroups = useMemo(
    () => getServiceManagementEditFields(userServiceType),
    [userServiceType],
  );
  const editFormSchema = useMemo(
    () =>
      createProviderServiceFormSchema([
        ...editFieldGroups.primaryFields,
        ...editFieldGroups.extraFields,
      ]),
    [editFieldGroups],
  );
  const editForm = useForm<ProviderServiceFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (!showEditModal || !selectedService) {
      return;
    }

    editForm.reset(createServiceManagementEditDefaults(selectedService));
  }, [editForm, selectedService, showEditModal]);

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

  const onToggleActive = (id: string) => {
    const service = services.find((item) => item.id === id);
    if (service) {
      toggleMutate({ id, isActive: !service.active });
    }
  };

  const onEditClick = (service: ServiceView) => {
    setSelectedService(service);
    setEquipmentImageRetryServiceId(null);
    setEquipmentImageUploadError(null);
    clearEquipmentImage();
    setShowEditModal(true);
  };

  const onDeleteClick = (service: ServiceView) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  const onEditSave = editForm.handleSubmit(async (values) => {
    if (!selectedService) {
      return;
    }

    try {
      await updateMutate({
        id: selectedService.id,
        data: buildServiceManagementUpdatePayload(values, selectedService),
      });

      if (isEquipmentProvider) {
        void queryClient.invalidateQueries({ queryKey: equipmentKeys.all });
      }

      if (isEquipmentProvider && equipmentImageFile) {
        try {
          await uploadEquipmentImageMutation.mutateAsync({
            serviceId: selectedService.id,
            file: equipmentImageFile,
          });
          clearEquipmentImage();
          setEquipmentImageRetryServiceId(null);
          setEquipmentImageUploadError(null);
        } catch (error) {
          setEquipmentImageRetryServiceId(selectedService.id);
          setEquipmentImageUploadError(
            error instanceof Error
              ? `${PARTIAL_SUCCESS_IMAGE_ERROR} ${error.message}`
              : PARTIAL_SUCCESS_IMAGE_ERROR,
          );
          return;
        }
      }

      setShowEditModal(false);
      setSelectedService(null);
      editForm.reset({});
      clearEquipmentImage();
    } catch {
      // Keep the modal open so the provider can correct the payload or retry.
    }
  });

  const onRetryEquipmentImageUpload = () => {
    if (!equipmentImageFile || !equipmentImageRetryServiceId) {
      return;
    }

    void uploadEquipmentImageMutation
      .mutateAsync({ serviceId: equipmentImageRetryServiceId, file: equipmentImageFile })
      .then(() => {
        clearEquipmentImage();
        setEquipmentImageRetryServiceId(null);
        setEquipmentImageUploadError(null);
        setShowEditModal(false);
        setSelectedService(null);
        editForm.reset({});
      })
      .catch((error: unknown) => {
        setEquipmentImageUploadError(
          error instanceof Error
            ? `${PARTIAL_SUCCESS_IMAGE_ERROR} ${error.message}`
            : PARTIAL_SUCCESS_IMAGE_ERROR,
        );
      });
  };

  const onDeleteConfirm = () => {
    if (!selectedService) {
      return;
    }

    removeMutate(selectedService.id);
    setShowDeleteModal(false);
    setSelectedService(null);
  };

  const activeServices = services.filter((service) => service.active);
  const inactiveServices = services.filter((service) => !service.active);
  const avgPrice =
    activeServices.length > 0
      ? Math.round(
          activeServices.reduce((sum, service) => sum + service.price, 0) / activeServices.length,
        )
      : 0;
  const avgDuration =
    activeServices.length > 0
      ? Math.round(
          activeServices.reduce((sum, service) => sum + service.duration, 0) /
            activeServices.length,
        )
      : 0;

  const getDurationLabel = () => {
    if (userServiceType === 'laboratory') {
      return 'Délai moyen (h)';
    }

    if (userServiceType === 'equipment') {
      return 'Location/jour';
    }

    if (userServiceType === 'funeral') {
      return 'Services';
    }

    return 'Durée Moyenne';
  };

  const formatDuration = (duration: number) => {
    if (userServiceType === 'laboratory') {
      return `${duration}h`;
    }

    if (userServiceType === 'equipment') {
      return `${duration} jour${duration > 1 ? 's' : ''}`;
    }

    if (userServiceType === 'funeral') {
      return 'Variable';
    }

    return `${duration} min`;
  };

  return {
    activeServices,
    config,
    configGradient,
    equipmentImageFile,
    equipmentImagePreviewUrl,
    equipmentImageRetryAvailable: Boolean(equipmentImageFile && equipmentImageRetryServiceId),
    equipmentImageUploadError,
    editFieldGroups,
    editForm,
    editSubmitDisabled,
    formatDuration,
    Icon,
    inactiveServices,
    isEquipmentProvider,
    onAddService: () => navigate('/provider/services/new'),
    onCloseDeleteModal: () => setShowDeleteModal(false),
    onCloseEditModal: () => setShowEditModal(false),
    onDeleteClick,
    onDeleteConfirm,
    onEditClick,
    onEquipmentImageChange: handleEquipmentImageChange,
    onEditSave,
    onRefetchProviderProfile: () => {
      void refetchProviderProfile();
    },
    onRefetchServices: () => {
      void refetchServices();
    },
    onRetryEquipmentImageUpload,
    onToggleActive,
    providerProfile,
    providerProfileErrorMessage,
    providerProfileLoading,
    selectedService,
    servicesData,
    servicesError,
    servicesErrorMessage,
    servicesErrorStatus,
    servicesLoading,
    servicesPlaceholderData,
    servicesRefreshing,
    showDeleteModal,
    showEditModal,
    stats: [
      {
        gradient: 'from-green-500 to-emerald-500',
        label: 'Services Actifs',
        value: activeServices.length,
        icon: ToggleRight,
      },
      {
        gradient: 'from-cyan-500 to-blue-500',
        label: 'Prix Moyen',
        value: `${avgPrice} TND`,
        icon: DollarSign,
      },
      {
        gradient: 'from-blue-500 to-cyan-500',
        label: getDurationLabel(),
        value: formatDuration(avgDuration),
        icon: Clock,
      },
    ],
    userServiceType,
  };
}
