using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers.Commands;

/// <summary>
/// Admin command to transition a provider's document verification status.
/// </summary>
public record UpdateProviderVerificationStatusCommand(
    Guid ProviderId,
    Guid AdminUserId,
    string VerificationStatus) : IRequest<ProviderVerificationStateResponse>;

/// <summary>
/// Handler for <see cref="UpdateProviderVerificationStatusCommand" />.
/// </summary>
public class UpdateProviderVerificationStatusCommandHandler
    : IRequestHandler<UpdateProviderVerificationStatusCommand, ProviderVerificationStateResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UpdateProviderVerificationStatusCommandHandler> _logger;

    public UpdateProviderVerificationStatusCommandHandler(
        IProviderRepository providerRepository,
        IUnitOfWork unitOfWork,
        ILogger<UpdateProviderVerificationStatusCommandHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderVerificationStateResponse> Handle(
        UpdateProviderVerificationStatusCommand command,
        CancellationToken cancellationToken)
    {
        var provider = await _providerRepository.GetByIdForUpdateAsync(command.ProviderId, cancellationToken)
            ?? throw new KeyNotFoundException($"Provider {command.ProviderId} not found.");

        var now = DateTime.UtcNow;

        provider.VerificationStatus = command.VerificationStatus;

        switch (command.VerificationStatus)
        {
            case ProviderConstants.VerificationStatuses.Approved:
                provider.VerificationConsentGiven = true;
                provider.VerificationReviewedAt = now;
                provider.IsVerified = true;
                provider.VerifiedAt = now;
                provider.VerifiedBy = command.AdminUserId;
                break;

            case ProviderConstants.VerificationStatuses.Rejected:
                provider.VerificationConsentGiven = true;
                provider.VerificationReviewedAt = now;
                provider.IsVerified = false;
                provider.VerifiedAt = null;
                provider.VerifiedBy = null;
                break;

            case ProviderConstants.VerificationStatuses.AiPrechecked:
                provider.VerificationConsentGiven = true;
                provider.VerificationReviewedAt = null;
                provider.IsVerified = false;
                provider.VerifiedAt = null;
                provider.VerifiedBy = null;
                break;

            case ProviderConstants.VerificationStatuses.Requested:
                provider.VerificationConsentGiven = true;
                provider.VerificationRequestedAt ??= now;
                provider.VerificationReviewedAt = null;
                provider.IsVerified = false;
                provider.VerifiedAt = null;
                provider.VerifiedBy = null;
                break;

            case ProviderConstants.VerificationStatuses.NotRequested:
                provider.VerificationConsentGiven = false;
                provider.VerificationRequestedAt = null;
                provider.VerificationReviewedAt = null;
                provider.IsVerified = false;
                provider.VerifiedAt = null;
                provider.VerifiedBy = null;
                break;
        }

        await _providerRepository.UpdateAsync(provider, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Admin {AdminUserId} updated provider {ProviderId} verification status to {VerificationStatus}",
            command.AdminUserId,
            provider.Id,
            provider.VerificationStatus);

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
