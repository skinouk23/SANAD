using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Services.Helpers;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Services.Commands;

/// <summary>
/// Command to activate or deactivate a provider service preset.
/// </summary>
public record ToggleProviderServicePresetCommand(Guid Id, bool IsActive) : IRequest<Unit>;

/// <summary>
/// Handles <see cref="ToggleProviderServicePresetCommand"/>.
/// </summary>
public class ToggleProviderServicePresetHandler
    : IRequestHandler<ToggleProviderServicePresetCommand, Unit>
{
    private readonly SanadDbContext _db;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMemoryCache _cache;
    private readonly ILogger<ToggleProviderServicePresetHandler> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="ToggleProviderServicePresetHandler"/> class.
    /// </summary>
    public ToggleProviderServicePresetHandler(
        SanadDbContext db,
        IUnitOfWork unitOfWork,
        IMemoryCache cache,
        ILogger<ToggleProviderServicePresetHandler> logger)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Updates preset activation state and invalidates the category-scoped preset cache.
    /// </summary>
    public async Task<Unit> Handle(
        ToggleProviderServicePresetCommand command,
        CancellationToken cancellationToken)
    {
        var preset = await _db.ProviderServicePresets
            .FirstOrDefaultAsync(item => item.Id == command.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Provider service preset {command.Id} not found.");

        preset.IsActive = command.IsActive;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        ProviderPresetCacheHelper.InvalidateCategory(_cache, preset.ProviderCategory);

        _logger.LogInformation(
            "Admin set provider preset {PresetId} in category {ProviderCategory} active state to {IsActive}",
            preset.Id,
            preset.ProviderCategory,
            preset.IsActive);

        return Unit.Value;
    }
}
