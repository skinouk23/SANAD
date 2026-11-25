import { AlertCircle, Calendar, MapPin, Phone, Star } from 'lucide-react';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { PaginationControls } from '@/shared/ui/composites/pagination-controls';
import { Skeleton, SkeletonListingSection } from '@/shared/ui/composites/loading';
import { getProviderDisplayName, ProviderVerificationBadge } from '@/features/providers';
import type { ReactNode } from 'react';
import type { PaginationMetadata } from '@/shared/ui/composites/pagination-controls';
import type { ProviderResponse } from '@/features/providers';
import type { ServiceAccentStyles } from '@/features/services/service-colors';

interface ServiceProviderListingCopy {
  book: string;
  call: string;
  fromPrice: string;
  notVerified: string;
  onQuote: string;
  verified: string;
}

interface ServiceProviderListingProps {
  providers: ProviderResponse[];
  loading: boolean;
  error?: unknown;
  onRetry?: () => void;
  emptyTitle?: ReactNode;
  emptyDescription?: ReactNode;
  emptyAction?: ReactNode;
  isRefreshing?: boolean;
  isPlaceholderData?: boolean;
  heading: string;
  fallbackIcon: ReactNode;
  descriptionChipClassName: string;
  styles: Pick<ServiceAccentStyles, 'gradient' | 'text'>;
  copy: ServiceProviderListingCopy;
  skeletonBadgeCount?: number;
  pagination?: PaginationMetadata | null;
  onPageChange?: (page: number) => void;
  paginationLabels?: {
    previous: string;
    next: string;
  };
  onBook: (provider: ProviderResponse) => void;
  onCall: (providerId: string) => void;
}

export function ServiceProviderListing({
  providers,
  loading,
  error,
  onRetry,
  emptyTitle = 'Aucun prestataire trouvé',
  emptyDescription,
  emptyAction,
  isRefreshing = false,
  isPlaceholderData = false,
  heading,
  fallbackIcon,
  descriptionChipClassName,
  styles,
  copy,
  skeletonBadgeCount,
  pagination,
  onPageChange,
  paginationLabels,
  onBook,
  onCall,
}: ServiceProviderListingProps) {
  const isUpdating = isRefreshing || isPlaceholderData;
  const showInitialLoading = loading && providers.length === 0;

  return (
    <div className="lg:col-span-2 space-y-3" aria-busy={isUpdating || undefined}>
      <div className="flex items-center gap-2">
        {showInitialLoading ? (
          <Skeleton className="h-5 w-44 rounded" />
        ) : (
          <h2 className="text-base font-bold text-slate-900 dark:text-white">{heading}</h2>
        )}
        {isUpdating && !showInitialLoading ? (
          <span
            aria-live="polite"
            className="rounded-full border border-slate-200 bg-white/80 px-2 py-0.5 text-[10px] font-medium text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400"
          >
            Mise à jour...
          </span>
        ) : null}
      </div>

      {showInitialLoading ? (
        <SkeletonListingSection badgeCount={skeletonBadgeCount} />
      ) : error && providers.length === 0 ? (
        <EmptyState
          title="Erreur de chargement"
          description="Les prestataires n'ont pas pu être chargés."
          icon={<AlertCircle className="h-5 w-5" />}
          action={
            onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
              >
                Réessayer
              </button>
            ) : undefined
          }
          className="py-8 rounded-xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
        />
      ) : providers.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
          className="py-8 rounded-xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
        />
      ) : (
        providers.map((provider) => {
          const displayName = getProviderDisplayName(provider);
          const hasPrice = provider.minPrice != null;
          const hasServiceCount = (provider.serviceCount ?? 0) > 0;
          const priceLabel =
            provider.minPrice != null && provider.minPrice > 0
              ? `${copy.fromPrice} ${provider.minPrice} TND`
              : copy.onQuote;

          return (
            <div
              key={provider.id}
              className="backdrop-blur-sm border rounded-xl p-4 transition-all bg-white/80 border-slate-200 hover:border-cyan-500/50 shadow-sm dark:bg-slate-800/50 dark:border-slate-700/50"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-between md:flex-col md:items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl text-white overflow-hidden"
                      style={styles.gradient}
                    >
                      {provider.profilePictureUrl ? (
                        <img
                          src={provider.profilePictureUrl}
                          alt={displayName}
                          loading="lazy"
                          decoding="async"
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        fallbackIcon
                      )}
                    </div>
                    <div className="min-h-[2rem] text-right md:text-center">
                      {hasPrice ? (
                        <p className="text-sm font-bold whitespace-nowrap" style={styles.text}>
                          {priceLabel}
                        </p>
                      ) : (
                        <p
                          aria-hidden="true"
                          className="invisible text-sm font-bold whitespace-nowrap"
                          style={styles.text}
                        >
                          {copy.onQuote}
                        </p>
                      )}
                      {hasServiceCount ? (
                        <p className="text-[10px] text-slate-500 dark:text-slate-500">
                          {provider.serviceCount} service
                          {(provider.serviceCount ?? 0) > 1 ? 's' : ''}
                        </p>
                      ) : (
                        <p
                          aria-hidden="true"
                          className="invisible text-[10px] text-slate-500 dark:text-slate-500"
                        >
                          0 services
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {displayName}
                      </h3>
                      <ProviderVerificationBadge
                        isVerified={provider.isVerified}
                        notVerifiedLabel={copy.notVerified}
                        verifiedLabel={copy.verified}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs mb-1 flex-wrap text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {provider.ratingAverage.toFixed(1)}
                        </span>
                        <span>({provider.ratingCount})</span>
                      </div>
                      {provider.city && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{provider.city}</span>
                          </div>
                        </>
                      )}
                    </div>
                    <p className="text-xs mb-1 text-slate-500 dark:text-slate-400">
                      {provider.addressLine1 ?? '—'}
                    </p>
                  </div>

                  <div className="flex min-h-[1.5rem] flex-wrap gap-1.5 mb-3">
                    {provider.shortDescription ? (
                      <span className={descriptionChipClassName}>{provider.shortDescription}</span>
                    ) : (
                      <span aria-hidden="true" className={`${descriptionChipClassName} invisible`}>
                        Description
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onBook(provider)}
                      className="group relative flex-1 overflow-hidden rounded-lg"
                    >
                      <span
                        className="relative flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-transform group-hover:scale-[1.01]"
                        style={styles.gradient}
                      >
                        <Calendar className="h-3 w-3" /> {copy.book}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onCall(provider.id)}
                      className="px-3 py-1.5 border rounded-lg transition-all flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-600 dark:text-white"
                    >
                      <Phone className="h-3 w-3" /> {copy.call}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}

      {!showInitialLoading && !(error && providers.length === 0) ? (
        <PaginationControls
          pagination={pagination}
          itemCount={providers.length}
          onPageChange={onPageChange}
          disabled={loading || isUpdating}
          previousLabel={paginationLabels?.previous}
          nextLabel={paginationLabels?.next}
        />
      ) : null}
    </div>
  );
}
