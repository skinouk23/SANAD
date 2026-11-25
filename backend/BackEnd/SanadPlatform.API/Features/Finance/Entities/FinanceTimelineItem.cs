namespace SanadPlatform.API.Features.Finance.Entities;

/// <summary>
/// Read-only finance timeline item projected from the SQL view.
/// </summary>
public class FinanceTimelineItem
{
    public Guid Id { get; set; }

    public string Type { get; set; } = string.Empty;

    public string Direction { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Currency { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime OccurredAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public string SourceType { get; set; } = string.Empty;

    public Guid SourceId { get; set; }

    public Guid? ProviderId { get; set; }

    public Guid? PatientId { get; set; }

    public Guid? BookingId { get; set; }

    public Guid? PaymentId { get; set; }

    public Guid? PaymentAttemptId { get; set; }

    public Guid? ProviderWalletTopUpId { get; set; }

    public Guid? LedgerTransactionId { get; set; }

    public string? ReferenceNumber { get; set; }
}
