import React from 'react';
import { CheckCircle, Award, Star, Shield } from 'lucide-react';
import { Badge } from './ui/Badge';
interface TrustBadgeProps {
  type: 'verified' | 'experienced' | 'rated' | 'secure';
  text?: string;
}
export function TrustBadge({ type, text }: TrustBadgeProps) {
  const config = {
    verified: {
      icon: <CheckCircle className="h-3 w-3" />,
      text: 'Identité vérifiée',
      variant: 'teal' as const
    },
    experienced: {
      icon: <Award className="h-3 w-3" />,
      text: 'Expert confirmé',
      variant: 'rose' as const
    },
    rated: {
      icon: <Star className="h-3 w-3 fill-current" />,
      text: 'Top noté',
      variant: 'amber' as const
    },
    secure: {
      icon: <Shield className="h-3 w-3" />,
      text: 'Paiement sécurisé',
      variant: 'success' as const
    }
  };
  const badge = config[type];
  return (
    <Badge variant={badge.variant} icon={badge.icon}>
      {text || badge.text}
    </Badge>);

}