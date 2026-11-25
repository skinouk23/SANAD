using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Common.Options;
using SanadPlatform.API.Common.Storage;
using SanadPlatform.API.Features.Authentication.DTOs;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Authentication.Repository;
using SanadPlatform.API.Features.Authentication.Services;
using SanadPlatform.API.Features.Files.Entities;
using SanadPlatform.API.Features.Files.Repository;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Providers;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Rewards.Entities;
using SanadPlatform.API.Infrastructure.Logging;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Authentication.Commands;

/// <summary>
/// Command for atomic user registration.
/// Email is normalized to lowercase before being stored.
/// <para>
/// <c>IpAddress</c> and <c>UserAgent</c> are captured in the controller from <c>HttpContext</c>
/// and stored in the initial <see cref="UserSession"/> row created upon successful registration.
/// </para>
/// </summary>
public record RegisterUserCommand(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string Phone,
    string City,
    string? Address,
    string Role,
    string? ServiceType,
    string? NutritionProviderSubtype,
    bool VerificationConsentGiven,
    Guid? ProviderApplicationId,
    IReadOnlyList<ProviderRegistrationDocumentReference> ProviderDocuments,
    string? CountryCode,
    string? DeviceFingerprint,
    string? IpAddress,
    string? UserAgent) : IRequest<RegistrationResponse>, ISensitiveRequest;

