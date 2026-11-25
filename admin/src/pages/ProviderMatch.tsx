import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles } from 'lucide-react';
import { ProviderCard } from '../components/ProviderCard';
import { Button } from '../components/ui/Button';
export function ProviderMatch() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  // Simulate AI matching delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  const handleSelect = () => {
    navigate('/booking');
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-teal-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Recherche des meilleurs profils...
          </h2>
          <p className="text-gray-600">
            Notre IA analyse la disponibilité, la proximité et les compétences
            pour votre demande.
          </p>
        </div>
      </div>);

  }
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              Recommandé par IA
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Les meilleurs soignants pour vous
          </h1>
          <p className="text-gray-600 mt-2">
            Sélectionnés sur la base de votre localisation (Tunis) et du service
            demandé (Soins Infirmiers).
          </p>
        </div>

        <div className="space-y-6">
          <ProviderCard
            name="Amel Ben Youssef"
            specialty="Infirmière Diplômée d'État"
            rating={4.9}
            reviewCount={124}
            distance="0.8 km"
            imageUrl="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300"
            badges={['verified', 'experienced', 'rated']}
            availability="today"
            onSelect={handleSelect} />
          

          <ProviderCard
            name="Karim Dridi"
            specialty="Infirmier Urgences & Soins Intensifs"
            rating={4.8}
            reviewCount={89}
            distance="1.2 km"
            imageUrl="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300"
            badges={['verified', 'experienced']}
            availability="today"
            onSelect={handleSelect} />
          

          <ProviderCard
            name="Leila Mansour"
            specialty="Infirmière Pédiatrique"
            rating={5.0}
            reviewCount={42}
            distance="2.5 km"
            imageUrl="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300"
            badges={['verified']}
            availability="tomorrow"
            onSelect={handleSelect} />
          
        </div>

        <div className="mt-8 text-center">
          <Button variant="ghost">Voir plus de soignants</Button>
        </div>
      </div>
    </div>);

}