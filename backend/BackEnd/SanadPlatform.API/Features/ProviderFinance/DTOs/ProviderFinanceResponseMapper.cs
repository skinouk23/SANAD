using SanadPlatform.API.Features.Finance;
using SanadPlatform.API.Features.Finance.Entities;
using SanadPlatform.API.Features.Payments;
using SanadPlatform.API.Features.ProviderFinance.Entities;
using SanadPlatform.API.Features.ProviderFinance.Repository;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.ProviderFinance.DTOs;

/// <summary>
/// Maps provider finance entities to API response DTOs.
/// </summary>
internal static class ProviderFinanceResponseMapper
{
    public static ProviderWalletTopUpRequestResponse ToProviderTopUpResponse(
        ProviderWalletTopUp request,
        DateTime asOfUtc)
    {
        var displayStatus = ProviderFinanceConstants.ResolveDisplayTopUpStatus(request.Status, request.ExpiresAt, asOfUtc);
        var paymentChannel = ProviderFinanceConstants.ResolvePaymentChannelFromMethodType(request.MethodType);

        return new ProviderWalletTopUpRequestResponse
        {
            Id = request.Id,
            TopUpNumber = request.ReferenceNumber,
            Amount = request.CreditedAmount ?? request.InitiatedAmount,
            Currency = request.Currency,
            PaymentChannel = paymentChannel,
            PlatformReference = request.ReferenceNumber,
            ProviderTransferReference = request.ProviderSubmittedReference,
            PaymentId = request.Payment?.Id,
            PaymentStatus = ResolveDisplayPaymentStatus(request, displayStatus),
            PaymentMethodType = request.Payment?.MethodType,
            PaymentReferenceNumber = request.Payment?.ReferenceNumber,
            Status = displayStatus,
            RequestedAt = request.InitiatedAt,
            MarkedTransferredAt = request.SubmittedAt,
            CreditedAt = request.CreditedAt,
            FailedAt = request.FailedAt,
            CancelledAt = request.CancelledAt,
            ExpiresAt = request.ExpiresAt,
            EvidenceUrl = request.EvidenceUrl
        };
    }

    public static AdminProviderFinanceTopUpRequestResponse ToAdminTopUpResponse(
        ProviderWalletTopUp request,
        DateTime asOfUtc)
    {
        var displayStatus = ProviderFinanceConstants.ResolveDisplayTopUpStatus(request.Status, request.ExpiresAt, asOfUtc);
        var paymentChannel = ProviderFinanceConstants.ResolvePaymentChannelFromMethodType(request.MethodType);

        return new AdminProviderFinanceTopUpRequestResponse
        {
            Id = request.Id,
            TopUpNumber = request.ReferenceNumber,
            ProviderId = request.ProviderId,
            ProviderDisplayName = request.Provider is null ? string.Empty : BuildProviderDisplayName(request.Provider),
            ProviderBusinessName = request.Provider?.BusinessName,
            ProviderEmail = request.Provider?.User?.Email,
            ProviderPhone = request.Provider?.User?.Phone,
            Amount = request.CreditedAmount ?? request.InitiatedAmount,
            Currency = request.Currency,
            PaymentChannel = paymentChannel,
            PlatformReference = request.ReferenceNumber,
            ProviderTransferReference = request.ProviderSubmittedReference,
            PaymentId = request.Payment?.Id,
            PaymentStatus = ResolveDisplayPaymentStatus(request, displayStatus),
            PaymentMethodType = request.Payment?.MethodType,
            PaymentReferenceNumber = request.Payment?.ReferenceNumber,
            Status = displayStatus,
            RequestedAt = request.InitiatedAt,
            MarkedTransferredAt = request.SubmittedAt,
            CreditedAt = request.CreditedAt,
            FailedAt = request.FailedAt,
            CancelledAt = request.CancelledAt,
            ExpiresAt = request.ExpiresAt,
            EvidenceUrl = request.EvidenceUrl
        };
    }

