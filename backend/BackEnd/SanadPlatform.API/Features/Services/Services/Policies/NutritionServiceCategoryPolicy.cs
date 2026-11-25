using System.Text.Json;
using SanadPlatform.API.Common.Constants;

namespace SanadPlatform.API.Features.Services.Services.Policies;

/// <summary>
/// Service category policy for the <c>nutrition</c> category.
/// Validates nutrition-specific metadata against the canonical lookup codes and
/// persists a normalized camelCase JSON payload in <c>Service.Metadata</c>.
/// </summary>
public class NutritionServiceCategoryPolicy : IServiceCategoryPolicy
{
    private static readonly JsonSerializerOptions SerializerOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    private static readonly HashSet<string> AllowedSubcategoryCodes = new(StringComparer.OrdinalIgnoreCase)
    {
        "consultation",
        "meal_plan",
        "meal_delivery"
    };

    private static readonly HashSet<string> AllowedDietTypeCodes = new(StringComparer.OrdinalIgnoreCase)
    {
        "diabetic",
        "low_salt",
        "cardiac",
        "gluten_free",
        "vegetarian",
        "vegan"
    };

    /// <inheritdoc />
    public string CategoryCode => ServiceCategories.Nutrition;

    /// <inheritdoc />
    public bool RequiresRevalidationOnUpdate => false;

    /// <inheritdoc />
    public string? ValidateAndNormalize(ServiceCategoryContext context)
    {
        if (context.TypeConfig is null || context.TypeConfig.Value.ValueKind == JsonValueKind.Null)
            throw new InvalidOperationException("Nutrition services require a typeConfig payload.");

        NutritionServiceMetadata metadata;
        try
        {
            var raw = context.TypeConfig.Value.GetRawText();
            metadata = JsonSerializer.Deserialize<NutritionServiceMetadata>(raw, SerializerOptions)
                ?? throw new InvalidOperationException("typeConfig deserialized to null.");
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException("typeConfig is not a valid nutrition metadata payload.", ex);
        }

        if (string.IsNullOrWhiteSpace(metadata.SubcategoryCode))
            throw new InvalidOperationException("typeConfig.subcategoryCode is required and must be a non-empty string.");

        var normalizedSubcategoryCode = metadata.SubcategoryCode.Trim().ToLowerInvariant();
        if (!AllowedSubcategoryCodes.Contains(normalizedSubcategoryCode))
            throw new InvalidOperationException(
                "typeConfig.subcategoryCode must be one of: consultation, meal_plan, meal_delivery.");

        var normalizedDietTypes = metadata.DietTypes is null
            ? null
            : NormalizeCodeList(
                metadata.DietTypes,
                AllowedDietTypeCodes,
                "typeConfig.dietTypes must only contain canonical nutrition diet-type codes.");

        if (context.Price <= 0)
            throw new InvalidOperationException("Nutrition services require a positive price.");

        var normalizedMetadata = metadata with
        {
            SubcategoryCode = normalizedSubcategoryCode,
            DietTypes = normalizedDietTypes
        };

        return JsonSerializer.Serialize(normalizedMetadata, SerializerOptions);
    }

    private static IReadOnlyList<string> NormalizeCodeList(
        IReadOnlyList<string> values,
        ISet<string> allowedCodes,
        string errorMessage)
    {
        if (values.Count == 0)
            return Array.Empty<string>();

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

        return normalizedValues;
    }

    private sealed record NutritionServiceMetadata
    {
        public string? SubcategoryCode { get; init; }

        public IReadOnlyList<string>? DietTypes { get; init; }
    }
}
