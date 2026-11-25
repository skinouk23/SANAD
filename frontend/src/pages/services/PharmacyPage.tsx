import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, Search, Syringe, Truck } from 'lucide-react';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { AnimatedBorderSurface } from '@/shared/ui/composites/animated-border-surface';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { ProviderContactModal, providerListOptions, usePharmacies } from '@/features/providers';
import { ServiceProviderListing, useServiceAccent } from '@/features/services';
import { queryClient } from '@/shared/lib/query/client';

const PROVIDER_PAGE_SIZE = 20;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async (_args: LoaderFunctionArgs) => {
  void queryClient.prefetchQuery(
    providerListOptions({ serviceCategory: 'pharmacy', page: 1, limit: PROVIDER_PAGE_SIZE }),
  );
  return null;
};

export function PharmacyPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [contactProviderId, setContactProviderId] = useState<string | null>(null);
  const debouncedSearchQuery = useDebouncedValue(searchQuery.trim(), 300);
  const {
    providers: pharmacies,
    data,
    loading,
    error,
    refetch,
    isRefreshing,
    isPlaceholderData,
  } = usePharmacies({
    page,
    limit: PROVIDER_PAGE_SIZE,
    ...(debouncedSearchQuery ? { searchQuery: debouncedSearchQuery } : {}),
  });
  const { styles } = useServiceAccent('pharmacy');
  const totalPharmacies = data?.pagination.total ?? pharmacies.length;

  return (
    <div className="min-h-screen">
      <div className="relative z-10 py-4 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <AnimatedBorderSurface
            className="relative mb-4 overflow-hidden rounded-[18px] p-[2px] shadow-lg"
            borderClassName="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
            borderStyle={styles.conicBorder}
            innerClassName="relative rounded-[16px] bg-white/95 p-5 backdrop-blur-xl dark:bg-slate-900/95"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={styles.gradient}
              >
                <Pill className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t.serviceListing.pharmacyTitle}
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {t.serviceListing.pharmacySubtitle}
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
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm transition-all bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
              />
            </div>
          </AnimatedBorderSurface>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ServiceProviderListing
              providers={pharmacies}
              loading={loading}
              error={error}
              onRetry={() => {
                void refetch();
              }}
              isRefreshing={isRefreshing}
              isPlaceholderData={isPlaceholderData}
              emptyTitle={t.serviceListing.noProvidersFound}
              emptyDescription={t.help.tryOtherKeywords}
              heading={`${totalPharmacies} pharmacie${totalPharmacies > 1 ? 's' : ''} publiée${totalPharmacies > 1 ? 's' : ''}`}
              fallbackIcon={<Pill className="h-7 w-7" />}
              descriptionChipClassName="px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/50 text-emerald-500 text-[9px] rounded-full font-semibold"
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
              onBook={(pharmacy) =>
                navigate(`/pharmacy/booking/${pharmacy.id}`, {
                  state: {
                    provider: pharmacy,
                  },
                })
              }
              onCall={setContactProviderId}
            />

            <div className="space-y-3">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                <h3 className="text-sm font-bold mb-2 text-slate-900 dark:text-white">
                  Livraison de médicaments
                </h3>
                <p className="text-[10px] mb-2 text-slate-600 dark:text-slate-300">
                  Scannez votre ordonnance et faites-vous livrer vos médicaments à domicile en toute
                  sécurité.
                </p>
                <div className="flex items-start gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-300">
                  <Truck className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  <p>Livraison express disponible (moins de 2h)</p>
                </div>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
                <div className="flex items-center gap-1.5 mb-2">
                  <Syringe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Vaccination & Tests
                  </h3>
                </div>
                <p className="text-[10px] text-slate-600 dark:text-slate-300">
                  Les pharmacies partenaires proposent la vaccination grippe et COVID-19, ainsi que
                  les tests antigéniques rapides.
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
