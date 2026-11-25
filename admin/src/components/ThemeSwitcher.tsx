import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
export function ThemeSwitcher() {
  const { theme, toggleTheme, isDark } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-9 h-9 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-lg hover:border-cyan-500/50 hover:bg-slate-700/80 transition-all group relative overflow-hidden"
      title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}>
      
      <div className="relative w-5 h-5">
        <Sun
          className={`h-5 w-5 text-amber-400 absolute inset-0 transition-all duration-500 ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
        
        <Moon
          className={`h-5 w-5 text-cyan-400 absolute inset-0 transition-all duration-500 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
        
      </div>

      {/* Cyber glow effect on hover */}
      <div className="absolute inset-0 rounded-lg bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-colors pointer-events-none"></div>
    </button>);

}