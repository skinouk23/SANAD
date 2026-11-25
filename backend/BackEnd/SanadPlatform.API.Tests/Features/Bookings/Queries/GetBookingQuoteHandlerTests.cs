using System.Text.Json;
using Microsoft.Extensions.Logging.Abstractions;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Bookings.Queries;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Bookings.Services.Policies;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Features.Services.Services;

namespace SanadPlatform.API.Tests.Features.Bookings.Queries;

public class GetBookingQuoteHandlerTests
{
    [Fact]
    public async Task Handle_UsesUntrackedPricingAndMapsEquipmentRentalDraft()
    {
        var providerId = Guid.NewGuid();
        var serviceId = Guid.NewGuid();
        var prescriptionDocumentId = Guid.NewGuid();
        var startDate = new DateOnly(2026, 4, 12);
        var requestedEndDate = new DateOnly(2026, 4, 13);
        var effectiveEndDate = startDate;
        var rentalEndDate = new DateOnly(2026, 4, 19);
        var typeConfig = ParseJsonElement("{\"endDate\":\"2026-04-19\",\"rentalDurationType\":\"weekly\"}");

        var pricingService = new RecordingBookingPricingService(
            CreatePricingResult(
                providerId,
                serviceId,
                effectiveEndDate,
                new EquipmentRentalDraft(
                    RentalStartDate: startDate,
                    RentalEndDate: rentalEndDate,
                    RentalDurationType: "weekly",
                    PeriodRate: 125m,
                    PeriodCount: 2,
                    DepositAmount: 50m)));

        var handler = new GetBookingQuoteHandler(
            pricingService,
            NullLogger<GetBookingQuoteHandler>.Instance);

        var query = new GetBookingQuoteQuery(
            CallerUserId: Guid.NewGuid(),
            ProviderId: providerId,
            ServiceItems: [new ServiceItemSelection(serviceId, 1)],
            StartDate: startDate,
            EndDate: requestedEndDate,
            DailyStartTime: new TimeOnly(9, 0),
            AddressLine1: "12 Main Street",
            TypeConfig: typeConfig,
            PatientLocationChoice: "home",
            PrescriptionDocumentId: prescriptionDocumentId);

        var response = await handler.Handle(query, CancellationToken.None);

        Assert.Equal(1, pricingService.CallCount);
        Assert.False(pricingService.LastTracked);
        Assert.NotNull(pricingService.LastInput);
        Assert.Equal(providerId, pricingService.LastInput!.ProviderId);
        Assert.Equal(requestedEndDate, pricingService.LastInput.EndDate);
        Assert.Equal("12 Main Street", pricingService.LastInput.AddressLine1);
        Assert.Equal(typeConfig.GetRawText(), pricingService.LastInput.TypeConfig!.Value.GetRawText());
        Assert.Equal(serviceId, pricingService.LastInput.ServiceItems[0].ServiceId);
        Assert.Equal("home", pricingService.LastInput.PatientLocationChoice);
        Assert.Equal(prescriptionDocumentId, pricingService.LastInput.PrescriptionDocumentId);

        Assert.Equal("equipment_rental", response.BookingType);
        Assert.Equal(startDate, response.StartDate);
        Assert.Equal(effectiveEndDate, response.EndDate);
        Assert.Equal(1, response.DayCount);
        Assert.Equal(45, response.DailyDurationMinutes);
        Assert.Equal(250m, response.Pricing.PerDaySubtotal);
        Assert.Equal(250m, response.Pricing.BookingSubtotal);
        Assert.Equal(25m, response.Pricing.PlatformFee);
        Assert.Equal(275m, response.Pricing.TotalAmount);
        Assert.Equal("TND", response.Pricing.Currency);
        Assert.NotNull(response.EquipmentRental);
        Assert.Equal(rentalEndDate, response.EquipmentRental!.EndDate);
        Assert.Equal("weekly", response.EquipmentRental.RentalDurationType);
        Assert.Equal(125m, response.EquipmentRental.PeriodRate);
        Assert.Equal(2, response.EquipmentRental.PeriodCount);
        Assert.Equal(50m, response.EquipmentRental.DepositAmount);
        Assert.Equal(PaymentStatuses.Pending, response.EquipmentRental.DepositStatus);
    }

