using System.Text.Json;
using Microsoft.Extensions.Logging;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Veterinary.Entities;

namespace SanadPlatform.API.Features.Bookings.Services.Policies;

/// <summary>
/// Configuration deserialized from <c>CreateBookingCommand.TypeConfig</c> for veterinary bookings.
/// </summary>
internal sealed class VeterinaryBookingConfig
{
    public string? AnimalType { get; set; }
    public string? AnimalName { get; set; }
    public string? AnimalBreed { get; set; }
    public string? AnimalAge { get; set; }
    public string? AnimalWeight { get; set; }
    public bool IsSterilized { get; set; }
    public bool IsVaccinated { get; set; }
    public bool IsAggressive { get; set; }
    public bool HasMedicalRecord { get; set; }
    public string? Notes { get; set; }
    public string? HomeVisitAddress { get; set; }
}

internal sealed class VeterinaryServiceMetadata
{
    public IReadOnlyList<string>? AnimalTypes { get; set; }
}

/// <summary>
/// Typed draft data for the <c>veterinary</c> category.
/// Created by <see cref="VeterinaryBookingCategoryPolicy.Process"/> and consumed
/// by <see cref="VeterinaryBookingCategoryPolicy.ApplyToBooking"/>.
/// </summary>
public sealed record VeterinaryBookingDraft(
    string AnimalType,
    string AnimalName,
    string? AnimalBreed,
    string? AnimalAge,
    string? AnimalWeight,
    bool IsSterilized,
    bool IsVaccinated,
    bool IsAggressive,
    bool HasMedicalRecord,
    string? Notes,
    string? HomeVisitAddress);

