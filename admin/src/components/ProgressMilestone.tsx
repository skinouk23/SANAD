import React from 'react';
import { Trophy, Check } from 'lucide-react';
import { Card } from './ui/Card';
interface ProgressMilestoneProps {
  title: string;
  progress: number;
  total: number;
  icon?: React.ReactNode;
}
export function ProgressMilestone({
  title,
  progress,
  total,
  icon
}: ProgressMilestoneProps) {
  const percentage = Math.min(progress / total * 100, 100);
  const isComplete = percentage === 100;
  return (
    <Card className="relative overflow-hidden" padding="sm">
      {isComplete &&
      <div className="absolute top-0 right-0 p-2">
          <Trophy className="h-5 w-5 text-amber-400 fill-amber-400 animate-bounce" />
        </div>
      }

      <div className="flex items-center gap-3 mb-3">
        <div
          className={`p-2 rounded-lg ${isComplete ? 'bg-emerald-100 text-emerald-600' : 'bg-teal-50 text-teal-600'}`}>
          
          {icon || <Check className="h-5 w-5" />}
        </div>
        <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
      </div>

      <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${isComplete ? 'bg-emerald-500' : 'bg-teal-500'}`}
          style={{
            width: `${percentage}%`
          }} />
        
      </div>

      <div className="flex justify-between mt-2 text-xs font-medium text-gray-500">
        <span>{progress} complétés</span>
        <span>Objectif: {total}</span>
      </div>
    </Card>);

}