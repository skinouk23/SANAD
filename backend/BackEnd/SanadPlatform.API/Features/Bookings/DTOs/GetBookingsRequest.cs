namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Request DTO for getting bookings with pagination, filtering, and sorting.
/// Validation is enforced by GetBookingsQueryValidator (FluentValidation).
/// </summary>
public class GetBookingsRequest
{
    /// <summary>
    /// Page number (1-based). Default: 1.
    /// </summary>
    public int Page { get; set; } = 1;

    /// <summary>
    /// Number of items per page. Default: 20.
    /// </summary>
    public int Limit { get; set; } = 20;

    /// <summary>
    /// Filter by booking status: Pending, Confirmed, InProgress, Completed, Cancelled, etc.
    /// Optional — if null, returns all statuses.
    /// </summary>
    public string? Status { get; set; }

    /// <summary>
    /// Filter bookings on or after this date. Format: yyyy-MM-dd.
    /// </summary>
    public DateOnly? StartDateFrom { get; set; }

    /// <summary>
    /// Filter bookings on or before this date. Format: yyyy-MM-dd.
    /// </summary>
    public DateOnly? StartDateTo { get; set; }

    /// <summary>
    /// Filter by provider ID (admin/patient view only).
    /// </summary>
    public Guid? ProviderId { get; set; }

    /// <summary>
    /// Filter by patient ID (admin/provider view only).
    /// </summary>
    public Guid? PatientId { get; set; }

    /// <summary>
    /// Filter by service ID.
    /// </summary>
    public Guid? ServiceId { get; set; }

    /// <summary>
    /// Search by booking number or patient/provider name.
    /// </summary>
    public string? SearchQuery { get; set; }

    /// <summary>
    /// Sort field: startDate, bookingNumber, status, createdAt. Default: startDate.
    /// </summary>
    public string SortBy { get; set; } = "startDate";

    /// <summary>
    /// Sort descending when true; ascending when false. Default: false (ascending).
    /// </summary>
    public bool SortDesc { get; set; } = false;

    /// <summary>
    /// Filter by service category (e.g., "equipment_rental", "nursing").
    /// </summary>
    public string? ServiceCategory { get; set; }
}
