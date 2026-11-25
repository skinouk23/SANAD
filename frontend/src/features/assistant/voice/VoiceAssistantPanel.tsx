import { useCallback, useEffect, useMemo, useRef, useState, type ElementType } from 'react';
import {
  AlertCircleIcon,
  CalendarIcon,
  ChevronRightIcon,
  HomeIcon,
  MessageCircleIcon,
  MicIcon,
  PillIcon,
  SparklesIcon,
  StethoscopeIcon,
  Volume2Icon,
  VolumeXIcon,
  XIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  getAssistantLocale,
  normalizeAssistantText,
  type AssistantVoiceIntent,
  type AssistantVoiceIntentId,
  type AssistantVoiceQuickSuggestion,
} from '@/features/assistant/assistant-locale';
import { useLanguage } from '@/shared/lib/i18n/language-context';

type AssistantState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

interface VoiceAssistantPanelProps {
  isOpen: boolean;
  onOpenChange: (nextOpen: boolean) => void;
  autoStartRequest: number;
}

interface SpeechRecognitionResultItem {
  readonly transcript: string;
}

interface SpeechRecognitionResult {
  readonly [index: number]: SpeechRecognitionResultItem;
  readonly isFinal: boolean;
}

interface SpeechRecognitionResultList {
  readonly [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResultEvent {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  readonly error: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

type LocalizedVoiceIntent = AssistantVoiceIntent & {
  icon: ElementType;
  normalizedKeywords: readonly string[];
};

type LocalizedVoiceQuickSuggestion = AssistantVoiceQuickSuggestion & {
  icon: ElementType;
};

const INTENT_ICONS: Record<AssistantVoiceIntentId, ElementType> = {
  appointments: CalendarIcon,
  services: StethoscopeIcon,
  medicines: PillIcon,
  emergency: AlertCircleIcon,
  messages: MessageCircleIcon,
  home: HomeIcon,
};

function normalizeSpeechLocale(locale: string): string {
  return locale.toLowerCase().replace(/_/g, '-');
}

function selectSpeechVoice(
  voices: SpeechSynthesisVoice[],
  preferredLocales: readonly string[],
): SpeechSynthesisVoice | undefined {
  const candidates = preferredLocales.map(normalizeSpeechLocale);

  return voices
    .filter((voice) =>
      candidates.some((candidate) => normalizeSpeechLocale(voice.lang).startsWith(candidate)),
    )
    .sort((left, right) => Number(right.localService) - Number(left.localService))[0];
}

function WaveformBars({ active }: { active: boolean }) {
  const bars = [0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 1, 0.7, 0.4];

  return (
    <div className="flex h-8 items-center gap-[3px]">
      {bars.map((height, index) => (
        <div
          key={index}
          className={`w-1 rounded-full bg-white ${active ? 'opacity-100' : 'opacity-40'}`}
          style={{
            height: `${Math.max(height * 100, 20)}%`,
          }}
        />
      ))}
    </div>
  );
}

function getStateIndicatorClass({
  isListening,
  isProcessing,
  isSpeaking,
}: {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
}): string {
  if (isListening) {
    return 'bg-rose-400 animate-pulse';
  }

  if (isSpeaking) {
    return 'bg-emerald-400 animate-pulse';
  }

  if (isProcessing) {
    return 'bg-amber-400 animate-pulse';
  }

  return 'bg-white/40';
}

function getMicButtonGradientClass({
  isListening,
  isSpeaking,
}: {
  isListening: boolean;
  isSpeaking: boolean;
}): string {
  if (isListening) {
    return 'from-rose-500 to-red-600 shadow-red-500/40';
  }

  if (isSpeaking) {
    return 'from-emerald-500 to-teal-600 shadow-emerald-500/40';
  }

  return 'from-violet-500 to-purple-600 shadow-purple-500/40';
}

export function VoiceAssistantPanel({
  isOpen,
  onOpenChange,
  autoStartRequest,
}: VoiceAssistantPanelProps) {
  const navigate = useNavigate();
  const { currentLanguage, t } = useLanguage();
  const [state, setState] = useState<AssistantState>('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [matchedIntent, setMatchedIntent] = useState<LocalizedVoiceIntent | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [, setHasPermission] = useState<boolean | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const responseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const processingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastAutoStartRef = useRef(0);
  const assistantLocale = useMemo(
    () => getAssistantLocale(currentLanguage.code),
    [currentLanguage.code],
  );
  const voiceIntents = useMemo<LocalizedVoiceIntent[]>(
    () =>
      assistantLocale.voice.intents.map((intent) => ({
        ...intent,
        icon: INTENT_ICONS[intent.id],
        normalizedKeywords: intent.keywords.map(normalizeAssistantText),
      })),
    [assistantLocale.voice.intents],
  );
  const quickSuggestions = useMemo<LocalizedVoiceQuickSuggestion[]>(
    () =>
      assistantLocale.voice.quickSuggestions.map((suggestion) => ({
        ...suggestion,
        icon: INTENT_ICONS[suggestion.intentId],
      })),
    [assistantLocale.voice.quickSuggestions],
  );

  const resetPanel = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    if (synthRef.current) {
      synthRef.current.cancel();
    }

    if (responseTimerRef.current) {
      clearTimeout(responseTimerRef.current);
      responseTimerRef.current = null;
    }

    if (processingTimerRef.current) {
      clearTimeout(processingTimerRef.current);
      processingTimerRef.current = null;
    }

    setState('idle');
    setTranscript('');
    setResponse('');
    setMatchedIntent(null);
  }, []);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;

    return () => {
      resetPanel();
    };
  }, [resetPanel]);

