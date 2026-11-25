import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Info,
  Shield,
  Lock,
  CheckCircle,
  Map } from
'lucide-react';
import { CyberPaymentStep } from '../components/CyberPaymentStep';
import { AddressPickerModal } from '../components/AddressPickerModal';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
export function CyberEquipmentBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    label: 'Domicile',
    fullAddress: '12 Rue de la Liberté, Tunis, 1002',
    latitude: 36.8065,
    longitude: 10.1815
  });
  // Auto-populate address from user profile
  useEffect(() => {
    if (user?.address) {
      setDeliveryAddress({
        label: 'Domicile',
        fullAddress: user.address.fullAddress,
        latitude: user.address.latitude || 36.8065,
        longitude: user.address.longitude || 10.1815
      });
    }
  }, [user]);
  // Get equipment from location state with fallback
  const rawEquipment = location.state?.equipment;
  const duration = location.state?.duration || 'daily';
  // Normalize equipment data to handle both formats
  const equipment = rawEquipment ?
  {
    name: rawEquipment.name || "Concentrateur d'Oxygène",
    pricing: {
      daily: rawEquipment.pricing?.daily || rawEquipment.pricePerDay || 35,
      weekly:
      rawEquipment.pricing?.weekly || rawEquipment.pricePerWeek || 210,
      monthly:
      rawEquipment.pricing?.monthly || rawEquipment.pricePerMonth || 750
    },
    deposit: rawEquipment.deposit || 300
  } :
  {
    name: "Concentrateur d'Oxygène",
    pricing: {
      daily: 35,
      weekly: 210,
      monthly: 750
    },
    deposit: 300
  };
  const handlePaymentComplete = (method: string) => {
    if (!agreedToTerms) {
      alert('Veuillez accepter les conditions générales');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      navigate('/patient-dashboard');
    }, 1500);
  };
  const durationLabels: Record<string, string> = {
    daily: 'jour',
    weekly: 'semaine',
    monthly: 'mois'
  };
  const price =
  equipment.pricing[duration as keyof typeof equipment.pricing] ||
  equipment.pricing.daily;
  const platformCommission = Math.round(price * 0.15);
  const providerRevenue = price - platformCommission;
  const totalPrice = price + equipment.deposit;
  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div
        className={`fixed inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px]`}>
      </div>

      <div
        className={`fixed top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-500/5'} rounded-full blur-3xl animate-pulse pointer-events-none`}>
      </div>
      <div
        className={`fixed bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'} rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none`}>
      </div>

      <div className="relative z-10 py-8 px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {currentStep === 1 ?
              <div
                className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
                
                  <h1
                  className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Finaliser la location
                  </h1>

                  <div className="mb-6">
                    <h3
                    className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Durée de location
                    </h3>
                    <div
                    className={`p-4 rounded-lg ${isDark ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-cyan-50 border border-cyan-200'}`}>
                    
                      <div className="flex items-center justify-between">
                        <span
                        className={
                        isDark ? 'text-slate-300' : 'text-slate-600'
                        }>
                        
                          Location par {durationLabels[duration] || 'jour'}
                        </span>
                        <span
                        className={`font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        
                          {price} TND/{durationLabels[duration] || 'jour'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3
                    className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Date de livraison souhaitée
                    </h3>
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
                            onClick={() => setSelectedDateIndex(i)}
                            className={`flex flex-col items-center p-3 rounded-lg transition-all ${selectedDateIndex === i ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white' : isDark ? 'bg-slate-700/50 border border-slate-600 text-slate-300 hover:border-cyan-500/50' : 'bg-white border border-slate-200 text-slate-700 hover:border-cyan-500'}`}>
                            
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
                    <p
                    className={`text-sm mt-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Livraison entre 9h et 17h
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3
                    className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Adresse de livraison
                    </h3>
                    <div
                    className={`flex items-start p-4 rounded-lg border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                    
                      <MapPin
                      className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${isDark ? 'text-cyan-400' : 'text-cyan-500'}`} />
                    
                      <div className="flex-grow min-w-0">
                        <p
                        className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          {deliveryAddress.label}
                        </p>
                        <p
                        className={`text-sm truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        
                          {deliveryAddress.fullAddress}
                        </p>
                        <button
                        type="button"
                        onClick={() => setShowAddressPicker(true)}
                        className={`text-sm font-medium mt-2 flex items-center gap-1.5 ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
                        
                          <Map className="h-4 w-4" />
                          Modifier l'adresse
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                  className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                  
                    <div className="flex items-start gap-3">
                      <AlertCircle
                      className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                    
                      <div
                      className={`text-sm ${isDark ? 'text-amber-200' : 'text-amber-800'}`}>
                      
                        <p className="font-semibold mb-2">Important</p>
                        <ul
                        className={`space-y-1 ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                        
                          <li>
                            • Dépôt de garantie de {equipment.deposit} TND
                          </li>
                          <li>• Matériel à restituer en bon état</li>
                          <li>• Installation et formation incluses</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mb-6">
                    <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className={`mt-1 h-4 w-4 text-cyan-500 focus:ring-cyan-500 rounded ${isDark ? 'border-slate-600 bg-slate-700' : 'border-slate-300 bg-white'}`} />
                  
                    <label
                    htmlFor="terms"
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                      J'accepte les{' '}
                      <a
                      href="#"
                      className={`underline ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      
                        conditions générales
                      </a>{' '}
                      et la{' '}
                      <a
                      href="#"
                      className={`underline ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      
                        politique de confidentialité
                      </a>
                    </label>
                  </div>

                  <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!agreedToTerms}
                  className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-bold text-white text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                  
                    Continuer vers le paiement
                  </button>
                </div> :

              <div>
                  <CyberPaymentStep
                  totalPrice={totalPrice}
                  onPaymentComplete={handlePaymentComplete}
                  isSubmitting={isSubmitting}
                  serviceName={equipment.name}
                  providerName="Care@Home Equipment" />
                
                </div>
              }
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div
                  className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-slate-800/50 border-cyan-500/30' : 'bg-white/80 border-cyan-200'}`}>
                  
                  <h3
                    className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    Récapitulatif
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div>
                      <h4
                        className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                        {equipment.name}
                      </h4>
                      <p
                        className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                        Location par {durationLabels[duration] || 'jour'}
                      </p>
                    </div>

                    <div
                      className={`border-t pt-4 space-y-3 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                      
                      <div className="flex justify-between text-sm">
                        <span
                          className={
                          isDark ? 'text-slate-400' : 'text-slate-500'
                          }>
                          
                          Location
                        </span>
                        <span
                          className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                          {price} TND
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span
                          className={
                          isDark ? 'text-slate-400' : 'text-slate-500'
                          }>
                          
                          Livraison
                        </span>
                        <span className="font-medium text-green-500">
                          Gratuit
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span
                          className={
                          isDark ? 'text-slate-400' : 'text-slate-500'
                          }>
                          
                          Commission
                        </span>
                        <span
                          className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                          {platformCommission} TND
                        </span>
                      </div>
                      <div
                        className={`flex justify-between text-sm pt-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                        
                        <span
                          className={
                          isDark ? 'text-slate-400' : 'text-slate-500'
                          }>
                          
                          Dépôt de garantie
                        </span>
                        <span
                          className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                          {equipment.deposit} TND
                        </span>
                      </div>
                    </div>

                    <div
                      className={`border-t pt-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                      
                      <div className="flex justify-between items-center mb-2">
                        <span
                          className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                          Total à payer
                        </span>
                        <span
                          className={`text-2xl font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                          
                          {totalPrice} TND
                        </span>
                      </div>
                      <p
                        className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        
                        Dont {equipment.deposit} TND de dépôt (remboursable)
                      </p>
                    </div>
                  </div>

                  <p
                    className={`text-xs text-center mt-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    
                    Livraison sous 24-48h. Annulation gratuite jusqu'à 24h
                    avant.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Picker Modal */}
      <AddressPickerModal
        isOpen={showAddressPicker}
        onClose={() => setShowAddressPicker(false)}
        onSelectAddress={(selectedAddress) => {
          setDeliveryAddress({
            label: 'Adresse sélectionnée',
            fullAddress: selectedAddress.fullAddress,
            latitude: selectedAddress.latitude,
            longitude: selectedAddress.longitude
          });
        }}
        initialLatitude={deliveryAddress.latitude}
        initialLongitude={deliveryAddress.longitude} />
      
    </div>);

}