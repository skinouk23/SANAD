import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Crown,
  Mail,
  Megaphone,
  Play,
  Share2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

import { ProviderRouteHeader } from '@/features/providers';
import { Skeleton, SkeletonCard } from '@/shared/ui/composites/loading';
import { MetricCard } from '@/shared/ui/composites/metric-card';

import type { ComponentType } from 'react';

export type MarketingCampaignTab = 'active' | 'scheduled' | 'completed';

export interface MarketingCampaignView {
  id: string | number;
  name: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  ctr?: number;
  roi?: number;
}

export interface MarketingCampaignIdeaView {
  template: string;
  title: string;
  desc: string;
}

export interface MarketingCampaignStatView {
  label: string;
  value: string | number;
  change: string;
  icon: ComponentType<{ className?: string }>;
  gradient: string;
}

function getCampaignTypeIcon(type: string) {
  switch (type) {
    case 'social':
      return <Share2 className="h-3.5 w-3.5" />;
    case 'email':
      return <Mail className="h-3.5 w-3.5" />;
    default:
      return <Megaphone className="h-3.5 w-3.5" />;
  }
}

function getCampaignTypeConfig(type: string) {
  switch (type) {
    case 'social':
      return {
        label: 'Réseaux sociaux',
        gradient: 'from-blue-500 to-cyan-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-500',
      };
    case 'email':
      return {
        label: 'Email marketing',
        gradient: 'from-purple-500 to-pink-500',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-500',
      };
    default:
      return {
        label: 'Autre',
        gradient: 'from-slate-500 to-slate-600',
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/30',
        text: 'text-slate-500',
      };
  }
}

export function MarketingCampaignsLoadingState() {
  return (
    <div className="min-h-screen pb-20">
      <ProviderRouteHeader containerClassName="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <Skeleton className="mb-1.5 h-3 w-20 rounded" />
            <Skeleton className="h-6 w-52 rounded sm:h-8" />
            <Skeleton className="mt-2 h-3 w-40 rounded" />
          </div>
          <Skeleton className="h-9 w-36 rounded-lg self-start sm:self-auto" />
        </div>
      </ProviderRouteHeader>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-6">
        <SkeletonCard className="mb-4 rounded-xl border-amber-200 bg-amber-50/80 p-3 shadow-sm backdrop-blur-sm sm:p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Skeleton className="h-10 w-10 rounded-lg sm:h-12 sm:w-12" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-56 max-w-full rounded" />
              <Skeleton className="h-3 w-64 max-w-full rounded" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </SkeletonCard>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-6">
        <div className="mb-4 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} className="space-y-2 p-2.5 sm:p-3">
              <div className="mb-1.5 flex items-center justify-between sm:mb-2">
                <Skeleton className="h-7 w-7 rounded-lg sm:h-8 sm:w-8" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-6 w-24 rounded" />
            </SkeletonCard>
          ))}
        </div>

        <SkeletonCard className="mb-3 rounded-xl p-1 sm:mb-4">
          <div className="flex">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-1 justify-center px-1.5 py-2 sm:px-3 sm:py-2.5">
                <Skeleton className="h-4 w-16 rounded" />
              </div>
            ))}
          </div>
        </SkeletonCard>

        <div className="mb-6 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} className="rounded-xl p-3 sm:p-4">
              <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                <div className="flex items-start gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg sm:h-10 sm:w-10" />
                  <div className="min-w-0 space-y-2">
                    <Skeleton className="h-4 w-48 max-w-full rounded" />
                    <div className="flex flex-wrap gap-1.5">
                      <Skeleton className="h-4 w-32 rounded" />
                      <Skeleton className="h-4 w-24 rounded-full" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-7 w-20 rounded-lg" />
              </div>

              <div className="mb-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-24 rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>

              <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5 sm:gap-2">
                {Array.from({ length: 5 }).map((_, metricIndex) => (
                  <div
                    key={metricIndex}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 sm:p-2 dark:border-slate-700 dark:bg-slate-700/30"
                  >
                    <Skeleton className="mx-auto mb-1 h-4 w-10 rounded" />
                    <Skeleton className="mx-auto h-2.5 w-14 rounded" />
                  </div>
                ))}
              </div>
            </SkeletonCard>
          ))}
        </div>

        <SkeletonCard className="rounded-xl border-cyan-200 bg-cyan-50/80 p-3 shadow-sm sm:p-4 dark:border-cyan-500/30 dark:bg-cyan-500/10">
          <div className="mb-3 flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg sm:h-10 sm:w-10" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-44 rounded" />
              <Skeleton className="h-3 w-56 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={index} className="rounded-lg p-3 shadow-sm">
                <Skeleton className="mb-2 h-4 w-32 rounded" />
                <Skeleton className="mb-3 h-3 w-full rounded" />
                <Skeleton className="h-7 w-full rounded-md" />
              </SkeletonCard>
            ))}
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
}

