import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Phone, Search, Star, UtensilsCrossed } from 'lucide-react';
import { AnimatedBorderSurface } from '@/shared/ui/composites/animated-border-surface';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { PaginationControls } from '@/shared/ui/composites/pagination-controls';
import { Skeleton, SkeletonProviderGrid } from '@/shared/ui/composites/loading';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import {
  getNutritionSubtypeLabel,
  ProviderContactModal,
  ProviderVerificationBadge,
  getProviderDisplayName,
  getProviderImageUrl,
  NUTRITION_PROVIDER_SUBTYPE_VALUES,
  providerListOptions,
  useNutritionProviders,
  useProviderFilterOptions,
} from '@/features/providers';
import { useServiceAccent } from '@/features/services';
import { queryClient } from '@/shared/lib/query/client';
import type { LoaderFunctionArgs } from 'react-router-dom';

const ALL_ZONES_VALUE = '__all_zones__';
const PROVIDER_PAGE_SIZE = 20;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async (_args: LoaderFunctionArgs) => {
  void queryClient.prefetchQuery(
    providerListOptions({ serviceCategory: 'nutrition', page: 1, limit: PROVIDER_PAGE_SIZE }),
  );
  return null;
};

export function NutritionProvidersPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [page, setPage] = useState(1);
  const [selectedSubtype, setSelectedSubtype] = useState<string | null>(null);
  const [contactProviderId, setContactProviderId] = useState<string | null>(null);
  const { styles } = useServiceAccent('nutrition');
  const debouncedSearchQuery = useDebouncedValue(searchQuery.trim(), 300);
  const { providers, data, loading, error, refetch, isRefreshing, isPlaceholderData } =
    useNutritionProviders({
      page,
      limit: PROVIDER_PAGE_SIZE,
      ...(selectedZone ? { city: selectedZone } : {}),
      ...(debouncedSearchQuery ? { searchQuery: debouncedSearchQuery } : {}),
    });
  const isUpdating = isRefreshing || isPlaceholderData;
  const showInitialLoading = loading && providers.length === 0;

  const { cities: zones, nutritionProviderSubtypes } = useProviderFilterOptions('nutrition');
  const subtypeOptions =
    nutritionProviderSubtypes.length > 0
      ? nutritionProviderSubtypes
      : NUTRITION_PROVIDER_SUBTYPE_VALUES;
  const filteredProviders = useMemo(
    () =>
      providers.filter((provider) => {
        if (selectedSubtype && provider.nutritionProviderSubtype !== selectedSubtype) {
          return false;
        }

        return true;
      }),
    [providers, selectedSubtype],
  );
  const visibleProviderCount = selectedSubtype
    ? filteredProviders.length
    : (data?.pagination.total ?? filteredProviders.length);

  return (
    <div className="min-h-screen">
      <div className="relative z-10 py-4 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <AnimatedBorderSurface
            className="relative mb-4 overflow-hidden rounded-[16px] p-[2px] shadow-sm"
            borderClassName="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
            borderStyle={styles.conicBorder}
            innerClassName="relative rounded-[14px] bg-white/95 p-4 backdrop-blur-xl dark:bg-slate-900/95"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl text-white"
                style={styles.gradient}
              >
                🍽️
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t.serviceListing.nutritionTitle}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t.serviceListing.nutritionSubtitle}
                </p>
              </div>
            </div>
          </AnimatedBorderSurface>

          <div className="backdrop-blur-sm border rounded-xl p-4 mb-4 bg-white/80 border-slate-200 shadow-sm dark:bg-slate-800/50 dark:border-slate-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5 text-slate-900 dark:text-white"
                  htmlFor="nutrition-zone-filter"
                >
                  {t.serviceListing.geoZone}
                </label>
                <Select
                  value={selectedZone || ALL_ZONES_VALUE}
                  onValueChange={(value) => {
                    setSelectedZone(value === ALL_ZONES_VALUE ? '' : value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger
                    id="nutrition-zone-filter"
                    className="w-full border-slate-200 bg-white/80 text-slate-900 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                  >
                    <SelectValue placeholder={t.serviceListing.allZones} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={ALL_ZONES_VALUE}>{t.serviceListing.allZones}</SelectItem>
                      {zones.map((zone) => (
                        <SelectItem key={zone} value={zone}>
                          {zone}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 text-slate-900 dark:text-white">
                  {t.serviceListing.searchPlaceholder}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder={t.serviceListing.searchPlaceholder}
                    className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm transition-all bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
              <div className="flex gap-2 overflow-x-auto border-b border-slate-200 p-1.5 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSubtype(null);
                    setPage(1);
                  }}
                  aria-pressed={selectedSubtype === null}
                  className={`min-w-0 flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                    selectedSubtype === null
                      ? 'bg-orange-500/10 text-orange-500'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-white'
                  }`}
                >
                  {t.serviceListing.nutritionAllProviders}
                </button>

                {subtypeOptions.map((subtype) => {
                  const subtypeLabel =
                    getNutritionSubtypeLabel(
                      NUTRITION_PROVIDER_SUBTYPE_VALUES.find((value) => value === subtype),
                      t,
                    ) ?? subtype;
                  const isActive = selectedSubtype === subtype;

                  return (
                    <button
                      key={subtype}
                      type="button"
                      onClick={() => {
                        setSelectedSubtype(subtype);
                        setPage(1);
                      }}
                      aria-pressed={isActive}
                      className={`min-w-0 flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                        isActive
                          ? 'bg-orange-500/10 text-orange-500'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-white'
                      }`}
                    >
                      {subtypeLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mb-3 flex items-center gap-2" aria-busy={isUpdating || undefined}>
            {showInitialLoading ? (
              <Skeleton className="h-4 w-48 rounded" />
            ) : (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <span className="font-bold text-slate-900 dark:text-white">
                  {visibleProviderCount}
                </span>{' '}
                {t.serviceListing.qualifiedProfessionals}
              </p>
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
            <SkeletonProviderGrid secondaryAction="icon" />
          ) : error && providers.length === 0 ? (
            <EmptyState
              title={t.serviceListing.errorLoading}
              description={t.serviceListing.retry}
              icon={<UtensilsCrossed className="h-5 w-5" />}
              action={
                <button
                  type="button"
                  onClick={() => {
                    void refetch();
                  }}
                  className="rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:scale-[1.01]"
                >
                  {t.serviceListing.retry}
                </button>
              }
              className="py-8 rounded-xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
            />
          ) : filteredProviders.length > 0 ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              aria-busy={isUpdating || undefined}
            >
              {filteredProviders.map((provider) => {
                const imageUrl = getProviderImageUrl(provider);
                const displayName = getProviderDisplayName(provider);
                const nutritionSubtypeLabel = getNutritionSubtypeLabel(
                  provider.nutritionProviderSubtype,
                  t,
                );
                const hasServiceCount = (provider.serviceCount ?? 0) > 0;
                const hasPrice = provider.minPrice != null;

                return (
                  <div
                    key={provider.id}
                    className="backdrop-blur-sm border rounded-xl overflow-hidden transition-all bg-white/80 border-slate-200 hover:border-orange-500/50 shadow-sm dark:bg-slate-800/50 dark:border-slate-700/50 dark:hover:border-orange-500/50"
                  >
                    <div className="h-32 relative">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={displayName}
                          loading="lazy"
                          decoding="async"
                          width={384}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={styles.gradient}
                        >
                          <UtensilsCrossed className="h-10 w-10 text-white opacity-60" />
                        </div>
                      )}
                      {provider.ratingAverage > 0 && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm dark:bg-slate-900/80 dark:text-white">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          {provider.ratingAverage.toFixed(1)}
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-bold mb-1 text-slate-900 dark:text-white">
                        {displayName}
                      </h3>

                      <ProviderVerificationBadge
                        className="mb-2 px-1.5 py-0.5 text-[9px] font-bold"
                        isVerified={provider.isVerified}
                        notVerifiedLabel={t.serviceListing.notVerified}
                        verifiedLabel={t.serviceListing.verified}
                      />

                      {nutritionSubtypeLabel && (
                        <div className="mb-2">
                          <span className="inline-flex items-center rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-600 ring-1 ring-orange-500/20 dark:text-orange-300">
                            {nutritionSubtypeLabel}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-xs mb-2 text-slate-500 dark:text-slate-400">
                        <MapPin className="h-3 w-3" />
                        <span>{provider.city || '-'}</span>
                      </div>

                      {provider.shortDescription && (
                        <p className="text-[10px] mb-3 text-slate-600 dark:text-slate-400">
                          {provider.shortDescription}
                        </p>
                      )}

                      {(hasPrice || hasServiceCount) && (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
                          {hasPrice && (
                            <p className="text-xs font-bold" style={styles.text}>
                              {provider.minPrice != null && provider.minPrice > 0
                                ? `${t.serviceListing.fromPrice} ${provider.minPrice} TND`
                                : t.services.onQuote}
                            </p>
                          )}
                          {hasServiceCount && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              {provider.serviceCount} service
                              {(provider.serviceCount ?? 0) > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={() =>
                            navigate(`/nutrition/booking/${provider.id}`, {
                              state: {
                                provider,
                              },
                            })
                          }
                          className="group relative flex-1 overflow-hidden rounded-lg"
                        >
                          <span
                            className="relative flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-transform group-hover:scale-[1.01]"
                            style={styles.gradient}
                          >
                            <Calendar className="h-3 w-3" /> {t.serviceListing.book}
                          </span>
                        </button>
                        <button
                          onClick={() => setContactProviderId(provider.id)}
                          className="p-1.5 border rounded-lg transition-all flex items-center justify-center bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-600 dark:text-white"
                        >
                          <Phone className="h-4 w-4" />
                        </button>
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
              icon={<UtensilsCrossed className="h-5 w-5" />}
              className="py-8 rounded-xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
            />
          )}

          <PaginationControls
            pagination={data?.pagination}
            itemCount={filteredProviders.length}
            onPageChange={setPage}
            disabled={loading || isUpdating}
            previousLabel={t.common.previous}
            nextLabel={t.common.next}
            className="mt-4"
          />
        </div>
      </div>

      <ProviderContactModal
        providerId={contactProviderId}
        onClose={() => setContactProviderId(null)}
      />
    </div>
  );
}
