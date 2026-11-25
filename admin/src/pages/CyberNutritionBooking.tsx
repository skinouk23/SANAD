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
export function CyberNutritionBooking() {
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
    if (currentStep < 3) setCurrentStep(currentStep + 1);
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
      if (provider?.type === 'nutritionist') return selectedDate && selectedTime;
      return totalItems > 0;
    }
    if (currentStep === 2) {
      if (provider?.type === 'nutritionist')
      return contactInfo.name && contactInfo.phone;
      return deliveryAddress && contactInfo.name && contactInfo.phone;
    }
    return true;
  };
  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div
          className={`border rounded-xl p-5 max-w-md text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-lg'}`}>
          
          <h2
            className={`text-base font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
            Erreur
          </h2>
          <p
            className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            
            Aucun professionnel sélectionné
          </p>
          <button
            onClick={() => navigate('/nutrition-providers')}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg text-sm font-medium text-white hover:scale-105 transition-transform">
            
            Retour aux professionnels
          </button>
        </div>
      </div>);

  }
  const renderStepIndicator = () =>
  <div className="flex items-center justify-center mb-4">
      {[1, 2, 3].map((step) =>
    <Fragment key={step}>
          <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep >= step ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' : isDark ? 'bg-slate-800 text-slate-500 border border-slate-700' : 'bg-white text-slate-400 border border-slate-200'}`}>
        
            {currentStep > step ? <Check className="h-3 w-3" /> : step}
          </div>
          {step < 3 &&
      <div
        className={`w-12 h-0.5 mx-1 ${currentStep > step ? 'bg-orange-500' : isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

      }
        </Fragment>
    )}
    </div>;

  const renderMealSelection = () =>
  <div className="space-y-3">
      <h3
      className={`text-base font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      
        Sélectionnez vos repas
      </h3>
      {mealOptions.map((meal) => {
      const quantity = selectedMeals[meal.id] || 0;
      return (
        <div
          key={meal.id}
          className={`p-4 rounded-xl border transition-all ${quantity > 0 ? 'border-orange-500 bg-orange-500/5' : isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
          
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4
                className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  {meal.name}
                </h4>
                <p
                className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                
                  {meal.description}
                </p>
              </div>
              <span
              className={`text-sm font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
              
                {meal.price} TND
              </span>
            </div>
            <div className="flex items-center justify-end gap-3 mt-2">
              <button
              onClick={() => updateMealQuantity(meal.id, -1)}
              disabled={quantity === 0}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${quantity > 0 ? isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200' : isDark ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-50 text-slate-300 cursor-not-allowed'}`}>
              
                <Minus className="h-3 w-3" />
              </button>
              <span
              className={`w-4 text-center text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                {quantity}
              </span>
              <button
              onClick={() => updateMealQuantity(meal.id, 1)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${isDark ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}>
              
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>);

    })}
    </div>;

  const renderDeliveryInfo = () =>
  <div className="space-y-3">
      <h3
      className={`text-base font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      
        Informations de livraison
      </h3>
      <div className="space-y-3">
        <div>
          <label
          className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          
            Adresse complète
          </label>
          <div className="relative">
            <MapPin
            className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          
            <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Ex: 123 Avenue Habib Bourguiba, Tunis"
            className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}`} />
          
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label
            className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            
              Date de livraison
            </label>
            <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
          
          </div>
          <div>
            <label
            className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            
              Heure de livraison
            </label>
            <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            
              <option value="">Sélectionner une heure</option>
              {timeSlots.map((time) =>
            <option key={time} value={time}>
                  {time}
                </option>
            )}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label
            className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            
              Nom complet
            </label>
            <div className="relative">
              <User
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            
              <input
              type="text"
              value={contactInfo.name}
              onChange={(e) =>
              setContactInfo({
                ...contactInfo,
                name: e.target.value
              })
              }
              placeholder="Votre nom"
              className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}`} />
            
            </div>
          </div>
          <div>
            <label
            className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            
              Téléphone
            </label>
            <div className="relative">
              <Phone
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            
              <input
              type="tel"
              value={contactInfo.phone}
              onChange={(e) =>
              setContactInfo({
                ...contactInfo,
                phone: e.target.value
              })
              }
              placeholder="Votre numéro"
              className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}`} />
            
            </div>
          </div>
        </div>
      </div>
    </div>;

  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div
        className={`fixed inset-0 bg-[linear-gradient(${isDark ? 'rgba(249,115,22,0.03)' : 'rgba(249,115,22,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(249,115,22,0.03)' : 'rgba(249,115,22,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px]`}>
      </div>
      <div
        className={`fixed top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-orange-500/10' : 'bg-orange-500/5'} rounded-full blur-3xl animate-pulse pointer-events-none`}>
      </div>
      <div
        className={`fixed bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-amber-500/10' : 'bg-amber-500/5'} rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none`}>
      </div>

      <div className="relative z-10 py-4 px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          {currentStep < 4 && renderStepIndicator()}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              {currentStep === 4 ?
              <div
                className={`backdrop-blur-sm border rounded-xl p-5 text-center ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                  <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                  <h2
                  className={`text-lg font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Commande confirmée !
                  </h2>
                  <p
                  className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  
                    Votre commande a été validée avec succès. Vous recevrez un
                    SMS de confirmation avec les détails de la livraison.
                  </p>
                  <button
                  onClick={() => navigate('/patient-dashboard')}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg text-sm font-medium text-white hover:scale-105 transition-transform">
                  
                    Aller à mon espace
                  </button>
                </div> :

              <div
                className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                  {/* WOW Effect Header */}
                  <div className="relative rounded-[16px] p-[2px] overflow-hidden shadow-sm mb-4">
                    <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />
                    <div
                    className={`relative rounded-[14px] p-4 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
                    
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-xl">
                          🍽️
                        </div>
                        <div>
                          <h1
                          className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                            {provider.name}
                          </h1>
                          <p
                          className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          
                            {provider.type === 'restaurant' ?
                          'Restaurant diététique' :
                          provider.type === 'chef' ?
                          'Chef à domicile' :
                          'Nutritionniste'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {currentStep === 1 && renderMealSelection()}
                    {currentStep === 2 && renderDeliveryInfo()}
                    {currentStep === 3 &&
                  <CyberPaymentStep
                    amount={calculateTotal()}
                    onPaymentComplete={handlePaymentComplete}
                    onBack={() => setCurrentStep(2)}
                    isSubmitting={isSubmitting} />

                  }

                    {currentStep < 3 &&
                  <div className="mt-4 flex gap-3">
                        {currentStep > 1 &&
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className={`flex-1 py-2 border rounded-xl text-sm font-medium transition-all ${isDark ? 'border-slate-700 text-white hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                      
                            Retour
                          </button>
                    }
                        <button
                      type="submit"
                      disabled={!canProceed()}
                      className="flex-[2] py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-bold hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100">
                      
                          Continuer
                        </button>
                      </div>
                  }
                  </form>
                </div>
              }
            </div>

            {currentStep < 4 &&
            <div className="lg:col-span-1">
                <div
                className={`backdrop-blur-sm border rounded-xl p-4 sticky top-24 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                  <h3
                  className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    <ShoppingCart className="h-4 w-4 text-orange-500" /> Mon
                    panier
                  </h3>

                  {totalItems === 0 ?
                <div
                  className={`text-center py-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  
                      <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">Votre panier est vide</p>
                    </div> :

                <div className="space-y-3 mb-4">
                      {Object.entries(selectedMeals).map(
                    ([mealId, quantity]) => {
                      const meal = mealOptions.find((m) => m.id === mealId);
                      if (!meal || quantity === 0) return null;
                      return (
                        <div
                          key={mealId}
                          className="flex justify-between items-start text-xs">
                          
                              <div className="flex-1">
                                <span
                              className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              
                                  {quantity}x {meal.name}
                                </span>
                              </div>
                              <span
                            className={`font-bold ml-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            
                                {meal.price * quantity} TND
                              </span>
                            </div>);

                    }
                  )}

                      {deliveryAddress &&
                  <div className="flex justify-between items-center text-xs">
                          <span
                      className={
                      isDark ? 'text-slate-300' : 'text-slate-700'
                      }>
                      
                            Frais de livraison
                          </span>
                          <span
                      className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                            7 TND
                          </span>
                        </div>
                  }

                      <div
                    className={`pt-3 border-t flex justify-between items-center ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    
                        <span
                      className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                          Total
                        </span>
                        <span
                      className={`text-lg font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                      
                          {calculateTotal() + (deliveryAddress ? 7 : 0)} TND
                        </span>
                      </div>
                    </div>
                }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      <CyberBottomNav />
    </div>);

}