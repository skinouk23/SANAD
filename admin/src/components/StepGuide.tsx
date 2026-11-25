import React from 'react';
import { Card } from './ui/Card';
import { BoxIcon } from 'lucide-react';
interface Step {
  number: number;
  title: string;
  description: string;
  icon: BoxIcon;
}
interface StepGuideProps {
  steps: Step[];
}
export function StepGuide({ steps }: StepGuideProps) {
  return (
    <div className="relative">
      {/* Connector line (desktop) */}
      <div
        className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-200 via-teal-300 to-teal-200 -z-10"
        style={{
          left: '10%',
          right: '10%'
        }} />
      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) =>
        <div
          key={step.number}
          className="flex flex-col items-center text-center">
          
            {/* Step number circle */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-200/50 relative z-10">
                <span className="text-2xl font-bold text-white">
                  {step.number}
                </span>
              </div>
              <div className="absolute inset-0 w-20 h-20 rounded-full bg-teal-100 animate-ping opacity-20" />
            </div>

            {/* Icon */}
            <div className="w-16 h-16 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
              <step.icon className="h-8 w-8 text-teal-600" />
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {step.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">{step.description}</p>
          </div>
        )}
      </div>
    </div>);

}