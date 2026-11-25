import type { LoaderFunctionArgs } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { providerDeliveryOptions } from '@/features/delivery';
import { queryClient } from '@/shared/lib/query/client';

import { useProviderActiveDeliveryScreen } from './providerActiveDelivery.hooks';
import {
  ActiveDeliveryCompletedState,
  ActiveDeliveryErrorState,
  ActiveDeliveryMapScene,
  ActiveDeliveryNoShowState,
  ActiveDeliverySkeleton,
} from './providerActiveDelivery.sections';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (params.sessionId) {
    await queryClient.prefetchQuery(providerDeliveryOptions(params.sessionId));
  }

  return null;
};

export function ProviderActiveDeliveryScreen() {
  const navigate = useNavigate();
  const screen = useProviderActiveDeliveryScreen();

  if (!screen.sessionId) {
    return null;
  }

  if (screen.loading) {
    return <ActiveDeliverySkeleton loadingLabel={screen.t.common.loading} />;
  }

  if (screen.error || !screen.delivery) {
    return (
      <ActiveDeliveryErrorState
        deliveryErrorStatus={screen.deliveryErrorStatus}
        onRetry={screen.refetch}
        t={screen.t}
      />
    );
  }

  if (screen.deliveryStatus === 'completed') {
    return (
      <ActiveDeliveryCompletedState
        amountLabel={screen.amountLabel}
        delivery={screen.delivery}
        onBackToDashboard={() => navigate('/provider-dashboard')}
        t={screen.t}
      />
    );
  }

  if (screen.deliveryStatus === 'no_show') {
    return (
      <ActiveDeliveryNoShowState
        delivery={screen.delivery}
        onBackToDashboard={() => navigate('/provider-dashboard')}
        t={screen.t}
      />
    );
  }

  return <ActiveDeliveryMapScene {...screen} />;
}
