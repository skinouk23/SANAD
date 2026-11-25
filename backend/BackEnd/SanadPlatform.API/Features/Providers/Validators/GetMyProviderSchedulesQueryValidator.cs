using FluentValidation;
using SanadPlatform.API.Features.Providers.Queries;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="GetMyProviderSchedulesQuery"/>.
/// </summary>
public class GetMyProviderSchedulesQueryValidator : AbstractValidator<GetMyProviderSchedulesQuery>
{
    public GetMyProviderSchedulesQueryValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required.");
    }
}
