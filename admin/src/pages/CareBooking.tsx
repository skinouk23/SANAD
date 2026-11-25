import React, { useState, Fragment } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Check,
  AlertCircle,
  Pill,
  Activity,
  Baby,
  Heart,
  Stethoscope,
  Moon,
  Brain,
  HandHeart,
  CreditCard,
  Smartphone,
  Lock } from
'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProviderAvailabilityModal } from '../components/ProviderAvailabilityModal';
export function CareBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId } = useParams();
  const { provider, service } = location.state || {};
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [address, setAddress] = useState('');
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    medicalNotes: ''
  });
  // Service-specific states
  const [nursingType, setNursingType] = useState('');
  const [elderlyNeeds, setElderlyNeeds] = useState<string[]>([]);
  const [physioReason, setPhysioReason] = useState('');
  const [maternityType, setMaternityType] = useState('');
  const [babyAge, setBabyAge] = useState('');
  const [checkupType, setCheckupType] = useState<string[]>([]);
  const [nightDuration, setNightDuration] = useState('12h');
  const [doctorSpecialty, setDoctorSpecialty] = useState('');
  const [chronicCondition, setChronicCondition] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [psychologyReason, setPsychologyReason] = useState('');
  const [sessionType, setSessionType] = useState('individual');
  const [companionType, setCompanionType] = useState('');
  const [hasWheelchair, setHasWheelchair] = useState(false);
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'd17' | ''>('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [cardName, setCardName] = useState('');
  const [d17Phone, setD17Phone] = useState('');
  const timeSlots =
  serviceId === 'night' ?
  ['20:00', '21:00', '22:00', '23:00'] :
  [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(4);
    }
  };
  const canProceed = () => {
    if (currentStep === 1) {
      const hasDateTime = bookingDate && bookingTime;
      if (serviceId === 'nursing') return hasDateTime && nursingType;
      if (serviceId === 'elderly') return hasDateTime && elderlyNeeds.length > 0;
      if (serviceId === 'physio') return hasDateTime && physioReason;
      if (serviceId === 'maternity') return hasDateTime && maternityType;
      if (serviceId === 'checkup') return hasDateTime && checkupType.length > 0;
      if (serviceId === 'night') return hasDateTime && nightDuration;
      if (serviceId === 'doctor-home') return hasDateTime && doctorSpecialty;
      if (serviceId === 'chronic-care')
      return hasDateTime && chronicCondition && frequency;
      if (serviceId === 'psychology')
      return hasDateTime && psychologyReason && sessionType;
      if (serviceId === 'medical-companion') return hasDateTime && companionType;
      return hasDateTime;
    }
    if (currentStep === 2)
    return address && patientInfo.name && patientInfo.phone;
    if (currentStep === 3) {
      if (paymentMethod === 'card') {
        return cardNumber && cardExpiry && cardCVC && cardName;
      }
      if (paymentMethod === 'd17') {
        return d17Phone;
      }
      return false;
    }
    return true;
  };
  if (!provider || !service) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">Aucun professionnel sélectionné</p>
          <Button onClick={() => navigate('/services')} variant="primary">
            Retour aux services
          </Button>
        </Card>
      </div>);

  }
  const renderNursingFields = () =>
  <Card>
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Pill className="h-6 w-6 text-teal-600" />
        Type de soins infirmiers
      </h2>
      <div className="space-y-3">
        {[
      {
        id: 'injection',
        label: 'Injection / Perfusion',
        desc: 'Injection intramusculaire, sous-cutanée ou perfusion'
      },
      {
        id: 'dressing',
        label: 'Pansement',
        desc: 'Soins de plaies, changement de pansements'
      },
      {
        id: 'blood-test',
        label: 'Prise de sang',
        desc: 'Prélèvement sanguin à domicile'
      },
      {
        id: 'monitoring',
        label: 'Surveillance',
        desc: 'Surveillance post-opératoire ou chronique'
      }].
      map((type) =>
      <button
        key={type.id}
        type="button"
        onClick={() => setNursingType(type.id)}
        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${nursingType === type.id ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}>
        
            <h3 className="font-bold text-gray-900 mb-1">{type.label}</h3>
            <p className="text-sm text-gray-600">{type.desc}</p>
          </button>
      )}
      </div>
    </Card>;

  const renderElderlyFields = () =>
  <Card>
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Heart className="h-6 w-6 text-rose-600" />
        Besoins d'assistance
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Sélectionnez tous les services nécessaires
      </p>
      <div className="space-y-3">
        {[
      {
        id: 'hygiene',
        label: 'Toilette et hygiène',
        icon: '🚿'
      },
      {
        id: 'dressing',
        label: 'Habillage',
        icon: '👔'
      },
      {
        id: 'meals',
        label: 'Préparation et aide aux repas',
        icon: '🍽️'
      },
      {
        id: 'mobility',
        label: 'Aide aux déplacements',
        icon: '🚶'
      },
      {
        id: 'company',
        label: 'Compagnie et stimulation',
        icon: '💬'
      },
      {
        id: 'medication',
        label: 'Gestion des médicaments',
        icon: '💊'
      }].
      map((need) =>
      <label
        key={need.id}
        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${elderlyNeeds.includes(need.id) ? 'border-rose-600 bg-rose-50' : 'border-gray-200 hover:border-gray-300'}`}>
        
            <input
          type="checkbox"
          checked={elderlyNeeds.includes(need.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setElderlyNeeds([...elderlyNeeds, need.id]);
            } else {
              setElderlyNeeds(elderlyNeeds.filter((n) => n !== need.id));
            }
          }}
          className="w-5 h-5 text-rose-600 rounded" />
        
            <span className="text-2xl">{need.icon}</span>
            <span className="font-medium text-gray-900">{need.label}</span>
          </label>
      )}
      </div>
    </Card>;

  const renderPhysioFields = () =>
  <Card>
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Activity className="h-6 w-6 text-blue-600" />
        Raison de la consultation
      </h2>
      <div className="space-y-3">
        {[
      {
        id: 'motor',
        label: 'Rééducation motrice',
        desc: 'Post-opératoire, fracture, entorse'
      },
      {
        id: 'respiratory',
        label: 'Rééducation respiratoire',
        desc: 'Problèmes respiratoires, post-COVID'
      },
      {
        id: 'massage',
        label: 'Massage thérapeutique',
        desc: 'Douleurs musculaires, tensions'
      },
      {
        id: 'sports',
        label: 'Rééducation sportive',
        desc: "Blessures sportives, reprise d'activité"
      }].
      map((reason) =>
      <button
        key={reason.id}
        type="button"
        onClick={() => setPhysioReason(reason.id)}
        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${physioReason === reason.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
        
            <h3 className="font-bold text-gray-900 mb-1">{reason.label}</h3>
            <p className="text-sm text-gray-600">{reason.desc}</p>
          </button>
      )}
      </div>
    </Card>;

  const renderMaternityFields = () =>
  <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Baby className="h-6 w-6 text-amber-600" />
          Type de suivi
        </h2>
        <div className="space-y-3">
          {[
        {
          id: 'postnatal',
          label: 'Suivi post-natal',
          desc: 'Surveillance de la maman après accouchement'
        },
        {
          id: 'breastfeeding',
          label: "Aide à l'allaitement",
          desc: 'Conseils et soutien allaitement maternel'
        },
        {
          id: 'newborn',
          label: 'Soins du nouveau-né',
          desc: 'Bain, soins du cordon, conseils'
        },
        {
          id: 'complete',
          label: 'Suivi complet',
          desc: 'Maman + bébé - Accompagnement global'
        }].
        map((type) =>
        <button
          key={type.id}
          type="button"
          onClick={() => setMaternityType(type.id)}
          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${maternityType === type.id ? 'border-amber-600 bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}>
          
              <h3 className="font-bold text-gray-900 mb-1">{type.label}</h3>
              <p className="text-sm text-gray-600">{type.desc}</p>
            </button>
        )}
        </div>
      </Card>

      {(maternityType === 'newborn' || maternityType === 'complete') &&
    <Card>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Âge du bébé
          </label>
          <select
        value={babyAge}
        onChange={(e) => setBabyAge(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
        
            <option value="">Sélectionner</option>
            <option value="0-1week">0-1 semaine</option>
            <option value="1-4weeks">1-4 semaines</option>
            <option value="1-3months">1-3 mois</option>
            <option value="3-6months">3-6 mois</option>
          </select>
        </Card>
    }
    </div>;

  const renderCheckupFields = () =>
  <Card>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Examens souhaités
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Sélectionnez tous les examens nécessaires
      </p>
      <div className="space-y-3">
        {[
      {
        id: 'blood-pressure',
        label: 'Tension artérielle',
        icon: '🩺'
      },
      {
        id: 'blood-sugar',
        label: 'Glycémie',
        icon: '🩸'
      },
      {
        id: 'temperature',
        label: 'Température',
        icon: '🌡️'
      },
      {
        id: 'heart-rate',
        label: 'Fréquence cardiaque',
        icon: '❤️'
      },
      {
        id: 'oxygen',
        label: 'Saturation en oxygène',
        icon: '💨'
      },
      {
        id: 'weight',
        label: 'Poids et IMC',
        icon: '⚖️'
      }].
      map((exam) =>
      <label
        key={exam.id}
        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${checkupType.includes(exam.id) ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}>
        
            <input
          type="checkbox"
          checked={checkupType.includes(exam.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setCheckupType([...checkupType, exam.id]);
            } else {
              setCheckupType(checkupType.filter((t) => t !== exam.id));
            }
          }}
          className="w-5 h-5 text-teal-600 rounded" />
        
            <span className="text-2xl">{exam.icon}</span>
            <span className="font-medium text-gray-900">{exam.label}</span>
          </label>
      )}
      </div>
    </Card>;

  const renderNightFields = () =>
  <Card>
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Moon className="h-6 w-6 text-rose-600" />
        Durée de la garde
      </h2>
      <div className="space-y-3">
        {[
      {
        id: '8h',
        label: 'Garde courte (8h)',
        desc: '22h00 - 06h00',
        price: '80 TND'
      },
      {
        id: '12h',
        label: 'Garde standard (12h)',
        desc: '20h00 - 08h00',
        price: '120 TND'
      },
      {
        id: '24h',
        label: 'Garde 24h',
        desc: 'Surveillance continue',
        price: '200 TND'
      }].
      map((duration) =>
      <button
        key={duration.id}
        type="button"
        onClick={() => setNightDuration(duration.id)}
        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${nightDuration === duration.id ? 'border-rose-600 bg-rose-50' : 'border-gray-200 hover:border-gray-300'}`}>
        
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-gray-900">{duration.label}</h3>
              <span className="text-lg font-bold text-rose-600">
                {duration.price}
              </span>
            </div>
            <p className="text-sm text-gray-600">{duration.desc}</p>
          </button>
      )}
      </div>
    </Card>;

  const renderDoctorFields = () =>
  <Card>
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Stethoscope className="h-6 w-6 text-blue-600" />
        Type de consultation
      </h2>
      <div className="space-y-3">
        {[
      {
        id: 'general',
        label: 'Médecine générale',
        desc: 'Consultation généraliste, certificats médicaux'
      },
      {
        id: 'pediatric',
        label: 'Pédiatrie',
        desc: 'Consultation pour enfants et nourrissons'
      },
      {
        id: 'geriatric',
        label: 'Gériatrie',
        desc: 'Consultation pour personnes âgées'
      },
      {
        id: 'urgent',
        label: 'Consultation urgente',
        desc: 'Fièvre, douleurs, symptômes aigus'
      }].
      map((specialty) =>
      <button
        key={specialty.id}
        type="button"
        onClick={() => setDoctorSpecialty(specialty.id)}
        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${doctorSpecialty === specialty.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
        
            <h3 className="font-bold text-gray-900 mb-1">{specialty.label}</h3>
            <p className="text-sm text-gray-600">{specialty.desc}</p>
          </button>
      )}
      </div>
    </Card>;

  const renderChronicFields = () =>
  <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Condition chronique
        </h2>
        <div className="space-y-3">
          {[
        {
          id: 'diabetes',
          label: 'Diabète',
          desc: 'Type 1 ou 2 - Gestion glycémie et insuline'
        },
        {
          id: 'hypertension',
          label: 'Hypertension artérielle',
          desc: 'Surveillance tension et traitement'
        },
        {
          id: 'cancer',
          label: 'Cancer',
          desc: 'Soins palliatifs et accompagnement'
        },
        {
          id: 'cardiac',
          label: 'Maladie cardiaque',
          desc: 'Insuffisance cardiaque, post-infarctus'
        }].
        map((condition) =>
        <button
          key={condition.id}
          type="button"
          onClick={() => setChronicCondition(condition.id)}
          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${chronicCondition === condition.id ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
          
              <h3 className="font-bold text-gray-900 mb-1">
                {condition.label}
              </h3>
              <p className="text-sm text-gray-600">{condition.desc}</p>
            </button>
        )}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Fréquence des soins
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
        {
          id: 'weekly',
          label: 'Hebdomadaire',
          price: '150 TND/mois'
        },
        {
          id: 'biweekly',
          label: 'Bi-hebdomadaire',
          price: '280 TND/mois'
        },
        {
          id: 'daily',
          label: 'Quotidien',
          price: '400 TND/mois'
        }].
        map((freq) =>
        <button
          key={freq.id}
          type="button"
          onClick={() => setFrequency(freq.id)}
          className={`p-4 rounded-lg border-2 transition-all text-center ${frequency === freq.id ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
          
              <h3 className="font-bold text-gray-900 mb-1">{freq.label}</h3>
              <p className="text-sm text-purple-600 font-semibold">
                {freq.price}
              </p>
            </button>
        )}
        </div>
      </Card>
    </div>;

  const renderPsychologyFields = () =>
  <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Brain className="h-6 w-6 text-rose-600" />
          Motif de consultation
        </h2>
        <div className="space-y-3">
          {[
        {
          id: 'depression',
          label: 'Dépression',
          desc: "Tristesse, perte d'intérêt, fatigue"
        },
        {
          id: 'anxiety',
          label: 'Anxiété / Stress',
          desc: 'Angoisses, crises de panique'
        },
        {
          id: 'grief',
          label: 'Deuil',
          desc: 'Accompagnement dans le deuil'
        },
        {
          id: 'caregiver',
          label: 'Épuisement aidant',
          desc: 'Burn-out des aidants familiaux'
        }].
        map((reason) =>
        <button
          key={reason.id}
          type="button"
          onClick={() => setPsychologyReason(reason.id)}
          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${psychologyReason === reason.id ? 'border-rose-600 bg-rose-50' : 'border-gray-200 hover:border-gray-300'}`}>
          
              <h3 className="font-bold text-gray-900 mb-1">{reason.label}</h3>
              <p className="text-sm text-gray-600">{reason.desc}</p>
            </button>
        )}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Type de séance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
        {
          id: 'individual',
          label: 'Individuelle',
          desc: 'Séance en tête-à-tête'
        },
        {
          id: 'family',
          label: 'Familiale',
          desc: 'Avec la famille'
        }].
        map((type) =>
        <button
          key={type.id}
          type="button"
          onClick={() => setSessionType(type.id)}
          className={`p-4 rounded-lg border-2 transition-all text-left ${sessionType === type.id ? 'border-rose-600 bg-rose-50' : 'border-gray-200 hover:border-gray-300'}`}>
          
              <h3 className="font-bold text-gray-900 mb-1">{type.label}</h3>
              <p className="text-sm text-gray-600">{type.desc}</p>
            </button>
        )}
        </div>
      </Card>
    </div>;

  const renderCompanionFields = () =>
  <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <HandHeart className="h-6 w-6 text-teal-600" />
          Type d'accompagnement
        </h2>
        <div className="space-y-3">
          {[
        {
          id: 'appointment',
          label: 'Rendez-vous médical',
          desc: 'Accompagnement chez le médecin/spécialiste'
        },
        {
          id: 'hospital',
          label: 'Hôpital / Clinique',
          desc: 'Accompagnement hospitalisation, examens'
        },
        {
          id: 'pharmacy',
          label: 'Pharmacie',
          desc: 'Aide pour achats de médicaments'
        },
        {
          id: 'administrative',
          label: 'Démarches administratives',
          desc: 'CNAM, mutuelles, dossiers médicaux'
        }].
        map((type) =>
        <button
          key={type.id}
          type="button"
          onClick={() => setCompanionType(type.id)}
          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${companionType === type.id ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}>
          
              <h3 className="font-bold text-gray-900 mb-1">{type.label}</h3>
              <p className="text-sm text-gray-600">{type.desc}</p>
            </button>
        )}
        </div>
      </Card>

      <Card>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
          type="checkbox"
          checked={hasWheelchair}
          onChange={(e) => setHasWheelchair(e.target.checked)}
          className="w-5 h-5 text-teal-600 rounded" />
        
          <div>
            <span className="font-semibold text-gray-900">
              Fauteuil roulant
            </span>
            <p className="text-sm text-gray-600">
              La personne se déplace en fauteuil roulant
            </p>
          </div>
        </label>
      </Card>
    </div>;

  const renderServiceSpecificFields = () => {
    switch (serviceId) {
      case 'nursing':
        return renderNursingFields();
      case 'elderly':
        return renderElderlyFields();
      case 'physio':
        return renderPhysioFields();
      case 'maternity':
        return renderMaternityFields();
      case 'checkup':
        return renderCheckupFields();
      case 'night':
        return renderNightFields();
      case 'doctor-home':
        return renderDoctorFields();
      case 'chronic-care':
        return renderChronicFields();
      case 'psychology':
        return renderPsychologyFields();
      case 'medical-companion':
        return renderCompanionFields();
      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(`/care/${serviceId}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 font-medium">
            
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center text-3xl">
              {provider.image}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {provider.name}
              </h1>
              <p className="text-gray-600">{service.title}</p>
            </div>
          </div>
        </div>

        {currentStep !== 4 &&
        <Card className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) =>
            <Fragment key={step}>
                  <div className="flex items-center gap-3">
                    <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  
                      {currentStep > step ?
                  <Check className="h-5 w-5" /> :

                  step
                  }
                    </div>
                    <div className="hidden sm:block">
                      <p
                    className={`text-sm font-semibold ${currentStep >= step ? 'text-gray-900' : 'text-gray-500'}`}>
                    
                        {step === 1 ?
                    'Détails' :
                    step === 2 ?
                    'Informations' :
                    'Confirmation'}
                      </p>
                    </div>
                  </div>
                  {step < 3 &&
              <div
                className={`flex-1 h-1 mx-4 rounded-full transition-all ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`}>
              </div>
              }
                </Fragment>
            )}
            </div>
          </Card>
        }

        <form onSubmit={handleSubmit}>
          {currentStep === 1 &&
          <div className="space-y-6">
              {renderServiceSpecificFields()}

              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Date et heure
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => {
                        const newDate = e.target.value;
                        if (bookingTime) {
                          handleDateTimeChange(newDate, bookingTime);
                        } else {
                          setBookingDate(newDate);
                        }
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Heure *
                    </label>
                    <select
                    value={bookingTime}
                    onChange={(e) => {
                      const newTime = e.target.value;
                      if (bookingDate) {
                        handleDateTimeChange(bookingDate, newTime);
                      } else {
                        setBookingTime(newTime);
                      }
                    }}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    
                      <option value="">Sélectionner</option>
                      {timeSlots.map((time) =>
                    <option key={time} value={time}>
                          {time}
                        </option>
                    )}
                    </select>
                  </div>
                </div>

                {bookingDate && bookingTime &&
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <Check className="h-4 w-4" />
                      <span>Créneau disponible confirmé</span>
                    </div>
                  </div>
              }
              </Card>
            </div>
          }

          {currentStep === 2 &&
          <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Informations
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Adresse *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Adresse complète"
                    rows={2}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none">
                  </textarea>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Nom complet *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                      type="text"
                      value={patientInfo.name}
                      onChange={(e) =>
                      setPatientInfo({
                        ...patientInfo,
                        name: e.target.value
                      })
                      }
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Âge
                    </label>
                    <input
                    type="number"
                    value={patientInfo.age}
                    onChange={(e) =>
                    setPatientInfo({
                      ...patientInfo,
                      age: e.target.value
                    })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Téléphone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                      type="tel"
                      value={patientInfo.phone}
                      onChange={(e) =>
                      setPatientInfo({
                        ...patientInfo,
                        phone: e.target.value
                      })
                      }
                      placeholder="+216 XX XXX XXX"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                      type="email"
                      value={patientInfo.email}
                      onChange={(e) =>
                      setPatientInfo({
                        ...patientInfo,
                        email: e.target.value
                      })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Notes médicales
                  </label>
                  <textarea
                  value={patientInfo.medicalNotes}
                  onChange={(e) =>
                  setPatientInfo({
                    ...patientInfo,
                    medicalNotes: e.target.value
                  })
                  }
                  placeholder="Informations médicales importantes, allergies, traitements..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none">
                </textarea>
                </div>
              </div>
            </Card>
          }

          {currentStep === 3 &&
          <div className="space-y-6">
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Récapitulatif
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Service
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Professionnel</span>
                        <span className="font-medium text-gray-900">
                          {provider.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service</span>
                        <span className="font-medium text-gray-900">
                          {service.title}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date</span>
                        <span className="font-medium text-gray-900">
                          {bookingDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Heure</span>
                        <span className="font-medium text-gray-900">
                          {bookingTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Patient
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nom</span>
                        <span className="font-medium text-gray-900">
                          {patientInfo.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Téléphone</span>
                        <span className="font-medium text-gray-900">
                          {patientInfo.phone}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 block mb-1">
                          Adresse
                        </span>
                        <span className="font-medium text-gray-900">
                          {address}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-3xl font-bold text-blue-600">
                        {provider.price} TND
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Payment Section */}
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Lock className="h-6 w-6 text-gray-600" />
                  Paiement sécurisé
                </h2>

                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-900">
                      <p className="font-semibold mb-1">
                        💰 Paiement séquestre
                      </p>
                      <p>
                        Le montant sera bloqué sur votre compte. Le
                        professionnel sera payé uniquement après validation du
                        service par vous.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-4">
                    Choisissez votre méthode de paiement
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Credit Card */}
                    <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    
                      <div className="flex items-center gap-3 mb-2">
                        <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${paymentMethod === 'card' ? 'bg-blue-600' : 'bg-gray-200'}`}>
                        
                          <CreditCard
                          className={`h-5 w-5 ${paymentMethod === 'card' ? 'text-white' : 'text-gray-600'}`} />
                        
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            Carte bancaire
                          </h3>
                          <p className="text-xs text-gray-600">
                            Visa, Mastercard
                          </p>
                        </div>
                      </div>
                      {paymentMethod === 'card' &&
                    <div className="flex items-center gap-2 text-xs text-blue-600">
                          <Check className="h-4 w-4" />
                          <span>Sélectionné</span>
                        </div>
                    }
                    </button>

                    {/* D17 (Sobflous) */}
                    <button
                    type="button"
                    onClick={() => setPaymentMethod('d17')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${paymentMethod === 'd17' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    
                      <div className="flex items-center gap-3 mb-2">
                        <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${paymentMethod === 'd17' ? 'bg-purple-600' : 'bg-gray-200'}`}>
                        
                          <Smartphone
                          className={`h-5 w-5 ${paymentMethod === 'd17' ? 'text-white' : 'text-gray-600'}`} />
                        
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            D17 (Sobflous)
                          </h3>
                          <p className="text-xs text-gray-600">
                            Paiement mobile
                          </p>
                        </div>
                      </div>
                      {paymentMethod === 'd17' &&
                    <div className="flex items-center gap-2 text-xs text-purple-600">
                          <Check className="h-4 w-4" />
                          <span>Sélectionné</span>
                        </div>
                    }
                    </button>
                  </div>
                </div>

                {/* Card Payment Form */}
                {paymentMethod === 'card' &&
              <div className="space-y-4 animate-fadeIn">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Numéro de carte *
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '');
                        if (value.length <= 16 && /^\d*$/.test(value)) {
                          setCardNumber(
                            value.replace(/(\d{4})/g, '$1 ').trim()
                          );
                        }
                      }}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Nom sur la carte *
                      </label>
                      <input
                    type="text"
                    value={cardName}
                    onChange={(e) =>
                    setCardName(e.target.value.toUpperCase())
                    }
                    placeholder="AHMED BEN ALI"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Date d'expiration *
                        </label>
                        <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 4) {
                          if (value.length >= 2) {
                            setCardExpiry(
                              value.slice(0, 2) + '/' + value.slice(2)
                            );
                          } else {
                            setCardExpiry(value);
                          }
                        }
                      }}
                      placeholder="MM/AA"
                      maxLength={5}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          CVC *
                        </label>
                        <input
                      type="text"
                      value={cardCVC}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 3) {
                          setCardCVC(value);
                        }
                      }}
                      placeholder="123"
                      maxLength={3}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <Lock className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <p className="text-xs text-green-800">
                        Paiement sécurisé par Stripe. Vos données bancaires sont
                        protégées.
                      </p>
                    </div>
                  </div>
              }

                {/* D17 Payment Form */}
                {paymentMethod === 'd17' &&
              <div className="space-y-4 animate-fadeIn">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Numéro de téléphone D17 *
                      </label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                      type="tel"
                      value={d17Phone}
                      onChange={(e) => setD17Phone(e.target.value)}
                      placeholder="+216 XX XXX XXX"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                    
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2 text-sm">
                        Comment ça marche ?
                      </h4>
                      <ol className="text-xs text-purple-800 space-y-1 list-decimal list-inside">
                        <li>Entrez votre numéro D17</li>
                        <li>Vous recevrez un code de confirmation par SMS</li>
                        <li>Validez le paiement dans l'app D17</li>
                        <li>
                          Le montant sera bloqué jusqu'à validation du service
                        </li>
                      </ol>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <Lock className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <p className="text-xs text-green-800">
                        Paiement sécurisé par D17 (Sobflous). Transaction
                        protégée.
                      </p>
                    </div>
                  </div>
              }

                {!paymentMethod &&
              <div className="text-center py-8 text-gray-500">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">
                      Sélectionnez une méthode de paiement
                    </p>
                  </div>
              }
              </Card>
            </div>
          }

          {currentStep === 4 &&
          <Card className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Réservation confirmée !
              </h2>
              <p className="text-gray-600 mb-2">Numéro de réservation :</p>
              <p className="text-xl font-bold text-blue-600 mb-6">
                RES-2024-
                {Math.floor(Math.random() * 10000).
              toString().
              padStart(4, '0')}
              </p>
              <Card className="bg-blue-50 border-blue-200 text-left max-w-md mx-auto mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">
                  📋 Prochaines étapes
                </h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-600">1.</span>
                    <span>Confirmation par SMS</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-600">2.</span>
                    <span>{provider.name} vous contactera</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-600">3.</span>
                    <span>
                      Rendez-vous le {bookingDate} à {bookingTime}
                    </span>
                  </li>
                </ol>
              </Card>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                type="button"
                variant="primary"
                onClick={() => navigate('/patient-dashboard')}>
                
                  Tableau de bord
                </Button>
                <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/services')}>
                
                  Nouveaux services
                </Button>
              </div>
            </Card>
          }

          {currentStep < 4 &&
          <div className="flex items-center justify-between mt-8">
              {currentStep > 1 ?
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}>
              
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Précédent
                </Button> :

            <div></div>
            }
              <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!canProceed()}>
              
                {currentStep === 3 ? 'Confirmer' : 'Continuer'}
              </Button>
            </div>
          }
        </form>
      </div>

      {/* Provider Availability Modal */}
      <ProviderAvailabilityModal
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        providerName={provider?.name || 'Ce professionnel'}
        requestedDate={bookingDate}
        requestedTime={bookingTime}
        availabilities={mockAvailabilities}
        onSelectSlot={handleSelectAlternativeSlot} />
      
    </div>);

}