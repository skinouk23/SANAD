using SanadPlatform.API.Common.Models;

namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Request filters for session list endpoints.
/// </summary>
public record GetBookingSessionsRequest
{
    public Guid? BookingId { get; init; }

    public Guid? PatientId { get; init; }

    public Guid? ProviderId { get; init; }

    public string? Status { get; init; }

    public DateOnly? DateFrom { get; init; }

    public DateOnly? ScheduledDateFrom { get; init; }

    public DateOnly? StartDateFrom { get; init; }

    public DateOnly? DateTo { get; init; }

    public DateOnly? ScheduledDateTo { get; init; }

    public DateOnly? StartDateTo { get; init; }

    public string SortBy { get; init; } = "scheduledDate";

    public bool SortDesc { get; init; }

    public int Page { get; init; } = 1;

    public int Limit { get; init; } = 20;
}

/// <summary>
/// Paginated booking session list response.
/// </summary>
public record GetBookingSessionsResponse
{
    public IReadOnlyList<BookingSessionResponse> Items { get; init; } = [];

    public PaginationMetadata Pagination { get; init; } = new();
}

/// <summary>
/// Shared booking session DTO returned to authorised callers.
/// </summary>
public record BookingSessionResponse
{
    public Guid Id { get; init; }

    public Guid BookingId { get; init; }

    public string BookingNumber { get; init; } = string.Empty;

    public string Status { get; init; } = string.Empty;

    public string ParentStatus { get; init; } = string.Empty;

    public Guid ProviderId { get; init; }

    public Guid PatientId { get; init; }

    public DateOnly ScheduledDate { get; init; }

    public TimeSpan ScheduledStartTime { get; init; }

    public TimeSpan? ScheduledEndTime { get; init; }

    public int? ScheduledDurationMinutes { get; init; }

    public DateTime ScheduledAt { get; init; }

    public string Timezone { get; init; } = "Africa/Tunis";

    public string? ServiceName { get; init; }

    public string? ServiceCategory { get; init; }

    public string? PatientName { get; init; }

    public string? PatientPhone { get; init; }

    public string? ProviderName { get; init; }

    public string? ProviderPhone { get; init; }

    public string? Address { get; init; }

    public ProviderBookingDeliveryLocationResponse Location { get; init; } = new();

    public string? Notes { get; init; }

    public decimal TotalAmount { get; init; }

    public string Currency { get; init; } = "TND";

    public DateTime? ProviderDepartedAt { get; init; }

    public DateTime? ProviderArrivedAt { get; init; }

    public DateTime? ServiceStartedAt { get; init; }

    public DateTime? ServiceCompletedAt { get; init; }

    public DateTime? VerifiedAt { get; init; }

    public int? Rating { get; init; }

    public string? ReviewComment { get; init; }

    public string? VerificationMethod { get; init; }

    public bool VerificationCodeRequired { get; init; }

    public bool VerificationLocked { get; init; }

    public int VerificationAttempts { get; init; }

    public int VerificationAttemptsRemaining { get; init; }

    public DateTime? VerificationCodeExpiresAt { get; init; }

    public string? VerificationCode { get; init; }

    public DateTime? CancelledAt { get; init; }

    public Guid? CancelledBy { get; init; }

    public string? CancellationReason { get; init; }

    public DateTime? NoShowAt { get; init; }

    public string? NoShowReason { get; init; }

    public DateTime? DisputedAt { get; init; }

    public string? DisputeReason { get; init; }

    public BookingSessionCountsResponse Counts { get; init; } = new();
}

/// <summary>
/// Provider-facing session delivery DTO. It never exposes the verification code.
/// </summary>
public record ProviderBookingSessionDeliveryResponse
{
    public Guid Id { get; init; }

    public Guid SessionId { get; init; }

    public Guid BookingId { get; init; }

    public string BookingNumber { get; init; } = string.Empty;

    public string Status { get; init; } = string.Empty;

    public string ParentStatus { get; init; } = string.Empty;

    public string BookingStatus { get; init; } = string.Empty;

    public string PaymentMethod { get; init; } = string.Empty;

    public Guid? PaymentId { get; init; }

    public string? PaymentStatus { get; init; }

    public string? PaymentMethodType { get; init; }

    public string? PaymentReferenceNumber { get; init; }

