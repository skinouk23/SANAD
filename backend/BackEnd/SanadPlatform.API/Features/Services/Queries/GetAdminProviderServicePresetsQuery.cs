using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using MediatR;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Services.Queries;

/// <summary>
/// Returns all provider service presets for an admin-selected provider category.
/// </summary>
public record GetAdminProviderServicePresetsQuery(string ProviderCategory)
    : IRequest<IReadOnlyList<AdminProviderServicePresetResponse>>;

/// <summary>
/// Handles <see cref="GetAdminProviderServicePresetsQuery"/> with a fresh uncached read.
/// </summary>
public class GetAdminProviderServicePresetsHandler
    : IRequestHandler<GetAdminProviderServicePresetsQuery, IReadOnlyList<AdminProviderServicePresetResponse>>
{
    private readonly SanadDbContext _db;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetAdminProviderServicePresetsHandler"/> class.
    /// </summary>
    public GetAdminProviderServicePresetsHandler(SanadDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }

    /// <summary>
    /// Returns all presets, including inactive entries, for the requested provider category.
    /// </summary>
    public async Task<IReadOnlyList<AdminProviderServicePresetResponse>> Handle(
        GetAdminProviderServicePresetsQuery request,
        CancellationToken cancellationToken)
    {
        var providerCategory = request.ProviderCategory;
        if (string.IsNullOrWhiteSpace(providerCategory))
        {
            return Array.Empty<AdminProviderServicePresetResponse>();
        }

        providerCategory = providerCategory.Trim();

        var presets = await _db.ProviderServicePresets
            .AsNoTracking()
            .Where(p => p.ProviderCategory == providerCategory)
            .OrderBy(p => p.DisplayOrder)
            .ThenBy(p => p.Code)
            .Select(p => new
            {
                p.Id,
                p.ProviderCategory,
                p.Code,
                p.NameEn,
                p.NameFr,
                p.NameAr,
                p.NameDe,
                p.DescriptionEn,
                p.DescriptionFr,
                p.DescriptionAr,
                p.DescriptionDe,
                p.Price,
                p.PriceType,
                p.Currency,
                p.DurationMinutes,
                p.ServiceLocation,
                p.RequiresPrescription,
                p.IsUrgent,
                p.RequiresMedicalHistory,
                p.TypeConfig,
                p.IsActive,
                p.DisplayOrder,
                p.CreatedAt,
                p.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        return presets
            .Select(p => new AdminProviderServicePresetResponse
            {
                Id = p.Id,
                ProviderCategory = p.ProviderCategory,
                Code = p.Code,
                NameEn = p.NameEn,
                NameFr = p.NameFr,
                NameAr = p.NameAr,
                NameDe = p.NameDe,
                DescriptionEn = p.DescriptionEn,
                DescriptionFr = p.DescriptionFr,
                DescriptionAr = p.DescriptionAr,
                DescriptionDe = p.DescriptionDe,
                Price = p.Price,
                PriceType = p.PriceType,
                Currency = p.Currency,
                DurationMinutes = p.DurationMinutes,
                ServiceLocation = p.ServiceLocation,
                RequiresPrescription = p.RequiresPrescription,
                IsUrgent = p.IsUrgent,
                RequiresMedicalHistory = p.RequiresMedicalHistory,
                TypeConfig = DeserializeTypeConfig(p.TypeConfig),
                IsActive = p.IsActive,
                DisplayOrder = p.DisplayOrder,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            })
            .ToList();
    }

    private static JsonElement? DeserializeTypeConfig(string? typeConfig)
    {
        if (string.IsNullOrWhiteSpace(typeConfig))
        {
            return null;
        }

        try
        {
            return JsonSerializer.Deserialize<JsonElement>(typeConfig);
        }
        catch (JsonException)
        {
            return null;
        }
    }
}
