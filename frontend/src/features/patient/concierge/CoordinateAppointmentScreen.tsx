import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  Brain,
  Calendar,
  Clock,
  Filter,
  Heart,
  MapPin,
  Phone,
  Search,
  Star,
  Stethoscope,
  User,
  X,
} from 'lucide-react';

import { DatePickerField } from '@/shared/ui/composites/date-picker-field';
import { Button } from '@/shared/ui/primitives/button';
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/primitives/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';

const ALL_SPECIALTIES_VALUE = '__all_specialties__';
const ALL_ZONES_VALUE = '__all_zones__';

export function CoordinateAppointmentScreen() {
  const navigate = useNavigate();
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const today = format(Date.now(), 'yyyy-MM-dd');

  const specialties = [
    { id: 'cardiology', name: 'Cardiologie', icon: Heart, gradient: 'from-red-500 to-rose-500' },
    { id: 'neurology', name: 'Neurologie', icon: Brain, gradient: 'from-purple-500 to-pink-500' },
    {
      id: 'general',
      name: 'Médecine générale',
      icon: Stethoscope,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'physiotherapy',
      name: 'Kinésithérapie',
      icon: Activity,
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  const zones = ['Tunis Centre', 'Ariana', 'Manouba', 'Ben Arous', 'La Marsa', 'Carthage'];

  const specialists = [
    {
      id: 1,
      name: 'Dr. Ahmed Trabelsi',
      specialty: 'Cardiologue',
      rating: 4.9,
      reviews: 127,
      experience: '15 ans',
      zone: 'Tunis Centre',
      nextAvailable: 'Demain 10h',
      price: 80,
      image: '👨‍⚕️',
      languages: ['Français', 'Arabe'],
      consultationType: ['Cabinet', 'Vidéo'],
    },
    {
      id: 2,
      name: 'Dr. Leila Ben Ali',
      specialty: 'Neurologue',
      rating: 4.8,
      reviews: 95,
      experience: '12 ans',
      zone: 'Ariana',
      nextAvailable: "Aujourd'hui 16h",
      price: 90,
      image: '👩‍⚕️',
      languages: ['Français', 'Arabe', 'Anglais'],
      consultationType: ['Cabinet', 'Vidéo', 'Domicile'],
    },
    {
      id: 3,
      name: 'Dr. Mohamed Gharbi',
      specialty: 'Médecin généraliste',
      rating: 5.0,
      reviews: 203,
      experience: '20 ans',
      zone: 'La Marsa',
      nextAvailable: 'Demain 14h',
      price: 60,
      image: '👨‍⚕️',
      languages: ['Français', 'Arabe'],
      consultationType: ['Cabinet', 'Domicile'],
    },
  ];

  const clearFilters = () => {
    setSelectedSpecialty('');
    setSelectedZone('');
    setSelectedDate('');
    setSearchQuery('');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 transition-colors duration-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute right-10 top-20 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl dark:bg-blue-500/20" />
        <div className="absolute bottom-20 left-10 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-500/20" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/health-concierge')}
              className="flex items-center font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au concierge
            </button>
          </div>
          <div>
            <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Coordonner un rendez-vous
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-slate-400">
              Trouvez et réservez le meilleur spécialiste pour vous
            </p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {specialties.map((specialty) => (
            <div
              key={specialty.id}
              onClick={() => setSelectedSpecialty(specialty.id)}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl p-6 transition-all hover:scale-105 ${selectedSpecialty === specialty.id ? 'border-2 border-blue-500 bg-white shadow-lg dark:bg-slate-700' : 'border border-slate-200 bg-white shadow-sm hover:border-slate-300 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-slate-600'}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${specialty.gradient} opacity-0 transition-opacity group-hover:opacity-10`}
              />
              <div className="relative text-center">
                <div
                  className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${specialty.gradient} shadow-lg transition-transform group-hover:scale-110`}
                >
                  <specialty.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  {specialty.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Rechercher un spécialiste..."
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 transition-all placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
              />
            </div>

            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-slate-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtres
            </Button>

            {selectedSpecialty || selectedZone || selectedDate ? (
              <Button
                onClick={clearFilters}
                variant="outline"
                className="border-slate-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
              >
                <X className="mr-2 h-4 w-4" />
                Effacer
              </Button>
            ) : null}
          </div>

          {showFilters ? (
            <FieldGroup className="grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 dark:border-slate-700 md:grid-cols-3">
              <Field>
                <FieldLabel
                  htmlFor="appointment-specialty"
                  className="font-semibold text-gray-900 dark:text-white"
                >
                  Spécialité
                </FieldLabel>
                <Select
                  value={selectedSpecialty || ALL_SPECIALTIES_VALUE}
                  onValueChange={(value) =>
                    setSelectedSpecialty(value === ALL_SPECIALTIES_VALUE ? '' : value)
                  }
                >
                  <SelectTrigger
                    id="appointment-specialty"
                    className="h-11 w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <SelectValue placeholder="Toutes les spécialités" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={ALL_SPECIALTIES_VALUE}>Toutes les spécialités</SelectItem>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="appointment-zone"
                  className="font-semibold text-gray-900 dark:text-white"
                >
                  Zone géographique
                </FieldLabel>
                <Select
                  value={selectedZone || ALL_ZONES_VALUE}
                  onValueChange={(value) => setSelectedZone(value === ALL_ZONES_VALUE ? '' : value)}
                >
                  <SelectTrigger
                    id="appointment-zone"
                    className="h-11 w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <SelectValue placeholder="Toutes les zones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={ALL_ZONES_VALUE}>Toutes les zones</SelectItem>
                      {zones.map((zone) => (
                        <SelectItem key={zone} value={zone}>
                          {zone}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <DatePickerField
                id="appointment-date"
                label="Date souhaitée"
                value={selectedDate}
                onChange={setSelectedDate}
                minDate={today}
                labelClassName="font-semibold text-gray-900 dark:text-white"
                triggerClassName="h-11 rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </FieldGroup>
          ) : null}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {specialists.length} spécialistes disponibles
          </h2>

          {specialists.map((specialist, index) => (
            <div
              key={specialist.id}
              className="animate-in slide-in-from-bottom-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm transition-all hover:scale-[1.02] hover:border-slate-300 hover:shadow-lg dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-slate-600"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="flex-shrink-0">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 text-4xl shadow-lg dark:from-blue-900/40 dark:to-purple-900/40">
                    {specialist.image}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                        {specialist.name}
                      </h3>
                      <p className="mb-2 text-gray-600 dark:text-slate-400">
                        {specialist.specialty}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          <span className="font-semibold">{specialist.rating}</span>
                          <span>({specialist.reviews} avis)</span>
                        </div>
                        <span>•</span>
                        <span>{specialist.experience} d'expérience</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {specialist.price} TND
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-500">par consultation</p>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400 dark:text-slate-400" />
                      <span className="text-gray-700 dark:text-slate-300">{specialist.zone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400 dark:text-slate-400" />
                      <span className="text-gray-700 dark:text-slate-300">
                        Disponible :{' '}
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {specialist.nextAvailable}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {specialist.languages.map((language) => (
                      <span
                        key={language}
                        className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-slate-700 dark:text-slate-300"
                      >
                        {language}
                      </span>
                    ))}
                    {specialist.consultationType.map((consultationType) => (
                      <span
                        key={consultationType}
                        className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                      >
                        {consultationType}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1 border-0 bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-cyan-700">
                      <Calendar className="mr-2 h-4 w-4" />
                      Réserver maintenant
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                    >
                      Voir le profil
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-sm backdrop-blur-sm dark:border-purple-500/30 dark:from-purple-900/40 dark:to-pink-900/40">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 shadow-lg dark:bg-purple-500/20">
              <User className="h-6 w-6 text-white dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
                Besoin d'aide pour choisir ?
              </h3>
              <p className="mb-4 text-sm text-gray-700 dark:text-purple-300">
                Notre équipe concierge peut vous aider à trouver le spécialiste le plus adapté à
                votre situation et gérer la réservation pour vous.
              </p>
              <Button className="border-0 bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30 hover:from-purple-700 hover:to-pink-700">
                <Phone className="mr-2 h-4 w-4" />
                Contacter le concierge
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
