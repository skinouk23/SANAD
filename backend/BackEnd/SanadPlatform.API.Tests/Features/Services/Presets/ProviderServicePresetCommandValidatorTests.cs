using SanadPlatform.API.Features.Services.Commands;
using SanadPlatform.API.Features.Services.Validators;

namespace SanadPlatform.API.Tests.Features.Services.Presets;

public class ProviderServicePresetCommandValidatorTests
{
    private readonly CreateProviderServicePresetCommandValidator _createValidator = new();
    private readonly UpdateProviderServicePresetCommandValidator _updateValidator = new();

    [Fact]
    public void CreateValidator_AcceptsValidCommand()
    {
        var result = _createValidator.Validate(CreateValidCreateCommand());

        Assert.True(result.IsValid);
    }

    [Fact]
    public void CreateValidator_RejectsInvalidCode_AndPrimitiveTypeConfig()
    {
        var result = _createValidator.Validate(CreateValidCreateCommand(
            code: "Invalid-Code",
            typeConfig: ProviderPresetCommandTestSupport.ParseJson("\"not-an-object\"")));

        Assert.Contains(result.Errors, error => error.PropertyName == "Code");
        Assert.Contains(result.Errors, error => error.PropertyName == "TypeConfig");
    }

    [Fact]
    public void UpdateValidator_RejectsEmptyId_AndUnsupportedServiceLocation()
    {
        var result = _updateValidator.Validate(CreateValidUpdateCommand(
            id: Guid.Empty,
            serviceLocation: "provider_site"));

        Assert.Contains(result.Errors, error => error.PropertyName == "Id");
        Assert.Contains(result.Errors, error => error.PropertyName == "ServiceLocation");
    }

    [Fact]
    public void UpdateValidator_AcceptsValidCommand()
    {
        var result = _updateValidator.Validate(CreateValidUpdateCommand());

        Assert.True(result.IsValid);
    }

    private static CreateProviderServicePresetCommand CreateValidCreateCommand(
        string providerCategory = "nutrition",
        string code = "assessment",
        System.Text.Json.JsonElement? typeConfig = null)
    {
        return new CreateProviderServicePresetCommand(
            ProviderCategory: providerCategory,
            Code: code,
            NameEn: "Assessment",
            NameFr: "Bilan",
            NameAr: "تقييم",
            NameDe: null,
            DescriptionEn: "English description",
            DescriptionFr: "Description francaise",
            DescriptionAr: null,
            DescriptionDe: null,
            Price: 50m,
            PriceType: "fixed",
            Currency: "TND",
            DurationMinutes: 30,
            ServiceLocation: "home",
            RequiresPrescription: false,
            IsUrgent: false,
            RequiresMedicalHistory: false,
            TypeConfig: typeConfig ?? ProviderPresetCommandTestSupport.ParseJson("""
            {
              "subcategoryCode": "consultation"
            }
            """),
            IsActive: true,
            DisplayOrder: 1);
    }

    private static UpdateProviderServicePresetCommand CreateValidUpdateCommand(
        Guid? id = null,
        string serviceLocation = "home")
    {
        return new UpdateProviderServicePresetCommand(
            Id: id ?? Guid.NewGuid(),
            NameEn: "Assessment",
            NameFr: "Bilan",
            NameAr: "تقييم",
            NameDe: null,
            DescriptionEn: "English description",
            DescriptionFr: "Description francaise",
            DescriptionAr: null,
            DescriptionDe: null,
            Price: 50m,
            PriceType: "fixed",
            Currency: "TND",
            DurationMinutes: 30,
            ServiceLocation: serviceLocation,
            RequiresPrescription: false,
            IsUrgent: false,
            RequiresMedicalHistory: false,
            TypeConfig: ProviderPresetCommandTestSupport.ParseJson("""
            {
              "subcategoryCode": "consultation"
            }
            """),
            IsActive: true,
            DisplayOrder: 1);
    }
}
