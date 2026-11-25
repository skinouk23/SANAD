import { Suspense, lazy, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { useParams } from 'react-router-dom';

import { useBookingSession } from '@/features/bookings';
import type { BookingSessionDetailResponse } from '@/features/bookings/schema';
import {
  canPatientSeeSessionVerificationCode,
  normalizeBookingStatus,
} from '@/features/bookings/status';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { showSuccessToast } from '@/shared/lib/notifications/toast';
import { Button } from '@/shared/ui/primitives/button';
import { Card } from '@/shared/ui/primitives/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';

const LiveTrackingMap = lazy(() =>
  import('@/integrations/maps/LiveTrackingMap').then((module) => ({
    default: module.LiveTrackingMap,
  })),
);

interface TrackingAppointmentViewModel {
  id: string;
  providerType: 'professional' | 'ambulance';
  providerName: string;
  providerPhone: string;
  providerImage: string;
  serviceName: string;
  date: string;
  time: string;
  estimatedArrival: string;
  patientLocation: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  providerLocation: {
    lat: number;
    lng: number;
  } | null;
  status: string;
  verificationCode: string | null;
}

const DEFAULT_PATIENT_ADDRESS = 'Adresse patient non disponible';

export function TrackingPageScreen() {
  const { sessionId } = useParams();
  const { t } = useLanguage();
  const [showCallModal, setShowCallModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const sessionQuery = useBookingSession(sessionId, true);

  const appointment = useMemo<TrackingAppointmentViewModel | null>(() => {
    return sessionQuery.data ? toSessionTrackingViewModel(sessionQuery.data) : null;
  }, [sessionQuery.data]);

  const loading = sessionQuery.loading;
  const error =
    sessionQuery.error || (!loading && !appointment ? new Error('Session not found') : null);
  const canShowVerificationCode =
    Boolean(appointment?.verificationCode) &&
    canPatientSeeSessionVerificationCode(appointment?.status);
  const statusLabel = getTrackingStatusLabel(appointment?.status ?? 'Confirmed');
  const hasMapCoordinates = Boolean(appointment?.patientLocation && appointment.providerLocation);

  const handleCopyCode = () => {
    if (!appointment?.verificationCode) {
      return;
    }

    void navigator.clipboard?.writeText(appointment.verificationCode);
    showSuccessToast(`${t.tracking.copyCode}.`);
  };

  const handleCall = () => {
    setShowCallModal(true);
  };

  const handleMessage = () => {
    setShowMessageModal(true);
  };

  const handleConfirmCall = () => {
    if (appointment?.providerPhone) {
      window.location.href = `tel:${appointment.providerPhone}`;
    }
    setShowCallModal(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/40 dark:text-slate-100">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 px-5 py-4 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/85">
          <Loader2 className="h-5 w-5 animate-spin text-teal-600 dark:text-teal-300" />
          <span className="text-sm font-medium">Chargement du suivi...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 p-6 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/40 dark:text-slate-100">
        <Card className="max-w-md border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/30">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-600 dark:text-red-300" />
          <h1 className="mb-2 text-lg font-bold">Suivi indisponible</h1>
          <p className="text-sm text-red-800 dark:text-red-200">
            Impossible de charger cette session pour le moment.
          </p>
        </Card>
      </div>
    );
  }

  if (!appointment) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/40 dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
                Suivi en temps réel
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                {appointment.serviceName} • {appointment.date} à {appointment.time}
              </p>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-full border border-green-300 bg-green-100 px-4 py-2 dark:border-green-400/30 dark:bg-green-500/10">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-sm font-semibold text-green-800 dark:text-green-300">
                {statusLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {hasMapCoordinates ? (
              <Suspense fallback={<TrackingMapSkeletonCard />}>
                <LiveTrackingMap
                  appointmentId={appointment.id}
                  providerType={appointment.providerType}
                  providerName={appointment.providerName}
                  providerPhone={appointment.providerPhone}
                  providerImage={appointment.providerImage}
                  patientLocation={appointment.patientLocation}
                  providerLocation={appointment.providerLocation}
                  estimatedArrival={appointment.estimatedArrival}
                  onCallProvider={handleCall}
                  onMessageProvider={handleMessage}
                />
              </Suspense>
            ) : (
              <TrackingMapUnavailableCard />
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-white/80 bg-white/90 p-6 shadow-sm shadow-slate-200/70 backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/85 dark:shadow-black/20">
              <h3 className="mb-4 font-bold text-slate-900 dark:text-white">
                {t.tracking.verificationCodeTitle}
              </h3>
              {canShowVerificationCode ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                  <p className="mb-3 text-sm text-emerald-900 dark:text-emerald-100">
                    {t.tracking.verificationCodeInstructions}
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-3xl font-black tracking-[0.35em] text-emerald-700 dark:text-emerald-200">
                      {appointment.verificationCode}
                    </span>
                    <Button variant="outline" size="sm" onClick={handleCopyCode}>
                      <Copy className="mr-2 h-4 w-4" />
                      {t.tracking.copyCode}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
                  {t.tracking.verificationCodeWaiting}
                </div>
              )}
            </Card>

            <Card className="border-white/80 bg-white/90 p-6 shadow-sm shadow-slate-200/70 backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/85 dark:shadow-black/20">
              <h3 className="mb-4 font-bold text-slate-900 dark:text-white">
                Détails du rendez-vous
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Service</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {appointment.serviceName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Date et heure</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {appointment.date} à {appointment.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Adresse</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {appointment.patientLocation?.address || DEFAULT_PATIENT_ADDRESS}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Arrivée estimée</p>
                  <p className="text-lg font-semibold text-teal-700 dark:text-teal-300">
                    {appointment.estimatedArrival}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-white/80 bg-white/90 p-6 shadow-sm shadow-slate-200/70 backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/85 dark:shadow-black/20">
              <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Statut</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/15">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Réservation confirmée
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">13:30</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 animate-pulse items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/15">
                    <div className="h-3 w-3 rounded-full bg-blue-600 dark:bg-blue-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {statusLabel}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Maintenant</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-50">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-3 w-3 rounded-full bg-slate-400 dark:bg-slate-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Arrivée
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {appointment.estimatedArrival}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-50">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-3 w-3 rounded-full bg-slate-400 dark:bg-slate-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Service terminé
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">À venir</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-red-200 bg-red-50 p-6 shadow-sm shadow-red-100/70 dark:border-red-900/50 dark:bg-red-950/30 dark:shadow-black/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-300" />
                <div>
                  <h4 className="mb-1 font-semibold text-red-900 dark:text-red-100">Urgence</h4>
                  <p className="mb-3 text-sm text-red-800 dark:text-red-200">
                    En cas d'urgence médicale, contactez immédiatement le SAMU.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border border-red-600 bg-red-600 text-white shadow-red-600/20 hover:bg-red-700 hover:text-white dark:border-red-500 dark:bg-red-600 dark:hover:bg-red-500"
                    onClick={() => {
                      window.location.href = 'tel:190';
                    }}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Appeler le 190
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="border-white/80 bg-slate-50/90 p-6 shadow-sm shadow-slate-200/70 backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/75 dark:shadow-black/20">
              <h4 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
                Besoin d'aide ?
              </h4>
              <p className="mb-3 text-xs text-slate-600 dark:text-slate-400">
                Notre équipe support est disponible 24/7 pour vous assister.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-slate-300 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-teal-400/60 dark:hover:bg-teal-500/10 dark:hover:text-teal-200"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contacter le support
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showCallModal} onOpenChange={setShowCallModal}>
        <DialogContent showCloseButton={false} size="sm">
          <div className="mb-2 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/15">
              <Phone className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <DialogHeader className="mb-4 text-center">
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Appeler {appointment.providerName} ?
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                {appointment.providerPhone}
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="mt-0 flex-row gap-3 sm:justify-stretch [&>*]:flex-1">
            <Button variant="outline" onClick={() => setShowCallModal(false)}>
              Annuler
            </Button>
            <Button
              variant="ghost"
              className="border border-green-600 bg-green-600 text-white hover:bg-green-700 hover:text-white dark:border-green-500 dark:bg-green-600 dark:hover:bg-green-500"
              onClick={handleConfirmCall}
            >
              Appeler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent showCloseButton={false} size="sm">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Envoyer un message
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              À {appointment.providerName}
            </DialogDescription>
          </DialogHeader>
          <textarea
            placeholder="Votre message..."
            rows={4}
            className="mb-4 w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <DialogFooter className="mt-0 flex-row gap-3 sm:justify-stretch [&>*]:flex-1">
            <Button variant="outline" onClick={() => setShowMessageModal(false)}>
              Annuler
            </Button>
            <Button
              variant="ghost"
              className="border border-teal-600 bg-teal-600 text-white hover:bg-teal-700 hover:text-white dark:border-teal-500 dark:bg-teal-600 dark:hover:bg-teal-500"
              onClick={() => {
                setShowMessageModal(false);
                showSuccessToast('Message envoyé.');
              }}
            >
              Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TrackingMapSkeletonCard() {
  return (
    <div className="space-y-4">
      <Card className="border-border bg-card p-4">
        <div className="flex animate-pulse items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-muted" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-40 rounded bg-muted" />
            <div className="h-4 w-28 rounded bg-muted" />
          </div>
        </div>
      </Card>
      <Card className="overflow-hidden p-0">
        <div className="flex h-[clamp(320px,58dvh,620px)] w-full items-center justify-center bg-slate-100 dark:bg-slate-800">
          <div className="text-center">
            <div className="mx-auto mb-3 h-12 w-12 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
            <p className="text-sm text-slate-600 dark:text-slate-300">Chargement de la carte...</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function TrackingMapUnavailableCard() {
  return (
    <Card className="border-border bg-card p-8 text-center">
      <MapPin className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
      <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
        Localisation indisponible
      </h3>
      <p className="text-sm text-muted-foreground">
        Le suivi cartographique sera disponible lorsque les coordonnées du patient et du
        professionnel seront fournies.
      </p>
    </Card>
  );
}

function toSessionTrackingViewModel(
  session: BookingSessionDetailResponse,
): TrackingAppointmentViewModel {
  const scheduledDate = parseDateOnly(session.scheduledDate);
  const scheduledTime = parseTimeToLabel(session.scheduledStartTime);
  const location =
    session.location?.lat != null && session.location.lng != null
      ? {
          lat: session.location.lat,
          lng: session.location.lng,
          address: session.location.address || session.address || DEFAULT_PATIENT_ADDRESS,
        }
      : null;
  const provider = session.provider ?? null;
  const service = session.service ?? null;
  const providerLocation =
    session.providerLocation ??
    provider?.location ??
    (session.providerLatitude != null && session.providerLongitude != null
      ? {
          lat: session.providerLatitude,
          lng: session.providerLongitude,
          address: session.providerAddress ?? null,
        }
      : null);

  return {
    id: session.id,
    providerType: 'professional',
    providerName: session.providerName || provider?.name || 'Professionnel',
    providerPhone: session.providerPhone || provider?.phone || '',
    providerImage: '👩‍⚕️',
    serviceName: session.serviceName || service?.name || 'Service',
    date: formatDateLabel(scheduledDate),
    time: scheduledTime,
    estimatedArrival: scheduledTime,
    patientLocation: location,
    providerLocation:
      providerLocation?.lat != null && providerLocation.lng != null
        ? { lat: providerLocation.lat, lng: providerLocation.lng }
        : null,
    status: normalizeBookingStatus(session.status ?? 'confirmed'),
    verificationCode: session.verificationCode ?? null,
  };
}

function parseDateOnly(value: BookingSessionDetailResponse['scheduledDate']): Date {
  if (typeof value === 'string') {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(value.year, value.month - 1, value.day);
}

function parseTimeToLabel(value: BookingSessionDetailResponse['scheduledStartTime']): string {
  if (typeof value === 'string') {
    const timePart = value.includes('.') ? (value.split('.').at(-1) ?? value) : value;
    return timePart.slice(0, 5);
  }

  if ('hour' in value) {
    return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}`;
  }

  return `${String(value.hours ?? 0).padStart(2, '0')}:${String(value.minutes ?? 0).padStart(2, '0')}`;
}

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
}

function getTrackingStatusLabel(status: string): string {
  switch (normalizeBookingStatus(status)) {
    case 'ProviderOnWay':
      return 'En route';
    case 'Arrived':
      return 'Arrivé';
    case 'InProgress':
      return 'Service en cours';
    case 'Validated':
      return 'Validé';
    case 'Completed':
      return 'Terminé';
    case 'Cancelled':
      return 'Annulé';
    case 'Disputed':
      return 'En litige';
    default:
      return 'Confirmé';
  }
}
