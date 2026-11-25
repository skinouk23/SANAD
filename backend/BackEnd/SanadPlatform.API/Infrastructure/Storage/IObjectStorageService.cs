namespace SanadPlatform.API.Infrastructure.Storage;

/// <summary>
/// Object metadata returned by backend-owned object-storage operations.
/// </summary>
public record ObjectStorageMetadata(
    long Size,
    string? ContentType,
    string? ETag,
    string? VersionId,
    DateTime LastModified);

/// <summary>
/// Stream result returned for file content reads.
/// </summary>
public sealed record ObjectStorageReadResult(
    Stream Content,
    ObjectStorageMetadata Metadata,
    bool IsRangeRequest,
    long? RangeStart,
    long? RangeLength,
    Task Completion);

/// <summary>
/// Backend-owned object-storage abstraction. New file APIs must not return presigned URLs.
/// </summary>
public interface IObjectStorageService
{
    Task<ObjectStorageMetadata> PutObjectAsync(
        string bucket,
        string objectKey,
        Stream source,
        long sizeBytes,
        string contentType,
        CancellationToken cancellationToken = default);

    Task<ObjectStorageReadResult> ReadObjectAsync(
        string bucket,
        string objectKey,
        long? offset = null,
        long? length = null,
        CancellationToken cancellationToken = default);

    Task<ObjectStorageMetadata> StatObjectAsync(
        string bucket,
        string objectKey,
        CancellationToken cancellationToken = default);

    Task<ObjectStorageMetadata> CopyObjectAsync(
        string sourceBucket,
        string sourceObjectKey,
        string destinationBucket,
        string destinationObjectKey,
        string? contentType = null,
        CancellationToken cancellationToken = default);

    Task DeleteObjectAsync(
        string bucket,
        string objectKey,
        CancellationToken cancellationToken = default);

    Task<byte[]> ReadHeadBytesAsync(
        string bucket,
        string objectKey,
        int byteCount,
        CancellationToken cancellationToken = default);
}
