using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Common.Utilities;
using SanadPlatform.API.Features.Services.Entities;

namespace SanadPlatform.API.Features.Services.Specifications;

/// <summary>
/// Specification that encapsulates query logic for retrieving a paginated,
/// filtered list of services for a specific provider.
/// Supports search by name, active status filter, and sort options.
/// </summary>
public class ProviderServiceSpecification : BaseSpecification<Service>
{
    /// <summary>
    /// Initializes a new instance of <see cref="ProviderServiceSpecification"/>.
    /// </summary>
    /// <param name="providerId">The provider whose services to query.</param>
    /// <param name="search">Optional search term to filter by service name.</param>
    /// <param name="isActive">Optional active status filter.</param>
    /// <param name="sortBy">Sort field: "name", "price", "created", "bookings". Defaults to "created".</param>
    /// <param name="sortDesc">Whether to sort descending. Defaults to true.</param>
    /// <param name="page">1-based page number.</param>
    /// <param name="limit">Maximum number of records per page.</param>
    public ProviderServiceSpecification(
        Guid providerId,
        string? search = null,
        bool? isActive = null,
        string? sortBy = "created",
        bool sortDesc = true,
        int page = 1,
        int limit = 20)
    {
        // ==================== Build Filter Criteria ====================
        var criteria = PredicateBuilder.True<Service>()
            .And(s => s.ProviderId == providerId);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var escaped = search.Replace("\\", "\\\\").Replace("%", "\\%").Replace("_", "\\_");
            var searchPattern = $"%{escaped}%";
            criteria = criteria.And(s => EF.Functions.ILike(s.Name, searchPattern, @"\"));
        }

        if (isActive.HasValue)
        {
            criteria = criteria.And(s => s.IsActive == isActive.Value);
        }

        Criteria = criteria;

        // ==================== Apply Sorting ====================
        switch (sortBy?.ToLowerInvariant())
        {
            case "name":
                if (sortDesc) AddOrderByDescending(s => s.Name);
                else AddOrderBy(s => s.Name);
                break;
            case "price":
                if (sortDesc) AddOrderByDescending(s => s.Price);
                else AddOrderBy(s => s.Price);
                break;
            case "bookings":
                if (sortDesc) AddOrderByDescending(s => s.BookingCount);
                else AddOrderBy(s => s.BookingCount);
                break;
            default: // "created"
                if (sortDesc) AddOrderByDescending(s => s.CreatedAt);
                else AddOrderBy(s => s.CreatedAt);
                break;
        }

        // ==================== Apply Pagination ====================
        ApplyPaging((page - 1) * limit, limit);
    }
}
