using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;

namespace SanadPlatform.API.Features.Bookings.Services;

/// <summary>
/// Maps booking session entities to role-aware API DTOs.
/// </summary>
public interface IBookingSessionMapper
{
    BookingSessionResponse MapSession(
        BookingSession session,
        BookingSessionCountsResponse counts,
        string? verificationCode);

    ProviderBookingSessionDeliveryResponse MapProviderDelivery(BookingSession session);

    BookingSessionActionResponse MapAction(
        BookingSession session,
        BookingSessionCountsResponse counts,
        bool parentSettled = false);
}

/// <summary>
/// Default mapper for booking session DTOs.
/// </summary>
public class BookingSessionMapper : IBookingSessionMapper
{
    private readonly IBookingSessionVerificationCodeService _verificationCodeService;

    public BookingSessionMapper(IBookingSessionVerificationCodeService verificationCodeService)
    {
        _verificationCodeService = verificationCodeService ?? throw new ArgumentNullException(nameof(verificationCodeService));
    }

    public BookingSessionResponse MapSession(
        BookingSession session,
        BookingSessionCountsResponse counts,
        string? verificationCode)
    {
        ArgumentNullException.ThrowIfNull(session);

        return new BookingSessionResponse
        {
            Id = session.Id,
            BookingId = session.BookingId,
            BookingNumber = session.Booking.BookingNumber,
            Status = session.Status.ToString(),
            ParentStatus = session.Booking.Status.ToString(),
            ProviderId = session.ProviderId,
            PatientId = session.PatientId,
            ScheduledDate = session.ScheduledDate,
            ScheduledStartTime = session.ScheduledStartTime.ToTimeSpan(),
            ScheduledEndTime = session.ScheduledEndTime?.ToTimeSpan(),
            ScheduledDurationMinutes = session.ScheduledDurationMinutes,
            ScheduledAt = BuildScheduledAt(session),
            Timezone = session.Timezone,
            ServiceName = session.Booking.Service?.Name,
            ServiceCategory = session.Booking.Service?.Category,
            PatientName = session.Booking.PatientName,
            PatientPhone = session.Booking.PatientPhone,
            ProviderName = session.Booking.Provider == null ? null : $"{session.Booking.Provider.FirstName} {session.Booking.Provider.LastName}".Trim(),
            ProviderPhone = session.Booking.Provider?.User?.Phone,
            Address = FormatAddress(session.Booking.AddressLine1, session.Booking.City),
            Location = new ProviderBookingDeliveryLocationResponse
            {
                Lat = session.Booking.Latitude,
                Lng = session.Booking.Longitude,
                Address = FormatAddress(session.Booking.AddressLine1, session.Booking.City)
            },
            Notes = session.Booking.PatientNotes,
            TotalAmount = session.Booking.TotalAmount,
            Currency = session.Booking.Currency,
            ProviderDepartedAt = session.ProviderDepartedAt,
            ProviderArrivedAt = session.ProviderArrivedAt,
            ServiceStartedAt = session.ServiceStartedAt,
            ServiceCompletedAt = session.ServiceCompletedAt,
            VerifiedAt = session.VerifiedAt,
            Rating = session.Review?.Rating,
            ReviewComment = session.Review?.Comment,
            VerificationMethod = session.VerificationMethod,
            VerificationCodeRequired = session.Status is BookingSessionStatus.Arrived or BookingSessionStatus.InProgress,
            VerificationLocked = session.VerificationAttempts >= _verificationCodeService.MaxAttempts,
            VerificationAttempts = session.VerificationAttempts,
            VerificationAttemptsRemaining = Math.Max(0, _verificationCodeService.MaxAttempts - session.VerificationAttempts),
            VerificationCodeExpiresAt = session.VerificationCodeExpiresAt,
            VerificationCode = verificationCode,
            CancelledAt = session.CancelledAt,
            CancelledBy = session.CancelledBy,
            CancellationReason = session.CancellationReason,
            NoShowAt = session.NoShowAt,
            NoShowReason = session.NoShowReason,
            DisputedAt = session.DisputedAt,
            DisputeReason = session.DisputeReason,
            Counts = counts
        };
    }

