import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Lock,
  Shield,
  Clock,
  Scan,
  FileText } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
export function RadiologyBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    'card' | 'mobile' | 'cash' | null>(
    'cash');
  const [selectedExam, setSelectedExam] = useState<string>('xray');
  const [hasOrdonnance, setHasOrdonnance] = useState(true);
  const center = location.state?.center || {
    name: 'Centre Radiologie Moderne',
    address: 'Avenue de la République, Tunis 1001',
    phone: '+216 71 456 789'
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

  const selectedExamData = examTypes.find((e) => e.id === selectedExam)!;
  const totalPrice = selectedExamData.price;
  const platformCommission = Math.round(totalPrice * 0.15);
  const handleConfirm = () => {
    if (!agreedToTerms) {
      alert('Veuillez accepter les conditions générales');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      navigate('/patient-dashboard');
    }, 1500);
  };
  const timeSlots = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00'];

  const [selectedTime, setSelectedTime] = useState('09:00');
  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium">
          
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Réserver un examen d'imagerie
              </h1>

              {/* Center Info */}
              <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <Scan className="h-5 w-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">{center.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{center.address}</p>
              </div>

              {/* Exam Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Type d'examen
                </h3>
                <div className="space-y-3">
                  {examTypes.map((exam) =>
                  <button
                    key={exam.id}
                    onClick={() => setSelectedExam(exam.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedExam === exam.id ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">
                          {exam.name}
                        </span>
                        <span className="font-bold text-purple-600">
                          {exam.price} TND
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {exam.duration}
                        </span>
                        <span>• {exam.prep}</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Ordonnance */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Avez-vous une ordonnance ?
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => setHasOrdonnance(true)}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${hasOrdonnance ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    
                    <FileText className="h-5 w-5 mx-auto mb-2 text-purple-600" />
                    <div className="font-semibold text-gray-900">Oui</div>
                    <div className="text-xs text-gray-600">
                      Prise en charge possible
                    </div>
                  </button>
                  <button
                    onClick={() => setHasOrdonnance(false)}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${!hasOrdonnance ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    
                    <div className="font-semibold text-gray-900">Non</div>
                    <div className="text-xs text-gray-600">
                      Examen à vos frais
                    </div>
                  </button>
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Date souhaitée
                </h3>
                <div className="grid grid-cols-7 gap-2 mb-4">
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
                          className={`flex flex-col items-center p-3 rounded-lg transition-all ${i === 0 ? 'bg-purple-600 text-white shadow-md' : 'bg-white border border-gray-200 hover:border-purple-300'}`}>
                          
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

                {/* Time Slots */}
                <h4 className="font-semibold text-gray-900 mb-3">
                  Créneaux disponibles
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) =>
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-lg border-2 transition-all ${selectedTime === time ? 'border-purple-600 bg-purple-50 font-semibold' : 'border-gray-200 hover:border-gray-300'}`}>
                    
                      {time}
                    </button>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Mode de paiement
                </h3>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="h-5 w-5 text-purple-600" />
                    <div>
                      <h4 className="font-bold text-gray-900">
                        Paiement sécurisé
                      </h4>
                      <p className="text-sm text-purple-700">
                        Vos données sont protégées
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${paymentMethod === 'cash' ? 'border-purple-600 bg-white' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">💵</span>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">
                              Espèces sur place
                            </div>
                            <div className="text-sm text-gray-600">
                              Paiement au centre
                            </div>
                          </div>
                        </div>
                        {paymentMethod === 'cash' &&
                        <CheckCircle2 className="h-5 w-5 text-purple-600" />
                        }
                      </div>
                    </button>

                    <button className="w-full p-4 border-2 border-gray-200 rounded-xl flex items-center font-medium text-gray-400 cursor-not-allowed opacity-60">
                      <CreditCard className="h-5 w-5 mr-3" />
                      <div className="text-left flex-grow">
                        <div>Carte bancaire</div>
                        <div className="text-xs font-normal">
                          Bientôt disponible
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="mt-4 p-3 bg-purple-100 rounded-lg border border-purple-200">
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-purple-800">
                        <strong>Commission plateforme :</strong>{' '}
                        {platformCommission} TND (15%) pour garantir la qualité.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-900">
                    <p className="font-semibold mb-2">Important</p>
                    <ul className="space-y-1 text-amber-800">
                      <li>• {selectedExamData.prep}</li>
                      <li>• Arriver 10 minutes avant l'heure</li>
                      <li>• Apporter votre ordonnance et carte vitale</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                
                <label htmlFor="terms" className="text-sm text-gray-600">
                  J'accepte les{' '}
                  <a href="#" className="text-purple-600 underline">
                    conditions générales
                  </a>
                </label>
              </div>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg border-purple-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Récapitulatif
                </h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      {center.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {selectedExamData.name}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Examen</span>
                      <span className="font-medium text-gray-900">
                        {selectedExamData.price} TND
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Durée</span>
                      <span className="font-medium text-gray-900">
                        {selectedExamData.duration}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Heure</span>
                      <span className="font-medium text-gray-900">
                        {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Commission plateforme
                      </span>
                      <span className="font-medium text-gray-900">
                        {platformCommission} TND
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-900">
                        Total à payer
                      </span>
                      <span className="text-2xl font-bold text-purple-600">
                        {totalPrice} TND
                      </span>
                    </div>
                    {hasOrdonnance &&
                    <p className="text-xs text-green-600">
                        ✓ Remboursement possible avec ordonnance
                      </p>
                    }
                  </div>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  onClick={handleConfirm}
                  isLoading={isSubmitting}
                  disabled={!agreedToTerms || !paymentMethod}>
                  
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Confirmer le rendez-vous
                </Button>

                <p className="text-xs text-center text-gray-500 mt-3">
                  Résultats disponibles sous 24-48h
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>);

}