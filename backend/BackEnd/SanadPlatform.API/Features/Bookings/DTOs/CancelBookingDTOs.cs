namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Request body for POST /api/v1/bookings/{id}/cancel.
/// Both patients and providers may cancel; reason is optional.
/// </summary>
public class CancelBookingRequest
{
    /// <summary>Optional reason for the cancellation.</summary>
    public string? CancellationReason { get; init; }
}

/// <summary>
/// Response body for POST /api/v1/bookings/{id}/cancel (200 OK).
/// </summary>
public class CancelBookingResponse
{
    /// <summary>The booking identifier.</summary>
    public Guid Id { get; init; }

    /// <summary>The new status after cancellation (Cancelled).</summary>
    public string Status { get; init; } = string.Empty;

    /// <summary>Timestamp when the booking was cancelled.</summary>
    public DateTime? CancelledAt { get; init; }

    /// <summary>User ID that performed the cancellation.</summary>
    public Guid? CancelledBy { get; init; }

    /// <summary>Reason provided for the cancellation.</summary>
    public string? CancellationReason { get; init; }

    /// <summary>User ID that triggered the latest status change.</summary>
    public Guid? StatusChangedBy { get; init; }

    /// <summary>Canonical lifecycle reason recorded for the cancellation transition.</summary>
    public string? StatusChangeReason { get; init; }

    /// <summary>Amount refunded to the patient (0 if no refund).</summary>
    public decimal? RefundAmount { get; init; }

    /// <summary>Status of the refund (e.g. "pending", null if no refund).</summary>
    public string? RefundStatus { get; init; }

    /// <summary>The canonical payment identifier, when present.</summary>
    public Guid? PaymentId { get; init; }

    /// <summary>The canonical payment status after cancellation.</summary>
    public string? PaymentStatus { get; init; }
}
