using System.Text.Json.Serialization;

namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Typed DTO for the equipment rental booking <c>TypeConfig</c> payload.
/// Deserialized from the client's JSON by <c>EquipmentRentalBookingCategoryPolicy</c>.
/// </summary>
public class EquipmentRentalBookingConfig
{
    /// <summary>
    /// Planned return date. Must be strictly after the booking date.
    /// </summary>
    [JsonPropertyName("endDate")]
    public DateOnly EndDate { get; set; }

    /// <summary>
    /// Billing tier: <c>daily</c>, <c>weekly</c>, or <c>monthly</c>.
    /// </summary>
    [JsonPropertyName("rentalDurationType")]
    public string RentalDurationType { get; set; } = string.Empty;
}
