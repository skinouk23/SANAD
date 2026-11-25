import { AlertCircle } from 'lucide-react';

import { Skeleton, SkeletonCard, SkeletonMetricGrid } from '@/shared/ui/composites/loading';
import { Button } from '@/shared/ui/primitives/button';

export function BillingLoadingState() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 rounded sm:h-9" />
              <Skeleton className="h-4 w-80 max-w-full rounded" />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Skeleton className="h-9 flex-1 rounded-md sm:w-24 sm:flex-none" />
              <Skeleton className="h-9 flex-1 rounded-md sm:w-24 sm:flex-none" />
            </div>
          </div>
        </div>

        <SkeletonCard className="mb-6 rounded-xl border-warning/20 bg-warning/10 p-4 sm:mb-8 sm:p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-12 w-12 rounded-xl sm:h-16 sm:w-16 sm:rounded-2xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-72 max-w-full rounded" />
              <Skeleton className="h-4 w-96 max-w-full rounded" />
            </div>
            <Skeleton className="h-7 w-20 rounded-full sm:h-9 sm:w-24" />
          </div>
        </SkeletonCard>

        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
          <div className="flex w-full items-center gap-2 overflow-x-auto sm:w-auto">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-24 rounded-lg sm:w-28" />
            ))}
          </div>
          <Skeleton className="h-4 w-56 rounded" />
        </div>

        <SkeletonMetricGrid className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4 lg:gap-6" />

        <SkeletonCard className="mb-6 overflow-hidden rounded-xl border-border bg-card p-0">
          <div className="flex border-b border-border">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex-1 px-3 py-3 sm:px-6 sm:py-4">
                <Skeleton className="mx-auto h-5 w-24 max-w-full rounded" />
              </div>
            ))}
          </div>
        </SkeletonCard>

        <SkeletonCard className="rounded-xl border-border bg-card p-4 sm:p-6">
          <div className="mb-6 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <div className="space-y-3 lg:hidden">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-border bg-muted p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20 rounded" />
                    <Skeleton className="h-5 w-36 rounded" />
                    <Skeleton className="h-4 w-44 rounded" />
                    <Skeleton className="h-3 w-32 rounded" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24 rounded" />
                    <Skeleton className="h-6 w-28 rounded" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:block">
            <div className="overflow-hidden rounded-md border border-border">
              <div className="grid grid-cols-8 gap-4 border-b border-border px-4 py-3">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="h-4 rounded" />
                ))}
              </div>
              {Array.from({ length: 4 }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid grid-cols-8 gap-4 border-b border-border px-4 py-4 last:border-b-0"
                >
                  {Array.from({ length: 8 }).map((_, cellIndex) => (
                    <Skeleton key={cellIndex} className="h-4 rounded" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </SkeletonCard>

        <SkeletonCard className="mt-6 rounded-xl border-border bg-card p-4 sm:mt-8 sm:p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <Skeleton className="h-10 w-10 rounded-lg sm:h-12 sm:w-12 sm:rounded-xl" />
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-5 w-64 max-w-full rounded" />
              <Skeleton className="h-4 w-full max-w-3xl rounded" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-6 w-24 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
}

export function BillingErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
        <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
            <div className="space-y-3">
              <div>
                <h1 className="text-lg font-bold text-foreground">Facturation indisponible</h1>
                <p className="mt-1 text-sm text-muted-foreground">{message}</p>
              </div>
              <Button onClick={onRetry}>Reessayer</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
