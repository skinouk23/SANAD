using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Features.Services.Services;

namespace SanadPlatform.API.Tests.Features.Bookings.Services;

public class BookingPricingServiceTests
{
    [Fact]
    public void CalculatePricingBreakdown_MultiDay_ComputesCorrectSubtotalAndFee()
    {
        var result = BookingPricingService.CalculatePricingBreakdown(
            commissionRate: 10m,
            category: "nursing",
            categoryServicePrice: 0m,
            selectedItems:
            [
                CreateResolvedItem(100m, 1),
                CreateResolvedItem(50m, 2)
            ],
            dayCount: 3);

        Assert.Equal(100m, result.ServicePrice);
        Assert.Equal(100m, result.AddonsPrice);
        Assert.Equal(200m, result.PerDaySubtotal);
        Assert.Equal(600m, result.BookingSubtotal);
        Assert.Equal(60m, result.PlatformFee);
        Assert.Equal(660m, result.TotalAmount);
        Assert.Equal(600m, result.ProviderAmount);
    }

    [Fact]
    public void CalculatePricingBreakdown_SingleDay_NoDayMultiplier()
    {
        var result = BookingPricingService.CalculatePricingBreakdown(
            commissionRate: 15m,
            category: "nursing",
            categoryServicePrice: 0m,
            selectedItems: [CreateResolvedItem(80m, 1)],
            dayCount: 1);

        Assert.Equal(80m, result.ServicePrice);
        Assert.Equal(0m, result.AddonsPrice);
        Assert.Equal(80m, result.PerDaySubtotal);
        Assert.Equal(80m, result.BookingSubtotal);
        Assert.Equal(12m, result.PlatformFee);
        Assert.Equal(92m, result.TotalAmount);
        Assert.Equal(80m, result.ProviderAmount);
    }

    [Fact]
    public void CalculatePricingBreakdown_ZeroCommission_NoFee()
    {
        var result = BookingPricingService.CalculatePricingBreakdown(
            commissionRate: 0m,
            category: "nursing",
            categoryServicePrice: 0m,
            selectedItems:
            [
                CreateResolvedItem(120m, 1),
                CreateResolvedItem(30m, 1)
            ],
            dayCount: 2);

        Assert.Equal(150m, result.PerDaySubtotal);
        Assert.Equal(300m, result.BookingSubtotal);
        Assert.Equal(0m, result.PlatformFee);
        Assert.Equal(result.BookingSubtotal, result.TotalAmount);
        Assert.Equal(result.BookingSubtotal, result.ProviderAmount);
    }

    [Fact]
    public void CalculatePricingBreakdown_SingleServiceCategory_UsesCategoryServicePrice()
    {
        var result = BookingPricingService.CalculatePricingBreakdown(
            commissionRate: 10m,
            category: "equipment_rental",
            categoryServicePrice: 250m,
            selectedItems: [CreateResolvedItem(100m, 1, category: "equipment_rental")],
            dayCount: 5);

        Assert.Equal(250m, result.ServicePrice);
        Assert.Equal(0m, result.AddonsPrice);
        Assert.Equal(250m, result.PerDaySubtotal);
        Assert.Equal(250m, result.BookingSubtotal);
        Assert.Equal(25m, result.PlatformFee);
        Assert.Equal(275m, result.TotalAmount);
        Assert.Equal(250m, result.ProviderAmount);
    }

    [Fact]
    public void CalculatePricingBreakdown_RoundsPlatformFeeToTwoCents()
    {
        var result = BookingPricingService.CalculatePricingBreakdown(
            commissionRate: 7.5m,
            category: "nursing",
            categoryServicePrice: 0m,
            selectedItems: [CreateResolvedItem(133m, 1)],
            dayCount: 1);

        Assert.Equal(9.98m, result.PlatformFee);
        Assert.Equal(142.98m, result.TotalAmount);
    }

    private static ResolvedServiceItem CreateResolvedItem(
        decimal price,
        int quantity,
        string category = "nursing",
        int? durationMinutes = 60)
    {
        var service = new Service
        {
            Id = Guid.NewGuid(),
            ProviderId = Guid.NewGuid(),
            Name = "Test",
            Category = category,
            Price = price,
            Currency = "TND",
            DurationMinutes = durationMinutes,
            IsActive = true,
        };

        return new ResolvedServiceItem(service, quantity);
    }
}
