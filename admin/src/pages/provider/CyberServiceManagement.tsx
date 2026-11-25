import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  Clock,
  MapPin,
  ArrowLeft,
  Zap,
  Syringe,
  Heart,
  Activity,
  Baby,
  Moon,
  Stethoscope,
  FlaskConical,
  Scan,
  Package,
  Utensils,
  Dumbbell,
  Brain,
  Ambulance,
  X,
  Save,
  AlertTriangle,
  Globe,
  Flower2,
  Car,
  FileText,
  Pill } from
'lucide-react';
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  active: boolean;
  category: string;
  location: 'home' | 'clinic' | 'both';
  // Funeral specific fields
  ceremonyType?: 'religious' | 'civil' | 'both';
  burialType?: 'burial' | 'cremation' | 'both';
  repatriation?: boolean;
  floralService?: boolean;
  transportService?: boolean;
  adminAssistance?: boolean;
  griefSupport?: boolean;
  available24h?: boolean;
}
const defaultServicesByType: Record<string, Service[]> = {
  nursing: [
  {
    id: '1',
    name: 'Injection intramusculaire',
    description: "Administration d'injections IM à domicile",
    price: 35,
    duration: 20,
    active: true,
    category: 'Injections',
    location: 'home'
  },
  {
    id: '2',
    name: 'Pansement complexe',
    description:
    'Réfection de pansements post-opératoires ou plaies chroniques',
    price: 60,
    duration: 45,
    active: true,
    category: 'Pansements',
    location: 'both'
  },
  {
    id: '3',
    name: 'Perfusion à domicile',
    description: 'Pose et surveillance de perfusion intraveineuse',
    price: 80,
    duration: 60,
    active: false,
    category: 'Perfusions',
    location: 'home'
  }],

  elderly: [
  {
    id: '1',
    name: 'Aide à la toilette',
    description: 'Assistance pour la toilette quotidienne',
    price: 30,
    duration: 45,
    active: true,
    category: 'Soins quotidiens',
    location: 'home'
  },
  {
    id: '2',
    name: 'Compagnie et stimulation',
    description: 'Présence, discussion, activités de stimulation cognitive',
    price: 25,
    duration: 120,
    active: true,
    category: 'Accompagnement',
    location: 'home'
  },
  {
    id: '3',
    name: 'Garde de jour',
    description: 'Présence et surveillance en journée complète',
    price: 80,
    duration: 480,
    active: true,
    category: 'Garde',
    location: 'home'
  }],

  physio: [
  {
    id: '1',
    name: 'Rééducation orthopédique',
    description: 'Rééducation post-fracture, entorse, prothèse',
    price: 50,
    duration: 45,
    active: true,
    category: 'Orthopédie',
    location: 'both'
  },
  {
    id: '2',
    name: 'Kinésithérapie respiratoire',
    description: 'Désencombrement bronchique, rééducation respiratoire',
    price: 45,
    duration: 30,
    active: true,
    category: 'Respiratoire',
    location: 'home'
  },
  {
    id: '3',
    name: 'Massage thérapeutique',
    description: 'Massage décontracturant et drainage lymphatique',
    price: 40,
    duration: 45,
    active: false,
    category: 'Massage',
    location: 'both'
  }],

  funeral: [
  {
    id: '1',
    name: 'Organisation complète des obsèques',
    description:
    'Prise en charge totale: démarches administratives, cérémonie, transport, sépulture',
    price: 2500,
    duration: 0,
    active: true,
    category: 'Complet',
    location: 'both',
    ceremonyType: 'both',
    burialType: 'both',
    repatriation: false,
    floralService: true,
    transportService: true,
    adminAssistance: true,
    griefSupport: true,
    available24h: true
  },
  {
    id: '2',
    name: 'Cérémonie religieuse',
    description:
    'Organisation de cérémonie selon les rites religieux (musulman, chrétien, juif)',
    price: 1800,
    duration: 0,
    active: true,
    category: 'Cérémonie',
    location: 'both',
    ceremonyType: 'religious',
    burialType: 'burial',
    repatriation: false,
    floralService: true,
    transportService: false,
    adminAssistance: true,
    griefSupport: false,
    available24h: true
  },
  {
    id: '3',
    name: 'Rapatriement international',
    description:
    'Transport du défunt vers un autre pays avec toutes les formalités',
    price: 5500,
    duration: 0,
    active: true,
    category: 'Rapatriement',
    location: 'both',
    ceremonyType: 'both',
    burialType: 'both',
    repatriation: true,
    floralService: false,
    transportService: true,
    adminAssistance: true,
    griefSupport: false,
    available24h: true
  },
  {
    id: '4',
    name: 'Crémation avec cérémonie',
    description:
    'Organisation de crémation avec cérémonie civile et urne funéraire',
    price: 2000,
    duration: 0,
    active: false,
    category: 'Crémation',
    location: 'clinic',
    ceremonyType: 'civil',
    burialType: 'cremation',
    repatriation: false,
    floralService: true,
    transportService: false,
    adminAssistance: true,
    griefSupport: true,
    available24h: false
  }]

};
const serviceTypeConfig: Record<
  string,
  {
    title: string;
    icon: React.ElementType;
    gradient: string;
  }> =
{
  nursing: {
    title: 'Soins Infirmiers',
    icon: Syringe,
    gradient: 'from-cyan-500 to-blue-500'
  },
  elderly: {
    title: 'Aide aux Seniors',
    icon: Heart,
    gradient: 'from-purple-500 to-indigo-500'
  },
  physio: {
    title: 'Kinésithérapie',
    icon: Activity,
    gradient: 'from-blue-500 to-cyan-500'
  },
  maternity: {
    title: 'Soins Maternité',
    icon: Baby,
    gradient: 'from-pink-400 to-rose-500'
  },
  night: {
    title: 'Garde de Nuit',
    icon: Moon,
    gradient: 'from-indigo-500 to-purple-600'
  },
  doctor: {
    title: 'Médecin',
    icon: Stethoscope,
    gradient: 'from-teal-500 to-cyan-500'
  },
  laboratory: {
    title: "Laboratoire d'Analyses",
    icon: FlaskConical,
    gradient: 'from-indigo-500 to-purple-500'
  },
  radiology: {
    title: 'Centre de Radiologie',
    icon: Scan,
    gradient: 'from-pink-500 to-rose-500'
  },
  equipment: {
    title: 'Agence de Location',
    icon: Package,
    gradient: 'from-purple-500 to-indigo-500'
  },
  nutrition: {
    title: 'Nutrition',
    icon: Utensils,
    gradient: 'from-green-500 to-emerald-500'
  },
  gym: {
    title: 'Salle de Sport',
    icon: Dumbbell,
    gradient: 'from-orange-500 to-amber-500'
  },
  psychology: {
    title: 'Psychologie',
    icon: Brain,
    gradient: 'from-violet-500 to-purple-500'
  },
  ambulance: {
    title: 'Ambulance',
    icon: Ambulance,
    gradient: 'from-red-500 to-rose-500'
  },
  babysitting: {
    title: 'Baby/Kids Sitting',
    icon: Baby,
    gradient: 'from-amber-500 to-orange-500'
  },
  funeral: {
    title: 'Services Funéraires',
    icon: Heart,
    gradient: 'from-slate-600 to-slate-700'
  },
  pharmacy: {
    title: 'Pharmacie',
    icon: Pill,
    gradient: 'from-emerald-500 to-teal-500'
  }
};
export function CyberServiceManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const userServiceType = user?.serviceType || 'nursing';
  const config = serviceTypeConfig[userServiceType] || serviceTypeConfig.nursing;
  const Icon = config.icon;
  const [services, setServices] = useState<Service[]>(
    defaultServicesByType[userServiceType] || defaultServicesByType.nursing
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Service>>({});
  const handleToggleActive = (id: string) => {
    setServices(
      services.map((s) =>
      s.id === id ?
      {
        ...s,
        active: !s.active
      } :
      s
      )
    );
  };
  const handleEditClick = (service: Service) => {
    setSelectedService(service);
    setEditFormData({
      ...service
    });
    setShowEditModal(true);
  };
  const handleDeleteClick = (service: Service) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };
  const handleEditSave = () => {
    if (selectedService && editFormData) {
      setServices(
        services.map((s) =>
        s.id === selectedService.id ?
        {
          ...s,
          ...editFormData
        } as Service :
        s
        )
      );
      setShowEditModal(false);
      setSelectedService(null);
      setEditFormData({});
    }
  };
  const handleDeleteConfirm = () => {
    if (selectedService) {
      setServices(services.filter((s) => s.id !== selectedService.id));
      setShowDeleteModal(false);
      setSelectedService(null);
    }
  };
  const activeServices = services.filter((s) => s.active);
  const inactiveServices = services.filter((s) => !s.active);
  const stats = {
    active: activeServices.length,
    avgPrice:
    activeServices.length > 0 ?
    Math.round(
      activeServices.reduce((sum, s) => sum + s.price, 0) /
      activeServices.length
    ) :
    0,
    avgDuration:
    activeServices.length > 0 ?
    Math.round(
      activeServices.reduce((sum, s) => sum + s.duration, 0) /
      activeServices.length
    ) :
    0
  };
  const getDurationLabel = () => {
    if (userServiceType === 'laboratory') return 'Délai moyen (h)';
    if (userServiceType === 'equipment') return 'Location/jour';
    if (userServiceType === 'funeral') return 'Services';
    return 'Durée Moyenne';
  };
  const formatDuration = (duration: number) => {
    if (userServiceType === 'laboratory') return `${duration}h`;
    if (userServiceType === 'equipment')
    return `${duration} jour${duration > 1 ? 's' : ''}`;
    if (userServiceType === 'funeral') return 'Variable';
    return `${duration} min`;
  };
  const inputClass = `w-full px-3 py-2 text-sm border rounded-lg transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`;
  const selectClass = `w-full px-3 py-2 text-sm border rounded-lg transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`;
  const ServiceCard = ({
    service,
    isActive



  }: {service: Service;isActive: boolean;}) => {
    const isFuneral = userServiceType === 'funeral';
    return (
      <div
        className={`group relative overflow-hidden ${!isActive ? 'opacity-60' : ''}`}>
        
        <div
          className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-5 transition-all`}>
        </div>
        <div
          className={`relative backdrop-blur-sm border rounded-xl p-3 transition-all ${isDark ? `bg-slate-800/50 border-slate-700 ${isActive ? 'group-hover:border-cyan-500/50' : ''}` : `bg-white/80 border-slate-200 ${isActive ? 'group-hover:border-cyan-500/50' : ''} shadow-sm`}`}>
          
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3
              className={`text-sm font-bold transition-colors ${isDark ? `text-white ${isActive ? 'group-hover:text-cyan-400' : ''}` : `text-slate-900 ${isActive ? 'group-hover:text-cyan-600' : ''}`}`}>
              
              {service.name}
            </h3>
            <span
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${isActive ? 'bg-green-500/20 text-green-500 border-green-500/50' : isDark ? 'bg-slate-700 text-slate-400 border-slate-600' : 'bg-slate-200 text-slate-500 border-slate-300'}`}>
              
              {isActive ? 'Actif' : 'Désactivé'}
            </span>
            {isFuneral && service.available24h &&
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/50">
                24h/24
              </span>
            }
            {isFuneral && service.repatriation &&
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-500/20 text-blue-500 border border-blue-500/50 flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Rapatriement
              </span>
            }
          </div>

          <p
            className={`text-xs mb-3 w-full ${isDark ? isActive ? 'text-slate-400' : 'text-slate-500' : isActive ? 'text-slate-600' : 'text-slate-500'}`}>
            
            {service.description}
          </p>

          {/* Funeral-specific details */}
          {isFuneral &&
          <div className="flex flex-wrap gap-2 mb-3">
              {service.ceremonyType &&
            <span
              className={`px-2 py-0.5 text-[10px] rounded-full ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              
                  {service.ceremonyType === 'religious' ?
              '🕌 Religieuse' :
              service.ceremonyType === 'civil' ?
              '🏛️ Civile' :
              '🕌🏛️ Les deux'}
                </span>
            }
              {service.burialType &&
            <span
              className={`px-2 py-0.5 text-[10px] rounded-full ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              
                  {service.burialType === 'burial' ?
              'Inhumation' :
              service.burialType === 'cremation' ?
              'Crémation' :
              'Inh. & Crém.'}
                </span>
            }
              {service.floralService &&
            <span
              className={`px-2 py-0.5 text-[10px] rounded-full ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              
                  <Flower2 className="h-3 w-3 inline mr-1" />
                  Fleurs
                </span>
            }
              {service.transportService &&
            <span
              className={`px-2 py-0.5 text-[10px] rounded-full ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              
                  <Car className="h-3 w-3 inline mr-1" />
                  Transport
                </span>
            }
              {service.adminAssistance &&
            <span
              className={`px-2 py-0.5 text-[10px] rounded-full ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              
                  <FileText className="h-3 w-3 inline mr-1" />
                  Admin
                </span>
            }
              {service.griefSupport &&
            <span
              className={`px-2 py-0.5 text-[10px] rounded-full ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              
                  <Heart className="h-3 w-3 inline mr-1" />
                  Deuil
                </span>
            }
            </div>
          }

          <div
            className={`flex items-center justify-between text-[10px] mb-3 ${isDark ? isActive ? 'text-slate-300' : 'text-slate-500' : isActive ? 'text-slate-600' : 'text-slate-500'}`}>
            
            <div className="flex items-center gap-1">
              <DollarSign
                className={`h-3 w-3 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
              
              <span className="font-semibold">
                {isFuneral ? `À partir de ${service.price}` : service.price} TND
              </span>
            </div>
            {!isFuneral &&
            <>
                <div className="flex items-center gap-1">
                  <Clock
                  className={`h-3 w-3 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                
                  <span>{formatDuration(service.duration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin
                  className={`h-3 w-3 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                
                  <span>
                    {service.location === 'home' ?
                  'Domicile' :
                  service.location === 'clinic' ?
                  'Cabinet' :
                  'Les deux'}
                  </span>
                </div>
              </>
            }
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleEditClick(service)}
              className={`p-1.5 border rounded-lg transition-all ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600' : 'bg-slate-100 hover:bg-slate-200 border-slate-200'}`}>
              
              <Edit
                className={`h-3.5 w-3.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
              
            </button>
            <button
              onClick={() => handleToggleActive(service.id)}
              className={`p-1.5 border rounded-lg transition-all ${isActive ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/50' : 'bg-green-500/20 hover:bg-green-500/30 border-green-500/50'}`}>
              
              {isActive ?
              <ToggleLeft className="h-3.5 w-3.5 text-amber-500" /> :

              <ToggleRight className="h-3.5 w-3.5 text-green-500" />
              }
            </button>
            <button
              onClick={() => handleDeleteClick(service)}
              className="p-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-all">
              
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            </button>
          </div>
        </div>
      </div>);

  };
  return (
    <div
      className={`min-h-screen pb-20 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div
        className={`absolute inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px]`}>
      </div>

      <div
        className={`relative z-10 backdrop-blur-sm border-b ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
        
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center`}>
                
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p
                  className={`text-[10px] font-medium tracking-wide uppercase mb-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  
                  {config.title}
                </p>
                <h1
                  className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  Mes Services
                </h1>
              </div>
            </div>
            <button
              onClick={() => navigate('/provider/services/new')}
              className="relative group/btn overflow-hidden">
              
              <div
                className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-0 group-hover/btn:opacity-100 transition-opacity blur-xl`}>
              </div>
              <div
                className={`relative px-3 py-1.5 bg-gradient-to-r ${config.gradient} rounded-lg text-xs font-medium text-white flex items-center gap-1.5 group-hover/btn:scale-105 transition-transform`}>
                
                <Plus className="h-3.5 w-3.5" />
                Ajouter
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {[
          {
            label: 'Services Actifs',
            value: stats.active,
            icon: ToggleRight,
            gradient: 'from-green-500 to-emerald-500'
          },
          {
            label: 'Prix Moyen',
            value: `${stats.avgPrice} TND`,
            icon: DollarSign,
            gradient: config.gradient
          },
          {
            label: getDurationLabel(),
            value: formatDuration(stats.avgDuration),
            icon: Clock,
            gradient: 'from-purple-500 to-pink-500'
          }].
          map((stat, i) =>
          <div
            key={i}
            className={`backdrop-blur-sm border rounded-xl p-3 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
              <div className="flex items-center gap-3">
                <div
                className={`w-8 h-8 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center`}>
                
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p
                  className={`text-[10px] uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                    {stat.label}
                  </p>
                  <p
                  className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2
            className={`text-base font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
            <Zap className="h-4 w-4 text-green-500" />
            Services Actifs
          </h2>
          <div className="space-y-3">
            {activeServices.map((service) =>
            <ServiceCard key={service.id} service={service} isActive={true} />
            )}
            {activeServices.length === 0 &&
            <div
              className={`text-center py-6 rounded-xl border ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
              
                <p
                className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                
                  Aucun service actif
                </p>
              </div>
            }
          </div>
        </div>

        {inactiveServices.length > 0 &&
        <div>
            <h2
            className={`text-base font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
              <ToggleLeft
              className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            
              Services Désactivés
            </h2>
            <div className="space-y-3">
              {inactiveServices.map((service) =>
            <ServiceCard
              key={service.id}
              service={service}
              isActive={false} />

            )}
            </div>
          </div>
        }
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedService &&
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowEditModal(false)}>
          
            <motion.div
            initial={{
              scale: 0.95,
              opacity: 0
            }}
            animate={{
              scale: 1,
              opacity: 1
            }}
            exit={{
              scale: 0.95,
              opacity: 0
            }}
            onClick={(e) => e.stopPropagation()}
            className={`border rounded-2xl p-4 w-full max-w-lg max-h-[80vh] overflow-y-auto ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            
              <div className="flex items-center justify-between mb-4">
                <h3
                className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  Modifier le service
                </h3>
                <button
                onClick={() => setShowEditModal(false)}
                className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                
                  <X
                  className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Nom du service *
                  </label>
                  <input
                  type="text"
                  value={editFormData.name || ''}
                  onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    name: e.target.value
                  })
                  }
                  className={inputClass} />
                
                </div>

                <div>
                  <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Description
                  </label>
                  <textarea
                  value={editFormData.description || ''}
                  onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value
                  })
                  }
                  rows={3}
                  className={`${inputClass} resize-none`} />
                
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                    className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                      {userServiceType === 'funeral' ?
                    'Prix de base (TND) *' :
                    'Prix (TND) *'}
                    </label>
                    <div className="relative">
                      <DollarSign
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    
                      <input
                      type="number"
                      value={editFormData.price || ''}
                      onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        price: parseFloat(e.target.value) || 0
                      })
                      }
                      className={`${inputClass} pl-8`} />
                    
                    </div>
                  </div>
                  {userServiceType !== 'funeral' &&
                <div>
                      <label
                    className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                        Durée (min)
                      </label>
                      <div className="relative">
                        <Clock
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    
                        <input
                      type="number"
                      value={editFormData.duration || ''}
                      onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        duration: parseInt(e.target.value) || 0
                      })
                      }
                      className={`${inputClass} pl-8`} />
                    
                      </div>
                    </div>
                }
                </div>

                {/* Funeral-specific fields */}
                {userServiceType === 'funeral' &&
              <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                      className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      
                          Type de cérémonie
                        </label>
                        <select
                      value={editFormData.ceremonyType || 'both'}
                      onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        ceremonyType: e.target.value as
                        'religious' |
                        'civil' |
                        'both'
                      })
                      }
                      className={selectClass}>
                      
                          <option value="religious">
                            Religieuse uniquement
                          </option>
                          <option value="civil">Civile uniquement</option>
                          <option value="both">Les deux</option>
                        </select>
                      </div>
                      <div>
                        <label
                      className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      
                          Mode de sépulture
                        </label>
                        <select
                      value={editFormData.burialType || 'both'}
                      onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        burialType: e.target.value as
                        'burial' |
                        'cremation' |
                        'both'
                      })
                      }
                      className={selectClass}>
                      
                          <option value="burial">Inhumation uniquement</option>
                          <option value="cremation">
                            Crémation uniquement
                          </option>
                          <option value="both">Les deux</option>
                        </select>
                      </div>
                    </div>

                    <div
                  className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  
                      <p
                    className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                        Services inclus
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                    {
                      id: 'repatriation',
                      label: 'Rapatriement international',
                      icon: Globe
                    },
                    {
                      id: 'floralService',
                      label: 'Compositions florales',
                      icon: Flower2
                    },
                    {
                      id: 'transportService',
                      label: 'Transport des proches',
                      icon: Car
                    },
                    {
                      id: 'adminAssistance',
                      label: 'Assistance administrative',
                      icon: FileText
                    },
                    {
                      id: 'griefSupport',
                      label: 'Accompagnement au deuil',
                      icon: Heart
                    },
                    {
                      id: 'available24h',
                      label: 'Disponible 24h/24',
                      icon: Clock
                    }].
                    map((option) =>
                    <label
                      key={option.id}
                      className="flex items-center gap-1.5 cursor-pointer">
                      
                            <input
                        type="checkbox"
                        checked={
                        editFormData[
                        option.id as keyof typeof editFormData] as
                        boolean || false
                        }
                        onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          [option.id]: e.target.checked
                        })
                        }
                        className="w-3.5 h-3.5 rounded border-slate-300 text-slate-600 focus:ring-slate-500" />
                      
                            <option.icon
                        className={`h-3.5 w-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                      
                            <span
                        className={`text-[10px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        
                              {option.label}
                            </span>
                          </label>
                    )}
                      </div>
                    </div>
                  </>
              }
              </div>

              <div className="flex gap-3 mt-6">
                <button
                onClick={() => setShowEditModal(false)}
                className={`flex-1 px-4 py-2 border rounded-xl text-sm font-medium transition-all ${isDark ? 'border-slate-600 text-white hover:bg-slate-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                
                  Annuler
                </button>
                <button
                onClick={handleEditSave}
                className={`flex-1 px-4 py-2 bg-gradient-to-r ${config.gradient} rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}>
                
                  <Save className="h-4 w-4" />
                  Enregistrer
                </button>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedService &&
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDeleteModal(false)}>
          
            <motion.div
            initial={{
              scale: 0.95,
              opacity: 0
            }}
            animate={{
              scale: 1,
              opacity: 1
            }}
            exit={{
              scale: 0.95,
              opacity: 0
            }}
            onClick={(e) => e.stopPropagation()}
            className={`border rounded-2xl p-6 w-full max-w-sm text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <h3
              className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Supprimer le service ?
              </h3>
              <p
              className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              
                Êtes-vous sûr de vouloir supprimer "{selectedService.name}" ?
                Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                onClick={() => setShowDeleteModal(false)}
                className={`flex-1 px-4 py-2 border rounded-xl text-sm font-medium transition-all ${isDark ? 'border-slate-600 text-white hover:bg-slate-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                
                  Annuler
                </button>
                <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-500 rounded-xl text-sm font-medium text-white hover:bg-red-600 transition-colors">
                
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}