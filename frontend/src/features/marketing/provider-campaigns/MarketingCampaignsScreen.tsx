import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  campaignIdeasOptions,
  campaignsOptions,
  marketingStatsOptions,
  useCampaignIdeas,
  useMarketingCampaigns,
  useMarketingStats,
} from '@/features/marketing';
import {
  MarketingCampaignIdeasPanel,
  MarketingCampaignList,
  MarketingCampaignsErrorState,
  MarketingCampaignsHero,
  MarketingCampaignsLoadingState,
  MarketingCampaignStatsGrid,
  MarketingCampaignTabs,
  type MarketingCampaignTab,
} from '@/features/marketing/provider-campaigns/marketingCampaigns.sections';
import { buildMarketingStats } from '@/features/marketing/provider-campaigns/buildMarketingStats';
import { queryClient } from '@/shared/lib/query/client';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

import type { LoaderFunctionArgs } from 'react-router-dom';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async (_args: LoaderFunctionArgs) => {
  await Promise.all([
    queryClient.prefetchQuery(campaignsOptions()),
    queryClient.prefetchQuery(marketingStatsOptions()),
    queryClient.prefetchQuery(campaignIdeasOptions()),
  ]);
  return null;
};

export function MarketingCampaigns() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MarketingCampaignTab>('active');
  const {
    data: activeCampaigns,
    loading: activeLoading,
    error: activeError,
    refetch: refetchActive,
  } = useMarketingCampaigns('active');
  const {
    data: scheduledCampaigns,
    loading: scheduledLoading,
    error: scheduledError,
    refetch: refetchScheduled,
  } = useMarketingCampaigns('scheduled');
  const {
    data: completedCampaigns,
    loading: completedLoading,
    error: completedError,
    refetch: refetchCompleted,
  } = useMarketingCampaigns('completed');
  const {
    data: marketingStats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useMarketingStats();
  const { data: campaignIdeas, error: ideasError, refetch: refetchIdeas } = useCampaignIdeas();

  const loading = activeLoading || scheduledLoading || completedLoading || statsLoading;
  const screenError = activeError || scheduledError || completedError || statsError || ideasError;
  const campaignsByTab = {
    active: activeCampaigns || [],
    scheduled: scheduledCampaigns || [],
    completed: completedCampaigns || [],
  };
  const stats = buildMarketingStats(marketingStats ?? undefined);

  if (loading) {
    return <MarketingCampaignsLoadingState />;
  }

  if (screenError) {
    return (
      <MarketingCampaignsErrorState
        message={getApiErrorMessage(
          screenError,
          'Impossible de charger les campagnes marketing pour le moment.',
        )}
        onRetry={() => {
          void refetchActive();
          void refetchScheduled();
          void refetchCompleted();
          void refetchStats();
          void refetchIdeas();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <MarketingCampaignsHero onCreate={() => navigate('/provider/marketing/new')} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-6">
        <MarketingCampaignStatsGrid stats={stats} />

        <MarketingCampaignTabs
          activeTab={activeTab}
          counts={{
            active: campaignsByTab.active.length,
            scheduled: campaignsByTab.scheduled.length,
            completed: campaignsByTab.completed.length,
          }}
          onChange={setActiveTab}
        />

        <MarketingCampaignList
          campaigns={campaignsByTab[activeTab]}
          onOpen={(campaignId) => navigate(`/provider/marketing/${campaignId}`)}
        />

        <MarketingCampaignIdeasPanel
          ideas={campaignIdeas || []}
          onCreate={(template) =>
            navigate('/provider/marketing/new', {
              state: {
                template,
              },
            })
          }
        />
      </div>
    </div>
  );
}
