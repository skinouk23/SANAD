using FluentValidation;
using SanadPlatform.API.Features.Providers.Commands;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="CreateMyProviderUnavailabilityCommand"/>.
/// </summary>
public class CreateMyProviderUnavailabilityCommandValidator : AbstractValidator<CreateMyProviderUnavailabilityCommand>
{
    public CreateMyProviderUnavailabilityCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required.");

        RuleFor(x => x.EndDatetime)
            .GreaterThan(x => x.StartDatetime)
            .WithMessage("EndDatetime must be later than StartDatetime.");
    }
}
