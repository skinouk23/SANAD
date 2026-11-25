using System.Net.Sockets;

using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;
using Minio.DataModel.ILM;
using Minio.Exceptions;
using SanadPlatform.API.Common.Options;

namespace SanadPlatform.API.Infrastructure.Storage;

/// <summary>
/// Hosted service that ensures all required MinIO buckets exist on application startup.
/// Iterates configured file-storage buckets and creates any missing buckets when MinIO is reachable.
/// Connectivity failures are logged as warnings so the application can start with degraded storage features.
/// </summary>
public class BucketInitializationService : IHostedService
{
    private const string StagingLifecycleRuleId = "expire-orphan-staging-objects";
    private const string StagingObjectPrefix = "staging/";
    private const int StagingObjectExpirationDays = 1;

    private readonly IMinioClient _minioClient;
    private readonly FileStorageOptions _fileStorageOptions;
    private readonly ILogger<BucketInitializationService> _logger;

    /// <summary>
    /// Initializes a new instance of <see cref="BucketInitializationService"/>.
    /// </summary>
    public BucketInitializationService(
        IMinioClient minioClient,
        IOptions<FileStorageOptions> fileStorageOptions,
        ILogger<BucketInitializationService> logger)
    {
        _minioClient = minioClient ?? throw new ArgumentNullException(nameof(minioClient));
        _fileStorageOptions = fileStorageOptions?.Value ?? throw new ArgumentNullException(nameof(fileStorageOptions));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Verifies and creates all required MinIO buckets on startup.
    /// Logs a warning and continues startup when MinIO is temporarily unavailable.
    /// </summary>
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        var buckets = _fileStorageOptions.GetBuckets()
            .Distinct(StringComparer.Ordinal)
            .ToArray();

        _logger.LogInformation("Starting MinIO bucket initialization for {Count} buckets", buckets.Length);

        string? currentBucket = null;

        try
        {
            foreach (var bucketName in buckets)
            {
                currentBucket = bucketName;

                var existsArgs = new BucketExistsArgs().WithBucket(bucketName);
                var exists = await _minioClient.BucketExistsAsync(existsArgs, cancellationToken).ConfigureAwait(false);

                if (exists)
                {
                    _logger.LogInformation("Bucket {BucketName} verified", bucketName);
                }
                else
                {
                    var makeArgs = new MakeBucketArgs().WithBucket(bucketName);
                    await _minioClient.MakeBucketAsync(makeArgs, cancellationToken).ConfigureAwait(false);
                    _logger.LogInformation("Created bucket {BucketName}", bucketName);
                }
            }

            currentBucket = _fileStorageOptions.StagingBucket;
            await ConfigureStagingLifecycleAsync(cancellationToken).ConfigureAwait(false);

            _logger.LogInformation("MinIO bucket initialization completed successfully");
        }
        catch (Exception ex) when (IsConnectivityException(ex, cancellationToken))
        {
            _logger.LogWarning(
                ex,
                "Unable to connect to MinIO while initializing bucket {BucketName}. The application will continue to start, but storage features will be degraded until MinIO becomes available.",
                currentBucket ?? "unknown");
        }
    }

    private async Task ConfigureStagingLifecycleAsync(CancellationToken cancellationToken)
    {
        var lifecycleConfiguration = new LifecycleConfiguration(new List<LifecycleRule>
        {
            new()
            {
                ID = StagingLifecycleRuleId,
                Status = "Enabled",
                Filter = new RuleFilter
                {
                    Prefix = StagingObjectPrefix
                },
                Expiration = new Expiration
                {
                    Days = StagingObjectExpirationDays
                }
            }
        });

        var lifecycleArgs = new SetBucketLifecycleArgs()
            .WithBucket(_fileStorageOptions.StagingBucket)
            .WithLifecycleConfiguration(lifecycleConfiguration);

        await _minioClient.SetBucketLifecycleAsync(lifecycleArgs, cancellationToken).ConfigureAwait(false);

        _logger.LogInformation(
            "Configured MinIO staging lifecycle rule {RuleId} for bucket {BucketName} with prefix {Prefix} expiring after {ExpirationDays} day(s)",
            StagingLifecycleRuleId,
            _fileStorageOptions.StagingBucket,
            StagingObjectPrefix,
            StagingObjectExpirationDays);
    }

    private static bool IsConnectivityException(Exception exception, CancellationToken cancellationToken)
    {
        if (cancellationToken.IsCancellationRequested)
        {
            return false;
        }

        while (true)
        {
            switch (exception)
            {
                case ConnectionException:
                case HttpRequestException:
                case TimeoutException:
                case TaskCanceledException:
                case SocketException:
                    return true;
                case AggregateException aggregateException:
                    foreach (var innerException in aggregateException.InnerExceptions)
                    {
                        if (IsConnectivityException(innerException, cancellationToken))
                        {
                            return true;
                        }
                    }

                    return false;
                case { InnerException: not null }:
                    exception = exception.InnerException;
                    continue;
                default:
                    return false;
            }
        }
    }

    /// <summary>
    /// No-op. Bucket cleanup is not performed on shutdown.
    /// </summary>
    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
