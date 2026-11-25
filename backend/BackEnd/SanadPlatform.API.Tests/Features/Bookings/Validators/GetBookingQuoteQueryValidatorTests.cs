using System.Text.Json;
using SanadPlatform.API.Features.Bookings.Queries;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Bookings.Validators;
using SanadPlatform.API.Infrastructure.Logging;

namespace SanadPlatform.API.Tests.Features.Bookings.Validators;

public class GetBookingQuoteQueryValidatorTests
{
    private readonly GetBookingQuoteQueryValidator _validator = new();

    [Fact]
    public void GetBookingQuoteQuery_ImplementsSensitiveRequest()
    {
        var query = CreateValidQuery();

        Assert.IsAssignableFrom<ISensitiveRequest>(query);
    }

    [Fact]
    public void ValidQuery_PassesValidation()
    {
        var result = _validator.Validate(CreateValidQuery());

        Assert.True(result.IsValid);
    }

    [Fact]
    public void EmptyProviderId_Fails()
    {
        var result = _validator.Validate(CreateValidQuery(providerId: Guid.Empty));

        Assert.Contains(result.Errors, error => error.PropertyName == "ProviderId");
        Assert.Contains(result.Errors, error => error.ErrorMessage == "ProviderId is required.");
    }

    [Fact]
    public void PastStartDate_Fails()
    {
        var pastDate = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(-1);
        var result = _validator.Validate(CreateValidQuery(startDate: pastDate, endDate: pastDate));

        Assert.Contains(result.Errors, error => error.PropertyName == "StartDate");
        Assert.Contains(result.Errors, error => error.ErrorMessage == "Start date cannot be in the past.");
    }

    [Fact]
    public void EndDateBeforeStartDate_Fails()
    {
        var startDate = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(2);
        var result = _validator.Validate(CreateValidQuery(startDate: startDate, endDate: startDate.AddDays(-1)));

        Assert.Contains(result.Errors, error => error.PropertyName == "EndDate");
        Assert.Contains(result.Errors, error => error.ErrorMessage == "End date must be on or after the start date.");
    }

    [Fact]
    public void EmptyServiceItems_Fails()
    {
        var result = _validator.Validate(CreateValidQuery(serviceItems: []));

        Assert.Contains(result.Errors, error => error.PropertyName == "ServiceItems");
        Assert.Contains(result.Errors, error => error.ErrorMessage == "At least one service item is required.");
    }

    [Fact]
    public void DuplicateServiceIds_Fails()
    {
        var serviceId = Guid.NewGuid();
        var result = _validator.Validate(CreateValidQuery(
            serviceItems:
            [
                new ServiceItemSelection(serviceId, 1),
                new ServiceItemSelection(serviceId, 2)
            ]));

        Assert.Contains(result.Errors, error => error.PropertyName == "ServiceItems");
        Assert.Contains(result.Errors, error => error.ErrorMessage == "Duplicate service IDs are not allowed in the same booking.");
    }

    [Theory]
    [InlineData(0)]
    [InlineData(11)]
    public void QuantityOutOfRange_Fails(int quantity)
    {
        var result = _validator.Validate(CreateValidQuery(serviceItems: [new ServiceItemSelection(Guid.NewGuid(), quantity)]));

        Assert.Contains(result.Errors, error => error.PropertyName.EndsWith("Quantity", StringComparison.Ordinal));
        Assert.Contains(result.Errors, error => error.ErrorMessage == "Service item quantity must be between 1 and 10.");
    }

    [Fact]
    public void DefaultDailyStartTime_Fails()
    {
        var result = _validator.Validate(CreateValidQuery(dailyStartTime: TimeOnly.MinValue));

        Assert.Contains(result.Errors, error => error.PropertyName == "DailyStartTime");
        Assert.Contains(result.Errors, error => error.ErrorMessage == "DailyStartTime is required.");
    }

    [Fact]
    public void TypeConfigExceeding64Kb_Fails()
    {
        var oversizedTypeConfig = ParseJsonElement($"{{\"blob\":\"{new string('a', 70_000)}\"}}");
        var result = _validator.Validate(CreateValidQuery(typeConfig: oversizedTypeConfig));

        Assert.Contains(result.Errors, error => error.PropertyName == "TypeConfig");
        Assert.Contains(result.Errors, error => error.ErrorMessage == "TypeConfig payload must not exceed 64 KB.");
    }

    [Theory]
    [InlineData("home")]
    [InlineData("provider_site")]
    [InlineData("PROVIDER_SITE")]
    public void SupportedPatientLocationChoice_Passes(string patientLocationChoice)
    {
        var result = _validator.Validate(CreateValidQuery(patientLocationChoice: patientLocationChoice));

        Assert.DoesNotContain(result.Errors, error => error.PropertyName == "PatientLocationChoice");
    }

    [Fact]
    public void InvalidPatientLocationChoice_Fails()
    {
        var result = _validator.Validate(CreateValidQuery(patientLocationChoice: "clinic"));

        Assert.Contains(result.Errors, error => error.PropertyName == "PatientLocationChoice");
        Assert.Contains(result.Errors, error => error.ErrorMessage == "PatientLocationChoice must be 'home' or 'provider_site'.");
    }

    private static GetBookingQuoteQuery CreateValidQuery(
        Guid? callerUserId = null,
        Guid? providerId = null,
        IReadOnlyList<ServiceItemSelection>? serviceItems = null,
        DateOnly? startDate = null,
        DateOnly? endDate = null,
        TimeOnly? dailyStartTime = null,
        JsonElement? typeConfig = null,
        string? patientLocationChoice = null,
        Guid? prescriptionDocumentId = null)
    {
        var effectiveStartDate = startDate ?? DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1);

        return new GetBookingQuoteQuery(
            CallerUserId: callerUserId ?? Guid.NewGuid(),
            ProviderId: providerId ?? Guid.NewGuid(),
            ServiceItems: serviceItems ?? [new ServiceItemSelection(Guid.NewGuid(), 1)],
            StartDate: effectiveStartDate,
            EndDate: endDate ?? effectiveStartDate.AddDays(1),
            DailyStartTime: dailyStartTime ?? new TimeOnly(9, 0),
            AddressLine1: null,
            TypeConfig: typeConfig,
            PatientLocationChoice: patientLocationChoice,
            PrescriptionDocumentId: prescriptionDocumentId);
    }

    private static JsonElement ParseJsonElement(string json)
    {
        return JsonDocument.Parse(json).RootElement.Clone();
    }
}
