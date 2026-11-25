using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Common.Storage;
using SanadPlatform.API.Features.Files.Repository;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Features.Services.Repository;
using SanadPlatform.API.Infrastructure.Logging;

namespace SanadPlatform.API.Features.Services.Commands;

/// <summary>
/// Command to attach an uploaded service-photo file to a provider service.
/// </summary>
public record AttachServicePhotoCommand(Guid UserId, Guid ServiceId, Guid FileId, bool IsMain, int SortOrder)
    : IRequest<ServicePhotoResponse>, ISensitiveRequest;

/// <summary>
/// Handler for <see cref="AttachServicePhotoCommand"/>.
/// </summary>
public class AttachServicePhotoHandler : IRequestHandler<AttachServicePhotoCommand, ServicePhotoResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IServiceRepository _serviceRepository;
    private readonly IServicePhotoRepository _servicePhotoRepository;
    private readonly IStoredFileRepository _storedFileRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AttachServicePhotoHandler(
        IProviderRepository providerRepository,
        IServiceRepository serviceRepository,
        IServicePhotoRepository servicePhotoRepository,
        IStoredFileRepository storedFileRepository,
        IUnitOfWork unitOfWork)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _serviceRepository = serviceRepository ?? throw new ArgumentNullException(nameof(serviceRepository));
        _servicePhotoRepository = servicePhotoRepository ?? throw new ArgumentNullException(nameof(servicePhotoRepository));
        _storedFileRepository = storedFileRepository ?? throw new ArgumentNullException(nameof(storedFileRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    /// <inheritdoc />
    public async Task<ServicePhotoResponse> Handle(AttachServicePhotoCommand command, CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(command.UserId, cancellationToken)
            ?? throw new KeyNotFoundException("Provider profile not found.");

        var service = await _serviceRepository.GetByIdAndProviderForUpdateAsync(command.ServiceId, providerId, cancellationToken)
            ?? throw new KeyNotFoundException($"Service {command.ServiceId} not found.");

        var file = await _storedFileRepository.GetByIdAsync(command.FileId, cancellationToken)
            ?? throw new KeyNotFoundException("Service photo file was not found.");

        if (file.OwnerUserId != command.UserId
            || file.UseCase != FileUseCase.ServicePhoto
            || file.Status != StoredFileStatus.Ready
            || file.RelatedServiceId != command.ServiceId
            || file.RelatedProviderId != providerId)
        {
            throw new InvalidOperationException("File cannot be attached as a service photo.");
        }

        var existing = await _servicePhotoRepository.GetServicePhotoAsync(service.Id, file.Id, cancellationToken);
        if (existing is not null)
        {
            return new ServicePhotoResponse
            {
                ServiceId = service.Id,
                FileId = file.Id,
                IsMain = existing.IsMain,
                SortOrder = existing.SortOrder
            };
        }

        if (command.IsMain)
        {
            await _servicePhotoRepository.ClearMainPhotoAsync(service.Id, cancellationToken);
            service.MainImageFileId = file.Id;
        }

        var servicePhoto = new ServicePhoto
        {
            ServiceId = service.Id,
            FileId = file.Id,
            IsMain = command.IsMain,
            SortOrder = command.SortOrder
        };

        await _servicePhotoRepository.CreateServicePhotoAsync(servicePhoto, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new ServicePhotoResponse
        {
            ServiceId = service.Id,
            FileId = file.Id,
            IsMain = servicePhoto.IsMain,
            SortOrder = servicePhoto.SortOrder
        };
    }
}
