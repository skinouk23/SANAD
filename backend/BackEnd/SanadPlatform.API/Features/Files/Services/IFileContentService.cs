using SanadPlatform.API.Common.Storage;
using SanadPlatform.API.Features.Files.DTOs;

namespace SanadPlatform.API.Features.Files.Services;

/// <summary>
/// Application service for file metadata, content, and delete operations.
/// </summary>
public interface IFileContentService
{
    Task<FileMetadataResponse> GetMetadataAsync(
        Guid fileId,
        Guid userId,
        string role,
        string? ipAddress,
        string? userAgent,
        string? correlationId,
        CancellationToken cancellationToken = default);

    Task<FileMetadataResponse> GetProviderSignupMetadataAsync(
        Guid applicationId,
        Guid fileId,
        string? ipAddress,
        string? userAgent,
        string? correlationId,
        CancellationToken cancellationToken = default);

    Task<FileContentResultData> GetContentAsync(
        Guid fileId,
        Guid userId,
        string role,
        string? ipAddress,
        string? userAgent,
        string? correlationId,
        CancellationToken cancellationToken = default);

    Task<FileContentResultData> GetPublicContentAsync(
        Guid fileId,
        string? ipAddress,
        string? userAgent,
        string? correlationId,
        CancellationToken cancellationToken = default);

    Task<FileContentResultData> GetDomainAuthorizedContentAsync(
        Guid fileId,
        FileUseCase expectedUseCase,
        Guid userId,
        string role,
        string? ipAddress,
        string? userAgent,
        string? correlationId,
        CancellationToken cancellationToken = default);

    Task<DeleteFileResponse> DeleteAsync(
        Guid fileId,
        Guid userId,
        string role,
        string? ipAddress,
        string? userAgent,
        string? correlationId,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Content stream and headers for a file content response.
/// </summary>
public sealed record FileContentResultData(
    Stream Content,
    string ContentType,
    string FileName,
    long SizeBytes,
    string? ETag,
    DateTime? LastModified,
    bool EnableRangeProcessing,
    string ContentDisposition,
    Task Completion);
