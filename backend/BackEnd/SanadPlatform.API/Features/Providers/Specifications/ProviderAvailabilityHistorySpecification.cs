using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Common.Utilities;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Providers.Specifications;

/// <summary>
/// Specification that encapsulates query logic for retrieving a paginated,
/// date-filtered availability history for a specific provider,
/// ordered by <see cref="ProviderAvailabilityHistory.StatusChangedAt"/> descending.
/// Uses <see cref="PredicateBuilder"/> to compose filter criteria conditionally.
/// </summary>
public class ProviderAvailabilityHistorySpecification : BaseSpecification<ProviderAvailabilityHistory>
{
    /// <summary>
    /// Initializes a new instance of <see cref="ProviderAvailabilityHistorySpecification"/>.
    /// </summary>
    /// <param name="providerId">The provider whose history to query.</param>
    /// <param name="startDate">Optional inclusive lower bound on <c>StatusChangedAt</c>.</param>
    /// <param name="endDate">Optional inclusive upper bound on <c>StatusChangedAt</c>.</param>
    /// <param name="page">1-based page number.</param>
    /// <param name="limit">Maximum number of records per page.</param>
    public ProviderAvailabilityHistorySpecification(
        Guid providerId,
        DateTime? startDate,
        DateTime? endDate,
        int page,
        int limit)
    {
        // ==================== Build Filter Criteria ====================
        var criteria = PredicateBuilder.True<ProviderAvailabilityHistory>()
            .And(h => h.ProviderId == providerId);

        if (startDate.HasValue)
        {
            criteria = criteria.And(h => h.StatusChangedAt >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            criteria = criteria.And(h => h.StatusChangedAt <= endDate.Value);
        }

        Criteria = criteria;

        // ==================== Apply Sorting ====================
        AddOrderByDescending(h => h.StatusChangedAt);

        // ==================== Apply Pagination ====================
        ApplyPaging((page - 1) * limit, limit);
    }
}
