using System.Text.Json;
using SanadPlatform.API.Common.Constants;

namespace SanadPlatform.API.Features.Services.Services.Policies;

/// <summary>
/// Service category policy for the <c>ambulance</c> category.
/// Validates canonical ambulance service-type codes and operational pricing metadata,
/// then persists a normalized camelCase JSON payload in <c>Service.Metadata</c>.
/// </summary>
public class AmbulanceServiceCategoryPolicy : IServiceCategoryPolicy
{
    private static readonly JsonSerializerOptions SerializerOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    private static readonly HashSet<string> AllowedServiceTypeCodes = new(StringComparer.OrdinalIgnoreCase)
    {
        "emergency",
        "inter_hospital",
        "repatriation",
        "event_assistance"
    };

    /// <inheritdoc />
    public string CategoryCode => ServiceCategories.Ambulance;

    /// <inheritdoc />
    public bool RequiresRevalidationOnUpdate => false;

    /// <inheritdoc />
    public string? ValidateAndNormalize(ServiceCategoryContext context)
    {
        if (context.TypeConfig is null || context.TypeConfig.Value.ValueKind == JsonValueKind.Null)
            throw new InvalidOperationException("Ambulance services require a typeConfig payload.");

        AmbulanceServiceMetadata metadata;
        try
        {
            var raw = context.TypeConfig.Value.GetRawText();
            metadata = JsonSerializer.Deserialize<AmbulanceServiceMetadata>(raw, SerializerOptions)
                ?? throw new InvalidOperationException("typeConfig deserialized to null.");
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException("typeConfig is not a valid ambulance metadata payload.", ex);
        }

        var normalizedServiceTypes = NormalizeRequiredCodeList(
            metadata.ServiceTypes,
            AllowedServiceTypeCodes,
            "typeConfig.serviceTypes must contain at least one canonical ambulance service-type code.");

        if (!metadata.StandardKilometers.HasValue || metadata.StandardKilometers.Value <= 0)
            throw new InvalidOperationException("typeConfig.standardKilometers must be a positive integer.");

        if (!metadata.PricePerExtraKm.HasValue || metadata.PricePerExtraKm.Value <= 0)
            throw new InvalidOperationException("typeConfig.pricePerExtraKm must be a positive number.");

        if (context.Price <= 0)
            throw new InvalidOperationException("Ambulance services require a positive base price.");

        var normalizedMetadata = metadata with
        {
            ServiceTypes = normalizedServiceTypes,
            StandardKilometers = metadata.StandardKilometers.Value,
            PricePerExtraKm = metadata.PricePerExtraKm.Value
        };

        return JsonSerializer.Serialize(normalizedMetadata, SerializerOptions);
    }

    private static IReadOnlyList<string> NormalizeRequiredCodeList(
        IReadOnlyList<string>? values,
        ISet<string> allowedCodes,
        string errorMessage)
    {
        if (values is null || values.Count == 0)
            throw new InvalidOperationException(errorMessage);

        var normalizedValues = new List<string>();
        foreach (var value in values)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new InvalidOperationException(errorMessage);

            var normalizedValue = value.Trim().ToLowerInvariant();
            if (!allowedCodes.Contains(normalizedValue))
                throw new InvalidOperationException(errorMessage);

            if (!normalizedValues.Any(existing => existing == normalizedValue))
                normalizedValues.Add(normalizedValue);
        }

        if (normalizedValues.Count == 0)
            throw new InvalidOperationException(errorMessage);

        return normalizedValues;
    }

    private sealed record AmbulanceServiceMetadata
    {
        public IReadOnlyList<string>? ServiceTypes { get; init; }

        public int? StandardKilometers { get; init; }

        public decimal? PricePerExtraKm { get; init; }

        public bool Available24h { get; init; }
    }
}
