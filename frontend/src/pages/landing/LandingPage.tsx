import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Baby,
  Clock,
  Heart,
  Shield,
  Star,
  Stethoscope,
  Users,
  Zap,
} from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { ComplianceBadges } from '@/shared/ui/composites/compliance-badges';

export function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-10 pb-14 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto mb-8">
              {/* WOW EFFECT: Animated Gradient Border Wrapper for Hero */}
              <div className="relative mb-6 overflow-hidden rounded-[24px] p-[2px] shadow-2xl">
                <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />

                <div className="relative rounded-[22px] bg-white/95 p-8 backdrop-blur-xl dark:bg-slate-900/95 md:p-12">
                  {/* Badge */}
                  <div className="mb-6 inline-flex animate-fade-in-up items-center rounded-full border border-cyan-500/40 bg-slate-50/80 px-3 py-1.5 shadow-sm backdrop-blur-sm dark:border-cyan-500/30 dark:bg-slate-800/50 dark:shadow-none">
                    <Star className="mr-1.5 h-3.5 w-3.5 fill-cyan-500 text-cyan-500" />
                    <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">
                      {t.home.trustBadge}
                    </span>
                  </div>

                  {/* Main Title */}
                  <h1 className="mb-4 text-3xl font-bold leading-tight text-slate-900 dark:text-white md:text-4xl">
                    {t.home.heroTitle1}
                    <br />
                    <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                      {t.home.heroTitle2}
                    </span>
                  </h1>

                  <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {t.home.heroSubtitle}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link to="/services" className="group w-full sm:w-auto">
                      <div className="relative overflow-hidden rounded-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
                        <div className="relative flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-sm font-bold text-white transition-transform group-hover:scale-105">
                          {t.home.findCaregiver}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                    <Link
                      to="/how-it-works"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/80 px-6 py-3 text-center text-sm font-bold text-slate-900 shadow-sm backdrop-blur-sm transition-all hover:border-cyan-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:shadow-none sm:w-auto"
                    >
                      {t.home.howItWorksBtn}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Compliance Badges */}
              <div className="mb-6 scale-90 origin-top">
                <ComplianceBadges />
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-5xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: t.home.verified,
                  desc: t.home.verifiedDesc,
                  gradient: 'from-green-500 to-emerald-500',
                },
                {
                  icon: Clock,
                  title: t.home.available247,
                  desc: t.home.available247Desc,
                  gradient: 'from-blue-500 to-cyan-500',
                },
                {
                  icon: Users,
                  title: t.home.personalizedCare,
                  desc: t.home.personalizedCareDesc,
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
                      <h3 className="mb-0.5 text-sm font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
                {t.home.ourServices}
              </p>
              <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
                {t.home.careServices}
              </h2>
              <p className="mx-auto max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                {t.home.careServicesDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  title: t.home.nursingCare,
                  desc: t.home.nursingCareDesc,
                  price: '40 TND',
                  icon: Stethoscope,
                  gradient: 'from-cyan-500 to-blue-500',
                },
                {
                  title: t.home.seniorAssistance,
                  desc: t.home.seniorAssistanceDesc,
                  price: '30 TND',
                  icon: Heart,
                  gradient: 'from-rose-500 to-pink-500',
                },
                {
                  title: t.home.maternity,
                  desc: t.home.maternityDesc,
                  price: '50 TND',
                  icon: Baby,
                  gradient: 'from-amber-500 to-orange-500',
                },
                {
                  title: t.home.physiotherapy,
                  desc: t.home.physiotherapyDesc,
                  price: '60 TND',
                  icon: Activity,
                  gradient: 'from-blue-500 to-purple-500',
                },
              ].map((service, i) => (
                <div key={i} className="group relative cursor-pointer overflow-hidden rounded-xl">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 transition-opacity group-hover:opacity-10`}
                  />
                  <div className="relative h-full rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all group-hover:border-cyan-500/50 dark:border-slate-700 dark:bg-slate-800/50 dark:shadow-none">
                    <div
                      className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${service.gradient}`}
                    >
                      <service.icon className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
                      {service.desc}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                        {service.price}
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-cyan-600 dark:text-slate-500 dark:group-hover:text-cyan-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                to="/services"
                className="inline-block rounded-lg border border-slate-200 bg-white/80 px-6 py-2.5 text-sm font-medium text-slate-900 shadow-sm backdrop-blur-sm transition-all hover:border-cyan-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:shadow-none"
              >
                {t.home.viewAllServices}
              </Link>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
                {t.home.process}
              </p>
              <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
                {t.home.howItWorksTitle}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t.home.howItWorksSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              {/* Connector Line */}
              <div className="absolute top-6 left-1/6 right-1/6 hidden h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-30 md:block" />

              {[
                {
                  step: 1,
                  title: t.home.step1Title,
                  desc: t.home.step1Desc,
                  gradient: 'from-cyan-500 to-blue-500',
                },
                {
                  step: 2,
                  title: t.home.step2Title,
                  desc: t.home.step2Desc,
                  gradient: 'from-blue-500 to-purple-500',
                },
                {
                  step: 3,
                  title: t.home.step3Title,
                  desc: t.home.step3Desc,
                  gradient: 'from-purple-500 to-pink-500',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex flex-col items-center text-center relative z-10"
                >
                  <div className="relative mb-3">
                    <div
                      className={`absolute inset-0 animate-pulse bg-gradient-to-br ${item.gradient} opacity-50 blur-md`}
                    />
                    <div
                      className={`relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${item.gradient} text-lg font-bold text-white`}
                    >
                      {item.step}
                    </div>
                  </div>
                  <h3 className="mb-1.5 text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-xl border border-slate-200 bg-white/60 p-5 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/30 dark:shadow-none md:p-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    value: '15k+',
                    label: t.home.careCompleted,
                    gradient: 'from-cyan-500 to-blue-500',
                  },
                  {
                    value: '98%',
                    label: t.home.satisfaction,
                    gradient: 'from-green-500 to-emerald-500',
                  },
                  {
                    value: '500+',
                    label: t.home.caregivers,
                    gradient: 'from-purple-500 to-pink-500',
                  },
                  {
                    value: '24/7',
                    label: t.home.support,
                    gradient: 'from-amber-500 to-orange-500',
                  },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div
                      className={`mb-1 bg-gradient-to-r ${stat.gradient} bg-clip-text text-2xl font-bold text-transparent md:text-3xl`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-[10px] font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400 md:text-xs">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative overflow-hidden rounded-[20px] p-[2px] shadow-xl">
              <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />

              <div className="relative rounded-[18px] bg-white/95 p-8 backdrop-blur-xl dark:bg-slate-900/95">
                <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                  {t.home.readyToStart}
                </h2>
                <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
                  {t.home.joinFamilies}
                </p>
                <Link to="/auth/onboarding" className="group relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
                  <div className="relative flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-sm font-bold text-white transition-transform group-hover:scale-105">
                    {t.auth.createAccount}
                    <Zap className="h-4 w-4" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
