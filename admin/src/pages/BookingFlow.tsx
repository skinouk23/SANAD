import React, { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle2,
  Lock,
  Shield,
  ChevronRight } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { BookingCalendar } from '../components/BookingCalendar';
export function BookingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Address, 3: Payment, 4: Confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2025-02-15');
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile' | null>(
    null
  );
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };
  const handlePayment = () => {
    setIsSubmitting(true);
    // Simulate payment processing
    setTimeout(() => {
      setStep(4);
      setIsSubmitting(false);
    }, 2000);
  };
  const handleFinish = () => {
    navigate('/patient-dashboard');
  };
  // Step indicator
  const steps = [
  {
    number: 1,
    label: 'Date & Heure'
  },
  {
    number: 2,
    label: 'Adresse'
  },
  {
    number: 3,
    label: 'Paiement'
  }];

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium">
          
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </button>

        {/* Progress Steps */}
        {step < 4 &&
        <div className="mb-8">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {steps.map((s, index) =>
            <Fragment key={s.number}>
                  <div className="flex flex-col items-center">
                    <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= s.number ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  
                      {step > s.number ?
                  <CheckCircle2 className="h-5 w-5" /> :

                  s.number
                  }
                    </div>
                    <span className="text-xs mt-2 text-gray-600 hidden sm:block">
                      {s.label}
                    </span>
                  </div>
                  {index < steps.length - 1 &&
              <div
                className={`flex-1 h-1 mx-4 ${step > s.number ? 'bg-teal-600' : 'bg-gray-200'}`} />

              }
                </Fragment>
            )}
            </div>
          </div>
        }

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Date & Time */}
            {step === 1 &&
            <Card className="bg-white" padding="lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Choisissez la date et l'heure
                </h2>
                <BookingCalendar
                onSelectDate={(date) => setSelectedDate(date)}
                onSelectTime={(time) => setSelectedTime(time)} />
              
                <div className="mt-6">
                  <Button fullWidth size="lg" onClick={handleNext}>
                    Continuer
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </Card>
            }

            {/* Step 2: Address */}
            {step === 2 &&
            <Card className="bg-white" padding="lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Adresse d'intervention
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start p-4 bg-teal-50 rounded-lg border-2 border-teal-600">
                    <input
                    type="radio"
                    name="address"
                    defaultChecked
                    className="mt-1 mr-3" />
                  
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-teal-600" />
                        <p className="font-bold text-gray-900">Domicile</p>
                      </div>
                      <p className="text-gray-600 text-sm">
                        12 Rue de la Liberté, Tunis, 1002
                      </p>
                    </div>
                  </div>

                  <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-teal-600 hover:text-teal-600 transition-colors">
                    + Ajouter une nouvelle adresse
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions spéciales (optionnel)
                  </label>
                  <textarea
                  rows={3}
                  placeholder="Ex: Code d'accès, étage, instructions particulières..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1">
                  
                    Retour
                  </Button>
                  <Button onClick={handleNext} className="flex-1">
                    Continuer
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </Card>
            }

            {/* Step 3: Payment */}
            {step === 3 &&
            <Card className="bg-white" padding="lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <Lock className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Paiement sécurisé
                    </h2>
                    <p className="text-sm text-gray-600">
                      Vos données sont protégées
                    </p>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-gray-900">
                    Mode de paiement
                  </h3>

                  <button
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${paymentMethod === 'card' ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">
                            Carte bancaire
                          </div>
                          <div className="text-sm text-gray-600">
                            Visa, Mastercard
                          </div>
                        </div>
                      </div>
                      {paymentMethod === 'card' &&
                    <CheckCircle2 className="h-5 w-5 text-teal-600" />
                    }
                    </div>
                  </button>

                  <button
                  onClick={() => setPaymentMethod('mobile')}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${paymentMethod === 'mobile' ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📱</span>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">
                            Mobile Money
                          </div>
                          <div className="text-sm text-gray-600">
                            Sobflous, D17
                          </div>
                        </div>
                      </div>
                      {paymentMethod === 'mobile' &&
                    <CheckCircle2 className="h-5 w-5 text-teal-600" />
                    }
                    </div>
                  </button>
                </div>

                {/* Card Payment Form */}
                {paymentMethod === 'card' &&
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro de carte
                      </label>
                      <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date d'expiration
                        </label>
                        <input
                      type="text"
                      placeholder="MM/AA"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                    
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                    
                      </div>
                    </div>
                  </div>
              }

                {/* Mobile Money Form */}
                {paymentMethod === 'mobile' &&
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro de téléphone
                      </label>
                      <input
                    type="tel"
                    placeholder="+216 XX XXX XXX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  
                    </div>
                  </div>
              }

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Paiement 100% sécurisé</p>
                    <p className="text-blue-700">
                      Vos informations bancaires sont cryptées et ne sont jamais
                      stockées sur nos serveurs.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1">
                  
                    Retour
                  </Button>
                  <Button
                  onClick={handlePayment}
                  disabled={!paymentMethod}
                  isLoading={isSubmitting}
                  className="flex-1">
                  
                    Payer 40 TND
                  </Button>
                </div>
              </Card>
            }

            {/* Step 4: Confirmation */}
            {step === 4 &&
            <Card className="bg-white text-center" padding="lg">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Réservation confirmée !
                </h2>
                <p className="text-gray-600 mb-8">
                  Votre paiement a été effectué avec succès. Amel Ben Youssef a
                  été notifiée et vous contactera bientôt.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                  <h3 className="font-bold text-gray-900 mb-4">
                    Détails de la réservation
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Professionnel</span>
                      <span className="font-medium">Amel Ben Youssef</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service</span>
                      <span className="font-medium">Soins Infirmiers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Heure</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between">
                      <span className="text-gray-900 font-bold">
                        Total payé
                      </span>
                      <span className="text-teal-600 font-bold text-lg">
                        40 TND
                      </span>
                    </div>
                  </div>
                </div>

                <Button fullWidth size="lg" onClick={handleFinish}>
                  Voir mes réservations
                </Button>
              </Card>
            }
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="bg-white shadow-lg border-teal-100" padding="lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Récapitulatif
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100"
                      alt="Provider"
                      className="w-12 h-12 rounded-full object-cover" />
                    
                    <div>
                      <p className="font-bold text-gray-900">
                        Amel Ben Youssef
                      </p>
                      <p className="text-sm text-gray-500">Infirmière</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-amber-500">⭐</span>
                        <span className="text-sm font-medium">4.9</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 my-4"></div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service</span>
                    <span className="font-medium text-gray-900">
                      Soins Infirmiers
                    </span>
                  </div>
                  {step >= 1 &&
                  <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Date</span>
                        <span className="font-medium text-gray-900">
                          {selectedDate}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Heure</span>
                        <span className="font-medium text-gray-900">
                          {selectedTime}
                        </span>
                      </div>
                    </>
                  }

                  <div className="border-t border-gray-100 my-4"></div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix du service</span>
                      <span className="text-gray-900">40 TND</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Commission plateforme (incluse)</span>
                      <span>6 TND</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 my-4"></div>

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">
                      Total à payer
                    </span>
                    <span className="text-2xl font-bold text-teal-600">
                      40 TND
                    </span>
                  </div>
                </div>

                {step < 3 &&
                <div className="p-3 bg-teal-50 rounded-lg text-sm text-teal-900">
                    <p className="font-medium mb-1">✓ Paiement sécurisé</p>
                    <p className="text-xs text-teal-700">
                      Annulation gratuite jusqu'à 2h avant le rendez-vous
                    </p>
                  </div>
                }
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>);

}