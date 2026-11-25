import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Search,
  Star,
  Clock,
  CheckCircle2,
  User,
  Phone,
  Video,
  Stethoscope,
  Heart,
  Activity,
  Brain,
  Moon,
  Sun,
  Filter,
  X } from
'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
export function CoordinateAppointment() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const specialties = [
  {
    id: 'cardiology',
    name: 'Cardiologie',
    icon: Heart,
    gradient: 'from-red-500 to-rose-500'
  },
  {
    id: 'neurology',
    name: 'Neurologie',
    icon: Brain,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'general',
    name: 'Médecine générale',
    icon: Stethoscope,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'physiotherapy',
    name: 'Kinésithérapie',
    icon: Activity,
    gradient: 'from-green-500 to-emerald-500'
  }];

  const zones = [
  'Tunis Centre',
  'Ariana',
  'Manouba',
  'Ben Arous',
  'La Marsa',
  'Carthage'];

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
    consultationType: ['Cabinet', 'Vidéo']
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
    consultationType: ['Cabinet', 'Vidéo', 'Domicile']
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
    consultationType: ['Cabinet', 'Domicile']
  }];

  const clearFilters = () => {
    setSelectedSpecialty('');
    setSelectedZone('');
    setSelectedDate('');
    setSearchQuery('');
  };
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'}`}>
      
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-blue-500' : 'bg-blue-300'}`}>
        </div>
        <div
          className={`absolute bottom-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-purple-500' : 'bg-purple-300'}`}>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/health-concierge')}
              className={`flex items-center font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au concierge
            </button>
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-white hover:bg-gray-50 text-slate-700 shadow-sm'}`}>
              
              {isDark ?
              <Sun className="h-5 w-5" /> :

              <Moon className="h-5 w-5" />
              }
            </button>
          </div>

          <div>
            <h1
              className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Coordonner un rendez-vous
              </span>
            </h1>
            <p
              className={`text-lg ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              
              Trouvez et réservez le meilleur spécialiste pour vous
            </p>
          </div>
        </div>

        {/* Specialty Quick Select */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {specialties.map((spec) =>
          <div
            key={spec.id}
            onClick={() => setSelectedSpecialty(spec.id)}
            className={`group relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all hover:scale-105 ${selectedSpecialty === spec.id ? isDark ? 'bg-slate-700 border-2 border-blue-500' : 'bg-white border-2 border-blue-500 shadow-lg' : isDark ? 'bg-slate-800/50 border border-slate-700/50 hover:border-slate-600' : 'bg-white border border-slate-200 hover:border-slate-300 shadow-sm'}`}>
            
              <div
              className={`absolute inset-0 bg-gradient-to-br ${spec.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}>
            </div>
              <div className="relative text-center">
                <div
                className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${spec.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                
                  <spec.icon className="h-6 w-6 text-white" />
                </div>
                <h3
                className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  {spec.name}
                </h3>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div
          className={`rounded-2xl p-6 mb-8 border backdrop-blur-sm ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search
                className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un spécialiste..."
                className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'bg-white border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`} />
              
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className={
              isDark ?
              'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' :
              ''
              }>
              
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
            {(selectedSpecialty || selectedZone || selectedDate) &&
            <Button
              onClick={clearFilters}
              variant="outline"
              className={
              isDark ?
              'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' :
              ''
              }>
              
                <X className="h-4 w-4 mr-2" />
                Effacer
              </Button>
            }
          </div>

          {showFilters &&
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
              <div>
                <label
                className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  Spécialité
                </label>
                <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}>
                
                  <option value="">Toutes les spécialités</option>
                  {specialties.map((spec) =>
                <option key={spec.id} value={spec.id}>
                      {spec.name}
                    </option>
                )}
                </select>
              </div>

              <div>
                <label
                className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  Zone géographique
                </label>
                <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}>
                
                  <option value="">Toutes les zones</option>
                  {zones.map((zone) =>
                <option key={zone} value={zone}>
                      {zone}
                    </option>
                )}
                </select>
              </div>

              <div>
                <label
                className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  Date souhaitée
                </label>
                <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`} />
              
              </div>
            </div>
          }
        </div>

        {/* Specialists List */}
        <div className="space-y-6">
          <h2
            className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            
            {specialists.length} spécialistes disponibles
          </h2>

          {specialists.map((specialist, index) =>
          <div
            key={specialist.id}
            className={`rounded-2xl p-6 border backdrop-blur-sm transition-all hover:scale-[1.02] animate-in slide-in-from-bottom-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-lg'}`}
            style={{
              animationDelay: `${index * 100}ms`
            }}>
            
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div
                  className={`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl shadow-lg ${isDark ? 'bg-gradient-to-br from-blue-900/40 to-purple-900/40' : 'bg-gradient-to-br from-blue-100 to-purple-100'}`}>
                  
                    {specialist.image}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3
                      className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      
                        {specialist.name}
                      </h3>
                      <p
                      className={`mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      
                        {specialist.specialty}
                      </p>
                      <div
                      className={`flex items-center gap-4 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="font-semibold">
                            {specialist.rating}
                          </span>
                          <span>({specialist.reviews} avis)</span>
                        </div>
                        <span>•</span>
                        <span>{specialist.experience} d'expérience</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                      className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      
                        {specialist.price} TND
                      </p>
                      <p
                      className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                      
                        par consultation
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin
                      className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                    
                      <span
                      className={isDark ? 'text-slate-300' : 'text-gray-700'}>
                      
                        {specialist.zone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock
                      className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                    
                      <span
                      className={isDark ? 'text-slate-300' : 'text-gray-700'}>
                      
                        Disponible :{' '}
                        <span
                        className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                        
                          {specialist.nextAvailable}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {specialist.languages.map((lang) =>
                  <span
                    key={lang}
                    className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'}`}>
                    
                        {lang}
                      </span>
                  )}
                    {specialist.consultationType.map((type) =>
                  <span
                    key={type}
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                    
                        {type}
                      </span>
                  )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                    variant="primary"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0 shadow-lg shadow-blue-500/30">
                    
                      <Calendar className="h-4 w-4 mr-2" />
                      Réserver maintenant
                    </Button>
                    <Button
                    variant="outline"
                    className={
                    isDark ?
                    'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' :
                    ''
                    }>
                    
                      Voir le profil
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Concierge Help */}
        <div
          className={`mt-8 rounded-2xl p-6 border backdrop-blur-sm ${isDark ? 'bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'}`}>
          
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${isDark ? 'bg-purple-500/20' : 'bg-purple-600'}`}>
              
              <User
                className={`h-6 w-6 ${isDark ? 'text-purple-400' : 'text-white'}`} />
              
            </div>
            <div className="flex-1">
              <h3
                className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                Besoin d'aide pour choisir ?
              </h3>
              <p
                className={`text-sm mb-4 ${isDark ? 'text-purple-300' : 'text-gray-700'}`}>
                
                Notre équipe concierge peut vous aider à trouver le spécialiste
                le plus adapté à votre situation et gérer la réservation pour
                vous.
              </p>
              <Button
                variant="primary"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 shadow-lg shadow-purple-500/30">
                
                <Phone className="h-4 w-4 mr-2" />
                Contacter le concierge
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>);

}