    public ProviderBookingSessionDeliveryResponse MapProviderDelivery(BookingSession session)
    {
        ArgumentNullException.ThrowIfNull(session);

        return new ProviderBookingSessionDeliveryResponse
        {
            Id = session.Id,
            SessionId = session.Id,
            BookingId = session.BookingId,
            BookingNumber = session.Booking.BookingNumber,
            Status = session.Status.ToString(),
            ParentStatus = session.Booking.Status.ToString(),
            BookingStatus = session.Booking.Status.ToString(),
            PaymentMethod = session.Booking.PaymentMethod,
            PaymentId = session.Booking.Payment?.Id,
            PaymentStatus = session.Booking.Payment?.Status,
            PaymentMethodType = session.Booking.Payment?.MethodType,
            PaymentReferenceNumber = session.Booking.Payment?.ReferenceNumber,
            ScheduledAt = BuildScheduledAt(session),
            ScheduledDate = session.ScheduledDate,
            StartDate = session.ScheduledDate,
            EndDate = session.ScheduledDate,
            ScheduledStartTime = session.ScheduledStartTime.ToTimeSpan(),
            ScheduledEndTime = session.ScheduledEndTime?.ToTimeSpan(),
            DailyStartTime = session.ScheduledStartTime.ToTimeSpan(),
            DailyEndTime = session.ScheduledEndTime?.ToTimeSpan(),
            DailyDurationMinutes = session.ScheduledDurationMinutes,
            Timezone = session.Timezone,
            PatientName = session.Booking.PatientName,
            PatientPhone = session.Booking.PatientPhone,
            ProviderPhone = session.Booking.Provider?.User?.Phone,
            ServiceName = session.Booking.Service?.Name,
            ServiceCategory = session.Booking.Service?.Category,
            Notes = session.Booking.PatientNotes,
            TotalAmount = session.Booking.TotalAmount,
            Currency = session.Booking.Currency,
            Location = new ProviderBookingDeliveryLocationResponse
            {
                Lat = session.Booking.Latitude,
                Lng = session.Booking.Longitude,
                Address = FormatAddress(session.Booking.AddressLine1, session.Booking.City)
            },
            ProviderDepartedAt = session.ProviderDepartedAt,
            ProviderArrivedAt = session.ProviderArrivedAt,
            ServiceStartedAt = session.ServiceStartedAt,
            ServiceCompletedAt = session.ServiceCompletedAt,
            VerifiedAt = session.VerifiedAt,
            VerificationCodeRequired = session.Status is BookingSessionStatus.Arrived or BookingSessionStatus.InProgress,
            RequiresVerificationCode = session.Status is BookingSessionStatus.Arrived or BookingSessionStatus.InProgress,
            VerificationLocked = session.VerificationAttempts >= _verificationCodeService.MaxAttempts,
            CompletionLocked = session.VerificationAttempts >= _verificationCodeService.MaxAttempts,
            VerificationAttemptsRemaining = Math.Max(0, _verificationCodeService.MaxAttempts - session.VerificationAttempts)
        };
    }

    public BookingSessionActionResponse MapAction(
        BookingSession session,
        BookingSessionCountsResponse counts,
        bool parentSettled = false)
    {
        ArgumentNullException.ThrowIfNull(session);

        return new BookingSessionActionResponse
        {
            Id = session.Id,
            SessionId = session.Id,
            BookingId = session.BookingId,
            Status = session.Status.ToString(),
            ParentStatus = session.Booking.Status.ToString(),
            BookingStatus = session.Booking.Status.ToString(),
            ProviderDepartedAt = session.ProviderDepartedAt,
            ProviderArrivedAt = session.ProviderArrivedAt,
            ServiceStartedAt = session.ServiceStartedAt,
            ServiceCompletedAt = session.ServiceCompletedAt,
            VerifiedAt = session.VerifiedAt,
            CancelledAt = session.CancelledAt,
            CancelledBy = session.CancelledBy,
            CancellationReason = session.CancellationReason,
            NoShowAt = session.NoShowAt,
            NoShowReason = session.NoShowReason,
            DisputedAt = session.DisputedAt,
            PaymentId = session.Booking.Payment?.Id,
            PaymentStatus = session.Booking.Payment?.Status,
            VerificationCodeRequired = session.Status is BookingSessionStatus.Arrived or BookingSessionStatus.InProgress,
            RequiresVerificationCode = session.Status is BookingSessionStatus.Arrived or BookingSessionStatus.InProgress,
            VerificationLocked = session.VerificationAttempts >= _verificationCodeService.MaxAttempts,
            CompletionLocked = session.VerificationAttempts >= _verificationCodeService.MaxAttempts,
            VerificationAttempts = session.VerificationAttempts,
            VerificationAttemptsRemaining = Math.Max(0, _verificationCodeService.MaxAttempts - session.VerificationAttempts),
            ParentSettled = parentSettled,
            SettlementStatus = parentSettled ? "settled" : null,
            Counts = counts
        };
    }

    private static DateTime BuildScheduledAt(BookingSession session)
    {
        return new DateTime(
            session.ScheduledDate.Year,
            session.ScheduledDate.Month,
            session.ScheduledDate.Day,
            session.ScheduledStartTime.Hour,
            session.ScheduledStartTime.Minute,
            session.ScheduledStartTime.Second,
            DateTimeKind.Utc);
    }

    private static string? FormatAddress(string? line1, string? city)
    {
        return string.IsNullOrWhiteSpace(line1)
            ? (string.IsNullOrWhiteSpace(city) ? null : city)
            : string.IsNullOrWhiteSpace(city)
                ? line1
                : line1 + ", " + city;
    }
}
