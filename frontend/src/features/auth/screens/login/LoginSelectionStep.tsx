import { ArrowLeft, Briefcase, User } from 'lucide-react';
import type { ProviderCategory } from '@/features/providers/providerAuthoring';
import type { AuthProviderServiceOption } from '@/features/auth/config/authCatalog';
import type { TranslationKeys } from '@/i18n/types';

interface LoginSelectionStepProps {
  onPatientSelect: () => void;
  onProviderServiceSelect: (serviceType: ProviderCategory) => void;
  providerServiceOptions: AuthProviderServiceOption[];
  t: TranslationKeys;
}

export function LoginSelectionStep({
  onPatientSelect,
  onProviderServiceSelect,
  providerServiceOptions,
  t,
}: LoginSelectionStepProps) {
  return (
    <div className="space-y-3">
      <button
        onClick={onPatientSelect}
        className="group relative w-full touch-manipulation overflow-hidden rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        type="button"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="relative min-h-[76px] rounded-xl border-2 border-slate-200 bg-slate-50 p-4 transition-all group-hover:border-cyan-500 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 transition-transform group-hover:scale-110">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                {t.auth.patient}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.auth.accessHealthServices}
              </p>
            </div>
            <ArrowLeft className="h-5 w-5 rotate-180 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-cyan-600 dark:text-slate-600 dark:group-hover:text-cyan-400" />
          </div>
        </div>
      </button>

      <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-purple-600">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.auth.professional}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.auth.selectSpecialty}</p>
          </div>
        </div>

        <div className="custom-scrollbar grid max-h-[45dvh] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:max-h-[240px] sm:grid-cols-3 md:grid-cols-4">
          {providerServiceOptions.map((service) => (
            <button
              key={service.serviceType}
              onClick={() => onProviderServiceSelect(service.serviceType)}
              className="group relative min-h-[92px] touch-manipulation overflow-hidden rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              type="button"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 transition-all group-hover:from-cyan-500/10 group-hover:to-blue-500/10" />
              <div className="relative flex h-full flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-3 text-center transition-all group-hover:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/50 sm:p-2.5">
                <span className="mb-1.5 text-2xl transition-transform group-hover:scale-110 sm:text-xl">
                  {service.icon}
                </span>
                <span className="text-xs font-medium leading-tight text-slate-600 transition-colors group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white sm:text-[10px]">
                  {service.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
