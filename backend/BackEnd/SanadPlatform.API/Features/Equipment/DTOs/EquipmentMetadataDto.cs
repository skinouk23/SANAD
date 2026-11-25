using System.Text.Json;
using System.Text.Json.Serialization;

namespace SanadPlatform.API.Features.Equipment.DTOs;

/// <summary>
/// Model for deserializing equipment-specific metadata from the Service.Metadata JSON column.
/// Used for both catalog display and booking validation.
/// </summary>
public class EquipmentMetadataDto
{
    [JsonPropertyName("equipment_type_code")]
    public string EquipmentTypeCode { get; set; } = string.Empty;

    [JsonPropertyName("brand")]
    public string? Brand { get; set; }

    [JsonPropertyName("model")]
    public string? Model { get; set; }

    [JsonPropertyName("deposit_amount")]
    public decimal DepositAmount { get; set; }

    [JsonPropertyName("pricing")]
    public EquipmentPricingDto Pricing { get; set; } = new();

    [JsonPropertyName("specifications")]
    public Dictionary<string, JsonElement>? Specifications { get; set; }

    [JsonPropertyName("features")]
    public List<string> Features { get; set; } = new();

    /// <summary>
    /// Lenient deserialization — returns empty defaults on failure. For display paths.
    /// </summary>
    public static EquipmentMetadataDto DeserializeOrDefault(string? json, ILogger? logger = null, Guid? serviceId = null)
    {
        if (string.IsNullOrWhiteSpace(json)) return new();
        try
        {
            return JsonSerializer.Deserialize<EquipmentMetadataDto>(json, JsonOptions) ?? new();
        }
        catch (JsonException ex)
        {
            logger?.LogWarning(ex, "Malformed metadata for service {ServiceId}", serviceId);
            return new();
        }
    }

    /// <summary>
    /// Strict deserialization — throws InvalidOperationException on failure. For write paths.
    /// </summary>
    public static EquipmentMetadataDto DeserializeOrThrow(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
            throw new InvalidOperationException(
                "This equipment service is missing metadata. Contact the administrator.");
        try
        {
            return JsonSerializer.Deserialize<EquipmentMetadataDto>(json, JsonOptions)
                ?? throw new InvalidOperationException("Metadata deserialized to null.");
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException(
                "This equipment service has malformed metadata. Contact the administrator.", ex);
        }
    }

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };
}

/// <summary>
/// Nested pricing tiers for equipment rentals.
/// </summary>
public class EquipmentPricingDto
{
    // Note: the daily rate is usually stored in the canonical Service.Price column.
    [JsonPropertyName("weekly")]
    public decimal Weekly { get; set; }

    [JsonPropertyName("monthly")]
    public decimal Monthly { get; set; }

    /// <summary>
    /// Returns the rate for a non-daily tier.
    /// Daily rate is stored in Service.Price, not in metadata.
    /// </summary>
    public decimal GetRate(string tier)
    {
        return tier.ToLowerInvariant() switch
        {
            "weekly" => Weekly > 0 ? Weekly
                : throw new InvalidOperationException("Weekly rate is not configured."),
            "monthly" => Monthly > 0 ? Monthly
                : throw new InvalidOperationException("Monthly rate is not configured."),
            _ => throw new InvalidOperationException(
                $"Tier '{tier}' rate must be read from Service.Price (daily) or is not recognised.")
        };
    }
}