/// <summary>
/// Booking category policy for the <c>veterinary</c> category.
/// Validates veterinary-specific constraints, preserves structured intake inputs,
/// and builds the <see cref="VeterinaryBooking"/> child entity via <see cref="ApplyToBooking"/>.
/// </summary>
public class VeterinaryBookingCategoryPolicy : IBookingCategoryPolicy
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private readonly ILogger<VeterinaryBookingCategoryPolicy> _logger;

    public VeterinaryBookingCategoryPolicy(ILogger<VeterinaryBookingCategoryPolicy> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public string CategoryCode => ServiceCategories.Veterinary;

    // ==================== Validate ====================

    /// <inheritdoc />
    public void Validate(BookingCategoryContext context)
    {
        var config = DeserializeConfig(context.TypeConfig);
        var missingFields = GetMissingRequiredFields(config);

        if (missingFields.Count > 0)
        {
            _logger.LogWarning(
                "Veterinary booking validation failed because required fields were missing: {MissingFields}",
                missingFields);

            throw new InvalidOperationException(BuildMissingFieldsMessage(
                "Veterinary bookings require ",
                missingFields));
        }

        var normalizedAnimalType = config.AnimalType!.Trim();
        var allowedAnimalTypes = GetAllowedAnimalTypes(context.ServiceMetadata);
        var hasAnimalTypeRestriction = allowedAnimalTypes.Count > 0;

        if (hasAnimalTypeRestriction
            && !allowedAnimalTypes.Any(allowedAnimalType => string.Equals(
                allowedAnimalType,
                normalizedAnimalType,
                StringComparison.OrdinalIgnoreCase)))
        {
            _logger.LogWarning(
                "Veterinary booking validation failed because animalType {AnimalType} is not supported by service metadata. AllowedAnimalTypes: {AllowedAnimalTypes}",
                normalizedAnimalType,
                allowedAnimalTypes);

            throw new InvalidOperationException(
                $"Veterinary bookings for this service only support animal types: {string.Join(", ", allowedAnimalTypes)}. Received: {normalizedAnimalType}.");
        }

        _logger.LogInformation(
            "Validated veterinary booking config for service location {ServiceLocation} with animalType {AnimalType}, hasAnimalTypeRestriction {HasAnimalTypeRestriction}, allowedAnimalTypes {AllowedAnimalTypes}, hasAnimalName {HasAnimalName}, hasAnimalBreed {HasAnimalBreed}, hasAnimalAge {HasAnimalAge}, hasAnimalWeight {HasAnimalWeight}, hasNotes {HasNotes}, hasHomeVisitAddress {HasHomeVisitAddress}, isSterilized {IsSterilized}, isVaccinated {IsVaccinated}, isAggressive {IsAggressive}, hasMedicalRecord {HasMedicalRecord}",
            context.ServiceLocation,
            normalizedAnimalType,
            hasAnimalTypeRestriction,
            allowedAnimalTypes,
            true,
            !string.IsNullOrWhiteSpace(config.AnimalBreed),
            !string.IsNullOrWhiteSpace(config.AnimalAge),
            !string.IsNullOrWhiteSpace(config.AnimalWeight),
            !string.IsNullOrWhiteSpace(config.Notes),
            !string.IsNullOrWhiteSpace(ResolveHomeVisitAddress(config, context.AddressLine1, context.ServiceLocation)),
            config.IsSterilized,
            config.IsVaccinated,
            config.IsAggressive,
            config.HasMedicalRecord);
    }

    // ==================== Process ====================

    /// <inheritdoc />
    public BookingCategoryResult Process(BookingCategoryContext context)
    {
        var config = DeserializeConfig(context.TypeConfig);
        EnsureRequiredFields(config);

        var draft = new VeterinaryBookingDraft(
            AnimalType: config.AnimalType!.Trim(),
            AnimalName: config.AnimalName!.Trim(),
            AnimalBreed: NullIfWhiteSpace(config.AnimalBreed),
            AnimalAge: NullIfWhiteSpace(config.AnimalAge),
            AnimalWeight: NullIfWhiteSpace(config.AnimalWeight),
            IsSterilized: config.IsSterilized,
            IsVaccinated: config.IsVaccinated,
            IsAggressive: config.IsAggressive,
            HasMedicalRecord: config.HasMedicalRecord,
            Notes: NullIfWhiteSpace(config.Notes),
            HomeVisitAddress: ResolveHomeVisitAddress(config, context.AddressLine1, context.ServiceLocation));

        _logger.LogInformation(
            "Processed veterinary booking config into a draft for animalType {AnimalType} with hasAnimalBreed {HasAnimalBreed}, hasAnimalAge {HasAnimalAge}, hasAnimalWeight {HasAnimalWeight}, hasNotes {HasNotes}, hasHomeVisitAddress {HasHomeVisitAddress}, isSterilized {IsSterilized}, isVaccinated {IsVaccinated}, isAggressive {IsAggressive}, hasMedicalRecord {HasMedicalRecord}",
            draft.AnimalType,
            draft.AnimalBreed is not null,
            draft.AnimalAge is not null,
            draft.AnimalWeight is not null,
            draft.Notes is not null,
            draft.HomeVisitAddress is not null,
            draft.IsSterilized,
            draft.IsVaccinated,
            draft.IsAggressive,
            draft.HasMedicalRecord);

        return new BookingCategoryResult(
            ServicePrice: context.BasePrice,
            ServiceLocationOverride: null,
            StockDelta: 0,
            CategoryData: draft);
    }

    // ==================== Apply to Booking ====================

    /// <inheritdoc />
    public void ApplyToBooking(BookingCategoryResult result, Booking booking, BookingApplyContext applyContext)
    {
        var draft = (VeterinaryBookingDraft)result.CategoryData!;

        booking.VeterinaryBooking = new VeterinaryBooking
        {
            Id = Guid.NewGuid(),
            BookingId = booking.Id,
            AnimalType = draft.AnimalType,
            AnimalName = draft.AnimalName,
            AnimalBreed = draft.AnimalBreed,
            AnimalAge = draft.AnimalAge,
            AnimalWeight = draft.AnimalWeight,
            IsSterilized = draft.IsSterilized,
            IsVaccinated = draft.IsVaccinated,
            IsAggressive = draft.IsAggressive,
            HasMedicalRecord = draft.HasMedicalRecord,
            Notes = draft.Notes,
            HomeVisitAddress = draft.HomeVisitAddress,
        };
    }

    // ==================== Apply to Response ====================

    /// <inheritdoc />
    public void ApplyToResponse(BookingCategoryResult result, CreateBookingResponse response, BookingApplyContext applyContext)
    {
        // Veterinary bookings do not enrich the booking creation response with additional blocks.
        // The patient sees the standard booking confirmation.
    }

    // ==================== Cancellation ====================

    /// <inheritdoc />
    public BookingCancellationResult ProcessCancellation(BookingCancellationContext context)
    {
        // Veterinary bookings have no stock inventory to restore.
        return new BookingCancellationResult(StockDelta: 0);
    }

    // ==================== Private Helpers ====================

    /// <summary>
    /// Deserializes and validates the <c>TypeConfig</c> JSON element into a
    /// <see cref="VeterinaryBookingConfig"/>.
    /// </summary>
    private VeterinaryBookingConfig DeserializeConfig(JsonElement? typeConfig)
    {
        if (typeConfig is null || typeConfig.Value.ValueKind == JsonValueKind.Null)
        {
            _logger.LogWarning(
                "Veterinary booking config was missing from the create booking payload.");

            throw new InvalidOperationException(
                "Veterinary bookings require a typeConfig payload with animalType and animalName.");
        }

        var raw = typeConfig.Value.GetRawText();

        VeterinaryBookingConfig? config;
        try
        {
            config = JsonSerializer.Deserialize<VeterinaryBookingConfig>(raw, JsonOptions);
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(
                ex,
                "Veterinary booking config deserialization failed.");

            throw new InvalidOperationException(
                "Invalid typeConfig format for veterinary booking.",
                ex);
        }

        if (config is null)
        {
            _logger.LogWarning(
                "Veterinary booking config deserialized to null.");

            throw new InvalidOperationException(
                "typeConfig deserialized to null. Provide animalType and animalName for a veterinary booking.");
        }

        return config;
    }

    private void EnsureRequiredFields(VeterinaryBookingConfig config)
    {
        var missingFields = GetMissingRequiredFields(config);
        if (missingFields.Count == 0)
        {
            return;
        }

        _logger.LogWarning(
            "Veterinary booking processing failed because required fields were missing: {MissingFields}",
            missingFields);

        throw new InvalidOperationException(BuildMissingFieldsMessage(
            "Veterinary bookings require ",
            missingFields));
    }

    private IReadOnlyList<string> GetAllowedAnimalTypes(string? serviceMetadata)
    {
        if (string.IsNullOrWhiteSpace(serviceMetadata))
        {
            return Array.Empty<string>();
        }

        try
        {
            var metadata = JsonSerializer.Deserialize<VeterinaryServiceMetadata>(serviceMetadata, JsonOptions);
            if (metadata?.AnimalTypes is null || metadata.AnimalTypes.Count == 0)
            {
                return Array.Empty<string>();
            }

            return metadata.AnimalTypes
                .Where(animalType => !string.IsNullOrWhiteSpace(animalType))
                .Select(animalType => animalType.Trim().ToLowerInvariant())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray();
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(
                ex,
                "Veterinary booking validation skipped service metadata animal-type enforcement because service metadata could not be parsed.");

            return Array.Empty<string>();
        }
    }

    private static List<string> GetMissingRequiredFields(VeterinaryBookingConfig config)
    {
        var missingFields = new List<string>();

        if (string.IsNullOrWhiteSpace(config.AnimalType))
        {
            missingFields.Add("typeConfig.animalType");
        }

        if (string.IsNullOrWhiteSpace(config.AnimalName))
        {
            missingFields.Add("typeConfig.animalName");
        }

        return missingFields;
    }

    private static string BuildMissingFieldsMessage(string prefix, IReadOnlyList<string> missingFields)
    {
        if (missingFields.Count == 1)
        {
            return prefix + missingFields[0] + ".";
        }

        if (missingFields.Count == 2)
        {
            return prefix + missingFields[0] + " and " + missingFields[1] + ".";
        }

        return prefix + string.Join(", ", missingFields.Take(missingFields.Count - 1)) + ", and " + missingFields[^1] + ".";
    }

    private static string? ResolveHomeVisitAddress(
        VeterinaryBookingConfig config,
        string? addressLine1,
        string serviceLocation)
    {
        var configuredAddress = NullIfWhiteSpace(config.HomeVisitAddress);
        if (configuredAddress is not null)
        {
            return configuredAddress;
        }

        return SupportsHomeVisits(serviceLocation)
            ? NullIfWhiteSpace(addressLine1)
            : null;
    }

    private static bool SupportsHomeVisits(string serviceLocation)
    {
        return serviceLocation.Equals("home", StringComparison.OrdinalIgnoreCase)
            || serviceLocation.Equals("both", StringComparison.OrdinalIgnoreCase);
    }

    private static string? NullIfWhiteSpace(string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? null
            : value.Trim();
    }
}