  useEffect(() => {
    if (!isOpen) {
      resetPanel();
    }
  }, [isOpen, resetPanel]);

  useEffect(() => {
    resetPanel();
  }, [currentLanguage.code, resetPanel]);

  const speak = useCallback(
    (text: string, route?: string) => {
      if (!synthRef.current || isMuted) {
        setState('idle');
        return;
      }

      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = assistantLocale.voice.speech.fallbackSynthesisLocale;
      utterance.rate = 0.85;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      const voices = synthRef.current.getVoices();
      const localizedVoice = selectSpeechVoice(
        voices,
        assistantLocale.voice.speech.synthesisLocales,
      );

      if (localizedVoice) {
        utterance.voice = localizedVoice;
        utterance.lang = localizedVoice.lang;
      }

      utterance.onend = () => {
        setState('idle');

        if (!route) {
          return;
        }

        responseTimerRef.current = setTimeout(() => {
          navigate(route);
          onOpenChange(false);
        }, 800);
      };

      synthRef.current.speak(utterance);
    },
    [assistantLocale.voice.speech, isMuted, navigate, onOpenChange],
  );

  const parseIntent = useCallback(
    (text: string): LocalizedVoiceIntent | null => {
      const normalized = normalizeAssistantText(text);

      for (const intent of voiceIntents) {
        if (intent.normalizedKeywords.some((keyword) => normalized.includes(keyword))) {
          return intent;
        }
      }

      return null;
    },
    [voiceIntents],
  );

  const processTranscript = useCallback(
    (text: string) => {
      if (processingTimerRef.current) {
        clearTimeout(processingTimerRef.current);
      }

      setState('processing');
      setTranscript(text);

      processingTimerRef.current = setTimeout(() => {
        processingTimerRef.current = null;
        const intent = parseIntent(text);

        if (intent) {
          setMatchedIntent(intent);
          setResponse(intent.response);
          setState('speaking');
          speak(intent.response, intent.route);
          return;
        }

        const fallback = assistantLocale.voice.fallbackResponse;
        setResponse(fallback);
        setMatchedIntent(null);
        setState('speaking');
        speak(fallback);
      }, 600);
    },
    [assistantLocale.voice.fallbackResponse, parseIntent, speak],
  );

  const startListening = useCallback(() => {
    const win = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };

    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setResponse(assistantLocale.voice.unsupportedBrowserMessage);
      setState('error');
      return;
    }

    if (responseTimerRef.current) {
      clearTimeout(responseTimerRef.current);
      responseTimerRef.current = null;
    }

