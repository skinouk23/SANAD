using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Common.Utilities;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Providers.Specifications;

/// <summary>
/// Specification that encapsulates query logic for retrieving a paginated, filterable list
/// of providers. Supports filtering by status, service category, city,
/// and free-text search, with configurable sorting and pagination.
/// Uses <see cref="PredicateBuilder"/> to compose filter criteria conditionally
/// and <c>EF.Functions.ILike</c> for case-insensitive PostgreSQL text search.
/// </summary>
public class PaginatedProvidersSpecification : BaseSpecification<Provider>
{
    /// <summary>
    /// Initializes a new instance of <see cref="PaginatedProvidersSpecification"/>.
    /// </summary>
    /// <param name="page">1-based page number.</param>
    /// <param name="limit">Maximum number of records per page.</param>
    /// <param name="status">Optional status filter: "available", "unavailable", or "verified".</param>
    /// <param name="serviceCategory">Optional service category filter (exact match).</param>
    /// <param name="searchQuery">Optional free-text search across business name and first/last name.</param>
    /// <param name="sortBy">Sort field: "rating", "name", "created", or default (rating descending).</param>
    /// <param name="sortDesc">Whether to sort in descending order.</param>
    /// <param name="city">Optional city filter (case-insensitive partial match).</param>
    public PaginatedProvidersSpecification(
        int page,
        int limit,
        string? status,
        string? serviceCategory,
        string? searchQuery,
        string? sortBy,
        bool sortDesc,
        string? city)
    {
        // ==================== Build Filter Criteria ====================
        var criteria = PredicateBuilder.True<Provider>()
            .And(p => p.IsApproved);

        if (!string.IsNullOrWhiteSpace(status))
        {
            criteria = status.ToLowerInvariant() switch
            {
                "available" => criteria.And(p => p.IsAvailable),
                "unavailable" => criteria.And(p => !p.IsAvailable),
                "verified" => criteria.And(p => p.IsVerified),
                _ => criteria
            };
        }

        if (!string.IsNullOrWhiteSpace(serviceCategory))
            criteria = criteria.And(p => p.ServiceCategory == serviceCategory);

        if (!string.IsNullOrWhiteSpace(city))
        {
            var cityPattern = $"%{city.Trim()}%";
            criteria = criteria.And(p => p.City != null && EF.Functions.ILike(p.City, cityPattern));
        }

        if (!string.IsNullOrWhiteSpace(searchQuery))
        {
            var escaped = searchQuery.Trim()
                .Replace(@"\", @"\\")
                .Replace("%", @"\%")
                .Replace("_", @"\_");
            var pattern = $"%{escaped}%";

            criteria = criteria.And(p =>
                EF.Functions.ILike(p.BusinessName!, pattern, @"\") ||
                EF.Functions.ILike(p.FirstName!, pattern, @"\") ||
                EF.Functions.ILike(p.LastName!, pattern, @"\") ||
                EF.Functions.ILike(p.Bio!, pattern, @"\") ||
                EF.Functions.ILike(p.ShortDescription!, pattern, @"\") ||
                EF.Functions.ILike(p.AddressLine1!, pattern, @"\") ||
                EF.Functions.ILike(p.City!, pattern, @"\") ||
                p.Specializations.Any(specialization => EF.Functions.ILike(specialization, pattern, @"\")));
        }

        Criteria = criteria;

        // ==================== Apply Sorting ====================
        var sortByLower = sortBy?.ToLowerInvariant();
        switch (sortByLower)
        {
            case "rating":
                if (sortDesc) AddOrderByDescending(p => p.RatingAverage);
                else AddOrderBy(p => p.RatingAverage);
                break;
            case "name":
                if (sortDesc) AddOrderByDescending(p => (object)(p.BusinessName ?? p.FirstName!));
                else AddOrderBy(p => (object)(p.BusinessName ?? p.FirstName!));
                break;
            case "created":
                if (sortDesc) AddOrderByDescending(p => p.CreatedAt);
                else AddOrderBy(p => p.CreatedAt);
                break;
            case "isverified":
                if (sortDesc) AddOrderByDescending(p => p.IsVerified);
                else AddOrderBy(p => p.IsVerified);
                break;
            default:
                AddOrderByDescending(p => p.RatingAverage);
                break;
        }

        // ==================== Apply Pagination ====================
        ApplyPaging((page - 1) * limit, limit);
    }
}
