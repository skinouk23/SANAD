import { useState, useCallback, useMemo } from 'react';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MapPin,
  Star,
  // Clock, // Preserved for the intentionally commented service trust cards.
  // Shield, // Preserved for the intentionally commented service trust cards.
  CheckCircle2,
  Calendar,
  Phone,
  Heart,
  User,
  X,
  Stethoscope,
  Filter,
} from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import {
  getProviderDisplayName,
  getProviderLocation,
  ProviderContactModal,
  ProviderVerificationBadge,
  providerListOptions,
  useCareProviders,
  useProviderFilterOptions,
} from '@/features/providers';
import { useServiceAccent, useServiceCategories } from '@/features/services';
import { queryClient } from '@/shared/lib/query/client';
import { AnimatedBorderSurface } from '@/shared/ui/composites/animated-border-surface';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { PaginationControls } from '@/shared/ui/composites/pagination-controls';
import { Skeleton } from '@/shared/ui/composites/loading';
import { Button } from '@/shared/ui/primitives/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';

const ALL_ZONES_VALUE = '__all_zones__';
const PROVIDER_PAGE_SIZE = 20;

function CareProviderListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
        >
          <div className="flex gap-3">
            <Skeleton className="h-14 w-14 flex-shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <Skeleton className="mb-1.5 h-3.5 w-32 rounded" />
              <Skeleton className="mb-1.5 h-3 w-24 rounded" />
              <Skeleton className="h-3 w-40 max-w-full rounded" />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Skeleton className="h-8 flex-1 rounded-lg" />
            <Skeleton className="h-8 flex-1 rounded-lg" />
            <Skeleton className="h-8 flex-1 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (params.serviceId) {
    void queryClient.prefetchQuery(
      providerListOptions({
        serviceCategory: params.serviceId,
        page: 1,
        limit: PROVIDER_PAGE_SIZE,
      }),
    );
  }
  return null;
};