/// <summary>
/// Handler for <see cref="RegisterUserCommand"/>.
/// Performs an advisory duplicate-email check, then stages the User and the
/// role-specific profile (Patient or Provider) in the EF change tracker.
/// Creates a <see cref="UserSession"/> and embeds its ID as a <c>session_id</c> JWT claim
/// so the new account is immediately usable without a separate login step.
/// A single <c>SaveChangesAsync</c> call persists everything in one implicit transaction
/// — atomicity is guaranteed by EF Core without requiring an explicit DB transaction.
/// The unique index on <c>users.email</c> (filtered on <c>deleted_at IS NULL</c>) is the
/// definitive guard against concurrent duplicate registrations.
/// <c>Npgsql.EnableRetryOnFailure</c> handles transient DB errors automatically.
/// </summary>
public class RegisterUserHandler : IRequestHandler<RegisterUserCommand, RegistrationResponse>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserRepository _userRepository;
    private readonly IUserSessionRepository _sessionRepository;
    private readonly IStoredFileRepository _storedFileRepository;
    private readonly IPasswordHashingService _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly JwtSettings _jwtSettings;
    private readonly ILogger<RegisterUserHandler> _logger;

    public RegisterUserHandler(
        IUnitOfWork unitOfWork,
        IUserRepository userRepository,
        IUserSessionRepository sessionRepository,
        IStoredFileRepository storedFileRepository,
        IPasswordHashingService passwordHasher,
        IJwtTokenService jwtTokenService,
        IOptions<JwtSettings> jwtOptions,
        ILogger<RegisterUserHandler> logger)
    {
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _storedFileRepository = storedFileRepository ?? throw new ArgumentNullException(nameof(storedFileRepository));
        _passwordHasher = passwordHasher ?? throw new ArgumentNullException(nameof(passwordHasher));
        _jwtTokenService = jwtTokenService ?? throw new ArgumentNullException(nameof(jwtTokenService));
        _jwtSettings = jwtOptions?.Value ?? throw new ArgumentNullException(nameof(jwtOptions));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<RegistrationResponse> Handle(RegisterUserCommand command, CancellationToken cancellationToken)
    {
        var normalizedEmail = command.Email.Trim().ToLowerInvariant();
        var normalizedRole  = command.Role.Trim().ToLowerInvariant();
        var countryCode     = command.CountryCode ?? "TN";

        // ── Advisory duplicate check ──────────────────────────────────────────
        // Fast path: reject clearly duplicate requests before hitting the DB writer.
        // This is not the race-condition guard — the unique index on users.email is.
        // A concurrent request that passes this check will be caught by UniqueViolation
        // on SaveChangesAsync below.
        if (await _userRepository.ExistsByEmailAsync(normalizedEmail, cancellationToken))
        {
            throw new InvalidOperationException(
                "Registration could not be completed. If this email is already in use, please try logging in.");
        }

        // ── Build user entity ─────────────────────────────────────────────────
        // Timestamps omitted — AuditableEntityInterceptor sets them.
        var user = new User
        {
            Email = normalizedEmail,
            PasswordHash = _passwordHasher.HashPassword(command.Password),
            Role = normalizedRole,
            Phone = command.Phone,
            PreferredLanguage = "fr",
            IsActive = true,
        };

        // ── Stage user + role-specific profile ────────────────────────────────
        await _userRepository.CreateAsync(user, cancellationToken);

        if (normalizedRole == "patient")
        {
            user.Patient = new Patient
            {
                FirstName = command.FirstName,
                LastName = command.LastName,
                City = command.City,
                CountryCode = countryCode,
                Preferences = new PatientPreferences(),
                Rewards = new PatientRewards(),
            };
        }
        else if (normalizedRole == "provider")
        {
            var providerDocuments = command.ProviderDocuments ?? Array.Empty<ProviderRegistrationDocumentReference>();
            var serviceType = command.ServiceType
                ?? throw new InvalidOperationException("ServiceType is required for provider registration.");
            var normalizedServiceType = NormalizeServiceType(serviceType);
            var nutritionProviderSubtype = ResolveNutritionProviderSubtype(
                normalizedServiceType,
                command.NutritionProviderSubtype);
            var registrationApprovedAt = DateTime.UtcNow;
            var verificationRequestedAt = command.VerificationConsentGiven
                ? registrationApprovedAt
                : (DateTime?)null;

            var provider = new Provider
            {
                FirstName = command.FirstName,
                LastName = command.LastName,
                ServiceCategory = normalizedServiceType,
                NutritionProviderSubtype = nutritionProviderSubtype,
                AddressLine1 = string.IsNullOrWhiteSpace(command.Address)
                    ? null
                    : command.Address.Trim(),
                City = command.City,
                CountryCode = countryCode,
                IsApproved = true,
                ApprovedAt = registrationApprovedAt,
                RejectionReason = null,
                IsVerified = false,
                VerificationConsentGiven = command.VerificationConsentGiven,
                VerificationStatus = command.VerificationConsentGiven
                    ? ProviderConstants.VerificationStatuses.Requested
                    : ProviderConstants.VerificationStatuses.NotRequested,
                VerificationRequestedAt = verificationRequestedAt,
                VerificationReviewedAt = null,
                Preferences = new ProviderPreferences(),
            };

            var resolvedProviderDocuments = await ResolveProviderSignupDocumentsAsync(
                command.ProviderApplicationId,
                providerDocuments,
                provider.Id,
                user.Id,
                cancellationToken);

            var missingDocumentTypes = ProviderConstants.GetMissingRequiredApprovalDocumentTypes(
                resolvedProviderDocuments.Select(document => document.DocumentType));
            if (missingDocumentTypes.Length > 0)
            {
                throw new InvalidOperationException(
                    $"Provider registration requires completed approval documents: {string.Join(", ", missingDocumentTypes)}.");
            }

            foreach (var document in resolvedProviderDocuments)
            {
                provider.Documents.Add(CreateProviderDocument(document));
            }

            user.Provider = provider;
        }
        else
        {
            throw new InvalidOperationException($"Unsupported role: {normalizedRole}");
        }

        if (normalizedRole == "provider")
        {
            _logger.LogInformation(
                "Provider registration completed with immediate access for user {UserId}",
                user.Id);
        }

        // ── Build initial session ─────────────────────────────────────────────
        var deviceFingerprint = NormalizeDeviceFingerprint(command.DeviceFingerprint);
        var rawRefreshToken = _jwtTokenService.GenerateRefreshToken();
        var refreshTokenHash = _jwtTokenService.HashToken(rawRefreshToken);

        // Explicitly generate ID in C# so it's available before SaveChanges
        var sessionId = Guid.NewGuid();

        var session = new UserSession
        {
            Id = sessionId, // Assign generated ID
            UserId = user.Id,
            RefreshTokenHash = refreshTokenHash,
            DeviceFingerprint = deviceFingerprint,
            IpAddress = command.IpAddress,
            UserAgent = command.UserAgent,
            IsActive = true,
            ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryDays)
        };
        // Satisfy the NOT NULL TokenHash constraint by storing the session's own ID.
        session.TokenHash = sessionId.ToString();

        await _sessionRepository.CreateAsync(session, cancellationToken);

        await PersistRegistrationAsync(user, normalizedEmail, cancellationToken);

        // ── Generate JWT ──────────────────────────────────────────────────────
        // GenerateToken is pure in-memory (HMAC signing) — it cannot fail due to
        // a DB state issue, so there is nothing to roll back if it throws.
        var expiryMinutes = _jwtSettings.ExpiryMinutes;
        var token = _jwtTokenService.GenerateToken(
            user.Email,
            user.Id.ToString(),
            user.Role,
            sessionId,
            expiryMinutes);

        _logger.LogInformation(
            "User registered successfully with ID {UserId} (session {SessionId})",
            user.Id, session.Id);

        return new RegistrationResponse
        {
            User = new RegistrationUserResponse
            {
                Id = user.Id,
                Email = user.Email,
                Name = $"{command.FirstName} {command.LastName}",
                Role = user.Role,
                Phone = user.Phone,
                CountryCode = countryCode
            },
            Token = token,
            RefreshToken = rawRefreshToken,
            ExpiresIn = expiryMinutes * 60,
            RequiresApproval = false
        };
    }

    private async Task PersistRegistrationAsync(
        User user,
        string normalizedEmail,
        CancellationToken cancellationToken)
    {
        // EF Core wraps multiple inserts in an implicit transaction, so the User,
        // its profile and optional UserSession are committed together or not at all.
        // EnableRetryOnFailure (configured on Npgsql) handles transient failures.
        try
        {
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException ex)
            when (ex.InnerException is Npgsql.PostgresException pgEx
                && pgEx.SqlState == Npgsql.PostgresErrorCodes.UniqueViolation)
        {
            _logger.LogInformation(
                "Duplicate registration attempt for email {Email}", normalizedEmail);
            throw new InvalidOperationException(
                "Registration could not be completed. If this email is already in use, please try logging in.");
        }
    }

    // Provider signup files are uploaded before registration under a temporary
    // applicationId. If registration validation or SaveChanges fails, the files
    // stay unconsumed with RelatedProviderId = null and can be reused until the
    // upload token reference expiry. Expired unconsumed signup files
    // are not deleted inline here; they should be handled by a cleanup job.
    private async Task<IReadOnlyList<ResolvedProviderRegistrationDocumentReference>> ResolveProviderSignupDocumentsAsync(
        Guid? providerApplicationId,
        IReadOnlyList<ProviderRegistrationDocumentReference> providerDocuments,
        Guid providerId,
        Guid ownerUserId,
        CancellationToken cancellationToken)
    {
        if (!providerApplicationId.HasValue || providerApplicationId.Value == Guid.Empty)
        {
            throw new InvalidOperationException("Provider signup upload application ID is required for provider registration.");
        }

        var resolvedDocuments = new List<ResolvedProviderRegistrationDocumentReference>(providerDocuments.Count);
        var seenFileIds = new HashSet<Guid>();

        foreach (var providerDocument in providerDocuments)
        {
            var normalizedDocumentType = ProviderConstants.NormalizeApprovalDocumentType(providerDocument.DocumentType);
            if (string.IsNullOrWhiteSpace(normalizedDocumentType))
            {
                throw new InvalidOperationException("Provider document type is required.");
            }

            if (providerDocument.ApplicationId.HasValue
                && providerDocument.ApplicationId.Value != providerApplicationId.Value)
            {
                throw new InvalidOperationException("Provider document application ID does not match the registration application ID.");
            }

            if (!providerDocument.FileId.HasValue || providerDocument.FileId.Value == Guid.Empty)
            {
                throw new InvalidOperationException("Provider registration documents must reference completed file IDs.");
            }

            if (!seenFileIds.Add(providerDocument.FileId.Value))
            {
                throw new InvalidOperationException("Provider registration documents cannot reuse the same file reference more than once.");
            }

            var storedFile = await _storedFileRepository.GetByIdForUpdateAsync(providerDocument.FileId.Value, cancellationToken)
                ?? throw new InvalidOperationException("Provider signup file was not found.");

            ValidateProviderSignupStoredFile(storedFile, providerApplicationId.Value);
            storedFile.OwnerUserId = ownerUserId;
            storedFile.OwnerRole = "provider";
            storedFile.RelatedProviderId = providerId;

            resolvedDocuments.Add(new ResolvedProviderRegistrationDocumentReference(
                normalizedDocumentType,
                string.IsNullOrWhiteSpace(providerDocument.DocumentName)
                    ? storedFile.OriginalFileName
                    : providerDocument.DocumentName.Trim(),
                storedFile.Id,
                ToProviderDocumentFileSize(storedFile.SizeBytes),
                ResolveProviderDocumentMimeType(storedFile)));
        }

        return resolvedDocuments;
    }

    private static void ValidateProviderSignupStoredFile(StoredFile storedFile, Guid applicationId)
    {
        if (storedFile.RelatedApplicationId != applicationId
            || storedFile.UseCase != FileUseCase.ProviderSignupDocument
            || storedFile.Status != StoredFileStatus.Ready)
        {
            throw new InvalidOperationException("Provider signup file reference is invalid or is not ready.");
        }

        if (storedFile.RelatedProviderId.HasValue)
        {
            throw new InvalidOperationException("Provider signup file reference has already been consumed.");
        }
    }

    private static int ToProviderDocumentFileSize(long fileSizeBytes)
    {
        if (fileSizeBytes > int.MaxValue)
        {
            throw new InvalidOperationException("Provider signup document file size exceeds the provider document metadata limit.");
        }

        return (int)fileSizeBytes;
    }

    private static string? ResolveProviderDocumentMimeType(StoredFile storedFile)
    {
        return string.IsNullOrWhiteSpace(storedFile.DetectedContentType)
            ? storedFile.DeclaredContentType
            : storedFile.DetectedContentType;
    }

    private static ProviderDocument CreateProviderDocument(ResolvedProviderRegistrationDocumentReference document)
    {
        return new ProviderDocument
        {
            DocumentType = document.DocumentType,
            DocumentName = document.DocumentName,
            FileId = document.FileId,
            FileSizeBytes = document.FileSizeBytes,
            MimeType = document.MimeType,
            IsVerified = false,
            VerifiedAt = null,
            VerifiedBy = null,
            VerificationNotes = null,
            IsExpired = false
        };
    }

    private sealed record ResolvedProviderRegistrationDocumentReference(
        string DocumentType,
        string? DocumentName,
        Guid FileId,
        int FileSizeBytes,
        string? MimeType);

    private static string NormalizeServiceType(string serviceType)
    {
        return serviceType.Trim().ToLowerInvariant();
    }

    private static NutritionProviderSubtype? ResolveNutritionProviderSubtype(
        string serviceType,
        string? nutritionProviderSubtype)
    {
        if (string.Equals(serviceType, ServiceCategories.Nutrition, StringComparison.Ordinal))
        {
            if (!TryParseNutritionProviderSubtype(nutritionProviderSubtype, out var parsedSubtype))
            {
                throw new InvalidOperationException(
                    "Nutrition provider subtype is required when service type is 'nutrition'.");
            }

            return parsedSubtype;
        }

        if (!string.IsNullOrWhiteSpace(nutritionProviderSubtype))
        {
            throw new InvalidOperationException(
                "Nutrition provider subtype can only be supplied when service type is 'nutrition'.");
        }

        return null;
    }

    private static bool TryParseNutritionProviderSubtype(
        string? nutritionProviderSubtype,
        out NutritionProviderSubtype parsedSubtype)
    {
        parsedSubtype = default;

        return !string.IsNullOrWhiteSpace(nutritionProviderSubtype)
            && Enum.TryParse(
                nutritionProviderSubtype.Trim(),
                ignoreCase: true,
                out parsedSubtype);
    }

    private static string? NormalizeDeviceFingerprint(string? deviceFingerprint)
    {
        return string.IsNullOrWhiteSpace(deviceFingerprint)
            ? null
            : deviceFingerprint.Trim();
    }
}
