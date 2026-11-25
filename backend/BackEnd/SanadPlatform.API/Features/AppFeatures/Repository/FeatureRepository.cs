using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Features.AppFeatures.DTOs;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.AppFeatures.Repository;

/// <summary>
/// Repository implementation for global app feature visibility reads.
/// </summary>
public class FeatureRepository : IFeatureRepository
{
    private readonly SanadDbContext _context;
    private readonly ILogger<FeatureRepository> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="FeatureRepository"/> class.
    /// </summary>
    public FeatureRepository(SanadDbContext context, ILogger<FeatureRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<FeatureResponse>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        var features = await _context.AppFeatures
            .AsNoTracking()
            .OrderBy(feature => feature.DisplayOrder)
            .ThenBy(feature => feature.Code)
            .Select(feature => new FeatureResponse
            {
                Code = feature.Code,
                Name = feature.Name,
                Description = feature.Description,
                IsActive = feature.IsActive,
                DisplayOrder = feature.DisplayOrder
            })
            .ToListAsync(cancellationToken);

        _logger.LogDebug("Retrieved {FeatureCount} app feature visibility row(s)", features.Count);

        return features;
    }

    /// <inheritdoc />
    public async Task<bool> IsActiveAsync(string code, CancellationToken cancellationToken = default)
    {
        return await _context.AppFeatures
            .AsNoTracking()
            .Where(feature => feature.Code == code)
            .Select(feature => feature.IsActive)
            .FirstOrDefaultAsync(cancellationToken);
    }
}
