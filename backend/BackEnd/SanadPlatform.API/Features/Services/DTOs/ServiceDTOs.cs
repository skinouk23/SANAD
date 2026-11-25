using System.Text.Json;
using SanadPlatform.API.Common.Models;

namespace SanadPlatform.API.Features.Services.DTOs;

// ==================== Sub-Service (Addon) DTOs ====================

/// <summary>
/// Request DTO for creating or updating a sub-service (addon) inline with its parent service.
/// </summary>
public record SubServiceRequest
{
    /// <summary>
    /// Existing addon ID — null for new addons, set for updates.
    /// </summary>
    public Guid? Id { get; init; }

    public string Name { get; init; } = string.Empty;

    public string? Description { get; init; }

    public decimal Price { get; init; }

    public int? DurationMinutes { get; init; }

    public string? Icon { get; init; }

    /// <summary>
    /// Whether this is a supplement (always included) vs. an optional extra.
    /// </summary>
    public bool IsSupplement { get; init; } = false;
}

/// <summary>
/// Response DTO for a sub-service (addon).
/// </summary>
public record SubServiceResponse
{
    public Guid Id { get; init; }

    public string Name { get; init; } = string.Empty;

    public string? Description { get; init; }

    public decimal Price { get; init; }

    public int? DurationMinutes { get; init; }

    public string? Icon { get; init; }

    public bool IsSupplement { get; init; }

    public bool IsActive { get; init; }
}

// ==================== Provider Service Request DTOs ====================

/// <summary>
/// Query-string parameters for the provider's paginated service list endpoint.
/// </summary>
public record GetProviderServicesRequest
{
    /// <summary>Optional free-text search filter.</summary>
    public string? Search { get; init; }

    /// <summary>Filter by active status (<c>null</c> = all).</summary>
    public bool? IsActive { get; init; }

    /// <summary>Column to sort by: <c>created</c>, <c>name</c>, <c>price</c>, or <c>bookings</c>.</summary>
    public string? SortBy { get; init; } = "created";

    /// <summary>When <c>true</c> (default) results are sorted descending (newest first).</summary>
    public bool SortDesc { get; init; } = true;

    /// <summary>One-based page number.</summary>
    public int Page { get; init; } = 1;

    /// <summary>Maximum items per page.</summary>
    public int Limit { get; init; } = 20;
}

/// <summary>
/// Request DTO for creating a new service.
/// </summary>
public record CreateServiceRequest
{
    public string Name { get; init; } = string.Empty;

    public string? Description { get; init; }

    public string? ShortDescription { get; init; }

    // ==================== Pricing ====================

    public decimal Price { get; init; }

    /// <summary>
    /// Pricing model: "fixed", "hourly", or "range".
    /// </summary>
    public string PriceType { get; init; } = "fixed";

    /// <summary>
    /// ISO 4217 currency code. Temporarily hardcoded to "TND".
    /// </summary>
    public string Currency { get; init; } = "TND";

    public decimal? MinPrice { get; init; }

    public decimal? MaxPrice { get; init; }

    // ==================== Duration ====================

    public int? DurationMinutes { get; init; }

    public int? MinDurationMinutes { get; init; }

    public int? MaxDurationMinutes { get; init; }

    // ==================== Location ====================

    /// <summary>
    /// Where the service is delivered: "home", "clinic", or "both".
    /// </summary>
    public string ServiceLocation { get; init; } = "home";

    // ==================== Requirements ====================

    public bool RequiresPrescription { get; init; } = false;

    public bool IsUrgent { get; init; } = false;

    public bool RequiresMedicalHistory { get; init; } = false;

    public int? AgeRestrictionMin { get; init; }

    public int? AgeRestrictionMax { get; init; }

    // ==================== Type-Specific Config ====================

    /// <summary>
    /// Native JSON object holding type-specific configuration (stored as JSONB in Metadata column).
    /// For equipment rental services this must contain <c>equipment_type_code</c>, <c>pricing</c>,
    /// and <c>deposit_amount</c>.
    /// </summary>
    public JsonElement? TypeConfig { get; init; }

    // ==================== Sub-Services ====================

    public IReadOnlyList<SubServiceRequest>? SubServices { get; init; }
}

/// <summary>
/// Request DTO for updating an existing service.
/// </summary>
public record UpdateServiceRequest
{
    public string? Name { get; init; }

    public string? Description { get; init; }

    public string? ShortDescription { get; init; }

    // ==================== Pricing ====================

    public decimal? Price { get; init; }

    public string? PriceType { get; init; }

    public string? Currency { get; init; }

    public decimal? MinPrice { get; init; }

    public decimal? MaxPrice { get; init; }

    // ==================== Duration ====================

    public int? DurationMinutes { get; init; }

    public int? MinDurationMinutes { get; init; }

    public int? MaxDurationMinutes { get; init; }

    // ==================== Location ====================

    public string? ServiceLocation { get; init; }

    // ==================== Requirements ====================

    public bool? RequiresPrescription { get; init; }

    public bool? IsUrgent { get; init; }

    public bool? RequiresMedicalHistory { get; init; }

    public int? AgeRestrictionMin { get; init; }

    public int? AgeRestrictionMax { get; init; }

    // ==================== Type-Specific Config ====================

    /// <summary>
    /// Native JSON object holding type-specific configuration (stored as JSONB in Metadata column).
    /// </summary>
    public JsonElement? TypeConfig { get; init; }

    // ==================== Sub-Services ====================

    /// <summary>
    /// Full replacement list of sub-services.
    /// Missing IDs are created; present IDs are updated; omitted existing IDs are removed.
    /// </summary>
    public IReadOnlyList<SubServiceRequest>? SubServices { get; init; }
}

