import React, { useState } from 'react';
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
  CheckCircle } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
export function EquipmentBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    'card' | 'mobile' | 'cash' | null>(
    'cash');
  // Get equipment data from navigation state
  const equipment = location.state?.equipment || {
    name: "Concentrateur d'Oxygène",
    pricing: {
      daily: 35,
      weekly: 210,
      monthly: 750
    },
    deposit: 300
  };
  const duration = location.state?.duration || 'daily';
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
  const durationLabels = {
    daily: 'jour',
    weekly: 'semaine',
    monthly: 'mois'
  };
  const price = equipment.pricing[duration];
  const platformCommission = Math.round(price * 0.15); // 15% commission
  const providerRevenue = price - platformCommission;
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
                Finaliser la location
              </h1>

              {/* Duration Confirmation */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Durée de location
                </h3>
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">
                      Location par {durationLabels[duration]}
                    </span>
                    <span className="font-bold text-teal-700">
                      {price} TND/{durationLabels[duration]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Date */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
                          className={`
                          flex flex-col items-center p-3 rounded-lg transition-all
                          ${i === 0 ? 'bg-teal-600 text-white shadow-md' : 'bg-white border border-gray-200 hover:border-teal-300'}
                        `}>
                          
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
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Livraison entre 9h et 17h
                </p>
              </div>

              {/* Delivery Address */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Adresse de livraison
                </h3>
                <div className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900">Domicile</p>
                    <p className="text-gray-600">
                      12 Rue de la Liberté, Tunis, 1002
                    </p>
                    <button className="text-teal-600 text-sm font-medium mt-1 hover:underline">
                      Modifier l'adresse
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  Mode de paiement
                  <button
                    onClick={() => setShowPaymentDetails(!showPaymentDetails)}
                    className="text-teal-600 hover:text-teal-700"
                    title="Comment fonctionne le paiement ?">
                    
                    <Info className="h-5 w-5" />
                  </button>
                </h3>

                {/* Payment Flow Explanation */}
                {showPaymentDetails &&
                <Card className="mb-4 bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
                    <div className="flex items-start gap-3 mb-4">
                      <Shield className="h-6 w-6 text-teal-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">
                          Paiement sécurisé via Care@Home
                        </h4>
                        <p className="text-sm text-gray-700 mb-3">
                          Votre paiement transite par notre plateforme pour
                          garantir la sécurité et la qualité du service.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                        <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                          1
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            Vous payez Care@Home
                          </div>
                          <div className="text-gray-600">
                            Paiement sécurisé du montant total
                          </div>
                          <div className="mt-1 inline-block px-2 py-0.5 bg-teal-100 text-teal-700 rounded font-bold text-xs">
                            {price} TND
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                          2
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            Commission plateforme
                          </div>
                          <div className="text-gray-600">
                            Pour la sécurité, l'assurance et le support
                          </div>
                          <div className="mt-1 inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-bold text-xs">
                            {platformCommission} TND (15%)
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                        <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                          3
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            Fournisseur reçoit
                          </div>
                          <div className="text-gray-600">
                            Virement après livraison confirmée
                          </div>
                          <div className="mt-1 inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded font-bold text-xs">
                            {providerRevenue} TND
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800">
                          <strong>Protection garantie :</strong> En cas de
                          problème avec le matériel, remboursement intégral
                          garanti.
                        </p>
                      </div>
                    </div>
                  </Card>
                }

                {/* Payment Method Selection */}
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <Lock className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        Paiement sécurisé
                      </h4>
                      <p className="text-sm text-teal-700">
                        Vos données sont protégées
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Cash on Delivery */}
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${paymentMethod === 'cash' ? 'border-teal-600 bg-white' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">💵</span>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">
                              Espèces à la livraison
                            </div>
                            <div className="text-sm text-gray-600">
                              Paiement du dépôt + 1ère période
                            </div>
                          </div>
                        </div>
                        {paymentMethod === 'cash' &&
                        <CheckCircle className="h-5 w-5 text-teal-600" />
                        }
                      </div>
                    </button>

                    {/* Card Payment - Disabled */}
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

                  {/* Security Notice */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-blue-800">
                        <p className="font-semibold mb-1">
                          Paiement 100% sécurisé
                        </p>
                        <p className="text-blue-700">
                          Vos informations bancaires sont cryptées et ne sont
                          jamais stockées sur nos serveurs.
                        </p>
                      </div>
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
                      <li>
                        • Un dépôt de garantie de {equipment.deposit} TND sera
                        demandé
                      </li>
                      <li>• Le matériel doit être restitué en bon état</li>
                      <li>• Installation et formation incluses</li>
                      <li>• Maintenance préventive gratuite</li>
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
                  className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                
                <label htmlFor="terms" className="text-sm text-gray-600">
                  J'accepte les{' '}
                  <a href="#" className="text-teal-600 underline">
                    conditions générales de location
                  </a>{' '}
                  et la{' '}
                  <a href="#" className="text-teal-600 underline">
                    politique de confidentialité
                  </a>
                </label>
              </div>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg border-teal-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Récapitulatif
                </h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      {equipment.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Location par {durationLabels[duration]}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium text-gray-900">
                        {price} TND
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Livraison</span>
                      <span className="font-medium text-emerald-600">
                        Gratuit
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Installation</span>
                      <span className="font-medium text-emerald-600">
                        Inclus
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        Commission plateforme
                        <button
                          onClick={() => setShowPaymentDetails(true)}
                          className="text-teal-600 hover:text-teal-700">
                          
                          <Info className="h-3 w-3" />
                        </button>
                      </span>
                      <span className="font-medium text-gray-900">
                        {platformCommission} TND
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pt-3 border-t border-gray-100">
                      <span className="text-gray-600">Dépôt de garantie</span>
                      <span className="font-medium text-gray-900">
                        {equipment.deposit} TND
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-900">
                        Total à payer
                      </span>
                      <span className="text-2xl font-bold text-teal-600">
                        {price + equipment.deposit} TND
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Dont {equipment.deposit} TND de dépôt (remboursable)
                    </p>
                  </div>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  onClick={handleConfirm}
                  isLoading={isSubmitting}
                  disabled={!agreedToTerms || !paymentMethod}>
                  
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  {paymentMethod === 'cash' ?
                  'Confirmer la location' :
                  `Payer ${price + equipment.deposit} TND`}
                </Button>

                <p className="text-xs text-center text-gray-500 mt-3">
                  Livraison sous 24-48h. Annulation gratuite jusqu'à 24h avant.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>);

}