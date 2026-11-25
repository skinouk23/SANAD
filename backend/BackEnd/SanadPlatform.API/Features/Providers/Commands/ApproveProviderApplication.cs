using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers.Commands;

/// <summary>
/// Admin command to approve a pending provider application.
/// </summary>
public record ApproveProviderApplicationCommand(
    Guid ProviderId,
    Guid AdminUserId) : IRequest<ProviderVerificationStateResponse>;

/// <summary>
/// Handler for <see cref="ApproveProviderApplicationCommand" />.
/// </summary>
public class ApproveProviderApplicationCommandHandler
    : IRequestHandler<ApproveProviderApplicationCommand, ProviderVerificationStateResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ApproveProviderApplicationCommandHandler> _logger;

    public ApproveProviderApplicationCommandHandler(
        IProviderRepository providerRepository,
        IUnitOfWork unitOfWork,
        ILogger<ApproveProviderApplicationCommandHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderVerificationStateResponse> Handle(
        ApproveProviderApplicationCommand command,
        CancellationToken cancellationToken)
    {
        var provider = await _providerRepository.GetByIdWithDocumentsForUpdateAsync(command.ProviderId, cancellationToken)
            ?? throw new KeyNotFoundException($"Provider {command.ProviderId} not found.");

        var missingDocumentTypes = ProviderConstants.GetMissingRequiredApprovalDocumentTypes(
            provider.Documents
                .Where(document => !document.IsExpired && document.FileId != Guid.Empty)
                .Select(document => document.DocumentType));

        if (missingDocumentTypes.Length > 0)
        {
            throw new InvalidOperationException(
                $"Provider approval requires completed documents: {string.Join(", ", missingDocumentTypes)}.");
        }

        var now = DateTime.UtcNow;

        provider.IsApproved = true;
        provider.ApprovedAt = now;
        provider.ApprovedBy = command.AdminUserId;
        provider.RejectionReason = null;
        provider.VerificationReviewedAt = now;

        if (provider.VerificationConsentGiven)
        {
            provider.IsVerified = true;
            provider.VerificationStatus = ProviderConstants.VerificationStatuses.Approved;
            provider.VerifiedAt = now;
            provider.VerifiedBy = command.AdminUserId;
        }
        else
        {
            provider.IsVerified = false;
            provider.VerificationStatus = ProviderConstants.VerificationStatuses.NotRequested;
            provider.VerifiedAt = null;
            provider.VerifiedBy = null;
        }

        await _providerRepository.UpdateAsync(provider, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Admin {AdminUserId} approved provider {ProviderId}",
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
