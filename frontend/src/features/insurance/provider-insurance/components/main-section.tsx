import { Calendar, CheckCircle2, Shield } from 'lucide-react';

import type { CoverageSection, InsuranceClaim } from '@/features/insurance/schema';

import { getInsuranceClaimStatus } from '@/features/insurance/provider-insurance/providerInsurance.hooks';

export function ProviderInsuranceMainSection({
  claims,
  coverage,
}: {
  claims: InsuranceClaim[];
  coverage: CoverageSection[];
}) {
  return (
    <div className="space-y-4 lg:col-span-2">
      {coverage.map((section) => (
        <div
          key={section.category}
          className="rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm sm:p-4 dark:border-slate-700/50 dark:bg-slate-800/50"
        >
          <h3 className="mb-3 text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
            {section.category}
          </h3>
          <div className="space-y-1.5">
            {section.items.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700/50 dark:bg-slate-900/50"
              >
                <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-green-500/20">
                  <CheckCircle2 className="h-2.5 w-2.5 text-green-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-slate-900 sm:text-xs dark:text-white">
                    {item.text}
                  </p>
                  <p className="mt-0.5 text-[9px] text-slate-500 sm:text-[10px] dark:text-slate-400">
                    Limite : <span className="font-semibold text-green-500">{item.limit}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm sm:p-4 dark:border-slate-700/50 dark:bg-slate-800/50">
        <h3 className="mb-3 text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
          Historique des sinistres
        </h3>
        {claims.length > 0 ? (
          <div className="space-y-2">
            {claims.map((claim) => {
              const status = getInsuranceClaimStatus(claim.status);

              return (
                <div
                  key={claim.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-2 sm:p-3 dark:border-slate-700/50 dark:bg-slate-900/50"
                >
                  <div className="mb-1.5 flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                        {claim.type}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {claim.description}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${status.bg} ${status.text} ${status.border}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <Calendar className="h-2.5 w-2.5" />
                      <span>{claim.date}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {claim.amount} TND
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center">
            <Shield className="mx-auto mb-2 h-8 w-8 text-slate-400 dark:text-slate-600" />
            <p className="text-xs text-slate-500 dark:text-slate-400">Aucun sinistre déclaré</p>
          </div>
        )}
      </div>
    </div>
  );
}
