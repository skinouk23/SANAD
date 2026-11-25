using FluentValidation;
using SanadPlatform.API.Features.Patients.Commands;

namespace SanadPlatform.API.Features.Patients.Validators;

/// <summary>
/// Validator for AddProviderToFavoritesCommand.
/// </summary>
public class AddProviderToFavoritesValidator : AbstractValidator<AddProviderToFavoritesCommand>
{
    public AddProviderToFavoritesValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");

        RuleFor(x => x.ProviderId)
            .NotEmpty().WithMessage("Provider ID is required");
    }
}
