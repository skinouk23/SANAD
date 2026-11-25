import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Shield,
  CheckCircle2,
  Calendar,
  Phone,
  Award,
  Heart } from
'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
interface ServiceConfig {
  title: string;
  description: string;
  icon: string;
  color: string;
  priceRange: string;
  providers: any[];
  features: string[];
}
const serviceConfigs: {
  [key: string]: ServiceConfig;
} = {
  nursing: {
    title: 'Soins Infirmiers',
    description: 'Injections, pansements, perfusions, prise de sang à domicile',
    icon: '💉',
    color: 'teal',
    priceRange: '40-60 TND',
    features: [
    'Injections et perfusions',
    'Pansements et soins de plaies',
    'Prises de sang',
    'Surveillance médicale'],

    providers: [
    {
      id: 1,
      name: 'Amira Mansour',
      specialty: "Infirmière diplômée d'État",
      rating: 4.9,
      reviews: 187,
      experience: '12 ans',
      zone: 'Tunis Centre',
      price: 40,
      image: '👩‍⚕️',
      available: true,
      certifications: [
      "Diplôme d'État",
      'Formation continue',
      'Soins palliatifs']

    },
    {
      id: 2,
      name: 'Karim Ben Ali',
      specialty: 'Infirmier spécialisé',
      rating: 5.0,
      reviews: 203,
      experience: '15 ans',
      zone: 'Ariana',
      price: 45,
      image: '👨‍⚕️',
      available: true,
      certifications: ["Diplôme d'État", 'Soins intensifs', 'Diabétologie']
    },
    {
      id: 3,
      name: 'Leila Trabelsi',
      specialty: 'Infirmière à domicile',
      rating: 4.8,
      reviews: 156,
      experience: '10 ans',
      zone: 'La Marsa',
      price: 50,
      image: '👩‍⚕️',
      available: false,
      certifications: ["Diplôme d'État", 'Pédiatrie', 'Gériatrie']
    }]

  },
  elderly: {
    title: 'Aide aux Seniors',
    description:
    'Assistance quotidienne pour personnes âgées : toilette, habillage, repas, compagnie',
    icon: '❤️',
    color: 'rose',
    priceRange: '30-50 TND',
    features: [
    'Aide à la toilette et habillage',
    'Préparation et aide aux repas',
    'Compagnie et stimulation',
    'Aide aux déplacements'],

    providers: [
    {
      id: 1,
      name: 'Fatma Gharbi',
      specialty: 'Auxiliaire de vie',
      rating: 5.0,
      reviews: 234,
      experience: '18 ans',
      zone: 'Tunis Centre',
      price: 35,
      image: '👵',
      available: true,
      certifications: [
      'Formation auxiliaire de vie',
      'Alzheimer',
      'Premiers secours']

    },
    {
      id: 2,
      name: 'Mohamed Slimani',
      specialty: 'Aide-soignant',
      rating: 4.9,
      reviews: 178,
      experience: '14 ans',
      zone: 'Manouba',
      price: 30,
      image: '👨‍⚕️',
      available: true,
      certifications: ['Diplôme aide-soignant', 'Gériatrie', 'Handicap']
    }]

  },
  physio: {
    title: 'Kinésithérapie',
    description:
    'Rééducation motrice, respiratoire, massage thérapeutique à domicile',
    icon: '🏃',
    color: 'blue',
    priceRange: '60-80 TND',
    features: [
    'Rééducation motrice',
    'Rééducation respiratoire',
    'Massage thérapeutique',
    'Prévention et conseils'],

    providers: [
    {
      id: 1,
      name: 'Dr. Ahmed Trabelsi',
      specialty: 'Kinésithérapeute',
      rating: 4.9,
      reviews: 167,
      experience: '16 ans',
      zone: 'Tunis Centre',
      price: 60,
      image: '👨‍⚕️',
      available: true,
      certifications: [
      "Diplôme d'État",
      'Rééducation sportive',
      'Ostéopathie']

    },
    {
      id: 2,
      name: 'Sonia Mejri',
      specialty: 'Kinésithérapeute',
      rating: 5.0,
      reviews: 189,
      experience: '12 ans',
      zone: 'Ariana',
      price: 65,
      image: '👩‍⚕️',
      available: true,
      certifications: ["Diplôme d'État", 'Pédiatrie', 'Neurologie']
    }]

  },
  maternity: {
    title: 'Soins Maternité',
    description: 'Suivi post-natal, allaitement, soins bébé à domicile',
    icon: '👶',
    color: 'amber',
    priceRange: '50-70 TND',
    features: [
    'Suivi post-natal',
    "Aide à l'allaitement",
    'Soins du nouveau-né',
    'Conseils parentaux'],

    providers: [
    {
      id: 1,
      name: 'Leila Ben Salem',
      specialty: 'Sage-femme',
      rating: 5.0,
      reviews: 245,
      experience: '20 ans',
      zone: 'La Marsa',
      price: 60,
      image: '👩‍⚕️',
      available: true,
      certifications: [
      'Diplôme sage-femme',
      'Lactation IBCLC',
      'Périnatalité']

    },
    {
      id: 2,
      name: 'Amira Khelifi',
      specialty: 'Puéricultrice',
      rating: 4.9,
      reviews: 198,
      experience: '15 ans',
      zone: 'Carthage',
      price: 55,
      image: '👩‍⚕️',
      available: true,
      certifications: [
      'Diplôme puéricultrice',
      'Allaitement',
      'Néonatologie']

    }]

  },
  checkup: {
    title: 'Bilan de Santé',
    description:
    'Prise de constantes, tension, glycémie, surveillance à domicile',
    icon: '🌡️',
    color: 'teal',
    priceRange: '25-40 TND',
    features: [
    'Prise de tension artérielle',
    'Mesure de glycémie',
    'Surveillance cardiaque',
    'Rapport détaillé'],

    providers: [
    {
      id: 1,
      name: 'Karim Jebali',
      specialty: 'Infirmier',
      rating: 4.8,
      reviews: 134,
      experience: '10 ans',
      zone: 'Tunis Centre',
      price: 25,
      image: '👨‍⚕️',
      available: true,
      certifications: ["Diplôme d'État", 'Diabétologie', 'Cardiologie']
    },
    {
      id: 2,
      name: 'Nadia Hamdi',
      specialty: 'Infirmière',
      rating: 4.9,
      reviews: 156,
      experience: '12 ans',
      zone: 'Ariana',
      price: 30,
      image: '👩‍⚕️',
      available: true,
      certifications: ["Diplôme d'État", 'Gériatrie', 'Prévention']
    }]

  },
  night: {
    title: 'Garde de Nuit',
    description: 'Surveillance et assistance nocturne (12h) à domicile',
    icon: '🌙',
    color: 'rose',
    priceRange: '120-180 TND',
    features: [
    'Surveillance nocturne 12h',
    'Assistance aux besoins',
    'Gestion des urgences',
    'Rapport quotidien'],

    providers: [
    {
      id: 1,
      name: 'Mohamed Gharbi',
      specialty: 'Aide-soignant de nuit',
      rating: 5.0,
      reviews: 189,
      experience: '15 ans',
      zone: 'Tunis Centre',
      price: 120,
      image: '👨‍⚕️',
      available: true,
      certifications: ['Diplôme aide-soignant', 'Gériatrie', 'Urgences']
    },
    {
      id: 2,
      name: 'Fatma Mansour',
      specialty: 'Infirmière de nuit',
      rating: 4.9,
      reviews: 167,
      experience: '18 ans',
      zone: 'Ariana',
      price: 150,
      image: '👩‍⚕️',
      available: true,
      certifications: ["Diplôme d'État", 'Soins palliatifs', 'Alzheimer']
    }]

  },
  'doctor-home': {
    title: 'Médecin à Domicile',
    description:
    'Consultations médicales à domicile - Généraliste ou spécialiste',
    icon: '🩺',
    color: 'blue',
    priceRange: '80-120 TND',
    features: [
    'Consultation complète',
    'Diagnostic et prescription',
    'Certificats médicaux',
    'Suivi personnalisé'],

    providers: [
    {
      id: 1,
      name: 'Dr. Ahmed Trabelsi',
      specialty: 'Médecin généraliste',
      rating: 5.0,
      reviews: 278,
      experience: '22 ans',
      zone: 'Tunis Centre',
      price: 80,
      image: '👨‍⚕️',
      available: true,
      certifications: ['Doctorat médecine', 'Médecine générale', 'Urgences']
    },
    {
      id: 2,
      name: 'Dr. Leila Ben Ali',
      specialty: 'Médecin généraliste',
      rating: 4.9,
      reviews: 234,
      experience: '18 ans',
      zone: 'La Marsa',
      price: 90,
      image: '👩‍⚕️',
      available: true,
      certifications: ['Doctorat médecine', 'Gériatrie', 'Pédiatrie']
    }]

  },
  'chronic-care': {
    title: 'Soins Chroniques à Domicile',
    description:
    'Suivi régulier pour maladies chroniques - Diabète, HTA, cancer',
    icon: '📅',
    color: 'purple',
    priceRange: '150-400 TND/mois',
    features: [
    'Suivi régulier personnalisé',
    'Gestion des traitements',
    'Surveillance médicale',
    'Coordination avec médecins'],

    providers: [
    {
      id: 1,
      name: 'Amira Khelifi',
      specialty: 'Infirmière coordinatrice',
      rating: 5.0,
      reviews: 198,
      experience: '16 ans',
      zone: 'Tunis Centre',
      price: 200,
      image: '👩‍⚕️',
      available: true,
      certifications: ["Diplôme d'État", 'Diabétologie', 'Oncologie']
    },
    {
      id: 2,
      name: 'Karim Mansour',
      specialty: 'Infirmier spécialisé',
      rating: 4.9,
      reviews: 167,
      experience: '14 ans',
      zone: 'Ariana',
      price: 180,
      image: '👨‍⚕️',
      available: true,
      certifications: ["Diplôme d'État", 'Cardiologie', 'Néphrologie']
    }]

  },
  psychology: {
    title: 'Soutien Psychologique',
    description:
    'Accompagnement psychologique à domicile - Dépression, anxiété, aidants',
    icon: '🧠',
    color: 'rose',
    priceRange: '70-100 TND',
    features: [
    'Séances individuelles',
    'Soutien émotionnel',
    'Thérapies adaptées',
    'Suivi régulier'],

    providers: [
    {
      id: 1,
      name: 'Dr. Sonia Mejri',
      specialty: 'Psychologue clinicienne',
      rating: 5.0,
      reviews: 234,
      experience: '18 ans',
      zone: 'Tunis Centre',
      price: 80,
      image: '👩‍⚕️',
      available: true,
      certifications: ['Doctorat psychologie', 'TCC', 'Gériatrie']
    },
    {
      id: 2,
      name: 'Dr. Mohamed Gharbi',
      specialty: 'Psychologue',
      rating: 4.9,
      reviews: 189,
      experience: '15 ans',
      zone: 'La Marsa',
      price: 90,
      image: '👨‍⚕️',
      available: true,
      certifications: [
      'Master psychologie',
      'Thérapie familiale',
      'Burn-out']

    }]

  },
  'medical-companion': {
    title: 'Accompagnement Médical',
    description:
    'Accompagnement hôpital, rendez-vous médicaux, démarches administratives',
    icon: '🤝',
    color: 'teal',
    priceRange: '20-30 TND/h',
    features: [
    'Accompagnement RDV médicaux',
    'Aide aux démarches',
    'Transport et assistance',
    'Soutien moral'],

    providers: [
    {
      id: 1,
      name: 'Fatma Jebali',
      specialty: 'Accompagnante médicale',
      rating: 5.0,
      reviews: 156,
      experience: '12 ans',
      zone: 'Tunis Centre',
      price: 25,
      image: '👩',
      available: true,
      certifications: [
      'Formation accompagnement',
      'Premiers secours',
      "Relation d'aide"]

    },
    {
      id: 2,
      name: 'Ahmed Slimani',
      specialty: 'Accompagnant médical',
      rating: 4.9,
      reviews: 134,
      experience: '10 ans',
      zone: 'Ariana',
      price: 20,
      image: '👨',
      available: true,
      certifications: ['Formation accompagnement', 'Handicap', 'Gériatrie']
    }]

  }
};
export function CareService() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{
    serviceId: string;
  }>();
  const [selectedZone, setSelectedZone] = useState('');
  const config = serviceId ? serviceConfigs[serviceId] : null;
  if (!config) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Service non trouvé
          </h2>
          <p className="text-gray-600 mb-4">Ce service n'existe pas</p>
          <Button onClick={() => navigate('/services')} variant="primary">
            Retour aux services
          </Button>
        </Card>
      </div>);

  }
  const zones = [
  'Tunis Centre',
  'Ariana',
  'La Marsa',
  'Carthage',
  'Manouba',
  'Ben Arous'];

  const filteredProviders = selectedZone ?
  config.providers.filter((p) => p.zone === selectedZone) :
  config.providers;
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 font-medium">
            
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux services
          </button>
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 bg-gradient-to-br from-${config.color}-100 to-${config.color}-200 rounded-2xl flex items-center justify-center text-3xl`}>
              
              {config.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {config.title}
              </h1>
              <p className="text-gray-600">{config.description}</p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Professionnels qualifiés
                </h3>
                <p className="text-sm text-gray-700">
                  Diplômés et expérimentés
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-start gap-3">
              <Clock className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Disponibilité rapide
                </h3>
                <p className="text-sm text-gray-700">
                  Intervention sous 24-48h
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-start gap-3">
              <Heart className="h-6 w-6 text-purple-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Tarifs transparents
                </h3>
                <p className="text-sm text-gray-700">{config.priceRange}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Features */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Services inclus
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {config.features.map((feature, index) =>
            <div key={index} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Filter */}
        <Card className="mb-8">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Zone géographique
          </label>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            
            <option value="">Toutes les zones</option>
            {zones.map((zone) =>
            <option key={zone} value={zone}>
                {zone}
              </option>
            )}
          </select>
        </Card>

        {/* Providers */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {filteredProviders.length} professionnel
            {filteredProviders.length > 1 ? 's' : ''} disponible
            {filteredProviders.length > 1 ? 's' : ''}
          </h2>
        </div>

        <div className="space-y-6">
          {filteredProviders.map((provider) =>
          <Card
            key={provider.id}
            className="hover:shadow-lg transition-shadow">
            
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div
                  className={`w-24 h-24 bg-gradient-to-br from-${config.color}-100 to-${config.color}-200 rounded-2xl flex items-center justify-center text-4xl`}>
                  
                    {provider.image}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {provider.name}
                        </h3>
                        {provider.available &&
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            Disponible
                          </span>
                      }
                      </div>
                      <p className="text-gray-600 mb-2">{provider.specialty}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="font-semibold">
                            {provider.rating}
                          </span>
                          <span>({provider.reviews} avis)</span>
                        </div>
                        <span>•</span>
                        <span>{provider.experience} d'expérience</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{provider.zone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {provider.price} TND
                      </p>
                      <p className="text-xs text-gray-500">par séance</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {provider.certifications.map(
                    (cert: string, index: number) =>
                    <span
                      key={index}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                      
                          <Award className="h-3 w-3" />
                          {cert}
                        </span>

                  )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() =>
                    navigate(`/care-booking/${serviceId}`, {
                      state: {
                        provider,
                        service: config
                      }
                    })
                    }>
                    
                      <Calendar className="h-4 w-4 mr-2" />
                      Réserver
                    </Button>
                    <Button variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Contacter
                    </Button>
                    <Button variant="outline">Voir profil</Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>);

}