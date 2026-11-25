namespace SanadPlatform.API.Features.Pharmacy.DTOs;

/// <summary>
/// Patient-side pharmacy order response.
/// Patient-side pharmacy order response.
/// </summary>
public record PharmacyOrderResponse
{
    /// <summary>Order identifier.</summary>
    public string Id { get; init; } = string.Empty;

    /// <summary>Name of the pharmacy provider.</summary>
    public string PharmacyName { get; init; } = string.Empty;

    /// <summary>Order date as ISO 8601 string.</summary>
    public string Date { get; init; } = string.Empty;

    /// <summary>Current status (pending, processing, delivery, completed).</summary>
    public string Status { get; init; } = string.Empty;

    /// <summary>Formatted total amount, if available.</summary>
    public string? Amount { get; init; }

    /// <summary>Comma-separated item descriptions.</summary>
    public string Items { get; init; } = string.Empty;

    /// <summary>Prescription file identifier, if uploaded.</summary>
    public Guid? PrescriptionFileId { get; init; }
}
