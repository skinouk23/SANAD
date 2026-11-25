import React, { useEffect, useState } from 'react';
import { CheckCircle, Copy, Check, Clock, AlertCircle } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
interface ProviderValidationCodeProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: string;
    patientName: string;
    serviceName: string;
    amount: number;
    duration: string;
  };
  validationCode: string;
}
export function ProviderValidationCode({
  isOpen,
  onClose,
  appointment,
  validationCode
}: ProviderValidationCodeProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);
  const handleCopy = () => {
    navigator.clipboard.writeText(validationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    return `${hours}h ${minutes}min`;
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Service terminé !
          </h2>
          <p className="text-gray-600">Demandez au patient de valider</p>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            <div>
              <p className="text-gray-600">Patient</p>
              <p className="font-semibold text-gray-900">
                {appointment.patientName}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Service</p>
              <p className="font-semibold text-gray-900">
                {appointment.serviceName}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Durée</p>
              <p className="font-semibold text-gray-900">
                {appointment.duration}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Montant</p>
              <p className="font-semibold text-gray-900">
                {appointment.amount} TND
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-900 mb-3 text-center">
            Code de validation patient :
          </p>

          <div className="relative">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 text-center">
              <p className="text-5xl font-bold text-gray-900 tracking-wider mb-2 font-mono">
                {validationCode}
              </p>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 mx-auto text-sm text-blue-600 hover:text-blue-700 font-medium">
                
                {copied ?
                <>
                    <Check className="h-4 w-4" />
                    Copié !
                  </> :

                <>
                    <Copy className="h-4 w-4" />
                    Copier le code
                  </>
                }
              </button>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Expire dans {formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 font-medium mb-2">
              📱 Comment faire valider ?
            </p>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Montrez ce code au patient</li>
              <li>Le patient entre le code dans son app ou par SMS</li>
              <li>Validation instantanée ✅</li>
            </ol>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <p className="font-medium mb-1">
                  Si le patient ne peut pas valider maintenant :
                </p>
                <p>
                  Pas de souci ! Il pourra valider plus tard via son tableau de
                  bord. Vous recevrez le paiement sous 24-48h maximum.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Button variant="primary" className="w-full" onClick={onClose}>
          OK, compris
        </Button>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            💰 Le paiement ({appointment.amount} TND) sera transféré sur votre
            compte dès validation du patient.
          </p>
        </div>
      </Card>
    </div>);

}