using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers.Commands;

/// <summary>
/// Command for an authenticated provider to request or resubmit document verification.
/// </summary>
public record RequestProviderVerificationCommand(Guid UserId) : IRequest<ProviderVerificationStateResponse>;

/// <summary>
/// Handler for <see cref="RequestProviderVerificationCommand" />.
/// </summary>
public class RequestProviderVerificationCommandHandler
    : IRequestHandler<RequestProviderVerificationCommand, ProviderVerificationStateResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<RequestProviderVerificationCommandHandler> _logger;

    public RequestProviderVerificationCommandHandler(
        IProviderRepository providerRepository,
        IUnitOfWork unitOfWork,
        ILogger<RequestProviderVerificationCommandHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderVerificationStateResponse> Handle(
        RequestProviderVerificationCommand command,
        CancellationToken cancellationToken)
    {
        var provider = await _providerRepository.GetByUserIdForUpdateAsync(command.UserId, cancellationToken);
        if (provider == null)
        {
            _logger.LogDebug("Provider profile not found for user {UserId}", command.UserId);
            throw new KeyNotFoundException("Provider profile not found for this user");
        }

        if (!ProviderConstants.CanRequestVerification(provider.VerificationStatus))
        {
            throw new InvalidOperationException("Verification can only be requested when it has not been requested or was rejected.");
        }

        var requestedAt = DateTime.UtcNow;

        provider.VerificationConsentGiven = true;
        provider.VerificationStatus = ProviderConstants.VerificationStatuses.Requested;
        provider.VerificationRequestedAt = requestedAt;
        provider.VerificationReviewedAt = null;
        provider.IsVerified = false;
        provider.VerifiedAt = null;
        provider.VerifiedBy = null;

        await _providerRepository.UpdateAsync(provider, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new ProviderVerificationStateResponse
        {
            IsVerified = provider.IsVerified,
            IsApproved = provider.IsApproved,
            ApprovedAt = provider.ApprovedAt,
            ApprovedBy = provider.ApprovedBy,
            RejectionReason = provider.RejectionReason,
            VerificationConsentGiven = provider.VerificationConsentGiven,
            VerificationStatus = provider.VerificationStatus,
            VerificationRequestedAt = provider.VerificationRequestedAt,
            VerificationReviewedAt = provider.VerificationReviewedAt,
            CanRequestVerification = ProviderConstants.CanRequestVerification(provider.VerificationStatus)
        };
    }
}
