import React from 'react';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
interface EquipmentCardProps {
  name: string;
  category: string;
  pricePerDay: number;
  imageUrl: string;
  provider: string;
  location: string;
  available: boolean;
  onClick: () => void;
}
export function EquipmentCard({
  name,
  category,
  pricePerDay,
  imageUrl,
  provider,
  location,
  available,
  onClick
}: EquipmentCardProps) {
  return (
    <Card hover onClick={onClick} className="flex flex-col h-full">
      {/* Image */}
      <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl bg-gray-100">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        {!available &&
        <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
            <Badge variant="gray" className="bg-white text-gray-900">
              Non disponible
            </Badge>
          </div>
        }
        <div className="absolute top-3 right-3">
          <Badge variant="teal" className="bg-white/90 backdrop-blur-sm">
            {category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            {provider} • {location}
          </div>
          {available &&
          <div className="flex items-center text-emerald-600">
              <Calendar className="h-4 w-4 mr-2" />
              Disponible maintenant
            </div>
          }
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
        <div>
          <span className="text-2xl font-bold text-teal-600">
            {pricePerDay} TND
          </span>
          <span className="text-sm text-gray-500 ml-1">/jour</span>
        </div>
        <Button
          variant="primary"
          size="sm"
          disabled={!available}
          className="flex items-center gap-1">
          
          Réserver
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>);

}