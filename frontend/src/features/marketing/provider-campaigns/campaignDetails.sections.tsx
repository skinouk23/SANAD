import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Copy,
  Download,
  Edit,
  Mail,
  MapPin,
  Pause,
  Share2,
  Trash2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import type { AudienceData, CampaignDetail, DailyPerformance } from '@/features/marketing/schema';
import { Skeleton, SkeletonCard } from '@/shared/ui/composites/loading';
import { MetricCard } from '@/shared/ui/composites/metric-card';

import {
  buildAudienceActivityHours,
  buildCampaignStats,
  CAMPAIGN_DETAILS_TABS,
  getBudgetUsage,
  getPerformanceChartMax,
  PERFORMANCE_HIGHLIGHTS,
  type CampaignDetailsTab,
} from './campaignDetails.selectors';

const glassPanelClass =
  'rounded-xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm transition-colors duration-300 dark:border-slate-700/50 dark:bg-slate-800/50';
const slateRowClass =
  'rounded-lg border border-slate-200 bg-slate-50 transition-colors dark:border-slate-700/50 dark:bg-slate-900/50';
const titleClass =
  'text-sm font-bold text-slate-900 transition-colors dark:text-white sm:text-base';
const mutedTextClass = 'text-slate-500 transition-colors dark:text-slate-400';
const actionButtonClass =
  'flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:hover:border-cyan-500/50 dark:hover:bg-slate-700 dark:hover:text-cyan-300';

function getCampaignTypeConfig(type: string) {
  if (type === 'email') {
    return { icon: Mail, gradient: 'from-purple-500 to-pink-500' };
  }

  return { icon: Share2, gradient: 'from-blue-500 to-cyan-500' };
}

export function CampaignDetailsLoadingState() {
  return (
    <div className="min-h-screen pb-24">
      <div className="relative z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
          <Skeleton className="mb-4 h-5 w-40 rounded" />

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="flex items-start gap-3">
              <Skeleton className="h-12 w-12 rounded-xl sm:h-14 sm:w-14" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-64 max-w-full rounded sm:h-7" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-4 w-44 rounded" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-10 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard
              key={index}
              className="rounded-xl border-slate-200 bg-white/80 p-3 backdrop-blur-sm sm:p-4 dark:border-slate-700/50 dark:bg-slate-800/50"
            >
              <div className="mb-2 flex items-center justify-between">
                <Skeleton className="h-8 w-8 rounded-lg sm:h-10 sm:w-10" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="mb-2 h-3 w-20 rounded" />
              <Skeleton className="h-6 w-16 rounded" />
            </SkeletonCard>
          ))}
        </div>

        <SkeletonCard className="mb-6 rounded-xl border-slate-200 bg-white/80 p-4 backdrop-blur-sm sm:p-6 dark:border-slate-700/50 dark:bg-slate-800/50">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <div className="mb-2 flex items-center justify-between">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-4 w-36 rounded" />
          </div>
          <Skeleton className="mb-2 h-2.5 w-full rounded-full" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
        </SkeletonCard>

        <SkeletonCard className="mb-6 rounded-xl border-slate-200 bg-white/80 p-1 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
          <div className="flex">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-1 justify-center px-3 py-2.5">
                <Skeleton className="h-5 w-24 rounded" />
              </div>
            ))}
          </div>
        </SkeletonCard>

        <div className="space-y-6">
          <SkeletonCard className="rounded-xl border-slate-200 bg-white/80 p-4 backdrop-blur-sm sm:p-6 dark:border-slate-700/50 dark:bg-slate-800/50">
            <Skeleton className="mb-4 h-5 w-44 rounded" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700/50 dark:bg-slate-900/50"
                >
                  <Skeleton className="h-4 w-16 rounded" />
                  <div className="grid flex-1 grid-cols-3 gap-2">
                    <Skeleton className="h-4 rounded" />
                    <Skeleton className="h-4 rounded" />
                    <Skeleton className="h-4 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>

          <SkeletonCard className="rounded-xl border-slate-200 bg-white/80 p-4 backdrop-blur-sm sm:p-6 dark:border-slate-700/50 dark:bg-slate-800/50">
            <Skeleton className="mb-4 h-5 w-48 rounded" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700/50 dark:bg-slate-900/50"
                >
                  <Skeleton className="mb-2 h-3 w-24 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  );
}

