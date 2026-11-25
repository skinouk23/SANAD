using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Services.Helpers;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Services.Commands;

/// <summary>
/// Command to reorder provider service presets within a single provider category.
/// </summary>
public record ReorderProviderServicePresetsCommand(
    string ProviderCategory,
    IReadOnlyList<Guid> OrderedIds) : IRequest<Unit>;

/// <summary>
/// Handles <see cref="ReorderProviderServicePresetsCommand"/>.
/// </summary>
public class ReorderProviderServicePresetsHandler
    : IRequestHandler<ReorderProviderServicePresetsCommand, Unit>
{
    private readonly SanadDbContext _db;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMemoryCache _cache;
    private readonly ILogger<ReorderProviderServicePresetsHandler> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="ReorderProviderServicePresetsHandler"/> class.
    /// </summary>
    public ReorderProviderServicePresetsHandler(
        SanadDbContext db,
        IUnitOfWork unitOfWork,
        IMemoryCache cache,
        ILogger<ReorderProviderServicePresetsHandler> logger)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Reorders all presets in the requested category inside a single transaction.
    /// </summary>
    public async Task<Unit> Handle(
        ReorderProviderServicePresetsCommand command,
        CancellationToken cancellationToken)
    {
        var providerCategory = ProviderServicePresetCommandSupport.NormalizeProviderCategory(command.ProviderCategory);
        ProviderServicePresetCommandSupport.EnsureCanonicalProviderCategory(providerCategory);

        await _unitOfWork.ExecuteInTransactionAsync(async (ct) =>
        {
            var categoryPresets = await _db.ProviderServicePresets
                .Where(preset => preset.ProviderCategory == providerCategory)
                .ToListAsync(ct);

            if (command.OrderedIds.Count != categoryPresets.Count)
            {
                throw new InvalidOperationException("OrderedIds count must match the number of presets in the category.");
            }

            if (command.OrderedIds.Distinct().Count() != command.OrderedIds.Count)
            {
                throw new InvalidOperationException("OrderedIds must not contain duplicates.");
            }

            var categoryPresetIds = categoryPresets
                .Select(preset => preset.Id)
                .ToHashSet();

            if (command.OrderedIds.Any(id => !categoryPresetIds.Contains(id)))
            {
                throw new KeyNotFoundException("One or more preset IDs do not belong to this category.");
            }

            var presetLookup = categoryPresets.ToDictionary(preset => preset.Id);

            for (var index = 0; index < command.OrderedIds.Count; index++)
            {
                presetLookup[command.OrderedIds[index]].DisplayOrder = index;
            }

            await _unitOfWork.SaveChangesAsync(ct);
        }, cancellationToken);

        ProviderPresetCacheHelper.InvalidateCategory(_cache, providerCategory);

        _logger.LogInformation(
            "Admin reordered {PresetCount} provider presets for category {ProviderCategory}: {PresetIds}",
            command.OrderedIds.Count,
            providerCategory,
            command.OrderedIds);

        return Unit.Value;
    }
}
