using System.Globalization;
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Common.Storage;
using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Features.Equipment.DTOs;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Equipment.Repository;

public class EquipmentRepository : IEquipmentRepository
{
    private readonly SanadDbContext _context;
    private readonly ILogger<EquipmentRepository> _logger;

    public EquipmentRepository(
        SanadDbContext context,
        ILogger<EquipmentRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<IReadOnlyList<EquipmentCategoryResponse>> GetCategoriesAsync(CancellationToken ct)
    {
        var lang = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName;
        return await _context.EquipmentCategoryConfigs
            .AsNoTracking()
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .Select(c => new EquipmentCategoryResponse
            {
                Id = c.Id,
                Code = c.Code,
                Label = lang == "en" ? c.NameEn
                    : lang == "ar" ? (c.NameAr ?? c.NameFr)
                    : lang == "de" ? (c.NameDe ?? c.NameEn)
                    : lang == "nl" ? c.NameEn // NameNl not yet available; fallback to English
                    : c.NameFr,
                Description = lang == "en" ? c.DescriptionEn
                    : lang == "de" ? c.DescriptionEn // DescriptionDe not available
                    : lang == "nl" ? c.DescriptionEn // DescriptionNl not available
                    : c.DescriptionFr,
                Icon = c.Icon,
                Color = c.Color
            })
            .ToListAsync(ct);
    }

    /// <summary>
    /// Batch-resolves equipment category codes to their localized display names.
    /// </summary>
    private async Task<Dictionary<string, string>> ResolveCategoryNamesAsync(
        IEnumerable<string> codes, CancellationToken ct)
    {
        var codeList = codes.Where(c => !string.IsNullOrEmpty(c)).Distinct().ToList();
        if (codeList.Count == 0) return new Dictionary<string, string>();

        var lang = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName;
        var rows = await _context.EquipmentCategoryConfigs
            .AsNoTracking()
            .Where(c => codeList.Contains(c.Code))
            .Select(c => new { c.Code, c.NameEn, c.NameFr, c.NameAr, c.NameDe })
            .ToListAsync(ct);

        return rows.ToDictionary(
            c => c.Code,
            c => lang == "en" ? c.NameEn
               : lang == "ar" ? (c.NameAr ?? c.NameFr)
               : lang == "de" ? (c.NameDe ?? c.NameEn)
               : lang == "nl" ? c.NameEn
               : c.NameFr);
    }

    public async Task<EquipmentCatalogResponse> GetCatalogAsync(
        EquipmentCatalogSpecification spec, CancellationToken ct)
    {
        var baseQuery = _context.Services.AsNoTracking();

        var totalCount = await SpecificationEvaluator
            .GetCountQuery(baseQuery, spec).CountAsync(ct);

        // Materialize with Provider included (already in spec via AddInclude)
        var services = await SpecificationEvaluator
            .GetQuery(baseQuery, spec)
            .Select(s => new
            {
                s.Id,
                s.Name,
                s.Price,
                s.Metadata,
                s.AvailableQuantity,
                s.MainImageFileId,
                Provider = new
                {
                    s.Provider.Id,
                    s.Provider.BusinessName,
                    s.Provider.FirstName,
                    s.Provider.LastName,
                    s.Provider.City,
                    s.Provider.RatingAverage,
                    s.Provider.RatingCount
                }
            })
            .ToListAsync(ct);

        // Deserialize metadata and collect category codes
        var parsed = services.Select(s => new
        {
            Service = s,
            Meta = EquipmentMetadataDto.DeserializeOrDefault(s.Metadata, _logger, s.Id)
        }).ToList();

        // Batch-resolve localized category names (single DB query)
        var categoryNames = await ResolveCategoryNamesAsync(
            parsed.Select(p => p.Meta.EquipmentTypeCode), ct);

        var imageUrlsByFileId = await ResolveImageUrlsByFileIdAsync(
            parsed.Select(p => p.Service.MainImageFileId), ct);

        var items = parsed.Select(p => new EquipmentResponse
        {
            Id = p.Service.Id,
            Name = p.Service.Name,
            CategoryCode = p.Meta.EquipmentTypeCode,
            CategoryName = categoryNames.GetValueOrDefault(
                p.Meta.EquipmentTypeCode, p.Meta.EquipmentTypeCode),
            Brand = p.Meta.Brand ?? string.Empty,
            ImageUrl = p.Service.MainImageFileId is Guid mainImageFileId
                ? imageUrlsByFileId.GetValueOrDefault(mainImageFileId, string.Empty)
                : string.Empty,
            PricePerDay = p.Service.Price,
            AvailableQuantity = p.Service.AvailableQuantity ?? 0,
            Rating = p.Service.Provider.RatingAverage,
            ReviewCount = p.Service.Provider.RatingCount,
            Provider = new EquipmentProviderDto
            {
                Id = p.Service.Provider.Id,
                Name = !string.IsNullOrWhiteSpace(p.Service.Provider.BusinessName)
                    ? p.Service.Provider.BusinessName
                    : $"{p.Service.Provider.FirstName} {p.Service.Provider.LastName}".Trim(),
                City = p.Service.Provider.City ?? string.Empty
            }
        }).ToList();

        int pageSize = spec.Take > 0 ? spec.Take : 1;
        int pageNumber = (spec.Skip / pageSize) + 1;
        int totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        return new EquipmentCatalogResponse
        {
            Items = items,
            Pagination = new PaginationMetadata
            {
                Page = pageNumber,
                Limit = pageSize,
                Total = totalCount,
                TotalPages = totalPages
            }
        };
    }

    public async Task<EquipmentDetailResponse?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        // Project only the columns needed instead of loading entire Service + Provider + User entities
        var row = await _context.Services
            .AsNoTracking()
            .Where(s => s.Id == id && s.Category == ServiceCategories.EquipmentRental)
            .Select(s => new
            {
                s.Id,
                s.Name,
                s.Description,
                s.Metadata,
                s.Price,
                s.AvailableQuantity,
                s.MainImageFileId,
                Provider = new
                {
                    s.Provider.Id,
                    s.Provider.BusinessName,
                    s.Provider.FirstName,
                    s.Provider.LastName,
                    s.Provider.City,
                    s.Provider.RatingAverage,
                    s.Provider.RatingCount,
                    s.Provider.IsVerified,
                    s.Provider.IsApproved,
                    Phone = s.Provider.User != null ? s.Provider.User.Phone : null
                }
            })
            .FirstOrDefaultAsync(ct);

        if (row == null) return null;

        var meta = EquipmentMetadataDto.DeserializeOrDefault(row.Metadata, _logger, row.Id);

        // Resolve localized category name
        var categoryNames = await ResolveCategoryNamesAsync(
            new[] { meta.EquipmentTypeCode }, ct);

        var imageUrlsByFileId = await ResolveImageUrlsByFileIdAsync(
            new[] { row.MainImageFileId }, ct);
        var mainImageUrl = row.MainImageFileId is Guid mainImageFileId
            ? imageUrlsByFileId.GetValueOrDefault(mainImageFileId, string.Empty)
            : string.Empty;

        return new EquipmentDetailResponse
        {
            Id = row.Id,
            Name = row.Name,
            Description = row.Description,
            CategoryCode = meta.EquipmentTypeCode,
            CategoryName = categoryNames.GetValueOrDefault(
                meta.EquipmentTypeCode, meta.EquipmentTypeCode),
            Brand = meta.Brand ?? string.Empty,
            Model = meta.Model ?? string.Empty,
            Images = string.IsNullOrWhiteSpace(mainImageUrl)
                ? Array.Empty<string>()
                : new[] { mainImageUrl },
            PricePerDay = row.Price,
            PricePerWeek = meta.Pricing.Weekly,
            PricePerMonth = meta.Pricing.Monthly,
            Deposit = meta.DepositAmount,
            AvailableQuantity = row.AvailableQuantity ?? 0,
            Specifications = meta.Specifications,
            Features = meta.Features,
            Rating = row.Provider.RatingAverage,
            ReviewCount = row.Provider.RatingCount,
            Provider = new EquipmentProviderDetailDto
            {
                Id = row.Provider.Id,
                Name = !string.IsNullOrWhiteSpace(row.Provider.BusinessName)
                    ? row.Provider.BusinessName
                    : $"{row.Provider.FirstName} {row.Provider.LastName}".Trim(),
                City = row.Provider.City ?? string.Empty,
                Rating = row.Provider.RatingAverage,
                Verified = row.Provider.IsVerified,
                Phone = row.Provider.IsApproved ? row.Provider.Phone : null
            }
        };
    }

    private async Task<Dictionary<Guid, string>> ResolveImageUrlsByFileIdAsync(
        IEnumerable<Guid?> fileIds,
        CancellationToken ct)
    {
        var fileIdList = fileIds
            .Where(id => id.HasValue)
            .Select(id => id!.Value)
            .Distinct()
            .ToList();

        if (fileIdList.Count == 0)
        {
            return new Dictionary<Guid, string>();
        }

        var files = await _context.StoredFiles
            .AsNoTracking()
            .Where(file => fileIdList.Contains(file.Id) && file.Status == StoredFileStatus.Ready)
            .Select(file => file.Id)
            .ToListAsync(ct);

        var imageUrlsByFileId = new Dictionary<Guid, string>();
        foreach (var fileId in files)
        {
            imageUrlsByFileId[fileId] = $"/api/v1/files/{fileId:D}/public-content";
        }

        return imageUrlsByFileId;
    }
}
