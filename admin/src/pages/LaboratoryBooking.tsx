import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Lock,
  Shield,
  Home,
  Clock,
  FlaskConical } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
export function LaboratoryBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    'card' | 'mobile' | 'cash' | null>(
    'cash');
  const [selectedTests, setSelectedTests] = useState<string[]>(['blood-test']);
  const [homeService, setHomeService] = useState(false);
  const laboratory = location.state?.laboratory || {
    name: 'Laboratoire Central',
    address: 'Avenue Habib Bourguiba, Tunis 1000',
    phone: '+216 71 123 456'
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
                Réserver des analyses
              </h1>

              {/* Laboratory Info */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <FlaskConical className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900">{laboratory.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{laboratory.address}</p>
              </div>

              {/* Test Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Sélectionnez vos analyses
                </h3>
                <div className="space-y-3">
                  {availableTests.map((test) =>
                  <button
                    key={test.id}
                    onClick={() => toggleTest(test.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedTests.includes(test.id) ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedTests.includes(test.id) ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                          
                            {selectedTests.includes(test.id) &&
                          <CheckCircle2 className="h-4 w-4 text-white" />
                          }
                          </div>
                          <span className="font-medium text-gray-900">
                            {test.name}
                          </span>
                        </div>
                        <span className="font-bold text-blue-600">
                          {test.price} TND
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Home Service Option */}
              <div className="mb-6">
                <button
                  onClick={() => setHomeService(!homeService)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${homeService ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Home className="h-5 w-5 text-teal-600" />
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">
                          Prélèvement à domicile
                        </div>
                        <div className="text-sm text-gray-600">
                          Un infirmier vient chez vous
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-teal-600">+25 TND</span>
                  </div>
                </button>
              </div>

              {/* Appointment Date */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Date souhaitée
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
                          className={`flex flex-col items-center p-3 rounded-lg transition-all ${i === 0 ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-gray-200 hover:border-blue-300'}`}>
                          
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
                <p className="text-sm text-gray-500 mt-3">
                  <Clock className="h-4 w-4 inline mr-1" />
                  {homeService ?
                  'Prélèvement entre 7h et 10h' :
                  'Rendez-vous entre 7h et 18h'}
                </p>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Mode de paiement
                </h3>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-bold text-gray-900">
                        Paiement sécurisé
                      </h4>
                      <p className="text-sm text-blue-700">
                        Vos données sont protégées
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${paymentMethod === 'cash' ? 'border-blue-600 bg-white' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">💵</span>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">
                              Espèces sur place
                            </div>
                            <div className="text-sm text-gray-600">
                              Paiement au laboratoire
                            </div>
                          </div>
                        </div>
                        {paymentMethod === 'cash' &&
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
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

                  <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-800">
                        <strong>Commission plateforme :</strong>{' '}
                        {platformCommission} TND (15%) pour garantir la qualité
                        et la sécurité.
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
                      <li>• Être à jeun pour certaines analyses</li>
                      <li>• Résultats disponibles sous 24-48h</li>
                      <li>• Apporter votre ordonnance si nécessaire</li>
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
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                
                <label htmlFor="terms" className="text-sm text-gray-600">
                  J'accepte les{' '}
                  <a href="#" className="text-blue-600 underline">
                    conditions générales
                  </a>
                </label>
              </div>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Récapitulatif
                </h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      {laboratory.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {selectedTests.length} analyse
                      {selectedTests.length > 1 ? 's' : ''} sélectionnée
                      {selectedTests.length > 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    {availableTests.
                    filter((test) => selectedTests.includes(test.id)).
                    map((test) =>
                    <div
                      key={test.id}
                      className="flex justify-between text-sm">
                      
                          <span className="text-gray-600">{test.name}</span>
                          <span className="font-medium text-gray-900">
                            {test.price} TND
                          </span>
                        </div>
                    )}
                    {homeService &&
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Prélèvement à domicile
                        </span>
                        <span className="font-medium text-gray-900">
                          25 TND
                        </span>
                      </div>
                    }
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
                      <span className="text-2xl font-bold text-blue-600">
                        {totalPrice} TND
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  onClick={handleConfirm}
                  isLoading={isSubmitting}
                  disabled={
                  !agreedToTerms ||
                  selectedTests.length === 0 ||
                  !paymentMethod
                  }>
                  
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Confirmer la réservation
                </Button>

                <p className="text-xs text-center text-gray-500 mt-3">
                  Résultats disponibles sous 24-48h en ligne
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>);

}