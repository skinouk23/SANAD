import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { MicIcon, XIcon } from 'lucide-react';

import { getAssistantLocale } from '@/features/assistant/assistant-locale';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/shared/lib/i18n/language-context';

const LazyVoiceAssistantPanel = lazy(() =>
  import('./VoiceAssistantPanel').then((module) => ({
    default: module.VoiceAssistantPanel,
  })),
);

export function VoiceAssistant() {
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const [hasActivated, setHasActivated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [autoStartRequest, setAutoStartRequest] = useState(0);
  const assistantLocale = useMemo(
    () => getAssistantLocale(currentLanguage.code),
    [currentLanguage.code],
  );

  const isPatient = user?.role === 'patient';

  const handleToggle = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    setHasActivated(true);
    setIsOpen(true);
    setAutoStartRequest((current) => current + 1);
  }, [isOpen]);

  if (!isPatient) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-24 left-4 z-50 flex flex-col items-center gap-1.5">
        {!isOpen ? (
          <div className="pointer-events-none rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {assistantLocale.voice.triggerLabel}
          </div>
        ) : null}

        <div className="relative">
          <button
            type="button"
            onClick={handleToggle}
            aria-label={isOpen ? assistantLocale.voice.closeLabel : assistantLocale.voice.openLabel}
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-xl shadow-violet-500/50 transition-all hover:scale-110 active:scale-95"
          >
            {isOpen ? <XIcon className="h-5 w-5" /> : <MicIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {hasActivated ? (
        <Suspense fallback={null}>
          <LazyVoiceAssistantPanel
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            autoStartRequest={autoStartRequest}
          />
        </Suspense>
      ) : null}
    </>
  );
}
