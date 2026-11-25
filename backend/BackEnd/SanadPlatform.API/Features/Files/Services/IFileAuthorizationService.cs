using SanadPlatform.API.Features.Files.Entities;

namespace SanadPlatform.API.Features.Files.Services;

/// <summary>
/// Authorization boundary for canonical files.
/// </summary>
public interface IFileAuthorizationService
{
    Task<ResolvedFileUploadRelations> AuthorizeUploadAsync(
        FilePolicy policy,
        Guid userId,
        string role,
        Guid? relatedPatientId,
        Guid? relatedProviderId,
        Guid? relatedServiceId,
        Guid? relatedBookingId,
        CancellationToken cancellationToken = default);

    Task AuthorizeReadAsync(
        StoredFile file,
        Guid userId,
        string role,
        CancellationToken cancellationToken = default);

    Task AuthorizeDeleteAsync(
        StoredFile file,
        Guid userId,
        string role,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Related aggregate IDs resolved during upload authorization.
/// </summary>
public sealed record ResolvedFileUploadRelations(
    Guid? RelatedPatientId,
    Guid? RelatedProviderId,
    Guid? RelatedServiceId,
    Guid? RelatedBookingId);
