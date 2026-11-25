using FluentValidation.TestHelper;
using SanadPlatform.API.Features.Services.Commands;
using SanadPlatform.API.Features.Services.Validators;

namespace SanadPlatform.API.Tests.Features.Services.Presets;

public class ReorderProviderServicePresetsCommandValidatorTests
{
    private readonly ReorderProviderServicePresetsCommandValidator _validator = new();

    [Fact]
    public void Validate_AcceptsValidCommand()
    {
        var result = _validator.TestValidate(new ReorderProviderServicePresetsCommand(
            "nutrition",
            [Guid.NewGuid(), Guid.NewGuid()]));

        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_RejectsEmptyCategory_AndEmptyOrderedIds()
    {
        var result = _validator.TestValidate(new ReorderProviderServicePresetsCommand(
            string.Empty,
            []));

        result.ShouldHaveValidationErrorFor(command => command.ProviderCategory);
        result.ShouldHaveValidationErrorFor(command => command.OrderedIds);
    }
}
