import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Crown,
  Zap,
  Shield,
  Star,
  TrendingUp,
  Sparkles,
  Activity,
  Lock,
  X } from
'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { ComplianceBadges } from '../components/ComplianceBadges';
export function CyberSubscriptions() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [userType, setUserType] = useState<'patient' | 'professional'>(
    'patient'
  );
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
      included: true
    },
    {
      text: 'Services de base',
      included: true
    },
    {
      text: 'Support email',
      included: true
    },
    {
      text: 'Historique 3 mois',
      included: true
    },
    {
      text: 'Messagerie',
      included: false
    },
    {
      text: 'Annulation gratuite',
      included: false
    },
    {
      text: 'Support prioritaire',
      included: false
    }]

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
      highlight: true
    },
    {
      text: 'Tous les services',
      included: true
    },
    {
      text: 'Messagerie illimitée',
      included: true
    },
    {
      text: 'Annulation 24h',
      included: true
    },
    {
      text: 'Support prioritaire',
      included: true
    },
    {
      text: 'Historique complet',
      included: true
    },
    {
      text: 'Rappels SMS',
      included: true
    }]

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
      highlight: true
    },
    {
      text: 'Avantages Plus',
      included: true
    },
    {
      text: 'Concierge santé',
      included: true
    },
    {
      text: 'Annulation anytime',
      included: true
    },
    {
      text: 'Support VIP 24/7',
      included: true
    },
    {
      text: 'Accès prioritaire',
      included: true
    },
    {
      text: 'Téléconsultation 5/mois',
      included: true
    },
    {
      text: 'Cadeaux exclusifs',
      included: true
    }]

  }];

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
      included: true
    },
    {
      text: 'Profil basique',
      included: true
    },
    {
      text: 'Visibilité limitée',
      included: true
    },
    {
      text: 'Support standard',
      included: true
    },
    {
      text: 'Gestion planning',
      included: false
    },
    {
      text: 'Statistiques',
      included: false
    },
    {
      text: 'Badge vérifié',
      included: false
    }]

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
      highlight: true
    },
    {
      text: 'Profil premium',
      included: true
    },
    {
      text: 'Visibilité prioritaire',
      included: true
    },
    {
      text: 'Planning avancé',
      included: true
    },
    {
      text: 'Analytics',
      included: true
    },
    {
      text: 'Badge vérifié',
      included: true
    },
    {
      text: 'Support prioritaire',
      included: true
    },
    {
      text: 'Rappels auto',
      included: true
    }]

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
      highlight: true
    },
    {
      text: 'Avantages Pro',
      included: true
    },
    {
      text: 'Top position',
      included: true
    },
    {
      text: 'Badge Elite',
      included: true
    },
    {
      text: 'Marketing inclus',
      included: true
    },
    {
      text: 'Assurance RC',
      included: true
    },
    {
      text: 'Formation continue',
      included: true
    },
    {
      text: 'Support VIP',
      included: true
    },
    {
      text: 'Facturation',
      included: true
    }]

  }];

  const currentPlans = userType === 'patient' ? patientPlans : professionalPlans;
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center mb-8 font-medium group ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
            
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour
          </button>

          <div className="text-center mb-8">
            <p
              className={`text-sm font-medium tracking-widest uppercase mb-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              
              SANAD - PLANS & TARIFS
            </p>
            <h1
              className={`text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              Choisissez Votre Plan
            </h1>
            <p
              className={`text-xl mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              
              Des solutions adaptées à vos besoins, sans engagement
            </p>

            <div className="mb-8">
              <ComplianceBadges />
            </div>

            {/* User Type Toggle */}
            <div
              className={`inline-flex backdrop-blur-sm border rounded-full p-1 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
              
              <button
                onClick={() => setUserType('patient')}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${userType === 'patient' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                
                👤 Patient
              </button>
              <button
                onClick={() => setUserType('professional')}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${userType === 'professional' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                
                💼 Professionnel
              </button>
            </div>
          </div>
        </div>

        {/* Benefits Banner */}
        <div
          className={`backdrop-blur-sm border rounded-2xl p-6 mb-12 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3
                  className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  Sans engagement
                </h3>
                <p
                  className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  
                  Annulez à tout moment
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3
                  className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  Activation immédiate
                </h3>
                <p
                  className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  
                  Profitez dès maintenant
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3
                  className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  Garantie 30 jours
                </h3>
                <p
                  className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  
                  Remboursement complet
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {currentPlans.map((plan) =>
          <div
            key={plan.id}
            className={`relative group ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}>
            
              {plan.popular &&
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    POPULAIRE
                  </div>
                </div>
            }

              <div
              className={`relative h-full backdrop-blur-sm border-2 rounded-2xl p-8 transition-all ${plan.popular ? 'border-cyan-500 shadow-2xl shadow-cyan-500/20' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'} ${isDark ? 'bg-slate-800/50' : 'bg-white/80'}`}>
              
                {plan.popular &&
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl"></div>
              }

                <div className="relative">
                  <div
                  className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                  
                    {plan.icon}
                  </div>

                  <h3
                  className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {plan.name}
                  </h3>
                  <p
                  className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  
                    {plan.description}
                  </p>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span
                      className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        {plan.price}
                      </span>
                      <span
                      className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                      
                        TND
                      </span>
                    </div>
                    <p
                    className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    
                      par {plan.period}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) =>
                  <li key={index} className="flex items-start gap-3">
                        <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${feature.included ? 'bg-cyan-500/20' : isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                      
                          {feature.included ?
                      <Check
                        className={`h-3 w-3 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} /> :


                      <X
                        className={`h-3 w-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />

                      }
                        </div>
                        <span
                      className={`text-sm ${feature.included ? feature.highlight ? (isDark ? 'text-cyan-400' : 'text-cyan-600') + ' font-bold' : isDark ? 'text-white' : 'text-slate-900' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      
                          {feature.text}
                        </span>
                      </li>
                  )}
                  </ul>

                  <button
                  className={`relative w-full group/btn overflow-hidden ${plan.popular ? '' : 'opacity-90 hover:opacity-100'}`}>
                  
                    <div
                    className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} opacity-0 group-hover/btn:opacity-100 transition-opacity blur-xl`}>
                  </div>
                    <div
                    className={`relative w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-transform group-hover/btn:scale-[1.02] ${plan.popular ? `bg-gradient-to-r ${plan.gradient}` : isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}>
                    
                      {plan.id === 'free' || plan.id === 'starter' ?
                    <>
                          <Zap className="h-4 w-4" />
                          Commencer
                        </> :

                    <>
                          <Crown className="h-4 w-4" />
                          Choisir {plan.name}
                        </>
                    }
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2
            className={`text-3xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
            Questions Fréquentes
          </h2>
          <div className="space-y-4">
            {[
            {
              q: 'Puis-je changer de plan ?',
              a: 'Oui, vous pouvez changer de plan à tout moment. Les changements prennent effet immédiatement.'
            },
            {
              q: 'Comment fonctionne la commission ?',
              a: 'La commission est automatiquement déduite lors de chaque réservation selon votre plan.'
            },
            {
              q: 'Y a-t-il un engagement ?',
              a: 'Non, tous nos plans sont sans engagement. Annulez quand vous voulez.'
            },
            {
              q: "Que se passe-t-il si j'annule ?",
              a: "Vous conservez vos avantages jusqu'à la fin de la période payée."
            }].
            map((faq, index) =>
            <div
              key={index}
              className={`backdrop-blur-sm border rounded-xl p-6 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 hover:border-cyan-500/50' : 'bg-white/80 border-slate-200 hover:border-cyan-500/50 shadow-sm'}`}>
              
                <h3
                className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  {faq.q}
                </h3>
                <p
                className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl"></div>
          <div
            className={`relative backdrop-blur-sm border rounded-2xl p-12 text-center ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
            <Sparkles
              className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            
            <h2
              className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              Besoin d'un Plan Personnalisé ?
            </h2>
            <p
              className={`mb-6 max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              
              Pour les grandes structures ou besoins spécifiques, contactez
              notre équipe pour une offre sur mesure.
            </p>
            <button className="relative group/cta overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover/cta:opacity-100 transition-opacity blur-xl"></div>
              <div className="relative px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-white flex items-center justify-center gap-2 group-hover/cta:scale-105 transition-transform">
                <Activity className="h-5 w-5" />
                Contactez-nous
              </div>
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div
          className={`mt-12 flex items-center justify-center gap-6 text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
          
          <div className="flex items-center gap-2">
            <Shield
              className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            
            <span>Paiement sécurisé</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock
              className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            
            <span>SSL 256-bit</span>
          </div>
          <div className="flex items-center gap-2">
            <Check
              className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            
            <span>Garantie 30 jours</span>
          </div>
        </div>
      </div>
    </div>);

}