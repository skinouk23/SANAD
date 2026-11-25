using System.Reflection;
using System.Text.Json;
using Microsoft.Extensions.Logging.Abstractions;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Bookings.Services.Policies;
using SanadPlatform.API.Features.Funeral.Entities;
using SanadPlatform.API.Features.Veterinary.Entities;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Tests.Features.Bookings.Services.Policies;

public class VeterinaryBookingCategoryPolicyTests
{
    private readonly VeterinaryBookingCategoryPolicy _policy = new(NullLogger<VeterinaryBookingCategoryPolicy>.Instance);

    [Fact]
    public void Validate_Throws_WhenTypeConfigIsMissing()
    {
        var exception = Assert.Throws<InvalidOperationException>(() => _policy.Validate(CreateVeterinaryContext()));

        Assert.Equal(
            "Veterinary bookings require a typeConfig payload with animalType and animalName.",
            exception.Message);
    }

    [Fact]
    public void Validate_Throws_WhenRequiredFieldsAreMissing()
    {
        var context = CreateVeterinaryContext(typeConfig: JsonSerializer.SerializeToElement(new { }));

        var exception = Assert.Throws<InvalidOperationException>(() => _policy.Validate(context));

        Assert.Contains("typeConfig.animalType", exception.Message);
        Assert.Contains("typeConfig.animalName", exception.Message);
    }

    [Fact]
    public void Validate_Throws_WhenAnimalTypeNotInServiceMetadata()
    {
        var context = CreateVeterinaryContext(
            typeConfig: JsonSerializer.SerializeToElement(new
            {
                animalType = "hamster",
                animalName = "Nibbles",
            }),
            serviceMetadata: JsonSerializer.Serialize(new
            {
                animalTypes = new[] { "dog", "cat" },
            }));

        var exception = Assert.Throws<InvalidOperationException>(() => _policy.Validate(context));

        Assert.Equal(
            "Veterinary bookings for this service only support animal types: dog, cat. Received: hamster.",
            exception.Message);
    }

    [Fact]
    public void Validate_Succeeds_WhenAnimalTypeIsInServiceMetadata()
    {
        var context = CreateVeterinaryContext(
            typeConfig: JsonSerializer.SerializeToElement(new
            {
                animalType = " Dog ",
                animalName = "Fido",
            }),
            serviceMetadata: JsonSerializer.Serialize(new
            {
                animalTypes = new[] { "dog", "cat" },
            }));

        _policy.Validate(context);
    }

    [Fact]
    public void Validate_Succeeds_WhenServiceMetadataIsNull()
    {
        var context = CreateVeterinaryContext(typeConfig: JsonSerializer.SerializeToElement(new
        {
            animalType = "hamster",
            animalName = "Nibbles",
        }));

        _policy.Validate(context);
    }

    [Fact]
    public void Process_Throws_WhenTypeConfigIsMalformed()
    {
        var context = CreateVeterinaryContext(typeConfig: JsonSerializer.SerializeToElement("not-an-object"));

        var exception = Assert.Throws<InvalidOperationException>(() => _policy.Process(context));

        Assert.Equal("Invalid typeConfig format for veterinary booking.", exception.Message);
        Assert.IsType<JsonException>(exception.InnerException);
    }

