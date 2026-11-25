using System.ComponentModel.DataAnnotations;

namespace SanadPlatform.API.Common.Options;

/// <summary>
/// Production file-storage configuration for the backend-owned file pipeline.
/// </summary>
public class FileStorageOptions
{
    public const string SectionName = "FileStorage";

    /// <summary>Bucket for newly accepted uploads awaiting scan.</summary>
    public const string StagingBucketName = "files-staging";

    /// <summary>Bucket for private final objects.</summary>
    public const string PrivateBucketName = "files-private";

    /// <summary>Bucket for public product assets still served through the API.</summary>
    public const string PublicBucketName = "files-public";

    /// <summary>Bucket for rejected or suspicious objects.</summary>
    public const string QuarantineBucketName = "files-quarantine";

    /// <summary>Bucket for generated export archives.</summary>
    public const string ExportsBucketName = "files-exports";

    public static readonly string[] CanonicalBuckets =
    [
        StagingBucketName,
        PrivateBucketName,
        PublicBucketName,
        QuarantineBucketName,
        ExportsBucketName
    ];

    [Required]
    public string StagingBucket { get; set; } = StagingBucketName;

    [Required]
    public string PrivateBucket { get; set; } = PrivateBucketName;

    [Required]
    public string PublicBucket { get; set; } = PublicBucketName;

    [Required]
    public string QuarantineBucket { get; set; } = QuarantineBucketName;

    [Required]
    public string ExportsBucket { get; set; } = ExportsBucketName;

    [Range(1, long.MaxValue)]
    public long DefaultMaxUploadBytes { get; set; } = 25 * 1024 * 1024;

    [Range(1, int.MaxValue)]
    public int StreamCopyBufferBytes { get; set; } = 128 * 1024;

    [Range(1, int.MaxValue)]
    public int MaxFileNameLength { get; set; } = 500;

    /// <summary>
    /// Returns every bucket this pipeline must verify at startup.
    /// </summary>
    public IReadOnlyList<string> GetBuckets()
    {
        return [StagingBucket, PrivateBucket, PublicBucket, QuarantineBucket, ExportsBucket];
    }
}
