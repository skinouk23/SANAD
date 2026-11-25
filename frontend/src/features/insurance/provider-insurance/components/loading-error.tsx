import { AlertCircle } from 'lucide-react';

import { ProviderRouteHeader } from '@/features/providers';
import { Skeleton, SkeletonCard } from '@/shared/ui/composites/loading';
import { Button } from '@/shared/ui/primitives/button';

export function ProviderInsuranceLoadingState() {
  return (
    <div className="min-h-screen pb-20">
      <ProviderRouteHeader containerClassName="mx-auto max-w-7xl px-4 py-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg sm:h-12 sm:w-12" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-44 rounded" />
              <Skeleton className="h-3 w-40 rounded" />
            </div>
          </div>
          <Skeleton className="h-9 w-40 rounded-lg self-start sm:self-auto" />
        </div>
      </ProviderRouteHeader>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6">
        <SkeletonCard className="mb-4 rounded-xl border-amber-200 bg-amber-50/80 p-3 shadow-sm backdrop-blur-sm sm:p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-72 max-w-full rounded" />
              <Skeleton className="h-3 w-80 max-w-full rounded" />
            </div>
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
        </SkeletonCard>

        <div className="mb-4 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} className="rounded-xl p-2.5 sm:p-3">
              <div className="mb-2 flex items-center justify-between">
                <Skeleton className="h-7 w-7 rounded-lg sm:h-8 sm:w-8" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="mb-2 h-3 w-20 rounded" />
              <Skeleton className="mb-1 h-5 w-16 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </SkeletonCard>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {Array.from({ length: 2 }).map((_, sectionIndex) => (
              <SkeletonCard key={sectionIndex} className="rounded-xl p-3 sm:p-4">
                <Skeleton className="mb-3 h-4 w-40 rounded" />
                <div className="space-y-1.5">
                  {Array.from({ length: 3 }).map((_, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700/50 dark:bg-slate-900/50"
                    >
                      <Skeleton className="mt-0.5 h-4 w-4 rounded-full" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <Skeleton className="h-3 w-full rounded" />
                        <Skeleton className="h-2.5 w-28 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </SkeletonCard>
            ))}

            <SkeletonCard className="rounded-xl p-3 sm:p-4">
              <Skeleton className="mb-3 h-4 w-36 rounded" />
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-2 sm:p-3 dark:border-slate-700/50 dark:bg-slate-900/50"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-28 rounded" />
                        <Skeleton className="h-3 w-44 rounded" />
                      </div>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-24 rounded" />
                      <Skeleton className="h-3 w-16 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </SkeletonCard>
          </div>

          <div className="space-y-3">
            <SkeletonCard className="rounded-xl p-3 sm:p-4">
              <Skeleton className="mb-3 h-4 w-28 rounded" />
              <div className="space-y-1.5">
                <Skeleton className="h-8 w-full rounded-lg" />
                <Skeleton className="h-8 w-full rounded-lg" />
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            </SkeletonCard>

            <SkeletonCard className="rounded-xl p-3 sm:p-4">
              <Skeleton className="mb-3 h-4 w-24 rounded" />
              <div className="space-y-1.5">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700/50 dark:bg-slate-900/50"
                  >
                    <Skeleton className="h-7 w-7 rounded-md" />
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-28 rounded" />
                      <Skeleton className="h-2.5 w-20 rounded" />
                    </div>
                    <Skeleton className="h-3 w-3 rounded" />
                  </div>
                ))}
              </div>
            </SkeletonCard>

            <SkeletonCard className="rounded-xl border-blue-200 bg-blue-50/80 p-3 shadow-sm sm:p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
              <Skeleton className="mb-3 h-4 w-28 rounded" />
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white/80 p-2 dark:border-slate-700/50 dark:bg-slate-800/50"
                  >
                    <Skeleton className="h-7 w-7 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-24 rounded" />
                      <Skeleton className="h-3 w-28 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </SkeletonCard>

            <SkeletonCard className="rounded-xl border-green-200 bg-green-50/80 p-3 sm:p-4 dark:border-green-500/30 dark:bg-green-500/10">
              <div className="flex items-start gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-36 rounded" />
                  <Skeleton className="h-3 w-52 max-w-full rounded" />
                </div>
              </div>
            </SkeletonCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProviderInsuranceErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="min-h-screen pb-20">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
        <div className="w-full rounded-2xl border border-rose-200 bg-gradient-to-br from-red-50/90 to-rose-50/90 p-6 shadow-sm backdrop-blur-sm dark:border-rose-500/30 dark:from-red-500/10 dark:to-rose-500/10">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-rose-500" />
            <div className="space-y-3">
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  Assurance indisponible
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{message}</p>
              </div>
              <Button
                onClick={onRetry}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm transition-opacity hover:opacity-90"
              >
                Reessayer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
