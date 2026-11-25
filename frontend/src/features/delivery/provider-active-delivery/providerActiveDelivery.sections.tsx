import type { ReactNode } from 'react';
import { lazy, Suspense, useId, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Flag,
  Loader2,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Play,
  ShieldCheck,
  UserX,
} from 'lucide-react';

import type { ProviderDelivery } from '@/features/delivery';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { Skeleton, SkeletonText } from '@/shared/ui/composites/loading';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/ui/primitives/field';
import { Input } from '@/shared/ui/primitives/input';
import { Textarea } from '@/shared/ui/primitives/textarea';

import type { useProviderActiveDeliveryScreen } from './providerActiveDelivery.hooks';

type ProviderActiveDeliveryScreenState = ReturnType<typeof useProviderActiveDeliveryScreen>;

const LazyProviderDeliveryTrackingMap = lazy(() =>
  import('@/integrations/maps/ProviderDeliveryTrackingMap').then((module) => ({
    default: module.ProviderDeliveryTrackingMap,
  })),
);

const completionCodeSchema = z.object({
  validationCode: z.string().regex(/^\d{6}$/),
});

type CompletionCodeFormValues = z.infer<typeof completionCodeSchema>;

const noShowSchema = z.object({
  noShowReason: z.string().trim().min(1),
});

type NoShowFormValues = z.infer<typeof noShowSchema>;

const DEFAULT_DISPUTE_REASON = 'patient_refused_or_missing_code';

export function ActiveDeliverySkeleton({ loadingLabel }: { loadingLabel: string }) {
  return (
    <div className="relative h-app-screen min-h-app-screen overflow-hidden bg-background text-foreground">
      <div aria-live="polite" role="status" className="sr-only">
        {loadingLabel}
      </div>
      <div className="absolute inset-0 bg-muted/50">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.18),transparent_32%),radial-gradient(circle_at_80%_35%,rgba(15,23,42,0.08),transparent_30%),linear-gradient(135deg,rgba(148,163,184,0.18)_25%,transparent_25%,transparent_50%,rgba(148,163,184,0.18)_50%,rgba(148,163,184,0.18)_75%,transparent_75%,transparent)] bg-[length:100%_100%,100%_100%,42px_42px] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_80%_35%,rgba(255,255,255,0.05),transparent_30%),linear-gradient(135deg,rgba(30,41,59,0.45)_25%,transparent_25%,transparent_50%,rgba(30,41,59,0.45)_50%,rgba(30,41,59,0.45)_75%,transparent_75%,transparent)]" />
      </div>
      <div className="absolute left-0 right-0 top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-9 w-32 rounded-full" />
            <div className="space-y-2 text-right">
              <Skeleton className="ml-auto h-3 w-24 rounded" />
              <Skeleton className="ml-auto h-4 w-32 rounded" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-4 top-20 z-20 w-52 rounded-xl border border-border bg-card/85 p-3 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-4 w-12 rounded" />
          </div>
          <div className="h-6 border-l border-border" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-4 w-12 rounded" />
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 z-40 rounded-t-3xl border-t border-border bg-background/95 shadow-2xl backdrop-blur-md"
        style={{ paddingBottom: 'var(--safe-bottom)' }}
      >
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-4 w-40 rounded" />
              <Skeleton className="h-3 w-56 rounded" />
            </div>
            <Skeleton className="h-7 w-24 rounded" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 flex-1 rounded-xl" />
          </div>
          <div className="rounded-xl border border-border bg-muted/50 p-3">
            <SkeletonText lines={2} lineHeight="h-3.5" />
          </div>
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ActiveDeliveryErrorState({
  deliveryErrorStatus,
  onRetry,
  t,
}: {
  deliveryErrorStatus: number | null;
  onRetry: () => void;
  t: ProviderActiveDeliveryScreenState['t'];
}) {
  return (
    <div className="flex min-h-app-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white/90 p-8 text-center shadow-lg backdrop-blur-sm dark:border-rose-500/30 dark:bg-slate-800/70">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/15">
          <AlertCircle className="h-8 w-8 text-rose-600 dark:text-rose-400" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
          {deliveryErrorStatus === 404
            ? 'Livraison introuvable'
            : deliveryErrorStatus === 401 || deliveryErrorStatus === 403
              ? 'Acces refuse'
              : t.common.loadingError}
        </h2>
        <p className="mb-6 text-sm text-slate-600 dark:text-rose-200/80">
          {deliveryErrorStatus === 404
            ? 'Cette mission de livraison n est plus disponible ou n existe pas.'
            : deliveryErrorStatus === 401 || deliveryErrorStatus === 403
              ? 'Vous ne pouvez pas acceder a cette mission de livraison.'
              : 'Veuillez reessayer dans un instant.'}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {t.common.retry}
        </button>
      </div>
    </div>
  );
}

