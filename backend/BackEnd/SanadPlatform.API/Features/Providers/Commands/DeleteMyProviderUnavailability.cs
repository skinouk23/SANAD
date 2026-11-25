using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers.Commands;

/// <summary>
/// Deletes a provider-owned unavailability window.
/// </summary>
public record DeleteMyProviderUnavailabilityCommand(
    Guid UserId,
    Guid UnavailabilityId) : IRequest;

/// <summary>
/// Handles <see cref="DeleteMyProviderUnavailabilityCommand"/>.
/// </summary>
public class DeleteMyProviderUnavailabilityCommandHandler
    : IRequestHandler<DeleteMyProviderUnavailabilityCommand>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteMyProviderUnavailabilityCommandHandler(
        IProviderRepository providerRepository,
        IUnitOfWork unitOfWork)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    public async Task Handle(DeleteMyProviderUnavailabilityCommand request, CancellationToken cancellationToken)
    {
        var provider = await _providerRepository.GetByUserIdForUpdateAsync(request.UserId, cancellationToken);
        if (provider is null)
        {
            throw new KeyNotFoundException($"No provider profile found for user '{request.UserId}'.");
        }

        var unavailability = await _providerRepository.GetUnavailabilityByIdForUpdateAsync(
            provider.Id,
            request.UnavailabilityId,
            cancellationToken);
        if (unavailability is null)
        {
            throw new KeyNotFoundException($"Provider unavailability '{request.UnavailabilityId}' was not found.");
        }

        _providerRepository.RemoveUnavailability(unavailability);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
