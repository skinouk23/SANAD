using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Services.Repository;
using Microsoft.Extensions.Caching.Memory;

namespace SanadPlatform.API.Features.Services.Commands;

/// <summary>
/// Command to toggle a service's active status.
/// Deactivation is blocked if the service has active bookings (Pending, Confirmed, ProviderOnWay, or InProgress).
/// </summary>
public record ToggleServiceCommand(
    Guid UserId,
    Guid ServiceId,
    bool IsActive) : IRequest;

/// <summary>
/// Handler for <see cref="ToggleServiceCommand"/>.
/// Validates provider ownership, checks for active bookings when deactivating,
/// then toggles the IsActive flag.
/// </summary>
public class ToggleServiceHandler : IRequestHandler<ToggleServiceCommand>
{
    private readonly IServiceRepository _serviceRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ToggleServiceHandler> _logger;
    private readonly IMemoryCache _cache;

    public ToggleServiceHandler(
        IServiceRepository serviceRepository,
        IProviderRepository providerRepository,
        IBookingRepository bookingRepository,
        IUnitOfWork unitOfWork,
        ILogger<ToggleServiceHandler> logger,
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
    /// Handles the toggle operation.
    /// </summary>
    public async Task Handle(ToggleServiceCommand command, CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(command.UserId, cancellationToken)
            ?? throw new KeyNotFoundException("Provider profile not found.");

        var service = await _serviceRepository.GetByIdAndProviderForUpdateAsync(
            command.ServiceId, providerId, cancellationToken)
            ?? throw new KeyNotFoundException($"Service {command.ServiceId} not found.");

        // Block deactivation if there are active bookings
        if (!command.IsActive)
        {
            var hasActiveBookings = await _bookingRepository.HasActiveBookingsForServiceAsync(service.Id, cancellationToken);
            if (hasActiveBookings)
                throw new InvalidOperationException(
                    "Cannot deactivate a service with active bookings. " +
                    "Please resolve all active bookings before deactivating.");
        }

        service.IsActive = command.IsActive;

        await _serviceRepository.UpdateAsync(service, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await _serviceRepository.RecalculateCategoryPricesAsync(service.Category, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _cache.Remove("service-categories:en");
        _cache.Remove("service-categories:fr");
        _cache.Remove("service-categories:ar");
        _logger.LogInformation(
            "Provider {ProviderId} toggled service {ServiceId} to {IsActive}",
            providerId, service.Id, command.IsActive);
    }
}
