using SanadPlatform.API.Features.Services.Entities;

namespace SanadPlatform.API.Features.Services.Repository;

/// <summary>
/// Data-access contract for service-photo attachments.
/// </summary>
public interface IServicePhotoRepository
{
    Task CreateServicePhotoAsync(ServicePhoto servicePhoto, CancellationToken ct = default);
    Task<ServicePhoto?> GetServicePhotoAsync(Guid serviceId, Guid fileId, CancellationToken ct = default);
    Task ClearMainPhotoAsync(Guid serviceId, CancellationToken ct = default);
}
