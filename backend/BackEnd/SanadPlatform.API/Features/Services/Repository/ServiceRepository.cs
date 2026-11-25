using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Services.Repository;

/// <summary>
/// Repository implementation for Service entity operations.
/// All write methods stage changes via EF change tracking only.
/// Callers must invoke IUnitOfWork.SaveChangesAsync to persist.
/// </summary>
public class ServiceRepository : IServiceRepository
{
    private readonly SanadDbContext _context;
    private readonly ILogger<ServiceRepository> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="ServiceRepository"/> class.
    /// </summary>
    public ServiceRepository(SanadDbContext context, ILogger<ServiceRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    // ==================== Read (untracked) ====================

    /// <inheritdoc/>
    public async Task<Service?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Services
            .AsNoTracking()
            .Include(s => s.Addons)
            .Include(s => s.Photos)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
    }

    /// <inheritdoc/>
    public async Task<Service?> GetByIdAndProviderAsync(Guid id, Guid providerId, CancellationToken cancellationToken = default)
    {
        return await _context.Services
            .AsNoTracking()
            .Include(s => s.Addons)
            .Include(s => s.Photos)
            .FirstOrDefaultAsync(s => s.Id == id && s.ProviderId == providerId, cancellationToken);
    }

    /// <inheritdoc/>
    public async Task<(IReadOnlyList<ServiceSummaryResponse> Items, int Total)> GetPagedSummaryAsync(
        ISpecification<Service> spec,
        CancellationToken cancellationToken = default)
    {
        var baseQuery = _context.Services.AsNoTracking();

        var total = await SpecificationEvaluator.GetCountQuery(baseQuery, spec)
            .CountAsync(cancellationToken);

        var serviceRows = await SpecificationEvaluator.GetQuery(baseQuery, spec)
            .Select(s => new
            {
                s.Id,
                s.Name,
                s.ShortDescription,
                s.Description,
                s.ServiceLocation,
                s.Category,
                s.Price,
                s.PriceType,
                s.Currency,
                s.DurationMinutes,
                s.IsActive,
                s.IsFeatured,
                s.IsUrgent,
                s.RequiresPrescription,
                s.MainImageFileId,
                s.BookingCount,
                s.AvailableQuantity,
                s.Metadata,
                SubServiceCount = s.Addons.Count,
                s.CreatedAt
            })
            .ToListAsync(cancellationToken);

        var items = serviceRows
            .Select(s => new ServiceSummaryResponse
            {
                Id = s.Id,
                Name = s.Name,
                ShortDescription = s.ShortDescription,
                Description = s.Description,
                ServiceLocation = s.ServiceLocation,
                Category = s.Category,
                Price = s.Price,
                PriceType = s.PriceType,
                Currency = s.Currency,
                DurationMinutes = s.DurationMinutes,
                IsActive = s.IsActive,
                IsFeatured = s.IsFeatured,
                IsUrgent = s.IsUrgent,
                RequiresPrescription = s.RequiresPrescription,
                MainImageFileId = s.MainImageFileId,
                BookingCount = s.BookingCount,
                AvailableQuantity = s.AvailableQuantity,
                TypeConfig = DeserializeMetadata(s.Metadata),
                SubServiceCount = s.SubServiceCount,
                CreatedAt = s.CreatedAt
            })
            .ToList();

        return (items, total);
    }