/// <summary>
/// Request DTO for toggling a service's active status.
/// </summary>
public record ToggleServiceRequest
{
    public bool IsActive { get; init; }
}

// ==================== Provider Service Response DTOs ====================

/// <summary>
/// Full detail response DTO for a service (used by provider management endpoints).
/// </summary>
public record ServiceDetailResponse
{
    public Guid Id { get; init; }

    public Guid ProviderId { get; init; }

    /// <summary>
    /// Provider-inherited service category (free-form string).
    /// </summary>
    public string Category { get; init; } = string.Empty;

    public string Name { get; init; } = string.Empty;

    public string? Description { get; init; }

    public string? ShortDescription { get; init; }

    // ==================== Pricing ====================

    public decimal Price { get; init; }

    /// <summary>
    /// Pricing model: "fixed", "hourly", or "range".
    /// </summary>
    public string PriceType { get; init; } = "fixed";

    /// <summary>
    /// ISO 4217 currency code. Temporarily hardcoded to "TND".
    /// </summary>
    public string Currency { get; init; } = "TND";

    public decimal? MinPrice { get; init; }

    public decimal? MaxPrice { get; init; }

    // ==================== Duration ====================

    public int? DurationMinutes { get; init; }

    public int? MinDurationMinutes { get; init; }

    public int? MaxDurationMinutes { get; init; }

    // ==================== Location ====================

    /// <summary>
    /// Where the service is delivered: "home", "clinic", or "both".
    /// </summary>
    public string ServiceLocation { get; init; } = "home";

    // ==================== Status ====================

    public bool IsActive { get; init; }

    public bool IsFeatured { get; init; }

    // ==================== Requirements ====================

    public bool RequiresPrescription { get; init; }

    public bool IsUrgent { get; init; }

    public bool RequiresMedicalHistory { get; init; }

    public int? AgeRestrictionMin { get; init; }

    public int? AgeRestrictionMax { get; init; }

    // ==================== Media ====================

    public Guid? MainImageFileId { get; init; }

    public IReadOnlyList<Guid> GalleryFileIds { get; init; } = Array.Empty<Guid>();

    // ==================== Stats ====================

    /// <summary>
    /// Denormalized total number of completed bookings for this service.
    /// </summary>
    public int BookingCount { get; init; }

    /// <summary>
    /// Available units for equipment rental services. Null for non-equipment services.
    /// </summary>
    public int? AvailableQuantity { get; init; }

    // ==================== Type-Specific Config ====================

    /// <summary>
    /// Native JSON object holding type-specific configuration. Deserialized from the Metadata column.
    /// </summary>
    public object? TypeConfig { get; init; }

    // ==================== Sub-Services ====================

    public IReadOnlyList<SubServiceResponse> SubServices { get; init; } = Array.Empty<SubServiceResponse>();

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; init; }

    public DateTime UpdatedAt { get; init; }
}

/// <summary>
/// Summary response DTO for a service in list views (lighter than ServiceDetailResponse).
/// </summary>
public record ServiceSummaryResponse
{
    public Guid Id { get; init; }

    public string Name { get; init; } = string.Empty;

    public string? ShortDescription { get; init; }

    public string? Description { get; init; }

    public string? ServiceLocation { get; init; }

    /// <summary>
    /// Provider-inherited service category (free-form string).
    /// </summary>
    public string Category { get; init; } = string.Empty;

    public decimal Price { get; init; }

    /// <summary>
    /// Pricing model: "fixed", "hourly", or "range".
    /// </summary>
    public string PriceType { get; init; } = "fixed";

    /// <summary>
    /// ISO 4217 currency code. Temporarily hardcoded to "TND".
    /// </summary>
    public string Currency { get; init; } = "TND";

    public int? DurationMinutes { get; init; }

    public bool IsActive { get; init; }

    public bool IsFeatured { get; init; }

    public bool IsUrgent { get; init; }

    public bool RequiresPrescription { get; init; }

    public Guid? MainImageFileId { get; init; }

    /// <summary>
    /// Denormalized total number of completed bookings for this service.
    /// </summary>
    public int BookingCount { get; init; }

    /// <summary>
    /// Available units for equipment rental services. Null for non-equipment services.
    /// </summary>
    public int? AvailableQuantity { get; init; }

    /// <summary>
    /// Native JSON object holding type-specific configuration. Deserialized from the Metadata column.
    /// </summary>
    public object? TypeConfig { get; init; }

    /// <summary>
    /// Number of add-ons attached to this service.
    /// </summary>
    public int SubServiceCount { get; init; }

    public DateTime CreatedAt { get; init; }
}

// ==================== Paginated Response Wrappers ====================

/// <summary>
/// Paginated response wrapper for provider service list.
/// </summary>
public record ProviderServiceListResponse
{
    /// <summary>
    /// The list of services for the current page.
    /// </summary>
    public IReadOnlyList<ServiceSummaryResponse> Items { get; init; } = Array.Empty<ServiceSummaryResponse>();

    /// <summary>
    /// Pagination metadata for the result set.
    /// </summary>
    public PaginationMetadata Pagination { get; init; } = new();
}

/// <summary>
/// Provider service statistics.
/// </summary>
public record ServiceStatsResponse
{
    /// <summary>
    /// Total number of services (active and inactive) owned by the provider.
    /// </summary>
    public int TotalServices { get; init; }

    /// <summary>
    /// Number of currently active services.
    /// </summary>
    public int ActiveServices { get; init; }

    /// <summary>
    /// Number of currently inactive services.
    /// </summary>
    public int InactiveServices { get; init; }

    /// <summary>
    /// Sum of BookingCount across all provider services.
    /// </summary>
    public int TotalBookings { get; init; }
}

