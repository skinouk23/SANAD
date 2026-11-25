namespace SanadPlatform.API.Common.Interfaces;

/// <summary>
/// Marker interface for mutable entities that track creation and modification times.
/// Extends IHasCreatedAt with UpdatedAt, set automatically by the interceptor.
/// </summary>
public interface IAuditableEntity : IHasCreatedAt
{
    DateTime UpdatedAt { get; set; }
}