    /// <inheritdoc/>
    public async Task<IReadOnlyList<Service>> GetServicesByIdsForProviderAsync(
        Guid providerId,
        IEnumerable<Guid> serviceIds,
        CancellationToken cancellationToken = default)
    {
        var idList = serviceIds.ToList();

        return await _context.Services
            .AsNoTracking()
            .Where(s => s.ProviderId == providerId && idList.Contains(s.Id) && s.IsActive)
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc/>
    public async Task<IReadOnlyList<Service>> GetServicesByIdsForProviderForUpdateAsync(
        Guid providerId,
        IEnumerable<Guid> serviceIds,
        CancellationToken cancellationToken = default)
    {
        var idList = serviceIds.ToList();

        return await _context.Services
            .Where(s => s.ProviderId == providerId && idList.Contains(s.Id) && s.IsActive)
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc/>
    public async Task<bool> ExistsByNameAsync(
        Guid providerId,
        string name,
        Guid? excludeServiceId = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Services
            .AsNoTracking()
            .Where(s => s.ProviderId == providerId && s.Name == name);

        if (excludeServiceId.HasValue)
        {
            query = query.Where(s => s.Id != excludeServiceId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }

    /// <inheritdoc/>
    public async Task<(int Total, int Active, int Inactive, int TotalBookings)> GetStatsAsync(
        Guid providerId,
        CancellationToken cancellationToken = default)
    {
        var stats = await _context.Services
            .AsNoTracking()
            .Where(s => s.ProviderId == providerId)
            .GroupBy(_ => 1)
            .Select(g => new
            {
                Total = g.Count(),
                Active = g.Count(s => s.IsActive),
                Inactive = g.Count(s => !s.IsActive),
                TotalBookings = g.Sum(s => s.BookingCount)
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (stats == null)
            return (0, 0, 0, 0);

        return (stats.Total, stats.Active, stats.Inactive, stats.TotalBookings);
    }

    // ==================== Read (tracked — for updates) ====================

    /// <inheritdoc/>
    public async Task<Service?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Services
            .Include(s => s.Addons)
            .Include(s => s.Photos)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
    }

    /// <inheritdoc/>
    public async Task<Service?> GetByIdAndProviderForUpdateAsync(Guid id, Guid providerId, CancellationToken cancellationToken = default)
    {
        return await _context.Services
            .Include(s => s.Addons)
            .Include(s => s.Photos)
            .FirstOrDefaultAsync(s => s.Id == id && s.ProviderId == providerId, cancellationToken);
    }

    // ==================== Write ====================

    /// <inheritdoc/>
    public Task<Service> CreateAsync(Service service, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(service);

        _context.Services.Add(service);
        _logger.LogDebug("Service {ServiceId} staged for creation", service.Id);
        return Task.FromResult(service);
    }

    /// <summary>
    /// No-op — the entity is already tracked by EF Core. Property changes are
    /// detected automatically by the change tracker on <c>SaveChangesAsync</c>.
    /// </summary>
    public Task<Service> UpdateAsync(Service service, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(service);
        _logger.LogDebug("Service {ServiceId} staged for update", service.Id);
        return Task.FromResult(service);
    }

    /// <inheritdoc/>
    public async Task<bool> DeleteAsync(Guid id, Guid providerId, CancellationToken cancellationToken = default)
    {
        var service = await _context.Services
            .Include(s => s.Addons)
            .FirstOrDefaultAsync(s => s.Id == id && s.ProviderId == providerId, cancellationToken);

        if (service == null)
            return false;

        // Soft-delete child addons first so they don't remain visible
        if (service.Addons.Count > 0)
        {
            _context.ServiceAddons.RemoveRange(service.Addons);
            _logger.LogDebug(
                "Staged {AddonCount} addon(s) for soft-deletion on service {ServiceId}",
                service.Addons.Count, id);
        }

        _context.Services.Remove(service);
        _logger.LogDebug("Service {ServiceId} staged for soft-deletion", id);
        return true;
    }

    /// <inheritdoc/>
    public void Remove(Service service)
    {
        ArgumentNullException.ThrowIfNull(service);
        _context.Services.Remove(service);
        _logger.LogDebug("Service {ServiceId} staged for soft-deletion", service.Id);
    }

    /// <inheritdoc/>
    public void RemoveAddons(IEnumerable<ServiceAddon> addons)
    {
        _context.ServiceAddons.RemoveRange(addons);
    }

    /// <inheritdoc/>
    public async Task RecalculateCategoryPricesAsync(string categoryCode, CancellationToken cancellationToken = default)
    {
        var aggregate = await _context.Services
            .AsNoTracking()
            .Where(s => s.Category == categoryCode && s.IsActive)
            .GroupBy(_ => 1)
            .Select(g => new
            {
                Min = g.Min(s => s.MinPrice ?? s.Price),
                Max = g.Max(s => s.MaxPrice ?? s.Price)
            })
            .FirstOrDefaultAsync(cancellationToken);

        var config = await _context.ServiceCategoryConfigs
            .FirstOrDefaultAsync(c => c.Code == categoryCode, cancellationToken);

        if (config is null)
            return;

        config.MinPrice = aggregate?.Min;
        config.MaxPrice = aggregate?.Max;

        _logger.LogDebug(
            "Recalculated category {CategoryCode} prices: Min={MinPrice}, Max={MaxPrice}",
            categoryCode, config.MinPrice, config.MaxPrice);
    }

    // ==================== Patient-Facing Catalog (read-only) ====================

    /// <inheritdoc/>
    public async Task<IReadOnlyList<ServiceCategoryConfig>> GetCategoriesAsync(
        CancellationToken cancellationToken = default)
    {
        return await _context.Set<ServiceCategoryConfig>()
            .AsNoTracking()
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc/>
    public async Task<IReadOnlyList<string>> GetCategoryCodesByDisplayGroupAsync(
        DisplayGroup displayGroup,
        CancellationToken cancellationToken = default)
    {
        return await _context.Set<ServiceCategoryConfig>()
            .AsNoTracking()
            .Where(c => c.IsActive && c.DisplayGroup == displayGroup)
            .Select(c => c.Code)
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc/>
    public async Task<PatientServiceCatalogResponse> GetCatalogAsync(
        ISpecification<Service> spec,
        CancellationToken cancellationToken = default)
    {
        var baseQuery = _context.Services.AsNoTracking();

        var totalCount = await SpecificationEvaluator
            .GetCountQuery(baseQuery, spec).CountAsync(cancellationToken);

        var serviceRows = await SpecificationEvaluator
            .GetQuery(baseQuery, spec)
            .Select(s => new
            {
                s.Id,
                s.Name,
                s.ShortDescription,
                s.Category,
                s.Price,
                s.PriceType,
                s.Currency,
                s.ServiceLocation,
                s.RequiresPrescription,
                s.IsUrgent,
                s.DurationMinutes,
                s.MainImageFileId,
                GalleryFileIds = s.Photos
                    .Where(photo => !photo.IsMain)
                    .OrderBy(photo => photo.SortOrder)
                    .Select(photo => photo.FileId)
                    .ToList(),
                s.Metadata,
                Addons = s.Addons
                    .Where(a => a.IsActive)
                    .Select(a => new SubServiceResponse
                    {
                        Id = a.Id,
                        Name = a.Name,
                        Description = a.Description,
                        Price = a.Price,
                        DurationMinutes = a.DurationMinutes,
                        Icon = a.Icon,
                        IsSupplement = a.IsSupplement,
                        IsActive = a.IsActive
                    })
                    .ToList(),
                Provider = new
                {
                    s.Provider.Id,
                    s.Provider.BusinessName,
                    s.Provider.FirstName,
                    s.Provider.LastName,
                    s.Provider.City,
                    s.Provider.RatingAverage,
                    s.Provider.RatingCount,
                    s.Provider.IsVerified
                }
            })
            .ToListAsync(cancellationToken);

        var services = serviceRows.Select(s => new PatientServiceItemResponse
        {
            Id = s.Id,
            Name = s.Name,
            ShortDescription = s.ShortDescription,
            Category = s.Category,
            Price = s.Price,
            PriceType = s.PriceType,
            Currency = s.Currency,
            ServiceLocation = s.ServiceLocation,
            RequiresPrescription = s.RequiresPrescription,
            IsUrgent = s.IsUrgent,
            DurationMinutes = s.DurationMinutes,
            MainImageFileId = s.MainImageFileId,
            TypeConfig = DeserializeMetadata(s.Metadata),
            SubServices = s.Addons,
            Provider = new ServiceCatalogProviderDto
            {
                Id = s.Provider.Id,
                Name = !string.IsNullOrWhiteSpace(s.Provider.BusinessName)
                    ? s.Provider.BusinessName
                    : $"{s.Provider.FirstName ?? string.Empty} {s.Provider.LastName ?? string.Empty}".Trim(),
                City = s.Provider.City,
                Rating = s.Provider.RatingAverage,
                ReviewCount = s.Provider.RatingCount,
                IsVerified = s.Provider.IsVerified
            }
        }).ToList();

        var pageSize = spec.Take > 0 ? spec.Take : 1;
        var pageNumber = (spec.Skip / pageSize) + 1;
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        return new PatientServiceCatalogResponse
        {
            Items = services,
            Pagination = new PaginationMetadata
            {
                Page = pageNumber,
                Limit = pageSize,
                Total = totalCount,
                TotalPages = totalPages
            }
        };
    }

    private static object? DeserializeMetadata(string? metadata)
    {
        if (string.IsNullOrWhiteSpace(metadata))
            return null;

        try
        {
            return JsonSerializer.Deserialize<JsonElement>(metadata);
        }
        catch (JsonException)
        {
            return null;
        }
    }

    /// <inheritdoc/>
    public async Task<PatientServiceDetailResponse?> GetServiceDetailAsync(
        Guid serviceId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Services
            .AsNoTracking()
            .Where(s => s.Id == serviceId
                     && s.IsActive
                     && s.Category != ServiceCategories.EquipmentRental
                     && s.Provider.IsApproved)
            .Select(s => new PatientServiceDetailResponse
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                ShortDescription = s.ShortDescription,
                Category = s.Category,
                Price = s.Price,
                PriceType = s.PriceType,
                Currency = s.Currency,
                MinPrice = s.MinPrice,
                MaxPrice = s.MaxPrice,
                DurationMinutes = s.DurationMinutes,
                MinDurationMinutes = s.MinDurationMinutes,
                MaxDurationMinutes = s.MaxDurationMinutes,
                ServiceLocation = s.ServiceLocation,
                RequiresPrescription = s.RequiresPrescription,
                IsUrgent = s.IsUrgent,
                RequiresMedicalHistory = s.RequiresMedicalHistory,
                AgeRestrictionMin = s.AgeRestrictionMin,
                AgeRestrictionMax = s.AgeRestrictionMax,
                MainImageFileId = s.MainImageFileId,
                GalleryFileIds = s.Photos
                    .Where(photo => !photo.IsMain)
                    .OrderBy(photo => photo.SortOrder)
                    .Select(photo => photo.FileId)
                    .ToList(),
                Provider = new PatientServiceDetailProviderDto
                {
                    Id = s.Provider.Id,
                    Name = (s.Provider.BusinessName != null && s.Provider.BusinessName != "")
                        ? s.Provider.BusinessName
                        : ((s.Provider.FirstName ?? "") + " " + (s.Provider.LastName ?? "")).Trim(),
                    City = s.Provider.City,
                    Rating = s.Provider.RatingAverage,
                    ReviewCount = s.Provider.RatingCount,
                    IsVerified = s.Provider.IsVerified
                },
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
