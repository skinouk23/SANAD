import { AlertCircle } from 'lucide-react';

import { EmptyState } from '@/shared/ui/composites/empty-state';
import { Skeleton, SkeletonCard } from '@/shared/ui/composites/loading';

export function ProviderPharmacyOrdersLoadingState() {
  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-10 border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-8 w-56 rounded" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
          <div className="flex gap-2 overflow-x-hidden pb-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-32 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} className="rounded-xl p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32 rounded" />
                    <Skeleton className="h-3 w-24 rounded" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              <div className="mb-4 rounded-lg bg-muted p-3">
                <div className="mb-2 flex items-center justify-between">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-4 w-12 rounded" />
                </div>
                <Skeleton className="h-3 w-32 rounded" />
              </div>

              <div className="mb-6 space-y-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
                <div className="flex items-center justify-between border-t border-border pt-2">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-5 w-20 rounded" />
                </div>
              </div>

              <div className="flex gap-2">
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            </SkeletonCard>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProviderPharmacyOrdersErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <EmptyState
        className="w-full max-w-2xl rounded-2xl border-border bg-card/90 shadow-sm"
        icon={<AlertCircle className="h-8 w-8 text-destructive" />}
        title="Commandes pharmacie indisponibles"
        description={message}
        action={
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Reessayer
          </button>
        }
      />
    </div>
  );
}
