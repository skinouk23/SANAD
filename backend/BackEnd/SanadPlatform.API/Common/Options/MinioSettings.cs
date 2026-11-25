namespace SanadPlatform.API.Common.Options;

/// <summary>
/// Strongly-typed options for MinIO object storage configuration.
/// Bound from the "MinioSettings" configuration section.
/// </summary>
public class MinioSettings
{
    /// <summary>The configuration section name.</summary>
    public const string SectionName = "MinioSettings";

    // ==================== Connection Settings ====================

    /// <summary>
    /// MinIO server endpoint (e.g. "127.0.0.1:9000"). Do not include the protocol prefix.
    /// </summary>
    public string Endpoint { get; set; } = "127.0.0.1:9000";

    /// <summary>MinIO access key (root user for development, IAM access key for production).</summary>
    public string AccessKey { get; set; } = "";

    /// <summary>MinIO secret key corresponding to <see cref="AccessKey"/>.</summary>
    public string SecretKey { get; set; } = "";

    /// <summary>Whether to use HTTPS for MinIO connections. Defaults to <c>true</c> for production safety;
    /// override to <c>false</c> in <c>appsettings.Development.json</c> for local dev.</summary>
    public bool UseSSL { get; set; } = true;

    /// <summary>MinIO region. Leave empty for default.</summary>
    public string Region { get; set; } = "";

}
