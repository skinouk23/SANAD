import React, { useState, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Check,
  UtensilsCrossed,
  Plus,
  Minus,
  ShoppingCart,
  User,
  Phone,
  Mail } from
'lucide-react';
import { CyberBottomNav } from '../components/CyberBottomNav';
import { CyberPaymentStep } from '../components/CyberPaymentStep';
import { useTheme } from '../contexts/ThemeContext';
export function NutritionBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const provider = location.state?.provider;
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMeals, setSelectedMeals] = useState<{
    [key: string]: number;
  }>({});
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mealOptions = [
  {
    id: 'diabetic-lunch',
    name: 'Menu Diabétique - Déjeuner',
    description: 'Poulet grillé, légumes vapeur, quinoa',
    price: 18
  },
  {
    id: 'low-salt-dinner',
    name: 'Menu Pauvre en Sel - Dîner',
    description: 'Poisson au four, salade, riz complet',
    price: 20
  },
  {
    id: 'cardiac-lunch',
    name: 'Menu Cardiaque - Déjeuner',
    description: "Salade méditerranéenne, thon, huile d'olive",
    price: 16
  },
  {
    id: 'post-surgery',
    name: 'Menu Post-Hospitalisation',
    description: 'Soupe de légumes, purée, compote',
    price: 15
  }];

  const timeSlots = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00'];

  const updateMealQuantity = (mealId: string, change: number) => {
    setSelectedMeals((prev) => {
      const current = prev[mealId] || 0;
      const newValue = Math.max(0, current + change);
      if (newValue === 0) {
        const { [mealId]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [mealId]: newValue
      };
    });
  };
  const calculateTotal = () => {
    return Object.entries(selectedMeals).reduce((total, [mealId, quantity]) => {
      const meal = mealOptions.find((m) => m.id === mealId);
      return total + (meal?.price || 0) * quantity;
    }, 0);
  };
  const totalItems = Object.values(selectedMeals).reduce(
    (sum, qty) => sum + qty,
    0
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handlePaymentComplete = (method: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setCurrentStep(4);
      setIsSubmitting(false);
    }, 2000);
  };
  const canProceed = () => {
    if (currentStep === 1) {
      if (provider?.type === 'nutritionist') {
        return selectedDate && selectedTime;
      }
      return totalItems > 0;
    }
    if (currentStep === 2) {
      return deliveryAddress && contactInfo.name && contactInfo.phone;
    }
    return true;
  };
  if (!provider) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
        
        <div
          className={`border rounded-xl p-8 max-w-md text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-lg'}`}>
          
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
            
            <UtensilsCrossed className="h-8 w-8 text-orange-500" />
          </div>
          <h2
            className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
            Erreur
          </h2>
          <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Aucun professionnel sélectionné
          </p>
          <button
            onClick={() => navigate('/nutrition-providers')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium text-white hover:scale-105 transition-transform">
            
            Retour à la liste
          </button>
        </div>
      </div>);

  }
  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div
        className={`fixed inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px]`}>
      </div>

      <div
        className={`fixed top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse pointer-events-none ${isDark ? 'bg-orange-500/10' : 'bg-orange-500/5'}`}>
      </div>
      <div
        className={`fixed bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none ${isDark ? 'bg-amber-500/10' : 'bg-amber-500/5'}`}>
      </div>

      <div className="relative z-10 py-8 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/nutrition-providers')}
              className={`flex items-center mb-4 font-medium group ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
              
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Retour à la liste
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-3xl overflow-hidden">
                {provider.imageUrl ?
                <img
                  src={provider.imageUrl}
                  alt={provider.name}
                  className="w-full h-full object-cover" /> :


                provider.image
                }
              </div>
              <div>
                <h1
                  className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  {provider.name}
                </h1>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  {provider.specialty}
                </p>
              </div>
            </div>
          </div>

          {currentStep !== 4 &&
          <div
            className={`backdrop-blur-sm border rounded-xl p-6 mb-8 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((step) =>
              <Fragment key={step}>
                    <div className="flex items-center gap-3">
                      <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= step ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white' : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>
                    
                        {currentStep > step ?
                    <Check className="h-5 w-5" /> :

                    step
                    }
                      </div>
                      <div className="hidden sm:block">
                        <p
                      className={`text-sm font-semibold ${currentStep >= step ? isDark ? 'text-white' : 'text-slate-900' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      
                          {step === 1 ?
                      provider.type === 'nutritionist' ?
                      'Rendez-vous' :
                      'Sélection' :
                      step === 2 ?
                      'Informations' :
                      'Paiement'}
                        </p>
                      </div>
                    </div>
                    {step < 3 &&
                <div
                  className={`flex-1 h-1 mx-4 rounded-full transition-all ${currentStep > step ? 'bg-gradient-to-r from-orange-500 to-amber-500' : isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                </div>
                }
                  </Fragment>
              )}
              </div>
            </div>
          }

          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {currentStep === 1 &&
            <div className="space-y-6">
                {provider.type === 'nutritionist' ?
              <div
                className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                    <h2
                  className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                      Prendre rendez-vous
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                      className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                          Date *
                        </label>
                        <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className={`w-full px-4 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`}
                      style={{
                        colorScheme: isDark ? 'dark' : 'light'
                      }} />
                    
                      </div>
                      <div>
                        <label
                      className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                          Heure *
                        </label>
                        <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      required
                      className={`w-full px-4 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`}>
                      
                          <option value="">Sélectionner</option>
                          {timeSlots.map((time) =>
                      <option key={time} value={time}>
                              {time}
                            </option>
                      )}
                        </select>
                      </div>
                    </div>
                  </div> :

              <div
                className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                    <h2
                  className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                      Sélectionnez vos repas
                    </h2>
                    <div className="space-y-3">
                      {mealOptions.map((meal) =>
                  <div
                    key={meal.id}
                    className={`p-4 border rounded-lg ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3
                          className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                                {meal.name}
                              </h3>
                              <p
                          className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          
                                {meal.description}
                              </p>
                              <p className="text-base font-bold text-orange-500">
                                {meal.price} TND
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                          type="button"
                          onClick={() => updateMealQuantity(meal.id, -1)}
                          disabled={!selectedMeals[meal.id]}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors disabled:opacity-30 ${isDark ? 'border-slate-600 text-white hover:border-orange-500 hover:text-orange-400' : 'border-slate-300 text-slate-600 hover:border-orange-500 hover:text-orange-500'}`}>
                          
                                <Minus className="h-4 w-4" />
                              </button>
                              <span
                          className={`w-8 text-center font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                                {selectedMeals[meal.id] || 0}
                              </span>
                              <button
                          type="button"
                          onClick={() => updateMealQuantity(meal.id, 1)}
                          className="w-8 h-8 rounded-full border-2 border-orange-500 bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors">
                          
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                  )}
                    </div>

                    {totalItems > 0 &&
                <div
                  className={`mt-6 p-4 border rounded-lg ${isDark ? 'bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-orange-500/30' : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'}`}>
                  
                        <div className="flex items-center justify-between">
                          <div>
                            <p
                        className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        
                              Total ({totalItems} repas)
                            </p>
                            <p
                        className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                              {calculateTotal()} TND
                            </p>
                          </div>
                          <ShoppingCart className="h-8 w-8 text-orange-500" />
                        </div>
                      </div>
                }
                  </div>
              }
              </div>
            }

            {/* Step 2 */}
            {currentStep === 2 &&
            <div
              className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
              
                <h2
                className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  Informations
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                    className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Nom complet *
                    </label>
                    <input
                    type="text"
                    value={contactInfo.name}
                    onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      name: e.target.value
                    })
                    }
                    required
                    className={`w-full px-4 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`} />
                  
                  </div>
                  <div>
                    <label
                    className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Téléphone *
                    </label>
                    <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      phone: e.target.value
                    })
                    }
                    placeholder="+216 XX XXX XXX"
                    required
                    className={`w-full px-4 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`} />
                  
                  </div>
                  {provider.type !== 'nutritionist' &&
                <div>
                      <label
                    className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        Adresse de livraison *
                      </label>
                      <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Adresse complète"
                    rows={2}
                    required
                    className={`w-full px-4 py-2 border rounded-lg text-sm transition-all resize-none ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`}>
                  </textarea>
                    </div>
                }
                </div>
              </div>
            }

            {/* Step 3 */}
            {currentStep === 3 &&
            <CyberPaymentStep
              totalPrice={
              provider.type === 'nutritionist' ?
              provider.price :
              calculateTotal()
              }
              onPaymentComplete={handlePaymentComplete}
              isSubmitting={isSubmitting}
              providerName={provider.name}
              serviceName={
              provider.type === 'nutritionist' ?
              'Consultation Nutrition' :
              'Commande Repas'
              }
              date={
              provider.type === 'nutritionist' ? selectedDate : undefined
              }
              time={
              provider.type === 'nutritionist' ? selectedTime : undefined
              } />

            }

            {/* Step 4 - Success */}
            {currentStep === 4 &&
            <div
              className={`backdrop-blur-sm border rounded-xl p-12 text-center ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
              
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-10 w-10 text-white" />
                </div>
                <h2
                className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  {provider.type === 'nutritionist' ?
                'Rendez-vous confirmé !' :
                'Commande confirmée !'}
                </h2>
                <p
                className={`mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                  Numéro :
                </p>
                <p
                className={`text-xl font-bold mb-8 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                  {provider.type === 'nutritionist' ? 'RDV' : 'CMD'}-2024-
                  {Math.floor(Math.random() * 10000).
                toString().
                padStart(4, '0')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                  type="button"
                  onClick={() => navigate('/patient-dashboard')}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium text-white hover:scale-105 transition-transform">
                  
                    Tableau de bord
                  </button>
                  <button
                  type="button"
                  onClick={() => navigate('/nutrition-providers')}
                  className={`px-6 py-3 border rounded-lg font-medium transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}`}>
                  
                    Nouvelle commande
                  </button>
                </div>
              </div>
            }

            {/* Navigation */}
            {currentStep < 3 &&
            <div className="flex items-center justify-between mt-8">
                {currentStep > 1 ?
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className={`px-6 py-2 border rounded-lg font-medium transition-all flex items-center gap-2 text-sm ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
                
                    <ArrowLeft className="h-4 w-4" />
                    Précédent
                  </button> :

              <div></div>
              }
                <button
                type="submit"
                disabled={!canProceed()}
                className="px-8 py-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg font-medium text-white hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm">
                
                  Continuer
                </button>
              </div>
            }

            {currentStep === 3 &&
            <div className="mt-8">
                <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className={`px-6 py-2 border rounded-lg font-medium transition-all flex items-center gap-2 text-sm ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
                
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