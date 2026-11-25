import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap } from 'lucide-react';
import { AnimatedBorderSurface } from '@/shared/ui/composites/animated-border-surface';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import {
  ProviderContactModal,
  providerListOptions,
  useRadiologyCenters,
} from '@/features/providers';
import { ServiceProviderListing, useServiceAccent } from '@/features/services';
import { queryClient } from '@/shared/lib/query/client';
import type { LoaderFunctionArgs } from 'react-router-dom';

const PROVIDER_PAGE_SIZE = 20;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async (_args: LoaderFunctionArgs) => {
  void queryClient.prefetchQuery(
    providerListOptions({ serviceCategory: 'radiology', page: 1, limit: PROVIDER_PAGE_SIZE }),
  );
  return null;
};

export function RadiologyPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [contactProviderId, setContactProviderId] = useState<string | null>(null);
  const debouncedSearchQuery = useDebouncedValue(searchQuery.trim(), 300);
  const {
    providers: radiologyCenters,
    data,
    loading,
    error,
    refetch,
    isRefreshing,
    isPlaceholderData,
  } = useRadiologyCenters({
    page,
    limit: PROVIDER_PAGE_SIZE,
    ...(debouncedSearchQuery ? { searchQuery: debouncedSearchQuery } : {}),
  });
  const { styles } = useServiceAccent('radiology');
  const totalCenters = data?.pagination.total ?? radiologyCenters.length;

  return (
    <div className="min-h-screen">
      <div className="relative z-10 py-4 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <AnimatedBorderSurface
            borderClassName="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
            borderStyle={styles.conicBorder}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={styles.gradient}
              >
                🩻
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t.serviceListing.radiologyTitle}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t.serviceListing.radiologySubtitle}
                </p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder={t.serviceListing.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
          </AnimatedBorderSurface>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ServiceProviderListing
              providers={radiologyCenters}
              loading={loading}
              error={error}
              onRetry={() => {
                void refetch();
              }}
              isRefreshing={isRefreshing}
              isPlaceholderData={isPlaceholderData}
              emptyTitle={t.serviceListing.noProvidersFound}
              emptyDescription={t.help.tryOtherKeywords}
              heading={`${totalCenters} centre${totalCenters > 1 ? 's' : ''} publié${totalCenters > 1 ? 's' : ''}`}
              fallbackIcon="🩻"
              descriptionChipClassName="px-2 py-0.5 bg-purple-500/20 border border-purple-500/50 text-purple-500 text-[10px] rounded-full font-semibold"
              styles={styles}
              copy={{
                book: t.serviceListing.book,
                call: t.serviceListing.call,
                fromPrice: t.serviceListing.fromPrice,
                notVerified: t.serviceListing.notVerified,
                onQuote: t.services.onQuote,
                verified: t.serviceListing.verified,
              }}
              pagination={data?.pagination}
              onPageChange={setPage}
              paginationLabels={{
                previous: t.common.previous,
                next: t.common.next,
              }}
              skeletonBadgeCount={3}
              onBook={(center) =>
                navigate(`/radiology/booking/${center.id}`, {
                  state: {
                    provider: center,
                  },
                })
              }
              onCall={setContactProviderId}
            />

            <div className="space-y-3">
              <div className="backdrop-blur-sm border rounded-xl p-4 bg-white/80 border-slate-200 shadow-sm dark:bg-slate-800/50 dark:border-slate-700/50">
                <h3 className="text-sm font-bold mb-2 text-slate-900 dark:text-white">
                  Examens publiés
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  La préparation, le devis et la durée d&apos;un examen dépendent du centre et des
                  services réellement publiés.
                </p>
              </div>

              <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-500/30 dark:bg-purple-500/10">
                <div className="flex items-center gap-1.5 mb-2">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Planification
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Utilisez Réserver ou Appeler pour confirmer l&apos;examen adapté, les éléments à
                  apporter et la première disponibilité communiquée par le centre.
                </p>
              </div>
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
