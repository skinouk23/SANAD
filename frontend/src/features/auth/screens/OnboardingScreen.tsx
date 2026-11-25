import { useMemo } from 'react';
import { Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { AuthShell } from '@/features/auth';
import { SanadBrandBadge } from '@/features/auth/components/SanadBrandBadge';
import { getOnboardingOptions } from '@/features/auth/config/authCatalog';
import { AuthOnboardingCard } from './onboarding/AuthOnboardingCard';

export function OnboardingScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const onboardingOptions = useMemo(() => getOnboardingOptions(t), [t]);

  return (
    <AuthShell className="max-w-md sm:max-w-2xl lg:max-w-4xl">
      <div className="py-2 sm:py-4">
        <div className="mb-4 text-center sm:mb-5">
          <SanadBrandBadge label={t.common.brandName || 'Sanad'} />

          <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
            {t.onboarding.welcomeToSanad}
          </p>
          <h1 className="mb-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            {t.onboarding.chooseProfile}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.onboarding.selectAccountType}
          </p>
        </div>

        <div className="relative mb-4 overflow-hidden rounded-2xl p-px shadow-xl shadow-cyan-950/10 dark:shadow-cyan-950/30 sm:mb-5 sm:rounded-[20px] sm:p-[2px] sm:shadow-2xl">
          <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />

          <div className="relative rounded-[15px] bg-white/95 p-3 shadow-inner shadow-white/20 backdrop-blur-xl dark:bg-slate-900/95 dark:shadow-black/20 sm:rounded-[18px] sm:p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {onboardingOptions.map((option) => (
                <AuthOnboardingCard
                  continueLabel={t.onboarding.continue}
                  key={option.id}
                  onSelect={() => navigate(option.signUpPath)}
                  option={option}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-3 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.onboarding.alreadyHaveAccount}{' '}
            <button
              className="inline-flex min-h-11 items-center px-1 font-semibold text-cyan-600 underline underline-offset-2 transition-colors duration-200 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 sm:min-h-0 sm:px-0"
              onClick={() => navigate('/auth/login')}
              type="button"
            >
              {t.onboarding.signIn}
            </button>
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 text-center text-xs text-slate-400 dark:text-slate-500 sm:flex-row sm:gap-4">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>{t.onboarding.securePlatform}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>{t.onboarding.quickRegistration}</span>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
