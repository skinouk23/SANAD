import React, { useState, Fragment } from 'react';
import {
  HeartHandshakeIcon,
  SearchIcon,
  FilterIcon,
  PlusIcon,
  MapPinIcon,
  CalendarIcon,
  StarIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  XIcon,
  UploadIcon,
  CheckCircleIcon,
  ClockIcon,
  PackageIcon,
  PillIcon,
  ChevronRightIcon,
  UsersIcon,
  TrendingUpIcon,
  BadgeCheckIcon,
  FileTextIcon,
  InfoIcon,
  ArrowRightIcon } from
'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
type Tab = 'browse' | 'post' | 'my-requests' | 'my-donations';
type Category = 'all' | 'medication' | 'equipment';
type MedSubCategory = 'cancer' | 'alzheimer' | 'chronic' | 'other';
type EquipSubCategory =
'wheelchair' |
'walker' |
'bed' |
'oxygen' |
'crutches' |
'other';
type DonationStatus = 'available' | 'reserved' | 'given';
interface Donation {
  id: string;
  type: 'medication' | 'equipment';
  name: string;
  brand?: string;
  category: string;
  condition: 'new' | 'very-good' | 'good';
  quantity: number;
  unit: string;
  location: string;
  expiryDate?: string;
  requiresPrescription: boolean;
  status: DonationStatus;
  donorName: string;
  donorRating: number;
  donorVerified: boolean;
  donorBadge?: string;
  postedDate: string;
  description?: string;
  image?: string;
}
const MOCK_DONATIONS: Donation[] = [
{
  id: '1',
  type: 'medication',
  name: 'Imatinib 400mg',
  brand: 'Gleevec',
  category: 'Cancer',
  condition: 'new',
  quantity: 30,
  unit: 'comprimés',
  location: 'Tunis',
  expiryDate: '2026-08',
  requiresPrescription: true,
  status: 'available',
  donorName: 'Famille Ben Salah',
  donorRating: 4.9,
  donorVerified: true,
  donorBadge: 'Donateur solidaire',
  postedDate: '2025-02-20',
  description:
  'Médicament non ouvert, suite au décès de notre père. Peut aider une famille dans le besoin.'
},
{
  id: '2',
  type: 'equipment',
  name: 'Fauteuil roulant manuel',
  brand: 'Invacare',
  category: 'Mobilité',
  condition: 'very-good',
  quantity: 1,
  unit: 'unité',
  location: 'Sfax',
  requiresPrescription: false,
  status: 'available',
  donorName: 'Ahmed Trabelsi',
  donorRating: 4.7,
  donorVerified: true,
  donorBadge: 'Donateur solidaire',
  postedDate: '2025-02-18',
  description: 'Fauteuil en très bon état, utilisé 6 mois. Pliable, léger.'
},
{
  id: '3',
  type: 'medication',
  name: 'Donepezil 10mg',
  brand: 'Aricept',
  category: 'Alzheimer',
  condition: 'new',
  quantity: 28,
  unit: 'comprimés',
  location: 'Sousse',
  expiryDate: '2026-05',
  requiresPrescription: true,
  status: 'available',
  donorName: 'Mme. Fatma Khelifi',
  donorRating: 5.0,
  donorVerified: true,
  postedDate: '2025-02-15',
  description: 'Boîte complète non ouverte.'
},
{
  id: '4',
  type: 'equipment',
  name: 'Déambulateur avec roues',
  brand: 'Drive Medical',
  category: 'Mobilité',
  condition: 'good',
  quantity: 1,
  unit: 'unité',
  location: 'Ariana',
  requiresPrescription: false,
  status: 'reserved',
  donorName: 'Sami Boughanmi',
  donorRating: 4.5,
  donorVerified: false,
  postedDate: '2025-02-10',
  description: 'Déambulateur 4 roues avec frein. Bon état général.'
},
{
  id: '5',
  type: 'medication',
  name: 'Metformine 1000mg',
  brand: 'Glucophage',
  category: 'Diabète',
  condition: 'new',
  quantity: 60,
  unit: 'comprimés',
  location: 'Monastir',
  expiryDate: '2026-11',
  requiresPrescription: true,
  status: 'available',
  donorName: 'Dr. Leila Mansouri',
  donorRating: 4.8,
  donorVerified: true,
  donorBadge: 'Professionnel de santé',
  postedDate: '2025-02-22',
  description: 'Médicament pour diabète type 2. Boîtes non ouvertes.'
},
{
  id: '6',
  type: 'equipment',
  name: 'Lit médicalisé électrique',
  brand: 'Stiegelmeyer',
  category: 'Confort',
  condition: 'good',
  quantity: 1,
  unit: 'unité',
  location: 'Nabeul',
  requiresPrescription: false,
  status: 'available',
  donorName: 'Famille Chaabane',
  donorRating: 4.6,
  donorVerified: true,
  postedDate: '2025-02-12',
  description: 'Lit 3 fonctions avec télécommande. Matelas inclus.'
}];

