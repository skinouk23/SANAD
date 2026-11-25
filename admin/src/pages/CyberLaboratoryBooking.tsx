import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Home,
  Clock,
  FlaskConical,
  AlertCircle,
  Shield } from
'lucide-react';
import { CyberBottomNav } from '../components/CyberBottomNav';
import { CyberPaymentStep } from '../components/CyberPaymentStep';
import { useTheme } from '../contexts/ThemeContext';
export function CyberLaboratoryBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedTests, setSelectedTests] = useState<string[]>(['blood-test']);
  const [homeService, setHomeService] = useState(false);
  const [selectedDate, setSelectedDate] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const laboratory = location.state?.laboratory || {
    name: 'Laboratoire Central',
    address: 'Avenue Habib Bourguiba, Tunis 1000'
  };
  const availableTests = [
  {
    id: 'blood-test',
    name: 'Bilan sanguin complet',
    price: 45
  },
  {
    id: 'glucose',
    name: 'Glycémie',
    price: 15
  },
  {
    id: 'cholesterol',
    name: 'Cholestérol',
    price: 25
  },
  {
    id: 'liver',
    name: 'Bilan hépatique',
    price: 60
  },
  {
    id: 'kidney',
    name: 'Bilan rénal',
    price: 55
  },
  {
    id: 'thyroid',
    name: 'Hormones thyroïdiennes',
    price: 80
  }];

  const handlePaymentComplete = (method: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      navigate('/patient-dashboard');
    }, 1500);
  };
  const toggleTest = (testId: string) => {
    setSelectedTests((prev) =>
    prev.includes(testId) ?
    prev.filter((id) => id !== testId) :
    [...prev, testId]
    );
  };
  const totalPrice =
  availableTests.
  filter((test) => selectedTests.includes(test.id)).
  reduce((sum, test) => sum + test.price, 0) + (homeService ? 25 : 0);
  const platformCommission = Math.round(totalPrice * 0.15);
  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div
        className={`fixed inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px]`}>
      </div>
      <div
        className={`fixed top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-blue-500/10' : 'bg-blue-500/5'} rounded-full blur-3xl animate-pulse pointer-events-none`}>
      </div>
      <div
        className={`fixed bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-500/5'} rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none`}>
      </div>

      <div className="relative z-10 py-4 px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              {currentStep === 1 ?
              <div
                className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
                
                  {/* WOW Effect Header */}
                  <div className="relative rounded-[16px] p-[2px] overflow-hidden shadow-sm mb-4">
                    <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />
                    <div
                    className={`relative rounded-[14px] p-4 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
                    
                      <h1
                      className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        Réserver des analyses
                      </h1>
                    </div>
                  </div>

                  <div
                  className={`mb-3 p-3 rounded-lg ${isDark ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                  
                    <div className="flex items-center gap-2 mb-1.5">
                      <FlaskConical
                      className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    
                      <h3
                      className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        {laboratory.name}
                      </h3>
                    </div>
                    <p
                    className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                      {laboratory.address}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3
                    className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Mode de prélèvement
                    </h3>
                    <div className="flex gap-3">
                      <button
                      onClick={() => setHomeService(false)}
                      className={`flex-1 p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${!homeService ? 'border-blue-500 bg-blue-500/10' : isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                      
                        <FlaskConical
                        className={`h-4 w-4 ${!homeService ? 'text-blue-500' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                      
                        <span
                        className={`text-xs font-medium ${!homeService ? isDark ? 'text-white' : 'text-slate-900' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                          Au laboratoire
                        </span>
                      </button>
                      <button
                      onClick={() => setHomeService(true)}
                      className={`flex-1 p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${homeService ? 'border-blue-500 bg-blue-500/10' : isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                      
                        <Home
                        className={`h-4 w-4 ${homeService ? 'text-blue-500' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                      
                        <div className="text-left">
                          <span
                          className={`block text-xs font-medium ${homeService ? isDark ? 'text-white' : 'text-slate-900' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          
                            À domicile
                          </span>
                          <span
                          className={`text-[10px] ${homeService ? 'text-blue-500' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          
                            +25 TND
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3
                    className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Analyses souhaitées
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {availableTests.map((test) => {
                      const isSelected = selectedTests.includes(test.id);
                      return (
                        <button
                          key={test.id}
                          onClick={() => toggleTest(test.id)}
                          className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${isSelected ? 'border-blue-500 bg-blue-500/10' : isDark ? 'border-slate-700 hover:border-blue-500/50' : 'border-slate-200 hover:border-blue-500/50'}`}>
                          
                            <div className="flex items-center gap-2">
                              <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500' : isDark ? 'border-slate-600' : 'border-slate-300'}`}>
                              
                                {isSelected &&
                              <CheckCircle2 className="h-3 w-3 text-white" />
                              }
                              </div>
                              <span
                              className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              
                                {test.name}
                              </span>
                            </div>
                            <span
                            className={`text-xs font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                            
                              {test.price} TND
                            </span>
                          </button>);

                    })}
                    </div>
                  </div>

                  <button
                  onClick={() => setCurrentStep(2)}
                  disabled={selectedTests.length === 0}
                  className="w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100">
                  
                    Continuer vers le paiement
                  </button>
                </div> :

              <CyberPaymentStep
                amount={totalPrice}
                onPaymentComplete={handlePaymentComplete}
                onBack={() => setCurrentStep(1)}
                isSubmitting={isSubmitting} />

              }
            </div>

            <div className="lg:col-span-1">
              <div
                className={`backdrop-blur-sm border rounded-xl p-4 sticky top-24 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
                
                <h3
                  className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  Résumé
                </h3>
                <div className="space-y-3 mb-4">
                  {selectedTests.map((testId) => {
                    const test = availableTests.find((t) => t.id === testId);
                    if (!test) return null;
                    return (
                      <div
                        key={test.id}
                        className="flex justify-between items-center text-xs">
                        
                        <span
                          className={
                          isDark ? 'text-slate-300' : 'text-slate-700'
                          }>
                          
                          {test.name}
                        </span>
                        <span
                          className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                          {test.price} TND
                        </span>
                      </div>);

                  })}

                  {homeService &&
                  <div className="flex justify-between items-center text-xs">
                      <span
                      className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      
                        Frais de déplacement
                      </span>
                      <span
                      className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        25 TND
                      </span>
                    </div>
                  }

                  <div
                    className={`flex justify-between text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                    <span>Frais de service (15%)</span>
                    <span>{platformCommission} TND</span>
                  </div>

                  <div
                    className={`pt-3 border-t flex justify-between items-center ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    
                    <span
                      className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                      Total à payer
                    </span>
                    <span
                      className={`text-lg font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      
                      {totalPrice + platformCommission} TND
                    </span>
                  </div>
                </div>

                <div
                  className={`flex items-start gap-2 p-3 rounded-lg text-[10px] ${isDark ? 'bg-blue-500/10 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                  
                  <Shield className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  <p>
                    Vos résultats seront disponibles de manière sécurisée sur
                    votre espace patient.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CyberBottomNav />
    </div>);

}