import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Scan,
  FileText,
  AlertCircle } from
'lucide-react';
import { CyberBottomNav } from '../components/CyberBottomNav';
import { CyberPaymentStep } from '../components/CyberPaymentStep';
import { useTheme } from '../contexts/ThemeContext';
export function CyberRadiologyBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedExam, setSelectedExam] = useState<string>('xray');
  const [hasOrdonnance, setHasOrdonnance] = useState(true);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedDate, setSelectedDate] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const center = location.state?.center || {
    name: 'Centre Radiologie Moderne',
    address: 'Avenue de la République, Tunis 1001'
  };
  const examTypes = [
  {
    id: 'xray',
    name: 'Radiographie standard',
    price: 60,
    duration: '15 min',
    prep: 'Aucune préparation'
  },
  {
    id: 'echo',
    name: 'Échographie abdominale',
    price: 100,
    duration: '30 min',
    prep: 'À jeun depuis 6h'
  },
  {
    id: 'scanner',
    name: 'Scanner thoracique',
    price: 220,
    duration: '20 min',
    prep: 'Retirer objets métalliques'
  },
  {
    id: 'mri',
    name: 'IRM cérébrale',
    price: 300,
    duration: '45 min',
    prep: 'Questionnaire médical requis'
  },
  {
    id: 'mammo',
    name: 'Mammographie',
    price: 130,
    duration: '20 min',
    prep: 'Pas de déodorant'
  },
  {
    id: 'doppler',
    name: 'Doppler vasculaire',
    price: 150,
    duration: '30 min',
    prep: 'Aucune préparation'
  }];

  const timeSlots = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00'];

  const selectedExamData = examTypes.find((e) => e.id === selectedExam)!;
  const totalPrice = selectedExamData.price;
  const platformCommission = Math.round(totalPrice * 0.15);
  const unavailableTimes = ['10:00', '15:00'];
  const handlePaymentComplete = (method: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      navigate('/patient-dashboard');
    }, 1500);
  };
  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div
        className={`fixed inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px]`}>
      </div>
      <div
        className={`fixed top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'} rounded-full blur-3xl animate-pulse pointer-events-none`}>
      </div>
      <div
        className={`fixed bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-violet-500/10' : 'bg-violet-500/5'} rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none`}>
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
                      
                        Réserver un examen
                      </h1>
                    </div>
                  </div>

                  <div
                  className={`mb-3 p-3 rounded-lg ${isDark ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
                  
                    <div className="flex items-center gap-2 mb-1.5">
                      <Scan
                      className={`h-4 w-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                    
                      <h3
                      className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        {center.name}
                      </h3>
                    </div>
                    <p
                    className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                      {center.address}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3
                    className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Type d'examen
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {examTypes.map((exam) =>
                    <button
                      key={exam.id}
                      onClick={() => setSelectedExam(exam.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${selectedExam === exam.id ? 'border-purple-500 bg-purple-500/10' : isDark ? 'border-slate-700 hover:border-purple-500/50' : 'border-slate-200 hover:border-purple-500/50'}`}>
                      
                          <div className="flex justify-between items-start mb-1">
                            <span
                          className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                              {exam.name}
                            </span>
                            <span
                          className={`text-xs font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                          
                              {exam.price} TND
                            </span>
                          </div>
                          <div
                        className={`flex items-center gap-1 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                            <Clock className="h-3 w-3" />
                            {exam.duration}
                          </div>
                        </button>
                    )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3
                    className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Ordonnance médicale
                    </h3>
                    <div className="flex gap-3">
                      <button
                      onClick={() => setHasOrdonnance(true)}
                      className={`flex-1 p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${hasOrdonnance ? 'border-purple-500 bg-purple-500/10' : isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                      
                        <FileText
                        className={`h-4 w-4 ${hasOrdonnance ? 'text-purple-500' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                      
                        <span
                        className={`text-xs font-medium ${hasOrdonnance ? isDark ? 'text-white' : 'text-slate-900' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                          J'ai une ordonnance
                        </span>
                      </button>
                      <button
                      onClick={() => setHasOrdonnance(false)}
                      className={`flex-1 p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${!hasOrdonnance ? 'border-purple-500 bg-purple-500/10' : isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                      
                        <AlertCircle
                        className={`h-4 w-4 ${!hasOrdonnance ? 'text-purple-500' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                      
                        <span
                        className={`text-xs font-medium ${!hasOrdonnance ? isDark ? 'text-white' : 'text-slate-900' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                          Sans ordonnance
                        </span>
                      </button>
                    </div>
                    {!hasOrdonnance &&
                  <p className="mt-2 text-[10px] text-amber-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Certains examens nécessitent obligatoirement une
                        prescription médicale.
                      </p>
                  }
                  </div>

                  <div className="mb-4">
                    <h3
                    className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Date et Heure
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
                      {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                      const date = new Date();
                      date.setDate(date.getDate() + day);
                      const isSelected = selectedDate === day;
                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDate(day)}
                          className={`flex-shrink-0 w-14 p-2 rounded-xl border-2 text-center transition-all ${isSelected ? 'border-purple-500 bg-purple-500/10' : isDark ? 'border-slate-700 hover:border-purple-500/50' : 'border-slate-200 hover:border-purple-500/50'}`}>
                          
                            <div
                            className={`text-[10px] mb-0.5 ${isSelected ? 'text-purple-500' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            
                              {date.toLocaleDateString('fr-FR', {
                              weekday: 'short'
                            })}
                            </div>
                            <div
                            className={`text-sm font-bold ${isSelected ? isDark ? 'text-white' : 'text-slate-900' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            
                              {date.getDate()}
                            </div>
                          </button>);

                    })}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((time) => {
                      const isUnavailable = unavailableTimes.includes(time);
                      const isSelected = selectedTime === time;
                      return (
                        <button
                          key={time}
                          disabled={isUnavailable}
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 rounded-lg text-xs font-medium transition-all ${isUnavailable ? isDark ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' : isSelected ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-md' : isDark ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-purple-500/50' : 'bg-white text-slate-700 border border-slate-200 hover:border-purple-500/50'}`}>
                          
                            {time}
                          </button>);

                    })}
                    </div>
                  </div>

                  <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedTime || !selectedExam}
                  className="w-full py-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100">
                  
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
                  <div
                    className={`p-3 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                    
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                        {selectedExamData.name}
                      </span>
                      <span
                        className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                        {selectedExamData.price} TND
                      </span>
                    </div>
                    <div
                      className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                      Préparation: {selectedExamData.prep}
                    </div>
                  </div>
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
                      className={`text-lg font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                      
                      {totalPrice + platformCommission} TND
                    </span>
                  </div>
                </div>
                <div
                  className={`flex items-start gap-2 p-3 rounded-lg text-[10px] ${isDark ? 'bg-purple-500/10 text-purple-300' : 'bg-purple-50 text-purple-700'}`}>
                  
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  <p>
                    Présentez-vous 15 minutes avant l'heure du rendez-vous avec
                    votre pièce d'identité et votre ordonnance.
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