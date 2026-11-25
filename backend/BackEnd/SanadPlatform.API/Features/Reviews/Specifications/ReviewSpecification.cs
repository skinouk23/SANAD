using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Common.Utilities;
using SanadPlatform.API.Features.Reviews.Entities;

namespace SanadPlatform.API.Features.Reviews.Specifications;

/// <summary>
/// Specification for filtering, ordering, and paging reviews.
/// </summary>
public class ReviewSpecification : BaseSpecification<Review>
{
    public ReviewSpecification(Guid providerId, int page, int limit, int? minRating)
    {
        // 1. Build criteria: Only visible reviews for the given provider.
        var criteria = PredicateBuilder.True<Review>()
            .And(r => r.ProviderId == providerId)
            .And(r => r.IsVisible);

        // Optional minimum rating filter.
        if (minRating.HasValue)
        {
            criteria = criteria.And(r => r.Rating >= minRating.Value);
        }

        Criteria = criteria;

        // 2. Sort newest first.
        AddOrderByDescending(r => r.CreatedAt);

        // 3. Paginate (skip is 0-based).
        ApplyPaging((page - 1) * limit, limit);
    }
}