    [Fact]
    public void Process_AndApplyToBooking_CreateVeterinaryChildAndPreserveStructuredFields()
    {
        var context = CreateVeterinaryContext(
            typeConfig: JsonSerializer.SerializeToElement(new
            {
                animalType = " Dog ",
                animalName = " Fido ",
                animalBreed = " Labrador ",
                animalAge = " 4 years ",
                animalWeight = " 25kg ",
                isSterilized = true,
                isVaccinated = true,
                isAggressive = false,
                hasMedicalRecord = true,
                notes = " Needs follow-up ",
            }),
            serviceLocation: "home",
            addressLine1: " 12 Rue de Tunis ");

        _policy.Validate(context);
        var result = _policy.Process(context);

        var booking = new Booking { Id = Guid.NewGuid() };
        _policy.ApplyToBooking(result, booking, new BookingApplyContext("Veterinary Consultation", 0m));

        var child = Assert.IsType<VeterinaryBooking>(booking.VeterinaryBooking);
        Assert.Equal(150m, result.ServicePrice);
        Assert.Equal(0, result.StockDelta);
        Assert.Equal("Dog", child.AnimalType);
        Assert.Equal("Fido", child.AnimalName);
        Assert.Equal("Labrador", child.AnimalBreed);
        Assert.Equal("4 years", child.AnimalAge);
        Assert.Equal("25kg", child.AnimalWeight);
        Assert.True(child.IsSterilized);
        Assert.True(child.IsVaccinated);
        Assert.False(child.IsAggressive);
        Assert.True(child.HasMedicalRecord);
        Assert.Equal("Needs follow-up", child.Notes);
        Assert.Equal("12 Rue de Tunis", child.HomeVisitAddress);
    }

    [Fact]
    public void VeterinaryEntity_EncryptsSensitiveFields()
    {
        AssertEncryptedProperties(
            typeof(VeterinaryBooking),
            nameof(VeterinaryBooking.AnimalName),
            nameof(VeterinaryBooking.Notes),
            nameof(VeterinaryBooking.HomeVisitAddress));
    }

    private static BookingCategoryContext CreateVeterinaryContext(
        JsonElement? typeConfig = null,
        string serviceLocation = "clinic",
        string? addressLine1 = null,
        string? serviceMetadata = null)
    {
        return new BookingCategoryContext(
            CategoryCode: ServiceCategories.Veterinary,
            StartDate: new DateOnly(2026, 4, 12),
            TypeConfig: typeConfig,
            AddressLine1: addressLine1,
            ServiceLocation: serviceLocation,
            ServiceMetadata: serviceMetadata,
            BasePrice: 150m,
            AvailableQuantity: null,
            RequiresPrescription: false,
            PatientLocationChoice: null,
            PrescriptionDocumentId: null);
    }

    private static void AssertEncryptedProperties(Type entityType, params string[] propertyNames)
    {
        foreach (var propertyName in propertyNames)
        {
            var property = entityType.GetProperty(propertyName, BindingFlags.Public | BindingFlags.Instance);
            Assert.NotNull(property);
            Assert.NotNull(property!.GetCustomAttribute<EncryptedAttribute>());
        }
    }
}

public class AmbulanceBookingCategoryPolicyTests
{
    private readonly AmbulanceBookingCategoryPolicy _policy = new(NullLogger<AmbulanceBookingCategoryPolicy>.Instance);

    [Fact]
    public void Validate_Throws_WhenServiceTypeNotInServiceMetadata()
    {
        var context = CreateAmbulanceContext(
            typeConfig: JsonSerializer.SerializeToElement(new
            {
                serviceType = "00000000-0000-0000-0000-000000000999",
                pickupAddress = "Clinique Pasteur",
                destinationAddress = "Hôpital Rabta",
            }),
            serviceMetadata: JsonSerializer.Serialize(new
            {
                serviceTypes = new[] { "emergency", "inter_hospital" },
            }));

        var exception = Assert.Throws<InvalidOperationException>(() => _policy.Validate(context));

        Assert.Equal(
            "Ambulance bookings for this service only support service types: emergency, inter_hospital. Received: 00000000-0000-0000-0000-000000000999.",
            exception.Message);
    }

    [Fact]
    public void Validate_Succeeds_WhenServiceTypeIsInServiceMetadata()
    {
        var context = CreateAmbulanceContext(
            typeConfig: JsonSerializer.SerializeToElement(new
            {
                serviceType = " Inter_Hospital ",
                pickupAddress = "Clinique Pasteur",
                destinationAddress = "Hôpital Rabta",
            }),
            serviceMetadata: JsonSerializer.Serialize(new
            {
                serviceTypes = new[] { "emergency", "inter_hospital" },
            }));

        _policy.Validate(context);
    }

