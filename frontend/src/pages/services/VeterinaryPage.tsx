import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, PawPrint, Phone, Search } from 'lucide-react';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { AnimatedBorderSurface } from '@/shared/ui/composites/animated-border-surface';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import {
  ProviderContactModal,
  providerListOptions,
  useVeterinaryProviders,
} from '@/features/providers';
import { ServiceProviderListing, useServiceAccent } from '@/features/services';
import { queryClient } from '@/shared/lib/query/client';

const PROVIDER_PAGE_SIZE = 20;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async (_args: LoaderFunctionArgs) => {
  void queryClient.prefetchQuery(
    providerListOptions({ serviceCategory: 'veterinary', page: 1, limit: PROVIDER_PAGE_SIZE }),
  );
  return null;
};

export function VeterinaryPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [contactProviderId, setContactProviderId] = useState<string | null>(null);
  const [selectedContactProviderId, setSelectedContactProviderId] = useState<string | null>(null);
  const debouncedSearchQuery = useDebouncedValue(searchQuery.trim(), 300);
  const { providers, data, loading, error, refetch, isRefreshing, isPlaceholderData } =
    useVeterinaryProviders({
      page,
      limit: PROVIDER_PAGE_SIZE,
      ...(debouncedSearchQuery ? { searchQuery: debouncedSearchQuery } : {}),
    });
  const { styles } = useServiceAccent('veterinary');
  const totalProviders = data?.pagination.total ?? providers.length;

  return (
    <div className="min-h-screen">
      <div className="relative z-10 py-4 px-6 pb-12">
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
                <PawPrint className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t.serviceListing.veterinaryTitle}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t.serviceListing.veterinarySubtitle}
                </p>
              </div>
            </div>
            <div className="p-3 rounded-lg border mb-3 bg-orange-50 border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/30">
              <p className="text-xs text-orange-800 dark:text-orange-200">
                Parcourez les cabinets et cliniques publiés, puis contactez directement le
                prestataire pour confirmer les animaux acceptés et les modalités de prise en charge.
              </p>
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
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm transition-all bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-sm"
              />
            </div>
          </AnimatedBorderSurface>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ServiceProviderListing
              providers={providers}
              loading={loading}
              error={error}
              onRetry={() => {
                void refetch();
              }}
              isRefreshing={isRefreshing}
              isPlaceholderData={isPlaceholderData}
              emptyTitle={t.serviceListing.noProvidersFound}
              emptyDescription={t.help.tryOtherKeywords}
              heading={`${totalProviders} vétérinaire${totalProviders > 1 ? 's' : ''} publié${totalProviders > 1 ? 's' : ''}`}
              fallbackIcon={<PawPrint className="h-6 w-6 text-white" />}
              descriptionChipClassName="px-1.5 py-0.5 text-[9px] rounded-full font-semibold bg-orange-500/20 border border-orange-500/50 text-orange-500"
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
              onBook={(provider) =>
                navigate(`/veterinary/booking/${provider.id}`, {
                  state: {
                    provider,
                  },
                })
              }
              onCall={(providerId) => {
                setSelectedContactProviderId(providerId);
                setContactProviderId(providerId);
              }}
            />

            <div className="space-y-3">
              <div className="backdrop-blur-sm border rounded-xl p-4 bg-white/80 border-slate-200 shadow-sm dark:bg-slate-800/50 dark:border-slate-700/50">
                <h3 className="text-sm font-bold mb-2 text-slate-900 dark:text-white">
                  Prestations et animaux
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Les actes réalisés et les animaux pris en charge varient selon chaque cabinet.
                  Consultez la fiche ou contactez directement le prestataire pour confirmer.
                </p>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Urgence vétérinaire
                  </h3>
                </div>
                <p className="text-xs mb-3 text-slate-600 dark:text-slate-300">
                  En cas de besoin immédiat, utilisez Appeler pour joindre un prestataire publié et
                  confirmer la prise en charge disponible.
                </p>
                <button
                  onClick={() => {
                    if (selectedContactProviderId) {
                      setContactProviderId(selectedContactProviderId);
                    }
                  }}
                  disabled={!selectedContactProviderId}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${selectedContactProviderId ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:scale-[1.01]' : 'bg-slate-200 text-slate-500 cursor-not-allowed opacity-70 dark:bg-slate-700 dark:text-slate-400'}`}
                >
                  <Phone className="h-3.5 w-3.5" />
                  {t.serviceListing.call}
                </button>
                <p className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                  {selectedContactProviderId
                    ? 'Rappelle le dernier prestataire sélectionné via le bouton Appeler de la liste.'
                    : 'Choisissez d’abord un prestataire via le bouton Appeler dans la liste.'}
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
