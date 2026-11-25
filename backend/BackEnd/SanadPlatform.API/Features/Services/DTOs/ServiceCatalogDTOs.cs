using SanadPlatform.API.Common.Models;

namespace SanadPlatform.API.Features.Services.DTOs;

// ==================== Category Responses ====================

/// <summary>
/// Response DTO for a single service category (patient-facing catalog).
/// </summary>
public record ServiceCategoryResponse
{
    /// <summary>Category unique code (e.g. "nursing", "physiotherapy").</summary>
    public string Code { get; init; } = string.Empty;

    /// <summary>Localized category label.</summary>
    public string Label { get; init; } = string.Empty;

    /// <summary>Localized category description.</summary>
    public string? Description { get; init; }

    /// <summary>Icon identifier for the mobile app.</summary>
    public string? Icon { get; init; }

    /// <summary>Hex colour for the category chip.</summary>
    public string? Color { get; init; }

    /// <summary>Optional marketing badge label (e.g. "Nouveau").</summary>
    public string? Badge { get; init; }

    /// <summary>Display ordering weight.</summary>
    public int DisplayOrder { get; init; }

    /// <summary>Minimum market price across active services in this category.</summary>
    public decimal? MinPrice { get; init; }

    /// <summary>Maximum market price across active services in this category.</summary>
    public decimal? MaxPrice { get; init; }
}

/// <summary>
/// Groups service categories under a display-group tab (Medical, Daily, etc.).
/// </summary>
public record ServiceCategoryGroupResponse
{
    /// <summary>Display group name (e.g. "Medical", "Daily").</summary>
    public string DisplayGroup { get; init; } = string.Empty;

    /// <summary>Categories belonging to this group, ordered by DisplayOrder.</summary>
    public IReadOnlyList<ServiceCategoryResponse> Categories { get; init; } = new List<ServiceCategoryResponse>();
}

// ==================== Catalog Request / Response ====================

/// <summary>
/// Query-string parameters for browsing the patient-facing service catalog.
/// </summary>
public record GetServiceCatalogRequest
{
    /// <summary>Filter by display group (Medical, Daily, Rehabilitation, Wellness).</summary>
    public string? DisplayGroup { get; init; }

    /// <summary>Filter by category code (e.g. "nursing").</summary>
    public string? Category { get; init; }

    /// <summary>Filter by provider ID (used by booking page to fetch sub-services).</summary>
    public Guid? ProviderId { get; init; }

    /// <summary>Free-text search against service name and description.</summary>
    public string? Search { get; init; }

    /// <summary>Minimum price filter.</summary>
    public decimal? MinPrice { get; init; }

    /// <summary>Maximum price filter.</summary>
    public decimal? MaxPrice { get; init; }

    /// <summary>Sort field: "price", "rating", or "createdAt" (default).</summary>
    public string? SortBy { get; init; } = "createdAt";

    /// <summary>Sort descending when true; ascending when false. Default: true (newest first).</summary>
    public bool SortDesc { get; init; } = true;

    /// <summary>1-based page number.</summary>
    public int Page { get; init; } = 1;

    /// <summary>Items per page.</summary>
    public int Limit { get; init; } = 12;
}

/// <summary>
/// Paginated patient-facing catalog response.
/// </summary>
public record PatientServiceCatalogResponse
{
    /// <summary>Page of service items.</summary>
    public IReadOnlyList<PatientServiceItemResponse> Items { get; init; } = new List<PatientServiceItemResponse>();

    /// <summary>Pagination metadata.</summary>
    public PaginationMetadata Pagination { get; init; } = new();
}

/// <summary>
/// Summary card for a single service in the patient-facing catalog listing.
/// </summary>
public record PatientServiceItemResponse
{
    public Guid Id { get; init; }

    /// <summary>Service display name.</summary>
    public string Name { get; init; } = string.Empty;

    /// <summary>Short description for the listing card.</summary>
    public string? ShortDescription { get; init; }

    /// <summary>Category code (e.g. "nursing").</summary>
    public string Category { get; init; } = string.Empty;