    public static IReadOnlyList<ProviderWalletLedgerEntryResponse> ToLedgerEntryResponses(
        IEnumerable<ProviderWalletLedgerRecord> records)
    {
        ArgumentNullException.ThrowIfNull(records);

        var orderedRecords = records
            .OrderBy(record => record.OccurredAt)
            .ThenBy(record => record.CreatedAt)
            .ThenBy(record => record.LedgerTransactionId)
            .ToList();

        var availableBalance = 0.00m;
        var reservedBalance = 0.00m;
        var responses = new List<ProviderWalletLedgerEntryResponse>(orderedRecords.Count);

        foreach (var record in orderedRecords)
        {
            var availableBefore = availableBalance;
            var reservedBefore = reservedBalance;

            availableBalance += record.AvailableDelta;
            reservedBalance += record.ReservedDelta;

            responses.Add(new ProviderWalletLedgerEntryResponse
            {
                Id = record.LedgerTransactionId,
                EntryType = ResolveLedgerEntryType(record),
                Amount = ResolveLedgerAmount(record),
                Direction = ResolveLedgerDirection(record),
                CurrentBalanceBefore = availableBefore,
                CurrentBalanceAfter = availableBalance,
                ReservedBalanceBefore = reservedBefore,
                ReservedBalanceAfter = reservedBalance,
                Currency = record.Currency,
                Reference = record.ReferenceNumber,
                Description = record.Description,
                TopUpRequestId = record.ProviderWalletTopUpId,
                BookingId = record.BookingId,
                AdminId = record.CreatedByUserId,
                CreatedAt = record.CreatedAt
            });
        }

        return responses
            .OrderByDescending(response => response.CreatedAt)
            .ThenByDescending(response => response.Id)
            .ToList()
            .AsReadOnly();
    }

    public static ProviderWalletMovementResponse ToWalletMovementResponse(
        ProviderWalletTopUp request,
        DateTime asOfUtc)
    {
        var displayStatus = ProviderFinanceConstants.ResolveDisplayTopUpStatus(request.Status, request.ExpiresAt, asOfUtc);

        return new ProviderWalletMovementResponse
        {
            Id = request.Id,
            Type = ProviderFinanceConstants.WalletMovementTypes.Deposit,
            Status = displayStatus,
            Amount = request.CreditedAmount ?? request.InitiatedAmount,
            Currency = request.Currency,
            OccurredAt = ResolveMovementOccurredAt(request, displayStatus),
            Reference = request.ReferenceNumber,
            Description = BuildTopUpMovementDescription(displayStatus),
            SourceType = ProviderFinanceConstants.WalletMovementSourceTypes.TopUp,
            TopUpNumber = request.ReferenceNumber,
            PaymentChannel = ProviderFinanceConstants.ResolvePaymentChannelFromMethodType(request.MethodType),
            ProviderTransferReference = request.ProviderSubmittedReference,
            EvidenceUrl = request.EvidenceUrl,
            MarkedTransferredAt = request.SubmittedAt,
            ExpiresAt = request.ExpiresAt,
            CanMarkTransferred = false,
            CanCancel = false
        };
    }

    public static ProviderWalletMovementResponse ToWalletMovementResponse(ProviderWalletLedgerRecord entry)
    {
        return new ProviderWalletMovementResponse
        {
            Id = entry.LedgerTransactionId,
            Type = ProviderFinanceConstants.GetProviderFacingWalletMovementType(entry.TransactionType, entry.AvailableDelta),
            Status = ProviderFinanceConstants.WalletMovementStatuses.Completed,
            Amount = ResolveLedgerAmount(entry),
            Currency = entry.Currency,
            OccurredAt = entry.OccurredAt,
            Reference = string.IsNullOrWhiteSpace(entry.ReferenceNumber) ? entry.LedgerTransactionId.ToString() : entry.ReferenceNumber,
            Description = string.IsNullOrWhiteSpace(entry.Description)
                ? BuildLedgerMovementDescription(entry.TransactionType, entry.AvailableDelta)
                : entry.Description,
            SourceType = ProviderFinanceConstants.WalletMovementSourceTypes.WalletLedger
        };
    }

    public static IReadOnlyList<ProviderWalletMovementResponse> ToWalletMovementResponses(
        IEnumerable<ProviderWalletTopUp> topUpRequests,
        IEnumerable<ProviderWalletLedgerRecord> ledgerEntries,
        DateTime asOfUtc)
    {
        ArgumentNullException.ThrowIfNull(topUpRequests);
        ArgumentNullException.ThrowIfNull(ledgerEntries);

        return topUpRequests
            .Select(request => ToWalletMovementResponse(request, asOfUtc))
            .Concat(
                ledgerEntries
                    .Where(entry => ProviderFinanceConstants.IsProviderFacingWalletMovementTransactionType(entry.TransactionType))
                    .Select(ToWalletMovementResponse))
            .OrderByDescending(movement => movement.OccurredAt)
            .ThenByDescending(movement => movement.Id)
            .ToList()
            .AsReadOnly();
    }

