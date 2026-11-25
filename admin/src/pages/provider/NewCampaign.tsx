import React, { useEffect, useState, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Target,
  Users,
  Mail,
  Share2,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Megaphone } from
'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
export function NewCampaign() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const templateData = location.state;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
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
      interests: [] as string[]
    },
    content: {
      headline: '',
      description: '',
      cta: '',
      image: ''
    }
  });
  useEffect(() => {
    if (templateData) {
      setFormData({
        name: templateData.name || '',
        type: templateData.type || 'social',
        objective: templateData.objective || 'awareness',
        startDate: templateData.startDate || '',
        endDate: templateData.endDate || '',
        budget: templateData.budget || '',
        targetAudience: templateData.targetAudience || {
          ageMin: '18',
          ageMax: '65',
          location: 'tunisia',
          interests: []
        },
        content: templateData.content || {
          headline: '',
          description: '',
          cta: '',
          image: ''
        }
      });
    }
  }, [templateData]);
  const steps = [
  {
    number: 1,
    title: 'Informations',
    icon: FileText
  },
  {
    number: 2,
    title: 'Budget',
    icon: Target
  },
  {
    number: 3,
    title: 'Contenu',
    icon: ImageIcon
  },
  {
    number: 4,
    title: 'Révision',
    icon: CheckCircle2
  }];

  const campaignTypes = [
  {
    id: 'social',
    name: 'Réseaux sociaux',
    icon: Share2,
    description: 'Facebook, Instagram, LinkedIn',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'email',
    name: 'Email marketing',
    icon: Mail,
    description: 'Campagne par email ciblée',
    gradient: 'from-purple-500 to-pink-500'
  }];

  const objectives = [
  {
    id: 'awareness',
    name: 'Notoriété',
    description: 'Augmenter la visibilité'
  },
  {
    id: 'engagement',
    name: 'Engagement',
    description: 'Interactions et partages'
  },
  {
    id: 'conversions',
    name: 'Conversions',
    description: 'Réservations et patients'
  }];

  const interests = [
  'Santé et bien-être',
  'Soins à domicile',
  'Personnes âgées',
  'Kinésithérapie',
  'Nutrition',
  'Sport et fitness'];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };
  const handleSubmit = () => {
    navigate('/provider/marketing');
  };
  const toggleInterest = (interest: string) => {
    const interests = formData.targetAudience.interests;
    if (interests.includes(interest)) {
      setFormData({
        ...formData,
        targetAudience: {
          ...formData.targetAudience,
          interests: interests.filter((i) => i !== interest)
        }
      });
    } else {
      setFormData({
        ...formData,
        targetAudience: {
          ...formData.targetAudience,
          interests: [...interests, interest]
        }
      });
    }
  };
  const inputClass = `w-full px-3 py-2 text-sm border rounded-lg transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`;
  return (
    <div
      className={`min-h-screen pb-20 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div
        className={`fixed inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none`}>
      </div>

      {/* Header */}
      <div
        className={`relative z-10 backdrop-blur-sm border-b ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
        
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/provider/marketing')}
            className={`flex items-center mb-3 text-xs font-medium group ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'}`}>
            
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5 group-hover:-translate-x-1 transition-transform" />
            Retour aux campagnes
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Megaphone className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h1
                className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                Nouvelle campagne
              </h1>
              <p
                className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                Configurez votre campagne marketing
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        {/* Progress Steps */}
        <div
          className={`backdrop-blur-sm border rounded-xl p-3 mb-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
          
          <div className="flex items-center justify-between">
            {steps.map((step, index) =>
            <Fragment key={step.number}>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep >= step.number ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>
                  
                    {currentStep > step.number ?
                  <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> :

                  step.number
                  }
                  </div>
                  <span
                  className={`hidden sm:block text-xs font-medium ${currentStep >= step.number ? isDark ? 'text-white' : 'text-slate-900' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 &&
              <div
                className={`flex-1 h-0.5 mx-1.5 sm:mx-3 rounded-full transition-all ${currentStep > step.number ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : isDark ? 'bg-slate-700' : 'bg-slate-300'}`}>
              </div>
              }
              </Fragment>
            )}
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 &&
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
          
            <h2
            className={`text-base sm:text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
              Informations de base
            </h2>

            <div className="space-y-4">
              <div>
                <label
                className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Nom de la campagne *
                </label>
                <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value
                })
                }
                placeholder="Ex: Promotion Soins à Domicile - Février"
                className={inputClass} />
              
              </div>

              <div>
                <label
                className={`block text-xs font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Type de campagne *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {campaignTypes.map((type) =>
                <button
                  key={type.id}
                  onClick={() =>
                  setFormData({
                    ...formData,
                    type: type.id
                  })
                  }
                  className={`p-3 rounded-lg border-2 transition-all text-left ${formData.type === type.id ? 'border-cyan-500 bg-cyan-500/10' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                  
                      <div className="flex items-start gap-2">
                        <div
                      className={`w-8 h-8 rounded-md bg-gradient-to-br ${type.gradient} flex items-center justify-center`}>
                      
                          <type.icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p
                        className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                            {type.name}
                          </p>
                          <p
                        className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </button>
                )}
                </div>
              </div>

              <div>
                <label
                className={`block text-xs font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Objectif *
                </label>
                <div className="space-y-1.5">
                  {objectives.map((obj) =>
                <label
                  key={obj.id}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border-2 cursor-pointer transition-all ${formData.objective === obj.id ? 'border-cyan-500 bg-cyan-500/10' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                  
                      <input
                    type="radio"
                    name="objective"
                    value={obj.id}
                    checked={formData.objective === obj.id}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      objective: e.target.value
                    })
                    }
                    className={`w-3.5 h-3.5 text-cyan-500 ${isDark ? 'bg-slate-900 border-slate-600' : 'bg-white border-slate-300'}`} />
                  
                      <div>
                        <p
                      className={`font-medium text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                          {obj.name}
                        </p>
                        <p
                      className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      
                          {obj.description}
                        </p>
                      </div>
                    </label>
                )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Date de début *
                  </label>
                  <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    startDate: e.target.value
                  })
                  }
                  className={inputClass} />
                
                </div>
                <div>
                  <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Date de fin *
                  </label>
                  <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    endDate: e.target.value
                  })
                  }
                  className={inputClass} />
                
                </div>
              </div>
            </div>

            <div
            className={`flex justify-end mt-6 pt-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            
              <button
              onClick={handleNext}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-1.5">
              
                Suivant <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        }

        {/* Step 2: Budget & Targeting */}
        {currentStep === 2 &&
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
          
            <h2
            className={`text-base sm:text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
              Budget et ciblage
            </h2>

            <div className="space-y-4">
              <div>
                <label
                className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Budget total (TND) *
                </label>
                <div className="relative">
                  <DollarSign
                  className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                
                  <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    budget: e.target.value
                  })
                  }
                  placeholder="150"
                  className={`${inputClass} pl-9`} />
                
                </div>
              </div>

              <div
              className={`p-3 rounded-lg border ${isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
              
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400 mt-0.5" />
                  <div>
                    <p
                    className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Estimation de portée
                    </p>
                    <p
                    className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    
                      Avec {formData.budget || '0'} TND, vous pouvez atteindre
                      environ {Math.round((Number(formData.budget) || 0) * 80)}{' '}
                      personnes
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label
                className={`block text-xs font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Tranche d'âge
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                    className={`block text-[10px] mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                      Âge minimum
                    </label>
                    <input
                    type="number"
                    value={formData.targetAudience.ageMin}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetAudience: {
                        ...formData.targetAudience,
                        ageMin: e.target.value
                      }
                    })
                    }
                    className={inputClass} />
                  
                  </div>
                  <div>
                    <label
                    className={`block text-[10px] mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                      Âge maximum
                    </label>
                    <input
                    type="number"
                    value={formData.targetAudience.ageMax}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetAudience: {
                        ...formData.targetAudience,
                        ageMax: e.target.value
                      }
                    })
                    }
                    className={inputClass} />
                  
                  </div>
                </div>
              </div>

              <div>
                <label
                className={`block text-xs font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Centres d'intérêt
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {interests.map((interest) =>
                <label
                  key={interest}
                  className={`flex items-center gap-1.5 p-2 rounded-lg border cursor-pointer transition-all text-[10px] sm:text-xs ${formData.targetAudience.interests.includes(interest) ? 'border-cyan-500 bg-cyan-500/10 text-white' : isDark ? 'border-slate-700 text-slate-300 hover:border-slate-600' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                  
                      <input
                    type="checkbox"
                    checked={formData.targetAudience.interests.includes(
                      interest
                    )}
                    onChange={() => toggleInterest(interest)}
                    className={`w-3 h-3 text-cyan-500 rounded ${isDark ? 'bg-slate-900 border-slate-600' : 'bg-white border-slate-300'}`} />
                  
                      <span className="truncate">{interest}</span>
                    </label>
                )}
                </div>
              </div>
            </div>

            <div
            className={`flex justify-between mt-6 pt-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            
              <button
              onClick={handleBack}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}>
              
                Retour
              </button>
              <button
              onClick={handleNext}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-1.5">
              
                Suivant <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        }

        {/* Step 3: Content */}
        {currentStep === 3 &&
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
          
            <h2
            className={`text-base sm:text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
              Contenu de la campagne
            </h2>

            <div className="space-y-4">
              <div>
                <label
                className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Titre principal *
                </label>
                <input
                type="text"
                value={formData.content.headline}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  content: {
                    ...formData.content,
                    headline: e.target.value
                  }
                })
                }
                placeholder="Ex: Soins infirmiers à domicile - 15% de réduction"
                maxLength={60}
                className={inputClass} />
              
                <p
                className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                
                  {formData.content.headline.length}/60
                </p>
              </div>

              <div>
                <label
                className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Description *
                </label>
                <textarea
                value={formData.content.description}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  content: {
                    ...formData.content,
                    description: e.target.value
                  }
                })
                }
                placeholder="Décrivez votre offre en détail..."
                rows={3}
                maxLength={200}
                className={`${inputClass} resize-none`} />
              
                <p
                className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                
                  {formData.content.description.length}/200
                </p>
              </div>

              <div>
                <label
                className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Appel à l'action *
                </label>
                <input
                type="text"
                value={formData.content.cta}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  content: {
                    ...formData.content,
                    cta: e.target.value
                  }
                })
                }
                placeholder="Ex: Réserver maintenant"
                maxLength={30}
                className={inputClass} />
              
              </div>

              <div>
                <label
                className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Image
                </label>
                <div
                className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors cursor-pointer ${isDark ? 'border-slate-600 hover:border-cyan-500' : 'border-slate-300 hover:border-cyan-500'}`}>
                
                  <ImageIcon
                  className={`h-8 w-8 mx-auto mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                
                  <p
                  className={`text-xs font-medium mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Cliquez pour télécharger
                  </p>
                  <p
                  className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  
                    PNG, JPG • 1200x628px
                  </p>
                </div>
              </div>

              {/* Preview */}
              <div
              className={`p-3 rounded-lg border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              
                <p
                className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                  Aperçu
                </p>
                <div
                className={`rounded-md p-3 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                
                  <div
                  className={`w-full h-24 rounded-md mb-2 flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  
                    <ImageIcon
                    className={`h-6 w-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  
                  </div>
                  <h3
                  className={`font-bold mb-1 text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {formData.content.headline || 'Votre titre ici'}
                  </h3>
                  <p
                  className={`text-[10px] mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  
                    {formData.content.description ||
                  'Votre description apparaîtra ici'}
                  </p>
                  <button className="w-full py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold rounded-md">
                    {formData.content.cta || "Appel à l'action"}
                  </button>
                </div>
              </div>
            </div>

            <div
            className={`flex justify-between mt-6 pt-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            
              <button
              onClick={handleBack}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}>
              
                Retour
              </button>
              <button
              onClick={handleNext}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-1.5">
              
                Suivant <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        }

        {/* Step 4: Review */}
        {currentStep === 4 &&
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
          
            <h2
            className={`text-base sm:text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
              Révision et lancement
            </h2>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
              {
                label: 'Nom',
                value: formData.name
              },
              {
                label: 'Type',
                value:
                formData.type === 'social' ?
                'Réseaux sociaux' :
                'Email marketing'
              },
              {
                label: 'Période',
                value: `${formData.startDate} - ${formData.endDate}`
              },
              {
                label: 'Budget',
                value: `${formData.budget} TND`
              }].
              map((item, idx) =>
              <div
                key={idx}
                className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                
                    <p
                  className={`text-[10px] mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                      {item.label}
                    </p>
                    <p
                  className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                      {item.value || '-'}
                    </p>
                  </div>
              )}
              </div>

              <div
              className={`p-3 rounded-lg border ${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
              
                <p
                className={`text-xs font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  Ciblage
                </p>
                <div
                className={`space-y-0.5 text-[10px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                
                  <p>
                    • Âge: {formData.targetAudience.ageMin}-
                    {formData.targetAudience.ageMax} ans
                  </p>
                  <p>
                    • Intérêts:{' '}
                    {formData.targetAudience.interests.length > 0 ?
                  formData.targetAudience.interests.join(', ') :
                  'Aucun'}
                  </p>
                </div>
              </div>

              <div
              className={`p-3 rounded-lg border ${isDark ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'}`}>
              
                <p
                className={`text-xs font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  Contenu
                </p>
                <div
                className={`space-y-0.5 text-[10px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                
                  <p>
                    <strong>Titre:</strong> {formData.content.headline}
                  </p>
                  <p>
                    <strong>Description:</strong> {formData.content.description}
                  </p>
                  <p>
                    <strong>CTA:</strong> {formData.content.cta}
                  </p>
                </div>
              </div>

              <div
              className={`p-3 rounded-lg border ${isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
              
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  <div>
                    <p
                    className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Avant de lancer
                    </p>
                    <p
                    className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    
                      Vérifiez que toutes les informations sont correctes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
            className={`flex justify-between mt-6 pt-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            
              <button
              onClick={handleBack}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}>
              
                Retour
              </button>
              <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-1.5">
              
                <CheckCircle2 className="h-3.5 w-3.5" /> Lancer la campagne
              </button>
            </div>
          </motion.div>
        }
      </div>
    </div>);

}