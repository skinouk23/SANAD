using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Common.Utilities;
using SanadPlatform.API.Features.Equipment.DTOs;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Common.Constants;

namespace SanadPlatform.API.Features.Equipment.Repository;

/// <summary>
/// Specification for filtering and paging the equipment catalog.
/// </summary>
public class EquipmentCatalogSpecification : BaseSpecification<Service>
{
    public EquipmentCatalogSpecification(GetEquipmentRequest request)
    {
        var predicate = PredicateBuilder.True<Service>();
        predicate = predicate.And(s =>
            s.Category == ServiceCategories.EquipmentRental &&
            s.IsActive &&
            s.Provider.IsApproved);

        if (!string.IsNullOrEmpty(request.Category))
        {
            var categoryJson = JsonSerializer.Serialize(new { equipment_type_code = request.Category });
            predicate = predicate.And(s =>
                EF.Functions.JsonContains(s.Metadata!, categoryJson));
        }

        if (!string.IsNullOrEmpty(request.Search))
        {
            // PostgreSQL native case-insensitive LIKE, uses pg_trgm index if present
            var escaped = request.Search.Replace(@"\", @"\\").Replace("%", @"\%").Replace("_", @"\_");
            predicate = predicate.And(s =>
                EF.Functions.ILike(s.Name, $"%{escaped}%", @"\") ||
                (s.Description != null && EF.Functions.ILike(s.Description, $"%{escaped}%", @"\")));
        }

        if (request.MinPrice.HasValue)
        {
            predicate = predicate.And(s => s.Price >= request.MinPrice.Value);
        }

        if (request.MaxPrice.HasValue)
        {
            predicate = predicate.And(s => s.Price <= request.MaxPrice.Value);
        }

        if (request.Available.HasValue)
        {
            if (request.Available.Value)
            {
                predicate = predicate.And(s => s.AvailableQuantity != null && s.AvailableQuantity > 0);
            }
            else
            {
                predicate = predicate.And(s => s.AvailableQuantity == null || s.AvailableQuantity == 0);
            }
        }

        Criteria = predicate;

        ApplySorting(request);

        ApplyPaging((request.Page - 1) * request.Limit, request.Limit);
    }

    private void ApplySorting(GetEquipmentRequest request)
    {
        var sortField = request.SortBy?.Trim();
        if (string.Equals(sortField, EquipmentConstants.SortFields.PricePerDay, StringComparison.OrdinalIgnoreCase))
        {
            if (request.SortDesc)
                AddOrderByDescending(s => s.Price);
            else
                AddOrderBy(s => s.Price);
        }
        else if (string.Equals(sortField, EquipmentConstants.SortFields.Rating, StringComparison.OrdinalIgnoreCase))
        {
            if (request.SortDesc)
                AddOrderByDescending(s => s.Provider.RatingAverage);
            else
                AddOrderBy(s => s.Provider.RatingAverage);
        }
        else // default: createdAt
        {
            if (request.SortDesc)
                AddOrderByDescending(s => s.CreatedAt);
            else
                AddOrderBy(s => s.CreatedAt);
        }
    }
}
