import { Wallet } from 'lucide-react';

import { ProviderRouteHeader } from '@/features/providers';

export function ProviderWalletPageHeader() {
  return (
    <ProviderRouteHeader>
      <h1 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
          <Wallet className="h-4 w-4 text-white" />
        </span>
        Mon portefeuille cash
      </h1>
      <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
        Gere les rechargements manuels et suis le ledger du portefeuille prestataire.
      </p>
    </ProviderRouteHeader>
  );
}
