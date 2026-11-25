using System.Text.Json;
using SanadPlatform.API.Common.Exceptions;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Common.Storage;
using SanadPlatform.API.Features.Files.DTOs;
using SanadPlatform.API.Features.Files.Entities;
using SanadPlatform.API.Features.Files.Repository;
using SanadPlatform.API.Infrastructure.Storage;

namespace SanadPlatform.API.Features.Files.Services;

/// <summary>
/// Handles safe metadata reads, content reads, and soft-delete state changes.
/// </summary>
public class FileContentService : IFileContentService
{
    private static readonly HashSet<string> InlineContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf"
    };

    private readonly IStoredFileRepository _storedFileRepository;
    private readonly IFileAuthorizationService _authorizationService;
    private readonly IObjectStorageService _objectStorageService;
    private readonly IUnitOfWork _unitOfWork;

    public FileContentService(
        IStoredFileRepository storedFileRepository,
        IFileAuthorizationService authorizationService,
        IObjectStorageService objectStorageService,
        IUnitOfWork unitOfWork)
    {
        _storedFileRepository = storedFileRepository ?? throw new ArgumentNullException(nameof(storedFileRepository));
        _authorizationService = authorizationService ?? throw new ArgumentNullException(nameof(authorizationService));
        _objectStorageService = objectStorageService ?? throw new ArgumentNullException(nameof(objectStorageService));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    /// <inheritdoc />
    public async Task<FileMetadataResponse> GetMetadataAsync(
        Guid fileId,
        Guid userId,
        string role,
        string? ipAddress,
        string? userAgent,
        string? correlationId,
        CancellationToken cancellationToken = default)
    {
        var file = await _storedFileRepository.GetByIdAsync(fileId, cancellationToken)
            ?? throw new KeyNotFoundException("File was not found.");

        await _authorizationService.AuthorizeReadAsync(file, userId, role, cancellationToken);
        await AuditAsync(file, userId, role, FilesConstants.AuditActions.MetadataRead, FilesConstants.AuditOutcomes.Succeeded, ipAddress, userAgent, correlationId, cancellationToken);

        return ToMetadataResponse(file);
    }

    /// <inheritdoc />
    public async Task<FileMetadataResponse> GetProviderSignupMetadataAsync(
        Guid applicationId,
        Guid fileId,
        string? ipAddress,
        string? userAgent,
        string? correlationId,
        CancellationToken cancellationToken = default)
    {
        var file = await _storedFileRepository.GetByIdAsync(fileId, cancellationToken)
            ?? throw new KeyNotFoundException("File was not found.");

        if (file.UseCase != FileUseCase.ProviderSignupDocument
            || file.RelatedApplicationId != applicationId)
        {
            await AuditAsync(file, file.OwnerUserId ?? Guid.Empty, FilesConstants.ProviderSignupOwnerRole, FilesConstants.AuditActions.MetadataRead, FilesConstants.AuditOutcomes.Denied, ipAddress, userAgent, correlationId, cancellationToken);
            throw new ForbiddenAccessException("You are not allowed to access this provider signup file.");
        }

        await AuditAsync(file, file.OwnerUserId ?? Guid.Empty, FilesConstants.ProviderSignupOwnerRole, FilesConstants.AuditActions.MetadataRead, FilesConstants.AuditOutcomes.Succeeded, ipAddress, userAgent, correlationId, cancellationToken);

        return ToMetadataResponse(file);
    }

    /// <inheritdoc />
    public async Task<FileContentResultData> GetContentAsync(
        Guid fileId,
        Guid userId,
        string role,
        string? ipAddress,
        string? userAgent,
        string? correlationId,
        CancellationToken cancellationToken = default)
    {
        var file = await _storedFileRepository.GetByIdAsync(fileId, cancellationToken)
            ?? throw new KeyNotFoundException("File was not found.");

        await _authorizationService.AuthorizeReadAsync(file, userId, role, cancellationToken);

        if (file.Status != StoredFileStatus.Ready)
        {
            await AuditAsync(file, userId, role, FilesConstants.AuditActions.ContentDownloadDenied, FilesConstants.AuditOutcomes.Denied, ipAddress, userAgent, correlationId, cancellationToken);
            throw new InvalidOperationException("File content is not available until the file is ready.");
        }

        return await StreamReadyContentAsync(file, userId, role, ipAddress, userAgent, correlationId, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<FileContentResultData> GetPublicContentAsync(
        Guid fileId,
        string? ipAddress,
        string? userAgent,
        string? correlationId,
        CancellationToken cancellationToken = default)
    {
        var file = await _storedFileRepository.GetByIdAsync(fileId, cancellationToken)
            ?? throw new KeyNotFoundException("File was not found.");

        if (file.Visibility != FileVisibility.Public)
        {
            throw new ForbiddenAccessException("This file is not publicly accessible.");
        }

        if (file.Status != StoredFileStatus.Ready)
        {
            throw new InvalidOperationException("File content is not available until the file is ready.");
        }

        return await StreamReadyContentAsync(file, file.OwnerUserId ?? Guid.Empty, file.OwnerRole ?? "public", ipAddress, userAgent, correlationId, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<FileContentResultData> GetDomainAuthorizedContentAsync(
        Guid fileId,
        FileUseCase expectedUseCase,
        Guid userId,
        string role,
        string? ipAddress,
        string? userAgent,
        string? correlationId,
        CancellationToken cancellationToken = default)
    {
        var file = await _storedFileRepository.GetByIdAsync(fileId, cancellationToken)
            ?? throw new KeyNotFoundException("File was not found.");

        if (file.UseCase != expectedUseCase)
        {
            await AuditAsync(file, userId, role, FilesConstants.AuditActions.ContentDownloadDenied, FilesConstants.AuditOutcomes.Denied, ipAddress, userAgent, correlationId, cancellationToken);
            throw new ForbiddenAccessException("You are not allowed to access this file through this domain endpoint.");
        }

        if (file.Status != StoredFileStatus.Ready)
        {
            await AuditAsync(file, userId, role, FilesConstants.AuditActions.ContentDownloadDenied, FilesConstants.AuditOutcomes.Denied, ipAddress, userAgent, correlationId, cancellationToken);
            throw new InvalidOperationException("File content is not available until the file is ready.");
        }

        return await StreamReadyContentAsync(file, userId, role, ipAddress, userAgent, correlationId, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<DeleteFileResponse> DeleteAsync(
        Guid fileId,
        Guid userId,
        string role,
        string? ipAddress,
        string? userAgent,
        string? correlationId,
        CancellationToken cancellationToken = default)
    {
        var file = await _storedFileRepository.GetByIdForUpdateAsync(fileId, cancellationToken)
            ?? throw new KeyNotFoundException("File was not found.");

        await _authorizationService.AuthorizeDeleteAsync(file, userId, role, cancellationToken);

        if (file.Status == StoredFileStatus.Deleted || file.DeletedAt.HasValue)
        {
            return new DeleteFileResponse { FileId = file.Id, Status = "deleted" };
        }

        file.Status = StoredFileStatus.Deleting;
        file.DeletedAt = DateTime.UtcNow;

        var audit = CreateAudit(file, userId, role, FilesConstants.AuditActions.DeleteRequested, FilesConstants.AuditOutcomes.Succeeded, ipAddress, userAgent, correlationId);
        var cleanupMessage = CreateOutboxMessage(file, FilesConstants.Events.CleanupRequested, correlationId);
        await _storedFileRepository.CreateAuditAsync(audit, cancellationToken);
        await _storedFileRepository.CreateOutboxMessageAsync(cleanupMessage, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new DeleteFileResponse { FileId = file.Id, Status = "deleting" };
    }

    private async Task AuditAsync(
        StoredFile file,
        Guid userId,
        string role,
        string action,
        string outcome,
        string? ipAddress,
        string? userAgent,
        string? correlationId,
        CancellationToken cancellationToken)
    {
        await _storedFileRepository.CreateAuditAsync(
            CreateAudit(file, userId, role, action, outcome, ipAddress, userAgent, correlationId),
            cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task<FileContentResultData> StreamReadyContentAsync(
        StoredFile file,
        Guid userId,
        string role,
        string? ipAddress,
        string? userAgent,
        string? correlationId,
        CancellationToken cancellationToken)
    {
        await AuditAsync(file, userId, role, FilesConstants.AuditActions.ContentDownloadStarted, FilesConstants.AuditOutcomes.Succeeded, ipAddress, userAgent, correlationId, cancellationToken);

        var readResult = await _objectStorageService.ReadObjectAsync(
            file.Bucket,
            file.ObjectKey,
            cancellationToken: cancellationToken);

        var contentType = string.IsNullOrWhiteSpace(file.DetectedContentType)
            ? file.DeclaredContentType
            : file.DetectedContentType;

        return new FileContentResultData(
            readResult.Content,
            contentType,
            file.OriginalFileName,
            file.SizeBytes,
            file.ETag ?? readResult.Metadata.ETag,
            readResult.Metadata.LastModified,
            EnableRangeProcessing: false,
            ContentDisposition: BuildContentDisposition(contentType, file.OriginalFileName),
            Completion: readResult.Completion);
    }

    private static FileAccessAudit CreateAudit(
        StoredFile file,
        Guid userId,
        string role,
        string action,
        string outcome,
        string? ipAddress,
        string? userAgent,
        string? correlationId)
    {
        return new FileAccessAudit
        {
            FileId = file.Id,
            ActorUserId = userId,
            ActorRole = role,
            Action = action,
            Outcome = outcome,
            IpAddress = ipAddress,
            UserAgent = userAgent,
            CorrelationId = correlationId,
            DetailsJson = JsonSerializer.Serialize(new { file.UseCase, file.Status })
        };
    }

    private static OutboxMessage CreateOutboxMessage(StoredFile file, string eventType, string? correlationId)
    {
        return new OutboxMessage
        {
            EventType = eventType,
            AggregateType = nameof(StoredFile),
            AggregateId = file.Id,
            PayloadJson = JsonSerializer.Serialize(new { fileId = file.Id, file.Bucket, file.ObjectKey, file.StagingBucket, file.StagingObjectKey }),
            CorrelationId = correlationId,
            IdempotencyKey = $"{eventType}:{file.Id:D}:{DateTime.UtcNow.Ticks}",
            Status = OutboxStatus.Pending,
            OccurredAt = DateTime.UtcNow,
            NextAttemptAt = DateTime.UtcNow
        };
    }

    private static FileMetadataResponse ToMetadataResponse(StoredFile file)
    {
        var contentType = string.IsNullOrWhiteSpace(file.DetectedContentType)
            ? file.DeclaredContentType
            : file.DetectedContentType;

        return new FileMetadataResponse
        {
            FileId = file.Id,
            UseCase = ToSnakeCase(file.UseCase.ToString()),
            Category = file.Category.ToString().ToLowerInvariant(),
            Visibility = file.Visibility.ToString().ToLowerInvariant(),
            Status = ToSnakeCase(file.Status.ToString()),
            ScanStatus = ToSnakeCase(file.ScanStatus.ToString()),
            FileName = file.OriginalFileName,
            ContentType = contentType,
            SizeBytes = file.SizeBytes,
            CreatedAt = file.CreatedAt,
            ReadyAt = file.ReadyAt,
            RejectionReason = file.RejectionReason
        };
    }

    private static string BuildContentDisposition(string contentType, string fileName)
    {
        var disposition = InlineContentTypes.Contains(contentType) ? "inline" : "attachment";
        var escapedFileName = fileName.Replace("\"", "", StringComparison.Ordinal);
        return $"{disposition}; filename=\"{escapedFileName}\"";
    }

    private static string ToSnakeCase(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return string.Empty;
        }

        var chars = new List<char>(value.Length + 8);
        for (var i = 0; i < value.Length; i++)
        {
            var c = value[i];
            if (char.IsUpper(c) && i > 0)
            {
                chars.Add('_');
            }

            chars.Add(char.ToLowerInvariant(c));
        }

        return new string(chars.ToArray());
    }
}
