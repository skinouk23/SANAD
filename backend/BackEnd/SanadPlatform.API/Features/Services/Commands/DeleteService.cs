using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Services.Repository;
using Microsoft.Extensions.Caching.Memory;

namespace SanadPlatform.API.Features.Services.Commands;

/// <summary>
/// Command to soft-delete a service owned by the authenticated provider.
/// Deletion is blocked if the service has active bookings (Pending, Confirmed, ProviderOnWay, or InProgress).
/// </summary>
public record DeleteServiceCommand(
    Guid UserId,
    Guid ServiceId) : IRequest;

/// <summary>
/// Handler for <see cref="DeleteServiceCommand"/>.
/// Because Service implements ISoftDeletable, the AuditableEntityInterceptor
/// converts the EF Deleted state to Modified and sets DeletedAt automatically.
/// </summary>
public class DeleteServiceHandler : IRequestHandler<DeleteServiceCommand>
{
    private readonly IServiceRepository _serviceRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DeleteServiceHandler> _logger;
    private readonly IMemoryCache _cache;

    public DeleteServiceHandler(
        IServiceRepository serviceRepository,
        IProviderRepository providerRepository,
        IBookingRepository bookingRepository,
        IUnitOfWork unitOfWork,
        ILogger<DeleteServiceHandler> logger,
        IMemoryCache cache)
    {
        _serviceRepository = serviceRepository ?? throw new ArgumentNullException(nameof(serviceRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _bookingRepository = bookingRepository ?? throw new ArgumentNullException(nameof(bookingRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
    }

    /// <summary>
    /// Handles the service deletion.
    /// Uses a single tracked load to verify ownership, check active bookings,
    /// and stage the entity for soft-deletion — avoiding redundant DB round-trips.
    /// </summary>
    public async Task Handle(DeleteServiceCommand command, CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(command.UserId, cancellationToken)
            ?? throw new KeyNotFoundException("Provider profile not found.");

        // Single tracked load verifies ownership and loads addons for cascade soft-delete.
        // Must check ownership BEFORE HasActiveBookingsForServiceAsync to avoid info-leaking
        // the existence of services belonging to other providers.
        var service = await _serviceRepository.GetByIdAndProviderForUpdateAsync(
            command.ServiceId, providerId, cancellationToken)
            ?? throw new KeyNotFoundException($"Service {command.ServiceId} not found.");

        // Check for active bookings before deletion
        var hasActiveBookings = await _bookingRepository.HasActiveBookingsForServiceAsync(service.Id, cancellationToken);
        if (hasActiveBookings)
            throw new InvalidOperationException(
                "Cannot delete a service with active bookings. " +
                "Please resolve all active bookings before deleting.");

        // Stage child addons and parent service for soft-deletion
        if (service.Addons.Count > 0)
        {
            _serviceRepository.RemoveAddons(service.Addons);
        }

        _serviceRepository.Remove(service);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await _serviceRepository.RecalculateCategoryPricesAsync(service.Category, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _cache.Remove("service-categories:en");
        _cache.Remove("service-categories:fr");
        _cache.Remove("service-categories:ar");
        _logger.LogInformation(
            "Provider {ProviderId} deleted service {ServiceId}",
            providerId, command.ServiceId);
    }
}
