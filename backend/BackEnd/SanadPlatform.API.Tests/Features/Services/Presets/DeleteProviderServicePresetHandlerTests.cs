using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using SanadPlatform.API.Features.Services.Commands;

namespace SanadPlatform.API.Tests.Features.Services.Presets;

public class DeleteProviderServicePresetHandlerTests
{
    [Fact]
    public async Task Handle_HardDeletesPreset_InvalidatesCache_AndLogsStructuredFields()
    {
        await using var context = ProviderPresetCommandTestSupport.CreateContext();
        var preset = ProviderPresetCommandTestSupport.CreatePreset(category: "nutrition", code: "meal_plan", displayOrder: 2);
        context.ProviderServicePresets.Add(preset);
        await context.SaveChangesAsync();

        using var cache = new MemoryCache(new MemoryCacheOptions());
        ProviderPresetCommandTestSupport.SeedCategoryCache(cache, "nutrition");

        var logger = new ListLogger<DeleteProviderServicePresetHandler>();
        var handler = new DeleteProviderServicePresetHandler(context, context, cache, logger);

        var result = await handler.Handle(
            new DeleteProviderServicePresetCommand(preset.Id),
            CancellationToken.None);

        var deleted = await context.ProviderServicePresets.FindAsync([preset.Id], CancellationToken.None);

        Assert.Equal(Unit.Value, result);
        Assert.Null(deleted);
        ProviderPresetCommandTestSupport.AssertCategoryCacheInvalidated(cache, "nutrition");

        var entry = Assert.Single(logger.Entries);
        Assert.Equal(LogLevel.Information, entry.Level);
        Assert.Contains("Admin deleted provider preset", entry.Message, StringComparison.Ordinal);
        Assert.Equal(preset.Id, Assert.IsType<Guid>(entry.Properties["PresetId"]));
        Assert.Equal("nutrition", Assert.IsType<string>(entry.Properties["ProviderCategory"]));
    }

    [Fact]
    public async Task Handle_ThrowsKeyNotFoundException_WhenPresetDoesNotExist()
    {
        await using var context = ProviderPresetCommandTestSupport.CreateContext();
        using var cache = new MemoryCache(new MemoryCacheOptions());

        var handler = new DeleteProviderServicePresetHandler(
            context,
            context,
            cache,
            new ListLogger<DeleteProviderServicePresetHandler>());

        var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => handler.Handle(
            new DeleteProviderServicePresetCommand(Guid.NewGuid()),
            CancellationToken.None));

        Assert.StartsWith("Provider service preset", exception.Message, StringComparison.Ordinal);
        Assert.Empty(context.ProviderServicePresets);
    }
}
