namespace SanadPlatform.API.Features.Pharmacy.DTOs;

/// <summary>
/// Provider-side pharmacy order response.
/// Provider-side pharmacy order response.
/// </summary>
public record ProviderPharmacyOrderResponse
{
    /// <summary>Order identifier.</summary>
    public string Id { get; init; } = string.Empty;

    /// <summary>Patient name (decrypted for the owning provider).</summary>
    public string PatientName { get; init; } = string.Empty;

    /// <summary>Order date as ISO 8601 string.</summary>
    public string Date { get; init; } = string.Empty;

    /// <summary>Current status (Pending, Processing, Delivery, Completed).</summary>
    public string Status { get; init; } = string.Empty;

    /// <summary>Comma-separated item descriptions.</summary>
    public string Items { get; init; } = string.Empty;

    /// <summary>Prescription file identifier.</summary>
    public Guid? PrescriptionFileId { get; init; }

    /// <summary>Delivery address (decrypted for the owning provider).</summary>
    public string Address { get; init; } = string.Empty;

    /// <summary>Patient phone number (decrypted for the owning provider).</summary>
    public string Phone { get; init; } = string.Empty;

    /// <summary>Formatted total amount, if available.</summary>
    public string? Amount { get; init; }
}
