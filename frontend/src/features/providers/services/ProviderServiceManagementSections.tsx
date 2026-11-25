import { AlertCircle, Plus, RefreshCw, ToggleLeft, Zap } from 'lucide-react';

import { ProviderRouteHeader } from '@/features/providers/shared/ui/ProviderRouteHeader';
import { ProviderServiceCard } from '@/features/providers/services/components/ProviderServiceCard';
import { ProviderServiceManagementContentSkeleton } from '@/features/providers/services/components/ProviderServiceManagementContentSkeleton';
import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/composites/loading';

import type { ProviderServiceManagementScreenViewModel } from './useProviderServiceManagementScreen';

const DEFAULT_CONFIG_GRADIENT = 'from-cyan-500 to-blue-500';

export function ProviderServiceManagementLoadingState() {
  return (
    <div className="min-h-screen pb-20">
      <ProviderRouteHeader containerClassName="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div>
              <Skeleton className="mb-1 h-2.5 w-24 rounded" />
              <Skeleton className="h-5 w-28 rounded" />
            </div>
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </ProviderRouteHeader>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6">
        <ProviderServiceManagementContentSkeleton gradient={DEFAULT_CONFIG_GRADIENT} />
      </div>
    </div>
  );
}

export function ProviderServiceManagementProfileErrorState({
  errorMessage,
  onRetry,
}: {
  errorMessage: string;
  onRetry: () => void;
}) {
  return (
    <div className="min-h-screen pb-20">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6">
        <div
          className="rounded-xl border border-rose-200 bg-white/80 p-4 text-rose-700 shadow-sm backdrop-blur-sm dark:border-rose-500/40 dark:bg-rose-950/30 dark:text-rose-200"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
            <div className="space-y-3">
              <p>{errorMessage}</p>
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/20"
              >
                <RefreshCw className="h-4 w-4" />
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProviderServiceManagementHeader({
  screen,
}: {
  screen: ProviderServiceManagementScreenViewModel;
}) {
  if (!screen.config) {
    return null;
  }

  const headerGradient = screen.configGradient ?? DEFAULT_CONFIG_GRADIENT;

  return (
    <ProviderRouteHeader containerClassName="mx-auto max-w-7xl px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br',
              headerGradient,
            )}
          >
            <screen.Icon className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
              {screen.config.title}
            </p>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">Mes Services</h1>
          </div>
        </div>
        <button
          type="button"
          onClick={screen.onAddService}
          className="group/btn relative self-start overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30"
        >
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-r opacity-0 blur-xl transition-opacity group-hover/btn:opacity-100',
              headerGradient,
            )}
          />
          <div
            className={cn(
              'relative flex items-center gap-1.5 rounded-lg bg-gradient-to-r px-3 py-1.5 text-xs font-medium text-white transition-transform group-hover/btn:scale-105 active:scale-[0.98]',
              headerGradient,
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            Ajouter
          </div>
        </button>
      </div>
    </ProviderRouteHeader>
  );
}

export function ProviderServiceManagementContent({
  screen,
}: {
  screen: ProviderServiceManagementScreenViewModel;
}) {
  if (!screen.config) {
    return null;
  }

  const servicesInitialLoading = screen.servicesLoading && !screen.servicesData;
  const servicesUpdating =
    (screen.servicesRefreshing || screen.servicesPlaceholderData) && Boolean(screen.servicesData);

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-6">
      {servicesUpdating ? (
        <div className="mb-4">
          <span className="rounded-full border border-slate-200 bg-white/80 px-2 py-0.5 text-[10px] font-medium text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400">
            Mise à jour...
          </span>
        </div>
      ) : null}

      {screen.servicesErrorMessage ? (
        <div
          className="mb-4 rounded-xl border border-rose-200 bg-white/80 px-4 py-3 text-sm text-rose-700 shadow-sm backdrop-blur-sm dark:border-rose-500/40 dark:bg-rose-950/30 dark:text-rose-200"
          role="alert"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>
                {screen.servicesErrorStatus === 401 || screen.servicesErrorStatus === 403
                  ? 'Accès non autorisé à la liste des services.'
                  : screen.servicesErrorStatus === 404
                    ? 'Aucun service n’a été trouvé pour ce compte prestataire.'
                    : screen.servicesErrorMessage}
              </span>
            </div>
            <button
              type="button"
              onClick={screen.onRefetchServices}
              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/20"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Réessayer
            </button>
          </div>
        </div>
      ) : null}

      {servicesInitialLoading ? (
        <ProviderServiceManagementContentSkeleton gradient={screen.configGradient} />
      ) : screen.servicesError && !screen.servicesData ? (
        <div className="rounded-xl border border-rose-200 bg-white/80 p-5 text-sm text-rose-700 shadow-sm backdrop-blur-sm dark:border-rose-500/40 dark:bg-rose-950/30 dark:text-rose-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
            <div className="space-y-3">
              <p>
                {screen.servicesErrorStatus === 401 || screen.servicesErrorStatus === 403
                  ? 'Vous n’êtes pas autorisé à gérer ces services.'
                  : screen.servicesErrorStatus === 404
                    ? 'Aucun service n’a encore été publié pour ce compte.'
                    : (screen.servicesErrorMessage ??
                      'Les services sont indisponibles pour le moment.')}
              </p>
              <button
                type="button"
                onClick={screen.onRefetchServices}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 font-medium text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/20"
              >
                <RefreshCw className="h-4 w-4" />
                Réessayer
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            {screen.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br',
                      stat.gradient ?? DEFAULT_CONFIG_GRADIENT,
                    )}
                  >
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <Zap className="h-4 w-4 text-green-500" />
              Services Actifs
            </h2>
            <div className="space-y-3">
              {screen.activeServices.map((service) => (
                <ProviderServiceCard
                  key={service.id}
                  formatDuration={screen.formatDuration}
                  isActive
                  onDelete={screen.onDeleteClick}
                  onEdit={screen.onEditClick}
                  onToggle={screen.onToggleActive}
                  service={service}
                  configGradient={screen.configGradient}
                  userServiceType={screen.userServiceType}
                />
              ))}
              {screen.activeServices.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white/70 py-6 text-center shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/30">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {screen.inactiveServices.length > 0
                      ? 'Aucun service actif pour le moment'
                      : 'Aucun service publié pour le moment'}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {screen.inactiveServices.length > 0 ? (
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <ToggleLeft className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                Services Désactivés
              </h2>
              <div className="space-y-3">
                {screen.inactiveServices.map((service) => (
                  <ProviderServiceCard
                    key={service.id}
                    formatDuration={screen.formatDuration}
                    isActive={false}
                    onDelete={screen.onDeleteClick}
                    onEdit={screen.onEditClick}
                    onToggle={screen.onToggleActive}
                    service={service}
                    configGradient={screen.configGradient}
                    userServiceType={screen.userServiceType}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