    public DateTime ScheduledAt { get; init; }

    public DateOnly ScheduledDate { get; init; }

    public DateOnly StartDate { get; init; }

    public DateOnly EndDate { get; init; }

    public TimeSpan ScheduledStartTime { get; init; }

    public TimeSpan? ScheduledEndTime { get; init; }

    public TimeSpan DailyStartTime { get; init; }

    public TimeSpan? DailyEndTime { get; init; }

    public int? DailyDurationMinutes { get; init; }

    public string Timezone { get; init; } = "Africa/Tunis";

    public string? PatientName { get; init; }

    public string? PatientPhone { get; init; }

    public string? ProviderPhone { get; init; }

    public string? ServiceName { get; init; }

    public string? ServiceCategory { get; init; }

    public string? Notes { get; init; }

    public decimal TotalAmount { get; init; }

    public string Currency { get; init; } = "TND";

    public ProviderBookingDeliveryLocationResponse Location { get; init; } = new();

    public DateTime? ProviderDepartedAt { get; init; }

    public DateTime? ProviderArrivedAt { get; init; }

    public DateTime? ServiceStartedAt { get; init; }

    public DateTime? ServiceCompletedAt { get; init; }

    public DateTime? VerifiedAt { get; init; }

    public bool VerificationCodeRequired { get; init; }

    public bool RequiresVerificationCode { get; init; }

    public bool VerificationLocked { get; init; }

    public bool CompletionLocked { get; init; }

    public int VerificationAttemptsRemaining { get; init; }

}

/// <summary>
/// Request payload for completing a session with the patient-provided code.
/// </summary>
public record CompleteBookingSessionRequest
{
    public string ValidationCode { get; init; } = string.Empty;
}

/// <summary>
/// Request payload for opening a session dispute.
/// </summary>
public record DisputeBookingSessionRequest
{
    public string Reason { get; init; } = string.Empty;

    public string? DisputeReason { get; init; }
}

/// <summary>
/// Request payload for cancelling a future session.
/// </summary>
public record CancelBookingSessionRequest
{
    public string? CancellationReason { get; init; }
}

/// <summary>
/// Request payload for marking a session as no-show.
/// </summary>
public record MarkNoShowBookingSessionRequest
{
    public string? NoShowReason { get; init; }
}

/// <summary>
/// Response returned by session state-changing endpoints.
/// </summary>
public record BookingSessionActionResponse
{
    public Guid Id { get; init; }

    public Guid SessionId { get; init; }

    public Guid BookingId { get; init; }

    public string Status { get; init; } = string.Empty;

    public string ParentStatus { get; init; } = string.Empty;

    public string BookingStatus { get; init; } = string.Empty;

    public DateTime? ProviderDepartedAt { get; init; }

    public DateTime? ProviderArrivedAt { get; init; }

    public DateTime? ServiceStartedAt { get; init; }

    public DateTime? ServiceCompletedAt { get; init; }

    public DateTime? VerifiedAt { get; init; }

    public DateTime? CancelledAt { get; init; }

    public Guid? CancelledBy { get; init; }

    public string? CancellationReason { get; init; }

    public DateTime? NoShowAt { get; init; }

    public string? NoShowReason { get; init; }

    public DateTime? DisputedAt { get; init; }

    public decimal? AllocatedSessionAmount { get; init; }

    public decimal? CancellationFee { get; init; }

    public decimal? RefundAmount { get; init; }

    public string? RefundStatus { get; init; }

    public Guid? PaymentId { get; init; }

    public string? PaymentStatus { get; init; }

    public bool VerificationCodeRequired { get; init; }

    public bool RequiresVerificationCode { get; init; }

    public bool VerificationLocked { get; init; }

    public bool CompletionLocked { get; init; }

    public int VerificationAttempts { get; init; }

    public int VerificationAttemptsRemaining { get; init; }

    public bool ParentSettled { get; init; }

    public string? SettlementStatus { get; init; }

    public BookingSessionCountsResponse Counts { get; init; } = new();
}

/// <summary>
/// Provider-facing patient location snapshot for delivery and planning views.
/// </summary>
public record ProviderBookingDeliveryLocationResponse
{
    public decimal? Lat { get; init; }

    public decimal? Lng { get; init; }

    public string? Address { get; init; }
}
