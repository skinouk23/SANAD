using FluentValidation;
using SanadPlatform.API.Features.Providers.Queries;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="GetMyProviderUnavailabilitiesQuery"/>.
/// </summary>
public class GetMyProviderUnavailabilitiesQueryValidator : AbstractValidator<GetMyProviderUnavailabilitiesQuery>
{
    public GetMyProviderUnavailabilitiesQueryValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required.");

        RuleFor(x => x.To)
            .GreaterThanOrEqualTo(x => x.From)
            .WithMessage("To date must be on or after the from date.");
    }
}