    [Fact]
    public void Validate_Succeeds_WhenServiceMetadataIsNull()
    {
        var context = CreateAmbulanceContext(
            typeConfig: JsonSerializer.SerializeToElement(new
            {
                serviceType = "legacy-transport-guid",
                pickupAddress = "Clinique Pasteur",
                destinationAddress = "Hôpital Rabta",
            }));

        _policy.Validate(context);
    }

    private static BookingCategoryContext CreateAmbulanceContext(
        JsonElement? typeConfig = null,
        string? serviceMetadata = null,
        string? addressLine1 = "Clinique Pasteur")
    {
        return new BookingCategoryContext(
            CategoryCode: ServiceCategories.Ambulance,
            StartDate: new DateOnly(2026, 4, 12),
            TypeConfig: typeConfig,
            AddressLine1: addressLine1,
            ServiceLocation: "home",
            ServiceMetadata: serviceMetadata,
            BasePrice: 180m,
            AvailableQuantity: null,
            RequiresPrescription: false,
            PatientLocationChoice: "home",
            PrescriptionDocumentId: null);
    }
}

public class FuneralBookingCategoryPolicyTests
{
    private readonly FuneralBookingCategoryPolicy _policy = new(NullLogger<FuneralBookingCategoryPolicy>.Instance);

    [Fact]
    public void Validate_Throws_WhenTypeConfigIsMissing()
    {
        var exception = Assert.Throws<InvalidOperationException>(() => _policy.Validate(CreateFuneralContext()));

        Assert.Equal(
            "Funeral bookings require a typeConfig payload with deceasedName, contactName, and contactPhone.",
            exception.Message);
    }

    [Fact]
    public void Validate_Throws_WhenRequiredFieldsAreMissing()
    {
        var context = CreateFuneralContext(typeConfig: JsonSerializer.SerializeToElement(new { }));

        var exception = Assert.Throws<InvalidOperationException>(() => _policy.Validate(context));

        Assert.Contains("typeConfig.deceasedName", exception.Message);
        Assert.Contains("typeConfig.contactName", exception.Message);
        Assert.Contains("typeConfig.contactPhone", exception.Message);
    }

    [Fact]
    public void Validate_Throws_WhenContactPhoneIsWhitespaceOnly()
    {
        var context = CreateFuneralContext(typeConfig: JsonSerializer.SerializeToElement(new
        {
            deceasedName = "Jane Doe",
            contactName = "John Doe",
            contactPhone = "   ",
        }));

        var exception = Assert.Throws<InvalidOperationException>(() => _policy.Validate(context));

        Assert.Contains("typeConfig.contactPhone", exception.Message);
    }

    [Fact]
    public void Process_Throws_WhenTypeConfigIsMalformed()
    {
        var context = CreateFuneralContext(typeConfig: JsonSerializer.SerializeToElement("not-an-object"));

        var exception = Assert.Throws<InvalidOperationException>(() => _policy.Process(context));

        Assert.Equal("Invalid typeConfig format for funeral booking.", exception.Message);
        Assert.IsType<JsonException>(exception.InnerException);
    }

