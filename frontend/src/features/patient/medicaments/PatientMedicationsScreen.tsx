import { FileText, Pill, Truck } from 'lucide-react';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import {
  pharmacyOrdersOptions,
  pharmacyOrderStatsOptions,
  usePharmacyOrders,
  usePharmacyOrderStats,
} from '@/features/pharmacy';
import { queryClient } from '@/shared/lib/query/client';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { Skeleton, SkeletonCard } from '@/shared/ui/composites/loading';
import { Button } from '@/shared/ui/primitives/button';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = (_args: LoaderFunctionArgs) => {
  void Promise.all([
    queryClient.prefetchQuery(pharmacyOrdersOptions()),
    queryClient.prefetchQuery(pharmacyOrderStatsOptions()),
  ]).catch(() => undefined);

  return null;
};

function renderStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return (
        <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-500">
          En attente
        </span>
      );
    case 'processing':
      return (
        <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-500">
          En préparation
        </span>
      );
    case 'delivery':
      return (
        <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-medium text-purple-500">
          En livraison
        </span>
      );
    case 'completed':
      return (
        <span className="rounded-full border border-green-500/20 bg-green-500/10 px-1.5 py-0.5 text-[10px] font-medium text-green-500">
          Livré
        </span>
      );
    default:
      return null;
  }
}

function PatientMedicamentsHeader() {
  return (
    <div className="border-b border-slate-200 bg-white/80 text-slate-900 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:shadow-none">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[14px] p-[2px]">
          <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />
          <div className="relative rounded-[12px] bg-white/95 px-4 py-3 backdrop-blur-xl dark:bg-slate-900/95">
            <h1 className="mb-0.5 text-lg font-bold text-slate-900 dark:text-white">
              Mes Médicaments
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Suivez vos commandes et ordonnances
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MedicationOrdersSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonCard
          key={index}
          className="rounded-xl border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:shadow-none"
        >
          <div className="mb-2 flex justify-end">
            <Skeleton className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-12 w-12 flex-shrink-0 rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
              <Skeleton className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
              <Skeleton className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
              <Skeleton className="h-9 w-full rounded-lg bg-emerald-100 dark:bg-emerald-500/10" />
            </div>
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}

export function PatientMedicationsScreen() {
  const navigate = useNavigate();
  const {
    data: requests,
    loading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = usePharmacyOrders();
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = usePharmacyOrderStats();

  const orders = requests ?? [];
  const ordersInitialLoading = ordersLoading && orders.length === 0;

  return (
    <div className="min-h-screen pb-12">
      <PatientMedicamentsHeader />

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => navigate('/pharmacy')}
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-left transition-all hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20"
          >
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Pill className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Nouvelle commande</h3>
            <p className="mt-0.5 text-[10px] text-emerald-600 dark:text-emerald-400">
              Envoyer une ordonnance
            </p>
          </button>

          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:shadow-none">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
              <Truck className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">En cours</h3>
            {statsLoading ? (
              <Skeleton className="mt-1 h-3 w-28 rounded bg-slate-200 dark:bg-slate-700" />
            ) : statsError ? (
              <button
                type="button"
                onClick={() => {
                  void refetchStats();
                }}
                className="mt-0.5 text-left text-[10px] font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
              >
                Recharger le compteur
              </button>
            ) : (
              <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                {stats?.activeCount ?? 0} commandes actives
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Historique des commandes
            </h2>

            {ordersLoading && orders.length > 0 ? (
              <span className="rounded-full border border-slate-200 bg-white/80 px-2 py-0.5 text-[10px] font-medium text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400">
                Mise à jour...
              </span>
            ) : null}
          </div>

          {ordersInitialLoading ? (
            <MedicationOrdersSkeleton />
          ) : ordersError && !orders.length ? (
            <EmptyState
              title="Impossible de charger vos commandes"
              description={getApiErrorMessage(
                ordersError,
                'Réessayez dans quelques instants pour retrouver votre historique.',
              )}
              icon={<Truck className="h-5 w-5" />}
              action={
                <Button variant="outline" onClick={() => void refetchOrders()}>
                  Recharger
                </Button>
              }
            />
          ) : orders.length === 0 ? (
            <EmptyState
              title="Aucune commande pour le moment"
              description="Envoyez votre première ordonnance pour suivre vos livraisons ici."
              icon={<FileText className="h-5 w-5" />}
              action={<Button onClick={() => navigate('/pharmacy')}>Nouvelle commande</Button>}
            />
          ) : (
            orders.map((request) => (
              <div
                key={request.id}
                className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all dark:border-slate-700 dark:bg-slate-800/50 dark:shadow-none"
              >
                <div className="mb-2 flex justify-end">{renderStatusBadge(request.status)}</div>
                <div className="flex gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900">
                    <FileText className="h-5 w-5 text-slate-400" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {request.pharmacyName}
                    </h3>
                    <p className="mb-1 text-[10px] text-slate-500 dark:text-slate-400">
                      {request.date}
                    </p>
                    <p className="mb-2 line-clamp-1 text-xs text-slate-600 dark:text-slate-300">
                      {request.items}
                    </p>

                    {request.status === 'delivery' ? (
                      <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 p-2 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                        <div className="flex items-center gap-1.5">
                          <Truck className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                            Montant à payer
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {request.amount} TND
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
