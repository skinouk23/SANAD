import { useState } from 'react';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';

import {
  campaignDetailOptions,
  useCampaignAudience,
  useCampaignDetail,
  useCampaignPerformance,
} from '@/features/marketing';
import { queryClient } from '@/shared/lib/query/client';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

import {
  CampaignAudiencePanel,
  CampaignBudgetPanel,
  CampaignDetailsErrorState,
  CampaignDetailsHero,
  CampaignDetailsLoadingState,
  CampaignDetailsStatsGrid,
  CampaignDetailsTabs,
  CampaignOverviewPanel,
  CampaignPerformancePanel,
} from './campaignDetails.sections';
import {
  EMPTY_AUDIENCE_DATA,
  EMPTY_CAMPAIGN_DETAIL,
  type CampaignDetailsTab,
} from './campaignDetails.selectors';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (params.id) {
    await queryClient.prefetchQuery(campaignDetailOptions(params.id));
  }

  return null;
};

export function CampaignDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<CampaignDetailsTab>('overview');
  const {
    data: campaign,
    loading: campaignLoading,
    error: campaignError,
    refetch,
  } = useCampaignDetail(id);
  const {
    data: performanceData,
    loading: perfLoading,
    error: perfError,
  } = useCampaignPerformance(id);
  const { data: audienceData, loading: audLoading, error: audError } = useCampaignAudience(id);

  const loading = campaignLoading || perfLoading || audLoading;
  const screenError = campaignError || perfError || audError;
  const safeCampaign = campaign ?? EMPTY_CAMPAIGN_DETAIL;
  const safePerformanceData = performanceData ?? [];
  const safeAudienceData = audienceData ?? EMPTY_AUDIENCE_DATA;

  if (loading) {
    return <CampaignDetailsLoadingState />;
  }

  if (!id || screenError) {
    return (
      <CampaignDetailsErrorState
        title="Details de campagne indisponibles"
        message={
          !id
            ? 'Identifiant de campagne introuvable.'
            : getApiErrorMessage(
                screenError,
                'Impossible de charger cette campagne pour le moment.',
              )
        }
        onRetry={id ? () => void refetch() : undefined}
      />
    );
  }

  if (!campaign) {
    return (
      <CampaignDetailsErrorState
        title="Campagne introuvable"
        message="Cette campagne ne retourne aucune donnee exploitable."
      />
    );
  }

  return (
    <div className="min-h-screen pb-24 transition-colors duration-300">
      <CampaignDetailsHero campaign={safeCampaign} onBack={() => navigate('/provider/marketing')} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <CampaignDetailsStatsGrid campaign={safeCampaign} />
        <CampaignBudgetPanel campaign={safeCampaign} />
        <CampaignDetailsTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'overview' ? (
          <CampaignOverviewPanel campaign={safeCampaign} performanceData={safePerformanceData} />
        ) : null}
        {activeTab === 'audience' ? (
          <CampaignAudiencePanel audienceData={safeAudienceData} seed={safeCampaign.id} />
        ) : null}
        {activeTab === 'performance' ? (
          <CampaignPerformancePanel performanceData={safePerformanceData} />
        ) : null}
      </div>
    </div>
  );
}
