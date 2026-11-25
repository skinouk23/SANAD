using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Infrastructure.Database.Interceptors;

/// <summary>
/// Interceptor that automatically sets CreatedAt and UpdatedAt timestamps
/// for entities implementing IHasCreatedAt / IAuditableEntity,
/// and converts hard deletes to soft deletes for ISoftDeletable entities.
/// </summary>
public class AuditableEntityInterceptor : SaveChangesInterceptor
{
    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        UpdateEntities(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
    {
        UpdateEntities(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private static void UpdateEntities(DbContext? context)
    {
        if (context == null) return;

        // Loop 1: Set CreatedAt for ALL entities with IHasCreatedAt
        foreach (var entry in context.ChangeTracker.Entries<IHasCreatedAt>())
        {
            if (entry.State == EntityState.Added)
                entry.Entity.CreatedAt = DateTime.UtcNow;
        }

        // Loop 2: Set UpdatedAt for mutable entities (IAuditableEntity)
        foreach (var entry in context.ChangeTracker.Entries<IAuditableEntity>())
        {
            if (entry.State == EntityState.Added)
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            else if (entry.State == EntityState.Modified || entry.HasChangedOwnedEntities())
                entry.Entity.UpdatedAt = DateTime.UtcNow;
        }

        // Loop 3: Convert hard deletes to soft deletes for ISoftDeletable
        foreach (var entry in context.ChangeTracker.Entries<ISoftDeletable>()
            .Where(e => e.State == EntityState.Deleted))
        {
            entry.State = EntityState.Modified;
            entry.Entity.DeletedAt = DateTime.UtcNow;
        }
    }
}

public static class Extensions
{
    public static bool HasChangedOwnedEntities(this Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry entry) =>
        entry.References.Any(r =>
            r.TargetEntry != null &&
            r.TargetEntry.Metadata.IsOwned() &&
            (r.TargetEntry.State == EntityState.Added || r.TargetEntry.State == EntityState.Modified));
}
