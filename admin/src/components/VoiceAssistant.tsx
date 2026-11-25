import React, { useCallback, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MicIcon,
  MicOffIcon,
  XIcon,
  VolumeXIcon,
  Volume2Icon,
  CalendarIcon,
  StethoscopeIcon,
  PillIcon,
  AlertCircleIcon,
  MessageCircleIcon,
  HomeIcon,
  ChevronRightIcon,
  SparklesIcon } from
'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
type AssistantState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';
interface VoiceIntent {
  keywords: string[];
  response: string;
  route?: string;
  icon: React.ElementType;
  label: string;
}
const VOICE_INTENTS: VoiceIntent[] = [
{
  keywords: [
  'rendez-vous',
  'appointment',
  'prochain',
  'consultation',
  'planning',
  'agenda'],

  response: 'Je vous emmène voir vos rendez-vous.',
  route: '/mon-espace',
  icon: CalendarIcon,
  label: 'Mes rendez-vous'
},
{
  keywords: [
  'infirmier',
  'infirmière',
  'soin',
  'soins',
  'service',
  'aide',
  'médecin',
  'docteur',
  'kiné',
  'physio'],

  response: 'Voici les services de santé disponibles.',
  route: '/services',
  icon: StethoscopeIcon,
  label: 'Services de santé'
},
{
  keywords: [
  'médicament',
  'medicament',
  'pharmacie',
  'ordonnance',
  'pilule',
  'traitement'],

  response: 'Je vous emmène à vos médicaments.',
  route: '/medicaments',
  icon: PillIcon,
  label: 'Médicaments'
},
{
  keywords: [
  'urgence',
  'ambulance',
  'secours',
  'samu',
  'aide urgente',
  'appel'],

  response: 'Attention ! Je vous dirige vers les urgences.',
  route: '/ambulance-booking',
  icon: AlertCircleIcon,
  label: 'Urgences'
},
{
  keywords: ['message', 'messagerie', 'chat', 'écrire', 'contacter'],
  response: 'Voici vos messages.',
  route: '/messages',
  icon: MessageCircleIcon,
  label: 'Messages'
},
{
  keywords: [
  'accueil',
  'tableau de bord',
  'home',
  'retour',
  'départ',
  'principal'],

  response: "Retour à l'accueil.",
  route: '/patient-dashboard',
  icon: HomeIcon,
  label: 'Accueil'
}];

const QUICK_SUGGESTIONS = [
{
  label: 'Mon prochain RDV',
  icon: CalendarIcon,
  query: 'prochain rendez-vous'
},
{
  label: 'Trouver un soin',
  icon: StethoscopeIcon,
  query: 'soins infirmier'
},
{
  label: 'Mes médicaments',
  icon: PillIcon,
  query: 'médicaments'
},
{
  label: 'Urgences',
  icon: AlertCircleIcon,
  query: 'urgence'
}];

