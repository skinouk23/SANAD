using System.Text.Json;
using Microsoft.Extensions.Logging;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Features.Ambulance.Entities;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;

namespace SanadPlatform.API.Features.Bookings.Services.Policies;

/// <summary>
/// Configuration deserialized from <c>CreateBookingCommand.TypeConfig</c> for ambulance bookings.
/// Supports both the legacy <c>transportType</c> key and the current <c>serviceType</c> key
/// so staged frontend/backend rollouts do not silently drop the transport selection.
/// </summary>
internal sealed class AmbulanceBookingConfig
{
    public string? TransportType { get; set; }
    public string? ServiceType { get; set; }
    public string? PickupAddress { get; set; }
    public string? DestinationAddress { get; set; }
    public string? PatientCondition { get; set; }
    public bool RequiresStretcher { get; set; }
    public bool RequiresOxygen { get; set; }
    public bool RequiresMedicalStaff { get; set; }
    public string? Mobility { get; set; }
    public string? UrgencyLevel { get; set; }
}

internal sealed class AmbulanceServiceMetadata
{
    public IReadOnlyList<string>? ServiceTypes { get; set; }
}

/// <summary>
/// Typed draft data for the <c>ambulance</c> category.
/// Created by <see cref="AmbulanceBookingCategoryPolicy.Process"/> and consumed
/// by <see cref="AmbulanceBookingCategoryPolicy.ApplyToBooking"/>.
/// </summary>
public sealed record AmbulanceBookingDraft(
    string? ServiceType,
    string PickupAddress,
    string DestinationAddress,
    string? PatientCondition,
    bool RequiresStretcher,
    bool RequiresOxygen,
    bool RequiresMedicalStaff,
    string? Mobility,
    string? UrgencyLevel);

