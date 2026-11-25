import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Copy,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Star,
} from 'lucide-react';

import { useBookingSession } from '@/features/bookings';
import {
  formatAppointmentDate,
  formatAppointmentTime,
} from '@/features/patient/appointments/patientAppointments.utils';
import {
  canPatientSeeSessionVerificationCode,
  normalizeBookingStatus,
} from '@/features/bookings/status';
import { showSuccessToast } from '@/shared/lib/notifications/toast';
import { Button } from '@/shared/ui/primitives/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/primitives/drawer';
import { ScrollArea } from '@/shared/ui/primitives/scroll-area';
import type {
  BookingListItemResponse,
  BookingSessionDetailResponse,
} from '@/features/bookings/schema';
import type { PatientAppointmentsScreenViewModel } from '@/features/patient/appointments/usePatientAppointmentsScreen';

const TRACKING_DRAWER_CLOSE_DELAY_MS = 300;

export function PatientRatingDialog({ screen }: { screen: PatientAppointmentsScreenViewModel }) {
  const { text } = screen;

  if (!screen.ratingModalOpen) {
    return null;
  }

  return (
    <Dialog
      open={Boolean(screen.ratingModalOpen)}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          screen.onCloseRating();
        }
      }}
    >
      <DialogContent showCloseButton={false} size="sm">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
            {text.rating.title}
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            {text.rating.howWasService}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-6 flex justify-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Noter ${index + 1} étoile${index > 0 ? 's' : ''}`}
              onClick={() => {
                screen.onSelectedRatingChange(index + 1);
              }}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-10 w-10 ${index < screen.selectedRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 hover:text-amber-400 dark:text-slate-600 dark:hover:text-amber-400'}`}
              />
            </button>
          ))}
        </div>

        {screen.actionError ? (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {screen.actionError}
          </div>
        ) : null}

        <textarea
          placeholder={text.rating.shareExperience}
          value={screen.reviewComment}
          onChange={(event) => {
            screen.onReviewCommentChange(event.target.value);
          }}
          className="mb-4 w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-slate-500"
          rows={4}
        />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={screen.onCloseRating}
            className="flex-1 rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 font-medium text-slate-700 transition-all hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            {text.common.cancel}
          </button>
          <button
            type="button"
            onClick={() => {
              void screen.onSubmitRating();
            }}
            disabled={screen.selectedRating === 0 || screen.rating}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 font-medium text-white transition-all hover:scale-105 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {screen.rating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {text.rating.sendReview}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PatientTrackingDialog({ screen }: { screen: PatientAppointmentsScreenViewModel }) {
  const { text } = screen;
  const isOpen = Boolean(screen.trackingModalOpen);
  const [renderedSessionId, setRenderedSessionId] = useState<string | undefined>(
    screen.trackingModalOpen ?? undefined,
  );

  useEffect(() => {
    if (screen.trackingModalOpen) {
      setRenderedSessionId(screen.trackingModalOpen);
      return;
    }

    if (!renderedSessionId) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setRenderedSessionId(undefined);
    }, TRACKING_DRAWER_CLOSE_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [renderedSessionId, screen.trackingModalOpen]);

  const sessionQuery = useBookingSession(renderedSessionId, true);
  const timeline = useMemo(() => buildTrackingTimeline(sessionQuery.data), [sessionQuery.data]);

  if (!isOpen && !renderedSessionId) {
    return null;
  }

  const session = sessionQuery.data;
  const loading = sessionQuery.loading;
  const error =
    sessionQuery.error || (!loading && !session ? new Error('Session not found') : null);
  const canShowVerificationCode =
    Boolean(session?.verificationCode) && canPatientSeeSessionVerificationCode(session?.status);

  const handleCopyCode = () => {
    if (!session?.verificationCode) {
      return;
    }

    void navigator.clipboard?.writeText(session.verificationCode);
    showSuccessToast(`${text.tracking.copyCode}.`);
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          screen.onCloseTracking();
        }
      }}
    >
      <DrawerContent className="mx-auto flex h-[92dvh] max-h-[92dvh] w-full max-w-4xl flex-col">
        <DrawerHeader className="border-b border-border px-4 pb-3 pt-2 text-left sm:px-6">
          <DrawerTitle className="text-base font-bold sm:text-xl">
            {text.tracking.title}
          </DrawerTitle>
          <DrawerDescription className="text-xs leading-relaxed sm:text-sm">
            Code de vérification et historique enregistré.
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-3 px-4 py-3 sm:gap-4 sm:px-6">
            {loading ? (
              <div className="flex min-h-[18rem] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-50/80 p-6 text-center dark:border-slate-800 dark:bg-slate-900/60">
                <Loader2 className="mb-3 h-7 w-7 animate-spin text-cyan-600 dark:text-cyan-300" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Chargement des détails de suivi...
                </p>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-center dark:border-red-900/50 dark:bg-red-950/30">
                <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-600 dark:text-red-300" />
                <h3 className="mb-2 text-base font-bold text-red-950 dark:text-red-100">
                  Suivi indisponible
                </h3>
                <p className="mb-4 text-sm text-red-800 dark:text-red-200">
                  Impossible de charger cette session pour le moment.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void sessionQuery.refetch();
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Réessayer
                </Button>
              </div>
            ) : null}

            {!loading && !error && session ? (
              <div className="flex flex-col gap-3 sm:gap-4">
                <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm dark:border-emerald-500/30 dark:bg-emerald-500/10">
                  <div className="mb-3 flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white dark:bg-emerald-500">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
                        {text.tracking.verificationCodeTitle}
                      </h3>
                      <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
                        {canShowVerificationCode
                          ? text.tracking.verificationCodeInstructions
                          : text.tracking.verificationCodeWaiting}
                      </p>
                    </div>
                  </div>

                  {canShowVerificationCode ? (
                    <div className="flex flex-col gap-3 rounded-2xl border border-emerald-300 bg-white/75 p-3 dark:border-emerald-400/30 dark:bg-slate-950/30 sm:flex-row sm:items-center sm:justify-between">
                      <span className="font-mono text-3xl font-black tracking-[0.35em] text-emerald-700 dark:text-emerald-100">
                        {session.verificationCode}
                      </span>
                      <Button type="button" variant="outline" size="sm" onClick={handleCopyCode}>
                        <Copy className="mr-2 h-4 w-4" />
                        {text.tracking.copyCode}
                      </Button>
                    </div>
                  ) : null}
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                        Historique enregistré
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Basé sur les horodatages sauvegardés par la plateforme.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        void sessionQuery.refetch();
                      }}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Actualiser
                    </Button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {timeline.map((item, index) => (
                      <div key={item.key} className="relative flex gap-3">
                        {index < timeline.length - 1 ? (
                          <span className="absolute left-4 top-8 h-[calc(100%-0.5rem)] w-px bg-slate-200 dark:bg-slate-800" />
                        ) : null}
                        <div
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                            item.state === 'completed'
                              ? 'border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-200'
                              : item.state === 'active'
                                ? 'border-cyan-300 bg-cyan-100 text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-500/15 dark:text-cyan-200'
                                : 'border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-500'
                          }`}
                        >
                          {item.state === 'completed' ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1 pb-2">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {item.label}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {item.at ? formatDateTimeLabel(item.at) : item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            ) : null}
          </div>
        </ScrollArea>

        <DrawerFooter className="border-t border-border px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 sm:px-6">
          <DrawerClose asChild>
            <Button type="button" variant="outline" className="min-h-11 w-full">
              {text.common.close}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function PatientAppointmentDetailsDialog({
  screen,
}: {
  screen: PatientAppointmentsScreenViewModel;
}) {
  const { text, selectedAppointment } = screen;
  const sessionId = selectedAppointment?.sessionId ?? selectedAppointment?.id;
  const sessionQuery = useBookingSession(sessionId, true);
  const scheduledAt = useMemo(() => getSessionScheduledAt(sessionQuery.data), [sessionQuery.data]);
  const details = useMemo(
    () =>
      selectedAppointment
        ? buildAppointmentDetails(selectedAppointment, sessionQuery.data, scheduledAt, text)
        : null,
    [scheduledAt, selectedAppointment, sessionQuery.data, text],
  );

  if (!screen.detailsModalOpen || !selectedAppointment || !details) {
    return null;
  }

  return (
    <Dialog
      open={Boolean(screen.detailsModalOpen)}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          screen.onCloseDetails();
        }
      }}
    >
      <DialogContent showCloseButton={false} size="lg" scroll="content">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
            {text.appointmentDetails.title}
          </DialogTitle>
        </DialogHeader>

        <DialogBody className="mb-2 pr-1">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-2xl font-bold text-white shadow-sm">
                {details.providerInitial}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{details.providerName}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{details.serviceName}</p>
              </div>
            </div>

            {sessionQuery.loading ? (
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Chargement des détails de réservation...
              </div>
            ) : null}

            {sessionQuery.error ? (
              <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
                Certaines informations détaillées ne sont pas disponibles pour le moment.
              </div>
            ) : null}

            <div className="space-y-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
              <DetailsInfoRow label={text.appointmentDetails.date} value={details.dateLabel} />
              <DetailsInfoRow label={text.appointmentDetails.time} value={details.timeLabel} />
              <DetailsInfoRow label={text.appointmentDetails.type} value={details.typeLabel} />
              <DetailsInfoRow label="Statut" value={details.statusLabel} />
              <DetailsInfoRow label="Session" value={details.sessionNumberLabel} />
            </div>

            <div className="space-y-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
              <DetailsInfoRow label="Prestataire" value={details.providerName} />
              <DetailsInfoRow label="Téléphone" value={details.providerPhone} />
              <DetailsInfoRow label="Durée prévue" value={details.durationLabel} />
              <DetailsInfoRow label="Adresse" value={details.address} multiline />
            </div>

            <div className="space-y-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
              <DetailsInfoRow label="Paiement" value={details.paymentLabel} multiline />
              <DetailsInfoRow label="Montant" value={details.amountLabel} />
            </div>

            <div className="space-y-2 rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Notes</h4>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                {details.notes || 'Aucune note enregistrée pour cette session.'}
              </p>
            </div>
          </div>
        </DialogBody>

        <DialogFooter className="mt-0">
          <button
            type="button"
            onClick={screen.onCloseDetails}
            className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 font-medium text-slate-700 transition-all hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            {text.common.close}
          </button>
          <button
            type="button"
            onClick={() => {
              void screen.onCancelAppointment(selectedAppointment.id);
            }}
            disabled={screen.cancelling}
            className="flex items-center justify-center gap-2 rounded-lg border border-red-500/50 bg-red-500/20 px-4 py-3 font-medium text-red-500 transition-all hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {screen.cancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {text.mySpace.cancelAppointment}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type TrackingTimelineState = 'completed' | 'active' | 'upcoming';

interface AppointmentDetailsInfo {
  providerInitial: string;
  providerName: string;
  providerPhone: string;
  serviceName: string;
  statusLabel: string;
  sessionNumberLabel: string;
  dateLabel: string;
  timeLabel: string;
  typeLabel: string;
  durationLabel: string;
  address: string;
  paymentLabel: string;
  amountLabel: string;
  notes: string | null;
}

interface TrackingTimelineItem {
  key: string;
  label: string;
  status: string;
  at: string | Date | null | undefined;
  description: string;
  state: TrackingTimelineState;
}

function DetailsInfoRow({
  label,
  multiline = false,
  value,
}: {
  label: string;
  multiline?: boolean;
  value: string;
}) {
  return (
    <div className={`flex justify-between gap-4 text-sm ${multiline ? 'items-start' : ''}`}>
      <span className="shrink-0 text-slate-500 dark:text-slate-400">{label}</span>
      <span
        className={`text-slate-900 dark:text-white ${
          multiline ? 'max-w-[12rem] text-right leading-5' : 'text-right'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function buildAppointmentDetails(
  appointment: BookingListItemResponse,
  session: BookingSessionDetailResponse | null | undefined,
  scheduledAt: Date | null,
  text: PatientAppointmentsScreenViewModel['text'],
): AppointmentDetailsInfo {
  const rawProviderName =
    session?.providerName || session?.provider?.name || appointment.provider?.name || null;
  const providerName = rawProviderName || 'Professionnel';
  const scheduledSource = scheduledAt?.toISOString() ?? appointment.scheduledAt;
  const status = normalizeBookingStatus(
    session?.status ??
      session?.bookingStatus ??
      session?.parentStatus ??
      appointment.status ??
      'Confirmed',
  );
  const serviceName =
    session?.serviceName ||
    session?.service?.name ||
    session?.serviceCategory ||
    appointment.service?.name ||
    appointment.service?.category ||
    'Service';
  const providerPhone =
    session?.providerPhone ||
    session?.provider?.phone ||
    appointment.provider?.phone ||
    'Non disponible';
  const address =
    session?.address ||
    session?.location?.address ||
    appointment.address ||
    'Adresse non disponible';
  const sessionNumberLabel =
    session?.sessionIndex != null && session.totalSessions != null
      ? `Session ${session.sessionIndex}/${session.totalSessions}`
      : (session?.bookingNumber ??
        appointment.bookingNumber ??
        session?.parent?.bookingNumber ??
        'Session active');
  const durationMinutes = session?.scheduledDurationMinutes ?? appointment.dailyDurationMinutes;
  const notes = (session?.notes ?? appointment.notes)?.trim() || null;

  return {
    providerInitial: rawProviderName?.charAt(0) || '👨‍⚕️',
    providerName,
    providerPhone,
    serviceName,
    statusLabel: getTrackingStatusLabel(status),
    sessionNumberLabel,
    dateLabel: formatAppointmentDate(scheduledSource),
    timeLabel: formatAppointmentTime(scheduledSource),
    typeLabel: appointment.type === 'video' ? text.mySpace.videoConsultation : text.mySpace.atHome,
    durationLabel: durationMinutes ? `${durationMinutes} min` : 'Durée non disponible',
    address,
    paymentLabel: formatAppointmentPaymentLabel(session, appointment),
    amountLabel: formatAppointmentAmountLabel(session, appointment),
    notes,
  };
}

function buildTrackingTimeline(
  session: BookingSessionDetailResponse | null | undefined,
): TrackingTimelineItem[] {
  if (!session) {
    return [];
  }

  const normalizedStatus = normalizeBookingStatus(
    session.status ?? session.bookingStatus ?? session.parentStatus ?? 'Confirmed',
  );
  const activeOrder = getTrackingStatusOrder(normalizedStatus);
  const canUseProgressFallback = !['Cancelled', 'NoShow', 'Disputed'].includes(normalizedStatus);
  const lifecycleEvents = [
    {
      key: 'providerDepartedAt',
      label: 'Départ du prestataire',
      status: 'ProviderOnWay',
      at: session.providerDepartedAt,
      description: "Le départ du prestataire n'est pas encore enregistré.",
    },
    {
      key: 'providerArrivedAt',
      label: 'Arrivée à destination',
      status: 'Arrived',
      at: session.providerArrivedAt,
      description: "L'arrivée du prestataire n'est pas encore enregistrée.",
    },
    {
      key: 'serviceStartedAt',
      label: 'Début de la prestation',
      status: 'InProgress',
      at: session.serviceStartedAt,
      description: "Le début de la prestation n'est pas encore enregistré.",
    },
    {
      key: 'serviceCompletedAt',
      label: 'Prestation terminée',
      status: 'Completed',
      at: session.serviceCompletedAt,
      description: "La fin de la prestation n'est pas encore enregistrée.",
    },
    {
      key: 'verifiedAt',
      label: 'Session vérifiée',
      status: 'Validated',
      at: session.verifiedAt,
      description: "La vérification finale n'est pas encore enregistrée.",
    },
  ];
  const terminalEvents = [
    {
      key: 'cancelledAt',
      label: 'Session annulée',
      status: 'Cancelled',
      at: session.cancelledAt,
      description: "L'annulation est le statut actuel, sans horaire enregistré.",
    },
    {
      key: 'noShowAt',
      label: 'Absence signalée',
      status: 'NoShow',
      at: session.noShowAt,
      description: "L'absence est le statut actuel, sans horaire enregistré.",
    },
    {
      key: 'disputedAt',
      label: 'Litige ouvert',
      status: 'Disputed',
      at: session.disputedAt,
      description: 'Le litige est le statut actuel, sans horaire enregistré.',
    },
  ].filter((event) => Boolean(event.at) || normalizedStatus === event.status);

  return [...lifecycleEvents, ...terminalEvents]
    .sort(
      (left, right) => getTrackingStatusOrder(left.status) - getTrackingStatusOrder(right.status),
    )
    .map((event) => {
      const eventOrder = getTrackingStatusOrder(event.status);
      const fallbackCompleted =
        canUseProgressFallback && eventOrder > 0 && eventOrder < activeOrder;
      const state: TrackingTimelineState = event.at
        ? 'completed'
        : normalizedStatus === event.status
          ? 'active'
          : fallbackCompleted
            ? 'completed'
            : 'upcoming';

      return {
        ...event,
        description:
          state === 'completed' && !event.at
            ? 'Étape franchie, horaire non enregistré.'
            : state === 'active' && !event.at
              ? 'Étape actuelle, horaire non enregistré.'
              : event.description,
        state,
      };
    });
}

function getTrackingStatusOrder(status?: string | null): number {
  switch (normalizeBookingStatus(status ?? '')) {
    case 'ProviderOnWay':
      return 1;
    case 'Arrived':
      return 2;
    case 'InProgress':
      return 3;
    case 'Completed':
      return 4;
    case 'Validated':
      return 5;
    case 'Cancelled':
    case 'NoShow':
    case 'Disputed':
      return 6;
    default:
      return 0;
  }
}

function getTrackingStatusLabel(status?: string | null): string {
  switch (normalizeBookingStatus(status ?? '')) {
    case 'Pending':
      return 'En attente';
    case 'ProviderOnWay':
      return 'Prestataire en route';
    case 'Arrived':
      return 'Arrivé';
    case 'InProgress':
      return 'Service en cours';
    case 'Completed':
      return 'Terminé';
    case 'Validated':
      return 'Validé';
    case 'Cancelled':
      return 'Annulé';
    case 'NoShow':
      return 'Absence';
    case 'Disputed':
      return 'En litige';
    default:
      return 'Confirmé';
  }
}

function getSessionScheduledAt(
  session: BookingSessionDetailResponse | null | undefined,
): Date | null {
  if (!session) {
    return null;
  }

  if (session.scheduledAt) {
    const scheduledAt = new Date(session.scheduledAt);

    if (!Number.isNaN(scheduledAt.getTime())) {
      return scheduledAt;
    }
  }

  return buildSessionScheduledAt(session.scheduledDate, session.scheduledStartTime);
}

function buildSessionScheduledAt(
  dateValue: BookingSessionDetailResponse['scheduledDate'] | null | undefined,
  timeValue: BookingSessionDetailResponse['scheduledStartTime'] | null | undefined,
): Date | null {
  if (!dateValue) {
    return null;
  }

  let year: number;
  let month: number;
  let day: number;

  if (typeof dateValue === 'string') {
    const [datePart] = dateValue.split('T');
    const [parsedYear, parsedMonth, parsedDay] = datePart.split('-').map(Number);

    year = parsedYear;
    month = parsedMonth;
    day = parsedDay;
  } else {
    year = dateValue.year;
    month = dateValue.month;
    day = dateValue.day;
  }

  if (![year, month, day].every(Number.isFinite)) {
    return null;
  }

  const time = normalizeSessionTime(timeValue);
  const scheduledAt = new Date(
    year,
    month - 1,
    day,
    time?.hours ?? 0,
    time?.minutes ?? 0,
    time?.seconds ?? 0,
  );

  return Number.isNaN(scheduledAt.getTime()) ? null : scheduledAt;
}

function normalizeSessionTime(
  value: unknown,
): { hours: number; minutes: number; seconds: number } | null {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    const timePart = value.includes('.') ? (value.split('.').at(-1) ?? value) : value;
    const [hoursText = '0', minutesText = '0', secondsText = '0'] = timePart.split(':');
    const hours = Number(hoursText);
    const minutes = Number(minutesText);
    const seconds = Number(secondsText);

    return [hours, minutes, seconds].every(Number.isFinite) ? { hours, minutes, seconds } : null;
  }

  if (typeof value !== 'object') {
    return null;
  }

  const timeRecord = value as Record<string, unknown>;
  const hours =
    typeof timeRecord.hour === 'number'
      ? timeRecord.hour
      : typeof timeRecord.hours === 'number'
        ? timeRecord.hours
        : null;
  const minutes =
    typeof timeRecord.minute === 'number'
      ? timeRecord.minute
      : typeof timeRecord.minutes === 'number'
        ? timeRecord.minutes
        : 0;
  const seconds =
    typeof timeRecord.second === 'number'
      ? timeRecord.second
      : typeof timeRecord.seconds === 'number'
        ? timeRecord.seconds
        : 0;

  return hours == null ? null : { hours, minutes, seconds };
}

function formatDateTimeLabel(value: Date | string | null | undefined): string {
  if (!value) {
    return 'Date non disponible';
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date non disponible';
  }

  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatAppointmentAmountLabel(
  session: BookingSessionDetailResponse | null | undefined,
  appointment: BookingListItemResponse,
): string {
  const amount = session?.totalAmount ?? session?.parent?.totalAmount ?? appointment.totalAmount;
  const currency = session?.currency ?? session?.parent?.currency ?? appointment.currency ?? 'TND';

  if (amount == null) {
    return 'Montant non disponible';
  }

  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

function formatAppointmentPaymentLabel(
  session: BookingSessionDetailResponse | null | undefined,
  appointment: BookingListItemResponse,
): string {
  const methodLabel = getPaymentMethodLabel(
    session?.paymentMethod ??
      session?.paymentMethodType ??
      appointment.paymentMethod ??
      appointment.paymentMethodType,
  );
  const paymentStatus = (session?.paymentStatus ?? appointment.paymentStatus)?.trim();
  const paymentReferenceNumber = (
    session?.paymentReferenceNumber ?? appointment.paymentReferenceNumber
  )?.trim();

  return [
    methodLabel,
    paymentStatus ? `Statut ${paymentStatus}` : null,
    paymentReferenceNumber ? `Réf. ${paymentReferenceNumber}` : null,
  ]
    .filter((part): part is string => Boolean(part))
    .join(' • ');
}

function getPaymentMethodLabel(method?: string | null): string {
  const normalizedMethod = method?.trim().toLowerCase();

  switch (normalizedMethod) {
    case 'cash':
      return 'Espèces';
    case 'card':
    case 'credit_card':
    case 'debit_card':
      return 'Carte bancaire';
    case 'd17':
      return 'D17';
    default:
      return method?.trim() || 'Non renseigné';
  }
}