    public static IReadOnlyList<ProviderWalletMovementResponse> ToWalletMovementResponses(
        IEnumerable<FinanceTimelineItem> timelineItems,
        IEnumerable<ProviderWalletTopUp> topUpRequests)
    {
        ArgumentNullException.ThrowIfNull(timelineItems);
        ArgumentNullException.ThrowIfNull(topUpRequests);

        var topUpLookup = topUpRequests.ToDictionary(request => request.Id);

        return timelineItems
            .Select(item => ToWalletMovementResponse(item, topUpLookup))
            .Where(movement => movement is not null)
            .Select(movement => movement!)
            .OrderByDescending(movement => movement.OccurredAt)
            .ThenByDescending(movement => movement.Id)
            .ToList()
            .AsReadOnly();
    }

    public static string BuildProviderDisplayName(Provider provider)
    {
        if (!string.IsNullOrWhiteSpace(provider.BusinessName))
        {
            return provider.BusinessName.Trim();
        }

        var fullName = $"{provider.FirstName} {provider.LastName}".Trim();
        return string.IsNullOrWhiteSpace(fullName) ? provider.Id.ToString() : fullName;
    }

    private static string BuildTopUpMovementDescription(string status)
    {
        return status switch
        {
            ProviderFinanceConstants.TopUpStatuses.Credited => "Manual prepaid wallet top-up credited to the wallet.",
            ProviderFinanceConstants.TopUpStatuses.Failed => "Manual prepaid wallet top-up failed.",
            ProviderFinanceConstants.TopUpStatuses.Cancelled => "Manual prepaid wallet top-up cancelled.",
            ProviderFinanceConstants.TopUpStatuses.Expired => "Manual prepaid wallet top-up request expired.",
            _ => "Manual prepaid wallet top-up request."
        };
    }

    private static string BuildLedgerMovementDescription(string transactionType, decimal availableDelta)
    {
        if (string.Equals(transactionType, LedgerConstants.TransactionTypes.CashBookingFeeSettled, StringComparison.Ordinal))
        {
            return "Wallet deduction applied for a cash booking.";
        }

        if (string.Equals(transactionType, LedgerConstants.TransactionTypes.WalletAdjustment, StringComparison.Ordinal)
            || string.Equals(transactionType, LedgerConstants.TransactionTypes.CompensatingAdjustment, StringComparison.Ordinal))
        {
            return availableDelta >= 0m
                ? "Manual wallet credit adjustment completed."
                : "Manual wallet debit adjustment completed.";
        }

        return "Wallet movement completed.";
    }

    private static ProviderWalletMovementResponse? ToWalletMovementResponse(
        FinanceTimelineItem item,
        IReadOnlyDictionary<Guid, ProviderWalletTopUp> topUpLookup)
    {
        ArgumentNullException.ThrowIfNull(item);
        ArgumentNullException.ThrowIfNull(topUpLookup);

        if (IsTopUpTimelineItem(item))
        {
            ProviderWalletTopUp? topUp = null;
            if (item.ProviderWalletTopUpId.HasValue)
            {
                topUpLookup.TryGetValue(item.ProviderWalletTopUpId.Value, out topUp);
            }

            return ToWalletMovementResponse(item, topUp);
        }

        if (IsProviderFacingLedgerTimelineItem(item))
        {
            return ToWalletMovementResponse(item);
        }

        return null;
    }

