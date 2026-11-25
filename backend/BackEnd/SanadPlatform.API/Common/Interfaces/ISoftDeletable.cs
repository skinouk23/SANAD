namespace SanadPlatform.API.Common.Interfaces;

/// <summary>
/// Marker interface for entities that support soft deletion.
/// The interceptor converts Delete operations to soft deletes automatically.
/// Global query filters exclude soft-deleted rows from all queries.
/// </summary>
public interface ISoftDeletable
{
    DateTime? DeletedAt { get; set; }
}
