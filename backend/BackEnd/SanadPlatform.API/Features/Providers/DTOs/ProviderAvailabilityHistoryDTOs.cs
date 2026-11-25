using System;
using System.Collections.Generic;
using SanadPlatform.API.Common.Models;

namespace SanadPlatform.API.Features.Providers.DTOs;

/// <summary>
/// Paginated response wrapper for provider availability status history records.
/// </summary>
public class ProviderAvailabilityHistoryResponse
{
    /// <summary>
    /// The list of availability history records for the current page.
    /// </summary>
    public IReadOnlyList<ProviderAvailabilityHistoryDto> Items { get; set; } = Array.Empty<ProviderAvailabilityHistoryDto>();

    /// <summary>
    /// Pagination metadata for the result set.
    /// </summary>
    public PaginationMetadata Pagination { get; set; } = new();
}

/// <summary>
/// Represents a single provider availability status change record.
/// </summary>
public class ProviderAvailabilityHistoryDto
{
    /// <summary>
    /// Unique identifier of the history record.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// The provider this status change belongs to.
    /// </summary>
    public Guid ProviderId { get; set; }

    /// <summary>
    /// Whether the provider became available or unavailable.
    /// </summary>
    public bool IsAvailable { get; set; }

    /// <summary>
    /// When the status change occurred (UTC).
    /// </summary>
    public DateTime StatusChangedAt { get; set; }

    /// <summary>
    /// Optional reason provided for the status change.
    /// </summary>
    public string? Reason { get; set; }

    /// <summary>
    /// The user ID of who performed the change (provider, admin, or system).
    /// </summary>
    public Guid ChangedBy { get; set; }
}
