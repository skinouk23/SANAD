using SanadPlatform.API.Common.Models;

namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Unified response for GET /api/v1/bookings — a single items list for all roles.
/// Role-specific fields within each <see cref="BookingListItemResponse"/> are null
/// when not applicable to the caller's role (patient, provider, or admin).
/// </summary>
public class GetBookingsResponse
{
    /// <summary>
    /// The paginated list of bookings. Unified across all roles.
    /// </summary>
    public IReadOnlyList<BookingListItemResponse> Items { get; init; } = [];

    /// <summary>
    /// Pagination metadata.
    /// </summary>
    public PaginationMetadata Pagination { get; init; } = new();
}
