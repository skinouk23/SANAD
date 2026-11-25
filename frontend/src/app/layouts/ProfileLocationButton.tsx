import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2, LocateFixed } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { reverseGeocodeCoordinates } from '@/shared/lib/location/nominatim';
import { showErrorToast, showSuccessToast } from '@/shared/lib/notifications/toast';
import { cn } from '@/shared/lib/utils';
import type { UserAddress } from '@/contexts/AuthContext';

interface Coordinates {
  latitude: number;
  longitude: number;
}

function getCurrentCoordinates(): Promise<Coordinates> {
  if (!navigator.geolocation) {
    return Promise.reject(
      new Error("La géolocalisation n'est pas prise en charge par votre navigateur."),
    );
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error("L'accès à votre position a été refusé."));
          return;
        }

        if (error.code === error.POSITION_UNAVAILABLE) {
          reject(new Error("Votre position n'est pas disponible pour le moment."));
          return;
        }

        if (error.code === error.TIMEOUT) {
          reject(new Error('La géolocalisation a pris trop de temps.'));
          return;
        }

        reject(new Error("Impossible d'obtenir votre position."));
      },
      {
        enableHighAccuracy: true,
        timeout: 15_000,
      },
    );
  });
}

function toUserAddress(
  address: Awaited<ReturnType<typeof reverseGeocodeCoordinates>>,
): UserAddress {
  return {
    street: address.street,
    city: address.city,
    region: address.region,
    postalCode: address.postalCode,
    country: address.country,
    latitude: address.latitude,
    longitude: address.longitude,
    fullAddress: address.fullAddress,
  };
}

export function ProfileLocationButton() {
  const { saveProfileAddress } = useAuth();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: async () => {
      const coordinates = await getCurrentCoordinates();
      const address = await reverseGeocodeCoordinates(coordinates.latitude, coordinates.longitude);
      const userAddress = toUserAddress(address);

      await saveProfileAddress(userAddress);

      return userAddress;
    },
    onSuccess: () => {
      setStatusMessage('Position enregistrée');
      showSuccessToast('Position enregistrée dans votre profil.');
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Impossible d'enregistrer la position.";
      setStatusMessage(message);
      showErrorToast(error, message);
    },
  });

  const isPending = mutation.isPending;
  const title = isPending
    ? 'Détection de votre position en cours'
    : (statusMessage ?? 'Enregistrer ma position actuelle');

  return (
    <button
      aria-label="Enregistrer ma position actuelle"
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isPending && 'cursor-wait opacity-75',
      )}
      disabled={isPending}
      onClick={() => mutation.mutate()}
      title={title}
      type="button"
    >
      {isPending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <LocateFixed className="h-6 w-6" />
      )}
      <span className="sr-only" aria-live="polite">
        {title}
      </span>
    </button>
  );
}
