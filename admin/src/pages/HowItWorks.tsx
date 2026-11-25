import React from 'react';
import {
  Search,
  Calendar,
  CreditCard,
  CheckCircle,
  Shield,
  Clock,
  TrendingUp,
  Users,
  ArrowRight,
  Wallet } from
'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
export function HowItWorks() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Comment ça marche ?</h1>
          <p className="text-xl text-teal-50">
            Réservez des soins à domicile en toute simplicité et sécurité
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Flow */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Pour les Patients
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting line - hidden on mobile */}
            <div
              className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-teal-200 -z-10"
              style={{
                width: 'calc(100% - 8rem)',
                marginLeft: '4rem'
              }} />
            

            {[
            {
              step: 1,
              icon: Search,
              title: 'Choisissez votre service',
              desc: 'Sélectionnez le type de soin dont vous avez besoin',
              color: 'bg-teal-100 text-teal-600'
            },
            {
              step: 2,
              icon: Users,
              title: 'Trouvez un professionnel',
              desc: 'Consultez les profils, avis et disponibilités',
              color: 'bg-blue-100 text-blue-600'
            },
            {
              step: 3,
              icon: CreditCard,
              title: 'Payez en ligne',
              desc: 'Paiement sécurisé via la plateforme',
              color: 'bg-amber-100 text-amber-600'
            },
            {
              step: 4,
              icon: CheckCircle,
              title: 'Recevez vos soins',
              desc: "Le professionnel vient chez vous à l'heure prévue",
              color: 'bg-emerald-100 text-emerald-600'
            }].
            map((item) =>
            <div key={item.step} className="relative">
                <Card className="text-center h-full">
                  <div
                  className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4 relative z-10`}>
                  
                    <item.icon className="h-8 w-8" />
                  </div>
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Payment Flow Explanation */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Comment fonctionne le paiement ?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Care@Home garantit la sécurité de vos transactions et la qualité des
            services
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Payment Flow Diagram */}
            <Card className="bg-gradient-to-br from-teal-50 to-blue-50">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Wallet className="h-6 w-6 text-teal-600" />
                Flux de paiement sécurisé
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Vous payez Care@Home
                    </div>
                    <div className="text-sm text-gray-600">
                      Paiement sécurisé par carte bancaire ou mobile money
                    </div>
                    <div className="mt-2 inline-block px-3 py-1 bg-white rounded-lg text-teal-600 font-bold">
                      100 TND
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-gray-400" />
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Care@Home retient sa commission
                    </div>
                    <div className="text-sm text-gray-600">
                      Pour garantir la qualité, l'assurance et le support
                    </div>
                    <div className="mt-2 inline-block px-3 py-1 bg-white rounded-lg text-blue-600 font-bold">
                      15 TND (15%)
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-gray-400" />
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Le professionnel reçoit son paiement
                    </div>
                    <div className="text-sm text-gray-600">
                      Virement automatique après la prestation
                    </div>
                    <div className="mt-2 inline-block px-3 py-1 bg-white rounded-lg text-emerald-600 font-bold">
                      85 TND
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Why This Model */}
            <div className="space-y-6">
              <Card>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      Protection garantie
                    </h4>
                    <p className="text-sm text-gray-600">
                      Votre argent est protégé jusqu'à la fin de la prestation.
                      En cas de problème, remboursement garanti.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      Qualité vérifiée
                    </h4>
                    <p className="text-sm text-gray-600">
                      Tous les professionnels sont vérifiés, assurés et évalués
                      par nos patients.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      Support 24/7
                    </h4>
                    <p className="text-sm text-gray-600">
                      Notre équipe est disponible pour vous aider en cas de
                      besoin, avant, pendant et après la prestation.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Pricing Transparency */}
          <Card className="bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Transparence des prix
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Prix du service
                </div>
                <div className="text-2xl font-bold text-gray-900">100 TND</div>
                <div className="text-xs text-gray-500 mt-1">
                  Prix affiché au patient
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Commission plateforme
                </div>
                <div className="text-2xl font-bold text-teal-600">15 TND</div>
                <div className="text-xs text-gray-500 mt-1">
                  15% pour la sécurité et qualité
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Revenu professionnel
                </div>
                <div className="text-2xl font-bold text-emerald-600">
                  85 TND
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Versé après la prestation
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* For Providers */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Pour les Professionnels
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
            {
              icon: Users,
              title: 'Inscrivez-vous',
              desc: 'Créez votre profil professionnel et ajoutez vos qualifications',
              color: 'bg-teal-100 text-teal-600'
            },
            {
              icon: Calendar,
              title: 'Gérez votre planning',
              desc: 'Définissez vos disponibilités et acceptez les demandes',
              color: 'bg-blue-100 text-blue-600'
            },
            {
              icon: TrendingUp,
              title: 'Recevez vos paiements',
              desc: 'Paiements automatiques après chaque prestation validée',
              color: 'bg-emerald-100 text-emerald-600'
            }].
            map((item, index) =>
            <Card key={index} className="text-center">
                <div
                className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </Card>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-teal-600 to-teal-700 text-white max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Prêt à commencer ?</h3>
            <p className="text-teal-50 mb-6">
              Réservez votre premier soin à domicile en quelques clics
            </p>
            <Button
              onClick={() => navigate('/services')}
              className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg font-semibold"
              size="lg">
              
              Trouver un professionnel
            </Button>
          </Card>
        </div>
      </div>
    </div>);

}