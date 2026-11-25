using SanadPlatform.API.Features.Bookings.Commands;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Bookings.Validators;

namespace SanadPlatform.API.Tests.Features.Bookings.Validators;

public class CreateBookingCommandValidatorTests
{
    private readonly CreateBookingCommandValidator _validator = new();

    [Fact]
    public void Validate_DoesNotUseTimezoneBlindSameDayStartTimeRule()
    {
        var result = _validator.Validate(CreateValidCommand(
            startDate: DateOnly.FromDateTime(DateTime.UtcNow),
            endDate: DateOnly.FromDateTime(DateTime.UtcNow),
            dailyStartTime: new TimeOnly(0, 1)));

        Assert.DoesNotContain(
            result.Errors,
            error => error.ErrorMessage == "Daily start time must be in the future for same-day bookings.");
    }

    [Theory]
    [InlineData("home")]
    [InlineData("provider_site")]
    [InlineData("HOME")]
    public void SupportedPatientLocationChoice_Passes(string patientLocationChoice)
    {
        var result = _validator.Validate(CreateValidCommand(patientLocationChoice: patientLocationChoice));

        Assert.DoesNotContain(result.Errors, error => error.PropertyName == "PatientLocationChoice");
    }

    [Fact]
    public void InvalidPatientLocationChoice_Fails()
    {
        var result = _validator.Validate(CreateValidCommand(patientLocationChoice: "clinic"));

        Assert.Contains(result.Errors, error => error.PropertyName == "PatientLocationChoice");
        Assert.Contains(result.Errors, error => error.ErrorMessage == "PatientLocationChoice must be 'home' or 'provider_site'.");
    }

    private static CreateBookingCommand CreateValidCommand(
        Guid? callerUserId = null,
        Guid? providerId = null,
        IReadOnlyList<ServiceItemSelection>? serviceItems = null,
        DateOnly? startDate = null,
        DateOnly? endDate = null,
        TimeOnly? dailyStartTime = null,
        string? patientLocationChoice = null,
        Guid? prescriptionDocumentId = null)
    {
        var effectiveStartDate = startDate ?? DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1);

        return new CreateBookingCommand(
            CallerUserId: callerUserId ?? Guid.NewGuid(),
            ProviderId: providerId ?? Guid.NewGuid(),
            ServiceItems: serviceItems ?? [new ServiceItemSelection(Guid.NewGuid(), 1)],
            StartDate: effectiveStartDate,
            EndDate: endDate ?? effectiveStartDate,
            DailyStartTime: dailyStartTime ?? new TimeOnly(9, 0),
            AddressLine1: null,
            AddressLine2: null,
            City: null,
            PostalCode: null,
            Latitude: null,
            Longitude: null,
            AddressInstructions: null,
            PatientNotes: null,
            TypeConfig: null,
            ExpectedTotalAmount: null,
            PatientLocationChoice: patientLocationChoice,
            PrescriptionDocumentId: prescriptionDocumentId);
    }
}
