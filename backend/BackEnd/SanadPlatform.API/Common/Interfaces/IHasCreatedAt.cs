namespace SanadPlatform.API.Common.Interfaces;

/// <summary>
/// Marker interface for entities that track creation time.
/// The interceptor sets CreatedAt automatically on SaveChanges.
/// </summary>
public interface IHasCreatedAt
{
    DateTime CreatedAt { get; set; }
}
