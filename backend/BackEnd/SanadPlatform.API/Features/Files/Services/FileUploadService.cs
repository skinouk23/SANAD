using System.Net;
using System.Security.Cryptography;
using System.Text.Json;
using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Exceptions;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Common.Options;
using SanadPlatform.API.Common.Storage;
using SanadPlatform.API.Features.Files.DTOs;
using SanadPlatform.API.Features.Files.Entities;
using SanadPlatform.API.Features.Files.Repository;
using SanadPlatform.API.Infrastructure.Storage;

namespace SanadPlatform.API.Features.Files.Services;

/// <summary>
/// Streams uploaded bytes to staging, computes SHA-256, and creates file/outbox rows atomically.
/// </summary>
public class FileUploadService : IFileUploadService
{
    private const int SignatureByteCount = 16;

    private readonly IStoredFileRepository _storedFileRepository;
    private readonly IFilePolicyResolver _policyResolver;
    private readonly IFileAuthorizationService _authorizationService;
    private readonly IObjectStorageService _objectStorageService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly FileStorageOptions _fileStorageOptions;
    private readonly ProviderSignupUploadTokenOptions _signupTokenOptions;
    private readonly ILogger<FileUploadService> _logger;

    public FileUploadService(
        IStoredFileRepository storedFileRepository,
        IFilePolicyResolver policyResolver,
        IFileAuthorizationService authorizationService,
        IObjectStorageService objectStorageService,
        IUnitOfWork unitOfWork,
        IOptions<FileStorageOptions> fileStorageOptions,
        IOptions<ProviderSignupUploadTokenOptions> signupTokenOptions,
        ILogger<FileUploadService> logger)
    {
        _storedFileRepository = storedFileRepository ?? throw new ArgumentNullException(nameof(storedFileRepository));
        _policyResolver = policyResolver ?? throw new ArgumentNullException(nameof(policyResolver));
        _authorizationService = authorizationService ?? throw new ArgumentNullException(nameof(authorizationService));
        _objectStorageService = objectStorageService ?? throw new ArgumentNullException(nameof(objectStorageService));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _fileStorageOptions = fileStorageOptions?.Value ?? throw new ArgumentNullException(nameof(fileStorageOptions));
        _signupTokenOptions = signupTokenOptions?.Value ?? throw new ArgumentNullException(nameof(signupTokenOptions));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public async Task<FileUploadResponse> UploadAuthenticatedAsync(
        IFormFile file,
        FileUseCase useCase,
        Guid userId,
        string role,
        Guid? relatedPatientId,
        Guid? relatedProviderId,
        Guid? relatedServiceId,
        Guid? relatedBookingId,
        Guid? relatedApplicationId,
        string? correlationId,
        CancellationToken cancellationToken = default)
    {
        var policy = _policyResolver.Resolve(useCase);
        if (policy.UseCase == FileUseCase.ProviderSignupDocument)
        {
            throw new ForbiddenAccessException("Provider signup documents must use the provider signup upload endpoint.");
        }

        var resolvedRelations = await _authorizationService.AuthorizeUploadAsync(
            policy,
            userId,
            role,
            relatedPatientId,
            relatedProviderId,
            relatedServiceId,
            relatedBookingId,
            cancellationToken);

        return await UploadCoreAsync(
            file,
            policy,
            ownerUserId: userId,
            ownerRole: role,
            resolvedRelations.RelatedPatientId,
            resolvedRelations.RelatedProviderId,
            resolvedRelations.RelatedServiceId,
            resolvedRelations.RelatedBookingId,
            relatedApplicationId,
            correlationId,
            cancellationToken);
    }

    /// <inheritdoc />
    public async Task<FileUploadResponse> UploadProviderSignupAsync(
        IFormFile file,
        Guid applicationId,
        string? correlationId,
        CancellationToken cancellationToken = default)
    {
        var existingCount = await _storedFileRepository.CountByApplicationAsync(
            applicationId,
            FileUseCase.ProviderSignupDocument,
            cancellationToken);
        if (existingCount >= _signupTokenOptions.MaxFilesPerApplication)
        {
            throw new UploadApiException(
                HttpStatusCode.BadRequest,
                "provider_signup_file_limit_exceeded",
                "Provider signup application has reached the maximum number of uploaded files.",
                new { _signupTokenOptions.MaxFilesPerApplication });
        }

        var policy = _policyResolver.Resolve(FileUseCase.ProviderSignupDocument);
        return await UploadCoreAsync(
            file,
            policy,
            ownerUserId: null,
            ownerRole: FilesConstants.ProviderSignupOwnerRole,
            relatedPatientId: null,
            relatedProviderId: null,
            relatedServiceId: null,
            relatedBookingId: null,
            relatedApplicationId: applicationId,
            correlationId,
            cancellationToken);
    }

    private async Task<FileUploadResponse> UploadCoreAsync(
        IFormFile file,
        FilePolicy policy,
        Guid? ownerUserId,
        string? ownerRole,
        Guid? relatedPatientId,
        Guid? relatedProviderId,
        Guid? relatedServiceId,
        Guid? relatedBookingId,
        Guid? relatedApplicationId,
        string? correlationId,
        CancellationToken cancellationToken)
    {
        ValidateFile(file, policy);

        var fileId = Guid.NewGuid();
        var originalFileName = Path.GetFileName(file.FileName.Trim());
        var extension = Path.GetExtension(originalFileName).ToLowerInvariant();
        var stagingObjectKey = BuildObjectKey(policy.UseCase, fileId, extension, relatedPatientId, relatedProviderId, relatedServiceId, relatedBookingId, relatedApplicationId, staging: true);
        var finalBucket = ResolveFinalBucket(policy);
        var finalObjectKey = BuildObjectKey(policy.UseCase, fileId, extension, relatedPatientId, relatedProviderId, relatedServiceId, relatedBookingId, relatedApplicationId, staging: false);

        byte[] headBytes;
        string sha256;
        await using (var uploadStream = file.OpenReadStream())
        using (var hashingStream = new HashingReadStream(uploadStream, SignatureByteCount))
        {
            await _objectStorageService.PutObjectAsync(
                _fileStorageOptions.StagingBucket,
                stagingObjectKey,
                hashingStream,
                file.Length,
                file.ContentType,
                cancellationToken);

            sha256 = hashingStream.HashHex;
            headBytes = hashingStream.HeadBytes;
        }

        var detectedContentType = FileSignatureDetector.DetectContentType(headBytes);
        ValidateDetectedContent(policy, file.ContentType, detectedContentType);

        var stagedMetadata = await _objectStorageService.StatObjectAsync(
            _fileStorageOptions.StagingBucket,
            stagingObjectKey,
            cancellationToken);

        var now = DateTime.UtcNow;
        var storedFile = new StoredFile
        {
            Id = fileId,
            UseCase = policy.UseCase,
            Category = policy.Category,
            Visibility = policy.Visibility,
            Status = StoredFileStatus.PendingScan,
            ScanStatus = FileScanStatus.Pending,
            ScanVerdict = FileScanVerdict.Unknown,
            Bucket = finalBucket,
            ObjectKey = finalObjectKey,
            StagingBucket = _fileStorageOptions.StagingBucket,
            StagingObjectKey = stagingObjectKey,
            QuarantineBucket = _fileStorageOptions.QuarantineBucket,
            OriginalFileName = originalFileName,
            DeclaredContentType = file.ContentType.Trim().ToLowerInvariant(),
            DetectedContentType = detectedContentType,
            SizeBytes = stagedMetadata.Size,
            Sha256 = sha256,
            ETag = stagedMetadata.ETag,
            OwnerUserId = ownerUserId,
            OwnerRole = ownerRole,
            RelatedPatientId = relatedPatientId,
            RelatedProviderId = relatedProviderId,
            RelatedServiceId = relatedServiceId,
            RelatedBookingId = relatedBookingId,
            RelatedApplicationId = relatedApplicationId,
            RetentionPolicy = policy.RetentionPolicy,
            RetentionExpiresAt = ComputeRetentionExpiry(policy.RetentionPolicy),
            CreatedAt = now,
            UpdatedAt = now
        };

        var outboxMessage = CreateOutboxMessage(storedFile, FilesConstants.Events.ScanRequested, correlationId);
        var audit = CreateAudit(storedFile, FilesConstants.AuditActions.UploadAccepted, FilesConstants.AuditOutcomes.Succeeded, correlationId);

        await _unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            await _storedFileRepository.CreateAsync(storedFile, ct);
            await _storedFileRepository.CreateAuditAsync(audit, ct);
            await _storedFileRepository.CreateOutboxMessageAsync(outboxMessage, ct);
            await _unitOfWork.SaveChangesAsync(ct);
        }, cancellationToken);

