import { AlertCircle, MapPin, MessageCircle, Phone, Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { useConversationEntryStatus, useGetOrCreateConversation } from '@/features/messaging';
import {
  getProviderDisplayName,
  getProviderImageUrl,
  getProviderLocation,
} from '@/features/providers/display-helpers';
import { usePublicProvider } from '@/features/providers/hooks';
import { showErrorToast } from '@/shared/lib/notifications/toast';
import { SkeletonModalContent } from '@/shared/ui/composites/loading';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';
import type { ApiError } from '@/shared/schemas/api.schema';

interface ProviderContactModalProps {
  providerId: string | null;
  onClose: () => void;
}

function getErrorStatus(error: unknown): number | null {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const { statusCode } = error as Partial<ApiError>;
    return typeof statusCode === 'number' ? statusCode : null;
  }

  return null;
}

export function ProviderContactModal({ providerId, onClose }: ProviderContactModalProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const canMessageProvider = isAuthenticated && user?.role === 'patient';
  const { data: provider, loading, error } = usePublicProvider(providerId ?? undefined);
  const { data: entryStatus, loading: entryStatusLoading, isFetching: entryStatusRefreshing } =
    useConversationEntryStatus(providerId ?? undefined, canMessageProvider);
  const { mutateAsync: getOrCreateConversation, loading: openingConversation } =
    useGetOrCreateConversation();
  const providerErrorStatus = getErrorStatus(error);

  if (!providerId) {
    return null;
  }

  const name = provider ? getProviderDisplayName(provider) : '';
  const location = provider ? getProviderLocation(provider) : null;
  const imageUrl = provider ? getProviderImageUrl(provider) : null;
  const existingConversationId = entryStatus?.existingConversationId ?? null;
  const entryStatusPending = entryStatusLoading || entryStatusRefreshing;
  const messageBlockedByEntryStatus =
    !entryStatusPending && !existingConversationId && entryStatus?.canOpenConversation === false;
  const messageActionDisabled =
    !existingConversationId && (openingConversation || entryStatusLoading);

  const handleMessageProvider = async () => {
    if (!providerId) {
      return;
    }

    if (messageBlockedByEntryStatus) {
      return;
    }

    if (existingConversationId) {
      navigate(`/messages/${existingConversationId}`);
      onClose();
      return;
    }

    try {
      const conversation = await getOrCreateConversation({ providerId });
      navigate(`/messages/${conversation.id}`);
      onClose();
    } catch (entryError) {
      showErrorToast(entryError, t.messages.messageEntryFailed);
    }
  };

  return (
    <Dialog
      open={Boolean(providerId)}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent showCloseButton={false} size="sm">
        <DialogHeader className="flex-row items-center justify-between gap-4">
          <div>
            <DialogTitle className="text-base font-bold text-foreground">
              {t.help.contactUs}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Coordonnées et options de contact du prestataire.
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <button
              type="button"
              aria-label={t.common.close}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </DialogHeader>

        <DialogBody>
          {loading ? (
            <SkeletonModalContent className="border-0 shadow-none" lines={5} showFooter={false} />
          ) : null}

          {error && !loading ? (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p className="text-xs">
                {providerErrorStatus === 404
                  ? 'Prestataire introuvable'
                  : providerErrorStatus === 401 || providerErrorStatus === 403
                    ? 'Accès refusé'
                    : t.common.loadingError}
              </p>
            </div>
          ) : null}

          {provider && !loading ? (
            <>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted text-xl">
                  {imageUrl ? (
                    <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-bold text-foreground">{name.charAt(0)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-bold text-foreground">{name}</h4>

                  {provider.ratingAverage > 0 ? (
                    <div className="mt-0.5 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-semibold text-foreground">
                        {provider.ratingAverage.toFixed(1)}
                      </span>
                    </div>
                  ) : null}

                  {location ? (
                    <div className="mt-0.5 flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate text-[10px]">{location}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              {provider.specialties && provider.specialties.length > 0 ? (
                <div className="mb-4 flex flex-wrap gap-1">
                  {provider.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold text-muted-foreground"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="space-y-2">
                {canMessageProvider ? (
                  <button
                    type="button"
                    onClick={() => void handleMessageProvider()}
                    disabled={messageActionDisabled}
                    aria-describedby={
                      messageBlockedByEntryStatus ? 'provider-message-reservation-lock' : undefined
                    }
                    aria-label={t.messages.messageProvider}
                    className="w-full rounded-lg border border-border bg-muted/40 p-3 text-left transition-colors hover:bg-accent/70 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageCircle className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-[10px] text-muted-foreground">{t.messages.title}</p>
                        <p className="text-xs font-medium text-foreground">
                          {t.messages.messageProvider}
                        </p>
                      </div>
                    </div>
                  </button>
                ) : null}

                {canMessageProvider && messageBlockedByEntryStatus ? (
                  <div
                    id="provider-message-reservation-lock"
                    className="flex items-start gap-2 rounded-lg border border-amber-300/60 bg-amber-50/90 p-3 text-xs text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
                    role="status"
                  >
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                    <p>{t.messages.blockedByReservationRequirement}</p>
                  </div>
                ) : null}

                {provider.phone ? (
                  <a href={`tel:${provider.phone}`} className="block">
                    <div className="rounded-lg border border-border bg-muted/40 p-3 transition-colors hover:bg-accent/70">
                      <div className="flex items-center gap-2.5">
                        <Phone className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-[10px] text-muted-foreground">{t.help.phone}</p>
                          <p className="text-xs font-medium text-foreground">{provider.phone}</p>
                        </div>
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                    <p className="text-xs text-muted-foreground">{t.common.noData}</p>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
