namespace SanadPlatform.API.Features.Finance.DTOs;

/// <summary>
/// Admin-facing transaction payload grouped by finance domain.
/// </summary>
public record AdminTransactionsResponse
{
    public IReadOnlyList<AdminServiceTransactionResponse> Payments { get; init; } = Array.Empty<AdminServiceTransactionResponse>();

    public IReadOnlyList<AdminSubscriptionTransactionResponse> Subscriptions { get; init; } = Array.Empty<AdminSubscriptionTransactionResponse>();

    public IReadOnlyList<AdminCommissionTransactionResponse> Commissions { get; init; } = Array.Empty<AdminCommissionTransactionResponse>();
}

/// <summary>
/// Admin-facing booking payment row.
/// </summary>
public record AdminServiceTransactionResponse
{
    public Guid Id { get; init; }

    public DateTime Date { get; init; }

    public string PatientName { get; init; } = string.Empty;

    public string ProviderName { get; init; } = string.Empty;

    public string ServiceName { get; init; } = string.Empty;

    public decimal Amount { get; init; }

    public decimal Commission { get; init; }

    public decimal NetAmount { get; init; }

    public string PaymentMethod { get; init; } = string.Empty;

    public string Status { get; init; } = string.Empty;

    public string Direction { get; init; } = "in";

    public string? BookingReference { get; init; }

    public string? PaymentReference { get; init; }
}

/// <summary>
/// Admin-facing provider subscription payment row.
/// </summary>
public record AdminSubscriptionTransactionResponse
{
    public Guid Id { get; init; }

    public DateTime Date { get; init; }

    public string ProviderName { get; init; } = string.Empty;

    public string ProviderService { get; init; } = string.Empty;

    public string Plan { get; init; } = string.Empty;

    public decimal Amount { get; init; }

    public DateOnly PeriodStart { get; init; }

    public DateOnly PeriodEnd { get; init; }

    public string PaymentMethod { get; init; } = string.Empty;

    public string Status { get; init; } = string.Empty;
}

/// <summary>
/// Admin-facing commission row derived from booking payments.
/// </summary>
public record AdminCommissionTransactionResponse
{
    public Guid Id { get; init; }

    public DateTime Date { get; init; }

    public string ProviderName { get; init; } = string.Empty;

    public string ServiceName { get; init; } = string.Empty;

    public decimal GrossAmount { get; init; }

    public decimal CommissionRate { get; init; }

    public decimal CommissionAmount { get; init; }

    public decimal NetAmount { get; init; }

    public string BookingRef { get; init; } = string.Empty;

    public string Status { get; init; } = string.Empty;
}
