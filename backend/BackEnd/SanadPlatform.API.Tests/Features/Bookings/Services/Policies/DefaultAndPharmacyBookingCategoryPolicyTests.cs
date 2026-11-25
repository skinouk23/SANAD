using System.Text.Json;
using Microsoft.Extensions.Logging.Abstractions;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Features.Bookings.Services.Policies;

namespace SanadPlatform.API.Tests.Features.Bookings.Services.Policies;

public class DefaultBookingCategoryPolicyTests
{
    private readonly DefaultBookingCategoryPolicy _policy = new();

    [Fact]
    public void Validate_Throws_WhenPatientLocationChoiceMissing_ForBothService()
    {
        var exception = Assert.Throws<InvalidOperationException>(() =>
            _policy.Validate(CreateDefaultContext(serviceLocation: "both")));

        Assert.Equal(
            "A patient location choice (patientLocationChoice) is required when serviceLocation is 'both'.",
            exception.Message);
    }

    [Fact]
    public void Validate_Throws_WhenPatientLocationChoiceInvalid_ForBothService()
    {
        var exception = Assert.Throws<InvalidOperationException>(() =>
            _policy.Validate(CreateDefaultContext(serviceLocation: "both", patientLocationChoice: "clinic")));

        Assert.Equal(
            "PatientLocationChoice must be 'home' or 'provider_site' when serviceLocation is 'both'.",
            exception.Message);
    }

    [Fact]
    public void Validate_Throws_WhenAddressMissing_ForHomeChoice_OnBothService()
    {
        var exception = Assert.Throws<InvalidOperationException>(() =>
            _policy.Validate(CreateDefaultContext(serviceLocation: "both", patientLocationChoice: "home")));

        Assert.Equal(
            "A delivery address (address.line1) is required when patientLocationChoice is 'home'.",
            exception.Message);
    }

    [Fact]
    public void Validate_Throws_WhenPrescriptionDocumentMissing_WhenRequired()
    {
        var exception = Assert.Throws<InvalidOperationException>(() =>
            _policy.Validate(CreateDefaultContext(requiresPrescription: true)));

        Assert.Equal(
            "A prescription document (prescriptionDocumentId) is required for services that require a prescription.",
            exception.Message);
    }

    [Fact]
    public void Validate_AllowsNullLocationChoice_WhenServiceIsNotBoth()
    {
        var exception = Record.Exception(() =>
            _policy.Validate(CreateDefaultContext(serviceLocation: "provider_site")));

        Assert.Null(exception);
    }

    [Fact]
    public void Validate_AllowsNullPrescriptionDocument_WhenNotRequired()
    {
        var exception = Record.Exception(() =>
            _policy.Validate(CreateDefaultContext(serviceLocation: "provider_site", requiresPrescription: false)));

        Assert.Null(exception);
    }

    [Fact]
    public void Process_ReturnsHomeOverride_ForBothService()
    {
        var context = CreateDefaultContext(
            serviceLocation: "both",
            patientLocationChoice: "home",
            addressLine1: "12 Rue de Tunis");

        _policy.Validate(context);
        var result = _policy.Process(context);

        Assert.Equal("home", result.ServiceLocationOverride);
        Assert.Equal(120m, result.ServicePrice);
        Assert.Equal(0, result.StockDelta);
    }

    [Fact]
    public void Process_ReturnsProviderSiteOverride_ForBothService()
    {
        var context = CreateDefaultContext(
            serviceLocation: "both",
            patientLocationChoice: "provider_site");

        _policy.Validate(context);
        var result = _policy.Process(context);

        Assert.Equal("provider_site", result.ServiceLocationOverride);
        Assert.Equal(120m, result.ServicePrice);
    }

    private static BookingCategoryContext CreateDefaultContext(
        string serviceLocation = "provider_site",
        string? addressLine1 = null,
        bool requiresPrescription = false,
        string? patientLocationChoice = null,
        Guid? prescriptionDocumentId = null)
    {
        return new BookingCategoryContext(
            CategoryCode: "nursing",
            StartDate: new DateOnly(2026, 4, 12),
            TypeConfig: null,
            AddressLine1: addressLine1,
            ServiceLocation: serviceLocation,
            ServiceMetadata: null,
            BasePrice: 120m,
            AvailableQuantity: null,
            RequiresPrescription: requiresPrescription,
            PatientLocationChoice: patientLocationChoice,
            PrescriptionDocumentId: prescriptionDocumentId);
    }
}

public class PharmacyBookingCategoryPolicyValidationTests
{
    private readonly PharmacyBookingCategoryPolicy _policy = new();

    [Fact]
    public void Validate_AcceptsPrescriptionDocumentId_WhenPrescriptionUrlMissing()
    {
        var exception = Record.Exception(() =>
            _policy.Validate(CreatePharmacyContext(
                requiresPrescription: true,
                prescriptionDocumentId: Guid.NewGuid())));

        Assert.Null(exception);
    }

    [Fact]
    public void Validate_AcceptsPrescriptionUrl_WhenPrescriptionDocumentIdMissing()
    {
        var exception = Record.Exception(() =>
            _policy.Validate(CreatePharmacyContext(
                requiresPrescription: true,
                prescriptionUrl: "documents/prescriptions/prescription.pdf")));

        Assert.Null(exception);
    }

    [Fact]
    public void Validate_Throws_WhenPatientLocationChoiceMissing_ForBothService()
    {
        var exception = Assert.Throws<InvalidOperationException>(() =>
            _policy.Validate(CreatePharmacyContext(serviceLocation: "both")));

        Assert.Equal(
            "A patient location choice (patientLocationChoice) is required when serviceLocation is 'both'.",
            exception.Message);
    }

    [Fact]
    public void Validate_Throws_WhenAddressMissing_ForHomeChoice_OnBothService()
    {
        var exception = Assert.Throws<InvalidOperationException>(() =>
            _policy.Validate(CreatePharmacyContext(
                serviceLocation: "both",
                patientLocationChoice: "home")));

        Assert.Equal("A delivery address (address.line1) is required for pharmacy orders.", exception.Message);
    }

    [Fact]
    public void Process_ReturnsProviderSiteOverride_ForBothService()
    {
        var context = CreatePharmacyContext(
            serviceLocation: "both",
            patientLocationChoice: "provider_site");

        _policy.Validate(context);
        var result = _policy.Process(context);

        Assert.Equal("provider_site", result.ServiceLocationOverride);
        Assert.Equal(45m, result.ServicePrice);
        Assert.Equal(0, result.StockDelta);
    }

    private static BookingCategoryContext CreatePharmacyContext(
        string serviceLocation = "provider_site",
        string? addressLine1 = null,
        bool requiresPrescription = false,
        string? patientLocationChoice = null,
        Guid? prescriptionDocumentId = null,
        string? prescriptionUrl = null)
    {
        var typeConfig = JsonSerializer.SerializeToElement(new
        {
            items = "Paracetamol",
            prescriptionUrl,
            notes = "Evening dose"
        });

        return new BookingCategoryContext(
            CategoryCode: ServiceCategories.Pharmacy,
            StartDate: new DateOnly(2026, 4, 12),
            TypeConfig: typeConfig,
            AddressLine1: addressLine1,
            ServiceLocation: serviceLocation,
            ServiceMetadata: null,
            BasePrice: 45m,
            AvailableQuantity: null,
            RequiresPrescription: requiresPrescription,
            PatientLocationChoice: patientLocationChoice,
            PrescriptionDocumentId: prescriptionDocumentId);
    }
}