    private static ProviderWalletMovementResponse ToWalletMovementResponse(
        FinanceTimelineItem item,
        ProviderWalletTopUp? topUp)
    {
        var paymentChannel = string.IsNullOrWhiteSpace(topUp?.MethodType)
            ? null
            : ProviderFinanceConstants.ResolvePaymentChannelFromMethodType(topUp.MethodType);
        var displayStatus = ProviderFinanceConstants.ResolveDisplayTopUpStatus(
            item.Status,
            topUp?.ExpiresAt,
            item.OccurredAt);

        return new ProviderWalletMovementResponse
        {
            Id = item.ProviderWalletTopUpId ?? item.Id,
            Type = ProviderFinanceConstants.WalletMovementTypes.Deposit,
            Status = displayStatus,
            Amount = item.Amount,
            Currency = item.Currency,
            OccurredAt = item.OccurredAt,
            Reference = string.IsNullOrWhiteSpace(item.ReferenceNumber)
                ? (item.ProviderWalletTopUpId ?? item.Id).ToString()
                : item.ReferenceNumber,
            Description = item.Description,
            SourceType = ProviderFinanceConstants.WalletMovementSourceTypes.TopUp,
            TopUpNumber = topUp?.ReferenceNumber ?? item.ReferenceNumber,
            PaymentChannel = paymentChannel,
            ProviderTransferReference = topUp?.ProviderSubmittedReference,
            EvidenceUrl = topUp?.EvidenceUrl,
            MarkedTransferredAt = topUp?.SubmittedAt,
            ExpiresAt = topUp?.ExpiresAt,
            CanMarkTransferred = false,
            CanCancel = false
        };
    }

    private static ProviderWalletMovementResponse ToWalletMovementResponse(FinanceTimelineItem item)
    {
        return new ProviderWalletMovementResponse
        {
            Id = item.LedgerTransactionId ?? item.Id,
            Type = ResolveTimelineLedgerMovementType(item),
            Status = ProviderFinanceConstants.WalletMovementStatuses.Completed,
            Amount = item.Amount,
            Currency = item.Currency,
            OccurredAt = item.OccurredAt,
            Reference = string.IsNullOrWhiteSpace(item.ReferenceNumber)
                ? (item.LedgerTransactionId ?? item.Id).ToString()
                : item.ReferenceNumber,
            Description = item.Description,
            SourceType = ProviderFinanceConstants.WalletMovementSourceTypes.WalletLedger
        };
    }

    private static bool IsTopUpTimelineItem(FinanceTimelineItem item)
    {
        return item.ProviderWalletTopUpId.HasValue
            && string.Equals(item.SourceType, FinanceTimelineSourceTypes.Payment, StringComparison.Ordinal)
            && string.Equals(item.Type, PaymentConstants.Purposes.WalletTopUp, StringComparison.Ordinal);
    }

    private static bool IsProviderFacingLedgerTimelineItem(FinanceTimelineItem item)
    {
        return item.LedgerTransactionId.HasValue
            && string.Equals(item.SourceType, FinanceTimelineSourceTypes.LedgerTransaction, StringComparison.Ordinal)
            && string.Equals(item.Status, LedgerConstants.TransactionStatuses.Posted, StringComparison.Ordinal)
            && ProviderFinanceConstants.IsProviderFacingWalletMovementTransactionType(item.Type);
    }

    private static string ResolveTimelineLedgerMovementType(FinanceTimelineItem item)
    {
        if (string.Equals(item.Type, LedgerConstants.TransactionTypes.CashBookingFeeSettled, StringComparison.Ordinal))
        {
            return ProviderFinanceConstants.WalletMovementTypes.Deduction;
        }

        return string.Equals(item.Direction, ProviderFinanceConstants.LedgerDirections.Credit, StringComparison.OrdinalIgnoreCase)
            ? ProviderFinanceConstants.WalletMovementTypes.Deposit
            : ProviderFinanceConstants.WalletMovementTypes.Deduction;
    }

    private static string? ResolveDisplayPaymentStatus(ProviderWalletTopUp request, string displayTopUpStatus)
    {
        if (request.Payment == null)
        {
            return null;
        }

        if (string.Equals(displayTopUpStatus, ProviderFinanceConstants.TopUpStatuses.Expired, StringComparison.Ordinal)
            && (string.Equals(request.Payment.Status, PaymentConstants.Statuses.Pending, StringComparison.Ordinal)
                || string.Equals(request.Payment.Status, PaymentConstants.Statuses.Processing, StringComparison.Ordinal)))
        {
            return PaymentConstants.Statuses.Expired;
        }

        if (string.Equals(displayTopUpStatus, ProviderFinanceConstants.TopUpStatuses.Cancelled, StringComparison.Ordinal)
            && string.Equals(request.Payment.Status, PaymentConstants.Statuses.Pending, StringComparison.Ordinal))
        {
            return PaymentConstants.Statuses.Cancelled;
        }

        if (string.Equals(displayTopUpStatus, ProviderFinanceConstants.TopUpStatuses.Failed, StringComparison.Ordinal)
            && string.Equals(request.Payment.Status, PaymentConstants.Statuses.Processing, StringComparison.Ordinal))
        {
            return PaymentConstants.Statuses.Failed;
        }

        return request.Payment.Status;
    }

