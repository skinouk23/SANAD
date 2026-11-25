import { useState } from 'react';
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  HelpCircle,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/language-context';

const contactIconGradients = [
  'from-cyan-500 to-blue-500',
  'from-green-500 to-emerald-500',
  'from-purple-500 to-pink-500',
] as const;

export function HelpPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const faqCategories = [
    {
      title: t.help.booking,
      icon: '📅',
      questions: [
        {
          q: 'Comment réserver un service ?',
          a: 'Sélectionnez le service souhaité, choisissez un professionnel, puis confirmez votre réservation. Le paiement se fait en ligne de manière sécurisée.',
        },
        {
          q: 'Puis-je annuler ma réservation ?',
          a: "Oui, vous pouvez annuler gratuitement jusqu'à 24h avant le rendez-vous. Au-delà, des frais peuvent s'appliquer.",
        },
        {
          q: 'Comment modifier un rendez-vous ?',
          a: 'Accédez à "Mon Espace", sélectionnez le rendez-vous et cliquez sur "Modifier". Vous pourrez changer la date ou l\'heure selon les disponibilités.',
        },
      ],
    },
    {
      title: t.help.payment,
      icon: '💳',
      questions: [
        {
          q: 'Quels moyens de paiement acceptez-vous ?',
          a: 'Nous acceptons les cartes bancaires, le mobile money et le paiement en espèces à la livraison pour certains services.',
        },
        {
          q: 'Le paiement est-il sécurisé ?',
          a: 'Oui, toutes les transactions sont cryptées et sécurisées. Nous ne stockons jamais vos informations bancaires.',
        },
        {
          q: 'Comment fonctionne le remboursement ?',
          a: "En cas d'annulation valide, le remboursement est effectué sous 5-7 jours ouvrés sur votre moyen de paiement initial.",
        },
      ],
    },
    {
      title: t.help.servicesCategory,
      icon: '🏥',
      questions: [
        {
          q: 'Quels types de soins proposez-vous ?',
          a: 'Nous proposons des soins infirmiers, kinésithérapie, aide aux seniors, soins maternité, consultations médicales et bien plus.',
        },
        {
          q: 'Les professionnels sont-ils qualifiés ?',
          a: 'Oui, tous nos professionnels sont diplômés, vérifiés et assurés. Nous vérifions leurs qualifications avant leur inscription.',
        },
        {
          q: 'Puis-je choisir mon professionnel ?',
          a: 'Oui, vous pouvez consulter les profils, avis et disponibilités avant de faire votre choix.',
        },
      ],
    },
    {
      title: t.help.account,
      icon: '👤',
      questions: [
        {
          q: 'Comment créer un compte ?',
          a: 'Cliquez sur "S\'inscrire", remplissez vos informations et validez votre email. C\'est gratuit et rapide.',
        },
        {
          q: "J'ai oublié mon mot de passe",
          a: 'Cliquez sur "Mot de passe oublié" sur la page de connexion. Vous recevrez un lien de réinitialisation par email.',
        },
        {
          q: 'Comment modifier mes informations ?',
          a: 'Accédez à votre profil via l\'icône en haut à droite, puis cliquez sur "Modifier le profil".',
        },
      ],
    },
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: t.help.liveChat,
      desc: t.help.immediateResponse,
      action: t.help.startChat,
    },
    {
      icon: Phone,
      title: t.help.phone,
      desc: '+216 XX XXX XXX',
      action: t.help.callNow,
    },
    {
      icon: Mail,
      title: t.help.emailContact,
      desc: 'support@sanad.tn',
      action: t.help.sendEmail,
    },
  ];

  const filteredFaqs = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          searchQuery === '' ||
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0);
  return (
    <div className="min-h-screen text-slate-900 dark:text-white">
      <div className="relative z-10">
        <div className="border-b border-slate-200 bg-white/80 px-6 pt-4 pb-6 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-[18px] p-[2px] shadow-xl shadow-cyan-500/10">
              <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />
              <div className="relative rounded-[16px] bg-white/95 p-5 text-center backdrop-blur-xl dark:bg-slate-900/95">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
                  {t.help.title}
                </p>
                <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {t.help.subtitle}
                </h1>
                <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                  {t.help.findAnswers}
                </p>
                <div className="relative max-w-xl mx-auto">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.help.searchPlaceholder}
                    className="w-full rounded-lg border border-slate-200 bg-white/90 py-2.5 pr-4 pl-9 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700/50 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-6 pb-12">
          {/* Contact */}
          <div className="mb-6">
            <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">
              {t.help.contactUs}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {contactOptions.map((option, i) => {
                const iconGradient = contactIconGradients[i] ?? 'from-cyan-500 to-blue-500';

                return (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:shadow-md hover:shadow-cyan-500/10 dark:border-slate-700/50 dark:bg-slate-800/50 dark:shadow-none"
                  >
                    <div
                      className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${iconGradient}`}
                    >
                      <option.icon className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="mb-0.5 text-xs font-bold text-slate-900 dark:text-white">
                      {option.title}
                    </h3>
                    <p className="mb-2 text-[10px] text-slate-600 dark:text-slate-400">
                      {option.desc}
                    </p>
                    <button className="w-full rounded-lg border border-slate-200 bg-slate-100/80 px-2.5 py-1.5 text-[10px] font-medium text-slate-900 transition-colors hover:border-cyan-500/50 hover:bg-cyan-50 hover:text-cyan-700 dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-white dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300">
                      {option.action}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">{t.help.faq}</h2>
            <div className="space-y-3">
              {filteredFaqs.map((category, catIndex) => (
                <div
                  key={catIndex}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 dark:shadow-none"
                >
                  <div className="border-b border-slate-200 bg-slate-100/70 p-3 dark:border-slate-700/50 dark:bg-slate-900/40">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-sm shadow-sm shadow-cyan-500/10">
                        {category.icon}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {category.title}
                      </h3>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
                    {category.questions.map((faq, faqIndex) => {
                      const globalIndex = catIndex * 100 + faqIndex;
                      const isExpanded = expandedFaq === globalIndex;
                      return (
                        <div key={faqIndex}>
                          <button
                            onClick={() => setExpandedFaq(isExpanded ? null : globalIndex)}
                            className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors hover:bg-cyan-500/10"
                          >
                            <div className="flex items-start gap-2 flex-1 min-w-0">
                              <HelpCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-cyan-500 dark:text-cyan-400" />

                              <span className="text-xs font-medium text-slate-900 dark:text-white">
                                {faq.q}
                              </span>
                            </div>
                            {isExpanded ? (
                              <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-slate-500 dark:text-slate-400" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-slate-500 dark:text-slate-400" />
                            )}
                          </button>
                          {isExpanded && (
                            <div className="px-3 pb-2 pl-8">
                              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                {faq.a}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {filteredFaqs.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-white/80 py-6 text-center shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 dark:shadow-none">
                <FileText className="mx-auto mb-2 h-10 w-10 text-cyan-500 dark:text-cyan-400" />

                <h3 className="mb-1 text-base font-bold text-slate-900 dark:text-white">
                  {t.help.noResultsFound}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {t.help.tryOtherKeywords}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