export function CareServicePage() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{
    serviceId: string;
  }>();
  const { t } = useLanguage();
  const [selectedZone, setSelectedZone] = useState('');
  const [page, setPage] = useState(1);
  const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>([]);
  const [showSpecialityFilter, setShowSpecialityFilter] = useState(false);
  const [contactProviderId, setContactProviderId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState<string | null>(null);
  const isDoctor = serviceId === 'doctor';
  const {
    allCategories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useServiceCategories();
  const { styles } = useServiceAccent(serviceId);
  const categoryMeta = allCategories.find((c) => c.code === serviceId);
  const categoryLabel = categoryMeta?.label ?? serviceId ?? '';
  const categoryDesc = categoryMeta?.description ?? '';
  const {
    providers,
    data: providersData,
    loading: providersLoading,
    error: providersError,
    refetch: refetchProviders,
    isRefreshing,
    isPlaceholderData,
  } = useCareProviders(serviceId, {
    page,
    limit: PROVIDER_PAGE_SIZE,
    ...(selectedZone ? { city: selectedZone } : {}),
  });
  const toggleSpeciality = useCallback((spec: string) => {
    setPage(1);
    setSelectedSpecialities((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec],
    );
  }, []);
  const clearSpecialities = useCallback(() => {
    setPage(1);
    setSelectedSpecialities([]);
  }, []);
  const { cities: zones, specialties: availableSpecialities } = useProviderFilterOptions(serviceId);
  const filteredProviders = useMemo(
    () =>
      providers.filter((provider) => {
        if (!isDoctor || selectedSpecialities.length === 0) return true;
        return selectedSpecialities.some((spec) =>
          provider.specialties.some((s) => s.toLowerCase() === spec.toLowerCase()),
        );
      }),
    [isDoctor, providers, selectedSpecialities],
  );
  const selectedProfileProvider = showProfileModal
    ? providers.find((provider) => provider.id === showProfileModal)
    : null;
  const isUpdating = isRefreshing || isPlaceholderData;
  const showProvidersInitialLoading = providersLoading && providers.length === 0;
  const totalQualifiedProviders = providersData?.pagination.total ?? filteredProviders.length;
  if (providersError && providers.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 text-slate-900 dark:text-white">
        <div className="max-w-md rounded-xl border border-slate-200 bg-white/80 p-6 text-center shadow-xl backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
          <h2 className="mb-2 text-base font-bold text-slate-900 dark:text-white">
            {t.serviceListing.errorLoading}
          </h2>
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
            {t.serviceListing.retry}
          </p>
          <button
            onClick={() => {
              void refetchProviders();
            }}
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
          >
            {t.serviceListing.retry}
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen text-slate-900 dark:text-white">
      <div className="relative z-10 py-4 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <AnimatedBorderSurface
            className="relative mb-4 overflow-hidden rounded-[20px] p-[2px] shadow-xl"
            borderClassName="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
            borderStyle={styles.conicBorder}
            innerClassName="relative rounded-[18px] bg-white/95 p-5 backdrop-blur-xl dark:bg-slate-900/95"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                style={styles.gradient}
              >
                <Heart className="h-5 w-5 text-white" />
              </div>
              {categoriesLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-44 rounded" />
                  <Skeleton className="h-4 w-72 max-w-full rounded" />
                </div>
              ) : categoriesError ? (
                <div className="space-y-1">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    {serviceId ?? 'Service'}
                  </h1>
                  <button
                    type="button"
                    onClick={() => {
                      void refetchCategories();
                    }}
                    className="text-xs font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
                  >
                    Recharger les informations du service
                  </button>
                </div>
              ) : (
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    {categoryLabel}
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{categoryDesc}</p>
                </div>
              )}
            </div>
          </AnimatedBorderSurface>

          {/* Intentionally preserved but hidden: service trust cards.
              Includes:
              - Professionnels qualifiés / Diplômés et expérimentés
              - Disponibilité rapide / Intervention sous 24-48h
              - Tarifs transparents / category description
              Do not delete. See AGENTS.md "Preserved Commented UI". */}
          {/*
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {[
              {
                icon: Shield,
                title: t.serviceListing.qualifiedProfessionals,
                desc: 'Diplômés et expérimentés',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Clock,
                title: t.serviceListing.quickAvailability,
                desc: 'Intervention sous 24-48h',
                gradient: 'from-green-500 to-emerald-500',
              },
              {
                icon: Heart,
                title: t.serviceListing.transparentPricing,
                desc: categoryMeta ? `${categoryMeta.description ?? ''}` : '',
                gradient: 'from-purple-500 to-pink-500',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.gradient}`}
                  >
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-0.5 text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          */}

          {/* Filters Section */}
          <div className="mb-4 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
            <div className={`grid grid-cols-1 ${isDoctor ? 'md:grid-cols-2' : ''} gap-3`}>
              <div>
                <label
                  className="mb-1.5 block text-xs font-semibold text-slate-900 dark:text-white"
                  htmlFor="care-service-zone-filter"
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
                    id="care-service-zone-filter"
                    className="w-full border-slate-200 bg-white text-slate-900 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
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

              {/* Speciality Filter - Doctor only */}
              {isDoctor && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-900 dark:text-white">
                    {t.serviceListing.allSpecialities}
                    {selectedSpecialities.length > 0 && (
                      <span className="ml-1 text-[10px] font-normal text-cyan-600 dark:text-cyan-400">
                        ({selectedSpecialities.length} sélectionnée
                        {selectedSpecialities.length > 1 ? 's' : ''})
                      </span>
                    )}
                  </label>
                  <button
                    onClick={() => setShowSpecialityFilter(!showSpecialityFilter)}
                    className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-900 transition-all hover:border-cyan-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                  >
                    <span
                      className={
                        selectedSpecialities.length === 0
                          ? 'text-slate-400 dark:text-slate-500'
                          : 'truncate mr-2'
                      }
                    >
                      {selectedSpecialities.length === 0
                        ? t.serviceListing.allSpecialities
                        : selectedSpecialities.slice(0, 2).join(', ') +
                          (selectedSpecialities.length > 2
                            ? ` +${selectedSpecialities.length - 2}`
                            : '')}
                    </span>
                    <Filter className="h-3.5 w-3.5 flex-shrink-0 text-slate-500 dark:text-slate-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Speciality chips dropdown */}
            {isDoctor && showSpecialityFilter && (
              <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
                    {t.serviceListing.allSpecialities}
                  </p>
                  {selectedSpecialities.length > 0 && (
                    <button
                      onClick={clearSpecialities}
                      className="text-[10px] font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      {t.serviceListing.clearFilters}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {availableSpecialities.map((spec) => {
                    const isSelected = selectedSpecialities.includes(spec);
                    return (
                      <button
                        key={spec}
                        onClick={() => toggleSpeciality(spec)}
                        className={`rounded-md border px-2.5 py-1 text-[10px] font-medium transition-all ${isSelected ? 'border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-500/50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:border-cyan-500/50 dark:hover:text-white'}`}
                      >
                        {isSelected && <CheckCircle2 className="h-2.5 w-2.5 inline mr-1" />}
                        {spec}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected specialities pills */}
            {isDoctor && !showSpecialityFilter && selectedSpecialities.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedSpecialities.map((spec) => (
                  <span
                    key={spec}
                    className="inline-flex items-center gap-1 rounded-full border border-cyan-500/50 bg-cyan-500/20 px-2 py-0.5 text-[10px] font-medium text-cyan-600 dark:text-cyan-400"
                  >
                    {spec}
                    <button
                      onClick={() => toggleSpeciality(spec)}
                      className="transition-colors hover:text-slate-900 dark:hover:text-white"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearSpecialities}
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  {t.serviceListing.clearFilters}
                </button>
              </div>
            )}
          </div>

          <div className="mb-3 flex items-center gap-2" aria-busy={isUpdating || undefined}>
            {showProvidersInitialLoading ? (
              <Skeleton className="h-5 w-44 rounded" />
            ) : (
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {totalQualifiedProviders} {t.serviceListing.qualifiedProfessionals}
              </h2>
            )}
            {isUpdating && !showProvidersInitialLoading ? (
              <span
                aria-live="polite"
                className="rounded-full border border-slate-200 bg-white/80 px-2 py-0.5 text-[10px] font-medium text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400"
              >
                Mise à jour...
              </span>
            ) : null}
          </div>

          {providersError && (
            <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-800 shadow-sm backdrop-blur-sm dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p>{t.serviceListing.errorLoading}</p>
                <button
                  type="button"
                  onClick={() => {
                    void refetchProviders();
                  }}
                  className="rounded-lg border border-amber-300 px-2.5 py-1 font-medium transition-colors hover:bg-amber-100 dark:border-amber-500/40 dark:hover:bg-amber-500/20"
                >
                  {t.serviceListing.retry}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3" aria-busy={isUpdating || undefined}>
            {showProvidersInitialLoading ? (
              <CareProviderListSkeleton />
            ) : (
              filteredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all hover:border-cyan-500 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-cyan-500/50"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-between sm:flex-col sm:items-center gap-3">
                        <div
                          className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl text-xl text-white"
                          style={styles.gradient}
                        >
                          {provider.profilePictureUrl ? (
                            <img
                              src={provider.profilePictureUrl}
                              alt={getProviderDisplayName(provider)}
                              loading="lazy"
                              decoding="async"
                              width={56}
                              height={56}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xl">
                              {getProviderDisplayName(provider).charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="text-right sm:text-center">
                          {provider.minPrice != null && (
                            <p className="whitespace-nowrap text-sm font-bold" style={styles.text}>
                              {provider.minPrice} TND
                            </p>
                          )}
                          {(provider.serviceCount ?? 0) > 0 && (
                            <p className="text-[9px] text-slate-400 dark:text-slate-500">
                              {provider.serviceCount} services
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {getProviderDisplayName(provider)}
                          </h3>
                          <ProviderVerificationBadge
                            isVerified={provider.isVerified}
                            notVerifiedLabel={t.serviceListing.notVerified}
                            verifiedLabel={t.serviceListing.verified}
                          />
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-0.5">
                            <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {provider.ratingAverage.toFixed(1)}
                            </span>
                            <span>({provider.ratingCount})</span>
                          </div>
                          {provider.city && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-0.5">
                                <MapPin className="h-2.5 w-2.5" />
                                <span>{provider.city}</span>
                              </div>
                            </>
                          )}
                        </div>
                        {provider.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {provider.specialties.map((spec) => (
                              <span
                                key={spec}
                                className="rounded-full border border-blue-500/50 bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-blue-600 dark:text-blue-400"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/care/${serviceId}/booking/${provider.id}`)}
                          className="group relative flex-1 overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
                        >
                          <span
                            className="relative flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-white transition-transform group-hover:scale-[1.01]"
                            style={styles.gradient}
                          >
                            <Calendar className="h-3 w-3" />
                            {t.serviceListing.book}
                          </span>
                        </button>
                        <button
                          onClick={() => setContactProviderId(provider.id)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                        >
                          <Phone className="h-3 w-3" />
                          {t.serviceListing.contact}
                        </button>
                        <button
                          onClick={() => setShowProfileModal(provider.id)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                        >
                          <User className="h-3 w-3" />
                          {t.serviceListing.profile}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Empty state */}
            {!showProvidersInitialLoading && filteredProviders.length === 0 && (
              <EmptyState
                title={t.serviceListing.noProvidersFound}
                description={t.serviceListing.clearFilters}
                icon={<Stethoscope className="h-5 w-5" />}
                action={
                  selectedSpecialities.length > 0 ? (
                    <button
                      onClick={clearSpecialities}
                      className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:scale-[1.01]"
                    >
                      {t.serviceListing.clearFilters}
                    </button>
                  ) : undefined
                }
                className="rounded-xl border border-slate-200 bg-white/80 py-8 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
              />
            )}

            <PaginationControls
              pagination={providersData?.pagination}
              itemCount={filteredProviders.length}
              onPageChange={setPage}
              disabled={providersLoading || isUpdating}
              previousLabel={t.common.previous}
              nextLabel={t.common.next}
            />
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ProviderContactModal
        providerId={contactProviderId}
        onClose={() => setContactProviderId(null)}
      />

      {/* Profile Modal */}
      <Dialog
        open={selectedProfileProvider !== null}
        onOpenChange={(open) => {
          if (!open) {
            setShowProfileModal(null);
          }
        }}
      >
        {selectedProfileProvider ? (
          <DialogContent scroll="content" size="md">
            {(() => {
              const provider = selectedProfileProvider;
              const displayName = getProviderDisplayName(provider);
              const location = getProviderLocation(provider);
              return (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-slate-900 dark:text-white">
                      {t.serviceListing.profile}
                    </DialogTitle>
                    <DialogDescription className="text-slate-600 dark:text-slate-400">
                      {provider.shortDescription || t.serviceListing.qualifiedProfessionals}
                    </DialogDescription>
                  </DialogHeader>

                  <DialogBody className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl text-2xl text-white"
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
                          <span className="text-2xl">{displayName.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="mb-0.5 text-lg font-bold text-slate-900 dark:text-white">
                          {displayName}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {provider.shortDescription || t.serviceListing.qualifiedProfessionals}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {provider.ratingAverage.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            ({provider.ratingCount} {t.serviceListing.reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                    {provider.specialties.length > 0 && (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700/70 dark:bg-slate-900/50">
                        <p className="mb-1 text-[10px] text-cyan-600 dark:text-cyan-400">
                          {t.serviceListing.allSpecialities}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {provider.specialties.map((spec) => (
                            <span
                              key={spec}
                              className="rounded-full border border-blue-500/50 bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="space-y-3 mb-4">
                      {location && (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700/70 dark:bg-slate-900/50">
                          <p className="mb-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                            Zone
                          </p>
                          <p className="text-xs font-medium text-slate-900 dark:text-white">
                            {location}
                          </p>
                        </div>
                      )}
                      {provider.bio && (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700/70 dark:bg-slate-900/50">
                          <p className="mb-1 text-[10px] text-slate-500 dark:text-slate-400">Bio</p>
                          <p className="text-xs text-slate-700 dark:text-slate-300">
                            {provider.bio}
                          </p>
                        </div>
                      )}
                    </div>
                  </DialogBody>
                  <DialogFooter className="sm:justify-stretch">
                    <Button
                      onClick={() => {
                        setShowProfileModal(null);
                        navigate(`/care/${serviceId}/booking/${provider.id}`);
                      }}
                      className="flex-1 text-white shadow-sm transition-all hover:scale-[1.01]"
                      style={styles.gradient}
                    >
                      {t.serviceListing.book}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowProfileModal(null);
                        setContactProviderId(provider.id);
                      }}
                      className="flex-1"
                      variant="outline"
                    >
                      {t.serviceListing.contact}
                    </Button>
                  </DialogFooter>
                </>
              );
            })()}
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );
}
