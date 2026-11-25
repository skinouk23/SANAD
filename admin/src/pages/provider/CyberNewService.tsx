import React, { useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  ArrowLeft,
  Save,
  DollarSign,
  Clock,
  MapPin,
  FileText,
  Tag,
  FlaskConical,
  Scan,
  Package,
  Baby,
  Utensils,
  Dumbbell,
  Stethoscope,
  Syringe,
  Brain,
  Moon,
  Heart,
  Ambulance,
  Activity,
  Users,
  ChefHat,
  Store,
  Apple,
  Plus,
  Minus,
  Trash2,
  UtensilsCrossed,
  Pill,
  Flower2,
  Globe,
  Car,
  Image as ImageIcon,
  Upload,
  X,
  List,
  PawPrint,
  Thermometer,
  Calendar,
  HandHeart,
  ClipboardList,
  ShieldCheck,
  Scissors,
  Dog } from
'lucide-react';
interface ServiceField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'multiselect';
  placeholder?: string;
  options?: {
    value: string;
    label: string;
  }[];
  required?: boolean;
}
const serviceTypeConfigs: Record<
  string,
  {
    title: string;
    icon: React.ElementType;
    gradient: string;
    fields: ServiceField[];
    defaultServices?: {
      name: string;
      description: string;
      price: number;
      duration: number;
    }[];
  }> =
{
  nursing: {
    title: 'Soins Infirmiers',
    icon: Syringe,
    gradient: 'from-cyan-500 to-blue-500',
    fields: [
    {
      id: 'name',
      label: 'Nom du soin',
      type: 'text',
      placeholder: 'Ex: Injection à domicile',
      required: true
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Décrivez le soin en détail...'
    },
    {
      id: 'price',
      label: 'Prix (TND)',
      type: 'number',
      placeholder: '40',
      required: true
    },
    {
      id: 'duration',
      label: 'Durée (min)',
      type: 'number',
      placeholder: '30'
    },
    {
      id: 'location',
      label: "Lieu d'intervention",
      type: 'select',
      options: [
      {
        value: 'home',
        label: 'À domicile uniquement'
      },
      {
        value: 'clinic',
        label: 'Au cabinet uniquement'
      },
      {
        value: 'both',
        label: 'Domicile et cabinet'
      }]

    },
    {
      id: 'urgency',
      label: 'Disponible en urgence',
      type: 'checkbox'
    },
    {
      id: 'prescription',
      label: 'Ordonnance requise',
      type: 'checkbox'
    }],

    defaultServices: [
    {
      name: 'Injection intramusculaire',
      description: "Administration d'injections IM à domicile",
      price: 35,
      duration: 20
    },
    {
      name: 'Pansement simple',
      description: 'Réfection de pansement simple',
      price: 40,
      duration: 30
    },
    {
      name: 'Perfusion à domicile',
      description: 'Pose et surveillance de perfusion IV',
      price: 80,
      duration: 60
    },
    {
      name: 'Prise de sang',
      description: 'Prélèvement sanguin à domicile',
      price: 30,
      duration: 15
    },
    {
      name: 'Sondage urinaire',
      description: 'Pose ou changement de sonde urinaire',
      price: 50,
      duration: 30
    },
    {
      name: 'Soins de stomie',
      description: 'Entretien et changement de poche de stomie',
      price: 45,
      duration: 30
    },
    {
      name: 'Injection sous-cutanée',
      description: 'Administration insuline ou anticoagulant',
      price: 25,
      duration: 15
    },
    {
      name: 'Ablation de fils/agrafes',
      description: 'Retrait de fils ou agrafes post-opératoires',
      price: 35,
      duration: 20
    }]

  },
  elderly: {
    title: 'Aide aux Seniors',
    icon: Heart,
    gradient: 'from-purple-500 to-indigo-500',
    fields: [
    {
      id: 'name',
      label: 'Nom du service',
      type: 'text',
      placeholder: 'Ex: Aide à la toilette',
      required: true
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Décrivez le service...'
    },
    {
      id: 'price',
      label: 'Prix/heure (TND)',
      type: 'number',
      placeholder: '25',
      required: true
    },
    {
      id: 'duration',
      label: 'Durée minimum (min)',
      type: 'number',
      placeholder: '60'
    },
    {
      id: 'weekend',
      label: 'Disponible le weekend',
      type: 'checkbox'
    }],

    defaultServices: [
    {
      name: 'Aide à la toilette',
      description: 'Assistance pour la toilette quotidienne',
      price: 30,
      duration: 45
    },
    {
      name: 'Compagnie',
      description: 'Présence, discussion, activités de stimulation',
      price: 20,
      duration: 120
    },
    {
      name: 'Aide aux repas',
      description: 'Préparation et aide à la prise des repas',
      price: 25,
      duration: 60
    },
    {
      name: 'Aide à la mobilité',
      description: 'Accompagnement déplacements et transferts',
      price: 30,
      duration: 60
    },
    {
      name: 'Courses et commissions',
      description: 'Achats alimentaires et courses quotidiennes',
      price: 20,
      duration: 90
    },
    {
      name: 'Entretien du cadre de vie',
      description: 'Ménage léger, rangement, linge',
      price: 25,
      duration: 120
    }]

  },
  physio: {
    title: 'Kinésithérapie',
    icon: Activity,
    gradient: 'from-blue-500 to-cyan-500',
    fields: [
    {
      id: 'name',
      label: 'Nom du soin',
      type: 'text',
      placeholder: 'Ex: Rééducation post-opératoire',
      required: true
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Décrivez le soin...'
    },
    {
      id: 'price',
      label: 'Prix/séance (TND)',
      type: 'number',
      placeholder: '50',
      required: true
    },
    {
      id: 'duration',
      label: 'Durée (min)',
      type: 'number',
      placeholder: '45'
    }],

    defaultServices: [
    {
      name: 'Rééducation orthopédique',
      description: 'Rééducation post-fracture, entorse, prothèse',
      price: 50,
      duration: 45
    },
    {
      name: 'Massage thérapeutique',
      description: 'Massage décontracturant, drainage',
      price: 40,
      duration: 45
    },
    {
      name: 'Kinésithérapie respiratoire',
      description: 'Désencombrement bronchique, rééducation pulmonaire',
      price: 45,
      duration: 30
    },
    {
      name: 'Rééducation neurologique',
      description: 'Post-AVC, Parkinson, sclérose en plaques',
      price: 55,
      duration: 45
    },
    {
      name: 'Rééducation périnéale',
      description: 'Rééducation du plancher pelvien',
      price: 45,
      duration: 30
    },
    {
      name: 'Drainage lymphatique',
      description: 'Drainage manuel pour œdèmes et lymphœdèmes',
      price: 50,
      duration: 45
    }]

  },
  laboratory: {
    title: "Laboratoire d'Analyses",
    icon: FlaskConical,
    gradient: 'from-indigo-500 to-purple-500',
    fields: [
    {
      id: 'name',
      label: "Nom de l'analyse",
      type: 'text',
      placeholder: 'Ex: Bilan lipidique complet',
      required: true
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Décrivez les paramètres analysés...'
    },
    {
      id: 'price',
      label: 'Prix (TND)',
      type: 'number',
      placeholder: '50',
      required: true
    },
    {
      id: 'duration',
      label: 'Délai résultats (heures)',
      type: 'number',
      placeholder: '24'
    },
    {
      id: 'fasting',
      label: 'À jeun requis',
      type: 'checkbox'
    },
    {
      id: 'homeCollection',
      label: 'Prélèvement à domicile disponible',
      type: 'checkbox'
    }],

    defaultServices: [
    {
      name: 'Bilan sanguin complet',
      description: 'NFS, VS, glycémie, créatinine, ionogramme',
      price: 85,
      duration: 24
    },
    {
      name: 'Bilan lipidique',
      description: 'Cholestérol total, HDL, LDL, triglycérides',
      price: 45,
      duration: 24
    },
    {
      name: 'Bilan hépatique',
      description: 'Transaminases, bilirubine, GGT, phosphatases alcalines',
      price: 55,
      duration: 24
    },
    {
      name: 'Bilan thyroïdien',
      description: 'TSH, T3, T4 libre',
      price: 65,
      duration: 48
    },
    {
      name: 'Hémoglobine glyquée (HbA1c)',
      description: 'Suivi du diabète sur 3 mois',
      price: 35,
      duration: 24
    },
    {
      name: "Analyse d'urine (ECBU)",
      description: 'Examen cytobactériologique des urines',
      price: 30,
      duration: 48
    },
    {
      name: 'Bilan rénal',
      description: 'Créatinine, urée, acide urique, ionogramme',
      price: 50,
      duration: 24
    },
    {
      name: 'Sérologie complète',
      description: 'Hépatite B/C, HIV, syphilis',
      price: 120,
      duration: 72
    }]

  },
  radiology: {
    title: 'Centre de Radiologie',
    icon: Scan,
    gradient: 'from-pink-500 to-rose-500',
    fields: [
    {
      id: 'name',
      label: "Nom de l'examen",
      type: 'text',
      placeholder: 'Ex: Scanner thoracique',
      required: true
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: "Décrivez l'examen..."
    },
    {
      id: 'price',
      label: 'Prix (TND)',
      type: 'number',
      placeholder: '150',
      required: true
    },
    {
      id: 'duration',
      label: "Durée de l'examen (min)",
      type: 'number',
      placeholder: '30'
    }],

    defaultServices: [
    {
      name: 'Radiographie thoracique',
      description: 'Radio des poumons face et profil',
      price: 35,
      duration: 10
    },
    {
      name: 'Échographie abdominale',
      description: 'Foie, vésicule, pancréas, rate, reins',
      price: 80,
      duration: 30
    },
    {
      name: 'Scanner cérébral',
      description: 'Tomodensitométrie du crâne avec/sans injection',
      price: 180,
      duration: 20
    },
    {
      name: 'IRM lombaire',
      description: 'Imagerie par résonance magnétique du rachis lombaire',
      price: 250,
      duration: 40
    },
    {
      name: 'Échographie obstétricale',
      description: 'Suivi de grossesse, morphologie fœtale',
      price: 70,
      duration: 30
    },
    {
      name: 'Mammographie',
      description: 'Dépistage et diagnostic du sein',
      price: 60,
      duration: 15
    },
    {
      name: 'Panoramique dentaire',
      description: 'Radiographie panoramique des mâchoires',
      price: 40,
      duration: 10
    }]

  },
  equipment: {
    title: 'Agence de Location',
    icon: Package,
    gradient: 'from-purple-500 to-indigo-500',
    fields: [
    {
      id: 'name',
      label: "Nom de l'équipement",
      type: 'text',
      placeholder: 'Ex: Lit médicalisé électrique',
      required: true
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: "Décrivez l'équipement..."
    },
    {
      id: 'priceDaily',
      label: 'Prix/jour (TND)',
      type: 'number',
      placeholder: '25',
      required: true
    },
    {
      id: 'deposit',
      label: 'Caution (TND)',
      type: 'number',
      placeholder: '300'
    },
    {
      id: 'delivery',
      label: 'Livraison à domicile',
      type: 'checkbox'
    }],

    defaultServices: [
    {
      name: 'Fauteuil roulant manuel',
      description: 'Fauteuil pliable léger',
      price: 15,
      duration: 1
    },
    {
      name: 'Lit médicalisé électrique',
      description: 'Lit 3 fonctions avec barrières',
      price: 35,
      duration: 1
    },
    {
      name: "Concentrateur d'oxygène",
      description: "Appareil d'oxygénothérapie portable",
      price: 25,
      duration: 1
    },
    {
      name: 'Déambulateur',
      description: 'Déambulateur pliable avec roues',
      price: 8,
      duration: 1
    },
    {
      name: 'Matelas anti-escarres',
      description: 'Matelas à pression alternée',
      price: 20,
      duration: 1
    },
    {
      name: 'Aspirateur de mucosités',
      description: "Appareil d'aspiration portable",
      price: 18,
      duration: 1
    }]

  },
  nutrition: {
    title: 'Nutrition & Alimentation',
    icon: Utensils,
    gradient: 'from-green-500 to-emerald-500',
    fields: [
    {
      id: 'name',
      label: 'Nom du service',
      type: 'text',
      placeholder: 'Ex: Bilan nutritionnel',
      required: true
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Décrivez le service...'
    },
    {
      id: 'price',
      label: 'Prix (TND)',
      type: 'number',
      placeholder: '80',
      required: true
    },
    {
      id: 'duration',
      label: 'Durée (min)',
      type: 'number',
      placeholder: '60'
    },
    {
      id: 'dietTypes',
      label: 'Régimes pris en charge',
      type: 'multiselect',
      options: [
      {
        value: 'diabetic',
        label: 'Diabétique'
      },
      {
        value: 'low-salt',
        label: 'Pauvre en sel'
      },
      {
        value: 'post-surgery',
        label: 'Post-hospitalisation'
      },
      {
        value: 'cardiac',
        label: 'Cardiaque'
      },
      {
        value: 'renal',
        label: 'Rénal'
      },
      {
        value: 'vegetarian',
        label: 'Végétarien'
      },
      {
        value: 'vegan',
        label: 'Vegan'
      },
      {
        value: 'gluten-free',
        label: 'Sans gluten'
      }]

    }],

    defaultServices: [
    {
      name: 'Bilan nutritionnel complet',
      description: 'Évaluation complète + plan alimentaire',
      price: 120,
      duration: 90
    },
    {
      name: 'Consultation de suivi',
      description: 'Suivi et ajustement du programme',
      price: 60,
      duration: 30
    },
    {
      name: 'Programme minceur',
      description: 'Plan personnalisé de perte de poids',
      price: 100,
      duration: 60
    },
    {
      name: 'Nutrition sportive',
      description: 'Plan alimentaire adapté aux sportifs',
      price: 90,
      duration: 45
    },
    {
      name: 'Régime diabétique',
      description: 'Plan alimentaire pour diabétiques',
      price: 80,
      duration: 45
    },
    {
      name: 'Nutrition pédiatrique',
      description: 'Alimentation adaptée enfants et adolescents',
      price: 70,
      duration: 45
    }]

  },
  psychology: {
    title: 'Psychologie',
    icon: Brain,
    gradient: 'from-violet-500 to-purple-500',
    fields: [
    {
      id: 'name',
      label: 'Nom de la consultation',
      type: 'text',
      placeholder: 'Ex: Thérapie cognitive',
      required: true
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Décrivez la consultation...'
    },
    {
      id: 'price',
      label: 'Prix/séance (TND)',
      type: 'number',
      placeholder: '80',
      required: true
    },
    {
      id: 'duration',
      label: 'Durée (min)',
      type: 'number',
      placeholder: '60'
    }],

    defaultServices: [
    {
      name: 'Consultation individuelle',
      description: 'Séance de psychothérapie individuelle',
      price: 80,
      duration: 60
    },
    {
      name: 'Thérapie de couple',
      description: 'Séance pour couples',
      price: 120,
      duration: 90
    },
    {
      name: 'Thérapie cognitive (TCC)',
      description: 'Thérapie cognitivo-comportementale',
      price: 90,
      duration: 60
    },
    {
      name: 'Gestion du stress et anxiété',
      description: 'Techniques de relaxation et gestion émotionnelle',
      price: 80,
      duration: 60
    },
    {
      name: 'Accompagnement au deuil',
      description: 'Soutien psychologique en période de deuil',
      price: 80,
      duration: 60
    },
    {
      name: 'Bilan psychologique',
      description: 'Évaluation psychologique complète avec rapport',
      price: 150,
      duration: 120
    }]

  },
  ambulance: {
    title: 'Ambulance',
    icon: Ambulance,
    gradient: 'from-red-500 to-rose-500',
    fields: [
    {
      id: 'name',
      label: 'Nom du service',
      type: 'text',
      placeholder: 'Ex: Transport médicalisé',
      required: true
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Décrivez le service...'
    },
    {
      id: 'serviceTypes',
      label: 'Types de service',
      type: 'multiselect',
      options: [
      {
        value: 'urgences',
        label: 'Urgences'
      },
      {
        value: 'transport_inter_hopital',
        label: 'Transport inter-hôpital'
      },
      {
        value: 'rapatriement',
        label: 'Rapatriement'
      },
      {
        value: 'evenements',
        label: 'Événements'
      },
      {
        value: 'samu_prive',
        label: 'SAMU privé'
      },
      {
        value: 'reanimation_mobile',
        label: 'Réanimation mobile'
      },
      {
        value: 'dialyse',
        label: 'Dialyse'
      },
      {
        value: 'transport_neonatal',
        label: 'Transport néonatal'
      }]

    },
    {
      id: 'basePrice',
      label: 'Prix de base (TND)',
      type: 'number',
      placeholder: '50',
      required: true
    },
    {
      id: 'standardKilometers',
      label: 'Nombre de kilomètres inclus dans le prix de base',
      type: 'number',
      placeholder: '10',
      required: true
    },
    {
      id: 'pricePerExtraKm',
      label: 'Prix par kilomètre supplémentaire (TND)',
      type: 'number',
      placeholder: '2',
      required: true
    },
    {
      id: 'available24h',
      label: 'Disponible 24h/24',
      type: 'checkbox'
    }],

    defaultServices: [
    {
      name: 'Transport VSL',
      description: 'Véhicule sanitaire léger',
      price: 40,
      duration: 60
    },
    {
      name: 'Ambulance équipée',
      description: 'Transport avec monitoring',
      price: 100,
      duration: 60
    },
    {
      name: 'Transport inter-hospitalier',
      description: 'Transfert entre établissements de santé',
      price: 120,
      duration: 90
    },
    {
      name: 'Rapatriement sanitaire',
      description: 'Transport longue distance médicalisé',
      price: 300,
      duration: 240
    },
    {
      name: 'Transport dialyse',
      description: 'Transport régulier pour séances de dialyse',
      price: 50,
      duration: 60
    },
    {
      name: "Intervention d'urgence",
      description: 'Prise en charge urgente avec équipe médicale',
      price: 150,
      duration: 30
    }]

  },
  pharmacy: {
    title: 'Pharmacie',
    icon: Pill,
    gradient: 'from-emerald-500 to-teal-500',
    fields: [
    {
      id: 'name',
      label: 'Nom du service',
      type: 'text',
      placeholder: 'Ex: Dépistage COVID-19',
      required: true
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Décrivez le service...'
    },
    {
      id: 'price',
      label: 'Prix (TND)',
      type: 'number',
      placeholder: '25',
      required: true
    },
    {
      id: 'duration',
      label: 'Durée (min)',
      type: 'number',
      placeholder: '15'
    },
    {
      id: 'locationType',
      label: 'Lieu du service',
      type: 'select',
      options: [
      {
        value: 'pharmacie',
        label: 'En pharmacie uniquement'
      },
      {
        value: 'domicile',
        label: 'À domicile uniquement'
      },
      {
        value: 'both',
        label: 'Pharmacie et domicile'
      }],

      required: true
    },
    {
      id: 'requiresPrescription',
      label: 'Ordonnance requise',
      type: 'checkbox'
    }],

    defaultServices: [
    {
      name: 'Dépistage COVID-19',
      description: 'Test antigénique avec résultat en 15 min',
      price: 25,
      duration: 15
    },
    {
      name: 'Prise de tension',
      description: 'Mesure et suivi de la tension artérielle',
      price: 0,
      duration: 5
    },
    {
      name: 'Vaccination grippe',
      description: 'Injection du vaccin antigrippal',
      price: 0,
      duration: 15
    },
    {
      name: 'Préparation de pilulier',
      description: 'Organisation hebdomadaire des médicaments',
      price: 10,
      duration: 20
    },
    {
      name: 'Livraison de médicaments',
      description: 'Livraison à domicile de médicaments sur ordonnance',
      price: 5,
      duration: 30
    },
    {
      name: 'Conseil pharmaceutique',
      description: 'Consultation et conseil sur les traitements',
      price: 0,
      duration: 15
    },
    {
      name: 'Test de glycémie',
      description: 'Mesure rapide de la glycémie capillaire',
      price: 5,
      duration: 5
    }]

  },
  funeral: {
    title: 'Services Funéraires',
    icon: Heart,
    gradient: 'from-slate-600 to-slate-700',
    fields: [
    {
      id: 'name',
      label: 'Nom du service',
      type: 'text',
      placeholder: 'Ex: Organisation complète des obsèques',
      required: true
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Décrivez le service...'
    },
    {
      id: 'price',
      label: 'Prix de base (TND)',
      type: 'number',
      placeholder: '2500',
      required: true
    },
    {
      id: 'ceremonyType',
      label: 'Type de cérémonie',
      type: 'select',
      options: [
      {
        value: 'religious',
        label: 'Religieuse uniquement'
      },
      {
        value: 'civil',
        label: 'Civile uniquement'
      },
      {
        value: 'both',
        label: 'Les deux'
      }]

    },
    {
      id: 'burialType',
      label: 'Mode de sépulture',
      type: 'select',
      options: [
      {
        value: 'burial',
        label: 'Inhumation uniquement'
      },
      {
        value: 'cremation',
        label: 'Crémation uniquement'
      },
      {
        value: 'both',
        label: 'Les deux'
      }]

    },
    {
      id: 'repatriation',
      label: 'Rapatriement international inclus',
      type: 'checkbox'
    },
    {
      id: 'floralService',
      label: 'Service floral inclus',
      type: 'checkbox'
    },
    {
      id: 'transportService',
      label: 'Transport des proches inclus',
      type: 'checkbox'
    },
    {
      id: 'adminAssistance',
      label: 'Assistance administrative incluse',
      type: 'checkbox'
    },
    {
      id: 'griefSupport',
      label: 'Accompagnement au deuil inclus',
      type: 'checkbox'
    },
    {
      id: 'available24h',
      label: 'Disponible 24h/24',
      type: 'checkbox'
    }],

    defaultServices: [
    {
      name: 'Organisation complète des obsèques',
      description:
      'Prise en charge totale: démarches administratives, cérémonie, transport, sépulture',
      price: 2500,
      duration: 0
    },
    {
      name: 'Cérémonie religieuse',
      description:
      'Organisation de cérémonie selon les rites religieux (musulman, chrétien, juif)',
      price: 1800,
      duration: 0
    },
    {
      name: 'Rapatriement international',
      description:
      'Transport du défunt vers un autre pays avec toutes les formalités',
      price: 5500,
      duration: 0
    },
    {
      name: 'Crémation avec cérémonie',
      description:
      'Organisation de crémation avec cérémonie civile et urne funéraire',
      price: 2000,
      duration: 0
    },
    {
      name: 'Transport de corps avant mise en bière',
      description:
      'Transfert du lieu de décès vers le domicile ou la chambre funéraire',
      price: 350,
      duration: 0
    },
    {
      name: 'Soins de conservation',
      description: 'Soins de présentation et de conservation du défunt',
      price: 450,
      duration: 0
    }]

  },
  veterinary: {
    title: 'Vétérinaire',
    icon: PawPrint,
    gradient: 'from-amber-500 to-orange-500',
    fields: [
    {
      id: 'name',
      label: 'Nom du service',
      type: 'text',
      placeholder: 'Ex: Consultation générale',
      required: true
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Décrivez le service...'
    },
    {
      id: 'price',
      label: 'Prix (TND)',
      type: 'number',
      placeholder: '60',
      required: true
    },
    {
      id: 'duration',
      label: 'Durée (min)',
      type: 'number',
      placeholder: '30'
    },
    {
      id: 'animalTypes',
      label: 'Animaux pris en charge',
      type: 'multiselect',
      options: [
      {
        value: 'dogs',
        label: 'Chiens'
      },
      {
        value: 'cats',
        label: 'Chats'
      },
      {
        value: 'birds',
        label: 'Oiseaux'
      },
      {
        value: 'nac',
        label: 'NAC (Nouveaux Animaux de Compagnie)'
      },
      {
        value: 'farm',
        label: 'Animaux de ferme'
      },
      {
        value: 'horses',
        label: 'Chevaux'
      }]

    },
    {
      id: 'homeVisit',
      label: 'Consultation à domicile disponible',
      type: 'checkbox'
    },
    {
      id: 'emergency24h',
      label: 'Urgences 24h/24',
      type: 'checkbox'
    }],

    defaultServices: [
    {
      name: 'Consultation générale',
      description: 'Examen complet de santé pour chiens et chats',
      price: 60,
      duration: 30
    },
    {
      name: 'Vaccination annuelle',
      description: 'Rappel de vaccins et examen de santé',
      price: 80,
      duration: 20
    },
    {
      name: 'Consultation NAC',
      description: 'Examen pour lapins, rongeurs, oiseaux, reptiles',
      price: 70,
      duration: 30
    },
    {
      name: 'Identification par puce',
      description: 'Pose de puce électronique et enregistrement',
      price: 90,
      duration: 15
    },
    {
      name: 'Détartrage',
      description: 'Nettoyage dentaire sous anesthésie générale',
      price: 150,
      duration: 45
    },
    {
      name: 'Consultation comportementale',
      description: 'Évaluation et conseils pour problèmes de comportement',
      price: 90,
      duration: 60
    },
    {
      name: 'Échographie vétérinaire',
      description: 'Imagerie diagnostique abdominale ou cardiaque',
      price: 120,
      duration: 30
    },
    {
      name: 'Castration / Stérilisation',
      description: 'Chirurgie de convenance (prix de base)',
      price: 180,
      duration: 60
    }]

  }
};
export function CyberNewService() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const userServiceType = user?.serviceType || 'nursing';
  const config =
  serviceTypeConfigs[userServiceType] || serviceTypeConfigs.nursing;
  const Icon = config.icon;
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleInputChange = (id: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };
  const handleMultiSelectChange = (id: string, value: string) => {
    setFormData((prev) => {
      const currentValues = prev[id] || [];
      const newValues = currentValues.includes(value) ?
      currentValues.filter((v: string) => v !== value) :
      [...currentValues, value];
      return {
        ...prev,
        [id]: newValues
      };
    });
  };
  const handlePreFill = (service: any) => {
    setFormData({
      ...formData,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration
    });
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    navigate('/provider/services');
  };
  const inputClass = `w-full px-3 py-2 text-sm border rounded-lg transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`;
  const selectClass = `w-full px-3 py-2 text-sm border rounded-lg transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`;
  return (
    <div
      className={`min-h-screen pb-20 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div
        className={`absolute inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px]`}>
      </div>

      <div
        className={`relative z-10 backdrop-blur-sm border-b ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
        
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/provider/services')}
            className={`flex items-center mb-3 text-xs font-medium group ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
            
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5 group-hover:-translate-x-1 transition-transform" />
            Retour aux services
          </button>
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center`}>
              
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1
                className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                Nouveau Service
              </h1>
              <p
                className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                {config.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className={`backdrop-blur-sm border rounded-xl p-3 sm:p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
              
              <div className="space-y-4">
                {config.fields.map((field) =>
                <div key={field.id}>
                    <label
                    className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                      {field.label} {field.required && '*'}
                    </label>

                    {field.type === 'text' &&
                  <input
                    type="text"
                    value={formData[field.id] || ''}
                    onChange={(e) =>
                    handleInputChange(field.id, e.target.value)
                    }
                    placeholder={field.placeholder}
                    required={field.required}
                    className={inputClass} />

                  }

                    {field.type === 'textarea' &&
                  <textarea
                    value={formData[field.id] || ''}
                    onChange={(e) =>
                    handleInputChange(field.id, e.target.value)
                    }
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={3}
                    className={`${inputClass} resize-none`} />

                  }

                    {field.type === 'number' &&
                  <div className="relative">
                        {field.id.toLowerCase().includes('price') &&
                    <DollarSign
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />

                    }
                        {field.id.toLowerCase().includes('duration') &&
                    <Clock
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />

                    }
                        <input
                      type="number"
                      value={formData[field.id] || ''}
                      onChange={(e) =>
                      handleInputChange(field.id, e.target.value)
                      }
                      placeholder={field.placeholder}
                      required={field.required}
                      className={`${inputClass} ${field.id.toLowerCase().includes('price') || field.id.toLowerCase().includes('duration') ? 'pl-8' : ''}`} />
                    
                      </div>
                  }

                    {field.type === 'select' && field.options &&
                  <select
                    value={formData[field.id] || ''}
                    onChange={(e) =>
                    handleInputChange(field.id, e.target.value)
                    }
                    required={field.required}
                    className={selectClass}>
                    
                        <option value="">Sélectionnez une option</option>
                        {field.options.map((opt) =>
                    <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                    )}
                      </select>
                  }

                    {field.type === 'checkbox' &&
                  <label className="flex items-center gap-2 cursor-pointer">
                        <input
                      type="checkbox"
                      checked={formData[field.id] || false}
                      onChange={(e) =>
                      handleInputChange(field.id, e.target.checked)
                      }
                      className="w-3.5 h-3.5 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500" />
                    
                        <span
                      className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      
                          Oui
                        </span>
                      </label>
                  }

                    {field.type === 'multiselect' && field.options &&
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {field.options.map((opt) =>
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-xs ${formData[field.id]?.includes(opt.value) ? 'border-cyan-500 bg-cyan-500/10 text-white' : isDark ? 'border-slate-700 text-slate-300 hover:border-slate-600' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                      
                            <input
                        type="checkbox"
                        checked={
                        formData[field.id]?.includes(opt.value) || false
                        }
                        onChange={() =>
                        handleMultiSelectChange(field.id, opt.value)
                        }
                        className={`w-3.5 h-3.5 text-cyan-500 rounded ${isDark ? 'bg-slate-900 border-slate-600' : 'bg-white border-slate-300'}`} />
                      
                            <span className="truncate">{opt.label}</span>
                          </label>
                    )}
                      </div>
                  }
                  </div>
                )}
              </div>

              <div
                className={`mt-6 pt-4 border-t flex justify-end gap-3 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                
                <button
                  type="button"
                  onClick={() => navigate('/provider/services')}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${isDark ? 'border-slate-600 text-white hover:bg-slate-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                  
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-gradient-to-r ${config.gradient} rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-1.5 disabled:opacity-50`}>
                  
                  <Save className="h-3.5 w-3.5" />
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>

          <div>
            {config.defaultServices && config.defaultServices.length > 0 &&
            <div
              className={`backdrop-blur-sm border rounded-xl p-3 sm:p-4 sticky top-24 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
              
                <h3
                className={`text-base font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  <List className="h-4 w-4" />
                  Suggestions
                </h3>
                <p
                className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                  Cliquez sur un service pour pré-remplir le formulaire
                </p>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                  {config.defaultServices.map((service, idx) =>
                <div
                  key={idx}
                  onClick={() => handlePreFill(service)}
                  className={`p-2 rounded-lg border cursor-pointer transition-all group ${isDark ? 'bg-slate-900/50 border-slate-700 hover:border-cyan-500/50' : 'bg-slate-50 border-slate-200 hover:border-cyan-500/50'}`}>
                  
                      <h4
                    className={`text-xs font-semibold mb-0.5 group-hover:text-cyan-500 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        {service.name}
                      </h4>
                      <p
                    className={`text-[10px] mb-1.5 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                        {service.description}
                      </p>
                      <div
                    className={`flex items-center gap-2 text-[10px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    
                        <span className="flex items-center gap-0.5">
                          <DollarSign className="h-3 w-3" />
                          {service.price} TND
                        </span>
                        {service.duration > 0 &&
                    <span className="flex items-center gap-0.5">
                            <Clock className="h-3 w-3" />
                            {service.duration} min
                          </span>
                    }
                      </div>
                    </div>
                )}
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

}