export function ActiveDeliveryCompletedState({
  amountLabel,
  delivery,
  onBackToDashboard,
  t,
}: {
  amountLabel: string;
  delivery: ProviderDelivery;
  onBackToDashboard: () => void;
  t: ProviderActiveDeliveryScreenState['t'];
}) {
  return (
    <div className="flex min-h-app-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-8 text-center shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500">
          <CheckCircle2 className="h-10 w-10 text-white" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
          {t.provider.deliveryCompletedTitle}
        </h2>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          {t.provider.deliveryCompletedMessage.replace(
            '{patient}',
            delivery.patientName || t.messages.patientLabel,
          )}
        </p>
        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50/90 p-4 dark:border-slate-700 dark:bg-slate-900/50">
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-500 dark:text-slate-400">{t.provider.amount}</span>
            <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
              {amountLabel}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onBackToDashboard}
          className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 py-3 font-medium text-white transition-opacity hover:opacity-90"
        >
          {t.provider.backToDashboard}
        </button>
      </div>
    </div>
  );
}

export function ActiveDeliveryNoShowState({
  delivery,
  onBackToDashboard,
  t,
}: {
  delivery: ProviderDelivery;
  onBackToDashboard: () => void;
  t: ProviderActiveDeliveryScreenState['t'];
}) {
  return (
    <div className="flex min-h-app-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-8 text-center shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-700">
          <UserX className="h-10 w-10 text-white" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
          {t.provider.deliveryNoShowTitle}
        </h2>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          {t.provider.deliveryNoShowMessage.replace(
            '{patient}',
            delivery.patientName || t.messages.patientLabel,
          )}
        </p>
        {delivery.noShowReason ? (
          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50/90 p-4 text-left text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
            {delivery.noShowReason}
          </div>
        ) : null}
        <button
          type="button"
          onClick={onBackToDashboard}
          className="w-full rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 py-3 font-medium text-white transition-opacity hover:opacity-90"
        >
          {t.provider.backToDashboard}
        </button>
      </div>
    </div>
  );
}

export function ActiveDeliveryMapScene(screen: ProviderActiveDeliveryScreenState) {
  const { delivery, deliveryStatus, patientCoordinates, t } = screen;

  if (!delivery || !deliveryStatus) {
    return null;
  }

  return (
    <div className="relative h-app-screen min-h-app-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <div className="absolute inset-0 z-0">
        {patientCoordinates ? (
          <Suspense fallback={<ActiveDeliveryMapFallback />}>
            <LazyProviderDeliveryTrackingMap
              patientCoordinates={patientCoordinates}
              isDark={screen.isDark}
              trackingEnabled={deliveryStatus === 'en_route'}
              routeUnavailableLabel={t.provider.deliveryRouteUnavailable}
              geoUnavailableLabel={t.provider.deliveryGeoUnavailable}
              onStateChange={screen.handleTrackingStateChange}
            />
          </Suspense>
        ) : null}

        {patientCoordinates && screen.mapLoading ? (
          <div className="absolute inset-0 z-20 bg-background/95 backdrop-blur-[2px]">
            <div className="flex h-full flex-col justify-between p-4 pt-24">
              <div className="max-w-[220px] rounded-xl border border-border bg-card/85 p-3 shadow-lg backdrop-blur-md">
                <Skeleton className="mb-2 h-3 w-24 rounded" />
                <Skeleton className="h-4 w-32 rounded" />
              </div>
              <div className="ml-auto w-full max-w-sm rounded-3xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur-md">
                <div className="mb-4 flex items-center gap-4">
                  <Skeleton className="h-14 w-14 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32 rounded" />
                    <Skeleton className="h-4 w-40 rounded" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>
        ) : null}

        {!patientCoordinates ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-50/90 p-4 backdrop-blur-sm dark:bg-slate-900/95">
            <EmptyState
              className="mx-4 max-w-md rounded-2xl border-slate-200 bg-white/95 shadow-lg backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/90"
              icon={<MapPin className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />}
              title={t.provider.deliveryNoCoordinates}
            />
          </div>
        ) : null}
      </div>

      <ActiveDeliveryTopBar
        scheduledLabel={screen.scheduledLabel}
        statusBadgeClassName={screen.statusBadgeClassName}
        statusText={screen.statusText}
        deliveryStatus={deliveryStatus}
        t={t}
      />
      <ActiveDeliveryRouteBadge
        deliveryStatus={deliveryStatus}
        distance={screen.distance}
        duration={screen.duration}
        routeError={screen.routeError}
      />
      <ActiveDeliveryBottomSheet
        screen={screen}
        delivery={delivery}
        deliveryStatus={deliveryStatus}
      />
      <CompletionCodeDialog screen={screen} />
      <NoShowDialog screen={screen} />
    </div>
  );
}

