/**
 * Providers Fallback Data
 * Centralized mock data for healthcare providers
 * Used as fallback when API calls fail
 */

import type { Provider, ProviderFilters, ServiceType } from '../types';

/**
 * Mock providers data
 */
export const providersData: Provider[] = [
{
  id: 'prov-001',
  userId: 'user-001',
  name: 'Amel Ben Youssef',
  email: 'amel.benyoussef@example.com',
  phone: '+216 98 123 456',
  serviceType: 'nursing',
  specialties: [
  'Injections',
  'Pansements',
  'Perfusions',
  'Soins post-opératoires'],

  rating: 4.9,
  reviewCount: 124,
  verified: true,
  available: true,
  location: {
    address: '15 Rue de la Liberté',
    city: 'Tunis',
    region: 'Tunis',
    countryCode: 'TN',
    latitude: 36.8065,
    longitude: 10.1815
  },
  pricing: [
  {
    serviceId: 'injection_im',
    serviceName: 'Injection IM',
    price: 25,
    currency: 'TND',
    unit: 'session'
  },
  {
    serviceId: 'pansement_simple',
    serviceName: 'Pansement simple',
    price: 30,
    currency: 'TND',
    unit: 'session'
  },
  {
    serviceId: 'perfusion',
    serviceName: 'Perfusion',
    price: 60,
    currency: 'TND',
    unit: 'session'
  }],

  subscriptionPlan: 'elite',
  status: 'active',
  experience: 8,
  bio: "Infirmière diplômée d'État avec 8 ans d'expérience en soins à domicile. Spécialisée dans les soins post-opératoires et les perfusions.",
  imageUrl:
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated'],
  countryCode: 'TN',
  createdAt: '2022-03-15T10:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z'
},
{
  id: 'prov-002',
  userId: 'user-002',
  name: 'Karim Dridi',
  email: 'karim.dridi@example.com',
  phone: '+216 97 234 567',
  serviceType: 'nursing',
  specialties: ['Urgences', 'Soins intensifs', 'Injections', 'Surveillance'],
  rating: 4.8,
  reviewCount: 89,
  verified: true,
  available: true,
  location: {
    address: '42 Avenue Habib Bourguiba',
    city: 'Ariana',
    region: 'Ariana',
    countryCode: 'TN',
    latitude: 36.8625,
    longitude: 10.1956
  },
  pricing: [
  {
    serviceId: 'injection_im',
    serviceName: 'Injection IM',
    price: 25,
    currency: 'TND',
    unit: 'session'
  },
  {
    serviceId: 'pansement_complexe',
    serviceName: 'Pansement complexe',
    price: 50,
    currency: 'TND',
    unit: 'session'
  }],

  subscriptionPlan: 'standard',
  status: 'active',
  experience: 12,
  bio: "Infirmier urgentiste avec 12 ans d'expérience. Ancien chef d'équipe aux urgences de l'hôpital Charles Nicolle.",
  imageUrl:
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced'],
  countryCode: 'TN',
  createdAt: '2021-06-10T08:00:00Z',
  updatedAt: '2024-01-18T11:20:00Z'
},
{
  id: 'prov-003',
  userId: 'user-003',
  name: 'Leila Mansour',
  email: 'leila.mansour@example.com',
  phone: '+216 96 345 678',
  serviceType: 'nursing',
  specialties: ['Pédiatrie', 'Soins bébé', 'Vaccinations', 'Allaitement'],
  rating: 5.0,
  reviewCount: 42,
  verified: true,
  available: false,
  location: {
    address: '8 Rue de Carthage',
    city: 'La Marsa',
    region: 'Tunis',
    countryCode: 'TN',
    latitude: 36.8783,
    longitude: 10.3247
  },
  pricing: [
  {
    serviceId: 'soins_bebe',
    serviceName: 'Soins bébé',
    price: 40,
    currency: 'TND',
    unit: 'session'
  },
  {
    serviceId: 'vaccination',
    serviceName: 'Vaccination',
    price: 35,
    currency: 'TND',
    unit: 'session'
  }],

  subscriptionPlan: 'commission',
  status: 'active',
  experience: 6,
  bio: 'Infirmière pédiatrique passionnée par les soins aux tout-petits. Formation spécialisée en néonatologie.',
  imageUrl:
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified'],
  countryCode: 'TN',
  createdAt: '2023-01-20T09:00:00Z',
  updatedAt: '2024-01-15T16:45:00Z'
},
{
  id: 'prov-004',
  userId: 'user-004',
  name: 'Dr. Sami Kallel',
  email: 'sami.kallel@example.com',
  phone: '+216 95 456 789',
  serviceType: 'physio',
  specialties: [
  'Rééducation orthopédique',
  'Kinésithérapie respiratoire',
  'Massage thérapeutique'],

  rating: 4.9,
  reviewCount: 156,
  verified: true,
  available: true,
  location: {
    address: '25 Avenue de la République',
    city: 'Sousse',
    region: 'Sousse',
    countryCode: 'TN',
    latitude: 35.8288,
    longitude: 10.6405
  },
  pricing: [
  {
    serviceId: 'ortho',
    serviceName: 'Rééducation orthopédique',
    price: 60,
    currency: 'TND',
    unit: 'session'
  },
  {
    serviceId: 'respi',
    serviceName: 'Kiné respiratoire',
    price: 50,
    currency: 'TND',
    unit: 'session'
  },
  {
    serviceId: 'massage',
    serviceName: 'Massage thérapeutique',
    price: 55,
    currency: 'TND',
    unit: 'session'
  }],

  subscriptionPlan: 'elite',
  status: 'active',
  experience: 15,
  bio: "Kinésithérapeute diplômé avec 15 ans d'expérience. Spécialiste en rééducation post-traumatique et sportive.",
  imageUrl:
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated', 'premium'],
  countryCode: 'TN',
  createdAt: '2020-09-01T10:00:00Z',
  updatedAt: '2024-01-22T09:15:00Z'
},
{
  id: 'prov-005',
  userId: 'user-005',
  name: 'Fatma Trabelsi',
  email: 'fatma.trabelsi@example.com',
  phone: '+216 94 567 890',
  serviceType: 'elderly',
  specialties: [
  'Aide à la toilette',
  'Aide aux repas',
  'Compagnie',
  'Stimulation cognitive'],

  rating: 4.7,
  reviewCount: 78,
  verified: true,
  available: true,
  location: {
    address: '12 Rue Ibn Khaldoun',
    city: 'Sfax',
    region: 'Sfax',
    countryCode: 'TN',
    latitude: 34.7406,
    longitude: 10.7603
  },
  pricing: [
  {
    serviceId: 'toilette',
    serviceName: 'Aide à la toilette',
    price: 30,
    currency: 'TND',
    unit: 'session'
  },
  {
    serviceId: 'repas',
    serviceName: 'Aide aux repas',
    price: 25,
    currency: 'TND',
    unit: 'session'
  },
  {
    serviceId: 'compagnie',
    serviceName: 'Compagnie',
    price: 20,
    currency: 'TND',
    unit: 'hour'
  }],

  subscriptionPlan: 'standard',
  status: 'active',
  experience: 10,
  bio: "Aide-soignante dévouée avec 10 ans d'expérience auprès des personnes âgées. Patiente et bienveillante.",
  imageUrl:
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced'],
  countryCode: 'TN',
  createdAt: '2021-11-15T11:00:00Z',
  updatedAt: '2024-01-19T13:30:00Z'
},
{
  id: 'prov-006',
  userId: 'user-006',
  name: 'Dr. Amira Ben Ali',
  email: 'amira.benali@example.com',
  phone: '+216 93 678 901',
  serviceType: 'doctor-home',
  specialties: ['Médecine générale', 'Pédiatrie', 'Gériatrie', 'Urgences'],
  rating: 4.8,
  reviewCount: 203,
  verified: true,
  available: true,
  location: {
    address: '5 Avenue Mohamed V',
    city: 'Tunis',
    region: 'Tunis',
    countryCode: 'TN',
    latitude: 36.8008,
    longitude: 10.18
  },
  pricing: [
  {
    serviceId: 'consultation',
    serviceName: 'Consultation générale',
    price: 80,
    currency: 'TND',
    unit: 'visit'
  },
  {
    serviceId: 'consultation_urgente',
    serviceName: 'Consultation urgente',
    price: 120,
    currency: 'TND',
    unit: 'visit'
  }],

  subscriptionPlan: 'elite',
  status: 'active',
  experience: 20,
  bio: "Médecin généraliste avec 20 ans d'expérience. Consultations à domicile pour toute la famille.",
  imageUrl:
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated', 'premium'],
  countryCode: 'TN',
  createdAt: '2019-05-20T08:00:00Z',
  updatedAt: '2024-01-21T10:00:00Z'
},
{
  id: 'prov-007',
  userId: 'user-007',
  name: 'Nadia Gharbi',
  email: 'nadia.gharbi@example.com',
  phone: '+216 92 789 012',
  serviceType: 'maternity',
  specialties: [
  'Suivi post-natal',
  'Allaitement',
  'Soins nouveau-né',
  'Préparation accouchement'],

  rating: 4.9,
  reviewCount: 67,
  verified: true,
  available: true,
  location: {
    address: '18 Rue de Palestine',
    city: 'Ben Arous',
    region: 'Ben Arous',
    countryCode: 'TN',
    latitude: 36.7533,
    longitude: 10.2283
  },
  pricing: [
  {
    serviceId: 'postnatal',
    serviceName: 'Suivi post-natal',
    price: 50,
    currency: 'TND',
    unit: 'visit'
  },
  {
    serviceId: 'allaitement',
    serviceName: 'Conseil allaitement',
    price: 45,
    currency: 'TND',
    unit: 'session'
  },
  {
    serviceId: 'soins_bebe',
    serviceName: 'Soins nouveau-né',
    price: 40,
    currency: 'TND',
    unit: 'session'
  }],

  subscriptionPlan: 'standard',
  status: 'active',
  experience: 7,
  bio: "Sage-femme diplômée spécialisée dans l'accompagnement des jeunes mamans. Certifiée en conseil en lactation.",
  imageUrl:
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'rated'],
  countryCode: 'TN',
  createdAt: '2022-08-10T09:00:00Z',
  updatedAt: '2024-01-17T15:20:00Z'
},
{
  id: 'prov-008',
  userId: 'user-008',
  name: 'Mohamed Jebali',
  email: 'mohamed.jebali@example.com',
  phone: '+216 91 890 123',
  serviceType: 'psychology',
  specialties: [
  'Psychologie clinique',
  'Thérapie cognitive',
  'Accompagnement deuil',
  'Stress et anxiété'],

  rating: 4.8,
  reviewCount: 45,
  verified: true,
  available: true,
  location: {
    address: '30 Avenue de France',
    city: 'Tunis',
    region: 'Tunis',
    countryCode: 'TN',
    latitude: 36.7992,
    longitude: 10.1658
  },
  pricing: [
  {
    serviceId: 'consultation_psy',
    serviceName: 'Consultation psychologique',
    price: 80,
    currency: 'TND',
    unit: 'session'
  },
  {
    serviceId: 'therapie',
    serviceName: 'Séance de thérapie',
    price: 100,
    currency: 'TND',
    unit: 'session'
  }],

  subscriptionPlan: 'commission',
  status: 'active',
  experience: 12,
  bio: "Psychologue clinicien avec 12 ans d'expérience. Spécialisé dans l'accompagnement des personnes âgées et des aidants familiaux.",
  imageUrl:
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced'],
  countryCode: 'TN',
  createdAt: '2021-02-28T10:00:00Z',
  updatedAt: '2024-01-16T12:00:00Z'
},
// Checkup providers
{
  id: 'prov-009',
  userId: 'user-009',
  name: 'Salma Bouazizi',
  email: 'salma.bouazizi@example.com',
  phone: '+216 98 111 222',
  serviceType: 'checkup',
  specialty: 'Bilan de santé',
  specialties: [
  'Prise de constantes',
  'Tension artérielle',
  'Glycémie',
  'Suivi médical'],

  rating: 4.7,
  reviewCount: 89,
  verified: true,
  available: true,
  location: {
    address: '22 Rue de Marseille',
    city: 'Tunis',
    region: 'Tunis',
    countryCode: 'TN',
    latitude: 36.8065,
    longitude: 10.1815
  },
  pricing: [
  {
    serviceId: 'checkup_basic',
    serviceName: 'Bilan de base',
    price: 25,
    currency: 'TND',
    unit: 'visite'
  },
  {
    serviceId: 'checkup_complet',
    serviceName: 'Bilan complet',
    price: 45,
    currency: 'TND',
    unit: 'visite'
  }],

  subscriptionPlan: 'standard',
  status: 'active',
  experience: 5,
  bio: 'Infirmière spécialisée dans les bilans de santé à domicile. Suivi régulier des patients chroniques.',
  imageUrl:
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified'],
  countryCode: 'TN',
  createdAt: '2022-05-10T10:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z'
},
{
  id: 'prov-010',
  userId: 'user-010',
  name: 'Hichem Mrad',
  email: 'hichem.mrad@example.com',
  phone: '+216 97 222 333',
  serviceType: 'checkup',
  specialty: 'Contrôle médical',
  specialties: ['ECG', 'Spirométrie', 'Bilan sanguin', 'Suivi diabète'],
  rating: 4.9,
  reviewCount: 156,
  verified: true,
  available: true,
  location: {
    address: '15 Avenue Habib Thameur',
    city: 'Ariana',
    region: 'Ariana',
    countryCode: 'TN',
    latitude: 36.8625,
    longitude: 10.1956
  },
  pricing: [
  {
    serviceId: 'checkup_cardio',
    serviceName: 'Bilan cardiaque',
    price: 60,
    currency: 'TND',
    unit: 'visite'
  },
  {
    serviceId: 'checkup_diabete',
    serviceName: 'Suivi diabète',
    price: 35,
    currency: 'TND',
    unit: 'visite'
  }],

  subscriptionPlan: 'elite',
  status: 'active',
  experience: 10,
  bio: 'Technicien médical expérimenté. Équipé pour réaliser des bilans complets à domicile.',
  imageUrl:
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated'],
  countryCode: 'TN',
  createdAt: '2021-03-15T10:00:00Z',
  updatedAt: '2024-01-22T09:15:00Z'
},
// Night care providers
{
  id: 'prov-011',
  userId: 'user-011',
  name: 'Rania Chaabane',
  email: 'rania.chaabane@example.com',
  phone: '+216 96 333 444',
  serviceType: 'night',
  specialty: 'Garde de nuit',
  specialties: [
  'Surveillance nocturne',
  'Soins de nuit',
  'Assistance seniors',
  'Urgences'],

  rating: 4.8,
  reviewCount: 67,
  verified: true,
  available: true,
  location: {
    address: '8 Rue de Carthage',
    city: 'La Marsa',
    region: 'Tunis',
    countryCode: 'TN',
    latitude: 36.8783,
    longitude: 10.3247
  },
  pricing: [
  {
    serviceId: 'night_12h',
    serviceName: 'Garde de nuit (12h)',
    price: 120,
    currency: 'TND',
    unit: 'nuit'
  },
  {
    serviceId: 'night_weekend',
    serviceName: 'Garde week-end',
    price: 150,
    currency: 'TND',
    unit: 'nuit'
  }],

  subscriptionPlan: 'standard',
  status: 'active',
  experience: 8,
  bio: 'Aide-soignante expérimentée en garde de nuit. Vigilante et réactive aux besoins des patients.',
  imageUrl:
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced'],
  countryCode: 'TN',
  createdAt: '2022-01-20T09:00:00Z',
  updatedAt: '2024-01-15T16:45:00Z'
},
{
  id: 'prov-012',
  userId: 'user-012',
  name: 'Youssef Hamdi',
  email: 'youssef.hamdi@example.com',
  phone: '+216 95 444 555',
  serviceType: 'night',
  specialty: 'Surveillance médicale nocturne',
  specialties: [
  'Soins intensifs',
  'Post-opératoire',
  'Patients Alzheimer',
  'Soins palliatifs'],

  rating: 4.9,
  reviewCount: 92,
  verified: true,
  available: true,
  location: {
    address: '25 Avenue de la République',
    city: 'Sousse',
    region: 'Sousse',
    countryCode: 'TN',
    latitude: 35.8288,
    longitude: 10.6405
  },
  pricing: [
  {
    serviceId: 'night_medical',
    serviceName: 'Garde médicalisée',
    price: 180,
    currency: 'TND',
    unit: 'nuit'
  }],

  subscriptionPlan: 'elite',
  status: 'active',
  experience: 15,
  bio: 'Infirmier de nuit avec expérience en réanimation. Spécialisé dans les cas complexes.',
  imageUrl:
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated', 'premium'],
  countryCode: 'TN',
  createdAt: '2020-09-01T10:00:00Z',
  updatedAt: '2024-01-22T09:15:00Z'
},
// Ambulance providers
{
  id: 'prov-013',
  userId: 'user-013',
  name: 'Ambulances Carthage',
  email: 'contact@ambulances-carthage.tn',
  phone: '+216 71 123 456',
  serviceType: 'ambulance',
  specialty: 'Transport médicalisé',
  specialties: [
  'Urgences',
  'Transport inter-hôpital',
  'Rapatriement',
  'Événements'],

  rating: 4.7,
  reviewCount: 234,
  verified: true,
  available: true,
  location: {
    address: "45 Rue de l'Hôpital",
    city: 'Tunis',
    region: 'Tunis',
    countryCode: 'TN',
    latitude: 36.8008,
    longitude: 10.18
  },
  pricing: [
  {
    serviceId: 'ambulance_city',
    serviceName: 'Transport urbain',
    price: 80,
    currency: 'TND',
    unit: 'trajet'
  },
  {
    serviceId: 'ambulance_inter',
    serviceName: 'Inter-cliniques',
    price: 150,
    currency: 'TND',
    unit: 'trajet'
  },
  {
    serviceId: 'ambulance_long',
    serviceName: 'Longue distance',
    price: 200,
    currency: 'TND',
    unit: 'trajet'
  }],

  subscriptionPlan: 'elite',
  status: 'active',
  experience: 20,
  bio: "Service d'ambulances privées 24h/24. Flotte moderne et équipée. Personnel médical qualifié.",
  imageUrl:
  'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated', 'premium'],
  countryCode: 'TN',
  createdAt: '2018-05-20T08:00:00Z',
  updatedAt: '2024-01-21T10:00:00Z'
},
{
  id: 'prov-014',
  userId: 'user-014',
  name: 'SOS Ambulances Sfax',
  email: 'sos@ambulances-sfax.tn',
  phone: '+216 74 234 567',
  serviceType: 'ambulance',
  specialty: 'Urgences médicales',
  specialties: [
  'SAMU privé',
  'Réanimation mobile',
  'Transport néonatal',
  'Dialyse'],

  rating: 4.8,
  reviewCount: 178,
  verified: true,
  available: true,
  location: {
    address: '12 Rue Ibn Khaldoun',
    city: 'Sfax',
    region: 'Sfax',
    countryCode: 'TN',
    latitude: 34.7406,
    longitude: 10.7603
  },
  pricing: [
  {
    serviceId: 'ambulance_urgence',
    serviceName: 'Urgence',
    price: 100,
    currency: 'TND',
    unit: 'trajet'
  },
  {
    serviceId: 'ambulance_rea',
    serviceName: 'Réanimation',
    price: 250,
    currency: 'TND',
    unit: 'trajet'
  }],

  subscriptionPlan: 'elite',
  status: 'active',
  experience: 15,
  bio: 'Ambulances médicalisées avec équipe de réanimation. Intervention rapide dans tout le Sud.',
  imageUrl:
  'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated'],
  countryCode: 'TN',
  createdAt: '2019-11-15T11:00:00Z',
  updatedAt: '2024-01-19T13:30:00Z'
},
// Chronic care providers
{
  id: 'prov-015',
  userId: 'user-015',
  name: 'Dr. Ines Khelifi',
  email: 'ines.khelifi@example.com',
  phone: '+216 98 555 666',
  serviceType: 'chronic-care',
  specialty: 'Soins chroniques',
  specialties: ['Diabète', 'Hypertension', 'Insuffisance cardiaque', 'BPCO'],
  rating: 4.9,
  reviewCount: 145,
  verified: true,
  available: true,
  location: {
    address: '18 Rue de Palestine',
    city: 'Ben Arous',
    region: 'Ben Arous',
    countryCode: 'TN',
    latitude: 36.7533,
    longitude: 10.2283
  },
  pricing: [
  {
    serviceId: 'chronic_weekly',
    serviceName: 'Forfait hebdomadaire',
    price: 150,
    currency: 'TND',
    unit: 'semaine'
  },
  {
    serviceId: 'chronic_monthly',
    serviceName: 'Forfait mensuel',
    price: 400,
    currency: 'TND',
    unit: 'mois'
  }],

  subscriptionPlan: 'elite',
  status: 'active',
  experience: 18,
  bio: 'Médecin spécialisée dans le suivi des maladies chroniques à domicile. Approche personnalisée.',
  imageUrl:
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated', 'premium'],
  countryCode: 'TN',
  createdAt: '2019-08-10T09:00:00Z',
  updatedAt: '2024-01-17T15:20:00Z'
},
{
  id: 'prov-016',
  userId: 'user-016',
  name: 'Équipe Soins Chroniques Tunis',
  email: 'contact@soins-chroniques.tn',
  phone: '+216 71 666 777',
  serviceType: 'chronic-care',
  specialty: 'Prise en charge globale',
  specialties: [
  'Oncologie',
  'Dialyse péritonéale',
  'Nutrition entérale',
  'Soins palliatifs'],

  rating: 4.8,
  reviewCount: 98,
  verified: true,
  available: true,
  location: {
    address: '5 Avenue Mohamed V',
    city: 'Tunis',
    region: 'Tunis',
    countryCode: 'TN',
    latitude: 36.8008,
    longitude: 10.18
  },
  pricing: [
  {
    serviceId: 'chronic_cancer',
    serviceName: 'Suivi oncologique',
    price: 300,
    currency: 'TND',
    unit: 'mois'
  },
  {
    serviceId: 'chronic_palliative',
    serviceName: 'Soins palliatifs',
    price: 350,
    currency: 'TND',
    unit: 'mois'
  }],

  subscriptionPlan: 'elite',
  status: 'active',
  experience: 12,
  bio: 'Équipe pluridisciplinaire pour la prise en charge des pathologies lourdes à domicile.',
  imageUrl:
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated'],
  countryCode: 'TN',
  createdAt: '2020-02-28T10:00:00Z',
  updatedAt: '2024-01-16T12:00:00Z'
},
// Medical companion providers
{
  id: 'prov-017',
  userId: 'user-017',
  name: 'Sonia Mejri',
  email: 'sonia.mejri@example.com',
  phone: '+216 97 777 888',
  serviceType: 'medical-companion',
  specialty: 'Accompagnement médical',
  specialties: [
  'Rendez-vous médicaux',
  'Démarches administratives',
  'Traduction médicale',
  'Soutien moral'],

  rating: 4.9,
  reviewCount: 112,
  verified: true,
  available: true,
  location: {
    address: '30 Avenue de France',
    city: 'Tunis',
    region: 'Tunis',
    countryCode: 'TN',
    latitude: 36.7992,
    longitude: 10.1658
  },
  pricing: [
  {
    serviceId: 'companion_rdv',
    serviceName: 'Accompagnement RDV',
    price: 25,
    currency: 'TND',
    unit: 'heure'
  },
  {
    serviceId: 'companion_admin',
    serviceName: 'Démarches admin',
    price: 20,
    currency: 'TND',
    unit: 'heure'
  }],

  subscriptionPlan: 'standard',
  status: 'active',
  experience: 6,
  bio: 'Accompagnatrice médicale dévouée. Je vous aide dans toutes vos démarches de santé.',
  imageUrl:
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'rated'],
  countryCode: 'TN',
  createdAt: '2022-06-15T10:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z'
},
{
  id: 'prov-018',
  userId: 'user-018',
  name: 'Ahmed Sassi',
  email: 'ahmed.sassi@example.com',
  phone: '+216 96 888 999',
  serviceType: 'medical-companion',
  specialty: 'Transport et accompagnement',
  specialties: [
  'Transport médical',
  'Accompagnement hôpital',
  'Aide mobilité réduite',
  'Courses médicales'],

  rating: 4.7,
  reviewCount: 78,
  verified: true,
  available: true,
  location: {
    address: '42 Avenue Habib Bourguiba',
    city: 'Ariana',
    region: 'Ariana',
    countryCode: 'TN',
    latitude: 36.8625,
    longitude: 10.1956
  },
  pricing: [
  {
    serviceId: 'companion_transport',
    serviceName: 'Transport + accompagnement',
    price: 30,
    currency: 'TND',
    unit: 'heure'
  }],

  subscriptionPlan: 'standard',
  status: 'active',
  experience: 8,
  bio: 'Chauffeur accompagnateur avec véhicule adapté PMR. Patient et attentionné.',
  imageUrl:
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced'],
  countryCode: 'TN',
  createdAt: '2021-09-10T08:00:00Z',
  updatedAt: '2024-01-18T11:20:00Z'
},
// Babysitting providers
{
  id: 'prov-019',
  userId: 'user-019',
  name: 'Mariem Gharbi',
  email: 'mariem.gharbi@example.com',
  phone: '+216 95 999 000',
  serviceType: 'babysitting',
  specialty: "Garde d'enfants",
  specialties: [
  'Nourrissons',
  'Enfants 1-3 ans',
  'Activités éveil',
  'Premiers secours'],

  rating: 4.9,
  reviewCount: 134,
  verified: true,
  available: true,
  location: {
    address: '15 Rue de la Liberté',
    city: 'Tunis',
    region: 'Tunis',
    countryCode: 'TN',
    latitude: 36.8065,
    longitude: 10.1815
  },
  pricing: [
  {
    serviceId: 'babysit_day',
    serviceName: 'Garde journée',
    price: 15,
    currency: 'TND',
    unit: 'heure'
  },
  {
    serviceId: 'babysit_night',
    serviceName: 'Garde soirée/nuit',
    price: 20,
    currency: 'TND',
    unit: 'heure'
  }],

  subscriptionPlan: 'standard',
  status: 'active',
  experience: 7,
  bio: "Éducatrice de jeunes enfants diplômée. Passionnée par l'éveil et le développement des tout-petits.",
  imageUrl:
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated'],
  countryCode: 'TN',
  createdAt: '2021-04-20T09:00:00Z',
  updatedAt: '2024-01-15T16:45:00Z'
},
{
  id: 'prov-020',
  userId: 'user-020',
  name: 'Asma Ben Salah',
  email: 'asma.bensalah@example.com',
  phone: '+216 94 000 111',
  serviceType: 'babysitting',
  specialty: 'Kids sitting',
  specialties: [
  'Enfants 3-12 ans',
  'Aide devoirs',
  'Activités créatives',
  'Sport'],

  rating: 4.8,
  reviewCount: 89,
  verified: true,
  available: true,
  location: {
    address: '8 Rue de Carthage',
    city: 'La Marsa',
    region: 'Tunis',
    countryCode: 'TN',
    latitude: 36.8783,
    longitude: 10.3247
  },
  pricing: [
  {
    serviceId: 'kidsit_day',
    serviceName: 'Garde + activités',
    price: 18,
    currency: 'TND',
    unit: 'heure'
  },
  {
    serviceId: 'kidsit_homework',
    serviceName: 'Aide aux devoirs',
    price: 25,
    currency: 'TND',
    unit: 'heure'
  }],

  subscriptionPlan: 'standard',
  status: 'active',
  experience: 5,
  bio: 'Animatrice et enseignante. Je propose des activités ludiques et éducatives adaptées à chaque âge.',
  imageUrl:
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified'],
  countryCode: 'TN',
  createdAt: '2022-09-01T10:00:00Z',
  updatedAt: '2024-01-22T09:15:00Z'
},
// Nutrition providers
{
  id: 'prov-021',
  userId: 'user-021',
  name: 'Restaurant Santé Tunis',
  email: 'contact@restaurant-sante.tn',
  phone: '+216 71 111 222',
  serviceType: 'nutrition',
  specialty: 'Repas adaptés',
  specialties: ['Diabétique', 'Pauvre en sel', 'Sans gluten', 'Végétarien'],
  rating: 4.7,
  reviewCount: 256,
  verified: true,
  available: true,
  location: {
    address: '25 Avenue de la République',
    city: 'Tunis',
    region: 'Tunis',
    countryCode: 'TN',
    latitude: 36.8008,
    longitude: 10.18
  },
  pricing: [
  {
    serviceId: 'meal_single',
    serviceName: 'Repas unitaire',
    price: 15,
    currency: 'TND',
    unit: 'repas'
  },
  {
    serviceId: 'meal_weekly',
    serviceName: 'Forfait semaine',
    price: 90,
    currency: 'TND',
    unit: 'semaine'
  }],

  subscriptionPlan: 'elite',
  status: 'active',
  experience: 10,
  bio: 'Restaurant spécialisé dans les repas thérapeutiques. Livraison à domicile tous les jours.',
  imageUrl:
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated'],
  countryCode: 'TN',
  createdAt: '2020-03-15T10:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z'
},
{
  id: 'prov-022',
  userId: 'user-022',
  name: 'Chef Karim - Cuisine Santé',
  email: 'chef.karim@example.com',
  phone: '+216 98 222 333',
  serviceType: 'nutrition',
  specialty: 'Chef à domicile',
  specialties: [
  'Post-hospitalisation',
  'Régime cardiaque',
  'Cuisine légère',
  'Batch cooking'],

  rating: 4.9,
  reviewCount: 87,
  verified: true,
  available: true,
  location: {
    address: '12 Rue Ibn Khaldoun',
    city: 'Sfax',
    region: 'Sfax',
    countryCode: 'TN',
    latitude: 34.7406,
    longitude: 10.7603
  },
  pricing: [
  {
    serviceId: 'chef_session',
    serviceName: 'Session cuisine (3h)',
    price: 80,
    currency: 'TND',
    unit: 'session'
  },
  {
    serviceId: 'chef_weekly',
    serviceName: 'Préparation semaine',
    price: 150,
    currency: 'TND',
    unit: 'semaine'
  }],

  subscriptionPlan: 'standard',
  status: 'active',
  experience: 12,
  bio: 'Chef cuisinier formé en diététique. Je prépare des repas sains et savoureux chez vous.',
  imageUrl:
  'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated'],
  countryCode: 'TN',
  createdAt: '2021-06-10T08:00:00Z',
  updatedAt: '2024-01-18T11:20:00Z'
},
{
  id: 'prov-023',
  userId: 'user-023',
  name: 'Dr. Nadia Nutritionniste',
  email: 'nadia.nutrition@example.com',
  phone: '+216 97 333 444',
  serviceType: 'nutrition',
  specialty: 'Nutritionniste',
  specialties: [
  'Bilan nutritionnel',
  'Plan alimentaire',
  'Suivi poids',
  'Éducation alimentaire'],

  rating: 4.8,
  reviewCount: 134,
  verified: true,
  available: true,
  location: {
    address: '18 Rue de Palestine',
    city: 'Ben Arous',
    region: 'Ben Arous',
    countryCode: 'TN',
    latitude: 36.7533,
    longitude: 10.2283
  },
  pricing: [
  {
    serviceId: 'nutri_consult',
    serviceName: 'Consultation',
    price: 60,
    currency: 'TND',
    unit: 'séance'
  },
  {
    serviceId: 'nutri_plan',
    serviceName: 'Plan personnalisé',
    price: 120,
    currency: 'TND',
    unit: 'forfait'
  }],

  subscriptionPlan: 'standard',
  status: 'active',
  experience: 8,
  bio: 'Nutritionniste diplômée. Consultations à domicile pour adapter votre alimentation à vos besoins.',
  imageUrl:
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced'],
  countryCode: 'TN',
  createdAt: '2022-01-20T09:00:00Z',
  updatedAt: '2024-01-15T16:45:00Z'
},
// Laboratory providers
{
  id: 'prov-024',
  userId: 'user-024',
  name: 'Laboratoire Central Tunis',
  email: 'contact@labo-central.tn',
  phone: '+216 71 444 555',
  serviceType: 'laboratory',
  specialty: 'Analyses médicales',
  specialties: ['Biochimie', 'Hématologie', 'Sérologie', 'Microbiologie'],
  rating: 4.8,
  reviewCount: 567,
  verified: true,
  available: true,
  location: {
    address: '45 Avenue Habib Bourguiba',
    city: 'Tunis',
    region: 'Tunis',
    countryCode: 'TN',
    latitude: 36.8065,
    longitude: 10.1815
  },
  pricing: [
  {
    serviceId: 'labo_basic',
    serviceName: 'Bilan de base',
    price: 45,
    currency: 'TND',
    unit: 'analyse'
  },
  {
    serviceId: 'labo_complet',
    serviceName: 'Bilan complet',
    price: 120,
    currency: 'TND',
    unit: 'analyse'
  },
  {
    serviceId: 'labo_home',
    serviceName: 'Prélèvement domicile',
    price: 25,
    currency: 'TND',
    unit: 'visite'
  }],

  subscriptionPlan: 'elite',
  status: 'active',
  experience: 25,
  bio: "Laboratoire agréé avec 25 ans d'expérience. Prélèvements à domicile et résultats en ligne.",
  imageUrl:
  'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated', 'premium'],
  countryCode: 'TN',
  createdAt: '2015-05-20T08:00:00Z',
  updatedAt: '2024-01-21T10:00:00Z'
},
{
  id: 'prov-025',
  userId: 'user-025',
  name: 'BioLab Ariana',
  email: 'info@biolab-ariana.tn',
  phone: '+216 71 555 666',
  serviceType: 'laboratory',
  specialty: 'Analyses spécialisées',
  specialties: ['Génétique', 'Hormonologie', 'Allergologie', 'Toxicologie'],
  rating: 4.9,
  reviewCount: 234,
  verified: true,
  available: true,
  location: {
    address: '22 Rue de Marseille',
    city: 'Ariana',
    region: 'Ariana',
    countryCode: 'TN',
    latitude: 36.8625,
    longitude: 10.1956
  },
  pricing: [
  {
    serviceId: 'labo_hormones',
    serviceName: 'Bilan hormonal',
    price: 80,
    currency: 'TND',
    unit: 'analyse'
  },
  {
    serviceId: 'labo_allergie',
    serviceName: 'Tests allergies',
    price: 150,
    currency: 'TND',
    unit: 'analyse'
  }],

  subscriptionPlan: 'elite',
  status: 'active',
  experience: 15,
  bio: 'Laboratoire de pointe spécialisé dans les analyses complexes. Équipement dernière génération.',
  imageUrl:
  'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated'],
  countryCode: 'TN',
  createdAt: '2018-11-15T11:00:00Z',
  updatedAt: '2024-01-19T13:30:00Z'
},
// Radiology providers
{
  id: 'prov-026',
  userId: 'user-026',
  name: 'Centre Imagerie Médicale Tunis',
  email: 'rdv@imagerie-tunis.tn',
  phone: '+216 71 666 777',
  serviceType: 'radiology',
  specialty: 'Imagerie médicale',
  specialties: ['Radiographie', 'Échographie', 'Scanner', 'IRM'],
  rating: 4.8,
  reviewCount: 456,
  verified: true,
  available: true,
  location: {
    address: '30 Avenue de France',
    city: 'Tunis',
    region: 'Tunis',
    countryCode: 'TN',
    latitude: 36.7992,
    longitude: 10.1658
  },
  pricing: [
  {
    serviceId: 'radio_xray',
    serviceName: 'Radiographie',
    price: 50,
    currency: 'TND',
    unit: 'examen'
  },
  {
    serviceId: 'radio_echo',
    serviceName: 'Échographie',
    price: 80,
    currency: 'TND',
    unit: 'examen'
  },
  {
    serviceId: 'radio_scanner',
    serviceName: 'Scanner',
    price: 200,
    currency: 'TND',
    unit: 'examen'
  },
  {
    serviceId: 'radio_irm',
    serviceName: 'IRM',
    price: 350,
    currency: 'TND',
    unit: 'examen'
  }],

  subscriptionPlan: 'elite',
  status: 'active',
  experience: 20,
  bio: "Centre d'imagerie équipé des dernières technologies. Rendez-vous rapides et résultats sous 24h.",
  imageUrl:
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated', 'premium'],
  countryCode: 'TN',
  createdAt: '2016-02-28T10:00:00Z',
  updatedAt: '2024-01-16T12:00:00Z'
},
{
  id: 'prov-027',
  userId: 'user-027',
  name: 'RadioScan Sousse',
  email: 'contact@radioscan-sousse.tn',
  phone: '+216 73 777 888',
  serviceType: 'radiology',
  specialty: 'Radiologie interventionnelle',
  specialties: ['Mammographie', 'Densitométrie', 'Doppler', 'Biopsie guidée'],
  rating: 4.7,
  reviewCount: 189,
  verified: true,
  available: true,
  location: {
    address: '25 Avenue de la République',
    city: 'Sousse',
    region: 'Sousse',
    countryCode: 'TN',
    latitude: 35.8288,
    longitude: 10.6405
  },
  pricing: [
  {
    serviceId: 'radio_mammo',
    serviceName: 'Mammographie',
    price: 70,
    currency: 'TND',
    unit: 'examen'
  },
  {
    serviceId: 'radio_densito',
    serviceName: 'Densitométrie',
    price: 90,
    currency: 'TND',
    unit: 'examen'
  }],

  subscriptionPlan: 'elite',
  status: 'active',
  experience: 12,
  bio: 'Centre spécialisé en imagerie de la femme et ostéoporose. Équipe féminine disponible.',
  imageUrl:
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated'],
  countryCode: 'TN',
  createdAt: '2019-08-10T09:00:00Z',
  updatedAt: '2024-01-17T15:20:00Z'
},
// Pharmacy providers
{
  id: 'prov-028',
  userId: 'user-028',
  name: 'Pharmacie Centrale Tunis',
  email: 'contact@pharmacie-centrale.tn',
  phone: '+216 71 888 999',
  serviceType: 'pharmacy',
  specialty: 'Pharmacie de garde',
  specialties: [
  'Médicaments',
  'Parapharmacie',
  'Matériel médical',
  'Livraison'],

  rating: 4.8,
  reviewCount: 789,
  verified: true,
  available: true,
  location: {
    address: '5 Avenue Mohamed V',
    city: 'Tunis',
    region: 'Tunis',
    countryCode: 'TN',
    latitude: 36.8008,
    longitude: 10.18
  },
  pricing: [
  {
    serviceId: 'pharma_delivery',
    serviceName: 'Livraison',
    price: 5,
    currency: 'TND',
    unit: 'livraison'
  },
  {
    serviceId: 'pharma_conseil',
    serviceName: 'Conseil pharmaceutique',
    price: 0,
    currency: 'TND',
    unit: 'gratuit'
  }],

  subscriptionPlan: 'elite',
  status: 'active',
  experience: 30,
  bio: 'Pharmacie de garde 24h/24. Large stock et livraison rapide dans tout le Grand Tunis.',
  imageUrl:
  'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated', 'premium'],
  countryCode: 'TN',
  createdAt: '2010-05-20T08:00:00Z',
  updatedAt: '2024-01-21T10:00:00Z'
},
{
  id: 'prov-029',
  userId: 'user-029',
  name: 'Pharmacie du Lac',
  email: 'pharma.lac@example.com',
  phone: '+216 71 999 000',
  serviceType: 'pharmacy',
  specialty: 'Pharmacie spécialisée',
  specialties: [
  'Préparations magistrales',
  'Homéopathie',
  'Phytothérapie',
  'Orthopédie'],

  rating: 4.9,
  reviewCount: 345,
  verified: true,
  available: true,
  location: {
    address: '15 Rue du Lac',
    city: 'Tunis',
    region: 'Tunis',
    countryCode: 'TN',
    latitude: 36.8283,
    longitude: 10.2247
  },
  pricing: [
  {
    serviceId: 'pharma_prep',
    serviceName: 'Préparation magistrale',
    price: 20,
    currency: 'TND',
    unit: 'préparation'
  },
  {
    serviceId: 'pharma_ortho',
    serviceName: 'Location matériel',
    price: 10,
    currency: 'TND',
    unit: 'jour'
  }],

  subscriptionPlan: 'standard',
  status: 'active',
  experience: 18,
  bio: 'Pharmacie spécialisée en préparations et médecines alternatives. Conseil personnalisé.',
  imageUrl:
  'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated'],
  countryCode: 'TN',
  createdAt: '2017-11-15T11:00:00Z',
  updatedAt: '2024-01-19T13:30:00Z'
},
// Gym providers
{
  id: 'prov-030',
  userId: 'user-030',
  name: 'FitLife Gym Tunis',
  email: 'contact@fitlife-tunis.tn',
  phone: '+216 71 000 111',
  serviceType: 'gym',
  specialty: 'Fitness & Musculation',
  specialties: [
  'Musculation',
  'Cardio',
  'Cours collectifs',
  'Coaching personnalisé'],

  rating: 4.7,
  reviewCount: 456,
  verified: true,
  available: true,
  location: {
    address: '42 Avenue Habib Bourguiba',
    city: 'Tunis',
    region: 'Tunis',
    countryCode: 'TN',
    latitude: 36.8065,
    longitude: 10.1815
  },
  pricing: [
  {
    serviceId: 'gym_monthly',
    serviceName: 'Abonnement mensuel',
    price: 80,
    currency: 'TND',
    unit: 'mois'
  },
  {
    serviceId: 'gym_quarterly',
    serviceName: 'Abonnement 3 mois',
    price: 200,
    currency: 'TND',
    unit: 'trimestre'
  },
  {
    serviceId: 'gym_coaching',
    serviceName: 'Coaching perso',
    price: 40,
    currency: 'TND',
    unit: 'séance'
  }],

  subscriptionPlan: 'elite',
  status: 'active',
  experience: 10,
  bio: 'Salle de sport moderne avec équipements haut de gamme. Coachs certifiés disponibles.',
  imageUrl:
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated'],
  countryCode: 'TN',
  createdAt: '2019-02-28T10:00:00Z',
  updatedAt: '2024-01-16T12:00:00Z'
},
{
  id: 'prov-031',
  userId: 'user-031',
  name: 'Wellness Center La Marsa',
  email: 'info@wellness-marsa.tn',
  phone: '+216 71 111 222',
  serviceType: 'gym',
  specialty: 'Bien-être & Remise en forme',
  specialties: ['Yoga', 'Pilates', 'Aquagym', 'Spa'],
  rating: 4.9,
  reviewCount: 234,
  verified: true,
  available: true,
  location: {
    address: '8 Rue de Carthage',
    city: 'La Marsa',
    region: 'Tunis',
    countryCode: 'TN',
    latitude: 36.8783,
    longitude: 10.3247
  },
  pricing: [
  {
    serviceId: 'gym_wellness',
    serviceName: 'Abonnement wellness',
    price: 120,
    currency: 'TND',
    unit: 'mois'
  },
  {
    serviceId: 'gym_yoga',
    serviceName: 'Cours yoga',
    price: 25,
    currency: 'TND',
    unit: 'séance'
  },
  {
    serviceId: 'gym_spa',
    serviceName: 'Accès spa',
    price: 50,
    currency: 'TND',
    unit: 'séance'
  }],

  subscriptionPlan: 'elite',
  status: 'active',
  experience: 8,
  bio: 'Centre de bien-être premium avec piscine, spa et cours de yoga. Ambiance zen garantie.',
  imageUrl:
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'rated', 'premium'],
  countryCode: 'TN',
  createdAt: '2020-08-10T09:00:00Z',
  updatedAt: '2024-01-17T15:20:00Z'
},
// Funeral providers
{
  id: 'prov-032',
  userId: 'user-032',
  name: 'Pompes Funèbres El Rahma',
  email: 'contact@elrahma-funeraire.tn',
  phone: '+216 71 222 333',
  serviceType: 'funeral',
  specialty: 'Services funéraires complets',
  specialties: [
  'Organisation obsèques',
  'Transport défunt',
  'Formalités administratives',
  'Rapatriement'],

  rating: 4.9,
  reviewCount: 178,
  verified: true,
  available: true,
  location: {
    address: '15 Rue de la Liberté',
    city: 'Tunis',
    region: 'Tunis',
    countryCode: 'TN',
    latitude: 36.8065,
    longitude: 10.1815
  },
  pricing: [
  {
    serviceId: 'funeral_basic',
    serviceName: 'Forfait essentiel',
    price: 2000,
    currency: 'TND',
    unit: 'forfait'
  },
  {
    serviceId: 'funeral_complete',
    serviceName: 'Forfait complet',
    price: 3500,
    currency: 'TND',
    unit: 'forfait'
  },
  {
    serviceId: 'funeral_rapatriement',
    serviceName: 'Rapatriement',
    price: 5000,
    currency: 'TND',
    unit: 'forfait'
  }],

  subscriptionPlan: 'elite',
  status: 'active',
  experience: 35,
  bio: 'Service funéraire disponible 24h/24. Accompagnement respectueux et professionnel dans ces moments difficiles.',
  imageUrl:
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated', 'premium'],
  countryCode: 'TN',
  createdAt: '2005-05-20T08:00:00Z',
  updatedAt: '2024-01-21T10:00:00Z'
},
{
  id: 'prov-033',
  userId: 'user-033',
  name: 'Services Funéraires Essalem',
  email: 'essalem.funeraire@example.com',
  phone: '+216 71 333 444',
  serviceType: 'funeral',
  specialty: 'Obsèques traditionnelles',
  specialties: ['Toilette rituelle', 'Cercueil', 'Transport', 'Cérémonie'],
  rating: 4.8,
  reviewCount: 145,
  verified: true,
  available: true,
  location: {
    address: '25 Avenue de la République',
    city: 'Sousse',
    region: 'Sousse',
    countryCode: 'TN',
    latitude: 35.8288,
    longitude: 10.6405
  },
  pricing: [
  {
    serviceId: 'funeral_tradition',
    serviceName: 'Obsèques traditionnelles',
    price: 2500,
    currency: 'TND',
    unit: 'forfait'
  },
  {
    serviceId: 'funeral_transport',
    serviceName: 'Transport seul',
    price: 500,
    currency: 'TND',
    unit: 'trajet'
  }],

  subscriptionPlan: 'standard',
  status: 'active',
  experience: 20,
  bio: "Organisation d'obsèques dans le respect des traditions. Service disponible dans tout le Sahel.",
  imageUrl:
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=300&h=300',
  badges: ['verified', 'experienced', 'rated'],
  countryCode: 'TN',
  createdAt: '2012-11-15T11:00:00Z',
  updatedAt: '2024-01-19T13:30:00Z'
}];


