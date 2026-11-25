namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Response DTO for a booking detail view.
/// </summary>
public class BookingResponse
{
    public Guid Id { get; init; }

    public string BookingNumber { get; init; } = string.Empty;

    public Guid PatientId { get; init; }

    public Guid ProviderId { get; init; }

    public Guid PrimaryServiceId { get; init; }

    public DateOnly StartDate { get; init; }

    public DateOnly EndDate { get; init; }

    public TimeSpan DailyStartTime { get; init; }

    public TimeSpan? DailyEndTime { get; init; }

    public int? DailyDurationMinutes { get; init; }

    public int DayCount { get; init; }

    public string Timezone { get; init; } = "Africa/Tunis";

    // ==================== Status ====================

    public string Status { get; init; } = string.Empty;

    public string PaymentMethod { get; init; } = string.Empty;

    public Guid? PaymentId { get; init; }

    public string? PaymentStatus { get; init; }

    public string? PaymentMethodType { get; init; }

    public string? PaymentReferenceNumber { get; init; }

    // ==================== Patient Info (decrypted snapshot) ====================

    public string PatientName { get; init; } = string.Empty;

    public string? PatientPhoneNumber { get; init; }

    public string? PatientEmail { get; init; }

    // ==================== Provider Info ====================

    public string ProviderName { get; init; } = string.Empty;

    public string? ProviderPhoneNumber { get; init; }

    public string? ProviderProfilePhotoUrl { get; init; }

    // ==================== Primary Service Info ====================

    public string ServiceName { get; init; } = string.Empty;

    public decimal? EstimatedCost { get; init; }

    // ==================== Location ====================

    public string ServiceModality { get; init; } = string.Empty;

    public string? ServiceCategory { get; init; }

    public string? AddressLine1 { get; init; }

    public string? AddressLine2 { get; init; }

    public string? City { get; init; }

    public string? PostalCode { get; init; }

    public decimal? Latitude { get; init; }

    public decimal? Longitude { get; init; }

    public string? AddressInstructions { get; init; }

    // ==================== Pricing ====================

    public decimal PerDaySubtotal { get; init; }

    public decimal PlatformFee { get; init; }

    public decimal TotalAmount { get; init; }

    public string Currency { get; init; } = "TND";

    // ==================== Booking Metadata ====================

    public bool IsProviderConfirmed { get; init; }

    public DateTime? ProviderConfirmedAt { get; init; }

    public bool IsRescheduleRequested { get; init; }

    public int RescheduleCount { get; init; }

    public DateTime? AutoValidateAt { get; init; }

    public DateTime? ProviderAcceptedAt { get; init; }

    public DateTime? ProviderDepartedAt { get; init; }

    public DateTime? ProviderArrivedAt { get; init; }

    public DateTime? ServiceStartedAt { get; init; }

    public DateTime? ServiceCompletedAt { get; init; }

    public DateTime? ValidatedAt { get; init; }

    public DateTime? CancelledAt { get; init; }

    public Guid? CancelledBy { get; init; }

    public string? CancellationReason { get; init; }

    public Guid? StatusChangedBy { get; init; }

    public string? StatusChangeReason { get; init; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; init; }

    public DateTime UpdatedAt { get; init; }

    // ==================== Related Data ====================

    public PatientSummary? Patient { get; init; }

    public ProviderSummary? Provider { get; init; }

    public ServiceSummary? Service { get; init; }

    public IReadOnlyList<BookingLineItemResponse> LineItems { get; init; } = [];

    public BookingSessionCountsResponse SessionCounts { get; init; } = new();

    public IReadOnlyList<BookingSessionResponse> Sessions { get; init; } = [];

    public class PatientSummary
    {
        public Guid Id { get; init; }

        public string FirstName { get; init; } = string.Empty;

        public string LastName { get; init; } = string.Empty;

        public string? ProfilePhotoUrl { get; init; }
    }

    public class ProviderSummary
    {
        public Guid Id { get; init; }

        public string FirstName { get; init; } = string.Empty;

        public string LastName { get; init; } = string.Empty;

        public string? ProfilePhotoUrl { get; init; }

        public decimal? AverageRating { get; init; }

        public int TotalReviews { get; init; }
    }

    public class ServiceSummary
    {
        public Guid Id { get; init; }

        public string Name { get; init; } = string.Empty;

        public string? Description { get; init; }

        public string Category { get; init; } = string.Empty;

        public decimal Price { get; init; }

        public int EstimatedDurationMinutes { get; init; }
    }
}
