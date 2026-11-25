using System.Text.Json.Serialization;
using SanadPlatform.API.Common.Storage;

namespace SanadPlatform.API.Features.Files.Messaging;

/// <summary>
/// Shared payload shape published by file outbox messages.
/// </summary>
public sealed record RabbitMqFileEventPayload
{
    [JsonPropertyName("fileId")]
    public Guid FileId { get; init; }

    [JsonPropertyName("useCase")]
    public FileUseCase? UseCase { get; init; }

    [JsonPropertyName("stagingBucket")]
    public string? StagingBucket { get; init; }

    [JsonPropertyName("stagingObjectKey")]
    public string? StagingObjectKey { get; init; }

    [JsonPropertyName("bucket")]
    public string? Bucket { get; init; }

    [JsonPropertyName("objectKey")]
    public string? ObjectKey { get; init; }

    [JsonPropertyName("sizeBytes")]
    public long? SizeBytes { get; init; }

    [JsonPropertyName("sha256")]
    public string? Sha256 { get; init; }

    [JsonPropertyName("correlationId")]
    public string? CorrelationId { get; init; }
}
