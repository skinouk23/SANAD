using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Payments;
using SanadPlatform.API.Features.Payments.Repository;
using SanadPlatform.API.Features.ProviderFinance.DTOs;
using SanadPlatform.API.Features.ProviderFinance.Entities;
using SanadPlatform.API.Features.ProviderFinance.Repository;
using SanadPlatform.API.Features.ProviderFinance.Services;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.ProviderFinance.Commands;

/// <summary>
/// Creates and credits a provider wallet top-up in one operation.
/// </summary>
public record CreateAndSubmitProviderWalletTopUpCommand(
    Guid UserId,
    decimal Amount,
    string Currency,
    string PaymentChannel,
    string ProviderTransferReference,
    string? EvidenceUrl) : IRequest<ProviderWalletTopUpRequestResponse>;

/// <summary>
/// Handles <see cref="CreateAndSubmitProviderWalletTopUpCommand"/>.
/// </summary>
public class CreateAndSubmitProviderWalletTopUpHandler : IRequestHandler<CreateAndSubmitProviderWalletTopUpCommand, ProviderWalletTopUpRequestResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IProviderFinanceRepository _providerFinanceRepository;
    private readonly IProviderWalletService _providerWalletService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateAndSubmitProviderWalletTopUpHandler> _logger;

    public CreateAndSubmitProviderWalletTopUpHandler(
        IProviderRepository providerRepository,
        IPaymentRepository paymentRepository,
        IProviderFinanceRepository providerFinanceRepository,
        IProviderWalletService providerWalletService,
        IHttpContextAccessor httpContextAccessor,
        IUnitOfWork unitOfWork,
        ILogger<CreateAndSubmitProviderWalletTopUpHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _paymentRepository = paymentRepository ?? throw new ArgumentNullException(nameof(paymentRepository));
        _providerFinanceRepository = providerFinanceRepository ?? throw new ArgumentNullException(nameof(providerFinanceRepository));
        _providerWalletService = providerWalletService ?? throw new ArgumentNullException(nameof(providerWalletService));
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderWalletTopUpRequestResponse> Handle(
        CreateAndSubmitProviderWalletTopUpCommand command,
        CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(command.UserId, cancellationToken)
            ?? throw new KeyNotFoundException($"Provider profile not found for user {command.UserId}.");

        var idempotencyKey = ProviderWalletTopUpCommandHelpers.GetIdempotencyKey(_httpContextAccessor);

        if (!string.IsNullOrWhiteSpace(idempotencyKey))
        {
            var existingResponse = await ProviderWalletTopUpCommandHelpers.TryGetExistingTopUpResponseAsync(
                _paymentRepository,
                _providerFinanceRepository,
                providerId,
                idempotencyKey,
                cancellationToken);

            var replayResponse = GetCreditedOneStepReplayResponse(existingResponse);
            if (replayResponse != null)
            {
                return replayResponse;
            }
        }

        var normalizedCurrency = ProviderFinanceConstants.DefaultCurrency;
        var normalizedPaymentChannel = ProviderFinanceConstants.NormalizePaymentChannel(command.PaymentChannel);

        try
        {
            return await _unitOfWork.ExecuteInTransactionAsync(async ct =>
            {
                var now = DateTime.UtcNow;
                var topUp = new ProviderWalletTopUp
                {
                    Id = Guid.NewGuid(),
                    ReferenceNumber = ProviderWalletTopUpCommandHelpers.GenerateTopUpNumber(now),
                    ProviderId = providerId,
                    InitiatedAmount = command.Amount,
                    Currency = normalizedCurrency,
                    MethodType = PaymentConstants.ResolveTopUpMethodType(normalizedPaymentChannel),
                    Status = ProviderFinanceConstants.TopUpStatuses.Credited,
                    InitiatedAt = now,
                    ExpiresAt = now.AddHours(ProviderFinanceConstants.TopUpExpiryHours)
                };

                topUp.Payment = PaymentModelFactory.CreateProviderWalletTopUpPayment(topUp, idempotencyKey);
                ProviderWalletTopUpCommandHelpers.ApplyProviderTransferDetails(
                    topUp,
                    now,
                    command.ProviderTransferReference,
                    command.EvidenceUrl);

                await _providerFinanceRepository.CreateTopUpAsync(topUp, ct);
                await _providerWalletService.CreditTopUpAsync(topUp, command.UserId, ct);
                await _unitOfWork.SaveChangesAsync(ct);

                await _providerWalletService.SyncWalletProjectionFromLedgerAsync(topUp.ProviderId, ct);
                await _unitOfWork.SaveChangesAsync(ct);

                _logger.LogInformation(
                    "Provider {ProviderId} created and credited wallet top-up {TopUpId}",
                    providerId,
                    topUp.Id);

                return ProviderFinanceResponseMapper.ToProviderTopUpResponse(topUp, now);
            }, cancellationToken);
        }
        catch (DbUpdateException ex) when (ProviderWalletTopUpCommandHelpers.IsPaymentAttemptIdempotencyUniqueViolation(ex, idempotencyKey))
        {
            var existingResponse = await ProviderWalletTopUpCommandHelpers.TryGetExistingTopUpResponseAsync(
                _paymentRepository,
                _providerFinanceRepository,
                providerId,
                idempotencyKey!,
                cancellationToken);

            var replayResponse = GetCreditedOneStepReplayResponse(existingResponse);
            if (replayResponse != null)
            {
                return replayResponse;
            }

            throw;
        }
    }

    private static ProviderWalletTopUpRequestResponse? GetCreditedOneStepReplayResponse(
        ProviderWalletTopUpRequestResponse? existingResponse)
    {
        if (existingResponse == null)
        {
            return null;
        }

        if (IsCreditedTopUpResponse(existingResponse))
        {
            return existingResponse;
        }

        throw new InvalidOperationException(
            "The supplied Idempotency-Key is already associated with a non-credited wallet top-up and cannot be reused for one-step submit.");
    }

    private static bool IsCreditedTopUpResponse(ProviderWalletTopUpRequestResponse response)
    {
        return string.Equals(response.Status, ProviderFinanceConstants.TopUpStatuses.Credited, StringComparison.Ordinal)
            || (string.Equals(response.PaymentStatus, PaymentConstants.Statuses.Settled, StringComparison.Ordinal)
                && response.CreditedAt.HasValue);
    }
}
