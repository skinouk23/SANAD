using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Services.Commands;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Tests.Features.Services.Presets;

public class ReorderProviderServicePresetsHandlerTests
{
    [Fact]
    public async Task Handle_ReordersCategoryContiguously_InvalidatesCache_LogsStructuredFields_AndUsesTransactionWrapper()
    {
        await using var context = ProviderPresetCommandTestSupport.CreateContext();
        var first = ProviderPresetCommandTestSupport.CreatePreset(category: "nutrition", code: "assessment", displayOrder: 10);
        var second = ProviderPresetCommandTestSupport.CreatePreset(category: "nutrition", code: "meal_plan", displayOrder: 20);
        var third = ProviderPresetCommandTestSupport.CreatePreset(category: "nutrition", code: "follow_up", displayOrder: 30);
        context.ProviderServicePresets.AddRange(first, second, third);
        await context.SaveChangesAsync();

        using var cache = new MemoryCache(new MemoryCacheOptions());
        ProviderPresetCommandTestSupport.SeedCategoryCache(cache, "nutrition");

        var unitOfWork = new TrackingUnitOfWork(context);
        var logger = new ListLogger<ReorderProviderServicePresetsHandler>();
        var handler = new ReorderProviderServicePresetsHandler(context, unitOfWork, cache, logger);

        var result = await handler.Handle(
            new ReorderProviderServicePresetsCommand(
                " nutrition ",
                [third.Id, first.Id, second.Id]),
            CancellationToken.None);

        var ordered = await context.ProviderServicePresets
            .Where(preset => preset.ProviderCategory == "nutrition")
            .OrderBy(preset => preset.DisplayOrder)
            .ToListAsync();

        Assert.Equal(Unit.Value, result);
        Assert.Equal(1, unitOfWork.ExecuteInTransactionCallCount);
        Assert.Equal(1, unitOfWork.SaveChangesCallCount);
        Assert.Equal([third.Id, first.Id, second.Id], ordered.Select(preset => preset.Id).ToArray());
        Assert.Equal([0, 1, 2], ordered.Select(preset => preset.DisplayOrder).ToArray());
        ProviderPresetCommandTestSupport.AssertCategoryCacheInvalidated(cache, "nutrition");

        var entry = Assert.Single(logger.Entries);
        Assert.Equal(LogLevel.Information, entry.Level);
        Assert.Contains("Admin reordered", entry.Message, StringComparison.Ordinal);
        Assert.Equal("nutrition", Assert.IsType<string>(entry.Properties["ProviderCategory"]));
        Assert.Equal(3, Assert.IsType<int>(entry.Properties["PresetCount"]));
        Assert.NotNull(entry.Properties["PresetIds"]);
    }

    [Fact]
    public async Task Handle_ReordersSinglePreset_ToDisplayOrderZero_AndInvalidatesCache()
    {
        await using var context = ProviderPresetCommandTestSupport.CreateContext();
        var preset = ProviderPresetCommandTestSupport.CreatePreset(category: "nutrition", code: "assessment", displayOrder: 9);
        context.ProviderServicePresets.Add(preset);
        await context.SaveChangesAsync();

        using var cache = new MemoryCache(new MemoryCacheOptions());
        ProviderPresetCommandTestSupport.SeedCategoryCache(cache, "nutrition");

        var unitOfWork = new TrackingUnitOfWork(context);
        var handler = new ReorderProviderServicePresetsHandler(
            context,
            unitOfWork,
            cache,
            new ListLogger<ReorderProviderServicePresetsHandler>());

        var result = await handler.Handle(
            new ReorderProviderServicePresetsCommand("nutrition", [preset.Id]),
            CancellationToken.None);

        var stored = await context.ProviderServicePresets.SingleAsync();

        Assert.Equal(Unit.Value, result);
        Assert.Equal(1, unitOfWork.ExecuteInTransactionCallCount);
        Assert.Equal(1, unitOfWork.SaveChangesCallCount);
        Assert.Equal(preset.Id, stored.Id);
        Assert.Equal(0, stored.DisplayOrder);
        ProviderPresetCommandTestSupport.AssertCategoryCacheInvalidated(cache, "nutrition");
    }

    [Fact]
    public async Task Handle_ThrowsInvalidOperationException_WhenOrderedIdsCountDoesNotMatchCategoryCount()
    {
        await using var context = ProviderPresetCommandTestSupport.CreateContext();
        var first = ProviderPresetCommandTestSupport.CreatePreset(category: "nutrition", code: "assessment", displayOrder: 5);
        var second = ProviderPresetCommandTestSupport.CreatePreset(category: "nutrition", code: "meal_plan", displayOrder: 6);
        context.ProviderServicePresets.AddRange(first, second);
        await context.SaveChangesAsync();

        var unitOfWork = new TrackingUnitOfWork(context);
        var handler = new ReorderProviderServicePresetsHandler(
            context,
            unitOfWork,
            new MemoryCache(new MemoryCacheOptions()),
            new ListLogger<ReorderProviderServicePresetsHandler>());

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(
            new ReorderProviderServicePresetsCommand("nutrition", [first.Id]),
            CancellationToken.None));