    private static string ResolveLedgerEntryType(ProviderWalletLedgerRecord record)
    {
        if (string.Equals(record.TransactionType, LedgerConstants.TransactionTypes.WalletTopUpCredited, StringComparison.Ordinal))
        {
            return ProviderFinanceConstants.WalletEntryTypes.TopUpCredit;
        }

        if (string.Equals(record.TransactionType, LedgerConstants.TransactionTypes.CashBookingFeeReserved, StringComparison.Ordinal))
        {
            return ProviderFinanceConstants.WalletEntryTypes.CashBookingHold;
        }

        if (string.Equals(record.TransactionType, LedgerConstants.TransactionTypes.CashBookingFeeReleased, StringComparison.Ordinal))
        {
            return ProviderFinanceConstants.WalletEntryTypes.CashBookingHoldRelease;
        }

        if (string.Equals(record.TransactionType, LedgerConstants.TransactionTypes.CashBookingFeeSettled, StringComparison.Ordinal))
        {
            return ProviderFinanceConstants.WalletEntryTypes.CashBookingDebit;
        }

        if (string.Equals(record.TransactionType, LedgerConstants.TransactionTypes.WalletAdjustment, StringComparison.Ordinal)
            || string.Equals(record.TransactionType, LedgerConstants.TransactionTypes.CompensatingAdjustment, StringComparison.Ordinal))
        {
            return record.AvailableDelta >= 0m
                ? ProviderFinanceConstants.WalletEntryTypes.AdminAdjustmentCredit
                : ProviderFinanceConstants.WalletEntryTypes.AdminAdjustmentDebit;
        }

        return ProviderFinanceConstants.WalletEntryTypes.TopUpReversal;
    }

    private static string ResolveLedgerDirection(ProviderWalletLedgerRecord record)
    {
        if (string.Equals(record.TransactionType, LedgerConstants.TransactionTypes.WalletTopUpCredited, StringComparison.Ordinal)
            || string.Equals(record.TransactionType, LedgerConstants.TransactionTypes.CashBookingFeeReleased, StringComparison.Ordinal))
        {
            return ProviderFinanceConstants.LedgerDirections.Credit;
        }

        if (string.Equals(record.TransactionType, LedgerConstants.TransactionTypes.CashBookingFeeReserved, StringComparison.Ordinal)
            || string.Equals(record.TransactionType, LedgerConstants.TransactionTypes.CashBookingFeeSettled, StringComparison.Ordinal))
        {
            return ProviderFinanceConstants.LedgerDirections.Debit;
        }

        return record.AvailableDelta >= 0m
            ? ProviderFinanceConstants.LedgerDirections.Credit
            : ProviderFinanceConstants.LedgerDirections.Debit;
    }

    private static decimal ResolveLedgerAmount(ProviderWalletLedgerRecord record)
    {
        return Math.Max(Math.Abs(record.AvailableDelta), Math.Abs(record.ReservedDelta));
    }

    private static DateTime ResolveMovementOccurredAt(ProviderWalletTopUp request, string displayStatus)
    {
        if (string.Equals(displayStatus, ProviderFinanceConstants.TopUpStatuses.Credited, StringComparison.Ordinal)
            && request.CreditedAt.HasValue)
        {
            return request.CreditedAt.Value;
        }

        if (string.Equals(displayStatus, ProviderFinanceConstants.TopUpStatuses.Failed, StringComparison.Ordinal)
            && request.FailedAt.HasValue)
        {
            return request.FailedAt.Value;
        }

        if (string.Equals(displayStatus, ProviderFinanceConstants.TopUpStatuses.Cancelled, StringComparison.Ordinal)
            && request.CancelledAt.HasValue)
        {
            return request.CancelledAt.Value;
        }

        if (string.Equals(displayStatus, ProviderFinanceConstants.TopUpStatuses.Expired, StringComparison.Ordinal)
            && request.ExpiredAt.HasValue)
        {
            return request.ExpiredAt.Value;
        }

        return request.InitiatedAt;
    }

    private static class FinanceTimelineSourceTypes
    {
        public const string Payment = "payment";
        public const string LedgerTransaction = "ledger_transaction";
    }
}
