import { myProviderProfileOptions, myServicesOptions } from '@/features/providers';
import { queryClient } from '@/shared/lib/query/client';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { ProviderServiceDeleteModal } from '@/features/providers/services/components/ProviderServiceDeleteModal';
import { ProviderServiceEditModal } from '@/features/providers/services/components/ProviderServiceEditModal';
import {
  ProviderServiceManagementContent,
  ProviderServiceManagementHeader,
  ProviderServiceManagementLoadingState,
  ProviderServiceManagementProfileErrorState,
} from './ProviderServiceManagementSections';
import { useProviderServiceManagementScreen } from './useProviderServiceManagementScreen';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = (_args: LoaderFunctionArgs) => {
  void Promise.all([
    queryClient.prefetchQuery(myProviderProfileOptions()),
    queryClient.prefetchQuery(myServicesOptions()),
  ]).catch(() => undefined);

  return null;
};
export function ProviderServiceManagementScreen() {
  const screen = useProviderServiceManagementScreen();

  if (screen.providerProfileLoading && !screen.providerProfile) {
    return <ProviderServiceManagementLoadingState />;
  }

  if (!screen.config) {
    return (
      <ProviderServiceManagementProfileErrorState
        errorMessage={screen.providerProfileErrorMessage}
        onRetry={screen.onRefetchProviderProfile}
      />
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <ProviderServiceManagementHeader screen={screen} />

      <ProviderServiceManagementContent screen={screen} />

      <ProviderServiceEditModal
        open={screen.showEditModal}
        selectedService={screen.selectedService}
        primaryFields={screen.editFieldGroups.primaryFields}
        extraFields={screen.editFieldGroups.extraFields}
        form={screen.editForm}
        equipmentImageFile={screen.equipmentImageFile}
        equipmentImagePreviewUrl={screen.equipmentImagePreviewUrl}
        equipmentImageRetryAvailable={screen.equipmentImageRetryAvailable}
        equipmentImageUploadError={screen.equipmentImageUploadError}
        isEquipmentProvider={screen.isEquipmentProvider}
        submitDisabled={screen.editSubmitDisabled}
        onClose={screen.onCloseEditModal}
        onEquipmentImageChange={screen.onEquipmentImageChange}
        onRetryEquipmentImageUpload={screen.onRetryEquipmentImageUpload}
        onSubmit={screen.onEditSave}
      />

      <ProviderServiceDeleteModal
        open={screen.showDeleteModal}
        selectedService={screen.selectedService}
        onClose={screen.onCloseDeleteModal}
        onConfirm={screen.onDeleteConfirm}
      />
    </div>
  );
}