        var stored = await context.ProviderServicePresets
            .Where(preset => preset.ProviderCategory == "nutrition")
            .OrderBy(preset => preset.Code)
            .ToListAsync();

        Assert.Equal("OrderedIds count must match the number of presets in the category.", exception.Message);
        Assert.Equal(1, unitOfWork.ExecuteInTransactionCallCount);
        Assert.Equal(0, unitOfWork.SaveChangesCallCount);
        Assert.Equal([5, 6], stored.Select(preset => preset.DisplayOrder).OrderBy(value => value).ToArray());
    }

    [Fact]
    public async Task Handle_ThrowsInvalidOperationException_WhenOrderedIdsContainDuplicates()
    {
        await using var context = ProviderPresetCommandTestSupport.CreateContext();
        var first = ProviderPresetCommandTestSupport.CreatePreset(category: "nutrition", code: "assessment", displayOrder: 1);
        var second = ProviderPresetCommandTestSupport.CreatePreset(category: "nutrition", code: "meal_plan", displayOrder: 2);
        context.ProviderServicePresets.AddRange(first, second);
        await context.SaveChangesAsync();

        var unitOfWork = new TrackingUnitOfWork(context);
        var handler = new ReorderProviderServicePresetsHandler(
            context,
            unitOfWork,
            new MemoryCache(new MemoryCacheOptions()),
            new ListLogger<ReorderProviderServicePresetsHandler>());

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(
            new ReorderProviderServicePresetsCommand("nutrition", [first.Id, first.Id]),
            CancellationToken.None));

        Assert.Equal("OrderedIds must not contain duplicates.", exception.Message);
        Assert.Equal(1, unitOfWork.ExecuteInTransactionCallCount);
        Assert.Equal(0, unitOfWork.SaveChangesCallCount);
    }

    [Fact]
    public async Task Handle_ThrowsKeyNotFoundException_WhenOrderedIdsContainPresetFromAnotherCategory()
    {
        await using var context = ProviderPresetCommandTestSupport.CreateContext();
        var nutritionFirst = ProviderPresetCommandTestSupport.CreatePreset(category: "nutrition", code: "assessment", displayOrder: 1);
        var nutritionSecond = ProviderPresetCommandTestSupport.CreatePreset(category: "nutrition", code: "meal_plan", displayOrder: 2);
        var nursePreset = ProviderPresetCommandTestSupport.CreatePreset(category: "nurse", code: "visit", displayOrder: 1);
        context.ProviderServicePresets.AddRange(nutritionFirst, nutritionSecond, nursePreset);
        await context.SaveChangesAsync();

        var unitOfWork = new TrackingUnitOfWork(context);
        var handler = new ReorderProviderServicePresetsHandler(
            context,
            unitOfWork,
            new MemoryCache(new MemoryCacheOptions()),
            new ListLogger<ReorderProviderServicePresetsHandler>());

        var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => handler.Handle(
            new ReorderProviderServicePresetsCommand("nutrition", [nutritionFirst.Id, nursePreset.Id]),
            CancellationToken.None));

        Assert.Equal("One or more preset IDs do not belong to this category.", exception.Message);
        Assert.Equal(1, unitOfWork.ExecuteInTransactionCallCount);
        Assert.Equal(0, unitOfWork.SaveChangesCallCount);
    }

    private sealed class TrackingUnitOfWork : IUnitOfWork
    {
        private readonly SanadDbContext _context;

        public TrackingUnitOfWork(SanadDbContext context)
        {
            _context = context;
        }

        public int ExecuteInTransactionCallCount { get; private set; }

        public int SaveChangesCallCount { get; private set; }

        public Task BeginTransactionAsync(CancellationToken cancellationToken = default)
            => Task.CompletedTask;

        public Task CommitTransactionAsync(CancellationToken cancellationToken = default)
            => Task.CompletedTask;

        public IExecutionStrategy CreateExecutionStrategy()
            => throw new NotSupportedException();

        public async Task ExecuteInTransactionAsync(
            Func<CancellationToken, Task> operation,
            CancellationToken cancellationToken = default)
        {
            ExecuteInTransactionCallCount++;
            await operation(cancellationToken);
        }

        public async Task<T> ExecuteInTransactionAsync<T>(
            Func<CancellationToken, Task<T>> operation,
            CancellationToken cancellationToken = default)
        {
            ExecuteInTransactionCallCount++;
            return await operation(cancellationToken);
        }

        public Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
            => Task.CompletedTask;

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            SaveChangesCallCount++;
            return _context.SaveChangesAsync(cancellationToken);
        }
    }
}
