using System.Text.Json;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Pharmacy.Entities;

namespace SanadPlatform.API.Features.Bookings.Services.Policies;

/// <summary>
/// Configuration deserialized from <c>CreateBookingCommand.TypeConfig</c> for pharmacy bookings.
/// Expected shape: <c>{ "items": "...", "hasPrescription": true, "notes": "..." }</c>.
/// </summary>
internal sealed class PharmacyBookingConfig
{
    public string Items { get; set; } = string.Empty;
    public bool HasPrescription { get; set; }
    public string? Notes { get; set; }
}

/// <summary>
/// Typed draft data for the <c>pharmacy</c> category.
/// Created by <see cref="PharmacyBookingCategoryPolicy.Process"/> and consumed
/// by its <c>ApplyToBooking</c> / <c>ApplyToResponse</c> methods.
/// </summary>
public sealed record PharmacyOrderDraft(
    string Items,
    Guid? PrescriptionFileId,
    string? Notes);

/// <summary>
/// Booking category policy for the <c>pharmacy</c> category.
/// Validates pharmacy-specific constraints, passes pricing through unchanged,
/// and builds the <see cref="PharmacyOrder"/> child entity via <see cref="ApplyToBooking"/>.
/// </summary>
public class PharmacyBookingCategoryPolicy : IBookingCategoryPolicy
{
    private const string HomeLocation = "home";
    private const string ProviderSiteLocation = "provider_site";

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    /// <inheritdoc />
    public string CategoryCode => ServiceCategories.Pharmacy;

    // ==================== Validate ====================

    /// <inheritdoc />
    public void Validate(BookingCategoryContext context)
    {
        var config = DeserializeConfig(context.TypeConfig);
        var effectiveServiceLocation = ResolveEffectiveServiceLocation(context);

        if (RequiresDeliveryAddress(effectiveServiceLocation) && string.IsNullOrWhiteSpace(context.AddressLine1))
        {
            throw new InvalidOperationException("A delivery address (address.line1) is required for pharmacy orders.");
        }

        if (string.IsNullOrWhiteSpace(config.Items))
        {
            throw new InvalidOperationException("Pharmacy orders require at least one item in typeConfig.items.");
        }

        if (context.RequiresPrescription && !context.PrescriptionFileId.HasValue)
        {
            throw new InvalidOperationException(
                "This pharmacy service requires a prescription. Please provide prescriptionFileId.");
        }
    }

    // ==================== Process ====================

    /// <inheritdoc />
    public BookingCategoryResult Process(BookingCategoryContext context)
    {
        var config = DeserializeConfig(context.TypeConfig);
        var serviceLocationOverride = GetServiceLocationOverride(context);

        var draft = new PharmacyOrderDraft(
            Items: config.Items,
            PrescriptionFileId: context.PrescriptionFileId,
            Notes: config.Notes);

        return new BookingCategoryResult(
            ServicePrice: context.BasePrice,
            ServiceLocationOverride: serviceLocationOverride,
            StockDelta: 0,
            CategoryData: draft);
    }

    // ==================== Apply to Booking ====================

    /// <inheritdoc />
    public void ApplyToBooking(BookingCategoryResult result, Booking booking, BookingApplyContext applyContext)
    {
        var draft = (PharmacyOrderDraft)result.CategoryData!;

        booking.PharmacyOrder = new PharmacyOrder
        {
            Id = Guid.NewGuid(),
            BookingId = booking.Id,
            Items = draft.Items,
            Amount = booking.ServicePrice,
            PrescriptionFileId = draft.PrescriptionFileId,
            DeliveryAddress = booking.AddressLine1,
            PatientPhone = booking.PatientPhone,
            Notes = draft.Notes,
            OrderDate = DateTime.UtcNow,
        };
    }

    // ==================== Apply to Response ====================

    /// <inheritdoc />
    public void ApplyToResponse(BookingCategoryResult result, CreateBookingResponse response, BookingApplyContext applyContext)
    {
        // Pharmacy orders do not enrich the booking creation response with additional blocks.
        // The patient sees the standard booking confirmation; pharmacy-specific data is
        // available via GET /pharmacy/orders.
    }

    // ==================== Cancellation ====================

    /// <inheritdoc />
    public BookingCancellationResult ProcessCancellation(BookingCancellationContext context)
    {
        // Pharmacy orders have no stock inventory to restore.
        return new BookingCancellationResult(StockDelta: 0);
    }

    // ==================== Private Helpers ====================

    /// <summary>
    /// Deserializes and validates the <c>TypeConfig</c> JSON element into a
    /// <see cref="PharmacyBookingConfig"/>.
    /// </summary>
    private static PharmacyBookingConfig DeserializeConfig(JsonElement? typeConfig)
    {
        if (typeConfig is null || typeConfig.Value.ValueKind == JsonValueKind.Null)
        {
            throw new InvalidOperationException(
                "Pharmacy bookings require a typeConfig payload with items.");
        }

        var raw = typeConfig.Value.GetRawText();

        PharmacyBookingConfig? config;
        try
        {
            config = JsonSerializer.Deserialize<PharmacyBookingConfig>(raw, JsonOptions);
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException(
                "Invalid typeConfig format for pharmacy booking.", ex);
        }

        if (config is null)
        {
            throw new InvalidOperationException(
                "typeConfig deserialized to null. Provide items for a pharmacy booking.");
        }

        return config;
    }

    private static string ResolveEffectiveServiceLocation(BookingCategoryContext context)
    {
        if (!context.ServiceLocation.Equals("both", StringComparison.OrdinalIgnoreCase))
        {
            return context.ServiceLocation;
        }

        return NormalizePatientLocationChoice(context.PatientLocationChoice)
            ?? throw new InvalidOperationException(
                "A patient location choice (patientLocationChoice) is required when serviceLocation is 'both'.");
    }

    private static string? GetServiceLocationOverride(BookingCategoryContext context)
    {
        return context.ServiceLocation.Equals("both", StringComparison.OrdinalIgnoreCase)
            ? ResolveEffectiveServiceLocation(context)
            : null;
    }

    private static string? NormalizePatientLocationChoice(string? patientLocationChoice)
    {
        if (string.IsNullOrWhiteSpace(patientLocationChoice))
        {
            return null;
        }

        if (patientLocationChoice.Equals(HomeLocation, StringComparison.OrdinalIgnoreCase))
        {
            return HomeLocation;
        }

        if (patientLocationChoice.Equals(ProviderSiteLocation, StringComparison.OrdinalIgnoreCase))
        {
            return ProviderSiteLocation;
        }

        throw new InvalidOperationException(
            "PatientLocationChoice must be 'home' or 'provider_site' when serviceLocation is 'both'.");
    }

    private static bool RequiresDeliveryAddress(string serviceLocation)
    {
        return serviceLocation.Equals(HomeLocation, StringComparison.OrdinalIgnoreCase);
    }
}
