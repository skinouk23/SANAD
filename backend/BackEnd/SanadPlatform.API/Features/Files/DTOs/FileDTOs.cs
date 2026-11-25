using System.Text.Json.Serialization;
using SanadPlatform.API.Common.Storage;

namespace SanadPlatform.API.Features.Files.DTOs;

/// <summary>
/// Multipart form request for authenticated file uploads.
/// </summary>
public record UploadFileRequest
{
    public IFormFile File { get; init; } = null!;

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public FileUseCase UseCase { get; init; }

    public Guid? RelatedPatientId { get; init; }
    public Guid? RelatedProviderId { get; init; }
    public Guid? RelatedServiceId { get; init; }
    public Guid? RelatedBookingId { get; init; }
    public Guid? RelatedApplicationId { get; init; }
}

/// <summary>
/// Response returned when a file has been accepted into staging.
/// </summary>
public record FileUploadResponse
{
    public Guid FileId { get; init; }
    public string Status { get; init; } = string.Empty;
    public string ScanStatus { get; init; } = string.Empty;
    public string FileName { get; init; } = string.Empty;
    public string ContentType { get; init; } = string.Empty;
    public long SizeBytes { get; init; }
    public DateTime CreatedAt { get; init; }
}

/// <summary>
/// Business-safe metadata for a stored file.
/// </summary>
public record FileMetadataResponse
{
    public Guid FileId { get; init; }
    public string UseCase { get; init; } = string.Empty;
    public string Category { get; init; } = string.Empty;
    public string Visibility { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public string ScanStatus { get; init; } = string.Empty;
    public string FileName { get; init; } = string.Empty;
    public string ContentType { get; init; } = string.Empty;
    public long SizeBytes { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? ReadyAt { get; init; }
    public string? RejectionReason { get; init; }
}

/// <summary>
/// Response returned after a file is soft-deleted and cleanup is enqueued.
/// </summary>
public record DeleteFileResponse
{
    public Guid FileId { get; init; }
    public string Status { get; init; } = string.Empty;
}

/// <summary>
/// Response returned when an anonymous provider signup draft application is initialized.
/// </summary>
public record ProviderSignupDraftApplicationResponse
{
    public Guid ApplicationId { get; init; }
    public string UploadToken { get; init; } = string.Empty;
    public DateTime UploadTokenExpiresAt { get; init; }
    public string HeaderName { get; init; } = FilesConstants.ProviderSignupUploadTokenHeader;
    public IReadOnlyList<string> AcceptedHeaderNames { get; init; } =
    [
        FilesConstants.ProviderSignupUploadTokenHeader,
        FilesConstants.ApplicationUploadTokenHeader
    ];
}

/// <summary>
/// Provider signup document reference that provider registration can send as a fileId.
/// </summary>
public record ProviderSignupFileReferenceResponse
{
    public Guid ApplicationId { get; init; }
    public Guid FileId { get; init; }
    public DateTime ReferenceExpiresAt { get; init; }
}
