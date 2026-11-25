using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;

namespace SanadPlatform.API.Features.Bookings.Services.Policies;

/// <summary>
/// Default booking category policy for standard appointment-based service categories.
/// Uses the service's canonical price and applies no extra entity or response enrichment.
/// </summary>
public class DefaultBookingCategoryPolicy : IBookingCategoryPolicy
{
    private const string HomeLocation = "home";
    private const string ProviderSiteLocation = "provider_site";

    /// <inheritdoc />
    public string CategoryCode => "default";

    /// <inheritdoc />
    public void Validate(BookingCategoryContext context)
    {
        if (IsBothLocation(context.ServiceLocation))
        {
            var normalizedLocationChoice = NormalizePatientLocationChoice(context.PatientLocationChoice);
            if (normalizedLocationChoice is null)
            {
                throw new InvalidOperationException(
                    "A patient location choice (patientLocationChoice) is required when serviceLocation is 'both'.");
            }

            if (normalizedLocationChoice == HomeLocation && string.IsNullOrWhiteSpace(context.AddressLine1))
            {
                throw new InvalidOperationException(
                    "A delivery address (address.line1) is required when patientLocationChoice is 'home'.");
            }
        }

        if (context.RequiresPrescription && !context.PrescriptionFileId.HasValue)
        {
            throw new InvalidOperationException(
                "A prescription file (prescriptionFileId) is required for services that require a prescription.");
        }
    }

    /// <inheritdoc />
    public BookingCategoryResult Process(BookingCategoryContext context)
    {
        var serviceLocationOverride = IsBothLocation(context.ServiceLocation)
            ? NormalizePatientLocationChoice(context.PatientLocationChoice)
            : null;

        return new BookingCategoryResult(
            ServicePrice: context.BasePrice,
            ServiceLocationOverride: serviceLocationOverride,
            StockDelta: 0,
            CategoryData: null);
    }

    /// <inheritdoc />
    public void ApplyToBooking(BookingCategoryResult result, Booking booking, BookingApplyContext applyContext)
    {
        // No category-specific entity enrichment for standard appointments.
    }

    /// <inheritdoc />
    public void ApplyToResponse(BookingCategoryResult result, CreateBookingResponse response, BookingApplyContext applyContext)
    {
        // No category-specific response enrichment for standard appointments.
    }

    /// <inheritdoc />
    public BookingCancellationResult ProcessCancellation(BookingCancellationContext context)
    {
        // No stock adjustment for standard appointments.
        return new BookingCancellationResult(StockDelta: 0);
    }

    private static bool IsBothLocation(string serviceLocation)
    {
        return serviceLocation.Equals("both", StringComparison.OrdinalIgnoreCase);
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
}
