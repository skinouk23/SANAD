import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Stethoscope,
  Baby,
  Heart,
  Activity,
  Pill,
  Syringe,
  Thermometer,
  UserCheck,
  Grid3x3,
  HeartPulse,
  Users,
  Dumbbell,
  Ambulance,
  Home,
  Calendar,
  HandHeart,
  UtensilsCrossed,
  Brain,
  FlaskConical,
  Scan,
  Trophy } from
'lucide-react';
import { ServiceCard } from '../components/ServiceCard';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import {
  useServicesList,
  useServiceFilters } from
'../hooks/useServiceSelection';
export function ServiceSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  // Hook-based data fetching
  const { data: services } = useServicesList();
  const { data: filters } = useServiceFilters();
  const safeServices = services ?? [];
  const safeFilters = filters ?? [];
  const handleServiceSelect = (serviceId: string) => {
    // Check if user is logged in before allowing booking
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate('/auth/login', {
        state: {
          returnTo: location.pathname,
          serviceId
        }
      });
      return;
    }
    // Route to specific pages for new services
    if (serviceId === 'laboratory') {
      navigate('/laboratory');
      return;
    }
    if (serviceId === 'radiology') {
      navigate('/radiology');
      return;
    }
    if (serviceId === 'gym') {
      navigate('/gym');
      return;
    }
    if (serviceId === 'nutrition') {
      navigate('/nutrition-providers');
      return;
    }
    if (serviceId === 'ambulance') {
      navigate('/ambulance');
      return;
    }
    // Route to care services
    const careServices = [
    'nursing',
    'elderly',
    'physio',
    'maternity',
    'checkup',
    'night',
    'doctor-home',
    'chronic-care',
    'psychology',
    'medical-companion'];

    if (careServices.includes(serviceId)) {
      navigate(`/care/${serviceId}`);
      return;
    }
    // Default: go to match page
    navigate('/match');
  };
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            De quel soin avez-vous besoin ?
          </h1>
          <p className="text-gray-600">
            Sélectionnez une catégorie pour trouver le spécialiste adapté.
          </p>
        </div>

        {/* Filters - Icons on mobile, text on desktop */}
        <div className="flex justify-center mb-12 gap-2 overflow-x-auto pb-4">
          {safeFilters.map((filter, index) =>
          <Button
            key={filter.id}
            variant={index === 0 ? 'primary' : 'outline'}
            size="sm"
            className={`rounded-full ${index === 0 ? '' : 'bg-white border-gray-200'}`}>
            
              {/* Icon only on mobile */}
              <filter.icon className="h-4 w-4 md:mr-2" />
              {/* Text hidden on mobile, visible on desktop */}
              <span className="hidden md:inline">{filter.label}</span>
            </Button>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeServices.map((service) =>
          <ServiceCard
            key={service.id}
            title={service.title}
            description={service.desc}
            price={service.price}
            icon={service.icon}
            color={service.color}
            badge={service.badge}
            popular={service.popular}
            recurring={service.recurring}
            onClick={() => handleServiceSelect(service.id)} />

          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Vous ne trouvez pas ce que vous cherchez ?{' '}
            <a href="#" className="text-teal-600 font-semibold underline">
              Contactez-nous
            </a>
          </p>
        </div>
      </div>
    </div>);

}