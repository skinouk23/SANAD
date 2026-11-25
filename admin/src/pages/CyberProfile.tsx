import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Briefcase,
  Settings,
  Shield,
  LogOut,
  Trash2,
  Edit2,
  Save,
  X,
  Bell,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Key,
  SmartphoneNfc,
  Activity,
  CheckCircle2,
  AlertTriangle } from
'lucide-react';
export function CyberProfile() {
  const { user, logout } = useAuth();
  const { isDark: dark, toggleTheme } = useTheme();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // Mock user data based on AuthContext
  const [formData, setFormData] = useState({
    name: user?.name || 'Utilisateur',
    email: user?.email || 'utilisateur@example.com',
    phone: user?.phone || '+216 20 123 456',
    address: user?.address?.fullAddress || '15 Rue de la Liberté, Tunis',
    // Provider specific
    specialty: user?.serviceType || 'Médecin Généraliste',
    license: 'MED-2023-8945',
    experience: '8 ans',
    bio: 'Spécialiste en médecine générale avec une approche holistique de la santé du patient.'
  });
  const [settings, setSettings] = useState({
    emailNotifs: true,
    pushNotifs: true,
    smsNotifs: false,
    twoFactor: false
  });
  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };
  const getInitials = (name: string) => {
    return name.
    split(' ').
    map((n) => n[0]).
    join('').
    substring(0, 2).
    toUpperCase();
  };
  const isProvider = user?.role === 'provider' || user?.role === 'professional';
  const tabs = [
  {
    id: 'personal',
    label: 'Personnel',
    icon: User
  },
  ...(isProvider ?
  [
  {
    id: 'professional',
    label: 'Professionnel',
    icon: Briefcase
  }] :

  []),
  {
    id: 'settings',
    label: 'Préférences',
    icon: Settings
  },
  {
    id: 'security',
    label: 'Sécurité',
    icon: Shield
  }];

  const inputClass = `w-full px-3 py-2 text-sm border rounded-lg transition-all ${dark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500' : 'bg-white border-slate-200 text-slate-900 focus:border-cyan-500'}`;
  const labelClass = `block text-xs font-medium mb-1.5 ${dark ? 'text-slate-300' : 'text-slate-700'}`;
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div
        className={`backdrop-blur-sm border rounded-2xl p-4 sm:p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 ${dark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
        
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg">
            {getInitials(formData.name)}
          </div>
          <button
            className={`absolute bottom-0 right-0 p-1.5 rounded-full border shadow-sm transition-colors ${dark ? 'bg-slate-700 border-slate-600 text-slate-300 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'}`}>
            
            <Edit2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h1
            className={`text-xl sm:text-2xl font-bold mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>
            
            {formData.name}
          </h1>
          <p
            className={`text-sm mb-3 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            
            {formData.email}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium border ${isProvider ? dark ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200' : dark ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-cyan-100 text-cyan-700 border-cyan-200'}`}>
              
              {isProvider ? 'Professionnel de santé' : 'Patient'}
            </span>
            <span
              className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
              
              Membre depuis Jan 2024
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto custom-scrollbar mb-6 gap-2 pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${isActive ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md' : dark ? 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800' : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'}`}>
              
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>);

        })}
      </div>

      {/* Tab Content */}
      <div
        className={`backdrop-blur-sm border rounded-2xl p-4 sm:p-6 mb-6 ${dark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
        
        <AnimatePresence mode="wait">
          {activeTab === 'personal' &&
          <motion.div
            key="personal"
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -10
            }}
            className="space-y-4">
            
              <div className="flex items-center justify-between mb-4">
                <h2
                className={`text-lg font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
                
                  Informations Personnelles
                </h2>
                <button
                onClick={() => setIsEditing(!isEditing)}
                className={`p-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${isEditing ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' : dark ? 'bg-slate-700/50 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                
                  {isEditing ?
                <>
                      <X className="h-4 w-4" /> Annuler
                    </> :

                <>
                      <Edit2 className="h-4 w-4" /> Modifier
                    </>
                }
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nom complet</label>
                  <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value
                  })
                  }
                  disabled={!isEditing}
                  className={`${inputClass} ${!isEditing && 'opacity-70 cursor-not-allowed'}`} />
                
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value
                  })
                  }
                  disabled={!isEditing}
                  className={`${inputClass} ${!isEditing && 'opacity-70 cursor-not-allowed'}`} />
                
                </div>
                <div>
                  <label className={labelClass}>Téléphone</label>
                  <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value
                  })
                  }
                  disabled={!isEditing}
                  className={`${inputClass} ${!isEditing && 'opacity-70 cursor-not-allowed'}`} />
                
                </div>
                <div>
                  <label className={labelClass}>Adresse</label>
                  <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value
                  })
                  }
                  disabled={!isEditing}
                  className={`${inputClass} ${!isEditing && 'opacity-70 cursor-not-allowed'}`} />
                
                </div>
              </div>

              {isEditing &&
            <div className="flex justify-end mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
                
                    <Save className="h-4 w-4" />
                    Enregistrer les modifications
                  </button>
                </div>
            }
            </motion.div>
          }

          {activeTab === 'professional' && isProvider &&
          <motion.div
            key="professional"
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -10
            }}
            className="space-y-4">
            
              <div className="flex items-center justify-between mb-4">
                <h2
                className={`text-lg font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
                
                  Profil Professionnel
                </h2>
                <button
                onClick={() => setIsEditing(!isEditing)}
                className={`p-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${isEditing ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' : dark ? 'bg-slate-700/50 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                
                  {isEditing ?
                <>
                      <X className="h-4 w-4" /> Annuler
                    </> :

                <>
                      <Edit2 className="h-4 w-4" /> Modifier
                    </>
                }
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Spécialité</label>
                  <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    specialty: e.target.value
                  })
                  }
                  disabled={!isEditing}
                  className={`${inputClass} ${!isEditing && 'opacity-70 cursor-not-allowed'}`} />
                
                </div>
                <div>
                  <label className={labelClass}>Numéro de licence / INPE</label>
                  <input
                  type="text"
                  value={formData.license}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    license: e.target.value
                  })
                  }
                  disabled={!isEditing}
                  className={`${inputClass} ${!isEditing && 'opacity-70 cursor-not-allowed'}`} />
                
                </div>
                <div>
                  <label className={labelClass}>Années d'expérience</label>
                  <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    experience: e.target.value
                  })
                  }
                  disabled={!isEditing}
                  className={`${inputClass} ${!isEditing && 'opacity-70 cursor-not-allowed'}`} />
                
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Biographie / Présentation
                  </label>
                  <textarea
                  value={formData.bio}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    bio: e.target.value
                  })
                  }
                  disabled={!isEditing}
                  rows={3}
                  className={`${inputClass} resize-none ${!isEditing && 'opacity-70 cursor-not-allowed'}`} />
                
                </div>
              </div>

              {isEditing &&
            <div className="flex justify-end mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
                
                    <Save className="h-4 w-4" />
                    Enregistrer les modifications
                  </button>
                </div>
            }
            </motion.div>
          }

          {activeTab === 'settings' &&
          <motion.div
            key="settings"
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -10
            }}
            className="space-y-6">
            
              <div>
                <h3
                className={`text-sm font-bold mb-3 flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
                
                  <Bell className="h-4 w-4 text-cyan-500" />
                  Notifications
                </h3>
                <div className="space-y-3">
                  {[
                {
                  id: 'emailNotifs',
                  label: 'Notifications par Email',
                  desc: 'Recevoir les mises à jour par email'
                },
                {
                  id: 'pushNotifs',
                  label: 'Notifications Push',
                  desc: 'Recevoir les alertes sur cet appareil'
                },
                {
                  id: 'smsNotifs',
                  label: 'Notifications SMS',
                  desc: 'Recevoir des rappels par SMS'
                }].
                map((item) =>
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-xl border ${dark ? 'bg-slate-900/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  
                      <div>
                        <p
                      className={`text-sm font-medium ${dark ? 'text-white' : 'text-slate-900'}`}>
                      
                          {item.label}
                        </p>
                        <p
                      className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                          {item.desc}
                        </p>
                      </div>
                      <button
                    onClick={() =>
                    setSettings({
                      ...settings,
                      [item.id]:
                      !settings[item.id as keyof typeof settings]
                    })
                    }
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${settings[item.id as keyof typeof settings] ? 'bg-cyan-500' : dark ? 'bg-slate-600' : 'bg-slate-300'}`}>
                    
                        <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${settings[item.id as keyof typeof settings] ? 'translate-x-5' : 'translate-x-1'}`} />
                    
                      </button>
                    </div>
                )}
                </div>
              </div>

              <div>
                <h3
                className={`text-sm font-bold mb-3 flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
                
                  <Globe className="h-4 w-4 text-purple-500" />
                  Langue & Apparence
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                  className={`p-3 rounded-xl border ${dark ? 'bg-slate-900/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  
                    <label className={labelClass}>Langue de l'interface</label>
                    <select
                    value={currentLanguage.code}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className={inputClass}>
                    
                      <option value="fr-FR">Français</option>
                      <option value="ar-TN">Tounsi (الدارجة)</option>
                      <option value="en-GB">English</option>
                      <option value="nl-NL">Nederlands</option>
                    </select>
                  </div>
                  <div
                  className={`p-3 rounded-xl border ${dark ? 'bg-slate-900/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  
                    <label className={labelClass}>Thème</label>
                    <div className="flex gap-2">
                      <button
                      onClick={() => dark && toggleTheme()}
                      className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors ${!dark ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-400 hover:bg-slate-800'}`}>
                      
                        <Sun className="h-4 w-4" /> Clair
                      </button>
                      <button
                      onClick={() => !dark && toggleTheme()}
                      className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors ${dark ? 'bg-slate-800 shadow-sm text-white border border-slate-600' : 'text-slate-500 hover:bg-slate-200'}`}>
                      
                        <Moon className="h-4 w-4" /> Sombre
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          }

          {activeTab === 'security' &&
          <motion.div
            key="security"
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -10
            }}
            className="space-y-6">
            
              <div
              className={`p-4 rounded-xl border ${dark ? 'bg-slate-900/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              
                <h3
                className={`text-sm font-bold mb-4 flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
                
                  <Key className="h-4 w-4 text-amber-500" />
                  Changer le mot de passe
                </h3>
                <div className="space-y-3 max-w-md">
                  <div>
                    <label className={labelClass}>Mot de passe actuel</label>
                    <input
                    type="password"
                    placeholder="••••••••"
                    className={inputClass} />
                  
                  </div>
                  <div>
                    <label className={labelClass}>Nouveau mot de passe</label>
                    <input
                    type="password"
                    placeholder="••••••••"
                    className={inputClass} />
                  
                  </div>
                  <div>
                    <label className={labelClass}>
                      Confirmer le nouveau mot de passe
                    </label>
                    <input
                    type="password"
                    placeholder="••••••••"
                    className={inputClass} />
                  
                  </div>
                  <button className="w-full py-2 bg-slate-800 text-white dark:bg-slate-700 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    Mettre à jour le mot de passe
                  </button>
                </div>
              </div>

              <div
              className={`flex items-center justify-between p-4 rounded-xl border ${dark ? 'bg-slate-900/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              
                <div className="flex items-start gap-3">
                  <div
                  className={`p-2 rounded-lg ${dark ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
                  
                    <SmartphoneNfc
                    className={`h-5 w-5 ${dark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                  
                  </div>
                  <div>
                    <p
                    className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Authentification à deux facteurs (2FA)
                    </p>
                    <p
                    className={`text-xs mt-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                      Ajoute une couche de sécurité supplémentaire à votre
                      compte.
                    </p>
                  </div>
                </div>
                <button
                onClick={() =>
                setSettings({
                  ...settings,
                  twoFactor: !settings.twoFactor
                })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.twoFactor ? 'bg-cyan-500' : dark ? 'bg-slate-600' : 'bg-slate-300'}`}>
                
                  <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.twoFactor ? 'translate-x-6' : 'translate-x-1'}`} />
                
                </button>
              </div>

              <div>
                <h3
                className={`text-sm font-bold mb-3 flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
                
                  <Activity className="h-4 w-4 text-green-500" />
                  Sessions actives
                </h3>
                <div className="space-y-2">
                  <div
                  className={`flex items-center justify-between p-3 rounded-xl border ${dark ? 'bg-slate-900/30 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                  
                    <div className="flex items-center gap-3">
                      <Smartphone
                      className={`h-5 w-5 ${dark ? 'text-slate-400' : 'text-slate-500'}`} />
                    
                      <div>
                        <p
                        className={`text-sm font-medium flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
                        
                          iPhone 13 Pro{' '}
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-green-500/20 text-green-500">
                            Actuel
                          </span>
                        </p>
                        <p
                        className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                          Tunis, Tunisie • Actif maintenant
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                  className={`flex items-center justify-between p-3 rounded-xl border ${dark ? 'bg-slate-900/30 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                  
                    <div className="flex items-center gap-3">
                      <Globe
                      className={`h-5 w-5 ${dark ? 'text-slate-400' : 'text-slate-500'}`} />
                    
                      <div>
                        <p
                        className={`text-sm font-medium ${dark ? 'text-white' : 'text-slate-900'}`}>
                        
                          Chrome sur Windows
                        </p>
                        <p
                        className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                          Sousse, Tunisie • Il y a 2 jours
                        </p>
                      </div>
                    </div>
                    <button
                    className={`text-xs font-medium ${dark ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'}`}>
                    
                      Déconnecter
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </div>

      {/* Danger Zone */}
      <div
        className={`backdrop-blur-sm border rounded-2xl p-4 sm:p-6 ${dark ? 'bg-slate-800/50 border-red-900/30' : 'bg-red-50/50 border-red-100 shadow-sm'}`}>
        
        <h3
          className={`text-sm font-bold mb-4 flex items-center gap-2 ${dark ? 'text-red-400' : 'text-red-600'}`}>
          
          <AlertTriangle className="h-4 w-4" />
          Zone de danger
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleLogout}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors ${dark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
            
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex-1 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-red-500/20">
            
            <Trash2 className="h-4 w-4" />
            Supprimer le compte
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm &&
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
          onClick={() => setShowDeleteConfirm(false)}>
          
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
            className={`border rounded-2xl p-6 w-full max-w-sm text-center ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <h3
              className={`text-lg font-bold mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
              
                Supprimer le compte ?
              </h3>
              <p
              className={`text-sm mb-6 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
              
                Cette action est irréversible. Toutes vos données, rendez-vous
                et historiques seront définitivement effacés.
              </p>
              <div className="flex gap-3">
                <button
                onClick={() => setShowDeleteConfirm(false)}
                className={`flex-1 px-4 py-2 border rounded-xl text-sm font-medium transition-all ${dark ? 'border-slate-600 text-white hover:bg-slate-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                
                  Annuler
                </button>
                <button
                onClick={() => {
                  // Handle delete logic here
                  setShowDeleteConfirm(false);
                  logout();
                  navigate('/');
                }}
                className="flex-1 px-4 py-2 bg-red-500 rounded-xl text-sm font-medium text-white hover:bg-red-600 transition-colors">
                
                  Confirmer
                </button>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}