/**
 * Get providers by country code
 */
export function getProvidersByCountry(countryCode: string): Provider[] {
  return providersData.filter((p) => p.countryCode === countryCode);
}

/**
 * Get provider by ID
 */
export function getProviderById(providerId: string): Provider | undefined {
  return providersData.find((p) => p.id === providerId);
}

/**
 * Get providers by service type
 */
export function getProvidersByServiceType(
serviceType: ServiceType,
countryCode?: string)
: Provider[] {
  let providers = providersData.filter((p) => p.serviceType === serviceType);

  if (countryCode) {
    providers = providers.filter((p) => p.countryCode === countryCode);
  }

  return providers;
}

/**
 * Filter providers based on criteria
 */
export function filterProviders(
filters: ProviderFilters,
countryCode?: string)
: Provider[] {
  let providers = [...providersData];

  // Filter by country
  if (countryCode) {
    providers = providers.filter((p) => p.countryCode === countryCode);
  }

  // Filter by service type
  if (filters.serviceType) {
    providers = providers.filter((p) => p.serviceType === filters.serviceType);
  }

  // Filter by city
  if (filters.city) {
    providers = providers.filter((p) =>
    p.location.city.toLowerCase().includes(filters.city!.toLowerCase())
    );
  }

  // Filter by minimum rating
  if (filters.minRating !== undefined) {
    providers = providers.filter((p) => p.rating >= filters.minRating!);
  }

  // Filter by availability
  if (filters.available !== undefined) {
    providers = providers.filter((p) => p.available === filters.available);
  }

  // Filter by verified status
  if (filters.verified !== undefined) {
    providers = providers.filter((p) => p.verified === filters.verified);
  }

  // Sort results
  if (filters.sortBy) {
    const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;

    providers.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return (b.rating - a.rating) * sortOrder;
        case 'reviews':
          return (b.reviewCount - a.reviewCount) * sortOrder;
        case 'price':
          const priceA = a.pricing[0]?.price || 0;
          const priceB = b.pricing[0]?.price || 0;
          return (priceA - priceB) * sortOrder;
        default:
          return 0;
      }
    });
  }

  // Pagination
  if (filters.page !== undefined && filters.limit !== undefined) {
    const start = (filters.page - 1) * filters.limit;
    const end = start + filters.limit;
    providers = providers.slice(start, end);
  }

  return providers;
}

