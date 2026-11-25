import type { LoaderFunctionArgs } from 'react-router-dom';

import {
  insuranceClaimsOptions,
  insuranceCoverageOptions,
  insuranceDocumentsOptions,
  insuranceStatsOptions,
} from '@/features/insurance';
import { queryClient } from '@/shared/lib/query/client';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

import { useProviderInsuranceScreen } from './providerInsurance.hooks';
import {
  ProviderInsuranceConditionsModal,
  ProviderInsuranceErrorState,
  ProviderInsuranceHeader,
  ProviderInsuranceIntro,
  ProviderInsuranceLoadingState,
  ProviderInsuranceMainSection,
  ProviderInsuranceSidebar,
  ProviderInsuranceStats,
} from './providerInsurance.sections';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = (_args: LoaderFunctionArgs) => {
  void queryClient.prefetchQuery(insuranceCoverageOptions());
  void queryClient.prefetchQuery(insuranceClaimsOptions());
  void queryClient.prefetchQuery(insuranceDocumentsOptions());
  void queryClient.prefetchQuery(insuranceStatsOptions());

  return null;
};

export function Insurance() {
  const screen = useProviderInsuranceScreen();

  if (screen.loading) {
    return <ProviderInsuranceLoadingState />;
  }

  if (screen.error) {
    return (
      <ProviderInsuranceErrorState
        message={getApiErrorMessage(
          screen.error,
          "Impossible de charger les donnees d'assurance pour le moment.",
        )}
        onRetry={screen.refetchAll}
      />
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <ProviderInsuranceHeader />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6">
        <ProviderInsuranceIntro />
        <ProviderInsuranceStats stats={screen.statCards} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ProviderInsuranceMainSection
            claims={screen.claims.data ?? []}
            coverage={screen.coverage.data ?? []}
          />
          <ProviderInsuranceSidebar
            documents={screen.documents.data ?? []}
            onFileClaim={() => screen.navigate('/provider/insurance/file-claim')}
            onShowConditions={() => screen.setShowConditionsModal(true)}
          />
        </div>
      </div>

      <ProviderInsuranceConditionsModal
        open={screen.showConditionsModal}
        onClose={() => screen.setShowConditionsModal(false)}
      />
    </div>
  );
}
