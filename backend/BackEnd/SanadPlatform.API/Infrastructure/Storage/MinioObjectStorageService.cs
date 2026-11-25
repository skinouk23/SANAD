using System.IO.Pipelines;
using Minio;
using Minio.DataModel.Args;
using Minio.Exceptions;

namespace SanadPlatform.API.Infrastructure.Storage;

/// <summary>
/// MinIO implementation of the backend-owned object-storage abstraction.
/// </summary>
public class MinioObjectStorageService : IObjectStorageService
{
    private const long ReadPipePauseWriterThreshold = 1024 * 1024;
    private const long ReadPipeResumeWriterThreshold = 512 * 1024;

    private readonly IMinioClient _minioClient;
    private readonly ILogger<MinioObjectStorageService> _logger;

    public MinioObjectStorageService(
        IMinioClient minioClient,
        ILogger<MinioObjectStorageService> logger)
    {
        _minioClient = minioClient ?? throw new ArgumentNullException(nameof(minioClient));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public async Task<ObjectStorageMetadata> PutObjectAsync(
        string bucket,
        string objectKey,
        Stream source,
        long sizeBytes,
        string contentType,
        CancellationToken cancellationToken = default)
    {
        var args = new PutObjectArgs()
            .WithBucket(bucket)
            .WithObject(objectKey)
            .WithStreamData(source)
            .WithObjectSize(sizeBytes)
            .WithContentType(contentType);

        await _minioClient.PutObjectAsync(args, cancellationToken).ConfigureAwait(false);
        var metadata = await StatObjectAsync(bucket, objectKey, cancellationToken).ConfigureAwait(false);

        _logger.LogInformation(
            "Stored object {Bucket}/{ObjectKey} ({SizeBytes} bytes)",
            bucket,
            objectKey,
            sizeBytes);

        return metadata;
    }

    /// <inheritdoc />
    public async Task<ObjectStorageReadResult> ReadObjectAsync(
        string bucket,
        string objectKey,
        long? offset = null,
        long? length = null,
        CancellationToken cancellationToken = default)
    {
        var metadata = await StatObjectAsync(bucket, objectKey, cancellationToken).ConfigureAwait(false);
        var pipe = new Pipe(new PipeOptions(
            pauseWriterThreshold: ReadPipePauseWriterThreshold,
            resumeWriterThreshold: ReadPipeResumeWriterThreshold));
        var completion = StreamObjectToPipeAsync(bucket, objectKey, offset, length, pipe.Writer, cancellationToken);

        return new ObjectStorageReadResult(
            pipe.Reader.AsStream(),
            metadata,
            offset.HasValue || length.HasValue,
            offset,
            length,
            completion);
    }

    /// <inheritdoc />
    public async Task<ObjectStorageMetadata> StatObjectAsync(
        string bucket,
        string objectKey,
        CancellationToken cancellationToken = default)
    {
        var args = new StatObjectArgs()
            .WithBucket(bucket)
            .WithObject(objectKey);

        try
        {
            var stat = await _minioClient.StatObjectAsync(args, cancellationToken).ConfigureAwait(false);
            return ToMetadata(stat);
        }
        catch (ObjectNotFoundException ex)
        {
            throw new KeyNotFoundException($"Object '{objectKey}' was not found in bucket '{bucket}'.", ex);
        }
    }

    /// <inheritdoc />
    public async Task<ObjectStorageMetadata> CopyObjectAsync(
        string sourceBucket,
        string sourceObjectKey,
        string destinationBucket,
        string destinationObjectKey,
        string? contentType = null,
        CancellationToken cancellationToken = default)
    {
        var sourceArgs = new CopySourceObjectArgs()
            .WithBucket(sourceBucket)
            .WithObject(sourceObjectKey);

        var copyArgs = new CopyObjectArgs()
            .WithBucket(destinationBucket)
            .WithObject(destinationObjectKey)
            .WithCopyObjectSource(sourceArgs);

        if (!string.IsNullOrWhiteSpace(contentType))
        {
            copyArgs.WithContentType(contentType);
            copyArgs.WithReplaceMetadataDirective(true);
        }

        await _minioClient.CopyObjectAsync(copyArgs, cancellationToken).ConfigureAwait(false);
        var metadata = await StatObjectAsync(destinationBucket, destinationObjectKey, cancellationToken).ConfigureAwait(false);

        _logger.LogInformation(
            "Copied object {SourceBucket}/{SourceObjectKey} to {DestinationBucket}/{DestinationObjectKey}",
            sourceBucket,
            sourceObjectKey,
            destinationBucket,
            destinationObjectKey);

        return metadata;
    }

    /// <inheritdoc />
    public async Task DeleteObjectAsync(
        string bucket,
        string objectKey,
        CancellationToken cancellationToken = default)
    {
        var args = new RemoveObjectArgs()
            .WithBucket(bucket)
            .WithObject(objectKey);

        await _minioClient.RemoveObjectAsync(args, cancellationToken).ConfigureAwait(false);
        _logger.LogInformation("Deleted object {Bucket}/{ObjectKey}", bucket, objectKey);
    }

    /// <inheritdoc />
    public async Task<byte[]> ReadHeadBytesAsync(
        string bucket,
        string objectKey,
        int byteCount,
        CancellationToken cancellationToken = default)
    {
        if (byteCount <= 0)
        {
            return [];
        }

        var readResult = await ReadObjectAsync(
            bucket,
            objectKey,
            offset: 0,
            length: byteCount,
            cancellationToken).ConfigureAwait(false);

        await using var result = readResult.Content;
        using var memoryStream = new MemoryStream(byteCount);
        await result.CopyToAsync(memoryStream, cancellationToken).ConfigureAwait(false);
        await readResult.Completion.ConfigureAwait(false);
        return memoryStream.ToArray();
    }

    private async Task StreamObjectToPipeAsync(
        string bucket,
        string objectKey,
        long? offset,
        long? length,
        PipeWriter writer,
        CancellationToken cancellationToken)
    {
        Exception? completionException = null;

        try
        {
            var args = new GetObjectArgs()
                .WithBucket(bucket)
                .WithObject(objectKey)
                .WithCallbackStream(async (stream, ct) =>
                {
                    var writerStream = writer.AsStream(leaveOpen: true);
                    await stream.CopyToAsync(writerStream, ct).ConfigureAwait(false);
                    await writerStream.FlushAsync(ct).ConfigureAwait(false);
                });

            if (offset.HasValue && length.HasValue)
            {
                args.WithOffsetAndLength(offset.Value, length.Value);
            }
            else if (length.HasValue)
            {
                args.WithLength(length.Value);
            }

            await _minioClient.GetObjectAsync(args, cancellationToken).ConfigureAwait(false);
        }
        catch (Exception ex)
        {
            completionException = ex;
            if (ex is not OperationCanceledException || !cancellationToken.IsCancellationRequested)
            {
                _logger.LogWarning(ex, "Failed to stream object {Bucket}/{ObjectKey} from object storage", bucket, objectKey);
            }

            throw;
        }
        finally
        {
            await writer.CompleteAsync(completionException).ConfigureAwait(false);
        }
    }

    private static ObjectStorageMetadata ToMetadata(Minio.DataModel.ObjectStat stat)
    {
        return new ObjectStorageMetadata(
            stat.Size,
            stat.ContentType,
            stat.ETag,
            stat.VersionId,
            stat.LastModified);
    }
}
