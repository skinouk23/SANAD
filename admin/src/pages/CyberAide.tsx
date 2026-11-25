import React, { useState } from 'react';
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  HelpCircle,
  ChevronRight,
  ChevronDown } from
'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
export function CyberAide() {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const faqCategories = [
  {
    title: t.help.booking,
    icon: '📅',
    gradient: 'from-cyan-500 to-blue-500',
    questions: [
    {
      q: 'Comment réserver un service ?',
      a: 'Sélectionnez le service souhaité, choisissez un professionnel, puis confirmez votre réservation. Le paiement se fait en ligne de manière sécurisée.'
    },
    {
      q: 'Puis-je annuler ma réservation ?',
      a: "Oui, vous pouvez annuler gratuitement jusqu'à 24h avant le rendez-vous. Au-delà, des frais peuvent s'appliquer."
    },
    {
      q: 'Comment modifier un rendez-vous ?',
      a: 'Accédez à "Mon Espace", sélectionnez le rendez-vous et cliquez sur "Modifier". Vous pourrez changer la date ou l\'heure selon les disponibilités.'
    }]

  },
  {
    title: t.help.payment,
    icon: '💳',
    gradient: 'from-green-500 to-emerald-500',
    questions: [
    {
      q: 'Quels moyens de paiement acceptez-vous ?',
      a: 'Nous acceptons les cartes bancaires, le mobile money et le paiement en espèces à la livraison pour certains services.'
    },
    {
      q: 'Le paiement est-il sécurisé ?',
      a: 'Oui, toutes les transactions sont cryptées et sécurisées. Nous ne stockons jamais vos informations bancaires.'
    },
    {
      q: 'Comment fonctionne le remboursement ?',
      a: "En cas d'annulation valide, le remboursement est effectué sous 5-7 jours ouvrés sur votre moyen de paiement initial."
    }]

  },
  {
    title: t.help.servicesCategory,
    icon: '🏥',
    gradient: 'from-purple-500 to-pink-500',
    questions: [
    {
      q: 'Quels types de soins proposez-vous ?',
      a: 'Nous proposons des soins infirmiers, kinésithérapie, aide aux seniors, soins maternité, consultations médicales et bien plus.'
    },
    {
      q: 'Les professionnels sont-ils qualifiés ?',
      a: 'Oui, tous nos professionnels sont diplômés, vérifiés et assurés. Nous vérifions leurs qualifications avant leur inscription.'
    },
    {
      q: 'Puis-je choisir mon professionnel ?',
      a: 'Oui, vous pouvez consulter les profils, avis et disponibilités avant de faire votre choix.'
    }]

  },
  {
    title: t.help.account,
    icon: '👤',
    gradient: 'from-amber-500 to-orange-500',
    questions: [
    {
      q: 'Comment créer un compte ?',
      a: 'Cliquez sur "S\'inscrire", remplissez vos informations et validez votre email. C\'est gratuit et rapide.'
    },
    {
      q: "J'ai oublié mon mot de passe",
      a: 'Cliquez sur "Mot de passe oublié" sur la page de connexion. Vous recevrez un lien de réinitialisation par email.'
    },
    {
      q: 'Comment modifier mes informations ?',
      a: 'Accédez à votre profil via l\'icône en haut à droite, puis cliquez sur "Modifier le profil".'
    }]

  }];

  const contactOptions = [
  {
    icon: MessageCircle,
    title: t.help.liveChat,
    desc: t.help.immediateResponse,
    action: t.help.startChat,
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    icon: Phone,
    title: t.help.phone,
    desc: '+216 XX XXX XXX',
    action: t.help.callNow,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Mail,
    title: t.help.emailContact,
    desc: 'support@sanad.tn',
    action: t.help.sendEmail,
    gradient: 'from-purple-500 to-pink-500'
  }];

  const filteredFaqs = faqCategories.
  map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
      searchQuery === '' ||
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).
  filter((category) => category.questions.length > 0);
  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* WOW Header */}
        <div
          className={`backdrop-blur-sm border-b pt-4 pb-6 px-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-[18px] p-[2px] overflow-hidden shadow-lg">
              <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />
              <div
                className={`relative rounded-[16px] p-5 text-center backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
                
                <p
                  className={`text-xs font-medium tracking-wide uppercase mb-1 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  
                  {t.help.title}
                </p>
                <h1
                  className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  {t.help.subtitle}
                </h1>
                <p
                  className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  
                  {t.help.findAnswers}
                </p>
                <div className="relative max-w-xl mx-auto">
                  <Search
                    className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.help.searchPlaceholder}
                    className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm'}`} />
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-6 pb-12">
          {/* Contact */}
          <div className="mb-6">
            <h2
              className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              {t.help.contactUs}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {contactOptions.map((option, i) =>
              <div
                key={i}
                className={`backdrop-blur-sm border rounded-xl p-3 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50' : 'bg-white/80 border-slate-200 hover:border-cyan-500/50 shadow-sm'}`}>
                
                  <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${option.gradient} flex items-center justify-center mb-2`}>
                  
                    <option.icon className="h-4 w-4 text-white" />
                  </div>
                  <h3
                  className={`font-bold text-xs mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {option.title}
                  </h3>
                  <p
                  className={`text-[10px] mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  
                    {option.desc}
                  </p>
                  <button
                  className={`w-full px-2.5 py-1.5 border rounded-lg text-[10px] font-medium transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}`}>
                  
                    {option.action}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2
              className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              {t.help.faq}
            </h2>
            <div className="space-y-3">
              {filteredFaqs.map((category, catIndex) =>
              <div
                key={catIndex}
                className={`backdrop-blur-sm border rounded-xl overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                  <div
                  className={`p-3 border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                  
                    <div className="flex items-center gap-2">
                      <div
                      className={`w-7 h-7 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center text-sm`}>
                      
                        {category.icon}
                      </div>
                      <h3
                      className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        {category.title}
                      </h3>
                    </div>
                  </div>
                  <div
                  className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-slate-200'}`}>
                  
                    {category.questions.map((faq, faqIndex) => {
                    const globalIndex = catIndex * 100 + faqIndex;
                    const isExpanded = expandedFaq === globalIndex;
                    return (
                      <div key={faqIndex}>
                          <button
                          onClick={() =>
                          setExpandedFaq(isExpanded ? null : globalIndex)
                          }
                          className={`w-full px-3 py-2 text-left transition-colors flex items-center justify-between gap-3 ${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`}>
                          
                            <div className="flex items-start gap-2 flex-1 min-w-0">
                              <HelpCircle
                              className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                            
                              <span
                              className={`font-medium text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              
                                {faq.q}
                              </span>
                            </div>
                            {isExpanded ?
                          <ChevronDown
                            className={`h-3.5 w-3.5 flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} /> :


                          <ChevronRight
                            className={`h-3.5 w-3.5 flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />

                          }
                          </button>
                          {isExpanded &&
                        <div className="px-3 pb-2 pl-8">
                              <p
                            className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            
                                {faq.a}
                              </p>
                            </div>
                        }
                        </div>);

                  })}
                  </div>
                </div>
              )}
            </div>
            {filteredFaqs.length === 0 &&
            <div className="text-center py-6">
                <FileText
                className={`h-10 w-10 mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              
                <h3
                className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  {t.help.noResultsFound}
                </h3>
                <p
                className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                  {t.help.tryOtherKeywords}
                </p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

}