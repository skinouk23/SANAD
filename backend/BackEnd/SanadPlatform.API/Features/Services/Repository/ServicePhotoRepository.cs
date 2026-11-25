using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Services.Repository;

/// <summary>
/// EF Core implementation of <see cref="IServicePhotoRepository"/>.
/// </summary>
public class ServicePhotoRepository : IServicePhotoRepository
{
    private readonly SanadDbContext _context;
    private readonly ILogger<ServicePhotoRepository> _logger;

    public ServicePhotoRepository(SanadDbContext context, ILogger<ServicePhotoRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public Task CreateServicePhotoAsync(ServicePhoto servicePhoto, CancellationToken ct = default)
    {
        ArgumentNullException.ThrowIfNull(servicePhoto);
        _context.ServicePhotos.Add(servicePhoto);
        _logger.LogDebug(
            "Staged service photo {ServicePhotoId} for service {ServiceId}",
            servicePhoto.Id,
            servicePhoto.ServiceId);
        return Task.CompletedTask;
    }

    /// <inheritdoc />
    public async Task<ServicePhoto?> GetServicePhotoAsync(Guid serviceId, Guid fileId, CancellationToken ct = default)
    {
        return await _context.ServicePhotos
            .AsNoTracking()
            .FirstOrDefaultAsync(photo => photo.ServiceId == serviceId && photo.FileId == fileId, ct);
    }

    /// <inheritdoc />
    public async Task ClearMainPhotoAsync(Guid serviceId, CancellationToken ct = default)
    {
        var mainPhotos = await _context.ServicePhotos
            .Where(photo => photo.ServiceId == serviceId && photo.IsMain)
            .ToListAsync(ct);

        foreach (var photo in mainPhotos)
        {
            photo.IsMain = false;
        }
    }
}