/// <summary>
/// Booking category policy for the <c>ambulance</c> category.
/// Validates ambulance-specific constraints, preserves structured transport inputs,
/// and builds the <see cref="AmbulanceBooking"/> child entity via <see cref="ApplyToBooking"/>.
/// </summary>
public class AmbulanceBookingCategoryPolicy : IBookingCategoryPolicy
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private readonly ILogger<AmbulanceBookingCategoryPolicy> _logger;

    public AmbulanceBookingCategoryPolicy(ILogger<AmbulanceBookingCategoryPolicy> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public string CategoryCode => ServiceCategories.Ambulance;

    // ==================== Validate ====================

    /// <inheritdoc />
    public void Validate(BookingCategoryContext context)
    {
        if (string.IsNullOrWhiteSpace(context.AddressLine1))
        {
            _logger.LogWarning(
                "Ambulance booking validation failed because address.line1 was missing.");

            throw new InvalidOperationException(
                "Ambulance bookings require a pickup location in address.line1.");
        }

        var config = DeserializeConfig(context.TypeConfig);

        if (string.IsNullOrWhiteSpace(config.PickupAddress))
        {
            _logger.LogWarning(
                "Ambulance booking validation failed because typeConfig.pickupAddress was missing.");

            throw new InvalidOperationException(
                "Ambulance bookings require typeConfig.pickupAddress.");
        }

        if (string.IsNullOrWhiteSpace(config.DestinationAddress))
        {
            _logger.LogWarning(
                "Ambulance booking validation failed because typeConfig.destinationAddress was missing.");

            throw new InvalidOperationException(
                "Ambulance bookings require typeConfig.destinationAddress.");
        }

        var resolvedServiceType = ResolveServiceType(config);
        var allowedServiceTypes = GetAllowedServiceTypes(context.ServiceMetadata);
        var hasServiceTypeRestriction = allowedServiceTypes.Count > 0;
        var normalizedServiceType = NormalizeServiceType(resolvedServiceType, allowedServiceTypes);

        if (resolvedServiceType is not null && hasServiceTypeRestriction && normalizedServiceType is null)
        {
            _logger.LogWarning(
                "Ambulance booking validation failed because serviceType {ServiceType} is not supported by service metadata. AllowedServiceTypes: {AllowedServiceTypes}",
                resolvedServiceType,
                allowedServiceTypes);

            throw new InvalidOperationException(
                $"Ambulance bookings for this service only support service types: {string.Join(", ", allowedServiceTypes)}. Received: {resolvedServiceType}.");
        }

        var pickupMatchesBookingAddress = string.Equals(
            NormalizeForComparison(context.AddressLine1),
            NormalizeForComparison(config.PickupAddress),
            StringComparison.OrdinalIgnoreCase);

        _logger.LogInformation(
            "Validated ambulance booking config for service location {ServiceLocation} with serviceType {ServiceType}, hasServiceTypeRestriction {HasServiceTypeRestriction}, allowedServiceTypes {AllowedServiceTypes}, urgencyLevel {UrgencyLevel}, mobility {Mobility}, pickupMatchesBookingAddress {PickupMatchesBookingAddress}, hasPatientCondition {HasPatientCondition}, requiresStretcher {RequiresStretcher}, requiresOxygen {RequiresOxygen}, requiresMedicalStaff {RequiresMedicalStaff}",
            context.ServiceLocation,
            normalizedServiceType ?? resolvedServiceType ?? "unspecified",
            hasServiceTypeRestriction,
            allowedServiceTypes,
            NullIfWhiteSpace(config.UrgencyLevel) ?? "unspecified",
            NullIfWhiteSpace(config.Mobility) ?? "unspecified",
            pickupMatchesBookingAddress,
            !string.IsNullOrWhiteSpace(config.PatientCondition),
            config.RequiresStretcher,
            config.RequiresOxygen,
            config.RequiresMedicalStaff);
    }

    // ==================== Process ====================

    /// <inheritdoc />
    public BookingCategoryResult Process(BookingCategoryContext context)
    {
        var config = DeserializeConfig(context.TypeConfig);
        var resolvedServiceType = NormalizeServiceType(
            ResolveServiceType(config),
            GetAllowedServiceTypes(context.ServiceMetadata));

        var draft = new AmbulanceBookingDraft(
            ServiceType: resolvedServiceType,
            PickupAddress: config.PickupAddress!.Trim(),
            DestinationAddress: config.DestinationAddress!.Trim(),
            PatientCondition: NullIfWhiteSpace(config.PatientCondition),
            RequiresStretcher: config.RequiresStretcher,
            RequiresOxygen: config.RequiresOxygen,
            RequiresMedicalStaff: config.RequiresMedicalStaff,
            Mobility: NullIfWhiteSpace(config.Mobility),
            UrgencyLevel: NullIfWhiteSpace(config.UrgencyLevel));

        _logger.LogInformation(
            "Processed ambulance booking config into a draft for serviceType {ServiceType} with urgencyLevel {UrgencyLevel}, mobility {Mobility}, hasPatientCondition {HasPatientCondition}, requiresStretcher {RequiresStretcher}, requiresOxygen {RequiresOxygen}, requiresMedicalStaff {RequiresMedicalStaff}",
            draft.ServiceType ?? "unspecified",
            draft.UrgencyLevel ?? "unspecified",
            draft.Mobility ?? "unspecified",
            !string.IsNullOrWhiteSpace(draft.PatientCondition),
            draft.RequiresStretcher,
            draft.RequiresOxygen,
            draft.RequiresMedicalStaff);

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
        var draft = (AmbulanceBookingDraft)result.CategoryData!;

        booking.AmbulanceBooking = new AmbulanceBooking
        {
            Id = Guid.NewGuid(),
            BookingId = booking.Id,
            ServiceType = ResolvePersistedServiceType(draft, applyContext.ServiceName),
            PickupAddress = draft.PickupAddress,
            DestinationAddress = draft.DestinationAddress,
            PatientCondition = draft.PatientCondition,
            RequiresStretcher = draft.RequiresStretcher,
            RequiresOxygen = draft.RequiresOxygen,
            RequiresMedicalStaff = draft.RequiresMedicalStaff,
        };
    }

    // ==================== Apply to Response ====================

    /// <inheritdoc />
    public void ApplyToResponse(BookingCategoryResult result, CreateBookingResponse response, BookingApplyContext applyContext)
    {
        // Ambulance bookings do not enrich the booking creation response with additional blocks.
        // The patient sees the standard booking confirmation.
    }

    // ==================== Cancellation ====================

    /// <inheritdoc />
    public BookingCancellationResult ProcessCancellation(BookingCancellationContext context)
    {
        // Ambulance bookings have no stock inventory to restore.
        return new BookingCancellationResult(StockDelta: 0);
    }

    // ==================== Private Helpers ====================

    /// <summary>
    /// Deserializes and validates the <c>TypeConfig</c> JSON element into an
    /// <see cref="AmbulanceBookingConfig"/>.
    /// </summary>
    private AmbulanceBookingConfig DeserializeConfig(JsonElement? typeConfig)
    {
        if (typeConfig is null || typeConfig.Value.ValueKind == JsonValueKind.Null)
        {
            _logger.LogWarning(
                "Ambulance booking config was missing from the create booking payload.");

            throw new InvalidOperationException(
                "Ambulance bookings require a typeConfig payload with pickup and destination addresses.");
        }

        var raw = typeConfig.Value.GetRawText();

        AmbulanceBookingConfig? config;
        try
        {
            config = JsonSerializer.Deserialize<AmbulanceBookingConfig>(raw, JsonOptions);
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(
                ex,
                "Ambulance booking config deserialization failed.");

            throw new InvalidOperationException(
                "Invalid typeConfig format for ambulance booking.", ex);
        }

        if (config is null)
        {
            _logger.LogWarning(
                "Ambulance booking config deserialized to null.");

            throw new InvalidOperationException(
                "typeConfig deserialized to null. Provide pickup and destination addresses for an ambulance booking.");
        }

        return config;
    }

    private IReadOnlyList<string> GetAllowedServiceTypes(string? serviceMetadata)
    {
        if (string.IsNullOrWhiteSpace(serviceMetadata))
        {
            return Array.Empty<string>();
        }

        try
        {
            var metadata = JsonSerializer.Deserialize<AmbulanceServiceMetadata>(serviceMetadata, JsonOptions);
            if (metadata?.ServiceTypes is null || metadata.ServiceTypes.Count == 0)
            {
                return Array.Empty<string>();
            }

            return metadata.ServiceTypes
                .Where(serviceType => !string.IsNullOrWhiteSpace(serviceType))
                .Select(serviceType => serviceType.Trim().ToLowerInvariant())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray();
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(
                ex,
                "Ambulance booking validation skipped service-type enforcement because service metadata could not be parsed.");

            return Array.Empty<string>();
        }
    }

    private static string? NormalizeServiceType(
        string? resolvedServiceType,
        IReadOnlyList<string> allowedServiceTypes)
    {
        if (string.IsNullOrWhiteSpace(resolvedServiceType))
        {
            return null;
        }

        var trimmedServiceType = resolvedServiceType.Trim();
        if (allowedServiceTypes.Count == 0)
        {
            return trimmedServiceType;
        }

        return allowedServiceTypes.FirstOrDefault(allowedServiceType => string.Equals(
            allowedServiceType,
            trimmedServiceType,
            StringComparison.OrdinalIgnoreCase));
    }

    private static string? ResolveServiceType(AmbulanceBookingConfig config)
    {
        if (!string.IsNullOrWhiteSpace(config.ServiceType))
        {
            return config.ServiceType.Trim();
        }

        return string.IsNullOrWhiteSpace(config.TransportType)
            ? null
            : config.TransportType.Trim();
    }

    private static string ResolvePersistedServiceType(AmbulanceBookingDraft draft, string serviceName)
    {
        if (!string.IsNullOrWhiteSpace(draft.ServiceType))
        {
            return draft.ServiceType;
        }

        if (!string.IsNullOrWhiteSpace(serviceName))
        {
            return serviceName;
        }

        return ServiceCategories.Ambulance;
    }

    private static string? NullIfWhiteSpace(string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? null
            : value.Trim();
    }

    private static string NormalizeForComparison(string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? string.Empty
            : value.Trim();
    }
}
