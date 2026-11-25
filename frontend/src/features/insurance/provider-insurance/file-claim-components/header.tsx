import { AlertCircle, ArrowLeft } from 'lucide-react';

import { ProviderRouteHeader } from '@/features/providers';

export function ProviderFileClaimHeader({ onBack }: { onBack: () => void }) {
  return (
    <ProviderRouteHeader containerClassName="mx-auto max-w-lg px-4 py-4 sm:px-6 sm:py-6">
      <button
        type="button"
        onClick={onBack}
        className="group mb-4 flex items-center font-medium text-cyan-600 transition-colors hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Retour à l'assurance
      </button>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-500 sm:h-12 sm:w-12">
          <AlertCircle className="h-5 w-5 text-white sm:h-6 sm:w-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            Déclarer un sinistre
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Remplissez ce formulaire pour initier votre demande
          </p>
        </div>
      </div>
    </ProviderRouteHeader>
  );
}
