namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Request body for POST /api/v1/bookings/{id}/validate.
/// The patient provides the validation code to release payment.
/// </summary>
public class ValidateBookingRequest
{
    /// <summary>The 6-digit validation code shared with the patient.</summary>
    public string ValidationCode { get; init; } = string.Empty;
}

/// <summary>
/// Response body for POST /api/v1/bookings/{id}/validate (200 OK).
/// </summary>
public class ValidateBookingResponse
{
    /// <summary>The booking identifier.</summary>
    public Guid Id { get; init; }

    /// <summary>The new status after validation (Validated).</summary>
    public string Status { get; init; } = string.Empty;

    /// <summary>Timestamp when the booking was validated.</summary>
    public DateTime? ValidatedAt { get; init; }

    /// <summary>The canonical payment identifier, when present.</summary>
    public Guid? PaymentId { get; init; }

    /// <summary>The canonical payment status after validation.</summary>
    public string? PaymentStatus { get; init; }

    /// <summary>Timestamp of the last update.</summary>
    public DateTime UpdatedAt { get; init; }
}
