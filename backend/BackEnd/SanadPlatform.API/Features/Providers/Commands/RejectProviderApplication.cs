using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers.Commands;

/// <summary>
/// Admin command to reject a provider application.
/// </summary>
public record RejectProviderApplicationCommand(
    Guid ProviderId,
    Guid AdminUserId,
    string Reason) : IRequest<ProviderVerificationStateResponse>;

/// <summary>
/// Handler for <see cref="RejectProviderApplicationCommand" />.
/// </summary>
public class RejectProviderApplicationCommandHandler
    : IRequestHandler<RejectProviderApplicationCommand, ProviderVerificationStateResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<RejectProviderApplicationCommandHandler> _logger;

    public RejectProviderApplicationCommandHandler(
        IProviderRepository providerRepository,
        IUnitOfWork unitOfWork,
        ILogger<RejectProviderApplicationCommandHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderVerificationStateResponse> Handle(
        RejectProviderApplicationCommand command,
        CancellationToken cancellationToken)
    {
        var provider = await _providerRepository.GetByIdForUpdateAsync(command.ProviderId, cancellationToken)
            ?? throw new KeyNotFoundException($"Provider {command.ProviderId} not found.");

        provider.IsApproved = false;
        provider.ApprovedAt = null;
        provider.ApprovedBy = null;
        provider.RejectionReason = command.Reason.Trim();
        provider.IsVerified = false;
        provider.VerifiedAt = null;
        provider.VerifiedBy = null;
        provider.VerificationReviewedAt = DateTime.UtcNow;
        provider.VerificationStatus = provider.VerificationConsentGiven
            ? ProviderConstants.VerificationStatuses.Rejected
            : ProviderConstants.VerificationStatuses.NotRequested;

        await _providerRepository.UpdateAsync(provider, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Admin {AdminUserId} rejected provider {ProviderId}",
            command.AdminUserId,
            provider.Id);

        return ToResponse(provider);
    }

    private static ProviderVerificationStateResponse ToResponse(Entities.Provider provider)
    {
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
