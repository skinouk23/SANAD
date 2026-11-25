import { useState } from 'react';
import { Check, Crown, Zap, Shield, Star, Sparkles, Activity, Lock, X } from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { ComplianceBadges } from '@/shared/ui/composites/compliance-badges';
export function SubscriptionsPage() {
  const { t } = useLanguage();
  const [userType, setUserType] = useState<'patient' | 'professional'>('patient');
  const patientPlans = [
    {
      id: 'free',
      name: 'Gratuit',
      price: '0',
      period: 'mois',
      description: 'Pour découvrir',
      icon: '🌱',
      gradient: 'from-slate-600 to-slate-700',
      popular: false,
      features: [
        {
          text: '15% commission',
          included: true,
        },
        {
          text: 'Services de base',
          included: true,
        },
        {
          text: 'Support email',
          included: true,
        },
        {
          text: 'Historique 3 mois',
          included: true,
        },
        {
          text: 'Messagerie',
          included: false,
        },
        {
          text: 'Annulation gratuite',
          included: false,
        },
        {
          text: 'Support prioritaire',
          included: false,
        },
      ],
    },
    {
      id: 'plus',
      name: 'Plus',
      price: '30',
      period: 'mois',
      description: 'Le plus populaire',
      icon: '⭐',
      gradient: 'from-cyan-500 to-blue-500',
      popular: true,
      features: [
        {
          text: '5% commission',
          included: true,
          highlight: true,
        },
        {
          text: 'Tous les services',
          included: true,
        },
        {
          text: 'Messagerie illimitée',
          included: true,
        },
        {
          text: 'Annulation 24h',
          included: true,
        },
        {
          text: 'Support prioritaire',
          included: true,
        },
        {
          text: 'Historique complet',
          included: true,
        },
        {
          text: 'Rappels SMS',
          included: true,
        },
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '50',
      period: 'mois',
      description: 'Expérience VIP',
      icon: '💎',
      gradient: 'from-purple-500 to-pink-500',
      popular: false,
      features: [
        {
          text: '0% commission',
          included: true,
          highlight: true,
        },
        {
          text: 'Avantages Plus',
          included: true,
        },
        {
          text: 'Concierge santé',
          included: true,
        },
        {
          text: 'Annulation anytime',
          included: true,
        },
        {
          text: 'Support VIP 24/7',
          included: true,
        },
        {
          text: 'Accès prioritaire',
          included: true,
        },
        {
          text: 'Téléconsultation 5/mois',
          included: true,
        },
        {
          text: 'Cadeaux exclusifs',
          included: true,
        },
      ],
    },
  ];

  const professionalPlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '0',
      period: 'mois',
      description: 'Pour démarrer',
      icon: '🚀',
      gradient: 'from-slate-600 to-slate-700',
      popular: false,
      features: [
        {
          text: '20% commission',
          included: true,
        },
        {
          text: 'Profil basique',
          included: true,
        },
        {
          text: 'Visibilité limitée',
          included: true,
        },
        {
          text: 'Support standard',
          included: true,
        },
        {
          text: 'Gestion planning',
          included: false,
        },
        {
          text: 'Statistiques',
          included: false,
        },
        {
          text: 'Badge vérifié',
          included: false,
        },
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '100',
      period: 'mois',
      description: 'Pour se développer',
      icon: '💼',
      gradient: 'from-blue-500 to-cyan-500',
      popular: true,
      features: [
        {
          text: '10% commission',
          included: true,
          highlight: true,
        },
        {
          text: 'Profil premium',
          included: true,
        },
        {
          text: 'Visibilité prioritaire',
          included: true,
        },
        {
          text: 'Planning avancé',
          included: true,
        },
        {
          text: 'Analytics',
          included: true,
        },
        {
          text: 'Badge vérifié',
          included: true,
        },
        {
          text: 'Support prioritaire',
          included: true,
        },
        {
          text: 'Rappels auto',
          included: true,
        },
      ],
    },
    {
      id: 'elite',
      name: 'Elite',
      price: '200',
      period: 'mois',
      description: 'Pour les leaders',
      icon: '👑',
      gradient: 'from-amber-500 to-orange-500',
      popular: false,
      features: [
        {
          text: '5% commission',
          included: true,
          highlight: true,
        },
        {
          text: 'Avantages Pro',
          included: true,
        },
        {
          text: 'Top position',
          included: true,
        },
        {
          text: 'Badge Elite',
          included: true,
        },
        {
          text: 'Marketing inclus',
          included: true,
        },
        {
          text: 'Assurance RC',
          included: true,
        },
        {
          text: 'Formation continue',
          included: true,
        },
        {
          text: 'Support VIP',
          included: true,
        },
        {
          text: 'Facturation',
          included: true,
        },
      ],
    },
  ];

  const currentPlans = userType === 'patient' ? patientPlans : professionalPlans;
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <p className="text-sm font-medium tracking-widest uppercase mb-4 text-cyan-600 dark:text-cyan-400">
              {t.serviceListing.subsPlansAndPricing}
            </p>
            <h1 className="text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              {t.serviceListing.subsChoosePlan}
            </h1>
            <p className="text-xl mb-6 text-slate-600 dark:text-slate-400">
              {t.serviceListing.subsPlansSubtitle}
            </p>

            <div className="mb-8">
              <ComplianceBadges />
            </div>

            {/* User Type Toggle */}
            <div className="inline-flex rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/50">
              <button
                type="button"
                onClick={() => setUserType('patient')}
                className={`rounded-full px-8 py-3 font-semibold transition-all ${userType === 'patient' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
              >
                👤 {t.auth.patient}
              </button>
              <button
                type="button"
                onClick={() => setUserType('professional')}
                className={`rounded-full px-8 py-3 font-semibold transition-all ${userType === 'professional' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
              >
                💼 {t.auth.professional}
              </button>
            </div>
          </div>
        </div>

        {/* Benefits Banner */}
        <div className="mb-12 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 dark:shadow-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-slate-900 dark:text-white">
                  {t.serviceListing.subsNoCommitment}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t.serviceListing.subsCancelAnytime}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-slate-900 dark:text-white">
                  {t.serviceListing.subsImmediateActivation}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t.serviceListing.subsEnjoyNow}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-slate-900 dark:text-white">
                  {t.serviceListing.subsGuarantee30Days}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t.serviceListing.subsFullRefund}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {currentPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative group ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    POPULAIRE
                  </div>
                </div>
              )}

              <div
                className={`relative h-full rounded-2xl border-2 p-8 backdrop-blur-sm transition-all ${plan.popular ? 'border-cyan-500 shadow-2xl shadow-cyan-500/20' : 'border-slate-200 bg-white/80 shadow-sm hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:shadow-none dark:hover:border-slate-600'} ${plan.popular ? 'bg-white/80 dark:bg-slate-800/50' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10" />
                )}

                <div className="relative">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 transition-transform group-hover:scale-110`}
                  >
                    {plan.icon}
                  </div>

                  <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-sm mb-6 text-slate-600 dark:text-slate-400">
                    {plan.description}
                  </p>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-slate-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">TND</span>
                    </div>
                    <p className="text-sm mt-1 text-slate-500">
                      {t.serviceListing.subsPerPeriod} {plan.period}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${feature.included ? 'bg-cyan-500/20' : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                          {feature.included ? (
                            <Check className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                          ) : (
                            <X className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                          )}
                        </div>
                        <span
                          className={`text-sm ${feature.included ? (feature.highlight ? 'font-bold text-cyan-600 dark:text-cyan-400' : 'text-slate-900 dark:text-white') : 'text-slate-400 dark:text-slate-500'}`}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className={`relative w-full overflow-hidden group/btn ${plan.popular ? '' : 'opacity-90 hover:opacity-100'}`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} opacity-0 blur-xl transition-opacity group-hover/btn:opacity-100`}
                    />
                    <span
                      className={`relative flex w-full items-center justify-center gap-2 rounded-lg py-3 font-bold transition-transform group-hover/btn:scale-[1.02] ${plan.popular ? `bg-gradient-to-r ${plan.gradient} text-white` : 'bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600'}`}
                    >
                      {plan.id === 'free' || plan.id === 'starter' ? (
                        <>
                          <Zap className="h-4 w-4" />
                          {t.serviceListing.subsGetStarted}
                        </>
                      ) : (
                        <>
                          <Crown className="h-4 w-4" />
                          {t.serviceListing.subsChoose} {plan.name}
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center text-slate-900 dark:text-white">
            Questions Fréquentes
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Puis-je changer de plan ?',
                a: 'Oui, vous pouvez changer de plan à tout moment. Les changements prennent effet immédiatement.',
              },
              {
                q: 'Comment fonctionne la commission ?',
                a: 'La commission est automatiquement déduite lors de chaque réservation selon votre plan.',
              },
              {
                q: 'Y a-t-il un engagement ?',
                a: 'Non, tous nos plans sont sans engagement. Annulez quand vous voulez.',
              },
              {
                q: "Que se passe-t-il si j'annule ?",
                a: "Vous conservez vos avantages jusqu'à la fin de la période payée.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all hover:border-cyan-500/50 dark:border-slate-700 dark:bg-slate-800/50 dark:shadow-none dark:hover:border-cyan-500/50"
              >
                <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">{faq.q}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10" />
          <div className="relative rounded-2xl border border-slate-200 bg-white/80 p-12 text-center shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/50 dark:shadow-none">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-cyan-600 dark:text-cyan-400" />

            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
              {t.serviceListing.subsNeedCustomPlan}
            </h2>
            <p className="mb-6 max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
              {t.serviceListing.subsCustomPlanDesc}
            </p>
            <button type="button" className="relative overflow-hidden group/cta">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 blur-xl transition-opacity group-hover/cta:opacity-100" />
              <span className="relative flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-3 font-bold text-white transition-transform group-hover/cta:scale-105">
                <Activity className="h-5 w-5" />
                {t.serviceListing.subsContactUs}
              </span>
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />

            <span>{t.serviceListing.subsSecurePayment}</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />

            <span>SSL 256-bit</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />

            <span>{t.serviceListing.subsGuarantee30Days}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
