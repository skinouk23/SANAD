import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, MessageCircle, Phone, Search, Trophy } from 'lucide-react';
import { AnimatedBorderSurface } from '@/shared/ui/composites/animated-border-surface';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { PaginationControls } from '@/shared/ui/composites/pagination-controls';
import { Skeleton, SkeletonCard } from '@/shared/ui/composites/loading';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import {
  ProviderContactModal,
  ProviderVerificationBadge,
  getProviderDisplayName,
  getProviderImageUrl,
  providerListOptions,
  useGyms,
} from '@/features/providers';
import { useServiceAccent } from '@/features/services';
import { queryClient } from '@/shared/lib/query/client';
import type { LoaderFunctionArgs } from 'react-router-dom';

const PROVIDER_PAGE_SIZE = 20;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async (_args: LoaderFunctionArgs) => {
  void queryClient.prefetchQuery(
    providerListOptions({ serviceCategory: 'gym', page: 1, limit: PROVIDER_PAGE_SIZE }),
  );
  return null;
};

export function Gym() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [contactProviderId, setContactProviderId] = useState<string | null>(null);
  const debouncedSearchQuery = useDebouncedValue(searchQuery.trim(), 300);
  const {
    providers: gyms = [],
    data,
    loading,
    error,
    refetch,
    isRefreshing,
    isPlaceholderData,
  } = useGyms({
    page,
    limit: PROVIDER_PAGE_SIZE,
    ...(debouncedSearchQuery ? { searchQuery: debouncedSearchQuery } : {}),
  });
  const { styles } = useServiceAccent('gym');
  const isUpdating = isRefreshing || isPlaceholderData;
  const showInitialLoading = loading && gyms.length === 0;
  const totalGyms = data?.pagination.total ?? gyms.length;

  return (
    <div className="min-h-screen text-slate-900 dark:text-white">
      <div className="relative z-10 py-4 px-4 sm:px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <AnimatedBorderSurface
            className="relative mb-4 overflow-hidden rounded-[20px] p-[2px] shadow-xl"
            borderClassName="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
            borderStyle={styles.conicBorder}
            innerClassName="relative rounded-[18px] bg-white/95 p-5 backdrop-blur-xl dark:bg-slate-900/95"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={styles.gradient}
              >
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t.serviceListing.gymTitle}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t.serviceListing.gymSubtitle}
                </p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />

              <input
                type="text"
                placeholder={t.serviceListing.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-200 bg-white/80 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-sm transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
          </AnimatedBorderSurface>

          <div className="mb-4 rounded-xl border border-amber-200/70 bg-amber-50/80 p-4 shadow-sm backdrop-blur-sm dark:border-amber-500/20 dark:bg-amber-500/10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold mb-1 text-slate-900 dark:text-white">
                  Réservation ou contact direct avec la salle
                </h2>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  Utilisez Réserver pour choisir un service publié et un créneau disponible, ou
                  Appeler / Contacter pour confirmer les abonnements, horaires et activités
                  proposés.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2" aria-busy={isUpdating || undefined}>
                {showInitialLoading ? (
                  <Skeleton className="h-5 w-40 rounded" />
                ) : (
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    {totalGyms} salle{totalGyms > 1 ? 's' : ''} publiée
                    {totalGyms > 1 ? 's' : ''}
                  </h2>
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
                <div className="grid gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonCard key={i} className="p-3 sm:p-4">
                      <div className="flex items-center">
                        <Skeleton className="w-12 h-12 rounded-lg mr-3 flex-shrink-0" />
                        <div className="flex-1">
                          <Skeleton className="h-3.5 w-36 rounded mb-1.5" />
                          <Skeleton className="h-3 w-48 rounded mb-1.5" />
                          <Skeleton className="h-3 w-24 rounded" />
                        </div>
                        <Skeleton className="h-8 w-20 rounded-lg" />
                      </div>
                    </SkeletonCard>
                  ))}
                </div>
              ) : error && gyms.length === 0 ? (
                <EmptyState
                  title={t.serviceListing.errorLoading}
                  description={t.serviceListing.retry}
                  icon={<Trophy className="h-5 w-5" />}
                  action={
                    <button
                      type="button"
                      onClick={() => {
                        void refetch();
                      }}
                      className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:scale-[1.01]"
                    >
                      {t.serviceListing.retry}
                    </button>
                  }
                  className="rounded-xl border border-slate-200 bg-white/80 py-8 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
                />
              ) : gyms.length > 0 ? (
                <div className="grid gap-4" aria-busy={isUpdating || undefined}>
                  {gyms.map((gym) => {
                    const displayName = getProviderDisplayName(gym);
                    const imageUrl = getProviderImageUrl(gym);
                    const location = [gym.addressLine1, gym.city].filter(Boolean).join(', ') || '-';
                    const hasPrice = gym.minPrice != null;
                    const hasServiceCount = (gym.serviceCount ?? 0) > 0;

                    return (
                      <div
                        key={gym.id}
                        className="backdrop-blur-sm border rounded-xl p-3 sm:p-4 transition-all bg-white/80 border-slate-200 hover:border-amber-500/50 shadow-sm dark:bg-slate-800/50 dark:border-slate-700/50"
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex items-center gap-3 sm:w-72">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={displayName}
                                loading="lazy"
                                decoding="async"
                                width={56}
                                height={56}
                                className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
                              />
                            ) : (
                              <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                                style={styles.gradient}
                              >
                                {displayName.charAt(0).toUpperCase() || 'G'}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="font-semibold text-base truncate text-slate-900 dark:text-white">
                                  {displayName}
                                </h3>
                                <ProviderVerificationBadge
                                  isVerified={gym.isVerified}
                                  notVerifiedLabel={t.serviceListing.notVerified}
                                  verifiedLabel={t.serviceListing.verified}
                                />
                              </div>
                              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{location}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1">
                            {gym.shortDescription && (
                              <p className="text-xs mb-2 text-slate-600 dark:text-slate-300">
                                {gym.shortDescription}
                              </p>
                            )}

                            {(hasPrice || hasServiceCount) && (
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
                                {hasPrice && (
                                  <p className="text-sm font-bold" style={styles.text}>
                                    {gym.minPrice != null && gym.minPrice > 0
                                      ? `${t.serviceListing.fromPrice} ${gym.minPrice} TND`
                                      : t.services.onQuote}
                                  </p>
                                )}
                                {hasServiceCount && (
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                    {gym.serviceCount} service
                                    {(gym.serviceCount ?? 0) > 1 ? 's' : ''}
                                  </p>
                                )}
                              </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={() =>
                                  navigate(`/gym/booking/${gym.id}`, {
                                    state: {
                                      provider: gym,
                                    },
                                  })
                                }
                                className="flex-1 rounded-lg px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:scale-[1.01]"
                                style={styles.gradient}
                              >
                                <span className="flex items-center justify-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" /> {t.serviceListing.book}
                                </span>
                              </button>
                              <button
                                onClick={() => setContactProviderId(gym.id)}
                                className="flex-1 px-3 py-2 border rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs font-medium bg-white/80 hover:bg-slate-100 border-slate-200 text-slate-700 backdrop-blur-sm dark:bg-slate-800/60 dark:hover:bg-slate-700/70 dark:border-slate-700 dark:text-slate-200"
                              >
                                <Phone className="h-3.5 w-3.5" /> {t.serviceListing.call}
                              </button>
                              <button
                                onClick={() => setContactProviderId(gym.id)}
                                className="px-3 py-2 border rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs font-medium bg-white/80 hover:bg-slate-100 border-slate-200 text-slate-700 backdrop-blur-sm dark:bg-slate-800/60 dark:hover:bg-slate-700/70 dark:border-slate-700 dark:text-slate-200"
                              >
                                <MessageCircle className="h-3.5 w-3.5" /> {t.serviceListing.contact}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  title={t.serviceListing.noProvidersFound}
                  description={t.help.tryOtherKeywords}
                  icon={<Trophy className="h-5 w-5" />}
                  className="rounded-xl border border-slate-200 bg-white/80 py-8 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
                />
              )}

              <PaginationControls
                pagination={data?.pagination}
                itemCount={gyms.length}
                onPageChange={setPage}
                disabled={loading || isUpdating}
                previousLabel={t.common.previous}
                nextLabel={t.common.next}
              />
            </div>
          </div>
        </div>
      </div>

      <ProviderContactModal
        providerId={contactProviderId}
        onClose={() => setContactProviderId(null)}
      />
    </div>
  );
}