export function CampaignDetailsErrorState({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="min-h-screen pb-24">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
        <div className="w-full rounded-2xl border border-rose-300/70 bg-rose-50/80 p-6 shadow-sm backdrop-blur-sm dark:border-rose-500/30 dark:bg-rose-950/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-rose-500 dark:text-rose-400" />
            <div className="space-y-3">
              <div>
                <h1 className="text-lg font-bold text-rose-900 dark:text-rose-100">{title}</h1>
                <p className="mt-1 text-sm text-rose-700/80 dark:text-rose-200/80">{message}</p>
              </div>
              {onRetry ? (
                <button
                  type="button"
                  onClick={onRetry}
                  className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:from-cyan-400 hover:to-blue-400 hover:shadow-cyan-500/20"
                >
                  Reessayer
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CampaignDetailsHero({
  campaign,
  onBack,
}: {
  campaign: CampaignDetail;
  onBack: () => void;
}) {
  const typeConfig = getCampaignTypeConfig(campaign.type);
  const Icon = typeConfig.icon;

  return (
    <div className="relative z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm transition-colors duration-300 dark:border-slate-700/50 dark:bg-slate-800/50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        <button
          type="button"
          onClick={onBack}
          className="group mb-4 flex items-center text-sm font-medium text-cyan-600 transition-colors hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Retour aux campagnes
        </button>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${typeConfig.gradient} sm:h-14 sm:w-14`}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="mb-1 text-xl font-bold text-slate-900 transition-colors dark:text-white sm:text-2xl">
                {campaign.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 transition-colors dark:text-slate-400 sm:text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {campaign.startDate} - {campaign.endDate}
                </span>
                <span className="rounded-full border border-green-500/30 bg-green-500/20 px-2 py-0.5 text-xs font-bold text-green-600 dark:text-green-400">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Pause', icon: Pause },
              { label: 'Modifier', icon: Edit },
              { label: 'Dupliquer', icon: Copy },
            ].map((action) => (
              <button type="button" key={action.label} className={actionButtonClass}>
                <action.icon className="h-3.5 w-3.5" />
                {action.label}
              </button>
            ))}
            <button
              type="button"
              className="rounded-lg border border-red-500/30 bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-500/30 dark:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CampaignDetailsStatsGrid({ campaign }: { campaign: CampaignDetail }) {
  const stats = buildCampaignStats(campaign);

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
      {stats.map((stat) => (
        <MetricCard
          key={stat.label}
          className={`${glassPanelClass} p-3 sm:p-4`}
          icon={stat.icon}
          iconClassName={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${stat.gradient} sm:h-10 sm:w-10`}
          iconGradient=""
          iconRowClassName="mb-2 flex items-center justify-between"
          iconSvgClassName="h-4 w-4 text-white sm:h-5 sm:w-5"
          label={stat.label}
          labelClassName="mb-0.5 text-[10px] font-medium uppercase text-cyan-600 transition-colors dark:text-cyan-400 sm:text-xs"
          trailing={
            <span
              className={`flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-bold ${stat.up ? 'border-green-500/30 bg-green-500/20 text-green-600 dark:text-green-400' : 'border-red-500/30 bg-red-500/20 text-red-600 dark:text-red-400'}`}
            >
              {stat.up ? (
                <TrendingUp className="h-2.5 w-2.5" />
              ) : (
                <TrendingDown className="h-2.5 w-2.5" />
              )}
              {stat.change}
            </span>
          }
          value={stat.value}
          valueClassName="text-lg font-bold text-slate-900 transition-colors dark:text-white sm:text-xl"
        />
      ))}
    </div>
  );
}

