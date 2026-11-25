import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Heart,
  Menu,
  X,
  User,
  Bell,
  Activity,
  Settings,
  Check,
  Clock,
  AlertCircle,
  LogOut,
  Shield,
  HelpCircle,
  ChevronRight } from
'lucide-react';
import { Button } from './ui/Button';
import { NotificationsPanel } from './NotificationsPanel';
import { useAuth } from '../contexts/AuthContext';
export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const settingsRef = useRef<HTMLDivElement>(null);
  // Use auth context instead of pathname check
  const isLoggedIn = isAuthenticated;
  const isPatient = user?.role === 'patient';
  const isProvider = user?.role === 'provider';
  const isAdmin = user?.role === 'admin';
  // Close settings dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
      settingsRef.current &&
      !settingsRef.current.contains(event.target as Node))
      {
        setShowSettings(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-teal-50 p-2 rounded-full group-hover:bg-teal-100 transition-colors">
                <Heart className="h-6 w-6 text-teal-600 fill-teal-600" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Care@Home <span className="text-teal-600">Tunisia</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Patient & Public Navigation */}
              {!isProvider && !isAdmin &&
              <>
                  <Link
                  to="/services"
                  className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
                  
                    Nos Services
                  </Link>
                  <Link
                  to="/equipment"
                  className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
                  
                    Location Matériel
                  </Link>
                  <Link
                  to="/how-it-works"
                  className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
                  
                    Comment ça marche
                  </Link>
                </>
              }

              {/* Provider Navigation */}
              {isProvider &&
              <>
                  <Link
                  to="/provider/transactions"
                  className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
                  
                    Mes Transactions
                  </Link>
                  <Link
                  to="/provider/services"
                  className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
                  
                    Mes Services
                  </Link>
                  <Link
                  to="/provider/schedule"
                  className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
                  
                    Mon Agenda
                  </Link>
                  <Link
                  to="/provider/analytics"
                  className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
                  
                    Statistiques
                  </Link>
                </>
              }

              {/* Hide Espace Pro for patients */}
              {!isPatient && !isProvider && !isAdmin &&
              <Link
                to="/provider-dashboard"
                className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
                
                  Espace Pro
                </Link>
              }

              {isLoggedIn ?
              <div className="flex items-center gap-3">
                  {/* Health Icon */}
                  <Link
                  to="/health"
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors group"
                  title="Suivi Santé">
                  
                    <Activity className="h-5 w-5 text-gray-600 group-hover:text-teal-600 transition-colors" />
                  </Link>

                  {/* Notification Button */}
                  <button
                  onClick={() => setShowNotifications(true)}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors group"
                  title="Notifications">
                  
                    <Bell className="h-5 w-5 text-gray-600 group-hover:text-teal-600 transition-colors" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  {/* Settings Dropdown */}
                  <div className="relative" ref={settingsRef}>
                    <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
                    title="Paramètres">
                    
                      <Settings className="h-5 w-5 text-gray-600 group-hover:text-teal-600 transition-colors" />
                    </button>

                    {showSettings &&
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                          <h3 className="font-bold text-gray-900">
                            Paramètres
                          </h3>
                        </div>
                        <div className="py-2">
                          <button
                        onClick={() => {
                          navigate('/patient-dashboard');
                          setShowSettings(false);
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                        
                            <User className="h-5 w-5 text-gray-600" />
                            <span className="text-sm text-gray-700">
                              Mon profil
                            </span>
                            <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                          </button>
                          <button
                        onClick={() => {
                          navigate('/health/nutrition/profile');
                          setShowSettings(false);
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                        
                            <Activity className="h-5 w-5 text-gray-600" />
                            <span className="text-sm text-gray-700">
                              Profil santé
                            </span>
                            <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                          </button>
                          <button
                        onClick={() => {
                          setShowNotifications(true);
                          setShowSettings(false);
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                        
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span className="text-sm text-gray-700">
                              Notifications
                            </span>
                            <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                          </button>
                          <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                            <Shield className="h-5 w-5 text-gray-600" />
                            <span className="text-sm text-gray-700">
                              Confidentialité
                            </span>
                            <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                          </button>
                          <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                            <HelpCircle className="h-5 w-5 text-gray-600" />
                            <span className="text-sm text-gray-700">
                              Aide & Support
                            </span>
                            <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                          </button>
                        </div>
                        <div className="border-t border-gray-100 py-2">
                          <button
                        onClick={() => {
                          logout();
                          navigate('/auth/onboarding');
                          setShowSettings(false);
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-left">
                        
                            <LogOut className="h-5 w-5 text-red-600" />
                            <span className="text-sm text-red-600 font-medium">
                              Déconnexion
                            </span>
                          </button>
                        </div>
                      </div>
                  }
                  </div>

                  {/* User Profile Button */}
                  <Link
                  to={
                  isProvider ? '/provider-dashboard' : '/patient-dashboard'
                  }>
                  
                    <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2">
                    
                      <User className="h-4 w-4" />
                      {isProvider ? 'Mon Dashboard' : 'Mon Espace'}
                    </Button>
                  </Link>
                </div> :

              <div className="flex items-center gap-3">
                  {/* Health Icon */}
                  <Link
                  to="/health"
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors group"
                  title="Suivi Santé">
                  
                    <Activity className="h-5 w-5 text-gray-600 group-hover:text-teal-600 transition-colors" />
                  </Link>

                  {/* Notification Icon (disabled when not logged in) */}
                  <button
                  onClick={() => navigate('/auth/login')}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors group"
                  title="Notifications (connexion requise)">
                  
                    <Bell className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </button>

                  {/* Settings Icon (disabled when not logged in) */}
                  <button
                  onClick={() => navigate('/auth/login')}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
                  title="Paramètres (connexion requise)">
                  
                    <Settings className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </button>

                  {/* Login/Signup Button */}
                  <Link to="/auth/onboarding">
                    <Button variant="primary" size="md">
                      Se connecter
                    </Button>
                  </Link>
                </div>
              }
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              {isLoggedIn &&
              <>
                  <Link
                  to="/health"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  
                    <Activity className="h-5 w-5 text-gray-600" />
                  </Link>
                  <button
                  onClick={() => setShowNotifications(true)}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                  
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                </>
              }
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                aria-label="Menu principal">
                
                {isOpen ?
                <X className="h-6 w-6" /> :

                <Menu className="h-6 w-6" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen &&
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {/* Patient & Public Navigation */}
              {!isProvider && !isAdmin &&
            <>
                  <Link
                to="/services"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                onClick={() => setIsOpen(false)}>
                
                    Nos Services
                  </Link>
                  <Link
                to="/equipment"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                onClick={() => setIsOpen(false)}>
                
                    Location Matériel
                  </Link>
                  <Link
                to="/how-it-works"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                onClick={() => setIsOpen(false)}>
                
                    Comment ça marche
                  </Link>
                </>
            }

              {/* Provider Navigation */}
              {isProvider &&
            <>
                  <Link
                to="/provider/transactions"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                onClick={() => setIsOpen(false)}>
                
                    Mes Transactions
                  </Link>
                  <Link
                to="/provider/services"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                onClick={() => setIsOpen(false)}>
                
                    Mes Services
                  </Link>
                  <Link
                to="/provider/schedule"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                onClick={() => setIsOpen(false)}>
                
                    Mon Agenda
                  </Link>
                  <Link
                to="/provider/analytics"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                onClick={() => setIsOpen(false)}>
                
                    Statistiques
                  </Link>
                </>
            }

              {!isPatient && !isProvider && !isAdmin &&
            <Link
              to="/provider-dashboard"
              className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50"
              onClick={() => setIsOpen(false)}>
              
                  Espace Pro
                </Link>
            }

              {isLoggedIn &&
            <>
                  <Link
                to="/health"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                onClick={() => setIsOpen(false)}>
                
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Suivi Santé
                    </div>
                  </Link>
                  <button
                onClick={() => {
                  setShowNotifications(true);
                  setIsOpen(false);
                }}
                className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50">
                
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </div>
                  </button>
                  <Link
                to="/patient-dashboard"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                onClick={() => setIsOpen(false)}>
                
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Mon Espace
                    </div>
                  </Link>
                  <button
                onClick={() => {
                  logout();
                  navigate('/auth/onboarding');
                  setIsOpen(false);
                }}
                className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                
                    <div className="flex items-center gap-2">
                      <LogOut className="h-5 w-5" />
                      Déconnexion
                    </div>
                  </button>
                </>
            }

              {!isLoggedIn &&
            <div className="pt-4">
                  <Link to="/services" onClick={() => setIsOpen(false)}>
                    <Button fullWidth>Trouver un soignant</Button>
                  </Link>
                </div>
            }
            </div>
          </div>
        }
      </nav>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)} />
      
    </>);

}