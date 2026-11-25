using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Common.Utilities;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Providers.Specifications;

/// <summary>
/// Specification that encapsulates query logic for retrieving the top-rated approved providers,
/// ordered by rating descending, with pagination.
/// Only providers with at least one review (<c>RatingCount &gt; 0</c>) are included.
/// Uses <see cref="PredicateBuilder"/> to compose filter criteria.
/// </summary>
public class TopRatedProvidersSpecification : BaseSpecification<Provider>
{
    /// <summary>
    /// Initializes a new instance of <see cref="TopRatedProvidersSpecification"/>.
    /// </summary>
    /// <param name="page">1-based page number.</param>
    /// <param name="limit">Maximum number of records per page.</param>
    public TopRatedProvidersSpecification(int page, int limit)
    {
        // ==================== Build Filter Criteria ====================
        Criteria = PredicateBuilder.True<Provider>()
            .And(p => p.IsApproved && p.RatingCount > 0);

        // ==================== Apply Sorting ====================
        AddOrderByDescending(p => p.RatingAverage);

        // ==================== Apply Pagination ====================
        ApplyPaging((page - 1) * limit, limit);
    }
}
