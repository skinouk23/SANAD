using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Common.Utilities;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Providers.Specifications;

/// <summary>
/// Specification that encapsulates query logic for retrieving approved, available providers
/// optionally filtered by service category, ordered by rating descending, with pagination.
/// Uses <see cref="PredicateBuilder"/> to compose filter criteria conditionally.
/// </summary>
public class AvailableProvidersSpecification : BaseSpecification<Provider>
{
    /// <summary>
    /// Initializes a new instance of <see cref="AvailableProvidersSpecification"/>.
    /// </summary>
    /// <param name="serviceCategory">Optional service category filter. When empty, returns all available providers.</param>
    /// <param name="page">1-based page number.</param>
    /// <param name="limit">Maximum number of records per page.</param>
    public AvailableProvidersSpecification(
        string serviceCategory,
        int page,
        int limit)
    {
        // ==================== Build Filter Criteria ====================
        var criteria = PredicateBuilder.True<Provider>()
            .And(p => p.IsAvailable && p.IsApproved);

        if (!string.IsNullOrEmpty(serviceCategory))
            criteria = criteria.And(p => p.ServiceCategory == serviceCategory);

        Criteria = criteria;

        // ==================== Apply Sorting ====================
        AddOrderByDescending(p => p.RatingAverage);

        // ==================== Apply Pagination ====================
        ApplyPaging((page - 1) * limit, limit);
    }
}
