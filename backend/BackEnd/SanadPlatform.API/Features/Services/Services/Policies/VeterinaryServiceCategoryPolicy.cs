using System.Text.Json;
using SanadPlatform.API.Common.Constants;

namespace SanadPlatform.API.Features.Services.Services.Policies;

/// <summary>
/// Service category policy for the <c>veterinary</c> category.
/// Validates canonical animal-type codes and persists a normalized camelCase JSON payload
/// in <c>Service.Metadata</c>.
/// </summary>
public class VeterinaryServiceCategoryPolicy : IServiceCategoryPolicy
{
    private static readonly JsonSerializerOptions SerializerOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    private static readonly HashSet<string> AllowedAnimalTypeCodes = new(StringComparer.OrdinalIgnoreCase)
    {
        "dog",
        "cat",
        "bird",
        "reptile",
        "nac",
        "horse"
    };

    /// <inheritdoc />
    public string CategoryCode => ServiceCategories.Veterinary;

    /// <inheritdoc />
    public bool RequiresRevalidationOnUpdate => false;

    /// <inheritdoc />
    public string? ValidateAndNormalize(ServiceCategoryContext context)
    {
        if (context.TypeConfig is null || context.TypeConfig.Value.ValueKind == JsonValueKind.Null)
            throw new InvalidOperationException("Veterinary services require a typeConfig payload.");

        VeterinaryServiceMetadata metadata;
        try
        {
            var raw = context.TypeConfig.Value.GetRawText();
            metadata = JsonSerializer.Deserialize<VeterinaryServiceMetadata>(raw, SerializerOptions)
                ?? throw new InvalidOperationException("typeConfig deserialized to null.");
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException("typeConfig is not a valid veterinary metadata payload.", ex);
        }

        var normalizedAnimalTypes = NormalizeRequiredCodeList(
            metadata.AnimalTypes,
            AllowedAnimalTypeCodes,
            "typeConfig.animalTypes must contain at least one canonical veterinary animal-type code.");

        if (context.Price <= 0)
            throw new InvalidOperationException("Veterinary services require a positive price.");

        var normalizedMetadata = metadata with
        {
            AnimalTypes = normalizedAnimalTypes
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

    private sealed record VeterinaryServiceMetadata
    {
        public IReadOnlyList<string>? AnimalTypes { get; init; }

        public bool HomeVisit { get; init; }

        public bool Emergency24h { get; init; }
    }
}
