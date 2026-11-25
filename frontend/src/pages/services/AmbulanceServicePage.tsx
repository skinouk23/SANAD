import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Phone, Zap } from 'lucide-react';
import { AnimatedBorderSurface } from '@/shared/ui/composites/animated-border-surface';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';
import {
  ProviderContactModal,
  providerListOptions,
  useAmbulanceProviders,
  useProviderFilterOptions,
} from '@/features/providers';
import { ServiceProviderListing, useServiceAccent } from '@/features/services';
import { queryClient } from '@/shared/lib/query/client';
import type { LoaderFunctionArgs } from 'react-router-dom';

const ALL_ZONES_VALUE = '__all_zones__';
const PROVIDER_PAGE_SIZE = 20;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async (_args: LoaderFunctionArgs) => {
  void queryClient.prefetchQuery(
    providerListOptions({ serviceCategory: 'ambulance', page: 1, limit: PROVIDER_PAGE_SIZE }),
  );
  return null;
};

export function AmbulanceServicePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedZone, setSelectedZone] = useState('');
  const [page, setPage] = useState(1);
  const [contactProviderId, setContactProviderId] = useState<string | null>(null);
  const { styles } = useServiceAccent('ambulance');
  const { providers, data, loading, error, refetch, isRefreshing, isPlaceholderData } =
    useAmbulanceProviders({
      page,
      limit: PROVIDER_PAGE_SIZE,
      ...(selectedZone ? { city: selectedZone } : {}),
    });

  const { cities: zones } = useProviderFilterOptions('ambulance');
  const totalProviders = data?.pagination.total ?? providers.length;

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
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={styles.gradient}
              >
                🚑
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t.serviceListing.ambulanceTitle}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t.serviceListing.ambulanceSubtitle}
                </p>
              </div>
            </div>
          </AnimatedBorderSurface>

          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold mb-1 text-slate-900 dark:text-white">
                  🚨 Urgence vitale ?
                </h3>
                <p className="text-xs mb-3 text-slate-700 dark:text-slate-300">
                  En cas d'urgence vitale, appelez le{' '}
                  <span className="font-bold text-red-500">SAMU 190</span> ou les{' '}
                  <span className="font-bold text-red-500">Pompiers 198</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="tel:190"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" /> SAMU - 190
                  </a>
                  <a
                    href="tel:198"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" /> Pompiers - 198
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-xl p-4 mb-4 bg-white/80 border-slate-200 shadow-sm backdrop-blur-sm dark:bg-slate-800/50 dark:border-slate-700/50">
            <div>
              <label
                className="block text-xs font-semibold mb-1.5 text-slate-900 dark:text-white"
                htmlFor="ambulance-zone-filter"
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
                  id="ambulance-zone-filter"
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
          </div>

          {/* Intentionally preserved but hidden: ambulance trust/action cards.
              Includes:
              - Contact direct / Appelez le prestataire pour confirmer le trajet et la prise en charge.
              - Transport programmé / Réservez à l’avance pour les déplacements non vitaux.
              - Tarifs publiés / Les montants affichés viennent des services publiés quand ils existent.
              Do not delete. See AGENTS.md "Preserved Commented UI". */}
          {/*
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {[
              {
                icon: Phone,
                title: 'Contact direct',
                desc: 'Appelez le prestataire pour confirmer le trajet et la prise en charge.',
                gradient: 'from-cyan-500 to-blue-500',
              },
              {
                icon: Calendar,
                title: 'Transport programmé',
                desc: 'Réservez à l’avance pour les déplacements non vitaux.',
                gradient: 'from-green-500 to-emerald-500',
              },
              {
                icon: CheckCircle2,
                title: 'Tarifs publiés',
                desc: 'Les montants affichés viennent des services publiés quand ils existent.',
                gradient: 'from-amber-500 to-orange-500',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border rounded-xl p-4 bg-white/80 border-slate-200 shadow-sm backdrop-blur-sm dark:bg-slate-800/50 dark:border-slate-700/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0`}
                  >
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-0.5 text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          */}

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
            emptyDescription="Essayez une autre zone ou contactez directement le SAMU pour une urgence vitale."
            heading={`${totalProviders} service${totalProviders > 1 ? 's' : ''} publié${totalProviders > 1 ? 's' : ''}`}
            fallbackIcon="🚑"
            descriptionChipClassName="px-2 py-0.5 bg-red-500/20 border border-red-500/50 text-red-500 text-[10px] rounded-full font-semibold"
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
              navigate(`/ambulance/booking/${provider.id}`, {
                state: {
                  provider,
                },
              })
            }
            onCall={setContactProviderId}
          />

          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold mb-2 text-sm text-slate-900 dark:text-white">
                  💡 Comment choisir ?
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900 dark:text-white">Urgence vitale :</strong>{' '}
                      Appelez le SAMU 190
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900 dark:text-white">
                        Transport programmé :
                      </strong>{' '}
                      Réservez à l'avance quand le déplacement n'est pas urgent
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900 dark:text-white">Devis :</strong> Confirmez
                      le trajet et le coût exact avec le prestataire avant le départ
                    </span>
                  </li>
                </ul>
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
