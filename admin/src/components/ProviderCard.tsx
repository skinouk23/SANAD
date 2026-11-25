import React from 'react';
import { MapPin, Star, Calendar } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { TrustBadge } from './TrustBadge';
interface ProviderCardProps {
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  distance: string;
  imageUrl: string;
  badges?: ('verified' | 'experienced' | 'rated')[];
  availability: 'today' | 'tomorrow';
  onSelect: () => void;
}
export function ProviderCard({
  name,
  specialty,
  rating,
  reviewCount,
  distance,
  imageUrl,
  badges = ['verified'],
  availability,
  onSelect
}: ProviderCardProps) {
  return (
    <Card className="flex flex-col sm:flex-row gap-6" hover>
      {/* Avatar Section */}
      <div className="flex-shrink-0 flex flex-col items-center sm:items-start">
        <div className="relative">
          <img
            src={imageUrl}
            alt={name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
          
          <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm">
            <div
              className={`w-3 h-3 rounded-full ${availability === 'today' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            
          </div>
        </div>
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <MapPin className="h-3 w-3 mr-1" />
          {distance}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-grow text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{name}</h3>
            <p className="text-teal-600 font-medium">{specialty}</p>
          </div>
          <div className="flex items-center justify-center sm:justify-end mt-2 sm:mt-0 bg-amber-50 px-2 py-1 rounded-lg">
            <Star className="h-4 w-4 text-amber-400 fill-amber-400 mr-1" />
            <span className="font-bold text-gray-900">{rating}</span>
            <span className="text-gray-500 text-xs ml-1">({reviewCount})</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
          {badges.map((badge) =>
          <TrustBadge key={badge} type={badge} />
          )}
        </div>

        {/* Availability & Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-50 gap-4">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <span
              className={
              availability === 'today' ?
              'text-emerald-600 font-medium' :
              'text-amber-600 font-medium'
              }>
              
              {availability === 'today' ?
              "Disponible aujourd'hui" :
              'Disponible demain'}
            </span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              Profil
            </Button>
            <Button
              onClick={onSelect}
              variant="primary"
              size="sm"
              className="flex-1 sm:flex-none">
              
              Réserver
            </Button>
          </div>
        </div>
      </div>
    </Card>);

}