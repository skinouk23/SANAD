using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Services.Helpers;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Services.Commands;

/// <summary>
/// Command to permanently delete a provider service preset.
/// </summary>
public record DeleteProviderServicePresetCommand(Guid Id) : IRequest<Unit>;

/// <summary>
/// Handles <see cref="DeleteProviderServicePresetCommand"/>.
/// </summary>
public class DeleteProviderServicePresetHandler
    : IRequestHandler<DeleteProviderServicePresetCommand, Unit>
{
    private readonly SanadDbContext _db;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMemoryCache _cache;
    private readonly ILogger<DeleteProviderServicePresetHandler> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="DeleteProviderServicePresetHandler"/> class.
    /// </summary>
    public DeleteProviderServicePresetHandler(
        SanadDbContext db,
        IUnitOfWork unitOfWork,
        IMemoryCache cache,
        ILogger<DeleteProviderServicePresetHandler> logger)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Hard-deletes a preset and invalidates the category-scoped preset cache.
    /// </summary>
    public async Task<Unit> Handle(
        DeleteProviderServicePresetCommand command,
        CancellationToken cancellationToken)
    {
        var preset = await _db.ProviderServicePresets
            .FirstOrDefaultAsync(item => item.Id == command.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Provider service preset {command.Id} not found.");

        _db.ProviderServicePresets.Remove(preset);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        ProviderPresetCacheHelper.InvalidateCategory(_cache, preset.ProviderCategory);

        _logger.LogInformation(
            "Admin deleted provider preset {PresetId} from category {ProviderCategory}",
            preset.Id,
            preset.ProviderCategory);

        return Unit.Value;
    }
}
