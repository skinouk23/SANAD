using FluentValidation;
using SanadPlatform.API.Features.Patients.Commands;

namespace SanadPlatform.API.Features.Patients.Validators;

/// <summary>
/// Validator for DeleteProviderFromFavoritesCommand.
/// </summary>
public class DeleteProviderFromFavoritesValidator : AbstractValidator<DeleteProviderFromFavoritesCommand>
{
    public DeleteProviderFromFavoritesValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");

        RuleFor(x => x.ProviderId)
            .NotEmpty().WithMessage("Provider ID is required");
    }
}
