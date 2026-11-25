using System.Text.Json;
using SanadPlatform.API.Features.Equipment.DTOs;
using SanadPlatform.API.Common.Constants;

namespace SanadPlatform.API.Features.Services.Services.Policies;

/// <summary>
/// Service category policy for the <c>equipment_rental</c> category.
/// Deserializes <c>TypeConfig</c> into <see cref="EquipmentMetadataDto"/>, validates all
/// required metadata fields, enforces equipment-specific pricing rules, and returns
/// canonical JSON for storage in <c>Service.Metadata</c>.
/// </summary>
public class EquipmentRentalServiceCategoryPolicy : IServiceCategoryPolicy
{
    private static readonly JsonSerializerOptions SerializerOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
    };

    /// <inheritdoc />
    public string CategoryCode => ServiceCategories.EquipmentRental;

    /// <inheritdoc />
    public bool RequiresRevalidationOnUpdate => true;

    /// <inheritdoc />
    public string? ValidateAndNormalize(ServiceCategoryContext context)
    {
        if (context.TypeConfig is null || context.TypeConfig.Value.ValueKind == JsonValueKind.Null)
            throw new InvalidOperationException("Equipment rental services require a typeConfig payload.");

        // Deserialize into typed model
        EquipmentMetadataDto metadata;
        try
        {
            var raw = context.TypeConfig.Value.GetRawText();
            metadata = JsonSerializer.Deserialize<EquipmentMetadataDto>(raw, SerializerOptions)
                ?? throw new InvalidOperationException("typeConfig deserialized to null.");
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException("typeConfig is not a valid equipment metadata payload.", ex);
        }

        // Validate required fields
        if (string.IsNullOrWhiteSpace(metadata.EquipmentTypeCode))
            throw new InvalidOperationException("typeConfig.equipment_type_code is required and must be a non-empty string.");

        if (metadata.Pricing.Weekly <= 0)
            throw new InvalidOperationException("typeConfig.pricing.weekly must be a positive number.");

        if (metadata.Pricing.Monthly <= 0)
            throw new InvalidOperationException("typeConfig.pricing.monthly must be a positive number.");

        if (metadata.DepositAmount < 0)
            throw new InvalidOperationException("typeConfig.deposit_amount must be a non-negative number.");

        // Validate daily price (comes from Service.Price, passed via context)
        if (context.Price <= 0)
            throw new InvalidOperationException("Equipment rental services require a positive price (daily rate).");

        // Return canonical JSON — normalized representation regardless of client formatting
        return JsonSerializer.Serialize(metadata, SerializerOptions);
    }
}
