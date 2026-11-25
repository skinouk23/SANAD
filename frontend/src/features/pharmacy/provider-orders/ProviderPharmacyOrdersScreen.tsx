import type { LoaderFunctionArgs } from 'react-router-dom';

import { pharmacyOrdersListOptions } from '@/features/pharmacy';
import { queryClient } from '@/shared/lib/query/client';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

import { useProviderPharmacyOrdersScreen } from './providerPharmacyOrders.hooks';
import {
  ProviderDeliveryPreparationModal,
  ProviderPharmacyOrdersErrorState,
  ProviderPharmacyOrdersGrid,
  ProviderPharmacyOrdersHeader,
  ProviderPharmacyOrdersLoadingState,
  ProviderPrescriptionModal,
} from './providerPharmacyOrders.sections';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async (_args: LoaderFunctionArgs) => {
  await queryClient.prefetchQuery(pharmacyOrdersListOptions());
  return null;
};

export function ProviderPharmacyOrdersScreen() {
  const screen = useProviderPharmacyOrdersScreen();

  if (screen.loading) {
    return <ProviderPharmacyOrdersLoadingState />;
  }

  if (screen.error && !screen.orders.length) {
    return (
      <ProviderPharmacyOrdersErrorState
        message={getApiErrorMessage(
          screen.error,
          'Impossible de charger les commandes pharmacie pour le moment.',
        )}
        onRetry={screen.refetch}
      />
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <ProviderPharmacyOrdersHeader
        activeTab={screen.activeTab}
        onTabChange={screen.setActiveTab}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ProviderPharmacyOrdersGrid
          activeTab={screen.activeTab}
          orders={screen.filteredOrders}
          onStartDelivery={screen.openDeliveryModal}
          onViewPrescription={screen.openPrescription}
        />
      </div>

      <ProviderPrescriptionModal
        open={screen.showPrescriptionModal}
        order={screen.selectedOrder}
        onClose={screen.closePrescription}
      />

      <ProviderDeliveryPreparationModal
        open={screen.showDeliveryModal}
        amount={screen.deliveryAmount}
        onAmountChange={screen.setDeliveryAmount}
        onClose={screen.closeDelivery}
        onConfirm={screen.closeDelivery}
      />
    </div>
  );
}
