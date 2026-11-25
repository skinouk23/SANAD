using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Providers.DTOs;

namespace SanadPlatform.API.Features.Bookings.Services;

/// <summary>
/// Maps session-backed provider list and planning DTOs while preserving existing response contracts.
/// </summary>
public static class BookingSessionListItemMapper
{
    public static BookingListItemResponse ToBookingListItem(
        BookingSession session,
        BookingSessionCountsResponse counts)
    {
        var booking = session.Booking;
        return new BookingListItemResponse
        {
            Id = booking.Id,
            SessionId = session.Id,
            BookingNumber = booking.BookingNumber,
            Status = booking.Status.ToString(),
            SessionStatus = session.Status.ToString(),
            PaymentMethod = booking.PaymentMethod,
            PaymentId = booking.Payment?.Id,
            PaymentStatus = booking.Payment?.Status,
            PaymentMethodType = booking.Payment?.MethodType,
            PaymentReferenceNumber = booking.Payment?.ReferenceNumber,
            Type = booking.ServiceLocation ?? "home",
            ScheduledAt = BuildScheduledAt(session),
            StartDate = session.ScheduledDate,
            EndDate = session.ScheduledDate,
            DailyStartTime = session.ScheduledStartTime.ToTimeSpan(),
            DailyEndTime = session.ScheduledEndTime?.ToTimeSpan(),
            DailyDurationMinutes = session.ScheduledDurationMinutes,
            DayCount = 1,
            PerDaySubtotal = booking.ServicePrice + booking.AddonsPrice,
            PlatformFee = booking.PlatformFee,
            TotalAmount = booking.TotalAmount,
            Currency = booking.Currency,
            Address = FormatAddress(booking.AddressLine1, booking.City),
            Location = new ProviderBookingDeliveryLocationResponse
            {
                Lat = booking.Latitude,
                Lng = booking.Longitude,
                Address = FormatAddress(booking.AddressLine1, booking.City)
            },
            Service = booking.Service == null ? null : new BookingListServiceDto
            {
                Name = booking.Service.Name,
                Category = booking.Service.Category
            },
            LineItems = booking.LineItems
                .Select(item => new BookingLineItemResponse
                {
                    Id = item.Id,
                    ServiceId = item.ServiceId,
                    ServiceName = item.ServiceName,
                    ServiceCategory = item.ServiceCategory,
                    Currency = item.Currency,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    Subtotal = item.Subtotal
                })
                .ToList()
                .AsReadOnly(),
            SessionCounts = counts,
            Provider = null,
            Notes = null,
            ValidationCode = null,
            AutoValidateAt = booking.AutoValidateAt,
            ProviderAcceptedAt = booking.ProviderAcceptedAt,
            ProviderDepartedAt = session.ProviderDepartedAt,
            ProviderArrivedAt = session.ProviderArrivedAt,
            ServiceStartedAt = session.ServiceStartedAt,
            ServiceCompletedAt = session.ServiceCompletedAt,
            ValidatedAt = session.VerifiedAt,
            CancelledAt = session.CancelledAt,
            CancelledBy = session.CancelledBy,
            CancellationReason = session.CancellationReason,
            StatusChangedBy = booking.StatusChangedBy,
            StatusChangeReason = booking.StatusChangeReason,
            Patient = new BookingListPatientDto
            {
                Id = booking.PatientId,
                Name = booking.PatientName,
                Phone = session.Status.ToString() == "Cancelled" ? null : booking.PatientPhone
            },
            ProviderAmount = booking.ProviderAmount
        };
    }

    public static ProviderPlanningBookingResponse ToProviderPlanningItem(BookingSession session)
    {
        var booking = session.Booking;
        return new ProviderPlanningBookingResponse
        {
            Id = session.Id,
            BookingId = booking.Id,
            SessionId = session.Id,
            BookingNumber = booking.BookingNumber,
            Status = booking.Status.ToString(),
            SessionStatus = session.Status.ToString(),
            PaymentMethod = booking.PaymentMethod,
            Type = booking.ServiceLocation ?? "home",
            ScheduledAt = BuildScheduledAt(session),
            StartDate = session.ScheduledDate,
            EndDate = session.ScheduledDate,
            DailyStartTime = session.ScheduledStartTime.ToTimeSpan(),
            DailyEndTime = session.ScheduledEndTime?.ToTimeSpan(),
            DailyDurationMinutes = session.ScheduledDurationMinutes,
            DayCount = 1,
            TotalAmount = booking.TotalAmount,
            Currency = booking.Currency,
            Address = FormatAddress(booking.AddressLine1, booking.City),
            Location = new ProviderBookingDeliveryLocationResponse
            {
                Lat = booking.Latitude,
                Lng = booking.Longitude,
                Address = FormatAddress(booking.AddressLine1, booking.City)
            },
            Notes = booking.PatientNotes,
            Service = booking.Service == null ? null : new BookingListServiceDto
            {
                Name = booking.Service.Name,
                Category = booking.Service.Category
            },
            Patient = new BookingListPatientDto
            {
                Id = booking.PatientId,
                Name = booking.PatientName,
                Phone = booking.PatientPhone
            },
            ProviderAmount = booking.ProviderAmount,
            AutoValidateAt = booking.AutoValidateAt,
            ProviderAcceptedAt = booking.ProviderAcceptedAt,
            ProviderDepartedAt = session.ProviderDepartedAt,
            ProviderArrivedAt = session.ProviderArrivedAt,
            ServiceStartedAt = session.ServiceStartedAt,
            ServiceCompletedAt = session.ServiceCompletedAt,
            ValidatedAt = session.VerifiedAt,
            CancelledAt = session.CancelledAt,
            CancelledBy = session.CancelledBy,
            CancellationReason = session.CancellationReason,
            StatusChangedBy = booking.StatusChangedBy,
            StatusChangeReason = booking.StatusChangeReason
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
