using SanadPlatform.API.Features.Providers;

namespace SanadPlatform.API.Features.Providers.DTOs;

/// <summary>
/// DTO for creating a provider
/// </summary>
public class CreateProviderRequest
{
    public string ServiceCategory { get; set; } = string.Empty;
    public bool IsIndividual { get; set; } = true;
    public string? BusinessName { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Bio { get; set; }
    public string? ShortDescription { get; set; }
    public string? AddressLine1 { get; set; }
    public string? City { get; set; }
    public string CountryCode { get; set; } = "TN";
}

/// <summary>
/// DTO for updating a provider
/// </summary>
public class UpdateProviderRequest
{
    public string? BusinessName { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Bio { get; set; }
    public string? ShortDescription { get; set; }
    public string? AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public string? City { get; set; }
    public string? StateProvince { get; set; }
    public string? PostalCode { get; set; }
    public string? CountryCode { get; set; }
}

/// <summary>
/// DTO for updating current provider's own profile (PUT /api/providers/me)
/// </summary>
public class UpdateMyProviderProfileRequest
{
    public string? BusinessName { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Specialization { get; set; }
    public string? Bio { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? PostalCode { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public int? ServiceRadius { get; set; }

    /// <summary>
    /// Persisted subtype update for nutrition providers only.
    /// Omit this field to preserve the existing subtype during a partial profile update.
    /// </summary>
    public string? NutritionProviderSubtype { get; set; }

    /// <summary>IANA timezone identifier (e.g. "Africa/Tunis", "Europe/Paris").</summary>
    public string? Timezone { get; set; }
}

// ==================== Provider Availability ====================

/// <summary>
/// Request payload for updating the authenticated provider's availability status (PUT /api/providers/me/availability).
/// </summary>
public record UpdateProviderAvailabilityRequest(bool Available);

/// <summary>
/// Response payload returned after updating the authenticated provider's availability status.
/// </summary>
public record UpdateProviderAvailabilityResponse
{
    public Guid Id { get; init; }
    public bool Available { get; init; }
    public DateTime UpdatedAt { get; init; }
}

/// <summary>
/// Request payload for admin provider verification status transitions.
/// Verification status values use lower snake-case.
/// </summary>
public record UpdateProviderVerificationStatusRequest
{
    public string VerificationStatus { get; init; } = string.Empty;
}

/// <summary>
/// Response payload for provider verification state changes.
/// </summary>
public record ProviderVerificationStateResponse
{
    public bool IsVerified { get; init; }
    public bool IsApproved { get; init; }
    public DateTime? ApprovedAt { get; init; }
    public Guid? ApprovedBy { get; init; }
    public string? RejectionReason { get; init; }
    public bool VerificationConsentGiven { get; init; }
    public string VerificationStatus { get; init; } = ProviderConstants.VerificationStatuses.NotRequested;
    public DateTime? VerificationRequestedAt { get; init; }
    public DateTime? VerificationReviewedAt { get; init; }
    public bool CanRequestVerification { get; init; }
}

/// <summary>
/// Request payload for rejecting a provider application.
/// </summary>
public record RejectProviderApplicationRequest
{
    public string Reason { get; init; } = string.Empty;
}

/// <summary>
/// DTO for provider response (public/listing use)
/// </summary>
public class ProviderResponse
{
    public Guid Id { get; set; }
    public string ServiceCategory { get; set; } = string.Empty;
    public string? NutritionProviderSubtype { get; set; }
    public bool IsIndividual { get; set; }
    public string? BusinessName { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Bio { get; set; }
    public string? ShortDescription { get; set; }
    public string? AddressLine1 { get; set; }
    public string? City { get; set; }
    public string CountryCode { get; set; } = string.Empty;
    public decimal RatingAverage { get; set; }
    public int RatingCount { get; set; }
    public bool IsVerified { get; set; }
    public bool IsAvailable { get; set; }
    public string AvailabilityStatus { get; set; } = string.Empty;
    public Guid? AvatarFileId { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public IReadOnlyList<string> Specialties { get; set; } = Array.Empty<string>();
    public DateTime CreatedAt { get; set; }

    /// <summary>Lowest active-service price in the filtered category. Null when no category filter.</summary>
    public decimal? MinPrice { get; set; }

    /// <summary>Count of active services in the filtered category. 0 when no category filter.</summary>
    public int ServiceCount { get; set; }
}

/// <summary>
/// DTO for provider detail response (public/detail use only).
/// </summary>
public class ProviderDetailResponse
{
    public Guid Id { get; set; }
    public string ServiceCategory { get; set; } = string.Empty;
    public string? NutritionProviderSubtype { get; set; }
    public bool IsIndividual { get; set; }
    public string? BusinessName { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Bio { get; set; }
    public string? ShortDescription { get; set; }
    public string? AddressLine1 { get; set; }
    public string? City { get; set; }
    public string CountryCode { get; set; } = string.Empty;
    public decimal RatingAverage { get; set; }
    public int RatingCount { get; set; }
    public bool IsVerified { get; set; }
    public bool IsAvailable { get; set; }
    public string AvailabilityStatus { get; set; } = string.Empty;
    public Guid? AvatarFileId { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public int YearsOfExperience { get; set; }
    public IReadOnlyList<string> Specialties { get; set; } = Array.Empty<string>();
    public string? Phone { get; set; }

    /// <summary>IANA timezone identifier (e.g. "Africa/Tunis", "Europe/Paris").</summary>
    public string Timezone { get; set; } = "Africa/Tunis";

    /// <summary>Provider-specific commission rate percentage used to price public bookings.</summary>
    public decimal CommissionRate { get; set; }

    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// DTO for GET /api/providers/me — authenticated provider's own profile.
/// Field names match the API spec. Fields are mapped from Provider entity properties.
/// </summary>
public class ProviderProfileResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    /// <summary>Mapped from Provider.ServiceCategory</summary>
    public string ServiceType { get; set; } = string.Empty;

    /// <summary>Mapped from Provider.NutritionProviderSubtype when present; otherwise null.</summary>
    public string? NutritionProviderSubtype { get; set; }

    public string? BusinessName { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? LicenseNumber { get; set; }

    /// <summary>Mapped from Provider.Specializations (first entry or joined)</summary>
    public string? Specialization { get; set; }

    public int YearsOfExperience { get; set; }
    public string? Bio { get; set; }

    /// <summary>Mapped from Provider.AddressLine1</summary>
    public string? Address { get; set; }

    public string? City { get; set; }
    public string? PostalCode { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }

    /// <summary>Mapped from Provider.ServiceRadiusKm</summary>
    public int ServiceRadius { get; set; }

    /// <summary>Mapped from Provider.RatingAverage</summary>
    public decimal Rating { get; set; }

    /// <summary>Mapped from Provider.RatingCount</summary>
    public int TotalReviews { get; set; }

    public int TotalBookings { get; set; }
    public bool IsApproved { get; set; }
    public bool IsVerified { get; set; }
    public bool VerificationConsentGiven { get; set; }
    public string VerificationStatus { get; set; } = ProviderConstants.VerificationStatuses.NotRequested;
    public DateTime? VerificationRequestedAt { get; set; }
    public DateTime? VerificationReviewedAt { get; set; }
    public bool CanRequestVerification { get; set; }

    /// <summary>Mapped from Provider.ApprovedAt</summary>
    public DateTime? ApprovalDate { get; set; }

    public string SubscriptionTier { get; set; } = string.Empty;
    public Guid? AvatarFileId { get; set; }
    public string? CoverImageUrl { get; set; }

    /// <summary>Mapped from Provider.IsAvailable (no dedicated online/offline column exists)</summary>
    public bool IsOnline { get; set; }

    /// <summary>Mapped from Provider.ResponseRate</summary>
    public decimal ResponseRate { get; set; }

    /// <summary>Mapped from Provider.ResponseTimeMinutes</summary>
    public int AverageResponseTimeMinutes { get; set; }

    /// <summary>
    /// Computed: CompletedBookings / TotalBookings * 100.
    /// Returns 0 if TotalBookings is 0.
    /// </summary>
    public decimal CompletionRate { get; set; }

    /// <summary>IANA timezone identifier (e.g. "Africa/Tunis", "Europe/Paris").</summary>
    public string Timezone { get; set; } = "Africa/Tunis";

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

// ==================== Provider Dashboard ====================

/// <summary>
/// Provider identity and status information for the dashboard response.
/// </summary>
public record ProviderDashboardProviderInfo
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string ProviderType { get; init; } = string.Empty;
    public IReadOnlyList<string> Specialties { get; init; } = Array.Empty<string>();
    public decimal Rating { get; init; }
    public int ReviewCount { get; init; }
    public bool Available { get; init; }
    public bool IsVerified { get; init; }
    public bool VerificationConsentGiven { get; init; }
    public string VerificationStatus { get; init; } = ProviderConstants.VerificationStatuses.NotRequested;
    public DateTime? VerificationRequestedAt { get; init; }
    public DateTime? VerificationReviewedAt { get; init; }
    public bool CanRequestVerification { get; init; }
    public string SubscriptionTier { get; init; } = string.Empty;
    public decimal AvailableBalance { get; init; }
}

/// <summary>
/// Appointment statistics included in the provider dashboard.
/// </summary>
public record ProviderDashboardAppointmentStats
{
    public int TodayCount { get; init; }
    public int WeekCount { get; init; }
    public decimal CompletionRate { get; init; }
}

/// <summary>
/// Revenue statistics included in the provider dashboard.
/// </summary>
public record ProviderDashboardRevenueStats
{
    public decimal ThisWeekRevenue { get; init; }
    public decimal ThisMonthRevenue { get; init; }
}

/// <summary>
/// Response payload for GET /api/providers/me/dashboard.
/// </summary>
public record ProviderDashboardResponse
{
    public ProviderDashboardProviderInfo Provider { get; init; } = null!;
    public ProviderDashboardAppointmentStats AppointmentStats { get; init; } = null!;
    public ProviderDashboardRevenueStats RevenueStats { get; init; } = null!;
}
