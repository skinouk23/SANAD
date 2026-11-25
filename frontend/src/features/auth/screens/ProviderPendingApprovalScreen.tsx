import { CheckCircle2, Clock3, FileCheck2, LogIn, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthPanel, AuthShell } from '@/features/auth/components/AuthShell';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { Button } from '@/shared/ui/primitives/button';

export function ProviderPendingApprovalScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <AuthShell className="max-w-xl px-4">
      <div className="pb-4 sm:py-4">
        <AuthPanel>
          <div className="text-center">
            <div className="relative mx-auto mb-4 h-16 w-16">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 opacity-40 blur-md" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/25">
                <Clock3 className="h-7 w-7" />
              </div>
            </div>

            <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
              {t.signup.providerPendingEyebrow}
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t.signup.providerPendingTitle}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {t.signup.providerPendingBody}
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-50/80 p-4 text-sm text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-950/25 dark:text-emerald-200">
              <FileCheck2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <p>{t.signup.providerPendingDocuments}</p>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-cyan-400/25 bg-cyan-50/80 p-4 text-sm text-cyan-800 dark:border-cyan-400/20 dark:bg-cyan-950/25 dark:text-cyan-200">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <p>{t.signup.providerPendingAdminReview}</p>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-amber-400/25 bg-amber-50/80 p-4 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-950/25 dark:text-amber-200">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <p>{t.signup.providerPendingLoginNotice}</p>
            </div>
          </div>

          <Button
            className="mt-6 w-full border-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-none transition-all hover:brightness-100 hover:shadow-[0_0_22px_rgba(6,182,212,0.45)]"
            onClick={() => navigate('/auth/login?type=professional')}
            type="button"
          >
            <LogIn data-icon="inline-start" />
            {t.signup.providerPendingLoginButton}
          </Button>
        </AuthPanel>
      </div>
    </AuthShell>
  );
}