        _logger.LogInformation(
            "Accepted file {FileId} for use case {UseCase} into staging",
            storedFile.Id,
            storedFile.UseCase);

        return ToUploadResponse(storedFile);
    }

    private void ValidateFile(IFormFile file, FilePolicy policy)
    {
        if (file is null || file.Length <= 0)
        {
            throw new UploadApiException(HttpStatusCode.BadRequest, "file_missing", "A non-empty file is required.");
        }

        if (file.Length > policy.MaxBytes)
        {
            throw new UploadApiException(
                HttpStatusCode.BadRequest,
                "upload_object_too_large",
                "The uploaded file exceeds the policy maximum size.",
                new { FileLength = file.Length, policy.MaxBytes });
        }

        var fileName = Path.GetFileName(file.FileName.Trim());
        if (string.IsNullOrWhiteSpace(fileName) || fileName.Length > _fileStorageOptions.MaxFileNameLength)
        {
            throw new UploadApiException(HttpStatusCode.BadRequest, "file_name_invalid", "The uploaded file name is invalid.");
        }

        var extension = Path.GetExtension(fileName);
        if (!policy.AllowedExtensions.Contains(extension))
        {
            throw new UploadApiException(
                HttpStatusCode.BadRequest,
                "upload_policy_violation",
                "The file extension is not allowed for this use case.",
                new { allowedExtensions = policy.AllowedExtensions });
        }

        var contentType = file.ContentType.Trim().ToLowerInvariant();
        if (!policy.AllowedContentTypes.Contains(contentType))
        {
            throw new UploadApiException(
                HttpStatusCode.BadRequest,
                "upload_object_type_mismatch",
                "The declared content type is not allowed for this use case.",
                new { declaredContentType = contentType, allowedContentTypes = policy.AllowedContentTypes });
        }
    }

    private static void ValidateDetectedContent(FilePolicy policy, string declaredContentType, string? detectedContentType)
    {
        if (detectedContentType is null || !policy.AllowedContentTypes.Contains(detectedContentType))
        {
            throw new UploadApiException(
                HttpStatusCode.BadRequest,
                "upload_object_type_mismatch",
                "Uploaded object bytes do not match an allowed file signature.",
                new { declaredContentType, detectedContentType, allowedContentTypes = policy.AllowedContentTypes });
        }

        if (!string.Equals(declaredContentType, detectedContentType, StringComparison.OrdinalIgnoreCase))
        {
            throw new UploadApiException(
                HttpStatusCode.BadRequest,
                "upload_object_type_mismatch",
                "Uploaded object signature does not match the declared content type.",
                new { declaredContentType, detectedContentType });
        }
    }

    private string ResolveFinalBucket(FilePolicy policy)
    {
        return policy.Visibility switch
        {
            FileVisibility.Public => _fileStorageOptions.PublicBucket,
            FileVisibility.Private or FileVisibility.Restricted => _fileStorageOptions.PrivateBucket,
            _ => _fileStorageOptions.PrivateBucket
        };
    }

    private static string BuildObjectKey(
        FileUseCase useCase,
        Guid fileId,
        string extension,
        Guid? relatedPatientId,
        Guid? relatedProviderId,
        Guid? relatedServiceId,
        Guid? relatedBookingId,
        Guid? relatedApplicationId,
        bool staging)
    {
        var aggregate = ResolveAggregate(useCase, relatedPatientId, relatedProviderId, relatedServiceId, relatedBookingId, relatedApplicationId);
        var now = DateTime.UtcNow;
        var prefix = staging ? "staging" : aggregate.Type;
        return $"{prefix}/{aggregate.Id}/{useCase.ToString().ToLowerInvariant()}/{now:yyyy}/{now:MM}/{now:dd}/{fileId:D}{extension}";
    }

    private static (string Type, Guid Id) ResolveAggregate(
        FileUseCase useCase,
        Guid? relatedPatientId,
        Guid? relatedProviderId,
        Guid? relatedServiceId,
        Guid? relatedBookingId,
        Guid? relatedApplicationId)
    {
        return useCase switch
        {
            FileUseCase.Prescription or FileUseCase.MedicalDocument => ("patients", relatedPatientId ?? Guid.Empty),
            FileUseCase.ProviderCredential => ("providers", relatedProviderId ?? Guid.Empty),
            FileUseCase.ProviderSignupDocument => ("provider-signup", relatedApplicationId ?? Guid.Empty),
            FileUseCase.ServicePhoto => ("services", relatedServiceId ?? Guid.Empty),
            FileUseCase.BookingAttachment => ("bookings", relatedBookingId ?? Guid.Empty),
            FileUseCase.GdprExport => ("exports", relatedApplicationId ?? Guid.Empty),
            _ => ("users", relatedPatientId ?? relatedProviderId ?? relatedApplicationId ?? Guid.Empty)
        };
    }

    private static DateTime? ComputeRetentionExpiry(RetentionPolicy retentionPolicy)
    {
        return retentionPolicy switch
        {
            RetentionPolicy.Medical7Years => DateTime.UtcNow.AddYears(7),
            RetentionPolicy.Temporary30Days => DateTime.UtcNow.AddDays(30),
            RetentionPolicy.Standard1Year => DateTime.UtcNow.AddYears(1),
            RetentionPolicy.Indefinite => null,
            _ => null
        };
    }

    private static OutboxMessage CreateOutboxMessage(StoredFile file, string eventType, string? correlationId)
    {
        var payload = JsonSerializer.Serialize(new
        {
            fileId = file.Id,
            file.UseCase,
            file.StagingBucket,
            file.StagingObjectKey,
            file.Bucket,
            file.ObjectKey,
            file.SizeBytes,
            file.Sha256,
            correlationId
        });

        return new OutboxMessage
        {
            EventType = eventType,
            AggregateType = nameof(StoredFile),
            AggregateId = file.Id,
            PayloadJson = payload,
            CorrelationId = correlationId,
            IdempotencyKey = $"{eventType}:{file.Id:D}",
            Status = OutboxStatus.Pending,
            OccurredAt = DateTime.UtcNow,
            NextAttemptAt = DateTime.UtcNow
        };
    }

    private static FileAccessAudit CreateAudit(
        StoredFile file,
        string action,
        string outcome,
        string? correlationId)
    {
        return new FileAccessAudit
        {
            FileId = file.Id,
            ActorUserId = file.OwnerUserId,
            ActorRole = file.OwnerRole,
            Action = action,
            Outcome = outcome,
            CorrelationId = correlationId,
            DetailsJson = JsonSerializer.Serialize(new { file.UseCase, file.SizeBytes })
        };
    }

    private static FileUploadResponse ToUploadResponse(StoredFile file)
    {
        return new FileUploadResponse
        {
            FileId = file.Id,
            Status = ToContractStatus(file.Status),
            ScanStatus = ToContractScanStatus(file.ScanStatus),
            FileName = file.OriginalFileName,
            ContentType = file.DeclaredContentType,
            SizeBytes = file.SizeBytes,
            CreatedAt = file.CreatedAt
        };
    }

    private static string ToContractStatus(StoredFileStatus status)
    {
        return status.ToString().ToLowerInvariant() switch
        {
            "pendingscan" => "pending_scan",
            "scanfailure" => "scan_failed",
            "scanfailed" => "scan_failed",
            _ => status.ToString().ToLowerInvariant()
        };
    }

    private static string ToContractScanStatus(FileScanStatus status)
    {
        return status == FileScanStatus.NotRequired
            ? "not_required"
            : status.ToString().ToLowerInvariant();
    }

    private sealed class HashingReadStream : Stream
    {
        private readonly Stream _inner;
        private readonly IncrementalHash _hash = IncrementalHash.CreateHash(HashAlgorithmName.SHA256);
        private readonly MemoryStream _headCapture;
        private readonly int _maxHeadBytes;
        private bool _hashFinalized;

        public HashingReadStream(Stream inner, int maxHeadBytes)
        {
            _inner = inner ?? throw new ArgumentNullException(nameof(inner));
            _maxHeadBytes = maxHeadBytes;
            _headCapture = new MemoryStream(maxHeadBytes);
        }

        public string HashHex
        {
            get
            {
                if (!_hashFinalized)
                {
                    _hashFinalized = true;
                    return Convert.ToHexString(_hash.GetHashAndReset()).ToLowerInvariant();
                }

                throw new InvalidOperationException("Hash has already been finalized.");
            }
        }

        public byte[] HeadBytes => _headCapture.ToArray();
        public override bool CanRead => _inner.CanRead;
        public override bool CanSeek => false;
        public override bool CanWrite => false;
        public override long Length => _inner.Length;
        public override long Position { get => _inner.Position; set => throw new NotSupportedException(); }
        public override void Flush() => throw new NotSupportedException();
        public override int Read(byte[] buffer, int offset, int count)
        {
            var read = _inner.Read(buffer, offset, count);
            AppendHashAndHead(buffer.AsSpan(offset, read));
            return read;
        }

        public override async ValueTask<int> ReadAsync(Memory<byte> buffer, CancellationToken cancellationToken = default)
        {
            var read = await _inner.ReadAsync(buffer, cancellationToken).ConfigureAwait(false);
            AppendHashAndHead(buffer.Span[..read]);
            return read;
        }

        public override Task<int> ReadAsync(byte[] buffer, int offset, int count, CancellationToken cancellationToken)
        {
            return ReadAsync(buffer.AsMemory(offset, count), cancellationToken).AsTask();
        }

        public override long Seek(long offset, SeekOrigin origin) => throw new NotSupportedException();
        public override void SetLength(long value) => throw new NotSupportedException();
        public override void Write(byte[] buffer, int offset, int count) => throw new NotSupportedException();

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _hash.Dispose();
                _headCapture.Dispose();
            }

            base.Dispose(disposing);
        }

        private void AppendHashAndHead(ReadOnlySpan<byte> bytes)
        {
            if (bytes.Length == 0)
            {
                return;
            }

            _hash.AppendData(bytes);
            var remainingHeadBytes = _maxHeadBytes - (int)_headCapture.Length;
            if (remainingHeadBytes > 0)
            {
                _headCapture.Write(bytes[..Math.Min(remainingHeadBytes, bytes.Length)]);
            }
        }
    }
}
