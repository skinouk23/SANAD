using SanadPlatform.API.Common.Exceptions;
using SanadPlatform.API.Common.Storage;
using SanadPlatform.API.Features.Files.Entities;
using SanadPlatform.API.Features.Patients.Repository;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Services.Repository;

namespace SanadPlatform.API.Features.Files.Services;

/// <summary>
/// Practical first-pass file authorization integrated with existing patient, provider, and service repositories.
/// </summary>
public class FileAuthorizationService : IFileAuthorizationService
{
    private readonly IPatientRepository _patientRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly IServiceRepository _serviceRepository;

    public FileAuthorizationService(
        IPatientRepository patientRepository,
        IProviderRepository providerRepository,
        IServiceRepository serviceRepository)
    {
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _serviceRepository = serviceRepository ?? throw new ArgumentNullException(nameof(serviceRepository));
    }

    /// <inheritdoc />
    public async Task<ResolvedFileUploadRelations> AuthorizeUploadAsync(
        FilePolicy policy,
        Guid userId,
        string role,
        Guid? relatedPatientId,
        Guid? relatedProviderId,
        Guid? relatedServiceId,
        Guid? relatedBookingId,
        CancellationToken cancellationToken = default)
    {
        if (!IsAllowedAuthenticatedUploadUseCase(policy.UseCase))
        {
            throw new ForbiddenAccessException("This file use case cannot be uploaded through the authenticated files endpoint.");
        }

        if (IsAdmin(role))
        {
            RequireAdminUploadRelations(policy, relatedPatientId, relatedProviderId, relatedServiceId, relatedBookingId);
            return new ResolvedFileUploadRelations(
                relatedPatientId,
                relatedProviderId,
                relatedServiceId,
                relatedBookingId);
        }

        if (policy.UseCase is FileUseCase.Avatar)
        {
            return new ResolvedFileUploadRelations(
                relatedPatientId,
                relatedProviderId,
                relatedServiceId,
                relatedBookingId);
        }

        Guid? resolvedPatientId = relatedPatientId;
        Guid? resolvedProviderId = relatedProviderId;

        if (policy.RequiresRelatedPatient)
        {
            var patientId = await _patientRepository.GetPatientIdByUserIdAsync(userId, cancellationToken)
                ?? throw new ForbiddenAccessException("Patient profile not found for this file upload.");
            if (relatedPatientId.HasValue && relatedPatientId.Value != patientId)
            {
                throw new ForbiddenAccessException("You cannot upload for the requested patient.");
            }

            resolvedPatientId = patientId;
        }

        if (policy.RequiresRelatedProvider || policy.RequiresRelatedService)
        {
            var providerId = await _providerRepository.GetProviderIdByUserIdAsync(userId, cancellationToken)
                ?? throw new ForbiddenAccessException("Provider profile not found for this file upload.");

            if (relatedProviderId.HasValue && relatedProviderId.Value != providerId)
            {
                throw new ForbiddenAccessException("You cannot upload for the requested provider.");
            }

            resolvedProviderId = providerId;

            if (policy.RequiresRelatedService)
            {
                if (!relatedServiceId.HasValue)
                {
                    throw new InvalidOperationException("A related service is required for this file use case.");
                }

                var service = await _serviceRepository.GetByIdAndProviderAsync(relatedServiceId.Value, providerId, cancellationToken);
                if (service is null)
                {
                    throw new ForbiddenAccessException("You cannot upload a file for this service.");
                }
            }
        }

        if (policy.RequiresRelatedBooking && !relatedBookingId.HasValue)
        {
            throw new InvalidOperationException("A related booking is required for this file use case.");
        }

        return new ResolvedFileUploadRelations(
            resolvedPatientId,
            resolvedProviderId,
            relatedServiceId,
            relatedBookingId);
    }

    /// <inheritdoc />
    public Task AuthorizeReadAsync(
        StoredFile file,
        Guid userId,
        string role,
        CancellationToken cancellationToken = default)
    {
        AuthorizeOwnerOrAdmin(file, userId, role);
        return Task.CompletedTask;
    }

    /// <inheritdoc />
    public Task AuthorizeDeleteAsync(
        StoredFile file,
        Guid userId,
        string role,
        CancellationToken cancellationToken = default)
    {
        AuthorizeOwnerOrAdmin(file, userId, role);
        return Task.CompletedTask;
    }

    private static void AuthorizeOwnerOrAdmin(StoredFile file, Guid userId, string role)
    {
        if (IsAdmin(role))
        {
            return;
        }

        if (file.OwnerUserId == userId)
        {
            return;
        }

        throw new ForbiddenAccessException("You are not allowed to access this file.");
    }

    private static bool IsAllowedAuthenticatedUploadUseCase(FileUseCase useCase)
    {
        return useCase is FileUseCase.Avatar
            or FileUseCase.ProviderAvatar
            or FileUseCase.Prescription
            or FileUseCase.ProviderCredential
            or FileUseCase.ServicePhoto
            or FileUseCase.MedicalDocument
            or FileUseCase.BookingAttachment;
    }

    private static bool IsAdmin(string role)
    {
        return string.Equals(role, "admin", StringComparison.OrdinalIgnoreCase);
    }

    private static void RequireAdminUploadRelations(
        FilePolicy policy,
        Guid? relatedPatientId,
        Guid? relatedProviderId,
        Guid? relatedServiceId,
        Guid? relatedBookingId)
    {
        if (policy.RequiresRelatedPatient && !relatedPatientId.HasValue)
        {
            throw new InvalidOperationException("A related patient is required for this file use case.");
        }

        if (policy.RequiresRelatedProvider && !relatedProviderId.HasValue)
        {
            throw new InvalidOperationException("A related provider is required for this file use case.");
        }

        if (policy.RequiresRelatedService && !relatedServiceId.HasValue)
        {
            throw new InvalidOperationException("A related service is required for this file use case.");
        }

        if (policy.RequiresRelatedBooking && !relatedBookingId.HasValue)
        {
            throw new InvalidOperationException("A related booking is required for this file use case.");
        }
    }
}
