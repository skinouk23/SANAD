import React from 'react';
import { ArrowRight, BoxIcon, Star, Repeat } from 'lucide-react';
import { Card } from './ui/Card';
interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  icon: BoxIcon;
  onClick: () => void;
  color?: 'teal' | 'rose' | 'blue' | 'amber' | 'red' | 'purple';
  badge?: string;
  popular?: boolean;
  recurring?: boolean;
}
export function ServiceCard({
  title,
  description,
  price,
  icon: Icon,
  onClick,
  color = 'teal',
  badge,
  popular,
  recurring
}: ServiceCardProps) {
  const colorStyles = {
    teal: 'bg-teal-50 text-teal-600',
    rose: 'bg-rose-50 text-rose-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600'
  };
  const badgeStyles = {
    Premium: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white',
    Vérifié: 'bg-blue-500 text-white',
    Abonnement: 'bg-purple-500 text-white'
  };
  return (
    <Card
      hover
      onClick={onClick}
      className="h-full flex flex-col group relative overflow-hidden">
      
      {/* Background decoration */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-20 transition-transform group-hover:scale-150 ${colorStyles[color].split(' ')[0]}`} />
      

      {/* Popular badge */}
      {popular &&
      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg">
          <Star className="h-3 w-3 fill-white" />
          Populaire
        </div>
      }

      {/* Badge */}
      {badge && !popular &&
      <div
        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-md ${badgeStyles[badge as keyof typeof badgeStyles] || 'bg-gray-500 text-white'}`}>
        
          {badge}
        </div>
      }

      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${colorStyles[color]}`}>
        
        <Icon className="h-7 w-7" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 mb-6 flex-grow leading-relaxed text-sm">
        {description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 mb-1">
            {recurring ? 'Dès' : 'À partir de'}
          </span>
          <span className="text-gray-900 font-bold text-lg flex items-center gap-1">
            {price}
            {recurring && <Repeat className="h-4 w-4 text-purple-600" />}
          </span>
        </div>

        <div className="flex items-center text-teal-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
          Choisir
          <ArrowRight className="ml-1 h-4 w-4" />
        </div>
      </div>
    </Card>);

}