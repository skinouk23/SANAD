import { ArrowRight } from 'lucide-react';
import type { AuthOnboardingOption } from '@/features/auth/config/authCatalog';
import { cn } from '@/shared/lib/utils';

interface AuthOnboardingCardProps {
  continueLabel: string;
  onSelect: () => void;
  option: AuthOnboardingOption;
}

const onboardingGradientsById: Record<AuthOnboardingOption['id'], string> = {
  equipment: 'from-purple-500 to-pink-600',
  funeral: 'from-slate-500 to-slate-700',
  gym: 'from-orange-500 to-amber-600',
  laboratory: 'from-indigo-500 to-purple-600',
  patient: 'from-cyan-500 to-cyan-600',
  pharmacy: 'from-emerald-500 to-teal-600',
  professional: 'from-blue-500 to-purple-600',
  radiology: 'from-pink-500 to-rose-600',
  veterinary: 'from-orange-500 to-amber-600',
};

export function AuthOnboardingCard({ continueLabel, onSelect, option }: AuthOnboardingCardProps) {
  const gradient = onboardingGradientsById[option.id];

  return (
    <button
      aria-label={`${continueLabel} ${option.title}`}
      className="group relative h-full w-full touch-manipulation overflow-hidden rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
      onClick={onSelect}
      type="button"
    >
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-10',
          gradient,
        )}
      />

      <div
        className={cn(
          'relative flex h-full min-h-[112px] items-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 shadow-sm shadow-slate-900/5 transition-[background-color,border-color,box-shadow,transform] duration-300 group-hover:border-cyan-500 group-hover:bg-white/90 group-hover:shadow-lg group-hover:shadow-cyan-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:shadow-black/20 dark:group-hover:bg-slate-800/70 sm:block sm:min-h-0 sm:p-4 motion-safe:group-hover:-translate-y-0.5',
        )}
      >
        <div className={cn('absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r', gradient)} />

        <div className="shrink-0 sm:mb-3">
          <div
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg shadow-slate-900/10 transition-transform duration-300 group-hover:scale-110 dark:shadow-black/30 sm:h-10 sm:w-10',
              gradient,
            )}
          >
            <option.icon className="h-5 w-5" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="mb-1 text-base font-bold leading-tight text-slate-900 transition-colors duration-300 group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-400 sm:text-sm">
            {option.title}
          </h3>
          <p className="line-clamp-2 text-xs leading-snug text-slate-500 dark:text-slate-400 sm:mb-2 sm:text-[11px]">
            {option.description}
          </p>

          <ul className="mt-2 hidden space-y-1 sm:block">
            {option.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300"
              >
                <div className={cn('h-1 w-1 shrink-0 rounded-full bg-gradient-to-r', gradient)} />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-2 flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400 sm:mt-3">
            <span>{continueLabel}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-3.5 sm:w-3.5" />
          </div>
        </div>
      </div>
    </button>
  );
}