export function MarketingCampaignsErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="min-h-screen pb-20">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
        <div className="w-full rounded-2xl border border-rose-200 bg-rose-50/80 p-6 shadow-sm backdrop-blur-sm dark:border-red-500/30 dark:bg-red-500/10">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-500 dark:bg-red-500/20">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="space-y-3">
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  Campagnes indisponibles
                </h1>
                <p className="mt-1 text-sm text-rose-700/80 dark:text-red-100/80">{message}</p>
              </div>
              <button
                onClick={onRetry}
                className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-cyan-500/20 transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
              >
                Reessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MarketingCampaignsHero({ onCreate }: { onCreate: () => void }) {
  return (
    <>
      <ProviderRouteHeader containerClassName="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan-600 sm:text-xs dark:text-cyan-400">
              MARKETING
            </p>
            <h1 className="text-lg font-bold text-slate-900 sm:text-2xl dark:text-white">
              Campagnes Marketing
            </h1>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
              Développez votre visibilité
            </p>
          </div>
          <button onClick={onCreate} className="group/btn relative self-start overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 blur-xl transition-opacity group-hover/btn:opacity-100" />
            <div className="relative flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-2 text-xs font-medium text-white transition-transform group-hover/btn:scale-105">
              <Megaphone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Nouvelle campagne</span>
              <span className="sm:hidden">Créer</span>
            </div>
          </button>
        </div>
      </ProviderRouteHeader>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-6">
        <div className="mb-4 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-3 shadow-sm backdrop-blur-sm sm:p-4 dark:border-amber-500/30 dark:from-amber-500/10 dark:to-orange-500/10">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white sm:h-12 sm:w-12">
              <Crown className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="mb-0.5 text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                Campagnes Marketing Incluses
              </h3>
              <p className="text-[10px] text-slate-600 sm:text-xs dark:text-slate-300">
                Budget marketing de 500 TND/mois offert
              </p>
            </div>
            <span className="whitespace-nowrap rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-1 text-[10px] font-bold text-white">
              👑 Elite
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export function MarketingCampaignStatsGrid({ stats }: { stats: MarketingCampaignStatView[] }) {
  return (
    <div className="mb-4 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <MetricCard
          key={stat.label}
          className="rounded-xl border border-slate-200 bg-white/80 p-2.5 shadow-sm backdrop-blur-sm sm:p-3 dark:border-slate-700/50 dark:bg-slate-800/50"
          icon={stat.icon}
          iconClassName={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${stat.gradient} text-white sm:h-8 sm:w-8`}
          iconGradient=""
          iconRowClassName="mb-1.5 flex items-center justify-between sm:mb-2"
          iconSvgClassName="h-3.5 w-3.5 sm:h-4 sm:w-4"
          label={stat.label}
          labelClassName="mb-0.5 text-[9px] font-medium uppercase tracking-wide text-cyan-600 sm:text-[10px] dark:text-cyan-400"
          trailing={
            <span className="flex items-center gap-0.5 rounded-full border border-green-500/30 bg-green-500/20 px-1.5 py-0.5 text-[9px] font-bold text-green-500 sm:text-[10px]">
              <TrendingUp className="h-2.5 w-2.5" />
              {stat.change}
            </span>
          }
          value={stat.value}
          valueClassName="text-lg font-bold text-slate-900 sm:text-xl dark:text-white"
        />
      ))}
    </div>
  );
}

export function MarketingCampaignTabs({
  activeTab,
  counts,
  onChange,
}: {
  activeTab: MarketingCampaignTab;
  counts: Record<MarketingCampaignTab, number>;
  onChange: (tab: MarketingCampaignTab) => void;
}) {
  const tabs = [
    { key: 'active' as const, label: 'Actives', icon: Play },
    { key: 'scheduled' as const, label: 'Programmées', icon: Clock },
    { key: 'completed' as const, label: 'Terminées', icon: CheckCircle2 },
  ];

  return (
    <div className="mb-3 rounded-xl border border-slate-200 bg-white/80 p-1 shadow-sm backdrop-blur-sm sm:mb-4 dark:border-slate-700/50 dark:bg-slate-800/50">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-1.5 py-2 text-[10px] font-medium transition-all sm:gap-1.5 sm:px-3 sm:py-2.5 sm:text-xs ${activeTab === tab.key ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-white'}`}
          >
            <tab.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.slice(0, 3)}.</span>
            <span
              className={`rounded-full px-1 py-0.5 text-[9px] font-bold ${activeTab === tab.key ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function MarketingCampaignList({
  campaigns,
  onOpen,
}: {
  campaigns: MarketingCampaignView[];
  onOpen: (campaignId: string | number) => void;
}) {
  return (
    <div className="mb-6 space-y-3">
      <>
        {campaigns.map((campaign) => {
          const typeConfig = getCampaignTypeConfig(campaign.type);
          return (
            <div
              key={campaign.id}
              className="rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm transition-all hover:border-cyan-500 sm:p-4 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-cyan-500/30"
            >
              <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                <div className="flex items-start gap-2">
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${typeConfig.gradient} text-white sm:h-10 sm:w-10`}
                  >
                    {getCampaignTypeIcon(campaign.type)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="mb-0.5 truncate text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
                      {campaign.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-2.5 w-2.5" />
                        {campaign.startDate} - {campaign.endDate}
                      </span>
                      <span
                        className={`rounded-full border px-1.5 py-0.5 text-[9px] font-medium ${typeConfig.bg} ${typeConfig.border} ${typeConfig.text}`}
                      >
                        {typeConfig.label}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onOpen(campaign.id)}
                  className="self-start rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-700 transition-all hover:bg-slate-50 hover:text-cyan-600 dark:border-slate-600 dark:bg-slate-700/50 dark:text-cyan-400 dark:hover:bg-slate-700 dark:hover:text-white"
                >
                  <span className="inline-flex items-center gap-1">
                    Détails
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </button>
              </div>

              {campaign.status !== 'scheduled' ? (
                <>
                  <div className="mb-3">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        Budget utilisé
                      </span>
                      <span className="text-[10px] font-bold text-slate-900 dark:text-white">
                        {campaign.spent} TND / {campaign.budget} TND
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        style={{ width: `${((campaign.spent ?? 0) / campaign.budget) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5 sm:gap-2">
                    {[
                      { label: 'Impressions', value: campaign.impressions?.toLocaleString() },
                      { label: 'Clics', value: campaign.clicks },
                      { label: 'Conversions', value: campaign.conversions },
                      { label: 'CTR', value: `${campaign.ctr}%`, hideOnMobile: true },
                      { label: 'ROI', value: `${campaign.roi}%`, highlight: true },
                    ].map((metric) => (
                      <div
                        key={metric.label}
                        className={`rounded-lg p-1.5 text-center sm:p-2 ${metric.highlight ? 'border border-green-500/30 bg-green-500/10' : 'border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/30'} ${metric.hideOnMobile ? 'hidden sm:block' : ''}`}
                      >
                        <p
                          className={`text-sm font-bold sm:text-base ${metric.highlight ? 'text-green-500' : 'text-slate-900 dark:text-white'}`}
                        >
                          {metric.value}
                        </p>
                        <p className="mt-0.5 text-[9px] text-slate-500 sm:text-[10px] dark:text-slate-400">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-2 sm:p-3 dark:border-blue-500/30 dark:bg-blue-500/10">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/20">
                    <Clock className="h-3 w-3 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      Campagne programmée
                    </p>
                    <p className="text-[10px] text-blue-500">
                      Démarrage automatique le {campaign.startDate}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </>

      {campaigns.length === 0 ? (
        <div className="py-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <Megaphone className="h-6 w-6 text-slate-400 dark:text-slate-600" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Aucune campagne dans cette catégorie
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function MarketingCampaignIdeasPanel({
  ideas,
  onCreate,
}: {
  ideas: MarketingCampaignIdeaView[];
  onCreate: (template: string) => void;
}) {
  return (
    <div className="rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-3 shadow-sm sm:p-4 dark:border-cyan-500/30 dark:from-cyan-500/10 dark:to-blue-500/10">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-white sm:h-10 sm:w-10">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
            💡 Idées de campagnes
          </h3>
          <p className="text-[10px] text-slate-600 sm:text-xs dark:text-slate-400">
            Suggestions personnalisées pour vous
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {ideas.map((idea) => (
          <div
            key={idea.template}
            className="rounded-lg border border-slate-200 bg-white/80 p-3 shadow-sm transition-all hover:border-cyan-500 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-cyan-500/30"
          >
            <h4 className="mb-1 text-xs font-semibold text-slate-900 dark:text-white">
              {idea.title}
            </h4>
            <p className="mb-2 text-[10px] text-slate-500 dark:text-slate-400">{idea.desc}</p>
            <button
              onClick={() => onCreate(idea.template)}
              className="flex w-full items-center justify-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-[10px] font-medium text-cyan-600 transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-700/50 dark:text-cyan-400 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              Créer
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