const MOCK_MY_REQUESTS = [
{
  id: 'r1',
  donationName: 'Fauteuil roulant manuel',
  donorName: 'Ahmed Trabelsi',
  requestDate: '2025-02-19',
  status: 'pending' as const,
  message: 'Ma mère a besoin de ce fauteuil suite à une fracture.'
},
{
  id: 'r2',
  donationName: 'Imatinib 400mg',
  donorName: 'Famille Ben Salah',
  requestDate: '2025-02-10',
  status: 'accepted' as const,
  message: 'Traitement pour mon père atteint de leucémie.'
}];

const MOCK_MY_DONATIONS = [
{
  id: 'd1',
  name: 'Béquilles aluminium',
  type: 'equipment',
  status: 'given' as DonationStatus,
  postedDate: '2025-01-15',
  requests: 3
}];

const statusConfig = {
  available: {
    label: 'Disponible',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    darkColor: 'text-emerald-400',
    darkBg: 'bg-emerald-500/10',
    darkBorder: 'border-emerald-500/30'
  },
  reserved: {
    label: 'Réservé',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    darkColor: 'text-amber-400',
    darkBg: 'bg-amber-500/10',
    darkBorder: 'border-amber-500/30'
  },
  given: {
    label: 'Donné',
    color: 'text-slate-500',
    bg: 'bg-slate-100',
    border: 'border-slate-200',
    darkColor: 'text-slate-400',
    darkBg: 'bg-slate-700',
    darkBorder: 'border-slate-600'
  }
};
const conditionLabels = {
  new: 'Neuf',
  'very-good': 'Très bon état',
  good: 'Bon état'
};
function DonationCard({
  donation,
  isDark,
  onRequest




}: {donation: Donation;isDark: boolean;onRequest: (d: Donation) => void;}) {
  const status = statusConfig[donation.status];
  const isMed = donation.type === 'medication';
  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-all group ${isDark ? 'bg-slate-800/60 border-slate-700/60 hover:border-emerald-500/40' : 'bg-white border-slate-200 hover:border-emerald-400/60 shadow-sm hover:shadow-md'}`}>
      
      {/* Color band top */}
      <div
        className={`h-1.5 w-full ${isMed ? 'bg-gradient-to-r from-rose-400 to-pink-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`} />
      

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isMed ? isDark ? 'bg-rose-500/20' : 'bg-rose-50' : isDark ? 'bg-emerald-500/20' : 'bg-emerald-50'}`}>
              
              {isMed ?
              <PillIcon
                className={`h-5 w-5 ${isDark ? 'text-rose-400' : 'text-rose-500'}`} /> :


              <PackageIcon
                className={`h-5 w-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />

              }
            </div>
            <div>
              <h3
                className={`font-bold text-sm leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {donation.name}
              </h3>
              {donation.brand &&
              <p
                className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                
                  {donation.brand}
                </p>
              }
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${isDark ? `${status.darkBg} ${status.darkColor} ${status.darkBorder}` : `${status.bg} ${status.color} ${status.border}`}`}>
            
            {status.label}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
            
            {donation.category}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
            
            {conditionLabels[donation.condition]}
          </span>
          {donation.requiresPrescription &&
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
            
              📋 Ordonnance requise
            </span>
          }
        </div>

        {/* Details */}
        <div
          className={`space-y-1.5 mb-4 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          
          <div className="flex items-center gap-1.5">
            <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{donation.location}</span>
            <span className="mx-1">•</span>
            <span>
              {donation.quantity} {donation.unit}
            </span>
          </div>
          {donation.expiryDate &&
          <div className="flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Expire : {donation.expiryDate}</span>
            </div>
          }
        </div>

        {/* Donor */}
        <div
          className={`flex items-center justify-between pt-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
          
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              
              {donation.donorName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span
                  className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                  {donation.donorName}
                </span>
                {donation.donorVerified &&
                <ShieldCheckIcon className="h-3 w-3 text-emerald-500" />
                }
              </div>
              <div className="flex items-center gap-0.5">
                <StarIcon className="h-3 w-3 text-amber-400 fill-amber-400" />
                <span
                  className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  
                  {donation.donorRating}
                </span>
              </div>
            </div>
          </div>
          {donation.status === 'available' &&
          <button
            onClick={() => onRequest(donation)}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
            
              Demander
            </button>
          }
        </div>
      </div>
    </div>);

}
export function CyberMedDonation() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('browse');
  const [categoryFilter, setCategoryFilter] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [postStep, setPostStep] = useState(1);
  const [requestMessage, setRequestMessage] = useState('');
  const [postForm, setPostForm] = useState({
    type: 'medication',
    name: '',
    brand: '',
    category: '',
    condition: 'new',
    quantity: '',
    unit: 'comprimés',
    location: '',
    expiryDate: '',
    requiresPrescription: false,
    description: ''
  });
  const filteredDonations = MOCK_DONATIONS.filter((d) => {
    const matchesCategory =
    categoryFilter === 'all' ||
    d.type === (categoryFilter === 'medication' ? 'medication' : 'equipment');
    const matchesSearch =
    !searchQuery ||
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const handleRequest = (donation: Donation) => {
    setSelectedDonation(donation);
    setShowRequestModal(true);
  };
  const tabs: {
    id: Tab;
    label: string;
    icon: string;
  }[] = [
  {
    id: 'browse',
    label: 'Parcourir',
    icon: '🔍'
  },
  {
    id: 'post',
    label: 'Publier un don',
    icon: '🤝'
  },
  {
    id: 'my-requests',
    label: 'Mes demandes',
    icon: '📋'
  },
  {
    id: 'my-donations',
    label: 'Mes dons',
    icon: '💚'
  }];

  const inputClass = `w-full px-4 py-2.5 border rounded-xl text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none'}`;
  return (
    <div className={`min-h-screen pb-24 ${isDark ? '' : ''}`}>
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Decorative hearts */}
        <div className="absolute top-4 right-8 text-4xl opacity-10 rotate-12">
          💚
        </div>
        <div className="absolute top-12 right-24 text-2xl opacity-10 -rotate-6">
          🤝
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <HeartHandshakeIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-emerald-200 text-xs font-semibold uppercase tracking-widest">
                Plateforme solidaire
              </p>
              <h1 className="text-2xl font-bold text-white leading-tight">
                Don de Médicaments & Matériel
              </h1>
            </div>
          </div>
          <p className="text-emerald-100 text-sm max-w-lg mb-6">
            Donnez une seconde vie à vos médicaments et équipements médicaux.
            Aidez des familles dans le besoin gratuitement.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/20">
              <div className="text-2xl font-bold text-white">247</div>
              <div className="text-emerald-200 text-xs">Dons réalisés</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/20">
              <div className="text-2xl font-bold text-white">183</div>
              <div className="text-emerald-200 text-xs">Bénéficiaires</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/20">
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-emerald-200 text-xs">Villes actives</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal disclaimer banner */}
      <div
        className={`border-b px-6 py-3 ${isDark ? 'bg-amber-900/20 border-amber-700/30' : 'bg-amber-50 border-amber-200'}`}>
        
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <AlertTriangleIcon
            className={`h-4 w-4 flex-shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
          
          <p
            className={`text-xs flex-1 ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
            
            <strong>Avertissement légal :</strong> Le don de médicaments est
            soumis à la réglementation tunisienne. Tous les dons sont vérifiés
            par notre équipe. Les médicaments lourds transitent via des
            pharmacies partenaires.
          </p>
          <button
            onClick={() => setShowLegalModal(true)}
            className={`text-xs font-semibold underline flex-shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
            
            En savoir plus
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div
          className={`flex gap-1 p-1 rounded-2xl mb-6 overflow-x-auto scrollbar-hide ${isDark ? 'bg-slate-800/60' : 'bg-slate-100'}`}>
          
          {tabs.map((tab) =>
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${activeTab === tab.id ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20' : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
            
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          )}
        </div>

        {/* BROWSE TAB */}
        {activeTab === 'browse' &&
        <div className="space-y-5">
            {/* Search + Filter */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <SearchIcon
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              
                <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher médicament, équipement, ville..."
                className={`${inputClass} pl-10`} />
              
              </div>
            </div>

            {/* Category filters */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {[
            {
              id: 'all' as Category,
              label: '🏥 Tout',
              count: MOCK_DONATIONS.length
            },
            {
              id: 'medication' as Category,
              label: '💊 Médicaments',
              count: MOCK_DONATIONS.filter((d) => d.type === 'medication').
              length
            },
            {
              id: 'equipment' as Category,
              label: '🦽 Matériel',
              count: MOCK_DONATIONS.filter((d) => d.type === 'equipment').
              length
            }].
            map((cat) =>
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all flex-shrink-0 ${categoryFilter === cat.id ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-transparent shadow-md' : isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-emerald-500/50' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-400'}`}>
              
                  {cat.label}
                  <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${categoryFilter === cat.id ? 'bg-white/20' : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                
                    {cat.count}
                  </span>
                </button>
            )}
            </div>

            {/* Results */}
            <div>
              <p
              className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              
                {filteredDonations.length} annonce
                {filteredDonations.length > 1 ? 's' : ''} disponible
                {filteredDonations.length > 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDonations.map((donation) =>
              <DonationCard
                key={donation.id}
                donation={donation}
                isDark={isDark}
                onRequest={handleRequest} />

              )}
              </div>
              {filteredDonations.length === 0 &&
            <div
              className={`text-center py-16 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              
                  <div className="text-4xl mb-3">🔍</div>
                  <p
                className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                
                    Aucun résultat trouvé
                  </p>
                  <p
                className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                
                    Essayez d'autres mots-clés
                  </p>
                </div>
            }
            </div>
          </div>
        }

        {/* POST A DONATION TAB */}
        {activeTab === 'post' &&
        <div className="space-y-5">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3].map((step) =>
            <Fragment key={step}>
                  <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${postStep >= step ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' : isDark ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400'}`}>
                
                    {postStep > step ? '✓' : step}
                  </div>
                  {step < 3 &&
              <div
                className={`flex-1 h-0.5 rounded-full ${postStep > step ? 'bg-emerald-500' : isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

              }
                </Fragment>
            )}
            </div>
            <div
            className={`flex justify-between text-xs mb-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            
              <span
              className={
              postStep >= 1 ?
              isDark ?
              'text-emerald-400' :
              'text-emerald-600' :
              ''
              }>
              
                Catégorie
              </span>
              <span
              className={
              postStep >= 2 ?
              isDark ?
              'text-emerald-400' :
              'text-emerald-600' :
              ''
              }>
              
                Détails
              </span>
              <span
              className={
              postStep >= 3 ?
              isDark ?
              'text-emerald-400' :
              'text-emerald-600' :
              ''
              }>
              
                Confirmation
              </span>
            </div>

            <div
            className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            
              {postStep === 1 &&
            <div className="space-y-5">
                  <h3
                className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                    Que souhaitez-vous donner ?
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                  onClick={() =>
                  setPostForm((f) => ({
                    ...f,
                    type: 'medication'
                  }))
                  }
                  className={`p-5 rounded-2xl border-2 text-center transition-all ${postForm.type === 'medication' ? 'border-rose-400 bg-rose-50 dark:bg-rose-500/10' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                  
                      <div className="text-3xl mb-2">💊</div>
                      <p
                    className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        Médicament
                      </p>
                      <p
                    className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                        Cancer, Alzheimer, Chronique...
                      </p>
                    </button>
                    <button
                  onClick={() =>
                  setPostForm((f) => ({
                    ...f,
                    type: 'equipment'
                  }))
                  }
                  className={`p-5 rounded-2xl border-2 text-center transition-all ${postForm.type === 'equipment' ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                  
                      <div className="text-3xl mb-2">🦽</div>
                      <p
                    className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        Matériel
                      </p>
                      <p
                    className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                        Fauteuil, béquilles, lit...
                      </p>
                    </button>
                  </div>

                  <div>
                    <label
                  className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                      Catégorie spécifique
                    </label>
                    <select
                  value={postForm.category}
                  onChange={(e) =>
                  setPostForm((f) => ({
                    ...f,
                    category: e.target.value
                  }))
                  }
                  className={inputClass}>
                  
                      <option value="">Sélectionner...</option>
                      {postForm.type === 'medication' ?
                  <>
                          <option>Cancer / Oncologie</option>
                          <option>Alzheimer / Démence</option>
                          <option>Diabète</option>
                          <option>Hypertension</option>
                          <option>Cardiologie</option>
                          <option>Autre maladie chronique</option>
                        </> :

                  <>
                          <option>Fauteuil roulant</option>
                          <option>Béquilles</option>
                          <option>Déambulateur</option>
                          <option>Lit médicalisé</option>
                          <option>Concentrateur d'oxygène</option>
                          <option>Autre matériel</option>
                        </>
                  }
                    </select>
                  </div>

                  <button
                onClick={() => setPostStep(2)}
                disabled={!postForm.category}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
                
                    Continuer →
                  </button>
                </div>
            }

              {postStep === 2 &&
            <div className="space-y-4">
                  <h3
                className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                    Détails du don
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                    className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                        Nom du produit *
                      </label>
                      <input
                    type="text"
                    value={postForm.name}
                    onChange={(e) =>
                    setPostForm((f) => ({
                      ...f,
                      name: e.target.value
                    }))
                    }
                    placeholder="Ex: Imatinib 400mg"
                    className={inputClass} />
                  
                    </div>
                    <div>
                      <label
                    className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                        Marque
                      </label>
                      <input
                    type="text"
                    value={postForm.brand}
                    onChange={(e) =>
                    setPostForm((f) => ({
                      ...f,
                      brand: e.target.value
                    }))
                    }
                    placeholder="Ex: Gleevec"
                    className={inputClass} />
                  
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                    className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                        Quantité *
                      </label>
                      <input
                    type="number"
                    value={postForm.quantity}
                    onChange={(e) =>
                    setPostForm((f) => ({
                      ...f,
                      quantity: e.target.value
                    }))
                    }
                    placeholder="Ex: 30"
                    className={inputClass} />
                  
                    </div>
                    <div>
                      <label
                    className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                        Unité
                      </label>
                      <select
                    value={postForm.unit}
                    onChange={(e) =>
                    setPostForm((f) => ({
                      ...f,
                      unit: e.target.value
                    }))
                    }
                    className={inputClass}>
                    
                        <option>comprimés</option>
                        <option>ampoules</option>
                        <option>unité</option>
                        <option>boîtes</option>
                        <option>flacons</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                    className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                        État
                      </label>
                      <select
                    value={postForm.condition}
                    onChange={(e) =>
                    setPostForm((f) => ({
                      ...f,
                      condition: e.target.value
                    }))
                    }
                    className={inputClass}>
                    
                        <option value="new">Neuf (non ouvert)</option>
                        <option value="very-good">Très bon état</option>
                        <option value="good">Bon état</option>
                      </select>
                    </div>
                    <div>
                      <label
                    className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                        Ville *
                      </label>
                      <input
                    type="text"
                    value={postForm.location}
                    onChange={(e) =>
                    setPostForm((f) => ({
                      ...f,
                      location: e.target.value
                    }))
                    }
                    placeholder="Ex: Tunis"
                    className={inputClass} />
                  
                    </div>
                  </div>

                  {postForm.type === 'medication' &&
              <div>
                      <label
                  className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                        Date d'expiration
                      </label>
                      <input
                  type="month"
                  value={postForm.expiryDate}
                  onChange={(e) =>
                  setPostForm((f) => ({
                    ...f,
                    expiryDate: e.target.value
                  }))
                  }
                  className={inputClass} />
                
                    </div>
              }

                  <div>
                    <label
                  className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                      Description
                    </label>
                    <textarea
                  value={postForm.description}
                  onChange={(e) =>
                  setPostForm((f) => ({
                    ...f,
                    description: e.target.value
                  }))
                  }
                  rows={3}
                  placeholder="Décrivez l'état du produit, la raison du don..."
                  className={`${inputClass} resize-none`} />
                
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                  type="checkbox"
                  checked={postForm.requiresPrescription}
                  onChange={(e) =>
                  setPostForm((f) => ({
                    ...f,
                    requiresPrescription: e.target.checked
                  }))
                  }
                  className="w-4 h-4 rounded accent-emerald-500" />
                
                    <span
                  className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                      Ordonnance requise pour ce don
                    </span>
                  </label>

                  {/* Photo upload */}
                  <div>
                    <label
                  className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                      Photo du produit
                    </label>
                    <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDark ? 'border-slate-700 hover:border-emerald-500/50 bg-slate-900/30' : 'border-slate-200 hover:border-emerald-400 bg-slate-50'}`}>
                  
                      <UploadIcon
                    className={`h-8 w-8 mx-auto mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  
                      <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                        Cliquez pour ajouter une photo
                      </p>
                      <p
                    className={`text-xs mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                    
                        PNG, JPG jusqu'à 5MB
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                  onClick={() => setPostStep(1)}
                  className={`px-5 py-3 rounded-xl font-semibold border transition-all ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  
                      ← Retour
                    </button>
                    <button
                  onClick={() => setPostStep(3)}
                  disabled={
                  !postForm.name ||
                  !postForm.quantity ||
                  !postForm.location
                  }
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
                  
                      Continuer →
                    </button>
                  </div>
                </div>
            }

              {postStep === 3 &&
            <div className="space-y-5">
                  <h3
                className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                    Confirmation du don
                  </h3>

                  <div
                className={`rounded-xl p-4 border space-y-3 ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                
                    <div className="flex justify-between">
                      <span
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                        Type
                      </span>
                      <span
                    className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        {postForm.type === 'medication' ?
                    '💊 Médicament' :
                    '🦽 Matériel'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                        Produit
                      </span>
                      <span
                    className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        {postForm.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                        Quantité
                      </span>
                      <span
                    className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        {postForm.quantity} {postForm.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                        Ville
                      </span>
                      <span
                    className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        {postForm.location}
                      </span>
                    </div>
                  </div>

                  <div
                className={`p-4 rounded-xl border ${isDark ? 'bg-amber-900/20 border-amber-700/30' : 'bg-amber-50 border-amber-200'}`}>
                
                    <div className="flex items-start gap-2">
                      <InfoIcon
                    className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                  
                      <p
                    className={`text-xs ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                    
                        Votre annonce sera examinée par notre équipe sous 24-48h
                        avant publication. Vous recevrez une notification dès
                        validation.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                  onClick={() => setPostStep(2)}
                  className={`px-5 py-3 rounded-xl font-semibold border transition-all ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  
                      ← Retour
                    </button>
                    <button
                  onClick={() => {
                    setPostStep(1);
                    setPostForm({
                      type: 'medication',
                      name: '',
                      brand: '',
                      category: '',
                      condition: 'new',
                      quantity: '',
                      unit: 'comprimés',
                      location: '',
                      expiryDate: '',
                      requiresPrescription: false,
                      description: ''
                    });
                    setActiveTab('my-donations');
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2">
                  
                      <CheckCircleIcon className="h-5 w-5" />
                      Soumettre le don
                    </button>
                  </div>
                </div>
            }
            </div>
          </div>
        }

        {/* MY REQUESTS TAB */}
        {activeTab === 'my-requests' &&
        <div className="space-y-4">
            <h3
            className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
              Mes demandes de don
            </h3>
            {MOCK_MY_REQUESTS.map((req) =>
          <div
            key={req.id}
            className={`rounded-2xl border p-5 ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4
                  className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                      {req.donationName}
                    </h4>
                    <p
                  className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                      Donateur : {req.donorName}
                    </p>
                  </div>
                  <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${req.status === 'accepted' ? isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border-emerald-200' : isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                
                    {req.status === 'accepted' ? '✓ Acceptée' : '⏳ En attente'}
                  </span>
                </div>
                <p
              className={`text-sm italic mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              
                  "{req.message}"
                </p>
                <div className="flex items-center gap-2">
                  <ClockIcon
                className={`h-3.5 w-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              
                  <span
                className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                
                    Demandé le {req.requestDate}
                  </span>
                </div>
                {req.status === 'accepted' &&
            <button className="mt-3 w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all">
                    Contacter le donateur
                  </button>
            }
              </div>
          )}
            {MOCK_MY_REQUESTS.length === 0 &&
          <div
            className={`text-center py-16 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            
                <div className="text-4xl mb-3">📋</div>
                <p
              className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              
                  Aucune demande
                </p>
                <p
              className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              
                  Parcourez les annonces pour faire une demande
                </p>
              </div>
          }
          </div>
        }

        {/* MY DONATIONS TAB */}
        {activeTab === 'my-donations' &&
        <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3
              className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Mes dons publiés
              </h3>
              <button
              onClick={() => setActiveTab('post')}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all">
              
                <PlusIcon className="h-4 w-4" />
                Nouveau don
              </button>
            </div>

            {/* Donor badge */}
            <div
            className={`rounded-2xl border p-4 flex items-center gap-4 ${isDark ? 'bg-emerald-900/20 border-emerald-700/30' : 'bg-emerald-50 border-emerald-200'}`}>
            
              <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
              
                <BadgeCheckIcon
                className={`h-6 w-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              
              </div>
              <div>
                <p
                className={`font-bold text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                
                  Donateur Solidaire Vérifié
                </p>
                <p
                className={`text-xs ${isDark ? 'text-emerald-400/70' : 'text-emerald-600'}`}>
                
                  1 don réalisé • Score de confiance : 4.8/5
                </p>
              </div>
            </div>

            {MOCK_MY_DONATIONS.map((don) =>
          <div
            key={don.id}
            className={`rounded-2xl border p-5 ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            
                <div className="flex items-start justify-between">
                  <div>
                    <h4
                  className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                      {don.name}
                    </h4>
                    <p
                  className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                      Publié le {don.postedDate}
                    </p>
                  </div>
                  <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${isDark ? 'bg-slate-700 text-slate-400 border-slate-600' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                
                    Donné ✓
                  </span>
                </div>
                <div
              className={`mt-3 flex items-center gap-2 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              
                  <UsersIcon className="h-3.5 w-3.5" />
                  <span>{don.requests} demandes reçues</span>
                </div>
              </div>
          )}

            {MOCK_MY_DONATIONS.length === 0 &&
          <div
            className={`text-center py-16 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            
                <div className="text-4xl mb-3">💚</div>
                <p
              className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              
                  Vous n'avez pas encore publié de don
                </p>
                <button
              onClick={() => setActiveTab('post')}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-xl">
              
                  Publier mon premier don
                </button>
              </div>
          }
          </div>
        }
      </div>

      {/* Request Modal */}
      {showRequestModal && selectedDonation &&
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
          <div
          className={`w-full max-w-md rounded-3xl border shadow-2xl ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
          
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3
                className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  Demander ce don
                </h3>
                <button
                onClick={() => setShowRequestModal(false)}
                className={`p-2 rounded-xl ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              <div
              className={`rounded-xl p-4 mb-5 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              
                <p
                className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  {selectedDonation.name}
                </p>
                <p
                className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                
                  {selectedDonation.category} • {selectedDonation.location}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                  className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Expliquez votre besoin *
                  </label>
                  <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  rows={3}
                  placeholder="Décrivez brièvement pourquoi vous avez besoin de ce don..."
                  className={`${inputClass} resize-none`} />
                
                </div>

                {selectedDonation.requiresPrescription &&
              <div
                className={`p-3 rounded-xl border ${isDark ? 'bg-amber-900/20 border-amber-700/30' : 'bg-amber-50 border-amber-200'}`}>
                
                    <div className="flex items-start gap-2">
                      <AlertTriangleIcon
                    className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                  
                      <p
                    className={`text-xs ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                    
                        Ce médicament nécessite une ordonnance. Vous devrez
                        fournir une ordonnance médicale valide.
                      </p>
                    </div>
                  </div>
              }

                <div>
                  <label
                  className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    {selectedDonation.requiresPrescription ?
                  'Ordonnance médicale *' :
                  'Justificatif médical (optionnel)'}
                  </label>
                  <div
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer ${isDark ? 'border-slate-700 hover:border-emerald-500/50' : 'border-slate-200 hover:border-emerald-400'}`}>
                  
                    <UploadIcon
                    className={`h-6 w-6 mx-auto mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  
                    <p
                    className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                      Télécharger le document
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                onClick={() => setShowRequestModal(false)}
                className={`px-5 py-3 rounded-xl font-semibold border ${isDark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}`}>
                
                  Annuler
                </button>
                <button
                onClick={() => {
                  setShowRequestModal(false);
                  setRequestMessage('');
                }}
                disabled={!requestMessage}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all">
                
                  Envoyer la demande
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Legal Modal */}
      {showLegalModal &&
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
          className={`w-full max-w-lg rounded-3xl border shadow-2xl max-h-[80vh] overflow-y-auto ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
          
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3
                className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  Informations légales
                </h3>
                <button
                onClick={() => setShowLegalModal(false)}
                className={`p-2 rounded-xl ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <div
              className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              
                <div
                className={`p-4 rounded-xl ${isDark ? 'bg-amber-900/20 border border-amber-700/30' : 'bg-amber-50 border border-amber-200'}`}>
                
                  <p
                  className={`font-bold mb-2 ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                  
                    ⚠️ Réglementation tunisienne
                  </p>
                  <p>
                    Le don de médicaments est soumis à la réglementation du
                    Ministère de la Santé tunisien. Toute transaction doit
                    respecter les lois en vigueur.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Médicaments acceptés :</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Non ouverts et non périmés (expiry &gt; 3 mois)</li>
                    <li>Conservés dans des conditions appropriées</li>
                    <li>Accompagnés de leur emballage d'origine</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-1">Médicaments exclus :</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Médicaments entamés ou périmés</li>
                    <li>Stupéfiants et psychotropes réglementés</li>
                    <li>Médicaments sans emballage d'origine</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-1">
                    Médicaments lourds (cancer, Alzheimer) :
                  </p>
                  <p className="text-xs">
                    Ces médicaments transitent obligatoirement via nos
                    pharmacies partenaires ou ONG médicales agréées. Aucune
                    transaction directe particulier à particulier n'est
                    autorisée.
                  </p>
                </div>
                <div
                className={`p-3 rounded-xl text-xs ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-slate-50 border border-slate-200'}`}>
                
                  <p>
                    En utilisant cette plateforme, vous acceptez notre clause de
                    non-responsabilité. Sanad ne peut être tenu responsable de
                    l'utilisation des médicaments donnés.
                  </p>
                </div>
              </div>
              <button
              onClick={() => setShowLegalModal(false)}
              className="mt-5 w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl">
              
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      }

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>);

}