    [Fact]
    public void Process_AndApplyToBooking_CreateFuneralChildAndPreserveStructuredFields()
    {
        var context = CreateFuneralContext(typeConfig: JsonSerializer.SerializeToElement(new
        {
            deceasedName = " Jane Doe ",
            deceasedAge = " 79 ",
            deceasedBirthDate = " 1946-03-01 ",
            deceasedDeathDate = " 2026-04-10 ",
            deathPlace = " Tunis ",
            religion = " Muslim ",
            contactName = " John Doe ",
            contactPhone = " +21612345678 ",
            contactEmail = " family@example.com ",
            contactRelationship = " Son ",
            ceremonyType = " Religious ",
            ceremonyLocation = " Main Cemetery ",
            burialType = " Burial ",
            floralService = true,
            transportService = true,
            adminAssistance = true,
            griefSupport = false,
            requiresRepatriation = true,
            repatriationCountry = " France ",
            specialRequests = " White flowers only ",
        }));

        _policy.Validate(context);
        var result = _policy.Process(context);

        var booking = new Booking { Id = Guid.NewGuid() };
        _policy.ApplyToBooking(result, booking, new BookingApplyContext("Funeral Service", 0m));

        var child = Assert.IsType<FuneralBooking>(booking.FuneralBooking);
        Assert.Equal(300m, result.ServicePrice);
        Assert.Equal(0, result.StockDelta);
        Assert.Equal("Jane Doe", child.DeceasedName);
        Assert.Equal("79", child.DeceasedAge);
        Assert.Equal("1946-03-01", child.DeceasedBirthDate);
        Assert.Equal("2026-04-10", child.DeceasedDeathDate);
        Assert.Equal("Tunis", child.DeathPlace);
        Assert.Equal("Muslim", child.Religion);
        Assert.Equal("John Doe", child.ContactName);
        Assert.Equal("+21612345678", child.ContactPhone);
        Assert.Equal("family@example.com", child.ContactEmail);
        Assert.Equal("Son", child.ContactRelationship);
        Assert.Equal("Religious", child.CeremonyType);
        Assert.Equal("Main Cemetery", child.CeremonyLocation);
        Assert.Equal("Burial", child.BurialType);
        Assert.True(child.FloralService);
        Assert.True(child.TransportService);
        Assert.True(child.AdminAssistance);
        Assert.False(child.GriefSupport);
        Assert.True(child.RequiresRepatriation);
        Assert.Equal("France", child.RepatriationCountry);
        Assert.Equal("White flowers only", child.SpecialRequests);
    }

    [Fact]
    public void Process_AndApplyToBooking_DefaultFuneralAdditionalServicesToFalse()
    {
        var context = CreateFuneralContext(typeConfig: JsonSerializer.SerializeToElement(new
        {
            deceasedName = "Jane Doe",
            contactName = "John Doe",
            contactPhone = "+21612345678",
        }));

        _policy.Validate(context);
        var result = _policy.Process(context);

        var booking = new Booking { Id = Guid.NewGuid() };
        _policy.ApplyToBooking(result, booking, new BookingApplyContext("Funeral Service", 0m));

        var child = Assert.IsType<FuneralBooking>(booking.FuneralBooking);
        Assert.False(child.FloralService);
        Assert.False(child.TransportService);
        Assert.False(child.AdminAssistance);
        Assert.False(child.GriefSupport);
    }

    [Fact]
    public void FuneralEntity_EncryptsSensitiveFields()
    {
        AssertEncryptedProperties(
            typeof(FuneralBooking),
            nameof(FuneralBooking.DeceasedName),
            nameof(FuneralBooking.DeathPlace),
            nameof(FuneralBooking.ContactName),
            nameof(FuneralBooking.ContactPhone),
            nameof(FuneralBooking.ContactEmail),
            nameof(FuneralBooking.CeremonyLocation),
            nameof(FuneralBooking.SpecialRequests));
    }

    private static BookingCategoryContext CreateFuneralContext(JsonElement? typeConfig = null)
    {
        return new BookingCategoryContext(
            CategoryCode: ServiceCategories.Funeral,
            StartDate: new DateOnly(2026, 4, 12),
            TypeConfig: typeConfig,
            AddressLine1: null,
            ServiceLocation: "clinic",
            ServiceMetadata: null,
            BasePrice: 300m,
            AvailableQuantity: null,
            RequiresPrescription: false,
            PatientLocationChoice: null,
            PrescriptionDocumentId: null);
    }

    private static void AssertEncryptedProperties(Type entityType, params string[] propertyNames)
    {
        foreach (var propertyName in propertyNames)
        {
            var property = entityType.GetProperty(propertyName, BindingFlags.Public | BindingFlags.Instance);
            Assert.NotNull(property);
            Assert.NotNull(property!.GetCustomAttribute<EncryptedAttribute>());
        }
    }
}
