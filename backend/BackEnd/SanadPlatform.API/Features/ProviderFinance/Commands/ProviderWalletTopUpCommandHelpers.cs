using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using SanadPlatform.API.Features.Payments;
using SanadPlatform.API.Features.Payments.Repository;
using SanadPlatform.API.Features.ProviderFinance.DTOs;
using SanadPlatform.API.Features.ProviderFinance.Entities;
using SanadPlatform.API.Features.ProviderFinance.Repository;

namespace SanadPlatform.API.Features.ProviderFinance.Commands;

/// <summary>
/// Shared helpers for provider wallet top-up command handlers.
/// </summary>
internal static class ProviderWalletTopUpCommandHelpers
{
    public static string GenerateTopUpNumber(DateTime now)
    {
        return $"TUP-{now:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..8].ToUpperInvariant()}";
    }

    public static string? GetIdempotencyKey(IHttpContextAccessor httpContextAccessor)
    {
        var headerValue = httpContextAccessor.HttpContext?.Request.Headers["Idempotency-Key"].FirstOrDefault();
        return string.IsNullOrWhiteSpace(headerValue) ? null : headerValue.Trim();
    }

    public static async Task<ProviderWalletTopUpRequestResponse?> TryGetExistingTopUpResponseAsync(
        IPaymentRepository paymentRepository,
        IProviderFinanceRepository providerFinanceRepository,
        Guid providerId,
        string idempotencyKey,
        CancellationToken cancellationToken)
    {
        var existingAttempt = await paymentRepository.GetAttemptByIdempotencyKeyAsync(idempotencyKey, cancellationToken);
        if (existingAttempt == null)
        {
            return null;
        }

        if (!existingAttempt.Payment.ProviderWalletTopUpId.HasValue)
        {
            throw new InvalidOperationException(
                "The supplied Idempotency-Key is already associated with a different payment initiation request.");
        }

        var existingRequest = await providerFinanceRepository.GetTopUpByIdAndProviderIdForUpdateAsync(
            existingAttempt.Payment.ProviderWalletTopUpId.Value,
            providerId,
            cancellationToken)
            ?? throw new InvalidOperationException(
                $"The top-up request linked to Idempotency-Key '{idempotencyKey}' could not be loaded.");

        return ProviderFinanceResponseMapper.ToProviderTopUpResponse(existingRequest, DateTime.UtcNow);
    }

    public static void ApplyProviderTransferDetails(
        ProviderWalletTopUp topUp,
        DateTime now,
        string? providerTransferReference,
        string? evidenceUrl)
    {
        topUp.SubmittedAt ??= now;
        topUp.ProviderSubmittedReference = string.IsNullOrWhiteSpace(providerTransferReference)
            ? null
            : providerTransferReference.Trim();
        topUp.EvidenceUrl = string.IsNullOrWhiteSpace(evidenceUrl)
            ? null
            : evidenceUrl.Trim();

        if (topUp.Payment == null)
        {
            return;
        }

        var latestAttempt = PaymentModelFactory.GetOrCreateLatestAttempt(topUp.Payment);
        latestAttempt.ManualReference = topUp.ProviderSubmittedReference;
        latestAttempt.SafeMetadataJson = string.IsNullOrWhiteSpace(topUp.EvidenceUrl)
            ? latestAttempt.SafeMetadataJson
            : JsonSerializer.Serialize(new { topUp.EvidenceUrl });
    }

    public static bool IsPaymentAttemptIdempotencyUniqueViolation(DbUpdateException exception, string? idempotencyKey)
    {
        return !string.IsNullOrWhiteSpace(idempotencyKey)
            && exception.InnerException is PostgresException
            {
                SqlState: PostgresErrorCodes.UniqueViolation,
                ConstraintName: "ux_payment_attempts_idempotency_key"
            };
    }
}
