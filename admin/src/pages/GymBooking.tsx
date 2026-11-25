import React, { useState, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Trophy,
  Users,
  Dumbbell } from
'lucide-react';
import { CyberBottomNav } from '../components/CyberBottomNav';
import { CyberPaymentStep } from '../components/CyberPaymentStep';
import { useTheme } from '../contexts/ThemeContext';
export function GymBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('monthly');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([
  'gym']
  );
  const [startDate, setStartDate] = useState(0);
  const gym = location.state?.gym || {
    name: 'FitZone Premium',
    address: 'Avenue Mohamed V, Tunis 1002',
    phone: '+216 71 789 012',
    image: '🏋️',
    imageUrl:
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=300&h=300'
  };
  const subscriptionPlans = [
  {
    id: 'monthly',
    name: 'Mensuel',
    price: 120,
    duration: '1 mois',
    features: ['Accès illimité', 'Vestiaires', 'Douches'],
    popular: false
  },
  {
    id: 'quarterly',
    name: 'Trimestriel',
    price: 300,
    duration: '3 mois',
    features: [
    'Accès illimité',
    'Vestiaires',
    'Douches',
    '1 cours collectif offert'],

    popular: true,
    savings: '20 TND économisés'
  },
  {
    id: 'annual',
    name: 'Annuel',
    price: 1000,
    duration: '12 mois',
    features: [
    'Accès illimité',
    'Vestiaires',
    'Douches',
    'Cours collectifs',
    'Coach 2x/mois',
    'Spa'],

    popular: false,
    savings: '440 TND économisés'
  }];

  const activities = [
  {
    id: 'gym',
    name: 'Musculation & Cardio',
    icon: Dumbbell,
    included: true
  },
  {
    id: 'classes',
    name: 'Cours collectifs',
    icon: Users,
    price: 30
  },
  {
    id: 'coach',
    name: 'Coach personnel (1 séance)',
    icon: Trophy,
    price: 50
  }];

  const selectedPlanData = subscriptionPlans.find((p) => p.id === selectedPlan)!;
  const activitiesPrice = activities.
  filter((a) => selectedActivities.includes(a.id) && a.price).
  reduce((sum, a) => sum + (a.price || 0), 0);
  const totalPrice = selectedPlanData.price + activitiesPrice;
  const toggleActivity = (activityId: string) => {
    if (activityId === 'gym') return;
    setSelectedActivities((prev) =>
    prev.includes(activityId) ?
    prev.filter((id) => id !== activityId) :
    [...prev, activityId]
    );
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };
  const handlePaymentComplete = (method: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setCurrentStep(3);
      setIsSubmitting(false);
    }, 2000);
  };
  const getStartDateString = () => {
    const date = new Date();
    date.setDate(date.getDate() + startDate);
    return date.toLocaleDateString('fr-FR');
  };
  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div
        className={`fixed inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px]`}>
      </div>

      <div
        className={`fixed top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-amber-500/10' : 'bg-amber-500/5'} rounded-full blur-3xl animate-pulse pointer-events-none`}>
      </div>
      <div
        className={`fixed bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-orange-500/10' : 'bg-orange-500/5'} rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none`}>
      </div>

      <div className="relative z-10 py-8 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => navigate('/gym')}
              className={`flex items-center mb-4 font-medium group ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
              
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Retour
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-3xl overflow-hidden">
                {gym.imageUrl ?
                <img
                  src={gym.imageUrl}
                  alt={gym.name}
                  className="w-full h-full object-cover" /> :


                gym.image
                }
              </div>
              <div className="flex-1 min-w-0">
                <h1
                  className={`text-xl font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  {gym.name}
                </h1>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  {gym.address}
                </p>
              </div>
            </div>
          </div>

          {currentStep !== 3 &&
          <div
            className={`backdrop-blur-sm border rounded-xl p-6 mb-8 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
            
              <div className="flex items-center justify-between">
                {[1, 2].map((step) =>
              <Fragment key={step}>
                    <div className="flex items-center gap-3">
                      <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= step ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white' : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>
                    
                        {currentStep > step ?
                    <Check className="h-5 w-5" /> :

                    step
                    }
                      </div>
                      <div>
                        <p
                      className={`text-sm font-semibold ${currentStep >= step ? isDark ? 'text-white' : 'text-slate-900' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      
                          {step === 1 ? 'Formule' : 'Paiement'}
                        </p>
                      </div>
                    </div>
                    {step < 2 &&
                <div
                  className={`flex-1 h-1 mx-4 rounded-full transition-all ${currentStep > step ? 'bg-gradient-to-r from-amber-500 to-orange-500' : isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                </div>
                }
                  </Fragment>
              )}
              </div>
            </div>
          }

          <form onSubmit={handleSubmit}>
            {currentStep === 1 &&
            <div className="space-y-6">
                <div
                className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
                
                  <h2
                  className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Choisissez votre formule
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {subscriptionPlans.map((plan) =>
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left relative ${selectedPlan === plan.id ? 'border-amber-500 bg-amber-500/10' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                    
                        {plan.popular &&
                    <span className="absolute -top-2 right-2 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
                            Populaire
                          </span>
                    }
                        <div className="mb-3">
                          <div
                        className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                            {plan.name}
                          </div>
                          <div className="text-2xl font-bold text-amber-500">
                            {plan.price} TND
                          </div>
                          <div
                        className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                            {plan.duration}
                          </div>
                          {plan.savings &&
                      <div className="text-xs text-green-500 font-semibold mt-1">
                              {plan.savings}
                            </div>
                      }
                        </div>
                        <ul className="space-y-1">
                          {plan.features.map((feature, idx) =>
                      <li
                        key={idx}
                        className={`flex items-center gap-2 text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        
                              <CheckCircle2 className="h-3 w-3 text-amber-500 flex-shrink-0" />
                              {feature}
                            </li>
                      )}
                        </ul>
                      </button>
                  )}
                  </div>
                </div>

                <div
                className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
                
                  <h2
                  className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Options supplémentaires
                  </h2>
                  <div className="space-y-3">
                    {activities.map((activity) =>
                  <button
                    key={activity.id}
                    type="button"
                    onClick={() => toggleActivity(activity.id)}
                    disabled={activity.included}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedActivities.includes(activity.id) ? 'border-amber-500 bg-amber-500/10' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'} ${activity.included ? 'opacity-75' : ''}`}>
                    
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <activity.icon className="h-5 w-5 text-amber-500" />
                            <div>
                              <div
                            className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            
                                {activity.name}
                              </div>
                              {activity.included &&
                          <div className="text-xs text-green-500">
                                  Inclus
                                </div>
                          }
                            </div>
                          </div>
                          {activity.price &&
                      <span className="font-bold text-amber-500">
                              +{activity.price} TND
                            </span>
                      }
                        </div>
                      </button>
                  )}
                  </div>
                </div>

                <div
                className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
                
                  <h2
                  className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Date de début
                  </h2>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from(
                    {
                      length: 7
                    },
                    (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() + i);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setStartDate(i)}
                          className={`flex flex-col items-center p-3 rounded-lg transition-all ${startDate === i ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white' : isDark ? 'bg-slate-900/50 border border-slate-700 text-slate-300 hover:border-slate-600' : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                          
                            <span className="text-xs font-medium uppercase mb-1">
                              {date.
                            toLocaleDateString('fr-FR', {
                              weekday: 'short'
                            }).
                            replace('.', '')}
                            </span>
                            <span className="text-xl font-bold">
                              {date.getDate()}
                            </span>
                          </button>);

                    }
                  )}
                  </div>
                </div>

                <div
                className={`rounded-xl p-6 ${isDark ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30' : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'}`}>
                
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                      className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                        Total
                      </p>
                      <p
                      className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        {totalPrice} TND
                      </p>
                      {selectedPlanData.savings &&
                    <p className="text-xs text-green-500 mt-1">
                          ✓ {selectedPlanData.savings}
                        </p>
                    }
                    </div>
                    <Trophy className="h-10 w-10 text-amber-500" />
                  </div>
                </div>
              </div>
            }

            {currentStep === 2 &&
            <CyberPaymentStep
              totalPrice={totalPrice}
              onPaymentComplete={handlePaymentComplete}
              isSubmitting={isSubmitting}
              providerName={gym.name}
              serviceName={`Abonnement ${selectedPlanData.name}`}
              date={getStartDateString()} />

            }

            {currentStep === 3 &&
            <div
              className={`backdrop-blur-sm border rounded-xl p-12 text-center ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
              
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-10 w-10 text-white" />
                </div>
                <h2
                className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  Inscription confirmée !
                </h2>
                <p
                className={`mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                  Numéro d'adhérent :
                </p>
                <p
                className={`text-xl font-bold mb-8 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                  GYM-2024-
                  {Math.floor(Math.random() * 10000).
                toString().
                padStart(4, '0')}
                </p>
                <div
                className={`rounded-lg p-4 mb-8 text-left max-w-md mx-auto ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                
                  <h3
                  className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    📋 Prochaines étapes
                  </h3>
                  <ol
                  className={`space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    <li className="flex gap-2">
                      <span className="font-bold text-amber-500">1.</span>
                      <span>
                        Présentez-vous à la salle avec une pièce d'identité
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-amber-500">2.</span>
                      <span>
                        Apportez un certificat médical (moins de 1 an)
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-amber-500">3.</span>
                      <span>Profitez de votre séance d'essai gratuite !</span>
                    </li>
                  </ol>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                  type="button"
                  onClick={() => navigate('/patient-dashboard')}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium text-white hover:scale-105 transition-transform">
                  
                    Tableau de bord
                  </button>
                  <button
                  type="button"
                  onClick={() => navigate('/gym')}
                  className={`px-6 py-3 border rounded-lg font-medium transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
                  
                    Voir d'autres salles
                  </button>
                </div>
              </div>
            }

            {currentStep === 1 &&
            <div className="flex items-center justify-end mt-8">
                <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg font-medium text-white hover:scale-105 transition-transform">
                
                  Continuer
                </button>
              </div>
            }

            {currentStep === 2 &&
            <div className="mt-8">
                <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`px-6 py-3 border rounded-lg font-medium transition-all flex items-center gap-2 ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
                
                  <ArrowLeft className="h-4 w-4" />
                  Précédent
                </button>
              </div>
            }
          </form>
        </div>
      </div>

      <CyberBottomNav />
    </div>);

}