/**
 * Services Fallback Data
 * Centralized mock data for healthcare services
 * Used as fallback when API calls fail
 */

import type { Service, SubService, ServiceType } from '../types';

/**
 * Main services catalog
 */
export const servicesData: Service[] = [
{
  id: 'nursing',
  type: 'nursing',
  name: 'Soins Infirmiers',
  description: 'Injections, pansements, perfusions, prise de sang.',
  category: 'medical',
  basePrice: 40,
  currency: 'TND',
  priceUnit: 'séance',
  icon: 'Syringe',
  gradient: 'from-cyan-500 to-blue-500',
  countryCode: 'TN'
},
{
  id: 'elderly',
  type: 'elderly',
  name: 'Aide aux Seniors',
  description: 'Toilette, habillage, repas, compagnie.',
  category: 'daily',
  basePrice: 30,
  currency: 'TND',
  priceUnit: 'heure',
  icon: 'Heart',
  gradient: 'from-rose-500 to-pink-500',
  countryCode: 'TN'
},
{
  id: 'physio',
  type: 'physio',
  name: 'Kinésithérapie',
  description: 'Rééducation motrice, respiratoire, massage.',
  category: 'rehabilitation',
  basePrice: 60,
  currency: 'TND',
  priceUnit: 'séance',
  icon: 'Activity',
  gradient: 'from-blue-500 to-purple-500',
  countryCode: 'TN'
},
{
  id: 'maternity',
  type: 'maternity',
  name: 'Soins Maternité',
  description: 'Suivi post-natal, allaitement, soins bébé.',
  category: 'medical',
  basePrice: 50,
  currency: 'TND',
  priceUnit: 'visite',
  icon: 'Baby',
  gradient: 'from-amber-500 to-orange-500',
  countryCode: 'TN'
},
{
  id: 'checkup',
  type: 'checkup',
  name: 'Bilan de Santé',
  description: 'Prise de constantes, tension, glycémie.',
  category: 'medical',
  basePrice: 25,
  currency: 'TND',
  priceUnit: 'visite',
  icon: 'Thermometer',
  gradient: 'from-green-500 to-emerald-500',
  countryCode: 'TN'
},
{
  id: 'night',
  type: 'night',
  name: 'Garde de Nuit',
  description: 'Surveillance et assistance nocturne (12h).',
  category: 'daily',
  basePrice: 120,
  currency: 'TND',
  priceUnit: 'nuit',
  icon: 'UserCheck',
  gradient: 'from-indigo-500 to-purple-500',
  countryCode: 'TN'
},
{
  id: 'ambulance',
  type: 'ambulance',
  name: 'Assistance Ambulance Privée',
  description: 'Transport médicalisé, hôpital ↔ domicile, inter-cliniques.',
  category: 'medical',
  basePrice: 80,
  maxPrice: 200,
  currency: 'TND',
  priceUnit: 'trajet',
  icon: 'Ambulance',
  gradient: 'from-red-500 to-rose-500',
  badge: 'Premium',
  popular: true,
  countryCode: 'TN'
},
{
  id: 'doctor-home',
  type: 'doctor-home',
  name: 'Médecin à Domicile',
  description: 'Généraliste ou spécialiste. Consultations à domicile.',
  category: 'medical',
  basePrice: 80,
  maxPrice: 120,
  currency: 'TND',
  priceUnit: 'consultation',
  icon: 'Stethoscope',
  gradient: 'from-blue-500 to-cyan-500',
  countryCode: 'TN'
},
{
  id: 'chronic-care',
  type: 'chronic-care',
  name: 'Soins Chroniques à Domicile',
  description: 'Diabète, HTA, cancer. Forfaits hebdomadaires/mensuels.',
  category: 'medical',
  basePrice: 150,
  maxPrice: 400,
  currency: 'TND',
  priceUnit: 'mois',
  icon: 'Calendar',
  gradient: 'from-purple-500 to-pink-500',
  badge: 'Abonnement',
  recurring: true,
  countryCode: 'TN'
},
{
  id: 'medical-companion',
  type: 'medical-companion',
  name: 'Accompagnement Médical',
  description:
  'Accompagnement hôpital, rendez-vous, démarches administratives.',
  category: 'daily',
  basePrice: 20,
  maxPrice: 30,
  currency: 'TND',
  priceUnit: 'heure',
  icon: 'HandHeart',
  gradient: 'from-teal-500 to-cyan-500',
  countryCode: 'TN'
},
{
  id: 'babysitting',
  type: 'babysitting',
  name: 'Baby Sitting / Kids Sitting',
  description: "Garde d'enfants à domicile par des professionnels qualifiés.",
  category: 'daily',
  basePrice: 15,
  maxPrice: 25,
  currency: 'TND',
  priceUnit: 'heure',
  icon: 'Smile',
  gradient: 'from-pink-500 to-rose-500',
  badge: 'Nouveau',
  countryCode: 'TN'
},
{
  id: 'nutrition',
  type: 'nutrition',
  name: 'Nutrition & Repas Adaptés',
  description: 'Repas diabétiques, pauvres en sel, post-hospitalisation.',
  category: 'wellness',
  basePrice: 10,
  maxPrice: 20,
  currency: 'TND',
  priceUnit: 'repas',
  icon: 'UtensilsCrossed',
  gradient: 'from-amber-500 to-yellow-500',
  countryCode: 'TN'
},
{
  id: 'psychology',
  type: 'psychology',
  name: 'Soutien Psychologique',
  description: 'Dépression seniors, aidants familiaux. Séances à domicile.',
  category: 'wellness',
  basePrice: 70,
  maxPrice: 100,
  currency: 'TND',
  priceUnit: 'séance',
  icon: 'Brain',
  gradient: 'from-pink-500 to-rose-500',
  countryCode: 'TN'
},
{
  id: 'laboratory',
  type: 'laboratory',
  name: "Laboratoires d'Analyses",
  description:
  'Analyses médicales, prélèvements à domicile, résultats en ligne.',
  category: 'medical',
  basePrice: 15,
  maxPrice: 150,
  currency: 'TND',
  priceUnit: 'analyse',
  icon: 'FlaskConical',
  gradient: 'from-blue-500 to-indigo-500',
  badge: 'Nouveau',
  countryCode: 'TN'
},
{
  id: 'radiology',
  type: 'radiology',
  name: 'Centre de Radiologie',
  description: 'Radio, échographie, scanner, IRM. Rendez-vous rapides.',
  category: 'medical',
  basePrice: 50,
  maxPrice: 300,
  currency: 'TND',
  priceUnit: 'examen',
  icon: 'Scan',
  gradient: 'from-purple-500 to-violet-500',
  badge: 'Nouveau',
  countryCode: 'TN'
},
{
  id: 'pharmacy',
  type: 'pharmacy',
  name: 'Pharmacie',
  description:
  'Services pharmaceutiques, dépistages, livraison de médicaments.',
  category: 'medical',
  basePrice: 0,
  currency: 'TND',
  priceUnit: 'service',
  icon: 'Pill',
  gradient: 'from-emerald-500 to-teal-500',
  badge: 'Nouveau',
  countryCode: 'TN'
},
{
  id: 'gym',
  type: 'gym',
  name: 'Salles de Sport',
  description:
  'Fitness, musculation, cours collectifs. Abonnements flexibles.',
  category: 'wellness',
  basePrice: 80,
  maxPrice: 200,
  currency: 'TND',
  priceUnit: 'mois',
  icon: 'Trophy',
  gradient: 'from-orange-500 to-amber-500',
  badge: 'Nouveau',
  recurring: true,
  countryCode: 'TN'
},
{
  id: 'funeral',
  type: 'funeral',
  name: 'Services Funéraires',
  description: 'Accompagnement et organisation des obsèques avec dignité.',
  category: 'daily',
  basePrice: 2000,
  currency: 'TND',
  priceUnit: 'forfait',
  icon: 'Flower2',
  gradient: 'from-slate-600 to-slate-700',
  badge: '24h/24',
  countryCode: 'TN'
},
{
  id: 'veterinary',
  type: 'veterinary',
  name: 'Vétérinaire',
  description:
  'Soins vétérinaires, vaccination, chirurgie, toilettage et urgences pour vos animaux.',
  category: 'wellness',
  basePrice: 40,
  maxPrice: 250,
  currency: 'TND',
  priceUnit: 'consultation',
  icon: 'PawPrint',
  gradient: 'from-orange-500 to-amber-600',
  badge: 'Nouveau',
  countryCode: 'TN'
}];