// Waveform bars animation component
function WaveformBars({ active }: {active: boolean;}) {
  const bars = [0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 1, 0.7, 0.4];
  return (
    <div className="flex items-center gap-[3px] h-8">
      {bars.map((height, i) =>
      <motion.div
        key={i}
        className="w-1 rounded-full bg-white"
        animate={
        active ?
        {
          scaleY: [
          height * 0.3,
          height,
          height * 0.5,
          height * 0.8,
          height * 0.3],

          opacity: [0.6, 1, 0.8, 1, 0.6]
        } :
        {
          scaleY: 0.2,
          opacity: 0.4
        }
        }
        transition={{
          duration: 0.8,
          repeat: Infinity,
          delay: i * 0.08,
          ease: 'easeInOut'
        }}
        style={{
          height: '100%',
          transformOrigin: 'center'
        }} />

      )}
    </div>);

}
// Ripple rings for listening state
function ListeningRings() {
  return (
    <>
      {[1, 2, 3].map((i) =>
      <motion.div
        key={i}
        className="absolute inset-0 rounded-full border-2 border-rose-400"
        initial={{
          scale: 1,
          opacity: 0.6
        }}
        animate={{
          scale: 1 + i * 0.4,
          opacity: 0
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.4,
          ease: 'easeOut'
        }} />

      )}
    </>);

}
export function VoiceAssistant() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [state, setState] = useState<AssistantState>('idle');
  const [isExpanded, setIsExpanded] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [matchedIntent, setMatchedIntent] = useState<VoiceIntent | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const responseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Only show for patient role
  const isPatient = user?.role === 'patient';
  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if (synthRef.current) synthRef.current.cancel();
      if (responseTimerRef.current) clearTimeout(responseTimerRef.current);
    };
  }, []);
  const speak = useCallback(
    (text: string) => {
      if (!synthRef.current || isMuted) return;
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.85;
      utterance.pitch = 1.05;
      utterance.volume = 1;
      // Pick a French voice if available
      const voices = synthRef.current.getVoices();
      const frVoice = voices.find(
        (v) => v.lang.startsWith('fr') && v.localService
      );
      if (frVoice) utterance.voice = frVoice;
      utterance.onend = () => {
        setState('idle');
        // Auto-navigate after speaking
        if (matchedIntent?.route) {
          responseTimerRef.current = setTimeout(() => {
            navigate(matchedIntent.route!);
            setIsExpanded(false);
            setMatchedIntent(null);
          }, 800);
        }
      };
      synthRef.current.speak(utterance);
    },
    [isMuted, matchedIntent, navigate]
  );
  const parseIntent = useCallback((text: string): VoiceIntent | null => {
    const lower = text.toLowerCase();
    for (const intent of VOICE_INTENTS) {
      if (intent.keywords.some((kw) => lower.includes(kw))) {
        return intent;
      }
    }
    return null;
  }, []);
  const processTranscript = useCallback(
    (text: string) => {
      setState('processing');
      setTranscript(text);
      setTimeout(() => {
        const intent = parseIntent(text);
        if (intent) {
          setMatchedIntent(intent);
          setResponse(intent.response);
          setState('speaking');
          speak(intent.response);
        } else {
          const fallback =
          'Je n\'ai pas bien compris. Pouvez-vous répéter ? Par exemple : "mes rendez-vous" ou "trouver un soin".';
          setResponse(fallback);
          setMatchedIntent(null);
          setState('speaking');
          speak(fallback);
        }
      }, 600);
    },
    [parseIntent, speak]
  );
  const startListening = useCallback(() => {
    const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setResponse(
        "La reconnaissance vocale n'est pas disponible sur ce navigateur."
      );
      setState('error');
      return;
    }
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setState('listening');
      setTranscript('');
      setResponse('');
      setMatchedIntent(null);
      setHasPermission(true);
    };
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript;
      setTranscript(text);
      if (result.isFinal) {
        recognition.stop();
        processTranscript(text);
      }
    };
    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setHasPermission(false);
        setResponse(
          'Accès au microphone refusé. Veuillez autoriser le microphone.'
        );
        setState('error');
      } else if (event.error !== 'aborted') {
        setResponse('Impossible de vous entendre. Veuillez réessayer.');
        setState('error');
      }
    };
    recognition.onend = () => {
      if (state === 'listening') {
        setState('idle');
      }
    };
    recognition.start();
  }, [processTranscript, state]);
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setState('idle');
  }, []);
  const handleMicPress = () => {
    if (state === 'listening') {
      stopListening();
    } else if (state === 'speaking') {
      synthRef.current?.cancel();
      setState('idle');
    } else {
      setIsExpanded(true);
      startListening();
    }
  };
  const handleQuickSuggestion = (query: string) => {
    setIsExpanded(true);
    setTranscript(query);
    processTranscript(query);
  };
  const handleNavigate = () => {
    if (matchedIntent?.route) {
      navigate(matchedIntent.route);
      setIsExpanded(false);
      setMatchedIntent(null);
      setState('idle');
    }
  };
  const handleClose = () => {
    if (recognitionRef.current) recognitionRef.current.abort();
    if (synthRef.current) synthRef.current.cancel();
    if (responseTimerRef.current) clearTimeout(responseTimerRef.current);
    setIsExpanded(false);
    setState('idle');
    setTranscript('');
    setResponse('');
    setMatchedIntent(null);
  };
  if (!isPatient) return null;
  const isListening = state === 'listening';
  const isSpeaking = state === 'speaking';
  const isProcessing = state === 'processing';
  const isError = state === 'error';
  const buttonGradient = isListening ?
  'from-rose-500 to-red-600' :
  isSpeaking ?
  'from-emerald-500 to-teal-600' :
  'from-violet-500 to-purple-600';
  const stateLabel = isListening ?
  'Je vous écoute...' :
  isSpeaking ?
  'Je réponds...' :
  isProcessing ?
  'Je réfléchis...' :
  isError ?
  'Erreur' :
  'Appuyez pour parler';
  return (
    <>
      {/* Expanded Panel */}
      <AnimatePresence>
        {isExpanded &&
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            y: 20,
            scale: 0.95
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 28
          }}
          className={`fixed bottom-36 left-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-3xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-900 border border-slate-700/80' : 'bg-white border border-slate-200'}`}>
          
            {/* Header */}
            <div className="relative bg-gradient-to-r from-violet-600 to-purple-700 p-5">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-8 w-16 h-16 bg-white/5 rounded-full translate-y-1/2" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <SparklesIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base leading-tight">
                      Assistant Vocal
                    </h3>
                    <p className="text-purple-200 text-xs">
                      Sanad • Toujours là pour vous
                    </p>
                  </div>
                </div>
                <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                
                  <XIcon className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* State indicator */}
              <div className="relative mt-4 flex items-center gap-2">
                <div
                className={`w-2 h-2 rounded-full ${isListening ? 'bg-rose-400 animate-pulse' : isSpeaking ? 'bg-emerald-400 animate-pulse' : isProcessing ? 'bg-amber-400 animate-pulse' : 'bg-white/40'}`} />
              
                <span className="text-white/80 text-sm font-medium">
                  {stateLabel}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Transcript */}
              <AnimatePresence>
                {transcript &&
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0
                }}
                animate={{
                  opacity: 1,
                  height: 'auto'
                }}
                exit={{
                  opacity: 0,
                  height: 0
                }}
                className={`rounded-2xl p-4 ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-slate-50 border border-slate-200'}`}>
                
                    <p
                  className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  
                      Vous avez dit
                    </p>
                    <p
                  className={`text-lg font-medium leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                      "{transcript}"
                    </p>
                  </motion.div>
              }
              </AnimatePresence>

              {/* Response */}
              <AnimatePresence>
                {response &&
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0
                }}
                animate={{
                  opacity: 1,
                  height: 'auto'
                }}
                exit={{
                  opacity: 0,
                  height: 0
                }}
                className={`rounded-2xl p-4 ${isError ? isDark ? 'bg-red-900/30 border border-red-700/50' : 'bg-red-50 border border-red-200' : isDark ? 'bg-violet-900/30 border border-violet-700/50' : 'bg-violet-50 border border-violet-200'}`}>
                
                    <p
                  className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isError ? isDark ? 'text-red-400' : 'text-red-500' : isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                  
                      {isError ? 'Erreur' : 'Réponse'}
                    </p>
                    <p
                  className={`text-base font-medium leading-relaxed ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                      {response}
                    </p>
                  </motion.div>
              }
              </AnimatePresence>

              {/* Navigate CTA */}
              <AnimatePresence>
                {matchedIntent && (isSpeaking || state === 'idle') &&
              <motion.button
                initial={{
                  opacity: 0,
                  y: 8
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  y: 8
                }}
                onClick={handleNavigate}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold text-base shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow">
                
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                        <matchedIntent.icon className="h-5 w-5 text-white" />
                      </div>
                      <span>{matchedIntent.label}</span>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-white/70" />
                  </motion.button>
              }
              </AnimatePresence>

              {/* Quick suggestions — shown when idle */}
              {!transcript && !response && state === 'idle' &&
            <div>
                  <p
                className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                
                    Suggestions rapides
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_SUGGESTIONS.map((s) =>
                <button
                  key={s.label}
                  onClick={() => handleQuickSuggestion(s.query)}
                  className={`flex items-center gap-2 p-3 rounded-2xl border text-left transition-all ${isDark ? 'bg-slate-800 border-slate-700 hover:border-violet-500/50 text-slate-200' : 'bg-slate-50 border-slate-200 hover:border-violet-300 text-slate-700'}`}>
                  
                        <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-violet-500/20' : 'bg-violet-100'}`}>
                    
                          <s.icon
                      className={`h-3.5 w-3.5 ${isDark ? 'text-violet-400' : 'text-violet-600'}`} />
                    
                        </div>
                        <span className="text-xs font-medium leading-tight">
                          {s.label}
                        </span>
                      </button>
                )}
                  </div>
                </div>
            }
            </div>

            {/* Mic action area */}
            <div
            className={`px-5 pb-5 flex items-center justify-between gap-3`}>
            
              {/* Mute toggle */}
              <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${isDark ? 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white' : 'bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900'}`}
              title={isMuted ? 'Activer le son' : 'Couper le son'}>
              
                {isMuted ?
              <VolumeXIcon className="h-5 w-5" /> :

              <Volume2Icon className="h-5 w-5" />
              }
              </button>

              {/* Main mic button in panel */}
              <button
              onClick={handleMicPress}
              className={`flex-1 h-14 rounded-2xl flex items-center justify-center gap-3 font-bold text-white transition-all relative overflow-hidden bg-gradient-to-r ${buttonGradient} shadow-lg`}>
              
                {isListening &&
              <motion.div
                className="absolute inset-0 bg-white/10"
                animate={{
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity
                }} />

              }
                {isListening ?
              <>
                    <WaveformBars active={true} />
                    <span className="text-sm">Arrêter</span>
                  </> :
              isSpeaking ?
              <>
                    <WaveformBars active={true} />
                    <span className="text-sm">Je parle...</span>
                  </> :
              isProcessing ?
              <motion.div
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full" /> :


              <>
                    <MicIcon className="h-5 w-5" />
                    <span className="text-sm">Parler à nouveau</span>
                  </>
              }
              </button>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Floating Mic Button */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={{
          top: -400,
          left: -20,
          right: 300,
          bottom: 20
        }}
        className="fixed bottom-24 left-4 z-50 flex flex-col items-center gap-1.5 cursor-grab active:cursor-grabbing"
        initial={{
          scale: 0,
          opacity: 0
        }}
        animate={{
          scale: 1,
          opacity: 1
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.5
        }}
        style={{
          touchAction: 'none'
        }}>
        
        {/* Label above button — shown when idle and not expanded */}
        <AnimatePresence>
          {!isExpanded && state === 'idle' &&
          <motion.div
            initial={{
              opacity: 0,
              y: 4
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: 4
            }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap shadow-md pointer-events-none ${isDark ? 'bg-slate-800 border border-slate-700 text-slate-300' : 'bg-white border border-slate-200 text-slate-700 shadow-sm'}`}>
            
              🎙️ Aide vocale
            </motion.div>
          }
        </AnimatePresence>

        {/* The button */}
        <div className="relative">
          {/* Listening rings */}
          {isListening &&
          <div className="absolute inset-0 flex items-center justify-center">
              <ListeningRings />
            </div>
          }

          {/* Idle gentle pulse */}
          {!isListening && !isSpeaking && !isExpanded &&
          <motion.div
            className="absolute inset-0 rounded-full bg-violet-500/30"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0, 0.4]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }} />

          }

          <motion.button
            onClick={() => {
              if (isExpanded) {
                handleClose();
              } else {
                setIsExpanded(true);
                startListening();
              }
            }}
            whileTap={{
              scale: 0.92
            }}
            whileHover={{
              scale: 1.08
            }}
            className={`relative w-11 h-11 rounded-full flex items-center justify-center shadow-xl transition-all bg-gradient-to-br ${buttonGradient}`}
            style={{
              boxShadow: isListening ?
              '0 0 0 0 rgba(239, 68, 68, 0.4), 0 6px 24px rgba(239, 68, 68, 0.4)' :
              isSpeaking ?
              '0 0 0 0 rgba(16, 185, 129, 0.4), 0 6px 24px rgba(16, 185, 129, 0.4)' :
              '0 6px 24px rgba(139, 92, 246, 0.5)'
            }}>
            
            {isExpanded ?
            <XIcon className="h-5 w-5 text-white" /> :
            isListening ?
            <motion.div
              animate={{
                scale: [1, 1.15, 1]
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity
              }}>
              
                <MicIcon className="h-5 w-5 text-white" />
              </motion.div> :
            isSpeaking ?
            <Volume2Icon className="h-5 w-5 text-white" /> :
            isProcessing ?
            <motion.div
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> :


            <MicIcon className="h-5 w-5 text-white" />
            }
          </motion.button>
        </div>
      </motion.div>
    </>);

}