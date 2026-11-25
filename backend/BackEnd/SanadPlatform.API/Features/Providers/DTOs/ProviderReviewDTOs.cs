using System;
using System.Collections.Generic;
using SanadPlatform.API.Common.Models;

namespace SanadPlatform.API.Features.Providers.DTOs;

public class ProviderReviewsResponse
{
    public List<ProviderReviewDto> Items { get; set; } = new();
    public PaginationMetadata Pagination { get; set; } = new();
    public ReviewSummaryDto Summary { get; set; } = new();
}

public class ProviderReviewDto
{
    public Guid Id { get; set; }
    public Guid BookingId { get; set; }
    public Guid BookingSessionId { get; set; }
    public Guid PatientId { get; set; }
    public PatientBriefDto Patient { get; set; } = null!;
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public int? ProfessionalismRating { get; set; }
    public int? PunctualityRating { get; set; }
    public int? QualityRating { get; set; }
    public string? ProviderResponse { get; set; }
    public DateTime? ProviderRespondedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class PatientBriefDto
{
    public string Name { get; set; } = string.Empty;
    public string? Avatar { get; set; }
}

public class ReviewSummaryDto
{
    public decimal AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public Dictionary<string, int> RatingDistribution { get; set; } = new();
}
