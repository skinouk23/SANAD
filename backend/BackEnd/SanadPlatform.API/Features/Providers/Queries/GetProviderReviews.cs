using AutoMapper;
using MediatR;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Reviews.Specifications;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Query to retrieve a paginated list of reviews for the authenticated provider,
/// together with aggregate summary statistics (average rating, distribution).
/// </summary>
public record GetProviderReviewsQuery(
    Guid UserId,
    int Page = 1,
    int Limit = 10,
    int? MinRating = null
) : IRequest<ProviderReviewsResponse>;

/// <summary>
/// Handler for <see cref="GetProviderReviewsQuery"/>.
/// Throws <see cref="KeyNotFoundException"/> (→ 404) when no provider profile exists for the user.
/// </summary>
public class GetProviderReviewsHandler : IRequestHandler<GetProviderReviewsQuery, ProviderReviewsResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetProviderReviewsHandler> _logger;

    public GetProviderReviewsHandler(
        IProviderRepository providerRepository,
        IMapper mapper,
        ILogger<GetProviderReviewsHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderReviewsResponse> Handle(
        GetProviderReviewsQuery request,
        CancellationToken cancellationToken)
    {
        var provider = await _providerRepository.GetByUserIdAsync(request.UserId, cancellationToken);
        if (provider == null)
        {
            _logger.LogWarning("No provider profile found for user {UserId}", request.UserId);
            throw new KeyNotFoundException("Provider profile not found.");
        }

        // Define query logic via specification.
        var spec = new ReviewSpecification(
            provider.Id,
            request.Page,
            request.Limit,
            request.MinRating);

        // Two queries:
        //   1. Paginated + filtered review page (driven by specification).
        //   2. Rating distribution (database-level aggregation).
        var (reviewItems, total) = await _providerRepository.GetReviewsAsync(spec, cancellationToken);
        var distributionData = await _providerRepository.GetRatingDistributionAsync(provider.Id, cancellationToken);

        // Build per-star distribution ensuring all buckets 1–5 are always present.
        var distribution = Enumerable.Range(1, 5)
            .ToDictionary(
                star => star.ToString(),
                star => distributionData.GetValueOrDefault(star, 0));

        // Calculate summary statistics from the distribution for guaranteed consistency
        // with the visible reviews list.
        int totalVisibleReviews = distributionData.Values.Sum();
        decimal totalScore = distributionData.Sum(x => (decimal)x.Key * x.Value);
        decimal averageRating = totalVisibleReviews > 0
            ? Math.Round(totalScore / totalVisibleReviews, 2)
            : 0;

        return new ProviderReviewsResponse
        {
            Items = reviewItems.ToList(),
            Pagination = new PaginationMetadata
            {
                Page = request.Page,
                Limit = request.Limit,
                Total = total,
                TotalPages = (int)Math.Ceiling(total / (double)request.Limit)
            },
            Summary = new ReviewSummaryDto
            {
                AverageRating = averageRating,
                TotalReviews = totalVisibleReviews,
                RatingDistribution = distribution
            }
        };
    }
}