/**
 * Sub-services for detailed service selection
 */
export const subServicesData: Record<ServiceType, SubService[]> = {
  nursing: [
  {
    id: 'injection_im',
    parentServiceType: 'nursing',
    name: 'Injection intramusculaire',
    description: "Administration d'injections IM",
    price: 25,
    currency: 'TND',
    duration: 15
  },
  {
    id: 'injection_iv',
    parentServiceType: 'nursing',
    name: 'Injection intraveineuse',
    description: "Administration d'injections IV",
    price: 35,
    currency: 'TND',
    duration: 20
  },
  {
    id: 'pansement_simple',
    parentServiceType: 'nursing',
    name: 'Pansement simple',
    description: 'Réfection de pansement simple',
    price: 30,
    currency: 'TND',
    duration: 20
  },
  {
    id: 'pansement_complexe',
    parentServiceType: 'nursing',
    name: 'Pansement complexe',
    description: 'Pansement pour plaies complexes ou escarres',
    price: 50,
    currency: 'TND',
    duration: 45
  },
  {
    id: 'perfusion',
    parentServiceType: 'nursing',
    name: 'Perfusion à domicile',
    description: 'Pose et surveillance de perfusion IV',
    price: 60,
    currency: 'TND',
    duration: 60
  },
  {
    id: 'prise_sang',
    parentServiceType: 'nursing',
    name: 'Prise de sang',
    description: 'Prélèvement sanguin à domicile',
    price: 35,
    currency: 'TND',
    duration: 15
  },
  {
    id: 'sonde_urinaire',
    parentServiceType: 'nursing',
    name: 'Sonde urinaire',
    description: 'Pose ou changement de sonde urinaire',
    price: 45,
    currency: 'TND',
    duration: 30
  }],

  elderly: [
  {
    id: 'toilette',
    parentServiceType: 'elderly',
    name: 'Aide à la toilette',
    description: 'Assistance toilette quotidienne complète',
    price: 30,
    currency: 'TND',
    duration: 45
  },
  {
    id: 'habillage',
    parentServiceType: 'elderly',
    name: "Aide à l'habillage",
    description: "Assistance pour s'habiller et se déshabiller",
    price: 20,
    currency: 'TND',
    duration: 30
  },
  {
    id: 'repas',
    parentServiceType: 'elderly',
    name: 'Aide aux repas',
    description: 'Préparation et aide à la prise des repas',
    price: 25,
    currency: 'TND',
    duration: 60
  },
  {
    id: 'compagnie',
    parentServiceType: 'elderly',
    name: 'Compagnie',
    description: 'Présence, conversation et stimulation cognitive',
    price: 20,
    currency: 'TND',
    duration: 60
  },
  {
    id: 'promenade',
    parentServiceType: 'elderly',
    name: 'Accompagnement promenade',
    description: 'Sortie accompagnée pour maintenir la mobilité',
    price: 25,
    currency: 'TND',
    duration: 60
  }],

  physio: [
  {
    id: 'ortho',
    parentServiceType: 'physio',
    name: 'Rééducation orthopédique',
    description: 'Post-fracture, entorse, prothèse',
    price: 60,
    currency: 'TND',
    duration: 45
  },
  {
    id: 'neuro',
    parentServiceType: 'physio',
    name: 'Rééducation neurologique',
    description: 'Post-AVC, Parkinson, sclérose en plaques',
    price: 70,
    currency: 'TND',
    duration: 60
  },
  {
    id: 'respi',
    parentServiceType: 'physio',
    name: 'Kinésithérapie respiratoire',
    description: 'Désencombrement bronchique, BPCO',
    price: 50,
    currency: 'TND',
    duration: 30
  },
  {
    id: 'massage',
    parentServiceType: 'physio',
    name: 'Massage thérapeutique',
    description: 'Décontracturant, drainage lymphatique',
    price: 55,
    currency: 'TND',
    duration: 45
  }],

  maternity: [
  {
    id: 'postnatal',
    parentServiceType: 'maternity',
    name: 'Suivi post-natal',
    description: 'Surveillance mère et bébé après accouchement',
    price: 50,
    currency: 'TND',
    duration: 60
  },
  {
    id: 'allaitement',
    parentServiceType: 'maternity',
    name: 'Conseil allaitement',
    description: "Accompagnement et conseils pour l'allaitement",
    price: 45,
    currency: 'TND',
    duration: 45
  },
  {
    id: 'soins_bebe',
    parentServiceType: 'maternity',
    name: 'Soins du nouveau-né',
    description: 'Bain, soins du cordon, conseils',
    price: 40,
    currency: 'TND',
    duration: 45
  }],

  checkup: [],
  night: [],
  ambulance: [],
  'doctor-home': [],
  'chronic-care': [],
  'medical-companion': [],
  babysitting: [],
  nutrition: [],
  psychology: [],
  laboratory: [],
  radiology: [],
  pharmacy: [],
  gym: [],
  funeral: [],
  veterinary: [
  {
    id: 'vet_consultation',
    parentServiceType: 'veterinary',
    name: 'Consultation générale',
    description: 'Examen clinique complet de votre animal',
    price: 45,
    currency: 'TND',
    duration: 30
  },
  {
    id: 'vet_vaccination',
    parentServiceType: 'veterinary',
    name: 'Vaccination',
    description: 'Vaccins obligatoires et rappels (chien, chat)',
    price: 35,
    currency: 'TND',
    duration: 20
  },
  {
    id: 'vet_sterilisation_chat',
    parentServiceType: 'veterinary',
    name: 'Stérilisation chat',
    description: 'Castration ou ovariectomie féline',
    price: 100,
    currency: 'TND',
    duration: 60
  },
  {
    id: 'vet_sterilisation_chien',
    parentServiceType: 'veterinary',
    name: 'Stérilisation chien',
    description: 'Castration ou ovariectomie canine',
    price: 200,
    currency: 'TND',
    duration: 90
  },
  {
    id: 'vet_detartrage',
    parentServiceType: 'veterinary',
    name: 'Détartrage',
    description: 'Nettoyage dentaire sous anesthésie',
    price: 80,
    currency: 'TND',
    duration: 45
  },
  {
    id: 'vet_urgence',
    parentServiceType: 'veterinary',
    name: 'Urgence vétérinaire',
    description: 'Prise en charge urgente 24h/24',
    price: 120,
    currency: 'TND',
    duration: 60
  },
  {
    id: 'vet_toilettage',
    parentServiceType: 'veterinary',
    name: 'Toilettage',
    description: 'Bain, tonte, coupe griffes, nettoyage oreilles',
    price: 35,
    currency: 'TND',
    duration: 60
  },
  {
    id: 'vet_analyses',
    parentServiceType: 'veterinary',
    name: 'Analyses sanguines',
    description: 'Bilan sanguin complet, dépistage maladies',
    price: 60,
    currency: 'TND',
    duration: 20
  },
  {
    id: 'vet_radiographie',
    parentServiceType: 'veterinary',
    name: 'Radiographie',
    description: 'Imagerie médicale pour diagnostic',
    price: 75,
    currency: 'TND',
    duration: 30
  },
  {
    id: 'vet_chirurgie',
    parentServiceType: 'veterinary',
    name: 'Chirurgie',
    description: 'Interventions chirurgicales diverses',
    price: 300,
    currency: 'TND',
    duration: 120
  },
  {
    id: 'vet_pension',
    parentServiceType: 'veterinary',
    name: 'Pension / Garde',
    description: 'Hébergement et soins pendant votre absence',
    price: 30,
    currency: 'TND',
    duration: 1440
  },
  {
    id: 'vet_identification',
    parentServiceType: 'veterinary',
    name: 'Identification (puce)',
    description: 'Pose de puce électronique et enregistrement',
    price: 50,
    currency: 'TND',
    duration: 15
  }]

};