/**
 * Search providers by name or specialty
 */
export function searchProviders(
query: string,
countryCode?: string)
: Provider[] {
  const searchTerm = query.toLowerCase();

  let providers = providersData.filter(
    (p) =>
    p.name.toLowerCase().includes(searchTerm) ||
    p.specialties.some((s) => s.toLowerCase().includes(searchTerm)) ||
    p.location.city.toLowerCase().includes(searchTerm)
  );

  if (countryCode) {
    providers = providers.filter((p) => p.countryCode === countryCode);
  }

  return providers;
}

/**
 * Get available providers for a service type
 */
export function getAvailableProviders(
serviceType: ServiceType,
countryCode?: string)
: Provider[] {
  return filterProviders(
    {
      serviceType,
      available: true,
      verified: true,
      sortBy: 'rating',
      sortOrder: 'desc'
    },
    countryCode
  );
}

/**
 * Get top-rated providers
 */
export function getTopRatedProviders(
limit: number = 5,
countryCode?: string)
: Provider[] {
  let providers = [...providersData];

  if (countryCode) {
    providers = providers.filter((p) => p.countryCode === countryCode);
  }

  return providers.
  filter((p) => p.verified && p.status === 'active').
  sort((a, b) => b.rating - a.rating).
  slice(0, limit);
}