    /// <summary>Base price.</summary>
    public decimal Price { get; init; }

    /// <summary>Pricing model: "fixed", "hourly", or "range".</summary>
    public string PriceType { get; init; } = "fixed";

    /// <summary>Currency code.</summary>
    public string Currency { get; init; } = "TND";

    /// <summary>Where the service is delivered: "home", "clinic", or "both".</summary>
    public string ServiceLocation { get; init; } = "home";

    /// <summary>Whether the service requires a prescription before booking.</summary>
    public bool RequiresPrescription { get; init; }

    /// <summary>Whether the service should be treated as urgent.</summary>
    public bool IsUrgent { get; init; }

    /// <summary>Estimated duration in minutes for the service.</summary>
    public int? DurationMinutes { get; init; }

    /// <summary>Main image file identifier.</summary>
    public Guid? MainImageFileId { get; init; }

    /// <summary>Native JSON type-specific configuration deserialized from the metadata column.</summary>
    public object? TypeConfig { get; init; }

    /// <summary>Active sub-services available for the catalog item.</summary>
    public IReadOnlyList<SubServiceResponse> SubServices { get; init; } = new List<SubServiceResponse>();

    /// <summary>Provider summary.</summary>
    public ServiceCatalogProviderDto Provider { get; init; } = null!;
}

/// <summary>
/// Minimal provider info shown on catalog listing cards.
/// </summary>
public record ServiceCatalogProviderDto
{
    public Guid Id { get; init; }

    /// <summary>Business or display name.</summary>
    public string Name { get; init; } = string.Empty;

    /// <summary>City where the provider operates.</summary>
    public string? City { get; init; }

    /// <summary>Average rating (0-5).</summary>
    public decimal Rating { get; init; }

    /// <summary>Total number of ratings.</summary>
    public int ReviewCount { get; init; }

    /// <summary>Whether the provider has been admin-verified.</summary>
    public bool IsVerified { get; init; }
}

// ==================== Detail Response ====================

/// <summary>
/// Full detail response for a single service (patient-facing).
/// Named PatientServiceDetailResponse to avoid collision with the
/// provider-scoped ServiceDetailResponse in ServiceDTOs.cs.
/// </summary>
public record PatientServiceDetailResponse
{
    public Guid Id { get; init; }

    public string Name { get; init; } = string.Empty;

    public string? Description { get; init; }

    public string? ShortDescription { get; init; }

    /// <summary>Category code.</summary>
    public string Category { get; init; } = string.Empty;

    // ==================== Pricing ====================

    public decimal Price { get; init; }

    public string PriceType { get; init; } = "fixed";

    public string Currency { get; init; } = "TND";

    public decimal? MinPrice { get; init; }

    public decimal? MaxPrice { get; init; }

    // ==================== Duration ====================

    public int? DurationMinutes { get; init; }

    public int? MinDurationMinutes { get; init; }

    public int? MaxDurationMinutes { get; init; }

    // ==================== Location ====================

    /// <summary>Where the service is delivered: "home", "clinic", or "both".</summary>
    public string ServiceLocation { get; init; } = "home";

    // ==================== Requirements ====================

    public bool RequiresPrescription { get; init; }

    public bool IsUrgent { get; init; }

    public bool RequiresMedicalHistory { get; init; }

    public int? AgeRestrictionMin { get; init; }

    public int? AgeRestrictionMax { get; init; }

    // ==================== Media ====================

    public Guid? MainImageFileId { get; init; }

    public IReadOnlyList<Guid> GalleryFileIds { get; init; } = new List<Guid>();

    // ==================== Provider ====================

    public PatientServiceDetailProviderDto Provider { get; init; } = null!;

}

/// <summary>
/// Provider info shown on the patient-facing service detail screen.
/// </summary>
public record PatientServiceDetailProviderDto
{
    public Guid Id { get; init; }

    public string Name { get; init; } = string.Empty;

    public string? City { get; init; }

    public decimal Rating { get; init; }

    public int ReviewCount { get; init; }

    public bool IsVerified { get; init; }
}

