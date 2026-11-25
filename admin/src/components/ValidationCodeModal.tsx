import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle, X, AlertCircle } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
interface ValidationCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: string;
    providerName: string;
    serviceName: string;
    amount: number;
    date: string;
  };
  onValidate: (code: string) => Promise<boolean>;
}
export function ValidationCodeModal({
  isOpen,
  onClose,
  appointment,
  onValidate
}: ValidationCodeModalProps) {
  const [code, setCode] = useState(['', '', '', '']);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = [
  useRef<HTMLInputElement>(null),
  useRef<HTMLInputElement>(null),
  useRef<HTMLInputElement>(null),
  useRef<HTMLInputElement>(null)];

  useEffect(() => {
    if (isOpen) {
      inputRefs[0].current?.focus();
    }
  }, [isOpen]);
  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');
    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
    // Auto-validate when all 4 digits entered
    if (index === 3 && value) {
      handleValidate(newCode.join(''));
    }
  };
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };
  const handleValidate = async (fullCode: string) => {
    setIsValidating(true);
    setError('');
    try {
      const isValid = await onValidate(fullCode);
      if (isValid) {

        // Success - modal will close automatically
      } else {setError('Code invalide. Vérifiez avec le professionnel.');
        setCode(['', '', '', '']);
        inputRefs[0].current?.focus();
      }
    } catch (err) {
      setError('Erreur de validation. Réessayez.');
    } finally {
      setIsValidating(false);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Valider le service
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
            
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3 mb-3">
            <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900 mb-1">
                Service terminé
              </p>
              <p className="text-sm text-gray-700">
                {appointment.providerName}
              </p>
              <p className="text-sm text-gray-600">{appointment.serviceName}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                {appointment.amount} TND
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3 text-center">
            Entrez le code de validation à 4 chiffres
          </label>
          <p className="text-xs text-gray-600 text-center mb-4">
            Le professionnel vous a communiqué ce code
          </p>

          <div className="flex justify-center gap-3 mb-4">
            {code.map((digit, index) =>
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isValidating}
              className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${error ? 'border-red-300 bg-red-50' : digit ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} ${isValidating ? 'opacity-50 cursor-not-allowed' : ''}`} />

            )}
          </div>

          {error &&
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          }
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => handleValidate(code.join(''))}
            disabled={code.some((d) => !d) || isValidating}>
            
            {isValidating ? 'Validation...' : 'Valider le service'}
          </Button>

          <button
            onClick={onClose}
            className="w-full text-center text-sm text-gray-600 hover:text-gray-900 py-2">
            
            Je validerai plus tard
          </button>

          <div className="pt-3 border-t border-gray-200">
            <button className="w-full text-center text-sm text-red-600 hover:text-red-700 py-2 font-medium">
              Signaler un problème
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            💡 Vous pouvez aussi valider plus tard depuis votre tableau de bord.
            Le service sera automatiquement validé après 48h sans litige.
          </p>
        </div>
      </Card>
    </div>);

}