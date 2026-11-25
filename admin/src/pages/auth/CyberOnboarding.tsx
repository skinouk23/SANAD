import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Briefcase,
  Building2,
  ArrowRight,
  FlaskConical,
  Scan,
  Dumbbell,
  Shield,
  Zap } from
'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import { LanguageSelector } from '../../components/LanguageSelector';
export function CyberOnboarding() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const userTypes = [
  {
    id: 'patient',
    title: 'Patient',
    description: 'Je cherche des soins à domicile',
    icon: User,
    gradient: 'from-cyan-500 to-cyan-600',
    features: [
    'Réserver des soins',
    'Trouver des professionnels',
    'Gérer mes rendez-vous']

  },
  {
    id: 'professional',
    title: 'Professionnel de Santé',
    description: 'Je propose mes services',
    icon: Briefcase,
    gradient: 'from-blue-500 to-purple-600',
    features: [
    'Gérer mon planning',
    'Recevoir des demandes',
    'Développer mon activité']

  },
  {
    id: 'agency',
    title: 'Agence de Location',
    description: 'Je loue du matériel paramédical',
    icon: Building2,
    gradient: 'from-purple-500 to-pink-600',
    features: [
    'Gérer mon inventaire',
    'Recevoir des réservations',
    'Suivre les locations']

  },
  {
    id: 'laboratory',
    title: "Laboratoire d'Analyses",
    description: 'Je propose des analyses médicales',
    icon: FlaskConical,
    gradient: 'from-indigo-500 to-purple-600',
    features: [
    'Gérer mes analyses',
    'Prélèvements à domicile',
    'Résultats en ligne']

  },
  {
    id: 'radiology',
    title: 'Centre de Radiologie',
    description: "Je propose des examens d'imagerie",
    icon: Scan,
    gradient: 'from-pink-500 to-rose-600',
    features: [
    'Gérer mes créneaux',
    'Radio, IRM, Scanner',
    'Rendez-vous rapides']

  },
  {
    id: 'gym',
    title: 'Salle de Sport',
    description: 'Je propose des abonnements fitness',
    icon: Dumbbell,
    gradient: 'from-orange-500 to-amber-600',
    features: [
    'Gérer mes abonnements',
    'Cours collectifs',
    'Suivi des membres']

  }];

  const handleSelectType = (type: string) => {
    if (type === 'patient') {
      navigate('/auth/signup?type=patient');
    } else if (type === 'professional') {
      navigate('/auth/signup/professional');
    } else if (type === 'agency') {
      navigate('/auth/signup/equipment');
    } else if (type === 'laboratory') {
      navigate('/auth/signup/laboratory');
    } else if (type === 'radiology') {
      navigate('/auth/signup/radiology');
    } else if (type === 'gym') {
      navigate('/auth/signup/gym');
    } else {
      navigate(`/auth/signup?type=${type}`);
    }
  };
  return (
    <div
      className={`min-h-screen relative overflow-hidden flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      
      {/* Top Right Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSelector />
      </div>

      {/* Animated Background Grid */}
      <div
        className={`absolute inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px]`} />
      

      {/* Glowing Orbs */}
      <div
        className={`absolute top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-500/5'} rounded-full blur-3xl animate-pulse`} />
      
      <div
        className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'} rounded-full blur-3xl animate-pulse delay-1000`} />
      

      <div className="relative z-10 w-full max-w-4xl px-4 py-4">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="relative w-14 h-14 mx-auto mb-3">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl blur-md opacity-40 animate-pulse" />
            <div className="relative w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
              <span className="text-lg font-bold text-white">Sanad</span>
            </div>
          </div>

          <p
            className={`text-[10px] font-medium tracking-widest uppercase mb-1 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
            
            BIENVENUE SUR SANAD
          </p>

          <h1
            className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
            Choisissez Votre Profil
          </h1>

          <p
            className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            
            Sélectionnez votre type de compte pour commencer
          </p>
        </div>

        {/* WOW EFFECT: Animated Gradient Border Wrapper */}
        <div className="relative rounded-[20px] p-[2px] overflow-hidden shadow-2xl mb-5">
          <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />

          <div
            className={`relative rounded-[18px] p-4 ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
            
            {/* User Type Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {userTypes.map((type) =>
              <button
                key={type.id}
                onClick={() => handleSelectType(type.id)}
                className="group relative overflow-hidden text-left">
                
                  <div
                  className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-10 transition-opacity blur-xl`} />
                

                  <div
                  className={`relative border rounded-xl p-4 transition-all h-full ${isDark ? 'bg-slate-800/50 border-slate-700 group-hover:border-cyan-500' : 'bg-slate-50/80 border-slate-200 group-hover:border-cyan-500'}`}>
                  
                    <div
                    className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${type.gradient}`} />
                  

                    <div className="mb-3">
                      <div
                      className={`w-10 h-10 bg-gradient-to-br ${type.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      
                        <type.icon className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    <h3
                    className={`text-sm font-bold mb-1 transition-colors leading-tight ${isDark ? 'text-white group-hover:text-cyan-400' : 'text-slate-900 group-hover:text-cyan-600'}`}>
                    
                      {type.title}
                    </h3>

                    <p
                    className={`text-[11px] mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                      {type.description}
                    </p>

                    <ul className="space-y-1 mb-3">
                      {type.features.map((feature, index) =>
                    <li
                      key={index}
                      className={`flex items-center gap-1.5 text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      
                          <div
                        className={`w-1 h-1 rounded-full bg-gradient-to-r ${type.gradient} flex-shrink-0`} />
                      
                          {feature}
                        </li>
                    )}
                    </ul>

                    <div
                    className={`flex items-center justify-between text-xs font-semibold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                      <span>Continuer</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mb-3">
          <p
            className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            
            Vous avez déjà un compte ?{' '}
            <button
              onClick={() => navigate('/auth/login')}
              className={`font-semibold underline transition-colors ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
              
              Se connecter
            </button>
          </p>
        </div>

        {/* Security Badge */}
        <div
          className={`flex items-center justify-center gap-4 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          
          <div className="flex items-center gap-1.5">
            <Shield
              className={`h-3.5 w-3.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            
            <span>Plateforme sécurisée</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap
              className={`h-3.5 w-3.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            
            <span>Inscription rapide</span>
          </div>
        </div>
      </div>
    </div>);

}