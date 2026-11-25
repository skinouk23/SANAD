import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Mail,
  Share2,
  Target,
  type LucideIcon,
} from 'lucide-react';

export interface NewCampaignFormData {
  name: string;
  type: 'social' | 'email';
  objective: 'awareness' | 'engagement' | 'conversions';
  startDate: string;
  endDate: string;
  budget: string;
  targetAudience: {
    ageMin: string;
    ageMax: string;
    location: string;
    interests: string[];
  };
  content: {
    headline: string;
    description: string;
    cta: string;
    image: string;
  };
}

export interface CampaignStepDefinition {
  number: number;
  title: string;
  icon: LucideIcon;
}

export interface CampaignTypeDefinition {
  id: NewCampaignFormData['type'];
  name: string;
  icon: LucideIcon;
  description: string;
  gradient: string;
}

export interface CampaignObjectiveDefinition {
  id: NewCampaignFormData['objective'];
  name: string;
  description: string;
}

const DEFAULT_FORM_DATA: NewCampaignFormData = {
  name: '',
  type: 'social',
  objective: 'awareness',
  startDate: '',
  endDate: '',
  budget: '',
  targetAudience: {
    ageMin: '18',
    ageMax: '65',
    location: 'tunisia',
    interests: [],
  },
  content: {
    headline: '',
    description: '',
    cta: '',
    image: '',
  },
};

export const CAMPAIGN_STEPS: CampaignStepDefinition[] = [
  { number: 1, title: 'Informations', icon: FileText },
  { number: 2, title: 'Budget', icon: Target },
  { number: 3, title: 'Contenu', icon: ImageIcon },
  { number: 4, title: 'Révision', icon: CheckCircle2 },
];

export const CAMPAIGN_TYPES: CampaignTypeDefinition[] = [
  {
    id: 'social',
    name: 'Réseaux sociaux',
    icon: Share2,
    description: 'Facebook, Instagram, LinkedIn',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'email',
    name: 'Email marketing',
    icon: Mail,
    description: 'Campagne par email ciblée',
    gradient: 'from-purple-500 to-pink-500',
  },
];

export const CAMPAIGN_OBJECTIVES: CampaignObjectiveDefinition[] = [
  { id: 'awareness', name: 'Notoriété', description: 'Augmenter la visibilité' },
  { id: 'engagement', name: 'Engagement', description: 'Interactions et partages' },
  { id: 'conversions', name: 'Conversions', description: 'Réservations et patients' },
];

export const CAMPAIGN_INTERESTS = [
  'Santé et bien-être',
  'Soins à domicile',
  'Personnes âgées',
  'Kinésithérapie',
  'Nutrition',
  'Sport et fitness',
];

export const CAMPAIGN_INPUT_CLASS =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-500';

function normalizeTemplateData(templateData: unknown): NewCampaignFormData {
  if (!templateData || typeof templateData !== 'object') {
    return DEFAULT_FORM_DATA;
  }

  const source = templateData as Partial<NewCampaignFormData>;

  return {
    name: source.name ?? DEFAULT_FORM_DATA.name,
    type: source.type === 'email' ? 'email' : DEFAULT_FORM_DATA.type,
    objective:
      source.objective === 'engagement' || source.objective === 'conversions'
        ? source.objective
        : DEFAULT_FORM_DATA.objective,
    startDate: source.startDate ?? DEFAULT_FORM_DATA.startDate,
    endDate: source.endDate ?? DEFAULT_FORM_DATA.endDate,
    budget: source.budget ?? DEFAULT_FORM_DATA.budget,
    targetAudience: {
      ...DEFAULT_FORM_DATA.targetAudience,
      ...source.targetAudience,
      interests: source.targetAudience?.interests ?? DEFAULT_FORM_DATA.targetAudience.interests,
    },
    content: {
      ...DEFAULT_FORM_DATA.content,
      ...source.content,
    },
  };
}

export function useNewCampaignScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<NewCampaignFormData>(DEFAULT_FORM_DATA);

  useEffect(() => {
    setFormData(normalizeTemplateData(location.state));
  }, [location.state]);

  function setType(type: NewCampaignFormData['type']) {
    setFormData((current) => ({ ...current, type }));
  }

  function setObjective(objective: NewCampaignFormData['objective']) {
    setFormData((current) => ({ ...current, objective }));
  }

  function updateField<Key extends keyof NewCampaignFormData>(
    key: Key,
    value: NewCampaignFormData[Key],
  ) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  function updateTargetAudience(
    key: keyof NewCampaignFormData['targetAudience'],
    value: string | string[],
  ) {
    setFormData((current) => ({
      ...current,
      targetAudience: {
        ...current.targetAudience,
        [key]: value,
      },
    }));
  }

  function updateContent(key: keyof NewCampaignFormData['content'], value: string) {
    setFormData((current) => ({
      ...current,
      content: {
        ...current.content,
        [key]: value,
      },
    }));
  }

  function toggleInterest(interest: string) {
    setFormData((current) => {
      const interests = current.targetAudience.interests.includes(interest)
        ? current.targetAudience.interests.filter((item) => item !== interest)
        : [...current.targetAudience.interests, interest];

      return {
        ...current,
        targetAudience: {
          ...current.targetAudience,
          interests,
        },
      };
    });
  }

  function handleNext() {
    setCurrentStep((current) => Math.min(4, current + 1));
  }

  function handleBack() {
    setCurrentStep((current) => Math.max(1, current - 1));
  }

  function handleSubmit() {
    navigate('/provider/marketing');
  }

  return {
    campaignInterests: CAMPAIGN_INTERESTS,
    campaignObjectives: CAMPAIGN_OBJECTIVES,
    campaignTypes: CAMPAIGN_TYPES,
    currentStep,
    formData,
    handleBack,
    handleNext,
    handleSubmit,
    inputClass: CAMPAIGN_INPUT_CLASS,
    setObjective,
    setType,
    steps: CAMPAIGN_STEPS,
    toggleInterest,
    updateContent,
    updateField,
    updateTargetAudience,
  };
}