    if (processingTimerRef.current) {
      clearTimeout(processingTimerRef.current);
      processingTimerRef.current = null;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = assistantLocale.voice.speech.recognitionLocale;
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
    recognition.onresult = (event: SpeechRecognitionResultEvent) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript;
      setTranscript(text);

      if (result.isFinal) {
        recognition.stop();
        processTranscript(text);
      }
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'not-allowed') {
        setHasPermission(false);
        setResponse(assistantLocale.voice.microphoneDeniedMessage);
        setState('error');
      } else if (event.error !== 'aborted') {
        setResponse(assistantLocale.voice.microphoneRetryMessage);
        setState('error');
      }
    };
    recognition.onend = () => {
      setState((currentState) => (currentState === 'listening' ? 'idle' : currentState));
    };
    recognition.start();
  }, [
    assistantLocale.voice.microphoneDeniedMessage,
    assistantLocale.voice.microphoneRetryMessage,
    assistantLocale.voice.speech.recognitionLocale,
    assistantLocale.voice.unsupportedBrowserMessage,
    processTranscript,
  ]);

  useEffect(() => {
    if (!isOpen || autoStartRequest === 0 || lastAutoStartRef.current === autoStartRequest) {
      return;
    }

    lastAutoStartRef.current = autoStartRequest;
    startListening();
  }, [autoStartRequest, isOpen, startListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setState('idle');
  }, []);

  const handleMicPress = useCallback(() => {
    if (state === 'listening') {
      stopListening();
      return;
    }

    if (state === 'speaking') {
      if (responseTimerRef.current) {
        clearTimeout(responseTimerRef.current);
        responseTimerRef.current = null;
      }

      synthRef.current?.cancel();
      setState('idle');
      return;
    }

    startListening();
  }, [startListening, state, stopListening]);

  const handleQuickSuggestion = useCallback(
    (query: string) => {
      setTranscript(query);
      processTranscript(query);
    },
    [processTranscript],
  );

  const handleNavigate = useCallback(() => {
    if (!matchedIntent?.route) {
      return;
    }

    navigate(matchedIntent.route);
    onOpenChange(false);
  }, [matchedIntent, navigate, onOpenChange]);

  const isListening = state === 'listening';
  const isSpeaking = state === 'speaking';
  const isProcessing = state === 'processing';
  const isError = state === 'error';
  const stateIndicatorClass = getStateIndicatorClass({
    isListening,
    isProcessing,
    isSpeaking,
  });
  const micButtonGradientClass = getMicButtonGradientClass({ isListening, isSpeaking });
  const stateLabel = isListening
    ? assistantLocale.voice.stateLabels.listening
    : isSpeaking
      ? assistantLocale.voice.stateLabels.speaking
      : isProcessing
        ? assistantLocale.voice.stateLabels.processing
        : isError
          ? assistantLocale.voice.stateLabels.error
          : assistantLocale.voice.stateLabels.idle;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-36 left-4 z-50 w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100">
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-700 p-5">
        <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-8 h-16 w-16 translate-y-1/2 rounded-full bg-white/5" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight text-white">
                {assistantLocale.voice.panelTitle}
              </h3>
              <p className="text-xs text-purple-200">{assistantLocale.voice.panelSubtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label={t.common.close}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="relative mt-4 flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${stateIndicatorClass}`} />
          <span className="text-sm font-medium text-white/80">{stateLabel}</span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        {transcript ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {assistantLocale.voice.transcriptLabel}
            </p>
            <p className="text-lg font-medium leading-snug text-slate-900 dark:text-white">
              "{transcript}"
            </p>
          </div>
        ) : null}

        {response ? (
          <div
            className={`rounded-2xl border p-4 ${
              isError
                ? 'border-red-200 bg-red-50 text-slate-900 dark:border-red-700/50 dark:bg-red-900/30 dark:text-white'
                : 'border-violet-200 bg-violet-50 text-slate-900 dark:border-violet-700/50 dark:bg-violet-900/30 dark:text-white'
            }`}
          >
            <p
              className={`mb-1 text-xs font-semibold uppercase tracking-wide ${
                isError ? 'text-red-500 dark:text-red-400' : 'text-violet-600 dark:text-violet-400'
              }`}
            >
              {isError ? assistantLocale.voice.errorLabel : assistantLocale.voice.responseLabel}
            </p>
            <p className="text-base font-medium leading-relaxed">{response}</p>
          </div>
        ) : null}

        {matchedIntent && (isSpeaking || state === 'idle') ? (
          <button
            type="button"
            onClick={handleNavigate}
            className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 p-4 text-base font-semibold text-white shadow-lg shadow-purple-500/30 transition-shadow hover:shadow-purple-500/50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                <matchedIntent.icon className="h-5 w-5 text-white" />
              </div>
              <span>{matchedIntent.label}</span>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-white/70" />
          </button>
        ) : null}

        {!transcript && !response && state === 'idle' ? (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {assistantLocale.voice.quickSuggestionsLabel}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickSuggestions.map((suggestion) => (
                <button
                  key={suggestion.label}
                  type="button"
                  onClick={() => handleQuickSuggestion(suggestion.query)}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left text-slate-700 transition-all hover:border-violet-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-violet-500/50"
                >
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-500/20">
                    <suggestion.icon className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <span className="text-xs font-medium leading-tight">{suggestion.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 px-5 pb-5">
        <button
          type="button"
          onClick={() => setIsMuted((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-500 transition-all hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
          title={isMuted ? assistantLocale.voice.unmuteLabel : assistantLocale.voice.muteLabel}
        >
          {isMuted ? <VolumeXIcon className="h-5 w-5" /> : <Volume2Icon className="h-5 w-5" />}
        </button>

        <button
          type="button"
          onClick={handleMicPress}
          className={`relative flex h-14 flex-1 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r font-bold text-white shadow-lg transition-all ${micButtonGradientClass}`}
        >
          {isListening ? <span className="absolute inset-0 bg-white/10 animate-pulse" /> : null}
          {isListening ? (
            <div className="relative z-10 flex items-center gap-3">
              <WaveformBars active={true} />
              <span className="text-sm">{assistantLocale.voice.stopLabel}</span>
            </div>
          ) : isSpeaking ? (
            <div className="relative z-10 flex items-center gap-3">
              <WaveformBars active={true} />
              <span className="text-sm">{assistantLocale.voice.speakingActionLabel}</span>
            </div>
          ) : isProcessing ? (
            <div className="relative z-10 h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <div className="relative z-10 flex items-center gap-3">
              <MicIcon className="h-5 w-5" />
              <span className="text-sm">{assistantLocale.voice.speakAgainLabel}</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
