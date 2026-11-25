import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Clock, Star, ArrowRight, Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ServiceCard } from '../components/ServiceCard';
import { EmergencyButtons } from '../components/EmergencyButtons';
import { Stethoscope, Baby, Activity, Pill } from 'lucide-react';
export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Emergency Floating Button */}
      <EmergencyButtons variant="floating" />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-teal-50 to-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-teal-100 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-rose-100 opacity-50 blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-sm border border-teal-100 mb-6 animate-fade-in-up">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400 mr-2" />
              <span className="text-sm font-medium text-gray-800">
                Plus de 5000 familles nous font confiance
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              Des soins à domicile <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-500">
                humains et professionnels
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Trouvez l'infirmier ou l'aide-soignant idéal pour vos proches en
              quelques clics. Une prise en charge sécurisée, rapide et
              bienveillante partout en Tunisie.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/services" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto shadow-xl shadow-teal-200/50">
                  
                  Trouver un soignant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="#" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-white">
                  
                  Comment ça marche ?
                </Button>
              </Link>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            {[
            {
              icon: Shield,
              title: '100% Vérifiés',
              desc: 'Diplômes et identités contrôlés'
            },
            {
              icon: Clock,
              title: 'Disponible 7j/7',
              desc: 'Intervention rapide en 2h'
            },
            {
              icon: Users,
              title: 'Suivi Personnalisé',
              desc: 'Coordination avec la famille'
            }].
            map((item, i) =>
            <div
              key={i}
              className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              
                <div className="bg-teal-50 p-3 rounded-lg mr-4">
                  <item.icon className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos services de soins
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une gamme complète de services pour répondre à tous les besoins de
              santé à domicile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard
              title="Soins Infirmiers"
              description="Injections, pansements, perfusions et suivi post-opératoire par des infirmiers diplômés."
              price="40 TND"
              icon={Stethoscope}
              color="teal"
              onClick={() => {}} />
            
            <ServiceCard
              title="Assistance Seniors"
              description="Aide à la toilette, repas, et compagnie pour maintenir l'autonomie à domicile."
              price="30 TND"
              icon={Heart}
              color="rose"
              onClick={() => {}} />
            
            <ServiceCard
              title="Maternité"
              description="Accompagnement pré et post-natal, conseils allaitement et soins du nouveau-né."
              price="50 TND"
              icon={Baby}
              color="amber"
              onClick={() => {}} />
            
            <ServiceCard
              title="Kinésithérapie"
              description="Rééducation fonctionnelle, respiratoire et motrice à domicile."
              price="60 TND"
              icon={Activity}
              color="blue"
              onClick={() => {}} />
            
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="outline" size="lg">
                Voir tous les services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-gray-600">
              Réserver un soin n'a jamais été aussi simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector Line (Desktop only) */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-200 -z-10"></div>

            {[
            {
              step: 1,
              title: 'Choisissez un soin',
              desc: 'Sélectionnez le type de prestation dont vous avez besoin.'
            },
            {
              step: 2,
              title: 'Trouvez un soignant',
              desc: 'Notre algorithme vous propose les meilleurs profils à proximité.'
            },
            {
              step: 3,
              title: 'Réservez en ligne',
              desc: 'Validez le créneau et recevez une confirmation immédiate.'
            }].
            map((item) =>
            <div
              key={item.step}
              className="flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-sm md:bg-transparent md:shadow-none">
              
                <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-teal-200">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="py-20 bg-teal-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Ils nous font confiance
              </h2>
              <p className="text-teal-100 text-lg mb-8">
                "Grâce à Care@Home, j'ai trouvé une infirmière formidable pour
                ma mère en moins de 30 minutes. Un service rassurant et
                professionnel."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center text-xl font-bold mr-4">
                  S
                </div>
                <div>
                  <div className="font-bold">Sarah Ben Ali</div>
                  <div className="text-teal-300 text-sm">Tunis, Marsa</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card
                className="bg-white/10 border-none text-white backdrop-blur-sm"
                padding="lg">
                
                <div className="text-4xl font-bold mb-2">15k+</div>
                <div className="text-teal-200">Soins réalisés</div>
              </Card>
              <Card
                className="bg-white/10 border-none text-white backdrop-blur-sm"
                padding="lg">
                
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-teal-200">Satisfaction</div>
              </Card>
              <Card
                className="bg-white/10 border-none text-white backdrop-blur-sm"
                padding="lg">
                
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-teal-200">Soignants</div>
              </Card>
              <Card
                className="bg-white/10 border-none text-white backdrop-blur-sm"
                padding="lg">
                
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-teal-200">Support</div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>);

}