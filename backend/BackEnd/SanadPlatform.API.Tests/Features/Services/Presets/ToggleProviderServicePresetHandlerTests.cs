using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using SanadPlatform.API.Features.Services.Commands;

namespace SanadPlatform.API.Tests.Features.Services.Presets;

public class ToggleProviderServicePresetHandlerTests
{
    [Fact]
    public async Task Handle_UpdatesIsActive_InvalidatesCache_AndLogsStructuredFields()
    {
        await using var context = ProviderPresetCommandTestSupport.CreateContext();
        var preset = ProviderPresetCommandTestSupport.CreatePreset(category: "nutrition", isActive: true, displayOrder: 3);
        context.ProviderServicePresets.Add(preset);
        await context.SaveChangesAsync();

        using var cache = new MemoryCache(new MemoryCacheOptions());
        ProviderPresetCommandTestSupport.SeedCategoryCache(cache, "nutrition");

        var logger = new ListLogger<ToggleProviderServicePresetHandler>();
        var handler = new ToggleProviderServicePresetHandler(context, context, cache, logger);

        var result = await handler.Handle(
            new ToggleProviderServicePresetCommand(preset.Id, false),
            CancellationToken.None);

        var stored = await context.ProviderServicePresets.SingleAsync();

        Assert.Equal(Unit.Value, result);
        Assert.False(stored.IsActive);
        ProviderPresetCommandTestSupport.AssertCategoryCacheInvalidated(cache, "nutrition");

        var entry = Assert.Single(logger.Entries);
        Assert.Equal(LogLevel.Information, entry.Level);
        Assert.Contains("Admin set provider preset", entry.Message, StringComparison.Ordinal);
        Assert.Equal(preset.Id, Assert.IsType<Guid>(entry.Properties["PresetId"]));
        Assert.Equal("nutrition", Assert.IsType<string>(entry.Properties["ProviderCategory"]));
        Assert.False(Assert.IsType<bool>(entry.Properties["IsActive"]));
    }

    [Fact]
    public async Task Handle_ThrowsKeyNotFoundException_WhenPresetDoesNotExist()
    {
        await using var context = ProviderPresetCommandTestSupport.CreateContext();
        using var cache = new MemoryCache(new MemoryCacheOptions());

        var handler = new ToggleProviderServicePresetHandler(
            context,
            context,
            cache,
            new ListLogger<ToggleProviderServicePresetHandler>());

        var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => handler.Handle(
            new ToggleProviderServicePresetCommand(Guid.NewGuid(), false),
            CancellationToken.None));

        Assert.StartsWith("Provider service preset", exception.Message, StringComparison.Ordinal);
        Assert.Empty(context.ProviderServicePresets);
    }
}
