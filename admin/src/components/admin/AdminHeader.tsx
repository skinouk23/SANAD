import React from 'react';
import { Bell, Search, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
export function AdminHeader() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shrink-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Global search..."
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 border-transparent rounded-md focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all" />
          
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="hidden md:block text-xs">
            <p className="font-medium text-slate-700 dark:text-slate-200">
              {user?.name || 'Admin'}
            </p>
            <p className="text-slate-500 dark:text-slate-400">Super Admin</p>
          </div>
          <button
            onClick={logout}
            className="ml-2 p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Logout">
            
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>);

}