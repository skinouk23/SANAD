using Microsoft.Extensions.DependencyInjection;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Bookings.Services.Policies;

namespace SanadPlatform.API.Features.Bookings;

/// <summary>
/// Dependency injection extension methods for the Bookings feature.
/// Registers all repositories owned by this vertical slice.
/// </summary>
public static class BookingServiceExtensions
{
    /// <summary>
    /// Registers the Bookings feature's repositories with the DI container.
    /// </summary>
    public static IServiceCollection AddBookingFeature(this IServiceCollection services)
    {
        // ==================== Repositories ====================
        services.AddScoped<IBookingRepository, BookingRepository>();
        services.AddScoped<IBookingSessionRepository, BookingSessionRepository>();

        // ==================== Services ====================
        services.AddScoped<IBookingPricingService, BookingPricingService>();
        services.AddScoped<IBookingSessionGenerationService, BookingSessionGenerationService>();
        services.AddScoped<IBookingSessionVerificationCodeService, BookingSessionVerificationCodeService>();
        services.AddScoped<IBookingRollupService, BookingRollupService>();
        services.AddScoped<IBookingSettlementService, BookingSettlementService>();
        services.AddScoped<IBookingSessionMapper, BookingSessionMapper>();

        // ==================== Category Policies ====================
        services.AddScoped<IBookingCategoryPolicy, DefaultBookingCategoryPolicy>();
        services.AddScoped<IBookingCategoryPolicy, EquipmentRentalBookingCategoryPolicy>();
        services.AddScoped<IBookingCategoryPolicy, PharmacyBookingCategoryPolicy>();
        services.AddScoped<IBookingCategoryPolicy, AmbulanceBookingCategoryPolicy>();
        services.AddScoped<IBookingCategoryPolicy, VeterinaryBookingCategoryPolicy>();
        services.AddScoped<IBookingCategoryPolicy, FuneralBookingCategoryPolicy>();
        services.AddScoped<DefaultBookingCategoryPolicy>();
        services.AddScoped<BookingCategoryPolicyRegistry>();

        return services;
    }
}
