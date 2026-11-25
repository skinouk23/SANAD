using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers.Commands;

/// <summary>
/// Command to update the authenticated provider's online/offline availability status.
/// </summary>
public record UpdateMyProviderAvailabilityCommand(
    Guid UserId,
    bool Available) : IRequest<UpdateProviderAvailabilityResponse>;

/// <summary>
/// Handler for <see cref="UpdateMyProviderAvailabilityCommand" />.
/// The availability change is recorded in provider_availability_history by a PostgreSQL trigger.
/// </summary>
public class UpdateMyProviderAvailabilityCommandHandler
    : IRequestHandler<UpdateMyProviderAvailabilityCommand, UpdateProviderAvailabilityResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UpdateMyProviderAvailabilityCommandHandler> _logger;

    public UpdateMyProviderAvailabilityCommandHandler(
        IProviderRepository providerRepository,
        IUnitOfWork unitOfWork,
        ILogger<UpdateMyProviderAvailabilityCommandHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<UpdateProviderAvailabilityResponse> Handle(
        UpdateMyProviderAvailabilityCommand command,
        CancellationToken cancellationToken)
    {
        var provider = await _providerRepository.GetByUserIdForUpdateAsync(command.UserId, cancellationToken);
        if (provider == null)
        {
            _logger.LogDebug("Provider profile not found for user {UserId}", command.UserId);
            throw new KeyNotFoundException("Provider profile not found for this user");
        }

        provider.IsAvailable = command.Available;
        provider.AvailabilityStatus = command.Available ? "available" : "offline";

        await _providerRepository.UpdateAsync(provider, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new UpdateProviderAvailabilityResponse
        {
            Id = provider.Id,
            Available = provider.IsAvailable,
            UpdatedAt = provider.UpdatedAt
        };
    }
}