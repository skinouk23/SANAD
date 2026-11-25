using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Bookings.Entities;

namespace SanadPlatform.API.Features.Bookings.Services;

/// <summary>
/// Generates executable sessions for parent bookings.
/// </summary>
public interface IBookingSessionGenerationService
{
    IReadOnlyList<BookingSession> GenerateSessions(Booking booking);
}

/// <summary>
/// Default session generator. Multi-day care creates one session per day; all other bookings
/// receive one default session.
/// </summary>
public class BookingSessionGenerationService : IBookingSessionGenerationService
{
    private static readonly HashSet<string> MultiDayCareCategories = new(StringComparer.OrdinalIgnoreCase)
    {
        ServiceCategories.Nursing,
        ServiceCategories.ElderlyCare,
        ServiceCategories.NightCare,
        ServiceCategories.ChronicCare,
        ServiceCategories.MedicalCompanion,
        ServiceCategories.Babysitting,
        ServiceCategories.Doctor
    };

    public IReadOnlyList<BookingSession> GenerateSessions(Booking booking)
    {
        ArgumentNullException.ThrowIfNull(booking);

        var dates = ShouldGenerateDailySessions(booking)
            ? EnumerateDates(booking.StartDate, booking.EndDate)
            : [booking.StartDate];

        return dates.Select(date => new BookingSession
            {
                Id = Guid.NewGuid(),
                BookingId = booking.Id,
                Booking = booking,
                ProviderId = booking.ProviderId,
                PatientId = booking.PatientId,
                ScheduledDate = date,
                ScheduledStartTime = booking.DailyStartTime,
                ScheduledEndTime = booking.DailyEndTime,
                ScheduledDurationMinutes = booking.DailyDurationMinutes,
                Timezone = booking.Timezone,
                Status = MapInitialSessionStatus(booking.Status),
                ProviderDepartedAt = booking.ProviderDepartedAt,
                ProviderArrivedAt = booking.ProviderArrivedAt,
                ServiceStartedAt = booking.ServiceStartedAt,
                ServiceCompletedAt = booking.ServiceCompletedAt,
                VerifiedAt = booking.ValidatedAt,
                VerificationMethod = booking.ValidationMethod,
                CancelledAt = booking.CancelledAt,
                CancelledBy = booking.CancelledBy,
                CancellationReason = booking.CancellationReason
            })
            .ToList()
            .AsReadOnly();
    }

    private static bool ShouldGenerateDailySessions(Booking booking)
    {
        return booking.EndDate > booking.StartDate
            && booking.Service != null
            && MultiDayCareCategories.Contains(booking.Service.Category);
    }

    private static IEnumerable<DateOnly> EnumerateDates(DateOnly startDate, DateOnly endDate)
    {
        for (var date = startDate; date <= endDate; date = date.AddDays(1))
        {
            yield return date;
        }
    }

    private static BookingSessionStatus MapInitialSessionStatus(BookingStatus status)
    {
        return status switch
        {
            BookingStatus.Pending => BookingSessionStatus.Pending,
            BookingStatus.Confirmed => BookingSessionStatus.Confirmed,
            BookingStatus.ProviderOnWay => BookingSessionStatus.ProviderOnWay,
            BookingStatus.InProgress => BookingSessionStatus.InProgress,
            BookingStatus.Completed => BookingSessionStatus.Completed,
            BookingStatus.Validated => BookingSessionStatus.Validated,
            BookingStatus.Cancelled => BookingSessionStatus.Cancelled,
            BookingStatus.NoShow => BookingSessionStatus.NoShow,
            BookingStatus.Disputed => BookingSessionStatus.Disputed,
            _ => BookingSessionStatus.Pending
        };
    }
}
