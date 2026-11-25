import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import { useLanguage } from '@/shared/lib/i18n/language-context';
import { languages } from '@/shared/lib/i18n/languages';
import { cn } from '@/shared/lib/utils';
import type { LanguageCode } from '@/shared/lib/i18n/languages';

function MiniFlag({ colors, shortCode }: { colors: string[]; shortCode: string }) {
  return (
    <div className="relative h-4 w-6 flex-shrink-0 overflow-hidden rounded-sm border border-white/15">
      <div className="absolute inset-0 flex">
        <div className="flex-1" style={{ backgroundColor: colors[0] }} />
        <div className="flex-1" style={{ backgroundColor: colors[1] }} />
      </div>
      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white">
        {shortCode}
      </span>
    </div>
  );
}

export function LanguageSelector() {
  const { currentLanguage, dir, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isRTL = dir === 'rtl';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative z-50">
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t.common.selectLanguage}
        className="group relative flex items-center gap-1.5 rounded-lg border border-border bg-card px-2 py-1.5 text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        type="button"
        onClick={() => setIsOpen((currentOpenState) => !currentOpenState)}
      >
        <MiniFlag colors={currentLanguage.colors} shortCode={currentLanguage.shortCode} />

        <ChevronDown
          className={cn(
            'h-3 w-3 text-muted-foreground transition-transform group-hover:text-accent-foreground',
            isOpen && 'rotate-180',
          )}
        />

        <div className="pointer-events-none absolute inset-0 rounded-lg transition-colors" />
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="language-selector-menu"
            aria-hidden={!isOpen}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn('absolute mt-2 w-44 origin-top-right', isRTL ? 'left-0' : 'right-0')}
          >
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-sm" />
              <div className="relative overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl shadow-black/10">
                <div className="h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500" />

                <div className="p-1" role="listbox" aria-label={t.common.selectLanguage}>
                  {languages.map((language, index) => {
                    const isSelected = currentLanguage.code === language.code;

                    return (
                      <motion.button
                        key={language.code}
                        aria-selected={isSelected}
                        initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={cn(
                          'flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors',
                          isSelected
                            ? 'border-border bg-accent text-accent-foreground'
                            : 'border-transparent text-popover-foreground hover:bg-accent hover:text-accent-foreground',
                        )}
                        role="option"
                        type="button"
                        onClick={() => handleSelect(language.code)}
                      >
                        <MiniFlag colors={language.colors} shortCode={language.shortCode} />
                        <span>{language.name}</span>

                        {isSelected ? (
                          <motion.div
                            layoutId="selectedLanguageIndicator"
                            className={cn(
                              'h-1.5 w-1.5 rounded-full bg-primary',
                              isRTL ? 'mr-auto' : 'ml-auto',
                            )}
                          />
                        ) : null}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="border-t border-border px-3 py-1.5">
                  <p className="text-center text-[9px] uppercase tracking-wider text-muted-foreground">
                    {t.common.selectLanguage}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
