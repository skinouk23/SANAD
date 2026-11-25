using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Conversations.Entities;
using SanadPlatform.API.Features.Notifications.Entities;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Notifications;

internal static class NotificationFactory
{
    public static Notification CreateBookingConfirmedForPatient(Booking booking)
    {
        ArgumentNullException.ThrowIfNull(booking);
        ArgumentNullException.ThrowIfNull(booking.Patient);
        ArgumentNullException.ThrowIfNull(booking.Provider);

        var providerName = ResolveProviderName(booking.Provider);
        var scheduledFor = $"{booking.StartDate:dd/MM/yyyy} a {booking.DailyStartTime:HH:mm}";
        var message = string.IsNullOrWhiteSpace(providerName)
            ? $"Votre reservation {booking.BookingNumber} a ete confirmee."
            : $"Votre rendez-vous avec {providerName} est confirme pour le {scheduledFor}.";

        return new Notification
        {
            Id = Guid.NewGuid(),
            UserId = booking.Patient.UserId,
            Type = "booking_confirmed",
            Title = "Rendez-vous confirme",
            Message = message,
            BookingId = booking.Id,
            ProviderId = booking.ProviderId,
            ActionUrl = "/mon-espace",
        };
    }

    public static Notification CreateValidationPendingForPatient(BookingSession session)
    {
        ArgumentNullException.ThrowIfNull(session);
        ArgumentNullException.ThrowIfNull(session.Booking);
        ArgumentNullException.ThrowIfNull(session.Booking.Patient);

        return new Notification
        {
            Id = Guid.NewGuid(),
            UserId = session.Booking.Patient.UserId,
            Type = "validation_pending",
            Title = "Validation en attente",
            Message = "N'oubliez pas de valider votre service avec le code recu.",
            BookingId = session.BookingId,
            ProviderId = session.ProviderId,
            ActionUrl = "/mon-espace",
        };
    }

    public static Notification CreateNewMessage(
        Conversation conversation,
        bool senderIsPatient)
    {
        ArgumentNullException.ThrowIfNull(conversation);
        ArgumentNullException.ThrowIfNull(conversation.Patient);
        ArgumentNullException.ThrowIfNull(conversation.Provider);

        var recipientUserId = senderIsPatient
            ? conversation.Provider.UserId
            : conversation.Patient.UserId;
        var senderName = senderIsPatient
            ? ResolvePatientName(conversation.Patient)
            : ResolveProviderName(conversation.Provider);

        return new Notification
        {
            Id = Guid.NewGuid(),
            UserId = recipientUserId,
            Type = "new_message",
            Title = "Nouveau message",
            Message = $"{senderName} vous a envoye un message.",
            ProviderId = conversation.ProviderId,
            ActionUrl = $"/messages/{conversation.Id}",
        };
    }

    private static string ResolveProviderName(Provider provider)
    {
        if (!string.IsNullOrWhiteSpace(provider.BusinessName))
        {
            return provider.BusinessName.Trim();
        }

        return $"{provider.FirstName} {provider.LastName}".Trim();
    }

    private static string ResolvePatientName(Patient patient)
    {
        return $"{patient.FirstName} {patient.LastName}".Trim();
    }
}