function ActiveDeliveryMapFallback() {
  return (
    <div className="absolute inset-0 bg-background/95 backdrop-blur-[2px]">
      <Skeleton className="h-full w-full rounded-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.18),transparent_32%),radial-gradient(circle_at_80%_35%,rgba(15,23,42,0.08),transparent_30%),linear-gradient(135deg,rgba(148,163,184,0.18)_25%,transparent_25%,transparent_50%,rgba(148,163,184,0.18)_50%,rgba(148,163,184,0.18)_75%,transparent_75%,transparent)] bg-[length:100%_100%,100%_100%,42px_42px] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_80%_35%,rgba(255,255,255,0.05),transparent_30%),linear-gradient(135deg,rgba(30,41,59,0.45)_25%,transparent_25%,transparent_50%,rgba(30,41,59,0.45)_50%,rgba(30,41,59,0.45)_75%,transparent_75%,transparent)]" />
    </div>
  );
}

function ActiveDeliveryTopBar({
  deliveryStatus,
  scheduledLabel,
  statusBadgeClassName,
  statusText,
  t,
}: {
  deliveryStatus: string;
  scheduledLabel: string;
  statusBadgeClassName: string;
  statusText: string;
  t: ProviderActiveDeliveryScreenState['t'];
}) {
  return (
    <div className="absolute left-0 right-0 top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/90">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium shadow-sm ${statusBadgeClassName}`}
          >
            {deliveryStatus === 'en_route' ? (
              <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
            ) : null}
            {statusText}
          </div>
          <div className="text-right text-slate-900 dark:text-white">
            <p className="text-xs text-slate-500 dark:text-slate-500">
              {t.provider.deliveryScheduledLabel}
            </p>
            <p className="font-bold">{scheduledLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveDeliveryRouteBadge({
  deliveryStatus,
  distance,
  duration,
  routeError,
}: {
  deliveryStatus: string;
  distance: string;
  duration: string;
  routeError: string | null;
}) {
  if (deliveryStatus !== 'en_route' || (!distance && !duration && !routeError)) {
    return null;
  }

  return (
    <div className="absolute left-4 top-20 z-20 rounded-xl border border-slate-200 bg-white/90 p-3 shadow-lg backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/90">
      {routeError ? (
        <p className="text-xs text-amber-700 dark:text-amber-300">{routeError}</p>
      ) : (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <span className="font-bold text-slate-900 dark:text-white">{distance}</span>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-slate-900 dark:text-white">{duration}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ActiveDeliveryBottomSheet({
  delivery,
  deliveryStatus,
  screen,
}: {
  delivery: ProviderDelivery;
  deliveryStatus: 'pending' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'no_show';
  screen: ProviderActiveDeliveryScreenState;
}) {
  const { t } = screen;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-40 max-h-[min(72dvh,calc(100%_-_5rem))] overflow-y-auto rounded-t-3xl border-t border-slate-200 bg-white/95 shadow-2xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/95"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <div className="space-y-4 p-4">
        {screen.geoError ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50/90 p-3 text-sm text-amber-800 backdrop-blur-sm dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            {screen.geoError}
          </div>
        ) : null}

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-2xl">
            👩
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-bold text-slate-900 dark:text-white">
              {delivery.patientName || t.messages.patientLabel}
            </h3>
            <p className="truncate text-sm text-slate-500 dark:text-slate-400">
              {delivery.serviceName || t.common.noData}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <MapPin className="h-3 w-3 text-slate-400 dark:text-slate-500" />
              <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                {delivery.location.address || t.common.noData}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
              {screen.amountLabel}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={screen.handleCall}
            disabled={!delivery.patientPhone}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 py-3 font-medium text-green-600 transition-all hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-green-500/30 dark:bg-green-500/20 dark:text-green-400 dark:hover:bg-green-500/30"
          >
            <Phone className="h-5 w-5" />
            {t.common.call}
          </button>
          <button
            type="button"
            onClick={screen.handleMessage}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 py-3 font-medium text-slate-700 transition-all hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            <MessageCircle className="h-5 w-5" />
            {t.messages.title}
          </button>
        </div>

        {delivery.notes ? (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/90 p-3 backdrop-blur-sm dark:border-amber-500/30 dark:bg-amber-500/10">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-sm text-amber-800 dark:text-amber-200">{delivery.notes}</p>
          </div>
        ) : null}

        {deliveryStatus === 'pending' ? (
          <PrimaryActionButton
            loading={screen.mutateStates.startJourneyLoading}
            icon={<Play className="h-5 w-5" />}
            onClick={() => void screen.handleStartJourney()}
            disabled={screen.isMutationPending}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:opacity-90"
            label={t.provider.deliveryStartJourney}
          />
        ) : null}

        {deliveryStatus === 'en_route' ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <PrimaryActionButton
              loading={screen.mutateStates.arriveLoading}
              icon={<Flag className="h-5 w-5" />}
              onClick={() => void screen.handleArrived()}
              disabled={screen.isMutationPending}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/25 hover:opacity-90"
              label={t.provider.deliveryMarkArrived}
            />
            <PrimaryActionButton
              loading={screen.mutateStates.noShowLoading}
              icon={<UserX className="h-5 w-5" />}
              onClick={screen.handleOpenNoShowDialog}
              disabled={screen.isMutationPending}
              className="bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/20 hover:opacity-90"
              label={t.provider.deliveryMarkNoShow}
            />
          </div>
        ) : null}

        {deliveryStatus === 'arrived' ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <PrimaryActionButton
              loading={screen.mutateStates.startServiceLoading}
              icon={<Play className="h-5 w-5" />}
              onClick={() => void screen.handleStartService()}
              disabled={screen.isMutationPending}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-pink-500/25 hover:opacity-90"
              label={t.provider.deliveryStartService}
            />
            <PrimaryActionButton
              loading={screen.mutateStates.noShowLoading}
              icon={<UserX className="h-5 w-5" />}
              onClick={screen.handleOpenNoShowDialog}
              disabled={screen.isMutationPending}
              className="bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/20 hover:opacity-90"
              label={t.provider.deliveryMarkNoShow}
            />
          </div>
        ) : null}

        {deliveryStatus === 'in_progress' ? (
          <PrimaryActionButton
            loading={screen.mutateStates.completeLoading}
            icon={<Check className="h-5 w-5" />}
            onClick={screen.handleOpenCompletionDialog}
            disabled={screen.isMutationPending}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:opacity-90"
            label={t.provider.deliveryCompleteService}
          />
        ) : null}
      </div>
    </div>
  );
}

function NoShowDialog({ screen }: { screen: ProviderActiveDeliveryScreenState }) {
  const { t } = screen;
  const reasonInputId = useId();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<NoShowFormValues>({
    defaultValues: { noShowReason: '' },
    resolver: zodResolver(noShowSchema),
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset();
      screen.handleCloseNoShowDialog();
    }
  };

  const handleConfirmNoShow = handleSubmit(async (values) => {
    try {
      await screen.handleMarkNoShow(values.noShowReason);
      reset();
    } catch {
      // Toast and normalized API error handling are owned by the screen hook.
    }
  });

  return (
    <Dialog open={screen.noShowDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent size="sm" scroll="content">
        <DialogHeader>
          <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-500/10 text-slate-600 dark:text-slate-300">
            <UserX className="h-6 w-6" />
          </div>
          <DialogTitle>{t.provider.deliveryNoShowConfirmTitle}</DialogTitle>
          <DialogDescription>{t.provider.deliveryNoShowConfirmDescription}</DialogDescription>
        </DialogHeader>

        <Field data-invalid={Boolean(errors.noShowReason)}>
          <FieldLabel htmlFor={reasonInputId}>{t.provider.deliveryNoShowReasonLabel}</FieldLabel>
          <Textarea
            id={reasonInputId}
            rows={3}
            placeholder={t.provider.deliveryNoShowReasonPlaceholder}
            aria-invalid={Boolean(errors.noShowReason)}
            {...register('noShowReason')}
          />
          <FieldError>
            {errors.noShowReason ? t.provider.deliveryNoShowReasonError : null}
          </FieldError>
        </Field>

        <DialogFooter>
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            disabled={screen.isMutationPending}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {t.common.cancel}
          </button>
          <button
            type="button"
            onClick={() => void handleConfirmNoShow()}
            disabled={screen.mutateStates.noShowLoading || screen.isMutationPending}
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-slate-600 to-slate-700 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {screen.mutateStates.noShowLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {t.provider.deliveryNoShowConfirmAction}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CompletionCodeDialog({ screen }: { screen: ProviderActiveDeliveryScreenState }) {
  const { t } = screen;
  const codeInputId = useId();
  const disputeInputId = useId();
  const [disputeReason, setDisputeReason] = useState('');
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<CompletionCodeFormValues>({
    defaultValues: { validationCode: '' },
    resolver: zodResolver(completionCodeSchema),
  });
  const validationCode = watch('validationCode');

  const resetForm = () => {
    setDisputeReason('');
    reset();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
      screen.handleCloseCompletionDialog();
    }
  };

  const validationCodeField = register('validationCode', {
    onChange: (event) => {
      const target = event.target as HTMLInputElement;
      setValue('validationCode', target.value.replace(/\D/g, '').slice(0, 6), {
        shouldValidate: false,
      });
    },
  });

  const handleSubmitCode = handleSubmit(async (values) => {
    try {
      await screen.handleCompleteService(values.validationCode);
      resetForm();
    } catch {
      // Toast and normalized API error handling are owned by the screen hook.
    }
  });

  const handleDispute = async () => {
    const reason = disputeReason.trim() || DEFAULT_DISPUTE_REASON;
    try {
      await screen.handleDisputeSession(reason);
      resetForm();
    } catch {
      // Toast and normalized API error handling are owned by the screen hook.
    }
  };

  return (
    <Dialog open={screen.completionDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent size="sm" scroll="content">
        <DialogHeader>
          <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <DialogTitle>{t.provider.deliveryCompletionCodeTitle}</DialogTitle>
          <DialogDescription>{t.provider.deliveryCompletionCodeDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Field data-invalid={Boolean(errors.validationCode)}>
            <FieldLabel htmlFor={codeInputId}>{t.provider.deliveryCompletionCodeLabel}</FieldLabel>
            <Input
              id={codeInputId}
              name={validationCodeField.name}
              ref={validationCodeField.ref}
              onBlur={validationCodeField.onBlur}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              pattern="[0-9]*"
              value={validationCode}
              onChange={(event) => {
                void validationCodeField.onChange(event);
              }}
              placeholder="123456"
              className="h-14 text-center font-mono text-2xl font-bold tracking-[0.35em]"
              aria-invalid={Boolean(errors.validationCode)}
            />
            <FieldDescription>{t.provider.deliveryCompletionCodeHint}</FieldDescription>
            <FieldError>
              {errors.validationCode ? t.provider.deliveryCompletionCodeError : null}
            </FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor={disputeInputId}>
              {t.provider.deliveryDisputeReasonLabel}
            </FieldLabel>
            <Textarea
              id={disputeInputId}
              value={disputeReason}
              onChange={(event) => setDisputeReason(event.target.value)}
              placeholder={t.provider.deliveryDisputeReasonPlaceholder}
              rows={3}
            />
            <FieldDescription>{t.provider.deliveryDisputeHint}</FieldDescription>
          </Field>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={handleDispute}
            disabled={screen.mutateStates.disputeLoading || screen.isMutationPending}
            className="inline-flex items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:text-amber-300"
          >
            {screen.mutateStates.disputeLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {t.provider.deliveryOpenDispute}
          </button>
          <button
            type="button"
            onClick={() => void handleSubmitCode()}
            disabled={screen.mutateStates.completeLoading || screen.isMutationPending}
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {screen.mutateStates.completeLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {t.provider.deliverySubmitCompletionCode}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PrimaryActionButton({
  className,
  disabled,
  icon,
  label,
  loading,
  onClick,
}: {
  className: string;
  disabled: boolean;
  icon: ReactNode;
  label: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-lg font-bold transition-opacity disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : icon}
      {label}
    </button>
  );
}
