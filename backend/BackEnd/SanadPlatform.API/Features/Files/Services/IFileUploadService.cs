using SanadPlatform.API.Common.Storage;
using SanadPlatform.API.Features.Files.DTOs;

namespace SanadPlatform.API.Features.Files.Services;

/// <summary>
/// Application service for backend-owned multipart uploads.
/// </summary>
public interface IFileUploadService
{
    Task<FileUploadResponse> UploadAuthenticatedAsync(
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
        CancellationToken cancellationToken = default);

    Task<FileUploadResponse> UploadProviderSignupAsync(
        IFormFile file,
        Guid applicationId,
        string? correlationId,
        CancellationToken cancellationToken = default);
}