/**
 * Service categories for filtering
 */
export const serviceCategories = [
{ id: 'all', label: 'Tous', icon: 'Grid3x3' },
{ id: 'medical', label: 'Soins médicaux', icon: 'HeartPulse' },
{ id: 'daily', label: 'Aide à la vie', icon: 'Users' },
{ id: 'rehabilitation', label: 'Rééducation', icon: 'Dumbbell' },
{ id: 'wellness', label: 'Bien-être', icon: 'Sparkles' }];


/**
 * Get services by country code
 */
export function getServicesByCountry(countryCode: string): Service[] {
  return servicesData.filter((s) => s.countryCode === countryCode);
}

/**
 * Get service by ID
 */
export function getServiceById(serviceId: string): Service | undefined {
  return servicesData.find((s) => s.id === serviceId);
}

/**
 * Get service by type
 */
export function getServiceByType(
serviceType: ServiceType)
: Service | undefined {
  return servicesData.find((s) => s.type === serviceType);
}

/**
 * Get sub-services for a service type
 */
export function getSubServices(serviceType: ServiceType): SubService[] {
  return subServicesData[serviceType] || [];
}

/**
 * Get services by category
 */
export function getServicesByCategory(
category: string,
countryCode?: string)
: Service[] {
  let services = servicesData;

  if (countryCode) {
    services = services.filter((s) => s.countryCode === countryCode);
  }

  if (category === 'all') {
    return services;
  }

  return services.filter((s) => s.category === category);
}