export function CampaignBudgetPanel({ campaign }: { campaign: CampaignDetail }) {
  const usage = getBudgetUsage(campaign);

  return (
    <div className={`mb-6 ${glassPanelClass} p-4 sm:p-6`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className={titleClass}>Budget utilisé</h3>
        <button type="button" className={actionButtonClass}>
          <Download className="h-3.5 w-3.5" />
          Exporter
        </button>
      </div>
      <div className="mb-2 flex items-center justify-between">
        <span className={`text-xs ${mutedTextClass}`}>Dépensé</span>
        <span className="text-sm font-bold text-slate-900 transition-colors dark:text-white">
          {campaign.spent} TND / {campaign.budget} TND
        </span>
      </div>
      <div className="mb-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 transition-colors dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
          style={{ width: `${usage.percentage}%` }}
        />
      </div>
      <div className={`flex items-center justify-between text-xs ${mutedTextClass}`}>
        <span>{usage.roundedPercentage}% utilisé</span>
        <span>{usage.remaining} TND restants</span>
      </div>
    </div>
  );
}

export function CampaignDetailsTabs({
  activeTab,
  onChange,
}: {
  activeTab: CampaignDetailsTab;
  onChange: (tab: CampaignDetailsTab) => void;
}) {
  return (
    <div className={`mb-6 ${glassPanelClass} p-1`}>
      <div className="flex">
        {CAMPAIGN_DETAILS_TABS.map((tab) => (
          <button
            type="button"
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-medium transition-all sm:text-sm ${activeTab === tab.key ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-white'}`}
          >
            <tab.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function CampaignOverviewPanel({
  campaign,
  performanceData,
}: {
  campaign: CampaignDetail;
  performanceData: DailyPerformance[];
}) {
  return (
    <div className="space-y-6">
      <div className={`${glassPanelClass} p-4 sm:p-6`}>
        <h3 className={`mb-4 ${titleClass}`}>Performance quotidienne</h3>
        <div className="space-y-2">
          {performanceData.map((day, index) => (
            <div
              key={`${day.date}-${index}`}
              className={`flex items-center gap-3 p-3 ${slateRowClass}`}
            >
              <div className={`w-16 text-xs font-medium ${mutedTextClass}`}>{day.date}</div>
              <div className="grid flex-1 grid-cols-3 gap-2 text-xs">
                {[
                  {
                    label: 'Impressions',
                    value: day.impressions,
                    tone: 'text-slate-900 dark:text-white',
                  },
                  { label: 'Clics', value: day.clicks, tone: 'text-slate-900 dark:text-white' },
                  {
                    label: 'Conversions',
                    value: day.conversions,
                    tone: 'text-cyan-600 dark:text-cyan-400',
                  },
                ].map((metric) => (
                  <div key={metric.label}>
                    <p className="text-slate-400 transition-colors dark:text-slate-500">
                      {metric.label}
                    </p>
                    <p className={`font-bold transition-colors ${metric.tone}`}>{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${glassPanelClass} p-4 sm:p-6`}>
        <h3 className={`mb-4 ${titleClass}`}>Contenu de la campagne</h3>
        <div className="space-y-3 text-sm">
          {[
            {
              label: 'Titre',
              value: campaign.content.headline,
              tone: 'text-slate-900 dark:text-white',
            },
            {
              label: 'Description',
              value: campaign.content.description,
              tone: 'text-slate-900 dark:text-white',
            },
            {
              label: "Appel à l'action",
              value: campaign.content.cta,
              tone: 'font-medium text-cyan-600 dark:text-cyan-400',
            },
          ].map((item) => (
            <div key={item.label} className={`p-3 ${slateRowClass}`}>
              <p className={`mb-1 text-xs ${mutedTextClass}`}>{item.label}</p>
              <p className={`transition-colors ${item.tone}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CampaignAudiencePanel({
  audienceData,
  seed,
}: {
  audienceData: AudienceData;
  seed: string;
}) {
  const activityHours = buildAudienceActivityHours(seed);

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
      <div className={`${glassPanelClass} p-4 sm:p-6`}>
        <h3 className={`mb-4 ${titleClass}`}>Répartition par âge</h3>
        <div className="space-y-3">
          {audienceData.ageGroups.map((group) => (
            <div key={group.range}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600 transition-colors dark:text-slate-300">
                  {group.range} ans
                </span>
                <span className="text-xs font-bold text-slate-900 transition-colors dark:text-white">
                  {group.percentage}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 transition-colors dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  style={{ width: `${group.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${glassPanelClass} p-4 sm:p-6`}>
        <h3 className={`mb-4 ${titleClass}`}>Principales villes</h3>
        <div className="space-y-2">
          {audienceData.topLocations.map((location) => (
            <div
              key={location.city}
              className={`flex items-center justify-between p-3 ${slateRowClass}`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-600 transition-colors dark:text-cyan-400" />
                <span className="text-sm font-medium text-slate-900 transition-colors dark:text-white">
                  {location.city}
                </span>
              </div>
              <span className="text-sm font-bold text-cyan-600 transition-colors dark:text-cyan-400">
                {location.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={`${glassPanelClass} p-4 sm:p-6`}>
        <h3 className={`mb-4 ${titleClass}`}>Appareils</h3>
        <div className="space-y-3">
          {audienceData.devices.map((device) => (
            <div key={device.type}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-medium text-slate-600 transition-colors dark:text-slate-300">
                  <device.icon className="h-4 w-4 text-cyan-600 transition-colors dark:text-cyan-400" />
                  {device.type}
                </span>
                <span className="text-xs font-bold text-slate-900 transition-colors dark:text-white">
                  {device.percentage}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 transition-colors dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  style={{ width: `${device.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${glassPanelClass} p-4 sm:p-6`}>
        <h3 className={`mb-4 ${titleClass}`}>Heures d'activité</h3>
        <div className="grid grid-cols-6 gap-1.5">
          {activityHours.map((hour) => (
            <div
              key={hour.hour}
              className="rounded-lg border border-cyan-500/10 p-2 text-center transition-all dark:border-cyan-400/10"
              style={{ backgroundColor: `rgba(6, 182, 212, ${hour.opacity})` }}
            >
              <p className="text-[10px] font-medium text-white drop-shadow-sm">{hour.hour}h</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CampaignPerformancePanel({
  performanceData,
}: {
  performanceData: DailyPerformance[];
}) {
  const maxImpressions = getPerformanceChartMax(performanceData);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PERFORMANCE_HIGHLIGHTS.map((item) => (
          <div key={item.label} className={`${glassPanelClass} p-4`}>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
              <item.icon className="h-5 w-5 text-white" />
            </div>
            <p className={`mb-1 text-xs ${mutedTextClass}`}>{item.label}</p>
            <p className="mb-1 text-xl font-bold text-slate-900 transition-colors dark:text-white">
              {item.value}
            </p>
            <p className="text-xs text-slate-400 transition-colors dark:text-slate-500">
              {item.sub}
            </p>
          </div>
        ))}
      </div>

      <div className={`${glassPanelClass} p-4 sm:p-6`}>
        <h3 className={`mb-4 ${titleClass}`}>Évolution des impressions</h3>
        <div className="flex h-48 items-end justify-between gap-2">
          {performanceData.map((day, index) => (
            <div
              key={`${day.date}-${index}`}
              className="flex flex-1 flex-col items-center gap-2"
              style={{ height: `${(day.impressions / maxImpressions) * 100}%` }}
            >
              <div className="h-full w-full cursor-pointer rounded-t-lg bg-gradient-to-t from-cyan-500 to-blue-500 transition-opacity hover:opacity-80" />
              <span className="text-[10px] text-slate-400 transition-colors dark:text-slate-500">
                {day.date.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
