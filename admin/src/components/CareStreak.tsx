import React from 'react';
import { Flame } from 'lucide-react';
interface CareStreakProps {
  days: number;
  label?: string;
}
export function CareStreak({
  days,
  label = 'Jours de suivi'
}: CareStreakProps) {
  // Calculate circle circumference for SVG animation
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(days / 30, 1); // Cap at 30 days for visual loop
  const strokeDashoffset = circumference - progress * circumference;
  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-gray-100" />
          
          {/* Progress Circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-rose-500 transition-all duration-1000 ease-out" />
          
        </svg>

        {/* Center Content */}
        <div className="absolute flex flex-col items-center">
          <Flame
            className={`h-6 w-6 ${days > 0 ? 'text-rose-500 fill-rose-500' : 'text-gray-300'}`} />
          
          <span className="text-xl font-bold text-gray-900">{days}</span>
        </div>
      </div>

      <p className="mt-2 text-sm font-medium text-gray-600">{label}</p>
      <p className="text-xs text-teal-600 font-medium mt-1">
        {days > 3 ? 'Excellent travail !' : 'Continuez ainsi !'}
      </p>
    </div>);

}