    [Fact]
    public async Task Handle_WhenCategoryDataIsNotEquipmentRentalDraft_LeavesEquipmentRentalNull()
    {
        var providerId = Guid.NewGuid();
        var serviceId = Guid.NewGuid();
        var effectiveEndDate = new DateOnly(2026, 4, 14);
        var pricingService = new RecordingBookingPricingService(
            CreatePricingResult(providerId, serviceId, effectiveEndDate, categoryData: new object()));

        var handler = new GetBookingQuoteHandler(
            pricingService,
            NullLogger<GetBookingQuoteHandler>.Instance);

        var query = new GetBookingQuoteQuery(
            CallerUserId: Guid.NewGuid(),
            ProviderId: providerId,
            ServiceItems: [new ServiceItemSelection(serviceId, 1)],
            StartDate: new DateOnly(2026, 4, 12),
            EndDate: effectiveEndDate,
            DailyStartTime: new TimeOnly(9, 0),
            AddressLine1: null,
            TypeConfig: null,
            PatientLocationChoice: null,
            PrescriptionDocumentId: null);

        var response = await handler.Handle(query, CancellationToken.None);

        Assert.Equal(1, pricingService.CallCount);
        Assert.False(pricingService.LastTracked);
        Assert.Null(pricingService.LastInput!.PatientLocationChoice);
        Assert.Null(pricingService.LastInput.PrescriptionDocumentId);
        Assert.Null(response.EquipmentRental);
    }

    private static BookingPricingResult CreatePricingResult(
        Guid providerId,
        Guid serviceId,
        DateOnly effectiveEndDate,
        object? categoryData)
    {
        var primaryService = new Service
        {
            Id = serviceId,
            ProviderId = providerId,
            Category = "equipment_rental",
            Name = "Wheelchair",
            Currency = "TND",
            Price = 250m,
            DurationMinutes = 45,
            IsActive = true,
        };

        return new BookingPricingResult(
            Provider: new Provider
            {
                Id = providerId,
                Timezone = "Africa/Tunis"
            },
            SelectedItems: [new ResolvedServiceItem(primaryService, 1)],
            PrimaryService: primaryService,
            EffectiveEndDate: effectiveEndDate,
            Timing: new BookingTimingInfo(
                DayCount: 1,
                DailyDurationMinutes: 45,
                DailyEndTime: new TimeOnly(9, 45)),
            Pricing: new BookingPricingInfo(
                ServicePrice: 250m,
                AddonsPrice: 0m,
                PerDaySubtotal: 250m,
                BookingSubtotal: 250m,
                PlatformFee: 25m,
                TotalAmount: 275m,
                ProviderAmount: 250m),
            ResolvedPolicy: new NoOpBookingCategoryPolicy(),
            CategoryResult: new BookingCategoryResult(
                ServicePrice: 250m,
                ServiceLocationOverride: "home",
                StockDelta: 0,
                CategoryData: categoryData));
    }

    private static JsonElement ParseJsonElement(string json)
    {
        return JsonDocument.Parse(json).RootElement.Clone();
    }

    private sealed class RecordingBookingPricingService : IBookingPricingService
    {
        private readonly BookingPricingResult _result;

        public RecordingBookingPricingService(BookingPricingResult result)
        {
            _result = result;
        }

        public int CallCount { get; private set; }

        public BookingPricingInput? LastInput { get; private set; }

        public bool LastTracked { get; private set; }

        public Task<BookingPricingResult> CalculateAsync(
            BookingPricingInput input,
            bool tracked,
            CancellationToken cancellationToken = default)
        {
            CallCount++;
            LastInput = input;
            LastTracked = tracked;
            return Task.FromResult(_result);
        }
    }

    private sealed class NoOpBookingCategoryPolicy : IBookingCategoryPolicy
    {
        public string CategoryCode => "equipment_rental";

        public void Validate(BookingCategoryContext context)
        {
        }

        public BookingCategoryResult Process(BookingCategoryContext context)
        {
            throw new NotSupportedException();
        }

        public void ApplyToBooking(BookingCategoryResult result, Booking booking, BookingApplyContext applyContext)
        {
        }

        public void ApplyToResponse(BookingCategoryResult result, CreateBookingResponse response, BookingApplyContext applyContext)
        {
        }

        public BookingCancellationResult ProcessCancellation(BookingCancellationContext context)
        {
            throw new NotSupportedException();
        }
    }
}
