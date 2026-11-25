import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Heart,
  MessageCircle,
  Phone,
  Star,
  type LucideIcon,
} from 'lucide-react';

export type HealthConciergeTab = 'chat' | 'requests' | 'history';

export interface ConciergeTeamMember {
  name: string;
  role: string;
  avatar: string;
  specialties: string[];
  available: boolean;
}

export interface ConciergeRequest {
  id: number;
  type: string;
  title: string;
  status: 'completed' | 'in-progress';
  date: string;
  description: string;
}

export interface ConciergeQuickAction {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  path: string;
}

export interface ConciergeStat {
  icon: LucideIcon;
  label: string;
  value: string;
  subtitle: string;
  gradient: string;
}

export interface ConciergeMessage {
  id: number;
  sender: 'concierge' | 'user';
  name?: string;
  text: string;
  time: string;
  avatar?: string;
}

export const conciergeTeam: ConciergeTeamMember[] = [
  {
    name: 'Amira Mansour',
    role: 'Coordinatrice Santé Senior',
    avatar: '👩‍⚕️',
    specialties: ['Coordination soins', 'Urgences', 'Suivi chronique'],
    available: true,
  },
  {
    name: 'Karim Ben Ali',
    role: 'Conseiller Santé',
    avatar: '👨‍⚕️',
    specialties: ['Nutrition', 'Prévention', 'Bien-être'],
    available: true,
  },
];

export const recentRequests: ConciergeRequest[] = [
  {
    id: 1,
    type: 'appointment',
    title: 'Coordination rendez-vous cardiologue',
    status: 'completed',
    date: 'Il y a 2 jours',
    description: 'Rendez-vous confirmé avec Dr. Trabelsi le 20 Jan à 10h',
  },
  {
    id: 2,
    type: 'document',
    title: 'Récupération analyses médicales',
    status: 'in-progress',
    date: 'Il y a 1 jour',
    description: 'En cours de récupération auprès du laboratoire',
  },
  {
    id: 3,
    type: 'advice',
    title: 'Conseil nutrition post-opératoire',
    status: 'completed',
    date: 'Il y a 3 jours',
    description: 'Plan nutritionnel personnalisé envoyé',
  },
];

export const quickActions: ConciergeQuickAction[] = [
  {
    icon: Calendar,
    title: 'Coordonner un RDV',
    description: 'Trouvez et réservez le meilleur spécialiste',
    gradient: 'from-blue-500 to-cyan-500',
    path: '/concierge/coordinate-appointment',
  },
  {
    icon: FileText,
    title: 'Gérer mes documents',
    description: 'Centraliser ordonnances et résultats',
    gradient: 'from-purple-500 to-pink-500',
    path: '/concierge/manage-documents',
  },
  {
    icon: Heart,
    title: 'Plan de soins',
    description: 'Organiser vos soins chroniques',
    gradient: 'from-rose-500 to-red-500',
    path: '/concierge/care-plan',
  },
  {
    icon: Phone,
    title: 'Urgence santé',
    description: 'Assistance immédiate 24/7',
    gradient: 'from-amber-500 to-orange-500',
    path: '/concierge/emergency',
  },
];

export const healthConciergeStats: ConciergeStat[] = [
  {
    icon: CheckCircle2,
    label: 'Demandes traitées',
    value: '24',
    subtitle: 'Ce mois-ci',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Clock,
    label: 'Temps de réponse',
    value: '12min',
    subtitle: 'Moyenne',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Calendar,
    label: 'RDV coordonnés',
    value: '8',
    subtitle: 'Ce mois-ci',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Star,
    label: 'Satisfaction',
    value: '5.0',
    subtitle: 'Note moyenne',
    gradient: 'from-amber-500 to-orange-500',
  },
];

export const conciergeTabs: Array<{
  id: HealthConciergeTab;
  icon: LucideIcon;
  label: string;
}> = [
  { id: 'chat', icon: MessageCircle, label: 'Chat' },
  { id: 'requests', icon: FileText, label: 'Demandes' },
  { id: 'history', icon: Clock, label: 'Historique' },
];

export const initialMessages: ConciergeMessage[] = [
  {
    id: 1,
    sender: 'concierge',
    name: 'Amira',
    text: "Bonjour Mohamed ! Comment puis-je vous aider aujourd'hui ?",
    time: '10:30',
    avatar: '👩‍⚕️',
  },
  {
    id: 2,
    sender: 'user',
    text: "J'ai besoin de prendre rendez-vous avec un cardiologue rapidement",
    time: '10:32',
  },
  {
    id: 3,
    sender: 'concierge',
    name: 'Amira',
    text: 'Parfait ! Je vais vous trouver les meilleurs cardiologues disponibles cette semaine. Avez-vous une préférence de zone géographique ?',
    time: '10:33',
    avatar: '👩‍⚕️',
  },
];
