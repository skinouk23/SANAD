namespace SanadPlatform.API.Common.Options;

/// <summary>
/// Strongly-typed options for Redis distributed cache configuration.
/// Bound from the "RedisSettings" configuration section.
/// When <see cref="Enabled"/> is false the application falls back to in-memory cache.
/// </summary>
public class RedisSettings
{
    /// <summary>The configuration section name.</summary>
    public const string SectionName = "RedisSettings";

    /// <summary>
    /// Whether to use Redis as the distributed cache provider.
    /// When false, <see cref="Microsoft.Extensions.Caching.Memory.IMemoryCache"/> is used instead.
    /// </summary>
    public bool Enabled { get; set; }

    /// <summary>
    /// Redis connection string (e.g. "localhost:6379" or "host:port,password=...").
    /// Required when <see cref="Enabled"/> is true.
    /// </summary>
    public string Connection { get; set; } = "localhost:6379";
}
