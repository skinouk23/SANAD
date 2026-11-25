import React, { useState } from 'react';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp } from
'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
interface PendingValidation {
  id: string;
  providerName: string;
  providerImage: string;
  serviceName: string;
  amount: number;
  date: string;
  time: string;
  hoursAgo: number;
  autoValidationIn: string;
}
interface PendingValidationCardProps {
  validation: PendingValidation;
  onValidate: (id: string) => void;
  onReportIssue: (id: string) => void;
}
export function PendingValidationCard({
  validation,
  onValidate,
  onReportIssue
}: PendingValidationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const getUrgencyColor = () => {
    if (validation.hoursAgo > 24) return 'border-red-300 bg-red-50';
    if (validation.hoursAgo > 6) return 'border-amber-300 bg-amber-50';
    return 'border-blue-300 bg-blue-50';
  };
  const getUrgencyIcon = () => {
    if (validation.hoursAgo > 24)
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
    if (validation.hoursAgo > 6)
    return <Clock className="h-5 w-5 text-amber-600" />;
    return <Clock className="h-5 w-5 text-blue-600" />;
  };
  return (
    <Card className={`border-2 ${getUrgencyColor()} transition-all`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
          {validation.providerImage}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {getUrgencyIcon()}
                <h3 className="font-bold text-gray-900">
                  En attente de validation
                </h3>
              </div>
              <p className="text-sm text-gray-700 font-semibold">
                {validation.providerName}
              </p>
              <p className="text-sm text-gray-600">{validation.serviceName}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-lg font-bold text-gray-900">
                {validation.amount} TND
              </p>
              <p className="text-xs text-gray-500">{validation.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all ${validation.hoursAgo > 24 ? 'bg-red-600' : validation.hoursAgo > 6 ? 'bg-amber-600' : 'bg-blue-600'}`}
                style={{
                  width: `${Math.min(validation.hoursAgo / 48 * 100, 100)}%`
                }}>
              </div>
            </div>
            <p className="text-xs text-gray-600 whitespace-nowrap">
              {validation.hoursAgo}h écoulées
            </p>
          </div>

          {validation.hoursAgo > 24 &&
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-sm text-red-800 font-medium">
                ⚠️ Validation urgente requise ! Auto-validation dans{' '}
                {validation.autoValidationIn}
              </p>
            </div>
          }

          <div className="flex gap-2 mb-3">
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => onValidate(validation.id)}>
              
              <CheckCircle className="h-4 w-4 mr-2" />
              Oui, tout s'est bien passé
            </Button>
            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => onReportIssue(validation.id)}>
              
              <AlertTriangle className="h-4 w-4 mr-2" />
              Signaler un problème
            </Button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            
            {isExpanded ?
            <>
                <ChevronUp className="h-4 w-4" />
                Masquer les détails
              </> :

            <>
                <ChevronDown className="h-4 w-4" />
                Voir les détails
              </>
            }
          </button>

          {isExpanded &&
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Date du service</p>
                  <p className="font-semibold text-gray-900">
                    {validation.date} à {validation.time}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Montant</p>
                  <p className="font-semibold text-gray-900">
                    {validation.amount} TND
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-700">
                  <strong>💡 Pourquoi valider ?</strong>
                  <br />
                  Votre validation permet au professionnel de recevoir son
                  paiement. Si vous ne validez pas sous 48h, le service sera
                  automatiquement validé (sauf si vous signalez un problème).
                </p>
              </div>
            </div>
          }
        </div>
      </div>
    </Card>);

}