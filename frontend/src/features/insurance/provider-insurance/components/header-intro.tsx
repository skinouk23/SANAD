import { Crown, Phone, Shield } from 'lucide-react';

import { ProviderRouteHeader } from '@/features/providers';

export function ProviderInsuranceHeader() {
  return (
    <ProviderRouteHeader containerClassName="mx-auto max-w-7xl px-4 py-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 sm:h-12 sm:w-12">
            <Shield className="h-5 w-5 text-white sm:h-6 sm:w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
              Assurance RC Pro
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Protection complète incluse
            </p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 self-start rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90">
          <Phone className="h-3.5 w-3.5" />
          Contacter l'assureur
        </button>
      </div>
    </ProviderRouteHeader>
  );
}

export function ProviderInsuranceIntro() {
  return (
    <div className="mb-4 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-3 shadow-sm backdrop-blur-sm sm:p-4 dark:border-amber-500/30 dark:from-amber-500/10 dark:to-orange-500/10">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
          <Crown className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="mb-0.5 text-sm font-bold text-slate-900 sm:text-base dark:text-white">
            Assurance RC Professionnelle Incluse
          </h3>
          <p className="text-[10px] text-slate-600 sm:text-xs dark:text-slate-300">
            Couverture jusqu'à 500 000 TND • Aucune franchise
          </p>
        </div>
        <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-1 text-[10px] font-bold text-white">
          Elite
        </span>
      </div>
    </div>
  );
}
