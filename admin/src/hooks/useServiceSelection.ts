/**
 * Service Selection Hooks
 * Custom React hooks for service selection page data
 */

import { useApi } from './useApi';
import {
  Stethoscope,
  Baby,
  Heart,
  Activity,
  Syringe,
  Thermometer,
  UserCheck,
  Grid3x3,
  HeartPulse,
  Users,
  Dumbbell,
  Ambulance,
  Calendar,
  HandHeart,
  UtensilsCrossed,
  Brain,
  FlaskConical,
  Scan,
  Trophy } from
'lucide-react';

// ============================================
// TYPES
// ============================================

export interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  price: string;
  icon: React.ElementType;
  color: 'teal' | 'rose' | 'blue' | 'amber' | 'red' | 'purple';
  badge?: string;
  popular?: boolean;
  recurring?: boolean;
}

export interface ServiceFilter {
  id: string;
  label: string;
  icon: React.ElementType;
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_SERVICES: ServiceItem[] = [
{
  id: 'nursing',
  title: 'Soins Infirmiers',
  desc: 'Injections, pansements, perfusions, prise de sang.',
  price: '40 TND',
  icon: Syringe,
  color: 'teal'
},
{
  id: 'elderly',
  title: 'Aide aux Seniors',
  desc: 'Toilette, habillage, repas, compagnie.',
  price: '30 TND',
  icon: Heart,
  color: 'rose'
},
{
  id: 'physio',
  title: 'Kinésithérapie',
  desc: 'Rééducation motrice, respiratoire, massage.',
  price: '60 TND',
  icon: Activity,
  color: 'blue'
},
{
  id: 'maternity',
  title: 'Soins Maternité',
  desc: 'Suivi post-natal, allaitement, soins bébé.',
  price: '50 TND',
  icon: Baby,
  color: 'amber'
},
{
  id: 'checkup',
  title: 'Bilan de Santé',
  desc: 'Prise de constantes, tension, glycémie.',
  price: '25 TND',
  icon: Thermometer,
  color: 'teal'
},
{
  id: 'night',
  title: 'Garde de Nuit',
  desc: 'Surveillance et assistance nocturne (12h).',
  price: '120 TND',
  icon: UserCheck,
  color: 'rose'
},
{
  id: 'ambulance',
  title: 'Assistance Ambulance Privée',
  desc: 'Transport médicalisé, hôpital ↔ domicile, inter-cliniques.',
  price: '80-200 TND',
  icon: Ambulance,
  color: 'red',
  badge: 'Premium',
  popular: true
},
{
  id: 'doctor-home',
  title: 'Médecin à Domicile',
  desc: 'Généraliste ou spécialiste. Consultations à domicile.',
  price: '80-120 TND',
  icon: Stethoscope,
  color: 'blue',
  badge: 'Vérifié'
},
{
  id: 'chronic-care',
  title: 'Soins Chroniques à Domicile',
  desc: 'Diabète, HTA, cancer. Forfaits hebdomadaires/mensuels.',
  price: '150-400 TND/mois',
  icon: Calendar,
  color: 'purple',
  badge: 'Abonnement',
  recurring: true
},
{
  id: 'medical-companion',
  title: 'Accompagnement Médical',
  desc: 'Accompagnement hôpital, rendez-vous, démarches administratives.',
  price: '20-30 TND/h',
  icon: HandHeart,
  color: 'teal'
},
{
  id: 'nutrition',
  title: 'Nutrition & Repas Adaptés',
  desc: 'Repas diabétiques, pauvres en sel, post-hospitalisation.',
  price: '10-20 TND/repas',
  icon: UtensilsCrossed,
  color: 'amber'
},
{
  id: 'psychology',
  title: 'Soutien Psychologique',
  desc: 'Dépression seniors, aidants familiaux. Séances à domicile.',
  price: '70-100 TND',
  icon: Brain,
  color: 'rose'
},
{
  id: 'laboratory',
  title: "Laboratoires d'Analyses",
  desc: 'Analyses médicales, prélèvements à domicile, résultats en ligne.',
  price: '15-150 TND',
  icon: FlaskConical,
  color: 'blue',
  badge: 'Nouveau'
},
{
  id: 'radiology',
  title: 'Centre de Radiologie',
  desc: 'Radio, échographie, scanner, IRM. Rendez-vous rapides.',
  price: '50-300 TND',
  icon: Scan,
  color: 'purple',
  badge: 'Nouveau'
},
{
  id: 'gym',
  title: 'Salles de Sport',
  desc: 'Fitness, musculation, cours collectifs. Abonnements flexibles.',
  price: '80-200 TND/mois',
  icon: Trophy,
  color: 'amber',
  badge: 'Nouveau',
  recurring: true
}];


const MOCK_FILTERS: ServiceFilter[] = [
{ id: 'all', label: 'Tous', icon: Grid3x3 },
{ id: 'medical', label: 'Soins médicaux', icon: HeartPulse },
{ id: 'daily', label: 'Aide à la vie', icon: Users },
{ id: 'rehab', label: 'Rééducation', icon: Dumbbell }];


// ============================================
// HOOKS
// ============================================

/**
 * Hook for fetching services list
 */
export function useServicesList() {
  return useApi<ServiceItem[]>(() => Promise.resolve(MOCK_SERVICES), []);
}

/**
 * Hook for fetching service filters
 */
export function useServiceFilters() {
  return useApi<ServiceFilter[]>(() => Promise.resolve(MOCK_FILTERS), []);
}