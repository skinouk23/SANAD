import { useNavigate } from 'react-router-dom';
import {
  Search,
  Calendar,
  CreditCard,
  CheckCircle,
  Shield,
  Clock,
  TrendingUp,
  Users,
  ArrowDown,
  Wallet,
  Zap,
  Crown,
  Star,
  Percent,
} from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/language-context';

export function HowItWorksPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* Hero */}
        <section className="pt-10 pb-8 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
              {t.nav.howItWorks}
            </p>
            <h1 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
              {t.howItWorks.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">{t.howItWorks.subtitle}</p>
          </div>
        </section>

        {/* Patient Flow */}
        <section className="py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
                {t.howItWorks.forPatients}
              </p>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t.howItWorks.simpleSteps}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
              <div className="absolute top-8 left-1/8 right-1/8 hidden h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-30 md:block" />

              {[
                {
                  step: 1,
                  icon: Search,
                  title: t.howItWorks.step1,
                  desc: t.howItWorks.step1Desc,
                  gradient: 'from-cyan-500 to-blue-500',
                },
                {
                  step: 2,
                  icon: Users,
                  title: t.howItWorks.step2,
                  desc: t.howItWorks.step2Desc,
                  gradient: 'from-blue-500 to-purple-500',
                },
                {
                  step: 3,
                  icon: CreditCard,
                  title: t.howItWorks.step3,
                  desc: t.howItWorks.step3Desc,
                  gradient: 'from-purple-500 to-pink-500',
                },
                {
                  step: 4,
                  icon: CheckCircle,
                  title: t.howItWorks.step4,
                  desc: t.howItWorks.step4Desc,
                  gradient: 'from-pink-500 to-rose-500',
                },
              ].map((item) => (
                <div key={item.step} className="relative z-10">
                  <div className="h-full rounded-xl border border-slate-200 bg-white/80 p-4 text-center shadow-sm backdrop-blur-sm transition-all hover:border-cyan-500/50 dark:border-slate-700/50 dark:bg-slate-800/50 dark:shadow-none">
                    <div className="relative mb-4">
                      <div
                        className={`relative mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${item.gradient}`}
                      >
                        <item.icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-xs font-bold text-white shadow-md">
                      {item.step}
                    </div>
                    <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Payment Flow */}
        <section className="py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
                {t.howItWorks.securePayment}
              </p>
              <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
                {t.howItWorks.howPaymentWorks}
              </h2>
              <p className="mx-auto max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                Découvrez nos 3 formules d'abonnement adaptées à chaque professionnel
              </p>
            </div>

            {/* Subscription Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
              {/* Commission Plan */}
              <div className="relative rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all hover:border-slate-400/50 dark:border-slate-700/50 dark:bg-slate-800/50 dark:shadow-none dark:hover:border-slate-500/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-slate-500 to-slate-600">
                    <Percent className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Plan Commission
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Idéal pour débuter
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    15%
                    <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">
                      par prestation
                    </span>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {[
                    "Aucun frais d'inscription",
                    'Paiement uniquement si prestation',
                    'Accès à tous les patients',
                    'Support standard',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 text-slate-500 dark:text-slate-400" />

                      <span className="text-xs text-slate-600 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto rounded-lg bg-slate-50 p-3 dark:bg-slate-900/50">
                  <div className="mb-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Exemple: Prestation de 100 TND
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600 dark:text-slate-300">
                      Vous recevez:
                    </span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      85 TND
                    </span>
                  </div>
                </div>
              </div>

              {/* Standard Plan */}
              <div className="relative rounded-xl border border-blue-300 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all hover:border-blue-400 dark:border-blue-500/50 dark:bg-slate-800/50 dark:shadow-none dark:hover:border-blue-400/70">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
                  Populaire
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Plan Standard
                    </h3>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400">Pour les actifs</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    30 TND
                    <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">
                      / mois
                    </span>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {[
                    '0% de commission',
                    'Gardez 100% de vos revenus',
                    'Visibilité prioritaire',
                    'Support prioritaire',
                    'Statistiques avancées',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 text-blue-500 dark:text-blue-400" />

                      <span className="text-xs text-slate-600 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-blue-500/20 dark:bg-blue-500/10">
                  <div className="mb-1 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                    Exemple: Prestation de 100 TND
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600 dark:text-slate-300">
                      Vous recevez:
                    </span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      100 TND
                    </span>
                  </div>
                </div>
              </div>

              {/* Elite Plan */}
              <div className="relative overflow-hidden rounded-xl border border-amber-300 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm backdrop-blur-sm transition-all hover:border-amber-400 dark:border-amber-500/50 dark:bg-gradient-to-br dark:from-amber-900/30 dark:to-slate-800/50 dark:shadow-none dark:hover:border-amber-400/70">
                <div className="absolute right-0 top-0 h-24 w-24 -translate-y-1/2 translate-x-1/2 rounded-full bg-gradient-to-br from-amber-500/20 to-transparent blur-xl" />

                <div className="flex items-center gap-2 mb-3 relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
                    <Crown className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Plan Elite</h3>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400">Premium VIP</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    100 TND
                    <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">
                      / mois
                    </span>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {[
                    '0% de commission',
                    'Badge VIP vérifié',
                    'En tête des résultats',
                    'Support dédié 24/7',
                    'Outils marketing inclus',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 text-amber-500 dark:text-amber-400" />

                      <span className="text-xs text-slate-600 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto rounded-lg border border-amber-100 bg-amber-50 p-3 dark:border-amber-500/20 dark:bg-amber-500/10">
                  <div className="mb-1 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                    Exemple: Prestation de 100 TND
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600 dark:text-slate-300">
                      Vous recevez:
                    </span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      100 TND
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Payment Flow - Commission Example */}
              <div className="rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 dark:shadow-none">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <Wallet className="h-4 w-4 flex-shrink-0 text-cyan-600 dark:text-cyan-400" />

                  <span>{t.howItWorks.paymentFlow}</span>
                  <span className="ml-auto rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[9px] font-semibold text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-400">
                    Flux commission
                  </span>
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-xs font-bold text-white">
                      1
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {t.howItWorks.youPaySanad}
                      </div>
                      <div className="mb-1 text-[10px] text-slate-600 dark:text-slate-400">
                        {t.howItWorks.securePaymentMethod}
                      </div>
                      <div className="inline-block rounded bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-cyan-700 dark:bg-slate-700 dark:text-cyan-400">
                        100 TND
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <ArrowDown className="h-4 w-4 text-slate-400 dark:text-slate-600" />
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-bold text-white">
                      2
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {t.howItWorks.sanadCommission}
                      </div>
                      <div className="mb-1 text-[10px] text-slate-600 dark:text-slate-400">
                        {t.howItWorks.qualityGuarantee}
                      </div>
                      <div className="inline-block rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-slate-700 dark:text-blue-400">
                        15 TND (15%)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <ArrowDown className="h-4 w-4 text-slate-400 dark:text-slate-600" />
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-xs font-bold text-white">
                      3
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {t.howItWorks.professionalReceives}
                      </div>
                      <div className="mb-1 text-[10px] text-slate-600 dark:text-slate-400">
                        {t.howItWorks.autoTransfer}
                      </div>
                      <div className="inline-block rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 dark:bg-slate-700 dark:text-green-400">
                        85 TND
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                {[
                  {
                    icon: Shield,
                    title: t.howItWorks.guaranteedProtection,
                    desc: t.howItWorks.refundIfProblem,
                    gradient: 'from-cyan-500 to-blue-500',
                  },
                  {
                    icon: CheckCircle,
                    title: t.howItWorks.verifiedQuality,
                    desc: t.howItWorks.verifiedProfessionals,
                    gradient: 'from-blue-500 to-purple-500',
                  },
                  {
                    icon: Clock,
                    title: t.howItWorks.support247,
                    desc: t.howItWorks.teamAvailable,
                    gradient: 'from-purple-500 to-pink-500',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all hover:border-cyan-500/50 dark:border-slate-700/50 dark:bg-slate-800/50 dark:shadow-none"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.gradient}`}
                      >
                        <item.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Provider Flow */}
        <section className="py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
                {t.howItWorks.forProfessionals}
              </p>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t.howItWorks.joinNetwork}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  icon: Users,
                  title: t.howItWorks.signUp,
                  desc: t.howItWorks.createProfile,
                  gradient: 'from-cyan-500 to-blue-500',
                },
                {
                  icon: Calendar,
                  title: t.howItWorks.manageSchedule,
                  desc: t.howItWorks.setAvailability,
                  gradient: 'from-blue-500 to-purple-500',
                },
                {
                  icon: TrendingUp,
                  title: t.howItWorks.receivePayments,
                  desc: t.howItWorks.autoPayments,
                  gradient: 'from-purple-500 to-pink-500',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-white/80 p-4 text-center shadow-sm backdrop-blur-sm transition-all hover:border-cyan-500/50 dark:border-slate-700/50 dark:bg-slate-800/50 dark:shadow-none"
                >
                  <div
                    className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${item.gradient}`}
                  >
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-8 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="relative overflow-hidden rounded-[20px] p-[2px] shadow-xl">
              <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />

              <div className="relative rounded-[18px] bg-white/95 p-8 text-center backdrop-blur-xl dark:bg-slate-900/95">
                <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                  {t.home.readyToStart}
                </h2>
                <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
                  {t.home.heroSubtitle}
                </p>
                <button
                  onClick={() => navigate('/services')}
                  className="group relative inline-block"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
                  <div className="relative flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-sm font-bold text-white transition-transform group-hover:scale-105">
                    {t.howItWorks.findProfessional}
                    <Zap className="h-4 w-4" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
