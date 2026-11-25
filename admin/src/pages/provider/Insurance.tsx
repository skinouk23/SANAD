import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  CheckCircle2,
  FileText,
  Download,
  AlertCircle,
  Phone,
  Mail,
  Crown,
  Calendar,
  DollarSign,
  Award,
  ChevronRight,
  ExternalLink,
  Loader2,
  X,
  Info } from
'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  useInsuranceCoverage,
  useInsuranceClaims,
  useInsuranceDocuments,
  useInsuranceStats } from
'../../hooks/useInsurance';
export function Insurance() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [showConditionsModal, setShowConditionsModal] = useState(false);
  const { data: coverageDetails, loading: coverageLoading } =
  useInsuranceCoverage();
  const { data: claims, loading: claimsLoading } = useInsuranceClaims();
  const { data: documents, loading: docsLoading } = useInsuranceDocuments();
  const { data: insuranceStats, loading: statsLoading } = useInsuranceStats();
  const loading =
  coverageLoading || claimsLoading || docsLoading || statsLoading;
  const stats = [
  {
    label: 'Statut',
    value: insuranceStats?.status || 'Active',
    sub: `Valide jusqu'au ${insuranceStats?.validUntil || '31 Déc 2024'}`,
    icon: Shield,
    gradient: 'from-green-500 to-emerald-500',
    highlight: true
  },
  {
    label: 'Couverture max',
    value: insuranceStats?.maxCoverage || '500K TND',
    sub: 'Par sinistre',
    icon: DollarSign,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    label: 'Sinistres',
    value: String(insuranceStats?.claimsCount ?? 0),
    sub: 'Cette année',
    icon: FileText,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    label: 'Franchise',
    value: insuranceStats?.franchise || '0 TND',
    sub: 'Aucune franchise',
    icon: Award,
    gradient: 'from-amber-500 to-orange-500'
  }];

  const insuranceConditions = [
  {
    category: 'Couverture générale',
    items: [
    "Responsabilité civile professionnelle jusqu'à 500 000 TND par sinistre",
    'Couverture des dommages corporels, matériels et immatériels',
    "Protection juridique incluse (frais d'avocat et de défense)",
    'Couverture mondiale pour les déplacements professionnels',
    'Aucune franchise sur les sinistres couverts']

  },
  {
    category: 'Exclusions',
    items: [
    'Faute intentionnelle ou dol du professionnel',
    "Dommages causés sous l'influence d'alcool ou de stupéfiants",
    'Activités non déclarées ou non autorisées',
    'Sinistres antérieurs à la date de souscription',
    'Dommages aux biens confiés (sauf clause spécifique)']

  },
  {
    category: 'Procédure de déclaration',
    items: [
    'Déclaration obligatoire dans les 5 jours ouvrés suivant la connaissance du sinistre',
    'Formulaire de déclaration disponible sur la plateforme',
    "Documents requis: rapport d'incident, témoignages, photos si applicable",
    'Délai de traitement: 15 jours ouvrés maximum',
    'Possibilité de recours en cas de refus de prise en charge']

  },
  {
    category: 'Obligations du professionnel',
    items: [
    'Respecter les normes et protocoles de la profession',
    'Maintenir ses qualifications et certifications à jour',
    "Informer l'assureur de tout changement d'activité",
    'Conserver les dossiers patients pendant 10 ans minimum',
    "Coopérer pleinement lors de l'instruction d'un sinistre"]

  },
  {
    category: 'Résiliation et renouvellement',
    items: [
    'Renouvellement automatique annuel',
    'Possibilité de résiliation avec préavis de 2 mois',
    'Aucune pénalité en cas de résiliation',
    'Maintien de la couverture pendant 30 jours après résiliation (effet différé)',
    'Tarification stable garantie pendant 3 ans']

  },
  {
    category: 'Conformité légale tunisienne',
    items: [
    'Conforme au Code des Assurances tunisien',
    "Agréé par l'Autorité de Contrôle des Assurances (ACA)",
    'Respect de la loi n° 2008-37 sur la RC professionnelle',
    'Couverture obligatoire pour les professions de santé',
    "Attestation d'assurance valable pour les autorités tunisiennes"]

  }];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'resolved':
        return {
          bg: 'bg-green-500/20',
          text: 'text-green-500',
          border: 'border-green-500/30',
          label: 'Résolu'
        };
      case 'in-progress':
        return {
          bg: 'bg-amber-500/20',
          text: 'text-amber-500',
          border: 'border-amber-500/30',
          label: 'En cours'
        };
      default:
        return {
          bg: 'bg-slate-500/20',
          text: 'text-slate-500',
          border: 'border-slate-500/30',
          label: 'Inconnu'
        };
    }
  };
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        
        <Loader2
          className={`h-6 w-6 animate-spin ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
        
      </div>);

  }
  return (
    <div
      className={`min-h-screen pb-20 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div
        className={`fixed inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none`}>
      </div>

      <div
        className={`relative z-10 backdrop-blur-sm border-b ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
        
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/provider-dashboard')}
            className={`flex items-center mb-3 text-xs font-medium group ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
            
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5 group-hover:-translate-x-1 transition-transform" />
            Retour au dashboard
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1
                  className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  Assurance RC Pro
                </h1>
                <p
                  className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  
                  Protection complète incluse
                </p>
              </div>
            </div>
            <button className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-1.5 text-xs self-start">
              <Phone className="h-3.5 w-3.5" />
              Contacter l'assureur
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className={`mb-4 p-3 sm:p-4 rounded-xl backdrop-blur-sm ${isDark ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30' : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'}`}>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3
                className={`text-sm sm:text-base font-bold mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                Assurance RC Professionnelle Incluse
              </h3>
              <p
                className={`text-[10px] sm:text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                
                Couverture jusqu'à 500 000 TND • Aucune franchise
              </p>
            </div>
            <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded-full">
              👑 Elite
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4">
          {stats.map((stat, index) =>
          <motion.div
            key={stat.label}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: index * 0.1
            }}
            className={`backdrop-blur-sm border rounded-xl p-2.5 sm:p-3 ${stat.highlight ? isDark ? 'border-green-500/30' : 'border-green-200' : isDark ? 'border-slate-700/50' : 'border-slate-200'} ${isDark ? 'bg-slate-800/50' : 'bg-white/80 shadow-sm'}`}>
            
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                
                  <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                </div>
                {stat.highlight &&
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              }
              </div>
              <p
              className={`text-[9px] sm:text-[10px] font-medium uppercase mb-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              
                {stat.label}
              </p>
              <p
              className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                {stat.value}
              </p>
              <p
              className={`text-[9px] sm:text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              
                {stat.sub}
              </p>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {coverageDetails?.map((section, sectionIdx) =>
            <motion.div
              key={section.category}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.2 + sectionIdx * 0.1
              }}
              className={`backdrop-blur-sm border rounded-xl p-3 sm:p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
              
                <h3
                className={`text-xs sm:text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  {section.category}
                </h3>
                <div className="space-y-1.5">
                  {section.items.map((item, index) =>
                <div
                  key={index}
                  className={`flex items-start gap-2 p-2 rounded-lg border ${isDark ? 'bg-slate-900/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                  
                      <div className="w-4 h-4 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="h-2.5 w-2.5 text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                      className={`text-[10px] sm:text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                          {item.text}
                        </p>
                        <p
                      className={`text-[9px] sm:text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                          Limite :{' '}
                          <span className="text-green-500 font-semibold">
                            {item.limit}
                          </span>
                        </p>
                      </div>
                    </div>
                )}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.4
              }}
              className={`backdrop-blur-sm border rounded-xl p-3 sm:p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
              
              <h3
                className={`text-xs sm:text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                Historique des sinistres
              </h3>
              {claims?.length > 0 ?
              <div className="space-y-2">
                  {claims.map((claim) => {
                  const statusConfig = getStatusConfig(claim.status);
                  return (
                    <div
                      key={claim.id}
                      className={`p-2 sm:p-3 rounded-lg border ${isDark ? 'bg-slate-900/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                      
                        <div className="flex items-start justify-between mb-1.5">
                          <div>
                            <h4
                            className={`font-semibold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            
                              {claim.type}
                            </h4>
                            <p
                            className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            
                              {claim.description}
                            </p>
                          </div>
                          <span
                          className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                          
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <div
                          className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          
                            <Calendar className="h-2.5 w-2.5" />
                            <span>{claim.date}</span>
                          </div>
                          <span
                          className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                            {claim.amount} TND
                          </span>
                        </div>
                      </div>);

                })}
                </div> :

              <div className="text-center py-6">
                  <Shield
                  className={`h-8 w-8 mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                
                  <p
                  className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                    Aucun sinistre déclaré
                  </p>
                </div>
              }
            </motion.div>
          </div>

          <div className="space-y-3">
            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.3
              }}
              className={`backdrop-blur-sm border rounded-xl p-3 sm:p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
              
              <h3
                className={`font-bold mb-3 text-xs sm:text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                Actions rapides
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => navigate('/provider/insurance/file-claim')}
                  className="w-full px-3 py-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg font-medium text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 text-xs">
                  
                  <AlertCircle className="h-3.5 w-3.5" />
                  Déclarer un sinistre
                </button>
                <button
                  className={`w-full px-3 py-2 border rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
                  
                  <Download className="h-3.5 w-3.5" />
                  Télécharger l'attestation
                </button>
                <button
                  onClick={() => setShowConditionsModal(true)}
                  className={`w-full px-3 py-2 border rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
                  
                  <FileText className="h-3.5 w-3.5" />
                  Voir les conditions
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.4
              }}
              className={`backdrop-blur-sm border rounded-xl p-3 sm:p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
              
              <h3
                className={`font-bold mb-3 text-xs sm:text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                Documents
              </h3>
              <div className="space-y-1.5">
                {documents?.map((doc, index) =>
                <div
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer ${isDark ? 'bg-slate-900/50 border-slate-700/50 hover:border-cyan-500/30' : 'bg-slate-50 border-slate-200 hover:border-cyan-500'}`}>
                  
                    <div className="w-7 h-7 bg-red-500/20 rounded-md flex items-center justify-center flex-shrink-0">
                      <FileText className="h-3 w-3 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                      className={`text-[10px] font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        {doc.name}
                      </p>
                      <p
                      className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      
                        {doc.size} • {doc.date}
                      </p>
                    </div>
                    <Download
                    className={`h-3 w-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.5
              }}
              className={`border rounded-xl p-3 sm:p-4 ${isDark ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'}`}>
              
              <h3
                className={`font-bold mb-3 text-xs sm:text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                Besoin d'aide ?
              </h3>
              <div className="space-y-2">
                <a
                  href="tel:+21671XXXXXX"
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/30' : 'bg-white/80 border-slate-200 hover:border-cyan-500'}`}>
                  
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${isDark ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
                    
                    <Phone
                      className={`h-3 w-3 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                    
                  </div>
                  <div>
                    <p
                      className={`text-[10px] font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                      Urgence 24/7
                    </p>
                    <p
                      className={`text-[10px] ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      
                      +216 71 XXX XXX
                    </p>
                  </div>
                </a>
                <a
                  href="mailto:assurance@carehome.tn"
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/30' : 'bg-white/80 border-slate-200 hover:border-cyan-500'}`}>
                  
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${isDark ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
                    
                    <Mail
                      className={`h-3 w-3 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                    
                  </div>
                  <div>
                    <p
                      className={`text-[10px] font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                      Email
                    </p>
                    <p
                      className={`text-[10px] ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      
                      assurance@carehome.tn
                    </p>
                  </div>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.6
              }}
              className={`border rounded-xl p-3 sm:p-4 ${isDark ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'}`}>
              
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-green-500 flex-shrink-0" />
                <div>
                  <h4
                    className={`font-semibold text-xs mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    Protection automatique
                  </h4>
                  <p
                    className={`text-[10px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    
                    Vous êtes automatiquement couvert dès votre première
                    intervention.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Conditions Modal */}
      {showConditionsModal &&
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
          className={`w-full max-w-2xl rounded-2xl max-h-[85vh] overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          
            <div
            className={`sticky top-0 flex items-center justify-between p-4 border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2
                  className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  
                    Conditions Générales d'Assurance
                  </h2>
                  <p
                  className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  
                    Responsabilité Civile Professionnelle
                  </p>
                </div>
              </div>
              <button
              onClick={() => setShowConditionsModal(false)}
              className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
              
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(85vh-100px)]">
              <div
              className={`mb-4 p-3 rounded-lg border ${isDark ? 'bg-blue-900/20 border-blue-700/30' : 'bg-blue-50 border-blue-200'}`}>
              
                <div className="flex items-start gap-2">
                  <Info
                  className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                
                  <div>
                    <p
                    className={`text-xs font-semibold mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    
                      Document légal
                    </p>
                    <p
                    className={`text-[10px] ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    
                      Ces conditions sont conformes à la législation tunisienne
                      et au Code des Assurances. Elles définissent vos droits et
                      obligations en tant qu'assuré.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {insuranceConditions.map((section, index) =>
              <div
                key={index}
                className={`p-3 rounded-lg border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                
                    <h3
                  className={`text-sm font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  
                      <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}`}>
                    
                        {index + 1}
                      </span>
                      {section.category}
                    </h3>
                    <ul className="space-y-1.5">
                      {section.items.map((item, itemIndex) =>
                  <li
                    key={itemIndex}
                    className="flex items-start gap-1.5">
                    
                          <CheckCircle2
                      className={`h-3 w-3 flex-shrink-0 mt-0.5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                    
                          <span
                      className={`text-xs ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                      
                            {item}
                          </span>
                        </li>
                  )}
                    </ul>
                  </div>
              )}
              </div>

              <div
              className={`mt-4 p-3 rounded-lg border ${isDark ? 'bg-amber-900/20 border-amber-700/30' : 'bg-amber-50 border-amber-200'}`}>
              
                <div className="flex items-start gap-2">
                  <AlertCircle
                  className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                
                  <div>
                    <p
                    className={`text-xs font-semibold mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    
                      Important
                    </p>
                    <p
                    className={`text-[10px] ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    
                      En cas de doute ou de question sur ces conditions,
                      n'hésitez pas à contacter notre service client au +216 71
                      XXX XXX ou par email à assurance@carehome.tn
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                className={`flex-1 px-3 py-2 border rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'}`}>
                
                  <Download className="h-3.5 w-3.5" />
                  Télécharger PDF
                </button>
                <button
                onClick={() => setShowConditionsModal(false)}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium text-white hover:opacity-90 transition-opacity text-xs">
                
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}