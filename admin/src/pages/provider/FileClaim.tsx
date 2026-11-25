import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  AlertCircle,
  Upload,
  FileText,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  X,
  Camera,
  Info } from
'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
export function FileClaim() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    date: '',
    time: '',
    location: '',
    patientName: '',
    description: '',
    witnesses: '',
    policeReport: false
  });
  const [files, setFiles] = useState<File[]>();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setStep(4); // Success step
  };
  const inputClass = `w-full px-4 py-3 border rounded-xl transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`;
  const labelClass = `block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`;
  return (
    <div
      className={`min-h-screen pb-24 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div
        className={`fixed inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none`}>
      </div>

      <div
        className={`relative z-10 backdrop-blur-sm border-b ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
        
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <button
            onClick={() => navigate('/provider/insurance')}
            className={`flex items-center mb-4 font-medium group ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
            
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour à l'assurance
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1
                className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                Déclarer un sinistre
              </h1>
              <p
                className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                Remplissez ce formulaire pour initier votre demande
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 sm:px-6 py-8">
        {step < 4 &&
        <div className="mb-6">
            <div className="flex items-center justify-between relative">
              <div
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            </div>
              <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{
                width: `${(step - 1) / 2 * 100}%`
              }}>
            </div>

              {[1, 2, 3].map((i) =>
            <div
              key={i}
              className={`relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500 ${step >= i ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-400'}`}>
              
                  {step > i ? <CheckCircle2 className="h-5 w-5" /> : i}
                </div>
            )}
            </div>
            <div className="flex justify-between mt-2 px-1">
              <span
              className={`text-xs font-medium ${step >= 1 ? isDark ? 'text-cyan-400' : 'text-cyan-600' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              
                Détails
              </span>
              <span
              className={`text-xs font-medium ${step >= 2 ? isDark ? 'text-cyan-400' : 'text-cyan-600' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              
                Description
              </span>
              <span
              className={`text-xs font-medium ${step >= 3 ? isDark ? 'text-cyan-400' : 'text-cyan-600' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              
                Pièces jointes
              </span>
            </div>
          </div>
        }

        <div
          className={`backdrop-blur-sm border rounded-2xl p-6 sm:p-8 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
          
          {step === 1 &&
          <motion.div
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: -20
            }}
            className="space-y-6">
            
              <div>
                <label className={labelClass}>Type de sinistre *</label>
                <select
                value={formData.type}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value
                })
                }
                className={inputClass}>
                
                  <option value="">Sélectionnez un type</option>
                  <option value="medical_error">Erreur médicale</option>
                  <option value="material_damage">Dommage matériel</option>
                  <option value="bodily_injury">Dommage corporel</option>
                  <option value="theft">Vol / Perte de matériel</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Date de l'incident *</label>
                  <div className="relative">
                    <Calendar
                    className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  
                    <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: e.target.value
                    })
                    }
                    className={`${inputClass} pl-12`} />
                  
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Heure approximative *</label>
                  <div className="relative">
                    <Clock
                    className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  
                    <input
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      time: e.target.value
                    })
                    }
                    className={`${inputClass} pl-12`} />
                  
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Lieu de l'incident *</label>
                <div className="relative">
                  <MapPin
                  className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                
                  <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: e.target.value
                  })
                  }
                  placeholder="Adresse complète"
                  className={`${inputClass} pl-12`} />
                
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Patient concerné (si applicable)
                </label>
                <div className="relative">
                  <User
                  className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                
                  <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    patientName: e.target.value
                  })
                  }
                  placeholder="Nom du patient"
                  className={`${inputClass} pl-12`} />
                
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button
                onClick={() => setStep(2)}
                disabled={
                !formData.type ||
                !formData.date ||
                !formData.time ||
                !formData.location
                }
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                
                  Suivant
                </button>
              </div>
            </motion.div>
          }

          {step === 2 &&
          <motion.div
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: -20
            }}
            className="space-y-6">
            
              <div
              className={`p-4 rounded-xl border ${isDark ? 'bg-blue-900/20 border-blue-700/30' : 'bg-blue-50 border-blue-200'}`}>
              
                <div className="flex items-start gap-3">
                  <Info
                  className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                
                  <p
                  className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Décrivez les circonstances exactes de l'incident. Soyez le
                    plus précis possible sur le déroulement des faits.
                  </p>
                </div>
              </div>

              <div>
                <label className={labelClass}>Description détaillée *</label>
                <textarea
                value={formData.description}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value
                })
                }
                rows={4}
                placeholder="Que s'est-il passé exactement ?"
                className={`${inputClass} resize-none`} />
              
              </div>

              <div>
                <label className={labelClass}>Témoins éventuels</label>
                <textarea
                value={formData.witnesses}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  witnesses: e.target.value
                })
                }
                rows={2}
                placeholder="Noms et coordonnées des témoins (si applicable)"
                className={`${inputClass} resize-none`} />
              
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                type="checkbox"
                checked={formData.policeReport}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  policeReport: e.target.checked
                })
                }
                className="w-5 h-5 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500" />
              
                <span
                className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Un rapport de police a été établi
                </span>
              </label>

              <div className="pt-6 flex justify-between">
                <button
                onClick={() => setStep(1)}
                className={`px-6 py-3 border rounded-xl font-bold transition-colors ${isDark ? 'border-slate-600 text-white hover:bg-slate-700' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                
                  Précédent
                </button>
                <button
                onClick={() => setStep(3)}
                disabled={
                !formData.description || formData.description.length < 20
                }
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                
                  Suivant
                </button>
              </div>
            </motion.div>
          }

          {step === 3 &&
          <motion.div
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: -20
            }}
            className="space-y-6">
            
              <div
              className={`p-4 rounded-xl border ${isDark ? 'bg-amber-900/20 border-amber-700/30' : 'bg-amber-50 border-amber-200'}`}>
              
                <div className="flex items-start gap-3">
                  <AlertCircle
                  className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                
                  <p
                  className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Ajoutez toute pièce justificative utile : photos des
                    dommages, rapport médical, témoignages écrits, rapport de
                    police, etc.
                  </p>
                </div>
              </div>

              <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${isDark ? 'border-slate-600 hover:border-cyan-500 bg-slate-900/30' : 'border-slate-300 hover:border-cyan-500 bg-slate-50'}`}>
              
                <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept="image/*,.pdf,.doc,.docx" />
              
                <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center">
                
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-cyan-500" />
                  </div>
                  <p
                  className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Cliquez pour ajouter des fichiers
                  </p>
                  <p
                  className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                    PNG, JPG, PDF jusqu'à 10MB
                  </p>
                </label>
              </div>

              {files.length > 0 &&
            <div className="space-y-3">
                  <h4
                className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                    Fichiers ajoutés ({files.length})
                  </h4>
                  {files.map((file, index) =>
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                
                      <div className="flex items-center gap-3">
                        {file.type.startsWith('image/') ?
                  <Camera
                    className={`h-5 w-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} /> :


                  <FileText
                    className={`h-5 w-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />

                  }
                        <div>
                          <p
                      className={`text-sm font-medium truncate max-w-[200px] sm:max-w-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                            {file.name}
                          </p>
                          <p
                      className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                  onClick={() => removeFile(index)}
                  className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/20 text-slate-400 hover:text-red-400' : 'hover:bg-red-50 text-slate-500 hover:text-red-500'}`}>
                  
                        <X className="h-5 w-5" />
                      </button>
                    </div>
              )}
                </div>
            }

              <div className="pt-6 flex justify-between">
                <button
                onClick={() => setStep(2)}
                className={`px-6 py-3 border rounded-xl font-bold transition-colors ${isDark ? 'border-slate-600 text-white hover:bg-slate-700' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                
                  Précédent
                </button>
                <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
                
                  {isSubmitting ?
                <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Envoi en cours...
                    </> :

                'Soumettre la déclaration'
                }
                </button>
              </div>
            </motion.div>
          }

          {step === 4 &&
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            className="text-center py-8">
            
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h2
              className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Déclaration envoyée avec succès
              </h2>
              <p
              className={`mb-8 max-w-md mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              
                Votre numéro de dossier est le{' '}
                <span className="font-bold">SIN-2024-089</span>. Notre équipe va
                traiter votre demande dans les plus brefs délais. Vous recevrez
                un email de confirmation avec les prochaines étapes.
              </p>
              <button
              onClick={() => navigate('/provider/insurance')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
              
                Retour à l'assurance
              </button>
            </motion.div>
          }
        </div>
      </div>
    </div>);

}