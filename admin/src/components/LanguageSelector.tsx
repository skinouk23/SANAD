import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
  useLanguage,
  languages,
  LanguageCode } from
'../contexts/LanguageContext';
// Mini flag component with country colors
function MiniFlag({
  colors,
  shortCode



}: {colors: string[];shortCode: string;}) {
  return (
    <div className="relative w-6 h-4 rounded-sm overflow-hidden border border-slate-600/50 flex-shrink-0">
      <div className="absolute inset-0 flex">
        <div
          className="flex-1"
          style={{
            backgroundColor: colors[0]
          }}>
        </div>
        <div
          className="flex-1"
          style={{
            backgroundColor: colors[1]
          }}>
        </div>
      </div>
      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
        {shortCode}
      </span>
    </div>);

}
export function LanguageSelector() {
  const { currentLanguage, setLanguage, t, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isRTL = dir === 'rtl';
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node))
      {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };
  return (
    <div ref={dropdownRef} className="relative z-50">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-lg hover:border-cyan-500/50 hover:bg-slate-700/80 transition-all group">
        
        <MiniFlag
          colors={currentLanguage.colors}
          shortCode={currentLanguage.shortCode} />
        
        <ChevronDown
          className={`h-3 w-3 text-white group-hover:text-cyan-400 transition-all ${isOpen ? 'rotate-180' : ''}`} />
        

        {/* Cyber glow effect on hover */}
        <div className="absolute inset-0 rounded-lg bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-colors pointer-events-none"></div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen &&
        <motion.div
          initial={{
            opacity: 0,
            y: -8,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            y: -8,
            scale: 0.95
          }}
          transition={{
            duration: 0.15,
            ease: 'easeOut'
          }}
          className={`absolute mt-2 w-44 origin-top-right ${isRTL ? 'left-0' : 'right-0'}`}>
          
            {/* Cyber border effect */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-sm"></div>

              {/* Main dropdown */}
              <div className="relative bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden shadow-xl shadow-black/20">
                {/* Header accent line */}
                <div className="h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500"></div>

                <div className="p-1">
                  {languages.map((language, index) =>
                <motion.button
                  key={language.code}
                  initial={{
                    opacity: 0,
                    x: isRTL ? 10 : -10
                  }}
                  animate={{
                    opacity: 1,
                    x: 0
                  }}
                  transition={{
                    delay: index * 0.03
                  }}
                  onClick={() => handleSelect(language.code)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${currentLanguage.code === language.code ? 'bg-cyan-500/20 border border-cyan-500/30' : 'hover:bg-slate-700/50 border border-transparent'}`}>
                  
                      <MiniFlag
                    colors={language.colors}
                    shortCode={language.shortCode} />
                  
                      <span
                    className={`text-xs font-medium ${currentLanguage.code === language.code ? 'text-cyan-400' : 'text-white'}`}>
                    
                        {language.name}
                      </span>

                      {/* Selected indicator */}
                      {currentLanguage.code === language.code &&
                  <motion.div
                    layoutId="selectedIndicator"
                    className={`w-1.5 h-1.5 rounded-full bg-cyan-400 ${isRTL ? 'mr-auto' : 'ml-auto'}`} />

                  }
                    </motion.button>
                )}
                </div>

                {/* Footer accent */}
                <div className="px-3 py-1.5 border-t border-slate-700/50 bg-slate-900/50">
                  <p className="text-[9px] text-slate-400 text-center uppercase tracking-wider">
                    {t.common.selectLanguage}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}