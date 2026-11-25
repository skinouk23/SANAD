using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Providers.DTOs;

namespace SanadPlatform.API.Features.Bookings.Repository;

/// <summary>
/// Repository interface for booking session data access operations.
/// </summary>
public interface IBookingSessionRepository
{
    Task<BookingSession> CreateAsync(BookingSession session, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<BookingSession>> CreateRangeAsync(IReadOnlyList<BookingSession> sessions, CancellationToken cancellationToken = default);

    Task<BookingSession?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<BookingSession?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default);

    Task<BookingSession?> GetByIdWithBookingForUpdateAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<BookingSession>> GetByBookingIdForUpdateAsync(Guid bookingId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<BookingSession>> GetByBookingIdAsync(Guid bookingId, CancellationToken cancellationToken = default);

    Task<BookingSession?> GetFirstNonTerminalByBookingIdForUpdateAsync(Guid bookingId, CancellationToken cancellationToken = default);

    Task<(IReadOnlyList<BookingSession> Items, int TotalCount)> GetSessionsAsync(
        Guid? bookingId,
        Guid? patientId,
        Guid? providerId,
        BookingSessionStatus? status,
        DateOnly? dateFrom,
        DateOnly? dateTo,
        string sortBy,
        bool sortDesc,
        int page,
        int limit,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyDictionary<Guid, BookingSessionCountsResponse>> GetSessionCountsByBookingIdsAsync(
        IReadOnlyCollection<Guid> bookingIds,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<BookingSession>> GetProviderSessionsByDateRangeAsync(
        Guid providerId,
        DateOnly startDate,
        DateOnly endDate,
        IReadOnlyCollection<BookingSessionStatus> statuses,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<BookingTimeSlotWithDateDto>> GetActiveProviderTimeSlotsForRangeAsync(
        Guid providerId,
        DateOnly startDate,
        DateOnly endDate,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<BookingTimeSlotDto>> GetActiveProviderTimeSlotsAsync(
        Guid providerId,
        DateOnly date,
        CancellationToken cancellationToken = default);

    Task<bool> HasSessionsAsync(Guid bookingId, CancellationToken cancellationToken = default);
}
