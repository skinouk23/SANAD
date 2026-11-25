using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Common.Utilities;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Common.Constants;

namespace SanadPlatform.API.Features.Services.Specifications;

/// <summary>
/// Specification for filtering and paging the patient-facing service catalog.
/// Supports filtering by display group, category, search text, and price range.
/// </summary>
public class ServiceCatalogSpecification : BaseSpecification<Service>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="ServiceCatalogSpecification"/> class.
    /// </summary>
    /// <param name="request">The catalog query parameters.</param>
    /// <param name="categoryCodes">
    /// When filtering by <see cref="DisplayGroup"/>, the caller resolves the matching
    /// category codes beforehand and passes them here.  Null means no display-group filter.
    /// </param>
    public ServiceCatalogSpecification(GetServiceCatalogRequest request, IReadOnlyList<string>? categoryCodes)
    {
        var predicate = PredicateBuilder.True<Service>();

        // Only active services from approved providers
        predicate = predicate.And(s =>
            s.IsActive &&
            s.Provider.IsApproved);

        // Exclude equipment_rental — those have their own Equipment catalog
        predicate = predicate.And(s => s.Category != ServiceCategories.EquipmentRental);

        // ==================== Display Group filter ====================
        if (categoryCodes is not null)
        {
            predicate = predicate.And(s => categoryCodes.Contains(s.Category));
        }

        // ==================== Category filter ====================
        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            predicate = predicate.And(s => s.Category == request.Category);
        }

        // ==================== Provider filter ====================
        if (request.ProviderId.HasValue)
        {
            predicate = predicate.And(s => s.ProviderId == request.ProviderId.Value);
        }

        // ==================== Search filter ====================
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var escaped = request.Search
                .Replace(@"\", @"\\")
                .Replace("%", @"\%")
                .Replace("_", @"\_");

            predicate = predicate.And(s =>
                EF.Functions.ILike(s.Name, $"%{escaped}%", @"\") ||
                (s.Description != null && EF.Functions.ILike(s.Description, $"%{escaped}%", @"\")));
        }

        // ==================== Price range filter ====================
        if (request.MinPrice.HasValue)
        {
            predicate = predicate.And(s => s.Price >= request.MinPrice.Value);
        }

        if (request.MaxPrice.HasValue)
        {
            predicate = predicate.And(s => s.Price <= request.MaxPrice.Value);
        }

        Criteria = predicate;

        // ==================== Sorting ====================
        ApplySorting(request);

        // ==================== Paging ====================
        ApplyPaging((request.Page - 1) * request.Limit, request.Limit);
    }

    /// <summary>
    /// Applies sorting based on the request parameters.
    /// </summary>
    private void ApplySorting(GetServiceCatalogRequest request)
    {
        switch (request.SortBy?.ToLowerInvariant())
        {
            case "price":
                if (request.SortDesc)
                    AddOrderByDescending(s => s.Price);
                else
                    AddOrderBy(s => s.Price);
                break;

            case "rating":
                if (request.SortDesc)
                    AddOrderByDescending(s => s.Provider.RatingAverage);
                else
                    AddOrderBy(s => s.Provider.RatingAverage);
                break;

            default: // "createdAt" or anything else
                if (request.SortDesc)
                    AddOrderByDescending(s => s.CreatedAt);
                else
                    AddOrderBy(s => s.CreatedAt);
                break;
        }
    }
}
