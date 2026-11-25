import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Trophy,
  MapPin,
  Clock,
  Star,
  Phone,
  Calendar,
  CheckCircle,
  Search,
  Users,
  Dumbbell,
  Sparkles,
  Loader2 } from
'lucide-react';
import { CyberBottomNav } from '../components/CyberBottomNav';
import { useTheme } from '../contexts/ThemeContext';
import { useGyms } from '../hooks/useProviders';
export function Gym() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: gyms = [], loading } = useGyms();
  // Placeholder for subscription plans data
  const subscriptionPlans = [
  {
    name: 'Mensuel',
    price: '120',
    features: ['Accès illimité', 'Vestiaires']
  },
  {
    name: 'Trimestriel',
    price: '300',
    features: ['Accès illimité', 'Vestiaires', '1 cours offert'],
    popular: true
  },
  {
    name: 'Annuel',
    price: '1000',
    features: [
    'Accès illimité',
    'Vestiaires',
    'Cours collectifs',
    'Coach 2x/mois']

  }];

  const popularActivities = [
  {
    name: 'Musculation',
    icon: Dumbbell
  },
  {
    name: 'Cardio',
    icon: Trophy
  },
  {
    name: 'Cours collectifs',
    icon: Users
  },
  {
    name: 'Yoga & Pilates',
    icon: Sparkles
  },
  {
    name: 'CrossFit',
    icon: Dumbbell
  },
  {
    name: 'Boxing',
    icon: Trophy
  }];

  const filteredGyms = gyms.filter(
    (gym) =>
    gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gym.location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      {/* Background patterns */}
      <div
        className={`fixed inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px]`} />
      
      <div
        className={`fixed top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-amber-500/10' : 'bg-amber-500/5'} rounded-full blur-3xl animate-pulse pointer-events-none`} />
      
      <div
        className={`fixed bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-orange-500/10' : 'bg-orange-500/5'} rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none`} />
      

      <div className="relative z-10 py-4 px-4 sm:px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/services')}
            className={`flex items-center mb-3 text-sm font-medium group ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
            
            <ArrowLeft className="h-4 w-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
            Retour aux services
          </button>

          {/* WOW EFFECT: Animated Gradient Border Header */}
          <div className="relative rounded-[20px] p-[2px] overflow-hidden shadow-xl mb-4">
            <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#f59e0b_100%)]" />
            <div
              className={`relative rounded-[18px] p-5 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1
                    className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    Salles de Sport
                  </h1>
                  <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                    Fitness, musculation et bien-être
                  </p>
                </div>
              </div>
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                
                <input
                  type="text"
                  placeholder="Rechercher une salle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 backdrop-blur-sm border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white/80 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`} />
                
              </div>
            </div>
          </div>

          {/* Mobile: Subscription Plans */}
          <div className="mb-4 lg:hidden">
            <h3
              className={`text-sm font-bold mb-2 flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              <Sparkles className="h-4 w-4 text-amber-500" />
              Formules
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {subscriptionPlans.map((plan, index) =>
              <div
                key={index}
                className={`flex-shrink-0 w-32 p-3 rounded-xl border ${plan.popular ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/50' : isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/80 border-slate-200'}`}>
                
                  {plan.popular &&
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wide">
                      Populaire
                    </span>
                }
                  <div
                  className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {plan.name}
                  </div>
                  <div className="text-lg font-bold text-amber-500 mb-1">
                    {plan.price}{' '}
                    <span
                    className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                      TND
                    </span>
                  </div>
                  <ul className="space-y-0.5">
                    {plan.features.slice(0, 2).map((feature, idx) =>
                  <li
                    key={idx}
                    className={`flex items-center gap-1 text-[9px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    
                        <CheckCircle className="h-2.5 w-2.5 text-amber-500 flex-shrink-0" />
                        {feature}
                      </li>
                  )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: Activities */}
          <div className="mb-4 lg:hidden">
            <h3
              className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              Activités
            </h3>

            <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {popularActivities.map((activity, index) =>
              <div
                key={index}
                className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 border rounded-lg ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/80 border-slate-200'}`}>
                
                  <activity.icon className="h-3.5 w-3.5 text-amber-500" />
                  <span>{activity.name}</span>
                  <span
                  className={`text-[10px] font-medium whitespace-nowrap ${isDark ? 'text-white' : all} the context I need for the/> 4 files in this batch.
1. CyberVeterinary.tsx (423 lines)
2. CyberFuneralServices.tsx (354 lines)
3. Gym.tsx (463 lines)
4. CyberEquipmentCatalog.tsx (5'text-slate-900'}`}>
                  
                    {activity.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 space-y-3">
              <h2
                className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {filteredGyms.length} salle{filteredGyms.length > 1 ? 's' : ''}{' '}
                disponible{filteredGyms.length > 1 ? 's' : ''}
              </h2>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher une salle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-md border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-amber-500`} />
                
              </div>

              {loading ?
              <div className="flex justify-center items-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div> :

              <div className="grid gap-4">
                  {filteredGyms.map((gym) =>
                <div
                  key={gym.id}
                  className={`backdrop-blur-sm border rounded-xl p-3 sm:p-4 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-amber-500/50' : 'bg-white/80 border-slate-200 hover:border-amber-500'}`}>
                  
                      <div className="flex items-center">
                        {gym.imageUrl ?
                    <img
                      src={gym.imageUrl}
                      alt={gym.name}
                      className="w-12 h-12 object-cover rounded mr-3" /> :


                    <div className="w-12 h-12 bg-gray-300 rounded mr-3 flex items-center justify-center text-xl">
                            🏋️
                          </div>
                    }
                        <div>
                          <h3 className="font-semibold text-lg">{gym.name}</h3>
                          <p className="text-sm text-slate-500">
                            {gym.location.address}
                          </p>
                        </div>
                      </div>
                      {/* Additional gym details could go here */}
                      <span
                    className="px-3
- Activities grid: gap-3→gap-2, p-3→p-2
- Subscription plans: gap-4→gap-3, p-6→p-4, title text-xl→text-base, price text-3xl→text-2xl
- Gym cards: space-y-6→space-y-3,-1.5 py-0.5 bg-blue-500/20 text-blue-500 text-[9px] font p-6→p-4, gap-6→gap-3, avatar w-20→w-14
- Loading: py-12→py-6, h-12→h-8
- CyberBottomNav import preserved

WOW EFFECT: Wrap header in animated gradient border with orange/amber:
bg-[-medium rounded-full border border-blue-500/30">








                    
                        🏊 Piscine
                      </span>
                    </div>
                )}
                </div>
              }
            </div>

            {/* Optional sidebar for larger screens could be added here */}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <CyberBottomNav />
    </div>);

}